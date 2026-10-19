#!/usr/bin/env node
/**
 * Builds a METADATA-ONLY index of activepieces.com blog posts, authors and resources.
 * Full article bodies, FAQs and legal text are never stored (content fields are discarded on receipt).
 *
 * Usage:
 *   node scripts/fetch-content-index.mjs                 # write src/data/blog.json + src/data/resources.json
 *   node scripts/fetch-content-index.mjs --images        # also download cover art / author photos into public/ at original paths
 *   node scripts/fetch-content-index.mjs --no-details    # skip per-resource detail calls (no dates/readingTime/related)
 *
 * Polite: concurrency 4, 150 ms delay between requests per worker.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://www.activepieces.com';
const CONCURRENCY = 4;
const DELAY_MS = 150;
const args = new Set(process.argv.slice(2));
const WITH_IMAGES = args.has('--images');
const WITH_DETAILS = !args.has('--no-details');
const RESOURCE_TYPES = ['glossary', 'automation-guides', 'automation-use-cases', 'integration-use-cases'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, as = 'json', tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'activepieces-clone-indexer/1.0 (metadata only)' } });
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return as === 'json' ? await res.json() : as === 'text' ? await res.text() : Buffer.from(await res.arrayBuffer());
    } catch (e) {
      if (i >= tries) throw e;
      await sleep(500 * i);
    }
  }
}
async function pool(items, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
      await sleep(DELAY_MS);
    }
  }));
  return out;
}
/** keep at most 2 sentences / 300 chars of a listing excerpt */
function shortExcerpt(s) {
  if (!s) return '';
  const t = s.replace(/\s+/g, ' ').trim();
  const sentences = t.match(/[^.!?]+[.!?]+(\s|$)/g);
  let out = sentences ? sentences.slice(0, 2).join('').trim() : t;
  if (out.length > 300) out = out.slice(0, 297).replace(/\s+\S*$/, '') + '…';
  return out;
}
/** same luma formula the site uses: (.299r+.587g+.114b)/255, 3 decimals */
function luma(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return Number(((0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255).toFixed(3));
}
/** the title size rule from hero-cover: length buckets → cqw */
function titleScale(title) {
  const l = title.length;
  return l <= 38 ? 1 : l <= 60 ? 0.9 : l <= 85 ? 0.78 : 0.68;
}
const localPath = (u) => new URL(u, ORIGIN).pathname; // original path, mirrored under public/

async function main() {
  // ---------- authors ----------
  const authorsRaw = await get(`${ORIGIN}/api/content/authors`);
  const authors = authorsRaw.map((a) => ({
    id: a.id, slug: a.slug, name: a.name, role: a.role ?? null, location: a.location ?? null,
    bio: a.bio ? shortExcerpt(a.bio) : null, photo: a.photo ?? null, photoLocal: a.photo ? localPath(a.photo) : null, count: a.count ?? 0,
  }));
  const authorByName = new Map(authors.map((a) => [a.name, a]));

  // ---------- posts (slim API: body is empty, we drop it anyway) ----------
  const first = await get(`${ORIGIN}/api/content/posts?page=1&pageSize=100&slim=true&total=true`);
  const pages = Math.ceil(first.total / 100);
  let raw = [...first.posts];
  for (let p = 2; p <= pages; p++) {
    await sleep(DELAY_MS);
    raw = raw.concat((await get(`${ORIGIN}/api/content/posts?page=${p}&pageSize=100&slim=true&total=true`)).posts);
  }

  // The listing API and the sitemap drift apart (posts that are still live drop out of the listing).
  // Fill every sitemap /blog/<slug> missing from the listing from the single-post endpoint.
  // That endpoint returns the full body, so it is deleted on receipt; the mapping below keeps metadata only.
  const sitemap = await get(`${ORIGIN}/sitemap.xml`, 'text');
  const listed = new Set(raw.map((p) => p.slug));
  const missing = [...sitemap.matchAll(/<loc>https:\/\/www\.activepieces\.com\/blog\/([^/<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((s) => !['page', 'category', 'author'].includes(s) && !listed.has(s));
  await pool(missing, async (slug) => {
    try {
      const p = await get(`${ORIGIN}/api/content/post/${encodeURIComponent(slug)}`);
      delete p.content;
      // the API can return a differently-cased slug; the route is the sitemap's
      raw.push({ ...p, slug, listed: false });
    } catch (e) { console.warn('post failed', slug, e.message); }
  });
  console.log(`posts from listing: ${listed.size}; filled from sitemap: ${missing.length}`);

  const posts = raw.map((p) => {
    const hasPhoto = !!(p.hero && p.image);
    const a = p.author ? authorByName.get(p.author.name) : null;
    return {
      id: p.id,
      slug: p.slug,
      title: p.title.trim(),
      excerpt: shortExcerpt(p.excerpt || p.metaDescription),
      publishedAt: p.publishedAt,
      updatedAt: p.updatedAt,
      readingTime: p.readingTime || null,
      type: p.type || null,
      aiGenerated: !!p.aiGenerated,
      hasToc: Array.isArray(p.toc) && p.toc.length > 0,
      author: p.author ? { name: p.author.name, slug: a?.slug ?? null, role: p.author.role ?? null, location: p.author.location ?? null, bio: p.author.bio ? shortExcerpt(p.author.bio) : null, photo: p.author.photo ?? null, photoLocal: p.author.photo ? localPath(p.author.photo) : null } : null,
      categories: (p.categories || []).map((c) => ({ name: c.name, slug: c.slug })),
      cover: {
        // what the original actually renders behind the HTML title overlay
        kind: hasPhoto ? 'image' : 'generated',
        src: hasPhoto ? p.image.url : `${ORIGIN}/api/hero-bg/${encodeURIComponent(p.slug)}.svg`,
        // same path under public/ (populated by --images); use this at runtime
        local: hasPhoto ? localPath(p.image.url) : `/api/hero-bg/${encodeURIComponent(p.slug)}.svg`,
        width: 1600, height: 900,
        leftLuma: hasPhoto ? p.hero.leftLuma : null, // filled below for generated covers
        titleScale: titleScale(p.title.trim()),
      },
      url: `${ORIGIN}/blog/${p.slug}`,
      ...(p.listed === false && { listed: false }),
    };
  });

  // generated covers: read the ground colour from the SVG's first <rect> to get leftLuma (ink-dark when > .55)
  const gen = posts.filter((p) => p.cover.kind === 'generated');
  let genBytes = 0;
  await pool(gen, async (p) => {
    try {
      const svg = await get(p.cover.src, 'text');
      genBytes += Buffer.byteLength(svg);
      const m = svg.match(/<rect[^>]*fill="(#[0-9a-fA-F]{6})"/);
      p.cover.leftLuma = m ? luma(m[1]) : 1;
      if (WITH_IMAGES) {
        const dest = path.join(ROOT, 'public', localPath(p.cover.src));
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.writeFile(dest, svg);
      }
    } catch (e) { console.warn('hero-bg failed', p.slug, e.message); p.cover.leftLuma = 1; }
  });
  for (const p of posts) p.cover.ink = p.cover.leftLuma > 0.55 ? 'dark' : 'light';

  const catMap = new Map();
  for (const p of posts) for (const c of p.categories) {
    const e = catMap.get(c.slug) || { ...c, count: 0 }; e.count++; catMap.set(c.slug, e);
  }
  // order used by the site's category pills
  const ORDER = ['automation-software', 'automation-thoughts', 'automation-tutorials', 'company', 'engineering', 'guides-ai', 'product'];
  const categories = [...catMap.values()].sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug));

  posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const blog = {
    source: `${ORIGIN}/blog`, generatedAt: new Date().toISOString(), note: 'Metadata only. Article bodies are not stored; link to url for the full article.',
    pageSize: 12, total: posts.length, categories, authors, posts,
  };
  await fs.writeFile(path.join(ROOT, 'src/data/blog.json'), JSON.stringify(blog));

  // ---------- resources ----------
  const counts = await get(`${ORIGIN}/api/content/resource-counts`);
  const items = [];
  for (const type of RESOURCE_TYPES) {
    await sleep(DELAY_MS);
    const idx = await get(`${ORIGIN}/api/content/resource-index/${type}`);
    for (const r of idx) items.push({ type, slug: r.slug, title: r.title.trim(), excerpt: shortExcerpt(r.excerpt), url: `${ORIGIN}/resources/${type}/${r.slug}` });
  }
  if (WITH_DETAILS) {
    let done = 0;
    await pool(items, async (it) => {
      try {
        const d = await get(`${ORIGIN}/api/content/resource/${it.type}/${it.slug}`);
        // keep metadata only — d.content and d.faq are deliberately discarded
        it.publishedAt = d.publishedAt ?? null;
        it.updatedAt = d.updatedAt ?? null;
        it.readingTime = d.readingTime ?? null;
        it.related = (d.related || []).map((r) => ({ type: r.type, slug: r.slug }));
        it.apps = (d.apps || []).map((a) => ({ path: a.path, title: a.title, excerpt: a.excerpt }));
        it.faqCount = Array.isArray(d.faq) ? d.faq.length : 0;
      } catch (e) { console.warn('resource failed', it.type, it.slug, e.message); }
      if (++done % 100 === 0) console.log(`  resources ${done}/${items.length}`);
    });
  }
  const resources = {
    source: `${ORIGIN}/resources`, generatedAt: new Date().toISOString(), note: 'Metadata only. Resource bodies and FAQ answers are not stored.',
    counts, types: RESOURCE_TYPES, pageSize: 24, items,
  };
  await fs.writeFile(path.join(ROOT, 'src/data/resources.json'), JSON.stringify(resources));

  // ---------- optional images ----------
  let imgBytes = 0;
  if (WITH_IMAGES) {
    const urls = new Set();
    for (const p of posts) if (p.cover.kind === 'image') urls.add(p.cover.src);
    for (const a of authors) if (a.photo) urls.add(a.photo);
    for (const p of posts) if (p.author?.photo) urls.add(p.author.photo);
    await pool([...urls], async (u) => {
      const dest = path.join(ROOT, 'public', localPath(u));
      try { await fs.access(dest); return; } catch {}
      try {
        const buf = await get(u, 'buf');
        imgBytes += buf.length;
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.writeFile(dest, buf);
      } catch (e) { console.warn('image failed', u, e.message); }
    });
  }
  const size = async (f) => (await fs.stat(path.join(ROOT, f))).size;
  console.log(`blog.json: ${posts.length} posts, ${authors.length} authors, ${categories.length} categories, ${(await size('src/data/blog.json') / 1024).toFixed(0)} KB`);
  console.log(`resources.json: ${items.length} items, ${(await size('src/data/resources.json') / 1024).toFixed(0)} KB`);
  console.log(`generated cover SVGs: ${gen.length} (${(genBytes / 1048576).toFixed(1)} MB)` + (WITH_IMAGES ? `; downloaded other images ${(imgBytes / 1048576).toFixed(1)} MB` : ''));
}
main().catch((e) => { console.error(e); process.exit(1); });
