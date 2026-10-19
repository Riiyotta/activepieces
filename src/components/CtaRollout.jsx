import './CtaRollout.css'
import { buttonClasses } from './ui/Button'

// I. CTA band "Roll it out without losing control." (CLONE_SPEC §E/I). Static; only button hover/active states.
export default function CtaRollout() {
  return (
    <section data-section="home-cta-controls" className="mx-auto w-full max-w-7xl px-5 py-12 md:px-6 md:py-16 lg:px-8">
      <div className="flex flex-col gap-7 rounded-3xl bg-white p-8 shadow-edge md:flex-row md:items-center md:justify-between md:gap-10 md:p-10">
        <div className="flex max-w-2xl flex-col gap-2">
          <h2 className="font-display text-2xl leading-[calc(2/1.5)] font-bold text-balance text-ink-900 md:text-[28px]">Roll it out without losing control.</h2>
          <p className="text-base text-pretty text-ink-600 md:text-lg">
            Projects, SSO, roles, audit logs and your own secret manager are there from the first flow, on our cloud or your infrastructure.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 max-sm:*:grow">
          <a href="https://cloud.activepieces.com/sign-up?ap_cta=home_after_controls&ref=%2F" className={buttonClasses('lg', 'brand')}>
            Start building
          </a>
          <a href="/sales?ap_cta=home_after_controls" className={buttonClasses('lg', 'secondary')}>
            Talk to sales
          </a>
        </div>
      </div>
    </section>
  )
}
