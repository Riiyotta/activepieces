// Static hero mocks for /solutions/* (SPEC_PRODUCT_SOLUTIONS §4.5). Generated verbatim from the
// HERO VISUAL block of specs/source/solutions_<slug>.html (the .visual-stage element). No motion.
import Icon from '../ui/Icon'

export const SOLUTION_HERO_MOCKS = {
  'marketing': (
    <div className="visual-stage flex flex-col overflow-hidden">
      <div className="flex shrink-0 items-baseline gap-3 px-6 py-5">
        <span className="text-[15px] font-semibold text-ink-950">Inbound leads</span>
        <span className="ml-auto text-[12px] text-ink-500 tabular-nums">38 today</span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-4 px-6 sm:grid-cols-[minmax(0,1fr)_8.5rem_3rem] shrink-0 border-y border-ink-950/10 py-3">
        <span className="text-[11px] font-medium tracking-wide text-ink-500 uppercase">Lead</span>
        <span className="hidden text-[11px] font-medium tracking-wide text-ink-500 uppercase sm:block">{" Source "}</span>
        <span className="text-right text-[11px] font-medium tracking-wide text-ink-500 uppercase">{" Fit "}</span>
      </div>
      <div className="flex flex-1 flex-col tpl-divide-y">
        <div className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-4 px-6 sm:grid-cols-[minmax(0,1fr)_8.5rem_3rem] flex-1">
          <span className="truncate text-[14px] text-ink-900">Northaven</span>
          <span className="hidden min-w-0 items-center gap-2.5 sm:flex">
            <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/webflow.svg" width="20" />
            <span className="truncate text-[13px] text-ink-500">Demo form</span>
          </span>
          <span className="flex items-center justify-end gap-2 text-[13px] text-ink-700 tabular-nums">
            <span className="bg-accent-a-500 size-1.5 shrink-0 rounded-full" />
            {" 94"}
          </span>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-4 px-6 sm:grid-cols-[minmax(0,1fr)_8.5rem_3rem] flex-1">
          <span className="truncate text-[14px] text-ink-900">Wren Labs</span>
          <span className="hidden min-w-0 items-center gap-2.5 sm:flex">
            <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/hubspot.svg" width="20" />
            <span className="truncate text-[13px] text-ink-500">Paid search</span>
          </span>
          <span className="flex items-center justify-end gap-2 text-[13px] text-ink-700 tabular-nums">
            <span className="bg-accent-a-500 size-1.5 shrink-0 rounded-full" />
            {" 88"}
          </span>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-4 px-6 sm:grid-cols-[minmax(0,1fr)_8.5rem_3rem] flex-1">
          <span className="truncate text-[14px] text-ink-900">Piera</span>
          <span className="hidden min-w-0 items-center gap-2.5 sm:flex">
            <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/mailchimp.svg" width="20" />
            <span className="truncate text-[13px] text-ink-500">Newsletter</span>
          </span>
          <span className="flex items-center justify-end gap-2 text-[13px] text-ink-700 tabular-nums">
            <span className="bg-accent-b-500 size-1.5 shrink-0 rounded-full" />
            {" 71"}
          </span>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-4 px-6 sm:grid-cols-[minmax(0,1fr)_8.5rem_3rem] flex-1">
          <span className="truncate text-[14px] text-ink-900">Verano Coffee</span>
          <span className="hidden min-w-0 items-center gap-2.5 sm:flex">
            <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/linkedin.svg" width="20" />
            <span className="truncate text-[13px] text-ink-500">Webinar</span>
          </span>
          <span className="flex items-center justify-end gap-2 text-[13px] text-ink-700 tabular-nums">
            <span className="bg-accent-b-500 size-1.5 shrink-0 rounded-full" />
            {" 66"}
          </span>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-4 px-6 sm:grid-cols-[minmax(0,1fr)_8.5rem_3rem] flex-1">
          <span className="truncate text-[14px] text-ink-900">Linden Freight</span>
          <span className="hidden min-w-0 items-center gap-2.5 sm:flex">
            <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/wordpress.svg" width="20" />
            <span className="truncate text-[13px] text-ink-500">Content</span>
          </span>
          <span className="flex items-center justify-end gap-2 text-[13px] text-ink-700 tabular-nums">
            <span className="bg-ink-300 size-1.5 shrink-0 rounded-full" />
            {" 42"}
          </span>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-4 px-6 sm:grid-cols-[minmax(0,1fr)_8.5rem_3rem] flex-1">
          <span className="truncate text-[14px] text-ink-900">{"Marlow & Co"}</span>
          <span className="hidden min-w-0 items-center gap-2.5 sm:flex">
            <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/webflow.svg" width="20" />
            <span className="truncate text-[13px] text-ink-500">Demo form</span>
          </span>
          <span className="flex items-center justify-end gap-2 text-[13px] text-ink-700 tabular-nums">
            <span className="bg-ink-300 size-1.5 shrink-0 rounded-full" />
            {" 38"}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 border-t border-ink-950/10 bg-ink-50/60 px-6 py-4">
        <Icon name="solar:branching-paths-down-linear" className="size-4 shrink-0 text-ink-400" />
        <span className="truncate text-[13px] text-ink-700">Fit over 80 goes to #growth</span>
        <img alt="" className="ml-auto size-5 shrink-0" height="20" src="/logos/pieces/slack.svg" width="20" />
      </div>
    </div>
  ),
  'sales': (
    <div className="visual-stage flex flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-3 px-6 py-5">
        <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/gmail.svg" width="20" />
        <span className="truncate text-[15px] font-semibold text-ink-950">{" Re: Pricing for 40 seats "}</span>
        <span className="ml-auto flex shrink-0 items-center gap-2 text-[12px] text-ink-500">
          <Icon name="solar:stars-linear" className="size-3.5 text-primary-700" />
          {" Drafted "}
        </span>
      </div>
      <div className="shrink-0 tpl-divide-y border-y border-ink-950/10 bg-ink-50/60">
        <div className="flex items-center gap-4 px-6 py-3">
          <span className="w-24 shrink-0 text-[13px] text-ink-500">To</span>
          <span className="min-w-0 truncate text-[13px] text-ink-900">ines@wrenlabs.com</span>
        </div>
        <div className="flex items-center gap-4 px-6 py-3">
          <span className="w-24 shrink-0 text-[13px] text-ink-500">Opportunity</span>
          <span className="min-w-0 truncate text-[13px] text-ink-900">Wren Labs, 40 seats</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3.5 px-6 py-5 text-[14px] text-ink-800">
        <p>Hi Ines,</p>
        <p>{" Thanks for the call. Forty seats lands on Team, which is flat for the first 25 people and $25 each after that. "}</p>
        <p>I have held the security review slot on Thursday. Does 10:00 still work?</p>
        <p>Dana</p>
      </div>
      <div className="flex shrink-0 items-center gap-3 border-t border-ink-950/10 px-6 py-4">
        <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/salesforce.svg" width="20" />
        <span className="truncate text-[13px] text-ink-700">Stage moved to Negotiation</span>
        <span className="ml-auto flex shrink-0 items-center gap-2 text-[12px] text-ink-500">
          <span className="size-1.5 rounded-full bg-accent-a-500" />
          {" Saved "}
        </span>
      </div>
    </div>
  ),
  'customer-support': (
    <div className="visual-stage flex flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-3 px-6 py-5">
        <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/zendesk.svg" width="20" />
        <span className="text-[15px] font-semibold text-ink-950">Ticket #4182</span>
        <span className="ml-auto flex shrink-0 items-center gap-2 text-[12px] text-ink-500">
          <span className="size-1.5 rounded-full bg-accent-b-500" />
          {" Waiting on a person "}
        </span>
      </div>
      <div className="flex shrink-0 gap-8 border-y border-ink-950/10 bg-ink-50/60 px-6 py-4">
        <span className="flex flex-col gap-1">
          <span className="text-[12px] text-ink-500">Priority</span>
          <span className="text-[13px] text-ink-900">High</span>
        </span>
        <span className="flex flex-col gap-1">
          <span className="text-[12px] text-ink-500">Topic</span>
          <span className="text-[13px] text-ink-900">Billing</span>
        </span>
        <span className="flex flex-col gap-1">
          <span className="text-[12px] text-ink-500">Queue</span>
          <span className="text-[13px] text-ink-900">Payments</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-5 px-6 py-5">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] text-ink-500">Piera Kaur, 09:12</span>
          <p className="rounded-xl rounded-tl-sm bg-ink-50 px-4 py-3 text-[14px] text-ink-800">{" We were charged twice on the March invoice. Can you refund the second one? "}</p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-[12px] text-primary-800">
            <Icon name="solar:stars-linear" className="size-3.5" />
            {" Suggested reply "}
          </span>
          <p className="rounded-xl rounded-tl-sm bg-primary-50 px-4 py-3 text-[14px] text-ink-800 ring-1 ring-primary-900/10">{" I can see both charges on the 4 March invoice. The duplicate is on its way back to your card and clears in five working days. "}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 border-t border-ink-950/10 px-6 py-4">
        <Icon name="solar:book-linear" className="size-4 shrink-0 text-ink-400" />
        <span className="truncate text-[13px] text-ink-700">Runbook: duplicate charge</span>
        <img alt="" className="ml-auto size-5 shrink-0" height="20" src="/logos/pieces/notion.svg" width="20" />
      </div>
    </div>
  ),
  'finance': (
    <div className="visual-stage flex flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-4 px-6 py-6">
        <span className="flex items-center gap-2 text-[12px] text-ink-500">
          <Icon name="solar:clock-circle-linear" className="size-3.5 shrink-0" />
          {" Waiting for finance "}
        </span>
        <p className="text-[20px] font-semibold text-ink-950 tabular-nums">Retry $2,480.00</p>
        <div className="flex items-center gap-2.5">
          <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/stripe.svg" width="20" />
          <span className="text-[13px] text-ink-600">Payment failed at 04:12, matched to one invoice</span>
        </div>
      </div>
      <div className="shrink-0 tpl-divide-y border-t border-ink-950/10">
        <div className="flex items-center gap-4 px-6 py-3.5">
          <span className="text-[14px] text-ink-900">Invoice</span>
          <span className="ml-auto shrink-0 text-[13px] text-ink-500">INV-3184</span>
        </div>
        <div className="flex items-center gap-4 px-6 py-3.5">
          <span className="text-[14px] text-ink-900">Vendor</span>
          <span className="ml-auto shrink-0 text-[13px] text-ink-500">Northaven Ltd</span>
        </div>
        <div className="flex items-center gap-4 px-6 py-3.5">
          <span className="text-[14px] text-ink-900">Reason</span>
          <span className="ml-auto shrink-0 text-[13px] text-ink-500">Card declined</span>
        </div>
        <div className="flex items-center gap-4 px-6 py-3.5">
          <span className="text-[14px] text-ink-900">Ledger</span>
          <span className="ml-auto shrink-0 text-[13px] text-ink-500">Xero, March</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 border-t border-ink-950/10 px-6 py-5">
        <span className="rounded-lg bg-ink-900 px-4 py-2.5 text-[14px] font-medium text-white">{" Approve "}</span>
        <span className="rounded-lg border border-ink-950/15 px-4 py-2.5 text-[14px] text-ink-700">{" Reject "}</span>
        <span className="ml-auto text-[12px] text-ink-500">Logged to the run</span>
      </div>
    </div>
  ),
  'hr': (
    <div className="visual-stage flex flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-3 px-6 py-5">
        <span className="size-8 shrink-0 rounded-full bg-primary-200" />
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[15px] font-semibold text-ink-950">Maya Rahal</span>
          <span className="truncate text-[13px] text-ink-500">Support engineer, starts 12 May</span>
        </span>
        <span className="ml-auto shrink-0 text-[12px] text-ink-500 tabular-nums">4 of 6 done</span>
      </div>
      <div className="relative flex flex-1 flex-col border-t border-ink-950/10 px-6 py-4">
        <span aria-hidden="true" className="absolute top-6 bottom-6 left-8 w-px -translate-x-1/2 bg-ink-950/10" />
        <div className="relative flex items-center gap-3.5 pt-2 pb-1">
          <span className="flex size-4 shrink-0 items-center justify-center bg-white">
            <span className="size-1.5 rounded-full bg-ink-950/25" />
          </span>
          <span className="text-[12px] tracking-wide text-ink-500 uppercase">Offer signed</span>
        </div>
        <div className="relative flex flex-1 items-center gap-3.5">
          <span className="flex size-4 shrink-0 items-center justify-center bg-white">
            <Icon name="solar:check-circle-linear" className="size-4 text-accent-a-700" />
          </span>
          <span className="text-ink-900 min-w-0 flex-1 truncate text-[14px]">Provision the accounts</span>
          <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/okta.svg" width="20" />
        </div>
        <div className="relative flex flex-1 items-center gap-3.5">
          <span className="flex size-4 shrink-0 items-center justify-center bg-white">
            <Icon name="solar:check-circle-linear" className="size-4 text-accent-a-700" />
          </span>
          <span className="text-ink-900 min-w-0 flex-1 truncate text-[14px]">Send the welcome pack</span>
          <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/gmail.svg" width="20" />
        </div>
        <div className="relative flex items-center gap-3.5 pt-2 pb-1">
          <span className="flex size-4 shrink-0 items-center justify-center bg-white">
            <span className="size-1.5 rounded-full bg-ink-950/25" />
          </span>
          <span className="text-[12px] tracking-wide text-ink-500 uppercase">Day one</span>
        </div>
        <div className="relative flex flex-1 items-center gap-3.5">
          <span className="flex size-4 shrink-0 items-center justify-center bg-white">
            <Icon name="solar:check-circle-linear" className="size-4 text-accent-a-700" />
          </span>
          <span className="text-ink-900 min-w-0 flex-1 truncate text-[14px]">Book the first-week sessions</span>
          <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/google-calendar.svg" width="20" />
        </div>
        <div className="relative flex flex-1 items-center gap-3.5">
          <span className="flex size-4 shrink-0 items-center justify-center bg-white">
            <Icon name="solar:record-circle-linear" className="size-4 text-ink-300" />
          </span>
          <span className="text-ink-500 min-w-0 flex-1 truncate text-[14px]">Share the handbook</span>
          <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/notion.svg" width="20" />
        </div>
        <div className="relative flex items-center gap-3.5 pt-2 pb-1">
          <span className="flex size-4 shrink-0 items-center justify-center bg-white">
            <span className="size-1.5 rounded-full bg-ink-950/25" />
          </span>
          <span className="text-[12px] tracking-wide text-ink-500 uppercase">Week one</span>
        </div>
        <div className="relative flex flex-1 items-center gap-3.5">
          <span className="flex size-4 shrink-0 items-center justify-center bg-white">
            <Icon name="solar:record-circle-linear" className="size-4 text-ink-300" />
          </span>
          <span className="text-ink-500 min-w-0 flex-1 truncate text-[14px]">Introduce them to the team</span>
          <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/microsoft-teams.svg" width="20" />
        </div>
        <div className="relative flex flex-1 items-center gap-3.5">
          <span className="flex size-4 shrink-0 items-center justify-center bg-white">
            <Icon name="solar:record-circle-linear" className="size-4 text-ink-300" />
          </span>
          <span className="text-ink-500 min-w-0 flex-1 truncate text-[14px]">Schedule the 30-day check-in</span>
          <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/google-calendar.svg" width="20" />
        </div>
      </div>
    </div>
  ),
  'operations': (
    <div className="visual-stage flex flex-col overflow-hidden">
      <div className="flex shrink-0 items-baseline gap-3 px-6 py-5">
        <span className="text-[15px] font-semibold text-ink-950">Runs</span>
        <span className="ml-auto text-[12px] text-ink-500 tabular-nums">1,284 today, 3 failed</span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-4 px-6 sm:grid-cols-[minmax(0,1fr)_5.5rem_4.5rem] shrink-0 border-y border-ink-950/10 py-3">
        <span className="text-[11px] font-medium tracking-wide text-ink-500 uppercase">Flow</span>
        <span className="hidden text-[11px] font-medium tracking-wide text-ink-500 uppercase sm:block">{" Started "}</span>
        <span className="text-right text-[11px] font-medium tracking-wide text-ink-500 uppercase">{" Took "}</span>
      </div>
      <div className="flex flex-1 flex-col tpl-divide-y">
        <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-4 px-6 sm:grid-cols-[minmax(0,1fr)_5.5rem_4.5rem] flex-1">
          <span className="flex min-w-0 items-center gap-3">
            <span className="bg-accent-a-500 size-1.5 shrink-0 rounded-full" />
            <span className="truncate text-[14px] text-ink-900">Order #4482 handoff</span>
          </span>
          <span className="hidden text-[13px] text-ink-500 tabular-nums sm:block">09:41</span>
          <span className="text-right text-[13px] text-ink-700 tabular-nums">1.84s</span>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-4 px-6 sm:grid-cols-[minmax(0,1fr)_5.5rem_4.5rem] flex-1">
          <span className="flex min-w-0 items-center gap-3">
            <span className="bg-accent-b-500 size-1.5 shrink-0 rounded-full" />
            <span className="truncate text-[14px] text-ink-900">Restock the warehouse queue</span>
          </span>
          <span className="hidden text-[13px] text-ink-500 tabular-nums sm:block">09:40</span>
          <span className="text-right text-[13px] text-ink-700 tabular-nums">4.12s</span>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-4 px-6 sm:grid-cols-[minmax(0,1fr)_5.5rem_4.5rem] flex-1">
          <span className="flex min-w-0 items-center gap-3">
            <span className="bg-accent-a-500 size-1.5 shrink-0 rounded-full" />
            <span className="truncate text-[14px] text-ink-900">Carrier webhook</span>
          </span>
          <span className="hidden text-[13px] text-ink-500 tabular-nums sm:block">09:38</span>
          <span className="text-right text-[13px] text-ink-700 tabular-nums">0.62s</span>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-4 px-6 sm:grid-cols-[minmax(0,1fr)_5.5rem_4.5rem] flex-1">
          <span className="flex min-w-0 items-center gap-3">
            <span className="bg-accent-c-300 size-1.5 shrink-0 rounded-full" />
            <span className="truncate text-[14px] text-ink-900">Refund #2210</span>
          </span>
          <span className="hidden text-[13px] text-ink-500 tabular-nums sm:block">09:35</span>
          <span className="text-right text-[13px] text-ink-700 tabular-nums">2.07s</span>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-4 px-6 sm:grid-cols-[minmax(0,1fr)_5.5rem_4.5rem] flex-1">
          <span className="flex min-w-0 items-center gap-3">
            <span className="bg-accent-a-500 size-1.5 shrink-0 rounded-full" />
            <span className="truncate text-[14px] text-ink-900">Nightly stock sync</span>
          </span>
          <span className="hidden text-[13px] text-ink-500 tabular-nums sm:block">09:30</span>
          <span className="text-right text-[13px] text-ink-700 tabular-nums">38.4s</span>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-4 px-6 sm:grid-cols-[minmax(0,1fr)_5.5rem_4.5rem] flex-1">
          <span className="flex min-w-0 items-center gap-3">
            <span className="bg-accent-a-500 size-1.5 shrink-0 rounded-full" />
            <span className="truncate text-[14px] text-ink-900">Supplier price import</span>
          </span>
          <span className="hidden text-[13px] text-ink-500 tabular-nums sm:block">09:28</span>
          <span className="text-right text-[13px] text-ink-700 tabular-nums">6.90s</span>
        </div>
      </div>
    </div>
  ),
  'engineering': (
    <div className="visual-stage flex flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-2.5 px-6 py-5">
        <Icon name="solar:code-square-linear" className="size-4 shrink-0 text-ink-500" />
        <span className="text-[15px] font-semibold text-ink-950">Code step</span>
        <span className="ml-auto font-mono text-[12px] text-ink-500">TypeScript</span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 border-y border-ink-950/10 px-6 py-5 font-mono text-[13px] leading-6 whitespace-pre">
        <p>
          <span className="code-key">export const</span>
          <span className="code-fn">{" code "}</span>
          <span className="code-text">{"= "}</span>
          <span className="code-key">async</span>
          <span className="code-text">{" ({ repo, token }) => {"}</span>
        </p>
        <p>
          <span className="code-text" />
          <span className="code-key">const</span>
          <span className="code-text">{" res = "}</span>
          <span className="code-key">await</span>
          <span className="code-fn">{" fetch"}</span>
          <span className="code-text">(</span>
          <span className="code-str">{"`https://api.github.com/repos/${repo}/pulls`"}</span>
          <span className="code-text">{", {"}</span>
        </p>
        <p>
          <span className="code-text">{" headers: { authorization: "}</span>
          <span className="code-str">{"`Bearer ${token}`"}</span>
          <span className="code-text">{" },"}</span>
        </p>
        <p>
          <span className="code-text">{" })"}</span>
        </p>
        <p>
          <span className="code-dim">{" // one open PR per reviewer"}</span>
        </p>
        <p>
          <span className="code-text" />
          <span className="code-key">return</span>
          <span className="code-text">{" ("}</span>
          <span className="code-key">await</span>
          <span className="code-text">{" res."}</span>
          <span className="code-fn">json</span>
          <span className="code-text">()).</span>
          <span className="code-fn">length</span>
        </p>
        <p>
          <span className="code-text">{"}"}</span>
        </p>
      </div>
      <div className="shrink-0 tpl-divide-y">
        <div className="flex items-center gap-3 px-6 py-3.5">
          <Icon name="solar:text-field-linear" className="size-4 shrink-0 text-ink-400" />
          <span className="font-mono text-[13px] text-ink-900">repo</span>
          <span className="ml-auto shrink-0 text-[13px] text-ink-500">calder/platform</span>
        </div>
        <div className="flex items-center gap-3 px-6 py-3.5">
          <Icon name="solar:lock-linear" className="size-4 shrink-0 text-ink-400" />
          <span className="font-mono text-[13px] text-ink-900">token</span>
          <span className="ml-auto shrink-0 text-[13px] text-ink-500">Connected secret</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 border-t border-ink-950/10 bg-ink-50/60 px-6 py-4">
        <Icon name="solar:shield-check-linear" className="size-4 shrink-0 text-ink-400" />
        <span className="text-[13px] text-ink-700">Runs in a sandbox, npm packages allowed</span>
      </div>
    </div>
  ),
  'it': (
    <div className="visual-stage flex flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-3 px-6 py-5">
        <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/okta.svg" width="20" />
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[15px] font-semibold text-ink-950">Noor Haddad</span>
          <span className="truncate text-[13px] text-ink-500">Added to the Engineering group</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col tpl-divide-y border-y border-ink-950/10">
        <div className="flex flex-1 items-center gap-3.5 px-6">
          <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/github.svg" width="20" />
          <span className="w-28 shrink-0 truncate text-[14px] text-ink-900">GitHub</span>
          <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">platform, write</span>
          <Icon name="solar:check-circle-linear" className="size-4 shrink-0 text-accent-a-700" />
        </div>
        <div className="flex flex-1 items-center gap-3.5 px-6">
          <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/google-drive.svg" width="20" />
          <span className="w-28 shrink-0 truncate text-[14px] text-ink-900">Google Drive</span>
          <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">Engineering drive</span>
          <Icon name="solar:check-circle-linear" className="size-4 shrink-0 text-accent-a-700" />
        </div>
        <div className="flex flex-1 items-center gap-3.5 px-6">
          <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/slack.svg" width="20" />
          <span className="w-28 shrink-0 truncate text-[14px] text-ink-900">Slack</span>
          <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">Member, 4 channels</span>
          <Icon name="solar:check-circle-linear" className="size-4 shrink-0 text-accent-a-700" />
        </div>
        <div className="flex flex-1 items-center gap-3.5 px-6">
          <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/linear.svg" width="20" />
          <span className="w-28 shrink-0 truncate text-[14px] text-ink-900">Linear</span>
          <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">Member</span>
          <Icon name="solar:check-circle-linear" className="size-4 shrink-0 text-accent-a-700" />
        </div>
        <div className="flex flex-1 items-center gap-3.5 px-6">
          <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/datadog.svg" width="20" />
          <span className="w-28 shrink-0 truncate text-[14px] text-ink-900">Datadog</span>
          <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">Read only</span>
          <Icon name="solar:record-circle-linear" className="size-4 shrink-0 text-ink-300" />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 px-6 py-4">
        <Icon name="solar:document-text-linear" className="size-4 shrink-0 text-ink-400" />
        <span className="text-[13px] text-ink-700">Written to the audit log</span>
        <span className="ml-auto text-[12px] text-ink-500 tabular-nums">09:04</span>
      </div>
    </div>
  ),
  'internal-tools': (
    <div className="visual-stage flex flex-col overflow-hidden">
      <div className="flex shrink-0 items-baseline gap-3 px-6 py-5">
        <span className="text-[15px] font-semibold text-ink-950">Vendor request</span>
        <span className="ml-auto text-[12px] text-ink-500">Anyone at Calder</span>
      </div>
      <div className="flex shrink-0 items-center gap-3 border-y border-ink-950/10 bg-ink-50/60 px-6 py-3.5">
        <Icon name="solar:link-linear" className="size-4 shrink-0 text-ink-400" />
        <span className="min-w-0 truncate font-mono text-[13px] text-ink-600">{" forms.activepieces.com/vendor "}</span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3.5 px-6 py-4">
        <label className="flex flex-col gap-2">
          <span className="text-[12px] text-ink-500">Request type</span>
          <span className="flex items-center rounded-lg border border-ink-950/10 bg-white px-3 py-2.5 text-[14px] text-ink-900">
            {" New vendor "}
            <Icon name="solar:alt-arrow-down-linear" className="ml-auto size-4 text-ink-950/30" />
          </span>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[12px] text-ink-500">Yearly spend</span>
          <span className="flex items-center gap-2 rounded-lg border border-ink-950/10 bg-white px-3 py-2.5 text-[14px] text-ink-900 tabular-nums">
            <span className="text-ink-400">$</span>
            {" 14,000 "}
          </span>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[12px] text-ink-500">What it is for</span>
          <span className="rounded-lg border border-ink-950/10 bg-white px-3 pt-2.5 pb-6 text-[14px] text-ink-900">{" Error tracking for the billing service. "}</span>
        </label>
      </div>
      <div className="flex shrink-0 items-center gap-3 border-t border-ink-950/10 px-6 py-4">
        <span className="rounded-lg bg-ink-900 px-4 py-2.5 text-[14px] font-medium text-white">{" Submit request "}</span>
        <span className="text-[12px] text-ink-500">Writes a row and pings the owner</span>
      </div>
    </div>
  ),
  'open-source-developers': (
    <div className="visual-stage flex flex-col overflow-hidden">
      <div className="relative flex shrink-0 items-center gap-2 border-b border-ink-950/10 px-6 py-4">
        <span className="size-2.5 rounded-full bg-ink-950/10" />
        <span className="size-2.5 rounded-full bg-ink-950/10" />
        <span className="size-2.5 rounded-full bg-ink-950/10" />
        <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-[12px] text-ink-500">{" ~/activepieces "}</span>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-6 py-5 font-mono text-[13px] leading-6">
        <p className="whitespace-pre">
          <span className="code-key">{"$ "}</span>
          <span className="code-text">npm run create-piece</span>
        </p>
        <p className="whitespace-pre">
          <span className="code-dim">{"? Piece name "}</span>
          <span className="code-str">wren-api</span>
        </p>
        <span aria-hidden="true" className="h-[0.85em]" />
        <div className="grid grid-cols-[1.25rem_9rem_minmax(0,1fr)]">
          <span className="code-key">+</span>
          <span className="code-text">src/index.ts</span>
          <span className="code-dim">piece definition</span>
        </div>
        <div className="grid grid-cols-[1.25rem_9rem_minmax(0,1fr)]">
          <span className="code-key">+</span>
          <span className="code-text">src/actions</span>
          <span className="code-dim">2 actions</span>
        </div>
        <div className="grid grid-cols-[1.25rem_9rem_minmax(0,1fr)]">
          <span className="code-key">+</span>
          <span className="code-text">src/triggers</span>
          <span className="code-dim">1 polling trigger</span>
        </div>
        <span aria-hidden="true" className="h-[0.85em]" />
        <p className="whitespace-pre">
          <span className="code-key">{"$ "}</span>
          <span className="code-text">npm start</span>
        </p>
        <p className="whitespace-pre">
          <span className="code-dim">{" server "}</span>
          <span className="code-fn">http://localhost:4200</span>
        </p>
        <p className="whitespace-pre">
          <span className="code-key">{"$ "}</span>
          <span aria-hidden="true" className="inline-block h-[0.9em] w-[1.5px] translate-y-[0.1em] bg-ink-500" />
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3 border-t border-ink-950/10 px-6 py-4">
        <span className="text-[13px] text-ink-700">MIT core, no credit system</span>
        <span className="ml-auto text-[12px] text-ink-500">Releases every Monday</span>
      </div>
    </div>
  ),
}
