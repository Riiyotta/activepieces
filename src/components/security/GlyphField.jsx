import { useEffect, useRef } from 'react'

// glyph-field (SPEC_MARKETING §4.E; security.G6mAqp3Z.js `glyph-field`). Static ASCII field, redrawn on
// resize and fonts.ready. Glyphs fade in with distance from the `shield` elements (the copy blocks).
// Ported line for line from the original setup(); only the Vue refs/watchers are replaced.

const CHARS = '0123456789abcdef+/=%&$*'
const LAYERS = 5
const BASE_INK = 0.055
const BASE_LIGHT = 0.15
const DIM = 0.55
const RADIUS = 130
const RADIUS_SM = 68
const MIN = 0.02
const MAX_PX = 6e6

function draw(wrap, canvas, { frame, shield, tint }) {
  const box = wrap.getBoundingClientRect()
  if (box.width < 2 || box.height < 2) return null
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const cap = Math.sqrt(MAX_PX / (box.width * box.height))
  const scale = Math.max(0.75, Math.min(dpr, cap))
  canvas.width = Math.round(box.width * scale)
  canvas.height = Math.round(box.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.setTransform(scale, 0, 0, scale, 0, 0)
  ctx.textBaseline = 'top'
  ctx.fillStyle = getComputedStyle(canvas).color
  const small = box.width < 768
  const radius = small ? RADIUS_SM : RADIUS
  const base = tint === 'light' ? BASE_LIGHT : BASE_INK
  const fs = small ? 14 : 18
  ctx.font = `${fs}px "Fira Code", ui-monospace, monospace`
  const cw = ctx.measureText('0').width || fs * 0.6
  const lh = Math.max(10, Math.round(fs * 1.06))
  const frameLeft = frame ? frame.getBoundingClientRect().left - box.left : 0
  const x0 = frameLeft - Math.ceil(frameLeft / cw) * cw
  const cols = Math.ceil((box.width - x0) / cw) + 1
  const rows = Math.ceil(box.height / lh) + 1
  const shields = (shield ?? []).filter(Boolean).map((el) => {
    const r = el.getBoundingClientRect()
    return { left: r.left - box.left, top: r.top - box.top, right: r.right - box.left, bottom: r.bottom - box.top }
  })
  const layers = Array.from({ length: LAYERS }, () => Array(cols).fill(' '))
  for (let row = 0; row < rows; row += 1) {
    for (const l of layers) l.fill(' ')
    const cy = row * lh + lh / 2
    let any = false
    for (let col = 0; col < cols; col += 1) {
      const cx = x0 + col * cw + cw / 2
      let d = radius
      for (const s of shields) {
        const dx = Math.max(s.left - cx, 0, cx - s.right)
        const dy = Math.max(s.top - cy, 0, cy - s.bottom)
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < d) d = dist
      }
      const t = d / radius
      const smooth = t * t * (3 - 2 * t)
      const w = ((col * 31 + row * 17) % 9 < 2 ? 1 : DIM) * smooth
      if (w < MIN) continue
      const layer = Math.min(4, Math.floor(w * LAYERS))
      layers[layer][col] = CHARS[Math.floor(Math.random() * 23)]
      any = true
    }
    if (!any) continue
    const y = row * lh - lh * 0.12
    for (let i = 0; i < LAYERS; i += 1) {
      ctx.globalAlpha = (base * (i + 1)) / LAYERS
      ctx.fillText(layers[i].join(''), x0, y)
    }
  }
  ctx.globalAlpha = 1
  return { w: box.width, h: box.height }
}

// frameRef / shieldRefs are React refs (shieldRefs.current is an array of elements).
export default function GlyphField({ frameRef, shieldRefs, tint = 'ink', fade = 'section', className = '' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return undefined
    let size = { w: 0, h: 0 }
    let alive = true
    const redraw = () => {
      if (!alive) return
      const s = draw(wrap, canvas, { frame: frameRef?.current, shield: shieldRefs?.current, tint })
      if (s) size = s
    }
    redraw()
    document.fonts?.ready.then(redraw)
    // Only redraw when the box actually changed size (original `h2`).
    const ro = new ResizeObserver(() => {
      const r = wrap.getBoundingClientRect()
      if (r.width !== size.w || r.height !== size.h) redraw()
    })
    ro.observe(wrap)
    return () => {
      alive = false
      ro.disconnect()
    }
  }, [frameRef, shieldRefs, tint])

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${fade === 'panel' ? 'glyph-panel' : 'glyph-section'} ${className}`}
    >
      <canvas ref={canvasRef} className={`size-full ${tint === 'light' ? 'text-white' : 'text-ink-950'}`} />
    </div>
  )
}
