Source: https://www.activepieces.com/ (pages: /pricing, /sales, /security, /ai-governance, /embed, /oss-friends)

# Activepieces marketing pages: clone build spec

Measured 2026-10-16 with headless Playwright (Chromium 1440×900, 768×1024, 390×844, DPR 1). Values come from `getComputedStyle`, `getBoundingClientRect`, `document.getAnimations()`, plus the live Nuxt chunks (copied to `specs/ref/js/`). Rects are written `[x, y, w, h]` in document coordinates.

This file builds on `/CLONE_SPEC.md` §0. It reuses every token named there (ink-*, primary-*, accent-a/b/c/d-*, `shadow-edge`, `shadow-lift`, `shadow-over`, radius scale, `ease-smooth`, type scale, ui-button sizes/variants). This file only specs what is new.

**Reference material in `specs/ref/` (read-only, do not import):**
- `html/<page>.ssr.html`: the server-rendered HTML of each page, with header and footer. It is the source of truth for exact markup, classes and copy. Search it by visible text. Strip the `data-v-*` attributes. All classes are Tailwind **v4**, so convert any v4-only syntax.
- `js/*.js`: the original page chunks (minified Vue). They are needed for the scripted or scroll-driven parts: security canvases, ai-governance scrubbing, the logo fitter and the sales form logic.
- `css/*.css`: the scoped CSS for those components.
- `ai-governance-deck-marks.html`: the four blob SVG marks for the rollout deck, verbatim.
- `oss-friends.json`: all 37 OSS friend cards (name, href, description, logo URL).

---

## 0. Cross-page decisions

### 0.1 Shell per route

| route | Header | Footer (`closing`) | FloatingCard ("See it in action") | notes |
|---|---|---|---|---|
| /pricing | shared `Header heroArt={false}` | shared, custom copy (see 0.2) | **hidden** | |
| /sales | **none** (own top bar) | **none** | **hidden** | Nuxt `layout:false`. Render outside `Layout`. See §2. |
| /security | shared `Header heroArt={false}` | shared, custom copy + custom buttons + custom reassurance | shown | Page sets `heroDark:true`, but the measured header is identical to the other pages (island `rgba(255,255,255,.68)`, links ink-900, "Talk to sales" solid). No variant is needed. |
| /ai-governance | shared `Header heroArt={false}` | shared, custom copy | shown | |
| /embed | shared `Header heroArt={false}` | shared, custom copy | shown | |
| /oss-friends | shared `Header heroArt={false}` | shared, custom copy + custom secondary | shown | |

- The original hides the floating widget on paths that equal or start with `/sales`, `/pricing`, `/admin`, `/customers` or `/blog`. `Layout.jsx` must skip `<FloatingCard/>` on those paths. The rest of its behaviour is as on the homepage: it appears once `scrollY > threshold`.
- On non-home pages the header is in the normal (not on-art) state from scrollY 0. Hide-on-scroll-down and show-on-scroll-up behave as on the homepage.
- Active nav link: "Pricing" gets `router-link-active` on /pricing, but its computed style is identical to the other links (color ink-900, transparent bg). No active styling is needed.
- Global cookie banner (layout component `cookie-banner`, all pages): it appeared on first visit as a fixed bottom-left card with title "Cookies", body copy "We use cookies to improve your experience and make the site better. Decline and analytics stay anonymous. Privacy policy." and buttons Decline and Accept. Buttons: `rounded-lg px-3.5 py-1.5 text-sm font-medium`. Decline: `border border-ink-950/10 bg-white text-ink-700 hover:bg-ink-950/4`. Accept: `bg-ink-900 text-white hover:bg-ink-800`. Enter/leave: opacity plus translateY(.5rem), 250ms ease-smooth. It is not page-specific. Build it only if the coordinator wants it.

### 0.2 Footer closing CTA is per-page (Footer needs props)

The site's `closing-section` reads a per-page config. Defaults: primary "Start building" (cloud sign-up, brand), secondary "Talk to sales" (`/sales`, secondary), reassurance `Free to start · No credit card · Open source`. `Footer.jsx` currently hard-codes the homepage copy. Make the H2, paragraph, both buttons and the reassurance list props, or feed them from a route-keyed map. Geometry is unchanged from homepage §O. Measured footer heights: 975 at 1440, 1211 at 768, 1801 to 1861 at 390 (it grows when the reassurance wraps).

| page | H2 | paragraph | primary | secondary | reassurance |
|---|---|---|---|---|---|
| /pricing | Pick a plan, and change it whenever. | Start free with no card. Move up when a flow earns it, and run it on our cloud or your own servers either way. | default | default | default |
| /security | Questions from your security team? | Send the questionnaire over and our team will fill it in. The audit documents are in the trust center. | **Talk to our team** → `/sales` (brand) | **Read the source** → `https://github.com/activepieces/activepieces` (secondary) | **SOC 2 Type 2 · Pen tested in 2026 · MIT licensed core** |
| /ai-governance | Bring AI into your team, with the guardrails. | Choose the models, scope what agents can reach, and approve anything that matters. | default | default | default |
| /embed | Tell us what you want your users to build. | Embedding is a contracted plan, so we size it with you. The docs cover the SDK if you want to look first. | default | default | default |
| /oss-friends | Run the open-source core on your own servers. | Activepieces is MIT licensed. Read the code, or start on our cloud in a couple of minutes. | default | **Read the source** → GitHub URL | default |

### 0.3 New tokens / utilities (add in section CSS, per BUILD_CONVENTIONS)

- **Button variants** (add to `buttonClasses`, or write inline):
  - `light`: `bg-white text-ink-950 hover:bg-ink-100 focus-visible:outline-white`
  - `quiet-light`: `text-white hover:bg-white/10 focus-visible:outline-white`
  - `outline`: `text-ink-950 ring-1 ring-ink-950/30 hover:bg-ink-950/5 hover:ring-ink-950/50`. It is defined in the bundle but not used on these pages.
- **Code token classes**: the homepage already has `.code-fn` (primary-800), `.code-str` (accent-b-700) and `.code-text` (ink-800). These pages add `.code-key` (accent-a-700 #007a55) and `.code-dim` (ink-600 #45556c).
- Hex values used here that §0 does not list: accent-a-950 #002c22, accent-b-950 #461901, accent-d-950 #2f0d68, accent-c-700 #c10007 (form error), primary-tint-soft `color-mix(primary-50, primary-100)` = #e7f6ff.
- `--spacing-chrome` (already in `:root`) is used by /ai-governance as `pt-chrome` (84px measured).
- `md:leading-display` (1.015) is used by the security H1.

### 0.4 Icons

The site uses Solar icons, rendered as an `iconify` mask. I downloaded the 42 that were missing to `public/icons/solar/<name>.svg` (from api.iconify.design). **Builders must append matching `:where(.i-solar\:NAME)` rules to `src/icons.css`**, following the existing pattern. The new icons:
`alt-arrow-left-linear bell-bing-bold bolt-bold brain-bold brain-linear chart-2-bold chart-linear checklist-bold clipboard-text-bold clipboard-text-linear clock-circle-bold cloud-bold cpu-bolt-bold document-text-bold export-bold filter-linear folder-bold folder-linear global-linear globe-linear incognito-linear key-linear key-minimalistic-square-linear layers-bold list-bold lock-password-linear menu-dots-linear plug-circle-linear shield-keyhole-linear undo-left-round-bold undo-left-round-linear user-check-linear user-check-rounded-bold user-id-bold user-id-linear users-group-two-rounded-bold users-group-two-rounded-linear verified-check-bold verified-check-linear wallet-money-bold widget-5-bold` (plus `key-bold`, `lock-keyhole-bold`, `plug-circle-bold`, `server-bold`, `shield-check-bold`, `users-group-rounded-bold`, which were already on disk).

---

## 1. Shared components (new, or homepage components that need props)

### 1.1 `Faq` (homepage component, needs props)
The same component (`faq-section`) appears on 5 pages. Props are `heading` (default "Questions, answered") and `items` [{question, answer}]. Behaviour and geometry are identical to homepage §N: max-w-3xl, item `rounded-2xl bg-white px-5 sm:px-6 shadow-edge`, the first item open by default, one item open at a time, the icon rotates 45°, and height plus opacity transition over 200ms ease-out. On mobile, long questions wrap: the button stays `py-5`, so the question line-height is 28 and the item is 108px tall with 2 lines at 390.

### 1.2 `CaseStudy` (homepage CaseAlan / CaseFundingSocieties)
/ai-governance reuses the **Alan** case study unchanged. Measured 1280×745 at 1440 (`[80,4496]`), 903 tall at 390. The original logo src is `/logos/customers/alan.svg` (260×54 natural, rendered 193×40). The homepage clone uses `/assets/alan.svg`. Either works.

### 1.3 `IconBand` (NEW; used on /security and /ai-governance)
- Section: `relative isolate px-5 py-28 md:px-6 md:py-40 lg:px-8` > `mx-auto w-full max-w-7xl`.
- Background div `.ground` (`pointer-events-none absolute inset-0 -z-10`):
  ```css
  .ground{background-color:var(--color-ink-100);border:1px solid var(--color-ink-200);border-top:0;border-end-end-radius:3rem;border-end-start-radius:3rem}
  .is-faded{border-top:1px solid var(--color-ink-200);mask-image:linear-gradient(#0000 0,#0000001f 5rem,#00000073 12rem,#000c 18rem,#000 24rem)}
  ```
  `background="gradient"` adds `.is-faded`. /security uses `gradient` and /ai-governance uses the default `solid`. Despite the name, the measured ai-governance band still renders the ink-100 ground with a 48px bottom radius.
- H2: `mx-auto max-w-3xl text-center font-display text-3xl font-bold text-balance text-ink-900 md:text-5xl`. Sentient 700, 48/48 at ≥768 and 30/36 at 390.
- Grid: `mt-12 md:mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3`. Cards measured 405×358 at 1440 (32px gaps) and 350×326 at 390.
- Card `article`: `flex flex-col items-center rounded-2xl bg-white px-8 py-10 md:px-10 md:py-14 text-center`. No shadow or border.
  - Icon tile: `grid size-20 place-items-center rounded-[1.75rem] text-ink-950` (80×80, r 28) with a 56px (`size-14`) bold Solar icon. The tile bg cycles by index through `bg-primary-300 #74d4ff`, `bg-accent-d-300 #c4b4ff`, `bg-accent-b-300 #ffd230` and `bg-accent-a-300 #5ee9b5`.
  - Text block `mt-10 flex flex-col gap-1.5`: h3 Sentient 700 30/36 ink-900 balance; p 18/28 ink-600 pretty.
  - The body supports one inline markdown link `[label](href)`, rendered as `font-medium text-ink-950 underline underline-offset-4 hover:text-primary-700`.
- No motion.

### 1.4 `RotatingLogos` (NEW; /pricing under the plans, /ai-governance in the sticky hero bar; /sales uses a variant, see §2)
- Grid: `grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-10`. 6 cells: 3 rows of 2 at 390 (179 tall), 2 rows of 3 at 768 (109 tall), 1 row at 1440 (38 tall, cells 169 wide).
- Cell: `flex items-center justify-center`, inline `height: 38.41px` and `--stagger: i*40ms`.
- Logo: `<span role="img" aria-label>` with classes `block w-full bg-ink-600 [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat]`, inline `mask-image:url(/logos/customers/X)`, `height`, `max-width` and an optional `translateY`.
- Exact fitted sizes for the box 112×32 (from the site's fitter `specs/ref/js/logo-fit.DMqNzuiB.js`, `fit(logos, 112/32)`, maxScale gives cell height 38.41):

  | logo | h | max-w | | logo | h | max-w |
  |---|---|---|---|---|---|---|
  | bosch.svg | 31.23 | 109.29 (ty .020) | | decathlon.svg | 32.97 | 115.38 |
  | alan.svg | 29.45 | 103.09 | | merkle.svg | 36.45 | 127.56 |
  | sap.svg | 31.11 | 108.90 | | orange.svg | 31.03 | 108.61 |
  | tryg.svg | 27.52 | 96.32 | | exl.svg | 28.97 | 101.39 |
  | funding-societies.svg | 29.66 | 103.82 | | concentrix.svg | 33.85 | 118.49 |
  | carrefour.svg | 38.40 | 134.40 | | odoo.svg | 28.39 | 99.37 |
  | corgi.webp | 30.70 | 107.46 | | keller-williams.svg | 38.40 | 134.40 |
  | hilton.svg | 32.45 | 113.56 | | hackerone.svg | 33.94 | 118.79 (ty −.059) |
  | lumen.svg | 36.83 | 128.91 (ty .015) | | shopee.svg | 31.58 | 110.53 |
  | pipefy.svg | 29.81 | 104.33 | | itv.svg | 31.46 | 110.11 |
  | dell-technologies.svg | 38.41 | 134.43 | | moneygram.svg | 33.22 | 116.27 |
  | zerofox.svg | 36.96 | 129.36 | | capgemini.svg | 32.72 | 114.51 |

- **Motion**: every **3500ms** (`setInterval`, skipped under prefers-reduced-motion) the window advances by 6. That gives four sets in this order: [bosch, alan, sap, tryg, funding-societies, carrefour] → [corgi, hilton, lumen, pipefy, dell-technologies, zerofox] → [decathlon, merkle, orange, exl, concentrix, odoo] → [keller-williams, hackerone, shopee, itv, moneygram, capgemini] → loop.
  - Each cell is an out-in transition named `logo-fade`, keyed by src:
    ```css
    .logo-fade-enter-active,.logo-fade-leave-active{transition:opacity .3s,transform .3s;transition-delay:var(--stagger,0s)}
    .logo-fade-enter-from,.logo-fade-leave-to{opacity:0;transform:scale(.94)}
    ```
    Easing is the CSS default `ease`. Measured: cell 0 starts at 0ms and cell 5 at 200ms. A full swap takes about 600ms + 200ms stagger.

### 1.5 `ProductHero` (NEW; /embed)
- Container: `hero-stage mx-auto flex w-full max-w-7xl flex-col items-start px-5 pt-28 pb-24 md:px-6 md:pt-32 md:pb-32 lg:px-8 text-left`.
- H1: `font-display text-5xl font-bold text-balance text-ink-900 md:text-6xl`, Sentient 60/60 (48/48 below md). Measured 1147×60 at 1440 and 350×144 (3 lines) at 390. It is not animated.
- The other rows use class `hero-line` with `--i` set to 1 to 4:
  ```css
  html.js .hero-line{animation:hero-line .64s var(--ease-smooth) calc(var(--i)*70ms) both}
  @keyframes hero-line{0%{opacity:0;filter:blur(4px);translate:0 12px}to{opacity:1;filter:blur(0);translate:0}}
  ```
  Measured delays: p 70ms, buttons 140ms, stage 210ms, highlights 280ms.
- p: `mt-3 max-w-5xl text-xl text-ink-600` (20/28).
- Buttons `mt-5 flex w-full flex-wrap items-center gap-3 max-sm:*:grow`: primary lg solid (ink-950) and secondary lg secondary.
- Stage: `stage relative isolate mt-12 md:mt-16 w-full overflow-hidden rounded-4xl shadow-lift`. Measured 1216×544 at 1440 and 350×432 at 390, the same as the homepage feature stage.
  - Background image: `/panel/coast.webp` with srcset `coast-640/960/1376.webp` plus `coast.webp 1920w`, `sizes="(min-width:1280px) 1280px, 100vw"`, classes `absolute inset-0 -z-10 size-full object-cover opacity-85 saturate-75`.
  - Pseudo-element: `.stage::after{content:"";z-index:-5;pointer-events:none;position:absolute;inset:0;background:radial-gradient(ellipse 62% 62% at 50% 50%, color-mix(in oklab,var(--color-ink-950),transparent 92%) 0, transparent 72%)}`.
  - Inner `grid w-full grid-cols-1 place-items-center` holds the visual slot.
- Highlights: `mt-12 md:mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-ink-950/10`. Items are `flex flex-col gap-2 md:px-8 md:first:pl-0 md:last:pr-0`: h2 18/28 600 ink-900; p 16/24 ink-600.

### 1.6 `BentoGrid` (homepage H/L component, needs a cells prop)
/embed uses the same `bento-grid` component as homepage §H/§L, with 8 new cells (§6.2): same card, art presets, frame modes and 24-col grid. Generalise `BentoPlatform`/`BentoPlatformCard` to accept `{heading, cells:[{title, body, span, art, size, pos, mode, visual}]}`.

### 1.7 `InfoTip` (NEW; /pricing)
- Trigger: `<span class="relative">` > `<span role="button" tabindex=0 class="cursor-help underline decoration-ink-400 decoration-dotted decoration-1 underline-offset-4 transition-colors duration-200 hover:decoration-ink-700">`.
- Tooltip: `absolute bottom-full left-1/2 z-40 mb-2.5 block w-72 rounded-xl bg-ink-950 px-4 py-3 text-left text-[15px] leading-snug font-normal text-ink-100 shadow-over`.
  - Measured 288 wide; height 65, 86 or 107 for 2, 3 or 4 lines; 15/20.625; color #f1f5f9; r 12; padding 12/16.
  - Inline `transform: translateX(calc(-50% + Gpx))`, where G clamps the tip to stay 12px inside the viewport: if left < 12 then G = 12 − left; if right > innerWidth − 12 then G = innerWidth − 12 − right.
  - Arrow: `absolute top-full size-2 -translate-y-1/2 rotate-45 bg-ink-950`, left `calc(50% - Gpx - .25rem)`.
- Behaviour:
  - Open on mouseenter or focus; close on mouseleave after **90ms**. Re-entering the trigger or the tip cancels the close.
  - Click toggles. Esc, blur, or a pointerdown outside closes.
  - Fade: `transition-opacity duration-200 ease-out`, from and to `opacity-0`, on both enter and leave.

---

## 2. /sales  (standalone layout)

Document height: 956 at 1440, 1532 at 768, 1804 at 390. Title "Talk to sales | Activepieces".

**Root**: `relative isolate flex min-h-screen flex-col bg-white p-4 sm:p-6 font-sans text-ink-600 antialiased`.
- Background: `div.pointer-events-none.absolute.inset-0.-z-10.bg-cover.bg-center.bg-no-repeat.lg:fixed` with `background-image:url(/panel/coast.webp)`. It is `position:fixed` at ≥1024 (1440×900 viewport) and `absolute` below that.
- Top bar: `mx-auto mb-4 sm:mb-6 flex w-full max-w-7xl justify-end` (h 32), with a single link "Sign up":
  - href `https://cloud.activepieces.com/sign-up?ap_cta=sales_topbar&ref=%2Fsales`.
  - Classes `rounded-full px-3 py-1.5 text-sm font-medium text-ink-800 transition-colors duration-200 hover:bg-white/50 hover:text-ink-950`. Measured 74×32 at (1286,24).
- `main#main-content`: `mx-auto flex w-full max-w-7xl flex-1 flex-col-reverse gap-4 sm:gap-6 lg:flex-row-reverse lg:gap-8`. Measured `[80,80,1280,852]` at 1440. Because of `-reverse`, the **form is on the left and the pitch on the right** at lg, and the **form is first** on mobile.

**Pitch column** (DOM-first, right at lg):
- Wrapper: `lg:sticky lg:top-6 lg:z-10 lg:flex lg:min-h-[calc(100vh-3rem)] lg:w-[54%] lg:items-center lg:self-start`. Width 691 at 1440.
- "Bridge" notch (lg only), joining the two cards: `pointer-events-none absolute inset-y-[40%] right-[calc(100%-2px)] z-10 hidden w-[calc(2rem+4px)] scale-x-[-1] flex-col lg:flex` (36×170). It contains, top to bottom:
  - `<svg viewBox="0 0 26 12" class="w-full shrink-0"><path d="M0 0H1A12 12 0 0 0 25 0H26V12H0Z" class="fill-white"/></svg>`
  - `<div class="flex-1 bg-white">`
  - `<svg viewBox="0 0 26 12" class="w-full shrink-0"><path d="M0 12H1A12 12 0 0 1 25 12H26V0H0Z" class="fill-white"/></svg>`
- `aside`: `flex w-full flex-col gap-10 rounded-2xl bg-white px-6 py-12 sm:px-10 lg:px-12 lg:py-14 xl:px-16 shadow-edge`. Measured 691×632 at 1440; 720×608 at 768; 358×822 at 390.
  - Header `flex flex-col gap-3`:
    - H1 "Put your AI to work": `font-display text-4xl lg:text-5xl font-bold text-balance text-ink-900`, 48/48 at lg and 36/40 below.
    - p "Describe the work. AI builds the automation. IT stays in control.": `max-w-md text-xl text-ink-600` (20/28).
  - `ul.flex.flex-col.gap-3.5` (inside a `flex flex-col gap-5` with the header). Each li is `flex items-start gap-3`, with a `solar:check-read-linear` icon (`mt-1 size-4 text-ink-400`) and a span (16/24 ink-600). Items: "Anyone can build, in plain language" · "IT keeps control with SSO, RBAC and audit logs" · "Runs on our cloud, your servers, or air-gapped".
  - Figure `flex flex-col gap-3 border-t border-ink-950/10 pt-6`:
    - blockquote `text-base leading-relaxed text-ink-500` (16/26 #62748e): “User-friendly, even for those without technical skills. Highly flexible and powerful, with options to add code when needed.”
    - figcaption `flex items-center gap-2.5 text-sm text-ink-400`: img `/reviews/g2-giuseppec.webp` (`size-6 rounded-full object-cover`, 24px), then "Giuseppe C.".
  - Logo grid: `grid grid-cols-2 items-center gap-x-4 gap-y-8 sm:grid-cols-[repeat(3,auto)] sm:justify-between sm:gap-y-6`.
    - Cells: `flex w-28 items-center justify-center` (112 wide), height **33.61px**.
    - Logos: `bg-ink-800`, fitted for box **112×28** (sizes below).
    - Initial set: [bosch, alan, sap, tryg, funding-societies, carrefour].
    - **Motion differs from §1.4**: every **1400ms**, pick a random cell (never the same cell twice in a row). Swap its logo for a random logo not currently shown. Out-in `logo-fade` with `transition: opacity .16s ease-out, transform .16s ease-out`, from and to `opacity:0; transform:scale(.94)`, no stagger. See `specs/ref/js/sales.e5BFP-yD.js` (functions T/E/D).
    - Fitted heights (h / max-w) for 112×28: bosch 25.97/103.88 (ty .019), alan 24.50/97.99, sap 28.04/112.15, tryg 24.08/96.32, funding-societies 26.73/106.92, carrefour 33.60/134.40, corgi 27.67/110.67, hilton 29.24/116.95, lumen 30.63/122.53, pipefy 26.86/107.44, dell 33.61/134.43, zerofox 30.74/122.96, decathlon 27.42/109.68, merkle 30.31/121.25, orange 27.96/111.85, exl 26.10/104.41, concentrix 28.16/112.63, odoo 25.58/102.33, keller-williams 33.60/134.40, hackerone 28.23/112.92 (ty −.056), shopee 28.46/113.83, itv 28.35/113.40, moneygram 27.63/110.52, capgemini 27.21/108.85.

**Form column**:
- Section `relative mx-auto flex w-full max-w-2xl flex-col justify-center lg:flex-1 lg:self-center` > card `rounded-2xl bg-white p-8 sm:p-10 shadow-edge`. Measured 557×796 at 1440 and 358×886 at 390.
- Logo: `mb-8 flex justify-center` > link to `/` > `span.block.h-7.w-40.bg-ink-950` masked with `/brand/activepieces-logo.svg` (160×28; downloaded).
- `form.space-y-6`. Labels are `mb-2 flex items-baseline gap-2 text-sm font-medium text-ink-900` (14/20 500), and required fields add `<span class="text-ink-400">*</span>`.
- Input classes: `w-full rounded-xl border border-ink-950/20 bg-white px-4 py-3.5 text-base text-ink-900 placeholder:text-ink-400 transition-colors duration-200 outline-none hover:border-ink-950/35 focus:border-primary-700 focus:ring-2 focus:ring-primary-700/15`. Height 54, r 12.
  - Measured states: idle border `ink-950/20`; hover `ink-950/35`; focus border #0069a8 plus ring `0 0 0 2px rgba(0,105,168,.15)`.
- Fields (in order):
  1. `email` "Work email" * (type email, autocomplete email). **Autofocused on load** on non-coarse pointers.
  2. Grid `grid-cols-1 sm:grid-cols-2 gap-6`: `first_name` "First name" *, `last_name` "Last name" *.
  3. `company` "Company" *.
  4. `goal` "What would you like help with?" *: textarea, rows 4 (126 tall), `resize-y`, placeholder "The work you want to automate, or the problem you are trying to solve."
  5. `source` "Where did you hear about us?" (optional): a select with `appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-11`.
     - Chevron bg: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.6' viewBox='0 0 16 16'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E")`.
     - Options: Pick one (value "") · Search (Google, Bing, etc) · AI Search (ChatGPT, Claude, etc) · GitHub · A friend or colleague · YouTube · LinkedIn · Reddit · Other. Choosing "Other" reveals `input[name=source_other]` placeholder "Tell us where" (`mt-2`).
  6. Submit: ui-button lg solid full width, "Talk to sales" (477×48). It is `disabled:opacity-40` while sending and the label becomes "Sending…".
- Validation (client-side, keep): a free-mail domain (gmail/yahoo/hotmail/outlook/aol/icloud/mail/zoho/yandex/protonmail/gmx/live/me/mail.ru/qq/163) or an invalid email shows `p#email-error.mt-1.5.text-sm.text-accent-c-700` (#c10007): "Please use your work email so we can tailor the demo." The email is then refocused.
- The clone does **not** submit. To mimic success, swap to the "thanks" state:
  - A back button: `inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-950`, with `solar:alt-arrow-left-linear` 16px and text "Edit details".
  - H2 `mt-5 font-display text-2xl font-bold text-ink-900` "Thanks, {firstName}".
  - p `mt-2 text-ink-600` "Someone from the team will email you within one working day, from an activepieces.com address."
  - Button: lg secondary, full width, `mt-8`, "Start building while you wait" → cloud sign-up.
- No other motion.

---

## 3. /pricing

Doc height 6491 at 1440, 7319 at 768, 9297 at 390. The `<main>` content is wrapped in `div.bg-linear-to-b.from-white.via-ink-50.to-ink-50`, i.e. `linear-gradient(#fff 0%, #f8fafc 50%, #f8fafc 100%)` over the whole main height.

| # | section | 1440 y/h | 768 y/h | 390 y/h |
|---|---|---|---|---|
| A | Plans: hero, toggle, 4 plan cards, Embed/Enterprise rows, rotating logos | 0 / 1283 | 0 / 2175 | 0 / 3447 |
| B | `#compare` table "Everything you need to pick the right plan for your team." | 1283 / 3185 | 2175 / 2885 | 3447 / 2837 |
| C | FAQ "Pricing questions." | 4468 / 1048 | 5060 / 1048 | 6284 / 1184 |
| — | Footer (closing) | 5516 / 975 | 6108 / 1211 | 7468 / 1829 |

### 3.A Plans
- Section: `mx-auto w-full max-w-7xl px-5 pt-24 md:px-6 md:pt-26 lg:px-8` (pt 96 / 104; no bottom padding).
- Hero `mx-auto max-w-5xl text-center`:
  - H1 "Pricing": `font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-balance text-ink-900` (60/60, 48/48, 36/40).
  - p `mx-auto mt-3 max-w-2xl text-lg text-ink-600` (18/28): "A path for every team at your company to build with AI."
- **Billing toggle** (wrapper `mt-7 mb-6 md:mt-9 flex flex-col items-center`):
  - Pill `relative inline-flex items-center gap-1 rounded-full border border-ink-950/10 bg-white p-1`, measured 330×50.
  - Two `button[aria-pressed]`: `relative flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 min-[360px]:px-5 text-[15px] min-[360px]:text-base font-medium whitespace-nowrap text-ink-600 transition-colors duration-200 ease-smooth hover:text-ink-950`.
    - "Monthly" (102×40).
    - "Annual · Save 2 months" (214×40). The `·` is `opacity-40`; "Save 2 months" is `text-xs min-[360px]:text-sm leading-6 font-semibold text-primary-600` (#0084d1).
  - The selected state is a **clip-path reveal**, not a moving pill. Two overlays sit inside the pill:
    1. `span.pointer-events-none.absolute.inset-0.bg-ink-800` (#1d293d).
    2. `span.pointer-events-none.absolute.inset-0.flex.items-center.gap-1.p-1` holding white copies of both labels (selected "Save 2 months" in `text-primary-300` #74d4ff).
  - Both overlays have `transition-[clip-path] duration-200 ease-smooth will-change-[clip-path]` and the same inline clip-path:
    - Monthly: `inset(3px 223px 5px 3px round 9999px)`
    - Annual: `inset(3px 5px 5px 109px round 9999px)`
    - That is, inset to the selected button's box relative to the 328×48 inner box. Compute it from button offsets.
  - Measured on click: clip-path 200ms `cubic-bezier(.22,1,.36,1)`; label color 200ms.
  - Default is Monthly.
- **Plan cards** grid `grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4`. Cards 286×599 at 1440 (24 gaps), 348×541 at 768, 350×541 at 390 (2202 tall total).
  - Card `relative flex flex-col rounded-2xl bg-white p-7 shadow-edge` (padding 28).
  - h2: Sentient 700 24/32 ink-900. Audience `mt-1 text-sm text-ink-500`.
  - Price block `mt-5 min-h-[5rem]`:
    - `p.text-5xl.font-bold.tracking-[-0.035em].text-ink-950.tabular-nums` (Inter 700 48/48, ls −1.68px).
    - Sub `mt-1.5 text-base text-ink-600`.
  - CTA: ui-button **md solid** plus `mt-5 w-full transition-transform duration-200 ease-smooth hover:-translate-y-0.5` (230×44).
  - `div.my-4.h-px.bg-ink-200`, then `p.mb-3.5.text-base.font-semibold.text-ink-900` (16/24 600).
  - `ul.flex.flex-1.flex-col.gap-2.5`: li `flex items-start gap-3 text-base`, with `solar:check-read-linear mt-1 size-4 text-ink-950` and an InfoTip trigger whose text is `text-ink-600`.
  - Exception in Free: "Chat to automation" uses `solar:stars-linear text-ink-600` and the text is `font-semibold text-ink-900`.
  - Price numbers use `ui-animated-number`: on toggle they count from the old to the new value over **420ms** with ease `1-(1-t)^5`, `Intl.NumberFormat('en-US')`, rounded integers.

| plan | audience | monthly | annual | sub (monthly / annual) | CTA (href) | list label | items (all have tooltips, §3.D) |
|---|---|---|---|---|---|---|---|
| Free | For getting started | $0 | $0 | Free forever, no card | Get started (`https://cloud.activepieces.com/sign-up`) | What you get | 1,000 credits a month · Unlimited flows · Up to 5 users · ★Chat to automation · Flows, Agents, Tables · MCPs and API access |
| Plus | For daily builders | $20 | $16 | flat per month / flat per month, billed yearly | Get started (sign-up) | Everything in Free, plus | 10× the Free plan · Then pay as you go · Up to 5 users · Bring your own AI keys |
| Team | For growing teams | $200 | $166 | flat per month / flat per month, billed yearly | Get started (sign-up) | Everything in Plus, plus | 5× the Plus plan · Unlimited projects · 25 users included · SSO and standard roles · Global connections · Email support |
| Ultimate | For enterprise scale | Custom | Custom | We shape it with you | Talk to sales (`/sales`) | Everything in Team, plus | Credits sized to you, yearly · Dedicated workers · Execution priority · SCIM and custom roles · Releases and Git Sync · Audit logs and secrets · Dedicated support |

- **Embed / Enterprise rows**: `mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2`. Each is 596×268 at 1440; 720×268 at 768; 350×322 and 350×350 at 390.
  - Card `split-bg split-bg--left|right flex h-full flex-col rounded-2xl bg-white p-8 shadow-edge`, with:
    ```css
    .split-bg{background-image:linear-gradient(to right bottom,#fff 35%,#0000),url(/rows/embed-clouds.webp);background-repeat:no-repeat,no-repeat;background-size:100% 100%,200% auto}
    .split-bg--left{background-position:50% center,0 100%}
    .split-bg--right{background-position:50% center,100% 100%}
    ```
    The image (`/rows/embed-clouds.webp`) is downloaded. The two cards together show one continuous picture.
  - Head `flex flex-wrap items-baseline gap-x-3`: h3 Sentient 700 24/32 ink-900; price `text-lg font-bold tracking-[-0.02em] text-primary-700` (18/28, ls −.36px, #0069a8).
  - p `mt-2 max-w-md text-base text-ink-600`.
  - Proofs `ul.mt-4.flex.flex-wrap.items-center.gap-x-3.gap-y-1.5`: items 16/24 ink-600, separated by `li.text-ink-400` "·".
  - Button wrapper `mt-auto flex flex-wrap items-center gap-2 pt-8`; button md solid "Talk to sales" (137×44) with `hover:-translate-y-0.5`.
  - Embed: "Embed" / "From $36k a year" / "Put a flow builder, AI agents and 760+ integrations inside your own product, under your own brand." / White-label builder · One SDK · Your pieces and templates / `/sales?ap_cta=pricing_embed_band`.
  - Enterprise: "Enterprise control" / "Custom" / "Run Activepieces on your own servers, or fully air-gapped, on your security team's terms." / SSO and SCIM · Custom RBAC · Audit logs · Secret managers / `/sales?ap_cta=pricing_enterprise_band`.
- Logos: `div.mt-10` > `RotatingLogos` (§1.4). Section A then ends; there is no bottom padding.

### 3.B Compare (`section#compare`)
- Section: `mx-auto w-full max-w-7xl px-5 py-24 md:px-6 md:py-32 lg:px-8` > `flex flex-col gap-5 md:gap-8`.
- H2 (wrapper `flex flex-col gap-4 pt-1`): `max-w-4xl font-display text-3xl md:text-4xl font-bold text-balance text-ink-900` (36/40; 30/36 at 390).
- **Desktop (≥1024) `div.hidden.lg:block` > `table.w-full.table-fixed.border-separate.border-spacing-0`**:
  - `thead.sticky.top-16.z-20.bg-white` (sticks at 64px under the header).
    - First th `w-[24%] pt-7 pr-5 pb-7 text-left align-top` (292 wide), containing "Features" in Sentient 700 24/32 ink-950.
    - Four plan th `px-4 pt-7 pb-7 text-center align-bottom last:pr-0` (231 wide). Each holds `flex flex-col items-center gap-2.5`: the plan name (Sentient 700 24/32 ink-950), then ui-button **sm secondary** full width (199×36; Ultimate 215). Labels "Get started" → `https://cloud.activepieces.com/sign-up`, and Ultimate "Talk to sales" → `/sales`.
    - Then a separator row: `td.h-px.bg-ink-950/10` (1px) spanning the columns.
  - Group rows: `td.pt-12.pr-5.pb-5.text-left.align-bottom` (the first group uses `pt-7`), containing `span.text-lg.font-semibold.text-ink-950` (18/28). The 4 value cells are empty. Row height 96 (76 for the first).
  - Feature rows: label `td.py-4.pr-5.align-middle.text-base.text-ink-900`, optionally an InfoTip. Value cells `td.px-4.py-4.text-center.align-middle.last:pr-0`.
    - Text: `span.text-base.text-ink-900`.
    - Check: `span.inline-flex.size-7.items-center.justify-center.rounded-md.bg-ink-200.text-ink-900` (28×28, r 6, #e2e8f0) with a 16px `check-read-linear`.
    - Dash: `span.text-base.text-ink-500` "—".
    - Row height 56 for text rows and 60 for check rows. There are **no row borders**.
  - The "Price" label has `span.mt-0.5.block.text-sm.text-ink-600` "Billed monthly" or "Billed annually", following the toggle. The price row shows `$0 · $20/mo|$16/mo · $200/mo|$166/mo · Talk to us`.
- Matrix (✓ = check badge, — = dash, [tip] = InfoTip):

  | feature | Free | Plus | Team | Ultimate |
  |---|---|---|---|---|
  | **Pricing** | | | | |
  | Price (Billed monthly/annually) | $0 | $20/mo | $200/mo | Talk to us |
  | Hosting | Cloud or on-prem | Cloud or on-prem | Cloud or on-prem | Cloud or on-prem |
  | How to buy | Self-serve | Self-serve | Self-serve | Sales |
  | **Credits** | | | | |
  | Credits included [tip] | 1,000 a month | 10,000 a month | 50,000 a month | Sized with you |
  | Credit reset [tip] | Daily | Monthly | Monthly | Yearly |
  | Going over [tip] | Waits for tomorrow | $0.007/credit | $0.007/credit | Volume rates |
  | **Limits** | | | | |
  | Users [tip] | Up to 5 | Up to 5 | 25 users | Unlimited |
  | Flows | Unlimited | Unlimited | Unlimited | Unlimited |
  | **Products** | | | | |
  | Flows / Agents and Chat / Tables / MCPs | ✓ | ✓ | ✓ | ✓ |
  | Projects | — | — | Unlimited | Unlimited |
  | **Capabilities** | | | | |
  | Bring your own AI keys [tip] | — | ✓ | ✓ | ✓ |
  | Global connections [tip] | — | — | ✓ | ✓ |
  | Team analytics | ✓ | ✓ | ✓ | ✓ |
  | API and SDK [tip] | ✓ | ✓ | ✓ | ✓ |
  | Releases and Git Sync | — | — | — | ✓ |
  | Priority execution [tip] | — | — | — | ✓ |
  | Per-project execution priority | — | — | — | ✓ |
  | **Governance** | | | | |
  | SSO / Standard roles | — | — | ✓ | ✓ |
  | SCIM / Custom RBAC / Secret managers / Audit logs / Event streaming / Private pieces / Credit usage by project [tip] / Branding [tip] / Platform governance / Custom terms and invoicing | — | — | — | ✓ |
  | **Support** | | | | |
  | Support by humans | Community | Community | Email | Dedicated |
  | AI support [tip] | ✓ | ✓ | ✓ | ✓ |

- **Mobile/tablet (<1024) `div.lg:hidden`**:
  - Plan tabs: `mb-5 flex gap-2 overflow-x-auto rounded-full border border-ink-950/10 bg-white p-1` (350×54).
    - Buttons `flex-1 shrink-0 cursor-pointer rounded-full px-4 py-2.5 text-base font-semibold whitespace-nowrap transition-colors` (150ms). Active: `bg-ink-950 text-white`. Inactive: `text-ink-600 hover:text-ink-950`.
    - **Default selected tab: Plus.**
  - Card `rounded-2xl bg-white p-6 shadow-edge`.
    - Head `flex items-baseline justify-between gap-4`: plan name in Sentient 700 24/32 ink-950; price `mt-1 text-base text-ink-600` with `$20/mo`. Then a sm secondary button "Get started".
    - Groups `mt-8 flex flex-col gap-8`. Each is a p `text-lg font-semibold text-ink-950` and a `ul.mt-3.flex.flex-col.divide-y.divide-ink-950/10`. Rows are `flex items-center justify-between gap-4 py-3.5` (53 tall): the label (16/24 ink-900) and a right value (`shrink-0 text-right`; text values `text-base font-medium text-ink-900`, check and dash as on desktop).

### 3.C FAQ "Pricing questions." (Faq component; first item open)
1. Is the free plan really free? → Yes. No card, no time limit. It is meant for exploring the product and building lightweight automations. You get a fresh 1,000 credits every month, so if you use them all, you wait until the next month.
2. What happens when I run out of credits? → Depends on your plan. On Free, your flows stay switched on but any runs past your quota do not go through until credits refresh the next day. On Plus and Team they keep running and you pay for the extra at $0.007 per credit. Ultimate has a yearly pool, so one heavy month is fine.
3. Why do AI steps cost more than one credit? → A run is one credit however many steps it has, and AI is the exception that sits on top, because we are paying the model provider on your behalf. A step on a fast model is 2 credits, a smart model is 10, and a frontier model is 20. Agentic actions are 1 credit each. On Plus and up you can connect your own AI provider keys, which drops every AI step to 1 credit and moves the model cost to your provider bill instead of ours.
4. Can I cancel, change plans, or add seats anytime? → Yes. Upgrades and added seats take effect immediately and are prorated. Downgrades apply at the end of the billing period so you keep what you paid for.
5. What payment methods do you accept? → All major cards on any plan. Team and Ultimate can pay by ACH or wire, and Ultimate can be invoiced with custom terms.
6. Why would I pay if I can self-host for free? → Self-hosting decides where Activepieces runs, not what it can do. Community Edition is the automation core on its own. Paying adds the layer you need once more than a couple of people depend on it: controlling who has access, seeing who changed what, keeping teams and clients separate, shipping changes safely, and running Agents and Chat. It also puts our team on the other end instead of a forum.
7. What if my tool is not supported? → You are not stuck. Anything with an API works right away through the HTTP piece or a webhook. For a proper integration, pieces are open source TypeScript, so you or we can build one.
8. Is my data secure? → Data is encrypted in transit and at rest, and you choose where it lives: our EU cloud in Frankfurt, another region on request, or your own servers. Ultimate adds SCIM, custom roles, audit logs streamed to your SIEM, and your own secret manager. Our SOC 2 program is in progress, so we will not claim a certification we do not hold yet. Ask us and we will send the penetration test summary, our DPA and the current sub-processor list.

### 3.D Tooltip texts
**Plan card tooltips:**
- 1,000 credits a month: A fresh 1,000 credits every month, so there is always room to build and test. One credit runs a whole flow.
- Unlimited flows: Build as many automations as you want. We never cap the number of flows.
- Up to 5 users: Invite up to five teammates to build and run automations together.
- Chat to automation: Chat with your tools and turn the boring work into automations. Still rolling out, so chat may not be on your account yet.
- Flows, Agents, Tables: Build visual Flows, add Agents and Chat, and keep your data in Tables.
- MCPs and API access: Serve your tools to any AI assistant over MCP, and manage Activepieces from your own code over the API.
- 10× the Free plan: 10,000 credits a month, ten times what the Free plan gets.
- Then pay as you go: Keep running past your allowance at $0.007 per credit. Nothing switches off.
- Bring your own AI keys (card): Connect your own AI provider keys and every AI step costs 1 credit. The model cost goes to your AI provider, not to your credits.
- 5× the Plus plan: 50,000 credits a month, then $0.007 per extra credit.
- Unlimited projects: Projects start on Team: separate workspaces for teams, clients, or environments, and you can create as many as you need.
- 25 users included: The price is flat, not per seat: twenty-five people for one price.
- SSO and standard roles: Single sign-on plus built-in roles to control who can do what.
- Global connections: Shared service-account connections available to every project.
- Email support: Reach our team by email whenever you need a hand.
- Credits sized to you, yearly: Your allowance runs across the whole year, so a heavy month is covered by a quiet month, and we size the volume to how you run.
- Dedicated workers: Your own isolated workers on cloud, not shared with anyone else.
- Execution priority: Set execution priority per project, so the flows that matter run first.
- SCIM and custom roles: Provision users automatically and define exactly what each role is allowed to do.
- Releases and Git Sync: Promote changes across environments and keep every flow versioned in your own Git repo.
- Audit logs and secrets: Track every action, connect your own secret manager, and govern the whole platform centrally.
- Dedicated support: A dedicated contact and priority help from our team.

**Compare table tooltips:**
- Credits included: Credits power runs, tool calls, and AI, never the connectors you use. A fifty-step flow costs the same as a two-step flow.
- Credit reset: How often your allowance refreshes. A yearly pool absorbs uneven months instead of capping you in a busy month.
- Going over: On Free your flows wait for tomorrow’s credits. On Plus and Team your flows keep running and you pay the per-credit rate.
- Users: We never bill per seat. Team covers 25 people at one flat price.
- Bring your own AI keys (table): Run AI steps on your own provider keys at 1 credit each. The model cost goes to your AI provider, not to your credits.
- Global connections: Shared service-account connections available to every project.
- API and SDK: Manage Activepieces from your own code. The API is not needed to trigger a flow, a webhook trigger does that on any plan.
- Priority execution: Dedicated workers on cloud for faster, isolated execution.
- Credit usage by project: See credit spend broken down by project. Auto recharge takes a monthly limit, but per-project ceilings are not available yet.
- Branding: Put your own logo, colors, and domain on the platform, so Activepieces looks like an internal tool your organization built.
- AI support: An AI agent that answers product questions in the app. You can turn the agent off.

---

## 4. /security

Doc height 6558 at 1440, 8438 at 768, 10434 at 390. The page JS is `specs/ref/js/security.G6mAqp3Z.js` and the CSS is `specs/ref/css/security.D2D4B2fx.css`.

| # | section | 1440 y/h | 768 y/h | 390 y/h |
|---|---|---|---|---|
| A | Dark hero with cipher-wall canvas and facts | 0 / 1099 | 0 / 1401 | 0 / 1713 |
| B | Feature rows plus sticky stage (scrollytelling) | 1099 / 2416 | 1401 / 3248 | 1713 / 3316 |
| C | IconBand "Adopt with confidence" (gradient) | 3515 / 1180 | 4649 / 1690 | 5029 / 2488 |
| D | FAQ "Where a review usually starts" | 4695 / 888 | 6339 / 888 | 7517 / 1056 |

### 4.A Hero (`section.relative.isolate.overflow-hidden.bg-primary-950`, #052f4a)
- Canvas layer: `div.wall.pointer-events-none.absolute.inset-0` > `canvas.size-full` (the **cipher-wall**, §4.E).
  ```css
  .wall{mask-image:linear-gradient(#0000 0,#000 16% 62%,#0000 88%)}
  @media (min-width:1024px){.wall{mask-image:linear-gradient(90deg,#0000000f 0,#0000004d 32%,#000 56%),linear-gradient(#0000 0,#000 16% 86%,#0000);mask-composite:intersect;-webkit-mask-composite:source-in}}
  ```
- Container (the "frame"): `relative mx-auto w-full max-w-7xl px-5 pt-28 pb-24 md:px-8 md:pt-32 md:pb-32 lg:px-12`. Content is x=128 to 1312 at 1440.
- Grid `grid items-center gap-12 lg:grid-cols-12 lg:gap-20`:
  - Copy `lg:col-span-6` (552 wide):
    - H1 "Serious security for serious agents.": `max-w-xl font-display text-4xl sm:text-5xl md:text-6xl md:leading-display font-bold text-balance text-white`. 60px / 60.9px at ≥768 (2 lines, 122 tall); 36/40 at 390.
    - p `mt-4 max-w-xl text-xl text-pretty text-ink-300` (20/28 #cad5e2): "An agent can work in production without ever holding a credential. Everything it does is on the record, and the whole platform can run inside your own network."
    - Actions `mt-8 flex flex-wrap items-center gap-3`:
      - lg **light** "Open the trust center" plus a 16px `solar:arrow-right-up-linear` → `https://trust.activepieces.com` (243×48).
      - lg **quiet-light** "Read the source" → GitHub (180×48), with `max-sm:w-full max-sm:justify-start max-sm:px-0`.
  - Lock target `div.h-80.sm:h-112.lg:col-span-6.lg:col-start-7.lg:h-144.lg:translate-x-8.lg:-translate-y-8`. This is an empty box (552×576 at 1440; 350×320 at 390) that the canvas uses to position the 3D ASCII lock.
- Facts `dl.mt-12.md:mt-16.grid.w-full.grid-cols-1.gap-10.border-t.border-white/15.pt-12.sm:grid-cols-2.md:grid-cols-4.md:gap-0.md:divide-x.md:divide-white/15` (1184×203 at 1440).
  - Each item `flex flex-col md:px-8 md:first:pl-0 md:last:pr-0` contains:
    - icon `mb-5 size-12 text-primary-200` (#b8e6fe, 48px)
    - dt Sentient 700 24/32 white
    - dd `mt-1.5 text-base text-pretty text-ink-300`
  - Items:
    - globe-linear: EU hosted / Our cloud runs in Frankfurt by default
    - verified-check-linear: SOC 2 Type 2 / Independently audited and penetration tested
    - incognito-linear: AES-256 encrypted / Encryption in transit and at rest, everywhere
    - brain-linear: No model training / Your runs and documents are never training data

### 4.B Feature rows (`feature-rows`)
- Section `relative isolate px-5 py-24 md:px-6 md:py-32 lg:px-8`.
  - Background: **glyph-field** canvas (`-z-10`, tint ink, fade `section`), see §4.E. Its mask is `.section{mask-image:linear-gradient(#0000 0,#000 7% 74%,#0000)}`.
- Frame `mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-start lg:gap-16`.
- Left `ul.flex.w-full.flex-col.gap-20.lg:w-[45%].lg:gap-0` (547 wide at 1440). Each `li.flex.flex-col.justify-center.lg:min-h-[80vh]` is 720 tall at 900 viewport and contains a div:
  - h2 `font-display text-3xl md:text-4xl font-bold text-balance text-ink-900` (36/40)
  - `ul.mt-8.flex.flex-col.gap-7` of points: li `flex items-start gap-3`, icon `mt-0.5 size-6 text-ink-900`, then `span.flex.flex-col.gap-1` (title 18/28 600 ink-900; body 16/24 ink-600 pretty).
  - Below lg only, the row's own stage follows inline: `SecurityStage` with `mt-8 lg:hidden`.
- Right (lg only): `div.hidden.lg:sticky.lg:top-24.lg:block.lg:w-[55%]` (669 wide, sticks at 96px) > one `SecurityStage` whose tone and visual follow the active row.
  - Active row: an IntersectionObserver on each li with `rootMargin:'-45% 0px -45% 0px'`; the intersecting li's index becomes active.
  - Visual swap is a Vue transition keyed by index:
    - enter `transition duration-500 ease-smooth`, from `translate-y-2 scale-[0.995] opacity-0`
    - leave `absolute inset-0 flex items-center justify-center transition duration-500 ease-smooth`, to `-translate-y-1 scale-[0.995] opacity-0`
  - The stage bg changes via `transition-colors duration-500 ease-smooth`. A gradient can't transition, so it snaps.
- **SecurityStage** = `{tone} relative isolate flex items-center justify-center overflow-hidden rounded-4xl px-6 py-14 md:px-12 md:py-20 shadow-edge` (669×544 at 1440). Layers in order:
  1. glyph-field canvas, tint light (`text-white`), fade `panel`: `.panel{mask-image:radial-gradient(68% 60%,#0000 0 52%,#000 96%)}`.
  2. `div.pointer-events-none.absolute.inset-0` with `radial-gradient(at 50% 34%, rgba(255,255,255,.16) 0%, rgba(255,255,255,.06) 50%, transparent 72%)`.
  3. `div.pointer-events-none.absolute.-right-16.-bottom-20.size-72.rounded-full.bg-white/10.blur-3xl` (288px, blur 64px).
  4. Slot `relative flex h-96 w-full max-w-[26rem] items-center justify-center` (416×384).
- Rows (tone → visual):
  1. **Choose where it runs**, tone `bg-linear-to-b from-accent-a-950 to-primary-950` (#002c22 → #052f4a). Points:
     - globe-linear: Our cloud, hosted in the EU / Frankfurt by default, other regions on request. Each project keeps its own automations, connections and history.
     - server-linear: Or inside your own network / The same enterprise build, in whatever region your policy asks for, on hardware nobody else shares.
     - plug-circle-linear: Or air-gapped, with no internet / Nothing reaches out of your network, and the model answering your agents runs on your own machines.

     Visual **deployment**: `rounded-2xl bg-white p-6 shadow-lift` (416×340).
     - Segmented control `flex gap-1 rounded-xl bg-ink-100 p-1` with 3 spans `flex-1 rounded-lg py-2 text-center text-[13px]`: Our cloud / **Your infra** (`bg-white text-ink-900 ring-1 ring-ink-950/10`) / Air-gapped (`text-ink-500`).
     - Row `mt-6 flex items-center gap-3.5`: icon tile `grid size-11 place-items-center rounded-xl bg-primary-700/[0.08]` with `server-linear size-5 text-primary-800`; then "Your own cluster" (20/30 600 ink-950) and "Hardware nobody else shares" (13/19.5 ink-500).
     - Grid `mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-ink-950/10`. Cells `flex flex-col gap-1 bg-white p-4` with a label (12/18 ink-500) and a value (14/21 ink-900): Tenancy/Single tenant, Build/Enterprise, Region/Yours to pick, Model/Ours or yours.
  2. **No one can read a credential**, tone `from-accent-d-950 to-primary-950` (#2f0d68 → #052f4a). Points:
     - lock-keyhole-linear: Never shown again after saving / Not through the API, not in the builder, not in an export. The worker unlocks the secret only while a step runs.
     - brain-linear: Agents never see the secret / An agent picks a connection by name, so the secret behind it never reaches a prompt or a model.
     - key-minimalistic-square-linear: Or store them in your own vault / Vault, AWS Secrets Manager, CyberArk Conjur and 1Password can pass the value in at run time, so we never store it.

     Visual **credential**: `overflow-hidden rounded-2xl bg-white shadow-lift`.
     - Row `flex items-center gap-2.5 px-6 py-5`: "GET" (mono 12 ink-500); "/v1/connections/conn_9fa2" (mono 13 ink-900 truncate); right side a `size-1.5 rounded-full bg-accent-a-500` dot and "200" (mono 13 ink-700).
     - Code block `border-t border-ink-950/10 bg-ink-50/60 px-6 py-5 font-mono text-[13px] leading-7 whitespace-pre`:
       ```
       {
         "piece": "salesforce",
         "displayName": "Salesforce prod",
         "status": "ACTIVE",
         "value": "[encrypted]"
       }
       ```
       Keys use code-fn, strings code-str, and "[encrypted]" code-dim.
     - Footer `flex items-center gap-3 border-t border-ink-950/10 px-6 py-5`: `key-minimalistic-square-linear size-4 text-ink-400` and "Opened in the worker while the step runs" (13 ink-700).
  3. **Runs are isolated and audited**, tone `from-accent-b-950 to-primary-950` (#461901 → #052f4a). Points:
     - shield-keyhole-linear: Each run gets its own sandbox / Hardened mode runs the engine in an isolate, with a filesystem view and caches of its own.
     - global-linear: You decide what a run can reach / The engine checks every outbound request, and your network boundary decides what actually leaves.
     - user-check-linear: Big actions wait for approval / An agent reaches only the tools you gave it, and every action it takes is recorded as it happens.

     Visual **isolation**: `relative w-full`.
     - Card `rounded-2xl bg-white shadow-lift`:
       - Head `flex flex-col gap-3 px-5 py-5`: a `flex items-center gap-2 text-[12px] text-ink-500` row (`shield-keyhole-linear size-3.5`, "Isolate, with its own filesystem view"); "create_invoice" (mono 20 600 ink-950); "The agent asked to write to Xero. It named a connection, and never saw inside it." (13 ink-600).
       - Footer `flex items-center gap-3 border-t border-ink-950/10 px-5 py-4`:
         - "Approve": `rounded-lg bg-ink-900 px-4 py-2.5 text-[14px] font-medium text-white`
         - "Decline": `rounded-lg border border-ink-950/15 px-4 py-2.5 text-[14px] text-ink-700`
         - "In the audit trail": `ml-auto text-[12px] text-ink-500`
     - Floating card `absolute right-3 -bottom-9 md:-right-5 md:-bottom-10 w-56 rounded-xl bg-white p-3.5 shadow-lift`: "Egress at your boundary" (12 ink-500), then `mt-2.5 flex flex-col gap-2` rows (`size-1.5` dot, mono 13 ink-900 target, `ml-auto` 12 ink-500 state):
       - api.stripe.com / Allowed (dot accent-a-500)
       - 10.0.4.19:5432 / Blocked (dot ink-300)

### 4.C IconBand "Adopt with confidence" (background gradient). Cards:
- clock-circle-bold: What we keep / Your automations, runs, files, documents and connections, kept only as long as you choose.
- lock-keyhole-bold: Always encrypted / AES-256 on disk and TLS on the wire, with every credential encrypted as its own value.
- brain-bold: Never training data / Your automations, runs, documents and prompts never train a model, ours or anyone else's.
- checklist-bold: A full audit trail / Every action is recorded, by a person or a model, and the trail can stream to your SIEM.
- export-bold: Export it all / Automations are plain JSON and export through the API, with your tables, files and runs.
- verified-check-bold: Outside auditors / SOC 2 Type 2 and a penetration test from early 2026, with the reports in the [trust center](https://trust.activepieces.com).

### 4.D FAQ "Where a review usually starts"
1. Which regions can it run in? → Our cloud runs in Frankfurt by default, and we can host elsewhere if your policy needs it, so ask. Self-hosted, the same enterprise build runs on your own infrastructure in any region you choose, on hardware nobody else shares.
2. Can it run with no outbound internet? → Yes. An air-gapped deployment keeps everything inside your network and runs your own model on your own hardware. Short of that, inference can point at any OpenAI-compatible endpoint you operate.
3. Can an agent or a builder read a credential? → No. An agent references a connection by name and the platform resolves it inside the worker as the step runs. The value is never returned by the API, never shown back in the interface, and never included in an export.
4. Do you train models on our data? → No. Your automations, runs, documents and prompts are never training data. Model input and output are stored in run history like any other step, under the retention window you set.
5. Will you complete our security questionnaire? → Yes. Questionnaires and vendor reviews go through our team. The current SOC 2 Type 2 documents are in the trust center if that answers the question sooner.
6. What happens to our data if we leave? → Automations are plain JSON and export through the API, along with your tables, files and run history. The core is MIT licensed, so you can keep running the same automations on your own infrastructure.

### 4.E Canvas art (port from `specs/ref/js/security.G6mAqp3Z.js`; do not re-derive)
These are 2D-canvas ASCII renderings. Their pixels can't be read as computed styles, so the source code is the spec. Key constants:

- **glyph-field** (static, redrawn on resize and fonts.ready):
  - Canvas DPR is `clamp(.75, min(dpr,2), sqrt(6e6/(w*h)))`.
  - Font `${w<768?14:18}px "Fira Code"`. Cell width is `measureText('0')`; line height is `max(10, round(fs*1.06))`.
  - Charset `0123456789abcdef+/=%&$*`.
  - Columns align to the `frame` element's left edge.
  - Characters fade in with distance from "shield" elements (the copy blocks): radius `w<768 ? 68 : 130` px, smoothstep. Every (r*31+c*17)%9<2 cell gets full weight, the others 0.55. Cells below 0.02 are skipped.
  - 5 alpha layers: alpha = base × (i+1)/5, with base .055 for ink and .15 for light.
  - Color is the canvas's CSS `color` (ink-950 or white).
- **cipher-wall** (hero, animated):
  - Same grid metrics.
  - Shield = H1, lede, actions and facts. Glyphs near the copy dim, with a 110px falloff to a floor of .3.
  - A pre-tessellated 3D padlock is projected into the `lockEl` box, shaded with a `,:;+*ox%#@` ramp and an ordered-dither matrix. It rotates: yaw = .72 + t·4e-4, pitch = sin(t·2.3e-4)·.19.
  - The frame is throttled to **50ms**. Each frame re-randomises 0.7% of the background glyphs.
  - Every 5200ms, random security phrases (the `f` list in the source, plus "760+ integrations, MIT licensed") are written into odd rows, outside the lock's bounding box.
  - Pointer proximity (radius 190, eased .14 per frame) reveals those phrases around the cursor.
  - Pauses when off-screen (IntersectionObserver threshold .01) or when the tab is hidden; disabled under reduced motion.
- **Acceptable fallback** if the port is out of scope: render the hero wall as a static, randomly filled glyph grid, using the same font, alpha layers and mask. Leave the lock out. Flag this to the coordinator.

---

## 5. /ai-governance

Doc height 12363 at 1440, 10622 at 768, 12972 at 390. JS is in `specs/ref/js/ai-governance.BuUrctv7.js` and CSS in `specs/ref/css/ai-governance.COB1_X73.css`.

| # | section | 1440 y/h | 768 y/h | 390 y/h |
|---|---|---|---|---|
| A | Governance hero: image card, platform shot, sticky logo bar | 0 / 1308 | 0 / 1064 | 0 / 954 |
| B | Models grid: scroll-scrubbed tier cards and model tiles (pinned only at ≥1280w and ≥768h) | 1308 / 3060 (incl. mb-32) | 1064 / 1199 | 954 / 1570 |
| C | Case study Alan (shared) | 4496 / 745 | 2263 / 701 | 2524 / 903 |
| D | Rollout deck "Start with one team. Roll out to the entire organization." | 5242 / 3688 | 2963 / 3038 | 3427 / 3102 |
| E | IconBand "Ship with confidence" (solid) | 8930 / 1570 | 6001 / 2522 | 6529 / 3526 |
| F | FAQ "What your security team will ask" | 10500 / 888 | 8523 / 888 | 10055 / 1116 |

### 5.A Governance hero
- Wrapper `pb-16 md:pb-20 [--gut:.75rem] md:[--gut:1.25rem] lg:[--gut:1.75rem]`.
- Card wrapper `px-[var(--gut)] pt-chrome pb-[var(--gut)]` (pt 84).
- Card `relative isolate aspect-[3/2] max-h-[calc(100svh-var(--spacing-chrome)-var(--gut))] min-h-[32rem] sm:min-h-[36rem] w-full overflow-hidden rounded-3xl bg-white`. Measured 1384×788 at (28,84) at 1440; 728×576 at 768; 366×512 at 390.
  - Image `/gov-hero/green-1600.webp` with srcset 1600/2400/3200w (all downloaded), `sizes="100vw"`, width/height 5056×3371, classes `absolute inset-0 size-full object-cover object-[50%_40%]`, fetchpriority high.
  - Content `relative pt-16 sm:pt-20 lg:pt-24` > `section.mx-auto.flex.w-full.max-w-5xl.flex-col.items-center.gap-3.px-5.md:px-6.lg:px-8.text-center`:
    - H1 "Move fast, break nothing.": `font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-950` (#052f4a; 60/60).
    - p `max-w-3xl text-lg md:text-xl text-ink-700` (20/28 #314158): "Decide who can build, what they can reach, and what it costs. Every action is recorded. On our EU cloud, or entirely inside your own network."
  - Button row `mt-5 flex justify-center`: lg **brand** "Talk to sales" → `/sales` (151×48).
- **Platform shot**: `px-5 md:px-6 lg:px-8` > `mx-auto flow-root max-w-7xl` > plate `relative aspect-video w-full overflow-hidden rounded-2xl bg-white shadow-lift select-none` (inert, role img).
  - Inline `margin-top: -Dpx`, where `D = max(0, (cardWrap.bottom − heroTop) − (button.bottom − heroTop + button.marginTop))`. The shot's top lines up with the button's top margin edge. Measured D = 504 at 1440; shot top 396, i.e. 20px below the button bottom.
  - Inner `absolute top-0 left-0 h-[720px] w-[1280px] origin-top-left` with `transform: scale(plateWidth/1280)` from a ResizeObserver: 1 at 1440, .5625 at 768, .2734 at 390.
  - Mock content is a 1280×720 "Platform" admin screen; exact markup is in the SSR HTML (search "New project").
    - Left rail `w-[76px] border-r border-ink-950/10 bg-ink-50`: the mark (mask `/brand/activepieces-mark.svg`, `h-7 aspect-[326/297] bg-ink-900`) and 10 icon buttons `size-11 rounded-xl`, 22px icons ink-400. The 6th (folder-linear) is active: `bg-white text-ink-900 shadow-sm ring-1 ring-ink-950/6`. A `my-3 h-px w-8 bg-ink-950/10` divider follows the 5th.
    - Header: "Platform" (Inter 600 38px/1 tracking-tight ink-950); a filter button `size-11 rounded-xl border border-ink-200`; "New project" `h-11 rounded-xl bg-ink-900 px-6 text-[15px] font-medium text-white`.
    - Stats: Projects 18 · People 148 · Connections 312. Labels 15px 500 uppercase tracking-wide ink-400; values 58px/1 600 tracking-tight.
    - Table `grid-cols-[420px_200px_220px_220px]`: header 14px 500 uppercase ink-400. Rows `border-t border-ink-950/8 py-[22px]`, 19px.
      - Avatars `/avatars/projects/<seed>.svg` (`size-11 rounded-xl bg-ink-100`, downloaded).
      - Rows: Growth 14/31/22 · Revenue Ops 9/18/17 · Billing 6/44/29 · Support 21/27/35 · Data Platform 11/61/48 · People Ops 5/12/9.
- **Sticky logo bar**: `sticky bottom-0 z-10 mt-8 border-t bg-white py-5 transition-colors duration-200 ease-out`.
  - Border is `border-ink-950/10` while the sentinel `div.h-px` (right after it, at the end of the hero wrapper) is **not** intersecting, and `border-transparent` once it is. In other words, the bar is pinned to the viewport bottom over the hero and gets a hairline top border while pinned.
  - Inner `px-5 md:px-6 lg:px-8` > `mx-auto max-w-7xl` > `RotatingLogos` (§1.4). Bar height 79 at 1440, 150 at 768, 220 at 390.

### 5.B Models grid (`models-grid`)
- **Active only when** `(min-width:80rem) and (min-height:48rem)` and motion is not reduced. Otherwise it renders as a static grid (below).
- **Pinned mode**:
  - Section `relative mb-24 md:mb-32`, inline `height: calc(100vh + innerHeight*2.4 px)`. 3060 at 900 viewport.
  - Child `px-5 md:px-6 lg:px-8 sticky top-0 flex h-screen items-center justify-center pt-16`.
  - `.frame{display:grid;gap:1.25rem;aspect-ratio:1.874;width:min(100%,80rem,157.416vh);grid-template-rows:minmax(0,1fr) minmax(0,.99fr) minmax(0,1fr)}`. Measured 1280×683.
  - Rows: `ul.tier` (3 cols) · `div.band` · `ul.tier` (3 cols).
  - Progress `x = clamp(-section.top / (section.offsetHeight − innerHeight), 0, 1)`, updated on scroll via rAF.
  - Easing `w(e)`: solve the cubic-bezier x(n) with control points (.85, .15), Newton, 6 iterations, then apply smoothstep `3n²−2n³`.
  - Cards (index k = 0..5): `t = w(clamp((x − (.42 + k*.07)) / .09))`, giving `opacity:t; transform: translateY((1−t)*1.25rem) scale(.96 + t*.04)`. Sampled: k0 starts at x≈.42 and is done by .51; k5 is done by ≈.86.
  - Tiles (8): `n = 1 − w(clamp(x/.4))`. Each tile is placed at `left:${7.38 + i*12.177}%; top:50%; transform: translate(-50%,-50%) translate(${dx*n}%, ${dy*n}%) rotate(${spin*n}deg)`. They settle into a row by x = .4.
  - The two `.mark` layers have opacity `1−w(clamp(x/.4))` (the second is ×.7 with `blur-lg`).
  - Tile data (logo, dx, dy, spin):

    | logo | dx | dy | spin |
    |---|---|---|---|
    | anthropic-claude | 140 | −150 | −12 |
    | openai | −110 | 165 | 10 |
    | google-gemini | 90 | −175 | 14 |
    | aws-bedrock | −130 | 140 | −16 |
    | azure-openai | 120 | 170 | 8 |
    | mistral-ai | −95 | −160 | −10 |
    | openrouter | 105 | 155 | 15 |
    | cloudflare (alt "Cloudflare AI Gateway") | −125 | −145 | −14 |

    Images: `/logos/pieces/<logo>.svg` at `size-[46%]`. cloudflare and openrouter were downloaded.
- Card: `card flex size-full flex-col justify-end rounded-3xl bg-white shadow-edge`. Container query on its `li`:
  ```css
  .card{gap:clamp(.5rem,2cqw,.75rem);padding:clamp(1.25rem,5.5cqw,1.75rem)}
  .glyph{width:clamp(1.75rem,9.5cqw,2.375rem);height:same}
  .term{letter-spacing:-.01em;font-size:clamp(1.125rem,5.9cqw,1.3125rem);line-height:1.25}
  .benefit{font-size:clamp(.9375rem,4.9cqw,1rem);line-height:1.45}
  .statement{letter-spacing:-.015em;font-size:clamp(1.25rem,6.6cqw,1.5rem);line-height:1.2}
  .brandmark{width:clamp(2rem,10cqw,2.75rem)}
  ```
  - Glyph `mb-auto text-ink-900` (bold icon); h3 `.term` Sentient 700 ink-900; p `.benefit` ink-600. Measured 21/26.25 and 16/23.2 at 1440.
  - Copy:
    - cpu-bolt-bold: Use the models you pay for / Add your OpenAI, Anthropic or Bedrock key once, then choose the models each team uses.
    - plug-circle-bold: Grant one action, not the app / You pick the exact actions an agent can call, and lock the inputs it must not change.
    - verified-check-bold: Choose which steps need a yes / Mark the steps that need sign-off. The agent runs everything else without pausing.
    - chart-2-bold: See what each team spends / Every run is priced by the model used, so AI cost lands on the project that spent the money.
    - list-bold: Read back what an agent did / Every prompt, tool call and payload is saved, so an auditor reads what really happened.
  - The 6th card is `justify-between rounded-3xl bg-primary-950` (no shadow): a white `.brandmark` (mask activepieces-mark, aspect 326/297), then the `.statement` "The enterprise AI ecosystem, for all of your agents." (Sentient 700 24/28.8 white).
- Band:
  - `.shell{border-radius:24px;background:linear-gradient(180deg,ink-600,ink-800);padding:clamp(.5rem,3cqw,.875rem)}`
  - `.panel{border-radius:12px;background:radial-gradient(90% 150% at 50% 0,color-mix(in oklab,primary-500,transparent 72%),transparent 68%),linear-gradient(180deg,ink-800,ink-950)}`, plus `::before` with a 22px grid: `linear-gradient(90deg,#ffffff0f 1px,#0000 0),linear-gradient(#ffffff0f 1px,#0000 0)`.
  - `.mark{background-color:#ffffff8c;mask:url(/brand/activepieces-mark.svg) 50%/auto 55% no-repeat}`
  - `.rail{position:absolute;inset:0}`
  - `.tile{aspect-ratio:1;background:ink-50;border-radius:22%;display:grid;place-items:center;box-shadow:0 3px 6px -2px color-mix(in oklab,primary-950,transparent 72%),inset 0 0 0 1px ink-200}` with `.rail .tile{width:9.58%}`.
- **Static mode** (<1280 or <768 tall; measured at 768 and 390):
  - Section `py-24 md:py-32`, content `mx-auto flex max-w-7xl flex-col gap-4 md:gap-5`.
  - Tiers `grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3`. Cards are fully visible, 185 tall (163 for the statement card), 350 wide at 768.
  - Tiles go into `.reflow{display:grid;grid-template-columns:repeat(4,1fr);place-items:center;gap:.75rem;padding:clamp(1rem,4%,1.5rem)}`, 8 columns at ≥640, with `.reflow .tile{width:100%;max-width:4.5rem}`.

### 5.C Case study Alan
The shared component (§1.2).

### 5.D Rollout deck (`governance-stages`)
- Section `relative isolate px-5 py-24 md:px-8 md:py-32 lg:px-12`, with a `.ground` (ink-100, 1px ink-200 border, **border-bottom 0**, faded mask as in §1.3 `.is-faded`, no radius).
- H2 `mx-auto max-w-2xl text-center font-display text-3xl md:text-5xl font-bold text-balance text-ink-900` (672×144 at 1440, 3 lines).
- `div.wrap.mt-12` (+ `.is-pinned` at ≥1024 without reduced motion), with style `--n:4`.
- CSS at ≥1024:
  ```css
  .wrap{--nav:var(--spacing-chrome);--deck:min(40.5rem,74vh)}
  .is-pinned{height:calc(var(--n)*90vh)}              /* 3240 at 900 */
  .is-pinned .pin{position:sticky;top:calc(var(--nav) + (100vh - var(--nav) - var(--deck))/2)}  /* 168px */
  .deck{display:flex;flex-direction:row;gap:1rem;height:var(--deck)}  /* 648 */
  .slot{flex:1 1 0;min-width:0;transition:flex-grow .38s cubic-bezier(.22,1,.36,1)}
  .slot.is-open{flex-grow:2.8}                        /* 626 vs 223 at 1440 */
  ```
- Active index: `floor(clamp((pinTop − wrap.top)/(wrap.h − pin.h)) * 4)`, capped at 3, recomputed on scroll. Sampled at 0 / .3 / .55 / .8 progress → 0 / 1 / 2 / 3.
- Click, Enter, Space or focus on a stage smooth-scrolls to `wrap.top + scrollY − pinTop + (i+.5)/4 * travel`.
- Below 1024 the deck is a column, all slots are expanded (`.short` hidden), and nothing is pinned.
- Stage `stage cursor-pointer rounded-4xl border border-ink-200 bg-white p-6 md:p-8 shadow-lift`, role button, `aria-expanded`:
  - `background-image: linear-gradient(to bottom, transparent 42%, color-mix(in oklab,var(--tint),transparent 92%) 70%, color-mix(in oklab,var(--tint),transparent 78%) 100%)`
  - `display:flex; flex-direction:column; height:100%; overflow:hidden; isolation:isolate`
- Per slot vars:
  - `--tint` = the 400 of the family (primary #00bcff, accent-d #a684ff, accent-b #ffb900, accent-a #00d492)
  - `--tint-soft` = color-mix(50, 100)
  - `--tint-deep` = 950
  - `--mark-a..d` = family 300 to 600, used by the blob mark
- Content:
  - SVG `.mark`: verbatim in `specs/ref/ai-governance-deck-marks.html`; fills via `.blob-a..d`. At lg it is `display:block;position:absolute;z-index:-1;width:155%;aspect-ratio:1;left:50%;bottom:-9%;transform:translate(-50%);opacity:.17;mask-image:linear-gradient(#0000 4%,#000 52%);transition:opacity .22s .12s`. On `.is-open` it is `opacity:0`, transition 90ms. It is hidden below lg.
  - h3 `font-display text-2xl md:text-3xl font-bold text-ink-900` (30/36).
  - `.copy.mt-4.text-base.text-pretty.text-ink-600` is a grid stacking `p.short` and `p.long` in one cell (min-height 4.5rem at lg).
  - `.extras` (flex column, flex 1) contains:
    - `ul.mt-6.space-y-3`: li `flex items-center gap-3 text-sm text-ink-700`, with a chip `point-chip size-7 rounded-lg` (bg var(--tint-soft)) holding a 16px `point-icon` (color var(--tint-deep))
    - `.art.mt-4` (flex 1, `margin:-1.5rem` right and bottom, `-2rem` at md, `pt-3 pl-3`, overflow hidden) > `.art-fade` (right-edge 3rem mask, see CSS) > the visual card
- lg open/close states:
  - `.short` is shown when closed and fades out on open.
  - `.long` and `.extras` go from `opacity 0; translateY(.5rem)` to visible with `transition: opacity .18s .14s, transform .18s .14s`. The closing transition is `.12s` with no delay.
- Notch between slots (i>0, lg only): `pointer-events-none absolute top-7 right-[calc(100%-2px)] z-10 hidden h-15 w-[calc(1rem+4px)] flex-col lg:flex` (20×60). It has a top SVG (fill white plus two stroke arcs, ink-950/10 and ink-200), a `flex-1 bg-white` middle and a bottom SVG. The exact markup is in the HTML/JS.
- Slots (short → long; points; visual):
  1. **Adopt**, primary.
     - Short: "Give one team a project of its own."
     - Long: "One team builds in its own project, on the integrations you approve. Only the people you add can open it, so the first automations reach production without touching anyone else's work."
     - Points: folder-bold Its own project · plug-circle-bold Approved integrations only · bolt-bold In production in days.
     - Visual **pilot**: "Engineering" project card. Header: dot primary-500, "Engineering" 15/600, "Your project". 3 stats: 24 Flows / 9 Connections / 3 Tables (24px 600). Members: 4 overlapping `size-7` avatars (primary-200, accent-a-200, accent-b-200, ink-200, `-space-x-2 ring-2 ring-white`) and "12 members". Then 4 locked rows on `bg-ink-50`, each `lock-password-linear` + name + "Out of reach": Finance, Support, Revenue ops, Data platform.
  2. **Expand**, accent-d.
     - Short: "Add the next team without adding admin work."
     - Long: "People sign in through SAML, and SCIM adds and removes them in step with your directory. Each person is a member of the projects you put them in, and sees nothing outside them."
     - Points: user-id-bold SAML single sign-on · users-group-two-rounded-bold SCIM provisioning · user-check-rounded-bold Membership per project.
     - Visual **rollout**: "Okta directory / SCIM, 56 people", a green "Synced" dot, then a 2×2 grid of teams with avatar stacks and counts: Engineering 12 · Finance 8 · Support 21 · Marketing 15.
  3. **Control**, accent-b.
     - Short: "Let teams build. You decide what they can do."
     - Long: "Each person gets a role per project, built from the permissions you pick. Teams build and run their own automations, and the connections behind them stay in an admin's hands."
     - Points: key-bold Roles assigned per project · bot-bold Credentials never shown back · verified-check-bold Viewer rights for everyone else.
     - Visual **control**: "Secret" field `h-11 rounded-lg bg-ink-50 ring-1 ring-ink-950/10` with key-linear, mono "••••••••••" (tracking-widest ink-400) and "Write only". Row on `bg-ink-50`: amber dot "Refunds wait for an approver" … "Dana Rowe". Then "What the agent may do with it" with toggles `h-5 w-8 rounded-full px-0.5` (on: `justify-end bg-ink-900`; off: `justify-start bg-ink-950/10`; knob `size-4 bg-white`): Read invoices (on), Create invoices (on), Issue refunds (off, ink-400).
  4. **Monitor**, accent-a.
     - Short: "See who changed what, and when."
     - Long: "Every change and every run is recorded with the person behind it, and streams to the tools you already watch. Changes ship as one release, and a release goes back in one step."
     - Points: clipboard-text-bold Audit log you can stream out · layers-bold Releases you can review · undo-left-round-bold One-step rollback.
     - Visual **evidence**: "Release 42 / Applied 09:41 by Dana Rowe" with a "Revert" chip (`rounded-lg px-3 py-2 text-[13px] ring-1 ring-ink-950/10`, undo icon). Then `divide-y` rows (icon, text, meta):
       - structure-linear (accent-a-500): Notify finance on approval / Flow added
       - users-group-two-rounded-linear (accent-b-500): Sam Okafor, now Editor / Role changed
       - plug-circle-linear (ink-400): Ledger API, secret rotated / Connection
       - clipboard-text-linear (ink-400): Sandbox key removed / Connection
- Exact mock markup is in the SSR HTML (search the visible strings).

### 5.E IconBand "Ship with confidence" (solid). Cards:
- widget-5-bold: Scoped tool access / An agent reaches only the individual actions you grant it, never the whole app behind them.
- user-check-rounded-bold: Approval gates / An agent stops on anything that writes and waits for a person to approve the exact call.
- key-bold: Centralized keys / Provider keys are held and rotated in one place. Builders pick a model, never a secret.
- document-text-bold: Execution tracing / Reasoning, tool calls and payloads are kept, so a review reads the run, not a summary.
- wallet-money-bold: Spend governance / Every run is metered and billed to the project that spent it, under a ceiling you set.
- bell-bing-bold: Operational alerts / Failures email the people you nominate, and webhooks push run events wherever you want.
- users-group-rounded-bold: SSO, SCIM, RBAC / Identity from the directory you already run, with roles and access scoped per project.
- cloud-bold: Data residency / Run on our EU cloud, or deploy the whole platform inside your own network.
- shield-check-bold: Open and audited / Audited against SOC 2 Type II, with the source on GitHub and the core under MIT.

### 5.F FAQ "What your security team will ask"
1. Can a builder or a model ever see a credential? → No. Connections are resolved inside the worker at run time. They are never returned by the API and never shown back in the interface, so a flow can use a credential without anyone reading it.
2. Can we stop business users touching what engineering depends on? → Keep those flows in their own project and give the wider organization viewer rights there, or none at all. A project is a boundary, not a label.
3. What happens when someone leaves? → SCIM removes them in step with your directory. Deactivating a person revokes access and frees the seat without deleting their projects, so the work they built keeps running.
4. Can we pilot with one team before opening it to everyone? → Yes, and it is how most rollouts start. Give one project a narrow role set, watch it in the audit log, then widen the roles rather than rebuilding anything.
5. Can failure alerts reach the on-call we already run? → Failure alerts go by email to the addresses you nominate. Beyond that, platform and project webhooks push execution and audit events, every finished run included, to any destination you own, including back into a flow of your own.
6. How much of this can we verify before signing anything? → The source is on GitHub, with the core under MIT, so your team can read how permissions, connections and execution are implemented rather than take our description of them on trust.

---

## 6. /embed

Doc height 5511 at 1440, 5911 at 768, 8553 at 390. JS is in `specs/ref/js/embed.oQFP5Uav.js`.

| # | section | 1440 y/h | 768 y/h | 390 y/h |
|---|---|---|---|---|
| A | ProductHero (§1.5) with the flow-canvas demo | 0 / 1232 | 0 / 1396 | 0 / 1416 |
| B | Bento "What the SDK gives you." (8 cells) | 1232 / 2392 | 1396 / 2392 | 1416 / 4160 |
| C | FAQ "Common questions." | 3624 / 912 | 3788 / 912 | 5576 / 1176 |

### 6.A Hero
- `ProductHero`:
  - title "Put a flow builder inside your product."
  - subtitle "Your customers build their own automations without leaving your app. You choose the integrations they see, the branding around it, and what each one can run."
  - primary "Talk to us" → `/sales` (lg solid, 129×48)
  - secondary "Read the docs" → `https://www.activepieces.com/docs/embedding/overview` (lg secondary, 165×48)
  - art `coast`
- **Visual = the homepage flow-canvas demo (`Dc0touRn.js`), i.e. `FeatureFlowDemo`.** It is the same component as homepage §G: `.visual-pad` (IntersectionObserver threshold .3 starts the scripted loop) > `.stage-clip.visual-stage`, measured 544×448 at 1440, 544×448 at 768 and 302×352 at 390. On load the fake cursor runs (opacity 260ms ease, transform 500ms `cubic-bezier(.5,.02,.2,1)`).
- Highlights (3 columns):
  - Your users never sign up twice / Your app signs them in, and their workspace is created the first time they open it.
  - You decide what they see / Show only the integrations you sell, hide what you don't need, run it on your subdomain.
  - Every customer stays separate / One project each, with its own automations, connections, history and usage limits.

### 6.B Bento "What the SDK gives you."
Same section, H2 and card as homepage §H: H2 Sentient 36/40 `max-w-xl`; cards 500 tall at md and 470 below; 24-col grid with gap 20. Card widths at 1440: span 12 = 598, 9 = 444, 15 = 753.

The cells are listed below. `S(slug)` = `/logos/pieces/<slug>.svg` (all local). The sheet is the shared `sheet` component: `overflow-hidden rounded-xl border border-ink-950/10 bg-ink-50 ring-1 ring-ink-950/10`. With `chrome` it gets a title bar; with `label` it gets a file-name tab.

1. **Sign Them In Once**: "Your backend signs a token, and the account exists."
   - span 12 · `/panel/clouds.webp` · cover · 50% 26% · mode **center**.
   - Sheet with chrome, label "your-backend.ts". Code `flex flex-col gap-1 px-6 py-6 font-mono text-[13px] leading-relaxed`; each line is a `p` with `padding-left: indent*1.5rem`:
     - `const` (code-key) ` token = ` `jwt.sign` (code-fn) `({`
     - indent 1: `externalUserId` (dim) `: ` `'usr_8412'` (str) `,`
     - indent 1: `externalProjectId` (dim) `: ` `'calder'` (str) `,`
     - indent 1: `role` (dim) `: ` `'EDITOR'` (str) `,`
     - indent 1: `pieceSet` (dim) `: ` `'premium'` (str) `,`
     - `}, ` `privateKey` (dim) `)`
2. **The Builder In Your Page**: "One configure() call and the builder appears."
   - span 12 · `/panel/meadow.webp` · 50% 62% · **crop**.
   - Sheet `h-full`. Head `flex items-center gap-3 py-5 pr-32 pl-6`: `/logos/calder.svg` (size-5), "Calder" (15/600 ink-950), "Automations" (13 ink-500).
   - Body `border-t border-ink-950/10 py-6 pr-32 pl-6`: 3 step cards `flex items-center gap-3.5 rounded-xl border border-ink-950/10 bg-white px-4 py-4` (logo size-8, name 14 ink-900, kind 12 ink-500, `menu-dots-linear ml-auto size-4 text-ink-950/20`), joined by `ml-6 h-6 w-px border-l border-ink-950/15`.
   - Steps: stripe "New payment" Trigger; hubspot "Find the customer" Action; slack "Post to #revenue" Action.
3. **Accounts Already Connected**: "Connect their accounts for them, or let them."
   - span 9 · `/grid/iris.webp` · size 230% · 50% 100% · **float**.
   - Header: google-sheets icon (size-9), "Google Sheets" (15/600), "Requested by Calder" (12 ink-500).
   - Body `flex flex-col gap-4 border-t px-6 py-6`: "Connection name" (13 ink-600) and a field `rounded-lg border border-ink-950/10 bg-white px-3.5 py-3` with "Calder sheets" (14 ink-900).
   - Buttons `flex items-center gap-2.5`:
     - "Connect": `flex-1 rounded-lg border border-ink-950/10 bg-ink-950 px-4 py-2.5 text-center text-[13px] font-medium text-white`
     - "Cancel": `rounded-lg border border-ink-950/10 bg-ink-50 px-4 py-2.5 text-[13px] font-medium text-ink-800`
4. **Hide What You Don't Need**: "Sidebar, folders, search, import and export."
   - span 15 · `/rows/water.webp` · 50% 30% · **wide**.
   - Head: "Embedding" (15/600) and "4 of 5 on" (13 ink-500). Then `divide-y` rows `flex items-center gap-4 px-6 py-4`: mono 13 key + 12 ink-500 note, and a toggle `ml-auto h-6 w-10 rounded-full px-0.5` (on: `justify-end bg-ink-950`; off: `justify-start bg-ink-950/15`; knob `size-5 bg-white`).
   - Rows:
     - hideSidebar "Your navigation stays the only one" (on)
     - hideFolders "No folder tree for your customers" (on)
     - hideFlowName "You title the page yourself" (on)
     - hideGlobalSearch "Command palette off" (on)
     - hideTables "Keep the tables interface" (off)
5. **Your Domain, Your Font**: "Your own subdomain and font, light or dark."
   - span 15 · `/panel/clouds.webp` · 50% 58% · **crop-left**.
   - URL bar `py-5 pr-7 pl-32` > `flex items-center gap-2.5 rounded-lg border border-ink-950/10 bg-white px-3.5 py-2.5`: `lock-linear size-3.5 text-accent-a-700` and "flows.calder.com" (mono 13 ink-700).
   - Font block `border-t py-6 pr-7 pl-32`: "Interface font" (12 ink-500), "Söhne" (`mt-2` 15/600 ink-950), then `mt-5 flex flex-col gap-4` rows: a `w-20` label (12 ink-500) and "Automations" (14 ink-900) for Regular / Medium / Semibold.
   - Accent row `border-t py-4 pr-7 pl-32`: `size-4 rounded-md bg-accent-d-600`, "Accent", and mono "#7F22FE".
6. **Only The Apps You Sell**: "Build one list of integrations and reuse it."
   - span 9 · `/rows/water.webp` · 50% 16% · **float**.
   - Head: "premium" and "4 of 6".
   - Grid `grid grid-cols-3 gap-3 border-t px-6 py-6` of tiles `relative flex items-center justify-center rounded-xl border py-5`:
     - on: `border-ink-950/10 bg-white` plus `check-circle-linear absolute top-2 right-2 size-4 text-accent-a-700`
     - off: `border-ink-950/5 bg-ink-50`, img `opacity-25 grayscale`
   - Tiles: slack, google-sheets, hubspot, gmail (on) · stripe, notion (off).
7. **Limits Per Customer**: "Set each customer's task and credit ceiling."
   - span 12 · `/panel/meadow.webp` · 22% 34% · **wide**.
   - Head `px-9 py-6`: "Calder" and "Set by your token".
   - Body `flex flex-col gap-8 border-t px-9 py-8`: rows of a used value (28px/1 600 tabular), "of {cap}" (13 ink-500) and an `ml-auto` label (13 ink-600), then a bar `h-2 rounded-full bg-ink-950/8` with a fill `bg-primary-700` at width pct:
     - 31,204 of 50,000, Tasks this month, 62%
     - 164 of 250, AI credits, 66%
     - 18 of 25, Concurrent runs, 72%
   - Footer `px-9 py-5`: "Shared pool" and mono "calder-pro".
8. **Ready For Their AI**: "An assistant can run their automations."
   - span 12 · `/panel/clouds.webp` · 50% 12% · **center**.
   - Chat `flex flex-col gap-5 px-6 py-6`:
     - User row: `size-7 rounded-full bg-ink-200` and "Refund the duplicate charge on Northaven and tell the account owner." (14 ink-900).
     - Assistant row: `size-7 rounded-full bg-ink-950` with a white `stars-linear` 14px; "Done. Refunded and posted the note."; a list `rounded-xl border divide-y` of `check-circle-linear text-accent-a-700` + mono 13 for refund_payment and post_message.
   - Footer: accent-a-500 dot and "Calder project only" (12 ink-500).

### 6.C FAQ "Common questions."
1. How do our users end up logged in? → They do not log in twice. You sign a short-lived RS256 token in your backend carrying your own ids, and the SDK exchanges it for a session. If the user and project exist, the token signs them in; if not, both are created. The role is in the same token, so the same person can be an editor in one workspace and a viewer in another.
2. How much of the interface can we actually change? → The URL is a subdomain you own, and you pass your own font and light or dark mode. The sidebar, folder tree, flow name, search, import and export, and the tables interface are each a flag you can switch off, and navigation can be a single home button that calls your own router. The formula editor links to your documentation rather than ours.
3. Can different customers see different integrations? → Yes, with one claim in the token rather than a separate deployment. You build a named set in the platform admin, choosing the integrations and even which of their actions and triggers are visible. Whichever set the token names is the catalog that customer sees.
4. Do our users have to reconnect accounts they already gave us? → Not if you already hold the credential. Create the connection over the API when you provision the project, and the app is authorized before the customer opens the builder. When you do want them to connect something, calling connect() from your own button opens just that dialog.
5. Does the browser URL stay in step with what they are looking at? → Yes, but you have to wire it up. By default the embedded routes leave your address bar alone, which breaks the back button and makes links unshareable. The SDK gives you a handler that fires on every route change inside the frame, and a navigate method to push a route back into it.
6. What does it cost, and what do we need to set up first? → It is a contracted plan billed yearly, sized on how many of your customers automate and how much they run. On our cloud, setup is a subdomain with DNS verification, the origins allowed to frame it, and a signing key. Self-hosted skips the first two, since it already runs on your domain.

---

## 7. /oss-friends

Doc height 5130 at 1440, 7248 at 768, 12429 at 390.

- Container: `mx-auto w-full max-w-7xl px-5 pt-28 pb-24 md:px-6 md:pt-32 md:pb-32 lg:px-8`. It is the only child of main, `[80,0,1280,4155]` at 1440.
- Header `flex flex-col gap-3`:
  - H1 "Our open-source friends": `font-display text-5xl md:text-6xl font-bold text-balance text-ink-900` (60/60; 48/48 below md).
  - p `max-w-2xl text-xl text-balance text-ink-600` (20/28): "Open-source projects we like, from teams building in the open."
- Grid `mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3`. 37 cards: 389 wide at 1440 (232 to 258 tall, depending on description lines), 348 wide at 768, 350 at 390.
- Card `a` (target _blank, rel noopener noreferrer): `group flex flex-col rounded-2xl border border-ink-950/8 bg-white p-6 transition-colors duration-200 outline-none hover:border-ink-950/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700`.
  - Head `flex items-center gap-4`:
    - logo img `size-11 shrink-0 rounded-xl border border-ink-950/8 object-contain` (44px, lazy)
    - h2 `font-display text-xl font-bold text-ink-900` (Sentient 20/28)
  - On image error, fall back to `span.flex.size-11.shrink-0.items-center.justify-center.rounded-xl.border.border-ink-950/8.bg-ink-950/3.font-display.text-lg.font-bold.text-ink-500` showing the first letter of the name.
  - p `mt-4 flex-1 leading-relaxed text-ink-600` (16/26).
  - "Visit" `mt-6 inline-flex items-center gap-1 text-sm font-medium text-ink-900 transition-colors duration-200 group-hover:text-primary-800` with `alt-arrow-right-linear size-4 transition-transform duration-200 group-hover:translate-x-0.5`.
  - Measured hover: border rgba(2,6,24,.2), Visit color #00598a.
- Data: `specs/ref/oss-friends.json` (37 entries, alphabetical by name, as rendered).
- Credits `mt-16 flex flex-col gap-1.5 border-t border-ink-950/8 pt-6 text-sm text-ink-500` (1216×71 at 1440). Links are `underline underline-offset-4 hover:text-ink-700`:
  - "Logos by [logo.dev](https://logo.dev)."
  - "Interface icons from [Solar](https://www.figma.com/community/file/1166831539721848736) by 480 Design, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)."
- No motion other than hover.

---

## 8. Assets

Downloaded this run into `public/` at their original paths (same origin, www.activepieces.com):
- `/avatars/projects/{growth,revenue-ops,billing,support,data-platform,people-ops}.svg` (150×150): ai-governance platform shot
- `/brand/activepieces-logo.svg`: sales form logo (mask)
- `/gov-hero/green-1600.webp` (1440×960 natural at the 1600 candidate), `/gov-hero/green-2400.webp`, `/gov-hero/green-3200.webp`: ai-governance hero srcset
- `/logos/calder.svg`: embed bento "The Builder In Your Page"
- `/logos/pieces/cloudflare.svg`, `/logos/pieces/openrouter.svg`: ai-governance model tiles
- `/rows/embed-clouds.webp`: pricing Embed/Enterprise rows
- `/icons/solar/*.svg`: 41 new icons from api.iconify.design (list in §0.4). Builders still need to add the `icons.css` rules.

Already present (by the homepage pass or parallel builders), used here:
- `/panel/coast.webp`, `/panel/coast-640/960/1376.webp`, `/panel/clouds.webp`, `/panel/meadow.webp`
- `/rows/water.webp`, `/grid/iris.webp`
- `/reviews/g2-giuseppec.webp`
- all `/logos/customers/*` (24 rotating logos incl. alan.svg and corgi.webp)
- `/logos/pieces/{anthropic-claude,openai,google-gemini,aws-bedrock,azure-openai,mistral-ai,stripe,hubspot,slack,google-sheets,gmail,notion,webhook}.svg`
- `/brand/activepieces-mark.svg`, `/closing/meadow-*.webp`, fonts

Third-party (not downloaded):
- OSS friend logos: `https://img.logo.dev/<domain>?token=pk_Bq4a0G7zQUK8tPabM47Uzg&retina=true` (37 URLs in `oss-friends.json`). Either hot-link them or render the initial-letter fallback (§7). Hot-linking means a runtime third-party request.
- The sales form posts to `/api/sales-lead`, `/api/sales-lead-partial` and `/api/company-name`. The clone must not call them.

Fonts: no new families or weights. Sentient 500 is used by the case-study quote and Fira Code by the canvases and mocks. Both are already in the homepage set.

---

## 9. Reuse map

| component | home | pricing | sales | security | ai-gov | embed | oss |
|---|---|---|---|---|---|---|---|
| Header (heroArt=false off-home) | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ |
| Footer/closing (needs copy props) | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ |
| FloatingCard | ✓ | – | – | ✓ | ✓ | ✓ | ✓ |
| Faq (needs heading/items props) | ✓ | ✓ | | ✓ | ✓ | ✓ | |
| CaseStudy Alan | ✓ | | | | ✓ | | |
| BentoGrid + cards (needs cells prop) | ✓ H/L | | | | | ✓ | |
| FeatureFlowDemo (flow canvas) | ✓ G | | | | | ✓ hero | |
| Button variants brand/solid/secondary | ✓ | ✓ | ✓ | | ✓ | ✓ | |
| **NEW** RotatingLogos (3.5s set swap) | | ✓ | variant (1.4s random) | | ✓ | | |
| **NEW** IconBand | | | | ✓ | ✓ | | |
| **NEW** ProductHero | | | | | | ✓ | |
| **NEW** InfoTip, AnimatedNumber, BillingToggle, CompareTable, PlanCard, SplitRow | | ✓ | | | | | |
| **NEW** SalesPage (own layout, form, notch) | | | ✓ | | | | |
| **NEW** SecurityHero + CipherWall, GlyphField, FeatureRows/SecurityStage | | | | ✓ | | | |
| **NEW** GovernanceHero + PlatformShot, ModelsGrid (scrub), RolloutDeck | | | | | ✓ | | |
| **NEW** OssCard grid | | | | | | | ✓ |
| Button variants light / quiet-light | | | | ✓ | | | |

---

## 10. Not measured / caveats

- **Security canvases** (cipher-wall with the rotating 3D ASCII lock, and glyph-field): they are 2D-canvas renderings, so no computed style describes their pixels. The spec gives the constants. The rendering itself must be ported from `specs/ref/js/security.G6mAqp3Z.js`, or replaced by the static fallback in §4.E. The glyphs are random per load, so no two renders match pixel for pixel.
- **Sales form submission states** (calendar-booking iframe from `meetingUrl`, the error branch): these are server-driven, so I did not trigger them. The text comes from the JS (§2). The clone shows only the "Thanks" state.
- **logo.dev images** are third-party. I did not measure them beyond their 44px box. Their natural size is 256×256.
- **Tooltip enter fade**: the leave fade was measured (opacity 200ms ease-out). The enter fade has the same classes in the source, but the 350ms sample landed after it had finished.
- Security header `heroDark` flag: no visual difference was found at scrollY 0, 40 or 1100 at 1440 or 390. If the coordinator sees a dark-header treatment in a real browser, it was not reproducible headless.
- The ai-governance models grid only pins at viewport ≥1280×768. At 1440×900 it pinned. At 768 and 390 it was measured in static mode. Viewports between those (for example 1280×720) fall back to static.
- At DPR 1, srcsets resolved to the smallest candidates (green-1600, coast-1376). The larger candidates were downloaded anyway.
