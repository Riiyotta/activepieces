import { createElement, useCallback, useEffect, useRef, useState } from 'react'
import '../demo/useCursorCast.css'

// Several fake cursors driven by one scripted loop (tables demo: You / Agent 1 / Agent 2; chat demo: one).
// Same engine semantics as the homepage demo/useCursorCast (not modified):
// - the loop starts when the root is >= 30% visible and is cancelled when it leaves view;
// - takeOver() (user touched a demo control) cancels the loop, hides the cursors, resumes after 9000ms idle;
// - prefers-reduced-motion: the loop never starts and the static end state stays on screen.
// Scripts are written against an absolute timeline: `at(ms)` waits until ms after the iteration started,
// so parallel tracks (Promise.all) can overlap like the measured original.

const CANCELED = Symbol('multi-cursor-canceled')
const hidden = { x: 0, y: 0, down: false, visible: false, clickKey: 0 }

export function useMultiCursor(ids, script, { threshold = 0.3, idle = 9000 } = {}) {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const scriptRef = useRef(script)
  scriptRef.current = script

  const [cursors, setCursors] = useState(() => Object.fromEntries(ids.map((id) => [id, { ...hidden }])))
  const [manual, setManual] = useState(false)
  const [reduced, setReduced] = useState(false)

  const s = useRef({
    gen: 0,
    running: false,
    mounted: false,
    intersecting: false,
    manual: false,
    reduced: false,
    t0: 0,
    timers: new Set(),
    rejects: new Set(),
    idleTimer: undefined,
  }).current

  const patch = useCallback((id, fields) => setCursors((all) => ({ ...all, [id]: { ...all[id], ...fields } })), [])

  const hideAll = useCallback(
    () =>
      setCursors((all) => {
        let changed = false
        const next = {}
        for (const [id, c] of Object.entries(all)) {
          next[id] = c.visible ? ((changed = true), { ...c, visible: false }) : c
        }
        return changed ? next : all
      }),
    [],
  )

  const cancel = useCallback(() => {
    s.gen += 1
    s.running = false
    s.timers.forEach(clearTimeout)
    s.timers.clear()
    const rejects = s.rejects
    s.rejects = new Set()
    rejects.forEach((r) => r(CANCELED))
    hideAll()
  }, [s, hideAll])

  const sleep = useCallback(
    (ms) =>
      new Promise((resolve, reject) => {
        s.rejects.add(reject)
        const t = setTimeout(
          () => {
            s.timers.delete(t)
            s.rejects.delete(reject)
            resolve()
          },
          Math.max(0, ms),
        )
        s.timers.add(t)
      }),
    [s],
  )

  const api = useRef(null)
  if (!api.current) {
    api.current = {
      sleep,
      // Wait until `ms` after the start of the current loop iteration.
      at: (ms) => sleep(s.t0 + ms - performance.now()),
      stageWidth: () => stageRef.current?.clientWidth ?? 0,
      // Position a cursor without showing it (it is invisible, so the travel is not seen).
      place: (id, x, y) => patch(id, { x, y, visible: false }),
      show: (id) => patch(id, { visible: true }),
      hide: (id) => patch(id, { visible: false }),
      // Fade in (if hidden) and travel to point (fx, fy) of `el` (+dx/dy px) − (3, 2)px, relative to the stage.
      moveTo(id, el, { fx = 0.5, fy = 0.5, dx = 0, dy = 0 } = {}) {
        const stage = stageRef.current
        if (!el || !stage) return
        const u = stage.getBoundingClientRect()
        const d = el.getBoundingClientRect()
        const x = d.left - u.left + d.width * fx + dx - 3
        const y = d.top - u.top + d.height * fy + dy - 2
        patch(id, { x, y, visible: true })
      },
      // Press for `press` ms (glyph scales .82 + click ring), then release.
      async click(id, press = 130) {
        setCursors((all) => ({ ...all, [id]: { ...all[id], down: true, clickKey: all[id].clickKey + 1 } }))
        await sleep(press)
        patch(id, { down: false })
      },
      // Type `text` into a setter one character every `interval` ms, starting with `from` already typed.
      async type(set, text, { interval = 83, from = 0 } = {}) {
        for (let n = from + 1; n <= text.length; n += 1) {
          set(text.slice(0, n))
          if (n < text.length) await sleep(interval)
        }
      },
    }
  }

  const run = useCallback(
    async (g) => {
      s.running = true
      try {
        do {
          s.t0 = performance.now()
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

  return { rootRef, stageRef, cursors, manual, reduced, takeOver }
}

// Fake cursor with optional name tag (§4.3). Same glyph and `.demo-cursor` CSS as the homepage DemoCursor;
// fill/ring colours and the tag come from props.
export function TagCursor({ x, y, down, visible, clickKey, travel, fill, ring, tag, tagIcon, children }) {
  return createElement(
    'div',
    {
      'aria-hidden': 'true',
      className: `demo-cursor pointer-events-none absolute top-0 left-0 z-30 ${visible ? 'opacity-100' : 'opacity-0'}`,
      style: {
        transform: `translate(${x}px, ${y}px)`,
        '--travel': `${travel}ms`,
        '--cursor-fill': fill,
        '--cursor-ring': ring,
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
    tag ? createElement('span', { key: 'tag', className: 'cursor-tag' }, tagIcon, ` ${tag}`) : null,
    children,
  )
}

// Mount/unmount with enter-from / leave phases for a CSS-transitioned element (Vue <Transition> equivalent).
// Returns null (unmounted), 'from' (first frame, enter-from styles), 'in', or 'leave'.
export function usePresence(open, leaveMs) {
  const [phase, setPhase] = useState(open ? 'in' : null)
  useEffect(() => {
    if (open) {
      setPhase((p) => (p === 'in' ? p : 'from'))
      let r2
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setPhase('in'))
      })
      return () => {
        cancelAnimationFrame(r1)
        cancelAnimationFrame(r2)
      }
    }
    setPhase((p) => (p ? 'leave' : null))
    const t = setTimeout(() => setPhase(null), leaveMs)
    return () => clearTimeout(t)
  }, [open, leaveMs])
  return phase
}
