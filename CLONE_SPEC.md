Source: https://www.activepieces.com/

# Activepieces homepage: clone build spec

Measured 2026-10-16 with Playwright (Chromium) at 1440×900, 1280×800, 768×1024 and 390×844. Computed values come from `getComputedStyle` and `getBoundingClientRect`. Motion values come from the shipped CSS (`entry.LEuMnHPd.css`, `pages.CaRGUvqN.css` and the scoped component CSS) and from the live Nuxt JS chunks: `_nuxt/BrUwNhlu.js` (home page), `C_93-1CU.js` (header/footer/button), `DXxixFhI.js` (agent demo), `Dc0touRn.js` (flow demo), `BQpkfUU3.js` (cursor engine). Scroll sampling confirmed them.

The original is Nuxt 3 (Vue) with Tailwind **v4**. The clone uses Tailwind **v3**. Every v4 utility used here is a plain `calc(var(--spacing) * N)` with `--spacing: .25rem`, so `pt-34` = 136px, `-mt-73` = −292px, `h-17` = 68px and `h-12.5` = 50px. Extend the v3 spacing scale, or use arbitrary values.

Assets: see `ASSET_MANIFEST.md` (same directory). Local assets are served at `/assets/<file>`.

Exact DOM, classes and copy: `Activepieces_ unify your team's AI.html` in this directory is the source of truth for markup. It is server-rendered and includes the inline icon CSS. Search it by the visible text quoted below. This spec gives the numbers and behaviour that the HTML alone does not.

---

## 0. Global tokens

### 0.1 Colors (the CSS defines them in oklch; hex is the sRGB conversion measured in the browser)

| token | hex | | token | hex |
|---|---|---|---|---|
| white | #ffffff | | primary-50 | #f0f9ff |
| ink-50 | #f8fafc | | primary-100 | #dff2fe |
| ink-100 | #f1f5f9 | | primary-200 | #b8e6fe |
| ink-150 | #eaedf0 | | primary-300 | #74d4ff |
| ink-200 | #e2e8f0 | | primary-400 | #00bcff (hero sky bg) |
| ink-300 | #cad5e2 | | primary-500 | #00a6f4 |
| ink-400 | #90a1b9 | | primary-600 | #0084d1 |
| ink-500 | #62748e | | primary-700 | #0069a8 (brand button) |
| ink-600 | #45556c (body text default) | | primary-800 | #00598a |
| ink-700 | #314158 | | primary-900 | #024a70 |
| ink-800 | #1d293d | | primary-950 | #052f4a (hero/closing H1) |
| ink-900 | #0f172b (headings) | | | |
| ink-950 | #020618 (solid buttons) | | | |

Accent palettes (used in small bits):
- accent-a (green): 50 #ecfdf5, 100 #d0fae5, 200 #a4f4cf, 300 #5ee9b5, 400 #00d492, 500 #00bc7d, 600 #009966, 700 #007a55, 800 #006045, 950 #002c22
- accent-b (amber): 50 #fffbeb, 100 #fef3c6, 200 #fee685, 300 #ffd230, 400 #ffb900, 500 #fe9a00, 600 #e17100, 700 #bb4d00, 800 #973c00, 900 #7b3306, 950 #461901
- accent-c (red): 50 #fef2f2, 200 #ffc9c9, 300 #ffa2a2, 400 #ff6467, 500 #fb2c36, 600 #e7000b, 700 #c10007, 800 #9f0712, 900 #82181a
- accent-d (violet): 50 #f5f3ff, 100 #ede9fe, 200 #ddd6ff, 300 #c4b4ff, 400 #a684ff, 500 #8e51ff, 600 #7f22fe, 800 #5d0ec0, 900 #4d179a, 950 #2f0d68
- Soft colors: violet-soft #f2edfe, azure-soft #d4f8fe, azure-bold #196f7c, teal-soft #c5fef0, lime-soft #ebf9b8, lime-bold #616e19
- Hard-coded in the demo windows: #ff5f57 / #febc2e / #28c840 (traffic lights), #f0f4f9, #d3e3fc, #1b74e6 (Gemini UI)

Opacity variants (Tailwind `/NN`) are `color-mix(in oklab, color NN%, transparent)`. In Tailwind v3, `rgb(... / .NN)` gives the same result, e.g. `ink-950/10` = `rgba(2,6,24,.10)`.

Cast (shadow) tokens, where ink-950 = rgb(2,6,24):
- `--cast-06` rgba(2,6,24,.06)
- `--cast-08` rgba(2,6,24,.08)
- `--cast-10` rgba(2,6,24,.10)
- `--cast-20` rgba(2,6,24,.20)

### 0.2 Shadows
- `shadow-edge`: `0 0 0 1px cast-10, 0 1px 2px -1px cast-08`. This is the hairline-ring card style used almost everywhere.
- `shadow-edge-hover`: `0 0 0 1px cast-20, 0 2px 4px -1px cast-08, 0 4px 8px -2px cast-06`
- `shadow-lift` (`--shadow-lift`): `0 0 0 1px cast-10, 0 2px 4px -2px cast-08, 0 8px 16px -6px cast-08`
- `shadow-over`: `0 0 0 1px cast-10, 0 4px 8px -4px cast-10, 0 16px 32px -12px cast-20`
- Tailwind `shadow-sm` (v4): `0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1)`
- `shadow-xs` (v4): `0 1px 2px 0 rgba(0,0,0,.05)`

### 0.3 Radii
| token | px |
|---|---|
| sm | 4 |
| md | 6 |
| lg | 8 |
| xl | 12 |
| 2xl | 16 |
| 3xl | 24 |
| 4xl | 32 |
| full | 9999 |

### 0.4 Easing
- `--ease-smooth`: `cubic-bezier(.22, 1, .36, 1)`. Used for nearly all motion.
- Tailwind `ease-out`: `cubic-bezier(0, 0, .2, 1)`
- Tailwind `ease-in-out`: `cubic-bezier(.4, 0, .2, 1)`
- Demo spring: `cubic-bezier(.16, 1, .3, 1)`
- Cursor travel: `cubic-bezier(.5, .02, .2, 1)`
- Default transition duration: 150ms

### 0.5 Fonts (files and URLs are in ASSET_MANIFEST §1)
- `font-sans`: `Inter, "Inter Fallback: sans-serif", ui-sans-serif, system-ui, sans-serif`. Weights 400/500/600/700.
- `font-display`: `Sentient, "Sentient Fallback: Georgia", "Sentient Fallback: Times New Roman", ui-serif, Georgia, serif`. Weight 700 for every heading; weight 500 for the case-study blockquotes.
- `font-mono`: `"Fira Code", "Fira Code Fallback: monospace", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`. Weight 400. Used only inside bento mockups.
- `<html>`: `scroll-behavior: smooth; text-wrap: pretty; -webkit-font-smoothing: antialiased`.
- Root wrapper: `min-h-screen overflow-x-clip bg-white font-sans text-ink-600 antialiased`, which gives Inter 400, 16px/24px, color #45556c.
- `--leading-display`: 1.015 (hero H1 only).

### 0.6 Type scale (Tailwind v4 defaults, as measured)

| class | size | line-height |
|---|---|---|
| text-xs | 12px | 16px |
| text-sm | 14px | 20px |
| text-base | 16px | 24px |
| text-lg | 18px | 28px |
| text-xl | 20px | 28px |
| text-2xl | 24px | 32px |
| text-3xl | 30px | 36px |
| text-4xl | 36px | 40px |
| text-5xl | 48px | 48px |
| text-6xl | 60px | 60px |
| text-7xl | 72px | 72px |

`tracking-tight` is −.025em.

### 0.7 Breakpoints (Tailwind v4 defaults; they match v3)

| name | min width | what changes |
|---|---|---|
| (base) | — | mobile layout |
| `min-[360px]` | 360 | header container px 12→20, nav-row px 12→16, logo h 16→20 |
| `sm` | 640 | hero CTAs go side by side; frame aspect 2/3 → 4/3; testimonials 2 columns; stats in 3 columns; footer links 3 columns; flow-canvas scene unscaled |
| `md` | 768 | most section paddings step up (py-24→32, px-5→6); hero type steps up; feature sections split 5/7; bento uses a 24-column grid; marquee logos ×1.15; closing meadow image shown |
| `lg` | 1024 | desktop nav (3-column grid), burger hidden; frame aspect 2/1; dream section switches to the scroll-scrubbed desktop choreography (it is time-based ≤1023px); footer links 5 columns; hero H1 72px |
| `xl` | 1280 | header right-side gap 8→12 and nav-row gap 12→24 |

Containers: `max-w-7xl` = 1280px. Gutters: px-5 (20) / md:px-6 (24) / lg:px-8 (32).

### 0.8 Buttons (one component, `ui-button`)
Base classes: `inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.99]`.

Sizes:

| size | height | padding-x | font |
|---|---|---|---|
| sm | 36 (h-9) | 16 | 14px |
| md | 44 (h-11) | 24 | 15px |
| lg | 48 (h-12) | 28 | 16px |
| xl | 50 (h-12.5) | 32 | 17px |

Variants:
- **brand**: bg primary-700 #0069a8, white text; hover bg primary-800 #00598a
- **solid**: bg ink-950 #020618, white text; hover bg ink-900 #0f172b
- **secondary**: bg ink-50 #f8fafc, text ink-950, `shadow-edge`; hover bg ink-100 + `shadow-edge-hover`
- **glass**: bg white/70, text ink-950, `backdrop-filter: blur(12px)`; hover bg white
- Focus: `outline 2px offset 2px primary-700`
- Trailing arrow icons (`solar:alt-arrow-right-linear`) are in a `group`; on hover they get `translate-x-0.5` (2px) over 200ms.

---

## 1. Header (fixed, floating "island")

Structure (see saved HTML `<header>`):
- `<header>`: `position: fixed; inset-x: 0; top: 0; z-index: 100; padding-top: 12px` (md: 16px). Transitions `transform/translate .3s var(--ease-smooth)`.
- Container: `mx-auto max-w-7xl`, px 12 / 20 at ≥360 / 24 at md / 32 at lg.
- `.island`: `rounded-2xl` (16px), `overflow-hidden`, `transition: background-color .3s ease-out`.
  - Background is state-dependent (below).
  - The CSS declares only `-webkit-backdrop-filter: blur(30px)`. Chromium computed `backdrop-filter: none`, so Chrome shows no blur and Safari shows a 30px blur. Matching Chrome means no blur.
- `.nav-row`:
  - Height 64px (md 68px). Padding-x 12 / 16 at ≥360 / 24 at md. Gap 12 (sm 24).
  - At lg it becomes `display: grid; grid-template-columns: 1fr auto 1fr`, gap 12 (xl 24).
  - Measured at 1280: columns 313.3 / 493.4 / 313.3, island 1216×68 at x=32.
  - At 1440 the island is 1216×68 at x=112, y=16.
- Logo: `<span class="relative block aspect-[945/147] h-4 min-[360px]:h-5 md:h-6">`, which measures 154×24 at md+ and 129×20 at 390. It holds two absolutely-stacked `.logo-layer` spans:
  - `.logo-layer` CSS: `inset: 0; mask-position: 50%; mask-size: contain; mask-repeat: no-repeat; transition: background-color .2s ease-out`.
  - Layer 1: `mask-image: url(/brand/activepieces-wordmark.svg)`, colored ink-950. On the hero art it is primary-950.
  - Layer 2: `mask-image: url(/brand/activepieces-logomark.svg)`, colored primary-700. On the hero art it is primary-950.
- Center nav (lg+ only): `flex gap-1`. Items are Product▾, Solutions▾, Enterprise▾, Pricing, Docs.
  - Each item: `rounded-full px-3.5 py-2`, 15px/22.5px, weight 500, color ink-900 (on the hero art: primary-950).
  - Hover: bg ink-950/5 and text ink-950 (on art: bg primary-950/8).
  - Active press: scale .97. Transition color/bg/transform 200ms ease-out.
  - Dropdown items have a 16px chevron (`solar:alt-arrow-down-linear`, −2px right margin) that rotates 180° when open (200ms).
  - Measured button size: 102×39 for "Product".
- Right side, `flex gap-2` (xl gap-3):
  - "Open app": a pill, h-36, px-16, 14px/500, text ink-950, bg ink-950/6, hover ink-950/10. On the hero art: bg white, hover white/80. Hidden below lg. Measured 97×36.
  - "Talk to sales": `ui-button sm solid`, measured 135×36. Its arrow icon (16px, −4px right margin) is hidden below sm. Below 360px padding-x is 12.
  - Burger: `p-2.5 -mr-1 rounded-full text-ink-900` with a 20px `solar:hamburger-menu-linear` icon. It switches to `solar:close-circle-linear` when open. Hidden at lg+.

**"On art" state.** When `scrollY ≤ 32`, no menu is open and the page is the home page (`heroArt`), the header gets class `on-art`:
- island bg `rgba(255,255,255,.62)`
- nav text primary-950
- Open app bg white
- logo layers both primary-950

Otherwise the island bg is `rgba(255,255,255,.68)`. While any dropdown or the mobile sheet is open, the island bg is solid `#fff`.

**Hide/show on scroll.** This runs in a requestAnimationFrame-throttled passive scroll listener (exact logic):
```
y = max(scrollY, 0)
scrolled = y > 32
if (mobileOpen || dropdownOpen) hidden = false
else if (y > lastY + 4 && y > 160) hidden = true
else if (y < lastY - 4) hidden = false
lastY = y
```
- Hidden state: `translate-y: calc(-100% - 1rem)`.
- Shown state: `translate-y: 0`.
- Both animate 300ms with ease-smooth.
- Verified live: hidden at y=200+ while scrolling down, back on any upward scroll.

**Entrance.** `html.js .nav-row { opacity: 0 }` until the class `is-ready` is set on mount. Then `.nav-row.is-ready` runs `nav-in .62s var(--ease-smooth) .24s both`:
```
@keyframes nav-in { from { opacity: 0; translate: 0 -8px } to { opacity: 1; translate: 0 } }
```

### 1.1 Desktop dropdown (mega panel inside the island)

The island grows downward; there is no separate popover.
- Below the nav-row sits a wrapper `div.hidden.lg:block.overflow-hidden` whose inline `height` animates from 0 to the panel height. Transition: `height 300ms var(--ease-smooth)`. Measured: Product panel height 334px, total island height 402px.
- Open: `mouseenter` or `focus` on a nav button opens its panel. Hovering a plain link (Pricing/Docs) closes any open panel.
- Close: `mouseleave` on the nav or island closes after **180ms**; re-entering cancels the close. Esc closes.
- Panel: `.panel-in mx-6 border-t border-ink-950/8 pt-4 pb-6`, animated with `panel-in .18s var(--ease-smooth) both` from `opacity: 0; transform: translateY(3px)`.
- Panel inner: `data-menu-surface relative -mx-3 flex gap-5`. Columns are `flex-1`; a column with ≥5 items is `flex-[2]` and lays out as `grid grid-cols-2 gap-x-5 gap-y-1`; others are `flex flex-col gap-1`.
- Column heading: `px-3 pb-2`, 11px, weight 600, `letter-spacing: .08em` (0.88px), uppercase, ink-500 #62748e.
- Item:
  - Link: `relative flex items-center gap-3.5 rounded-xl px-3 py-2.5`, measured 384×64.
  - Icon box: 40×40, `rounded-lg`, bg ink-950/6, containing a 22px icon in ink-700.
  - Text stack: `flex-col gap-0.5`. Label 15px/600 ink-950; description 13px ink-600.
- Hover highlight: one shared absolutely-positioned pill `rounded-xl bg-ink-950/5` that slides to the hovered item.
  - Inline transition: `opacity 130ms ease, scale 130ms ease-smooth, left/top/width/height 220ms ease-smooth`.
  - Hidden state: opacity 0, scale .96.
- Enterprise panel: `row` layout. A single unlabeled column, `grid grid-cols-4 gap-x-5`. Below it, centered (`mt-5 flex justify-center`), a CTA rail:
  - Text "Talk to sales": 15px, weight 600, tracking .02em, ink-950, plus a `solar:arrow-right-linear` 16px arrow that moves `translate-x-1` on hover.
  - The word has an underline `::after`: height 1.5px, `bottom: -5px`, `transform-origin: 0`, `scale: 0 1` → `1` on hover, `transition: scale .26s var(--ease-smooth)`.

Menu data (label · description · href · icon):
- **Product**
  - *Use Activepieces with*
    - Chat · One chat box for the whole platform · /product/chat · solar:chat-round-dots-bold
    - MCP server · Use Activepieces in Claude or Cursor · /mcp · solar:plug-circle-bold
  - *The building blocks*
    - Integrations · Works with 760+ apps out of the box · /pieces · solar:widget-bold
    - AI Agents · Agents that do the work in your apps · /product/ai-agent-builder · solar:bot-bold
    - Tables · Keeps records without a database · /product/tables · solar:database-bold
    - Workflows · Runs repetitive work on a schedule · /product/workflow-builder · solar:structure-bold
  - *Open source*
    - GitHub · Read every line · https://github.com/activepieces/activepieces · simple-icons:github
    - Self-host it · Run it on your own box · (docs self-host link) · solar:server-bold
    - For OSS developers · Build on the platform · /solutions/open-source-developers · solar:code-bold
- **Solutions**
  - *Business teams* (6 items, so this column is the 2-column grid)
    - Marketing · Ship campaigns without eng · solar:speaker-bold
    - Sales · Follow up the same day · solar:graph-up-bold
    - Customer Support · Answer faster, with context · solar:headphones-round-bold
    - Operations · Recurring work, off your plate · solar:restart-circle-bold
    - Finance · Approvals off the spreadsheet · solar:bill-bold
    - HR · Onboarding that finishes · solar:users-group-rounded-bold
  - *Technical teams*
    - Engineering · Skip the glue service · solar:programming-bold
    - IT · Access on and off, on time · solar:key-bold
    - Internal Tools · Ship it without a team · solar:window-frame-bold
  - All of these link to /solutions/<slug>.
- **Enterprise** (row layout)
  - AI Governance · Approve every AI action · /ai-governance · solar:shield-check-bold
  - Security · Answer your reviewer's questions · /security · solar:lock-keyhole-bold
  - Self-hosting · Keep data in your network · solar:buildings-2-bold
  - Embed · Automation under your brand · /embed · solar:code-square-bold
  - CTA: Talk to sales · /sales?ap_cta=header_menu
- **Pricing** /pricing · **Docs** /docs

### 1.2 Mobile menu (<1024)

The burger toggles a sheet rendered inside the island, below the nav-row. The island turns solid white and `document.body.style.overflow = 'hidden'`.
- Measured at 390: island 350×800 at (20,12); sheet 350×736.
- Sheet: `overflow-y-auto rounded-b-2xl border-t border-ink-950/8`, `max-height: calc(100dvh - 5.25rem - 1.5rem)`. Enter/leave: `opacity .18s ease, translate .22s var(--ease-smooth)` from `translate: 0 -6px; opacity: 0`.
- Inner: `flex flex-col gap-1 px-2 py-4`.
- Group button: full width, `rounded-xl px-3 py-3`, 16px/500 ink-900, hover bg ink-950/5, chevron 16px rotates 180°. Measured 334×48.
- Group body: `grid transition-all duration-200 ease-out`, `grid-rows-[0fr] opacity-0` ↔ `grid-rows-[1fr] opacity-100`. Inner wrapper: `overflow-hidden` > `pb-2 pl-3`.
  - Column heading: `px-3 pt-3 pb-2`, 12px/600 ink-600.
  - Link: `flex items-center gap-3 rounded-xl px-3 py-2.5`, 14px/500 ink-900, hover bg ink-950/5. Icon box 36×36 `rounded-lg` bg ink-500/10, icon 20px ink-500.
- Pricing and Docs: `block rounded-xl px-3 py-3`, 16px/500.
- Footer of the sheet: `mx-3 mt-3 grid gap-3 border-t border-ink-950/10 pt-4` with "Talk to sales" (md solid, full width, 44px) and "Open app" (md secondary, full width).

---

## 2. Page section map (top to bottom)

Document height: 16988px at 1440, 16560 at 1280, 15186 at 768, 19782 at 390.

| # | section (copy anchor) | 1440 y / h | 1280 y / h | 768 y / h | 390 y / h | container / padding |
|---|---|---|---|---|---|---|
| A | Hero stage `#top` "AI Agents with enterprise control" | 0 / 946 | 0 / 946 | 0 / 921 | 0 / 884 | full-bleed; pt 136 (md 152), pb 336 (md 352), px gutter 20/24/32 |
| B | Hero shot (app mock), overlaps A | 638 / 640 | 638 / 608 | 613 / 540 | 592 / 525 | mt −292 (md −308); px 20/24/32; inner max-w 1280 |
| C | Dream (sticky scroll story) "Your team already works with AI." | 1278 / 3780 (420svh) | 1246 / 3360 | 1153 / 1024 (100svh) | 1117 / 844 | full-bleed white |
| D | Case study, Funding Societies | 5058 / 745 | 4606 / 745 | 2177 / 733 | 1961 / 935 | max-w 1280, py 96 (md 128) |
| E | CTA band "Your first flow can ship this afternoon." | 5803 / 309 | 5351 / 309 | 2911 / 403 | 2896 / 464 | max-w 1280, py 48 (md 64) |
| F | Feature: "Agents that get the job done" (agent demo) | 6112 / 1076 | 5660 / 1076 | 3313 / 1200 | 3360 / 1312 | max-w 1280, py 96/128, flex-col gap 32 (md 48) |
| G | Feature: "Simple by default. Deep on demand." (flow demo) | 7188 / 1076 | 6736 / 1076 | 4513 / 1224 | 4672 / 1188 | same as F |
| H | Bento: "Everything you need to run this for the whole company." (8 cards) | 8264 / 2432 | 7812 / 2432 | 5737 / 2432 | 5860 / 4196 | max-w 1280, py 96/128 |
| I | CTA band "Roll it out without losing control." | 10696 / 309 | 10244 / 309 | 8169 / 403 | 10056 / 464 | as E |
| J | Case study, Alan | 11006 / 745 | 10554 / 745 | 8572 / 701 | 10520 / 903 | as D |
| K | Feature: "760+ open-source pieces" (logo mosaic) | 11751 / 990 | 11299 / 990 | 9273 / 910 | 11423 / 990 | as F |
| L | Bento: "One workspace your team and your agents share." (4 cards) | 12741 / 1392 | 12289 / 1392 | 10183 / 1392 | 12413 / 2252 | as H |
| M | Testimonials "Here's how it's going for the teams building with us." | 14133 / 936 | 13681 / 960 | 11575 / 1456 | 14665 / 2236 | section px gutter, py 96/128; inner max-w 1280 |
| N | FAQ "Questions, answered" | 15069 / 944 | 14641 / 944 | 13031 / 944 | 16901 / 1080 | inner max-w 768 (3xl) |
| O | Footer `.closing` "Put your first automation to work." | 16013 / 975 | 15585 / 975 | 13975 / 1211 | 17981 / 1801 | see §O |
| — | Floating "See it in action" card (fixed) | bottom-right | | | | see §P |

All `<section>`s with `max-w-7xl` use `mx-auto w-full`, so at 1440 they sit at x=80, w=1280, with content x=112 to 1328.

---

## A. Hero stage

Element: `div#top.hero-stage.relative.isolate.flex.flex-col.items-center.overflow-hidden`.
- Background `primary-400 #00bcff` (visible only before the plates fade in).
- `--gutter` padding-inline: 20px, 24px at md, 32px at lg.
- Height is content-driven. It measured 946 at 1440/1280 (pt 152 + content 360 + 32 + 50 marquee + pb 352).

**Layered art (parallax-style plates).** The plates do not move with scroll; only the entrance fade animates.
1. `img.plate.base`:
   - src `/assets/hero-base-2064.webp` (srcset 1376/2064/2752w, `sizes="(max-width:1630px) 1630px, 100vw"`), intrinsic 2752×1536 attributes, `fetchpriority=high`.
   - CSS: `--art-w: max(100%, 1500px); width: var(--art-w); max-width: none; margin-left: calc(var(--art-w) / -2); position: absolute; left: 50%; bottom: 0; height: 100%; object-fit: fill; pointer-events: none; z-index: 10`.
   - Measured at 1440: x=−30, w=1500, h=946. At 390: x=−555, w=1500, h=884.
   - The image is stretched (`object-fit: fill`) to the stage height.
2. `img.plate.front`: `/assets/hero-front-2064.webp`, same CSS, `z-index: 40`.
3. `.hero-fade`: absolute, bottom 0, left/right 0, height **8.75rem (140px)**, `z-index: 60`, pointer-events none. Background:
   `linear-gradient(#fff0, #ffffff05 18%, #ffffff14 33%, #ffffff30 46%, #ffffff59 58%, #ffffff8c 69%, #ffffffbf 79%, #ffffffe6 88%, #fffffffa 95%, #fff)`

**Content column.** `relative z-70 flex w-full max-w-4xl (896px) flex-col gap-7 (md gap-8) text-center`. Inside it is `flex-col gap-5 (md gap-6)`:
- **H1** "AI Agents with enterprise control":
  - Sentient 700, color primary-950 #052f4a, `line-height: 1.015`, `text-wrap: balance`.
  - Sizes: 36px (base) → 48px sm → 60px md → 72px lg.
  - Measured line-heights: 36.54 / 60.9 / 73.08px.
  - At 1440 the box is 896×146 (2 lines). At 390 it is 350×73 (2 lines). **Not animated.**
- **Subhead** `p.hero-line` (`--i:1`): "Chat, agents, flows, tables, and 760+ apps in one workspace, so your whole team works with AI in the tools they already use."
  - Inter 400, color ink-700 #314158, balance, centered.
  - Sizes: 16/24 base, 18/28 sm, 24/32 md.
  - max-w 672 (2xl), 768 (3xl) at md. Measured 768×64 at 1440.
- **CTA group** `.hero-line` (`--i:2`): `flex flex-col items-center gap-5`.
  - Row: `flex w-full max-w-sm flex-col gap-3`; from sm: `max-w-none flex-row flex-wrap justify-center`.
  - Button 1, **"Use in your AI"** (`button.ai-cta`, xl solid, measured 270×50 at 1440 and 350×50 full-width at 390):
    - Padding: `pl-6 pr-5` (sm `pl-7 pr-6`), gap 14px, 16px text (sm 17px).
    - Children: `<span>Use in your AI</span>`, a divider `span.h-5.w-px.bg-white/20`, then three 20×20 logos (`/assets/cursor.svg`, `/assets/chatgpt.svg`, `/assets/claude.svg`) with `brightness-0 invert` (rendered white), each in `.ai-cta-logo` with `--n` = 0, 1, 2. The logo row uses gap-2.
    - `.ai-cta` CSS:
      - `box-shadow: inset 0 1px 0 #fff3, inset 0 -1px 0 #00000059, 0 1px 2px #0003, 0 10px 28px -10px rgba(2,6,24,.6)`
      - `background-image: linear-gradient(#ffffff1a, #0000 60%)` over bg ink-950
      - `position: relative; overflow: hidden`
    - Sheen: `::before { inset: 0; background: linear-gradient(105deg, #0000 35%, #ffffff29 50%, #0000 65%); translate: -110% }`. On `:hover::before { translate: 110%; transition: translate .9s var(--ease-smooth) }` (no transition back, so it snaps).
    - Logos: `.ai-cta-logo { opacity: .82; transition: translate .42s var(--ease-smooth) calc(var(--n)*40ms), opacity .3s ease-out }`; on `.ai-cta:hover .ai-cta-logo { opacity: 1; translate: calc((var(--n) - 1)*3px) -1px }`, so the logos fan out.
    - Click opens the MCP connect dialog (§Q).
  - Button 2, **"Talk to sales"** (link /sales, xl glass, measured 190×50): px-3 base, sm px-8; arrow 18px.
  - Note `p` "Free plan, no credit card required": 14/20 (sm 16/24), ink-700.
- **Customer marquee** `.hero-line.relative.z-25.mt-6.md:mt-8.w-full` (`--i:3`), described in §A.1.

**Hero entrance animation (CSS, `html.js` only).**
```
.plate { animation: plate-in .82s var(--ease-smooth) var(--enter-delay, 0s) both }   /* front: --enter-delay: 90ms */
@keyframes plate-in { from { opacity: 0 } to { opacity: 1 } }
.hero-line { animation: hero-line .76s var(--ease-smooth) calc(.38s + var(--i) * 90ms) both }
@keyframes hero-line { 0% { opacity: 0; filter: blur(5px); translate: 0 14px } to { opacity: 1; filter: blur(0); translate: 0 } }
```
Resulting delays:

| element | --i | delay |
|---|---|---|
| subhead | 1 | 470ms |
| CTAs | 2 | 560ms |
| marquee | 3 | 650ms |
| hero shot (B) | 4 | 740ms |

`prefers-reduced-motion` disables all of these.

### A.1 Customer logo marquee (`.drift`)
- Wrapper `.drift`: `overflow: hidden; mask-image: linear-gradient(90deg, #0000, #000 4% 96%, #0000)`, with `--logo-ratio: 3.1111` (= 7/2.25).
- Variables:
  - Base (<768): `--logo-factor: 1; --logo-base: 2.25rem; --logo-gap-base: 3rem; --drift-base: 72s`
  - ≥768 (48rem): `--logo-factor: 1.15; --logo-gap-base: 4rem`
  - Derived: `--logo-h = 2.25rem * factor`; `--logo-gap = gap-base * factor`; `--drift-duration = 72s * factor`
  - Measured ≥768: logo-h 41.4px, gap 73.6px, duration **82.8s**. Measured 390: logo-h 36px, gap 48px, duration **72s**.
- `.drift-track`: `display: flex; align-items: center; width: max-content; animation: drift var(--drift-duration) linear infinite`, with `@keyframes drift { to { transform: translate(-50%) } }`. Direction: right→left. Measured at ≥768: track 9909px wide, so ≈59.8 px/s. The animation runs continuously and does not pause on hover.
- Each logo is a `<span role="img" aria-label="…">`:
  - Classes: `bg-ink-700` (color #314158), `mask-image: url(logo)`, `mask-size: contain`, `mask-position: center`, `mask-repeat: no-repeat`.
  - Size: `width: calc(var(--logo-h) * var(--logo-ratio) * var(--s, 1)); height: calc(var(--logo-h) * var(--s, 1)); margin-right: var(--logo-gap); transform: translateY(calc(var(--logo-h) * var(--shift, 0))); flex: none`.
  - Measured first logo at 1440: 131×42.
- The sequence is rendered twice (the second copy is `aria-hidden`).
- Order with `--s` and `--shift` (use exactly these; also in the saved HTML):

| logo | --s | --shift |
|---|---|---|
| bosch | 1.016749 | 0.000567 |
| alan | 0.959050 | 0 |
| sap | 0.944014 | 0 |
| tryg | 0.86 | 0 |
| funding-societies (svg) | 0.899953 | 0 |
| carrefour | 1.2 | 0 |
| corgi.webp | 0.965977 | 0 |
| hilton | 0.984392 | 0 |
| lumen | 1.199251 | 0.000429 |
| pipefy | 0.904370 | 0 |
| dell-technologies | 1.200261 | 0 |
| zerofox | 1.2 | 0 |
| decathlon | 1.073455 | 0 |
| merkle | 1.186726 | 0 |
| orange | 0.941478 | 0 |
| exl | 0.878884 | 0 |
| concentrix | 1.102372 | 0 |
| odoo | 0.868139 | 0 |
| keller-williams | 1.2 | 0 |
| hackerone | 1.105182 | −0.001696 |
| shopee | 0.961306 | 0 |
| itv | 0.954493 | 0 |
| moneygram | 1.081686 | 0 |
| capgemini | 1.065352 | 0 |

  All of these logos are missing locally (see the manifest).

## B. Hero shot (app mockup card)

- Wrapper: `.hero-line.relative.z-65` (`--i:4`), `margin-top: -292px` (md −308), padding-x 20/24/32. Inner wrapper: `relative mx-auto w-full max-w-7xl select-none`.
- `.frame`:
  - `pointer-events-none aspect-[2/3] w-full overflow-hidden rounded-2xl bg-white`; `sm:aspect-[4/3]`; `lg:aspect-[2/1] lg:rounded-3xl`.
  - `box-shadow: 0 0 0 1px cast-20, 0 0 0 6px #ffffff8c, 0 24px 60px -24px cast-20`. This gives a 6px translucent white outer ring.
  - Measured sizes:

| viewport | frame | radius |
|---|---|---|
| 1440 | 1280×640 | 24 |
| 1280 | 1216×608 | 24 |
| 768 | 720×540 | 16 |
| 390 | 350×525 | 16 |

- Content (static, not animated; markup in the saved HTML from "Chat / Agents / Flows…" to the "+3" chip):
  - **Sidebar `aside`**:
    - Hidden <md. Width 208 (lg 248), `border-r border-ink-200`, bg ink-50, px-3 (lg px-4).
    - Logo mask (`/brand/activepieces-logo.svg`, ink-900): h-20 (lg h-24), `mt-6 mb-5 ml-3` (lg `mt-7 mb-6`).
    - Nav rows: `rounded-xl px-3 py-2 lg:py-2.5`, 15px (lg 16px), gap 10 (lg 12), ink-500, icon 20px (lg 22px). The active row "Agents" is `bg-white font-medium text-ink-900 shadow-sm ring-1 ring-ink-950/6`.
    - Rows: Chat, **Agents**, Flows, Runs, Tables | divider `my-3 h-px bg-ink-200` | Connections, Templates, MCP server.
  - **Main**:
    - Header `px-5 pt-7 pb-5` (sm px-7; lg `px-10 pt-10 pb-7`).
    - H2 "Agents": Inter 600, tracking-tight, ink-950. Sizes 26/30/36px with line-height 1.
    - Filter button: 40px (lg 44px) `rounded-xl border-ink-200`.
    - "New agent" pill: h-40 (lg 44), `rounded-xl bg-ink-900`, 14px (lg 15px) white.
    - Search row: "Search agents" input h-44 (lg 48) `rounded-2xl border`; "All teams" select; "23 agents".
    - Card grid: `grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5`.
  - **Agent cards** (`@container rounded-3xl bg-white p-5 lg:p-7 shadow-sm ring-1 ring-ink-950/8`):
    - Measured 466×353 at 1440.
    - Avatar 72px (lg 88px) `rounded-2xl bg-ink-50` (`/assets/atlas.svg`, `beacon.svg`, `cinder.svg`).
    - Title 19px (lg 22px) medium ink-900.
    - Status: 8px green dot (accent-a-500), "Ran 4 min ago", 14px (lg 15px) ink-400.
    - Description 15px (lg 17px) `leading-snug` ink-500, 2-line clamp.
    - Footer `border-t border-ink-150 pt-4 mt-5`: tool chips 48px (lg 56px) `rounded-xl bg-ink-50 ring-1 ring-ink-950/6` with a logo at 76% of 34px, plus a "+N" chip.
    - Cards: Support triage (intercom, openai, slack, zendesk, +2); Invoice intake (gmail, quickbooks, google-drive, stripe, +1); Inbound lead routing (hubspot, calendly, apollo, google-sheets, +3).
- `.cover` (fades the shot's bottom into white):
  - `pointer-events-none absolute -inset-x-12 -bottom-12 h-[62%]`, measured 1376×397.
  - Background: `linear-gradient(#fff0, #ffffff02 8.85%, #ffffff0f 17.7%, #ffffff2a 26.55%, #ffffff51 35.4%, #ffffff80 44.25%, #ffffffae 53.1%, #ffffffd5 61.95%, #fffffff0 70.8%, #fffffffd 79.65%, #fff 88.5%, #fff)`.

## C. Dream section: sticky, scroll-scrubbed story (the signature motion)

Markup: `section.dream-stage.relative.bg-white` > `div.sticky.top-0.h-svh.overflow-hidden`, containing in z-order:
1. `.dream-wire`: SVG wires plus 9 node chips/cards.
2. `.dream-beat-scrim`
3. 7 `.dream-window` app mockups (desktop only)
4. 3 beat text overlays (`absolute inset-0 flex items-center justify-center px-6`; z 34, 34, 50)

**Section height:**
- ≥1024: `420svh` (measured 3780 at 900px tall, 3360 at 800).
- ≤1023px: `height: 100svh`, and the section becomes a time-based animation (below).

### C.1 Progress model (desktop ≥1024, exact)
```
raw P   = clamp(-section.getBoundingClientRect().top / innerHeight, -0.8, 3.2)   // on scroll (passive)
smooth z: each rAF  z += (P - z) * 0.16 ; stop when |P - z| < 4e-4               // lerp smoothing
smoothstep(x, a, b) = t*t*(3-2t) with t = clamp((x-a)/(b-a))
```
On mount `z = P` (no lerp). With reduced motion, z = P directly.

**Mobile/tablet (≤1023px)**: no windows are rendered, only beat #3 is shown, and only the 5 nodes without `smHide`.
- An `IntersectionObserver(threshold .35)` fires once and starts a 2400ms tween: `N = 1 - (1 - t)^3`.
- `z = lerp(1.96, 2.95, N)`.
- With reduced motion, N = 1 immediately.

### C.2 Beat texts
- `p.dream-beat`: Sentient 700, ink-900 #0f172b, centered, `text-wrap: balance`, `font-size: min(5vw, 5rem)` (measured 72px at 1440, 64px at 1280), `line-height: 1.08`, `will-change: transform, opacity, filter`.
- ≤767px: `font-size: min(9.5vw, 3rem)` (37.05px at 390). At 768: 38.4px.
- Beats 0 and 1 are `max-w-5xl` (1024); beat 2 is `max-w-3xl` (768).

| # | text | in [a,b] | out [a,b] |
|---|---|---|---|
| 0 | "Your team already works with AI." (word-split) | — (fully in) | [0.70, 0.95] |
| 1 | "Nobody's tracking what they access, cost, or do." | [0.85, 1.10] | [1.84, 1.91] |
| 2 | (logo img) "The enterprise AI ecosystem" | [1.98, 2.10] | — |

For each beat: `t = in ? smoothstep(z, in[0], in[1]) : 1`, `n = out ? smoothstep(z, out[0], out[1]) : 0`. Then:
- `opacity = t * (1 - n)`, with `visibility: hidden` when ≤ .001
- `transform: translateY((1-t)*14 - n*14 px)`
- `filter: blur((1-t+n)*5 px)`, or `none` below .01

Beat 0 words: each word is a `span.dream-word` (`display: inline-block; white-space: pre`). The window is E = [−0.45, −0.05]; each word's span is n = 0.4×0.6 = 0.24, and the step is (0.4 − 0.24)/(6 − 1) = 0.032. Word i starts at `a = -0.45 + i*0.032`, with `o = smoothstep(z, a, a + 0.24)`: opacity o, `translateY((1-o)*14px)`, `blur((1-o)*5px)`. In practice the words have resolved by the time the section top reaches the viewport top.

Beat 2 image `.dream-mark`: `/assets/activepieces-logo.svg`, `width: 56%; margin: 0 auto 1.4rem` (≤767: margin-bottom .9rem). Measured 430×67 at 1440.

`.dream-beat-scrim` (z-index 3, inset 0) is a white radial vignette behind the text:
- `radial-gradient(40% 21%, #fff, #fff 58%, #fffffff8 63%, #ffffffe4 68%, #ffffffc8 73%, #ffffff9e 78%, #ffffff70 83%, #ffffff42 88%, #ffffff1c 93%, #fff0)`
- ≤1023: the ellipse is `62% 19%`.

### C.3 App windows (desktop only)
- `.dream-window`: `position: absolute; width: max(400px, 44vw); aspect-ratio: 16/11; will-change: transform, opacity`. Measured 662×479 at 1440 (rotated) and 589×426 at 1280.
- Placement: `left: x%; top: y%`. Transform: `translate(-50%,-50%) translate(c vw, l vh) rotate(u deg) scale(f)`.

| # | content (saved HTML title bar) | x | y | rot | dir | z | enter |
|---|---|---|---|---|---|---|---|
| 0 | gemini.google.com (Gemini chat) | 50 | 32 | 2 | [0, −1.1] | 33 | 1.000 |
| 1 | calder-prod — postgres (DB) | 22 | 34 | −4 | [−1.1, −0.3] | 33 | 1.066 |
| 2 | dashboard.stripe.com | 78 | 34 | 3 | [1.1, −0.4] | 33 | 1.132 |
| 3 | middleware.ts — calder-platform (Cursor) | 21 | 71 | 5 | [−0.85, 0.6] | 35 | 1.198 |
| 4 | claude.ai | 39 | 66 | −2 | [−0.25, 0.95] | 35 | 1.264 |
| 5 | github.com (repo) | 68 | 59 | 6 | [0.7, 0.12] | 35 | 1.193 |
| 6 | chatgpt.com | 79 | 70 | −5 | [0.7, 0.55] | 35 | 1.330 |

Per window k:
```
r   = 1 - (1 - clamp((z - enter)/(1.88 - enter)))^5                 // fly-in, easeOutQuint
i   = smoothstep(z, 1.894 + k*0.02, 1.894 + k*0.02 + 0.30)           // collapse into center
o   = i*i
c   = lerp(dir.x*105*(1-r), 50 - x, o)      // vw
l   = lerp(dir.y*105*(1-r), 50 - y, o)      // vh
u   = lerp(lerp(rot*2, rot, r), 0, o)       // deg
f   = lerp(1, 0.05, o)                      // scale
opacity = (z < enter ? 0 : 1) * (1 - smoothstep(i, .55, .95)); visibility hidden when ≤ .001
```
In words: after beat 1 appears, the windows fly in from off-screen, each along its `dir` (105vw/vh away), rotating from 2×rot to rot. Then, staggered 0.02 apart, they all shrink into the center (scale .05), straighten, and fade out as beat 2 (the logo) appears.

Window chrome (shared): `flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-xs`.
- Title bar: `px-3.5 py-2 border-b border-ink-200 bg-ink-100`, with three 10px dots (#ff5f57 / #febc2e / #28c840, gap 6px) and a centered URL pill `w-[46%] rounded-md border-ink-200 bg-white px-3 py-1` containing a lock icon, a 12px favicon and 12.48px (0.78rem) medium ink-600 text.
- Bodies are skeleton UIs; copy their exact markup from the saved HTML. They are static.

Live samples confirmed: at p≈1.25 windows 0–1 are visible; at 1.58–1.91 all 7 are visible; at 2.25 windows fade in order (.30/.61/.91…); at 2.58 the windows are gone and the nodes are popping in; at ≥2.91 all are settled.

### C.4 Wire diagram (`.dream-wire`)
- Container: `position: absolute; inset: calc(5.25rem + 2.75rem) 0 2.5rem; z-index: 2` (≤1023: `inset: calc(5.25rem + 2.5rem) 0 1.5rem`). Measured 1440×632 at 1280 wide.
- Wire progress: `Y = clamp((z - 2.08)/(2.90 - 2.08))`.
- Nodes are positioned at `left: x%; top: y%` of the container, with `transform: translate(-50%,-50%) <pop> scale(s) rotate(rot)`.
- `.card`: `white-space: nowrap; border: 1px solid ink-200; background: #fff; border-radius: .9rem (14.4px); display: flex; align-items: center; gap: .65rem; padding: .7rem 1.05rem; box-shadow: 0 1px 2px #1018280d`.
  - `.mark`: 1.45rem (23.2px) image/icon, ink-500 for icons.
  - `.text`: ink-800 #1d293d, 1.05rem (16.8px), weight 500, line-height 1. Measured card 122×50.
- `.chips`: three 3rem (48px) circles, `border: 1px ink-200`, white, `box-shadow: 0 1px 2px #1018280d`. Overlap: `.chip + .chip { margin-left: -.55rem }`. Images 1.4rem.
- ≤1023: card `radius .75rem; gap .5rem; padding .55rem .8rem`; mark 1.2rem; text .9rem; chip 2.5rem (overlap −.45rem); chip img 1.15rem.
- ≤767: card `radius .65rem; gap .4rem; padding .45rem .65rem`; mark 1rem; text .75rem; chip 2rem (−.35rem); img .95rem.

| id | content | x,y (desktop) | xSm,ySm | smHide | rot | at | dur | pop |
|---|---|---|---|---|---|---|---|---|
| chips | slack, github, notion | .50,.075 | .50,.045 | | 0 | .16 | .26 | grow |
| claude | logo anthropic-claude + "Claude" | .12,.175 | .245,.17 | | −2 | .24 | .20 | slide from [−26,−8] |
| gemini | google-gemini "Gemini" | .88,.175 | .755,.17 | | 2 | .20 | .24 | pop |
| audit | icon document-text "Audit log" | .088,.50 | — | yes | 1.5 | .40 | .22 | slide from [−22,10] |
| mcp | icon socket "MCP servers" | .912,.50 | — | yes | −1.5 | .32 | .28 | rise |
| cursor | cursor.svg "Cursor" | .13,.825 | .30,.80 | | 2 | .50 | .19 | grow |
| openai | openai.svg "ChatGPT" | .87,.825 | .70,.88 | | −2 | .44 | .25 | slide from [26,−6] |
| agents | icon cpu-bolt "Agents" | .385,.925 | — | yes | −1 | .58 | .21 | rise |
| approvals | icon check-read "Approvals" | .615,.925 | — | yes | 1 | .62 | .17 | pop |

Node animation: `t = clamp((Y - at)/dur)`, `r = 1 - (1 - t)^3`, `opacity = r`. By pop type:
- `pop`: `scale = .86 + .14r`
- `grow`: `scale = .62 + .38*(1 - (1 - t)^5)`
- `rise`: `translateY(20*(1-r) px)` and `blur(4*(1-r) px)`
- `slide`: `translate(fx*(1-r) px, fy*(1-r) px)`, `scale = .96 + .04r`

Wires are SVG paths, `viewBox = 0 0 W H` of the container:
- `stroke: ink-300 #cad5e2` (accent wires `primary-300 #74d4ff`), `stroke-width: 1.5px; stroke-linecap: round; fill: none`.
- Drawn with `pathLength=1 stroke-dasharray="1 1"`, `stroke-dashoffset = rev ? u-1 : 1-u`, where `u = ease((Y - at)/dur)`.
- Endpoint dots: `r=3.5`, `fill: ink-900`, `opacity = clamp((u - .72)/.28)`.

Anchor point for node side S: node center ± (half width/height + 9px). Route `hvh` (horizontal-vertical-horizontal) bends at `mid` fraction of x; `vhv` bends at `mid` fraction of y. Corners are rounded with quadratic curves of radius `min(16, seg/2)`.

| from → to | route | mid | at | dur | ease | rev | accent |
|---|---|---|---|---|---|---|---|
| claude.right → chips.left | hvh | .58 | 0 | .30 | out3 | ✓ | |
| chips.right → gemini.left | hvh | .42 | .05 | .22 | out5 | | |
| audit.top → claude.bottom (sm: cursor.top) | vhv | .42 | .14 | .34 | inout | ✓ | ✓ |
| gemini.bottom → mcp.top (sm: openai.top; not accent on sm) | vhv | .58 | .10 | .26 | out3 | | ✓ |
| cursor.top → audit.bottom (smHide) | vhv | .55 | .30 | .24 | out5 | ✓ | |
| mcp.bottom → openai.top (smHide) | vhv | .48 | .22 | .36 | inout | | |
| agents.left → cursor.right (smHide) | hvh | .55 | .44 | .20 | out5 | ✓ | |
| openai.left → approvals.right (sm: cursor.right → openai.left) | hvh | .45 | .36 | .30 | out3 | | |
| agents.right → approvals.left (smHide) | hvh | .50 | .54 | .16 | out2 | | |

Ease functions: `out2 = 1-(1-x)^2`, `out3 = 1-(1-x)^3`, `out5 = 1-(1-x)^5`, `inout = x²(3-2x)`.

## D / J. Case-study sections (Funding Societies, Alan)

- Section: `max-w-7xl px-5 py-24 md:px-6 md:py-32 lg:px-8`. Inner: `flex flex-col items-center text-center`.
- Logo: `h-10` (40px), `w-auto`.
  - Funding Societies: `/assets/funding-societies.webp` (739×242 attributes), measured 122×40.
  - Alan: `/assets/alan.svg` (261×72 attributes).
- Blockquote: `mt-8 w-full max-w-5xl font-display font-medium text-balance text-ink-600`, with `font-size: clamp(1.5rem, 3.125vw + 1px, 2.5625rem)` and `line-height: calc(.75em + 14px)`.
  - Measured: 41px/44.75px at ≥1280 (1024×134, 3 lines); 25px/32.75px at 768; 24px/32px at 390.
  - The emphasized middle phrase is a `<span class="text-ink-900">`. Copy: “Activepieces was instrumental in **helping us become an AI-first organization.** It enabled rapid experimentation across teams.”
- Figure: `mt-6 md:mt-8`. Figcaption `space-y-1`:
  - Name: 16/24, 600, ink-900
  - Role: 14/20, ink-600
  - Meta: 14/20, ink-500
- Stats: `mt-12 grid grid-cols-1 gap-8 border-t border-ink-950/10 pt-12`; from sm: `grid-cols-3 gap-0 divide-x divide-ink-950/10`; cells `sm:px-10`.
  - Value: Sentient 700, ink-900, 36/40 (md 48/48).
  - Label: `mt-2.5`, 16/24, ink-600.
- Data:
  - FS: 100+ Automation flows · ¼ year Of manual work saved · 500+ Employees empowered. Shawn Lim / VP of Platform & AI, Funding Societies / SME digital financing, 500+ employees.
  - Alan: “We needed a solution that could **integrate our ecosystem and our internal data,** without hosting it in the US.” 300+ Workflows deployed, from zero · $500k+ Saved annually · 6,300+ Hours reclaimed. Guillaume Durand / Product Marketing Lead, Alan / AI-powered health insurance, 700 employees.

## E / I. CTA bands

- Section: `max-w-7xl px-5 py-12 md:px-6 md:py-16 lg:px-8`.
- Card: `flex flex-col gap-7 rounded-3xl bg-white p-8 shadow-edge`; md: `flex-row items-center justify-between gap-10 p-10`.
  - Measured 1216×181 at 1440 (padding 40, gap 40). At 390: 350×368, padding 32, column layout.
  - Note: at 768 the measured direction was `row` (md applies at exactly 768).
- Text column `max-w-2xl flex-col gap-2`:
  - H2: Sentient 700, ink-900, 24/32 (md 28px / 37.33px).
  - P: 16/24 (md 18/28), ink-600, `text-pretty`.
- Buttons `flex shrink-0 flex-wrap gap-3` (below sm each grows to full width): "Start building" (lg brand, 158×48, href `https://cloud.activepieces.com/sign-up?...`) and "Talk to sales" (lg secondary, 151×48).
- Copy:
  - E: "Your first flow can ship this afternoon." / "Start with the one job your team keeps redoing by hand. No card to begin, and it runs on our cloud or your own servers."
  - I: "Roll it out without losing control." / "Projects, SSO, roles, audit logs and your own secret manager are there from the first flow, on our cloud or your infrastructure."

## F / G / K. Feature sections (shared layout)

- Section: `max-w-7xl flex flex-col gap-8 md:gap-12 px-5 py-24 md:px-6 md:py-32 lg:px-8`.
- Header: `relative z-10 grid gap-5 md:grid-cols-12 md:gap-12`.
  - H2 (`md:col-span-5`): Sentient 700, ink-900, 36/40 (md 48/48), balance. Measured 479×96 at 1440.
  - Right column (`max-w-md md:col-span-6 md:col-start-7 md:ml-auto`): p 20/28 ink-600, measured 448 wide.
  - K only adds a link "View all pieces": `mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm text-ink-900`, arrow 16px with `translate-x-0.5` on hover.
- Stage: `.stage relative isolate overflow-hidden rounded-4xl (32px) shadow-lift`, measured 1216×544 at 1440.
  - `::after` (z −5): `radial-gradient(ellipse 62% 62% at 50% 50%, rgba(2,6,24,.08) 0, transparent 72%)`.
  - Background image: `absolute inset-0 -z-10 size-full object-cover opacity-85 saturate-75`.
    - F and K: `/assets/meadow.webp` (1920×1080)
    - G: `/assets/clouds.webp`
  - Inner `grid w-full grid-cols-1 place-items-center` > `.visual-pad` (`width: 100%; padding: 2.5rem 1.5rem`; ≥640: `padding: 3rem`).
- `.visual-stage`: `border-radius: 16px; width: 100%; max-width: 34rem (544px); height: 28rem (448px); box-shadow: var(--shadow-lift); background: #fff; margin-inline: auto; position: relative`.
- Columns: `relative z-10 grid grid-cols-1 gap-8`; md: `grid-cols-3 gap-0 divide-x divide-ink-950/10`.
  - Each column: `flex flex-col gap-2 md:px-6 md:first:pl-0 md:last:pr-0`.
  - h3: 18/28, 600, ink-900. p: 16/24, ink-600.
- Copy:
  - F: "Agents that get the job done" / "Describe a job in plain words. An agent takes it end to end across your tools, checking in only where it counts." Columns: Plain words, no prompt engineering / It picks its own tools / Approval where it counts (bodies in saved HTML).
  - G: "Simple by default. Deep on demand." / "Chat drafts most of your flows. The builder gives you full control when they get hard." Columns: All the depth you need. / Code for the hardest step. / Every app connects once.
  - K: "760+ open-source pieces" / "For the apps you already run, with a clear path for everything else." Columns: Call any API / Build it with AI / All open source.

### F visual: agent thread demo (scripted loop with a fake cursor)

Stage is `.visual-stage flex flex-col`.
- Thread: `.thread relative flex min-h-0 flex-1 flex-col justify-end gap-5 overflow-hidden px-7 py-7 transition-opacity duration-500` with `mask-image: linear-gradient(#0000, #000 28px)`.
- Composer: `border-t border-ink-950/10 p-3` > `flex items-center gap-2 rounded-2xl bg-ink-100/70 py-2.5 pr-2.5 pl-4`.
  - Text: 14px ink-800. Placeholder "Give the agent a task…" in ink-400.
  - Typing caret: `ml-px inline-block h-4 w-0.5 animate-pulse bg-ink-500` (pulse = 2s, opacity .5 at 50%).
  - Send button: 32×32 `rounded-md bg-ink-950` with a 14px alt-arrow-up icon.
- Message kinds:
  - **user**: `max-w-[85%] self-end rounded-2xl rounded-tr-md bg-ink-950 px-4 py-3`, 14px white, "Process the invoice in my inbox."
  - **label**: 12px/500 ink-400, stars icon + "Agent".
  - **call** rows `flex gap-2.5`: 16px logo (opacity .4 → 1 when done, 500ms) and label (14px ink-400 → ink-800 when done, 500ms). When done, "· result" fades in (14px ink-400). The three calls:
    - gmail · "Found the invoice" · Maple · $4,200
    - quickbooks · "Matched the PO" · #PO-1183
    - xero · "Checked the budget" · Under Q3 (xero.svg is missing locally)
  - **draft** card: `w-full rounded-2xl border border-ink-950/10 bg-ink-50 p-4`. Header: 12px ink-400 quickbooks icon + "Payment · Maple Studio". Rows (14px): Amount **$4,200.00** (600 ink-900 tabular), Invoice #INV-2043, Due Jul 30.
  - **action**: "Pay $4,200 to Maple?" (14px ink-700) with buttons "Approve payment" (`rounded-lg bg-ink-950 px-3.5 py-1.5`, 13px/600 white) and "Edit" (13px/500 ink-500, hover bg ink-100). On approve, a grid-rows 1fr→0fr collapse (500ms `cubic-bezier(.16,1,.3,1)`) swaps it for "✓ Scheduled · logged in QuickBooks" (fade 500ms, 150ms delay).
- Message enter (`rise`): `opacity .48s, transform .52s cubic-bezier(.16,1,.3,1)` from `translateY(10px)`. Move: transform .52s. Leave: opacity .3s.
- **Timeline** (loop; starts when the stage is ≥30% visible via IntersectionObserver, pauses when it leaves):
  1. Reset: fade thread to 0 (440ms if there are messages), clear, wait 360ms, fade back, wait 440ms.
  2. Cursor moves to the composer (travel 720ms) and types "Process the invoice in my inbox." at 34ms per char (+12ms on spaces, +22ms every 3rd char), then holds 280ms.
  3. Cursor moves to send and clicks; the user message is pushed; wait 220ms; cursor hides; wait 620ms.
  4. Push label; wait 420ms. For each call: push pending, wait 500ms, mark done, wait 250ms.
  5. Wait 420ms, push draft, wait 920ms, push action, wait 1120ms.
  6. Cursor moves to "Approve payment" and clicks; approve; cursor hides; wait 3000ms. Loop.
- If the user clicks a demo control, the loop stops for 9000ms idle, then resumes.

### Fake cursor (shared by F and G)
- `div.cursor`: `pointer-events-none absolute top-0 left-0 z-30`, `transform: translate(x px, y px)`, `transition: transform var(--travel) cubic-bezier(.5,.02,.2,1), opacity .26s ease`. Hidden = opacity 0.
- Glyph SVG 23×25 (`viewBox 0 0 20 22`): path `M2 1.5 L2 17.5 L6.2 13.7 L9.1 20.3 L12 19 L9.2 12.5 L15 12.3 Z`, fill ink-950, stroke #fff 1.4, round joins.
- Press: `.cursor-down` scales the glyph to .82 (`transform-origin: 4px 3px`, transition .13s).
- Click ring: 19×19 circle, `border: 1.5px solid ink-400`, `margin: -3px 0 0 -4px`, animation `.48s ease-out`, keyframes `from { opacity: .5; transform: scale(.35) } to { opacity: 0; transform: scale(1.9) }`.
- Click timing: down 140ms, up, then 150ms.
- Target point = element rect center − (3, 2)px relative to the stage.

### G visual: flow canvas demo
Stage is `.stage-clip.visual-stage` (`overflow: hidden`; <640px: `height: 22rem`, scene scale .72; <384px: scale .6).
- Background `.dot-grid`: `radial-gradient(ink-300 1px, transparent 1px)` at 10px×10px, opacity .6, `mask: radial-gradient(82% 82%, #000 40%, #0000)`.
- Badges: top-left "● Live" (pill) and top-right "▶ Test" (`rounded-md`). Both `border-ink-950/10 bg-ink-50 px-2.5 py-1`, 12px/600 ink-700.
- Scene: centered column.
  - Webhook node: w-52 (208px) `rounded-xl border-ink-950/10 bg-ink-50 px-3.5 py-3`; 32px icon; "Webhook" 14px/600 ink-950; "New submission" 13px ink-500; "TRIGGER" tag 10px/600 uppercase `bg-ink-100 rounded-md`.
  - Connector: 1×20 ink-300.
  - OpenAI node (button), with a "Classify intent" subtitle and an "AI" tag that swaps to a check icon when configured (`chip` transition .24s).
  - Branch connector: w-60, with "Hot lead" → Slack "Notify sales" and "Just browsing" → HubSpot "Add to nurture" (`gap-8`).
- Config dropdown under OpenAI: `absolute top-full mt-2 w-72 (288px) rounded-xl border bg-ink-50 p-3`.
  - Enter `opacity .26s / transform .36s cubic-bezier(.16,1,.3,1)` from `translateY(-10px) scale(.95)`. Leave `.17s/.2s cubic-bezier(.4,0,.9,.4)`.
  - Contents: "CONFIGURE STEP" 11px/600 ink-400; "OpenAI account ✓" row; MODEL chips GPT-5.4 / **GPT-5.5** / GPT-5.5 Pro (12px/500 `rounded-md border`, selected `bg-ink-950 text-ink-50`); PROMPT box `min-h-[2.4rem] rounded-lg border px-2.5 py-1.5`, 13px, typed text "Classify intent from " followed by a `message` variable chip.
  - Caret: 1.5×16px ink-500, `blink 1s step-end infinite` (opacity 0 at 50%).
- **Timeline** (cursor travel 500ms):
  1. Reset: hide 320ms, fade scene, 240ms, show, 560ms.
  2. Click OpenAI (opens config), 640ms. Click GPT-5.5, 600ms. Click the prompt, then type "Classify intent from " at 48ms per char (no jitter), hold 200ms.
  3. Show the `message` chip, 480ms; caret off, 520ms; close config; show the check; cursor hides; 2600ms. Loop.

### K visual: pieces mosaic
- `.mosaic-outer` (`container-type: inline-size`) > `.mosaic`:
  - `display: grid; justify-content: center; grid-template-columns: repeat(23, var(--tile)); grid-auto-rows: var(--tile); gap: calc(var(--tile) * .16)`.
  - `--tile: 3.752cqw`. Measured tile 42px at 1440/1280, 23px at 768, 11px at 390.
  - Mosaic box 1120×334 at 1440, 302×90 at 390.
- The grid spells **"760+"** in 5×7 pixel glyphs with one empty column between glyphs (4×5 + 3 = 23 columns, 7 rows):
  ```
  7: 11111 00001 00010 00100 01000 01000 01000
  6: 00110 01000 10000 11110 10001 10001 01110
  0: 01110 10001 10001 10001 10001 10001 01110
  +: 00000 00100 00100 11111 00100 00100 00000
  ```
- Lit cell (`.cell.on`):
  - `padding: tile*.16; border-radius: tile*.24; background: linear-gradient(155deg, ink-50 0, #fff 100%); border: 1px solid rgba(2,6,24,.10); display: grid; place-items: center; overflow: hidden`.
  - The image is `object-fit: contain; filter: saturate(1.2); 100%×100%`.
  - Mount pop: `.5s var(--ease-smooth)`, delay `--i * 6ms`, `from { opacity: 0; transform: scale(.72) }`.
  - Unlit cells are empty.
- The logo assignment in the saved HTML is deterministic (seeded shuffle, seed 42); copy the src order from the saved HTML.
- Logo swap loop: every **820ms** pick a random lit cell not already swapping. Fade its img to opacity 0 (`transition: opacity .38s`); after 380ms replace the src with a random logo not currently shown, then fade back. Disabled under reduced motion.

## H / L. Bento grids

- Section: `max-w-7xl px-5 py-24 md:px-6 md:py-32 lg:px-8` > `flex flex-col gap-5 md:gap-8`.
- H2 (`pt-1` wrapper): Sentient 700 ink-900, 30/36 (md 36/40), balance, `max-w-xl` (576).
  - H: "Everything you need to run this for the whole company."
  - L: "One workspace your team and your agents share."
- Grid: `grid grid-cols-1 gap-4`; md: `grid-cols-24 gap-5` (20px), i.e. 24 equal columns.
- Card `article`:
  - `group flex h-[470px] md:h-[500px] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-edge`.
  - Header `flex flex-col gap-1 px-5 pt-6 pb-5`: h3 18/28 (md 20/28) weight 500 ink-900; p 14/20 (md 15px / 21.43px) ink-600.
  - Visual: `flex-1 overflow-hidden` > `relative isolate size-full overflow-hidden select-none` + `<bg tint class>`, containing a background div `absolute bg-no-repeat; inset: -1rem` and then a mock "sheet" (`overflow-hidden rounded-xl border border-ink-950/10 bg-ink-50 ring-1 ring-ink-950/10`).
- Art presets (exact inline values):

| art | tint class | opacity | filter |
|---|---|---|---|
| `/panel/meadow.webp` | bg-accent-a-100 | .70 | saturate(.72) brightness(1.04) contrast(.98) |
| `/panel/clouds.webp` | bg-primary-100 | .62 | saturate(.78) brightness(1.06) contrast(.96) |
| `/rows/water.webp` (missing locally) | bg-primary-200 | .55 | saturate(.7) brightness(1.05) contrast(.96) |
| `/grid/iris.webp` (missing locally) | bg-ink-100 | .48 | saturate(.62) brightness(1.08) contrast(.94) blur(3px); background-size 230% |

- Frame position modes for the mock sheet:
  - crop: `top-6 left-5 -right-12 -bottom-12`; md: `top-9 left-9 -right-28 -bottom-20`
  - crop-left: mirrored
  - wide: `top-6 left-5 right-5 -bottom-12`; md: `top-9 left-9 right-9 -bottom-20`
  - center: `inset-x-5 inset-y-0 flex items-center`; md: `inset-x-9`
  - float: `inset-0 grid place-items-center px-5`; md: `px-9`, sheet `max-w-[330px]`
- Mock typography: titles 18px/600 ink-950; rows 16px ink-900; meta 14px ink-600/500; values 15px tabular; mono 14/15px Fira Code. In the audit card, JSON keys use `.code-fn` (primary-800 #00598a), strings `.code-str` (accent-b-700 #bb4d00), base `.code-text` (ink-800), and lines are 15px with `line-height: 1.95`.
- **H cells** (span of 24 · bg · position · mode):

| cell | span | bg | position | mode |
|---|---|---|---|---|
| Projects | 12 | meadow | 50% 62% | crop |
| Access Control | 12 | clouds | 50% 12% | float |
| Secret Managers | 9 | water | 50% 30% | float |
| Audit Logs | 15 | clouds | 50% 58% | crop |
| AI Providers | 9 | meadow | 22% 34% | center |
| Reliability | 15 | water | 50% 16% | crop-left |
| Analytics | 12 | clouds | 50% 30% | wide |
| Deployment Options | 12 | iris | 50% 100%, size 230% | center |

  Measured at 1440: 598×500 (12), 444×500 (9), 753×500 (15).
- **L cells**:

| cell | span | bg | position | mode |
|---|---|---|---|---|
| Chat | 12 | water | 50% 16% | wide |
| MCP Server | 12 | clouds | 50% 26% | float |
| Tables | 12 | meadow | 50% 62% | crop |
| Knowledge Base | 12 | iris | 50% 100% | center |

- All mock content and copy is in the saved HTML. These cards are static: no hover effect (they are not links on the homepage) and no animation.

## M. Testimonials

- Section: `px-5 py-24 md:px-6 md:py-32 lg:px-8` > `mx-auto max-w-7xl flex flex-col gap-5 md:gap-8`.
- Header: `flex flex-col gap-5 pt-1`; md: `flex-row items-end justify-between gap-10`.
  - H2: Sentient 700, 30/36 (md 36/40), ink-900, `max-w-4xl`.
  - Stats `dl.flex.divide-x.divide-ink-950/10`, items `flex flex-col gap-1 px-5 first:pl-0 last:pr-0`:
    - dd (order 1): Sentient 700, ink-900, tabular, 24/32 (md 30/36). "25.1k" (fetched client-side from GitHub stars; hard-code "25.1k") and "356".
    - dt (order 2): 14/20 ink-600, "GitHub stars" and "Contributors".
- Wrapper `-m-3 p-3 fade-b`, with `--fade` 6rem / md 7.5rem / lg 9rem. The bottom fade mask:
  ```
  linear-gradient(to bottom, #000 calc(100% - F), #000000f5 calc(100% - F*.85), #000000d9 calc(100% - F*.7), #000000ab calc(100% - F*.55), #00000073 calc(100% - F*.4), #0000003b calc(100% - F*.25), #00000014 calc(100% - F*.12), transparent 100%)
  ```
- Grid: `grid grid-cols-1 gap-3`; sm 2 columns; lg 3 columns. 9 cards; measured 419×180 at 1440.
- Card `figure`: `flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-edge`.
  - Blockquote: 16/24 ink-600, wrapped in curly quotes.
  - Figcaption `mt-auto flex items-center gap-3`:
    - Avatar 40px round, `object-cover ring-1 ring-ink-950/10`. Initials fallback: 14px/600 ink-900 on a tint (VK on accent-b-200, CA on primary-200).
    - Name 14/20 600 ink-900; source 12/16 ink-600.
    - Platform mark 20px `ml-auto opacity-70`.
- Order: Kevin Hu (Trustpilot), Christian D. (G2), Vikranth K. (G2, initials), Mark D. (G2), Rida (Trustpilot), CaptainJamie ("Reddit, r/selfhosted", initials), Giuseppe "Peps" C. (G2), Dennis Klappe (Trustpilot), Patrick F. (G2). Quotes are in the saved HTML.

## N. FAQ

- Section: `px-5 py-24 md:px-6 md:py-32 lg:px-8` > `mx-auto max-w-3xl` (768).
- H2 "Questions, answered": Sentient 700, 30/36 (md 36/40), `mb-5 md:mb-8`.
- List: `flex flex-col gap-3`. Item: `rounded-2xl bg-white px-5 sm:px-6 shadow-edge`.
  - Button: `flex w-full items-center justify-between gap-6 py-5 text-left`.
    - Question: 18/28, 600, ink-900.
    - Icon: `solar:add-linear`, 20px, ink-600; rotates 45° when open (`transition-transform duration-200`).
  - Answer `p.pb-5`: 16/24 ink-600.
- Accordion: one open at a time; **the first item is open by default**. Collapse animates height from 0 to scrollHeight plus opacity 0→1, `transition: all 200ms ease-out` (leave is the reverse).
- 7 Q&As are in the saved HTML.

## O. Footer (`footer.closing`)

`relative isolate overflow-hidden bg-white`. Measured h 975 at 1440, 1801 at 390.

- **Meadow image** (md+ only; hidden <768):
  - Wrapper: `absolute inset-x-0 top-0 -z-10 w-full -translate-y-[0.5vw]`.
  - Image: `img.dissolve.block.w-full`, `/assets/meadow-2064.webp` (2064×2064; srcset 1376/2064, `sizes=100vw`), lazy. Rendered 1440×1440 at 1440.
  - `.dissolve` mask (top fade-in): `linear-gradient(#0000, #00000001 1.167%, #00000005 2.333%, #0000000b 3.5%, #00000013 4.667%, #0000001d 5.833%, #00000028 7%, #00000035 8.167%, #00000042 9.333%, #00000051 10.5%, #00000060 11.667%, #00000070 12.833%, #00000080 14%, #0000008f 15.167%, #0000009f 16.333%, #000000ae 17.5%, #000000bd 18.667%, #000000ca 19.833%, #000000d7 21%, #000000e2 22.167%, #000000ec 23.333%, #000000f4 24.5%, #000000fa 25.667%, #000000fe 26.833%, #000 28%)`, no-repeat.
- **Closing CTA**: `mx-auto max-w-7xl px-5 pt-28 md:px-6 md:pt-32 lg:px-8` > `flex flex-col items-center gap-5 text-center`.
  - Text block `max-w-3xl flex-col gap-3`:
    - H2 "Put your first automation to work.": Sentient 700, primary-950 #052f4a, 36/40 (md 48/48), balance. Measured 768×96 at 1440.
    - P: `mx-auto max-w-xl`, 20/28, ink-700, balance. "Start with one flow this afternoon, or bring the whole stack across. We've got you from here."
  - Buttons: `flex flex-wrap justify-center gap-3` (each grows below sm): "Start building" (lg brand), "Talk to sales" (lg secondary).
  - Reassurance `ul.flex.flex-wrap.justify-center.gap-x-5.gap-y-2`: li `flex items-center gap-1.5`, 14px/500, ink-700, with a 16px check-circle icon. Items: Free to start · No credit card · Open source.
- **Links card**: outer `relative mx-auto mt-24 md:mt-32 max-w-7xl px-5 pb-24 sm:pb-5 md:px-6 md:pb-6 lg:px-8 lg:pb-8`.
  - Card: `rounded-4xl bg-white fade-b px-1 py-8 sm:p-8 md:p-10 lg:p-12`, with `--fade` 2rem / md 2.5rem / lg 3rem. Measured 1216×415 at 1440 with 48px padding.
  - Grid: `grid-cols-2 gap-x-8 gap-y-10`, sm 3 columns, lg 5 columns.
  - Column h3: `mb-3`, 16/24, 600, primary-950.
  - ul: `flex flex-col md:gap-2.5`.
  - Links: `inline-flex min-h-11 md:min-h-0 items-center rounded-md`, 16/24, ink-900, hover ink-950 (200ms).
  - Columns:
    - Product: Workflow Builder, AI Agents, Tables, Chat, Pricing
    - Build: Docs, Pieces, MCP, Embed, GitHub
    - Business teams: Marketing, Sales, Customer Support, Operations, Finance
    - Technical teams: Engineering, IT, Internal Tools, OSS Developers
    - Company: Blog, Resources, Support forum, Talk to sales, Security, OSS friends
  - Bottom row: `mt-10 grid grid-cols-1 items-center gap-4 border-t border-ink-950/10 pt-6`, 16px ink-600; sm: `grid-cols-3 gap-6`.
    - Left: Y Combinator mask (`aspect-[116/24] h-4 bg-ink-700`) + "Backed company".
    - Center: "© 2026 Activepieces. All rights reserved."
    - Right (`gap-4`): Terms, Privacy, Cookie settings (button).

## P. Floating demo card (fixed, bottom-right)

- Shown only when `scrollY > 100`, after mount. Hidden on /sales, /pricing, /admin, /customers and /blog.
- Container: `fixed right-5 bottom-5 z-130` (below sm: `right-3 bottom-[max(.75rem, env(safe-area-inset-bottom))]`).
- Enter: `transition 300ms var(--ease-smooth)` from `translate-y-3 opacity-0`. Leave: 200ms.
- Link `a.ap-card` (/sales?ap_cta=floating_card):
  - `group relative flex w-fit items-center gap-3 overflow-hidden rounded-[1.1rem] bg-white py-3.5 px-4`; below sm: `gap-2.5 py-2.5 pr-3 pl-2.5`.
  - `transition-all 300ms ease-smooth`, `hover:-translate-y-1`.
  - Shadow: `0 1px 2px -1px cast-08, 0 12px 28px -12px rgba(77,23,154,.22)`; on hover `0 1px 2px -1px cast-08, 0 20px 40px -14px rgba(77,23,154,.32)` (accent-d-900 mixed 78% and 68% toward transparent).
  - Gradient border `::before`:
    ```
    border-radius: inherit; padding: 1px; inset: 0;
    background: linear-gradient(135deg, accent-d-400 #a684ff, accent-c-400 #ff6467 55%, accent-d-200 #ddd6ff);
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    opacity: .45 → 1 on hover; transition: opacity .3s
    ```
  - Icon box: 36px (below sm 32px), `rounded-lg bg-accent-d-50`, hover `bg-accent-d-100` (300ms). It holds a 1.05rem mask of `/brand/activepieces-mark.svg` in accent-d-600 #7f22fe.
  - Text: "See it in action" (15px, 600, `leading-snug`, tracking −.01em, ink-950) and "Book a 30-min demo" (13px, `leading-snug`, ink-500, mt-0.5).
  - Arrow: `solar:arrow-right-linear` 16px, ml-1, ink-400. On hover: `translate-x-0.5` and color accent-d-600 (300ms).
- Dismiss button: `absolute -top-2 -right-2 size-6 rounded-full bg-white text-ink-400 ring-1 ring-ink-950/8`, hover ink-900, with a 14px close-circle icon. Its hit area is extended by `before:-inset-2.5`.

## Q. MCP connect dialog (opened by the hero "Use in your AI" button)

- Native `<dialog class="sheet">`. Width `min(58rem, 100vw - 2rem)`, measured 928×658 at 1440. `border-radius: 16px`, `border: 1px ink-950/10`, `box-shadow: var(--shadow-over)`.
- `::backdrop`: `rgba(2,6,24,.4)`.
- Open: opacity .2s ease-out plus translate .24s ease-smooth from `translate: 0 4px` (via `@starting-style`). Close: opacity .13s ease-in.
- Below 768: it becomes a bottom sheet (top radius 16, full width, slides from `translate: 0 100%`).
- Shell: md+ height `min(41rem, 100svh - 5rem)`.
- Left rail (md: w-60, bg ink-50, `border-r`): "Pick your client" 12px/600 ink-500, then a tablist of clients. Each is `rounded-lg px-3 py-2.5`, 20px logo, 14px/600 label; active is ink-900, others ink-600 with hover bg ink-950/5. Clients: Claude, Claude Code, Cursor, VS Code, ChatGPT, Codex CLI, Cline, Antigravity, … (logos in manifest §3d).
  - A sliding white "pill" marks the active tab: `border 1px cast-10`, `shadow 0 1px 2px -1px cast-08`, `transition: transform .22s ease-smooth`.
- Right panel: header `px-7 py-5 border-b` with a 36px logo, "Connect to Claude" (18px/600), "Claude docs ↗" (14px ink-500) and a close button. Body has a segmented control (One click | Custom connector, `bg-ink-100 rounded-lg p-0.5`, 13px/600, sliding pill) and numbered steps (20px ink-900 circles with 11px white numbers, 14px ink-600 text).
- The CSS is in `mcp-connect-dialog.BUS9cZUT.css`. This dialog is secondary; implement it last.

## R. Motion summary (checklist)

| what | trigger | duration / easing | delay / stagger |
|---|---|---|---|
| Header nav-row fade-down (−8px) | mount | .62s ease-smooth | .24s |
| Header hide/show | scroll direction (±4px, >160px) | .3s ease-smooth translate | — |
| Header on-art → solid bg | scrollY > 32 | bg .3s ease-out; logo colors .2s ease-out | — |
| Dropdown open | hover/focus | island height .3s ease-smooth; panel-in .18s (3px rise); pill 220ms | close delay 180ms |
| Mobile sheet | click | opacity .18s, translate .22s (−6px) | groups: grid-rows 200ms ease-out |
| Hero plates fade | load | .82s ease-smooth | base 0, front 90ms |
| Hero lines (blur 5px, +14px) | load | .76s ease-smooth | .38s + i×90ms (i=1..4) |
| Logo marquee | always | 82.8s (≥768) / 72s linear infinite, −50% | — |
| AI CTA sheen | hover | .9s ease-smooth | — |
| AI CTA logos fan | hover | .42s ease-smooth translate, .3s opacity | n×40ms |
| Dream section | scroll (lerp .16/frame) | see §C formulas | windows 0.066 apart; collapse 0.02 apart |
| Dream (≤1023) | IO .35, once | 2400ms easeOutCubic | — |
| Agent demo / flow demo | IO .3, loop | cursor 720ms / 500ms `cubic-bezier(.5,.02,.2,1)`; messages .52s `cubic-bezier(.16,1,.3,1)` | scripted (see F/G) |
| Mosaic pop | mount | .5s ease-smooth, scale .72→1 | i×6ms |
| Mosaic swap | interval 820ms | img opacity .38s | — |
| FAQ | click | height+opacity 200ms ease-out; icon rotate 45° 200ms | — |
| Buttons | hover/active | bg/color/shadow 200ms ease-out; active scale .99 (nav .97) | — |
| Floating card | scrollY > 100 | 300ms ease-smooth from +12px; hover lift −4px 300ms | — |

Measured to be absent:
- No custom page cursor.
- No scroll-reveal fade-ins on the ordinary sections. The case studies, CTA bands, feature headers, bento, testimonials and FAQ are static. The only IntersectionObservers are the dream section (mobile) and the two demo loops.
- No parallax on the hero plates beyond the entrance fade.
- The JS checks `prefers-reduced-motion` and disables all of the motion above.

## S. Not measured

- The live testimonial "GitHub stars" value is fetched at runtime. 25.1k was observed; hard-code it.
- A cookie-consent banner component exists (`consent-enter` transitions: opacity/transform .25s ease-smooth from translateY(.5rem)). It was not shown in the measurement session, so it was not measured.
- The island's `-webkit-backdrop-filter: blur(30px)` was not applied in Chromium (computed `none`), so it was not visible.
