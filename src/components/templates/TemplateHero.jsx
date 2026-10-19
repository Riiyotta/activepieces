import { buttonClasses } from '../ui/Button'
import './Template.css'

// Shared hero for /product/* and /solutions/* (SPEC_PRODUCT_SOLUTIONS §3). No <section>: a plain div on
// white (the original's `.hero-stage` class is omitted: homepage Hero.css styles it globally). H1 is static; lede, CTAs, stage and the below-stage block enter with the
// scoped .tpl-line keyframe (Template.css; --i 1..4).

const SIGN_UP = 'https://cloud.activepieces.com/sign-up'

// `scope` sets data-section on the visual wrapper so the reused homepage demos pick up their scoped CSS
// ('builder' = FeatureFlow.css, 'agents' = FeatureAgents.css).
export default function TemplateHero({ section, route, h1, lede, ctaKey, stageBg, scope, visual, below }) {
  const art = `/panel/${stageBg}`
  return (
    <div
      data-section={`${section}-hero`}
      className="tpl-hero mx-auto flex w-full max-w-7xl flex-col items-start px-5 pt-28 pb-24 text-left md:px-6 md:pt-32 md:pb-32 lg:px-8"
    >
      <h1 className="font-display text-5xl font-bold text-balance text-ink-900 md:text-6xl">{h1}</h1>
      <p className="tpl-line mt-3 max-w-5xl text-xl text-ink-600" style={{ '--i': 1 }}>
        {lede}
      </p>
      <div className="tpl-line mt-5 flex w-full flex-wrap items-center gap-3 max-sm:*:grow" style={{ '--i': 2 }}>
        <a href={`${SIGN_UP}?ap_cta=${ctaKey}&ref=${encodeURIComponent(route)}`} className={buttonClasses('lg', 'solid')}>
          Start building
        </a>
        <a href={`/sales?ap_cta=${ctaKey}`} className={buttonClasses('lg', 'secondary')}>
          Talk to sales
        </a>
      </div>
      <div className="tpl-line stage relative isolate mt-12 w-full overflow-hidden rounded-4xl shadow-lift md:mt-16" style={{ '--i': 3 }}>
        <img
          src={`${art}.webp`}
          srcSet={`${art}-640.webp 640w, ${art}-960.webp 960w, ${art}-1376.webp 1376w, ${art}.webp 1920w`}
          sizes="(min-width: 1280px) 1280px, 100vw"
          width="1920"
          height="1080"
          alt=""
          aria-hidden="true"
          fetchpriority="high"
          decoding="async"
          className="tpl-stage-art absolute inset-0 -z-10 size-full object-cover opacity-85"
        />
        <div className="grid w-full grid-cols-1 place-items-center" data-section={scope}>
          {visual}
        </div>
      </div>
      {below}
    </div>
  )
}

// Product: 3 text columns under the stage (§5.1). h2, not h3; md:px-8.
export function HeroColumns({ columns }) {
  return (
    <div className="tpl-line tpl-cols-divide mt-12 grid w-full grid-cols-1 gap-8 md:mt-16 md:grid-cols-3 md:gap-0" style={{ '--i': 4 }}>
      {columns.map(([title, body]) => (
        <div key={title} className="flex flex-col gap-2 md:px-8 md:first:pl-0 md:last:pr-0">
          <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
          <p className="text-base text-ink-600">{body}</p>
        </div>
      ))}
    </div>
  )
}
