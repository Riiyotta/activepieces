import { buttonClasses } from './ui/Button'
import './CtaShip.css'

// E. CTA band "Your first flow can ship this afternoon." (CLONE_SPEC §E/I). Markup from the saved HTML. Static.
export default function CtaShip() {
  return (
    <section data-section="home-cta-proof" className="mx-auto w-full max-w-7xl px-5 py-12 md:px-6 md:py-16 lg:px-8">
      <div className="flex flex-col gap-7 rounded-3xl bg-white p-8 shadow-edge md:flex-row md:items-center md:justify-between md:gap-10 md:p-10">
        <div className="flex max-w-2xl flex-col gap-2">
          <h2 className="font-display text-2xl font-bold text-balance text-ink-900 leading-[calc(2/1.5)] md:text-[28px]">
            Your first flow can ship this afternoon.
          </h2>
          <p className="text-base text-pretty text-ink-600 md:text-lg">
            Start with the one job your team keeps redoing by hand. No card to begin, and it runs on our cloud or your own
            servers.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 max-sm:*:grow">
          <a
            href="https://cloud.activepieces.com/sign-up?ap_cta=home_after_proof&ref=%2F"
            className={buttonClasses('lg', 'brand')}
          >
            Start building
          </a>
          <a href="/sales?ap_cta=home_after_proof" className={buttonClasses('lg', 'secondary')}>
            Talk to sales
          </a>
        </div>
      </div>
    </section>
  )
}
