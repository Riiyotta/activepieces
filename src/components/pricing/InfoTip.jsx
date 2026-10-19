import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

// InfoTip (SPEC_MARKETING §1.7; pricing-info-tip in specs/ref/js/pricing.BeJfHQmB.js).
// Opens on mouseenter/focus, closes 90ms after mouseleave (re-entering trigger or tip cancels),
// click toggles, Esc / blur / pointerdown outside close. Fade: opacity 200ms ease-out both ways.
// The tip is clamped 12px inside the viewport via a horizontal offset G.
const FADE_MS = 200

export default function InfoTip({ text, children }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [gap, setGap] = useState(0)
  const rootRef = useRef(null)
  const tipRef = useRef(null)
  const closeTimer = useRef(null)

  const show = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setOpen(true)
  }, [])
  const hide = useCallback(() => setOpen(false), [])
  const hideSoon = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(hide, 90)
  }, [hide])

  // Mount -> fade in; fade out -> unmount (Vue <Transition> equivalent).
  useEffect(() => {
    if (open) {
      setMounted(true)
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      return () => cancelAnimationFrame(r)
    }
    setVisible(false)
    const t = setTimeout(() => setMounted(false), FADE_MS)
    return () => clearTimeout(t)
  }, [open])

  // Re-measure the clamp each time it opens.
  useLayoutEffect(() => {
    if (!open || !mounted) return
    const el = tipRef.current
    if (!el) return
    const prev = el.style.transform
    el.style.transform = 'translateX(-50%)'
    const r = el.getBoundingClientRect()
    let g = 0
    if (r.left < 12) g = Math.round(12 - r.left)
    else if (r.right > window.innerWidth - 12) g = Math.round(window.innerWidth - 12 - r.right)
    el.style.transform = prev
    setGap(g)
  }, [open, mounted])

  useEffect(() => {
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  const tipId = `tip-${id}`

  return (
    <span ref={rootRef} className="relative">
      <span
        className="cursor-help underline decoration-ink-400 decoration-dotted decoration-1 underline-offset-4 transition-colors duration-200 hover:decoration-ink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        onMouseEnter={show}
        onMouseLeave={hideSoon}
        onFocus={show}
        onBlur={hide}
        onKeyDown={(e) => {
          if (e.key === 'Escape') hide()
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (open) hide()
          else show()
        }}
      >
        {children}
      </span>
      {mounted && (
        <span
          id={tipId}
          ref={tipRef}
          role="tooltip"
          className={`absolute bottom-full left-1/2 z-40 mb-2.5 block w-72 rounded-xl bg-ink-950 px-4 py-3 text-left text-[15px] leading-snug font-normal text-ink-100 shadow-over transition-opacity duration-200 ease-out ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: `translateX(calc(-50% + ${gap}px))` }}
          onMouseEnter={show}
          onMouseLeave={hideSoon}
        >
          {text}{' '}
          <span
            aria-hidden="true"
            className="absolute top-full size-2 -translate-y-1/2 rotate-45 bg-ink-950"
            style={{ left: `calc(50% - ${gap}px - 0.25rem)` }}
          />
        </span>
      )}
    </span>
  )
}
