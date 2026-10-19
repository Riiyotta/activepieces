# Asset manifest — activepieces.com homepage

Source: https://www.activepieces.com/

Measured 2026-10-16 via Playwright network log + DOM/CSS URL sweep (img src, mask-image, background-image) after scrolling the whole page at 1440px, then each URL fetched and MD5-compared with `public/assets/` (served at `/assets/<name>`).

- 89 remote URLs are present locally (byte-identical).
- 90 remote URLs are MISSING locally (fonts, customer marquee logos, brand masks, some bento backgrounds, hero srcset variants, extra mosaic piece logos, MCP-dialog client logos).
- `public/assets/cursor(1).svg` is a byte-identical duplicate of `cursor.svg` (both `/logos/clients/cursor.svg` and `/logos/pieces/cursor.svg` are this same file).

Suggested local layout for missing files: mirror the remote path under `public/` (e.g. `public/logos/customers/bosch.svg` served at `/logos/customers/bosch.svg`), or flatten into `public/assets/` — the spec refers to remote paths, Build maps them.

## 1. Fonts (ALL missing — download these)

Only weights actually rendered on the homepage are listed. The Inter and Fira Code files are variable fonts (one file covers every weight). Sentient 200/300/400 and every italic face are declared in CSS but never used on this page.

| URL | dims | size | role |
|---|---|---|---|
| `https://www.activepieces.com/_fonts/HgJel4iAS5mDVqJaDUYKmxaMJg4zKHTGmyD1FQkOsTM-2hVuuQIZ4GSGMgNv6dvlqz7cfD6lr7xLohUph7OCgFg.woff2` |  | 48,432 B | Inter latin (variable, wght 100-900) — PRIMARY body font |
| `https://www.activepieces.com/_fonts/Lr-hqqZZsYmCt0ITUlr1CUrWim9fsKvoDFZliMxgNHY-iTa_Yt_PzhOY9TX7ZXdSlEPim6iRt92xhECwaxWxd5w.woff2` |  | 13,232 B | Fira Code latin-ext |
| `https://www.activepieces.com/_fonts/UA7OtwYHwGN_HjcVGTdmiQxUit7FlqkCwxVUWSeXVnQ-B4OXCFOL_tWrYODpQTc07aMaj0c2cewTOmBRWR9tD-A.woff2` |  | 36,340 B | Fira Code latin (variable) — font-mono |
| `https://www.activepieces.com/_fonts/zkQRrBN3g9v_dVJWVkYryI2HWN4gfl77yu_FVFWNDYY-dCKEZ5lgZTVD30ATELD5lKDbBeBCP_ph7B4YtZQnSns.woff2` |  | 85,272 B | Inter latin-ext (variable) |
| `https://www.activepieces.com/_nuxt/sentient-500.hDsrbtgn.woff2` |  | 25,872 B | Sentient 500 normal — display (blockquotes) |
| `https://www.activepieces.com/_nuxt/sentient-700.DV7iGHJJ.woff2` |  | 24,280 B | Sentient 700 normal — display (all headings) |

@font-face declarations to reproduce (from entry.LEuMnHPd.css, font-display:swap on all):
```css
/* Inter — same file for 400/500/600/700, latin range */
@font-face{font-family:Inter;src:url(/fonts/inter-latin.woff2) format("woff2");font-weight:100 900;font-style:normal;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Inter;src:url(/fonts/inter-latin-ext.woff2) format("woff2");font-weight:100 900;font-style:normal;font-display:swap;unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:"Fira Code";src:url(/fonts/firacode-latin.woff2) format("woff2");font-weight:300 700;font-display:swap; /* same unicode ranges as Inter */}
@font-face{font-family:Sentient;src:url(/fonts/sentient-500.woff2) format("woff2");font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:Sentient;src:url(/fonts/sentient-700.woff2) format("woff2");font-weight:700;font-style:normal;font-display:swap}
/* metric-matched fallbacks (exact values from the original) */
@font-face{font-family:"Inter Fallback: sans-serif";src:local("sans-serif");size-adjust:100%;ascent-override:96.875%;descent-override:24.1211%;line-gap-override:0%}
@font-face{font-family:"Fira Code Fallback: monospace";src:local("monospace");size-adjust:100%;ascent-override:99%;descent-override:32.2%;line-gap-override:0%}
@font-face{font-family:"Sentient Fallback: Georgia";src:local(Georgia);size-adjust:107.896%;ascent-override:88.9748%;descent-override:29.6583%;line-gap-override:7.4146%}
@font-face{font-family:"Sentient Fallback: Times New Roman";src:local("Times New Roman");size-adjust:118.4%;ascent-override:81.0811%;descent-override:27.027%;line-gap-override:6.7568%}
```
Note: the original also lists `local(Inter)` first; the Playwright machine had Inter installed locally, so the Inter woff2 was not requested there. Users without Inter download the HgJel4… file. Self-host it so the clone does not depend on a local install.

## 2. Present locally (public/assets) — remote path → local URL

| remote path | local | intrinsic dims | size |
|---|---|---|---|
| `/avatars/bots/atlas.svg` | `/assets/atlas.svg` | viewBox 0 0 128 128 | 7,085 B |
| `/avatars/bots/beacon.svg` | `/assets/beacon.svg` | viewBox 0 0 128 128 | 6,543 B |
| `/avatars/bots/cinder.svg` | `/assets/cinder.svg` | viewBox 0 0 128 128 | 6,629 B |
| `/avatars/projects/data-platform.svg` | `/assets/data-platform.svg` | viewBox 0 0 100 100 | 2,970 B |
| `/avatars/projects/growth.svg` | `/assets/growth.svg` | viewBox 0 0 100 100 | 3,123 B |
| `/avatars/projects/revenue-ops.svg` | `/assets/revenue-ops.svg` | viewBox 0 0 100 100 | 2,888 B |
| `/avatars/projects/support.svg` | `/assets/support.svg` | viewBox 0 0 100 100 | 3,046 B |
| `/brand/activepieces-logo.svg` | `/assets/activepieces-logo.svg` | viewBox 0 0 945 147 | 4,353 B |
| `/closing/meadow-2064.webp` | `/assets/meadow-2064.webp` | 2064x2064 | 116,864 B |
| `/hero/hero-base-2064.webp` | `/assets/hero-base-2064.webp` | 2064x1152 | 20,418 B |
| `/hero/hero-front-2064.webp` | `/assets/hero-front-2064.webp` | 2064x1152 | 100,394 B |
| `/logos/calder.svg` | `/assets/calder.svg` | viewBox 0 0 98.36 108.89 | 1,288 B |
| `/logos/clients/chatgpt.svg` | `/assets/chatgpt.svg` | viewBox 0 0 100 100 | 1,962 B |
| `/logos/clients/claude.svg` | `/assets/claude.svg` | viewBox 0 0 100 100 | 1,517 B |
| `/logos/clients/cursor.svg` | `/assets/cursor.svg` | viewBox 0 0 100 100 | 605 B |
| `/logos/customers/alan.svg` | `/assets/alan.svg` | viewBox 0 9.072 260.28 53.856 | 2,773 B |
| `/logos/customers/funding-societies.webp` | `/assets/funding-societies.webp` | 391x128 | 13,980 B |
| `/logos/pieces/anthropic-claude.svg` | `/assets/anthropic-claude.svg` | viewBox 0 0 100 100 | 1,517 B |
| `/logos/pieces/apollo.svg` | `/assets/apollo.svg` | viewBox 0 0 100 100 | 483 B |
| `/logos/pieces/aws-bedrock.svg` | `/assets/aws-bedrock.svg` | viewBox 0 0 100 100 | 2,527 B |
| `/logos/pieces/azure-openai.svg` | `/assets/azure-openai.svg` | viewBox 0 0 100 100 | 1,928 B |
| `/logos/pieces/bitly.svg` | `/assets/bitly.svg` | viewBox 0 0 100 100 | 907 B |
| `/logos/pieces/buffer.svg` | `/assets/buffer.svg` | viewBox 0 0 100 100 | 1,023 B |
| `/logos/pieces/cal-com.svg` | `/assets/cal-com.svg` | viewBox 0 0 100 100 | 831 B |
| `/logos/pieces/calendly.svg` | `/assets/calendly.svg` | viewBox 0 0 100 100 | 3,577 B |
| `/logos/pieces/cisco-webex-meetings.svg` | `/assets/cisco-webex-meetings.svg` | viewBox 0 0 100 100 | 28,344 B |
| `/logos/pieces/clickup.svg` | `/assets/clickup.svg` | viewBox 0 0 100 100 | 1,010 B |
| `/logos/pieces/coda.svg` | `/assets/coda.svg` | viewBox 0 0 100 100 | 553 B |
| `/logos/pieces/cursor.svg` | `/assets/cursor.svg` | viewBox 0 0 100 100 | 605 B |
| `/logos/pieces/deepl.svg` | `/assets/deepl.svg` | viewBox 0 0 100 100 | 3,895 B |
| `/logos/pieces/deepseek.svg` | `/assets/deepseek.svg` | viewBox 0 0 100 100 | 1,962 B |
| `/logos/pieces/discord.svg` | `/assets/discord.svg` | viewBox 0 0 100 100 | 811 B |
| `/logos/pieces/dropbox.svg` | `/assets/dropbox.svg` | viewBox 0 0 100 100 | 458 B |
| `/logos/pieces/drupal.svg` | `/assets/drupal.svg` | viewBox 0 0 100 100 | 1,503 B |
| `/logos/pieces/figma.svg` | `/assets/figma.svg` | viewBox 0 0 100 100 | 733 B |
| `/logos/pieces/github.svg` | `/assets/github.svg` | viewBox 0 0 100 100 | 870 B |
| `/logos/pieces/gmail.svg` | `/assets/gmail.svg` | viewBox 0 0 100 100 | 592 B |
| `/logos/pieces/google-chat.svg` | `/assets/google-chat.svg` | viewBox 0 0 100 100 | 1,022 B |
| `/logos/pieces/google-docs.svg` | `/assets/google-docs.svg` | viewBox 0 0 100 100 | 490 B |
| `/logos/pieces/google-drive.svg` | `/assets/google-drive.svg` | viewBox 0 0 100 100 | 857 B |
| `/logos/pieces/google-gemini.svg` | `/assets/google-gemini.svg` | viewBox 0 0 100 100 | 635 B |
| `/logos/pieces/google-sheets.svg` | `/assets/google-sheets.svg` | viewBox 0 0 100 100 | 521 B |
| `/logos/pieces/google-slides.svg` | `/assets/google-slides.svg` | viewBox 0 0 100 100 | 446 B |
| `/logos/pieces/google-tasks.svg` | `/assets/google-tasks.svg` | viewBox 0 0 100 100 | 641 B |
| `/logos/pieces/help-scout.svg` | `/assets/help-scout.svg` | viewBox 0 0 100 100 | 676 B |
| `/logos/pieces/hootsuite.svg` | `/assets/hootsuite.svg` | viewBox 0 0 100 100 | 1,312 B |
| `/logos/pieces/hubspot.svg` | `/assets/hubspot.svg` | viewBox 0 0 100 100 | 871 B |
| `/logos/pieces/instagram-for-business.svg` | `/assets/instagram-for-business.svg` | viewBox 0 0 100 100 | 3,332 B |
| `/logos/pieces/intercom.svg` | `/assets/intercom.svg` | viewBox 0 0 100 100 | 1,584 B |
| `/logos/pieces/jira-cloud.svg` | `/assets/jira-cloud.svg` | viewBox 0 0 100 100 | 1,072 B |
| `/logos/pieces/linear.svg` | `/assets/linear.svg` | viewBox 0 0 100 100 | 726 B |
| `/logos/pieces/linkedin.svg` | `/assets/linkedin.svg` | viewBox 0 0 100 100 | 684 B |
| `/logos/pieces/mailchimp.svg` | `/assets/mailchimp.svg` | viewBox 0 0 100 100 | 3,631 B |
| `/logos/pieces/mattermost.svg` | `/assets/mattermost.svg` | viewBox 0 0 100 100 | 756 B |
| `/logos/pieces/microsoft-power-bi.svg` | `/assets/microsoft-power-bi.svg` | viewBox 0 0 100 100 | 1,795 B |
| `/logos/pieces/microsoft-sharepoint.svg` | `/assets/microsoft-sharepoint.svg` | viewBox 0 0 100 100 | 2,632 B |
| `/logos/pieces/microsoft-teams.svg` | `/assets/microsoft-teams.svg` | viewBox 0 0 100 100 | 5,611 B |
| `/logos/pieces/monday-com.svg` | `/assets/monday-com.svg` | viewBox 0 0 100 100 | 746 B |
| `/logos/pieces/mysql.svg` | `/assets/mysql.svg` | viewBox 0 0 100 100 | 2,247 B |
| `/logos/pieces/notion.svg` | `/assets/notion.svg` | viewBox 0 0 100 100 | 1,198 B |
| `/logos/pieces/okta.svg` | `/assets/okta.svg` | viewBox 0 0 100 100 | 2,592 B |
| `/logos/pieces/openai.svg` | `/assets/openai.svg` | viewBox 0 0 100 100 | 1,962 B |
| `/logos/pieces/postgres.svg` | `/assets/postgres.svg` | viewBox 0 0 100 100 | 4,909 B |
| `/logos/pieces/posthog.svg` | `/assets/posthog.svg` | viewBox 0 0 100 100 | 1,639 B |
| `/logos/pieces/quickbooks.svg` | `/assets/quickbooks.svg` | viewBox 0 0 100 100 | 440 B |
| `/logos/pieces/sendgrid.svg` | `/assets/sendgrid.svg` | viewBox 0 0 100 100 | 450 B |
| `/logos/pieces/slack.svg` | `/assets/slack.svg` | viewBox 0 0 100 100 | 1,025 B |
| `/logos/pieces/snowflake.svg` | `/assets/snowflake.svg` | viewBox 0 0 100 100 | 1,791 B |
| `/logos/pieces/stripe.svg` | `/assets/stripe.svg` | viewBox 0 0 100 100 | 702 B |
| `/logos/pieces/tableau.svg` | `/assets/tableau.svg` | viewBox 0 0 100 100 | 1,039 B |
| `/logos/pieces/todoist.svg` | `/assets/todoist.svg` | viewBox 0 0 100 100 | 1,064 B |
| `/logos/pieces/twitter.svg` | `/assets/twitter.svg` | viewBox 0 0 100 100 | 616 B |
| `/logos/pieces/vimeo.svg` | `/assets/vimeo.svg` | viewBox 0 0 100 100 | 665 B |
| `/logos/pieces/webhook.svg` | `/assets/webhook.svg` | viewBox 0 0 25 23 | 1,351 B |
| `/logos/pieces/woocommerce.svg` | `/assets/woocommerce.svg` | viewBox 0 0 100 100 | 2,038 B |
| `/logos/pieces/zendesk.svg` | `/assets/zendesk.svg` | viewBox 0 0 100 100 | 202 B |
| `/logos/pieces/zoom.svg` | `/assets/zoom.svg` | viewBox 0 0 100 100 | 450 B |
| `/panel/clouds.webp` | `/assets/clouds.webp` | 1920x1080 | 60,350 B |
| `/panel/meadow.webp` | `/assets/meadow.webp` | 1920x1080 | 139,892 B |
| `/reviews/g2-christiand.webp` | `/assets/g2-christiand.webp` | 96x96 | 3,150 B |
| `/reviews/g2-giuseppec.webp` | `/assets/g2-giuseppec.webp` | 100x100 | 1,876 B |
| `/reviews/g2-logo.webp` | `/assets/g2-logo.webp` | 64x66 | 2,708 B |
| `/reviews/g2-markd.webp` | `/assets/g2-markd.webp` | 100x100 | 8,388 B |
| `/reviews/g2-patrickf.webp` | `/assets/g2-patrickf.webp` | 100x100 | 5,550 B |
| `/reviews/reddit-logo.webp` | `/assets/reddit-logo.webp` | 64x65 | 1,678 B |
| `/reviews/trustpilot-dennisklappe.webp` | `/assets/trustpilot-dennisklappe.webp` | 73x73 | 744 B |
| `/reviews/trustpilot-kevinhu.webp` | `/assets/trustpilot-kevinhu.webp` | 73x73 | 1,578 B |
| `/reviews/trustpilot-logo.webp` | `/assets/trustpilot-logo.webp` | 64x61 | 1,846 B |
| `/reviews/trustpilot-rida.webp` | `/assets/trustpilot-rida.webp` | 73x73 | 2,120 B |

## 3. MISSING locally — download from these absolute URLs

### 3a. Brand / chrome
| URL | dims | size |
|---|---|---|
| `https://www.activepieces.com/brand/activepieces-logomark.svg` | viewBox 0 0 945 147 | 328 B |
| `https://www.activepieces.com/brand/activepieces-mark.svg` | viewBox 0.8 0.63 326.4 296.74 | 366 B |
| `https://www.activepieces.com/brand/activepieces-wordmark.svg` | viewBox 0 0 945 147 | 4,125 B |
| `https://www.activepieces.com/logos/ycombinator.svg` | viewBox 0 0 116 24 | 3,426 B |

Usage: `activepieces-wordmark.svg` + `activepieces-logomark.svg` are stacked CSS masks that form the header logo (aspect 945/147). `activepieces-mark.svg` is the mask in the floating "See it in action" card. `ycombinator.svg` is the footer mask (aspect 116/24, h-4). `activepieces-logo.svg` (present locally) is used for the dream-section final beat image, the hero-shot sidebar mask, and as the fallback full logo.

### 3b. Customer marquee logos (hero, rendered as CSS mask-image tinted ink-700) — all missing
| URL | dims | size |
|---|---|---|
| `https://www.activepieces.com/logos/customers/bosch.svg` | viewBox 0 0 433 97 | 1,652 B |
| `https://www.activepieces.com/logos/customers/capgemini.svg` | viewBox -0.014 -0.015 159.468 35.579 | 3,544 B |
| `https://www.activepieces.com/logos/customers/carrefour.svg` | viewBox 0 0 589 472 | 9,405 B |
| `https://www.activepieces.com/logos/customers/concentrix.svg` | viewBox 0 0 2521 390 | 5,591 B |
| `https://www.activepieces.com/logos/customers/corgi.webp` | 423x128 | 7,754 B |
| `https://www.activepieces.com/logos/customers/decathlon.svg` | viewBox 28.808 28.623 272.889 41.454 | 1,379 B |
| `https://www.activepieces.com/logos/customers/dell-technologies.svg` | viewBox 0 0 72 9.2 | 3,105 B |
| `https://www.activepieces.com/logos/customers/exl.svg` | viewBox 0 0 95.3 35.48 | 517 B |
| `https://www.activepieces.com/logos/customers/funding-societies.svg` | viewBox 0 0 230 75 | 5,039 B |
| `https://www.activepieces.com/logos/customers/hackerone.svg` | viewBox 0 0 500 98.67 | 8,748 B |
| `https://www.activepieces.com/logos/customers/hilton.svg` | viewBox 0 0 1137 422 | 2,286 B |
| `https://www.activepieces.com/logos/customers/itv.svg` | 1000x500.47 | 1,797 B |
| `https://www.activepieces.com/logos/customers/keller-williams.svg` | viewBox 0 0 171.371 78.52 | 4,050 B |
| `https://www.activepieces.com/logos/customers/lumen.svg` | viewBox 0 0 153 22 | 1,767 B |
| `https://www.activepieces.com/logos/customers/merkle.svg` | viewBox 4.97 4.736 98.772 10.329 | 863 B |
| `https://www.activepieces.com/logos/customers/moneygram.svg` | viewBox 5.388 4.715 783.924 158.97 | 4,321 B |
| `https://www.activepieces.com/logos/customers/odoo.svg` | viewBox 148.545 149.49 621.909 197.01 | 618 B |
| `https://www.activepieces.com/logos/customers/orange.svg` | viewBox 0 0 283.5 283.5 | 1,598 B |
| `https://www.activepieces.com/logos/customers/pipefy.svg` | viewBox 0 0.272 97 32.912 | 1,815 B |
| `https://www.activepieces.com/logos/customers/sap.svg` | viewBox 0 0 412.38 204 | 1,407 B |
| `https://www.activepieces.com/logos/customers/shopee.svg` | 1000x319.7 | 3,299 B |
| `https://www.activepieces.com/logos/customers/tryg.svg` | viewBox 0 0.96 141.757 58.68 | 1,919 B |
| `https://www.activepieces.com/logos/customers/zerofox.svg` | viewBox 39.987 41.6 420.026 76.8 | 2,219 B |

### 3c. Backgrounds / imagery
| URL | dims | size |
|---|---|---|
| `https://www.activepieces.com/rows/water.webp` | 1376x1835 | 71,706 B |
| `https://www.activepieces.com/grid/iris.webp` | 1920x1280 | 118,242 B |
| `https://www.activepieces.com/hero/hero-base-1376.webp` | 1376x768 | 11,224 B |
| `https://www.activepieces.com/hero/hero-base-2752.webp` | 2752x1536 | 32,082 B |
| `https://www.activepieces.com/hero/hero-front-1376.webp` | 1376x768 | 54,834 B |
| `https://www.activepieces.com/hero/hero-front-2752.webp` | 2752x1536 | 138,438 B |
| `https://www.activepieces.com/closing/meadow-1376.webp` | 1376x1376 | 68,040 B |

`/rows/water.webp` and `/grid/iris.webp` are bento-card backgrounds (Secret Managers, Reliability, Chat = water; Deployment Options, Knowledge Base = iris). The hero and closing `-1376`/`-2752` files are only srcset alternates; the `-2064` versions (present) are enough if you use a single `src`.

### 3d. MCP-connect dialog client logos (dialog opened by the hero "Use in your AI" button)
| URL | dims | size |
|---|---|---|
| `https://www.activepieces.com/logos/clients/antigravity.png` | 200x184 | 16,849 B |
| `https://www.activepieces.com/logos/clients/claude-code.svg` | viewBox 0 0 24 24 | 287 B |
| `https://www.activepieces.com/logos/clients/cline.svg` | viewBox 0 0 466.73 487.04 | 802 B |
| `https://www.activepieces.com/logos/clients/codex.svg` | viewBox 0 0 100 100 | 2,060 B |
| `https://www.activepieces.com/logos/clients/devin.svg` | viewBox 0 0 425 425 | 1,365 B |
| `https://www.activepieces.com/logos/clients/mcp.svg` | viewBox 0 0 24 24 | 824 B |
| `https://www.activepieces.com/logos/clients/opencode.svg` | viewBox 0 0 240 300 | 496 B |
| `https://www.activepieces.com/logos/clients/vscode.svg` | viewBox 0 0 100 100 | 3,053 B |

### 3e. Extra piece logos (used only by the pieces mosaic's random logo-swap pool, never in the initial render)
| URL | dims | size |
|---|---|---|
| `https://www.activepieces.com/logos/pieces/activecampaign.svg` | viewBox 0 0 100 100 | 703 B |
| `https://www.activepieces.com/logos/pieces/airtable.svg` | viewBox 0 0 100 100 | 813 B |
| `https://www.activepieces.com/logos/pieces/amazon-s3.svg` | viewBox 0 0 100 100 | 1,028 B |
| `https://www.activepieces.com/logos/pieces/asana.svg` | viewBox 0 0 100 100 | 823 B |
| `https://www.activepieces.com/logos/pieces/box.svg` | viewBox 0 0 100 100 | 1,144 B |
| `https://www.activepieces.com/logos/pieces/canva.svg` | viewBox 0 0 100 100 | 1,972 B |
| `https://www.activepieces.com/logos/pieces/confluence.svg` | viewBox 0 0 100 100 | 1,348 B |
| `https://www.activepieces.com/logos/pieces/datadog.svg` | viewBox 0 0 100 100 | 2,805 B |
| `https://www.activepieces.com/logos/pieces/digitalocean.svg` | viewBox 0 0 100 100 | 470 B |
| `https://www.activepieces.com/logos/pieces/elevenlabs.svg` | viewBox 0 0 100 100 | 122 B |
| `https://www.activepieces.com/logos/pieces/facebook-pages.svg` | viewBox 0 0 100 100 | 540 B |
| `https://www.activepieces.com/logos/pieces/gitlab.svg` | viewBox 0 0 100 100 | 1,017 B |
| `https://www.activepieces.com/logos/pieces/google-calendar.svg` | viewBox 0 0 100 100 | 1,443 B |
| `https://www.activepieces.com/logos/pieces/google-forms.svg` | viewBox 0 0 100 100 | 3,428 B |
| `https://www.activepieces.com/logos/pieces/hugging-face.svg` | viewBox 0 0 100 100 | 10,938 B |
| `https://www.activepieces.com/logos/pieces/mailgun.svg` | viewBox 0 0 100 100 | 790 B |
| `https://www.activepieces.com/logos/pieces/microsoft-excel-365.svg` | viewBox 0 0 100 100 | 4,746 B |
| `https://www.activepieces.com/logos/pieces/microsoft-onedrive.svg` | viewBox 0 0 100 100 | 4,637 B |
| `https://www.activepieces.com/logos/pieces/microsoft-outlook.svg` | viewBox 0 0 100 100 | 6,527 B |
| `https://www.activepieces.com/logos/pieces/microsoft-to-do.svg` | viewBox 0 0 100 100 | 769 B |
| `https://www.activepieces.com/logos/pieces/mistral-ai.svg` | viewBox 0 0 100 100 | 581 B |
| `https://www.activepieces.com/logos/pieces/mongodb.svg` | viewBox 0 0 100 100 | 757 B |
| `https://www.activepieces.com/logos/pieces/netlify.svg` | viewBox 0 0 100 100 | 3,001 B |
| `https://www.activepieces.com/logos/pieces/perplexity-ai.svg` | viewBox 0 0 100 100 | 518 B |
| `https://www.activepieces.com/logos/pieces/pinterest.svg` | viewBox 0 0 100 100 | 959 B |
| `https://www.activepieces.com/logos/pieces/reddit.svg` | viewBox 0 0 100 100 | 1,111 B |
| `https://www.activepieces.com/logos/pieces/resend.svg` | viewBox 0 0 100 100 | 328 B |
| `https://www.activepieces.com/logos/pieces/salesforce.svg` | viewBox 0 0 100 100 | 536 B |
| `https://www.activepieces.com/logos/pieces/shopify.svg` | viewBox 0 0 100 100 | 1,436 B |
| `https://www.activepieces.com/logos/pieces/spotify.svg` | viewBox 0 0 100 100 | 924 B |
| `https://www.activepieces.com/logos/pieces/square.svg` | viewBox 0 0 100 100 | 505 B |
| `https://www.activepieces.com/logos/pieces/supabase.svg` | viewBox 0 0 100 100 | 1,001 B |
| `https://www.activepieces.com/logos/pieces/surveymonkey.svg` | viewBox 0 0 100 100 | 1,128 B |
| `https://www.activepieces.com/logos/pieces/telegram-bot.svg` | viewBox 0 0 100 100 | 1,050 B |
| `https://www.activepieces.com/logos/pieces/trello.svg` | viewBox 0 0 100 100 | 1,020 B |
| `https://www.activepieces.com/logos/pieces/twitch.svg` | viewBox 0 0 100 100 | 364 B |
| `https://www.activepieces.com/logos/pieces/vercel.svg` | viewBox 0 0 100 100 | 122 B |
| `https://www.activepieces.com/logos/pieces/webflow.svg` | viewBox 0 0 100 100 | 452 B |
| `https://www.activepieces.com/logos/pieces/whatsapp-business.svg` | viewBox 0 0 100 100 | 1,828 B |
| `https://www.activepieces.com/logos/pieces/wordpress.svg` | viewBox 0 0 100 100 | 1,159 B |
| `https://www.activepieces.com/logos/pieces/xero.svg` | viewBox 0 0 100 100 | 1,397 B |
| `https://www.activepieces.com/logos/pieces/youtube.svg` | viewBox 0 0 100 100 | 526 B |

Every logo in the mosaic's initial (server-rendered) state is already local. These extra files are only needed if you want the full swap pool; otherwise limit the swap pool to the local piece logos.

## 4. Icons (Iconify `solar` set, plus one `simple-icons`)

There are no icon files. The original renders `<span class="iconify i-solar:NAME">` with CSS masks whose SVG data URIs sit in an inline `<style>@layer base{ :where(.i-solar\:…){…--svg:url("data:image/svg+xml,…")} }` block inside the saved HTML (`Activepieces_ unify your team's AI.html`). Copy that block, or use `@iconify/react` / `api.iconify.design/solar/<name>.svg`.
Icons rendered in the initial DOM: check-circle-linear, alt-arrow-down-linear, add-linear, widget-4-linear, database-linear, lock-bold, document-text-linear, alt-arrow-right-linear, pen-new-square-linear, microphone-linear, close-circle-linear, socket-linear, magnifer-linear, magnifer-line-duotone, file-text-linear, cpu-bolt-linear, copy-linear, check-read-linear, add-square-linear, widget-linear, users-group-rounded-linear, tuning-linear, stars-linear, star-linear, soundwave-linear, shield-check-linear, settings-linear, server-minimalistic-linear, server-linear, play-linear, play-circle-linear, play-bold, plain-2-bold-duotone, notebook-linear, menu-dots-bold, lock-keyhole-linear, link-minimalistic-2-linear, home-2-linear, history-linear, hamburger-menu-linear, gallery-linear, export-linear, code-linear, cloud-linear, check-read-bold, chat-round-dots-linear, card-linear, branching-paths-down-linear, bill-list-linear, bell-linear, arrow-right-linear, alt-arrow-up-linear, code-square-linear, arrow-right-up-linear, close-linear.
Icons used only in the nav dropdowns/mobile menu (NOT in the saved HTML's style block, so fetch them from Iconify): solar:chat-round-dots-bold, plug-circle-bold, widget-bold, bot-bold, database-bold, structure-bold, server-bold, code-bold, speaker-bold, graph-up-bold, headphones-round-bold, restart-circle-bold, bill-bold, users-group-rounded-bold, programming-bold, key-bold, window-frame-bold, shield-check-bold, lock-keyhole-bold, buildings-2-bold, code-square-bold; simple-icons:github.

## 5. Video
None. The page loads no video, canvas or Lottie. Everything that moves is DOM + CSS + JS.
