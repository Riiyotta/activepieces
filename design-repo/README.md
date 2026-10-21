# Activepieces clone: design-repo

An AI-ready, machine-validated design system extracted from the private
activepieces.com study clone that sits next to this folder (React 18 + Vite 5 +
Tailwind CSS v3 reproducing a Tailwind v4 / Nuxt original). An LLM uses it to
compose PageSpecs (`schema/pagespec.schema.json`) out of real, measured sections
without inventing colors, copy budgets, structure or motion.

Status: **design-review-pending**, `productionApproved: false`.

Every PageSpec declares a closed `mode`: `"reference"` (clone fidelity, the real
Activepieces brand stays available) or `"generated"` (a page for another brand: the
Activepieces wordmark, logomark, artwork and name are rejected). See
[Modes](#modes-reference-vs-generated).

## Read this first: real-company constraints

1. **Real company, private study.** activepieces.com is a live commercial site.
   Brand marks, customer logos (Bosch, SAP, Hilton, ...), testimonial people and
   avatars, review screenshots, case-study claims and marketing copy belong to
   Activepieces or to third parties. **Do not publish this repo or the clone, and
   do not make either public.** Generated output must use synthetic copy and
   `placeholder:` media for every pinned role (`assets/asset-roles.json`);
   `rules/content-policy.json` lists the real names and verbatim headlines the
   validator rejects.
2. **Bodies are placeholders by design.** Blog, resource and legal bodies are not
   stored (metadata only). The templates render a placeholder body plus a "Read the
   full ... on activepieces.com" link. PageSpecs have no body field, and the
   validator rejects body-like fields (`NO_STORED_BODIES`). Never fabricate an
   article, least of all one attributed to a real author.
3. **No runtime external requests.** Every asset is local under the clone's
   `public/` at its original path. The only external URLs are outbound navigation
   links (cloud sign-up, GitHub, docs, trust center, and the `/docs/*` hand-off).
   The /sales form never submits.
4. **Data-driven catalog.** About 4,500 catalog URLs come from 3 templates + JSON
   (`/pieces/:slug`, `/mcp/:slug`, `/pieces/:a/:b` for any two distinct valid slugs,
   with 3,000 listed in the sitemap). There are no per-page files.
5. **Tailwind v3 reproducing v4.** `rules/tailwind-v3-v4.json` lists the rules that
   carry weight when you generate code: v4 divide semantics, inherited leading
   ratios, template vs. homepage hero entrance, and others.
6. **Article TOC rail** renders when `hasToc || !NO_TOC.has(slug)` (63 measured
   slugs) and the placeholder TOC has at least 3 entries. `hasToc` alone is not the rule.

## Modes: reference vs generated

`mode` is a required field of every PageSpec (`schema/pagespec.schema.json`,
enum `["generated", "reference"]`, generated from `assets/asset-roles.json` `modes`).

| mode | meaning | the real Activepieces brand |
|---|---|---|
| `mode: "reference"` | faithful reproduction of the study clone | available: wordmark, logomark, mark, full logo, commissioned art, editorial covers, investor badge (exactly the paths in `assets/asset-roles.json`) |
| `mode: "generated"` | a new page for another (original or fictional) brand | rejected |

**The exact rule for `mode: "generated"`** (`assets/asset-roles.json` `generatedModeRule`;
each point is one rule in `compatibility/graph.json` and in `schema/semantic_validate.py`):

1. A media item whose `assetRole` has `availability` `reference-only` or
   `blocked-in-generated` is an error (`GENERATED_MODE_ASSET_ROLES`).
2. A media ref that is a file of the clone (starts with `/`), or a content value that
   names commissioned art (`sections/*.json` `generatedMode.forbiddenContentValues`:
   bento `art` meadow/clouds/water/iris, hero `stageArt` meadow/clouds/coast), is an error
   (`GENERATED_MODE_SOURCE_ARTWORK`). Only `placeholder:`, `generated:` and
   `data:user-brand#` refs are possible.
3. The names "Activepieces" / "Active Pieces" in any string (meta, content, node id, route,
   media ref, alt, href host) are an error (`GENERATED_MODE_BRAND_TERMS`).
4. Every surface where the clone draws its own brand/art by default must be bound explicitly
   to a generation-safe role (`generatedMode.requiredSlots`: header `brand`, footer
   `closingArt`, floating-card `mark`, home `plates`, product/embed `stageArt`, demo-split
   `stageArt`, governance `heroArt` + `brandMark`, models-grid `brandMark`, dream `beatMark`,
   sales `background` + `formLogo`, app-shot `sidebarLogo`, pricing `rowArt`;
   `GENERATED_MODE_REQUIRED_SLOTS`).
5. Sections whose contract hard-wires a hand-off to activepieces.com
   (`content.article`, `content.resource-detail`, `content.legal`,
   `system.external-redirect`) are blocked (`GENERATED_MODE_BLOCKED_SECTIONS`), so
   `template.blog-article`, `template.resource-detail`, `template.legal` and
   `template.external-redirect` are reference-only templates.

In `mode: "reference"` none of rules 1-5 apply. `PAGESPEC_MODE` rejects a missing or unknown mode.

Every role in `assets/asset-roles.json` carries `availability` (closed enum, pinned for the
protected roles by `verify_all.py` `ASSET_AVAILABILITY`):

| availability | roles | in generated mode |
|---|---|---|
| `reference-only` | brand.wordmark, brand.logomark, brand.mark, brand.logo-full, art.plate, art.panel, art.closing, art.gov-hero, blog.cover | error; each names its `generatedModeAlternatives` |
| `blocked-in-generated` | badge.backer (Y Combinator), piece.logo, ai-client.logo, oss-friend.logo | error; no substitute, omit the slot |
| `generation-safe` | brand.placeholder, brand.user-supplied, art.generic, customer.logo, case-study.logo, testimonial.avatar, review-platform.mark, author.photo, mock.avatar, mock.brand-fictional, icon.ui | allowed (placeholder:/generated:/data:user-brand# refs only) |

Generation-safe alternatives (new roles, defined by this design-repo, no source citation by design):
`brand.placeholder` (neutral placeholder for the page's own brand mark, ref `placeholder:brand-mark`),
`brand.user-supplied` (the user's own logo, ref `data:user-brand#logo`, policy `user-supplied-only`),
`art.generic` (generic or newly generated illustration, ref `generated:<name>`).
`mock.brand-fictional` keeps its meaning (a fictional company shown INSIDE a product mock); it is not a
stand-in for the page's own brand, and in generated mode its clone file (`/logos/calder.svg`) is rejected
like any clone file. `schema/example.generated.pagespec.json` is a complete generation-safe example
(fictional brand "Quillbright").

Limits, stated plainly. (a) A PageSpec cannot constrain how a renderer behaves when a slot is unbound:
in generated mode a renderer must never fall back to a built-in clone asset (that is why the
brand/art surfaces above are REQUIRED to be bound). The investor badge has no slot filler in generated
mode and the renderer must omit it. (b) The product-UI mock components (bento `mock`, hero `visual`,
demo-split demos, app-shot) depict the Activepieces product and are not blocked; they are not logos or
commissioned plates, but a generated page for a different product should treat them as illustrative.
(c) Dataset-bound content (`data:pieces#...` subjects, catalog/blog listings) is not blocked at section
level; only its logo/cover media roles are.

## Layout

| path | what |
|---|---|
| `tokens/00-foundation` | color, typography, radius, spacing, breakpoint, elevation, icon-size, z-index, motion (+ the closed motion-pattern registry) |
| `tokens/10-semantic`, `20-component`, `30-layout`, `themes/light.json` | semantic roles -> foundation; button/card/layout tokens; single light theme (no `dark:` in src) |
| `tokens/llm/` | `token-catalog.json`, `token-policy.json`, `component-allowlist.json` (closed instantiation list) |
| `primitives/`, `components/` | content-agnostic building blocks with implementedBy + evidence |
| `sections/` | one contract per section TYPE: content (closed, x-maxWords), variants, variantRules, media slots (assetRole), motion (allowed/required patterns, const fallback), structured responsive changes |
| `templates/templates.json` | one template per page shape: ordered node objects `{section, variants, required, repeatable}` |
| `templates/routes.json` | route inventory = the real `src/App.jsx` table (`verify_all` checks parity) |
| `compatibility/graph.json` | rhythm/position/policy rules with severities; each is implemented in `semantic_validate.py` |
| `assets/asset-roles.json` | closed assetRole vocabulary with generation/licensing policy, `availability` per role (reference-only / generation-safe / blocked-in-generated), the two `modes`, pinned roles |
| `rules/` | `tailwind-v3-v4.json`, `content-policy.json` |
| `schema/` | generated draft-07 schema, `build_schema.py`, `semantic_validate.py`, 3 examples (2 reference-mode, 1 generated-mode), `tests/adversarial_test.py` |
| `extraction/` | `measured-values.json` (citation ledger + groundwork corrections), `verify_all.py`, `prove_drift.py` |

## Counts (recomputed from disk; verify_all README_COUNTS fails on drift)

| key | value |
|---|---|
| tokens | 230 |
| foundationTokens | 167 |
| semanticTokens | 35 |
| primitives | 8 |
| components | 20 |
| sections | 42 |
| sectionVariants | 76 |
| templates | 21 |
| routePatterns | 30 |
| concreteUrlsEnumerable | 6628 |
| assetRoles | 24 |
| assetRolesReferenceOnly | 9 |
| assetRolesGenerationSafe | 11 |
| assetRolesBlockedInGenerated | 4 |
| motionPatterns | 42 |
| graphRules | 37 |
| tailwindV3V4Rules | 14 |
| examplePageSpecs | 3 |

Data facts at build time: 768 pieces in 17 categories, 3000 sitemap pairs,
796 blog posts (794 listed; posts with `listed:false` are routable but not
listed), 95 authors, 1063 resources. The original sitemap has 6,518 URLs.

## Route inventory

| pattern | template | shell | floating card | concrete URLs |
|---|---|---|---|---|
| `/` | template.home | Layout | yes | 1 |
| `/product/:slug` | template.product | Layout | yes | 4 |
| `/solutions/:slug` | template.solution | Layout | yes | 10 |
| `/pieces` | template.catalog-index | Layout | yes | 1 |
| `/pieces/category/:key` | template.catalog-category | Layout | yes | 17 |
| `/pieces/:slug` | template.catalog-detail | Layout | yes | 768 |
| `/pieces/:a/:b` | template.catalog-pair | Layout | yes | 3000 |
| `/mcp` | template.catalog-index | Layout | yes | 1 |
| `/mcp/category/:key` | template.catalog-category | Layout | yes | 17 |
| `/mcp/:slug` | template.catalog-detail | Layout | yes | 768 |
| `/security` | template.security | Layout | yes | 1 |
| `/ai-governance` | template.ai-governance | Layout | yes | 1 |
| `/embed` | template.embed | Layout | yes | 1 |
| `/pricing` | template.pricing | Layout | no | 1 |
| `/oss-friends` | template.oss-friends | Layout | yes | 1 |
| `/blog` | template.blog-listing | Layout | no | 1 |
| `/blog/page/:n` | template.blog-listing | Layout | no | 66 |
| `/blog/category/:slug` | template.blog-listing | Layout | no | 7 |
| `/blog/category/:slug/:n` | template.blog-listing | Layout | no | open |
| `/blog/author/:slug` | template.blog-listing | Layout | no | 95 |
| `/blog/author/:slug/:n` | template.blog-listing | Layout | no | open |
| `/blog/:slug` | template.blog-article | Layout | no | 796 |
| `/resources` | template.resources-hub | Layout | yes | 1 |
| `/resources/:category` | template.resource-category | Layout | yes | 4 |
| `/resources/:category/:slug` | template.resource-detail | Layout | yes | 1063 |
| `/privacy` | template.legal | Layout | yes | 1 |
| `/terms` | template.legal | Layout | yes | 1 |
| `/docs/*` | template.external-redirect | Layout | yes | open |
| `/sales` | template.sales | standalone | no | 1 |
| `*` | template.not-found | Layout | yes | open |

## Templates (node sequences; `?` = optional)

| template | nodes |
|---|---|
| template.home | shell.header -> hero.home-stage -> media.app-shot -> story.dream-scroll -> proof.case-study -> cta.band -> feature.demo-split -> feature.demo-split -> bento.grid -> cta.band -> proof.case-study -> feature.demo-split -> bento.grid -> proof.testimonials -> faq.accordion -> overlay.use-in-ai-dialog -> shell.footer-closing -> shell.floating-card |
| template.product | shell.header -> hero.product-stage -> bento.grid -> faq.accordion -> shell.footer-closing -> shell.floating-card |
| template.solution | shell.header -> hero.product-stage -> bento.grid -> proof.case-study -> proof.testimonials -> faq.accordion -> shell.footer-closing -> shell.floating-card |
| template.pricing | shell.header -> pricing.plans -> pricing.compare -> faq.accordion -> shell.footer-closing |
| template.sales | sales.split |
| template.security | shell.header -> security.hero-cipher -> security.feature-rows -> band.icon-cards -> faq.accordion -> shell.footer-closing -> shell.floating-card |
| template.ai-governance | shell.header -> governance.hero -> governance.models-grid -> proof.case-study -> governance.rollout-deck -> band.icon-cards -> faq.accordion -> shell.footer-closing -> shell.floating-card |
| template.embed | shell.header -> hero.product-stage -> bento.grid -> faq.accordion -> shell.footer-closing -> shell.floating-card |
| template.oss-friends | shell.header -> directory.oss-friends -> shell.footer-closing -> shell.floating-card |
| template.catalog-index | shell.header -> hero.catalog-index -> catalog.browser -> cta.band -> catalog.categories -> faq.accordion -> catalog.az-index -> shell.footer-closing -> shell.floating-card |
| template.catalog-category | shell.header -> hero.catalog-index -> catalog.browser -> cta.band -> catalog.categories? -> faq.accordion -> catalog.az-index -> shell.footer-closing -> shell.floating-card |
| template.catalog-detail | shell.header -> hero.catalog-detail -> catalog.about -> catalog.capability-list? -> catalog.capability-list? -> cta.band? -> faq.accordion -> catalog.guides? -> catalog.related-grid? -> catalog.related-grid -> shell.footer-closing -> shell.floating-card |
| template.catalog-pair | shell.header -> hero.catalog-detail -> catalog.capability-list? -> faq.accordion -> catalog.related-grid? -> catalog.related-grid? -> shell.footer-closing -> shell.floating-card |
| template.blog-listing | shell.header -> content.blog-listing -> shell.footer-closing |
| template.blog-article | shell.header -> content.article -> shell.footer-closing |
| template.resources-hub | shell.header -> hero.resources -> content.resource-cards -> shell.footer-closing -> shell.floating-card |
| template.resource-category | shell.header -> hero.resources -> content.resource-cards -> content.resource-related -> faq.accordion -> shell.footer-closing -> shell.floating-card |
| template.resource-detail | shell.header -> content.resource-detail -> faq.accordion? -> content.resource-related? -> content.resource-related? -> shell.footer-closing -> shell.floating-card |
| template.legal | shell.header -> content.legal -> shell.footer-closing -> shell.floating-card |
| template.external-redirect | shell.header -> system.external-redirect -> shell.footer-closing -> shell.floating-card |
| template.not-found | shell.header -> system.not-found -> shell.footer-closing -> shell.floating-card? |

## Use

```bash
pip install jsonschema                                   # draft-07 validator
python3 schema/semantic_validate.py my.pagespec.json     # schema + every graph rule (incl. mode rules); exit 1 on error
python3 schema/tests/adversarial_test.py                 # every mutation rejected, every control passes
python3 extraction/verify_all.py                         # self-containment, parity, citations, counts
python3 extraction/prove_drift.py                        # proves verify_all fails on injected drift
python3 schema/build_schema.py                           # regenerate the schema after editing a section
```

A PageSpec picks a `mode`, a `template` and a concrete `route`, and its `nodes[]` must
follow that template's own node list. Each node carries closed `content` (word
budgets), `media` (slot + assetRole + policy-conformant ref) and `motion`. Motion
entries must reproduce the registry values for their pattern exactly, plus the
section's const `reducedMotionFallback`. There is no per-instance style or token
override field; styling belongs to the contracts (see `tokens/llm/token-policy.json`).

## Evidence

Every token, section, template, rule and role cites `{file, lines, quote}` in the
sibling source project (`CLONE_SPEC.md`, `specs/*.md`, `src/**`,
`tailwind.config.cjs`, `ia.json`). `verify_all.py` re-checks the range and the quoted
text whenever the source tree sits at `..` or `$DESIGN_REPO_SOURCE_ROOT`. In a
standalone copy it only WARNS. The repo was built from static evidence (no
browser). `extraction/measured-values.json` records the groundwork claims this
build found wrong.

## Versions

`allowlistVersion` and `pageSpecVersion` are machine-checked (VERSION_PARITY).
`repositoryVersion` is documentation-only. 1.1.0 adds the required `mode` field (a breaking
PageSpec change, hence the minor bump of pageSpecVersion and allowlistVersion). The zip `../design-repo.zip` is a build
artefact regenerated last. Never commit it next to this folder.
