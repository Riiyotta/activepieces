import Icon from '../ui/Icon'

// The three mock visuals inside the /security stage (SPEC_MARKETING §4.B; security.G6mAqp3Z.js
// `deployment`, `credential`, `isolation`). Static, decorative (aria-hidden), markup as in the source.

const MODES = ['Our cloud', 'Your infra', 'Air-gapped']
const ACTIVE_MODE = 1
const SPECS = [
  ['Tenancy', 'Single tenant'],
  ['Build', 'Enterprise'],
  ['Region', 'Yours to pick'],
  ['Model', 'Ours or yours'],
]

export function Deployment() {
  return (
    <div aria-hidden="true" className="w-full select-none">
      <div className="rounded-2xl bg-white p-6 shadow-lift">
        <div className="flex gap-1 rounded-xl bg-ink-100 p-1">
          {MODES.map((m, i) => (
            <span
              key={m}
              className={`flex-1 rounded-lg py-2 text-center text-[13px] ${
                i === ACTIVE_MODE ? 'bg-white text-ink-900 ring-1 ring-ink-950/10' : 'text-ink-500'
              }`}
            >
              {m}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-700/[0.08]">
            <Icon name="solar:server-linear" className="size-5 text-primary-800" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[20px] font-semibold text-ink-950">Your own cluster</span>
            <span className="truncate text-[13px] text-ink-500">Hardware nobody else shares</span>
          </span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-ink-950/10">
          {SPECS.map(([label, value]) => (
            <span key={label} className="flex flex-col gap-1 bg-white p-4">
              <span className="text-[12px] text-ink-500">{label}</span>
              <span className="text-[14px] text-ink-900">{value}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// [key, value, value class]
const JSON_LINES = [
  ['"piece"', '"salesforce"', 'code-str', ','],
  ['"displayName"', '"Salesforce prod"', 'code-str', ','],
  ['"status"', '"ACTIVE"', 'code-str', ','],
  ['"value"', '"[encrypted]"', 'code-dim', ''],
]

export function Credential() {
  return (
    <div aria-hidden="true" className="w-full select-none">
      <div className="overflow-hidden rounded-2xl bg-white shadow-lift">
        <div className="flex items-center gap-2.5 px-6 py-5">
          <span className="font-mono text-[12px] text-ink-500">GET</span>
          <span className="min-w-0 truncate font-mono text-[13px] text-ink-900"> /v1/connections/conn_9fa2 </span>
          <span className="ml-auto flex shrink-0 items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent-a-500" />
            <span className="font-mono text-[13px] text-ink-700 tabular-nums">200</span>
          </span>
        </div>
        <div className="flex flex-col whitespace-pre border-t border-ink-950/10 bg-ink-50/60 px-6 py-5 font-mono text-[13px] leading-7">
          <p>
            <span className="code-text">{'{'}</span>
          </p>
          {JSON_LINES.map(([k, v, cls, comma]) => (
            <p key={k}>
              <span className="code-fn">{` ${k}`}</span>
              <span className="code-text">: </span>
              <span className={cls}>{v}</span>
              {comma && <span className="code-text">{comma}</span>}
            </p>
          ))}
          <p>
            <span className="code-text">{'}'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 border-t border-ink-950/10 px-6 py-5">
          <Icon name="solar:key-minimalistic-square-linear" className="size-4 shrink-0 text-ink-400" />
          <span className="text-[13px] text-ink-700">Opened in the worker while the step runs</span>
        </div>
      </div>
    </div>
  )
}

const EGRESS = [
  ['api.stripe.com', 'Allowed', 'bg-accent-a-500'],
  ['10.0.4.19:5432', 'Blocked', 'bg-ink-300'],
]

export function Isolation() {
  return (
    <div aria-hidden="true" className="relative w-full select-none">
      <div className="rounded-2xl bg-white shadow-lift">
        <div className="flex flex-col gap-3 px-5 py-5">
          <span className="flex items-center gap-2 text-[12px] text-ink-500">
            <Icon name="solar:shield-keyhole-linear" className="size-3.5 shrink-0" /> Isolate, with its own filesystem view
          </span>
          <p className="font-mono text-[20px] font-semibold text-ink-950">create_invoice</p>
          <p className="text-[13px] text-ink-600">
            The agent asked to write to Xero. It named a connection, and never saw inside it.
          </p>
        </div>
        <div className="flex items-center gap-3 border-t border-ink-950/10 px-5 py-4">
          <span className="rounded-lg bg-ink-900 px-4 py-2.5 text-[14px] font-medium text-white"> Approve </span>
          <span className="rounded-lg border border-ink-950/15 px-4 py-2.5 text-[14px] text-ink-700"> Decline </span>
          <span className="ml-auto text-[12px] text-ink-500">In the audit trail</span>
        </div>
      </div>
      <div className="absolute right-3 -bottom-9 w-56 rounded-xl bg-white p-3.5 shadow-lift md:-right-5 md:-bottom-10">
        <span className="text-[12px] text-ink-500">Egress at your boundary</span>
        <div className="mt-2.5 flex flex-col gap-2">
          {EGRESS.map(([target, state, dot]) => (
            <span key={target} className="flex items-center gap-2.5">
              <span className={`size-1.5 shrink-0 rounded-full ${dot}`} />
              <span className="min-w-0 truncate font-mono text-[13px] text-ink-900">{target}</span>
              <span className="ml-auto shrink-0 text-[12px] text-ink-500">{state}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
