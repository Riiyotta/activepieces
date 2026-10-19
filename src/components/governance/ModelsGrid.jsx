import { useEffect, useRef, useState } from 'react'
import Icon from '../ui/Icon'

// /ai-governance models grid (SPEC_MARKETING §5.B; ai-governance.BuUrctv7.js `models-grid`).
// Pinned + scroll-scrubbed only at (min-width:80rem) and (min-height:48rem) without reduced motion:
// the section is 100vh + 2.4×innerHeight tall, its child sticks, and progress x = −top / (height − innerHeight).
// The 8 model tiles fly into a row by x = .4; the 6 cards fade/rise in from x = .42 + k·.07 over .09.
// Otherwise a static grid (all cards visible, tiles reflowed). Scroll math/easing copied from the source.

const TILE_LEFT = 7.38
const TILE_STEP = 12.177
const STATEMENT_INDEX = 5
const TRAVEL = 2.4
const TILES_END = 0.4
const CARD_START = 0.42
const CARD_STEP = 0.07
const CARD_SPAN = 0.09

const TILES = [
  { logo: 'anthropic-claude', name: 'Anthropic', dx: 140, dy: -150, spin: -12 },
  { logo: 'openai', name: 'OpenAI', dx: -110, dy: 165, spin: 10 },
  { logo: 'google-gemini', name: 'Google Gemini', dx: 90, dy: -175, spin: 14 },
  { logo: 'aws-bedrock', name: 'AWS Bedrock', dx: -130, dy: 140, spin: -16 },
  { logo: 'azure-openai', name: 'Azure OpenAI', dx: 120, dy: 170, spin: 8 },
  { logo: 'mistral-ai', name: 'Mistral AI', dx: -95, dy: -160, spin: -10 },
  { logo: 'openrouter', name: 'OpenRouter', dx: 105, dy: 155, spin: 15 },
  { logo: 'cloudflare', name: 'Cloudflare AI Gateway', dx: -125, dy: -145, spin: -14 },
]

const CARDS = [
  { term: 'Use the models you pay for', benefit: 'Add your OpenAI, Anthropic or Bedrock key once, then choose the models each team uses.', icon: 'solar:cpu-bolt-bold' },
  { term: 'Grant one action, not the app', benefit: 'You pick the exact actions an agent can call, and lock the inputs it must not change.', icon: 'solar:plug-circle-bold' },
  { term: 'Choose which steps need a yes', benefit: 'Mark the steps that need sign-off. The agent runs everything else without pausing.', icon: 'solar:verified-check-bold' },
  { term: 'See what each team spends', benefit: 'Every run is priced by the model used, so AI cost lands on the project that spent the money.', icon: 'solar:chart-2-bold' },
  { term: 'Read back what an agent did', benefit: 'Every prompt, tool call and payload is saved, so an auditor reads what really happened.', icon: 'solar:list-bold' },
]
const TOP = CARDS.slice(0, 3)
const BOTTOM = CARDS.slice(3)

const clamp01 = (v) => Math.min(1, Math.max(0, v))

// Cubic-bezier with control points (.85, .15) solved by Newton (6 iterations), then smoothstep.
function ease(x) {
  const p1 = 0.85
  let t = x
  for (let i = 0; i < 6; i += 1) {
    const u = 1 - t
    const fx = 3 * u * u * t * p1 + 3 * u * t * t * 0.15 + t * t * t
    const d = 3 * u * u * p1 + 6 * u * t * -0.7 + 3 * t * t * 0.85
    if (Math.abs(d) < 1e-6) break
    t = clamp01(t - (fx - x) / d)
  }
  return 3 * t * t - 2 * t * t * t
}

function tileStyle(tile, i, x) {
  const n = 1 - ease(clamp01(x / TILES_END))
  return {
    left: `${TILE_LEFT + i * TILE_STEP}%`,
    top: '50%',
    transform: `translate(-50%, -50%) translate(${tile.dx * n}%, ${tile.dy * n}%) rotate(${tile.spin * n}deg)`,
  }
}

function cardStyle(k, x) {
  const t = ease(clamp01((x - (CARD_START + k * CARD_STEP)) / CARD_SPAN))
  return { opacity: t, transform: `translateY(${(1 - t) * 1.25}rem) scale(${0.96 + t * 0.04})` }
}

function Card({ card, style }) {
  return (
    <li>
      <div className="mg-card flex size-full flex-col justify-end rounded-3xl bg-white shadow-edge" style={style}>
        <Icon name={card.icon} className="mg-glyph mb-auto text-ink-900" />
        <h3 className="mg-term font-display font-bold text-balance text-ink-900">{card.term}</h3>
        <p className="mg-benefit text-pretty text-ink-600">{card.benefit}</p>
      </div>
    </li>
  )
}

export default function ModelsGrid() {
  const ref = useRef(null)
  const [pinned, setPinned] = useState(false)
  const [travel, setTravel] = useState(0)
  const [x, setX] = useState(1)

  useEffect(() => {
    let raf = 0
    let active = false
    const progress = () => {
      const el = ref.current
      if (!el || !active) return
      const t = el.offsetHeight - window.innerHeight
      setX(t > 0 ? clamp01(-el.getBoundingClientRect().top / t) : 1)
    }
    const update = () => {
      const fits = window.matchMedia('(min-width: 80rem) and (min-height: 48rem)').matches
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      active = fits && !reduced
      setPinned(active)
      setTravel(active ? window.innerHeight * TRAVEL : 0)
      setX(active ? 0 : 1)
      // progress() reads the section height, which only reflects the new travel after render
      requestAnimationFrame(progress)
    }
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          progress()
        })
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [])

  const markOpacity = 1 - ease(clamp01(x / TILES_END))
  const tierClass = `grid gap-4 md:gap-5 ${pinned ? 'mg-tier' : 'sm:grid-cols-2 lg:grid-cols-3'}`

  return (
    <section
      ref={ref}
      data-section="models_grid"
      className={`models-grid relative${pinned ? ' mb-24 md:mb-32' : ''}`}
      style={pinned ? { height: `calc(100vh + ${travel}px)` } : undefined}
    >
      <div
        className={`px-5 md:px-6 lg:px-8 ${pinned ? 'sticky top-0 flex h-screen items-center justify-center pt-16' : 'py-24 md:py-32'}`}
      >
        <div className={pinned ? 'mg-frame' : 'mx-auto flex w-full max-w-7xl flex-col gap-4 md:gap-5'}>
          <ul className={tierClass}>
            {TOP.map((c, k) => (
              <Card key={c.term} card={c} style={cardStyle(k, x)} />
            ))}
          </ul>
          <div className="mg-band z-10">
            <div className="mg-shell size-full">
              <div className="mg-panel relative size-full">
                <span aria-hidden="true" className="mg-mark absolute inset-0" style={{ opacity: markOpacity }} />
                <span aria-hidden="true" className="mg-mark absolute inset-0 blur-lg" style={{ opacity: markOpacity * 0.7 }} />
                <div className={pinned ? 'mg-rail' : 'mg-reflow'}>
                  {TILES.map((t, i) => (
                    <span key={t.name} className={`mg-tile${pinned ? ' absolute' : ''}`} style={pinned ? tileStyle(t, i, x) : undefined}>
                      <img src={`/logos/pieces/${t.logo}.svg`} alt={t.name} className="size-[46%]" width="48" height="48" loading="lazy" decoding="async" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <ul className={tierClass}>
            {BOTTOM.map((c, k) => (
              <Card key={c.term} card={c} style={cardStyle(k + TOP.length, x)} />
            ))}
            <li>
              <div
                className="mg-card flex size-full flex-col justify-between rounded-3xl bg-primary-950"
                style={cardStyle(STATEMENT_INDEX, x)}
              >
                <span aria-hidden="true" className="mg-brandmark gov-mark block aspect-[326/297] bg-white" />
                <p className="mg-statement font-display font-bold text-balance text-white">
                  The enterprise AI ecosystem, for all of your agents.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
