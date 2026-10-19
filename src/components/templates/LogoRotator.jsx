import { useEffect, useRef, useState } from 'react'
import './Template.css'

// Solution hero: 6-up rotating customer logo grid (SPEC_PRODUCT_SOLUTIONS §5.2). Not the homepage marquee.
// 4 sets of 6, always starting at set 1. First swap ~4.0s after load, then every 3.5s; cell i swaps 40ms
// after cell i−1. Each cell runs out-then-in (Vue <Transition name="logo-fade" mode="out-in">).

const CELL_H = 38.40833897525644

// [name, file under /logos/customers/, height px, max-width px, translateY]
const SETS = [
  [
    ['Bosch', 'bosch.svg', 31.23, 109.29, 0.0196],
    ['Alan', 'alan.svg', 29.45, 103.09, 0],
    ['SAP', 'sap.svg', 31.11, 108.9, 0],
    ['Tryg', 'tryg.svg', 27.52, 96.32, 0],
    ['Funding Societies', 'funding-societies.svg', 29.66, 103.82, 0],
    ['Carrefour', 'carrefour.svg', 38.4, 134.4, 0],
  ],
  [
    ['Corgi', 'corgi.webp', 30.7, 107.47, 0],
    ['Hilton', 'hilton.svg', 32.45, 113.56, 0],
    ['Lumen Technologies', 'lumen.svg', 36.83, 128.91, 0.0148],
    ['Pipefy', 'pipefy.svg', 29.81, 104.33, 0],
    ['Dell Technologies', 'dell-technologies.svg', 38.41, 134.43, 0],
    ['ZeroFox', 'zerofox.svg', 36.96, 129.36, 0],
  ],
  [
    ['Decathlon', 'decathlon.svg', 32.97, 115.38, 0],
    ['Merkle', 'merkle.svg', 36.45, 127.56, 0],
    ['Orange', 'orange.svg', 31.03, 108.61, 0],
    ['EXL', 'exl.svg', 28.97, 101.39, 0],
    ['Concentrix', 'concentrix.svg', 33.85, 118.49, 0],
    ['Odoo', 'odoo.svg', 28.39, 99.37, 0],
  ],
  [
    ['Keller Williams', 'keller-williams.svg', 38.4, 134.4, 0],
    ['HackerOne', 'hackerone.svg', 33.94, 118.79, -0.0586],
    ['Shopee', 'shopee.svg', 31.58, 110.53, 0],
    ['ITV', 'itv.svg', 31.46, 110.11, 0],
    ['MoneyGram', 'moneygram.svg', 33.22, 116.27, 0],
    ['Capgemini', 'capgemini.svg', 32.72, 114.51, 0],
  ],
]

const FIRST = 4000
const EVERY = 3500
const STAGGER = 40
const FADE = 300

function Cell({ i, logo, state }) {
  const [name, file, h, maxW, ty] = logo
  const url = `url(/logos/customers/${file})`
  return (
    <div className="flex items-center justify-center" style={{ '--stagger': `${i * STAGGER}ms`, height: `${CELL_H}px` }}>
      <span
        role="img"
        aria-label={name}
        className={`tpl-logo block w-full bg-ink-600 ${state === 'out' ? 'logo-fade-out' : state === 'from' ? 'logo-fade-from' : ''}`}
        style={{
          WebkitMaskImage: url,
          maskImage: url,
          height: `${h}px`,
          maxWidth: `${maxW}px`,
          ...(ty ? { translate: `0 ${ty}px` } : null),
        }}
      />
    </div>
  )
}

export default function LogoRotator() {
  // Per cell: [set index, state] with state 'in' | 'out' (leaving) | 'from' (entering, first frame)
  const [cells, setCells] = useState(() => SETS[0].map(() => [0, 'in']))
  const timers = useRef([])

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const list = timers.current
    const later = (fn, ms) => list.push(setTimeout(fn, ms))
    const setCell = (i, v) => setCells((c) => c.map((x, j) => (j === i ? v : x)))
    let set = 0
    const swap = () => {
      const next = (set + 1) % SETS.length
      set = next
      // leave: every cell fades out (transition-delay = its stagger)
      setCells((c) => c.map(([s]) => [s, 'out']))
      SETS[next].forEach((_, i) => {
        // out-in: the new logo mounts when this cell's leave has finished, then enters with its stagger
        later(() => {
          setCell(i, [next, 'from'])
          requestAnimationFrame(() => requestAnimationFrame(() => setCell(i, [next, 'in'])))
        }, i * STAGGER + FADE)
      })
    }
    later(() => {
      swap()
      list.push(setInterval(swap, EVERY))
    }, FIRST)
    return () => {
      list.forEach((t) => {
        clearTimeout(t)
        clearInterval(t)
      })
      list.length = 0
    }
  }, [])

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-10">
      {cells.map(([s, state], i) => (
        <Cell key={`${i}-${s}`} i={i} logo={SETS[s][i]} state={state} />
      ))}
    </div>
  )
}
