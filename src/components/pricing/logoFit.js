// Customer-logo fitter, ported verbatim from the site's chunk specs/ref/js/logo-fit.DMqNzuiB.js.
// fit(LOGOS, boxW / boxH) -> { fitted: [{ logo, scale, shift }], maxScale }.
// Rendered size of a logo in a boxW x boxH slot: height = boxH * scale, max-width = boxW * scale,
// translateY = shift * boxH. Cell height = boxH * maxScale (SPEC_MARKETING §1.4, §2).

export const LOGOS = [
  { src: '/logos/customers/bosch.svg', alt: 'Bosch', aspect: 4.465, tight: 4.4874, fill: 0.995, offset: 8e-4, ink: 1.4973 },
  { src: '/logos/customers/alan.svg', alt: 'Alan', aspect: 4.83, tight: 4.8462, fill: 0.9967, offset: 0, ink: 2.1214 },
  { src: '/logos/customers/sap.svg', alt: 'SAP', aspect: 2.0217, tight: 2.0217, fill: 1, offset: 0, ink: 0.9217 },
  { src: '/logos/customers/tryg.svg', alt: 'Tryg', aspect: 2.415, tight: 2.415, fill: 1, offset: 0, ink: 2.0531 },
  { src: '/logos/customers/funding-societies.svg', alt: 'Funding Societies', aspect: 3.0667, tight: 3.055, fill: 1, offset: 0, ink: 1.0809 },
  { src: '/logos/customers/carrefour.svg', alt: 'Carrefour', aspect: 1.2483, tight: 1.2483, fill: 1, offset: 0, ink: 0.3958 },
  { src: '/logos/customers/corgi.webp', alt: 'Corgi', aspect: 3.305, tight: 3.305, fill: 1, offset: 0, ink: 0.9634 },
  { src: '/logos/customers/hilton.svg', alt: 'Hilton', aspect: 2.695, tight: 2.695, fill: 1, offset: 0, ink: 0.8016 },
  { src: '/logos/customers/lumen.svg', alt: 'Lumen Technologies', aspect: 6.955, tight: 6.9249, fill: 0.9983, offset: 8e-4, ink: 2.0984 },
  { src: '/logos/customers/pipefy.svg', alt: 'Pipefy', aspect: 2.945, tight: 2.945, fill: 1, offset: 0, ink: 1.0634 },
  { src: '/logos/customers/dell-technologies.svg', alt: 'Dell Technologies', aspect: 7.83, tight: 7.8283, fill: 1, offset: 0, ink: 1.9081 },
  { src: '/logos/customers/zerofox.svg', alt: 'ZeroFox', aspect: 5.4683, tight: 5.4683, fill: 1, offset: 0, ink: 1.2675 },
  { src: '/logos/customers/decathlon.svg', alt: 'Decathlon', aspect: 6.58, tight: 6.6242, fill: 0.9933, offset: 0, ink: 2.723 },
  { src: '/logos/customers/merkle.svg', alt: 'Merkle', aspect: 9.555, tight: 9.555, fill: 1, offset: 0, ink: 4.0549 },
  { src: '/logos/customers/orange.svg', alt: 'Orange', aspect: 1, tight: 1, fill: 1, offset: 0, ink: 0.93 },
  { src: '/logos/customers/exl.svg', alt: 'EXL', aspect: 2.6867, tight: 2.7095, fill: 0.9867, offset: 0, ink: 1.2231 },
  { src: '/logos/customers/concentrix.svg', alt: 'Concentrix', aspect: 6.4867, tight: 6.465, fill: 1, offset: 0, ink: 2.4002 },
  { src: '/logos/customers/odoo.svg', alt: 'Odoo', aspect: 3.1567, tight: 3.1639, fill: 0.9967, offset: 0, ink: 1.2647 },
  { src: '/logos/customers/keller-williams.svg', alt: 'Keller Williams', aspect: 2.1833, tight: 2.1833, fill: 1, offset: 0, ink: 0.3832 },
  { src: '/logos/customers/hackerone.svg', alt: 'HackerOne', aspect: 5.0683, tight: 5.1511, fill: 0.9817, offset: -0.0025, ink: 1.5054 },
  { src: '/logos/customers/shopee.svg', alt: 'Shopee', aspect: 3.1283, tight: 3.1283, fill: 1, offset: 0, ink: 0.8772 },
  { src: '/logos/customers/itv.svg', alt: 'ITV', aspect: 1.9983, tight: 1.9983, fill: 1, offset: 0, ink: 0.8884 },
  { src: '/logos/customers/moneygram.svg', alt: 'MoneyGram', aspect: 4.93, tight: 4.93, fill: 1, offset: 0, ink: 1.4702 },
  { src: '/logos/customers/capgemini.svg', alt: 'Capgemini', aspect: 4.4833, tight: 4.4833, fill: 1, offset: 0, ink: 1.2791 },
]

const INK_EXP = 0.6
const MIN_SCALE = 0.86
const MAX_SCALE = 1.2

function median(values) {
  const s = [...values].sort((a, b) => a - b)
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

export function fit(logos, boxAspect) {
  const base = logos.map((logo) => {
    const containScale = Math.min(boxAspect / logo.aspect, 1)
    const filled = containScale * logo.fill
    const tight = Math.min(1, boxAspect / logo.tight)
    return { logo, containScale, fillCorrection: tight / filled, normalizedInk: logo.ink * tight * tight }
  })
  const med = median(base.map((b) => b.normalizedInk))
  const fitted = base.map(({ logo, containScale, fillCorrection, normalizedInk }) => {
    const scale = fillCorrection * Math.min(MAX_SCALE, Math.max(MIN_SCALE, (med / normalizedInk) ** (0.5 * INK_EXP)))
    return { logo, scale, shift: logo.offset * containScale * scale }
  })
  return { fitted, maxScale: Math.max(...fitted.map((f) => f.scale)) }
}

// Inline style for one fitted logo mask in a boxW x boxH slot (matches the original's inline style).
export function logoStyle({ logo, scale, shift }, boxW, boxH) {
  const url = `url(${logo.src})`
  return {
    WebkitMaskImage: url,
    maskImage: url,
    height: `${boxH * scale}px`,
    maxWidth: `${boxW * scale}px`,
    transform: shift ? `translateY(${shift * boxH}px)` : undefined,
  }
}
