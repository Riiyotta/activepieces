import { useLocation } from 'react-router-dom'
import Icon from './ui/Icon'
import { usePageMeta } from './PageMetaContext'
import { buttonClasses } from './ui/Button'
import './Footer.css'

// O. Footer `footer.closing` (CLONE_SPEC §O). Markup and copy from the saved HTML (data-section="closing").
// Static: no entrance motion on the original (spec §R). Only hover transitions.

const SIGN_UP = 'https://cloud.activepieces.com/sign-up'

const LINK =
  'inline-flex min-h-11 items-center rounded-md text-base text-ink-900 transition-colors duration-200 ease-out hover:text-ink-950 md:min-h-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 motion-reduce:transition-none'

const EXTERNAL = { rel: 'noopener noreferrer', target: '_blank' }

const COLUMNS = [
  {
    title: 'Product',
    links: [
      ['Workflow Builder', '/product/workflow-builder'],
      ['AI Agents', '/product/ai-agent-builder'],
      ['Tables', '/product/tables'],
      ['Chat', '/product/chat'],
      ['Pricing', '/pricing'],
    ],
  },
  {
    title: 'Build',
    links: [
      ['Docs', '/docs'],
      ['Pieces', '/pieces'],
      ['MCP', '/mcp'],
      ['Embed', '/embed'],
      ['GitHub', 'https://github.com/activepieces/activepieces', EXTERNAL],
    ],
  },
  {
    title: 'Business teams',
    links: [
      ['Marketing', '/solutions/marketing'],
      ['Sales', '/solutions/sales'],
      ['Customer Support', '/solutions/customer-support'],
      ['Operations', '/solutions/operations'],
      ['Finance', '/solutions/finance'],
    ],
  },
  {
    title: 'Technical teams',
    links: [
      ['Engineering', '/solutions/engineering'],
      ['IT', '/solutions/it'],
      ['Internal Tools', '/solutions/internal-tools'],
      ['OSS Developers', '/solutions/open-source-developers'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['Blog', '/blog'],
      ['Resources', '/resources'],
      ['Support forum', 'https://community.activepieces.com/', { rel: 'noopener noreferrer' }],
      ['Talk to sales', '/sales?ap_cta=footer'],
      ['Security', '/security'],
      ['OSS friends', '/oss-friends'],
    ],
  },
]

const REASSURANCE = ['Free to start', 'No credit card', 'Open source']

// Homepage closing copy; other pages override it through PageMetaContext (usePageClosing).
const CLOSING_H2 = 'Put your first automation to work.'
const CLOSING_LEDE = "Start with one flow this afternoon, or bring the whole stack across. We've got you from here."

export default function Footer() {
  const { closing } = usePageMeta()
  const { pathname } = useLocation()
  const h2 = closing?.h2 ?? CLOSING_H2
  const lede = closing?.lede ?? CLOSING_LEDE
  // Optional per-page buttons and reassurance (SPEC_MARKETING §0.2); absent = homepage defaults below.
  const primary = closing?.primary
  const secondary = closing?.secondary
  const reassurance = closing?.reassurance ?? REASSURANCE
  return (
    <footer className="closing relative isolate overflow-hidden bg-white" data-section="closing">
      {/* Meadow art, md+ only */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 hidden w-full -translate-y-[0.5vw] md:block">
        <img
          src="/assets/meadow-2064.webp"
          srcSet="/closing/meadow-1376.webp 1376w, /assets/meadow-2064.webp 2064w"
          sizes="100vw"
          width="2048"
          height="2048"
          alt=""
          className="closing-dissolve block w-full"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pt-28 md:px-6 md:pt-32 lg:px-8">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex max-w-3xl flex-col gap-3">
            <h2 className="font-display text-4xl font-bold text-balance text-primary-950 md:text-5xl">
              {h2}
            </h2>
            <p className="mx-auto max-w-xl text-xl text-balance text-ink-700">
              {lede}
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-center gap-3 max-sm:*:grow">
            <a
              href={primary ? primary.href : `${SIGN_UP}?ap_cta=closing&ref=${encodeURIComponent(pathname)}`}
              className={buttonClasses('lg', 'brand')}
              {...(primary && /^https?:/.test(primary.href) ? EXTERNAL : null)}
            >
              {primary ? primary.label : 'Start building'}
            </a>
            <a
              href={secondary ? secondary.href : '/sales?ap_cta=closing'}
              className={buttonClasses('lg', 'secondary')}
              {...(secondary && /^https?:/.test(secondary.href) ? EXTERNAL : null)}
            >
              {secondary ? secondary.label : 'Talk to sales'}
            </a>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {reassurance.map((t) => (
              <li key={t} className="flex items-center gap-1.5 text-sm font-medium text-ink-700">
                <Icon name="solar:check-circle-linear" className="size-4" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mx-auto mt-24 w-full max-w-7xl px-5 pb-24 sm:pb-5 md:mt-32 md:px-6 md:pb-6 lg:px-8 lg:pb-8">
        <div className="closing-card fade-b rounded-4xl bg-white px-1 py-8 sm:p-8 md:p-10 lg:p-12">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-3 text-base font-semibold text-primary-950">{col.title}</h3>
                <ul className="flex flex-col md:gap-2.5">
                  {col.links.map(([label, href, extra]) => (
                    <li key={label}>
                      <a href={href} className={LINK} aria-current={href === pathname ? 'page' : undefined} {...extra}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-1 items-center gap-4 border-t border-ink-950/10 pt-6 text-base text-ink-600 sm:grid-cols-3 sm:gap-6">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <span role="img" aria-label="Y Combinator" className="closing-yc aspect-[116/24] h-4 w-auto bg-ink-700" />
              <span>Backed company</span>
            </div>
            <p className="text-center">© 2026 Activepieces. All rights reserved.</p>
            <div className="flex items-center justify-center gap-4 sm:justify-end">
              <a href="/terms" className={LINK}>
                Terms
              </a>
              <a href="/privacy" className={LINK}>
                Privacy
              </a>
              {/* Opens the cookie-consent preferences on the original; that component is not built (spec §S). */}
              <button type="button" className={`${LINK} cursor-pointer`}>
                Cookie settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
