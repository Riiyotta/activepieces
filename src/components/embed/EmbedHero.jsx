import FeatureFlowDemo from '../FeatureFlowDemo'
import { buttonClasses } from '../ui/Button'
import '../FeatureFlow.css' // scoped [data-section='builder'] rules of the reused flow-canvas demo
import './embed.css'

// /embed hero = `product-hero` (SPEC_MARKETING §1.5/§6.A; product-hero.Oi2sIlLj.js) with the homepage
// flow-canvas demo (FeatureFlowDemo, imported as-is) in the coast stage.
// The original's `hero-line` entrance (p/buttons/stage/highlights, .64s, --i×70ms) is NOT built here:
// left for the Animation pass (classes `embed-line` + --i are in place as hooks).

const HIGHLIGHTS = [
  ['Your users never sign up twice', 'Your app signs them in, and their workspace is created the first time they open it.'],
  ['You decide what they see', "Show only the integrations you sell, hide what you don't need, run it on your subdomain."],
  ['Every customer stays separate', 'One project each, with its own automations, connections, history and usage limits.'],
]

const ART = '/panel/coast'

export default function EmbedHero() {
  return (
    <div
      data-section="embed-hero"
      className="embed-hero mx-auto flex w-full max-w-7xl flex-col items-start px-5 pt-28 pb-24 text-left md:px-6 md:pt-32 md:pb-32 lg:px-8"
    >
      <h1 className="font-display text-5xl font-bold text-balance text-ink-900 md:text-6xl">
        Put a flow builder inside your product.
      </h1>
      <p className="embed-line mt-3 max-w-5xl text-xl text-ink-600" style={{ '--i': 1 }}>
        Your customers build their own automations without leaving your app. You choose the integrations they see, the
        branding around it, and what each one can run.
      </p>
      <div className="embed-line mt-5 flex w-full flex-wrap items-center gap-3 max-sm:*:grow" style={{ '--i': 2 }}>
        <a href="/sales?ap_cta=embed_hero" className={buttonClasses('lg', 'solid')}>
          Talk to us
        </a>
        <a href="https://www.activepieces.com/docs/embedding/overview" className={buttonClasses('lg', 'secondary')}>
          Read the docs
        </a>
      </div>
      <div className="embed-line stage relative isolate mt-12 w-full overflow-hidden rounded-4xl shadow-lift md:mt-16" style={{ '--i': 3 }}>
        <img
          src={`${ART}.webp`}
          srcSet={`${ART}-640.webp 640w, ${ART}-960.webp 960w, ${ART}-1376.webp 1376w, ${ART}.webp 1920w`}
          sizes="(min-width: 1280px) 1280px, 100vw"
          alt=""
          aria-hidden="true"
          width="1920"
          height="1080"
          fetchpriority="high"
          decoding="async"
          className="embed-stage-art absolute inset-0 -z-10 size-full object-cover opacity-85"
        />
        <div className="grid w-full grid-cols-1 place-items-center" data-section="builder">
          <FeatureFlowDemo />
        </div>
      </div>
      <div
        className="embed-line mt-12 grid w-full grid-cols-1 gap-8 md:mt-16 md:grid-cols-3 md:gap-0"
        style={{ '--i': 4 }}
      >
        {/* v4 `md:divide-x` = end border on every column but the last (v3 divide-x would use start borders). */}
        {HIGHLIGHTS.map(([title, body]) => (
          <div key={title} className="flex flex-col gap-2 md:border-ink-950/10 md:px-8 md:first:pl-0 md:last:pr-0 md:[&:not(:last-child)]:border-r">
            <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
            <p className="text-base text-ink-600">{body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
