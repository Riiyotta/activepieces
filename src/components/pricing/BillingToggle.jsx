import { useCallback, useLayoutEffect, useRef, useState } from 'react'

// Monthly / Annual toggle (SPEC_MARKETING §3.A). The selected state is a clip-path reveal of two
// overlays (ink-800 fill + white label copies), inset to the selected button's box inside the pill.
// Clip-path transitions 200ms ease-smooth. Geometry measured like the original (offsetLeft - clientLeft).
const OPTIONS = [
  { annual: false, label: 'Monthly', badge: null },
  { annual: true, label: 'Annual', badge: 'Save 2 months' },
]

const BTN =
  'relative flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-[15px] font-medium whitespace-nowrap text-ink-600 transition-colors duration-200 ease-smooth hover:text-ink-950 motion-reduce:transition-none min-[360px]:px-5 min-[360px]:text-base'
const OVERLAY = 'pointer-events-none absolute inset-0 transition-[clip-path] duration-200 ease-smooth will-change-[clip-path] motion-reduce:transition-none'

export default function BillingToggle({ annual, onChange }) {
  const pillRef = useRef(null)
  const btnRefs = useRef([])
  const [geo, setGeo] = useState(null)

  const measure = useCallback(() => {
    const pill = pillRef.current
    const btns = btnRefs.current
    if (!pill || btns.length < OPTIONS.length || btns.some((b) => !b)) return
    setGeo({
      box: { width: pill.clientWidth, height: pill.clientHeight },
      btns: btns.map((b) => ({
        left: b.offsetLeft - pill.clientLeft,
        top: b.offsetTop - pill.clientTop,
        width: b.offsetWidth,
        height: b.offsetHeight,
      })),
    })
  }, [])

  useLayoutEffect(() => {
    measure()
    document.fonts?.ready.then(measure)
    if (typeof ResizeObserver === 'undefined' || !pillRef.current) return undefined
    const ro = new ResizeObserver(measure)
    ro.observe(pillRef.current)
    return () => ro.disconnect()
  }, [measure])

  let clip = null
  if (geo) {
    const b = geo.btns[annual ? 1 : 0]
    const right = Math.max(0, geo.box.width - b.left - b.width)
    const bottom = Math.max(0, geo.box.height - b.top - b.height)
    clip = { clipPath: `inset(${b.top}px ${right}px ${bottom}px ${b.left}px round 9999px)` }
  }

  return (
    <div className="mt-7 mb-6 flex flex-col items-center md:mt-9">
      <div ref={pillRef} className="relative inline-flex items-center gap-1 rounded-full border border-ink-950/10 bg-white p-1">
        {OPTIONS.map((o, i) => (
          <button
            key={o.label}
            ref={(el) => {
              btnRefs.current[i] = el
            }}
            type="button"
            className={BTN}
            aria-pressed={annual === o.annual}
            onClick={() => o.annual !== annual && onChange(o.annual)}
          >
            {o.label}{' '}
            {o.badge && (
              <>
                <span aria-hidden="true" className="opacity-40">
                  ·
                </span>
                <span className="text-xs leading-6 font-semibold text-primary-600 min-[360px]:text-sm">{o.badge}</span>
              </>
            )}
          </button>
        ))}
        {clip && <span aria-hidden="true" className={`${OVERLAY} bg-ink-800`} style={clip} />}
        {clip && (
          <span aria-hidden="true" className={`${OVERLAY} flex items-center gap-1 p-1`} style={clip}>
            {OPTIONS.map((o) => (
              <span
                key={o.label}
                className="flex items-center gap-2 px-3 py-2 text-[15px] font-medium whitespace-nowrap text-white min-[360px]:px-5 min-[360px]:text-base"
              >
                {o.label}{' '}
                {o.badge && (
                  <>
                    <span aria-hidden="true" className="opacity-40">
                      ·
                    </span>
                    <span className="text-xs leading-6 font-semibold text-primary-300 min-[360px]:text-sm">{o.badge}</span>
                  </>
                )}
              </span>
            ))}
          </span>
        )}
      </div>
    </div>
  )
}
