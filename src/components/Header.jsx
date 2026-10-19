import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useLocation } from 'react-router-dom'
import Icon from './ui/Icon'
import { buttonClasses } from './ui/Button'
import './Header.css'

// Menu data (CLONE_SPEC §1.1, cross-checked with the site-header source in C_93-1CU.js).
const GITHUB = 'https://github.com/activepieces/activepieces'
const SELF_HOST = '/docs' // exact docs self-host path not captured (see handoff)
const SIGN_UP = 'https://cloud.activepieces.com/sign-up'

const MENU = [
  {
    label: 'Product',
    columns: [
      {
        heading: 'Use Activepieces with',
        items: [
          { label: 'Chat', description: 'One chat box for the whole platform', to: '/product/chat', icon: 'solar:chat-round-dots-bold' },
          { label: 'MCP server', description: 'Use Activepieces in Claude or Cursor', to: '/mcp', icon: 'solar:plug-circle-bold' },
        ],
      },
      {
        heading: 'The building blocks',
        items: [
          { label: 'Integrations', description: 'Works with 760+ apps out of the box', to: '/pieces', icon: 'solar:widget-bold' },
          { label: 'AI Agents', description: 'Agents that do the work in your apps', to: '/product/ai-agent-builder', icon: 'solar:bot-bold' },
          { label: 'Tables', description: 'Keeps records without a database', to: '/product/tables', icon: 'solar:database-bold' },
          { label: 'Workflows', description: 'Runs repetitive work on a schedule', to: '/product/workflow-builder', icon: 'solar:structure-bold' },
        ],
      },
      {
        heading: 'Open source',
        items: [
          { label: 'GitHub', description: 'Read every line', to: GITHUB, icon: 'simple-icons:github' },
          { label: 'Self-host it', description: 'Run it on your own box', to: SELF_HOST, icon: 'solar:server-bold' },
          { label: 'For OSS developers', description: 'Build on the platform', to: '/solutions/open-source-developers', icon: 'solar:code-bold' },
        ],
      },
    ],
  },
  {
    label: 'Solutions',
    columns: [
      {
        heading: 'Business teams',
        items: [
          { label: 'Marketing', description: 'Ship campaigns without eng', to: '/solutions/marketing', icon: 'solar:speaker-bold' },
          { label: 'Sales', description: 'Follow up the same day', to: '/solutions/sales', icon: 'solar:graph-up-bold' },
          { label: 'Customer Support', description: 'Answer faster, with context', to: '/solutions/customer-support', icon: 'solar:headphones-round-bold' },
          { label: 'Operations', description: 'Recurring work, off your plate', to: '/solutions/operations', icon: 'solar:restart-circle-bold' },
          { label: 'Finance', description: 'Approvals off the spreadsheet', to: '/solutions/finance', icon: 'solar:bill-bold' },
          { label: 'HR', description: 'Onboarding that finishes', to: '/solutions/hr', icon: 'solar:users-group-rounded-bold' },
        ],
      },
      {
        heading: 'Technical teams',
        items: [
          { label: 'Engineering', description: 'Skip the glue service', to: '/solutions/engineering', icon: 'solar:programming-bold' },
          { label: 'IT', description: 'Access on and off, on time', to: '/solutions/it', icon: 'solar:key-bold' },
          { label: 'Internal Tools', description: 'Ship it without a team', to: '/solutions/internal-tools', icon: 'solar:window-frame-bold' },
        ],
      },
    ],
  },
  {
    label: 'Enterprise',
    row: true,
    cta: { label: 'Talk to sales', to: '/sales' },
    columns: [
      {
        heading: 'Control',
        items: [
          { label: 'AI Governance', description: 'Approve every AI action', to: '/ai-governance', icon: 'solar:shield-check-bold' },
          { label: 'Security', description: "Answer your reviewer's questions", to: '/security', icon: 'solar:lock-keyhole-bold' },
          { label: 'Self-hosting', description: 'Keep data in your network', to: SELF_HOST, icon: 'solar:buildings-2-bold' },
          { label: 'Embed', description: 'Automation under your brand', to: '/embed', icon: 'solar:code-square-bold' },
        ],
      },
    ],
  },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Docs', to: '/docs' },
]

const isWide = (col) => col.items.length >= 5
const isExternal = (to) => /^https?:\/\//.test(to)
const extProps = (to) => (isExternal(to) ? { target: '_blank', rel: 'noopener noreferrer' } : {})

const NAV_BASE =
  'relative rounded-full px-3.5 py-2 text-[15px] font-medium active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
const NAV_TRANS = 'transition-[color,background-color,transform] duration-200 ease-out'

// Mount/unmount with an enter + leave transition (Vue <Transition> equivalent).
function usePresence(open, leaveMs) {
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(open)
  useEffect(() => {
    if (open) {
      setMounted(true)
      let r2
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setShown(true))
      })
      return () => {
        cancelAnimationFrame(r1)
        cancelAnimationFrame(r2)
      }
    }
    setShown(false)
    const t = setTimeout(() => setMounted(false), leaveMs)
    return () => clearTimeout(t)
  }, [open, leaveMs])
  return [mounted, shown]
}

export default function Header({ heroArt = true }) {
  const { pathname } = useLocation()
  const ref = encodeURIComponent(pathname)
  const [openLabel, setOpenLabel] = useState(null) // which desktop panel is open
  const [intent, setIntent] = useState(false) // pointer is engaged with the nav
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileGroup, setMobileGroup] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [ready, setReady] = useState(false)
  const [panelH, setPanelH] = useState(0)
  const [pill, setPill] = useState(null)
  const [pillOn, setPillOn] = useState(false)

  const closeTimer = useRef(0)
  const measureRef = useRef(null)
  const live = useRef({ mobileOpen, openLabel })
  live.current = { mobileOpen, openLabel }

  const current = MENU.find((m) => m.label === openLabel) || null

  // --- desktop menu open/close -------------------------------------------
  // flushSync: mouseenter is a continuous-priority event in React 18, so without it the open state
  // commits a frame (or more, in dev) after the native :hover style - flashing the idle hover tint.
  // The original (Vue) applies both in the same frame.
  const openMenu = (item) => {
    clearTimeout(closeTimer.current)
    flushSync(() => {
      setIntent(true)
      setOpenLabel(item.columns ? item.label : null)
    })
  }
  const closeNow = useCallback(() => {
    clearTimeout(closeTimer.current)
    setOpenLabel(null)
    setIntent(false)
    setPillOn(false)
    setPill(null)
  }, [])
  const scheduleClose = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(closeNow, 180)
  }
  const cancelClose = () => clearTimeout(closeTimer.current)

  // Pill highlight: positioned relative to [data-menu-surface]
  const movePill = (e) => {
    const el = e.currentTarget
    const surface = el.closest('[data-menu-surface]')
    if (!surface) return
    const r = el.getBoundingClientRect()
    const s = surface.getBoundingClientRect()
    setPill({ left: r.left - s.left, top: r.top - s.top, width: r.width, height: r.height })
    setPillOn(true)
  }
  const hidePill = () => setPillOn(false)

  // Panel height follows the measured content (0 when closed)
  useLayoutEffect(() => {
    setPillOn(false)
    setPill(null)
    if (!openLabel) {
      setPanelH(0)
      return
    }
    const el = measureRef.current
    if (!el) return
    setPanelH(el.offsetHeight)
    const ro = new ResizeObserver(() => setPanelH(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [openLabel])

  // Entrance class before first paint (Vue onMounted timing), so nav-in starts with the hero lines.
  useLayoutEffect(() => setReady(true), [])

  // --- scroll: on-art threshold + hide/show (exact logic from CLONE_SPEC §1) -
  useEffect(() => {
    let raf = 0
    let lastY = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const y = Math.max(window.scrollY, 0)
        setScrolled(y > 32)
        const { mobileOpen: m, openLabel: o } = live.current
        if (m || o) setHidden(false)
        else if (y > lastY + 4 && y > 160) setHidden(true)
        else if (y < lastY - 4) setHidden(false)
        lastY = y
      })
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeNow()
        setMobileOpen(false)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKey)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKey)
      if (raf) cancelAnimationFrame(raf)
      clearTimeout(closeTimer.current)
      document.body.style.overflow = ''
    }
  }, [closeNow])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
  }, [mobileOpen])

  const [sheetMounted, sheetShown] = usePresence(mobileOpen, 220)

  // --- state-dependent classes --------------------------------------------
  const engaged = scrolled || mobileOpen || intent || openLabel !== null
  const onArt = heroArt && !engaged
  const islandBg = mobileOpen || intent || openLabel ? 'bg-white' : onArt ? 'bg-white/62' : 'bg-white/68'
  const navIdle = onArt ? 'text-primary-950 hover:bg-primary-950/8' : 'text-ink-900 hover:bg-ink-950/5 hover:text-ink-950'
  const navOpen = onArt ? 'bg-primary-950/8 text-primary-950' : 'bg-ink-950/5 text-ink-950'
  const wordmarkBg = onArt ? 'bg-primary-950' : 'bg-ink-950'
  const logomarkBg = onArt ? 'bg-primary-950' : 'bg-primary-700'
  const focusRing = onArt ? 'focus-visible:outline-primary-950' : 'focus-visible:outline-primary-700'
  const openAppBg = onArt ? 'bg-white hover:bg-white/80' : 'bg-ink-950/6 hover:bg-ink-950/10'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-100 pt-3 transition-transform duration-300 ease-smooth motion-reduce:transition-none md:pt-4 ${
        hidden ? '-translate-y-[calc(100%+1rem)]' : 'translate-y-0'
      } ${onArt ? 'on-art' : ''}`}
    >
      <div className="mx-auto w-full max-w-7xl px-3 min-[360px]:px-5 md:px-6 lg:px-8">
        <div
          className={`island overflow-hidden rounded-2xl transition-[background-color] duration-300 ease-out ${islandBg}`}
          onMouseLeave={scheduleClose}
        >
          <div
            className={`nav-row flex h-16 items-center justify-between gap-3 px-3 min-[360px]:px-4 sm:gap-6 md:h-17 md:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-3 xl:gap-6 ${
              ready ? 'is-ready' : ''
            }`}
          >
            <a href="/" aria-current={pathname === "/" ? "page" : undefined} className="flex min-h-11 items-center justify-self-start" aria-label="Activepieces home">
              <span className="relative block aspect-[945/147] h-4 min-[360px]:h-5 md:h-6">
                <span className={`${wordmarkBg} logo-layer [mask-image:url(/brand/activepieces-wordmark.svg)]`} />
                <span className={`${logomarkBg} logo-layer [mask-image:url(/brand/activepieces-logomark.svg)]`} />
              </span>
            </a>

            <div className="hidden justify-self-center lg:block">
              <nav className="flex items-center gap-1" onMouseLeave={scheduleClose}>
                {MENU.map((item) =>
                  item.columns ? (
                    <button
                      key={item.label}
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={openLabel === item.label}
                      className={`group flex items-center gap-1 ${NAV_BASE} ${NAV_TRANS} ${focusRing} ${
                        openLabel === item.label ? navOpen : navIdle
                      }`}
                      onMouseEnter={() => openMenu(item)}
                      onFocus={() => openMenu(item)}
                    >
                      {item.label}{' '}
                      <Icon
                        name="solar:alt-arrow-down-linear"
                        className={`-mr-0.5 size-4 transition-transform duration-200 ease-out motion-reduce:transition-none ${
                          openLabel === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  ) : (
                    <a
                      key={item.label}
                      href={item.to}
                      className={`${NAV_BASE} ${NAV_TRANS} ${focusRing} ${navIdle}`}
                      onMouseEnter={() => openMenu(item)}
                    >
                      {item.label}
                    </a>
                  ),
                )}
              </nav>
            </div>

            <div className="flex items-center gap-2 justify-self-end xl:gap-3">
              <a
                href={`${SIGN_UP}?ap_cta=header&ref=${ref}`}
                className={`flex h-9 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap text-ink-950 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 max-lg:hidden ${openAppBg} ${focusRing}`}
              >
                Open app
              </a>
              <a href="/sales?ap_cta=header" className={buttonClasses('sm', 'solid', 'group max-[359px]:px-3')}>
                Talk to sales{' '}
                <Icon
                  name="solar:alt-arrow-right-linear"
                  className="-mr-1 size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none max-sm:hidden"
                />
              </a>
              <button
                type="button"
                className="-mr-1 rounded-full p-2.5 text-ink-900 lg:hidden"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
              >
                <Icon name={mobileOpen ? 'solar:close-circle-linear' : 'solar:hamburger-menu-linear'} className="size-5" />
              </button>
            </div>
          </div>

          {/* Desktop mega panel: the island grows downward */}
          <div
            className="hidden overflow-hidden transition-[height] duration-300 ease-smooth motion-reduce:transition-none lg:block"
            style={{ height: `${panelH}px` }}
            onMouseEnter={cancelClose}
          >
            <div ref={measureRef}>
              {current && (
                <div key={current.label} className="panel-in mx-6 border-t border-ink-950/8 pt-4 pb-6" onMouseLeave={hidePill}>
                  <div data-menu-surface="" className="relative -mx-3 flex w-auto gap-5">
                    <div
                      className="pointer-events-none absolute rounded-xl bg-ink-950/5"
                      style={{
                        left: `${pill?.left ?? 0}px`,
                        top: `${pill?.top ?? 0}px`,
                        width: `${pill?.width ?? 0}px`,
                        height: `${pill?.height ?? 0}px`,
                        opacity: pillOn ? 1 : 0,
                        scale: pillOn ? '1' : '0.96',
                        transition:
                          'opacity 130ms ease, scale 130ms var(--ease-smooth), left 220ms var(--ease-smooth), top 220ms var(--ease-smooth), width 220ms var(--ease-smooth), height 220ms var(--ease-smooth)',
                      }}
                    />
                    {current.columns.map((col) => (
                      <div key={col.heading} className={`min-w-0 ${isWide(col) ? 'flex-[2]' : 'flex-1'}`}>
                        {!current.row && (
                          <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.08em] text-ink-500 uppercase">{col.heading}</p>
                        )}
                        <ul
                          className={
                            current.row
                              ? 'grid grid-cols-4 gap-x-5'
                              : isWide(col)
                                ? 'grid grid-cols-2 gap-x-5 gap-y-1'
                                : 'flex flex-col gap-1'
                          }
                        >
                          {col.items.map((it) => (
                            <li key={it.label}>
                              <a
                                href={it.to}
                                {...extProps(it.to)}
                                className="relative flex items-center gap-3.5 rounded-xl px-3 py-2.5"
                                onMouseEnter={movePill}
                                onClick={closeNow}
                              >
                                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-ink-950/6">
                                  <Icon name={it.icon} className="size-5.5 text-ink-700" />
                                </span>
                                <span className="flex flex-col gap-0.5">
                                  <span className="text-[15px] font-semibold text-ink-950">{it.label}</span>
                                  <span className="text-[13px] text-ink-600">{it.description}</span>
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {current.cta && (
                    <div className="mt-5 flex justify-center">
                      <a
                        href={`${current.cta.to}?ap_cta=header_menu`}
                        className="cta-rail group inline-flex items-center gap-2.5 text-[15px] font-semibold tracking-[0.02em] text-ink-950"
                        onMouseEnter={hidePill}
                        onClick={closeNow}
                      >
                        <span className="cta-word relative">{current.cta.label}</span>
                        <Icon
                          name="solar:arrow-right-linear"
                          className="size-4 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
                        />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile sheet (<1024) */}
          {sheetMounted && (
            <div
              className={`sheet-anim overflow-y-auto rounded-b-2xl border-t border-ink-950/8 lg:hidden ${sheetShown ? '' : 'is-off'}`}
              style={{ maxHeight: 'calc(100dvh - var(--spacing-chrome) - 1.5rem)' }}
            >
              <div className="flex flex-col gap-1 px-2 py-4">
                {MENU.map((item) =>
                  item.columns ? (
                    <div key={item.label}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-medium text-ink-900 hover:bg-ink-950/5"
                        aria-expanded={mobileGroup === item.label}
                        onClick={() => setMobileGroup((g) => (g === item.label ? null : item.label))}
                      >
                        {item.label}{' '}
                        <Icon
                          name="solar:alt-arrow-down-linear"
                          className={`size-4 transition-transform duration-200 motion-reduce:transition-none ${
                            mobileGroup === item.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-200 ease-out motion-reduce:transition-none ${
                          mobileGroup === item.label ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                        inert={mobileGroup === item.label ? undefined : ''}
                      >
                        <div className="overflow-hidden">
                          <div className="pb-2 pl-3">
                            {item.columns.map((col) => (
                              <Fragment key={col.heading}>
                                <p className="px-3 pt-3 pb-2 text-xs font-semibold text-ink-600">{col.heading}</p>
                                {col.items.map((it) => (
                                  <a
                                    key={it.label}
                                    href={it.to}
                                    {...extProps(it.to)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-900 hover:bg-ink-950/5"
                                    onClick={() => setMobileOpen(false)}
                                  >
                                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-ink-500/10">
                                      <Icon name={it.icon} className="size-5 text-ink-500" />
                                    </span>{' '}
                                    {it.label}
                                  </a>
                                ))}
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <a
                      key={item.label}
                      href={item.to}
                      className="block rounded-xl px-3 py-3 text-base font-medium text-ink-900 hover:bg-ink-950/5"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  ),
                )}
                <div className="mx-3 mt-3 grid gap-3 border-t border-ink-950/10 pt-4">
                  <a href="/sales?ap_cta=mobile_menu" className={buttonClasses('md', 'solid', 'w-full')}>
                    Talk to sales
                  </a>
                  <a href={`${SIGN_UP}?ap_cta=header_mobile&ref=${ref}`} className={buttonClasses('md', 'secondary', 'w-full')}>
                    Open app
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
