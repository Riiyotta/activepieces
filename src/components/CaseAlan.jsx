import './CaseAlan.css'

// J. Case study, Alan (CLONE_SPEC §D/J). Static.
const STATS = [
  ['300+', 'Workflows deployed, from zero'],
  ['$500k+', 'Saved annually'],
  ['6,300+', 'Hours reclaimed'],
]

export default function CaseAlan() {
  return (
    <section data-section="case-study-alan" className="mx-auto w-full max-w-7xl px-5 py-24 md:px-6 md:py-32 lg:px-8">
      <div className="flex w-full flex-col items-center text-center">
        <img src="/assets/alan.svg" alt="Alan" className="h-10 w-auto" width="261" height="72" loading="lazy" />
        <blockquote className="case-alan-quote mt-8 w-full max-w-5xl font-display font-medium text-balance text-ink-600">
          “We needed a solution that could <span className="text-ink-900">integrate our ecosystem and our internal data,</span> without hosting it in the US.”
        </blockquote>
        <figure className="mt-6 w-full md:mt-8">
          <figcaption className="space-y-1">
            <p className="text-base/6 font-semibold text-ink-900">Guillaume Durand</p>
            <p className="text-sm/5 text-ink-600">Product Marketing Lead, Alan</p>
            <p className="text-sm/5 text-ink-500">AI-powered health insurance, 700 employees</p>
          </figcaption>
          <div className="mt-12 grid grid-cols-1 gap-8 border-t border-ink-950/10 pt-12 sm:grid-cols-3 sm:gap-0 alan-stats-divide">
            {STATS.map(([value, label]) => (
              <div key={value} className="sm:px-10">
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
