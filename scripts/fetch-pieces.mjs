#!/usr/bin/env node
// One-shot catalog fetch for the /pieces and /mcp templates.
// Sources (all public):
//   1. https://www.activepieces.com/pieces/_payload.json  -> 768 pieces in "Popular" order, 17 categories, facts
//   2. https://cloud.activepieces.com/api/v1/pieces        -> CDN logoUrl per piece (site serves the same bytes at /piece-icon/:slug)
//   3. https://www.activepieces.com/pieces/:slug (SSR HTML, inline __NUXT_DATA__) -> actions/triggers/related/recipes/guides
//   4. https://www.activepieces.com/sitemap.xml            -> advertised /pieces/:a/:b pairs and category keys
// Outputs:
//   src/data/pieces.json               index (eager import)
//   src/data/pairs.json                { "<a>": ["<b>", ...] } advertised pairs (3,000)
//   public/data/pieces/<slug>.json     per-piece detail (lazy fetch)
//   public/logos/pieces-cdn/<slug>.<ext>  logos (pass --no-logos to skip)
// Usage: node scripts/fetch-pieces.mjs [--no-logos] [--no-detail]
// Behind a TLS-inspecting proxy (e.g. Netskope), run with NODE_EXTRA_CA_CERTS=<proxy root CA .pem>
import { mkdir, writeFile, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://www.activepieces.com'
const API = 'https://cloud.activepieces.com/api/v1/pieces'
const args = new Set(process.argv.slice(2))
const UA = { 'user-agent': 'Mozilla/5.0 (activepieces-clone fetch)' }

// Nuxt devalue "unflatten" (arrays of refs; tuples like ["ShallowReactive", i], ["Set", ...], ["Date", s])
function unflatten(arr) {
  const memo = new Map()
  const h = (i) => {
    if (typeof i !== 'number' || i < 0) return undefined
    if (memo.has(i)) return memo.get(i)
    const v = arr[i]
    if (Array.isArray(v)) {
      if (typeof v[0] === 'string' && /^(ShallowReactive|Reactive|Ref|ShallowRef|EmptyRef|EmptyShallowRef|Set|Map|Date|NuxtError|Island)$/.test(v[0])) {
        let r = null
        if (v[0] === 'Date') r = v[1]
        else if (v[0] === 'Set') r = v.slice(1).map(h)
        else if (v.length > 1) r = h(v[1])
        memo.set(i, r); return r
      }
      const out = []; memo.set(i, out); for (const x of v) out.push(h(x)); return out
    }
    if (v && typeof v === 'object') {
      const out = {}; memo.set(i, out); for (const [k, x] of Object.entries(v)) out[k] = h(x); return out
    }
    memo.set(i, v); return v
  }
  return h(0)
}
const nuxtDataFromHtml = (html) => {
  const m = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
  if (!m) throw new Error('no __NUXT_DATA__')
  return unflatten(JSON.parse(m[1]))
}
async function get(url, kind = 'text', tries = 4) {
  for (let t = 1; ; t++) {
    try {
      const r = await fetch(url, { headers: UA })
      if (!r.ok) throw new Error(`${r.status} ${url}`)
      return kind === 'json' ? r.json() : kind === 'buf' ? Buffer.from(await r.arrayBuffer()) : r.text()
    } catch (e) { if (t >= tries) throw e; await new Promise((s) => setTimeout(s, 500 * t)) }
  }
}
async function pool(items, n, fn) {
  let i = 0; const res = new Array(items.length)
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; res[k] = await fn(items[k], k) } }))
  return res
}
const write = async (p, data) => { await mkdir(dirname(p), { recursive: true }); await writeFile(p, typeof data === 'string' || Buffer.isBuffer(data) ? data : JSON.stringify(data)) }
const kb = async (p) => ((await stat(p)).size / 1024).toFixed(1) + ' KB'

// 1. index
const payload = unflatten(await get(`${SITE}/pieces/_payload.json`, 'json'))
const catalog = payload.data['content:catalog']
console.log(`catalog: ${catalog.pieces.length} pieces, ${catalog.categories.length} categories`)

// 2. CDN logos
const api = await get(API, 'json')
const cdnLogo = new Map(api.map((p) => [p.name, p.logoUrl]))
const withLogos = !args.has('--no-logos')
const logoPath = new Map()
if (withLogos) {
  let bytes = 0, fails = []
  await pool(catalog.pieces, 12, async (p) => {
    const src = cdnLogo.get(p.name) || `${SITE}${p.logoUrl}`
    let ext = (src.split('?')[0].match(/\.(png|svg|jpe?g|webp|gif)$/i)?.[1] || 'png').toLowerCase()
    try {
      const buf = await get(src, 'buf')
      if (buf.subarray(0, 200).toString().includes('<svg')) ext = 'svg'
      const rel = `/logos/pieces-cdn/${p.slug}.${ext}`
      await write(join(ROOT, 'public', rel), buf); bytes += buf.length; logoPath.set(p.slug, rel)
    } catch (e) {
      try { // fall back to the site's proxy, which serves the same image
        const buf = await get(`${SITE}/piece-icon/${p.slug}`, 'buf'); const rel = `/logos/pieces-cdn/${p.slug}.png`
        await write(join(ROOT, 'public', rel), buf); bytes += buf.length; logoPath.set(p.slug, rel)
      } catch { fails.push(p.slug) }
    }
  })
  console.log(`logos: ${logoPath.size} files, ${(bytes / 1048576).toFixed(2)} MB${fails.length ? `, failed: ${fails.join(', ')}` : ''}`)
}
const logoOf = (slug) => logoPath.get(slug) || null // null -> card renders the first-letter fallback

// index json (Popular order = payload order)
const index = {
  facts: catalog.facts, // { pieces, categories, actions, triggers }
  categories: catalog.categories.map((c) => ({ key: c.key, label: c.label, count: c.count })),
  pieces: catalog.pieces.map((p) => ({
    slug: p.slug,
    pkg: p.name.replace('@activepieces/piece-', ''), // search string uses the npm name too
    name: p.displayName,
    desc: p.description || '',
    logo: logoOf(p.slug),
    cats: p.categories,
    a: p.actions,
    t: p.triggers,
  })),
}
await write(join(ROOT, 'src/data/pieces.json'), index)
console.log(`src/data/pieces.json ${await kb(join(ROOT, 'src/data/pieces.json'))}`)

// 4. pairs from sitemap
const sm = await get(`${SITE}/sitemap.xml`)
const locs = [...sm.matchAll(/<loc>https:\/\/www\.activepieces\.com([^<]*)<\/loc>/g)].map((m) => m[1])
const pairs = {}
for (const u of locs) {
  const m = u.match(/^\/pieces\/([^/]+)\/([^/]+)$/)
  if (!m || m[1] === 'category') continue
  ;(pairs[m[1]] ||= []).push(m[2])
}
await write(join(ROOT, 'src/data/pairs.json'), pairs)
const nPairs = Object.values(pairs).reduce((s, v) => s + v.length, 0)
const mcpCats = locs.filter((u) => u.startsWith('/mcp/category/')).length
console.log(`src/data/pairs.json ${await kb(join(ROOT, 'src/data/pairs.json'))} (${nPairs} pairs, ${Object.keys(pairs).length} sources; sitemap also lists ${mcpCats} /mcp/category/* pages)`)

// 3. per-piece detail
if (!args.has('--no-detail')) {
  let total = 0, fails = []
  const item = (x) => ({ name: x.name, displayName: x.displayName, description: x.description || '', fields: (x.props || []).length })
  await pool(catalog.pieces, 8, async (p) => {
    try {
      const d = nuxtDataFromHtml(await get(`${SITE}/pieces/${p.slug}`)).data[`content:piece:${p.slug}`]
      const x = d.detail
      const out = {
        slug: x.slug, name: x.displayName, desc: x.description || '', logo: logoOf(x.slug),
        version: x.version, updated: x.updated, cats: x.categories, auth: x.authLabel || null,
        actionCount: x.actionCount, triggerCount: x.triggerCount,
        actions: x.actions.map(item), triggers: x.triggers.map(item),
        related: (d.related || []).map((r) => r.slug), // "More <category> integrations" (resolve via pieces.json)
        recipes: (d.recipes || []).map((r) => r.slug), // "Popular <piece> pairings" + pair-page related rows
        pairable: !!d.pairable,
        guides: (d.guides || []).map((g) => ({ path: g.path, title: g.title, excerpt: g.excerpt || '' })),
      }
      const f = join(ROOT, 'public/data/pieces', `${p.slug}.json`)
      await write(f, out); total += (await stat(f)).size
    } catch (e) { fails.push(`${p.slug} (${e.message})`) }
  })
  console.log(`public/data/pieces/*.json: ${catalog.pieces.length - fails.length} files, ${(total / 1048576).toFixed(2)} MB${fails.length ? `\nFAILED: ${fails.join(', ')}` : ''}`)
}
