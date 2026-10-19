import { useEffect, useState } from 'react'
import Icon from './ui/Icon'
import './FloatingCard.css'

// P. Floating "See it in action" card (CLONE_SPEC §P). Markup from the saved HTML (data-v-680013cb).
// Shown only after mount and once scrollY > 100. Enter 300ms ease-smooth from translate-y-3 + opacity 0;
// leave 200ms. Route-based hiding (/sales, /pricing, ...) does not apply to this single-page clone.

export default function FloatingCard() {
  const [scrolled, setScrolled] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const shown = scrolled && !dismissed

  return (
    <div
      data-section="floating-card"
      data-state={shown ? 'open' : 'closed'}
      inert={shown ? undefined : ''}
      aria-hidden={shown ? undefined : 'true'}
      className="floating-card fixed right-5 bottom-5 z-130 max-sm:right-3 max-sm:bottom-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <a
        href="/sales?ap_cta=floating_card"
        data-cta="talk_to_sales"
        data-cta-location="floating_card"
        className="ap-card group relative flex w-fit items-center gap-3 overflow-hidden rounded-[1.1rem] bg-white py-3.5 pr-4 pl-4 transition-all duration-300 ease-smooth hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-d-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0 max-sm:gap-2.5 max-sm:py-2.5 max-sm:pr-3 max-sm:pl-2.5"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-d-50 transition-colors duration-300 group-hover:bg-accent-d-100 max-sm:size-8">
          <span aria-hidden="true" className="ap-card-mark block size-[1.05rem] bg-accent-d-600" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-[15px] leading-snug font-semibold tracking-[-0.01em] text-ink-950">See it in action</span>
          <span className="mt-0.5 text-[13px] leading-snug text-ink-500">Book a 30-min demo</span>
        </span>
        <Icon
          name="solar:arrow-right-linear"
          className="ml-1 size-4 shrink-0 text-ink-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent-d-600 motion-reduce:transition-none"
        />
      </a>
      <button
        type="button"
        className="absolute -top-2 -right-2 flex size-6 cursor-pointer items-center justify-center rounded-full bg-white text-ink-400 ring-1 ring-ink-950/8 transition-colors before:absolute before:-inset-2.5 before:content-[''] hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
        aria-label="Dismiss"
        onClick={() => setDismissed(true)}
      >
        <Icon name="solar:close-circle-linear" className="size-3.5" />
      </button>
    </div>
  )
}
