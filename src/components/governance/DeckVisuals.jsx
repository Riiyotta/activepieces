import Icon from '../ui/Icon'

// Rollout deck mock cards (SPEC_MARKETING §5.D; ai-governance.BuUrctv7.js `pilot`, `rollout`, `control`,
// `evidence`). Static.

const CARD = 'overflow-hidden rounded-2xl border border-ink-950/10 bg-white'

export function Pilot() {
  const stats = [
    ['Flows', '24'],
    ['Connections', '9'],
    ['Tables', '3'],
  ]
  const avatars = ['bg-primary-200', 'bg-accent-a-200', 'bg-accent-b-200', 'bg-ink-200']
  const locked = ['Finance', 'Support', 'Revenue ops', 'Data platform']
  return (
    <div className={CARD}>
      <div className="flex items-center gap-3 border-b border-ink-950/10 px-5 py-4">
        <span className="size-2 shrink-0 rounded-full bg-primary-500" />
        <span className="text-[15px] font-semibold text-ink-950">Engineering</span>
        <span className="ml-auto shrink-0 text-[13px] text-ink-500">Your project</span>
      </div>
      <div className="grid grid-cols-3">
        {stats.map(([label, value], i) => (
          <div key={label} className={`min-w-0 px-4 py-4${i < stats.length - 1 ? ' border-r border-ink-950/10' : ''}`}>
            <div className="text-[24px] leading-none font-semibold text-ink-950 tabular-nums">{value}</div>
            <div className="mt-2 truncate text-[12px] text-ink-500">{label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 border-t border-ink-950/10 px-5 py-4">
        <div className="flex shrink-0 -space-x-2">
          {avatars.map((a) => (
            <span key={a} className={`size-7 rounded-full ring-2 ring-white ${a}`} />
          ))}
        </div>
        <span className="text-[14px] text-ink-900">12 members</span>
      </div>
      {locked.map((name) => (
        <div key={name} className="flex items-center gap-3 border-t border-ink-950/10 bg-ink-50 px-5 py-4">
          <Icon name="solar:lock-password-linear" className="size-4 shrink-0 text-ink-400" />
          <span className="text-[14px] text-ink-500">{name}</span>
          <span className="ml-auto shrink-0 text-[13px] text-ink-600">Out of reach</span>
        </div>
      ))}
    </div>
  )
}

export function Rollout() {
  const teams = [
    ['Engineering', '12', ['bg-primary-200', 'bg-accent-a-200', 'bg-ink-200']],
    ['Finance', '8', ['bg-accent-b-200', 'bg-ink-200']],
    ['Support', '21', ['bg-accent-a-200', 'bg-primary-200', 'bg-ink-200']],
    ['Marketing', '15', ['bg-accent-c-200', 'bg-ink-200']],
  ]
  return (
    <div className={CARD}>
      <div className="flex items-center gap-3 border-b border-ink-950/10 px-5 py-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink-950 text-white">
          <Icon name="solar:user-id-linear" className="size-4" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-medium text-ink-950">Okta directory</span>
          <span className="block truncate text-[13px] text-ink-500">SCIM, 56 people</span>
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-2">
          <span className="size-2 rounded-full bg-accent-a-500" />
          <span className="text-[13px] text-ink-600">Synced</span>
        </span>
      </div>
      {/* v4 `divide-x divide-y` puts end/bottom borders on every child but the last (v3 would use start/top). */}
      <div className="grid grid-cols-2">
        {teams.map(([name, members, tints], i) => (
          <div key={name} className={`min-w-0 px-5 py-4${i < teams.length - 1 ? ' border-r border-b border-ink-950/10' : ''}`}>
            <div className="truncate text-[14px] font-medium text-ink-950">{name}</div>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="flex shrink-0 -space-x-2">
                {tints.map((t) => (
                  <span key={t} className={`size-7 rounded-full ring-2 ring-white ${t}`} />
                ))}
              </div>
              <span className="text-[13px] text-ink-500 tabular-nums">{members}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Control() {
  const toggles = [
    ['Read invoices', true],
    ['Create invoices', true],
    ['Issue refunds', false],
  ]
  return (
    <div className={CARD}>
      <div className="flex flex-col gap-1.5 px-5 py-4">
        <span className="text-[13px] text-ink-500">Secret</span>
        <span className="flex h-11 items-center gap-3 rounded-lg bg-ink-50 px-3.5 ring-1 ring-ink-950/10">
          <Icon name="solar:key-linear" className="size-4 shrink-0 text-ink-400" />
          <span className="font-mono text-[14px] tracking-widest text-ink-400">••••••••••</span>
          <span className="ml-auto shrink-0 text-[13px] text-ink-500">Write only</span>
        </span>
      </div>
      <div className="flex items-center gap-3 border-t border-ink-950/10 bg-ink-50 px-5 py-4">
        <span className="size-2 shrink-0 rounded-full bg-accent-b-500" />
        <span className="text-[14px] text-ink-900">Refunds wait for an approver</span>
        <span className="ml-auto shrink-0 text-[13px] text-ink-500">Dana Rowe</span>
      </div>
      <div className="border-t border-ink-950/10 px-5 py-4">
        <span className="text-[13px] text-ink-500">What the agent may do with it</span>
        <div className="mt-3 flex flex-col gap-3">
          {toggles.map(([label, on]) => (
            <span key={label} className="flex items-center gap-3">
              <span
                className={`flex h-5 w-8 shrink-0 items-center rounded-full px-0.5 ${
                  on ? 'justify-end bg-ink-900' : 'justify-start bg-ink-950/10'
                }`}
              >
                <span className="size-4 rounded-full bg-white" />
              </span>
              <span className={`text-[14px] ${on ? 'text-ink-900' : 'text-ink-400'}`}>{label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Evidence() {
  const rows = [
    ['solar:structure-linear', 'Notify finance on approval', 'Flow added', 'text-accent-a-500'],
    ['solar:users-group-two-rounded-linear', 'Sam Okafor, now Editor', 'Role changed', 'text-accent-b-500'],
    ['solar:plug-circle-linear', 'Ledger API, secret rotated', 'Connection', 'text-ink-400'],
    ['solar:clipboard-text-linear', 'Sandbox key removed', 'Connection', 'text-ink-400'],
  ]
  return (
    <div className={CARD}>
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-semibold text-ink-950">Release 42</span>
          <span className="block truncate text-[13px] text-ink-500">Applied 09:41 by Dana Rowe</span>
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-ink-900 ring-1 ring-ink-950/10">
          <Icon name="solar:undo-left-round-linear" className="size-3.5 text-ink-400" /> Revert
        </span>
      </div>
      <div className="divide-y divide-ink-950/10 border-t border-ink-950/10">
        {rows.map(([icon, text, meta, tone]) => (
          <div key={text} className="flex items-center gap-3.5 px-5 py-3.5">
            <Icon name={icon} className={`size-4 shrink-0 ${tone}`} />
            <span className="truncate text-[14px] text-ink-900">{text}</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500">{meta}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
