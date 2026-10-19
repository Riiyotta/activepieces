// cipher-wall (SPEC_MARKETING §4.E; security.G6mAqp3Z.js `cipher-wall`). Animated ASCII wall behind the
// /security hero with the rotating 3D padlock projected into the `target` box.
// Port of the original setup(): identifiers keep their minified names (with notes) so the code can be
// diffed against the source. Only the Vue refs/lifecycle are replaced by createCipherWall()/destroy().
/* eslint-disable */
import { buildLock as Pe, ye, be } from './lockGeometry'

const Fe = `0123456789abcdef+/=%&$*`, // background charset
  Ie = `,:;+*ox%#@`, // lock shading ramp
  Le = 0, // layer: dim glyph
  Re = 1, // layer: bright glyph
  ze = 2, // layer: pointer flicker
  Be = 50, // frame throttle (ms)
  Ve = 7e-3, // share of glyphs re-randomised per frame
  He = 0.83, // lock fit (height), ≥768
  Ue = 0.83, // lock fit (width), ≥768
  We = 0.96, // lock fit (height), <768
  Ge = 0.92, // lock fit (width), <768
  Ke = 0.5, // lock font = wall font × .5
  qe = 2, // lock coverage that hides the wall glyph under it
  Je = 0.6, // tessellation step factor
  Ye = 13e4, // max lock points
  Xe = 4e-4, // yaw speed
  Ze = 23e-5, // pitch speed
  Qe = 0.19, // pitch amplitude
  $e = 0.72, // yaw offset
  et = 0.2, // perspective
  tt = 0.24,
  nt = 0.1, // dither strength
  rt = 0.32, // ambient
  it = 0.3, // specular
  at = 190, // pointer radius
  ot = 0.14, // pointer easing per frame
  st = 5200, // phrase refresh (ms)
  ct = 110, // shield falloff (px)
  lt = 0.3, // shield floor
  ut = 0.06

const PHRASES = `multi-tenant, project isolated.our cloud runs in Frankfurt.one project cannot see another.self-hosted in any region.hardware nobody else shares.air-gapped, no outbound internet.your own model on your own hardware.run history, inputs and outputs.retention is configurable.expired data removed on schedule.object storage included.AES-256 at rest.TLS in transit.encrypted value by value.never training data.inference stays in your network.any OpenAI-compatible endpoint.decrypted at execution time.never returned by the API.never re-displayable.never exportable.the platform resolves it.no credential in a model context.HashiCorp Vault.AWS Secrets Manager.CyberArk Conjur.1Password.we never hold them at all.the engine runs in an isolate.its own filesystem view.its own mounted caches.DNS and socket checks.the network boundary holds.model output is untrusted.tools are explicitly scoped.human approval required.it lands in the audit trail.pen tested in Q1 2026.SOC 2 Type 2.access control.disaster recovery.incident response.vulnerability management.automations are plain JSON.exportable through the API.read it rather than trust it.answered in seven business days`.split(`.`)

// `${te(m2.value.pieces)} integrations, MIT licensed` — the pieces count formats as "760+" (spec §4.E).
const h2 = { value: [...PHRASES, `760+ integrations, MIT licensed`] }

// wrap: the absolutely positioned wall div; canvas inside it. props(): { frame, target, shield[] } elements.
export function createCipherWall(wrap, canvas, props) {
  const i2 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((e2) => e2 / 16), // 4×4 ordered dither
    a2 = [3, 4, 5, 6], // phrase layers
    s2 = [0, 1, 2, 3, 4, 5], // lock layers
    u2 = [0.07, 0.13, 0.22, 0.14, 0.34, 0.62, 0.95], // wall layer alphas
    d2 = [0.32, 0.45, 0.58, 0.72, 0.87, 1], // lock layer alphas
    g2 = [-0.44, 0.52, 0.78] // light direction
  let y2 = null, // ctx
    x2 = null, // glyph index per cell
    S2 = null, // shield weight per cell
    C2 = null, // flicker threshold per cell
    w2 = [], // phrase char per cell
    T2 = null, // lock bbox in wall cells
    E2 = [], // wall row layers
    D2 = [], // cell centre x
    O2 = null, // lock tessellation
    k2 = null, // lock shade buffer
    A2 = null, // lock z buffer
    j2 = [], // lock row layers
    re2 = null, // lock coverage per wall cell
    ie2 = null,
    ae2 = null,
    M2 = 0, // lock cols
    N2 = 0, // lock rows
    P2 = 0, // lock cell width
    F2 = 0, // lock line height
    oe2 = 0,
    se2 = 0,
    ce2 = ``, // lock font
    I2 = 0, // lock scale
    le2 = $e, // yaw
    ue2 = 0, // pitch
    de2 = 0, // width
    fe2 = 0, // height
    L2 = 0, // cell width
    R2 = 0, // line height
    z2 = 0, // cols
    B2 = 0, // rows
    V2 = 0, // x offset
    pe2 = 0,
    H2 = ``, // wall font
    U2 = 0, // pointer x
    W2 = 0, // pointer y
    G2 = 0, // pointer strength (eased)
    K2 = 0, // pointer target
    q2 = 0, // last phrase refresh
    J2 = 0, // rAF id
    Y2 = 0, // last frame
    X2 = false, // running
    Z2 = false, // reduced motion
    me2 = null, // IntersectionObserver
    Q2 = null // ResizeObserver
  const he2 = Math.hypot(g2[0], g2[1], g2[2]),
    ge2 = g2[0] / he2,
    _e2 = g2[1] / he2,
    ve2 = g2[2] / he2,
    xe2 = ge2,
    Se2 = _e2,
    Ce2 = ve2 + 1,
    we2 = Math.hypot(xe2, Se2, Ce2),
    Te2 = 1 / (1 - ye * et)

  function Ee2(e2) {
    let t2 = e2.measureText(`8`)
    return t2.fontBoundingBoxAscent + (t2.actualBoundingBoxDescent - t2.actualBoundingBoxAscent) / 2
  }
  // Fit the lock into the target box.
  function $2(e2, t2) {
    let n3 = y2
    if (((T2 = null), (O2 = null), (k2 = null), !n3)) return
    let i3 = props().target?.getBoundingClientRect()
    if (!i3 || i3.width < 24 || i3.height < 24) return
    let a3 = de2 < 768
    if (((I2 = Math.min((i3.height * (a3 ? We : He)) / (be * 2 * Te2), (i3.width * (a3 ? Ge : Ue)) / (ye * 2 * Te2))), !(I2 > 0))) return
    let o2 = Math.max(8, Math.round(t2 * Ke))
    ;(ce2 = `${o2}px "Fira Code", ui-monospace, monospace`), (n3.font = ce2), (P2 = n3.measureText(`0`).width || o2 * 0.6), (F2 = Math.max(7, Math.round(o2 * 1.02)))
    let s3 = Ee2(n3)
    ;(n3.font = H2), (M2 = Math.ceil((ye * Te2 * 2 * I2) / P2) + 3), (N2 = Math.ceil((be * Te2 * 2 * I2) / F2) + 3)
    let c2 = i3.left - e2.left + i3.width / 2,
      l2 = i3.top - e2.top + i3.height / 2
    ;(oe2 = c2 - ((M2 - 1) / 2) * P2),
      (se2 = l2 - ((N2 - 1) / 2) * F2 - s3),
      (k2 = new Uint8Array(M2 * N2)),
      (A2 = new Float32Array(M2 * N2)),
      (j2 = d2.map(() => Array(M2).fill(` `))),
      (ie2 = new Int32Array(M2))
    for (let e3 = 0; e3 < M2; e3 += 1) ie2[e3] = Math.floor((oe2 + e3 * P2 - V2) / L2)
    ae2 = new Int32Array(N2)
    for (let e3 = 0; e3 < N2; e3 += 1) {
      let t3 = se2 + e3 * F2 + s3
      ae2[e3] = Math.floor((t3 - R2 / 2 + pe2) / R2)
    }
    T2 = {
      left: Math.floor((c2 - (M2 / 2) * P2 - V2) / L2) - 3,
      right: Math.ceil((c2 + (M2 / 2) * P2 - V2) / L2) + 3,
      top: Math.floor((l2 - (N2 / 2) * F2) / R2) - 2,
      bottom: Math.ceil((l2 + (N2 / 2) * F2) / R2) + 2,
    }
    let u3 = (Math.min(P2, F2) / I2) * Je,
      f3 = Pe(u3)
    for (; f3.count > Ye; ) (u3 *= 1.3), (f3 = Pe(u3))
    O2 = f3
  }
  // Rasterise the rotated lock into the shade buffer (z-buffered), and mark wall cells it covers.
  function De2() {
    let e2 = k2,
      t2 = A2,
      n3 = re2
    if (!e2 || !t2 || !n3 || !O2 || !ie2 || !ae2) return
    e2.fill(0), t2.fill(-1e9), n3.fill(0)
    let r3 = Math.cos(le2),
      i3 = Math.sin(le2),
      a3 = Math.cos(ue2),
      o2 = Math.sin(ue2),
      s3 = (M2 - 1) / 2,
      c2 = (N2 - 1) / 2,
      { pos: l2, nrm: u3, tint: d3, count: f3 } = O2
    for (let n4 = 0; n4 < f3; n4 += 1) {
      let f4 = n4 * 3,
        p2 = u3[f4],
        ee2 = u3[f4 + 1],
        m3 = u3[f4 + 2],
        h3 = p2 * r3 + m3 * i3,
        g3 = m3 * r3 - p2 * i3,
        _3 = ee2 * a3 - g3 * o2,
        v3 = ee2 * o2 + g3 * a3
      if (v3 <= 0.015) continue
      let y3 = l2[f4],
        b2 = l2[f4 + 1],
        x3 = l2[f4 + 2],
        S3 = y3 * r3 + x3 * i3,
        te2 = x3 * r3 - y3 * i3,
        ne2 = b2 * a3 - te2 * o2,
        C3 = b2 * o2 + te2 * a3,
        w3 = I2 / (1 - C3 * et),
        T3 = Math.round(s3 + (S3 * w3) / P2)
      if (T3 < 0 || T3 >= M2) continue
      let E3 = Math.round(c2 - (ne2 * w3) / F2)
      if (E3 < 0 || E3 >= N2) continue
      let D3 = E3 * M2 + T3
      if (C3 <= t2[D3]) continue
      let O3 = 0.5 + C3 / (ye * 2),
        k3 = rt + 0.6799999999999999 * Math.max(h3 * ge2 + _3 * _e2 + v3 * ve2, 0)
      k3 *= 0.76 + tt * O3
      let A3 = (h3 * xe2 + _3 * Se2 + v3 * Ce2) / we2
      if (A3 > 0.5) {
        let e3 = A3 * A3,
          t3 = e3 * e3
        k3 += it * t3 * t3 * e3
      }
      ;(k3 *= d3[n4]), (t2[D3] = C3), (e2[D3] = 1 + Math.min(254, Math.round(Math.min(k3, 1) * 254)))
    }
    for (let t3 = 0; t3 < N2; t3 += 1) {
      let r4 = ae2[t3]
      if (r4 < 0 || r4 >= B2) continue
      let i4 = t3 * M2,
        a4 = r4 * z2
      for (let t4 = 0; t4 < M2; t4 += 1) {
        if (!e2[i4 + t4]) continue
        let r5 = ie2[t4]
        if (r5 < 0 || r5 >= z2) continue
        let o3 = a4 + r5
        n3[o3] < 255 && (n3[o3] = n3[o3] + 1)
      }
    }
  }
  // Per-cell dimming near the copy (110px falloff to a .3 floor).
  function Oe2(e2) {
    let t2 = new Float32Array(z2 * B2).fill(1),
      n3 = (props().shield ?? [])
        .filter((e3) => !!e3)
        .map((t3) => {
          let n4 = t3.getBoundingClientRect()
          return { left: n4.left - e2.left, top: n4.top - e2.top, right: n4.right - e2.left, bottom: n4.bottom - e2.top }
        })
    if (!n3.length) return t2
    for (let e3 = 0; e3 < B2; e3 += 1) {
      let r3 = e3 * R2 + R2 / 2
      for (let i3 = 0; i3 < z2; i3 += 1) {
        let a3 = D2[i3],
          o2 = ct
        for (let e4 of n3) {
          let t3 = Math.max(e4.left - a3, 0, a3 - e4.right),
            n4 = Math.max(e4.top - r3, 0, r3 - e4.bottom),
            i4 = Math.sqrt(t3 * t3 + n4 * n4)
          i4 < o2 && (o2 = i4)
        }
        let s3 = o2 / ct
        t2[e3 * z2 + i3] = lt + 0.7 * s3 * s3 * (3 - 2 * s3)
      }
    }
    return t2
  }
  // Free column spans on a row (outside the lock box).
  function ke2(e2) {
    if (!T2 || e2 < T2.top || e2 > T2.bottom) return [[1, z2 - 1]]
    let t2 = []
    return T2.left - 1 > 14 && t2.push([1, T2.left]), z2 - 1 - T2.right > 14 && t2.push([T2.right, z2 - 1]), t2
  }
  // Write random phrases into odd rows (skipping rows near the pointer unless forced).
  function Ae2(e2) {
    let t2 = at * G2 * 1.7
    for (let n3 = 1; n3 < B2; n3 += 2)
      if (!(!e2 && Math.abs(n3 * R2 + R2 / 2 - W2) < t2)) {
        for (let e3 = 0; e3 < z2; e3 += 1) w2[n3 * z2 + e3] = ``
        for (let e3 of ke2(n3)) {
          let t3 = e3[0],
            r3 = e3[1] - t3,
            i3 = r3 > 120 ? 2 : 1,
            a3 = Math.floor(r3 / i3)
          for (let e4 = 0; e4 < i3; e4 += 1) {
            let r4 = h2.value,
              i4 = r4[Math.floor(Math.random() * r4.length)],
              o2 = a3 - i4.length - 2
            if (o2 < 1) continue
            let s3 = t3 + e4 * a3 + 1 + Math.floor(Math.random() * o2)
            for (let e5 = 0; e5 < i4.length; e5 += 1) w2[n3 * z2 + s3 + e5] = i4[e5]
          }
        }
      }
  }
  function je2() {
    ;(w2 = Array(z2 * B2).fill(``)), Ae2(true)
  }
  // Draw one layer row as a single trimmed string.
  function Me2(e2, t2, n3, r3, i3, a3) {
    let o2 = -1,
      s3 = -1
    for (let e3 = 0; e3 < t2.length; e3 += 1) t2[e3] !== ` ` && (o2 < 0 && (o2 = e3), (s3 = e3))
    o2 < 0 || ((e2.fillStyle = `rgba(255,255,255,${n3})`), e2.fillText(t2.slice(o2, s3 + 1).join(``), r3 + o2 * i3, a3))
  }
  // Wall glyphs (+ phrases revealed around the pointer).
  function Ne2(e2) {
    if (!x2 || !S2 || !C2) return
    let t2 = at * G2,
      n3 = t2 * t2,
      r3 = G2 > 0.02
    e2.font = H2
    for (let t3 = 0; t3 < B2; t3 += 1) {
      for (let e3 of E2) e3.fill(` `)
      let i3 = t3 * R2 - R2 * 0.12,
        o2 = t3 * R2 + R2 / 2 - W2,
        s3 = o2 * o2
      for (let e3 = 0; e3 < z2; e3 += 1) {
        let i4 = t3 * z2 + e3
        if (re2 && re2[i4] >= qe) continue
        let o3 = x2[i4],
          c2 = (e3 * 31 + t3 * 17) % 9 < 2 ? Re : Le,
          l2 = Fe[o3 % 23]
        if (r3) {
          let t4 = D2[e3] - U2,
            r4 = t4 * t4 + s3
          if (r4 < n3) {
            let e4 = (1 - r4 / n3) * S2[i4],
              t5 = w2[i4]
            if (t5 && e4 > ut) {
              let n4 = Math.min(a2.length - 1, Math.floor(((e4 - ut) / 0.94) * a2.length))
              ;(c2 = a2[n4]), (l2 = t5)
            } else !t5 && e4 > C2[i4] * 0.85 && (c2 = ze)
          }
        }
        E2[c2][e3] = l2
      }
      for (let t4 = 0; t4 < E2.length; t4 += 1) Me2(e2, E2[t4], u2[t4], V2, L2, i3)
    }
  }
  // Lock glyphs from the shade buffer, with ordered dither.
  function dt2(e2) {
    let t2 = k2
    if (t2) {
      e2.font = ce2
      for (let n3 = 0; n3 < N2; n3 += 1) {
        for (let e3 of j2) e3.fill(` `)
        let r3 = n3 * M2,
          a3 = false
        for (let e3 = 0; e3 < M2; e3 += 1) {
          let o3 = t2[r3 + e3]
          if (!o3) continue
          let c2 = (i2[((n3 & 3) << 2) | (e3 & 3)] - 0.47) * nt,
            l2 = Math.min(0.999, Math.max(0, (o3 - 1) / 254 + c2)),
            u3 = Math.min(s2.length - 1, (l2 * s2.length) | 0)
          ;(j2[u3][e3] = Ie[Math.min(9, (l2 * 10) | 0)]), (a3 = true)
        }
        if (!a3) continue
        let o2 = se2 + n3 * F2
        for (let t3 = 0; t3 < j2.length; t3 += 1) Me2(e2, j2[t3], d2[t3], oe2, P2, o2)
      }
    }
  }
  function ft2() {
    let e2 = y2
    e2 && (e2.clearRect(0, 0, de2, fe2), Ne2(e2), dt2(e2))
  }
  // (Re)build everything for the current size.
  function pt2() {
    let e2 = wrap,
      t2 = canvas
    if (!e2 || !t2) return
    let n3 = e2.getBoundingClientRect()
    if (n3.width < 2 || n3.height < 2) return
    let i3 = Math.min(window.devicePixelRatio || 1, 2)
    ;(t2.width = Math.round(n3.width * i3)), (t2.height = Math.round(n3.height * i3))
    let a3 = t2.getContext(`2d`)
    if (!a3) return
    ;(y2 = a3), (de2 = n3.width), (fe2 = n3.height), a3.setTransform(i3, 0, 0, i3, 0, 0), (a3.textBaseline = `top`)
    let o2 = n3.width < 768 ? 14 : 18
    ;(H2 = `${o2}px "Fira Code", ui-monospace, monospace`),
      (a3.font = H2),
      (L2 = a3.measureText(`0`).width || o2 * 0.6),
      (R2 = Math.max(10, Math.round(o2 * 1.06))),
      (pe2 = R2 / 2 + R2 * 0.12 - Ee2(a3))
    let frame = props().frame
    let s3 = frame ? frame.getBoundingClientRect().left - n3.left : 0
    ;(V2 = s3 - Math.ceil(s3 / L2) * L2),
      (z2 = Math.ceil((n3.width - V2) / L2) + 1),
      (B2 = Math.ceil(n3.height / R2) + 1),
      (x2 = new Uint8Array(z2 * B2)),
      (C2 = new Float32Array(z2 * B2))
    for (let e3 = 0; e3 < x2.length; e3 += 1) (x2[e3] = Math.floor(Math.random() * 251)), (C2[e3] = Math.random())
    D2 = Array(z2)
    for (let e3 = 0; e3 < z2; e3 += 1) D2[e3] = V2 + e3 * L2 + L2 / 2
    ;(E2 = u2.map(() => Array(z2).fill(` `))), (re2 = new Uint8Array(z2 * B2)), (S2 = Oe2(n3)), $2(n3, o2), je2(), De2(), ft2()
  }
  function mt2() {
    if (!x2) return
    let e2 = Math.max(1, Math.round(x2.length * Ve))
    for (let t2 = 0; t2 < e2; t2 += 1) x2[Math.floor(Math.random() * x2.length)] = Math.floor(Math.random() * 251)
  }
  function ht2(e2) {
    X2 &&
      (e2 - Y2 >= Be &&
        ((Y2 = e2),
        (le2 = $e + e2 * Xe),
        (ue2 = Math.sin(e2 * Ze) * Qe),
        (G2 += (K2 - G2) * ot),
        e2 - q2 > st && ((q2 = e2), Ae2(false)),
        mt2(),
        De2(),
        ft2()),
      (J2 = requestAnimationFrame(ht2)))
  }
  function gt2() {
    X2 || Z2 || ((X2 = true), (Y2 = 0), (J2 = requestAnimationFrame(ht2)))
  }
  function _t2() {
    ;(X2 = false), J2 && cancelAnimationFrame(J2), (J2 = 0)
  }
  function vt2(e2) {
    let t2 = wrap
    if (!t2 || Z2) return
    let n3 = t2.getBoundingClientRect()
    ;(U2 = e2.clientX - n3.left),
      (W2 = e2.clientY - n3.top),
      (K2 = +(U2 > -190 && W2 > -190 && U2 < n3.width + at && W2 < n3.height + at && e2.pointerType !== `touch`))
  }
  function yt2() {
    K2 = 0
  }
  function bt2() {
    document.hidden ? _t2() : gt2()
  }

  // onMounted
  Z2 = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
  pt2()
  document.fonts?.ready.then(() => Q2 && pt2())
  Q2 = new ResizeObserver(() => pt2())
  Q2.observe(wrap)
  me2 = new IntersectionObserver(
    (e2) => {
      for (let t2 of e2) t2.isIntersecting ? gt2() : _t2()
    },
    { threshold: 0.01 },
  )
  me2.observe(wrap)
  window.addEventListener(`pointermove`, vt2, { passive: true })
  window.addEventListener(`pointerdown`, vt2, { passive: true })
  document.addEventListener(`pointerleave`, yt2)
  document.addEventListener(`visibilitychange`, bt2)

  return {
    refresh: pt2,
    // onUnmounted
    destroy() {
      _t2()
      Q2?.disconnect()
      Q2 = null
      me2?.disconnect()
      me2 = null
      window.removeEventListener(`pointermove`, vt2)
      window.removeEventListener(`pointerdown`, vt2)
      document.removeEventListener(`pointerleave`, yt2)
      document.removeEventListener(`visibilitychange`, bt2)
    },
  }
}
