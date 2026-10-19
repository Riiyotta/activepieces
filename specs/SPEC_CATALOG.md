Source: https://www.activepieces.com/

# Catalog templates: /pieces, /pieces/category/:key, /pieces/:slug, /pieces/:a/:b, /mcp, /mcp/category/:key, /mcp/:slug

Measured 2026-10-16 with headless Chromium (Playwright) at 1440×900, 768×1024 and 390×844, using `getComputedStyle` and `getBoundingClientRect`. Behaviour comes from the live Nuxt chunks; copies are saved in `specs/catalog-ref/js/` (named by component). Server-rendered `<main>` markup for one sample per template is in `specs/catalog-ref/html/*.main.html` (SVG and `data-v` stripped). Use those files as the source of truth for exact class strings. This spec gives the routing, the data and the numbers.

Global tokens, fonts, buttons and breakpoints: see `CLONE_SPEC.md` §0. Colours below use those token names. The measured oklch values map exactly: `oklch(.208 .042 265.755)` = ink-900, `.446 .043 257.281` = ink-600, `.554 .046 257.417` = ink-500, `.129 .042 264.695` = ink-950, `.984 .003 247.858` = ink-50, `.5 .134 242.749` = primary-700. Ring/edge shadows resolve to `shadow-edge`.

---

## 0. Routes and URL inventory (sitemap: 6,518 URLs)

| route | count in sitemap | template | 404 rule on original |
|---|---|---|---|
| `/pieces` | 1 | CatalogPage kind=pieces, with filters | — |
| `/pieces/category/:key` | 17 | CatalogPage kind=pieces, **no facet sidebar**, category copy | key not in categories → 404 |
| `/pieces/:slug` | 768 | PieceDetail kind=pieces | unknown slug → 404 |
| `/pieces/:a/:b` | 3,000 (250 sources × 12 targets) | PairPage | `a===b` → 404; either slug unknown → 404 |
| `/mcp` | 1 | CatalogPage kind=mcp (MCP hero + connect dialog) | — |
| `/mcp/category/:key` | 17 | CatalogPage kind=mcp, no sidebar | as above |
| `/mcp/:slug` | 768 | PieceDetail kind=mcp | unknown slug → 404 |

- The "17 `/mcp/:a/:b` pages" in the sitemap are `/mcp/category/<key>`: artificial_intelligence, productivity, marketing, communication, sales_and_crm, developer_tools, content_and_files, business_intelligence, core, commerce, forms_and_surveys, accounting, customer_support, payment_processing, human_resources, universal_ai, flow_control. The 3,017 two-segment `/pieces` URLs are these same 17 category pages plus 3,000 real pairs. There are no MCP pair pages: `/mcp/slack/gmail` returns 404.
- **Any** valid pair renders on the original, not just the 3,000 in the sitemap. `/pieces/google-sheets/notion`, `/pieces/zoom/zuora` and `/pieces/ai/slack` all return 200 and are indexable. The clone should render every `a≠b` pair of known slugs. `src/data/pairs.json` lists the 3,000 advertised pairs, for prerendering or a sitemap only.
- Route the static segment `category` before `:slug` (`/pieces/category/:key`, then `/pieces/:a/:b`).
- `:key` is the lower-case category key. Upper-case it to match (`productivity` → `PRODUCTIVITY`).
- The routing shell already exists in `src/App.jsx` (react-router-dom, `Layout` with Header/Footer, `ROUTES:BEGIN/END` markers, `pages/NotFound`). Register the 7 routes there.

### Document titles (`<title>` = `${seoTitle} | Activepieces`)
- `/pieces` → `Integrations — 768 open-source pieces`
- `/mcp` → `MCP servers — 760+ apps for your AI`
- `/pieces/category/:k` → `${label} integrations — ${count} to browse`
- `/mcp/category/:k` → `${label} MCP servers — ${count} to browse`
- `/pieces/:slug` → `${name} integration`
- `/mcp/:slug` → `${name} MCP server`
- pair → `Connect ${A} and ${B}`

The per-template meta descriptions are in the copy builders (`catalog-copy+entries.*.js`, `piece-detail-page+detail-hero.*.js`, `pair-page.*.js`).

---

## 1. Data (built and verified; see §8 for the script)

### 1.1 Where the original gets its data
- **Everything is server-rendered.** No client fetches the pieces API.
  - Catalog pages (`/pieces`, `/mcp`, category pages) embed the payload; client navigation fetches `/pieces/_payload.json` (257 KB, devalue-encoded). It decodes to `{ 'content:catalog': { pieces[768], categories[17], facts } }`.
  - Detail and pair pages inline their data in `<script id="__NUXT_DATA__">`, under `content:piece:<slug>` = `{ detail, related[6], recipes[6], pairable, guides[] }`.
  - Pair pages contain two such keys, one for A and one for B.
  - `/pieces/<slug>/_payload.json` does not exist (404).
- **Logos.** The site uses `/piece-icon/<slug>`, a same-origin proxy. It returns PNG bytes identical to `https://cdn.activepieces.com/pieces/<slug>.png` (md5 verified).
- **Public API.** `https://cloud.activepieces.com/api/v1/pieces` returns 769 pieces (917 KB) with `name, displayName, logoUrl` (CDN, 707 png / 46 svg / 16 jpg), `description, categories, actions, triggers, auth, version, …`. All 768 site pieces appear in it.
  - The per-piece endpoint `/api/v1/pieces/@activepieces/piece-<slug>` is about 430 KB each, including full props. Do not use it.
  - The site's own trimmed detail (props reduced to `{displayName,type,required}`) plus `related`, `recipes` and `guides` exists only in the SSR HTML. That is why the script scrapes `/pieces/<slug>` once.
- **Order.** `pieces[]` in the payload is already in "Popular" order (ai, google-sheets, gmail, openai, google-drive, …). Keep that order.

### 1.2 Files
| file | size | gzip | load |
|---|---|---|---|
| `src/data/pieces.json` | 157.5 KB | 36 KB | static import (catalog, cards, related/recipe lookups) |
| `src/data/pairs.json` | 37.0 KB | 3.7 KB | only if prerendering or building a sitemap; not needed at runtime |
| `public/data/pieces/<slug>.json` ×768 | 1.69 MB total (median ~1.5 KB, max ampeco 62 KB) | — | `fetch('/data/pieces/'+slug+'.json')` in detail and pair pages |
| `public/logos/pieces-cdn/<slug>.{png,svg,jpg,jpeg}` ×768 | 24.37 MB | — | `<img src={logo}>` |

`src/data/pieces.json` has this shape:
```
{ facts: {pieces:768, categories:17, actions:6477, triggers:1584},
  categories: [{key:'ARTIFICIAL_INTELLIGENCE', label:'Artificial Intelligence', count:125}, …17 in display order],
  pieces: [{slug, pkg, name, desc, logo:'/logos/pieces-cdn/<slug>.png', cats:['PRODUCTIVITY'], a:27, t:4}, …768 in Popular order] }
```
- `pkg` is the npm suffix (`@activepieces/piece-<pkg>`), used only for search.
- `logo` is never null today. If it is null, render the first-letter fallback (§3.4).

`public/data/pieces/<slug>.json` has this shape:
```
{ slug, name, desc, logo, version, updated:'2026-10-14T08:53:50.358Z', cats, auth:'OAuth 2.0 or Custom auth'|null,
  actionCount, triggerCount,
  actions:[{name, displayName, description, fields}], triggers:[…same…],   // fields = props.length
  related:[6 slugs], recipes:[6 slugs], pairable:bool, guides:[{path,title,excerpt}] }
```
- Resolve `related` and `recipes` slugs against `pieces.json` to get card data.
- `pairable` is true for exactly the 250 sitemap pair sources.
- 232 pieces have no guides.
- Every piece has at least one action or trigger.

### 1.3 Minimum fields per template
- **Catalog (index, category):** slug, name, desc, logo, cats, a, t, pkg (search), plus categories and facts.
- **Piece/MCP detail:** the detail file, plus `pieces.json` for related/recipes cards, plus `facts.pieces` for "760+".
- **Pair:** both detail files (actions/triggers with name/displayName/description, counts, recipes) plus `pieces.json`.

### 1.4 Derived values (exact formulas from the source)
- `total = facts.pieces` (768).
- `fmt(n)` = `n.toLocaleString('en-US')`, for example "6,477".
- `plus(n)` = `${fmt(Math.floor(n / (n>=1000?100:10)) * (n>=1000?100:10))}+`, which gives "760+".
- `plural(n,w)` = `${n} ${w}${n===1?'':'s'}`.
- Card meta = `[a&&plural(a,'action'), t&&plural(t,'trigger')].filter(Boolean).join(' · ')`. If the result is empty, show nothing.
  - Examples: "27 actions · 4 triggers", "6 actions", "1 action · 1 trigger".
- Category label = the `categories[].label` for the key. The source fallback is `key.split('_')`, mapping `AND`→`&`, keeping AI/CRM/BI/HR upper-case, and title-casing the rest.
- Card tag = label of `cats[0]`.
- "Updated" = `${['January',…][d.getUTCMonth()]} ${d.getUTCFullYear()}`, for example "October 2026".
- Search string = `${name} @activepieces/piece-${pkg} ${desc}`.toLowerCase().
- Weight = `a + t`.

---

## 2. Shared page chrome

### 2.1 Header
Use the existing Header in its non-home state. It is fixed, 84 px tall (`--spacing-chrome: 5.25rem`).

### 2.2 Closing band (the `<footer data-section="closing">`)
The **heading and body differ per template**, but the existing `Footer.jsx` hard-codes the homepage copy. Build needs a way to set them per route, such as a `closing` prop or context fed from the page. Everything else stays the same. The "Start building" href becomes `…sign-up?ap_cta=closing&ref=${encodeURIComponent(pathname)}`.

| template | h2 | p |
|---|---|---|
| /pieces | Connect your first app in a few minutes. | Every integration is free on every plan, and the code for each one is open source. |
| /mcp | Give your agent something to do. | Pick the apps it can reach, then paste one URL into Claude, Cursor or Codex. Free to start. |
| /pieces/category/:k | Connect a {label.toLowerCase()} app in a few minutes. | (same as /pieces) |
| /mcp/category/:k | Connect a {label.toLowerCase()} app in a few minutes. | (same as /mcp) |
| /pieces/:slug and pair | Connect it, and everything else you use. | Free on every plan, open source, and it runs on our cloud or your own servers. |
| /mcp/:slug | Give your agent something to do. | Turn it on, paste one URL into Claude, Cursor or Codex, and start free. |

### 2.3 CTA link conventions
- Primary "Start building" → `https://cloud.activepieces.com/sign-up?ap_cta=<location>&ref=<encodeURIComponent(pathname)>`.
- Secondary "Talk to sales" → `/sales?ap_cta=<location>`.
- Locations:
  - `catalog_pieces_hero`, `catalog_pieces_browser`
  - `catalog_mcp_hero`, `catalog_mcp_browser`
  - `pieces_detail_hero`, `pieces_detail_mid`
  - `mcp_detail_hero`, `mcp_detail_mid`
  - `recipe_detail_hero`
- Cross-links (detail-hero secondary, pair "Explore X") are plain hrefs with no `ap_cta`.

### 2.4 Section rhythm (container = `mx-auto w-full max-w-7xl px-5 md:px-6 lg:px-8`, so gutters are 20/24/32)
| section type | padding (base / md+) |
|---|---|
| detail/pair hero | pt 112 / 128, pb 96 / 128 |
| about | py 64 / 80 |
| capability list, ideas | py 96 / 128 |
| inline CTA band | py 48 / 64 |
| FAQ | py 96 / 128 (full width; inner `max-w-3xl` = 768) |
| guides | pb 64 / 80 |
| related/pairings/categories/az/browser | pb 96 / 128, pt 0 |

---

## 3. Shared components (build once, reuse)

### 3.1 `CatalogCard` (catalog-card)
`<a>`: `group flex h-full flex-col gap-5 rounded-2xl bg-white p-6 shadow-edge transition-shadow duration-200 ease-out hover:shadow-edge-hover` plus the focus ring.

1. **Logo row.** `flex flex-wrap items-center gap-2`. Each logo tile:
   - `span[title]`: `flex size-14 items-center justify-center rounded-xl bg-white p-2.5 ring-1 ring-ink-950/10` (56×56, radius 12, padding 10).
   - Inside it, `<img width=36 height=36 loading=lazy decoding=async class="size-full object-contain">`.
   - On image error, swap to `<span class="text-base font-semibold text-ink-600">{label[0]}</span>`.
   - Pairing cards show 2 tiles: the piece itself, then the partner.
2. **Text block.** `flex flex-col gap-2`:
   - `h2.text-lg.font-semibold.text-balance.text-ink-900` (18/28 600)
   - `p.line-clamp-2.text-[15px].text-ink-600` (15/22.5), omitted when the description is empty.
3. **Footer.** Rendered only if tag or meta exists. `mt-auto flex items-center justify-between gap-3 border-t border-ink-950/10 pt-4` (border 1 px ink-950/10, pt 16):
   - tag `span.truncate.text-xs.font-medium.text-ink-500` (12/16 500)
   - meta `span.shrink-0.text-xs.text-ink-600` (12/16 400)

Measured at 1440 in a 2-column grid: 420×235 for a single-line description; 258 tall for a two-line description or a two-logo card. In a 3-column grid: 392 wide.

### 3.2 `CapabilityList` (triggers, actions, tools, automation ideas)
- Section padding `py-24 md:py-32`. Inner `flex flex-col gap-8 md:gap-10`.
- Head `max-w-3xl flex-col gap-3`:
  - kicker `p.text-xs.font-semibold.tracking-wide.text-ink-600.uppercase` (12/16, tracking .025em)
  - `h2.font-display.text-3xl.md:text-4xl.font-bold.text-balance.text-ink-900` (30/36, then 36/40)
  - body `p.text-lg.text-ink-600` (18/28)
- List `ul.grid.grid-cols-1.gap-4.sm:grid-cols-2.md:gap-5.lg:grid-cols-3`. Columns: 3×392 at 1440, 2×350 at 768, 1×350 at 390. Gap 16 below md, 20 from md.
- Item `li.flex.flex-col.gap-2.rounded-2xl.bg-white.p-6.shadow-edge` (not a link, no hover):
  - `h3.text-base.font-semibold.text-ink-900` (16/24)
  - description `p.text-[15px].text-ink-600` (if any)
  - `p.mt-auto.pt-3.text-xs.text-ink-600` = `plural(fields,'field')`, shown only if fields > 0. Automation ideas have no fields line.
- Typical item height is 161.

### 3.3 `RelatedGrid` (related, pairings, pair "More ways…")
- Section `pb-24 md:pb-32`. Inner `flex flex-col gap-5 md:gap-8`.
- Head row `flex flex-wrap items-end justify-between gap-4`:
  - h2 (as in 3.2: 30/36 → 36/40)
  - right link `group inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm text-ink-900 hover:text-ink-950`, label + `solar:alt-arrow-right-linear size-4`, arrow `group-hover:translate-x-0.5` (200 ms ease-out)
- Grid `grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3` of CatalogCards. Maximum 6.

### 3.4 `FaqSection`
- `section.px-5.py-24.md:px-6.md:py-32.lg:px-8 > div.mx-auto.max-w-3xl`.
- h2 wrapper `mb-5 md:mb-8`. h2 `font-display text-3xl md:text-4xl font-bold text-balance text-ink-900`.
- List `flex flex-col gap-3`. Item `rounded-2xl bg-white px-5 shadow-edge sm:px-6`.
- Button `flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left`:
  - question `text-lg font-semibold text-ink-900` (18/28; button height 68)
  - icon `solar:add-linear size-5 text-ink-600 transition-transform duration-200`, rotated 45° when open
- Answer `p.pb-5.text-base.text-ink-600` (16/24).
- **The first item is open by default. Only one item is open at a time.**
- Collapse: height 0↔scrollHeight plus opacity, 200 ms ease-out.
- This behaves like the homepage `Faq.jsx`. Generalise that component to take `{heading, items}` rather than duplicating it.

### 3.5 `InlineCta` (browser-cta, detail mid-CTA)
- Section `py-12 md:py-16`.
- Card `flex flex-col gap-7 rounded-3xl bg-white p-8 shadow-edge md:flex-row md:items-center md:justify-between md:gap-10 md:p-10` (radius 24, padding 32/40).
- Text block `max-w-2xl flex-col gap-2`:
  - h2 `font-display text-2xl md:text-[28px] font-bold text-balance text-ink-900` (24/32, then 28/37.33)
  - p `text-base md:text-lg text-pretty text-ink-600`
- Buttons `flex shrink-0 flex-wrap gap-3 max-sm:*:grow`: lg brand (primary-700) with `primaryLabel`, then lg secondary "Talk to sales" → `/sales?ap_cta=<location>`.
- At 768 the row layout squeezes the h2 to 177–279 px wide. The original does the same; keep it.

### 3.6 `GuideCard` / guides section
- Rendered only when `guides.length` > 0.
- Section `pb-16 md:pb-20`. h2 "Guides using {name}". Grid `grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4` (4×289 at 1440).
- Card `<a href=path>`: `group flex h-full flex-col gap-2 rounded-2xl bg-white p-6 shadow-edge hover:shadow-edge-hover`.
  - Title `span.flex.items-start.gap-1.5.text-lg.font-semibold.text-balance.text-ink-900` + arrow (`mt-1.5 size-4 shrink-0 text-ink-600`, hover translate-x-0.5).
  - Optional excerpt `span.line-clamp-3.text-[15px].text-ink-600`.
- Links go to `/blog/...`. Those pages are not cloned yet; keep them as plain links.

### 3.7 Breadcrumb (detail and pair heroes)
- `nav[aria-label=Breadcrumb].flex.flex-wrap.items-center.gap-2.text-sm.text-ink-600`.
- Links `inline-flex min-h-11 md:min-h-0 items-center rounded-md hover:text-ink-950`. That makes them 44 px tall on mobile and 20 px from md.
- Separators `solar:alt-arrow-right-linear size-3.5 text-ink-500`. The last crumb is `span.font-medium.text-ink-900`.

---

## 4. CatalogPage: `/pieces`, `/mcp`, `/pieces/category/:k`, `/mcp/category/:k`

Section order (the `data-section` value is prefixed with `pieces-` or `mcp-`): **hero → browser → browser-cta → categories → faq → az**, then the closing band. Section geometry at 1440 for `/pieces`, as y + height:
- hero 0+816
- browser 816+3597
- browser-cta 4413+309
- categories 4722+927
- faq 5649+864
- az 6513+212
- closing 6725+975
- document height 7700

### 4.1 Hero variants
**A. `/pieces` pieces-hero** (`hero-stage relative isolate overflow-hidden`):
- Column `.hero-col relative mx-auto flex flex-col items-center justify-center px-5 pt-28 pb-24 text-center md:px-6 md:pt-32`. `max-width: calc(48rem + 3rem)` = 816. From md, `min-height: calc(100svh - 84px)`: 816 at 1440×900, 940 at 768×1024, auto at 390 (hero 710).
- h1 "Automate the apps you already use." is `font-display text-5xl md:text-6xl lg:text-7xl font-bold text-balance text-ink-900`: 48/48 → 60/60 → 72/72, measured 768×144 at 1440.
- p (`hero-line --i:1`, `mt-3 max-w-2xl text-xl text-ink-600`, 20/28, max 672) reads "Move data, send messages and update records between {fmt(total)} apps without writing glue code. Free on every plan, cloud or self-hosted."
- Buttons (`hero-line --i:2`, `mt-5 flex w-full flex-wrap justify-center gap-3 max-sm:*:grow`):
  - lg solid "Start building": h48, px28, ink-950, 158 wide
  - lg secondary "Talk to sales": ink-50 + shadow-edge, 151 wide
- Logo cluster (`hero-line --i:3`, `cluster mt-12 flex max-w-md flex-wrap justify-center gap-3.5`, aria-hidden) shows 8 `.face.compact` tiles: slack, gmail, notion, github, google-sheets, stripe, salesforce, openai. Each tile is 52×52, radius 29%, padding .65rem, and holds an `<img src=/logos/pieces/<slug>.svg>` (48). **The cluster is hidden at ≥72rem (1152 px).**
- 3D scatter (`.scatter`, aria-hidden, **display only at ≥72rem**) has 12 `.drop`s. Each drop is `.plate` > 12 `.layer` + `.face` > `img /logos/pieces/<slug>.svg`.
  - Placement table (slug, angle°, t, pitch, turn, spin, float s):
    - github −34 .42 21 −9 28 5.8
    - gmail −8 .86 22 −12 21 7.4
    - salesforce 20 .56 18 −13 −11 8.5
    - hubspot 40 .88 20 −8 27 6.8
    - linear 58 .62 23 −7 −19 6.3
    - shopify 124 .70 17 15 −26 6.6
    - discord 146 .84 22 11 12 7.1
    - telegram-bot 172 .46 25 14 9 6.9
    - slack 196 .88 19 13 −16 7.9
    - google-sheets 222 .50 15 8 −23 6.4
    - openai 240 .74 16 6 14 5.9
    - figma 298 .86 19 −5 −29 6.1
  - The inline style is computed by `_()` in `catalog-ref/js/pieces-index+pieces-hero.*.js`. Square-normalise the angle into nx/ny (largest component 1). Then:
    - row constants: `s = ny<0 ? 22 : 22`, `c = ny<0 ? 9 : 13`
    - `top = 50 + ny*(s + t*c)` %
    - `left = calc(50% ± |nx| * (var(--ring) + t * var(--reach)))`
    - `--from-x/--from-y` mirror left/top relative to the centre
    - `--s = .44 + t*.62`
    - `--sheen = 152 - spin` deg
    - `--i = index`
  - The exact SSR inline styles are also in `catalog-ref/html/pieces.main.html`; copy them verbatim.
  - Measured plate sizes at 1440 range from 69 to 98 px (`--base: clamp(3.75rem, min(7.4vw, 11svh), 8rem)` × `--s`).
- **CSS:** port `Activepieces_ unify your team's AI_files/pieces.C8on5plE.css` verbatim (strip `[data-v-…]`) into the component CSS. It defines `.hero-stage` vars, `.scatter`, `.drop`, `.plate`, `.layer` (colour-mix ink-200→ink-500 by `--l*7.5%`, translateZ), `.face` (gradient sheen, 1 px rim outline, padding 17%) and `.face.compact`. It also defines the keyframes `throw-out`, `sail`, `tumble` and `hero-line`.
  - Use `color-mix` and the CSS custom properties as they are. The project already defines `--color-ink-*` in `:root`.
  - `translate`/`scale` as standalone properties are fine in modern browsers.

**B. `/mcp` mcp-hero** uses the same stage technique with the mcp CSS (`mcp.DUdia9zP.css`, second half, scope 13c1bbfc).
- `--col: 56rem`, so the column max-width is 944.
- The scatter has explicit `height: var(--span)`. There is **no cluster**.
- Column `px-5 pt-32 pb-20 text-center md:px-6 md:pt-40 justify-start` (pt 128 → 160, pb 80).
- h1 "One MCP server for all of Activepieces." (896×144 at 1440).
- p (static) "Connect Claude, Cursor, Codex or any MCP client and it drives the whole platform. Free on every plan, cloud or self-hosted."
- Feature list `ul.hero-line(--i:2).mt-5.flex.flex-wrap.justify-center.gap-x-3.gap-y-1.text-sm.text-ink-500`: "Build flows · Use {fmt(total)} apps · Manage tables · Debug runs". Dots are `span.text-ink-300 aria-hidden`, and each `li` is `flex items-center gap-3`.
- Then `div.hero-line(--i:3).mt-9.w-full` containing **McpConnect** (§4.7). No CTA buttons.
- Drops use explicit nx/ny instead of angles (slug, nx, ny, t, pitch, turn, spin, float):
  - google-sheets −.92 −.967 .40 15 9 −23 6.4
  - openai −1 −.59 .52 16 13 14 5.9
  - slack −1 −.106 .68 19 7 −16 7.9
  - telegram-bot −.9 .234 .58 25 15 9 6.9
  - discord −1 .62 .86 22 6 12 7.1
  - shopify −.93 .994 .72 17 12 −26 6.6
  - figma .96 −.985 .62 19 −11 −29 6.1
  - github .88 −.544 .44 21 −6 28 5.8
  - gmail 1 −.166 .76 22 −14 21 7.4
  - salesforce .91 .168 .50 18 −8 −11 8.5
  - linear .97 .57 .66 23 −15 −19 6.3
  - hubspot 1 .858 .84 20 −7 27 6.8
- MCP row constants: `s = ny<0 ? 28 : 28`, `c = ny<0 ? 9 : 13`. The SSR inline styles are in `catalog-ref/html/mcp.main.html`.

**C. Category pages** (`product-hero` without art, highlights or logos). There is no scatter.
- `hero-stage mx-auto flex w-full max-w-7xl flex-col items-start px-5 pt-28 pb-24 text-left md:px-6 md:pt-32 md:pb-32 lg:px-8`, height 452 at 1440.
- h1 `font-display text-5xl md:text-6xl font-bold text-balance text-ink-900` (no lg size) = `${fmt(count)} ${label} ${nounPlural}.`, for example "107 Productivity integrations." or "107 Productivity apps.".
- p `hero-line(--i:1) mt-3 max-w-5xl text-xl text-ink-600` carries the base subtitle of the kind.
- Buttons `hero-line(--i:2) mt-5 flex w-full flex-wrap gap-3 max-sm:*:grow` (left-aligned): Start building (`catalog_<kind>_hero`) and Talk to sales.

### 4.2 Browser (catalog-browser)
**Layout**
- Section `pb-24 md:pb-32`. Row `flex flex-col gap-8 lg:flex-row lg:gap-12`.
- At 1440: aside x=112 w=304, results x=464 w=864.

**Facet aside** (only when `facets.length`, so not on category pages)
- `lg:sticky lg:top-28 lg:w-76 lg:shrink-0 lg:self-start` (sticky top 112, width 304).
- Mobile toggle (`lg:hidden`): `button.flex.w-full.items-center.justify-between.gap-4.rounded-2xl.bg-white.px-5.py-4.text-left.shadow-edge` (350×52 at 390).
  - Text "Filter by category" (`text-sm font-semibold text-ink-900`), followed by `span.text-ink-600 "(N)"` when categories are selected.
  - Chevron `alt-arrow-down size-4`, `rotate-180` when open.
  - The panel wrapper is `hidden` (closed) or `mt-3` (open), and always `lg:mt-0 lg:block`.
- Panel `flex max-h-[60svh] lg:max-h-[calc(100svh-9rem)] flex-col rounded-2xl bg-white p-3 shadow-edge` (756 tall at 900 viewport).
  - Head `flex shrink-0 items-center justify-between gap-3 px-2 py-1.5`: `h2 "Category"` (13/19.5 600 ink-600), plus a "Reset" button (`text-xs font-medium text-ink-600 hover:text-ink-950`) only when categories are selected.
  - List `ul.facet-scroll.-mx-1.mt-1.flex.min-h-0.flex-col.gap-0.5.overflow-y-auto.px-1`. The thin scrollbar CSS comes from `catalog-page.D5ZfWbji.css`.
- Rows: base `flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors duration-200` (41 tall, 15/22.5).
  - Active: `font-medium text-ink-950`. Inactive: `text-ink-900 hover:text-ink-950`.
  - First row is a `<button aria-pressed>` "All categories" with count = total.
  - Other rows are `<label>` with `input[type=checkbox].sr-only` and the `has-[:focus-visible]` outline. Tailwind v3 supports `has-[…]`; if not, put a focus style on the box.
  - Checkbox box `size-4.5 rounded-sm`: on = `bg-ink-950` with a white check SVG (`viewBox 0 0 12 12`, path `M2.6 6.2 4.9 8.5 9.4 3.9`, stroke-width 1.8, round caps/joins, `size-3`); off = `bg-white ring-1 ring-ink-950/20`.
  - Label `min-w-0 flex-1 leading-snug`. Count `shrink-0 text-xs text-ink-600 tabular-nums`.

**Results column** (`flex min-w-0 flex-1 flex-col gap-8`)
1. Search `label.relative.block`:
   - icon `solar:magnifer-linear absolute left-4 top-1/2 -translate-y-1/2 size-5 text-ink-600`
   - `input[type=search]` placeholder "Search integrations" / "Search apps" / "Search {label}" (category pages), with matching aria-label
   - input classes `w-full rounded-xl border border-ink-950/10 bg-white py-3.5 pr-4 pl-11 text-ink-900 outline-none placeholder:text-ink-500 focus:border-ink-950/40 transition-colors duration-200` (54 tall, 16/24)
2. Selected-category chips (`lg:hidden`, only with a selection): `chip-scroll -mx-5 -my-1 flex items-center gap-2 overflow-x-auto px-5 py-1 md:-mx-6 md:px-6` (scrollbar hidden).
   - Each chip `button.group.inline-flex.shrink-0.items-center.gap-1.5.rounded-full.bg-white.py-1.5.pr-2.5.pl-3.5.text-sm.whitespace-nowrap.text-ink-900.shadow-edge.hover:shadow-edge-hover`, label + `solar:close-circle-linear size-3.5 text-ink-500 group-hover:text-ink-950`, aria-label "Remove {label} filter".
   - Then "Clear all" (`rounded-md px-2 py-1 text-sm font-medium text-ink-600 hover:text-ink-950`).
3. Status row `flex flex-wrap items-center justify-between gap-3`:
   - `p.text-sm.text-ink-600[aria-live=polite]` "Showing {shown} of {matches} {noun|nounPlural}". The noun is singular when matches = 1.
   - Sort `label.flex.items-center.gap-2.text-sm.text-ink-600` containing `span.hidden.sm:inline "Sort by"` and a select wrapper.
   - `select[aria-label="Sort by"].appearance-none.rounded-full.border.border-ink-950/10.bg-white.py-2.pr-9.pl-4.text-base.md:text-sm.text-ink-900.focus:border-ink-950/40` (139×38 at md+; 151×42 at 390 where the font is 16 px, avoiding iOS zoom) with chevron `absolute right-3.5 size-4`.
   - Options: `featured` "Popular", `name` "A to Z", `weight` "Most actions" (pieces) / "Most tools" (mcp).
   - At 390 the select wraps below the "Showing" line.
4. Grid `grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6`, plus `lg:grid-cols-3` when there is no facet column (category pages: 3×389 at 1440). Measured: 2×420 at 1440 with facets, 2×348 at 768, 1×350 at 390. Gap 20 → 24.
5. "Show more" (`flex justify-center` wrapper inside `flex flex-col gap-10`): lg secondary button, shown while `limit < matches.length`.

**Behaviour** (from `catalog-page+browser+az.*.js`; verified live)
- **Page size 24.** "Show more" adds 24. After rendering it scroll-compensates: it measures the button's top before and after, then calls `window.scrollBy(Δ, 'instant')`, so the button stays where it was.
- **Search debounce 120 ms.** It applies to the trimmed, lower-cased query; clearing the field applies immediately.
- **Search match:** substring of the search string (§1.4). Live check: "google" → "Showing 22 of 22 integrations".
- **Category filter:** multi-select OR (`entry.cats.some(sel.has)`), combined with search by AND. The facet list shows static counts from `categories[].count` and does not recount.
- **Sort:**
  - `featured` = payload order.
  - `name` = `Intl.Collator('en',{sensitivity:'base'}).compare(title)`.
  - `weight` = `(b.a+b.t)-(a.a+a.t)`, then collator.
- **When the filtered list changes:** the limit resets to 24. If the results column top is above the viewport, the page scrolls to `scrollY + top - 96` (smooth, or auto under reduced motion).
- **URL sync:** the URL is updated via `history.replaceState`, debounced 250 ms after query, cats or sort change.
  - `q` = trimmed raw query, only if non-empty.
  - `cat` = comma-joined keys, for example `?cat=PRODUCTIVITY`.
  - `sort` only if not `featured`.
  - The initial state is read from these params. An invalid `sort` falls back to `featured`.
  - Live example: `?cat=PRODUCTIVITY&sort=weight`.
- **Empty state** replaces the grid: `flex flex-col items-center py-14 md:py-20 text-center`.
  - `h3.max-w-xl.text-xl.md:text-2xl.font-semibold.text-balance.text-ink-950` (24/32 at md) with one of:
    - `No {nounPlural} match “{q}” in those categories`
    - `No {nounPlural} match “{q}”`
    - `No {nounPlural} in that category` / `… in those categories`
    - `No {nounPlural} to show`
  - `p.mt-3.max-w-md.text-[15px].text-pretty.text-ink-600` = `empty.body`.
  - Secondary button `mt-5`, label "Clear search and filters" / "Clear search" / "Clear filters". It clears cats and q.
  - Then `div.mt-12.w-full.max-w-3xl.border-t.border-ink-950/10.pt-10` > `h4.text-sm.font-semibold.text-ink-900` (`empty.heading`) > `div.mt-5.flex.flex-col.gap-2.5.text-left` with 3 route links.
  - Route link: `group flex items-center gap-5 rounded-2xl bg-ink-50 p-5 md:px-6 hover:bg-ink-100` (88 tall at 1440). Contents: icon `mt-0.5 size-5 text-ink-600`; title `block text-[15px] font-semibold text-ink-950`; body `mt-1.5 block text-sm text-pretty text-ink-600`; right CTA `hidden sm:inline-flex items-center gap-1 text-sm font-medium text-ink-950` + arrow (hover translate-x-0.5); a mobile-only arrow `size-4 text-ink-600 sm:hidden`.
  - External hrefs open in `_blank` with `rel=noopener`.
  - Copy for pieces and mcp is in `catalog-copy+entries.*.js` (`empty.routes`). Icons: transfer-horizontal, code, chat-round.

### 4.3 Browser CTA (InlineCta, location `catalog_<kind>_browser`)
- pieces:
  - h2 "Connect one, then chain the rest."
  - p "Every integration here is free on every plan. Connect an app once and each of the other {fmt(total-1)} can pick up where it leaves off."
  - primary "Start building"
- mcp:
  - h2 "Point your client at one URL."
  - p "Enable the server, paste the URL into Claude, Cursor or any MCP client, and every app you connect shows up as a tool. {plus(total)} of them are waiting."
  - primary "Get your server URL"
- Category pages use the kind's copy.

### 4.4 Categories
- h2 "Browse by category." On category pages it is "Browse another category." and the current category is excluded, leaving 16 cards.
- Head `max-w-3xl font-display text-3xl md:text-4xl`. Grid `grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3` (3×392 at 1440).
- Card `<a href="/{kind}/category/{key.toLowerCase()}">`: `group flex flex-col gap-1.5 rounded-2xl bg-white p-6 shadow-edge hover:shadow-edge-hover` (105 tall).
  - Title `flex items-center gap-1.5 text-lg font-semibold text-ink-900` "{label} " + `alt-arrow-right size-4 text-ink-600 group-hover:translate-x-0.5`.
  - Blurb `text-[15px] text-ink-600` "{count} pieces" (pieces) / "{count} apps" (mcp).

### 4.5 FAQ (FaqSection)
pieces: "Integrations, answered." with 6 Q&A. mcp: "MCP, answered." with 6 Q&A. The exact strings, including `{fmt(total)}`, `{fmt(actions)}` and `{plus(total)}` interpolation, are in `catalog-copy+entries.*.js` (`faq:`). Category pages reuse the kind's FAQ.

### 4.6 A–Z index (az-index)
- Card `rounded-2xl bg-white px-6 py-5 shadow-edge md:px-8` (radius 16; 84 tall closed).
- Toggle `button.flex.min-h-11.w-full.items-center.justify-between.gap-4.text-left[aria-expanded]`:
  - title `text-lg font-semibold text-ink-900` = "All 768 integrations, A–Z" / "All 768 apps, A–Z" / "All 107 Productivity integrations, A–Z"
  - right side `flex items-center gap-3` with `span.hidden.sm:inline.text-sm.text-ink-600 "{n} entries "` and a chevron that rotates 180° when open
- Open: `nav[aria-label="Full index"].az-list.mt-6.grid.grid-cols-2.gap-x-8.gap-y-2.sm:grid-cols-3.lg:grid-cols-4`.
  - Links `truncate rounded-md text-sm text-ink-600 hover:text-ink-950`.
  - Sorted by `title.localeCompare`. On category pages only that category's pieces are listed.
  - Entrance animation `az-in` (.2 s smooth, opacity 0→1, translate 0 −4px→0) from `catalog-page.D5ZfWbji.css`.
- The original SSR-renders the list with `class="hidden"` so links are crawlable. Render it always and toggle `hidden`.

### 4.7 McpConnect (inside the /mcp hero only) and McpConnectDialog
**Card grid** (CSS: first half of `mcp.DUdia9zP.css`, scope 895181b6)
- Container `flex w-full flex-wrap justify-center gap-4`.
- 5 popular clients, `button.card.client-card.flex.flex-col.items-center.justify-center.gap-3.rounded-2xl.bg-white.px-3.py-6`, each 140 tall:
  - `flex-basis`: `calc(50% - .5rem)` base; `calc(33.333% - .667rem)` from 40rem; `calc(20% - .8rem)` from 64rem.
  - Widths: 166 at 1440 (5 in one row), 229 at 768 (3+2), 167 at 390 (2+2+1).
  - Card contents: `img size-10` (40) logo, name `text-sm font-semibold text-ink-900`, hint `text-xs text-ink-500`.
  - `.card` style: border 1 px cast-10, shadow `0 1px 2px -1px cast-08`. Hover: border cast-20, shadow `0 3px 8px -4px cast-10`, translateY(−1px). Transitions 200 ms (transform uses ease-smooth).
  - Entrance `card-in` .48 s smooth, delay `.26s + i*45ms`.
- "Using something else?" / "Show fewer" toggle: `button.tap.mt-5.flex.items-center.gap-1.5.text-sm.font-semibold.text-ink-600.hover:text-ink-900` + `.chevron` (rotate 180°, .3 s smooth).
- It reveals `.reveal` (grid-template-rows 0fr→1fr, .32 s smooth; inner opacity .2 s with 90 ms delay; `inert` while closed).
  - The reveal holds 6 secondary chips: `button.card.flex.items-center.gap-2.5.rounded-xl.bg-white.py-2.5.pr-4.pl-3`, `img size-6` + name, 46 tall.
  - Open heights: 70 at 1440 (one row), 126 at 768, 182 at 390.

**Clients** (key, name, logo `/logos/clients/<file>`, hint):
- popular: claude ("One click install"), claude-code ("One command"), cursor ("One click install"), vscode ("Works in Copilot"), chatgpt ("Add a connector")
- more: codex "Codex CLI", cline "Cline", antigravity (`.png`) "Antigravity", devin "Devin Desktop", opencode "OpenCode", other (`mcp.svg`) "Any MCP client"
- All 11 logos are now in `public/logos/clients/`. I downloaded the missing claude, cursor and chatgpt svgs.

**Clicking any client** opens `McpConnectDialog` on that client. The full client/method/step config is in `catalog-ref/js/mcp-connect-dialog.*.js` (the `k` array):
- server URL `https://cloud.activepieces.com/mcp`
- Cursor and VS Code deeplinks
- the Claude directory link
- terminal/code/prompt blocks
- "Then try" prompt "What Activepieces tools do you have? List a few things you could run for me."

**Dialog**: CSS `mcp-connect-dialog.BUS9cZUT.css`, port it verbatim.
- Native `<dialog class="sheet m-auto overflow-hidden border border-ink-950/10 bg-white p-0">` opened with `showModal()`.
  - Width `min(58rem, 100vw - 2rem)`: 928×658 at 1440, 730 at 768. Radius 16, `shadow-over`.
  - Backdrop ink-950/40. Opens with opacity plus a translate 4px→0 (`@starting-style`).
  - **Below 48rem it becomes a bottom sheet:** full width, top radius 16 only, slides up from 100% (390: y=292, h=552).
  - The `.shell` is `flex flex-col md:flex-row`, height `min(41rem, 100svh - 5rem)` from md.
- **Rail** `md:w-60 bg-ink-50 md:border-r`:
  - "Pick your client" label (12 600 ink-500, `hidden md:block px-5 pt-5 pb-2.5`).
  - `role=tablist` list of all 11 clients, `rail-item` 40 tall (md) / 44 (mobile horizontal scroller with edge masks). Contents: `img size-5` + `text-sm font-semibold`.
  - Selected item `text-ink-900`; others `text-ink-600 hover:bg-ink-950/5`.
  - A sliding white `.pill` (border cast-10, `transform: translate3d(offsetLeft, offsetTop)`, .22 s smooth) sits under the selected tab.
  - Arrow/Home/End keys move the selection.
- **Panel:**
  - Header `flex items-start gap-3.5 border-b px-5 py-4 md:px-7 md:py-5` with `img size-9`, `h2#mcp-connect-title` "Connect to {name}" (18/28 600) and a "{name} docs ↗" link (`text-sm text-ink-500`). Close button `solar:close-linear size-4.5`.
  - Body `.panel-scroll px-5 py-5 md:px-7 md:py-6`.
  - Method segmented control (only if more than 1 method): `seg relative flex w-fit gap-0.5 rounded-lg bg-ink-100 p-0.5`, buttons `px-3 py-1.5 text-[13px] font-semibold`, sliding pill. Then a hint `text-sm text-ink-500`.
  - Numbered steps `ol.flex.flex-col.gap-5`, number badge `size-5 rounded-full bg-ink-900 text-[11px] font-semibold text-white`. Block styles:
    - terminal: ink-800 header / ink-900 body / ink-100 mono text-xs
    - prompt: ink-50 box + "Copy prompt" ink-900 button
    - url/code: bordered, ink-50 header with mono label
    - action: `rounded-lg bg-ink-900 px-3.5 py-2 text-sm font-semibold text-white` + arrow
  - Copy buttons show "Copied" for 2 s.
  - "Then try" box `rounded-xl bg-ink-50 p-4`.
  - Content swaps animate with `.fade` (.2 s).
- **Closing:** backdrop click (pointerdown and click both on the dialog element), Esc, or the close button.

---

## 5. PieceDetail: `/pieces/:slug` and `/mcp/:slug`

Section order:
1. hero
2. about
3. capability sections, rendered only if non-empty: pieces = Triggers, Actions; mcp = Tools (actions), Triggers
4. cta, rendered only if any capability section rendered
5. faq
6. guides (if any)
7. pairings (pieces only, when `pairable`)
8. related

Geometry for `/pieces/google-sheets` at 1440:
- hero 0+620
- about 620+324
- triggers 944+786
- actions 1730+2098
- cta 3828+337
- faq 4165+784
- guides 4949+359
- pairings 5309+740
- related 6048+695
- closing; document height 7718

`/pieces/ai` has no triggers section and no guides.

### 5.1 Detail hero
- Wrapper `mx-auto flex w-full max-w-7xl flex-col items-start px-5 pt-28 pb-24 md:px-6 md:pt-32 md:pb-32 lg:px-8`.
- Breadcrumb (§3.7): pieces = "Pieces › {cat label} › {name}"; mcp = "MCP › …". The category crumb links `/{kind}/category/{cats[0].toLowerCase()}` and is omitted when there is no category.
- `div.mt-8.flex.items-center.gap-5`:
  - logo box `size-16 shrink-0 rounded-xl border border-ink-950/10 bg-white p-3` (64; img 40, alt "{name} logo"; on error show the first letter in `font-display text-xl font-bold text-ink-600`)
  - h1 `font-display text-4xl md:text-5xl font-bold text-balance text-ink-900` (36/40 → 48/48) = "{name} integration" / "{name} MCP server"
- Lead `p.mt-3.max-w-3xl.text-xl.text-ink-600`:
  - pieces: `desc.trim()` or "Connect {name} to Activepieces and automate it end to end, without writing code."
  - mcp: `desc.trim()` or "Give your assistant {plural(actionCount,'tool')} it can call in {name}, over one server URL."
- MCP only, a note `p.mt-2.5.max-w-2xl.text-[15px].text-ink-500`: "{name} is not a separate install. One Activepieces MCP server exposes it alongside {plus(total)} other apps, behind a single URL."
- Buttons `mt-5 flex w-full flex-wrap gap-3 max-sm:*:grow`:
  - lg solid "Start building" (`{kind}_detail_hero`)
  - lg secondary cross-link:
    - pieces: "Use {name} with your AI" → `/mcp/{slug}`
    - mcp: "See the {name} integration" → `/pieces/{slug}`
  - Below sm both buttons are full width (350).
- Facts `dl.mt-12.md:mt-16.grid.w-full.grid-cols-1.gap-8.sm:grid-cols-2.md:grid-cols-3.md:gap-0.md:divide-x.md:divide-ink-950/10.lg:grid-cols-5`:
  - Item `flex flex-col gap-1 md:px-6 md:first:pl-0 md:last:pr-0`.
  - dt `text-xs font-semibold tracking-wide uppercase text-ink-600` (12/16).
  - dd `text-lg font-semibold text-ink-900` (18/28).
  - Columns: 5×243 at 1440, 3×240 at 768.
  - pieces facts: Actions, Triggers, Auth (only if `auth`), License "MIT, open source", Updated.
  - mcp facts: Tools (=actionCount), Works with "Any MCP client", Auth?, License, Updated.

### 5.2 About
- Section `py-16 md:py-20`. Inner `max-w-3xl flex-col gap-4`.
- h2 `font-display text-2xl md:text-3xl font-bold` (24/32 → 30/36):
  - pieces: "About the {name} integration"
  - mcp: "About the {name} MCP server"
- Body `p.text-lg.text-ink-600`. Templates are in `piece-detail-page+detail-hero.*.js` (`aboutBody`) and use `{plus(total)}`.

### 5.3 Capability sections (§3.2)
pieces:
- **Triggers**: "Start a flow the moment something happens in {name}" / "Each trigger below can start a flow on its own, either instantly or on a schedule."
- **Actions**: "Everything Activepieces can do in {name}" / "Drop any of these into a flow and fill in the fields. No code is required."

mcp:
- **Tools**: "{name} tools your AI can run" / "Once connected, your assistant can call any of these {name} actions by asking in plain language."
- **Triggers**: "{name} events your agent can watch" / "These start a run the moment something happens in {name}, so work gets picked up on its own."

`data-section` = `{kind}-detail-{kicker.toLowerCase()}`.

### 5.4 Mid CTA (InlineCta, `{kind}_detail_mid`)
- pieces: "Use {name} in a flow" / "Connect {name} once and every trigger and action above is yours to drop into the builder, alongside {plus(total)} other apps. Free to start, on our cloud or your own servers." / primary "Build a {name} flow"
- mcp: "Give your assistant {name}" / "…behind the same server URL as {plus(total)} other apps. Free to start." / primary "Get your server URL"

### 5.5 FAQ
- pieces "{name}, answered.", 5 items. mcp "{name} MCP, answered.", 5 items.
- All templates, including conditionals, are in `piece-detail-page+detail-hero.*.js`:
  - auth clause only when `auth`
  - "What can I automate" uses `triggers[0]` / `actions[0]` when both exist, else a fallback
  - the mcp "What can my agent do" lists the first 3 action names comma-joined

### 5.6 Guides (§3.6)

### 5.7 Pairings (pieces only, `pairable` true)
- h2 "Popular {name} pairings", link "Browse all integrations" → `/pieces`.
- Cards are built from `recipes` (max 6):
  - href `/pieces/{slug}/{r}`
  - title "{name} + {r.name}"
  - logos [self, partner]
  - desc, tag and meta from the partner (card height 258).

### 5.8 Related
- h2:
  - pieces: "More {catLabel.toLowerCase()} integrations" (no category: "Related integrations")
  - mcp: "More {catLabel.toLowerCase()} apps on the same server" (or "Related apps on the same server")
- Link "Browse all integrations" → `/pieces`, or "Browse all MCP apps" → `/mcp`.
- Cards from `related` (max 6) link `/{kind}/{slug}`.

---

## 6. PairPage: `/pieces/:a/:b`

Geometry at 1440:
- recipe-hero 0+768
- recipe-ideas 768+814
- recipe-faq 1582+624
- recipe-related-source 2206+740
- recipe-related-target 2946+740
- closing; document height 4661

Load both detail files.

### 6.1 Hero (`recipe-hero`, same wrapper as §5.1)
- Breadcrumb "Pieces › {A} › + {B}". The middle crumb links `/pieces/{a}`.
- Logo row `mt-8 flex items-center gap-4 md:gap-5`:
  - two boxes `size-20 md:size-24 rounded-2xl border border-ink-950/10 bg-white p-4 md:p-5` (80→96; img 56, alt "{X} logo")
  - between them `solar:transfer-horizontal-linear size-7 md:size-8 text-ink-400`
- h1 `mt-6 font-display text-4xl md:text-5xl font-bold text-balance text-ink-900` "Connect {A} to {B}".
- Lead `mt-3 max-w-3xl text-xl text-ink-600`: "Move data between {A} and {B} the moment it happens. Build the flow visually, or let AI write it for you, then run it on our cloud or your own infrastructure."
- Buttons: "Start building" (`recipe_detail_hero`), secondary " Explore {A}" → `/pieces/{a}`, secondary " Explore {B}" → `/pieces/{b}`. Below sm they stack full width.
- Facts `dl.mt-12.md:mt-16.grid.grid-cols-1.gap-8.sm:grid-cols-2.md:grid-cols-4.md:gap-0.md:divide-x`:
  - Order: "{A} triggers", "{A} actions", "{B} triggers", "{B} actions".
  - dt `text-sm font-semibold tracking-wide uppercase text-ink-600` (14/20).
  - dd `font-display text-3xl md:text-4xl font-bold text-ink-900` (30/36 → 36/40).
  - Columns 4×304 at 1440, 4×180 at 768, 1 column at 390.

### 6.2 Automation ideas (`recipe-ideas`, CapabilityList without field counts)
- Kicker "Automation ideas".
- h2 "What you can build with {A} and {B}".
- Body "A few flows teams run between {A} and {B}. Use one as a starting point, or build your own from scratch."
- The section is omitted if no ideas are generated.

Exact algorithm:
```
idea(tr, ac, fromName, toName) = { displayName: `${tr.displayName} in ${fromName} creates ${ac.displayName} in ${toName}`,
                                   description: tr.description || ac.description || '' }
gen(X, Y, n): out=[]; for tr of X.triggers.slice(0,3) for ac of Y.actions.slice(0,3) { out.push(idea(tr,ac,X.name,Y.name)); if (out.length>=n) return out }
e = gen(A,B,4); t = gen(B,A,4); interleave e[0],t[0],e[1],t[1],… ; take first 6
```
These outputs were verified against google-sheets/clickup, ai/slack (AI has 0 triggers, so there are 4 ideas all from Slack) and odoo/zoo.

### 6.3 FAQ
"Questions, answered", with 3 items; the copy is in `pair-page.*.js`:
- "Do I need to write code to connect {A} and {B}?"
- "Can {A} and {B} talk in both directions?"
- "Where does this run?"

### 6.4 Related rows (RelatedGrid)
- `recipe-related-source`:
  - h2 "More ways to automate {A}", link "View {A}" → `/pieces/{a}`
  - entries = `A.recipes.filter(s => s !== b).slice(0,6)`, each card `/pieces/{a}/{s}`, title "{A} + {S.name}"
  - **one logo only (the partner)**, desc and tag; **no meta** (footer shows only the category)
- `recipe-related-target`: the same, using B's recipes excluding a.
- Either row is omitted when empty.

---

## 7. Motion summary

| element | trigger | spec |
|---|---|---|
| `.hero-line` (catalog heroes, category heroes) | load | `hero-line` .64 s ease-smooth, delay `--i*70ms`: opacity 0, blur 4px, translateY 12px → none. Only with `html.js`; off under reduced motion. Already global in the project (`html.js .hero-line`). |
| `.drop` (scatter, ≥1152 px) | load | `throw-out` `calc(.34s + t*.22s)` with `cubic-bezier(.1,.88,.18,1)`, delay `i*14ms`, from centre (scale .12, opacity 0 → 1 at 18%). Then infinite `sail` (`--float`, ease-in-out, delay `.82s + i*20ms`). |
| `.plate` | load | infinite `tumble` (`--float*2.3`). |
| `.client-card` | load | `card-in` .48 s smooth, delay `.26s + i*45ms`, translateY 10 → 0. |
| cards (catalog, related, guides, category) | hover | shadow-edge → shadow-edge-hover, 200 ms ease-out. Arrow icons translate-x 2px. |
| FAQ | click | height and opacity 200 ms ease-out; plus icon rotates 45°. |
| facet rows / checkbox | click | colors 200 ms. |
| mobile filter chevron / A–Z chevron | click | rotate 180°, 200 ms. |
| A–Z list | open | `az-in` .2 s smooth. |
| MCP reveal, chevron, dialog | click | see §4.7 (.32 s grid rows; .2–.24 s dialog). |
| results scroll | filter change | smooth scroll to results top − 96 when the results top is above the viewport. |

All motion is disabled under `prefers-reduced-motion`; the CSS files include those rules. No IntersectionObserver or scroll-linked animation exists on these templates.

---

## 8. Script, assets and icons

- **`scripts/fetch-pieces.mjs`.** Run with `node scripts/fetch-pieces.mjs [--no-logos] [--no-detail]`.
  - It fetches the payload, the cloud API (for CDN logo URLs), the sitemap and 768 SSR detail pages (concurrency 8, retries). Total run time is about 1 min 45 s.
  - It writes everything in §1.2.
  - On this machine Node needs the Netskope TLS-inspection root, so run it as `NODE_EXTRA_CA_CERTS=<pem>` (curl already trusts that root through the system keychain).
  - Re-run it to refresh the data. The data is a snapshot from 2026-10-16.
- **Logos.** All 768 are downloaded to `public/logos/pieces-cdn/` (24.4 MB: 706 png, 46 svg, 14 jpg, 2 jpeg).
  - 38 files are over 100 KB (10.7 MB together), for example `send-it.png` 2.3 MB and `gistly.svg` 0.9 MB, yet they render at 36–56 px.
  - Optional later step: downscale PNG/JPG to 112 px (2× of 56) to cut the total to about 3 MB. JSON paths would stay the same if extensions are kept.
  - Images are `loading=lazy` in cards; the hero logo is eager.
- **Hero art logos** are `/logos/pieces/<slug>.svg`, already local. I added `discord.svg` and `figma.svg`. Client logos: `/logos/clients/*`, with `claude`, `cursor` and `chatgpt` added.
- **Icons to add** (Iconify → `public/icons/solar/` + `src/icons.css` rule, if not already present):
  - alt-arrow-down-linear, alt-arrow-right-linear, magnifer-linear, close-circle-linear, add-linear
  - transfer-horizontal-linear, code-linear, chat-round-linear, arrow-right-linear
  - copy-linear, check-read-linear, check-circle-linear
  - `close-linear` and `arrow-right-up-linear` already exist.
- **CSS to port verbatim** (strip `[data-v-*]` and keep the selectors scoped to component class names):
  - `catalog-page.D5ZfWbji.css` (facet scrollbar, chip scroller, az-in)
  - `pieces.C8on5plE.css` (pieces hero)
  - `mcp.DUdia9zP.css` (connect cards and mcp hero)
  - `mcp-connect-dialog.BUS9cZUT.css`
  - All four are in `Activepieces_ unify your team's AI_files/`.

## 9. Gaps and notes
- **Analytics.** CTA tracking (`cta.clicked`, `faq_opened`) and JSON-LD (breadcrumb, collection and item lists) exist on the original. They are not specified for the build; the builders are in the saved chunks if needed.
- **Unbuilt link targets.** `/blog/*` guide links and the `/docs` and `/sales` targets are other routes, not part of this spec.
- **Facet counts are static.** The original never recounts facets after a search; replicate that.
- **Description language.** Some descriptions are not English (for example Wedof in French) and are shown as-is.
- **Measurement method.** The shared MCP browser was in use by other agents, so measurements came from a separate headless Chromium. The values above were not affected.
