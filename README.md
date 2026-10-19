> **Private — not for public release.** This is a local replica of activepieces.com for study. Brand marks, customer logos, photos, copy, the Sentient font and the saved original page belong to Activepieces and third parties. Do not make this repository public or deploy it.

# Activepieces clone — information architecture

Local React 18 + Vite + Tailwind v3 clone of activepieces.com (dev server: `npm run dev`, http://localhost:5192).

## IA files

| File | Hand-edited? | What it is |
|---|---|---|
| `ia.json` | **yes — the only IA file to edit** | Templates, routes and sections (each section defined once, referenced by id, with `implementedBy` naming the real component) |
| `IA.md` | no — generated | Readable IA: route share, chrome partition, section reuse, per-template tables |
| `matrix.csv` | no — generated | Section × template matrix |
| `validate.mjs`, `build.mjs` | no — copied from the ia-builder skill | Validator and generator |

Re-run after editing `ia.json`:

```bash
node validate.mjs && node build.mjs
```

## What the data shows

- **98% of routes come from five data-driven templates.** Piece pair (3,000), resource detail (1,063), blog article (791), piece detail (768) and MCP detail (768) cover 6,390 of the 6,518 sitemap routes. The hand-built effort sits in the other 128 routes across 18 templates.
- **Chrome is near-universal, but the floating card isn't.** Header and footer render on 6,517 routes; only `/sales` has no chrome. The floating demo card is absent on 856 routes (`/pricing` plus all blog templates).
- **29 sections are shared and 37 are page-local.** `faq.accordion` is the most reused content block (13 templates, 4,591 routes). Most page-local sections are the homepage's and marketing pages' bespoke set pieces: the Dream scroll story, demos, the pricing table and the security canvas.
- **Two consolidation candidates.** `proof.logo-rotator` is implemented twice (`templates/LogoRotator.jsx` and `pricing/RotatingLogos.jsx`). `hero.embed` re-implements the `hero.template` markup in `embed/EmbedHero.jsx`.

## Caveats

- **Sitemap counts vs real coverage.** `routeCount` counts sitemap URLs only. The clone also serves any valid `/pieces/{a}/{b}` pair, plus blog pagination routes that aren't in the sitemap. `src/data/blog.json` has 796 posts (2 of them sitemap-only, hidden from listings, as on the live site) and 95 authors, against 791 and 56 in the sitemap. The live blog publishes several posts an hour, so the newest cards on `/blog` reflect when the data was last refreshed (`node scripts/fetch-content-index.mjs --images`).
- **Templates that repeat a section inflate one validator count.** Four templates list a section more than once in order:
  - the homepage repeats `cta.band`, `proof.case-study` and `product.bento-grid`
  - the pair page repeats `catalog.related`

  `validate.mjs`'s "SECTION REUSE" lines count each repeat as another template. That's why `cta.band` shows as 2 templates even though it is homepage-only. `IA.md`'s shared/page-local split counts distinct templates and is the correct figure.
- **Placeholder bodies.** Article, resource and legal bodies are placeholders by design. Those sections render real metadata and link to the original for the full text.
