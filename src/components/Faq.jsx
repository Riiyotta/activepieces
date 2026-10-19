import { useId, useLayoutEffect, useRef, useState } from 'react'
import Icon from './ui/Icon'
import './Faq.css'

// N. FAQ (CLONE_SPEC §N). Copy from the saved HTML (data-section="faq").
// Accordion: one open at a time, first open by default. Panel animates height 0 <-> scrollHeight
// plus opacity 0 <-> 1, `transition: all 200ms ease-out` (leave is the reverse). Icon rotates 45°.

const QA = [
  [
    'Can non-developers really build with this?',
    'Yes. Someone on your team describes what they need, and it gets built. To change it later, they can ask again or open the builder.',
  ],
  [
    'What kinds of things will my team build?',
    'The recurring work every team has too much of. Reports that write themselves. Documents routed to the right person. Sales decks that pull the latest numbers. User research that schedules itself.',
  ],
  [
    'Do we need a dedicated automation team?',
    'No. Each team builds what they need. Engineering stays on the hard problems instead of running a ticket queue.',
  ],
  [
    'How does the cost hold up as more teams join?',
    'Unlimited flows on every plan. Logic inside a flow is free. You pay for how often flows actually run, and the per-run price drops as your volume grows.',
  ],
  [
    'What will our security team ask about?',
    "The usual: single sign-on, granular role permissions, audit logs, encryption, and control over where the data lives. All of it's built in.",
  ],
  [
    'Can we self-host?',
    'Yes. Run it with Docker or Kubernetes on your own infrastructure, or use our cloud, which runs in Frankfurt.',
  ],
  [
    'Is Activepieces really open source?',
    'Yes. The core is MIT-licensed. Read the code, fork it, run your own version if you want to.',
  ],
]

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Height + opacity collapse, equivalent to the original's Vue <Transition> hooks.
function Collapse({ open, id, labelledBy, children }) {
  const ref = useRef(null)
  const first = useRef(true)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (first.current) {
      first.current = false
      return
    }
    const done = () => {
      el.classList.remove('faq-collapse-anim')
      el.style.height = ''
      el.style.opacity = ''
      el.style.overflow = ''
      if (!open) el.hidden = true
    }
    if (reducedMotion()) {
      el.hidden = !open
      return
    }
    el.hidden = false
    el.style.overflow = 'hidden'
    el.classList.remove('faq-collapse-anim')
    const h = el.scrollHeight
    el.style.height = open ? '0px' : `${h}px`
    el.style.opacity = open ? '0' : '1'
    void el.offsetHeight // commit the start state
    el.classList.add('faq-collapse-anim')
    el.style.height = open ? `${h}px` : '0px'
    el.style.opacity = open ? '1' : '0'
    const onEnd = (e) => {
      if (e.target === el && e.propertyName === 'height') done()
    }
    el.addEventListener('transitionend', onEnd)
    const fallback = setTimeout(done, 260)
    return () => {
      el.removeEventListener('transitionend', onEnd)
      clearTimeout(fallback)
    }
  }, [open])

  return (
    <div ref={ref} id={id} role="region" aria-labelledby={labelledBy} hidden={!open}>
      {children}
    </div>
  )
}

// Optional props (product/solution templates): heading, items ([question, answer][]), section (data-section).
// Defaults reproduce the homepage FAQ exactly.
export default function Faq({ heading = 'Questions, answered', items = QA, section = 'faq' }) {
  const [openIndex, setOpenIndex] = useState(0)
  const uid = useId()

  return (
    <section className="px-5 py-24 md:px-6 md:py-32 lg:px-8" data-section={section}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 md:mb-8">
          <h2 className="font-display text-3xl font-bold text-balance text-ink-900 md:text-4xl">{heading}</h2>
        </div>
        <div className="flex flex-col gap-3">
          {items.map(([q, a], i) => {
            const open = openIndex === i
            const btnId = `${uid}-q${i}`
            const panelId = `${uid}-a${i}`
            return (
              <div key={q} className="rounded-2xl bg-white px-5 shadow-edge sm:px-6">
                <button
                  type="button"
                  id={btnId}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? -1 : i)}
                >
                  <span className="text-lg font-semibold text-ink-900">{q}</span>
                  <Icon
                    name="solar:add-linear"
                    className={`size-5 shrink-0 text-ink-600 transition-transform duration-200 motion-reduce:transition-none${
                      open ? ' rotate-45' : ''
                    }`}
                  />
                </button>
                <Collapse open={open} id={panelId} labelledBy={btnId}>
                  <p className="pb-5 text-base text-ink-600">{a}</p>
                </Collapse>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
