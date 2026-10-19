// Shared bento card for H (BentoPlatform) and L (BentoSecond). CLONE_SPEC §H/L.
// Markup/classes copied from the saved HTML; these cards are static (no hover, no motion).
import './BentoPlatformCard.css'

// Art presets (exact inline values from the saved HTML). /panel/* is served from /assets/*.
const ART = {
  meadow: {
    tint: 'bg-accent-a-100',
    style: { backgroundImage: 'url(/assets/meadow.webp)', backgroundSize: 'cover', opacity: 0.7, filter: 'saturate(0.72) brightness(1.04) contrast(0.98)' },
  },
  clouds: {
    tint: 'bg-primary-100',
    style: { backgroundImage: 'url(/assets/clouds.webp)', backgroundSize: 'cover', opacity: 0.62, filter: 'saturate(0.78) brightness(1.06) contrast(0.96)' },
  },
  water: {
    tint: 'bg-primary-200',
    style: { backgroundImage: 'url(/rows/water.webp)', backgroundSize: 'cover', opacity: 0.55, filter: 'saturate(0.7) brightness(1.05) contrast(0.96)' },
  },
  iris: {
    tint: 'bg-ink-100',
    style: { backgroundImage: 'url(/grid/iris.webp)', backgroundSize: '230%', opacity: 0.48, filter: 'saturate(0.62) brightness(1.08) contrast(0.94) blur(3px)' },
  },
}

const SPAN = {
  9: 'md:col-span-9',
  12: 'md:col-span-12',
  15: 'md:col-span-15',
}

const SHEET = 'overflow-hidden rounded-xl border border-ink-950/10 bg-ink-50 ring-1 ring-ink-950/10'

function Frame({ mode, children }) {
  if (mode === 'crop' || mode === 'crop-left' || mode === 'wide') {
    const pos = {
      crop: 'top-6 left-5 -right-12 -bottom-12 md:top-9 md:left-9 md:-right-28 md:-bottom-20',
      'crop-left': 'top-6 right-5 -left-12 -bottom-12 md:top-9 md:right-9 md:-left-28 md:-bottom-20',
      wide: 'top-6 right-5 left-5 -bottom-12 md:top-9 md:right-9 md:left-9 md:-bottom-20',
    }[mode]
    return (
      <div className={`absolute ${pos}`}>
        <div className={`${SHEET} h-full`}>{children}</div>
      </div>
    )
  }
  const outer =
    mode === 'float'
      ? 'absolute inset-0 grid place-items-center px-5 md:px-9'
      : 'absolute inset-x-5 inset-y-0 flex items-center md:inset-x-9'
  const inner = mode === 'float' ? 'relative w-full max-w-[330px]' : 'relative w-full'
  return (
    <div className={outer}>
      <div className={inner}>
        <div className={SHEET}>{children}</div>
      </div>
    </div>
  )
}

export function BentoCard({ span, title, desc, art, position, mode, children }) {
  const a = ART[art]
  return (
    <article
      className={`group flex h-[470px] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-edge md:h-[500px] ${SPAN[span]}`}
    >
      <div className="flex flex-col gap-1 px-5 pt-6 pb-5">
        <h3 className="flex items-center gap-1.5 text-lg font-medium text-ink-900 md:text-xl">{title}</h3>
        <p className="text-sm text-ink-600 md:text-[15px] md:leading-[1.428571]">{desc}</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <div aria-hidden="true" className={`pointer-events-none relative isolate size-full overflow-hidden select-none ${a.tint}`}>
          <div className="absolute bg-no-repeat" style={{ ...a.style, backgroundPosition: position, inset: '-1rem' }} />
          <Frame mode={mode}>{children}</Frame>
        </div>
      </div>
    </article>
  )
}

export function BentoSection({ section, title, children }) {
  return (
    <section data-section={section} className="mx-auto w-full max-w-7xl px-5 py-24 md:px-6 md:py-32 lg:px-8">
      <div className="flex flex-col gap-5 md:gap-8">
        <div className="pt-1">
          <h2 className="max-w-xl font-display text-3xl font-bold text-balance text-ink-900 md:text-4xl">{title}</h2>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-24 md:gap-5">{children}</div>
      </div>
    </section>
  )
}

// Recurring mock primitives
export function Dot({ className = 'bg-accent-a-500' }) {
  return <span className={`size-1.5 rounded-full ${className}`} />
}

export function TwoLine({ title, meta, titleClass = 'text-ink-900', metaClass = 'text-ink-600' }) {
  return (
    <span className="min-w-0 flex-1">
      <span className={`block truncate text-[16px] ${titleClass}`}>{title}</span>
      <span className={`block truncate text-[14px] ${metaClass}`}>{meta}</span>
    </span>
  )
}
