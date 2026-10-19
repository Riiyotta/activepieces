// C.3 window bodies: generated verbatim from the saved HTML (static skeleton UIs, CLONE_SPEC §C.3).
import Icon from './ui/Icon'

export const DREAM_WINDOW_BODIES = [
  () => (
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-xs h-full">
        <div className="px-3.5 py-2 relative flex shrink-0 items-center border-b border-ink-200 bg-ink-100">
          <div className="gap-1.5 flex">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="rounded-md border border-ink-200 bg-white gap-2 px-3 py-1 absolute left-1/2 flex w-[46%] -translate-x-1/2 items-center justify-center">
            <Icon name="solar:lock-bold" className="text-ink-400 size-2.5" />
            <img src="/assets/google-gemini.svg" alt="" className="size-3 rounded-[3px]" loading="lazy" />
            <span className="text-[0.78rem] truncate font-medium text-ink-600">
              gemini.google.com
            </span>
          </div>
          <div className="gap-2 ml-auto flex items-center">
            <Icon name="solar:widget-4-linear" className="text-ink-400 size-3" />
            <span className="size-4 rounded-full bg-ink-200" />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1">
            <div className="flex w-32 shrink-0 flex-col gap-1 bg-[#f0f4f9] p-2.5">
              <span className="mb-1.5 flex w-fit items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5">
                <Icon name="solar:pen-new-square-linear" className="size-3 text-ink-700" />
                <span className="text-[0.78rem] font-medium text-ink-800">
                  New chat
                </span>
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1">
                <Icon name="solar:widget-4-linear" className="size-3 text-ink-600" />
                <span className="text-[0.78rem] text-ink-700">
                  Gems
                </span>
              </span>
              <span className="mt-2 mb-0.5 px-2 text-[0.7rem] font-semibold text-ink-500">
                Recent
              </span>
              <span className="bg-[#d3e3fc] flex items-center rounded-full px-2 py-1">
                <span className="w-4/5 bg-[#1b74e6]/45 h-2 rounded" />
              </span>
              <span className="flex items-center rounded-full px-2 py-1">
                <span className="w-1/2 bg-ink-300 h-2 rounded" />
              </span>
              <span className="flex items-center rounded-full px-2 py-1">
                <span className="w-3/4 bg-ink-300 h-2 rounded" />
              </span>
              <span className="flex items-center rounded-full px-2 py-1">
                <span className="w-3/5 bg-ink-300 h-2 rounded" />
              </span>
              <span className="mt-auto flex items-center gap-1.5 px-2">
                <Icon name="solar:settings-linear" className="size-3 text-ink-500" />
                <span className="text-[0.7rem] text-ink-600">
                  Settings
                </span>
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex shrink-0 items-center gap-1.5 px-3.5 py-2">
                <span className="text-[0.88rem] font-semibold text-ink-800">
                  Gemini
                </span>
                <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[0.7rem] font-medium text-ink-600">
                  Pro
                </span>
                <Icon name="solar:alt-arrow-down-linear" className="size-3 text-ink-400" />
                <span className="ml-auto size-5 rounded-full bg-teal-soft" />
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-2.5 px-3.5 py-1">
                <div className="ml-auto flex w-3/5 flex-col gap-1.5 rounded-2xl bg-[#f0f4f9] px-3 py-2">
                  <span className="h-2 w-full rounded bg-ink-300" />
                  <span className="h-2 w-1/2 rounded bg-ink-300" />
                </div>
                <div className="flex items-start gap-2">
                  <img src="/assets/google-gemini.svg" alt="" className="mt-0.5 size-4 shrink-0" loading="lazy" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="w-full h-2 rounded bg-ink-100" />
                    <span className="w-5/6 h-2 rounded bg-ink-100" />
                    <span className="w-full h-2 rounded bg-ink-100" />
                  </div>
                </div>
                <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-ink-200 px-3 py-2">
                  <div className="flex shrink-0 items-center gap-4 border-b border-ink-100 pb-1.5">
                    <span className="text-[0.7rem] font-semibold text-[#1b74e6]">
                      Tool
                    </span>
                    <span className="ml-auto text-[0.7rem] font-semibold text-ink-500">
                      Spend
                    </span>
                  </div>
                  <div className="flex min-h-0 flex-1 items-center gap-4 border-b border-ink-100 last:border-b-0">
                    <span className="w-3/4 h-2 rounded bg-ink-200" />
                    <span className="w-1/2 ml-auto h-2 rounded bg-ink-100" />
                  </div>
                  <div className="flex min-h-0 flex-1 items-center gap-4 border-b border-ink-100 last:border-b-0">
                    <span className="w-2/3 h-2 rounded bg-ink-200" />
                    <span className="w-3/5 ml-auto h-2 rounded bg-ink-100" />
                  </div>
                  <div className="flex min-h-0 flex-1 items-center gap-4 border-b border-ink-100 last:border-b-0">
                    <span className="w-4/5 h-2 rounded bg-ink-200" />
                    <span className="w-2/5 ml-auto h-2 rounded bg-ink-100" />
                  </div>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <span className="rounded-full border border-ink-200 px-2.5 py-1 text-[0.7rem] font-medium text-ink-600">
                    Compare plans
                  </span>
                  <span className="rounded-full border border-ink-200 px-2.5 py-1 text-[0.7rem] font-medium text-ink-600">
                    Summarise
                  </span>
                  <span className="rounded-full border border-ink-200 px-2.5 py-1 text-[0.7rem] font-medium text-ink-600">
                    Export
                  </span>
                </div>
              </div>
              <div className="shrink-0 px-3.5 py-2.5">
                <div className="flex items-center gap-2 rounded-full bg-[#f0f4f9] px-3 py-2">
                  <span className="text-[0.78rem] text-ink-500">
                    Ask Gemini
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <Icon name="solar:gallery-linear" className="size-3.5 text-ink-500" />
                    <Icon name="solar:microphone-linear" className="size-3.5 text-ink-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  ),
  () => (
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-xs h-full">
        <div className="px-3.5 py-2 relative flex shrink-0 items-center border-b border-ink-200 bg-ink-100">
          <div className="gap-1.5 flex">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="gap-2 px-3 py-1 absolute left-1/2 flex w-[46%] -translate-x-1/2 items-center justify-center">
            <img src="/assets/postgres.svg" alt="" className="size-3 rounded-[3px]" loading="lazy" />
            <span className="text-[0.78rem] truncate font-medium text-ink-600">
              calder-prod — postgres
            </span>
          </div>
          <div className="gap-2 ml-auto flex items-center">
            <span className="size-4 rounded-full bg-ink-200" />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1">
            <div className="flex w-32 shrink-0 flex-col gap-1 border-r border-ink-100 bg-ink-50 p-2.5">
              <div className="mb-1 flex items-center gap-1.5 px-2">
                <span className="size-2.5 rounded-full bg-[#356790]" />
                <span className="text-[0.78rem] font-semibold text-ink-800">
                  calder-prod
                </span>
              </div>
              <span className="mt-1 mb-0.5 flex items-center gap-1.5 px-2">
                <Icon name="solar:alt-arrow-down-linear" className="size-3 text-ink-400" />
                <span className="text-[0.78rem] font-semibold text-ink-500">
                  public
                </span>
              </span>
              <span className="bg-[#eaf0f6] flex items-center gap-1.5 rounded-md px-2 py-1 pl-3">
                <Icon name="solar:database-linear" className="size-3 text-[#356790]" />
                <span className="font-semibold text-ink-900 text-[0.78rem]">
                  customers
                </span>
              </span>
              <span className="flex items-center gap-1.5 rounded-md px-2 py-1 pl-3">
                <Icon name="solar:database-linear" className="size-3 text-ink-400" />
                <span className="text-ink-600 text-[0.78rem]">
                  subscriptions
                </span>
              </span>
              <span className="flex items-center gap-1.5 rounded-md px-2 py-1 pl-3">
                <Icon name="solar:database-linear" className="size-3 text-ink-400" />
                <span className="text-ink-600 text-[0.78rem]">
                  invoices
                </span>
              </span>
              <span className="flex items-center gap-1.5 rounded-md px-2 py-1 pl-3">
                <Icon name="solar:database-linear" className="size-3 text-ink-400" />
                <span className="text-ink-600 text-[0.78rem]">
                  api_keys
                </span>
              </span>
              <span className="flex items-center gap-1.5 rounded-md px-2 py-1 pl-3">
                <Icon name="solar:database-linear" className="size-3 text-ink-400" />
                <span className="text-ink-600 text-[0.78rem]">
                  audit_log
                </span>
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex shrink-0 items-center gap-2 border-b border-ink-100 px-3 py-1.5">
                <span className="flex items-center gap-1.5 rounded-md bg-[#356790] px-2 py-1 text-[0.78rem] font-semibold text-white">
                  <Icon name="solar:play-bold" className="size-3" />
                  {" Run "}
                </span>
                <span className="text-[0.78rem] text-ink-500">
                  Query 1
                </span>
                <Icon name="solar:history-linear" className="ml-auto size-3 text-ink-400" />
              </div>
              <div className="shrink-0 border-b border-ink-100 px-3 py-2 text-[0.78rem] leading-5">
                <span className="text-[#356790]">
                  select
                </span>
                <span className="text-ink-700">
                  {" email, plan, mrr, last_seen "}
                </span>
                <span className="text-[#356790]">
                  from
                </span>
                <span className="text-ink-700">
                  {" customers "}
                </span>
                <span className="text-[#356790]">
                  where
                </span>
                <span className="text-ink-700">
                  {" mrr > 0;"}
                </span>
              </div>
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="grid shrink-0 grid-cols-4 border-b border-ink-200 bg-ink-50 px-3 py-1 text-[0.78rem] font-semibold text-ink-500">
                  <span className="truncate">
                    email
                  </span>
                  <span className="truncate">
                    plan
                  </span>
                  <span className="truncate">
                    mrr
                  </span>
                  <span className="truncate">
                    last_seen
                  </span>
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-4 items-center gap-2 border-b border-ink-100 px-3 last:border-b-0">
                  <span className="flex min-w-0 items-center">
                    <span className="w-3/4 h-2 rounded bg-ink-200" />
                  </span>
                  <span className="flex min-w-0 items-center">
                    <span className="rounded-full bg-lime-soft px-2.5 py-1 text-[0.7rem] text-lime-bold">
                      team
                    </span>
                  </span>
                  <span className="text-[0.78rem] text-ink-700 tabular-nums flex min-w-0 items-center">
                    $1,240
                  </span>
                  <span className="flex min-w-0 items-center">
                    <span className="w-1/2 h-2 rounded bg-ink-200" />
                  </span>
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-4 items-center gap-2 border-b border-ink-100 px-3 last:border-b-0">
                  <span className="flex min-w-0 items-center">
                    <span className="w-2/3 h-2 rounded bg-ink-200" />
                  </span>
                  <span className="flex min-w-0 items-center">
                    <span className="rounded-full bg-ink-100 px-2.5 py-1 text-[0.7rem] text-ink-600">
                      free
                    </span>
                  </span>
                  <span className="text-[0.78rem] text-ink-700 tabular-nums flex min-w-0 items-center">
                    $380
                  </span>
                  <span className="flex min-w-0 items-center">
                    <span className="w-2/3 h-2 rounded bg-ink-200" />
                  </span>
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-4 items-center gap-2 border-b border-ink-100 px-3 last:border-b-0">
                  <span className="flex min-w-0 items-center">
                    <span className="w-4/5 h-2 rounded bg-ink-200" />
                  </span>
                  <span className="flex min-w-0 items-center">
                    <span className="rounded-full bg-lime-soft px-2.5 py-1 text-[0.7rem] text-lime-bold">
                      team
                    </span>
                  </span>
                  <span className="text-[0.78rem] text-ink-700 tabular-nums flex min-w-0 items-center">
                    $2,900
                  </span>
                  <span className="flex min-w-0 items-center">
                    <span className="w-1/3 h-2 rounded bg-ink-200" />
                  </span>
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-4 items-center gap-2 border-b border-ink-100 px-3 last:border-b-0">
                  <span className="flex min-w-0 items-center">
                    <span className="w-1/2 h-2 rounded bg-ink-200" />
                  </span>
                  <span className="flex min-w-0 items-center">
                    <span className="rounded-full bg-ink-100 px-2.5 py-1 text-[0.7rem] text-ink-600">
                      free
                    </span>
                  </span>
                  <span className="text-[0.78rem] text-ink-700 tabular-nums flex min-w-0 items-center">
                    $120
                  </span>
                  <span className="flex min-w-0 items-center">
                    <span className="w-1/2 h-2 rounded bg-ink-200" />
                  </span>
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-4 items-center gap-2 border-b border-ink-100 px-3 last:border-b-0">
                  <span className="flex min-w-0 items-center">
                    <span className="w-3/5 h-2 rounded bg-ink-200" />
                  </span>
                  <span className="flex min-w-0 items-center">
                    <span className="rounded-full bg-azure-soft px-2.5 py-1 text-[0.7rem] text-azure-bold">
                      scale
                    </span>
                  </span>
                  <span className="text-[0.78rem] text-ink-700 tabular-nums flex min-w-0 items-center">
                    $640
                  </span>
                  <span className="flex min-w-0 items-center">
                    <span className="w-2/5 h-2 rounded bg-ink-200" />
                  </span>
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-4 items-center gap-2 border-b border-ink-100 px-3 last:border-b-0">
                  <span className="flex min-w-0 items-center">
                    <span className="w-3/4 h-2 rounded bg-ink-200" />
                  </span>
                  <span className="flex min-w-0 items-center">
                    <span className="rounded-full bg-ink-100 px-2.5 py-1 text-[0.7rem] text-ink-600">
                      free
                    </span>
                  </span>
                  <span className="text-[0.78rem] text-ink-700 tabular-nums flex min-w-0 items-center">
                    $95
                  </span>
                  <span className="flex min-w-0 items-center">
                    <span className="w-1/2 h-2 rounded bg-ink-200" />
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 border-t border-ink-200 bg-ink-50 px-3 py-1 text-[0.7rem] text-ink-500">
                <span>
                  312 rows
                </span>
                <span className="h-2 w-px bg-ink-200" />
                <span>
                  84 ms
                </span>
                <span className="ml-auto">
                  connected as agent_svc
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
  ),
  () => (
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-xs h-full">
        <div className="px-3.5 py-2 relative flex shrink-0 items-center border-b border-ink-200 bg-ink-100">
          <div className="gap-1.5 flex">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="rounded-md border border-ink-200 bg-white gap-2 px-3 py-1 absolute left-1/2 flex w-[46%] -translate-x-1/2 items-center justify-center">
            <Icon name="solar:lock-bold" className="text-ink-400 size-2.5" />
            <img src="/assets/stripe.svg" alt="" className="size-3 rounded-[3px]" loading="lazy" />
            <span className="text-[0.78rem] truncate font-medium text-ink-600">
              dashboard.stripe.com
            </span>
          </div>
          <div className="gap-2 ml-auto flex items-center">
            <Icon name="solar:widget-4-linear" className="text-ink-400 size-3" />
            <span className="size-4 rounded-full bg-ink-200" />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1">
            <div className="flex w-32 shrink-0 flex-col gap-1 border-r border-ink-100 p-2.5">
              <span className="mb-1.5 w-fit rounded-md bg-[#fcf0e6] px-2 py-1 text-[0.7rem] font-bold text-[#c8471e] uppercase">
                Test mode
              </span>
              <span className="flex items-center gap-2 rounded-md px-2.5 py-1">
                <Icon name="solar:home-2-linear" className="size-3 text-ink-400" />
                <span className="text-ink-600 text-[0.78rem]">
                  Home
                </span>
              </span>
              <span className="flex items-center gap-2 rounded-md px-2.5 py-1">
                <Icon name="solar:card-linear" className="size-3 text-ink-400" />
                <span className="text-ink-600 text-[0.78rem]">
                  Payments
                </span>
              </span>
              <span className="bg-[#5f5efd]/10 flex items-center gap-2 rounded-md px-2.5 py-1">
                <Icon name="solar:users-group-rounded-linear" className="size-3 text-[#5f5efd]" />
                <span className="font-semibold text-[#5f5efd] text-[0.78rem]">
                  Customers
                </span>
              </span>
              <span className="flex items-center gap-2 rounded-md px-2.5 py-1">
                <Icon name="solar:bill-list-linear" className="size-3 text-ink-400" />
                <span className="text-ink-600 text-[0.78rem]">
                  Billing
                </span>
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex shrink-0 items-start gap-2.5 border-b border-ink-100 px-3.5 py-2.5">
                <span className="size-8 shrink-0 rounded-full bg-violet-soft" />
                <div className="flex min-w-0 flex-col gap-1.5 pt-0.5">
                  <span className="h-2.5 w-32 rounded bg-ink-400" />
                  <span className="h-2 w-36 rounded bg-ink-200" />
                </div>
                <div className="ml-auto flex flex-col items-end gap-1.5">
                  <span className="text-[1rem] font-semibold text-ink-900">
                    $4,280.00
                  </span>
                  <span className="text-[0.7rem] text-ink-500">
                    Lifetime volume
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 gap-6 border-b border-ink-100 px-3.5 py-2">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[0.7rem] text-ink-500">
                    Customer since
                  </span>
                  <span className="w-14 h-2 rounded bg-ink-200" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[0.7rem] text-ink-500">
                    Payment method
                  </span>
                  <span className="w-16 h-2 rounded bg-ink-200" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[0.7rem] text-ink-500">
                    MRR
                  </span>
                  <span className="text-[0.78rem] font-semibold text-ink-800">
                    $1,240.00
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 px-3.5 pt-2.5 pb-1">
                <span className="text-[0.78rem] font-semibold text-ink-800">
                  Payments
                </span>
                <Icon name="solar:magnifer-line-duotone" className="ml-auto size-3 text-ink-400" />
                <Icon name="solar:menu-dots-bold" className="size-3 text-ink-400" />
              </div>
              <div className="flex min-h-0 flex-1 flex-col px-3.5 pb-2">
                <div className="flex min-h-0 flex-1 items-center gap-2.5 border-b border-ink-100 last:border-b-0">
                  <span className="w-20 shrink-0 text-[0.78rem] font-medium text-ink-800 tabular-nums">
                    $1,240.00
                  </span>
                  <span className="bg-[#c8f4cd] text-[#066249] shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold">
                    Succeeded
                  </span>
                  <span className="w-24 h-2 min-w-0 flex-1 rounded bg-ink-100" />
                  <span className="h-2 w-8 shrink-0 rounded bg-ink-100" />
                </div>
                <div className="flex min-h-0 flex-1 items-center gap-2.5 border-b border-ink-100 last:border-b-0">
                  <span className="w-20 shrink-0 text-[0.78rem] font-medium text-ink-800 tabular-nums">
                    $1,240.00
                  </span>
                  <span className="bg-[#c8f4cd] text-[#066249] shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold">
                    Succeeded
                  </span>
                  <span className="w-20 h-2 min-w-0 flex-1 rounded bg-ink-100" />
                  <span className="h-2 w-8 shrink-0 rounded bg-ink-100" />
                </div>
                <div className="flex min-h-0 flex-1 items-center gap-2.5 border-b border-ink-100 last:border-b-0">
                  <span className="w-20 shrink-0 text-[0.78rem] font-medium text-ink-800 tabular-nums">
                    $980.00
                  </span>
                  <span className="bg-[#c8f4cd] text-[#066249] shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold">
                    Succeeded
                  </span>
                  <span className="w-28 h-2 min-w-0 flex-1 rounded bg-ink-100" />
                  <span className="h-2 w-8 shrink-0 rounded bg-ink-100" />
                </div>
                <div className="flex min-h-0 flex-1 items-center gap-2.5 border-b border-ink-100 last:border-b-0">
                  <span className="w-20 shrink-0 text-[0.78rem] font-medium text-ink-800 tabular-nums">
                    $980.00
                  </span>
                  <span className="bg-[#fde2df] text-[#b11046] shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold">
                    Failed
                  </span>
                  <span className="w-16 h-2 min-w-0 flex-1 rounded bg-ink-100" />
                  <span className="h-2 w-8 shrink-0 rounded bg-ink-100" />
                </div>
                <div className="flex min-h-0 flex-1 items-center gap-2.5 border-b border-ink-100 last:border-b-0">
                  <span className="w-20 shrink-0 text-[0.78rem] font-medium text-ink-800 tabular-nums">
                    $980.00
                  </span>
                  <span className="bg-[#c8f4cd] text-[#066249] shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold">
                    Succeeded
                  </span>
                  <span className="w-24 h-2 min-w-0 flex-1 rounded bg-ink-100" />
                  <span className="h-2 w-8 shrink-0 rounded bg-ink-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  ),
  () => (
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-xs h-full">
        <div className="px-3.5 py-2 relative flex shrink-0 items-center border-b border-ink-200 bg-ink-100">
          <div className="gap-1.5 flex">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="gap-2 px-3 py-1 absolute left-1/2 flex w-[46%] -translate-x-1/2 items-center justify-center">
            <img src="/assets/cursor.svg" alt="" className="size-3 rounded-[3px]" loading="lazy" />
            <span className="text-[0.78rem] truncate font-medium text-ink-600">
              middleware.ts — calder-platform
            </span>
          </div>
          <div className="gap-2 ml-auto flex items-center">
            <span className="size-4 rounded-full bg-ink-200" />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1">
            <div className="flex min-w-0 flex-[1.3] flex-col">
              <div className="flex shrink-0 items-center border-b border-ink-100">
                <span className="flex items-center gap-1.5 border-r border-ink-100 bg-ink-50 px-2.5 py-1.5">
                  <span className="size-2.5 rounded-sm bg-[#307eeb]" />
                  <span className="text-[0.78rem] font-medium text-ink-800">
                    middleware.ts
                  </span>
                  <Icon name="solar:close-circle-linear" className="size-3 text-ink-400" />
                </span>
                <span className="h-2 w-10 rounded bg-ink-100" />
              </div>
              <div className="relative flex min-h-0 flex-1 flex-col py-1">
                <div className="flex min-h-0 flex-1 items-center gap-2 px-2">
                  <span className="w-5 shrink-0 text-right text-[0.7rem] text-ink-300 tabular-nums">
                    72
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="w-3/5 bg-ink-200 block h-2 rounded" />
                  </span>
                </div>
                <div className="flex min-h-0 flex-1 items-center gap-2 px-2">
                  <span className="w-5 shrink-0 text-right text-[0.7rem] text-ink-300 tabular-nums">
                    73
                  </span>
                  <span className="pl-3 min-w-0 flex-1">
                    <span className="w-2/5 bg-ink-200 block h-2 rounded" />
                  </span>
                </div>
                <div className="flex min-h-0 flex-1 items-center gap-2 px-2">
                  <span className="w-5 shrink-0 text-right text-[0.7rem] text-ink-300 tabular-nums">
                    74
                  </span>
                  <span className="pl-3 min-w-0 flex-1">
                    <span className="w-1/2 bg-ink-200 block h-2 rounded" />
                  </span>
                </div>
                <div className="flex min-h-0 flex-1 items-center gap-2 px-2">
                  <span className="w-5 shrink-0 text-right text-[0.7rem] text-ink-300 tabular-nums">
                    75
                  </span>
                  <span className="pl-6 min-w-0 flex-1">
                    <span className="w-1/3 bg-ink-200 block h-2 rounded" />
                  </span>
                </div>
                <div className="bg-[#ffebea] flex min-h-0 flex-1 items-center gap-2 px-2">
                  <span className="w-5 shrink-0 text-right text-[0.7rem] text-ink-300 tabular-nums">
                    76
                  </span>
                  <span className="pl-3 min-w-0 flex-1">
                    <span className="w-2/5 bg-[#cd243c]/25 block h-2 rounded" />
                  </span>
                </div>
                <div className="bg-[#e5ffee] flex min-h-0 flex-1 items-center gap-2 px-2">
                  <span className="w-5 shrink-0 text-right text-[0.7rem] text-ink-300 tabular-nums">
                    77
                  </span>
                  <span className="pl-3 min-w-0 flex-1">
                    <span className="w-1/2 bg-[#028040]/30 block h-2 rounded" />
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 text-[0.7rem] text-ink-500">
                    <span className="rounded-sm bg-white/70 px-2">
                      ⌘Y
                    </span>
                    <span className="rounded-sm bg-white/70 px-2">
                      ⌘N
                    </span>
                  </span>
                </div>
                <div className="flex min-h-0 flex-1 items-center gap-2 px-2">
                  <span className="w-5 shrink-0 text-right text-[0.7rem] text-ink-300 tabular-nums">
                    78
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="w-1/4 bg-ink-200 block h-2 rounded" />
                  </span>
                </div>
                <div className="flex min-h-0 flex-1 items-center gap-2 px-2">
                  <span className="w-5 shrink-0 text-right text-[0.7rem] text-ink-300 tabular-nums">
                    79
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="w-1/2 bg-ink-200 block h-2 rounded" />
                  </span>
                </div>
                <div className="flex min-h-0 flex-1 items-center gap-2 px-2">
                  <span className="w-5 shrink-0 text-right text-[0.7rem] text-ink-300 tabular-nums">
                    80
                  </span>
                  <span className="pl-3 min-w-0 flex-1">
                    <span className="w-2/3 bg-ink-200 block h-2 rounded" />
                  </span>
                </div>
                <div className="absolute top-2 left-6 w-3/5 rounded-md border border-ink-200 bg-white p-2 shadow-xs">
                  <span className="mb-1.5 block h-2 w-5/6 rounded bg-ink-200" />
                  <span className="mb-2 block h-2 w-2/3 rounded bg-ink-200" />
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-1.5 rounded bg-[#307eeb] px-2.5 py-1 text-[0.7rem] font-semibold text-white">
                      <Icon name="solar:check-read-linear" className="size-3" />
                      {" Accept "}
                    </span>
                    <span className="rounded border border-ink-200 px-2.5 py-1 text-[0.7rem] font-medium text-ink-600">
                      Reject
                    </span>
                    <span className="ml-auto text-[0.7rem] text-ink-400">
                      ⌘⏎
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-40 shrink-0 flex-col border-l border-ink-100 bg-ink-50">
              <div className="flex shrink-0 items-center gap-3 border-b border-ink-100 px-2.5 py-1.5">
                <span className="border-b-2 border-ink-900 pb-1 text-[0.78rem] font-bold text-ink-900">
                  CHAT
                </span>
                <span className="pb-1 text-[0.78rem] font-medium text-ink-400">
                  COMPOSER
                </span>
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-2 p-2.5">
                <div className="rounded-md border border-ink-200 bg-white p-2">
                  <span className="mb-1 flex w-fit items-center gap-1.5 rounded bg-ink-100 px-2 py-1">
                    <span className="size-1.5 rounded-sm bg-[#307eeb]" />
                    <span className="text-[0.7rem] font-medium text-ink-700">
                      middleware.ts
                    </span>
                  </span>
                  <span className="block h-2 w-full rounded bg-ink-200" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="w-full h-2 rounded bg-ink-200" />
                  <span className="w-5/6 h-2 rounded bg-ink-200" />
                  <span className="w-3/4 h-2 rounded bg-ink-200" />
                </div>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-ink-200">
                  <div className="flex shrink-0 items-center gap-1.5 border-b border-ink-100 bg-white px-2.5 py-1">
                    <span className="text-[0.7rem] font-medium text-ink-600">
                      middleware.ts
                    </span>
                    <span className="ml-auto text-[0.7rem] font-semibold text-[#307eeb]">
                      Apply
                    </span>
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col justify-evenly bg-white px-2.5 py-1">
                    <span className="h-1.5 w-2/3 rounded bg-ink-100" />
                    <span className="h-1.5 w-1/2 rounded bg-ink-100" />
                    <span className="h-1.5 w-3/4 rounded bg-[#028040]/25" />
                    <span className="h-1.5 w-2/5 rounded bg-ink-100" />
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 rounded-md border border-ink-200 bg-white px-2 py-1.5">
                  <span className="text-[0.78rem] text-ink-400">
                    Ask followup
                  </span>
                  <Icon name="solar:plain-2-bold-duotone" className="ml-auto size-3 text-ink-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  ),
  () => (
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-xs h-full">
        <div className="px-3.5 py-2 relative flex shrink-0 items-center border-b border-ink-200 bg-ink-100">
          <div className="gap-1.5 flex">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="rounded-md border border-ink-200 bg-white gap-2 px-3 py-1 absolute left-1/2 flex w-[46%] -translate-x-1/2 items-center justify-center">
            <Icon name="solar:lock-bold" className="text-ink-400 size-2.5" />
            <img src="/assets/anthropic-claude.svg" alt="" className="size-3 rounded-[3px]" loading="lazy" />
            <span className="text-[0.78rem] truncate font-medium text-ink-600">
              claude.ai
            </span>
          </div>
          <div className="gap-2 ml-auto flex items-center">
            <Icon name="solar:widget-4-linear" className="text-ink-400 size-3" />
            <span className="size-4 rounded-full bg-ink-200" />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1">
            <div className="flex w-32 shrink-0 flex-col gap-1 border-r border-ink-100 bg-[#f8fbff] p-2.5">
              <span className="mb-1.5 flex items-center gap-1.5 rounded-md bg-ink-100 px-2 py-1.5">
                <Icon name="solar:pen-new-square-linear" className="size-3 text-ink-600" />
                <span className="text-[0.78rem] font-medium text-ink-800">
                  New chat
                </span>
              </span>
              <span className="mt-1 mb-0.5 px-2 text-[0.7rem] font-semibold text-ink-400">
                Recents
              </span>
              <span className="w-5/6 bg-ink-300 mx-1 my-1 block h-2 rounded" />
              <span className="w-1/2 bg-ink-200 mx-1 my-1 block h-2 rounded" />
              <span className="w-3/4 bg-ink-200 mx-1 my-1 block h-2 rounded" />
              <span className="w-2/3 bg-ink-200 mx-1 my-1 block h-2 rounded" />
              <span className="mt-auto flex items-center gap-1.5 px-2">
                <span className="size-4 rounded-full bg-ink-200" />
                <span className="h-2 w-10 rounded bg-ink-200" />
              </span>
            </div>
            <div className="flex min-w-0 flex-[1.1] flex-col">
              <div className="flex min-h-0 flex-1 flex-col gap-2.5 px-3.5 py-2.5">
                <div className="ml-auto flex w-3/5 flex-col gap-1.5 rounded-xl bg-ink-100 px-2.5 py-2">
                  <span className="h-2 w-full rounded bg-ink-300" />
                  <span className="h-2 w-2/3 rounded bg-ink-300" />
                </div>
                <div className="flex items-start gap-2">
                  <img src="/assets/anthropic-claude.svg" alt="" className="mt-0.5 size-4 shrink-0" loading="lazy" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="w-full h-2 rounded bg-ink-100" />
                    <span className="w-5/6 h-2 rounded bg-ink-100" />
                    <span className="w-full h-2 rounded bg-ink-100" />
                    <span className="w-3/5 h-2 rounded bg-ink-100" />
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-2 py-1.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-ink-100">
                    <Icon name="solar:document-text-linear" className="size-3.5 text-ink-600" />
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-[0.78rem] font-semibold text-ink-900">
                      Access review
                    </span>
                    <span className="text-[0.7rem] text-ink-500">
                      Document · 4 min read
                    </span>
                  </span>
                  <Icon name="solar:alt-arrow-right-linear" className="ml-auto size-3 text-ink-400" />
                </div>
              </div>
              <div className="shrink-0 px-3.5 pb-3">
                <div className="flex flex-col gap-1.5 rounded-xl border border-ink-200 px-2.5 py-2">
                  <span className="text-[0.78rem] text-ink-400">
                    Reply to Claude…
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Icon name="solar:add-square-linear" className="size-3 text-ink-400" />
                    <span className="flex items-center gap-1 rounded-md border border-ink-200 p-0.5">
                      <span className="rounded bg-white px-1.5 py-0.5 text-[0.7rem] font-medium text-ink-800">
                        Chat
                      </span>
                      <span className="px-1.5 py-0.5 text-[0.7rem] font-medium text-ink-400">
                        Cowork
                      </span>
                    </span>
                    <span className="ml-auto flex items-center gap-1.5">
                      <span className="text-[0.7rem] font-medium text-ink-700">
                        Opus 5
                      </span>
                      <Icon name="solar:microphone-linear" className="size-3 text-ink-400" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-36 shrink-0 flex-col border-l border-ink-100">
              <div className="flex shrink-0 items-center gap-2 border-b border-ink-100 px-2.5 py-1.5">
                <span className="text-[0.78rem] font-bold text-ink-900">
                  Preview
                </span>
                <span className="text-[0.78rem] font-medium text-ink-400">
                  Code
                </span>
                <Icon name="solar:copy-linear" className="ml-auto size-3 text-ink-400" />
                <Icon name="solar:close-circle-linear" className="size-3 text-ink-400" />
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-1.5 px-2.5 py-2.5">
                <span className="mb-0.5 h-2.5 w-24 rounded bg-ink-400" />
                <span className="w-full h-2 rounded bg-ink-100" />
                <span className="w-4/5 h-2 rounded bg-ink-100" />
                <span className="w-full h-2 rounded bg-ink-100" />
                <span className="w-2/3 h-2 rounded bg-ink-100" />
                <div className="mt-1.5 flex min-h-0 flex-1 flex-col gap-1.5 rounded-md border border-ink-200 p-2">
                  <span className="h-1.5 w-2/3 rounded bg-ink-200" />
                  <span className="h-1.5 w-full rounded bg-ink-100" />
                  <span className="h-1.5 w-3/4 rounded bg-ink-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  ),
  () => (
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-xs h-full">
        <div className="px-3.5 py-2 relative flex shrink-0 items-center border-b border-ink-200 bg-ink-100">
          <div className="gap-1.5 flex">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="rounded-md border border-ink-200 bg-white gap-2 px-3 py-1 absolute left-1/2 flex w-[46%] -translate-x-1/2 items-center justify-center">
            <Icon name="solar:lock-bold" className="text-ink-400 size-2.5" />
            <img src="/assets/github.svg" alt="" className="size-3 rounded-[3px]" loading="lazy" />
            <span className="text-[0.78rem] truncate font-medium text-ink-600">
              github.com
            </span>
          </div>
          <div className="gap-2 ml-auto flex items-center">
            <Icon name="solar:widget-4-linear" className="text-ink-400 size-3" />
            <span className="size-4 rounded-full bg-ink-200" />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center gap-1.5 border-b border-ink-100 px-3.5 py-2">
            <img src="/assets/calder.svg" alt="" className="size-3.5 shrink-0 object-contain" loading="lazy" />
            <span className="text-[0.78rem] text-ink-600">
              calder
            </span>
            <span className="text-[0.78rem] text-ink-400">
              /
            </span>
            <span className="text-[0.78rem] font-bold text-ink-900">
              platform
            </span>
            <span className="ml-1 rounded-full border border-ink-200 px-2.5 py-1 text-[0.7rem] font-medium text-ink-500">
              Private
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Icon name="solar:star-linear" className="size-3 text-ink-400" />
              <Icon name="solar:bell-linear" className="size-3 text-ink-400" />
              <span className="size-4 rounded-full bg-teal-soft" />
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col px-3.5 py-2.5">
            <div className="flex shrink-0 items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-32 rounded bg-ink-400" />
                  <span className="text-[0.88rem] font-medium text-ink-400">
                    #482
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1.5 rounded-full bg-[#088946] px-2 py-1 text-[0.7rem] font-semibold text-white">
                    <Icon name="solar:code-linear" className="size-3" />
                    {" Open "}
                  </span>
                  <span className="size-3.5 rounded-full bg-violet-soft" />
                  <span className="text-[0.78rem] font-semibold text-ink-700">
                    claude[bot]
                  </span>
                  <span className="text-[0.78rem] text-ink-500">
                    wants to merge 2 commits
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2.5 flex shrink-0 gap-3 border-b border-ink-100">
              <span className="border-b-2 border-[#fc8c7b] font-bold text-ink-900 pb-1.5 text-[0.78rem]">
                Conversation
              </span>
              <span className="font-medium text-ink-500 pb-1.5 text-[0.78rem]">
                Commits
              </span>
              <span className="font-medium text-ink-500 pb-1.5 text-[0.78rem]">
                Checks
              </span>
              <span className="font-medium text-ink-500 pb-1.5 text-[0.78rem]">
                Files changed
              </span>
            </div>
            <div className="mt-2 flex min-h-0 flex-1 flex-col gap-1.5">
              <div className="flex items-center gap-2 rounded-md border border-ink-200 px-2 py-1.5">
                <Icon name="solar:file-text-linear" className="size-3 shrink-0 text-ink-400" />
                <span className="truncate text-[0.78rem] text-ink-700">
                  src/auth/middleware.ts
                </span>
                <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[0.7rem] tabular-nums">
                  <span className="font-semibold text-[#028040]">
                    +12
                  </span>
                  <span className="font-semibold text-[#cd243c]">
                    −4
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-ink-200 px-2 py-1.5">
                <Icon name="solar:file-text-linear" className="size-3 shrink-0 text-ink-400" />
                <span className="truncate text-[0.78rem] text-ink-700">
                  src/auth/verify.ts
                </span>
                <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[0.7rem] tabular-nums">
                  <span className="font-semibold text-[#028040]">
                    +31
                  </span>
                  <span className="font-semibold text-[#cd243c]">
                    −8
                  </span>
                </span>
              </div>
              <div className="mt-auto flex items-center gap-2 rounded-md border border-ink-200 p-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#088946]">
                  <Icon name="solar:check-read-bold" className="size-3 text-white" />
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-[0.78rem] font-semibold text-ink-900">
                    All checks have passed
                  </span>
                  <span className="text-[0.7rem] text-ink-500">
                    4 successful checks
                  </span>
                </div>
                <span className="ml-auto shrink-0 rounded-md bg-[#088946] px-2 py-1 text-[0.78rem] font-semibold text-white">
                  Merge
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
  ),
  () => (
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-xs h-full">
        <div className="px-3.5 py-2 relative flex shrink-0 items-center border-b border-ink-200 bg-ink-100">
          <div className="gap-1.5 flex">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="rounded-md border border-ink-200 bg-white gap-2 px-3 py-1 absolute left-1/2 flex w-[46%] -translate-x-1/2 items-center justify-center">
            <Icon name="solar:lock-bold" className="text-ink-400 size-2.5" />
            <img src="/assets/openai.svg" alt="" className="size-3 rounded-[3px]" loading="lazy" />
            <span className="text-[0.78rem] truncate font-medium text-ink-600">
              chatgpt.com
            </span>
          </div>
          <div className="gap-2 ml-auto flex items-center">
            <Icon name="solar:widget-4-linear" className="text-ink-400 size-3" />
            <span className="size-4 rounded-full bg-ink-200" />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1">
            <div className="flex w-36 shrink-0 flex-col border-r border-ink-100 bg-ink-50 p-2.5">
              <span className="flex items-center gap-1.5 rounded-md bg-white px-2 py-1.5">
                <Icon name="solar:pen-new-square-linear" className="size-3 text-ink-600" />
                <span className="text-[0.78rem] font-medium text-ink-800">
                  New chat
                </span>
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1">
                <Icon name="solar:magnifer-line-duotone" className="size-3 text-ink-500" />
                <span className="text-[0.78rem] text-ink-700">
                  Search chats
                </span>
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1">
                <Icon name="solar:notebook-linear" className="size-3 text-ink-500" />
                <span className="text-[0.78rem] text-ink-700">
                  Library
                </span>
              </span>
              <span className="mt-2 mb-1.5 px-2 text-[0.7rem] font-semibold text-ink-400">
                Chats
              </span>
              <span className="w-5/6 mx-2 my-1.5 block h-1.5 rounded bg-ink-200" />
              <span className="w-2/3 mx-2 my-1.5 block h-1.5 rounded bg-ink-200" />
              <span className="w-3/4 mx-2 my-1.5 block h-1.5 rounded bg-ink-200" />
              <span className="w-1/2 mx-2 my-1.5 block h-1.5 rounded bg-ink-200" />
              <span className="w-4/5 mx-2 my-1.5 block h-1.5 rounded bg-ink-200" />
              <span className="w-3/5 mx-2 my-1.5 block h-1.5 rounded bg-ink-200" />
              <span className="mt-auto flex items-center gap-1.5 px-2">
                <span className="size-4 rounded-full bg-violet-soft" />
                <span className="h-1.5 w-12 rounded bg-ink-200" />
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex shrink-0 items-center gap-1 px-3.5 py-2">
                <span className="text-[0.88rem] font-semibold text-ink-800">
                  ChatGPT
                </span>
                <Icon name="solar:alt-arrow-down-linear" className="size-2.5 text-ink-400" />
                <Icon name="solar:export-linear" className="ml-auto size-3 text-ink-400" />
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 py-2">
                <div className="ml-auto flex w-2/3 flex-col gap-1.5 rounded-2xl bg-ink-100 px-3 py-2.5">
                  <span className="h-2 w-full rounded bg-ink-300" />
                  <span className="h-2 w-1/2 rounded bg-ink-300" />
                </div>
                <div className="flex items-start gap-2.5">
                  <img src="/assets/openai.svg" alt="" className="mt-0.5 size-5 shrink-0 rounded-full" loading="lazy" />
                  <div className="flex w-full flex-col gap-1.5 pt-1">
                    <span className="h-2 w-full rounded bg-ink-100" />
                    <span className="h-2 w-5/6 rounded bg-ink-100" />
                    <span className="h-2 w-full rounded bg-ink-100" />
                    <span className="h-2 w-2/3 rounded bg-ink-100" />
                  </div>
                </div>
              </div>
              <div className="shrink-0 px-4 pb-3.5">
                <div className="flex items-center gap-2 rounded-full border border-ink-200 px-3.5 py-2">
                  <Icon name="solar:add-square-linear" className="size-3.5 text-ink-400" />
                  <span className="text-[0.88rem] text-ink-400">
                    Ask anything
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <Icon name="solar:microphone-linear" className="size-3.5 text-ink-400" />
                    <Icon name="solar:soundwave-linear" className="size-3.5 text-ink-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  ),
]
