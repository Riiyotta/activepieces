import FeatureAgentsDemo from './FeatureAgentsDemo'
import './FeatureAgents.css'

// F. Feature "Agents that get the job done" (CLONE_SPEC §F/G/K shared layout + §F visual).
const COLUMNS = [
  ['Plain words, no prompt engineering', 'Say what you want done. The agent works out the steps, the order, and what to open.'],
  ['It picks its own tools', 'Every app you have connected, and any MCP server you point it at, is fair game.'],
  ['Approval where it counts', 'Gate the steps that touch money, customers, or production, and let the rest run.'],
]

export default function FeatureAgents() {
  return (
    <section
      data-section="agents"
      className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-24 md:gap-12 md:px-6 md:py-32 lg:px-8"
    >
      <div className="relative z-10 grid gap-5 md:grid-cols-12 md:gap-12">
        <h2 className="font-display text-4xl font-bold text-balance text-ink-900 md:col-span-5 md:text-5xl">
          Agents that get the job done
        </h2>
        <div className="max-w-md md:col-span-6 md:col-start-7 md:ml-auto">
          <p className="text-xl text-ink-600">
            Describe a job in plain words. An agent takes it end to end across your tools, checking in only where it counts.
          </p>
        </div>
      </div>
      <div className="stage relative isolate overflow-hidden rounded-4xl shadow-lift">
        <img
          src="/assets/meadow.webp"
          alt=""
          aria-hidden="true"
          width="1920"
          height="1080"
          className="stage-art absolute inset-0 -z-10 size-full object-cover opacity-85"
          loading="lazy"
          decoding="async"
        />
        <div className="grid w-full grid-cols-1 place-items-center">
          <FeatureAgentsDemo />
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
