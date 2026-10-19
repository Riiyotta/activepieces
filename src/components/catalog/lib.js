// Catalog data + copy builders (SPEC_CATALOG §1.4, §4, §5, §6). Copy strings are taken verbatim from
// specs/catalog-ref/js/catalog-copy+entries.*.js, piece-detail-page+detail-hero.*.js and pair-page.*.js.
import data from '../../data/pieces.json'

export const CATALOG = data
export const FACTS = data.facts
export const CATEGORIES = data.categories
export const PIECES = data.pieces
export const BY_SLUG = new Map(data.pieces.map((p) => [p.slug, p]))
const CAT_LABELS = new Map(data.categories.map((c) => [c.key, c.label]))

export const SIGN_UP = 'https://cloud.activepieces.com/sign-up'
export const signUp = (location, pathname) =>
  `${SIGN_UP}?ap_cta=${location}&ref=${encodeURIComponent(pathname)}`
export const sales = (location) => `/sales?ap_cta=${location}`

// §1.4 derived values
export const fmt = (n) => n.toLocaleString('en-US')
export const plus = (n) => {
  const s = n >= 1000 ? 100 : 10
  return `${fmt(Math.floor(n / s) * s)}+`
}
export const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`
export const cardMeta = (a, t) => [a && plural(a, 'action'), t && plural(t, 'trigger')].filter(Boolean).join(' · ') || null

const UPPER = new Set(['AI', 'CRM', 'BI', 'HR'])
export function catLabel(key) {
  if (CAT_LABELS.has(key)) return CAT_LABELS.get(key)
  return key
    .split('_')
    .map((w) => (w === 'AND' ? '&' : UPPER.has(w) ? w : w[0] + w.slice(1).toLowerCase()))
    .join(' ')
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export function updatedLabel(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(+d) ? '' : `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

// Catalog card entry (catalog-copy `s()`).
export function toEntry(p, base) {
  return {
    slug: p.slug,
    to: `${base}/${p.slug}`,
    title: p.name,
    body: p.desc,
    logos: [{ slug: p.slug, src: p.logo, label: p.name }],
    tag: p.cats[0] ? catLabel(p.cats[0]) : null,
    meta: cardMeta(p.a, p.t),
    weight: p.a + p.t,
    categories: p.cats,
    search: `${p.name} @activepieces/piece-${p.pkg} ${p.desc}`.toLowerCase(),
  }
}

const entryCache = {}
export function allEntries(base) {
  if (!entryCache[base]) entryCache[base] = PIECES.map((p) => toEntry(p, base))
  return entryCache[base]
}

// ---------------------------------------------------------------- catalog copy (§4)
function piecesCopy() {
  const total = FACTS.pieces
  return {
    kind: 'pieces',
    base: '/pieces',
    categoryBase: '/pieces/category',
    noun: 'integration',
    nounPlural: 'integrations',
    seoNounPlural: 'integrations',
    title: 'Automate the apps you already use.',
    subtitle: `Move data, send messages and update records between ${fmt(total)} apps without writing glue code. Free on every plan, cloud or self-hosted.`,
    seoTitle: `Integrations — ${fmt(total)} open-source pieces`,
    seoDescription: `Browse ${fmt(total)} open-source integrations with ${fmt(FACTS.actions)} actions and ${fmt(FACTS.triggers)} triggers. Free to start, self-hostable.`,
    searchPlaceholder: 'Search integrations',
    browseCta: {
      title: 'Connect one, then chain the rest.',
      body: `Every integration here is free on every plan. Connect an app once and each of the other ${fmt(total - 1)} can pick up where it leaves off.`,
      primaryLabel: 'Start building',
    },
    categoryHeading: 'Browse by category.',
    categoryUnit: 'pieces',
    faqHeading: 'Integrations, answered.',
    faq: [
      ['What is a piece?', `A piece is an app integration. Each one ships that app's triggers and actions, and you drag them into a flow. There are ${fmt(total)} pieces today, with ${fmt(FACTS.actions)} actions between them.`],
      ['Are all the integrations free?', 'Yes. Every piece is included on every plan, including the free cloud tier and any self-hosted deployment. Activepieces is priced by runs, never per task and never per connector.'],
      ['What if the app I need is missing?', 'Call any REST API from the HTTP piece or a code step, or write a proper piece in TypeScript and open a pull request. The catalog is open source, which is how it grew this large.'],
      ['Can I use these integrations self-hosted?', 'Yes. The same catalog ships with the self-hosted edition, so every integration works the same way while your connections and your data stay inside your own environment.'],
      ['How are my credentials stored?', 'Connections use OAuth2 with scoped access wherever the app supports it, and credentials are stored under 256-bit encryption. There is no user-facing API that reads them back out.'],
      ['Can an AI agent use these as tools?', `Every piece you connect can be exposed to Claude, Cursor, Windsurf and any MCP client through one Activepieces MCP server, so an agent reaches ${plus(total)} apps over one connection.`],
    ],
    azHeading: `All ${fmt(total)} integrations, A–Z`,
    featuredSort: 'Popular',
    weightSort: 'Most actions',
    empty: {
      body: 'A missing piece is never a dead end. Every app with an API already works on Activepieces, today.',
      heading: 'Three ways to connect it anyway',
      routes: [
        { icon: 'solar:transfer-horizontal-linear', title: 'Use the HTTP piece', body: 'Call any REST API from a flow. Auth, headers and JSON are handled for you.', cta: 'Read the docs', href: 'https://www.activepieces.com/docs' },
        { icon: 'solar:code-linear', title: 'Write the piece', body: 'Build it in TypeScript and open a pull request. The catalog is open source.', cta: 'See the repo', href: 'https://github.com/activepieces/activepieces' },
        { icon: 'solar:chat-round-linear', title: 'Ask us for it', body: 'Tell us which app you need. Customer requests shape what we build next.', cta: 'Talk to us', href: '/sales' },
      ],
    },
    closing: { h2: 'Connect your first app in a few minutes.', lede: 'Every integration is free on every plan, and the code for each one is open source.' },
  }
}

function mcpCopy() {
  const total = FACTS.pieces
  const r = plus(total)
  return {
    kind: 'mcp',
    base: '/mcp',
    categoryBase: '/mcp/category',
    noun: 'app',
    nounPlural: 'apps',
    seoNounPlural: 'MCP servers',
    title: 'One MCP server for all of Activepieces.',
    subtitle: 'Connect Claude, Cursor, Codex or any MCP client and it drives the whole platform. Free on every plan, cloud or self-hosted.',
    seoTitle: `MCP servers — ${r} apps for your AI`,
    seoDescription: `Connect ${r} apps to Claude, Cursor, Windsurf and any MCP client through one open-source, self-hostable MCP server. Free to start.`,
    searchPlaceholder: 'Search apps',
    browseCta: {
      title: 'Point your client at one URL.',
      body: `Enable the server, paste the URL into Claude, Cursor or any MCP client, and every app you connect shows up as a tool. ${r} of them are waiting.`,
      primaryLabel: 'Get your server URL',
    },
    categoryHeading: 'Browse by category.',
    categoryUnit: 'apps',
    faqHeading: 'MCP, answered.',
    faq: [
      ['What is an MCP server?', `MCP is the open standard assistants like Claude and Cursor use to call external tools. Activepieces gives your project one server that exposes ${r} apps to your AI as tools.`],
      ['How is this different from a single-app server?', 'Most MCP servers cover one app. Activepieces gives you a single URL that exposes every piece you connect, so your AI calls actions across all of them through one connection.'],
      ['How do I connect Claude or Cursor?', 'Enable the server under Settings → MCP Server, copy the URL, and paste it into your client config, such as ~/.cursor/mcp.json. It authenticates over OAuth on first use.'],
      ['Is it free and open source?', 'Yes. Activepieces has an MIT-licensed core and is free to start, and the MCP server is included on every plan, including the free cloud tier and any self-hosted deployment.'],
      ['Is it safe to let an agent call actions?', 'Connections use OAuth2 with limited scopes and credentials are stored under 256-bit encryption, with no API to retrieve them, so an agent gets scoped access rather than your keys.'],
      ['Can I self-host the MCP server?', 'Yes. Activepieces is fully self-hostable, the MCP server included, so your connections and data stay in your own environment, at your host root or behind a reverse-proxy subpath.'],
    ],
    azHeading: `All ${fmt(total)} apps, A–Z`,
    featuredSort: 'Popular',
    weightSort: 'Most tools',
    empty: {
      body: 'Your agent is not limited to this list. Anything you can reach over an API can become a tool.',
      heading: 'Three ways to give your agent this tool',
      routes: [
        { icon: 'solar:transfer-horizontal-linear', title: 'Wrap any API', body: 'Wrap the HTTP piece in a flow and expose it to your agent over MCP.', cta: 'Read the docs', href: 'https://www.activepieces.com/docs' },
        { icon: 'solar:code-linear', title: 'Write the piece', body: 'Build it in TypeScript. Every piece becomes an MCP tool automatically.', cta: 'See the repo', href: 'https://github.com/activepieces/activepieces' },
        { icon: 'solar:chat-round-linear', title: 'Ask us for it', body: 'Tell us which server your agent needs. Customer requests come first.', cta: 'Talk to us', href: '/sales' },
      ],
    },
    closing: { h2: 'Give your agent something to do.', lede: 'Pick the apps it can reach, then paste one URL into Claude, Cursor or Codex. Free to start.' },
  }
}

const KIND_COPY = { pieces: piecesCopy(), mcp: mcpCopy() }

export function catalogCopy(kind, category) {
  const c = KIND_COPY[kind]
  if (!category) return c
  const n = fmt(category.count)
  return {
    ...c,
    title: `${n} ${category.label} ${c.nounPlural}.`,
    seoTitle: `${category.label} ${c.seoNounPlural} — ${n} to browse`,
    seoDescription: `Browse ${n} ${category.label} ${c.seoNounPlural} from the open-source Activepieces catalog. Free to start, self-hostable.`,
    searchPlaceholder: `Search ${category.label}`,
    categoryHeading: 'Browse another category.',
    azHeading: `All ${n} ${category.label} ${c.nounPlural}, A–Z`,
    closing: { ...c.closing, h2: `Connect a ${category.label.toLowerCase()} app in a few minutes.` },
  }
}

// ---------------------------------------------------------------- detail copy (§5)
function detailFacts(d) {
  const out = []
  if (d.auth) out.push({ label: 'Auth', value: d.auth })
  out.push({ label: 'License', value: 'MIT, open source' })
  const u = updatedLabel(d.updated)
  if (u) out.push({ label: 'Updated', value: u })
  return out
}

function crumbs(d, base, root) {
  const out = [{ label: root, to: base }]
  const c = d.cats[0]
  if (c) out.push({ label: catLabel(c), to: `${base}/category/${c.toLowerCase()}` })
  out.push({ label: d.name })
  return out
}

// `d` is the detail file once loaded; while loading, a pieces.json row mapped by `stubDetail`.
export function stubDetail(p) {
  return { slug: p.slug, name: p.name, desc: p.desc, logo: p.logo, cats: p.cats, actionCount: p.a, triggerCount: p.t, auth: null, updated: null, actions: [], triggers: [], related: [], recipes: [], pairable: false, guides: [], loading: true }
}

export function detailCopy(kind, d) {
  const n = d.name
  const t = plus(FACTS.pieces)
  if (kind === 'mcp') {
    const r = d.actionCount
    return {
      base: '/mcp',
      title: `${n} MCP server`,
      lead: d.desc?.trim() || `Give your AI assistant ${plural(r, 'tool')} it can call in ${n}, over one server URL.`,
      seoTitle: `${n} MCP server`,
      note: `${n} is not a separate install. One Activepieces MCP server exposes it alongside ${t} other apps, behind a single URL.`,
      crumbs: crumbs(d, '/mcp', 'MCP'),
      facts: [{ label: 'Tools', value: String(r) }, { label: 'Works with', value: 'Any MCP client' }, ...detailFacts(d)],
      aboutHeading: `About the ${n} MCP server`,
      aboutBody: `Connect ${n} once in Activepieces and every action it ships becomes a tool your assistant can call, behind the same server URL as the rest of your apps. Your agent reaches ${n} and ${t} other apps over a single connection, on our cloud or a self-hosted install.`,
      sections: [
        { kicker: 'Tools', heading: `${n} tools your AI can run`, body: `Once connected, your assistant can call any of these ${n} actions by asking in plain language.`, items: d.actions },
        { kicker: 'Triggers', heading: `${n} events your agent can watch`, body: `These start a run the moment something happens in ${n}, so work gets picked up on its own.`, items: d.triggers },
      ],
      midCta: {
        title: `Give your assistant ${n}`,
        body: `Connect ${n} once and every tool above is callable from Claude, Cursor or any MCP client, behind the same server URL as ${t} other apps. Free to start.`,
        primaryLabel: 'Get your server URL',
      },
      faqHeading: `${n} MCP, answered.`,
      faq: [
        ['Do I need a separate server per app?', `No. That is the point of it. One Activepieces server exposes ${n} alongside every other piece you connect, so your client keeps a single connection.`],
        [`Is the ${n} MCP server free?`, 'Yes. Activepieces is open source and free to start, and the MCP server is included on every plan, from the free cloud tier to any self-hosted deployment.'],
        [`How do I connect ${n} to Claude or Cursor?`, `Connect ${n} in Activepieces, enable the server under Settings → MCP Server, then paste your server URL into your client config. It authenticates over OAuth on first use.`],
        [`What can my agent do in ${n}?`, r
          ? `It can call ${plural(r, 'tool')}, including ${d.actions.slice(0, 3).map((a) => a.displayName).join(', ')}, and chain them with steps in other apps inside the same run.`
          : `It can watch ${n} for events and hand the work to steps in other apps inside the same run.`],
        [`Is it safe to let an agent call ${n}?`, 'Connections use OAuth2 with limited scopes and are stored under 256-bit encryption, with no API to read them back, so an agent gets scoped access rather than your keys.'],
      ],
      relatedHeading: d.cats[0] ? `More ${catLabel(d.cats[0]).toLowerCase()} apps on the same server` : 'Related apps on the same server',
      browseAllLabel: 'Browse all MCP apps',
      crossLinkLabel: `See the ${n} integration`,
      crossLinkTo: `/pieces/${d.slug}`,
      closing: { h2: 'Give your agent something to do.', lede: 'Turn it on, paste one URL into Claude, Cursor or Codex, and start free.' },
    }
  }
  const tr = d.triggers[0]?.displayName
  const ac = d.actions[0]?.displayName
  return {
    base: '/pieces',
    title: `${n} integration`,
    lead: d.desc?.trim() || `Connect ${n} to Activepieces and automate it end to end, without writing code.`,
    seoTitle: `${n} integration`,
    note: null,
    crumbs: crumbs(d, '/pieces', 'Pieces'),
    facts: [{ label: 'Actions', value: String(d.actionCount) }, { label: 'Triggers', value: String(d.triggerCount) }, ...detailFacts(d)],
    aboutHeading: `About the ${n} integration`,
    aboutBody: `Add the ${n} piece to a flow, connect your account once, and the rest of the builder can read from it and write to it. Because the piece is open source you can run it on our cloud or self-host it, and combine ${n} with ${t} other apps in the same flow.`,
    sections: [
      { kicker: 'Triggers', heading: `Start a flow the moment something happens in ${n}`, body: 'Each trigger below can start a flow on its own, either instantly or on a schedule.', items: d.triggers },
      { kicker: 'Actions', heading: `Everything Activepieces can do in ${n}`, body: 'Drop any of these into a flow and fill in the fields. No code is required.', items: d.actions },
    ],
    midCta: {
      title: `Use ${n} in a flow`,
      body: `Connect ${n} once and every trigger and action above is yours to drop into the builder, alongside ${t} other apps. Free to start, on our cloud or your own servers.`,
      primaryLabel: `Build a ${n} flow`,
    },
    faqHeading: `${n}, answered.`,
    faq: [
      [`Is the ${n} integration free?`, `Yes. Activepieces is open source and free to start, and the ${n} piece is included on every plan, from the free cloud tier to any self-hosted deployment.`],
      [`How do I connect ${n}?`, `Add the ${n} piece to a flow${d.auth ? `, then authenticate with ${d.auth}` : ''}. Once connected, its ${plural(d.triggerCount, 'trigger')} and ${plural(d.actionCount, 'action')} are available anywhere in the builder.`],
      [`What can I automate with ${n}?`, tr && ac
        ? `"${tr}" can start a flow that runs "${ac}", and you can chain ${n} together with any of ${t} other apps and AI steps in between.`
        : `Connect ${n} to any of ${t} other apps and AI steps, then automate the work in between without writing code.`],
      [`Can I self-host the ${n} integration?`, `Yes. Activepieces is fully self-hostable, so you can run the ${n} piece on your own infrastructure with your connections and your data staying in your environment.`],
      [`Can my AI agent use ${n} as a tool?`, `Yes. Every piece you connect can be exposed over one Activepieces MCP server, so Claude, Cursor, Windsurf or any MCP client can call ${n} actions as tools.`],
    ],
    relatedHeading: d.cats[0] ? `More ${catLabel(d.cats[0]).toLowerCase()} integrations` : 'Related integrations',
    browseAllLabel: 'Browse all integrations',
    crossLinkLabel: `Use ${n} with your AI`,
    crossLinkTo: `/mcp/${d.slug}`,
    closing: DETAIL_CLOSING,
  }
}

export const DETAIL_CLOSING = { h2: 'Connect it, and everything else you use.', lede: 'Free on every plan, open source, and it runs on our cloud or your own servers.' }

// ---------------------------------------------------------------- pair (§6.2)
function idea(tr, ac, fromName, toName) {
  return { name: `${tr.name}->${ac.name}`, displayName: `${tr.displayName} in ${fromName} creates ${ac.displayName} in ${toName}`, description: tr.description || ac.description || '' }
}
function gen(X, Y, n) {
  const out = []
  for (const tr of X.triggers.slice(0, 3))
    for (const ac of Y.actions.slice(0, 3)) {
      out.push(idea(tr, ac, X.name, Y.name))
      if (out.length >= n) return out
    }
  return out
}
export function automationIdeas(A, B) {
  const e = gen(A, B, 4)
  const t = gen(B, A, 4)
  const out = []
  for (let i = 0; i < Math.max(e.length, t.length); i++) {
    if (e[i]) out.push(e[i])
    if (t[i]) out.push(t[i])
  }
  return out.slice(0, 6)
}

// ---------------------------------------------------------------- detail file loader
const detailCache = new Map()
export function loadDetail(slug) {
  if (!detailCache.has(slug)) {
    const p = fetch(`/data/pieces/${slug}.json`).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return r.json()
    })
    p.catch(() => detailCache.delete(slug))
    detailCache.set(slug, p)
  }
  return detailCache.get(slug)
}
