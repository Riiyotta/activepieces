# Build conventions (from foundation pass)

- **Browser: HEADLESS ONLY (user instruction).** Never use the `mcp__playwright__*` tools — they open a visible window. Measure with Node scripts via Bash: `const { chromium } = require('/Users/riyaghosh/node_modules/playwright-core'); const browser = await chromium.launch();` Keep scripts as `.cjs` in your own subfolder of the session scratchpad; always `browser.close()`.
- Routing: React Router in `src/App.jsx`; add one `<Route>` line per page between `ROUTES:BEGIN`/`ROUTES:END`. Pages live in `src/pages/`. `src/components/Layout.jsx` provides Header/Footer/FloatingCard — pages render only their `<main>` content. Homepage is `src/pages/Home.jsx` — do not modify homepage sections when building other pages; import and reuse them instead.

- Tailwind config is `tailwind.config.cjs` (CommonJS — hot reloads). Never recreate `tailwind.config.js`. Avoid editing it from parallel section builders; prefer section CSS. If a token is truly missing, add it to the section's own CSS file.
- Section CSS goes in `src/components/<Name>.css`, imported by that component. Do NOT edit `index.css`, `App.jsx`, or another section's files.
- Spacing scale is v4-like: any N in 0.5 steps up to 200 → N×0.25rem (`pt-34`, `-mt-73`, `h-12.5`, `size-22` all work). Any integer opacity works (`bg-ink-950/6`). `grid-cols-24`, `col-span-1..24` exist.
- Tokens: colors `ink-50..950` (+`ink-150`), `primary-*`, `accent-a/b/c/d-*`; fonts `font-sans` (Inter), `font-display` (Sentient), `font-mono` (Fira Code); `leading-display`; shadows `shadow-edge`, `shadow-edge-hover`, `shadow-lift`, `shadow-over`; v4 radius scale; easings `ease-smooth` (.22,1,.36,1), `ease-spring` (.16,1,.3,1), `ease-travel` (.5,.02,.2,1); breakpoints xs 360 / sm 640 / md 768 / lg 1024 / xl 1280.
- `:root` CSS vars: `--ease-smooth`, `--color-ink-*`, `--color-primary-*`, some accents, `--cast-06/08/10/20`, `--shadow-lift`, `--shadow-over`, `--spacing-chrome`.
- Focus rings: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700` (v3 needs explicit `outline`).
- Icons: `<Icon name="solar:check-circle-linear" className="size-4" />` from `src/components/ui/Icon.jsx`. To add an icon: fetch the SVG once from `https://api.iconify.design/<set>/<name>.svg`, save under `public/icons/<set>/`, add a rule in `src/icons.css` (append only — note parallel builders may also append; re-read before editing).
- Buttons: `Button` / `buttonClasses(size, variant, extra)` from `src/components/ui/Button.jsx` (sizes sm/md/lg/xl, variants brand/solid/secondary/glass). For one-offs write the full class string.
- Global: `.fade-b` (set `--fade`), `html.js .hero-line` with `--i`, `blink` keyframe.
- Container queries: no plugin — write plain `@container` CSS.
- v4-only syntax copied from the saved HTML must be checked against v3.
- Assets: all local under `public/` at original paths (`/brand/…`, `/logos/customers/…`, `/logos/pieces/…`, `/rows/water.webp`, `/grid/iris.webp`, `/closing/…`, `/hero/…`) plus saved-folder files at `/assets/<filename>` (e.g. `/assets/activepieces-logo.svg`, `/assets/funding-societies.webp`, `/assets/g2-*.webp`, `/assets/meadow*.webp`). Never reference activepieces.com at runtime.
- `UseInAiDialog` takes `{ open, onClose }`. Q sits inside `<main>` after Faq; Footer and FloatingCard sit after `<main>`.
- Self-host link placeholder: `/docs`.
