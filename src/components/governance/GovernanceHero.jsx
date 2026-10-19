import { useEffect, useRef, useState } from 'react'
import { buttonClasses } from '../ui/Button'
import Icon from '../ui/Icon'
import LogoRotator from '../templates/LogoRotator'
import './governance.css'

// /ai-governance hero (SPEC_MARKETING §5.A; ai-governance.BuUrctv7.js `governance-hero`, `platform-shot`,
// `shot-plate`). Image card, the 1280×720 admin mock scaled into a plate that rises under the button, and a
// logo bar that sticks to the viewport bottom (hairline border while pinned, i.e. until the sentinel shows).

const SRCSET = [1600, 2400, 3200].map((w) => `/gov-hero/green-${w}.webp ${w}w`).join(', ')

const RAIL = [
  'solar:bolt-linear',
  'solar:play-linear',
  'solar:brain-linear',
  'solar:socket-linear',
  'solar:database-linear',
  'solar:folder-linear',
  'solar:users-group-rounded-linear',
  'solar:shield-linear',
  'solar:filter-linear',
  'solar:chart-linear',
]
const ACTIVE = 5
const STATS = [
  ['Projects', '18'],
  ['People', '148'],
  ['Connections', '312'],
]
// [name, avatar seed, members, active flows, connections]
const PROJECTS = [
  ['Growth', 'growth', '14', '31', '22'],
  ['Revenue Ops', 'revenue-ops', '9', '18', '17'],
  ['Billing', 'billing', '6', '44', '29'],
  ['Support', 'support', '21', '27', '35'],
  ['Data Platform', 'data-platform', '11', '61', '48'],
  ['People Ops', 'people-ops', '5', '12', '9'],
]

function RailButton({ icon, active }) {
  return (
    <div
      className={`flex size-11 items-center justify-center rounded-xl ${
        active ? 'bg-white text-ink-900 shadow-sm ring-1 ring-ink-950/6' : 'text-ink-400'
      }`}
    >
      <Icon name={icon} className="size-[22px]" />
    </div>
  )
}

function PlatformShot() {
  return (
    <div className="flex h-[720px] w-[1280px] bg-white font-sans text-ink-950">
      <aside className="flex w-[76px] shrink-0 flex-col items-center border-r border-ink-950/10 bg-ink-50">
        <div className="gov-mark mt-6 mb-5 aspect-[326/297] h-7 bg-ink-900" />
        <div className="flex flex-col items-center gap-1">
          {RAIL.slice(0, 5).map((icon, i) => (
            <RailButton key={icon} icon={icon} active={i === ACTIVE} />
          ))}
        </div>
        <div className="my-3 h-px w-8 bg-ink-950/10" />
        <div className="flex flex-col items-center gap-1">
          {RAIL.slice(5).map((icon, i) => (
            <RailButton key={icon} icon={icon} active={i + 5 === ACTIVE} />
          ))}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex w-[1128px] shrink-0 items-center gap-6 pt-10 pb-7 pl-12">
          <h2 className="text-[38px] leading-none font-semibold tracking-tight text-ink-950">Platform</h2>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl border border-ink-200 text-ink-400">
              <Icon name="solar:filter-linear" className="size-5" />
            </div>
            <div className="flex h-11 items-center rounded-xl bg-ink-900 px-6 text-[15px] font-medium text-white"> New project </div>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden pl-12">
          <div className="w-[1080px]">
            <div className="flex gap-16 pb-9">
              {STATS.map(([label, value]) => (
                <div key={label}>
                  <div className="text-[15px] font-medium tracking-wide text-ink-400 uppercase">{label}</div>
                  <div className="mt-2 text-[58px] leading-none font-semibold tracking-tight tabular-nums">{value}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[420px_200px_220px_220px] pb-4 text-[14px] font-medium tracking-wide text-ink-400 uppercase">
              <span>Project</span>
              <span className="text-center">Members</span>
              <span className="text-center">Active flows</span>
              <span className="text-center">Connections</span>
            </div>
            {PROJECTS.map(([name, seed, members, flows, connections]) => (
              <div key={name} className="grid grid-cols-[420px_200px_220px_220px] items-center border-t border-ink-950/8 py-[22px]">
                <span className="flex items-center gap-4 text-[19px] font-medium text-ink-900">
                  <img
                    src={`/avatars/projects/${seed}.svg`}
                    alt=""
                    aria-hidden="true"
                    className="size-11 shrink-0 rounded-xl bg-ink-100 object-contain"
                  />{' '}
                  {name}
                </span>
                <span className="text-center text-[19px] text-ink-600 tabular-nums">{members}</span>
                <span className="text-center text-[19px] text-ink-600 tabular-nums">{flows}</span>
                <span className="text-center text-[19px] text-ink-600 tabular-nums">{connections}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const MOCK_W = 1280

// shot-plate: scales the fixed 1280×720 mock to the plate width (ResizeObserver), hidden until measured.
function ShotPlate({ label, className = '', style, children }) {
  const ref = useRef(null)
  const [scale, setScale] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const set = (w) => w > 0 && setScale(w / MOCK_W)
    set(el.clientWidth)
    const ro = new ResizeObserver(([e]) => set(e?.contentRect.width ?? 0))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      inert=""
      role="img"
      aria-label={label}
      className={`gov-plate relative aspect-video w-full cursor-default overflow-hidden select-none ${className}`}
      style={style}
    >
      <div
        className="absolute top-0 left-0 h-[720px] w-[1280px] origin-top-left"
        style={{ transform: `scale(${scale})`, visibility: scale ? undefined : 'hidden' }}
      >
        {children}
      </div>
    </div>
  )
}

export default function GovernanceHero() {
  const heroRef = useRef(null)
  const cardWrapRef = useRef(null)
  const buttonRef = useRef(null)
  const sentinelRef = useRef(null)
  const [lift, setLift] = useState(0)
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    // D = max(0, (cardWrap.bottom − heroTop) − (button.bottom − heroTop + button.marginTop))
    const measure = () => {
      const hero = heroRef.current
      const wrap = cardWrapRef.current
      const btn = buttonRef.current
      if (!hero || !wrap || !btn) return
      const top = hero.getBoundingClientRect().top
      const a = wrap.getBoundingClientRect().bottom - top
      const b = btn.getBoundingClientRect().bottom - top
      const m = parseFloat(getComputedStyle(btn).marginTop) || 0
      setLift(Math.max(0, a - (b + m)))
    }
    const io = new IntersectionObserver(([e]) => setAtEnd(e?.isIntersecting ?? false))
    if (sentinelRef.current) io.observe(sentinelRef.current)
    measure()
    const ro = new ResizeObserver(measure)
    if (cardWrapRef.current) ro.observe(cardWrapRef.current)
    if (buttonRef.current) ro.observe(buttonRef.current)
    return () => {
      io.disconnect()
      ro.disconnect()
    }
  }, [])

  return (
    <div ref={heroRef} data-section="governance_hero" className="gov-hero pb-16 md:pb-20">
      <div ref={cardWrapRef} className="gov-card-wrap">
        <div className="gov-card relative isolate aspect-[3/2] min-h-[32rem] w-full overflow-hidden rounded-3xl bg-white sm:min-h-[36rem]">
          <img
            src="/gov-hero/green-2400.webp"
            srcSet={SRCSET}
            sizes="100vw"
            width="5056"
            height="3371"
            alt=""
            aria-hidden="true"
            fetchpriority="high"
            className="absolute inset-0 size-full object-cover object-[50%_40%]"
          />
          <div className="relative pt-16 sm:pt-20 lg:pt-24">
            <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-5 text-center md:px-6 lg:px-8">
              <h1 className="font-display text-4xl font-bold text-primary-950 sm:text-5xl lg:text-6xl">Move fast, break nothing.</h1>
              <p className="max-w-3xl text-lg text-ink-700 md:text-xl">
                Decide who can build, what they can reach, and what it costs. Every action is recorded. On our EU cloud, or
                entirely inside your own network.
              </p>
            </section>
            <div ref={buttonRef} className="mt-5 flex justify-center">
              <a href="/sales?ap_cta=ai_governance" className={buttonClasses('lg', 'brand')}>
                Talk to sales
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 md:px-6 lg:px-8">
        <div className="mx-auto flow-root max-w-7xl">
          <ShotPlate
            label="The Activepieces platform overview, listing every project with its members, active flows and connections"
            className="rounded-2xl bg-white shadow-lift"
            style={{ marginTop: `-${lift}px` }}
          >
            <PlatformShot />
          </ShotPlate>
        </div>
      </div>
      <div
        className={`sticky bottom-0 z-10 mt-8 border-t bg-white py-5 transition-colors duration-200 ease-out ${
          atEnd ? 'border-transparent' : 'border-ink-950/10'
        }`}
      >
        <div className="px-5 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <LogoRotator />
          </div>
        </div>
      </div>
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
    </div>
  )
}
