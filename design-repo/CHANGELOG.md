# Changelog

## 1.0.0 (2026-10-16): initial from-scratch build

- Tokens: 230 (foundation 167, semantic 35), single light theme, LLM catalog/policy/allowlist.
- 8 primitives, 20 components, 42 section contracts (76 variants), 21 templates, 30 route patterns (mirrors src/App.jsx, including the `/docs/*` ExternalRedirect route added during this build).
- 21 closed asset roles (5 pinned to placeholder-only), 42 motion patterns, 31 graph rules (each one implemented in semantic_validate.py), 14 Tailwind v3/v4 rules.
- Validator: cross-references nodes[] against the declared template's real node list; route/param matching; floating-card route regex; real-entity denylist; verbatim-copy fingerprints; no stored bodies.
- The adversarial suite synthesizes a control for every template and every route generically. That synthesis found and fixed a validator bug: an optional slot was not skipped when the same section appeared later with a different variant (`/mcp/:slug` has no pairings row). Guard mutations were added for it.
- Source changes during the build (MASTER-GUIDE 3.11): blog.json went from 793 to 796 posts (2 with `listed:false`); `/docs/*` -> ExternalRedirect was added; BlogAuthor gained a bio; the article author link falls back to 'activepieces'. All are reflected and re-checked against the current source.
