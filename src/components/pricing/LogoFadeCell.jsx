import { useEffect, useRef, useState } from 'react'
import { logoStyle } from './logoFit'
import './RotatingLogos.css'

// One logo slot with the original's Vue <Transition name="logo-fade" mode="out-in"> keyed by src:
// the old logo leaves (opacity 0, scale .94), then the new one mounts in that state and enters.
// `leaveMs` = transition-delay + duration of the leave, so the swap happens once the leave has finished.
// Transition timing lives in CSS (`fadeClass` + .is-out/.is-from), see RotatingLogos.css / Sales.css.
export default function LogoFadeCell({ item, boxW, boxH, color, fadeClass, leaveMs }) {
  const [shown, setShown] = useState(item)
  const [phase, setPhase] = useState('in') // 'in' | 'out' (leaving) | 'from' (entering, first frame)
  const raf = useRef(0)

  useEffect(() => {
    if (item.logo.src === shown.logo.src) return undefined
    setPhase('out')
    const t = setTimeout(() => {
      setShown(item)
      setPhase('from')
      raf.current = requestAnimationFrame(() => {
        raf.current = requestAnimationFrame(() => setPhase('in'))
      })
    }, leaveMs)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(raf.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item])

  return (
    <span
      key={shown.logo.src}
      role="img"
      aria-label={shown.logo.alt}
      className={`block w-full ${color} logo-mask ${fadeClass}${phase === 'in' ? '' : ` is-${phase}`}`}
      style={logoStyle(shown, boxW, boxH)}
    />
  )
}
