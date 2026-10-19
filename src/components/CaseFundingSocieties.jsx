import './CaseFundingSocieties.css'

// D. Case study, Funding Societies (CLONE_SPEC §D/J). Markup and copy from the saved HTML. Static: no motion.
const STATS = [
  ['100+', 'Automation flows'],
  ['¼ year', 'Of manual work saved'],
  ['500+', 'Employees empowered'],
]

export default function CaseFundingSocieties() {
  return (
    <section
      data-section="case-study-funding-societies"
      className="mx-auto w-full max-w-7xl px-5 py-24 md:px-6 md:py-32 lg:px-8"
    >
      <div className="flex w-full flex-col items-center text-center">
        <img
          src="/assets/funding-societies.webp"
          alt="Funding Societies"
          className="h-10 w-auto"
          width="739"
          height="242"
          loading="lazy"
        />
        <blockquote className="case-quote mt-8 w-full max-w-5xl font-display font-medium text-balance text-ink-600">
          {' '}
          “Activepieces was instrumental in <span className="text-ink-900">helping us become an AI-first organization.</span> It
          enabled rapid experimentation across teams.”{' '}
        </blockquote>
        <figure className="mt-6 w-full md:mt-8">
          <figcaption className="space-y-1">
            <p className="text-base/6 font-semibold text-ink-900">Shawn Lim</p>
            <p className="text-sm/5 text-ink-600">VP of Platform &amp; AI, Funding Societies</p>
            <p className="text-sm/5 text-ink-500">SME digital financing, 500+ employees</p>
          </figcaption>
          <div className="mt-12 grid grid-cols-1 gap-8 border-t border-ink-950/10 pt-12 sm:grid-cols-3 sm:gap-0 stats-divide">
            {STATS.map(([value, label]) => (
              <div key={label} className="sm:px-10">
                <p className="font-display text-4xl font-bold text-ink-900 md:text-5xl">{value}</p>
                <p className="mt-2.5 text-base text-ink-600">{label}</p>
              </div>
            ))}
          </div>
        </figure>
      </div>
    </section>
  )
}
