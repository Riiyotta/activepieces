# https://www.activepieces.com/sitemap.xml (6,518 URLs, captured 2026-10-16) mapped onto the local React clone's route table in src/App.jsx

Source: https://www.activepieces.com/sitemap.xml (6,518 URLs, captured 2026-10-16) mapped onto the local React clone's route table in src/App.jsx
Status: **measured-from-sitemap-and-clone-source**
6518 routes · 23 templates · 66 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Piece integration pair, Resource detail, Blog article) account for 4854 of 6518 routes (74%). The remaining 1664 routes span 20 templates.

| template | routes | share |
|---|---:|---:|
| Piece integration pair | 3000 | 46% |
| Resource detail | 1063 | 16% |
| Blog article | 791 | 12% |
| Piece detail | 768 | 12% |
| MCP detail | 768 | 12% |
| Blog author | 56 | 1% |
| Catalog category (pieces + MCP) | 34 | 1% |
| Solution page | 10 | 0% |
| Blog category | 7 | 0% |
| Product page | 4 | 0% |
| Resource category | 4 | 0% |
| Legal | 2 | 0% |
| Homepage | 1 | 0% |
| Pricing | 1 | 0% |
| Talk to sales | 1 | 0% |
| Security | 1 | 0% |
| AI governance | 1 | 0% |
| Embed | 1 | 0% |
| OSS friends | 1 | 0% |
| Pieces catalog index | 1 | 0% |
| MCP catalog index | 1 | 0% |
| Blog index | 1 | 0% |
| Resources hub | 1 | 0% |

## Page chrome

**5661 routes carry chrome = `full`** — Homepage, Product page, Solution page, Security, AI governance, Embed, OSS friends, Pieces catalog index, MCP catalog index, Catalog category (pieces + MCP), Piece detail, MCP detail, Piece integration pair, Resources hub, Resource category, Resource detail, Legal.

**856 routes carry chrome = `full-no-floating-card`** — Pricing, Blog index, Blog article, Blog category, Blog author.

**1 routes carry chrome = `none`** — Talk to sales.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `chrome.header` | CHROME | 22 | 6517 | `Header.jsx` | Every template except /sales, which renders outside Layout. |
| `chrome.footer` | CHROME | 22 | 6517 | `Footer.jsx` | Every template except /sales. |
| `nav.breadcrumb` | NAV | 5 | 6390 | `catalog/parts.jsx > Breadcrumb; content/parts.jsx (article and resource breadcrumbs)` | Piece detail, MCP detail, piece pair, blog article and resource detail templates. |
| `chrome.floating-card` | CHROME | 17 | 5661 | `FloatingCard.jsx` | Every Layout template except /pricing and the blog templates (the live site also hides it on /sales, /admin and /customers). |
| `faq.accordion` | FAQ | 13 | 4591 | `Faq.jsx` | Homepage, product, solution, pricing, security, ai-governance, embed, pieces/MCP index, catalog category, piece/MCP detail and piece pair templates. |
| `catalog.related` | CATALOG | 3 | 4536 | `catalog/parts.jsx > RelatedGrid` | Piece detail, MCP detail and piece pair templates (twice on pair pages: one per piece). |
| `catalog.pair-hero` | CATALOG | 1 | 3000 | `pages/PairPage.jsx (recipe-hero)` | Piece pair template only. |
| `catalog.automation-ideas` | CATALOG | 1 | 3000 | `pages/PairPage.jsx + catalog/lib.js` | Piece pair template only. |
| `nav.toc` | NAV | 2 | 1854 | `content/parts.jsx > Toc; content/noToc.js` | Blog article and resource detail templates. |
| `cta.inline` | CTA | 2 | 1536 | `catalog/parts.jsx > InlineCta` | Piece detail and MCP detail templates. |
| `catalog.detail-hero` | CATALOG | 2 | 1536 | `pages/DetailPage.jsx > DetailHero` | Piece detail and MCP detail templates. |
| `catalog.about` | CATALOG | 2 | 1536 | `pages/DetailPage.jsx (inline)` | Piece detail and MCP detail templates. |
| `catalog.capabilities` | CATALOG | 2 | 1536 | `catalog/parts.jsx (capability sections)` | Piece detail and MCP detail templates. |
| `catalog.guides` | CATALOG | 2 | 1536 | `catalog/parts.jsx > GuidesSection` | Piece detail and MCP detail templates. |
| `faq.resource-faq` | FAQ | 2 | 1067 | `content/parts.jsx > ResourceFaq` | Resource category and resource detail templates. |
| `content.resource-body` | CONTENT | 1 | 1063 | `pages/resources/ResourceDetail.jsx > ResourceBody` | Resource detail only. |
| `content.related-resources` | CONTENT | 1 | 1063 | `content/parts.jsx > ResourceCard` | Resource detail only. |
| `content.progress-bar` | CONTENT | 1 | 791 | `pages/blog/BlogArticle.jsx > ProgressBar` | Blog article only. |
| `content.article-header` | CONTENT | 1 | 791 | `content/parts.jsx > HeroCover, AuthorChip, ShareButtons` | Blog article only. |
| `content.article-body` | CONTENT | 1 | 791 | `content/placeholder.jsx + content/prose.css + content/parts.jsx > ReadFullLink` | Blog article only. |
| `content.signup-card` | CONTENT | 1 | 791 | `pages/blog/BlogArticle.jsx > SignupCard + content/content.css` | Blog article only. |
| `content.keep-reading` | CONTENT | 1 | 791 | `pages/blog/BlogArticle.jsx + content/parts.jsx > PostCard` | Blog article only. |
| `catalog.pairings` | CATALOG | 1 | 768 | `catalog/parts.jsx > RelatedGrid (pairings variant)` | Piece detail only (MCP detail has no pairings). |
| `nav.pagination` | NAV | 3 | 64 | `content/parts.jsx > Pagination` | Blog index, blog category and blog author templates. |
| `hero.listing` | HERO | 3 | 64 | `pages/blog/BlogIndex.jsx, BlogCategory.jsx, BlogAuthor.jsx (inline)` | Blog index, blog category and blog author templates. |
| `content.post-grid` | CONTENT | 3 | 64 | `content/parts.jsx > PostGrid / PostCard` | Blog index, blog category and blog author templates. |
| `hero.catalog` | HERO | 3 | 36 | `catalog/heroes.jsx > PiecesHero | McpHero | CategoryHero` | Pieces index, MCP index and catalog category templates. |
| `catalog.browser` | CATALOG | 3 | 36 | `catalog/CatalogBrowser.jsx` | Pieces index, MCP index and catalog category templates. |
| `catalog.az-index` | CATALOG | 3 | 36 | `catalog/parts.jsx > AzIndex` | Pieces index, MCP index and catalog category templates. |
| `product.bento-grid` | PRODUCT | 4 | 16 | `BentoPlatformCard.jsx (shared card) via BentoPlatform.jsx, BentoSecond.jsx, templates/TemplateBento.jsx, embed/EmbedBento.jsx` | Homepage (twice), product, solution and embed templates. |
| `hero.template` | HERO | 2 | 14 | `templates/TemplateHero.jsx (+ templates/TablesDemo.jsx, templates/ChatDemo.jsx, FeatureFlowDemo.jsx, FeatureAgentsDemo.jsx, templates/solutionHeroMocks.jsx)` | Product and solution templates. |
| `proof.logo-rotator` | PROOF | 3 | 12 | `templates/LogoRotator.jsx (solutions, ai-governance); pricing/RotatingLogos.jsx (pricing) - two implementations of one section` | Solution, pricing and ai-governance templates. |
| `proof.case-study` | PROOF | 3 | 12 | `CaseFundingSocieties.jsx; CaseAlan.jsx` | Homepage (twice), solution template, /ai-governance. |
| `proof.testimonials` | PROOF | 2 | 11 | `Testimonials.jsx` | Homepage and solution template. |
| `nav.category-pills` | NAV | 2 | 8 | `content/parts.jsx > CategoryPills` | Blog index and blog category templates. |
| `hero.resources` | HERO | 2 | 5 | `resources/ResourcesHub.jsx > ResHero` | Resources hub and resource category templates. |
| `product.hero-columns` | PRODUCT | 1 | 4 | `templates/TemplateHero.jsx > HeroColumns` | Product template only. |
| `content.resource-listing` | CONTENT | 1 | 4 | `pages/resources/ResourceCategory.jsx > CategoryView + content/parts.jsx > ResourceCard, ResEmpty` | Resource category template only. |
| `content.keep-exploring` | CONTENT | 1 | 4 | `pages/resources/ResourceCategory.jsx > KeepExploring` | Resource category template only. |
| `overlay.use-in-ai-dialog` | OVERLAY | 2 | 2 | `UseInAiDialog.jsx` | Opened from the homepage hero button and from the MCP index's client cards. |
| `product.icon-band` | PRODUCT | 2 | 2 | `IconBand.jsx` | /security and /ai-governance. |
| `catalog.category-grid` | CATALOG | 2 | 2 | `catalog/parts.jsx > CategoryGrid` | Pieces index and MCP index only (rendered only when there are category cards). |
| `legal.nav` | LEGAL | 1 | 2 | `pages/Legal.jsx` | Legal template only. |
| `legal.document` | LEGAL | 1 | 2 | `pages/Legal.jsx > LegalSection, SubSection + content/prose.css (.legal-prose)` | Legal template only. |
| `hero.home` | HERO | 1 | 1 | `Hero.jsx` | Homepage only. |
| `hero.embed` | HERO | 1 | 1 | `embed/EmbedHero.jsx` | /embed only. |
| `hero.security` | HERO | 1 | 1 | `security/SecurityHero.jsx (+ cipherWall.js, lockGeometry.js, GlyphField.jsx)` | /security only. |
| `hero.governance` | HERO | 1 | 1 | `governance/GovernanceHero.jsx` | /ai-governance only. |
| `proof.customer-marquee` | PROOF | 1 | 1 | `Hero.jsx (marquee)` | Homepage only. |
| `product.app-mockup` | PRODUCT | 1 | 1 | `AppMockup.jsx` | Homepage only. |
| `product.dream-story` | PRODUCT | 1 | 1 | `Dream.jsx (+ DreamWindows.jsx)` | Homepage only. |
| `product.feature-agents` | PRODUCT | 1 | 1 | `FeatureAgents.jsx + FeatureAgentsDemo.jsx` | Homepage only (the demo itself is reused inside hero.template). |
| `product.feature-flow` | PRODUCT | 1 | 1 | `FeatureFlow.jsx + FeatureFlowDemo.jsx` | Homepage only (the demo itself is reused inside hero.template and hero.embed). |
| `product.pieces-mosaic` | PRODUCT | 1 | 1 | `FeaturePieces.jsx` | Homepage only. |
| `product.feature-rows` | PRODUCT | 1 | 1 | `security/FeatureRows.jsx + StageVisuals.jsx` | /security only. |
| `product.models-grid` | PRODUCT | 1 | 1 | `governance/ModelsGrid.jsx` | /ai-governance only. |
| `product.rollout-deck` | PRODUCT | 1 | 1 | `governance/RolloutDeck.jsx + DeckVisuals.jsx` | /ai-governance only. |
| `cta.band` | CTA | 1 | 1 | `CtaShip.jsx; CtaRollout.jsx` | Homepage only (two instances). |
| `pricing.plans` | PRICING | 1 | 1 | `pricing/BillingToggle.jsx + PlanCards.jsx + AnimatedNumber.jsx + InfoTip.jsx` | /pricing only. |
| `pricing.split-rows` | PRICING | 1 | 1 | `pricing/SplitRows.jsx` | /pricing only. |
| `pricing.compare-table` | PRICING | 1 | 1 | `pricing/CompareTable.jsx` | /pricing only. |
| `form.sales-form` | FORM | 1 | 1 | `sales/SalesForm.jsx` | /sales only. |
| `proof.sales-pitch` | PROOF | 1 | 1 | `pages/Sales.jsx + sales/SalesLogoGrid.jsx` | /sales only. |
| `content.oss-friends-grid` | CONTENT | 1 | 1 | `pages/OssFriends.jsx > FriendCard` | /oss-friends only. |
| `content.featured-post` | CONTENT | 1 | 1 | `pages/blog/BlogIndex.jsx > Featured` | Blog index first page only. |
| `content.resource-type-grid` | CONTENT | 1 | 1 | `pages/resources/ResourcesHub.jsx (inline)` | Resources hub only. |

**29 shared sections** appear in more than one template and belong in a component library.

**37 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Homepage — `template.home`

1 route · `/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | HERO | `hero.home` | page-local |
| 3 | PROOF | `proof.customer-marquee` | page-local |
| 4 | PRODUCT | `product.app-mockup` | page-local |
| 5 | PRODUCT | `product.dream-story` | page-local |
| 6 | PROOF | `proof.case-study` | shared ×3 |
| 7 | CTA | `cta.band` | page-local |
| 8 | PRODUCT | `product.feature-agents` | page-local |
| 9 | PRODUCT | `product.feature-flow` | page-local |
| 10 | PRODUCT | `product.bento-grid` | shared ×4 |
| 11 | CTA | `cta.band` | page-local |
| 12 | PROOF | `proof.case-study` | shared ×3 |
| 13 | PRODUCT | `product.pieces-mosaic` | page-local |
| 14 | PRODUCT | `product.bento-grid` | shared ×4 |
| 15 | PROOF | `proof.testimonials` | shared ×2 |
| 16 | FAQ | `faq.accordion` | shared ×13 |
| 17 | OVERLAY | `overlay.use-in-ai-dialog` | shared ×2 |
| 18 | CHROME | `chrome.footer` | shared ×22 |
| 19 | CHROME | `chrome.floating-card` | shared ×17 |

### Product page — `template.product`

4 routes · `/product/workflow-builder`, `/product/ai-agent-builder`, `/product/tables`, `/product/chat` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | HERO | `hero.template` | shared ×2 |
| 3 | PRODUCT | `product.hero-columns` | page-local |
| 4 | PRODUCT | `product.bento-grid` | shared ×4 |
| 5 | FAQ | `faq.accordion` | shared ×13 |
| 6 | CHROME | `chrome.footer` | shared ×22 |
| 7 | CHROME | `chrome.floating-card` | shared ×17 |

### Solution page — `template.solution`

10 routes · `/solutions/marketing`, `/solutions/sales`, `/solutions/customer-support`, `/solutions/finance`, `/solutions/hr`, `/solutions/operations`, `/solutions/engineering`, `/solutions/it`, `/solutions/internal-tools`, `/solutions/open-source-developers` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | HERO | `hero.template` | shared ×2 |
| 3 | PROOF | `proof.logo-rotator` | shared ×3 |
| 4 | PRODUCT | `product.bento-grid` | shared ×4 |
| 5 | PROOF | `proof.case-study` | shared ×3 |
| 6 | PROOF | `proof.testimonials` | shared ×2 |
| 7 | FAQ | `faq.accordion` | shared ×13 |
| 8 | CHROME | `chrome.footer` | shared ×22 |
| 9 | CHROME | `chrome.floating-card` | shared ×17 |

### Pricing — `template.pricing`

1 route · `/pricing` · chrome: **full-no-floating-card**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | PRICING | `pricing.plans` | page-local |
| 3 | PRICING | `pricing.split-rows` | page-local |
| 4 | PROOF | `proof.logo-rotator` | shared ×3 |
| 5 | PRICING | `pricing.compare-table` | page-local |
| 6 | FAQ | `faq.accordion` | shared ×13 |
| 7 | CHROME | `chrome.footer` | shared ×22 |

### Talk to sales — `template.sales`

1 route · `/sales` · chrome: **none**

| # | category | section | |
|---:|---|---|---|
| 1 | FORM | `form.sales-form` | page-local |
| 2 | PROOF | `proof.sales-pitch` | page-local |

### Security — `template.security`

1 route · `/security` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | HERO | `hero.security` | page-local |
| 3 | PRODUCT | `product.feature-rows` | page-local |
| 4 | PRODUCT | `product.icon-band` | shared ×2 |
| 5 | FAQ | `faq.accordion` | shared ×13 |
| 6 | CHROME | `chrome.footer` | shared ×22 |
| 7 | CHROME | `chrome.floating-card` | shared ×17 |

### AI governance — `template.ai-governance`

1 route · `/ai-governance` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | HERO | `hero.governance` | page-local |
| 3 | PROOF | `proof.logo-rotator` | shared ×3 |
| 4 | PRODUCT | `product.models-grid` | page-local |
| 5 | PROOF | `proof.case-study` | shared ×3 |
| 6 | PRODUCT | `product.rollout-deck` | page-local |
| 7 | PRODUCT | `product.icon-band` | shared ×2 |
| 8 | FAQ | `faq.accordion` | shared ×13 |
| 9 | CHROME | `chrome.footer` | shared ×22 |
| 10 | CHROME | `chrome.floating-card` | shared ×17 |

### Embed — `template.embed`

1 route · `/embed` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | HERO | `hero.embed` | page-local |
| 3 | PRODUCT | `product.bento-grid` | shared ×4 |
| 4 | FAQ | `faq.accordion` | shared ×13 |
| 5 | CHROME | `chrome.footer` | shared ×22 |
| 6 | CHROME | `chrome.floating-card` | shared ×17 |

### OSS friends — `template.oss-friends`

1 route · `/oss-friends` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | CONTENT | `content.oss-friends-grid` | page-local |
| 3 | CHROME | `chrome.footer` | shared ×22 |
| 4 | CHROME | `chrome.floating-card` | shared ×17 |

### Pieces catalog index — `template.pieces-index`

1 route · `/pieces` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | HERO | `hero.catalog` | shared ×3 |
| 3 | CATALOG | `catalog.browser` | shared ×3 |
| 4 | CATALOG | `catalog.category-grid` | shared ×2 |
| 5 | FAQ | `faq.accordion` | shared ×13 |
| 6 | CATALOG | `catalog.az-index` | shared ×3 |
| 7 | CHROME | `chrome.footer` | shared ×22 |
| 8 | CHROME | `chrome.floating-card` | shared ×17 |

### MCP catalog index — `template.mcp-index`

1 route · `/mcp` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | HERO | `hero.catalog` | shared ×3 |
| 3 | CATALOG | `catalog.browser` | shared ×3 |
| 4 | CATALOG | `catalog.category-grid` | shared ×2 |
| 5 | FAQ | `faq.accordion` | shared ×13 |
| 6 | CATALOG | `catalog.az-index` | shared ×3 |
| 7 | OVERLAY | `overlay.use-in-ai-dialog` | shared ×2 |
| 8 | CHROME | `chrome.footer` | shared ×22 |
| 9 | CHROME | `chrome.floating-card` | shared ×17 |

### Catalog category (pieces + MCP) — `template.catalog-category`

34 routes · `/pieces/category/{key} and /mcp/category/{key} (17 keys each)` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | HERO | `hero.catalog` | shared ×3 |
| 3 | CATALOG | `catalog.browser` | shared ×3 |
| 4 | FAQ | `faq.accordion` | shared ×13 |
| 5 | CATALOG | `catalog.az-index` | shared ×3 |
| 6 | CHROME | `chrome.footer` | shared ×22 |
| 7 | CHROME | `chrome.floating-card` | shared ×17 |

### Piece detail — `template.piece-detail`

768 routes · `/pieces/{slug} (768 slugs from src/data/pieces.json)` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | NAV | `nav.breadcrumb` | shared ×5 |
| 3 | CATALOG | `catalog.detail-hero` | shared ×2 |
| 4 | CATALOG | `catalog.about` | shared ×2 |
| 5 | CATALOG | `catalog.capabilities` | shared ×2 |
| 6 | CTA | `cta.inline` | shared ×2 |
| 7 | FAQ | `faq.accordion` | shared ×13 |
| 8 | CATALOG | `catalog.guides` | shared ×2 |
| 9 | CATALOG | `catalog.pairings` | page-local |
| 10 | CATALOG | `catalog.related` | shared ×3 |
| 11 | CHROME | `chrome.footer` | shared ×22 |
| 12 | CHROME | `chrome.floating-card` | shared ×17 |

### MCP detail — `template.mcp-detail`

768 routes · `/mcp/{slug} (768 slugs from src/data/pieces.json)` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | NAV | `nav.breadcrumb` | shared ×5 |
| 3 | CATALOG | `catalog.detail-hero` | shared ×2 |
| 4 | CATALOG | `catalog.about` | shared ×2 |
| 5 | CATALOG | `catalog.capabilities` | shared ×2 |
| 6 | CTA | `cta.inline` | shared ×2 |
| 7 | FAQ | `faq.accordion` | shared ×13 |
| 8 | CATALOG | `catalog.guides` | shared ×2 |
| 9 | CATALOG | `catalog.related` | shared ×3 |
| 10 | CHROME | `chrome.footer` | shared ×22 |
| 11 | CHROME | `chrome.floating-card` | shared ×17 |

### Piece integration pair — `template.piece-pair`

3000 routes · `/pieces/{a}/{b} (3,000 listed in the sitemap: 250 sources x 12 targets; the clone accepts any two distinct valid slugs)` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | NAV | `nav.breadcrumb` | shared ×5 |
| 3 | CATALOG | `catalog.pair-hero` | page-local |
| 4 | CATALOG | `catalog.automation-ideas` | page-local |
| 5 | FAQ | `faq.accordion` | shared ×13 |
| 6 | CATALOG | `catalog.related` | shared ×3 |
| 7 | CATALOG | `catalog.related` | shared ×3 |
| 8 | CHROME | `chrome.footer` | shared ×22 |
| 9 | CHROME | `chrome.floating-card` | shared ×17 |

### Blog index — `template.blog-index`

1 route · `/blog` · chrome: **full-no-floating-card**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | HERO | `hero.listing` | shared ×3 |
| 3 | NAV | `nav.category-pills` | shared ×2 |
| 4 | CONTENT | `content.featured-post` | page-local |
| 5 | CONTENT | `content.post-grid` | shared ×3 |
| 6 | NAV | `nav.pagination` | shared ×3 |
| 7 | CHROME | `chrome.footer` | shared ×22 |

### Blog article — `template.blog-article`

791 routes · `/blog/{slug} (791 in the sitemap; 796 in src/data/blog.json)` · chrome: **full-no-floating-card**

| # | category | section | |
|---:|---|---|---|
| 1 | CONTENT | `content.progress-bar` | page-local |
| 2 | CHROME | `chrome.header` | shared ×22 |
| 3 | NAV | `nav.breadcrumb` | shared ×5 |
| 4 | NAV | `nav.toc` | shared ×2 |
| 5 | CONTENT | `content.article-header` | page-local |
| 6 | CONTENT | `content.article-body` | page-local |
| 7 | CONTENT | `content.signup-card` | page-local |
| 8 | CONTENT | `content.keep-reading` | page-local |
| 9 | CHROME | `chrome.footer` | shared ×22 |

### Blog category — `template.blog-category`

7 routes · `/blog/category/{slug}` · chrome: **full-no-floating-card**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | HERO | `hero.listing` | shared ×3 |
| 3 | NAV | `nav.category-pills` | shared ×2 |
| 4 | CONTENT | `content.post-grid` | shared ×3 |
| 5 | NAV | `nav.pagination` | shared ×3 |
| 6 | CHROME | `chrome.footer` | shared ×22 |

### Blog author — `template.blog-author`

56 routes · `/blog/author/{slug} (56 in the sitemap; 95 authors in src/data/blog.json)` · chrome: **full-no-floating-card**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | HERO | `hero.listing` | shared ×3 |
| 3 | CONTENT | `content.post-grid` | shared ×3 |
| 4 | NAV | `nav.pagination` | shared ×3 |
| 5 | CHROME | `chrome.footer` | shared ×22 |

### Resources hub — `template.resources-hub`

1 route · `/resources` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | HERO | `hero.resources` | shared ×2 |
| 3 | CONTENT | `content.resource-type-grid` | page-local |
| 4 | CHROME | `chrome.footer` | shared ×22 |
| 5 | CHROME | `chrome.floating-card` | shared ×17 |

### Resource category — `template.resource-category`

4 routes · `/resources/glossary`, `/resources/automation-guides`, `/resources/automation-use-cases`, `/resources/integration-use-cases` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | HERO | `hero.resources` | shared ×2 |
| 3 | CONTENT | `content.resource-listing` | page-local |
| 4 | CONTENT | `content.keep-exploring` | page-local |
| 5 | FAQ | `faq.resource-faq` | shared ×2 |
| 6 | CHROME | `chrome.footer` | shared ×22 |
| 7 | CHROME | `chrome.floating-card` | shared ×17 |

### Resource detail — `template.resource-detail`

1063 routes · `/resources/{category}/{slug}` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | NAV | `nav.breadcrumb` | shared ×5 |
| 3 | CONTENT | `content.resource-body` | page-local |
| 4 | NAV | `nav.toc` | shared ×2 |
| 5 | FAQ | `faq.resource-faq` | shared ×2 |
| 6 | CONTENT | `content.related-resources` | page-local |
| 7 | CHROME | `chrome.footer` | shared ×22 |
| 8 | CHROME | `chrome.floating-card` | shared ×17 |

### Legal — `template.legal`

2 routes · `/privacy`, `/terms` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.header` | shared ×22 |
| 2 | LEGAL | `legal.nav` | page-local |
| 3 | LEGAL | `legal.document` | page-local |
| 4 | CHROME | `chrome.footer` | shared ×22 |
| 5 | CHROME | `chrome.floating-card` | shared ×17 |

## Section reference

### CHROME

_Site-wide shell rendered by src/components/Layout.jsx around every routed page._

**`chrome.header`** — Fixed floating 'island' header: wordmark, Product/Solutions/Enterprise mega-dropdowns with a sliding highlight, Open app + Talk to sales CTAs, burger sheet below 1024px; hides on scroll-down past 160px. Transparent 'on-art' state only on the homepage.

· Every template except /sales, which renders outside Layout. · appears on 6517 routes · implemented by `Header.jsx`

**`chrome.footer`** — Closing CTA over the meadow image (heading, lede, two buttons, optional reassurance list set per page via PageMetaContext/usePageClosing) followed by the multi-column links card with legal links and the YC badge.

· Every template except /sales. · appears on 6517 routes · implemented by `Footer.jsx`

**`chrome.floating-card`** — Fixed 'See it in action / Book a 30-min demo' card that fades in after scrollY > 100 and can be dismissed.

· Every Layout template except /pricing and the blog templates (the live site also hides it on /sales, /admin and /customers). · appears on 5661 routes · implemented by `FloatingCard.jsx`

### OVERLAY

_Modal/dialog layers opened from within a page rather than occupying a slot in the page flow._

**`overlay.use-in-ai-dialog`** — MCP 'Use in your AI' connect dialog: rail of 11 AI clients, per-client mode switch (One click / Config file / Ask the agent), code and prompt cards with copy buttons; bottom sheet below 768px.

· Opened from the homepage hero button and from the MCP index's client cards. · appears on 2 routes · implemented by `UseInAiDialog.jsx`

### NAV

_In-page wayfinding: breadcrumbs, pagination, category pills, tables of contents._

**`nav.breadcrumb`** — Small trail of parent links above a detail page's hero.

· Piece detail, MCP detail, piece pair, blog article and resource detail templates. · appears on 6390 routes · implemented by `catalog/parts.jsx > Breadcrumb; content/parts.jsx (article and resource breadcrumbs)`

**`nav.category-pills`** — Horizontal row of blog category pills ('All' plus each category) with the active one filled.

· Blog index and blog category templates. · appears on 8 routes · implemented by `content/parts.jsx > CategoryPills`

**`nav.pagination`** — Numbered page links with a windowed range and prev/next arrows for blog listings.

· Blog index, blog category and blog author templates. · appears on 64 routes · implemented by `content/parts.jsx > Pagination`

**`nav.toc`** — Sticky 'On this page' rail with scroll-spy over the body's h2s; on articles it shows only at >=1280px and only when the article has a rail on the live site (hasToc or not in the 63-slug NO_TOC list).

· Blog article and resource detail templates. · appears on 1854 routes · implemented by `content/parts.jsx > Toc; content/noToc.js`

### HERO

_The first block under the header that names the page and carries its primary CTAs._

**`hero.home`** — Homepage hero: sky background with two layered plates fading in, non-animated H1, staggered subhead and CTAs including the 'Use in your AI' button with its logo fan and sheen.

· Homepage only. · appears on 1 routes · implemented by `Hero.jsx`

**`hero.template`** — Left-aligned product/solution hero: H1, lede, dark 'Start building' + secondary CTA, then a 32px-radius stage with a background image holding a demo (flow, agent, tables or chat) or a static solution mock. Entrance .tpl-line (.64s, i x 70ms).

· Product and solution templates. · appears on 14 routes · implemented by `templates/TemplateHero.jsx (+ templates/TablesDemo.jsx, templates/ChatDemo.jsx, FeatureFlowDemo.jsx, FeatureAgentsDemo.jsx, templates/solutionHeroMocks.jsx)`

**`hero.embed`** — Embed product hero: same markup family as hero.template but a separate component, with the homepage flow-canvas demo in the stage and three highlight columns below.

· /embed only. · appears on 1 routes · implemented by `embed/EmbedHero.jsx`

**`hero.security`** — Dark security hero with the animated ASCII cipher-wall canvas and rotating 3D lock, plus a four-fact row.

· /security only. · appears on 1 routes · implemented by `security/SecurityHero.jsx (+ cipherWall.js, lockGeometry.js, GlyphField.jsx)`

**`hero.governance`** — Image-card hero with a 1280x720 admin-screen mock scaled into place and a customer-logo bar pinned to the viewport bottom.

· /ai-governance only. · appears on 1 routes · implemented by `governance/GovernanceHero.jsx`

**`hero.catalog`** — Catalog hero in three variants: /pieces 3D logo scatter (>=1152px) or logo cluster, /mcp scatter plus five client cards that open the connect dialog, and a plain left-aligned hero for category pages.

· Pieces index, MCP index and catalog category templates. · appears on 36 routes · implemented by `catalog/heroes.jsx > PiecesHero | McpHero | CategoryHero`

**`hero.resources`** — Soft-gradient resources hero with staggered blur-in lines (.res-hero-line): optional breadcrumb, H1, subtitle, buttons.

· Resources hub and resource category templates. · appears on 5 routes · implemented by `resources/ResourcesHub.jsx > ResHero`

**`hero.listing`** — Plain listing header: H1 with the blog title, category name or author name (author variant adds avatar and bio line); the index variant adds the search field.

· Blog index, blog category and blog author templates. · appears on 64 routes · implemented by `pages/blog/BlogIndex.jsx, BlogCategory.jsx, BlogAuthor.jsx (inline)`

### PRODUCT

_Blocks that explain or demonstrate product capability (demos, bento grids, feature rows, scroll stories)._

**`product.app-mockup`** — Large app-window mockup card that overlaps the hero by -308px (2/1 desktop, 4/3 at >=640, 2/3 below).

· Homepage only. · appears on 1 routes · implemented by `AppMockup.jsx`

**`product.dream-story`** — Sticky 420svh scroll story: three text beats, seven app windows flying in and collapsing, and a 9-card wire diagram drawing itself; a one-shot 2.4s animation at <=1023px.

· Homepage only. · appears on 1 routes · implemented by `Dream.jsx (+ DreamWindows.jsx)`

**`product.feature-agents`** — 'Agents that get the job done' feature block with the scripted agent-thread demo (fake cursor, tool calls, approve).

· Homepage only (the demo itself is reused inside hero.template). · appears on 1 routes · implemented by `FeatureAgents.jsx + FeatureAgentsDemo.jsx`

**`product.feature-flow`** — 'Simple by default. Deep on demand.' feature block with the scripted flow-canvas demo.

· Homepage only (the demo itself is reused inside hero.template and hero.embed). · appears on 1 routes · implemented by `FeatureFlow.jsx + FeatureFlowDemo.jsx`

**`product.hero-columns`** — Three text columns under a product hero's stage describing the product's pillars.

· Product template only. · appears on 4 routes · implemented by `templates/TemplateHero.jsx > HeroColumns`

**`product.bento-grid`** — Heading plus a 24-column bento grid of cards, each with a title, description and a mock UI sheet over an art background.

· Homepage (twice), product, solution and embed templates. · appears on 16 routes · implemented by `BentoPlatformCard.jsx (shared card) via BentoPlatform.jsx, BentoSecond.jsx, templates/TemplateBento.jsx, embed/EmbedBento.jsx`

**`product.pieces-mosaic`** — '760+ open-source pieces' logo mosaic spelling 760+, popping in on mount and swapping one logo every 820ms.

· Homepage only. · appears on 1 routes · implemented by `FeaturePieces.jsx`

**`product.feature-rows`** — Scroll section whose right-hand stage stays pinned and swaps between three mock visuals as each text row reaches mid-viewport.

· /security only. · appears on 1 routes · implemented by `security/FeatureRows.jsx + StageVisuals.jsx`

**`product.icon-band`** — Heading plus a band of icon cards (six on security, nine on ai-governance) with solid or gradient background.

· /security and /ai-governance. · appears on 2 routes · implemented by `IconBand.jsx`

**`product.models-grid`** — Scroll-scrubbed grid of five cards and eight AI-model tiles flying into place; pins only at >=1280x768.

· /ai-governance only. · appears on 1 routes · implemented by `governance/ModelsGrid.jsx`

**`product.rollout-deck`** — Pinned four-panel deck that opens one panel at a time as the user scrolls.

· /ai-governance only. · appears on 1 routes · implemented by `governance/RolloutDeck.jsx + DeckVisuals.jsx`

### PROOF

_Social proof: customer logos, case studies, testimonials._

**`proof.customer-marquee`** — Infinite right-to-left marquee of 24 customer logos with faded edges (82.8s loop >=768px, 72s below).

· Homepage only. · appears on 1 routes · implemented by `Hero.jsx (marquee)`

**`proof.logo-rotator`** — Grid of six customer logos that swaps to the next set every 3.5s with a 40ms per-cell stagger.

· Solution, pricing and ai-governance templates. · appears on 12 routes · implemented by `templates/LogoRotator.jsx (solutions, ai-governance); pricing/RotatingLogos.jsx (pricing) - two implementations of one section`

**`proof.case-study`** — Customer case study: logo, large Sentient quote with attribution, three-stat row (v4 divide semantics).

· Homepage (twice), solution template, /ai-governance. · appears on 12 routes · implemented by `CaseFundingSocieties.jsx; CaseAlan.jsx`

**`proof.testimonials`** — Nine review cards in up to three columns with a bottom fade, review-source logos and a two-stat block; heading set per page.

· Homepage and solution template. · appears on 11 routes · implemented by `Testimonials.jsx`

**`proof.sales-pitch`** — Sticky pitch card beside the sales form: quote plus a logo grid swapping one random logo every 1.4s, joined to the form by a white 'bridge' notch.

· /sales only. · appears on 1 routes · implemented by `pages/Sales.jsx + sales/SalesLogoGrid.jsx`

### CTA

_Standalone conversion bands between content sections (not the footer's closing CTA)._

**`cta.band`** — Full-width rounded CTA card with a 28px heading, one line of copy and brand + secondary buttons.

· Homepage only (two instances). · appears on 1 routes · implemented by `CtaShip.jsx; CtaRollout.jsx`

**`cta.inline`** — Compact mid-page CTA (title, body, Start building) inside catalog detail pages, shown only when the piece has capability sections.

· Piece detail and MCP detail templates. · appears on 1536 routes · implemented by `catalog/parts.jsx > InlineCta`

### PRICING

_Plan, price and comparison blocks specific to /pricing._

**`pricing.plans`** — Plans header with the Monthly/Annual clip-path toggle and four plan cards with count-up prices and hover tooltips.

· /pricing only. · appears on 1 routes · implemented by `pricing/BillingToggle.jsx + PlanCards.jsx + AnimatedNumber.jsx + InfoTip.jsx`

**`pricing.split-rows`** — Embed and Enterprise rows sharing one background image.

· /pricing only. · appears on 1 routes · implemented by `pricing/SplitRows.jsx`

**`pricing.compare-table`** — Feature comparison table with a sticky header on desktop that becomes plan tabs below 1024px (Plus selected).

· /pricing only. · appears on 1 routes · implemented by `pricing/CompareTable.jsx`

### FORM

_Data-entry blocks._

**`form.sales-form`** — Talk-to-sales form card: work-email validation with error text, conditional 'Other' input and a 'Thanks, {name}' end state; never submits over the network.

· /sales only. · appears on 1 routes · implemented by `sales/SalesForm.jsx`

### CATALOG

_Data-driven blocks fed by src/data/pieces.json and public/data/pieces/<slug>.json._

**`catalog.browser`** — Searchable catalog grid: 120ms debounced search, multi-select category filter, sort (Popular / A-Z / Most actions|tools), 24 per page with Show more, URL sync, empty state.

· Pieces index, MCP index and catalog category templates. · appears on 36 routes · implemented by `catalog/CatalogBrowser.jsx`

**`catalog.category-grid`** — Grid of category cards linking to each category page.

· Pieces index and MCP index only (rendered only when there are category cards). · appears on 2 routes · implemented by `catalog/parts.jsx > CategoryGrid`

**`catalog.az-index`** — Collapsible A-Z list of every piece link.

· Pieces index, MCP index and catalog category templates. · appears on 36 routes · implemented by `catalog/parts.jsx > AzIndex`

**`catalog.detail-hero`** — Piece/MCP detail hero: logo, name, description, CTAs and a facts row (auth, version, updated, counts).

· Piece detail and MCP detail templates. · appears on 1536 routes · implemented by `pages/DetailPage.jsx > DetailHero`

**`catalog.about`** — Short 'About' block describing the piece.

· Piece detail and MCP detail templates. · appears on 1536 routes · implemented by `pages/DetailPage.jsx (inline)`

**`catalog.capabilities`** — Lists of the piece's triggers and actions (or tools and triggers for MCP), one section per non-empty kind.

· Piece detail and MCP detail templates. · appears on 1536 routes · implemented by `catalog/parts.jsx (capability sections)`

**`catalog.guides`** — 'Guides using {piece}' links into the blog, when the piece has any.

· Piece detail and MCP detail templates. · appears on 1536 routes · implemented by `catalog/parts.jsx > GuidesSection`

**`catalog.pairings`** — 'Popular {piece} pairings' grid linking to pair pages.

· Piece detail only (MCP detail has no pairings). · appears on 768 routes · implemented by `catalog/parts.jsx > RelatedGrid (pairings variant)`

**`catalog.related`** — Grid of related pieces with a 'browse all' link.

· Piece detail, MCP detail and piece pair templates (twice on pair pages: one per piece). · appears on 4536 routes · implemented by `catalog/parts.jsx > RelatedGrid`

**`catalog.pair-hero`** — Pair hero with both piece logos, the integration headline and four facts.

· Piece pair template only. · appears on 3000 routes · implemented by `pages/PairPage.jsx (recipe-hero)`

**`catalog.automation-ideas`** — Generated automation ideas combining A's triggers with B's actions and vice versa (algorithm in catalog/lib.js).

· Piece pair template only. · appears on 3000 routes · implemented by `pages/PairPage.jsx + catalog/lib.js`

### CONTENT

_Blog/resources listing and reading blocks fed by src/data/blog.json and src/data/resources.json (metadata only; bodies are placeholders by policy)._

**`content.oss-friends-grid`** — Heading, link cards for open-source friend projects (local logos with first-letter fallback) and a credits block.

· /oss-friends only. · appears on 1 routes · implemented by `pages/OssFriends.jsx > FriendCard`

**`content.featured-post`** — Latest post featured large (two columns at >=1024px) with its generated cover.

· Blog index first page only. · appears on 1 routes · implemented by `pages/blog/BlogIndex.jsx > Featured`

**`content.post-grid`** — 12-card post grid (3/2/1 columns) with covers, titles, excerpts and meta.

· Blog index, blog category and blog author templates. · appears on 64 routes · implemented by `content/parts.jsx > PostGrid / PostCard`

**`content.progress-bar`** — 2px reading-progress bar fixed at the top of the viewport.

· Blog article only. · appears on 791 routes · implemented by `pages/blog/BlogArticle.jsx > ProgressBar`

**`content.article-header`** — 3:1 cover banner with live title text, excerpt, author chip with hover popover, and share buttons.

· Blog article only. · appears on 791 routes · implemented by `content/parts.jsx > HeroCover, AuthorChip, ShareButtons`

**`content.article-body`** — Prose column rendering the placeholder body (all prose styles) plus the 'Read the full article on activepieces.com' link; real bodies are intentionally not stored.

· Blog article only. · appears on 791 routes · implemented by `content/placeholder.jsx + content/prose.css + content/parts.jsx > ReadFullLink`

**`content.signup-card`** — Sticky sign-up card in the right rail with five peeking bot avatars (5s peek loop, hover pose), at >=1024px.

· Blog article only. · appears on 791 routes · implemented by `pages/blog/BlogArticle.jsx > SignupCard + content/content.css`

**`content.keep-reading`** — Closing CTA card (four copy variants chosen by slug) and three same-category 'Keep reading' cards.

· Blog article only. · appears on 791 routes · implemented by `pages/blog/BlogArticle.jsx + content/parts.jsx > PostCard`

**`content.resource-type-grid`** — Tiles linking to the four resource types (glossary, automation guides, automation use cases, integration use cases).

· Resources hub only. · appears on 1 routes · implemented by `pages/resources/ResourcesHub.jsx (inline)`

**`content.resource-listing`** — Resource listing: glossary letter jump-nav with per-letter sections, or 24 cards with Show more for the other types; search with empty state.

· Resource category template only. · appears on 4 routes · implemented by `pages/resources/ResourceCategory.jsx > CategoryView + content/parts.jsx > ResourceCard, ResEmpty`

**`content.keep-exploring`** — 'Keep exploring.' cross-links to the other resource types.

· Resource category template only. · appears on 4 routes · implemented by `pages/resources/ResourceCategory.jsx > KeepExploring`

**`content.resource-body`** — 704px resource article with placeholder body, 'Build this in Activepieces' box, 'Apps in this guide' and the read-full link.

· Resource detail only. · appears on 1063 routes · implemented by `pages/resources/ResourceDetail.jsx > ResourceBody`

**`content.related-resources`** — Six related resource cards.

· Resource detail only. · appears on 1063 routes · implemented by `content/parts.jsx > ResourceCard`

### FAQ

_Question/answer accordions._

**`faq.accordion`** — Single-open FAQ accordion (first item open, 200ms height/opacity, plus icon rotates 45 degrees); heading and items passed per page.

· Homepage, product, solution, pricing, security, ai-governance, embed, pieces/MCP index, catalog category, piece/MCP detail and piece pair templates. · appears on 4591 routes · implemented by `Faq.jsx`

**`faq.resource-faq`** — Multi-open FAQ with instant toggles (first item open); a different behaviour from faq.accordion, hence a separate component.

· Resource category and resource detail templates. · appears on 1067 routes · implemented by `content/parts.jsx > ResourceFaq`

### LEGAL

_Blocks specific to /privacy and /terms._

**`legal.nav`** — Sticky 'Legal' side nav (272px column, collapsible on mobile) listing the document's sections.

· Legal template only. · appears on 2 routes · implemented by `pages/Legal.jsx`

**`legal.document`** — 848px legal column with numbered all-caps headings hanging in the gutter at >=1024px, placeholder text and a link to the full document on activepieces.com.

· Legal template only. · appears on 2 routes · implemented by `pages/Legal.jsx > LegalSection, SubSection + content/prose.css (.legal-prose)`
