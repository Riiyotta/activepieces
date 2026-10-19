import Icon from './ui/Icon'
import './IconBand.css'

// IconBand (SPEC_MARKETING §1.3; icon-band.B7cQ1VN2.js). Used by /security (gradient, 6 cards) and
// /ai-governance (solid, 9 cards). Static: no motion on the original.

const TONES = ['bg-primary-300', 'bg-accent-d-300', 'bg-accent-b-300', 'bg-accent-a-300']
const LINK = /\[([^\]]+)\]\(([^)]+)\)/

// One inline markdown link per body, as in the original.
function Body({ text }) {
  const m = text.match(LINK)
  if (!m) return text
  const href = m[2]
  const external = /^https?:/.test(href)
  return (
    <>
      {text.slice(0, m.index)}
      <a
        href={href}
        className="font-medium text-ink-950 underline underline-offset-4 hover:text-primary-700"
        {...(external ? { rel: 'noopener noreferrer' } : null)}
      >
        {m[1]}
      </a>
      {text.slice(m.index + m[0].length)}
    </>
  )
}

export default function IconBand({ heading = 'Ship with confidence', background = 'solid', cards, section }) {
  return (
    <section data-section={section} className="relative isolate px-5 py-28 md:px-6 md:py-40 lg:px-8">
      <div
        aria-hidden="true"
        className={`icon-band-ground pointer-events-none absolute inset-0 -z-10${background === 'gradient' ? ' is-faded' : ''}`}
      />
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="mx-auto max-w-3xl text-center font-display text-3xl font-bold text-balance text-ink-900 md:text-5xl">
          {heading}
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {cards.map((c, i) => (
            <article
              key={c.title}
              className="flex flex-col items-center rounded-2xl bg-white px-8 py-10 text-center md:px-10 md:py-14"
            >
              <span
                className={`grid size-20 shrink-0 place-items-center rounded-[1.75rem] text-ink-950 ${TONES[i % TONES.length]}`}
              >
                <Icon name={c.icon} className="size-14" />
              </span>
              <div className="mt-10 flex flex-col gap-1.5">
                <h3 className="font-display text-3xl font-bold text-balance text-ink-900">{c.title}</h3>
                <p className="text-lg text-pretty text-ink-600">
                  <Body text={c.body} />
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
