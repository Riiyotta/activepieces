import { useEffect, useMemo, useState } from 'react'
import { LOGOS, fit } from './logoFit'
import LogoFadeCell from './LogoFadeCell'

// RotatingLogos (SPEC_MARKETING §1.4; specs/ref/js/rotating-logos.BYqqypr3.js).
// 6 cells fitted into a 112x32 box. Every 3500ms (skipped under reduced motion) the window advances
// by 6 through the 24 logos; each cell swaps out-in with a 40ms-per-cell stagger.
const COUNT = 6
const EVERY = 3500
const BOX_W = 112
const BOX_H = 32
const STAGGER = 40
const FADE = 300

const FIT = fit(LOGOS, BOX_W / BOX_H)
const CELL_H = BOX_H * FIT.maxScale

export default function RotatingLogos() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => setOffset((o) => (o + COUNT) % FIT.fitted.length), EVERY)
    return () => clearInterval(id)
  }, [])

  const items = useMemo(
    () => Array.from({ length: COUNT }, (_, i) => FIT.fitted[(i + offset) % FIT.fitted.length]),
    [offset],
  )

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-10">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-center"
          style={{ '--stagger': `${i * STAGGER}ms`, height: `${CELL_H}px` }}
        >
          <LogoFadeCell
            item={item}
            boxW={BOX_W}
            boxH={BOX_H}
            color="bg-ink-600"
            fadeClass="logo-fade-rotating"
            leaveMs={i * STAGGER + FADE}
          />
        </div>
      ))}
    </div>
  )
}
