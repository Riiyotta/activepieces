Source: https://www.activepieces.com (routes /product/{workflow-builder,ai-agent-builder,tables,chat} and /solutions/{marketing,sales,customer-support,finance,hr,operations,engineering,it,internal-tools,open-source-developers})

# Product and Solution pages: clone build spec

Measured on 2026-10-16 with headless Chromium (Playwright) at 1440, 768 and 390 wide (`getComputedStyle`, `getBoundingClientRect`, timed DOM sampling for the demos), plus the server-rendered HTML of all 14 routes. Tokens, button variants, shadows and easings are the ones in `CLONE_SPEC.md §0`. Every color below is a token from that section; computed values were checked against it: ink-900 = oklch(0.208 0.042 265.755) = #0f172b, ink-600 = #45556c, ink-950 = #020618, ink-50 = #f8fafc, ink-300 = #cad5e2.

Reference files written next to this spec:
- `specs/source/<group>_<slug>.html`: one per route. Each holds the cleaned SSR markup of the hero visual and of the bento grid (SVG bodies, comments and `data-v-*` removed). Use it as the source of truth for static mock markup.
- `specs/source/_bento-mocks.html`: the 21 unique bento mock bodies, each written out once (see §6.2).

---

## 1. Summary: two templates

All 14 routes are built from two section sequences. Nothing on any page deviates structurally from its template; the pages differ only in content, in the hero visual, and in which bento mocks they use.

| template | routes | sections in `<main id="main-content">` (one wrapper `<div>`) |
|---|---|---|
| **ProductPage** | 4 × /product/* | 1 Hero (`<slug>-hero`) → 2 Bento grid, **8 cards** (`-grid`) → 3 FAQ, **5 items** (`-faq`) |
| **SolutionPage** | 10 × /solutions/* | 1 Hero (`-hero`) → 2 Bento grid, **6 cards** (`-grid`) → 3 Case study (`-case-study`) → 4 Testimonials (`-testimonials`) → 5 FAQ, **4 items** (`-faq`) |

`data-section` values: product uses `builder`, `ai-agents`, `tables`, `chat` (for example `builder-hero`, `builder-grid`, `builder-faq`). Solutions use the slug (for example `sales-hero` … `sales-faq`; `open-source-developers-hero`).

How the two templates differ:
- **Hero visual.** Product pages show an animated demo (two of them are the homepage demos, unchanged). Solution pages show a static mock that is unique to each page.
- **Under the hero stage.** Product pages show 3 text columns. Solution pages show a 6-up rotating customer logo grid.
- **Bento grid.** 8 cards in spans 12/12, 9/15, 15/9, 12/12 on product pages. 6 cards in spans 12/12, 9/15, 15/9 on solution pages.
- **Extra sections.** Solution pages add the case study and testimonials.

There are no CTA bands, no dream section and no floating demo card (homepage §P) on any of these pages. I checked for `position: fixed` elements, and only the header is fixed.

### 1.1 Homepage components to reuse

| this page's section | homepage component | change needed |
|---|---|---|
| Hero stage visual on /product/workflow-builder | `FeatureFlowDemo` (G visual). The SSR markup is byte-identical to the homepage `flow-canvas`, apart from the wrapper `data-v` attribute. | none. Stage bg is `clouds`, as on the homepage. |
| Hero stage visual on /product/ai-agent-builder | `FeatureAgentsDemo` (F visual). The markup is byte-identical. | none. Stage bg is `meadow`. |
| Fake cursor | `demo/useCursorCast` + `DemoCursor` | the tables demo needs **3 cursors at once** with tags (§4.3), so extend the hook or instantiate several cursors |
| Bento grid section + card | `BentoSection` / `BentoCard` in `BentoPlatformCard.jsx` (art presets, `Frame` modes, spans 9/12/15) | card mocks come from the mock library (§6.2). Three mocks already exist as homepage cards: `mcpServer` = L "MCP Server", `runResume` = H "Reliability", `customersTable` = L "Tables". |
| Case study | `CaseFundingSocieties`, `CaseAlan` | none. Copy, stats and logos are identical to the homepage. Each solution page uses one of them (§9). |
| Testimonials | `Testimonials` | make the H2 a prop. The 9 cards, their order and the 25.1k / 356 stats are identical. |
| FAQ | `Faq` | make the H2 and the items props. Same accordion, and the first item is open. |
| Footer `.closing` | `Footer` | make the closing H2 and lede props (copy differs per page, §10). Everything else is identical, including the "Free to start · No credit card · Open source" bullets and the CTAs (`ap_cta=closing`). |
| Header | `Header` | render in its **non-art** state on these pages (§2) |
| Rotating logos | homepage `Hero.jsx` logo list (same 24 files under `/logos/customers/`) | new 6-cell grid with a set swap (§5.2); this is not the marquee |

---

## 2. Header state on these pages (measured, 1440)

The header is the same component as on the homepage, but in the state it uses when it is not over hero art: no `on-art` class from first paint. This is the existing `onArt === false` branch in `Header.jsx`.
- Island `bg-white/68` (homepage at top: `/62`).
- Wordmark `bg-ink-950`; logomark `bg-primary-700`.
- Nav items `text-ink-900 hover:bg-ink-950/5 hover:text-ink-950`, focus outline primary-700.
- "Open app" `bg-ink-950/6 hover:bg-ink-950/10`. Its href `ref` is the current path, URL-encoded (for example `ref=%2Fproduct%2Fworkflow-builder`).
- Header box: 1440×84 (≥768); 390×76 at 390.
- The footer link for the current route gets `aria-current="page"` and `router-link-exact-active`, with no visual change.

---

## 3. Hero (shared by both templates)

Element: `div.hero-stage mx-auto flex w-full max-w-7xl flex-col items-start px-5 pt-28 pb-24 text-left md:px-6 md:pt-32 md:pb-32 lg:px-8` (there is no `<section>`). Background is plain white: there is no art and no wash. The container is 1280 max wide and centered, so at 1440 the content runs from x=112 to x=1328.

| | 1440 | 768 | 390 |
|---|---|---|---|
| padding T/B | 128 / 128 | 128 / 128 | 112 / 96 |
| padding X | 32 | 24 | 20 |
| hero height, product (workflow-builder) | 1208 | 1372 | 1492 |
| hero height, solution (sales) | 1162 | 1321 | 1451 |

Children, top to bottom (y values are for workflow-builder at 1440):
1. **H1** `font-display text-5xl font-bold text-balance text-ink-900 md:text-6xl`
   - Sentient 700, ink-900, letter-spacing normal.
   - 60px/60px at ≥768; 48px/48px at 390.
   - 1440: x112 y128, 1-line height 60. 768: 2 lines, 120. 390: 4 lines, 192.
   - **Not animated** (no `hero-line` class).
2. **Lede** `p.hero-line mt-3 max-w-5xl text-xl text-ink-600`, `--i:1`
   - Inter 400, 20/28, ink-600, max-width 1024, margin-top 12.
   - 1440: 1024×56 (2 lines).
3. **CTA row** `div.hero-line mt-5 flex w-full flex-wrap items-center gap-3 max-sm:*:grow`, `--i:2`
   - margin-top 20, gap 12.
   - "Start building": **size lg, variant solid** (bg ink-950, hover ink-900). 158.2×48 (≥640); at 390 it grows to 172.8.
     - href `https://cloud.activepieces.com/sign-up?ap_cta=<ctaKey>&ref=<encoded route>`
   - "Talk to sales": size lg, variant secondary (ink-50, `shadow-edge`; hover ink-100 + `shadow-edge-hover`). 150.6×48 (165.2 at 390).
     - href `/sales?ap_cta=<ctaKey>`
   - Both buttons: 16px/500, h48, px28, radius full. Transition `background-color, color, box-shadow, transform` 200ms `cubic-bezier(0,0,.2,1)`; `active:scale-[0.99]`.
   - Note: the hero "Start building" is **solid (ink-950)**, not brand blue.
4. **Stage** `div.hero-line stage relative isolate mt-12 w-full overflow-hidden rounded-4xl shadow-lift md:mt-16`, `--i:3`
   - margin-top 48 (md 64). Radius 32. `box-shadow: var(--shadow-lift)`.
   - Size: 1216×544 at 1440; 720×544 at 768. At 390 it is 350×432 for flow-canvas pages and 350×528 for static-mock pages, because the stage height follows the visual-stage height.
   - `::after`: `content:""; position:absolute; inset:0; z-index:-5; pointer-events:none; background: radial-gradient(ellipse 62% 62% at 50% 50%, rgba(2,6,24,.08) 0, transparent 72%)`.
   - Background `<img>`: `absolute inset-0 -z-10 size-full object-cover opacity-85 saturate-75`.
     - src `/panel/<art>.webp` (1920×1080) with `srcset` `/panel/<art>-640.webp 640w, -960.webp 960w, -1376.webp 1376w, <art>.webp 1920w`, `sizes="(min-width: 1280px) 1280px, 100vw"`, `fetchpriority="high"`.
     - Measured currentSrc: 1376 at 1440, 960 at 768, 640 at 390.
     - Art per page: `clouds`, `meadow` or `coast` (§14).
   - Inside: `div.grid w-full grid-cols-1 place-items-center` > `.visual-pad` (global CSS):
     - `.visual-pad{width:100%;padding:2.5rem 1.5rem}` and `@media (min-width:40rem){.visual-pad{padding:3rem}}`. Measured padding 48 at ≥640; 40/24 at 390.
   - `.visual-stage` (global CSS):
     ```
     .visual-stage{border-radius:var(--radius-2xl);width:100%;max-width:34rem;height:28rem;box-shadow:var(--shadow-lift);background-color:#fff;margin-inline:auto;position:relative}
     ```
     - 544×448, centered (x448 at 1440). At 390 it is 302×448.
     - Exception: the flow-canvas `.stage-clip` sets `height:22rem` below 40rem, so it measures 302×352 there.
     - Solution static mocks add `flex flex-col overflow-hidden` to `.visual-stage`.
5. **Below-stage block** `div.hero-line … mt-12 md:mt-16`, `--i:4`: margin-top 48 (md 64). It holds either the product columns (§5.1) or the solution logos (§5.2).

### 3.1 Hero entrance motion (product-hero CSS, measured)

```
html.js .hero-line { animation: hero-line-p .64s var(--ease-smooth) calc(var(--i)*70ms) both; }
@keyframes hero-line-p { 0% { opacity:0; filter:blur(4px); translate:0 12px } to { opacity:1; filter:blur(0); translate:0 } }
@media (prefers-reduced-motion: reduce) { html.js .hero-line { animation:none } }
```
Measured delays: lede 70ms, CTAs 140ms, stage 210ms, below 280ms. Easing `cubic-bezier(.22,1,.36,1)`. It plays on load only.

**Important:** the project's global `html.js .hero-line` in `index.css` is the *homepage* version (.76s, `.38s + i*90ms`, blur 5px, 14px). These pages need the scoped variant above. Give it its own class or keyframe name in the hero component's CSS, and do not edit `index.css`.

---

## 4. Hero visuals

### 4.1 /product/workflow-builder: `FeatureFlowDemo` (reuse as-is)
The SSR markup diff against the homepage `flow-canvas` is empty. It loads `/logos/pieces/{webhook,openai,slack,hubspot}.svg`. Its CSS (`.stage-clip`, `.scene` scale .72 below 40rem and .6 below 24rem, `.dot-grid`, drop and chip transitions) is the homepage G CSS.

### 4.2 /product/ai-agent-builder: `FeatureAgentsDemo` (reuse as-is)
The markup is identical to the homepage `agent-thread` ("Process the invoice in my inbox." …).

### 4.3 /product/tables: new `TablesDemo` (scoped CSS from `tables.CGAyHsfJ.css`)

**Static markup (end state, also the SSR and reduced-motion state).** `.visual-stage.flex.flex-col.overflow-hidden` contains:
- **Header** `flex shrink-0 items-baseline gap-3 px-6 py-5`:
  - "Accounts" 15px/600 ink-950.
  - `ml-auto` "248 records" 12px ink-500 tabular-nums.
- **Column header row** `grid grid-cols-[minmax(0,1.5fr)_6.5rem_5.5rem_5rem] items-center gap-4 px-6 shrink-0 border-t border-b border-ink-950/10 py-3`:
  - Labels COMPANY / STAGE / MRR / RENEWS: 11px/500, `tracking-wide`, uppercase, ink-500.
- **Rows container** `divide-y divide-ink-950/10 transition-opacity duration-500 opacity-100`, holding 5 rows.
  - Each row uses the same grid with `px-6 py-4`:
    - Company: `truncate text-[14px] text-ink-900`.
    - Stage cell: `flex h-6 items-center rounded-md px-1.5 text-[13px] text-ink-700 gap-2`, with a dot `size-1.5 rounded-full` (Active `bg-accent-a-500`, Trial `bg-accent-b-500`, Churned `bg-accent-c-200`) followed by the label.
    - MRR: `flex h-6 items-center rounded-md px-1.5 text-[13px] text-ink-700 tabular-nums`.
    - Renews: `text-[13px] text-ink-500 tabular-nums`.
  - Rows: Verano Coffee · Active · €6,400 · 12 Apr; Piera · Trial · €2,800 · 03 May; Wren Labs · Active · €5,100 · 21 Apr; Northaven · Active · €9,750 · 30 Apr; Linden Freight · Trial · €1,900 · 08 May.
  - Verano's stage cell is a real `<button aria-label="Change the stage" aria-expanded>` wrapped in `span.relative.inline-flex`, plus `cursor-pointer transition-shadow duration-500`. Verano's and Wren's MRR cells also carry `transition-shadow duration-500`.
- **Footer** `mt-auto flex shrink-0 items-center gap-2 border-t border-ink-950/10 px-6 py-3.5 text-[12px] text-ink-500`: icon `solar:structure-linear` size-3.5 ink-400, then "Read and written by 2 flows".
- **Three cursors** (homepage cursor component, `--travel: 620ms`). Each has a `.cursor-tag` (the label pill) containing an icon `size-2.5`.
  - **You**: fill primary-700, ring primary-400, icon `solar:user-linear`.
  - **Agent 1**: fill ink-950, ring ink-400, icon `solar:stars-linear`.
  - **Agent 2**: fill accent-a-700, ring accent-a-500, icon `solar:stars-linear`.
  - Cursor CSS (shared `use-cursor-cast`):
    ```
    .cursor{transition:transform var(--travel,.52s) cubic-bezier(.5,.02,.2,1),opacity .26s ease}
    .cursor-glyph{transform-origin:4px 3px;transition:transform .13s}
    .cursor-down{transform:scale(.82)}
    .cursor-tag{border-radius:6px;background:var(--cursor-fill);color:#fff;white-space:nowrap;border-top-left-radius:1px;display:inline-flex;align-items:center;gap:2px;padding:2px 6px;font-size:.66rem;font-weight:600;line-height:1;position:absolute;top:18px;left:14px}
    .click-ring{border:1.5px solid var(--cursor-ring);border-radius:9999px;width:19px;height:19px;margin:-3px 0 0 -4px;position:absolute;top:0;left:0;animation:click-ring .48s ease-out forwards}
    @keyframes click-ring{0%{opacity:.5;transform:scale(.35)}to{opacity:0;transform:scale(1.9)}}
    ```
- **Active-cell highlight.** The cell gets `ring-2 ring-ink-950/20`: `box-shadow: 0 0 0 2px rgba(2,6,24,.2)`, `inset` for MRR spans. It fades in over the 500ms `transition-shadow`. While a person or agent is typing, a caret follows the text:
  ```
  .cell-caret{display:inline-block;vertical-align:middle;background:var(--color-ink-500);width:1.5px;height:.9rem;margin-left:1px;animation:blink 1s step-end infinite}
  @keyframes blink{50%{opacity:0}}
  ```
- **Stage dropdown** (opened by Agent 1) `absolute top-full left-0 z-20 mt-1.5 w-32 rounded-xl border border-ink-950/10 bg-ink-50 p-1`.
  - 3 option buttons: `flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] text-ink-800 transition-colors duration-200 hover:bg-ink-100`. Options are Trial / Active / Churned, each with its dot. The current option gets `bg-ink-100`.
  - Enter: `opacity .26s, transform .36s cubic-bezier(.16,1,.3,1)` from `opacity:0; translateY(-6px) scale(.96)`.
  - Leave: `opacity .17s, transform .2s cubic-bezier(.4,0,.9,.4)` to `opacity:0; translateY(-4px) scale(.98)`.

**Loop.** Measured period 8.6s; times are relative to the reset (L). Cursor coordinates are px from the visual-stage's top-left corner.

| t | event |
|---|---|
| L−0.6s | rows container class becomes `opacity-0` (500ms fade) |
| L | state resets while hidden: Verano → Trial, €4,900; Wren MRR → empty. The cursors jump invisibly to their home spots: You (44,302), Agent 1 (468,40), Agent 2 (468,330). |
| L+0.3 | rows container fades back to `opacity-100` (500ms) |
| L+1.1 | **You** fades in (opacity .26s) at its home spot and travels to the Wren MRR cell (377,245), 620ms |
| L+1.66 | You clicks: glyph scales .82 for ~130ms and a click-ring plays. The Wren MRR cell gets its ring; the caret appears. |
| L+1.9 → 2.25 | types "€5,100" one character every ~83ms |
| L+2.0 | **Agent 1** fades in at (468,40) and travels to Verano's Stage button (234,131) |
| L+2.67 | Agent 1 clicks. The Stage button gets `ring-2 ring-ink-950/20` and the dropdown opens (~L+2.9). |
| L+2.5 | **Agent 2** fades in at (468,330) and travels to Verano's MRR cell (377,131) |
| L+3.08 | Agent 2 clicks. Ring on Verano MRR; the text clears to "€" and is retyped to "€6,400" (L+3.4 → 3.66). |
| L+3.16 | You fades out (its ring on Wren stays) |
| L+3.5 | Agent 1 moves to the "Active" option (249,201); it clicks at L+4.08 |
| L+4.33 | stage value becomes Active (green dot); the dropdown closes at ~L+4.58 |
| L+5.9 | Agent 1 and Agent 2 fade out |
| L+8.0 | the next loop's fade-out starts |

The loop runs through the same `useCursorCast` engine as the homepage demos (scoped CSS shared). The homepage engine starts the loop at ≥30% visibility, hands control to the user on interaction, and resumes after 9s idle. The visibility gating could not be confirmed separately on this page, so treat it as the shared engine's behavior. Under reduced motion, show the static end state.

### 4.4 /product/chat: new `ChatDemo` (scoped CSS from `chat.tM1Wlkej.css`)

**Static markup (end state).** `.visual-stage.flex.flex-col.overflow-hidden` contains:
- **Header** `flex shrink-0 items-center gap-3 px-6 py-4`:
  - "Store Desk" 15px/600 ink-950.
  - `ml-auto flex items-center gap-2 text-[12px] text-ink-500`: a dot `size-1.5 rounded-full transition-colors duration-500` (`bg-accent-a-500` when "Published", `bg-ink-300` when "Draft") and the status text.
  - Share button in `div.relative`: `flex items-center gap-1.5 rounded-md border border-ink-950/10 px-2.5 py-1 text-[12px] font-medium text-ink-700 hover:border-ink-950/20 hover:text-ink-900 transition-colors duration-200`, with `solar:share-linear` size-3.5 ink-400 and "Share". In the open state it switches to `border-ink-950/40 text-ink-900`.
- **Thread** `.thread relative flex min-h-0 flex-1 flex-col justify-end gap-4 overflow-hidden border-t border-ink-950/10 px-6 py-5 transition-opacity duration-500`, with `.thread{mask-image:linear-gradient(#0000,#000 24px)}`. It contains:
  - User bubble `max-w-[80%] self-end rounded-2xl rounded-tr-md bg-ink-950 px-4 py-3 text-[14px] text-white`: "How did the Berlin store do last week?"
  - Meta `flex items-center gap-1.5 self-start text-[12px] text-ink-500`: `solar:stars-linear` size-3.5, then "Flow ran 2 steps".
  - Chips row `flex flex-wrap items-center gap-2 self-start`. Each chip: `chip-in flex items-center gap-2 rounded-lg border border-ink-950/10 bg-ink-50 px-3 py-2 text-[13px] transition-colors duration-500 text-ink-700`, with an img `size-5 transition-opacity duration-500 opacity-100`.
    - Chips: `/logos/pieces/shopify.svg` "Pulled last week"; `/logos/pieces/google-sheets.svg` "Read the returns log".
    - Pending chip state: `text-ink-400`, img `opacity-40`.
  - Answer `flex max-w-[92%] flex-col gap-2 self-start`:
    - "Berlin, week 14" 14px/600 ink-950.
    - "Revenue landed at €48,210, up 7.4% on the week before. Returns held flat at 3.1%." 14px ink-800.
- **Composer** `shrink-0 px-6 pb-5` > `flex items-center gap-3 rounded-full border border-ink-950/10 bg-ink-50 px-4 py-3`:
  - `solar:add-linear` size-4 ink-400.
  - Text `min-w-0 flex-1 truncate text-[13px] text-ink-800`; the placeholder "Ask for something else" is a `span.text-ink-500`.
  - Send button `ml-auto flex size-7 items-center justify-center rounded-full bg-ink-950 text-white hover:bg-ink-900` with `solar:plain-linear` size-3.5.
- **Share popover** `share-pop absolute top-full right-0 z-20 mt-2.5 w-80 overflow-hidden rounded-xl bg-ink-50 text-left ring-1 ring-ink-950/10` (`transform-origin:100% 0`):
  - `px-5 py-4`: "Share chat page" 15px/600 ink-950.
  - Row `flex items-center gap-3 border-t border-ink-950/10 px-5 py-4`: `solar:link-linear` size-4 ink-400; `chat.activepieces.com/s/store-desk` 13px ink-700 truncate; a copy button `-mr-1.5 size-7 rounded-md hover:bg-ink-100` with `solar:copy-linear` size-4 ink-500. After the copy it shows `solar:check-read-linear` size-4 accent-a-700 and its aria-label becomes "Link copied".
  - Enter: `opacity .26s, transform .36s cubic-bezier(.16,1,.3,1)` from `translateY(-8px) scale(.94)`.
  - Leave: `.17s / .2s cubic-bezier(.4,0,.9,.4)` to `translateY(-5px) scale(.97)`.
- **One cursor**: fill ink-950, ring ink-400, `--travel: 700ms`, no tag.
- **Transitions:**
  - `rise-enter-active{transition:opacity .48s, transform .52s cubic-bezier(.16,1,.3,1)}`, `rise-enter-from{opacity:0;transform:translateY(10px)}`.
  - `rise-leave-active{transition:opacity .3s;position:absolute}`, `rise-leave-to{opacity:0}`.
  - `rise-move{transition:transform .52s cubic-bezier(.16,1,.3,1)}`.
  - `.chip-in{animation:chip-in .42s cubic-bezier(.16,1,.3,1) both}` with `chip-in 0%{opacity:0;transform:translateY(6px) scale(.94)}`.
  - `.msg-caret` (width 1.5px, height 1rem, ink-500, 1s step-end blink) follows the typed text.

**Loop.** Measured period 16.4s. Times are from the start of a cycle; the first cycle starts about 0.2s after hydration.

| t | event |
|---|---|
| 0.0 | thread `opacity-0` (500ms); the status turns "Draft" with dot ink-300 (colors 500ms) |
| 0.3–0.6 | thread messages leave (rise-leave) |
| 0.8 | thread back to `opacity-100` and empty |
| ~1.6 | cursor fades in and travels to the composer (~269,399) |
| 2.1 → 3.8 | types "How did the Berlin store do last week?" (~83ms per character, with the `.msg-caret`) |
| 4.2–4.7 | cursor travels to the Send button (486,399) and clicks at ~4.7. The bubble rises in; the composer goes back to the placeholder. |
| 5.3 | cursor fades out |
| 5.9 | "Flow ran 2 steps" rises in |
| 6.3 | chip 1 appears in pending state (ink-400, img .4), then turns done (ink-700, img 1) |
| 7.0 | chip 2 does the same |
| 8.2 | answer block rises in |
| ~9.7 | cursor fades in and travels to Share (479,28); clicks at ~10.4. Status becomes "Published" (dot accent-a-500); the popover opens (~10.6). |
| ~11.5–12.0 | cursor moves to the copy button (489,139) and clicks; the icon becomes check-read and the label "Link copied" |
| ~13.7 | cursor fades out |
| ~14.8 | popover closes |
| 16.4 | next cycle |

### 4.5 Solution pages: static hero mocks (no motion)
Each solution page has its own static mock inside `.visual-stage.flex.flex-col.overflow-hidden`, which is 544×448 (302×448 at 390). The markup is plain Tailwind (same vocabulary as the bento mocks: 15px/600 titles, 12–14px meta, `divide-ink-950/10` rows, `px-6 py-5` headers, `bg-ink-50/60` field bands, piece logos size-5). Port it verbatim from `specs/source/solutions_<slug>.html` (the `HERO VISUAL` block). Summary of each:

| page | mock (first text) | piece logos |
|---|---|---|
| marketing | "Inbound leads · 38 today" table (Lead / Source / Fit) | hubspot, linkedin, mailchimp, slack, webflow, wordpress |
| sales | Gmail draft "Re: Pricing for 40 seats", To / Opportunity rows, 4-paragraph body, footer "Stage moved to Negotiation" | gmail, salesforce |
| customer-support | "Ticket #4182 · Waiting on a person", Priority / Topic / Queue, customer message | zendesk, notion |
| finance | "Waiting for finance · Retry", $2,480.00 failed payment, Invoice / Vendor / Reason / Ledger | stripe |
| hr | "Maya Rahal · Support engineer, starts 12 May · 4 of 6 done" checklist | gmail, google-calendar, microsoft-teams, notion, okta |
| operations | "Runs · 1,284 today, 3 failed" table (Flow / Started / Took) | — |
| engineering | "Code step · TypeScript" code listing (fetch GitHub pulls) | — |
| it | "Noor Haddad · Added to the Engineering group" access list (GitHub, Google Drive, Slack, Linear, Datadog) | okta, github, google-drive, slack, linear, datadog |
| internal-tools | "Vendor request" hosted form (forms.activepieces.com/vendor) | — |
| open-source-developers | terminal `npm run create-piece` scaffold output | — |

The sales mock contains a Cloudflare-obfuscated email. The real text is **ines@wrenlabs.com**; the source file already has it decoded.

---

## 5. Under the stage

### 5.1 Product: 3 columns
`div.hero-line mt-12 grid w-full grid-cols-1 gap-8 md:mt-16 md:grid-cols-3 md:gap-0 md:divide-x md:divide-ink-950/10` (`--i:4`).
- Column: `flex flex-col gap-2 md:px-8 md:first:pl-0 md:last:pr-0`. Note that this is px-8 (32), whereas homepage feature columns use px-6.
- `h2` (an h2, not an h3): `text-lg font-semibold text-ink-900`, Inter 600, 18/28.
- `p`: `text-base text-ink-600`, 16/24.

Measured:
| width | columns |
|---|---|
| 1440 | 405.3 wide each; text widths 372 / 340 / 373; block height 84 |
| 768 | 240 each (still 3 columns); block height 160 |
| 390 | 1 column, gap 32; block height 316 |

### 5.2 Solution: rotating customer logos
`div.hero-line mt-12 w-full md:mt-16` (`--i:4`) > `div.grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-10`.

| width | layout |
|---|---|
| 1440 | 6 × 169.3, gap-x 40; height 38.4 |
| 768 | 3 × 218.7, gap 32; 2 rows, height 108.8 |
| 390 | 2 × 159, gap 32; 3 rows, height 179.2 |

- **Cell:** `div.flex items-center justify-center` with inline `--stagger: <i*40>ms; height: 38.40833897525644px`.
- **Logo:** `span[role=img][aria-label=<name>].block w-full bg-ink-600 [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat]` with inline `mask-image:url(<file>)`, `height`, `max-width` and an optional tiny `translateY`.
  - Color ink-600 #45556c.
  - The sizes are fixed (identical at every width).
- **Sets.** 4 sets of 6, cycled in order and always starting at set 1:

| set | logo (file under `/logos/customers/`) height × max-width px |
|---|---|
| 1 | Bosch (bosch.svg) 31.23×109.29 ty .0196 · Alan (alan.svg) 29.45×103.09 · SAP 31.11×108.90 · Tryg 27.52×96.32 · Funding Societies (funding-societies.svg) 29.66×103.82 · Carrefour 38.40×134.40 |
| 2 | Corgi (corgi.webp) 30.70×107.47 · Hilton 32.45×113.56 · Lumen Technologies (lumen.svg) 36.83×128.91 ty .0148 · Pipefy 29.81×104.33 · Dell Technologies (dell-technologies.svg) 38.41×134.43 · ZeroFox 36.96×129.36 |
| 3 | Decathlon 32.97×115.38 · Merkle 36.45×127.56 · Orange 31.03×108.61 · EXL 28.97×101.39 · Concentrix 33.85×118.49 · Odoo 28.39×99.37 |
| 4 | Keller Williams (keller-williams.svg) 38.40×134.40 · HackerOne 33.94×118.79 ty −.0586 · Shopee 31.58×110.53 · ITV 31.46×110.11 · MoneyGram 33.22×116.27 · Capgemini 32.72×114.51 |

  These are the same 24 files and the same per-logo scale data as the homepage marquee list in `Hero.jsx`. The height is the cell height (38.408) × the per-logo scale, and max-width = height × 3.5.
- **Timing.** The first swap happens ~4.0s after load; after that every **3.5s**. Measured swaps: 4.03, 7.51, 11.01, 14.52, 17.99s. Cell *i* changes 40ms after cell *i−1*.
- **Transition** (`rotating-logos` CSS, a Vue `<Transition name="logo-fade">` on each cell's logo):
  ```
  .logo-fade-enter-active,.logo-fade-leave-active{transition:opacity .3s,transform .3s;transition-delay:var(--stagger,0s)}
  .logo-fade-enter-from,.logo-fade-leave-to{opacity:0;transform:scale(.94)}
  @media (prefers-reduced-motion:reduce){… transition:none}
  ```
  Implement it as out-then-in per cell. Each cell is fixed-height, so there is no layout shift.

---

## 6. Bento grid (shared; reuse `BentoSection` / `BentoCard`)

- **Section:** `section.mx-auto w-full max-w-7xl px-5 py-24 md:px-6 md:py-32 lg:px-8` > `flex flex-col gap-5 md:gap-8` > `div.pt-1` > H2.
  - Section padding: 128 top/bottom at ≥768, 96 at 390.
- **H2:** `font-display text-3xl font-bold text-balance text-ink-900 md:text-4xl`, Sentient 700, 36/40 (30/36 at 390).
  - Unlike homepage H, there is **no `max-w-xl`**, so the H2 spans the full 1216.
- **Grid:** `grid w-full grid-cols-1 gap-4 md:grid-cols-24 md:gap-5`, gap 20 at ≥768 and 16 at 390.
- **Card:** identical to homepage H/L (`BentoCard`):
  - `h-[470px] md:h-[500px] rounded-2xl bg-white shadow-edge`, no hover, no motion.
  - Header `px-5 pt-6 pb-5 gap-1`: h3 Inter 500, 20/28 (18/28 below md), ink-900. p 15/21.43 (14/20 below md), ink-600.

Measured card widths:
| | span 12 | span 9 | span 15 | 390 |
|---|---|---|---|---|
| 1440 | 598 | 443.5 | 752.5 | — |
| 768 | 350 | 257.5 | 442.5 | — |
| 390 | — | — | — | 350×470 (single column) |

Section heights: product (8 cards) 2392 at 1440 and 768, 4160 at 390. Solution (6 cards) 1872 at 1440 and 768, 3188 at 390.

### 6.1 Art presets (same as the homepage `ART`)
| art | tint | layer style |
|---|---|---|
| meadow | bg-accent-a-100 | url(/panel/meadow.webp) cover; opacity .7; `saturate(.72) brightness(1.04) contrast(.98)` |
| clouds | bg-primary-100 | url(/panel/clouds.webp) cover; opacity .62; `saturate(.78) brightness(1.06) contrast(.96)` |
| water | bg-primary-200 | url(/rows/water.webp) cover; opacity .55; `saturate(.7) brightness(1.05) contrast(.96)` |
| iris | bg-ink-100 | url(/grid/iris.webp) size 230%; opacity .48; `saturate(.62) brightness(1.08) contrast(.94) blur(3px)` |

The layer is `inset:-1rem`, with the background-position given per card. `/panel/meadow.webp` and `/panel/clouds.webp` now exist at their original paths, so the existing `/assets/*` copies also work.

### 6.2 Mock library (21 unique bodies)

The original site reuses a fixed set of mock bodies. A body's text is identical on every page where it appears, even when it doesn't match the card title (for example sales "Deal Tracking" shows the "Marketing project" members mock). Each mock also always uses the same frame mode. Build each one once as a component and reference it by name from the page data. The markup for each is in `specs/source/_bento-mocks.html`.

| mock | frame mode | first text | used by |
|---|---|---|---|
| triggerTypes | center | Trigger types: Webhook/App event/Polling/Schedule/Manual run | workflow-builder |
| testStepStripe | crop | Charge in Stripe · Amount 4200 · Currency eur · Succeeded in 0.42s · id/status/customer/receipt | workflow-builder, hr, internal-tools, marketing |
| codeSendQuote | center | code window `send-quote.ts` (createAction …) | 12 cards |
| routerTable | wide | Route the run · First match · 7 routes + Loop on items | 7 cards |
| runResume (= homepage "Reliability") | crop-left | Run #48,213 · 2.44s · Resumed from checkpoint | 9 cards |
| mcpServer (= homepage "MCP Server") | float | MCP server · Live · mcp.activepieces.com/v1 · create_invoice/find_customer/post_message | 13 cards |
| versionHistory | center | Version history v13 Draft … v10 | workflow-builder |
| chatLimits | center | Chat limits · Reply timeout 30s · File 10 MB/25 MB · Run history 30 days (same structure as versionHistory) | chat |
| terminalCompose | center | bash · docker compose up … http://localhost:8080 | 7 cards |
| sendMessageConfig | center | Send message · Workspace calder-eu · Channel #billing-alerts … Max steps 20 | ai-agent-builder, customer-support, engineering |
| aiProviders | center | AI providers: OpenAI, Anthropic, Google Gemini, Azure OpenAI, AWS Bedrock | ai-agent-builder |
| approvalRefund | wide (frame has 2 children: sheet + overlay) | Waiting for approval · Refund $2,480.00 to Northaven | 6 cards |
| refundForm | center | Refund request · Waiting for a person … invoice-3184.pdf | ai-agent-builder, finance, it |
| chatThreadBerlin | center | Berlin thread with "Flow ran 4 steps" | chat, finance, it |
| chatShareSettings | center | Store Desk · Published · share link · Who can open it · Bot name | chat, customer-support, engineering |
| chatFile | center | "Pull the numbers out of this for finance." + march-invoices.csv | chat |
| projectMembers | wide (2 children: sheet + role dropdown `absolute top-[38%] right-10 w-[36%] max-w-[170px] min-w-[140px]`) | Marketing project · 6 members (Dana Rowe Admin …) | 5 cards |
| typedFields | center | Accounts field types (Text/Number/Date/Single-select) | tables |
| customersTable (= homepage "Tables") | crop | Customers · 1,284 rows | tables, open-source-developers, operations, sales |
| tablesPieceOps | center | Tables piece: create_records … download_table | tables |
| tableTriggers | wide | Accounts · 3 triggers armed | 6 cards |

The mock code tokens are global classes in the original `entry.css`, measured as: `.code-key{color:accent-a-700 #007a55}`, `.code-fn{color:primary-800 #00598a}`, `.code-str{color:accent-b-700 #bb4d00}`, `.code-text{color:ink-800 #1d293d}`, `.code-dim{color:ink-600 #45556c}`. `src/` defines none of them yet, so add them to the bento section's CSS.

---

## 7. FAQ (reuse `Faq`, with props)
- Section `px-5 py-24 md:px-6 md:py-32 lg:px-8` > `mx-auto max-w-3xl` (768; 350 wide at 390). Inside: H2 wrapper `mb-5 md:mb-8`, then `flex flex-col gap-3`.
- H2 `font-display text-3xl md:text-4xl font-bold text-balance text-ink-900`: 36/40, or 30/36 at 390.
- Item `rounded-2xl bg-white px-5 shadow-edge sm:px-6`.
  - Button `py-5 gap-6`; question `text-lg font-semibold text-ink-900` (18/28).
  - Icon `solar:add-linear` size-5 ink-600, `rotate-45` when open, `transition-transform duration-200`.
  - Answer `p.pb-5 text-base text-ink-600`.
- The first item is open (`aria-expanded="true"`); the others start `display:none`. The behavior is the same as the homepage accordion.
- Closed item height: 68 (1-line question) at ≥768. Section heights: workflow-builder 836 (1440) / 888 (768) / 1072 (390); sales 704 / 704 / 732.
- H2 copy: "Common questions." on all 4 product pages; "What <team> ask." on solution pages (§14).

## 8. Testimonials (solutions only; reuse `Testimonials` with an H2 prop)
Identical to homepage §M: the same 9 cards in the same order, the same avatars, and the stats 25.1k / 356. The image paths in the original are `/reviews/*.webp`; the files are now in `public/reviews/` and are also identical to the `/assets/*` copies.
- H2 copy differs per page (§14).
- Measured 1440: section 916 tall; H2 551.6×40; dl 212.5×60; grid 3 × 418.7, gap 12; cards 180 tall.
- 768: 2 columns of 354; section 1416. 390: 1 column; section 2200.
- Fade mask `--fade` 9rem / 7.5rem / 6rem.

## 9. Case study (solutions only; reuse `CaseFundingSocieties` / `CaseAlan` unchanged)
Copy, stats, sizes and type are identical to homepage §D/J:
- Blockquote 41/44.75 at 1440, 25/32.75 at 768, 24/32 at 390.
- Stats 48/48 at ≥768, 36/40 at 390.
- Section 745 tall at 1440, 700.5 at 768, 903 at 390.

Logo paths in the original are `/logos/customers/funding-societies.webp` (739×242) and `/logos/customers/alan.svg` (261×72); both are now in public/ as well.

| case study | pages |
|---|---|
| **Funding Societies** | marketing, customer-support, hr, it, internal-tools |
| **Alan** | sales, finance, operations, engineering, open-source-developers |

## 10. Footer closing (reuse `Footer`, with closing H2/lede props)
Only the closing H2 and lede change (§14). Everything else matches the homepage footer:
- CTAs "Start building" (`ap_cta=closing&ref=<route>`) and "Talk to sales" (`/sales?ap_cta=closing`).
- Bullets "Free to start / No credit card / Open source".
- Link columns.
- Footer height: 975 at 1440, 1211 at 768, 1761–1801 at 390.

Image path: the original uses `/closing/meadow-2064.webp` (srcset `/closing/meadow-1376.webp 1376w, /closing/meadow-2064.webp 2064w`). Both are now in `public/closing/`.

---

## 11. Page geometry (document height, including header and footer)

| | 1440 | 768 | 390 |
|---|---|---|---|
| /product/workflow-builder | 5411 (hero 0–1208, grid 1208–3600, faq 3600–4436, footer 4436) | 5863 | 8485 |
| /solutions/sales | 6375 (hero 0–1162, grid 1162–3034, case 3034–3780, testimonials 3780–4696, faq 4696–5400, footer 5400) | 7224 | 10275 |

The other pages differ only through text wrapping in the hero, the FAQ and the static mocks.

## 12. Hover and interaction states
- **Hero CTAs:** solid hover bg ink-900; secondary hover bg ink-100 + `shadow-edge-hover`. `active:scale-[0.99]`; 200ms ease-out.
- **FAQ:** no hover color change; the icon rotates.
- **Bento cards, testimonial cards, case study and logo grid:** no hover.
- **Tables demo:**
  - The stage button and dropdown options are real buttons; options use `hover:bg-ink-100`.
  - Clicking one should take control away from the scripted loop (same `takeOver` behavior as the homepage demos).
- **Chat demo:**
  - Share button: `hover:border-ink-950/20 hover:text-ink-900`. Copy button: `hover:bg-ink-100`. Send button: `hover:bg-ink-900`.
- **Focus:** every button and link uses `focus-visible:outline-2 outline-offset-2 outline-primary-700`.

## 13. Motion checklist
1. Hero `.hero-line` entrance (§3.1). These pages have no scroll-triggered animations: I found no IntersectionObserver-driven reveals; only the demos run.
2. Hero demo loop: flow-canvas, agent-thread, tables or chat (§4).
3. Solution logo rotation every 3.5s (§5.2).
4. FAQ accordion (homepage behavior).
5. `prefers-reduced-motion`: switch all of the above off and show the static end states.

---

## 14. Per-page content

The fields map to template props:
- `ctaKey` → hero hrefs `https://cloud.activepieces.com/sign-up?ap_cta=<ctaKey>&ref=<encodeURIComponent(route)>` and `/sales?ap_cta=<ctaKey>`.
- `stageBg` → `/panel/<stageBg>.webp` (+ srcset).
- `cards` → `[span, title, desc, art, bgPosition, mock]`; the frame mode comes from the mock (§6.2).
- `caseStudy` → `fundingSocieties` | `alan`.
- `closing` → footer H2 and lede.

Every page uses the same CTA labels: "Start building" and "Talk to sales".

### /product/workflow-builder

```jsonc
{
 "route": "/product/workflow-builder",
 "title": "Build automations without writing code | Activepieces",
 "metaDescription": "Pick a trigger, add the apps and steps you need, and publish. Every run is saved as it goes, so a crash or a deploy picks up from the last finished step, and…",
 "hero": {
  "section": "builder-hero",
  "h1": "Build automations without writing code.",
  "lede": "Pick a trigger, add the apps and steps you need, and publish. Runs are saved as they go, so a crash or a deploy doesn't lose work. Every run is kept for 30 days so you can check it and retry.",
  "ctaKey": "builder_hero",
  "stageBg": "clouds",
  "visual": "flowCanvas (homepage FeatureFlowDemo, unchanged)",
  "visualImages": ["/logos/pieces/hubspot.svg", "/logos/pieces/openai.svg", "/logos/pieces/slack.svg", "/logos/pieces/webhook.svg"],
  "columns": [
   ["Use the apps you already have", "Build from 760+ integrations, and use a code or HTTP step for anything they don’t cover."],
   ["Branch and repeat", "Send the run down different paths, and repeat a set of steps over every item in a list."],
   ["See what every run did", "Each run keeps its inputs and outputs for 30 days, so you can retry the step that failed."]
  ]
 },
 "grid": {
  "h2": "What else the builder does.",
  "cards": [  // [span, title, desc, art, bgPosition, mock]
   [12, "Any Trigger", "A webhook, a schedule, an event in one of your apps, or a manual run.", "clouds", "50% 26%", "triggerTypes"],
   [12, "Test Every Step", "Run a single step on real data and read its output before you publish.", "meadow", "50% 62%", "testStepStripe"],
   [9, "Code Steps", "Write TypeScript in any step you need it.", "water", "50% 16%", "codeSendQuote"],
   [15, "Routers and Loops", "Branch on a condition, catch everything else, and repeat steps over a list.", "water", "50% 30%", "routerTable"],
   [15, "Runs That Resume", "A crash or a deploy picks the run up from the last finished step.", "clouds", "50% 58%", "runResume"],
   [9, "Build by Asking", "Describe what you want, and it gets built.", "iris", "50% 100%", "mcpServer"],
   [12, "Draft and Publish", "Publishing locks that version. Editing a live automation opens a new draft.", "meadow", "22% 34%", "versionHistory"],
   [12, "Open Source", "Run the MIT-licensed core yourself with Docker, Compose or the Helm chart.", "clouds", "50% 12%", "terminalCompose"]
  ]
 },
 "faq": {
  "h2": "Common questions.",
  "items": [  // [question, answer]; first item open by default
   ["How many automations can we run at once, and how long can one run take?", "There is no cap per organization on our cloud, and no limit in the license when you self-host. Each worker handles 5 jobs at a time, and jobs queue instead of being dropped when you go over. A single run is capped at 10 minutes by default, which you can raise when self-hosting."],
   ["When a run fails, how do we find out what happened?", "Every run appears on the Runs page with its status, the step it failed on, the error it returned, and the input and output of each step. Everyone in the project gets an email on failure, and a one-step automation can forward that to Slack, Teams or PagerDuty."],
   ["Can we call a webhook, and is there an API to manage automations from our own systems?", "Both. Every webhook-triggered automation gets its own URL, and with a response step it answers right away, so you can publish one as an HTTP API without code. Separately, each automation is plain JSON you can export and re-import over the REST API, which is on paid plans."],
   ["What do we have to stand up to run it on our own infrastructure?", "A stateless app, one or more stateless workers, PostgreSQL, Redis, and optionally S3-compatible storage for run logs. Docker, Docker Compose and our Helm chart all work. PostgreSQL is required, and we support containerized deployments only."],
   ["What does a run cost?", "One credit for the whole run, however many steps it has. Branching, loops and code do not change it. A polling trigger that finds nothing is free, and so are test runs from the builder."]
  ]
 },
 "closing": {"h2": "Build your first automation today.", "lede": "It takes a few minutes, and the free plan needs no card. Cloud or your own servers."}
}
```

### /product/ai-agent-builder

```jsonc
{
 "route": "/product/ai-agent-builder",
 "title": "Let your AI agent do the work in your apps | Activepieces",
 "metaDescription": "Set a goal and choose which apps, automations, MCP servers and files the agent can use. It works out the steps and carries them out, and anything you want to…",
 "hero": {
  "section": "ai-agents-hero",
  "h1": "Let your AI agent work in your apps.",
  "lede": "You set the goal and choose which apps, flows and files the agent can use. It decides the steps and carries them out. Anything you want to check first waits for your approval.",
  "ctaKey": "ai_agents_hero",
  "stageBg": "meadow",
  "visual": "agentThread (homepage FeatureAgentsDemo, unchanged)",
  "visualImages": ["/logos/pieces/gmail.svg", "/logos/pieces/quickbooks.svg", "/logos/pieces/xero.svg"],
  "columns": [
   ["You choose its tools", "Any app action, one of your own automations, an MCP server, or files you upload for it to read."],
   ["Your model, your key", "An admin sets up the provider once: OpenAI, Anthropic, Gemini, Azure or Bedrock."],
   ["Approval before it acts", "Put a person in front of any step that matters. A paused run keeps its place for 30 days."]
  ]
 },
 "grid": {
  "h2": "How you decide what an agent can do.",
  "cards": [  // [span, title, desc, art, bgPosition, mock]
   [12, "Locked Inputs", "Set the values the agent cannot change, and let it fill in the rest.", "clouds", "50% 26%", "sendMessageConfig"],
   [12, "Your Own Model", "OpenAI, Anthropic, Gemini, Azure, Bedrock, or any compatible endpoint.", "meadow", "50% 62%", "aiProviders"],
   [9, "External MCP", "Let the agent use your own MCP servers too.", "iris", "50% 100%", "mcpServer"],
   [15, "Human Approvals", "The run waits for one person to approve. They need no account and no seat.", "water", "50% 30%", "approvalRefund"],
   [15, "Runs That Resume", "Finished steps are kept, and every tool call is written to the run log.", "clouds", "50% 58%", "runResume"],
   [9, "Custom Tools", "Write your own integration in TypeScript.", "water", "50% 16%", "codeSendQuote"],
   [12, "Hosted Forms", "Text, long text, file and toggle fields on a page we host for you.", "meadow", "22% 34%", "refundForm"],
   [12, "Open Source", "Agents work the same on our cloud and on your own instance.", "clouds", "50% 12%", "terminalCompose"]
  ]
 },
 "faq": {
  "h2": "Common questions.",
  "items": [  // [question, answer]; first item open by default
   ["What does an agent come with: memory, our documents, tools?", "An instruction, the tools you allow it, and the knowledge you give it. Its tools can be any integration, another of your automations, or your own MCP servers. Knowledge comes from files you upload or tables you keep current. Two limits: it remembers nothing between runs, and there is no live sync from SharePoint, Drive or Notion."],
   ["Can we plug in our own models and let IT hold the keys?", "Yes. An admin adds the provider credentials once and every project can use them, so nobody else handles a key. OpenAI, Anthropic, Google AI, Azure OpenAI and AWS Bedrock work directly, and anything else connects through the OpenAI-compatible provider with a base URL and key. Admins also choose which models are available."],
   ["What does an AI step or an agent tool call cost?", "Three things: the run at 1 credit, each AI step at 2, 10 or 20 depending on the model tier, and each agent tool call at 1. A fifty-step automation with no AI in it costs 1 credit."],
   ["If we bring our own AI key, do we still pay credits?", "It gets cheaper rather than free. An AI step costs 1 credit with your own key, and you pay your provider for the tokens. Calling your own AI service through a custom integration or an HTTP step is not counted as an AI step at all."],
   ["Can we point Claude or our own agent at Activepieces and have it build the automations?", "Yes. Turn on the project's MCP server in settings and point Claude, Cursor or your own agent at the connection string. It creates and edits automations directly in your project, with nothing to import. It is on paid plans, and it builds them well but not perfectly."]
  ]
 },
 "closing": {"h2": "Give your first agent a goal to work on.", "lede": "Start free, pick the tools it can use, and approve anything that matters before it runs."}
}
```

### /product/tables

```jsonc
{
 "route": "/product/tables",
 "title": "Store your data without setting up a database | Activepieces",
 "metaDescription": "Tables live inside Activepieces and hold up to 10,000 rows each. Your automations create, find and update records, a change to a record starts a run, and your…",
 "hero": {
  "section": "tables-hero",
  "h1": "Store your data, no database needed.",
  "lede": "Tables hold up to 10,000 rows each. Your automations create, find and update rows, saving a row can start a run, and your agents can read the same data.",
  "ctaKey": "tables_hero",
  "stageBg": "coast",
  "visual": "tablesDemo (new, §P.4)",
  "visualImages": [],
  "columns": [
   ["Add a field like a column", "Text, number, date and single-select, added like a column in a spreadsheet."],
   ["Your automations use it", "Create, find, update and delete records from any step, in tables of up to 10,000 rows."],
   ["A change starts a run", "Creating, updating or deleting a record starts an automation right away, with no polling."]
  ]
 },
 "grid": {
  "h2": "What you can do with a table.",
  "cards": [  // [span, title, desc, art, bgPosition, mock]
   [12, "Typed Fields", "Text, number, date and single-select. Nothing to migrate or connect.", "meadow", "50% 62%", "typedFields"],
   [12, "Editable Rows", "Edit a row in place, so whoever owns the data can correct it.", "water", "50% 16%", "customersTable"],
   [9, "Every Operation", "Create, find, update, delete and export.", "iris", "50% 100%", "tablesPieceOps"],
   [15, "Change Triggers", "A new, edited or deleted record starts an automation right away.", "water", "50% 30%", "tableTriggers"],
   [15, "Runs and History", "Every write is a step you can read back, kept for 30 days.", "clouds", "50% 58%", "runResume"],
   [9, "Agents Can Read It", "Your agents read and write the same tables over MCP.", "clouds", "50% 12%", "mcpServer"],
   [12, "Access Control", "Projects and roles decide who can edit a record, the same as an automation.", "meadow", "22% 34%", "projectMembers"],
   [12, "Open Source", "Part of the MIT-licensed core, so you can self-host it anywhere.", "clouds", "50% 30%", "terminalCompose"]
  ]
 },
 "faq": {
  "h2": "Common questions.",
  "items": [  // [question, answer]; first item open by default
   ["What can an automation do with a table?", "Create, find, update and delete records, filtered by field. A new, edited or deleted record can also start an automation the moment it happens."],
   ["What are the limits on a table?", "10,000 records and 100 fields per table by default, both raisable when you self-host, and as many tables per project as you like. For data in the megabyte range, pass it between steps as a file."],
   ["Can we keep each team's data separate?", "Projects are the boundary: someone in one project cannot see another project's records. The separation is logical rather than physical, since projects share an instance. Physical separation means a second instance or a self-hosted deployment."],
   ["How long is run and table data kept?", "Records stay until you delete them. Run data is kept for 30 days by default and can go up to 365. When you self-host, you set the window yourself."],
   ["Is Tables in the open-source edition?", "Yes, it is part of the MIT-licensed core, with no separate database to set up. Community Edition leaves out projects, SSO, audit logs, Git Sync and agents."]
  ]
 },
 "closing": {"h2": "Put your data next to your work.", "lede": "Tables are free on every plan, with nothing to provision. Start with one and connect it."}
}
```

### /product/chat

```jsonc
{
 "route": "/product/chat",
 "title": "Let people use your automation from a chat page",
 "metaDescription": "Publishing an automation gives it a chat page with its own link. Someone types a question, the automation runs, and the answer comes back in the same thread…",
 "hero": {
  "section": "chat-hero",
  "h1": "Give your automation a chat page.",
  "lede": "Publish an automation and it gets a link you can share. People type a question, the automation runs, and the answer comes back in the same thread with text, files and code. You don't build a front end.",
  "ctaKey": "chat_hero",
  "stageBg": "clouds",
  "visual": "chatDemo (new, §P.5)",
  "visualImages": ["/logos/pieces/google-sheets.svg", "/logos/pieces/shopify.svg"],
  "columns": [
   ["The answer comes back in the thread", "Your automation replies with formatted text, code and links, within a 30-second window."],
   ["Files go both ways", "People can upload a file in the thread, and a reply can send one back, up to 10 MB."],
   ["We host the page", "Publishing gives the chat its own URL. There is no front end to build and nothing to deploy."]
  ]
 },
 "grid": {
  "h2": "What the chat page handles for you.",
  "cards": [  // [span, title, desc, art, bgPosition, mock]
   [12, "A Real Thread", "People ask in their own words instead of filling in a form.", "clouds", "50% 26%", "chatThreadBerlin"],
   [12, "One Public Link", "Publishing gives the chat a URL. Drafts stay private until then.", "meadow", "50% 62%", "chatShareSettings"],
   [9, "Files Both Ways", "People upload files, and replies can send files back.", "water", "50% 16%", "chatFile"],
   [15, "Any Steps In Between", "Route by what was asked, call any app, or hand the message to an agent.", "water", "50% 30%", "routerTable"],
   [15, "Every Message Logged", "Each message is a run you can open, read step by step, and retry.", "clouds", "50% 58%", "runResume"],
   [9, "The Limits", "A 30-second reply window and 10 MB per file.", "iris", "50% 100%", "chatLimits"],
   [12, "Access Control", "Only published automations open, and roles still decide who can edit them.", "meadow", "22% 34%", "projectMembers"],
   [12, "Open Source", "The chat trigger and its reply step are part of the MIT-licensed core.", "clouds", "50% 12%", "terminalCompose"]
  ]
 },
 "faq": {
  "h2": "Common questions.",
  "items": [  // [question, answer]; first item open by default
   ["How does an automation answer a chat message?", "Each message starts a run. Your steps run in order, and a reply step sends the answer back as formatted text plus an optional file. Each visitor keeps a session id that ties their messages together."],
   ["Can someone non-technical build the automation behind it?", "Yes. They describe what they want and the assistant builds a real automation, using the accounts and tables already connected in your project. It appears on the canvas for an engineer to review, edit and version."],
   ["Is there a limit on response time or size?", "The reply has to be sent within 30 seconds. Files are capped at 10 MB each on cloud and 25 MB when you self-host. For work that takes longer, answer straight away and send the result another way."],
   ["Who can open a published chat page?", "Anyone with the link. The page is public and has no login, so treat the link as the access control. Only published automations open, and project roles decide who can edit the one behind it."],
   ["Is the chat trigger in the open-source edition?", "Yes. The chat trigger and its reply step are part of the open-source core, with no account to connect."]
  ]
 },
 "closing": {"h2": "Give your team a chat page to use.", "lede": "Publish an automation and share the link. Free to start, with no front end to build."}
}
```

### /solutions/marketing

```jsonc
{
 "route": "/solutions/marketing",
 "title": "Marketing automation without engineering | Activepieces",
 "metaDescription": "Connect your CRM, email tool, ads and content stack from 760+ integrations, and launch a campaign without waiting on engineering.",
 "hero": {
  "section": "marketing-hero",
  "h1": "Launch campaigns without engineering.",
  "lede": "Connect your CRM, email tool, ads and content stack from 760+ integrations. AI drafts copy and scores leads, and each lead goes to the right list and owner based on where it came from.",
  "ctaKey": "solution_marketing_hero",
  "stageBg": "clouds",
  "visual": "static mock: specs/source/solutions_marketing.html <!-- HERO VISUAL --> block",
  "visualImages": ["/logos/pieces/hubspot.svg", "/logos/pieces/linkedin.svg", "/logos/pieces/mailchimp.svg", "/logos/pieces/slack.svg", "/logos/pieces/webflow.svg", "/logos/pieces/wordpress.svg"],
  "logos": "rotatingCustomerLogos (§S.2)"
 },
 "grid": {
  "h2": "What a marketing automation can do.",
  "cards": [  // [span, title, desc, art, bgPosition, mock]
   [12, "Lead Scoring", "Score a lead by intent the moment the form is submitted.", "clouds", "50% 26%", "testStepStripe"],
   [12, "Campaign Reports", "Collect spend and performance from every channel on a schedule.", "meadow", "50% 62%", "terminalCompose"],
   [9, "AI Actions", "Summarize, classify and extract data.", "water", "50% 16%", "codeSendQuote"],
   [15, "760+ Integrations", "The ad platforms, CRM, CMS and email tools already on your media plan.", "water", "50% 30%", "approvalRefund"],
   [15, "Lead Routing", "Send a lead down a different path by source, score or campaign.", "clouds", "50% 58%", "runResume"],
   [9, "Chat and Forms", "Add a form or chat page without building one.", "iris", "50% 100%", "mcpServer"]
  ]
 },
 "caseStudy": "fundingSocieties",
 "testimonials": {"h2": "Marketing teams already running it."},
 "faq": {
  "h2": "What marketing teams ask.",
  "items": [  // [question, answer]; first item open by default
   ["Do I need an engineer to build one?", "No. You connect a trigger to the steps you want, add an AI action or a branch, and publish. 760+ integrations cover most marketing tools without any code."],
   ["What AI actions can I use in a marketing automation?", "Ask AI, summarize text, classify text, extract structured data, generate an image, and run an agent, using whichever provider your admin sets up."],
   ["How is this priced for a marketing team?", "Free is one person and 1,000 credits a month. Plus is $16 a month billed yearly for 5 people and 10,000 credits. Team is $166 a month billed yearly for the first 25 people, with 50,000 credits, SSO and roles."],
   ["Can I bring my own AI key?", "Yes, on Plus and above. A call with your own key costs 1 credit instead of 2, 10 or 20."]
  ]
 },
 "closing": {"h2": "Launch your next campaign yourself.", "lede": "Connect your marketing stack and build the first one free. No card, and no ticket for engineering."}
}
```

### /solutions/sales

```jsonc
{
 "route": "/solutions/sales",
 "title": "Sales automation that keeps the CRM current | Activepieces",
 "metaDescription": "Keep your CRM up to date automatically. Leads are scored and assigned, follow-ups are drafted for a rep to send, and every record is updated as the deal moves.",
 "hero": {
  "section": "sales-hero",
  "h1": "Keep your CRM up to date automatically.",
  "lede": "Connect the CRM your reps already use. Leads are scored and assigned by territory or deal size, follow-ups are drafted for a rep to send, and discounts above your limit go to a manager for approval.",
  "ctaKey": "solution_sales_hero",
  "stageBg": "meadow",
  "visual": "static mock: specs/source/solutions_sales.html <!-- HERO VISUAL --> block",
  "visualImages": ["/logos/pieces/gmail.svg", "/logos/pieces/salesforce.svg"],
  "logos": "rotatingCustomerLogos (§S.2)"
 },
 "grid": {
  "h2": "What runs around your pipeline.",
  "cards": [  // [span, title, desc, art, bgPosition, mock]
   [12, "Draft the Follow-up", "An agent writes the follow-up and logs the call summary for a rep to review.", "clouds", "50% 26%", "customersTable"],
   [12, "Deal Tracking", "Track deals and accounts in tables, with no database to set up.", "meadow", "50% 62%", "projectMembers"],
   [9, "Pipeline as a Tool", "Publish it as an MCP server AI tools can call.", "water", "50% 16%", "mcpServer"],
   [15, "Territory Routing", "Assign a deal by territory, size or stage in the same automation.", "water", "50% 30%", "routerTable"],
   [15, "Discount Approvals", "A discount above your limit waits for a manager to approve it.", "clouds", "50% 58%", "tableTriggers"],
   [9, "Sales and CRM Apps", "The CRMs, dialers and enrichment tools you use.", "iris", "50% 100%", "codeSendQuote"]
  ]
 },
 "caseStudy": "alan",
 "testimonials": {"h2": "Sales teams already running it."},
 "faq": {
  "h2": "What sales teams ask.",
  "items": [  // [question, answer]; first item open by default
   ["Does this replace my CRM?", "No, it connects to it and handles the work around it: intake, scoring, routing and keeping records updated."],
   ["What can an AI agent actually do for a sales team?", "Complete a task for a rep, such as drafting a follow-up email or summarizing a call, using a model your admin sets up."],
   ["How is this priced for a sales team?", "Plus is $16 a month billed yearly for 5 people and 10,000 credits. Team is $166 a month billed yearly for the first 25 people, then $25 each, with 50,000 credits, SSO and roles. You pay for runs, not seats."],
   ["Can I try it before rolling it out to the whole team?", "Yes. The Free plan gives one person 1,000 credits a month with no credit card."]
  ]
 },
 "closing": {"h2": "Stop the data entry, keep the pipeline current.", "lede": "Connect your CRM and let the scoring, routing and updates happen on their own. Free to start."}
}
```

### /solutions/customer-support

```jsonc
{
 "route": "/solutions/customer-support",
 "title": "Support automation with a human handoff | Activepieces",
 "metaDescription": "Connect your helpdesk so every ticket is read and routed on arrival. A chat page answers the common questions, and anything needing judgment goes to an agent.",
 "hero": {
  "section": "customer-support-hero",
  "h1": "Route and answer tickets as they arrive.",
  "lede": "Connect your helpdesk and every ticket is read and routed when it arrives. A chat page handles questions with a known answer. Refunds and exceptions go to an agent to decide.",
  "ctaKey": "solution_customer-support_hero",
  "stageBg": "coast",
  "visual": "static mock: specs/source/solutions_customer-support.html <!-- HERO VISUAL --> block",
  "visualImages": ["/logos/pieces/notion.svg", "/logos/pieces/zendesk.svg"],
  "logos": "rotatingCustomerLogos (§S.2)"
 },
 "grid": {
  "h2": "What happens before an agent opens the ticket.",
  "cards": [  // [span, title, desc, art, bgPosition, mock]
   [12, "A Person Decides", "The automation pauses whenever someone needs to make the call.", "clouds", "50% 26%", "sendMessageConfig"],
   [12, "A Chat Page", "Answer the common questions directly, and pass the rest on.", "meadow", "50% 62%", "chatShareSettings"],
   [9, "Ticket Routing", "Send a ticket to the right queue by topic, priority or account.", "water", "50% 16%", "codeSendQuote"],
   [15, "Refund Review", "A refund goes out only after someone on your team approves it.", "water", "50% 30%", "approvalRefund"],
   [15, "Every Ticket Logged", "Read any run step by step, and retry it if it failed.", "clouds", "50% 58%", "runResume"],
   [9, "AI Triage", "Classify and summarize a ticket from any step.", "iris", "50% 100%", "mcpServer"]
  ]
 },
 "caseStudy": "fundingSocieties",
 "testimonials": {"h2": "Support teams already running it."},
 "faq": {
  "h2": "What support teams ask.",
  "items": [  // [question, answer]; first item open by default
   ["Will this fully automate my support queue?", "It handles the routine parts: reading, tagging and routing. Anything you want a person to decide waits for them."],
   ["What if a ticket needs a real person?", "Add an approval step and the automation pauses there. Nothing reaches the customer until someone signs off."],
   ["How is this priced for a support team?", "Plus is $16 a month billed yearly for 5 people and 10,000 credits. Team is $166 a month billed yearly for the first 25 people, then $25 each, with 50,000 credits, SSO, roles and email support."],
   ["Can the chat page reach our own systems?", "Yes. It runs an automation, so it reaches whatever that automation reaches, including your helpdesk, CRM and tables."]
  ]
 },
 "closing": {"h2": "Let the routine tickets answer themselves.", "lede": "Connect your helpdesk, route what arrives, and keep a person on the calls that need one."}
}
```

### /solutions/finance

```jsonc
{
 "route": "/solutions/finance",
 "title": "Finance automation with an audit trail | Activepieces",
 "metaDescription": "Match transactions against the ledger automatically, hold every payment until an approver signs off, and keep a record of what moved and who approved it.",
 "hero": {
  "section": "finance-hero",
  "h1": "Approve payments, reconcile the books.",
  "lede": "Connect your accounting and payment tools to match transactions against the ledger. Payments post only after the approver you choose signs off, and every run records what moved and who approved it.",
  "ctaKey": "solution_finance_hero",
  "stageBg": "clouds",
  "visual": "static mock: specs/source/solutions_finance.html <!-- HERO VISUAL --> block",
  "visualImages": ["/logos/pieces/stripe.svg"],
  "logos": "rotatingCustomerLogos (§S.2)"
 },
 "grid": {
  "h2": "What you get at the end of the month.",
  "cards": [  // [span, title, desc, art, bgPosition, mock]
   [12, "Payment Approvals", "A payment or journal entry waits for a second person to sign off.", "clouds", "50% 26%", "refundForm"],
   [12, "Reconciliation Queue", "Keep the queue in tables, with no database to set up.", "meadow", "50% 62%", "chatThreadBerlin"],
   [9, "Scheduled Close", "The monthly close is assembled on a schedule you set.", "water", "50% 16%", "mcpServer"],
   [15, "A Record of Each Run", "Every run keeps its inputs and outputs for 30 days.", "water", "50% 30%", "routerTable"],
   [15, "Separate Duties", "Projects and roles decide who can build and who can approve.", "clouds", "50% 58%", "tableTriggers"],
   [9, "Keep It In-House", "Self-host it if the data has to stay with you.", "iris", "50% 100%", "codeSendQuote"]
  ]
 },
 "caseStudy": "alan",
 "testimonials": {"h2": "Finance teams already running it."},
 "faq": {
  "h2": "What finance teams ask.",
  "items": [  // [question, answer]; first item open by default
   ["How long are run logs kept?", "30 days by default on cloud and self-hosted, and up to 365."],
   ["Can we require sign-off before a payment goes out?", "Yes. Add an approval step and the automation pauses until the person you name approves it."],
   ["Do we get audit logs on our plan?", "Audit logs are an enterprise feature. Team includes SSO and global connections; audit logs are on the plan above it."],
   ["Can we self-host to keep financial data in-house?", "Yes, with Docker, Docker Compose or Kubernetes. On our cloud, data is held in Frankfurt."]
  ]
 },
 "closing": {"h2": "Close the month with a record of it.", "lede": "Match transactions, hold payments for approval, and keep every run. Free to start."}
}
```

### /solutions/hr

```jsonc
{
 "route": "/solutions/hr",
 "title": "HR automation from offer to onboarded | Activepieces",
 "metaDescription": "A form collects the new hire’s details, then every account, introduction and check-in happens on its scheduled date. Offboarding runs the same steps in reverse.",
 "hero": {
  "section": "hr-hero",
  "h1": "Onboard and offboard on schedule.",
  "lede": "A form collects the new hire’s details, then each account, introduction and check-in happens on its scheduled date. Offboarding runs the same steps in reverse, and both keep a record.",
  "ctaKey": "solution_hr_hero",
  "stageBg": "meadow",
  "visual": "static mock: specs/source/solutions_hr.html <!-- HERO VISUAL --> block",
  "visualImages": ["/logos/pieces/gmail.svg", "/logos/pieces/google-calendar.svg", "/logos/pieces/microsoft-teams.svg", "/logos/pieces/notion.svg", "/logos/pieces/okta.svg"],
  "logos": "rotatingCustomerLogos (§S.2)"
 },
 "grid": {
  "h2": "What runs between the offer and the last day.",
  "cards": [  // [span, title, desc, art, bgPosition, mock]
   [12, "Offboarding", "Access is removed on the exact date the person leaves.", "clouds", "50% 26%", "testStepStripe"],
   [12, "Request Routing", "Time off, expenses and IT requests each go to the right person.", "meadow", "50% 62%", "terminalCompose"],
   [9, "Forms and Surveys", "Collect details for onboarding, offboarding or feedback.", "water", "50% 16%", "codeSendQuote"],
   [15, "Manager Sign-off", "The automation waits until the right manager approves.", "water", "50% 30%", "approvalRefund"],
   [15, "One Place to Ask", "Give your team a single form or chat page for common requests.", "clouds", "50% 58%", "runResume"],
   [9, "Handled Carefully", "Credentials are encrypted, never exposed.", "iris", "50% 100%", "mcpServer"]
  ]
 },
 "caseStudy": "fundingSocieties",
 "testimonials": {"h2": "People teams already running it."},
 "faq": {
  "h2": "What HR teams ask.",
  "items": [  // [question, answer]; first item open by default
   ["How many people can use this?", "Free is one person. Plus is $16 a month billed yearly for 5 people. Team is $166 a month billed yearly for the first 25, then $25 each. All three are self-serve."],
   ["Can this handle sensitive employee data?", "Credentials are stored with 256-bit encryption and never exposed through the API. If the data has to stay in your network, self-host the MIT-licensed core."],
   ["Does it support a global team?", "Yes. The interface is available in 11 languages, including English, Spanish, French, German, Japanese and Chinese."],
   ["What if a step needs a manager’s sign-off?", "Add an approval step and the automation pauses there until that manager approves it."]
  ]
 },
 "closing": {"h2": "Onboard your next hire without a checklist.", "lede": "Collect the details once, and let each account and check-in happen on its own date."}
}
```

### /solutions/operations

```jsonc
{
 "route": "/solutions/operations",
 "title": "Ops automation across every handoff | Activepieces",
 "metaDescription": "Keep your systems in sync without manual work. Route each record to the right place, process lists on a schedule, and reuse a step across every automation.",
 "hero": {
  "section": "operations-hero",
  "h1": "Keep your systems in sync.",
  "lede": "Route each record to the right place and process lists on a schedule. Build a step once and reuse it in every automation that needs it.",
  "ctaKey": "solution_operations_hero",
  "stageBg": "coast",
  "visual": "static mock: specs/source/solutions_operations.html <!-- HERO VISUAL --> block",
  "visualImages": [],
  "logos": "rotatingCustomerLogos (§S.2)"
 },
 "grid": {
  "h2": "What sits between one tool and the next.",
  "cards": [  // [span, title, desc, art, bgPosition, mock]
   [12, "Systems in Sync", "Keep two tools matching each other without a nightly script.", "clouds", "50% 26%", "customersTable"],
   [12, "Weekly Reporting", "The weekly numbers are gathered and sent out on a schedule.", "meadow", "50% 62%", "projectMembers"],
   [9, "Queue Tracking", "Track where each handoff stands, in tables.", "water", "50% 16%", "mcpServer"],
   [15, "Runs That Resume", "A crash or a deploy picks up from the last finished step.", "water", "50% 30%", "routerTable"],
   [15, "Reusable Steps", "Build a set of steps once and call it from any automation.", "clouds", "50% 58%", "tableTriggers"],
   [9, "Reporting Tools", "Pull numbers from your warehouse and dashboards.", "iris", "50% 100%", "codeSendQuote"]
  ]
 },
 "caseStudy": "alan",
 "testimonials": {"h2": "Operations teams already running it."},
 "faq": {
  "h2": "What operations teams ask.",
  "items": [  // [question, answer]; first item open by default
   ["Can I chain several tools in one automation?", "Yes. One automation can call as many apps as you need, in order or down separate branches, and reuse steps you built elsewhere."],
   ["What happens if a step fails partway through?", "Each run is saved as it goes, so a crash or a deploy picks it up from the last finished step. You can also open the run, see the error and retry that step."],
   ["How is this priced for an ops team?", "Plus is $16 a month billed yearly for 5 people and 10,000 credits. Team is $166 a month billed yearly for the first 25 people, then $25 each, with 50,000 credits, SSO, roles and shared connections."],
   ["Can we self-host if that is our policy?", "Yes, with Docker, Docker Compose or the Kubernetes Helm chart."]
  ]
 },
 "closing": {"h2": "Stop moving data between your tools.", "lede": "Connect the systems your team runs on and let the handoffs happen on their own."}
}
```

### /solutions/engineering

```jsonc
{
 "route": "/solutions/engineering",
 "title": "Engineering automation you extend in code | Activepieces",
 "metaDescription": "A sandboxed TypeScript step, MCP servers your agents can call, a CLI for building your own integration, and a REST API for the whole platform.",
 "hero": {
  "section": "engineering-hero",
  "h1": "Automate with code where you need it.",
  "lede": "Use a sandboxed TypeScript step for anything the integrations don’t cover. Publish an automation as an MCP server your agents and editor can call, build your own integration with the CLI, or use the REST API.",
  "ctaKey": "solution_engineering_hero",
  "stageBg": "clouds",
  "visual": "static mock: specs/source/solutions_engineering.html <!-- HERO VISUAL --> block",
  "visualImages": [],
  "logos": "rotatingCustomerLogos (§S.2)"
 },
 "grid": {
  "h2": "What you can extend it with.",
  "cards": [  // [span, title, desc, art, bgPosition, mock]
   [12, "Automations as MCP Tools", "Publish one at /mcp for your agents and editor to call.", "clouds", "50% 26%", "sendMessageConfig"],
   [12, "pieces-cli", "Scaffold, build and publish your own integration in TypeScript.", "meadow", "50% 62%", "chatShareSettings"],
   [9, "REST API", "A documented OpenAPI spec with API-key auth.", "water", "50% 16%", "codeSendQuote"],
   [15, "Loops and Branches", "Work through a list or split on a condition in the same automation.", "water", "50% 30%", "approvalRefund"],
   [15, "MIT-licensed Core", "Everything outside the enterprise directory is yours to read and fork.", "clouds", "50% 58%", "runResume"],
   [9, "Weekly Releases", "Self-hosted releases ship every Monday.", "iris", "50% 100%", "mcpServer"]
  ]
 },
 "caseStudy": "alan",
 "testimonials": {"h2": "Engineering teams already running it."},
 "faq": {
  "h2": "What engineers ask.",
  "items": [  // [question, answer]; first item open by default
   ["Can I build my own integration?", "Yes. The CLI scaffolds and publishes an integration, action or trigger in TypeScript. Community integrations are open source on npm."],
   ["How is Code step execution sandboxed?", "Each code step runs in its own isolate, which is thrown away when the step finishes. Self-hosted deployments can pick a different execution mode."],
   ["Is there an API for everything the UI does?", "Yes. A documented OpenAPI spec with API-key auth covers automations, runs, connections and projects, and webhook triggers cover the inbound direction."],
   ["What exactly is open source?", "The engine, the builder and every integration are MIT licensed. The enterprise directory is under a separate commercial license."]
  ]
 },
 "closing": {"h2": "Automate the glue work this afternoon.", "lede": "Build it visually, drop into TypeScript where you need to, and self-host the whole thing."}
}
```

### /solutions/it

```jsonc
{
 "route": "/solutions/it",
 "title": "IT automation you can self-host and govern | Activepieces",
 "metaDescription": "Deploy with Docker, Compose or the Kubernetes Helm chart, then control access with SAML SSO, SCIM, roles and audit logs. The core is MIT-licensed.",
 "hero": {
  "section": "it-hero",
  "h1": "Run it on your own infrastructure.",
  "lede": "Deploy with Docker, Compose or the Kubernetes Helm chart. Sign in with SAML SSO, provision users with SCIM, scope access by role and project, and keep secrets in your own manager.",
  "ctaKey": "solution_it_hero",
  "stageBg": "meadow",
  "visual": "static mock: specs/source/solutions_it.html <!-- HERO VISUAL --> block",
  "visualImages": ["/logos/pieces/datadog.svg", "/logos/pieces/github.svg", "/logos/pieces/google-drive.svg", "/logos/pieces/linear.svg", "/logos/pieces/okta.svg", "/logos/pieces/slack.svg"],
  "logos": "rotatingCustomerLogos (§S.2)"
 },
 "grid": {
  "h2": "What you deploy, and how you control it.",
  "cards": [  // [span, title, desc, art, bgPosition, mock]
   [12, "SSO and SCIM", "Google, GitHub and SAML through Okta, Entra ID or JumpCloud.", "clouds", "50% 26%", "refundForm"],
   [12, "Roles and Projects", "Admin, Editor and Viewer by default, or roles you define.", "meadow", "50% 62%", "chatThreadBerlin"],
   [9, "Run Isolation", "One automation cannot read another’s files.", "water", "50% 16%", "mcpServer"],
   [15, "Audit Logs", "A record of changes to automations, folders, connections and users.", "water", "50% 30%", "routerTable"],
   [15, "Your Secret Manager", "Vault, Conjur, AWS Secrets Manager and 1Password.", "clouds", "50% 58%", "tableTriggers"],
   [9, "MIT-licensed Core", "Everything but the enterprise directory is MIT.", "iris", "50% 100%", "codeSendQuote"]
  ]
 },
 "caseStudy": "fundingSocieties",
 "testimonials": {"h2": "IT teams that signed it off."},
 "faq": {
  "h2": "What IT teams ask.",
  "items": [  // [question, answer]; first item open by default
   ["What exactly do we have to stand up?", "A stateless app, one or more stateless workers, PostgreSQL, Redis, and optionally an S3-compatible bucket. Docker, Docker Compose and Helm all work."],
   ["Which identity providers do you support?", "SAML 2.0 and Google Workspace. Okta, Entra ID and JumpCloud are documented and tested, and any other SAML 2.0 provider connects the same way."],
   ["Where do credentials live?", "Encrypted at rest and decrypted inside the worker only while a step runs, or left in your own vault and fetched at run time."],
   ["Does self-hosting cost more?", "No. The price is the same either way, because what you buy is the license rather than our compute."]
  ]
 },
 "closing": {"h2": "Run it on your own infrastructure.", "lede": "Docker, Compose or Helm, with SSO, SCIM, roles and audit logs. The core is MIT-licensed."}
}
```

### /solutions/internal-tools

```jsonc
{
 "route": "/solutions/internal-tools",
 "title": "Build internal tools in an afternoon | Activepieces",
 "metaDescription": "A form or chat page for the interface, tables for the data, and a code step for the logic that is specific to you. Publish it and your team gets a link.",
 "hero": {
  "section": "internal-tools-hero",
  "h1": "Build internal tools in an afternoon.",
  "lede": "A form or chat page gives you the interface, tables hold the data, and a code step covers logic specific to you. Publish it and your team gets a link, and your agents get an MCP server.",
  "ctaKey": "solution_internal-tools_hero",
  "stageBg": "coast",
  "visual": "static mock: specs/source/solutions_internal-tools.html <!-- HERO VISUAL --> block",
  "visualImages": [],
  "logos": "rotatingCustomerLogos (§S.2)"
 },
 "grid": {
  "h2": "What an internal tool needs, already built.",
  "cards": [  // [span, title, desc, art, bgPosition, mock]
   [12, "Forms and Chat", "An interface for structured input, or for questions in plain words.", "clouds", "50% 26%", "testStepStripe"],
   [12, "Code Step", "Sandboxed TypeScript for the parts specific to your team.", "meadow", "50% 62%", "terminalCompose"],
   [9, "Available to Agents", "Publish it as an MCP server for your agents.", "water", "50% 16%", "codeSendQuote"],
   [15, "Who Can Use It", "Projects and roles decide who can open it and who can edit it.", "water", "50% 30%", "approvalRefund"],
   [15, "Every Use Logged", "Read any run step by step, and retry it if it failed.", "clouds", "50% 58%", "runResume"],
   [9, "Keep It In-House", "Self-host it if the data has to stay with you.", "iris", "50% 100%", "mcpServer"]
  ]
 },
 "caseStudy": "fundingSocieties",
 "testimonials": {"h2": "Teams that built their own tools on it."},
 "faq": {
  "h2": "What builders ask.",
  "items": [  // [question, answer]; first item open by default
   ["Is this a replacement for a real internal dev tool?", "It is a quick way to build a small internal app: a form, a table and a code step, with no infrastructure to set up. For larger custom software it works alongside your stack."],
   ["Do non-engineers need help building one of these?", "Most of it is built by connecting a trigger to steps, with no code. A code step is there when you need it, and engineering can own just that part."],
   ["Can we keep the data in-house?", "Yes, with Docker, Docker Compose or the Kubernetes Helm chart."],
   ["What does this cost for internal-only use?", "One credit per run, whether the automation serves a customer or your own team."]
  ]
 },
 "closing": {"h2": "Build the tool your team keeps asking for.", "lede": "A form, a table and a code step. Publish it and send your team the link."}
}
```

### /solutions/open-source-developers

```jsonc
{
 "route": "/solutions/open-source-developers",
 "title": "Open source automation, self-hosted | Activepieces",
 "metaDescription": "MIT for the core, a separate commercial license for the enterprise directory. Community edition runs unlimited flows and users, with nothing metered.",
 "hero": {
  "section": "open-source-developers-hero",
  "h1": "Self-host the MIT-licensed core for free.",
  "lede": "The core is MIT; only the enterprise directory is licensed separately. Community edition runs unlimited flows and users, with nothing metered.",
  "ctaKey": "solution_open-source-developers_hero",
  "stageBg": "clouds",
  "visual": "static mock: specs/source/solutions_open-source-developers.html <!-- HERO VISUAL --> block",
  "visualImages": [],
  "logos": "rotatingCustomerLogos (§S.2)"
 },
 "grid": {
  "h2": "What open source means here.",
  "cards": [  // [span, title, desc, art, bgPosition, mock]
   [12, "Where the Line Is", "The core is MIT. The commercial part is one clearly marked directory.", "clouds", "50% 26%", "customersTable"],
   [12, "Build an Integration", "Scaffold, build and publish one in TypeScript with the CLI.", "meadow", "50% 62%", "projectMembers"],
   [9, "Execution Modes", "Choose the sandbox model that suits each deployment.", "water", "50% 16%", "mcpServer"],
   [15, "Community Integrations", "Every integration is open source and published on npm.", "water", "50% 30%", "routerTable"],
   [15, "Unlimited Runs", "Community edition has no credit system and no cap on runs.", "clouds", "50% 58%", "tableTriggers"],
   [9, "Fork It", "Read the code, change it, and run your own version.", "iris", "50% 100%", "codeSendQuote"]
  ]
 },
 "caseStudy": "alan",
 "testimonials": {"h2": "Developers self-hosting it."},
 "faq": {
  "h2": "What self-hosters ask.",
  "items": [  // [question, answer]; first item open by default
   ["Is it really open source, or open-core with a catch?", "The core is MIT-licensed. The enterprise-licensed code sits in one clearly marked directory and needs a subscription only for production use."],
   ["Does the Community edition have limits?", "Runs and users are unlimited, with no credit system. It leaves out projects, SSO, audit logs and Git Sync."],
   ["How often do self-hosted releases ship?", "Every Monday, versioned on Docker Hub and GHCR, so you can pin a version and upgrade when it suits you."],
   ["What do we have to run in production?", "A stateless app, one or more stateless workers, PostgreSQL, Redis, and optionally an S3-compatible bucket for run logs."]
  ]
 },
 "closing": {"h2": "Read the code, then run it yourself.", "lede": "MIT-licensed core, self-hosted with Docker or Helm, with nothing metered."}
}
```

---

## 15. Assets

**Downloaded into `public/` at their original paths** (same origin, HTTP 200, after confirming they were not already there):
- `/panel/{clouds,meadow,coast}.webp` plus `-640/-960/-1376` variants (12 files). `coast` is new; it is the stage art for tables, customer-support, internal-tools and operations.
- `/reviews/{g2-christiand,g2-giuseppec,g2-logo,g2-markd,g2-patrickf,reddit-logo,trustpilot-dennisklappe,trustpilot-kevinhu,trustpilot-logo,trustpilot-rida}.webp` (10).
- `/logos/customers/alan.svg`, `/logos/customers/funding-societies.webp`.
- `/logos/pieces/{anthropic-claude,aws-bedrock,azure-openai,calendly,github,gmail,google-drive,google-gemini,google-sheets,hubspot,linear,linkedin,mailchimp,microsoft-teams,notion,okta,openai,quickbooks,slack,stripe,webhook,zendesk}.svg` (22).
- `/closing/meadow-2064.webp`.

**Icons:** I downloaded 15 Solar icons that these pages use and that `src/icons.css` does not define yet. They are in `public/icons/solar/` (from api.iconify.design, per BUILD_CONVENTIONS):

`bolt-linear, book-linear, clock-circle-linear, document-linear, layers-linear, link-linear, lock-linear, plain-linear, record-circle-linear, share-linear, shield-linear, structure-linear, text-field-linear, undo-left-linear, user-linear`

Build still needs to append their `icons.css` rules. All other icons used here (add, alt-arrow-down/up, check-circle, check-read, copy, stars, play, tuning, database, file-text, document-text, shield-check, link-minimalistic-2, branching-paths-down) are already defined.

**Network check:** I loaded all 14 routes at 1440 and 390, scrolled the full page and let the demos loop for 14s. Every same-origin image these pages request now exists under `public/`. Fonts are the same 4 Inter/Fira files and 2 Sentient files as the homepage. No video is used.

## 16. Gaps and caveats
- **Demo timings** (§4.3, §4.4) come from sampling every 80ms and are accurate to about ±80ms. The visibility gate and take-over/idle values are assumed to be the shared homepage cursor engine's (≥30% visible, 9s idle); they were not measured separately here.
- **Logo rotation:** I could not tell whether a cell's leave and enter overlap or run out-in. Each cell has a fixed height, so either looks the same. The first swap's delay (~4s) may include hydration time; the interval after that is 3.5s.
- **Solution hero static mocks and bento mocks** are specified by reference to the saved SSR markup, not re-measured element by element. They are static Tailwind, so the classes are the spec.
- **Meta descriptions** in §14 end in "…" in the original markup itself (they are shipped truncated); copy them as-is if you set them.
