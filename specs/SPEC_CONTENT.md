Source: https://www.activepieces.com/

# Content templates: blog, resources, legal (clone build spec)

Measured 2026-10-16 with headless Playwright (Chromium 1440×900, 768×1024, 390×844, DPR 1). Computed values come from `getComputedStyle` and `getBoundingClientRect`. oklch values were converted to hex in the browser. Motion and prose rules are copied from the shipped CSS (`use-post-markdown.CkkWI2U8.css`, `post-card.Bc58JJ62.css`, `_slug_.DbnOXifq.css`, `legal-page.BYMm0MAB.css`, `entry.LEuMnHPd.css`) and from the Nuxt chunks (`wgXbUamx.js` article, `DImJtvCM.js` TOC and share, `BWkgKHzh.js` blog index, `BvGktKqu.js` hero-cover and post-card, `D1O0IhH_.js` pagination and empty state).

Read these first:
- Global tokens, fonts, buttons, Header and Footer: `CLONE_SPEC.md` §0, §1 and §O.
- Build rules: `BUILD_CONVENTIONS.md`.
- Everything below uses those tokens. `ink-950/10` means `rgba(2,6,24,.10)`, and so on.

**Content policy.** The clone stores **metadata only** (`src/data/blog.json`, `src/data/resources.json`). Article, resource and legal **bodies are not stored**. Each article page renders the title, meta, cover and excerpt, then a placeholder body that exercises every prose style (§5.6), then a "Read the full article on activepieces.com" link. Legal pages render the layout with a placeholder body and link to the originals.

---

## 0. Routes and data

| route | template | data |
|---|---|---|
| `/blog` | Blog index p1: search, category pills, featured post, 12-card grid, pagination | `blog.json` |
| `/blog/page/:n` | Blog index page n (no search, no featured post) | `blog.json` |
| `/blog/category/:slug`, `/blog/category/:slug/:n` | Category listing | `blog.json` |
| `/blog/author/:slug`, `/blog/author/:slug/:n` | Author listing | `blog.json` |
| `/blog/:slug` | Article | `blog.json` |
| `/resources` | Resources hub (4 category cards) | `resources.json` counts |
| `/resources/:type` (glossary, automation-guides, automation-use-cases, integration-use-cases) | Resource category listing | `resources.json` |
| `/resources/:type/:slug` | Resource detail | `resources.json` |
| `/privacy`, `/terms` | Legal long-form | static header copy only (§9) |

Sitemap (`/sitemap.xml`, 6,518 URLs) contains 854 `/blog/*` entries: 791 posts, 7 `/blog/category/*` and 56 `/blog/author/*`. It also contains 1,067 `/resources/*` entries: 1 hub, 4 categories, 106 glossary, 520 automation-guides, 296 automation-use-cases and 141 integration-use-cases. The live API reports 95 authors. Only 56 have sitemap entries (the rest have 0 published posts or are unlisted), but every author route works.

Pagination paths (from `D1O0IhH_.js`, verbatim logic):
- `/blog`: page 1 is `/blog`, page n is `/blog/page/n`.
- Category and author: page 1 is the base path, page n is `{base}/n`.

### 0.1 Data files (produced by `scripts/fetch-content-index.mjs`)

`src/data/blog.json` (1.07 MB minified):
```
{ source, generatedAt, note, pageSize: 12, total: 793,
  categories: [{ name, slug, count }],          // 7, in pill order (see §2.2)
  authors:    [{ id, slug, name, role, location, bio, photo, photoLocal, count }],   // 95
  posts:      [{ id, slug, title, excerpt, publishedAt, updatedAt, readingTime, type, aiGenerated, hasToc,
                 author: { name, slug, role, location, bio, photo, photoLocal },
                 categories: [{ name, slug }],
                 cover: { kind: 'image'|'generated', src, local, width:1600, height:900, leftLuma, ink:'dark'|'light', titleScale },
                 url }] }               // sorted newest first
```
`src/data/resources.json` (0.99 MB):
```
{ source, generatedAt, note, counts: { glossary:106, 'automation-guides':520, 'automation-use-cases':296, 'integration-use-cases':141 },
  types, pageSize: 24,
  items: [{ type, slug, title, excerpt, url, publishedAt, updatedAt, readingTime, related:[{type,slug}], apps:[{path,title,excerpt}], faqCount }] }
```
- `excerpt` is the listing-card text, capped at 2 sentences or 300 chars.
- Resource FAQ answers and bodies are **not** stored. Only `faqCount` is kept.
- Use `cover.local` and `author.photoLocal` at runtime. They are the original paths mirrored under `public/` (§11).
- `ink` follows the site rule: `leftLuma > .55` gives `ink-dark` (title #020618), otherwise `ink-light` (title #fff).

Sort and filter rules for the clone (the original does these server-side):
- **Index**: the featured post is `posts[0]`. The page-1 grid is the next 12. Page n (≥2) shows the 12 posts at offset `1 + (n-1)*12`, excluding the featured post. Pages = `ceil((total-1)/12)` (66 at measure time). Page-n subtitle: `Page {n} of {pages}.`
- **Category**: posts whose `categories[*].slug` includes the slug, 12 per page.
- **Author**: posts whose `author.slug` matches, 12 per page.
- **Related ("Keep reading")**: the original calls `posts?category=<first category>&excludeId=<id>&pageSize=3&related=true`, and its "related" ranking is server-side. Clone: take 3 posts from the same first category, excluding the current one. Prefer ones sharing title words, otherwise use the newest.
- **Search** (blog index only): the original queries `/api/content/posts?search=q&pageSize=24` after a **250 ms** debounce. Clone: case-insensitive match on title and excerpt, max 24.

---

## 1. Shared components

### 1.1 Page container (blog listings, article, resource detail)
`mx-auto w-full max-w-7xl px-5 pt-28 pb-24 md:px-6 md:pt-32 md:pb-32 lg:px-8`

| width | padding (t r b l) |
|---|---|
| 1440 | 128 32 128 32, content 1216 wide at x=112 |
| 768 | 128 24, content 720 |
| 390 | 112 20 96, content 350 |

The article adds `min-[90rem]:max-w-[92rem]` (1472px). Legal uses `pt-32 md:pt-40` instead (§9).

### 1.2 Hero cover (`hero-cover`): the post "image" (cards, featured post, article banner)
The original **never shows a plain cover photo**. Every cover is a background image with the post title set as live HTML text on top.

Markup:
```
div.hero-cover.relative.isolate.w-full.overflow-hidden.{ink-dark|ink-light}[.banner]  style="--title-size: X.XXcqw"
  img.absolute.inset-0.-z-10.size-full.object-cover  src=cover.local  alt="" aria-hidden  loading=lazy|eager  decoding=async
  div.col
    div.kicker.font-sans.font-semibold.uppercase   (only when a kicker is passed AND not banner)
    {h1|h2|h3}.title.font-display.font-bold.text-balance
```

CSS (from `post-card.Bc58JJ62.css`, translated; write it in the component CSS):
```css
.hero-cover{aspect-ratio:16/9;container-type:inline-size}
@media (min-width:768px){.hero-cover.banner{aspect-ratio:3}.hero-cover.banner .kicker{margin-bottom:1.6cqw}}
.hero-cover.ink-dark{--cover-ink:#020618}
.hero-cover.ink-light{--cover-ink:#fff}
.hero-cover .col{position:absolute;top:50%;left:7cqw;right:7cqw;transform:translateY(-50%)}
.hero-cover .kicker{letter-spacing:.22em;margin-bottom:2.4cqw;font-size:max(1.3cqw,9px);line-height:1.5;color:var(--cover-ink)}
.hero-cover .title{font-size:var(--title-size);letter-spacing:-.01em;line-height:1.16;color:var(--cover-ink)}
@container (max-width:560px){.hero-cover .kicker{display:none}.hero-cover .title{font-size:clamp(17px,calc(var(--title-size)*1.2),30px)}}
```

`--title-size` = `(banner ? 4.4 : 6) × titleScale` cqw, formatted with `toFixed(2)`. `titleScale` (already in `blog.json`) by title length: ≤38 → 1, ≤60 → .9, ≤85 → .78, else .68.

Measured examples:
| context | width | title size | line-height |
|---|---|---|---|
| featured, 1440 | 590 | 31.86px | 36.96 |
| 3-col card, 1440 | 377 | 24.41px (container ≤560, so ×1.2) | — |
| related card, 1440 | 435 | 28.21px | — |
| article banner, 1440 | 704 | 27.88px | — |
| article banner, 768 | 640 | 25.34px | — |
| article banner, 390 | 350 | 17px (clamp floor) | — |

Featured kicker at 1440: 9px, ls 1.98px, lh 13.5, margin-bottom 14.16px.

Background rules:
- `cover.kind === 'image'`: the post has a hero photo (`webp`, 1600×900, already made to be overlaid). Ink comes from `hero.leftLuma`.
- `cover.kind === 'generated'`: the original draws a procedural SVG at `/api/hero-bg/<slug>.svg` (1600×900, about 38 KB). 378 posts use this. These SVGs were downloaded to `public/api/hero-bg/`. Ink comes from the SVG ground colour (the indexer already computed `leftLuma` and `ink`).

### 1.3 Cover frame (around the hero cover in cards and featured)
`overflow-hidden rounded-2xl border border-ink-950/8 bg-ink-950/3 transition-transform duration-500 ease-smooth group-hover:scale-[1.02] motion-reduce:transition-none`
- Featured uses `group-hover:scale-[1.01]`.
- Border is 1px `rgba(2,6,24,.08)`. Background `rgba(2,6,24,.03)`. Radius 16.
- Hover: `scale` goes 1 → 1.02 over 500ms `cubic-bezier(.22,1,.36,1)`. Measured on hover: `scale: 1.02`.

### 1.4 Post card (`post-card`): listing grids and "Keep reading"
```
article.group.flex.flex-col
  a.flex.flex-col.gap-4.rounded-2xl.outline-none.focus-visible:outline-2.focus-visible:outline-offset-4.focus-visible:outline-primary-700  href=/blog/{slug}
    div(cover frame §1.3) > hero-cover (tag h3, no kicker, lazy)
    div.flex.flex-col.gap-2
      p.text-xs.font-medium.text-primary-800        → first category name    12/16 #00598a 500
      p.line-clamp-2.text-sm.leading-relaxed.text-ink-600  → excerpt (omit if empty)  14/22.75 #45556c
      p.mt-1.flex.flex-wrap.items-center.gap-x-2.text-xs.text-ink-500 → author · date · readingTime  12/16 #62748e
```
- Meta separators are `<span aria-hidden>·</span>`. Gap-x 8.
- Date format is `toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})`, giving "Oct 16, 2026".
- Card height at 1440 (3-col, 378.66 wide) is 327: cover 214, gap 16, info 97. Without an excerpt it is 274.

### 1.5 Category pills (`nav[aria-label=Categories]`)
`flex flex-wrap gap-2`. Each pill is an `a`: `rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700`.
- Active: `border-ink-900 bg-ink-900 text-white`, with `aria-current=page`.
- Inactive: `border-ink-950/10 text-ink-600 hover:bg-ink-950/4 hover:text-ink-900`.
- Box 34px tall, padding 6/14, 14/20 weight 500, radius full.
- Order: **All**, Automation software, Automation thoughts, Automation tutorials, Company, Engineering, Guides (By AI), Product. Pill widths at 1440: All 47, Automation software 169, Product 83.
- Wraps to 2 rows at 768 (nav 76 tall) and 5 rows at 390 (nav 160 tall).
- Transition: color, bg and border 200ms `cubic-bezier(.4,0,.2,1)`.

### 1.6 Pagination (`nav[aria-label=Pagination]`, wrapped in `div.mt-12.flex.justify-center`)
- Item: `inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors duration-200`, 36px tall, radius 8.
- Normal: `border-ink-950/10 text-ink-600 hover:bg-ink-950/4 hover:text-ink-900`.
- Current: `border-ink-900 bg-ink-900 text-white`.
- Disabled Prev/Next: `pointer-events-none border-transparent text-ink-300` (#cad5e2).
- Gap: `span.px-1.text-sm.text-ink-400` "…".
- Order: `Previous`, the page list, `Next`. Show page p when `|p-current|≤1 || p===1 || p===last`. Insert a single "…" for each run of skipped pages. Render nothing when pages ≤ 1.
- Page 1 of 66 reads: Previous(disabled) 1 2 … 66 Next. Nav is 317 wide.

### 1.7 Search input
- Blog: `div.relative` with an icon `solar:magnifer-linear` (`absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-400`). Input `w-full rounded-xl border border-ink-950/10 bg-white py-3 pr-4 pl-11 text-ink-900 transition-colors duration-200 outline-none placeholder:text-ink-400 focus:border-ink-950/30`, `type=search`, placeholder "Search posts", 50px tall.
- Resources: `label.relative.block`, icon `size-5 text-ink-600`. Input `py-3.5 … placeholder:text-ink-500 focus:border-ink-950/40`, 54px tall. Placeholders: "Search terms" (glossary), "Search by app or task" (others).

### 1.8 Empty states
- **Blog** (`empty-state`): `div.rounded-2xl.border.border-dashed.border-ink-950/12.px-6.py-20.text-center.mt-12` > `p.text-ink-600` message + `p.mx-auto.mt-2.max-w-sm.text-sm.leading-relaxed.text-ink-500` hint. Search miss: "Nothing matches that search." / "Try a shorter word, or clear the box to browse everything."
- **Resources**: `div.flex.flex-col.items-center.py-14.text-center.md:py-20` > `h2.max-w-xl.text-xl.font-semibold.text-balance.text-ink-950.md:text-2xl` "No terms match “q”" + `p.mt-3.max-w-md.text-[15px].text-pretty.text-ink-600` + a secondary button (`h-11 px-6 text-[15px]`, ink-50 + shadow-edge) that clears the search.

### 1.9 Share buttons (from `DImJtvCM.js`)
Three buttons: X (`simple-icons:x`), LinkedIn (`simple-icons:linkedin`), Copy link (`solar:link-linear`, which switches to `solar:check-read-linear` while "Link copied").
- X: `https://x.com/intent/tweet?text={title}&url={canonical}`.
- LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url={canonical}`.
- Both open with `target=_blank rel="noopener noreferrer"`.
- **Compact** (article meta row): `inline-flex size-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-950/5 hover:text-ink-900`, gap 2px. Measured hover: color #0f172b, bg `rgba(2,6,24,.05)`.
- **Bordered** (bottom "Share" row): `inline-flex size-9 rounded-lg border border-ink-950/10 bg-white text-ink-600 hover:bg-ink-950/4 hover:text-ink-900`, gap 8, preceded by `span.mr-1.text-sm.text-ink-500` "Share".
- Icons are `size-4`.

### 1.10 TOC "On this page" (`table-of-contents`; article left rail and resource detail right rail)
```
nav[aria-label="On this page"].flex.min-h-0.flex-col.gap-3
  button.group.flex.w-full.items-center.justify-between.gap-2.rounded-md.text-left.text-sm.font-medium.text-ink-900.hover:text-ink-950  aria-expanded aria-controls=toc-list
     "On this page" + icon solar:alt-arrow-down-linear size-4 text-ink-500 group-hover:text-ink-700 transition-transform 200ms ease-smooth; add `-rotate-90` when collapsed
  ul#toc-list.flex.max-h-[calc(100vh-16rem)].min-h-0.flex-1.flex-col.overflow-y-auto.border-l.border-ink-950/10   (v-show; default open)
    li > a.-ml-px.block.border-l-2.py-1.5.text-sm.leading-snug.transition-colors.duration-200.outline-none  pl-4 (depth 3: pl-7)
         active:   border-primary-700 font-medium text-ink-900
         inactive: border-transparent text-ink-600 hover:border-ink-950/25 hover:text-ink-900
```
- Link box: 14/19.25, padding 6 0 6 16, margin-left −1, 31px per row. The left rule is 1px `ink-950/10`, and the active indicator is a 2px #0069a8 left border.
- Measured hover: color #0f172b, border `rgba(2,6,24,.25)`.
- **Scroll-spy**: an IntersectionObserver on every heading id, `rootMargin: '-96px 0px -70% 0px'`, `threshold: 0`. Keep a map of intersecting ids to `boundingClientRect.top`. The active id is the one with the smallest top. If nothing is intersecting, keep the previous id.
- Render the TOC only when it has **≥3 entries**. Entries come from the body's h2s (id and text).
- Headings use `scroll-margin-top: 7rem` (112px). `<html>` has `scroll-behavior: smooth` (CLONE_SPEC §0.5).

### 1.11 Breadcrumb
- **Article**: `nav[aria-label=Breadcrumb].mb-3.flex.min-w-0.flex-nowrap.items-center.gap-2.text-[13px].text-ink-500` (13/19.5, #62748e). Items are links `inline-flex min-h-11 shrink-0 items-center rounded-md transition-colors duration-200 ease-out hover:text-ink-950 md:min-h-0`, separated by `solar:alt-arrow-right-linear size-3 shrink-0 text-ink-500`.
  - Trail: "Blog" → `/blog`, then the first category name → `/blog/category/{slug}`. There is no current-page crumb.
  - At 390 the links are 44px tall (`min-h-11`). At ≥768 they are 20.
- **Resources** (category hero and detail): `text-sm text-ink-600 flex flex-wrap items-center gap-2`, separator `size-3.5 text-ink-500`. The current crumb is `span.min-w-0.truncate.font-medium.text-ink-900`. The category hero version adds `justify-center hero-line`.

### 1.12 Resource card (listing, "More …", "Apps in this guide")
```
a.group.flex.h-full.flex-col.gap-2.rounded-2xl.bg-white.p-6.shadow-edge.transition-shadow.duration-200.ease-out.hover:shadow-edge-hover.motion-reduce:transition-none
  span.flex.items-start.gap-1.5.text-lg.font-semibold.text-balance.text-ink-900   title + icon solar:alt-arrow-right-linear mt-1.5 size-4 shrink-0 text-ink-600 transition-transform 200ms ease-out group-hover:translate-x-0.5
  span.line-clamp-3.text-[15px].text-ink-600   excerpt (15/22.5)
```
- Size 392×152 at 1440 (3-col). Padding 24, radius 16.
- Shadow goes from `shadow-edge` to `shadow-edge-hover` (measured exactly as in CLONE_SPEC §0.2) over 200ms `cubic-bezier(0,0,.2,1)`.
- Grid: `grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3`. Gap is 20 at ≥768 and 16 below. Apps grid uses `lg:grid-cols-4` (289 wide cards).

### 1.13 FAQ accordion (resources pages)
```
section.px-5.py-24.md:px-6.md:py-32.lg:px-8          (padding 128/32 at 1440, 96/20 at 390)
  div.mx-auto.max-w-3xl                                (768)
    div.mb-5.md:mb-8 > h2.font-display.text-3xl.font-bold.text-balance.text-ink-900.md:text-4xl   (36/40 ≥768, 30/36 mobile)
    div.flex.flex-col.gap-3
      div.rounded-2xl.bg-white.px-5.shadow-edge.sm:px-6
        button.flex.w-full.cursor-pointer.items-center.justify-between.gap-6.py-5.text-left  aria-expanded
          span.text-lg.font-semibold.text-ink-900  question (18/28)
          icon solar:add-linear size-5 shrink-0 text-ink-600 transition-transform duration-200 (+ rotate-45 when open)
        div (display:none when closed — no height animation)
          p.pb-5.text-base.text-ink-600  answer
```
- The **first item is open by default**. Others are closed. Rows are independent (several can be open at once).
- Closed row is 68px tall. Icon rotation (+ to ×) takes 200ms.
- Index FAQ copy (hub-level UI copy, OK to reproduce) is in §7.3. Detail-page FAQs come from the body and are **not** stored. Render them as 3 placeholder Q&As, or omit the section.

### 1.14 Footer closing copy (existing Footer, set via `usePageClosing({h2, lede})`)
| pages | h2 | lede |
|---|---|---|
| all `/blog*` | Read about it, then go and build it yourself. | Everything we write about is in the product. Free to start, cloud or your own servers. |
| all `/resources*` | Put what you read into practice today. | Free to start with no card. Open source, on our cloud or your own servers. |
| `/privacy` | Keep your data where you want it. | Start free with no card, on our cloud in Frankfurt or on servers you run yourself. |
| `/terms` | Make something this afternoon. | Start free with no card, on our cloud in Frankfurt or on servers you run yourself. |

---

## 2. `/blog` (index, page 1)

### 2.1 Structure (1440; y values are relative to page top)
```
div(container §1.1)
  header.flex.flex-col.gap-3                                  y128 h128
    h1.font-display.text-5xl.font-bold.text-balance.text-ink-900.md:text-6xl   "The Activepieces blog"   60/60 (48/48 <768) #0f172b
    p.max-w-2xl.text-xl.text-balance.text-ink-600   "Guides, product updates and practical walkthroughs for building automations and AI agents."  20/28, max-w 672
  div.mt-8.flex.flex-col.gap-5                                y288
    search (§1.7) [+ p.text-sm.text-ink-500[aria-live=polite] "{n} post(s) matching “{q}”" while searching]
    category pills (§1.5)                                     y358
  ── when NOT searching ──
  div.mt-12 > featured (2.3)                                  y440 h334
  div.mt-12.grid.grid-cols-1.gap-10.sm:grid-cols-2.lg:grid-cols-3   12 post cards   y822
  div.mt-12.flex.justify-center > pagination
  ── when searching (debounce 250ms) ──
  div.mt-12.grid … (same grid, up to 24 results) | empty-state "Nothing matches that search." (no featured, no pagination)
```
Page height (main) is 2,463 at 1440.

| width | grid columns | gap |
|---|---|---|
| 1440 | 378.66 ×3 | 40 |
| 768 | 340 ×2 | 40 |
| 390 | 350 ×1 | 40 |

Card cover sizes: 377×212 at 1440, 338×190 at 768, 348×196 at 390.

### 2.2 Copy
- Title: "The Activepieces blog". Subtitle as above.
- Page n ≥ 2 (`/blog/page/n`): same h1, subtitle "Page {n} of {pages}.", no search, no featured post. Pills with "All" active. Grid and pagination follow.

### 2.3 Featured post (latest post)
```
a.group.grid.grid-cols-1.gap-8.rounded-3xl.outline-none.focus-visible:outline-2.focus-visible:outline-offset-4.focus-visible:outline-primary-700.lg:grid-cols-2.lg:items-center
  div(cover frame, group-hover:scale-[1.01]) > hero-cover (tag h2, kicker = first category name, eager, fetchpriority high)
  div.flex.flex-col.gap-4
    p.text-xs.font-medium.tracking-wide.text-primary-800     category  (12/16, ls .3px, #00598a)
    p.line-clamp-3.text-lg.leading-relaxed.text-ink-600      excerpt   (18/29.25)
    p.flex.flex-wrap.items-center.gap-x-2.text-sm.text-ink-500   author · "October 16, 2026" (month: 'long') · "11 min read"   (14/20 #62748e)
```
| width | columns | size |
|---|---|---|
| 1440 | 592 / 592, gap 32 | cover 590×332; right column vertically centred (y529, h156) |
| 768 | 1 column | cover 718×404, title 38.77px |
| 390 | 1 column | cover 348×196, kicker hidden, title clamp |

---

## 3. `/blog/category/:slug`

Same container. Header:
```
header.flex.flex-col.gap-3
  p.text-sm.text-ink-600  "Blog"
  h1.font-display.text-4xl.font-bold.text-balance.text-ink-900.capitalize.md:text-5xl   category name   (48/48 ≥768, 36/40 mobile)
  p.text-ink-600  "{count} posts"     (16/24)
div.mt-8 > category pills (current one active; "All" inactive)
div.mt-12.grid … post cards (12/page)
pagination (base /blog/category/{slug})
```
No search and no featured post. At 1440: header y128 h116, pills y276, grid y358.

## 4. `/blog/author/:slug`

```
header.flex.flex-col.gap-5.sm:flex-row.sm:items-center
  img.size-18.shrink-0.rounded-full.border.border-ink-950/8.object-cover   72×72  (author.photoLocal)
  div.flex.flex-col.gap-2
    p.text-sm.text-ink-600 "Author"
    h1.font-display.text-4xl.font-bold.text-balance.text-ink-900.md:text-5xl   name
    p.text-ink-600  role            (only if role, e.g. "Contributor")
    p.text-sm.text-ink-500 "{count} posts"
div.mt-12.grid … post cards ;  pagination (base /blog/author/{slug})
```
No pills. At 1440: header 1216×104, image centred vertically, text column at x204. At 390 the header stacks (img, then text). The h1 is 36/40.

---

## 5. `/blog/:slug` (article)

### 5.1 Layout skeleton
```
div.mx-auto.w-full.max-w-7xl.px-5.pt-28.pb-24.md:px-6.md:pt-32.md:pb-32.lg:px-8.min-[90rem]:max-w-[92rem]
  reading progress bar (5.7)
  div.flex.justify-center.gap-10.min-[90rem]:gap-14
    aside.hidden.w-52.shrink-0.xl:block.min-[90rem]:w-60          ← only if TOC has ≥3 entries
      div.sticky.top-28.flex.max-h-[calc(100vh-9rem)].flex-col.gap-6 > TOC (§1.10)
    article.w-full.max-w-[40rem].min-w-0.min-[90rem]:max-w-[46rem]
      breadcrumb (§1.11)
      header (5.2) ; meta row (5.3) ; div.mt-7 > body (5.5/5.6) ; share row (5.4) ; div.mt-8 > closing card (5.8)
    aside.hidden.w-[17rem].shrink-0.lg:block.min-[90rem]:w-[20rem]
      div.sticky.top-28 > sidebar CTA card (5.9)
  div.mt-16 > "Keep reading" (5.10)
```
Measured geometry:

| width | left rail | article | right rail | notes |
|---|---|---|---|---|
| 1440 | x32 w240 | x328 w704 (flex-shrunk from 736) | x1088 w320 | gaps 56; all sticky at top 112 |
| 1280–1439 | w208 | max 640 | w272 | gaps 40 |
| 1024–1279 | hidden | — | visible | |
| 768 | hidden | 640 centred (x64) | hidden | |
| 390 | hidden | 350 | hidden | |

- With no TOC (e.g. `image-ocr`, which has no h2s): no left aside, so article plus right rail are centred (article x164 w736 at 1440).
- **There is no mobile or tablet TOC**. Below 1280 the TOC simply disappears.

### 5.2 Article header
`header.flex.flex-col.gap-5`:
- Hero cover **banner**: `hero-cover … banner rounded-2xl ring-1 ring-ink-950/10`, eager, tag `h1`, no kicker.
  - Aspect 3:1 at ≥768: 704×235 at 1440, 640×213 at 768.
  - Aspect 16:9 below 768: 350×197.
- `p.max-w-2xl.text-lg.leading-relaxed.text-ink-600` = excerpt (18/29.25, max-w 672).
  - The original hides it when the body starts with a TL;DR `aside.tldr`. The clone has no real body, so **always show the excerpt**. Keep the placeholder TL;DR (§5.6) below it.

### 5.3 Meta row
```
div.mt-4.border-b.border-ink-950/10.pb-4
  section[aria-label="About this article"].flex.items-center.justify-between.gap-4
    div.flex.min-w-0.flex-wrap.items-center.gap-x-3.gap-y-0.5
      div.group/author.relative.flex.items-center.gap-2.5
        img.size-8.rounded-full.border.border-ink-950/8.object-cover          32×32 author photo
        a.text-sm.font-semibold.whitespace-nowrap.text-ink-900.underline-offset-4.hover:underline  → /blog/author/{slug}
        icon solar:verified-check-bold size-4 shrink-0 text-accent-a-700 (#007a55) aria-label=Verified    ← only if aiGenerated
        popover (below)
      p.flex.min-w-0.items-center.gap-2.text-sm.text-ink-500 [first child hidden <640]
        span.text-ink-300 "·" · span.whitespace-nowrap "Oct 16, 2026" · span.text-ink-300 "·" · span "11 min read"
    div.flex.shrink-0.items-center
      div.flex.items-center.gap-0.5.max-sm:hidden > compact share (§1.9)
      span.mx-1.h-4.w-px.bg-ink-950/10.max-sm:hidden
      button[aria-label="Spotted something wrong?"] size-8 rounded-lg text-ink-500 hover:bg-ink-950/5 hover:text-ink-900 > solar:flag-linear size-4
```
- At 390 the share icons and divider are hidden, so only the flag stays. The meta wraps to 2 lines (block 54px tall).
- The flag opens a "Report an error" `<dialog>` form on the original. Clone: make it a link to the original article URL (`post.url`), or omit it. See §12.

**Author popover**:
- Classes: `invisible absolute top-full left-0 z-20 mt-2 w-[min(20rem,calc(100vw-2.5rem))] rounded-xl bg-white p-4 opacity-0 shadow-lift ring-1 ring-ink-950/8 transition-opacity duration-200 group-hover/author:visible group-hover/author:opacity-100 group-focus-within/author:visible group-focus-within/author:opacity-100`.
- 320 wide at 1440. Measured: opacity 0 → 1, visibility hidden → visible.
- Contents:
  - `p.font-display.text-base.font-bold.text-ink-900` name.
  - `p.text-xs.text-ink-500` role (if any).
  - `p.mt-2.text-[13px].leading-snug.text-ink-600` bio (if any; 13/17.875).
  - If aiGenerated: `p.mt-3.flex.gap-1.5.border-t.border-ink-950/8.pt-3.text-xs.leading-snug.text-ink-700` with `solar:verified-check-bold mt-px size-3.5 text-accent-a-700` and the text "This article was researched and fact-checked by an advanced research system."
  - The original also links `@discourseUsername` (`mt-2 inline-block text-xs text-primary-800 hover:underline`). That field is not in the index, so omit it.

### 5.4 Bottom share row
`div.mt-8.flex.flex-wrap.items-center.justify-between.gap-4.border-t.border-ink-950/10.pt-6` > "Share" plus bordered buttons (§1.9). 61px tall.

**Clone addition** (not on the original; required by the content policy): place it directly after the body, before the share row. Use this markup:
```
a.mt-10.inline-flex.items-center.gap-1.5.text-[15px].font-semibold.text-primary-800.underline.decoration-primary-800/35.underline-offset-[3px].hover:decoration-current
  "Read the full article on activepieces.com" + solar:arrow-right-up-linear size-4   (href = post.url, target _blank)
```
It uses the prose link colours from §5.6. The icon already exists in `public/icons/solar/`.

### 5.5 Body chunking (original behaviour, for fidelity of the placeholder)
- The original splits the HTML at every `<h2>` into sibling `div.blog-prose` chunks. Each chunk is the content from one h2 up to the next.
- It inserts `div.blog-prose.blog-prose-inline` "anchor CTA" paragraphs: one after chunk 1 when there are ≥3 chunks, and one mid-article when the HTML is ≥12,000 chars, at the h2 boundary closest to 50% of length (between 35% and 70%, at index ≥3).
- An inline anchor is `<p>{lead} <a href="{signup}">{link}</a></p>`. Its first child gets `margin-top:1.25rem` via `.blog-prose-inline>:first-child`.
- Default copy: lead "Everything below works on Activepieces' free plan." / link "Start without code or a credit card."
- Clone: render the placeholder as chunks the same way, and include one inline anchor after the first chunk. Link it to `https://cloud.activepieces.com/sign-up` (an outbound link is fine).

### 5.6 Prose tokens: `.blog-prose` (verbatim rules, translated to clone tokens)
Put this in the article CSS. All values below were also confirmed by computed style at 1440, 768 and 390. The only responsive rule is the pull quote.

```css
.blog-prose{color:#314158;overflow-wrap:break-word;font-size:1.0625rem;line-height:1.75}          /* 17px / 29.75px */
.blog-prose>:first-child{margin-top:0}
.blog-prose.blog-prose-inline>:first-child{margin-top:1.25rem}
.blog-prose h2,.blog-prose h3,.blog-prose h4{font-family:Sentient,"Sentient Fallback: Georgia",ui-serif,Georgia,serif;color:#0f172b;letter-spacing:-.015em;text-wrap:balance;scroll-margin-top:7rem;font-weight:700}
.blog-prose h2{margin-top:3rem;margin-bottom:1rem;font-size:1.875rem;line-height:1.2}              /* 30/36, mt 48 (0 when first child), mb 16, ls -.45px */
.blog-prose h3{margin-top:2.25rem;margin-bottom:.75rem;font-size:1.375rem;line-height:1.3}         /* 22/28.6, mt 36, mb 12, ls -.33px */
.blog-prose h4{margin-top:1.75rem;margin-bottom:.5rem;font-size:1.125rem}                          /* 18, lh inherits 1.75 */
.blog-prose p{margin-block:1.25rem}                                                                  /* 20 */
.blog-prose a{color:#00598a;text-underline-offset:3px;text-decoration:underline;text-decoration-color:rgba(0,89,138,.35);transition:text-decoration-color .2s cubic-bezier(.22,1,.36,1);font-weight:500}
.blog-prose a:hover{text-decoration-color:currentColor}
.blog-prose strong{color:#0f172b;font-weight:600}
.blog-prose ol,.blog-prose ul{margin-block:1.25rem;padding-left:1.4rem}                              /* 22.4 */
.blog-prose ul{list-style-type:disc}
.blog-prose ol{list-style-type:decimal}
.blog-prose li{margin-block:.4rem;padding-left:.25rem}                                               /* 6.4 / 4 */
.blog-prose ul>li::marker{color:#00a6f4}                                                             /* primary-500 */
.blog-prose ol>li::marker{font-family:Sentient,Georgia,serif;color:#0069a8;font-weight:700}          /* primary-700 */
.blog-prose:not(.blog-prose-inline)>p:first-child,.blog-prose>.tldr+p{color:#1d293d;font-size:1.1875rem;line-height:1.7}   /* lead: 19/32.3 */
.blog-prose blockquote{font-family:Sentient,Georgia,serif;color:#0f172b;margin-block:2.5rem;padding:.25rem 0 .25rem 3.5rem;font-size:1.25rem;line-height:1.6;position:relative}
.blog-prose blockquote:before{content:"“";font-family:Sentient,Georgia,serif;background:linear-gradient(135deg,#0084d1,#00bc7d);color:transparent;-webkit-background-clip:text;background-clip:text;font-size:5rem;font-weight:700;line-height:1;position:absolute;top:-.6rem;left:0}
.blog-prose blockquote p:first-child{margin-top:0}
.blog-prose blockquote p:last-child{margin-bottom:0}
.blog-prose .tldr{border-radius:16px;background:#f0f9ff;outline:1px solid rgba(2,6,24,.10);outline-offset:-1px;margin:0 0 2.5rem;padding:1.5rem 1.75rem}
.blog-prose .tldr .tldr-label{letter-spacing:.12em;text-transform:uppercase;color:#00598a;margin:0 0 .625rem;font-size:.6875rem;font-weight:700}   /* 11px, ls 1.32px, lh 17.05 */
.blog-prose .tldr p{letter-spacing:-.005em;color:#0f172b;margin:0;font-size:1.125rem;line-height:1.55}
.blog-prose .tldr ul{margin:.875rem 0 0}
.blog-prose .tldr li{margin-block:.25rem;font-size:.9375rem;line-height:1.55}                        /* 15/23.25 */
.blog-prose blockquote.pull{border-top:1px solid rgba(2,6,24,.10);border-bottom:1px solid rgba(2,6,24,.10);font-family:Sentient,Georgia,serif;letter-spacing:-.015em;text-align:center;color:#0f172b;text-wrap:balance;margin-block:3.5rem;padding:4.5rem .5rem 2rem;font-size:1.5rem;font-weight:700;line-height:1.38}
.blog-prose blockquote.pull:before{font-size:6.5rem;top:1rem;left:50%;transform:translate(-50%)}
@media (min-width:768px){.blog-prose blockquote.pull{padding:5.75rem 2rem 2.5rem;font-size:1.875rem}.blog-prose blockquote.pull:before{font-size:8.5rem}}
.blog-prose img{border-radius:16px;outline:1px solid rgba(2,6,24,.10);outline-offset:-1px;width:100%;height:auto;margin-block:2rem;display:block}
.blog-prose hr{border:0;border-top:1px solid rgba(2,6,24,.10);margin-block:3rem}
.blog-prose :not(pre)>code{font-family:"Fira Code",ui-monospace,SFMono-Regular,Menlo,monospace;color:#1d293d;background:rgba(2,6,24,.06);border-radius:.3rem;padding:.15em .35em;font-size:.875em}
.blog-prose pre{border-radius:12px;background:#020618;color:#f1f5f9;margin-block:1.75rem;padding:1.15rem 1.25rem;font-size:.875rem;line-height:1.7;overflow-x:auto}
.blog-prose pre code{font-family:"Fira Code",ui-monospace,monospace;color:inherit;background:0 0;padding:0}
.blog-prose table{border-collapse:collapse;width:100%;margin-block:2rem;font-size:.95rem;display:block;overflow-x:auto}   /* 15.2/26.6 */
.blog-prose td,.blog-prose th{text-align:left;border-bottom:1px solid rgba(2,6,24,.10);padding:.7rem .9rem}             /* 11.2 / 14.4 */
.blog-prose th{letter-spacing:.02em;color:#0f172b;background:#f0f9ff;border-bottom-color:rgba(2,6,24,.20);font-size:.8125rem;font-weight:600}   /* 13px */
.blog-prose td{font-variant-numeric:tabular-nums}
/* Prism tokens inside pre */
.blog-prose .token.comment,.blog-prose .token.prolog,.blog-prose .token.doctype,.blog-prose .token.cdata{color:#62748e}
.blog-prose .token.punctuation{color:#90a1b9}
.blog-prose .token.property,.blog-prose .token.tag,.blog-prose .token.constant,.blog-prose .token.symbol,.blog-prose .token.deleted{color:#ffa2a2}
.blog-prose .token.boolean,.blog-prose .token.number{color:#ffd230}
.blog-prose .token.selector,.blog-prose .token.attr-name,.blog-prose .token.string,.blog-prose .token.char,.blog-prose .token.builtin,.blog-prose .token.inserted{color:#5ee9b5}
.blog-prose .token.operator,.blog-prose .token.entity,.blog-prose .token.url{color:#b8e6fe}
.blog-prose .token.atrule,.blog-prose .token.attr-value,.blog-prose .token.keyword{color:#74d4ff}
.blog-prose .token.function,.blog-prose .token.class-name{color:#c4b4ff}
```
Also note:
- Global `p { text-wrap: pretty }` is inherited from `<html>`.
- `em` renders as italic Inter.
- The tldr `aside` holds `p.tldr-label` "Summary", a `p` sentence and a `ul`.

Measured boxes:
| element | 1440 | 390 |
|---|---|---|
| tldr | 704×273 | 350×445 |
| pull quote | 704×258 (30/41.4, padding 92/32/40) | 24/33.12, padding 72/8/32 |
| table | 704 wide, `display:block` with horizontal scroll | 350 wide |
| img | 704 wide, about 393 tall | — |

Pull-quote `::before` at 1440: 136px gradient “ at top 16, centred.

**Placeholder body**. Render this in the clone for every post, inside `div.mt-7`, as chunked `div.blog-prose` blocks. Use neutral lorem-style copy about automation; never copy article text. It must contain, in order:
1. `aside.tldr` with `p.tldr-label` "Summary", one `p` and a 3-item `ul`.
2. A lead `p` (the `.tldr + p` style), then 2 `p`.
3. Inline anchor CTA (§5.5).
4. `h2` + `p` with an inline `a` and a `strong` + `h3` + `p` + `ul` (4 items) + `p` with inline `code`.
5. `h2` + `p` + `blockquote.pull` (1 `p`) + `h3` + `ol` (3 items) + `img` (use the post cover `cover.local`, alt "").
6. `h2` + `p` + `table` (thead 3 `th`, 3 body rows) + `blockquote` (plain) + `pre > code` (6–8 lines of JSON or JS, optionally with Prism-like token spans) + `hr` + `h4` + `p`.
7. `h2` "Frequently asked questions" + `h3` + `p` (×2).

This gives ≥3 h2s, so the left TOC renders. TOC labels come from these h2s.

### 5.7 Reading progress bar
```
div[role=progressbar][aria-label="Reading progress"].pointer-events-none.fixed.inset-x-0.top-0.z-120.h-0.5   (2px, above the header)
  div.h-full.origin-left.bg-primary-700.transition-transform.duration-100.ease-out.motion-reduce:transition-none  style="transform:scaleX(p)"
```
- Formula (verbatim): `el = target`, `p = clamp((scrollY + innerHeight − el.offsetTop) / (el.offsetHeight + innerHeight × .2), 0, 1)`.
- Recompute on scroll and resize (passive listeners, rAF-throttled). Set `aria-valuenow = round(p×100)`.
- The original passes the first `.blog-prose` as `target`, so the bar fills after the first chunk. That is a bug. **Use the whole body wrapper (`div.mt-7`) in the clone.**
- Colour #0069a8. Transition 100ms `cubic-bezier(0,0,.2,1)`.

### 5.8 Closing card (end of article)
```
div.mt-8 > section.close.relative.isolate.overflow-hidden.rounded-2xl.ring-1.ring-ink-950/10.{ink-dark|ink-light}  aria-label="Get started with Activepieces"
  img.absolute.inset-0.-z-10.size-full.object-cover  (same cover background as the post, lazy)
  div.max-w-lg.p-7.md:p-9                                         (padding 36 ≥768, 28 mobile; max-w 512)
    p.text-xs.font-semibold.tracking-[0.22em].uppercase            "Get started"   12/16 ls 2.64px, color var(--close-ink)
    p.mt-3.font-display.text-2xl.leading-tight.font-bold.text-balance.md:text-3xl   "Automate this without code."  30/37.5 (24/30 mobile), var(--close-ink)
    p.mt-2.5.text-sm.leading-relaxed                               "Cloud or your own servers."  14/22.75, var(--close-quiet)
    a.mt-6.inline-flex.items-center.gap-1.5.rounded-full.bg-primary-700.px-6.py-3.text-sm.font-semibold.text-white.transition-colors.duration-200.hover:bg-primary-800   "Start free" + span "→"   (131×44)
    a.mt-6.ml-4.inline-flex.items-center.text-sm.font-semibold.underline.decoration-2.underline-offset-4.opacity-80.transition-opacity.duration-200.hover:opacity-100   "Talk to sales" → /sales   (color var(--close-ink))
```
- Ink variables: `.ink-dark{--close-ink:#020618;--close-quiet:rgba(2,6,24,.65)}` and `.ink-light{--close-ink:#fff;--close-quiet:rgba(255,255,255,.75)}`.
- Card height: 238 at 1440 and 768, 245 at 390.
- Copy variants (the original picks by slug and title regex; implement them): pricing `/pricing|how-much|-costs?$|cost-of-/`, comparison `/\bvs\b|-vs-|alternative|competitor|compare|comparison|\bbest-\d|top-\d/`, how-to `/how-to|^how-|guide|tutorial|automate|automation-for|connect-|integrate|examples?$/`, else default. Test them against `"${slug} ${title}".toLowerCase()`.

| intent | eyebrow | headline | body | primary |
|---|---|---|---|---|
| default | Get started | Automate this without code. | Cloud or your own servers. | Start free |
| how-to | Build it | Set this up in minutes. | No code required. Connect your accounts, and Activepieces runs it from there. | Start free |
| comparison | Still comparing | The fastest way to settle it is to build something. | Open source under MIT, so you can self-host the same thing later. | Start free |
| pricing | Running the numbers | See what the same workload costs here. | Free forever plan, and every paid plan self-hosts at no extra cost. | See pricing → /pricing |

Inline anchors by intent:
| intent | anchor (lead / link) | anchorMid (lead / link) |
|---|---|---|
| default | "Everything below works on Activepieces' free plan." / "Start without code or a credit card." | "Easier to see it running than to read about it:" / "set it up free, no card." |
| how-to | "This takes minutes, not a project:" / "automate it in Activepieces free." | "You can follow the rest of this with the builder open." / "Start free, no card." |
| comparison | "The fastest way to settle a shortlist is to try one." / "Activepieces is free to try, no credit card." | "Reading a table only gets you so far." / "Build the same workflow in Activepieces and compare it yourself." |
| pricing | "If you are running this arithmetic for your own team," / "see what the same workload costs on Activepieces." | "Worth checking against a plan that does not meter every step:" / "one credit covers a whole run on Activepieces." |

### 5.9 Right-rail CTA card (lg+, sticky top-28)
```
a.group.relative.isolate.block.overflow-hidden.rounded-2xl.bg-accent-a-100.transition-[box-shadow,transform].duration-300.ease-smooth.hover:-translate-y-0.5.hover:shadow-lift   href=https://cloud.activepieces.com/sign-up
  img.absolute.inset-0.-z-10.size-full.object-cover.object-bottom  src=/panel/meadow-640.webp  opacity .7  filter: saturate(.72) brightness(1.04) contrast(.98)
  div.p-3.pb-2
    div.rounded-xl.bg-white/80.p-4.backdrop-blur-md                (296×204 at 1440; bg rgba(255,255,255,.8), blur 12px)
      span[role=img][aria-label=Activepieces].relative.mb-3.5.block.aspect-[945/147].h-4    (103×16)
        span.logo-layer.bg-ink-950  mask /brand/activepieces-wordmark.svg
        span.logo-layer.bg-primary-700 mask /brand/activepieces-logomark.svg
      p.text-xl.leading-snug.font-semibold.text-ink-950   "Build AI agents that do the work in your apps. " + span.font-display.font-normal.italic.whitespace-nowrap.text-primary-800 "Free to start."   (20/27.5; italic is Sentient 400 italic)
      span.mt-4.flex.w-full.items-center.justify-between.rounded-lg.bg-ink-950.py-3.pr-3.5.pl-4.text-sm.font-medium.text-white.transition-colors.duration-200.group-hover:bg-primary-900
        "Build my agent free" + icon solar:alt-arrow-right-linear size-4 transition-transform 300ms ease-smooth group-hover:translate-x-0.5
  div.bots  (5 bot avatars, §5.11)
```
- Card 320×264 at 1440. Background #d0fae5.
- `.logo-layer{position:absolute;inset:0;mask-position:50%;mask-size:contain;mask-repeat:no-repeat}` (with `-webkit-` prefixes).
- Hover: lifts −2px (`translate`) and gains `shadow-lift`, over 300ms `cubic-bezier(.22,1,.36,1)`.
- Font: `public/_nuxt/sentient-400-italic.6JjT30BJ.woff2` was downloaded. Add `@font-face{font-family:Sentient;src:url(/_nuxt/sentient-400-italic.6JjT30BJ.woff2) format('woff2');font-weight:400;font-style:italic;font-display:swap}` in the page CSS. Without it the browser synthesises the italic.

### 5.10 "Keep reading"
`div.mt-16 > section.border-t.border-ink-950/10.pt-10` > `h2.font-display.text-2xl.font-bold.text-ink-900` "Keep reading" (24/32) + `div.mt-8.grid.grid-cols-1.gap-8.sm:grid-cols-2.lg:grid-cols-3` with 3 post cards (§1.4).
- The section spans the full container (outside the 3-column flex): 1376 wide at 1440 (cards 437 wide, 32 gap), 720 at 768 (2 columns of 344), 350 at 390.

### 5.11 Motion (article)
- **Bots peek** (`.bots{display:flex;justify-content:space-evenly;height:2.5rem;position:relative;overflow:hidden}`):
  - Bots are `.bot{width:2.75rem;height:2.75rem;border-radius:.75rem;transform:translateY(85%);transition:transform .35s cubic-bezier(.34,1.56,.64,1);animation:peek 5s cubic-bezier(.34,1.56,.64,1) infinite;animation-delay:calc(var(--i)*.9s)}`.
  - `@keyframes peek{0%,30%,100%{transform:translateY(85%) rotate(0)}10%{transform:translateY(18%) rotate(-8deg)}16%{transform:translateY(22%) rotate(6deg)}22%{transform:translateY(18%) rotate(0)}}`.
  - On card hover: `.group:hover .bot{transform:translateY(12%) rotate(calc((var(--i) - 2)*4deg));transition-delay:calc(var(--i)*40ms);animation:none}`.
  - Reduced motion: no animation, `translateY(40%)`.
  - Order and `--i`: atlas 0, ember 1, dorian 2, beacon 3, cinder 4. Source `/avatars/bots/{name}.svg` (150×150 SVG, downloaded).
- TOC scroll-spy (§1.10). Progress bar (§5.7). Cover frame scale on related cards (§1.3). Author popover fade (200ms). Copy-link icon swap.
- No entrance animations on blog pages: no IntersectionObserver reveals and no keyframes on load.

---

## 6. `/resources` (hub)

```
div.hero-wash.relative.isolate.overflow-hidden                         1440×512
  div.hero-stage.mx-auto.flex.w-full.max-w-3xl.flex-col.items-center.px-5.pt-28.pb-24.text-center.md:px-6.md:pt-32.md:pb-32
    h1.font-display.text-5xl.font-bold.text-balance.text-ink-900.md:text-6xl   "Stop redoing the same work every week"   60/60 (48/48 mobile), 720 wide
    p.hero-line.mt-3.max-w-2xl.text-xl.text-balance.text-ink-600  (--i:2)   "Find the job you handle by hand, then the flow that handles it for you. 1,063 free pages, no account needed."
    div.hero-line.mt-5.flex.w-full.flex-wrap.items-center.justify-center.gap-3.max-sm:*:grow  (--i:3)
      a (Button lg-ish: h-12 px-7 text-base rounded-full font-medium bg-ink-950 text-white hover:bg-ink-900)  "Start building" → https://cloud.activepieces.com/sign-up   (158×48)
      a (h-12 px-7 text-base bg-ink-50 text-ink-950 shadow-edge hover:bg-ink-100 hover:shadow-edge-hover)  "Talk to sales" → /sales   (151×48)
section.mx-auto.w-full.max-w-7xl.px-5.pb-24.md:px-6.md:pb-32.lg:px-8
  div.flex.flex-col.gap-5.md:gap-8
    h2.max-w-3xl.font-display.text-3xl.font-bold.text-balance.text-ink-900.md:text-4xl  "Pick the shortcut you need today."   36/40 (30/36 mobile)
    div.grid.grid-cols-1.gap-5.sm:grid-cols-2.md:gap-6     4 category cards
```
- The resources hub page has no FAQ. Its footer closing copy is in §1.14.
- At 390 the buttons stretch (`max-sm:*:grow`): 173 + 165.

**Hero wash** (`::before`, verbatim):
```css
.hero-wash::before{content:"";z-index:-1;position:absolute;inset-inline:-25%;top:-55%;height:145%;pointer-events:none;
  background:radial-gradient(ellipse 42% 50% at 50% 50%, rgba(184,230,254,.55) 0, rgba(223,242,254,.28) 45%, transparent 72%)}
```
These are primary-200 at 55% and primary-100 at 28%, page background white.

**Category card**:
```
a.group.flex.h-full.flex-col.gap-6.rounded-3xl.bg-white.p-8.shadow-edge.transition-shadow.duration-200.ease-out.hover:shadow-edge-hover.md:p-10
  span.flex.size-14.items-center.justify-center.rounded-2xl.bg-white.ring-1.ring-ink-950/10 > icon size-7 text-ink-600
  span.flex.flex-col.gap-2
    span.flex.items-center.gap-2.font-display.text-2xl.font-bold.text-ink-900  title + solar:alt-arrow-right-linear size-5 text-ink-600 group-hover:translate-x-0.5 (200ms ease-out)
    span.text-base.text-ink-600  description
  span.mt-auto.border-t.border-ink-950/10.pt-5.text-sm.text-ink-600.tabular-nums  count
```
| width | card size | padding | grid gap |
|---|---|---|---|
| 1440 | 596×313 | 40 | 24 |
| 768 | 348×361 | 40 | 24 |
| 390 | 350×345 | 32 | 20 |

| href | icon | title | description | count |
|---|---|---|---|---|
| /resources/glossary | solar:book-2-linear | Glossary | Clear, jargon-free definitions for the automation and AI concepts behind modern work, from triggers and webhooks to AI agents. | 106 terms |
| /resources/automation-guides | solar:bookmark-linear | Automation guides | Practical, app-by-app guides showing what you can automate and how to wire it up in minutes, no code required. | 520 guides |
| /resources/automation-use-cases | solar:lightbulb-linear | Automation use cases | Real automation scenarios across sales, marketing, support, finance and ops, with the workflows to make them happen. | 296 use cases |
| /resources/integration-use-cases | solar:socket-linear | Integration use cases | See what becomes possible when you connect two of your favorite apps, and build the integration in a few clicks. | 141 integrations |

**Hero motion** (`hero-line`, resources variant):
- Rule: `html.js .hero-line{animation:hero-line .64s cubic-bezier(.22,1,.36,1) calc(var(--i,0)*70ms) both}` with `@keyframes hero-line{0%{opacity:0;filter:blur(4px);translate:0 12px}100%{opacity:1;filter:none;translate:0}}`. Under `prefers-reduced-motion` there is no animation.
- Measured delays: breadcrumb 0s, p .14s, buttons .21s.
- The h1 is **not** animated.
- In Tailwind v3 use `transform: translateY(12px)` instead of `translate`.
- The existing global `html.js .hero-line` in the clone uses the homepage timing. Write a scoped `.res-hero-line` with these values instead.

## 7. `/resources/:type` (category listing)

### 7.1 Structure
```
div.hero-wash … > div.hero-stage (same as §6; height 552 at 1440, 608 at 390)
  breadcrumb (§1.11, centred, hero-line --i:0):  Resources › {Category}
  h1.mt-5 …  ; p.hero-line.mt-3 … ; buttons div.hero-line.mt-5 (same two buttons; cta ref differs only in query)
section.mx-auto.w-full.max-w-7xl.px-5.pb-24.md:px-6.md:pb-32.lg:px-8
  div.flex.flex-col.gap-8
    search (§1.7)
    [glossary only] nav[aria-label="Jump to letter"].flex.flex-wrap.gap-1   27 items A–Z + "#"
    p.text-sm.text-ink-600[aria-live=polite]   glossary: "106 terms" | others: "Showing 24 of 520 guides"
    glossary: div.flex.flex-col.gap-10 > per letter: section#letter-a.flex.scroll-mt-28.flex-col.gap-5
                 h2.border-b.border-ink-950/10.pb-3.font-display.text-2xl.font-bold.text-ink-900  "A"   (24/32, pb 12)
                 div(grid §1.12) resource cards
    others:   div.flex.flex-col.gap-10 > grid (§1.12) of 24 cards + div.flex.justify-center > button "Show more" (h-12 px-7 bg-ink-50 shadow-edge rounded-full, 142×48)
section "Keep exploring." (7.2)   — on all four category pages, between the listing and the FAQ (glossary: listing ends y9920, FAQ starts y10225)
FAQ section (§1.13)
```
- **Letter nav item**: `flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 ease-out`.
  - Enabled: `text-ink-900 hover:bg-ink-950/6 hover:text-ink-950`, `href=#letter-x`.
  - Letters with no terms: `pointer-events-none text-ink-300 aria-disabled`, no href.
  - At 1440 it is one row of 27 × 36px with 4px gaps. At 390 it wraps to 4 rows (156 tall).
- Glossary "#" holds terms starting with a digit.
- **Search** filters live with no debounce visible. It matches title (and excerpt). The count text updates: query "agent" gives "8 terms". On no match, show the resources empty state (§1.8) and the count reads "0 terms".
  - Non-glossary count format: "Showing {shown} of {total} {noun}". Nouns: guides, use cases, integrations.
- **Show more** appends 24 per click (24 → 48, "Showing 48 of 520 guides"). The URL does not change. Hide the button when all items are shown.
- Order: alphabetical by title, the index order from the API (kept in `resources.json`).

| type | h1 | subtitle |
|---|---|---|
| glossary | Automation and AI terms, explained | Clear, jargon-free definitions for the automation and AI concepts behind modern work, from triggers and webhooks to AI agents. |
| automation-guides | Automate any app with Activepieces | Practical, app-by-app guides showing what you can automate and how to wire it up in minutes, no code required. |
| automation-use-cases | Automation ideas for every team | Real automation scenarios across sales, marketing, support, finance and ops, with the workflows to make them happen. |
| integration-use-cases | Connect your apps, automate the busywork | See what becomes possible when you connect two of your favorite apps, and build the integration in a few clicks. |

Breadcrumb current labels: Glossary / Automation guides / Automation use cases / Integration use cases.

Button CTA tracking query (optional): `?ap_cta=resources_{type}_hero&ref=%2Fresources%2F{type}`.

Grid sizes:
| width | glossary / cards | guides grid |
|---|---|---|
| 1440 | 3 columns of 392, gap 20 | 3 columns |
| 768 | — | 2 columns of 350, gap 20 |
| 390 | 1 column of 350, gap 16 | — |

### 7.2 "Keep exploring." (sibling categories)
```
section.mx-auto.w-full.max-w-7xl.px-5.pb-24.md:px-6.md:pb-32.lg:px-8
  div.flex.flex-col.gap-5.md:gap-8
    h2.max-w-3xl.font-display.text-3xl.font-bold.text-balance.text-ink-900.md:text-4xl  "Keep exploring."
    div.grid.grid-cols-1.gap-4.sm:grid-cols-2.md:gap-5.lg:grid-cols-3
      a.group.flex.flex-col.gap-1.5.rounded-2xl.bg-white.p-6.shadow-edge.transition-shadow.duration-200.ease-out.hover:shadow-edge-hover
        span.flex.items-center.gap-1.5.text-lg.font-semibold.text-ink-900  {Other category} + alt-arrow-right size-4 text-ink-600 group-hover:translate-x-0.5
        span.text-[15px].text-ink-600  "{count} {noun}"
```
It shows the 3 other categories (for glossary: Automation guides, Automation use cases, Integration use cases). The order is listing, then Keep exploring, then FAQ, then footer.

### 7.3 Category FAQ copy (UI copy, safe to reproduce)
**Glossary.** h2 "Questions about the terms".
1. "Who is the glossary written for?" Anyone who has just been handed an automation project and keeps hitting words nobody defined. Every entry opens with a one-sentence answer, then goes deeper if you want it.
2. "Are these definitions specific to Activepieces?" The definitions are general and apply whatever tool you use. Where a term maps onto something concrete in Activepieces, the entry says so and links to it.
3. "A term is missing. Can you add it?" Ask on the community forum or open an issue on GitHub. Gaps that come up more than once get written first.

**Automation guides.** h2 "Questions about the guides".
1. "Do I need to write code to follow a guide?" No. Every guide is built on pieces you configure in the visual builder. A Code step is there when you need it, but no guide requires one.
2. "What if my app has no guide yet?" Check the piece catalog first. There are far more pieces than guides, and a piece with the trigger and actions you need is all it takes to build the flow yourself.
3. "Can I run these on my own infrastructure?" Yes. Everything in these guides works the same on Activepieces Cloud and on a self-hosted install, because it is the same engine.

**Automation use cases.** h2 "Questions about the use cases".
1. "How is a use case different from a guide?" A use case explains the problem and the shape of the fix, including the judgment calls. A guide walks through building one specific automation, step by step.
2. "Are these based on real teams?" They are drawn from the patterns we see most often across sales, marketing, support, finance and ops. The apps are named so you can tell straight away whether it maps to your stack.
3. "How long does one of these take to build?" Most are a handful of steps and land inside an afternoon. The slow part is usually agreeing what should happen, not building it.

**Integration use cases.** h2 "Questions about the integrations".
1. "What counts as an integration here?" Two apps connected so that something happening in one causes work in the other. Each page starts from the pairing and shows what becomes possible once it is wired.
2. "My two apps are not paired here. Now what?" Look both apps up in the piece catalog. If both exist as pieces, the integration is buildable today whether or not anyone has written it up.
3. "Do these need an API key for each app?" You connect each app once, usually through OAuth and sometimes with a key. That connection is reused by every flow you build afterwards.

## 8. `/resources/:type/:slug` (detail)

```
div(container §1.1)
  breadcrumb (§1.11, left-aligned): Resources › {Category} › {title}
  div.mt-8.grid.gap-12.lg:grid-cols-[minmax(0,1fr)_16rem].lg:gap-16        (1440: 896 | 256, gap 64)
    article.max-w-[44rem].min-w-0                                         (704)
      header.flex.flex-col.gap-5
        h1.font-display.text-4xl.font-bold.text-balance.text-ink-900.md:text-5xl   title (48/48; 36/40 mobile)
        p.text-lg.leading-relaxed.text-ink-600                               excerpt (18/29.25)
        p.flex.flex-wrap.items-center.gap-x-2.gap-y-1.text-sm.text-ink-500  "{readingTime}" · "Updated {MMM D, YYYY}"
      div.mt-8 > div.blog-prose  (placeholder body, same prose tokens §5.6; one chunk, no TL;DR, no pull quote needed)
      [clone] "Read the full guide on activepieces.com" link (style §5.4)
      div.mt-8.border-t.border-ink-950/10.pt-6 > Share row (bordered §1.9)
      div.mt-8 > aside.rounded-2xl.border.border-ink-950/8.bg-ink-950/2.p-7
                   h2.font-display.text-xl.font-bold.text-ink-900 "Build this in Activepieces"
                   p.mt-2.max-w-xl.text-sm.leading-relaxed.text-ink-600 "Start free with 1,000 credits a month. Connect 760+ pieces, or run the whole thing on your own servers."
                   div.mt-5.flex.flex-wrap.gap-3 > "Start building" (h-11 px-6 text-[15px] bg-ink-950 text-white rounded-full) + "Talk to sales" (h-11 px-6 text-[15px] bg-ink-50 shadow-edge) → /sales
    aside.hidden.lg:block > div.sticky.top-28 > TOC (§1.10; from the placeholder h2s)
section FAQ (§1.13) h2 "Questions about {title}" — body FAQs not stored: render placeholder Q/A ×min(faqCount,3) or omit
section.mx-auto.w-full.max-w-7xl.px-5.pb-16.md:px-6.md:pb-20.lg:px-8   (only if apps.length)
  div.flex.flex-col.gap-5.md:gap-8 > h2 (text-3xl md:text-4xl) "Apps in this guide" + grid lg:grid-cols-4 of resource cards (title, excerpt; href = app.path → /pieces/{slug})
section.mx-auto.w-full.max-w-7xl.px-5.pb-24.md:px-6.md:pb-32.lg:px-8
  div.flex.flex-col.gap-5.md:gap-8
    div.flex.flex-wrap.items-end.justify-between.gap-4
      h2 (text-3xl md:text-4xl) "More terms" | "More guides" | "More use cases" | "More integrations"
      a.group.inline-flex.min-h-11.items-center.gap-1.5.rounded-md.text-sm.text-ink-900.hover:text-ink-950  "All terms" | "All guides" | … → /resources/{type}  + arrow size-4 group-hover:translate-x-0.5
    grid (§1.12, 3 columns) of the 6 `related` items
```
- The TOC rail sits on the **right** here (256 wide) and is hidden below 1024. At 768 and 390 there is a single column.
- Some integration pages use `h3` instead of `h2` for body headings. If the placeholder has fewer than 3 h2s, the TOC won't render.
- Date: "Updated May 31, 2026", built from `updatedAt` with `month:'short'`.
- Page height at 1440: 5,098 for glossary/actions.
- The hero-wash is **not** used on detail pages. The background stays white.

## 9. `/privacy` and `/terms` (legal long-form)

**Live-site note.** A direct load of `/privacy` or `/terms` currently server-renders "This document is not available right now." (an SSR fetch failure on their side). The full document renders only after client-side navigation (it was measured that way), from `GET /api/content/singleton/{privacy|terms}`, which returns markdown. **No legal text is stored.** The clone renders the layout with a placeholder body and a prominent link to the original.

```
div.mx-auto.w-full.max-w-7xl.px-5.pt-32.pb-24.md:px-6.md:pt-40.md:pb-32.lg:px-8      (1440: padding 160/32/128; 390: 128/20/96)
  div.grid.gap-12.lg:grid-cols-[17rem_minmax(0,1fr)].lg:gap-24                         (1440: 272 | 848, gap 96)
    aside.lg:sticky.lg:top-28.lg:self-start
      button.lg:hidden  "Contents" + solar:alt-arrow-down-linear size-4 (rotates 180° when open, transition-transform 200ms)
             classes: rounded-sm flex min-h-11 w-full items-center justify-between gap-3 border-b border-ink-950/8 text-base text-ink-700 hover:text-ink-900
      nav#legal-nav[aria-label="Legal documents"].hidden.lg:block.pt-7.lg:pt-0.lg:pb-10.lg:max-h-[calc(100vh-11rem)].lg:overflow-y-auto.lg:[scrollbar-gutter:stable]   (mobile: toggled by "Contents")
        p.border-b.border-ink-950/8.pb-5.text-base.font-medium.text-ink-900  "Legal"
        ul.mt-8.flex.flex-col.gap-5
          li > div.flex.items-center.justify-between.gap-3
                 a.rounded-sm.block.text-lg.leading-snug.transition-colors.duration-200   (18/24.75)
                    current: font-semibold text-ink-900 (aria-current=page) | other: font-medium text-ink-700 hover:text-ink-900
                 [current doc only] button.flex.size-9.shrink-0.items-center.justify-center.rounded-sm.text-ink-500.hover:text-ink-900  aria-label="Show sections of {doc}" > alt-arrow-down size-4
               div > ul#legal-toc.flex.flex-col.gap-5.pt-5  (collapsed by default; toggled by that button)
                 li > a.rounded-sm.block.text-base.leading-relaxed.text-ink-600.hover:text-ink-900  href=#{heading-id}   (16/26)
          order: "Terms of Service" (/terms), "Privacy Policy" (/privacy)
    article.max-w-[52rem].min-w-0                                                                  (832)
      header
        h1.font-display.text-4xl.font-bold.text-balance.text-ink-900.md:text-5xl     (48/48; 36/40 mobile)
        p.mt-3.text-lg.text-ink-600                                                   (18/28)
        p.mt-4.text-sm.text-ink-600   "Last updated {Month D, YYYY}"                  (14/20)
      div.legal-prose.prose.prose-lg.mt-12.max-w-none.md:mt-16     (placeholder body + link to original)
```
| page | h1 | subtitle | last updated |
|---|---|---|---|
| /terms | Terms of Service & Subscription Agreement | The agreement that covers your use of Activepieces, whether you run it on our cloud or your own. | November 29, 2023 |
| /privacy | Privacy Policy | What personal data we collect, why we collect it, and the choices you have over it. | January 20, 2026 (API value 2026-01-19T21:00Z, shown in local time) |

Heading structure (for the placeholder and the TOC):
- **Terms**: 15 numbered all-caps `h2.is-caps` (DEFINITIONS … MISCELLANEOUS), then plain `h2` "APPENDIX 1: Activepieces Subscriptions" with 2 `h3.is-caps`, `h2` "APPENDIX 2: Software as a Service (SaaS) Offering" with 6 `h3.is-caps`, then `h2` "Contact Us".
  - Numbered h2s contain `span.legal-num` "01".."15" before the text.
  - Ids follow the pattern `#1-definitions`, `#appendix-1-activepieces-subscriptions`.
- **Privacy**: 20 plain `h2` in Title Case ("Note To Customer End Users" … "Contacting Activepieces"), paragraphs, 13 links, and 14 `h5`s used as emphasised lead-ins (rendered 18/32, 400, #1d293d, margins 0).
- Neither document uses lists, tables or blockquotes in the measured version. Spec them from prose-lg anyway (below), in case the placeholder uses them.

### 9.1 Legal prose tokens (Tailwind Typography `prose prose-lg` + overrides)
| element | font | size / line-height | weight | colour | margins | other |
|---|---|---|---|---|---|---|
| root | Inter | 18 / 32 | — | #1d293d (ink-800) | — | — |
| p | — | — | — | — | 24 / 24 (first child mt 0) | — |
| a | — | — | 500 | #00598a | — | underline |
| strong | — | — | 600 | #0f172b | — | — |
| h2 | Sentient | 30 / 40 | 700 | #0f172b | mt 56, mb 32 (`h2+*` mt 0) | relative, scroll-margin-top 96 |
| h2.is-caps | Sentient | 20 / 26.67 | 700 | — | mt 37.33, mb 21.33 | ls .04em (.8px) |
| h3 (prose-lg default) | Sentient | 1.333em (24px) / 1.5 | 600 | #0f172b | mt 1.667em, mb .667em | — |
| h3.is-caps | Sentient | 15 / 22.5 | 600 | #45556c | mt 25, mb 10 | ls .06em (.9px) |
| .legal-num, ≥1024 | Sentient | 28 / 1.2 | 700 | #cad5e2 | — | absolute, top −.15em, right calc(100% + 1.5rem) (hangs in the left gutter at x425 when the article is at x480); tabular-nums, ls 0 |
| .legal-num, <1024 | Sentient | 18 / 24 | 700 | #cad5e2 | mb 5.6 | block, above the heading text |
| ul / ol | — | — | — | — | 1.333em | padding-inline-start 1.556em |
| li | — | — | — | — | .667em | padding-start .444em |
| hr | — | — | — | — | 3.111em | border colour `rgba(2,6,24,.10)` |
| blockquote | — | — | — | #0f172b | — | border-left `ink-200` |

Further prose rules:
- Markers: bullets #cad5e2, counters #45556c.
- th/td borders `rgba(2,6,24,.10)`.
- Variables: `--tw-prose-body:ink-800; --tw-prose-headings:ink-900; --tw-prose-lead:ink-700; --tw-prose-links:primary-800; --tw-prose-bold:ink-900; --tw-prose-counters:ink-600; --tw-prose-bullets:ink-300; --tw-prose-hr:ink-950/10; --tw-prose-quotes:ink-900; --tw-prose-quote-borders:ink-200; --tw-prose-captions:ink-600; --tw-prose-code:ink-900`.
- The project has no `@tailwindcss/typography`. **Do not add the plugin.** Hand-write `.legal-prose` rules with the values above.

Placeholder body for each legal page:
- 4–6 short neutral sections that mirror the heading pattern (numbered `h2.is-caps` for terms, Title Case `h2` for privacy) with 1–2 lorem paragraphs each.
- Above them, a callout `p` that links out: "Read the full {Terms of Service | Privacy Policy} on activepieces.com" → `https://www.activepieces.com/{terms|privacy}`.
- The aside TOC lists the placeholder headings.

---

## 10. Motion summary (content templates)
| element | trigger | property | duration | easing | delay or stagger |
|---|---|---|---|---|---|
| Card cover frame | hover on card (`group`) | scale 1 → 1.02 (featured 1.01) | 500ms | `.22,1,.36,1` | — |
| Resource and category cards | hover | box-shadow edge → edge-hover | 200ms | `0,0,.2,1` | — |
| Card arrow icons | hover | translateX 0 → 2px | 200ms | `0,0,.2,1` | — |
| Pills, pagination, share buttons, TOC links, breadcrumb links | hover | colour and background | 200ms | `.4,0,.2,1` (`0,0,.2,1` for breadcrumb) | — |
| Prose links | hover | text-decoration-color 35% → 100% | 200ms | `.22,1,.36,1` | — |
| Reading progress | scroll | scaleX | 100ms | `0,0,.2,1` | — |
| TOC | IntersectionObserver | active link | instant | — | collapse chevron rotate 200ms ease-smooth |
| Author popover | hover or focus-within | opacity and visibility | 200ms | — | — |
| Right-rail CTA | hover | −2px lift + shadow-lift | 300ms | `.22,1,.36,1` | arrow +2px |
| Right-rail CTA | — | bots peek, infinite | 5s | `.34,1.56,.64,1` | stagger .9s per bot; hover pose with 40ms stagger, 350ms transition |
| Resources hero lines | load | opacity 0 → 1, blur 4px → 0, y 12px → 0 | 640ms | `.22,1,.36,1` | delay `--i × 70ms` (0, .14s, .21s) |
| FAQ | click | `+` icon rotate-45 | 200ms | — | panel toggles instantly (display) |
| Legal "Contents" and section toggles | click | chevron rotate | 200ms | — | instant show and hide |

- Every animation respects `prefers-reduced-motion` (`motion-reduce:transition-none`, and the animations are disabled).
- No other scroll-triggered reveals exist on these templates. The only IntersectionObservers are Nuxt link prefetch (ignore) and the TOC scroll-spy.

## 11. Assets

- **Covers and photos.** Downloaded to `public/` at their original paths, total about 40 MB, which is at the agreed limit. This was done so nothing references activepieces.com at runtime.
  - `public/uploads/**`: 413 hero cover webps (1600×900, about 50 KB each) plus 77 author photos (png/jpeg thumbnails, 245×245). 490 files, 25.5 MB.
  - `public/api/hero-bg/*.svg`: 378 generated covers (1600×900 SVG), 14.4 MB. Vite serves them at `/api/hero-bg/{slug}.svg`. There is no `/api` proxy in `vite.config.js`, so this is safe.
- **Template assets** (downloaded or already present):
  - `/panel/meadow-640.webp` (640×360, present).
  - `/avatars/bots/{atlas,ember,dorian,beacon,cinder}.svg` (150×150, downloaded).
  - `/brand/activepieces-wordmark.svg` and `/brand/activepieces-logomark.svg` (present).
  - `/_nuxt/sentient-400-italic.6JjT30BJ.woff2` (26.8 KB, downloaded).
  - Fira Code is already in `index.css` (23 rules).
- **Icons.** SVGs downloaded to `public/icons/` for Build to register in `src/icons.css`:
  - solar: `magnifer-linear`, `alt-arrow-down-linear`, `alt-arrow-right-linear`, `check-read-linear`, `flag-linear`, `add-linear`, `book-2-linear`, `bookmark-linear`, `lightbulb-linear`, `socket-linear`.
  - simple-icons: `x`, `linkedin`.
  - Already present: `solar:verified-check-bold`, `solar:link-linear`, `solar:arrow-right-up-linear`.
- **Network.** Loaded per page:
  - CSS: `entry.LEuMnHPd.css`, `post-card.Bc58JJ62.css`, `_slug_.DbnOXifq.css`, `use-post-markdown.CkkWI2U8.css`, `legal-page.BYMm0MAB.css`, `pages.CaRGUvqN.css`, `default.DFiKujCo.css` (consent toast transition only).
  - Fonts: Inter (variable woff2), `sentient-700`, `sentient-400-italic`.
  - Images: covers lazy except the featured post and the article banner (eager, `fetchpriority=high` on featured).

## 12. Gaps and decisions
- **Bodies not stored** (policy). The article, resource and legal templates use placeholder bodies plus outbound links. Resource FAQ answers are not stored either (`faqCount` only).
- **Legal pages are broken on a direct load of the live site** ("not available right now"). Measurements came from client-side navigation. The heading structure is in §9. The text itself is not captured.
- **The "Spotted something wrong?" report dialog** (`<dialog>` form posting to their API) is not specced. Link the flag to `post.url`, or omit it.
- **Related-post ranking** is server-side (`related=true`) and unknown. A same-category heuristic is given in §0.1. Blog search is server-side. The clone substitutes a client filter over title and excerpt.
- **The progress-bar target bug on the original** (first chunk only) is deliberately fixed in the clone (§5.7).
- **Author `discourseUsername`** (the community link in the popover) is not indexed.
- **Data snapshot.** 792–793 posts at index time (the count rose during the session because new posts were published), 95 authors, 1,063 resources. Re-run the script to refresh.
- **TLS in this sandbox.** Node `fetch` needs `NODE_EXTRA_CA_CERTS=<system CA bundle>` because a TLS-intercepting proxy is present. On a normal machine run `node scripts/fetch-content-index.mjs [--images] [--no-details]` as is.
