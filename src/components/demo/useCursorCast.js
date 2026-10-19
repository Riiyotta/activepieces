import { createElement, useCallback, useEffect, useRef, useState } from 'react'
import './useCursorCast.css'

// Scripted demo loop + fake cursor shared by F (agent thread) and G (flow canvas).
// Port of the original cursor engine (CLONE_SPEC §F "Fake cursor", §R):
// - the loop starts when the root is >= 30% visible (IntersectionObserver) and is cancelled when it leaves;
// - takeOver() (user touched a demo control) cancels the loop, hides the cursor, and resumes after 9000ms idle;
// - prefers-reduced-motion: the loop never starts and the static end state stays on screen.

const CANCELED = Symbol('scene-loop-canceled')

export function useCursorCast(script, { threshold = 0.3, travel = 520, idle = 9000 } = {}) {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const scriptRef = useRef(script)
  scriptRef.current = script

  const [cursor, setCursor] = useState({ x: 0, y: 0, down: false, visible: false, clickKey: 0 })
  const [manual, setManual] = useState(false)
  const [reduced, setReduced] = useState(false)

  const s = useRef({
    gen: 0,
    running: false,
    mounted: false,
    intersecting: false,
    manual: false,
    reduced: false,
    timers: new Set(),
    rejects: new Set(),
    idleTimer: undefined,
  }).current

  const hide = useCallback(() => setCursor((c) => (c.visible ? { ...c, visible: false } : c)), [])

  const cancel = useCallback(() => {
    s.gen += 1
    s.running = false
    s.timers.forEach(clearTimeout)
    s.timers.clear()
    const rejects = s.rejects
    s.rejects = new Set()
    rejects.forEach((r) => r(CANCELED))
    hide()
  }, [s, hide])

  const sleep = useCallback(
    (ms) =>
      new Promise((resolve, reject) => {
        s.rejects.add(reject)
        const t = setTimeout(() => {
          s.timers.delete(t)
          s.rejects.delete(reject)
          resolve()
        }, ms)
        s.timers.add(t)
      }),
    [s],
  )

  const api = useRef(null)
  if (!api.current) {
    api.current = {
      sleep,
      hide,
      // Type `text` into a setter: speed per char, +12ms on spaces, +jitter on every 3rd char, then hold.
      async type(set, text, { speed = 34, jitter = 22, hold = 260 } = {}) {
        for (let n = 1; n <= text.length; n += 1) {
          set(text.slice(0, n))
          const ch = text[n - 1]
          await sleep(ch === ' ' ? speed + 12 : speed + (n % 3 === 0 ? jitter : 0))
        }
        if (hold) await sleep(hold)
      },
      // Target = element rect point (fx, fy) − (3, 2)px, relative to the stage. Waits `settle` (= travel).
      async moveTo(el, { fx = 0.5, fy = 0.5, settle } = {}) {
        const stage = stageRef.current
        const wait = settle ?? travel
        if (!el || !stage) return
        const u = stage.getBoundingClientRect()
        const d = el.getBoundingClientRect()
        if (d.width === 0 || d.height === 0) {
          hide()
          await sleep(wait)
          return
        }
        const x = d.left - u.left + d.width * fx - 3
        const y = d.top - u.top + d.height * fy - 2
        setCursor((c) => ({ ...c, x, y, visible: true }))
        await sleep(wait)
      },
      // Press 140ms (glyph scales .82 + click ring), release, then 150ms.
      async click() {
        setCursor((c) => ({ ...c, down: true, clickKey: c.clickKey + 1 }))
        await sleep(140)
        setCursor((c) => ({ ...c, down: false }))
        await sleep(150)
      },
    }
  }

  const run = useCallback(
    async (g) => {
      s.running = true
      try {
        do {
          await scriptRef.current(api.current)
        } while (s.mounted && g === s.gen)
      } catch (e) {
        if (e !== CANCELED) throw e
      } finally {
        if (g === s.gen) s.running = false
      }
    },
    [s],
  )

  const start = useCallback(() => {
    if (s.reduced || s.manual || s.running || !s.intersecting) return
    run(s.gen)
  }, [s, run])

  const takeOver = useCallback(() => {
    if (s.reduced) return
    s.manual = true
    setManual(true)
    cancel()
    clearTimeout(s.idleTimer)
    if (idle) {
      s.idleTimer = setTimeout(() => {
        s.manual = false
        setManual(false)
        start()
      }, idle)
    }
  }, [s, cancel, idle, start])

  useEffect(() => {
    s.mounted = true
    s.reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(s.reduced)
    let io
    if (!s.reduced && rootRef.current) {
      io = new IntersectionObserver(
        (entries) => {
          s.intersecting = entries[0]?.isIntersecting ?? false
          if (s.intersecting) start()
          else cancel()
        },
        { threshold },
      )
      io.observe(rootRef.current)
    }
    return () => {
      s.mounted = false
      clearTimeout(s.idleTimer)
      cancel()
      io?.disconnect()
    }
  }, [s, threshold, start, cancel])

  return { rootRef, stageRef, cursor, manual, reduced, takeOver }
}

// Fake cursor (CLONE_SPEC §F "Fake cursor"). Markup mirrors the original `ui-cursor` (tone "dusk").
export function DemoCursor({ x, y, down, visible, clickKey, travel }) {
  return createElement(
    'div',
    {
      'aria-hidden': 'true',
      className: `demo-cursor pointer-events-none absolute top-0 left-0 z-30 ${visible ? 'opacity-100' : 'opacity-0'}`,
      style: {
        transform: `translate(${x}px, ${y}px)`,
        '--travel': `${travel}ms`,
        '--cursor-fill': 'var(--color-ink-950)',
        '--cursor-ring': 'var(--color-ink-400)',
      },
    },
    clickKey > 0 ? createElement('span', { key: clickKey, className: 'click-ring' }) : null,
    createElement(
      'div',
      { key: 'glyph', className: `cursor-glyph${down ? ' cursor-down' : ''}` },
      createElement(
        'svg',
        { width: 23, height: 25, viewBox: '0 0 20 22', fill: 'none' },
        createElement('path', {
          d: 'M2 1.5 L2 17.5 L6.2 13.7 L9.1 20.3 L12 19 L9.2 12.5 L15 12.3 Z',
          fill: 'var(--cursor-fill)',
          stroke: '#fff',
          strokeWidth: 1.4,
          strokeLinejoin: 'round',
        }),
      ),
    ),
  )
}
