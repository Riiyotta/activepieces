import FeatureFlowDemo from './FeatureFlowDemo'
import './FeatureFlow.css'

// G. Feature "Simple by default. Deep on demand." (CLONE_SPEC §F/G/K shared layout + §G visual).
const COLUMNS = [
  ['All the depth you need.', 'Branching, retries, waitpoints, subflows, error handling, human approvals.'],
  ['Code for the hardest step.', 'Write TypeScript inline where your flow needs it. Keep the rest visual.'],
  ['Every app connects once.', 'Connect an app once. Every flow, agent, and teammate can reach it.'],
]

export default function FeatureFlow() {
  return (
    <section
      data-section="builder"
      className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-24 md:gap-12 md:px-6 md:py-32 lg:px-8"
    >
      <div className="relative z-10 grid gap-5 md:grid-cols-12 md:gap-12">
        <h2 className="font-display text-4xl font-bold text-balance text-ink-900 md:col-span-5 md:text-5xl">
          Simple by default. Deep on demand.
        </h2>
        <div className="max-w-md md:col-span-6 md:col-start-7 md:ml-auto">
          <p className="text-xl text-ink-600">
            Chat drafts most of your flows. The builder gives you full control when they get hard.
          </p>
        </div>
      </div>
      <div className="stage relative isolate overflow-hidden rounded-4xl shadow-lift">
        <img
          src="/assets/clouds.webp"
          alt=""
          aria-hidden="true"
          width="1920"
          height="1080"
          className="stage-art absolute inset-0 -z-10 size-full object-cover opacity-85"
          loading="lazy"
          decoding="async"
        />
        <div className="grid w-full grid-cols-1 place-items-center">
          <FeatureFlowDemo />
        </div>
      </div>
      <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0 cols-divide">
        {COLUMNS.map(([title, body]) => (
          <div key={title} className="flex flex-col gap-2 md:px-6 md:first:pl-0 md:last:pr-0">
            <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
            <p className="text-base text-ink-600">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
