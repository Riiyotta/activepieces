import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Icon from '../ui/Icon'
import GlyphField from './GlyphField'
import { Credential, Deployment, Isolation } from './StageVisuals'

// /security feature rows (SPEC_MARKETING §4.B; security.G6mAqp3Z.js `feature-rows` + `security-stage`).
// lg+: the right column sticks at top-24 and shows the stage of the row crossing the viewport middle
// (IntersectionObserver rootMargin -45% 0 -45% 0). Below lg each row carries its own stage inline.

const ROWS = [
  {
    title: 'Choose where it runs',
    tone: 'from-accent-a-950',
    Visual: Deployment,
    points: [
      ['solar:globe-linear', 'Our cloud, hosted in the EU', 'Frankfurt by default, other regions on request. Each project keeps its own automations, connections and history.'],
      ['solar:server-linear', 'Or inside your own network', 'The same enterprise build, in whatever region your policy asks for, on hardware nobody else shares.'],
      ['solar:plug-circle-linear', 'Or air-gapped, with no internet', 'Nothing reaches out of your network, and the model answering your agents runs on your own machines.'],
    ],
  },
  {
    title: 'No one can read a credential',
    tone: 'from-accent-d-950',
    Visual: Credential,
    points: [
      ['solar:lock-keyhole-linear', 'Never shown again after saving', 'Not through the API, not in the builder, not in an export. The worker unlocks the secret only while a step runs.'],
      ['solar:brain-linear', 'Agents never see the secret', 'An agent picks a connection by name, so the secret behind it never reaches a prompt or a model.'],
      ['solar:key-minimalistic-square-linear', 'Or store them in your own vault', 'Vault, AWS Secrets Manager, CyberArk Conjur and 1Password can pass the value in at run time, so we never store it.'],
    ],
  },
  {
    title: 'Runs are isolated and audited',
    tone: 'from-accent-b-950',
    Visual: Isolation,
    points: [
      ['solar:shield-keyhole-linear', 'Each run gets its own sandbox', 'Hardened mode runs the engine in an isolate, with a filesystem view and caches of its own.'],
      ['solar:global-linear', 'You decide what a run can reach', 'The engine checks every outbound request, and your network boundary decides what actually leaves.'],
      ['solar:user-check-linear', 'Big actions wait for approval', 'An agent reaches only the tools you gave it, and every action it takes is recorded as it happens.'],
    ],
  },
]

// `bg-linear-to-b {tone} to-primary-950`; the gradient snaps between rows (a gradient can't transition).
function SecurityStage({ tone, className = '', children }) {
  return (
    <div
      className={`relative isolate flex items-center justify-center overflow-hidden rounded-4xl bg-gradient-to-b ${tone} to-primary-950 px-6 py-14 shadow-edge transition-colors duration-500 ease-smooth motion-reduce:transition-none md:px-12 md:py-20 ${className}`}
    >
      <GlyphField tint="light" fade="panel" />
      <div aria-hidden="true" className="sec-stage-glow pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -bottom-20 size-72 rounded-full bg-white/10 blur-3xl" />
      <div className="relative flex h-96 w-full max-w-[26rem] items-center justify-center">{children}</div>
    </div>
  )
}

const ENTER = 'transition duration-500 ease-smooth motion-reduce:transition-none'
const ENTER_FROM = 'translate-y-2 scale-[0.995] opacity-0'
const LEAVE = 'absolute inset-0 flex items-center justify-center transition duration-500 ease-smooth motion-reduce:transition-none'
const LEAVE_TO = '-translate-y-1 scale-[0.995] opacity-0'
const DURATION = 500

// Vue <Transition> (default mode: enter and leave run together), keyed by the active index.
function SwapVisual({ index }) {
  const [items, setItems] = useState([{ key: index, phase: 'idle' }])
  const prev = useRef(index)

  useLayoutEffect(() => {
    if (prev.current === index) return undefined
    const from = prev.current
    prev.current = index
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setItems([{ key: index, phase: 'idle' }])
      return undefined
    }
    // frame 0: leaving at rest + entering at its from-state
    setItems([
      { key: from, phase: 'leave' },
      { key: index, phase: 'enter-from' },
    ])
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() =>
        setItems([
          { key: from, phase: 'leave-to' },
          { key: index, phase: 'enter' },
        ]),
      )
    })
    const done = setTimeout(() => setItems([{ key: index, phase: 'idle' }]), DURATION)
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      clearTimeout(done)
    }
  }, [index])

  return items.map(({ key, phase }) => {
    const { Visual } = ROWS[key]
    const cls = {
      idle: '',
      'enter-from': `${ENTER} ${ENTER_FROM}`,
      enter: ENTER,
      leave: LEAVE,
      'leave-to': `${LEAVE} ${LEAVE_TO}`,
    }[phase]
    return (
      <div key={key} className={`w-full ${cls}`}>
        <Visual />
      </div>
    )
  })
}

export default function FeatureRows() {
  const [active, setActive] = useState(0)
  const frameRef = useRef(null)
  const rowRefs = useRef([])
  const shieldEls = useRef([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const i = rowRefs.current.indexOf(e.target)
          if (i !== -1) setActive(i)
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    rowRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section data-section="security_rows" className="relative isolate px-5 py-24 md:px-6 md:py-32 lg:px-8">
      <GlyphField frameRef={frameRef} shieldRefs={shieldEls} className="-z-10" />
      <div ref={frameRef} className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
        <ul className="flex w-full flex-col gap-20 lg:w-[45%] lg:gap-0">
          {ROWS.map((row, i) => (
            <li
              key={row.title}
              ref={(el) => (rowRefs.current[i] = el)}
              className="flex flex-col justify-center lg:min-h-[80vh]"
            >
              <div ref={(el) => (shieldEls.current[i] = el)}>
                <h2 className="font-display text-3xl font-bold text-balance text-ink-900 md:text-4xl">{row.title}</h2>
                <ul className="mt-8 flex flex-col gap-7">
                  {row.points.map(([icon, title, body]) => (
                    <li key={title} className="flex items-start gap-3">
                      <Icon name={icon} className="mt-0.5 size-6 shrink-0 text-ink-900" />
                      <span className="flex flex-col gap-1">
                        <span className="text-lg font-semibold text-ink-900">{title}</span>
                        <span className="text-base text-pretty text-ink-600">{body}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <SecurityStage tone={row.tone} className="mt-8 lg:hidden">
                <row.Visual />
              </SecurityStage>
            </li>
          ))}
        </ul>
        <div className="hidden lg:sticky lg:top-24 lg:block lg:w-[55%]">
          <SecurityStage tone={ROWS[active].tone}>
            <SwapVisual index={active} />
          </SecurityStage>
        </div>
      </div>
    </section>
  )
}
