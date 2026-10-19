import { useEffect, useRef, useState } from 'react'

// ui-animated-number (specs/ref/js/pricing.BeJfHQmB.js): on value change, counts from the current
// displayed value to the new one over 420ms with ease 1-(1-t)^5; en-US grouping, rounded integers.
const FORMAT = new Intl.NumberFormat('en-US')
const ease = (t) => 1 - (1 - t) ** 5

export default function AnimatedNumber({ value, prefix = '', suffix = '', duration = 420 }) {
  const [current, setCurrent] = useState(value)
  const currentRef = useRef(value)
  const raf = useRef(0)

  useEffect(() => {
    cancelAnimationFrame(raf.current)
    const set = (v) => {
      currentRef.current = v
      setCurrent(v)
    }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      set(value)
      return undefined
    }
    const from = currentRef.current
    if (from === value) return undefined
    const start = performance.now()
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration)
      if (t < 1) {
        set(from + (value - from) * ease(t))
        raf.current = requestAnimationFrame(step)
      } else set(value)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [value, duration])

  return (
    <span className="tabular-nums">
      {prefix}
      {FORMAT.format(Math.round(current))}
      {suffix}
    </span>
  )
}
