import { useEffect, useRef, useState } from 'react'
import Icon from '../ui/Icon'
import MARKS from './deckMarks'
import { Control, Evidence, Pilot, Rollout } from './DeckVisuals'

// /ai-governance rollout deck (SPEC_MARKETING §5.D; ai-governance.BuUrctv7.js `governance-stages`).
// ≥1024 without reduced motion: the wrap is n×90vh tall, the deck sticks centred under the header, and the
// open slot = floor(progress × n). Click / Enter / Space / focus scrolls to that slot's band.
// Below 1024: a column with every slot expanded, nothing pinned.

const SLOTS = [
  {
    family: 'primary',
    mark: 'adopt',
    Visual: Pilot,
    title: 'Adopt',
    short: 'Give one team a project of its own.',
    long: "One team builds in its own project, on the integrations you approve. Only the people you add can open it, so the first automations reach production without touching anyone else's work.",
    points: [
      ['solar:folder-bold', 'Its own project'],
      ['solar:plug-circle-bold', 'Approved integrations only'],
      ['solar:bolt-bold', 'In production in days'],
    ],
  },
  {
    family: 'accent-d',
    mark: 'expand',
    Visual: Rollout,
    title: 'Expand',
    short: 'Add the next team without adding admin work.',
    long: 'People sign in through SAML, and SCIM adds and removes them in step with your directory. Each person is a member of the projects you put them in, and sees nothing outside them.',
    points: [
      ['solar:user-id-bold', 'SAML single sign-on'],
      ['solar:users-group-two-rounded-bold', 'SCIM provisioning'],
      ['solar:user-check-rounded-bold', 'Membership per project'],
    ],
  },
  {
    family: 'accent-b',
    mark: 'control',
    Visual: Control,
    title: 'Control',
    short: 'Let teams build. You decide what they can do.',
    long: "Each person gets a role per project, built from the permissions you pick. Teams build and run their own automations, and the connections behind them stay in an admin's hands.",
    points: [
      ['solar:key-bold', 'Roles assigned per project'],
      ['solar:bot-bold', 'Credentials never shown back'],
      ['solar:verified-check-bold', 'Viewer rights for everyone else'],
    ],
  },
  {
    family: 'accent-a',
    mark: 'monitor',
    Visual: Evidence,
    title: 'Monitor',
    short: 'See who changed what, and when.',
    long: 'Every change and every run is recorded with the person behind it, and streams to the tools you already watch. Changes ship as one release, and a release goes back in one step.',
    points: [
      ['solar:clipboard-text-bold', 'Audit log you can stream out'],
      ['solar:layers-bold', 'Releases you can review'],
      ['solar:undo-left-round-bold', 'One-step rollback'],
    ],
  },
]

// The notch joining slot i to slot i−1 (lg only), verbatim paths.
function Notch() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-7 right-[calc(100%-2px)] z-10 hidden h-15 w-[calc(1rem+4px)] flex-col lg:flex"
    >
      <svg viewBox="0 0 20 10" className="w-full shrink-0">
        <path d="M0 0H2A8 8 0 0 0 18 0H20V10H0Z" className="fill-white" />
        <path d="M2.5 0A7.5 7.5 0 0 0 17.5 0" fill="none" strokeWidth="1" className="stroke-ink-950/10" />
        <path d="M1.5 0A8.5 8.5 0 0 0 18.5 0" fill="none" strokeWidth="1" className="stroke-ink-200" />
      </svg>
      <div className="flex-1 bg-white" />
      <svg viewBox="0 0 20 10" className="w-full shrink-0">
        <path d="M0 10H2A8 8 0 0 1 18 10H20V0H0Z" className="fill-white" />
        <path d="M2.5 10A7.5 7.5 0 0 1 17.5 10" fill="none" strokeWidth="1" className="stroke-ink-950/10" />
        <path d="M1.5 10A8.5 8.5 0 0 1 18.5 10" fill="none" strokeWidth="1" className="stroke-ink-200" />
      </svg>
    </div>
  )
}

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)

export default function RolloutDeck() {
  const wrapRef = useRef(null)
  const pinRef = useRef(null)
  const [open, setOpen] = useState(0)
  const [pinned, setPinned] = useState(false)
  const pinnedRef = useRef(false)

  const geometry = () => {
    const wrap = wrapRef.current
    const pin = pinRef.current
    if (!wrap || !pin) return null
    const anchor = Number.parseFloat(getComputedStyle(pin).top) || 0
    const travel = wrap.offsetHeight - pin.offsetHeight
    return travel <= 0 ? null : { top: wrap.getBoundingClientRect().top, anchor, travel }
  }

  useEffect(() => {
    let raf = 0
    const lg = window.matchMedia('(min-width: 64rem)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      raf = 0
      if (!pinnedRef.current) return
      const g = geometry()
      if (!g) return
      const p = clamp((g.anchor - g.top) / g.travel, 0, 1)
      setOpen(Math.min(Math.floor(p * SLOTS.length), SLOTS.length - 1))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const mode = () => {
      pinnedRef.current = lg.matches && !reduced.matches
      setPinned(pinnedRef.current)
      if (!pinnedRef.current) setOpen(0)
      schedule()
    }
    lg.addEventListener('change', mode)
    reduced.addEventListener('change', mode)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    mode()
    return () => {
      if (raf) cancelAnimationFrame(raf)
      lg.removeEventListener('change', mode)
      reduced.removeEventListener('change', mode)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  const go = (i) => {
    setOpen(i)
    if (!pinnedRef.current) return
    const g = geometry()
    if (!g) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({
      top: g.top + window.scrollY - g.anchor + ((i + 0.5) / SLOTS.length) * g.travel,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  return (
    <section data-section="governance_stages" className="gov-stages relative isolate px-5 py-24 md:px-8 md:py-32 lg:px-12">
      <div aria-hidden="true" className="gov-stages-ground pointer-events-none absolute inset-0 -z-10" />
      <h2 className="mx-auto max-w-2xl text-center font-display text-3xl font-bold text-balance text-ink-900 md:text-5xl">
        Start with one team. Roll out to the entire organization.
      </h2>
      <div ref={wrapRef} className={`gov-wrap mt-12${pinned ? ' is-pinned' : ''}`} style={{ '--n': SLOTS.length }}>
        <div ref={pinRef} className="gov-pin">
          <div className="gov-deck">
            {SLOTS.map((s, i) => (
              <div key={s.title} className={`gov-slot${open === i ? ' is-open' : ''}`} data-family={s.family}>
                <div
                  className="gov-stage cursor-pointer rounded-4xl border border-ink-200 bg-white p-6 shadow-lift md:p-8"
                  tabIndex={0}
                  role="button"
                  aria-expanded={open === i}
                  onClick={() => go(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      go(i)
                    }
                  }}
                  onFocus={() => go(i)}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 176 176"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="gov-mark-blob"
                    dangerouslySetInnerHTML={{ __html: MARKS[s.mark] }}
                  />
                  <h3 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">{s.title}</h3>
                  <div className="gov-copy mt-4 text-base text-pretty text-ink-600">
                    <p className="gov-short">{s.short}</p>
                    <p className="gov-long">{s.long}</p>
                  </div>
                  <div className="gov-extras">
                    <ul className="mt-6 space-y-3">
                      {s.points.map(([icon, label]) => (
                        <li key={label} className="flex items-center gap-3 text-sm text-ink-700">
                          <span className="gov-point-chip flex size-7 shrink-0 items-center justify-center rounded-lg">
                            <Icon name={icon} className="gov-point-icon size-4" />
                          </span>{' '}
                          {label}
                        </li>
                      ))}
                    </ul>
                    <div className="gov-art mt-4">
                      <div className="gov-art-fade">
                        <s.Visual />
                      </div>
                    </div>
                  </div>
                </div>
                {i > 0 && <Notch />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
