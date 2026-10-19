import { useEffect, useRef, useState } from 'react'
import { LOGOS, fit } from '../pricing/logoFit'
import LogoFadeCell from '../pricing/LogoFadeCell'

// /sales pitch-card logo grid (SPEC_MARKETING §2; functions T/E/D in specs/ref/js/sales.e5BFP-yD.js).
// 6 cells fitted into a 112x28 box, starting with the first six logos. Every 1400ms (skipped under
// reduced motion) one random cell (never the same cell twice in a row) swaps to a random logo that
// is not currently shown. Out-in fade, 160ms ease-out, no stagger (Sales.css .logo-fade-sales).
const COUNT = 6
const EVERY = 1400
const BOX_W = 112
const BOX_H = 28
const FADE = 160

const FIT = fit(LOGOS, BOX_W / BOX_H)
const CELL_H = BOX_H * FIT.maxScale
const INITIAL = Array.from({ length: COUNT }, (_, i) => i % FIT.fitted.length)

function pickCell(last) {
  const options = Array.from({ length: COUNT }, (_, i) => i).filter((i) => i !== last)
  return options[Math.floor(Math.random() * options.length)]
}

function pickLogo(shown, current) {
  const used = new Set(shown)
  const free = []
  for (let i = 0; i < FIT.fitted.length; i++) if (!used.has(i)) free.push(i)
  if (free.length === 0) {
    const others = Array.from({ length: FIT.fitted.length }, (_, i) => i).filter((i) => i !== current)
    return others[Math.floor(Math.random() * others.length)]
  }
  return free[Math.floor(Math.random() * free.length)]
}

export default function SalesLogoGrid() {
  const [shown, setShown] = useState(INITIAL)
  const shownRef = useRef(INITIAL)
  const lastCell = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => {
      const prev = shownRef.current
      const cell = pickCell(lastCell.current)
      const next = [...prev]
      next[cell] = pickLogo(prev, prev[cell])
      lastCell.current = cell
      shownRef.current = next
      setShown(next)
    }, EVERY)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="grid grid-cols-2 items-center gap-x-4 gap-y-8 sm:grid-cols-[repeat(3,auto)] sm:justify-between sm:gap-y-6">
      {shown.map((logoIndex, i) => (
        <div key={i} className="flex w-28 items-center justify-center" style={{ height: `${CELL_H}px` }}>
          <LogoFadeCell
            item={FIT.fitted[logoIndex]}
            boxW={BOX_W}
            boxH={BOX_H}
            color="bg-ink-800"
            fadeClass="logo-fade-sales"
            leaveMs={FADE}
          />
        </div>
      ))}
    </div>
  )
}
