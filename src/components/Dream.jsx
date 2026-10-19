import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Icon from './ui/Icon'
import { DREAM_WINDOW_BODIES } from './DreamWindows'
import './Dream.css'

// C. Dream: sticky, scroll-scrubbed story. Every number below is from CLONE_SPEC §C.1–C.4.

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const lerp = (a, b, t) => a + (b - a) * t
const smoothstep = (x, a, b) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const EASE = {
  out2: (x) => 1 - (1 - x) ** 2,
  out3: (x) => 1 - (1 - x) ** 3,
  out5: (x) => 1 - (1 - x) ** 5,
  inout: (x) => x * x * (3 - 2 * x),
}

// §C.2 beats: [in, out]; null = fully in / never out.
const BEATS = [
  { in: null, out: [0.7, 0.95], z: 34, max: 'max-w-5xl' },
  { in: [0.85, 1.1], out: [1.84, 1.91], z: 34, max: 'max-w-5xl' },
  { in: [1.98, 2.1], out: null, z: 50, max: 'max-w-3xl' },
]
const WORDS = ['Your ', 'team ', 'already ', 'works ', 'with ', 'AI.']
// Word window E = [-0.45, -0.05]; span 0.24, step 0.032.
const WORD_START = -0.45
const WORD_SPAN = 0.24
const WORD_STEP = 0.032

// §C.3 windows (desktop only).
const WINDOWS = [
  { x: 50, y: 32, rot: 2, dir: [0, -1.1], z: 33, enter: 1.0 },
  { x: 22, y: 34, rot: -4, dir: [-1.1, -0.3], z: 33, enter: 1.066 },
  { x: 78, y: 34, rot: 3, dir: [1.1, -0.4], z: 33, enter: 1.132 },
  { x: 21, y: 71, rot: 5, dir: [-0.85, 0.6], z: 35, enter: 1.198 },
  { x: 39, y: 66, rot: -2, dir: [-0.25, 0.95], z: 35, enter: 1.264 },
  { x: 68, y: 59, rot: 6, dir: [0.7, 0.12], z: 35, enter: 1.193 },
  { x: 79, y: 70, rot: -5, dir: [0.7, 0.55], z: 35, enter: 1.33 },
]

// §C.4 nodes.
const NODES = [
  { id: 'chips', x: 0.5, y: 0.075, xs: 0.5, ys: 0.045, rot: 0, at: 0.16, dur: 0.26, pop: 'grow' },
  { id: 'claude', x: 0.12, y: 0.175, xs: 0.245, ys: 0.17, rot: -2, at: 0.24, dur: 0.2, pop: 'slide', from: [-26, -8], img: 'anthropic-claude.svg', label: 'Claude' },
  { id: 'gemini', x: 0.88, y: 0.175, xs: 0.755, ys: 0.17, rot: 2, at: 0.2, dur: 0.24, pop: 'pop', img: 'google-gemini.svg', label: 'Gemini' },
  { id: 'audit', x: 0.088, y: 0.5, smHide: true, rot: 1.5, at: 0.4, dur: 0.22, pop: 'slide', from: [-22, 10], icon: 'solar:document-text-linear', label: 'Audit log' },
  { id: 'mcp', x: 0.912, y: 0.5, smHide: true, rot: -1.5, at: 0.32, dur: 0.28, pop: 'rise', icon: 'solar:socket-linear', label: 'MCP servers' },
  { id: 'cursor', x: 0.13, y: 0.825, xs: 0.3, ys: 0.8, rot: 2, at: 0.5, dur: 0.19, pop: 'grow', img: 'cursor.svg', label: 'Cursor' },
  { id: 'openai', x: 0.87, y: 0.825, xs: 0.7, ys: 0.88, rot: -2, at: 0.44, dur: 0.25, pop: 'slide', from: [26, -6], img: 'openai.svg', label: 'ChatGPT' },
  { id: 'agents', x: 0.385, y: 0.925, smHide: true, rot: -1, at: 0.58, dur: 0.21, pop: 'rise', icon: 'solar:cpu-bolt-linear', label: 'Agents' },
  { id: 'approvals', x: 0.615, y: 0.925, smHide: true, rot: 1, at: 0.62, dur: 0.17, pop: 'pop', icon: 'solar:check-read-linear', label: 'Approvals' },
]
const CHIPS = ['slack.svg', 'github.svg', 'notion.svg']

// §C.4 wires. `sm` overrides apply at ≤1023px.
const WIRES = [
  { from: ['claude', 'right'], to: ['chips', 'left'], route: 'hvh', mid: 0.58, at: 0, dur: 0.3, ease: 'out3', rev: true },
  { from: ['chips', 'right'], to: ['gemini', 'left'], route: 'hvh', mid: 0.42, at: 0.05, dur: 0.22, ease: 'out5' },
  { from: ['audit', 'top'], to: ['claude', 'bottom'], route: 'vhv', mid: 0.42, at: 0.14, dur: 0.34, ease: 'inout', rev: true, accent: true, sm: { from: ['cursor', 'top'] } },
  { from: ['gemini', 'bottom'], to: ['mcp', 'top'], route: 'vhv', mid: 0.58, at: 0.1, dur: 0.26, ease: 'out3', accent: true, sm: { to: ['openai', 'top'], accent: false } },
  { from: ['cursor', 'top'], to: ['audit', 'bottom'], route: 'vhv', mid: 0.55, at: 0.3, dur: 0.24, ease: 'out5', rev: true, smHide: true },
  { from: ['mcp', 'bottom'], to: ['openai', 'top'], route: 'vhv', mid: 0.48, at: 0.22, dur: 0.36, ease: 'inout', smHide: true },
  { from: ['agents', 'left'], to: ['cursor', 'right'], route: 'hvh', mid: 0.55, at: 0.44, dur: 0.2, ease: 'out5', rev: true, smHide: true },
  { from: ['openai', 'left'], to: ['approvals', 'right'], route: 'hvh', mid: 0.45, at: 0.36, dur: 0.3, ease: 'out3', sm: { from: ['cursor', 'right'], to: ['openai', 'left'] } },
  { from: ['agents', 'right'], to: ['approvals', 'left'], route: 'hvh', mid: 0.5, at: 0.54, dur: 0.16, ease: 'out2', smHide: true },
]

const ANCHOR_GAP = 9
const CORNER = 16

function anchor(box, side) {
  const { cx, cy, w, h } = box
  if (side === 'left') return [cx - w / 2 - ANCHOR_GAP, cy]
  if (side === 'right') return [cx + w / 2 + ANCHOR_GAP, cy]
  if (side === 'top') return [cx, cy - h / 2 - ANCHOR_GAP]
  return [cx, cy + h / 2 + ANCHOR_GAP]
}

// hvh bends at `mid` of x; vhv bends at `mid` of y. Ported from the original dream-wire:
// drop near-duplicate and collinear points, then round each corner independently with a
// quadratic curve of radius min(16, prevSeg/2, nextSeg/2) (corners with a segment < 1px stay sharp).
function routePoints(a, b, route, mid) {
  if (route === 'hvh') {
    const bx = a[0] + (b[0] - a[0]) * mid
    return [a, [bx, a[1]], [bx, b[1]], b]
  }
  const by = a[1] + (b[1] - a[1]) * mid
  return [a, [a[0], by], [b[0], by], b]
}
function simplify(pts) {
  const out = []
  for (const p of pts) {
    const last = out[out.length - 1]
    if (last && Math.abs(last[0] - p[0]) < 0.5 && Math.abs(last[1] - p[1]) < 0.5) continue
    out.push(p)
  }
  for (let k = out.length - 2; k > 0; k--) {
    const p = out[k - 1]
    const q = out[k]
    const r = out[k + 1]
    const cross = (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])
    if (Math.abs(cross) < 0.5) out.splice(k, 1)
  }
  return out
}
const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1])
function routePath(a, b, route, mid) {
  const pts = simplify(routePoints(a, b, route, mid))
  if (pts.length < 2) return ''
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let k = 1; k < pts.length - 1; k++) {
    const p = pts[k - 1]
    const q = pts[k]
    const r = pts[k + 1]
    const o = dist(p, q)
    const s2 = dist(q, r)
    if (o < 1 || s2 < 1) continue
    const c = Math.min(CORNER, o / 2, s2 / 2)
    d += ` L ${q[0] + ((p[0] - q[0]) * c) / o} ${q[1] + ((p[1] - q[1]) * c) / o} Q ${q[0]} ${q[1]} ${q[0] + ((r[0] - q[0]) * c) / s2} ${q[1] + ((r[1] - q[1]) * c) / s2}`
  }
  const last = pts[pts.length - 1]
  return d + ` L ${last[0]} ${last[1]}`
}

function useMedia(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

function setVis(el, opacity) {
  el.style.opacity = opacity
  el.style.visibility = opacity <= 0.001 ? 'hidden' : 'visible'
}

export default function Dream() {
  const isDesktop = useMedia('(min-width: 1024px)')
  const reduced = useMedia('(prefers-reduced-motion: reduce)')

  const sectionRef = useRef(null)
  const wireRef = useRef(null)
  const beatRefs = useRef([])
  const wordRefs = useRef([])
  const windowRefs = useRef([])
  const nodeRefs = useRef({})
  const pathRefs = useRef([])
  const dotRefs = useRef([])
  const zRef = useRef(0)

  const nodes = isDesktop ? NODES : NODES.filter((n) => !n.smHide)
  const wires = (isDesktop ? WIRES : WIRES.filter((w) => !w.smHide)).map((w) =>
    !isDesktop && w.sm ? { ...w, ...w.sm } : w
  )

  // Wire geometry (container px). Recomputed when the container or any node box changes size.
  const [geom, setGeom] = useState(null)
  useLayoutEffect(() => {
    const wire = wireRef.current
    if (!wire) return
    const measure = () => {
      const W = wire.clientWidth
      const H = wire.clientHeight
      const boxes = {}
      for (const n of nodes) {
        const el = nodeRefs.current[n.id]
        if (!el) continue
        boxes[n.id] = {
          cx: (isDesktop ? n.x : n.xs) * W,
          cy: (isDesktop ? n.y : n.ys) * H,
          w: el.offsetWidth,
          h: el.offsetHeight,
        }
      }
      const paths = wires.map((w) => {
        const a = anchor(boxes[w.from[0]], w.from[1])
        const b = anchor(boxes[w.to[0]], w.to[1])
        return { d: routePath(a, b, w.route, w.mid), a, b }
      })
      setGeom({ W, H, paths })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wire)
    for (const n of nodes) if (nodeRefs.current[n.id]) ro.observe(nodeRefs.current[n.id])
    return () => ro.disconnect()
    // nodes/wires are derived from isDesktop only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop])

  // Per-frame writer: everything is driven by the smoothed progress z.
  const applyRef = useRef(null)
  applyRef.current = (z) => {
    // §C.2 beats
    BEATS.forEach((b, k) => {
      const el = beatRefs.current[k]
      if (!el) return
      const t = b.in ? smoothstep(z, b.in[0], b.in[1]) : 1
      const n = b.out ? smoothstep(z, b.out[0], b.out[1]) : 0
      setVis(el, t * (1 - n))
      el.style.transform = `translateY(${(1 - t) * 14 - n * 14}px)`
      const blur = 1 - t + n
      el.style.filter = blur < 0.01 ? 'none' : `blur(${blur * 5}px)`
    })
    WORDS.forEach((_, i) => {
      const el = wordRefs.current[i]
      if (!el) return
      const a = WORD_START + i * WORD_STEP
      const o = smoothstep(z, a, a + WORD_SPAN)
      el.style.opacity = o
      el.style.transform = `translateY(${(1 - o) * 14}px)`
      el.style.filter = 1 - o < 0.01 ? 'none' : `blur(${(1 - o) * 5}px)`
    })

    // §C.3 windows
    WINDOWS.forEach((w, k) => {
      const el = windowRefs.current[k]
      if (!el) return
      const r = 1 - (1 - clamp((z - w.enter) / (1.88 - w.enter))) ** 5
      const i = smoothstep(z, 1.894 + k * 0.02, 1.894 + k * 0.02 + 0.3)
      const o = i * i
      const c = lerp(w.dir[0] * 105 * (1 - r), 50 - w.x, o)
      const l = lerp(w.dir[1] * 105 * (1 - r), 50 - w.y, o)
      const u = lerp(lerp(w.rot * 2, w.rot, r), 0, o)
      const f = lerp(1, 0.05, o)
      setVis(el, (z < w.enter ? 0 : 1) * (1 - smoothstep(i, 0.55, 0.95)))
      el.style.transform = `translate(-50%, -50%) translate(${c}vw, ${l}vh) rotate(${u}deg) scale(${f})`
    })

    // §C.4 diagram
    const Y = clamp((z - 2.08) / (2.9 - 2.08))
    for (const n of NODES) {
      const el = nodeRefs.current[n.id]
      if (!el) continue
      const t = clamp((Y - n.at) / n.dur)
      const r = 1 - (1 - t) ** 3
      setVis(el, r)
      let move = ''
      let s = 1
      let blur = 0
      if (n.pop === 'pop') s = 0.86 + 0.14 * r
      else if (n.pop === 'grow') s = 0.62 + 0.38 * (1 - (1 - t) ** 5)
      else if (n.pop === 'rise') {
        move = ` translateY(${20 * (1 - r)}px)`
        blur = 4 * (1 - r)
      } else if (n.pop === 'slide') {
        move = ` translate(${n.from[0] * (1 - r)}px, ${n.from[1] * (1 - r)}px)`
        s = 0.96 + 0.04 * r
      }
      el.style.transform = `translate(-50%, -50%)${move} scale(${s}) rotate(${n.rot}deg)`
      el.style.filter = blur < 0.01 ? 'none' : `blur(${blur}px)`
    }
    wires.forEach((w, k) => {
      const p = pathRefs.current[k]
      if (!p) return
      const u = EASE[w.ease](clamp((Y - w.at) / w.dur))
      p.setAttribute('stroke-dashoffset', w.rev ? u - 1 : 1 - u)
      const dot = clamp((u - 0.72) / 0.28)
      dotRefs.current[k * 2]?.setAttribute('opacity', dot)
      dotRefs.current[k * 2 + 1]?.setAttribute('opacity', dot)
    })
  }

  // Re-apply the current frame after any re-render that replaced DOM (mode switch, new wire geometry).
  useLayoutEffect(() => {
    applyRef.current(zRef.current)
  })

  // §C.1 desktop: scroll progress, lerp-smoothed per rAF frame.
  useLayoutEffect(() => {
    if (!isDesktop) return
    const readP = () =>
      clamp(-sectionRef.current.getBoundingClientRect().top / window.innerHeight, -0.8, 3.2)
    let raf = 0
    let P = readP()
    zRef.current = P
    applyRef.current(P)

    const tick = () => {
      raf = 0
      let z = zRef.current
      z += (P - z) * 0.16
      if (Math.abs(P - z) < 4e-4) z = P
      zRef.current = z
      applyRef.current(z)
      if (z !== P) raf = requestAnimationFrame(tick)
    }
    const onScroll = () => {
      P = readP()
      if (reduced) {
        zRef.current = P
        applyRef.current(P)
        return
      }
      if (!raf && P !== zRef.current) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [isDesktop, reduced])

  // §C.1 ≤1023px: one-shot 2400ms easeOutCubic tween from z=1.96 to 2.95 once 35% visible.
  useLayoutEffect(() => {
    if (isDesktop) return
    const Z0 = 1.96
    const Z1 = 2.95
    const DURATION = 2400
    if (reduced) {
      zRef.current = Z1
      applyRef.current(Z1)
      return
    }
    zRef.current = Z0
    applyRef.current(Z0)
    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        const start = performance.now()
        const tick = (now) => {
          const t = clamp((now - start) / DURATION)
          const N = 1 - (1 - t) ** 3
          zRef.current = lerp(Z0, Z1, N)
          applyRef.current(zRef.current)
          raf = t < 1 ? requestAnimationFrame(tick) : 0
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.35 }
    )
    io.observe(sectionRef.current)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [isDesktop, reduced])

  return (
    <section ref={sectionRef} data-section="dream" className="dream-stage relative bg-white">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div ref={wireRef} className="dream-wire" aria-hidden="true">
          <svg
            className="dream-wire-svg"
            viewBox={geom ? `0 0 ${geom.W} ${geom.H}` : undefined}
            fill="none"
          >
            {geom &&
              wires.map((w, k) => (
                <path
                  key={`p${k}`}
                  ref={(el) => (pathRefs.current[k] = el)}
                  d={geom.paths[k]?.d}
                  className={`dream-wire-path${w.accent ? ' is-accent' : ''}`}
                  pathLength="1"
                  strokeDasharray="1 1"
                />
              ))}
            {geom &&
              wires.map((_, k) =>
                [geom.paths[k]?.a, geom.paths[k]?.b].map((pt, j) =>
                  pt ? (
                    <circle
                      key={`d${k}-${j}`}
                      ref={(el) => (dotRefs.current[k * 2 + j] = el)}
                      cx={pt[0]}
                      cy={pt[1]}
                      r="3.5"
                      className="dream-wire-dot"
                    />
                  ) : null
                )
              )}
          </svg>
          {nodes.map((n) => (
            <div
              key={n.id}
              ref={(el) => (nodeRefs.current[n.id] = el)}
              className="dream-node"
              style={{ left: `${(isDesktop ? n.x : n.xs) * 100}%`, top: `${(isDesktop ? n.y : n.ys) * 100}%` }}
            >
              {n.id === 'chips' ? (
                <div className="chips">
                  {CHIPS.map((f) => (
                    <span key={f} className="chip">
                      <img src={`/assets/${f}`} alt="" loading="lazy" />
                    </span>
                  ))}
                </div>
              ) : (
                <div className="card">
                  {n.img ? (
                    <img src={`/assets/${n.img}`} alt="" className="mark" loading="lazy" />
                  ) : (
                    <Icon name={n.icon} className="mark text-ink-500" />
                  )}
                  <span className="text">{n.label}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="dream-beat-scrim" aria-hidden="true" />

        {isDesktop &&
          WINDOWS.map((w, k) => {
            const Body = DREAM_WINDOW_BODIES[k]
            return (
              <div
                key={k}
                ref={(el) => (windowRefs.current[k] = el)}
                className="dream-window"
                style={{ left: `${w.x}%`, top: `${w.y}%`, zIndex: w.z }}
                aria-hidden="true"
              >
                <Body />
              </div>
            )
          })}

        {BEATS.map((b, k) => (isDesktop || k === 2) && (
          <div
            key={k}
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-6"
            style={{ zIndex: b.z }}
          >
            <p
              ref={(el) => (beatRefs.current[k] = el)}
              className={`${b.max} dream-beat text-center font-display font-bold text-balance text-ink-900`}
            >
              {k === 0 &&
                WORDS.map((word, i) => (
                  <span key={i} ref={(el) => (wordRefs.current[i] = el)} className="dream-word">
                    {word}
                  </span>
                ))}
              {k === 1 && "Nobody's tracking what they access, cost, or do."}
              {k === 2 && (
                <>
                  <img src="/assets/activepieces-logo.svg" alt="" className="dream-mark" loading="lazy" />
                  The enterprise AI ecosystem
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
