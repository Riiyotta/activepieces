import Icon from '../components/ui/Icon'
import SalesForm from '../components/sales/SalesForm'
import SalesLogoGrid from '../components/sales/SalesLogoGrid'
import usePageHead from './usePageHead'
import './Sales.css'

// /sales (SPEC_MARKETING §2). Standalone layout: no shared Header/Footer/FloatingCard.
// Coast background (fixed at lg), "Sign up" top bar, then main: pitch card (DOM-first, right at lg,
// sticky) joined to the form card by the "bridge" notch. flex-*-reverse puts the form first on mobile.
const POINTS = [
  'Anyone can build, in plain language',
  'IT keeps control with SSO, RBAC and audit logs',
  'Runs on our cloud, your servers, or air-gapped',
]

export default function Sales() {
  usePageHead(
    'Talk to sales | Activepieces',
    'See how Activepieces gives every team AI they can build with, without losing control. Book a 30-minute demo and get a personalized walkthrough.',
  )

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-white p-4 font-sans text-ink-600 antialiased sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat lg:fixed"
        style={{ backgroundImage: 'url(/panel/coast.webp)' }}
      />
      <div className="mx-auto mb-4 flex w-full max-w-7xl justify-end sm:mb-6">
        <a
          href="https://cloud.activepieces.com/sign-up?ap_cta=sales_topbar&ref=%2Fsales"
          className="rounded-full px-3 py-1.5 text-sm font-medium text-ink-800 transition-colors duration-200 hover:bg-white/50 hover:text-ink-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
        >
          Sign up
        </a>
      </div>
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col-reverse gap-4 sm:gap-6 lg:flex-row-reverse lg:gap-8"
      >
        <div className="lg:sticky lg:top-6 lg:z-10 lg:flex lg:min-h-[calc(100vh-3rem)] lg:w-[54%] lg:items-center lg:self-start">
          {/* Bridge notch joining the two cards (lg only) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-[40%] right-[calc(100%-2px)] z-10 hidden w-[calc(2rem+4px)] scale-x-[-1] flex-col lg:flex"
          >
            <svg viewBox="0 0 26 12" className="w-full shrink-0">
              <path d="M0 0H1A12 12 0 0 0 25 0H26V12H0Z" className="fill-white" />
            </svg>
            <div className="flex-1 bg-white" />
            <svg viewBox="0 0 26 12" className="w-full shrink-0">
              <path d="M0 12H1A12 12 0 0 1 25 12H26V0H0Z" className="fill-white" />
            </svg>
          </div>
          <aside className="flex w-full flex-col gap-10 rounded-2xl bg-white px-6 py-12 shadow-edge sm:px-10 lg:px-12 lg:py-14 xl:px-16">
            <div className="flex flex-col gap-5">
              <header className="flex flex-col gap-3">
                <h1 className="font-display text-4xl font-bold text-balance text-ink-900 lg:text-5xl">Put your AI to work</h1>
                <p className="max-w-md text-xl text-ink-600">
                  Describe the work. AI builds the automation. IT stays in control.
                </p>
              </header>
              <ul className="flex flex-col gap-3.5">
                {POINTS.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <Icon name="solar:check-read-linear" className="mt-1 size-4 shrink-0 text-ink-400" />
                    <span className="text-base text-ink-600">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="flex flex-col gap-3 border-t border-ink-950/10 pt-6">
              <blockquote className="text-base leading-relaxed text-ink-500">
                “User-friendly, even for those without technical skills. Highly flexible and powerful, with options to add
                code when needed.”
              </blockquote>
              <figcaption className="flex items-center gap-2.5 text-sm text-ink-400">
                <img
                  src="/reviews/g2-giuseppec.webp"
                  alt=""
                  width="24"
                  height="24"
                  loading="lazy"
                  className="size-6 rounded-full object-cover"
                />{' '}
                Giuseppe C.
              </figcaption>
            </figure>
            <SalesLogoGrid />
          </aside>
        </div>
        <section className="relative mx-auto flex w-full max-w-2xl flex-col justify-center lg:flex-1 lg:self-center">
          <div className="rounded-2xl bg-white p-8 shadow-edge sm:p-10">
            <div className="mb-8 flex justify-center">
              <a
                href="/"
                className="inline-block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-700"
                aria-label="Activepieces"
              >
                <span className="logo-mask block h-7 w-40 bg-ink-950" style={{ WebkitMaskImage: 'url(/brand/activepieces-logo.svg)', maskImage: 'url(/brand/activepieces-logo.svg)' }} />
              </a>
            </div>
            <SalesForm />
          </div>
        </section>
      </main>
    </div>
  )
}
