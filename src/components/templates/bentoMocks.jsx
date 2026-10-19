// Bento mock library for the product/solution templates (SPEC_PRODUCT_SOLUTIONS §6.2).
// Generated verbatim from specs/source/_bento-mocks.html: each entry is the sheet body (plus any
// overlay sibling) that goes inside BentoCard's Frame; `mode` is the frame mode the mock always uses.
import Icon from '../ui/Icon'

export const MOCKS = {
  sendMessageConfig: {
    mode: 'center',
    body: (
      <>
        <div className="flex items-center gap-2.5 px-6 py-5">
          <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/slack.svg" width="20" />
          <span className="text-[15px] font-semibold text-ink-950">Send message</span>
        </div>
        <div className="tpl-divide-y border-t border-ink-950/10">
          <div className="flex items-center gap-3 px-6 py-4">
            <Icon name="solar:lock-linear" className="size-4 shrink-0 text-ink-400" />
            <span className="shrink-0 text-[14px] text-ink-900">Workspace</span>
            <span className="text-ink-500 ml-auto min-w-0 truncate text-[13px]">calder-eu</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <Icon name="solar:lock-linear" className="size-4 shrink-0 text-ink-400" />
            <span className="shrink-0 text-[14px] text-ink-900">Channel</span>
            <span className="text-ink-500 ml-auto min-w-0 truncate text-[13px]">#billing-alerts</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <Icon name="solar:stars-linear" className="size-4 shrink-0 text-primary-700" />
            <span className="shrink-0 text-[14px] text-ink-900">Message</span>
            <span className="text-primary-800 ml-auto min-w-0 truncate text-[13px]">The agent writes this</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <Icon name="solar:shield-linear" className="size-4 shrink-0 text-ink-400" />
            <span className="text-[14px] text-ink-900">Max steps</span>
            <span className="ml-auto text-[13px] text-ink-500 tabular-nums">20 per run</span>
          </div>
        </div>
      </>
    ),
  },
  aiProviders: {
    mode: 'center',
    body: (
      <>
        <div className="flex items-center gap-2.5 px-6 py-5">
          <Icon name="solar:stars-linear" className="size-4 shrink-0 text-ink-400" />
          <span className="text-[15px] font-semibold text-ink-950">AI providers</span>
        </div>
        <div className="tpl-divide-y border-t border-ink-950/10">
          <div className="flex items-center gap-3 px-6 py-4">
            <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/openai.svg" width="20" />
            <span className="truncate text-[14px] text-ink-900">OpenAI</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/anthropic-claude.svg" width="20" />
            <span className="truncate text-[14px] text-ink-900">Anthropic</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/google-gemini.svg" width="20" />
            <span className="truncate text-[14px] text-ink-900">Google Gemini</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/azure-openai.svg" width="20" />
            <span className="truncate text-[14px] text-ink-900">Azure OpenAI</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/aws-bedrock.svg" width="20" />
            <span className="truncate text-[14px] text-ink-900">AWS Bedrock</span>
          </div>
        </div>
      </>
    ),
  },
  mcpServer: {
    mode: 'float',
    body: (
      <>
        <div className="flex items-baseline gap-3 px-6 pt-6 pb-4">
          <span className="text-[18px] font-semibold text-ink-950">MCP server</span>
          <span className="ml-auto flex shrink-0 items-center gap-2 text-[14px] text-ink-500">
            <span className="size-1.5 rounded-full bg-accent-a-500" />
            {" Live "}
          </span>
        </div>
        <div className="flex items-center gap-4 bg-ink-900/4 px-6 py-3.5">
          <span className="flex size-8 shrink-0 items-center justify-center">
            <Icon name="solar:link-minimalistic-2-linear" className="size-5 text-ink-950/30" />
          </span>
          <span className="min-w-0 flex-1 truncate font-mono text-[15px] text-ink-600">{" mcp.activepieces.com/v1 "}</span>
        </div>
        <div className="flex flex-col px-6 pt-3 pb-6">
          <div className="flex items-center gap-4 py-3">
            <span className="flex size-8 shrink-0 items-center justify-center">
              <img alt="" aria-hidden="true" className="size-6" decoding="async" height="24" loading="lazy" src="/logos/pieces/stripe.svg" width="24" />
            </span>
            <span className="min-w-0 flex-1 truncate font-mono text-[15px] text-ink-900">create_invoice</span>
          </div>
          <div className="flex items-center gap-4 py-3">
            <span className="flex size-8 shrink-0 items-center justify-center">
              <img alt="" aria-hidden="true" className="size-6" decoding="async" height="24" loading="lazy" src="/logos/pieces/hubspot.svg" width="24" />
            </span>
            <span className="min-w-0 flex-1 truncate font-mono text-[15px] text-ink-900">find_customer</span>
          </div>
          <div className="flex items-center gap-4 py-3">
            <span className="flex size-8 shrink-0 items-center justify-center">
              <img alt="" aria-hidden="true" className="size-6" decoding="async" height="24" loading="lazy" src="/logos/pieces/slack.svg" width="24" />
            </span>
            <span className="min-w-0 flex-1 truncate font-mono text-[15px] text-ink-900">post_message</span>
          </div>
        </div>
      </>
    ),
  },
  approvalRefund: {
    mode: 'wide',
    body: (
      <>
        <div className="flex flex-col gap-5 px-9 py-8">
          <span className="flex items-center gap-2 text-[12px] text-ink-500">
            <Icon name="solar:clock-circle-linear" className="size-3.5 shrink-0" />
            {" Waiting for approval "}
          </span>
          <div className="flex flex-col gap-2">
            <p className="text-[20px] font-semibold text-ink-950">Refund $2,480.00 to Northaven</p>
            <p className="max-w-[48ch] text-[13px] text-ink-600">{" Duplicate charge picked up by the refund flow. Nothing moves until someone signs off. "}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="rounded-lg border border-ink-950/10 bg-ink-950 px-4 py-2 text-[13px] font-medium text-white">{" Approve "}</span>
            <span className="rounded-lg border border-ink-950/10 bg-ink-50 px-4 py-2 text-[13px] font-medium text-ink-800">{" Reject "}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 border-t border-ink-950/10 px-9 py-4">
          <span className="size-6 shrink-0 rounded-full bg-ink-200" />
          <span className="text-[12px] text-ink-500">Refund flow · step 3 of 6 · 4m ago</span>
        </div>
        <div className="border-t border-ink-950/10 px-9 pt-5">
          <p className="pb-1 text-[11px] text-ink-500 uppercase">Earlier today</p>
          <div className="tpl-divide-y">
            <div className="flex items-center gap-3 py-3.5">
              <Icon name="solar:check-circle-linear" className="size-4 shrink-0 text-accent-a-700" />
              <span className="text-[13px] text-ink-800">Refund $180.00 to Piera</span>
              <span className="ml-auto text-[12px] text-ink-500">Dana</span>
            </div>
            <div className="flex items-center gap-3 py-3.5">
              <Icon name="solar:check-circle-linear" className="size-4 shrink-0 text-accent-a-700" />
              <span className="text-[13px] text-ink-800">Discount 20% for Wren Labs</span>
              <span className="ml-auto text-[12px] text-ink-500">Sam</span>
            </div>
            <div className="flex items-center gap-3 py-3.5">
              <Icon name="solar:check-circle-linear" className="size-4 shrink-0 text-accent-a-700" />
              <span className="text-[13px] text-ink-800">Refund $940.00 to Verano</span>
              <span className="ml-auto text-[12px] text-ink-500">Dana</span>
            </div>
          </div>
        </div>
        <div className="absolute -top-5 right-8 w-[38%] max-w-[262px] min-w-[220px]">
          <div className="overflow-hidden rounded-xl bg-ink-50 ring-1 ring-ink-950/10">
            <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
              <Icon name="solar:tuning-linear" className="size-4 shrink-0 text-ink-400" />
              <span className="text-[14px] font-medium text-ink-950">Approval rule</span>
            </div>
            <div className="tpl-divide-y border-t border-ink-950/10">
              <div className="flex items-center justify-between gap-4 px-4 py-2.5">
                <span className="text-[13px] text-ink-600">Amount over</span>
                <span className="text-[13px] text-ink-900 tabular-nums">$1,000</span>
              </div>
              <div className="flex items-center justify-between gap-4 px-4 py-2.5">
                <span className="text-[13px] text-ink-600">Approver</span>
                <span className="text-[13px] text-ink-900 tabular-nums">Finance</span>
              </div>
              <div className="flex items-center justify-between gap-4 px-4 py-2.5">
                <span className="text-[13px] text-ink-600">Times out in</span>
                <span className="text-[13px] text-ink-900 tabular-nums">24h</span>
              </div>
            </div>
          </div>
        </div>
      </>
    ),
  },
  runResume: {
    mode: 'crop-left',
    body: (
      <>
        <div className="flex items-baseline gap-3 pt-6 pr-8 pb-3 pl-36">
          <span className="text-[18px] font-semibold text-ink-950">Run #48,213</span>
          <span className="ml-auto shrink-0 text-[14px] text-ink-500 tabular-nums">2.44s</span>
        </div>
        <div className="flex flex-col pr-8 pl-36">
          <div className="flex items-center gap-4 py-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center">
              <img alt="" aria-hidden="true" className="size-7" decoding="async" height="28" loading="lazy" src="/logos/pieces/stripe.svg" width="28" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[16px] text-ink-900">Charge in Stripe</span>
            <Icon name="solar:check-circle-linear" className="size-5 shrink-0 text-accent-a-700" />
            <span className="w-12 shrink-0 text-right text-[15px] text-ink-500 tabular-nums">1.20s</span>
          </div>
          <div className="flex items-center gap-4 py-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center">
              <img alt="" aria-hidden="true" className="size-7" decoding="async" height="28" loading="lazy" src="/logos/pieces/gmail.svg" width="28" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[16px] text-ink-900">Send the receipt</span>
            <Icon name="solar:check-circle-linear" className="size-5 shrink-0 text-accent-a-700" />
            <span className="w-12 shrink-0 text-right text-[15px] text-ink-500 tabular-nums">0.38s</span>
          </div>
          <div className="flex items-center gap-3 py-5">
            <span className="h-px flex-1 border-t border-dashed border-accent-c-200" />
            <span className="shrink-0 text-[15px] text-ink-700">Resumed from checkpoint</span>
            <span className="h-px flex-1 border-t border-dashed border-accent-c-200" />
          </div>
          <div className="flex items-center gap-4 py-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center">
              <img alt="" aria-hidden="true" className="size-7" decoding="async" height="28" loading="lazy" src="/logos/pieces/google-sheets.svg" width="28" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[16px] text-ink-900">Append to revenue sheet</span>
            <Icon name="solar:check-circle-linear" className="size-5 shrink-0 text-accent-a-700" />
            <span className="w-12 shrink-0 text-right text-[15px] text-ink-500 tabular-nums">0.21s</span>
          </div>
          <div className="flex items-center gap-4 py-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center">
              <img alt="" aria-hidden="true" className="size-7" decoding="async" height="28" loading="lazy" src="/logos/pieces/slack.svg" width="28" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[16px] text-ink-900">Notify the account owner</span>
            <Icon name="solar:check-circle-linear" className="size-5 shrink-0 text-accent-a-700" />
            <span className="w-12 shrink-0 text-right text-[15px] text-ink-500 tabular-nums">0.12s</span>
          </div>
          <div className="flex items-center gap-4 py-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center">
              <img alt="" aria-hidden="true" className="size-7" decoding="async" height="28" loading="lazy" src="/logos/pieces/zendesk.svg" width="28" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[16px] text-ink-900">Close the ticket</span>
            <Icon name="solar:check-circle-linear" className="size-5 shrink-0 text-accent-a-700" />
            <span className="w-12 shrink-0 text-right text-[15px] text-ink-500 tabular-nums">0.09s</span>
          </div>
        </div>
      </>
    ),
  },
  codeSendQuote: {
    mode: 'center',
    body: (
      <>
        <div className="relative flex shrink-0 items-center gap-2 border-b border-ink-950/10 px-5 py-3.5">
          <span className="bg-ink-950/10 size-2.5 rounded-full" />
          <span className="bg-ink-950/10 size-2.5 rounded-full" />
          <span className="bg-ink-950/10 size-2.5 rounded-full" />
          <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-[12px] text-ink-500">send-quote.ts</span>
        </div>
        <div className="flex flex-col px-5 py-5">
          <p className="font-mono text-[13px] whitespace-pre code-text" style={{ paddingLeft: "0rem" }}>
            <span className="code-key">export const</span>
            <span>{" quote = "}</span>
            <span className="code-fn">createAction</span>
            <span>{"({"}</span>
          </p>
          <p className="font-mono text-[13px] whitespace-pre code-text" style={{ paddingLeft: "0.9rem" }}>
            <span>{"name: "}</span>
            <span className="code-str">{"'send_quote'"}</span>
            <span>,</span>
          </p>
          <p className="font-mono text-[13px] whitespace-pre code-text" style={{ paddingLeft: "0.9rem" }}>
            <span>{"props: { amount, email },"}</span>
          </p>
          <p className="font-mono text-[13px] whitespace-pre code-text" style={{ paddingLeft: "0.9rem" }}>
            <span className="code-key">{"async "}</span>
            <span className="code-fn">run</span>
            <span>{"(ctx) {"}</span>
          </p>
          <p className="font-mono text-[13px] whitespace-pre code-text" style={{ paddingLeft: "1.8rem" }}>
            <span className="code-key">{"return "}</span>
            <span className="code-fn">billing</span>
            <span>.send(ctx)</span>
          </p>
          <p className="font-mono text-[13px] whitespace-pre code-text" style={{ paddingLeft: "0.9rem" }}>
            <span>{"},"}</span>
          </p>
          <p className="font-mono text-[13px] whitespace-pre code-text" style={{ paddingLeft: "0rem" }}>
            <span>{"})"}</span>
          </p>
        </div>
      </>
    ),
  },
  refundForm: {
    mode: 'center',
    body: (
      <>
        <div className="flex items-baseline gap-3 px-6 py-5">
          <span className="text-[15px] font-semibold text-ink-950">Refund request</span>
          <span className="ml-auto text-[12px] text-ink-500">Waiting for a person</span>
        </div>
        <div className="flex flex-col gap-4 border-t border-ink-950/10 px-6 py-5">
          <label className="flex flex-col gap-2">
            <span className="text-[12px] text-ink-500">What went wrong</span>
            <span className="rounded-lg border border-ink-950/10 bg-ink-50 px-3 pt-2.5 pb-6 text-[14px] text-ink-900">{" Charged twice on the March invoice. "}</span>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[12px] text-ink-500">Receipt</span>
            <span className="flex items-center gap-2 rounded-lg border border-dashed border-ink-950/20 px-3 py-2.5 text-[14px] text-ink-700">
              <Icon name="solar:file-text-linear" className="size-4 shrink-0 text-ink-400" />
              {" invoice-3184.pdf "}
            </span>
          </label>
        </div>
      </>
    ),
  },
  terminalCompose: {
    mode: 'center',
    body: (
      <>
        <div className="relative flex shrink-0 items-center gap-2 border-b border-ink-950/10 px-5 py-3.5">
          <span className="bg-ink-950/10 size-2.5 rounded-full" />
          <span className="bg-ink-950/10 size-2.5 rounded-full" />
          <span className="bg-ink-950/10 size-2.5 rounded-full" />
          <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-[12px] text-ink-500">bash</span>
        </div>
        <div className="flex flex-col px-6 py-5 font-mono text-[13px]">
          <p className="whitespace-pre">
            <span className="code-fn">~/activepieces</span>
            <span className="code-key">{" $ "}</span>
            <span className="code-text">docker compose up</span>
          </p>
          <span aria-hidden="true" className="h-[0.85em]" />
          <div className="grid grid-cols-[1.1rem_5.5rem_minmax(0,1fr)]">
            <span className="code-key">✓</span>
            <span className="code-dim">postgres</span>
            <span className="code-text">ready</span>
          </div>
          <div className="grid grid-cols-[1.1rem_5.5rem_minmax(0,1fr)]">
            <span className="code-key">✓</span>
            <span className="code-dim">workers</span>
            <span className="code-text">online</span>
          </div>
          <div className="grid grid-cols-[1.1rem_5.5rem_minmax(0,1fr)]">
            <span className="code-key">✓</span>
            <span className="code-dim">pieces</span>
            <span className="code-text">750 loaded</span>
          </div>
          <span aria-hidden="true" className="h-[0.85em]" />
          <div className="grid grid-cols-[1.1rem_5.5rem_minmax(0,1fr)]">
            <span className="code-key">{"->"}</span>
            <span className="code-dim">local</span>
            <span className="code-fn">http://localhost:8080</span>
          </div>
          <span aria-hidden="true" className="h-[0.85em]" />
          <p className="flex items-center whitespace-pre">
            <span className="code-key">{"$ "}</span>
            <span aria-hidden="true" className="inline-block h-[1.15em] w-[0.5em] bg-ink-300" />
          </p>
        </div>
      </>
    ),
  },
  chatThreadBerlin: {
    mode: 'center',
    body: (
      <>
        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex flex-col items-end gap-2">
            <span className="max-w-[85%] rounded-2xl rounded-tr-md bg-ink-950 px-4 py-3 text-[14px] text-white">How did the Berlin store do last week?</span>
          </div>
          <span className="flex items-center gap-1.5 text-[12px] text-ink-500">
            <Icon name="solar:stars-linear" className="size-3.5 shrink-0" />
            {" Flow ran 4 steps "}
          </span>
          <div className="flex flex-col gap-2 self-start">
            <p className="text-[14px] font-semibold text-ink-950">Berlin, week 14</p>
            <p className="text-[14px] text-ink-800">{" Revenue landed at €48,210, up 7.4% on the week before. "}</p>
          </div>
          <div className="mt-1 flex items-center gap-3 rounded-full border border-ink-950/10 bg-ink-50 px-4 py-3">
            <Icon name="solar:add-linear" className="size-4 shrink-0 text-ink-400" />
            <span className="text-[13px] text-ink-500">Ask for something else</span>
            <span className="ml-auto flex size-7 items-center justify-center rounded-full bg-ink-950">
              <Icon name="solar:plain-linear" className="size-3.5 text-white" />
            </span>
          </div>
        </div>
      </>
    ),
  },
  chatShareSettings: {
    mode: 'center',
    body: (
      <>
        <div className="flex items-center gap-3 px-6 py-5">
          <span className="text-[15px] font-semibold text-ink-950">Store Desk</span>
          <span className="ml-auto flex items-center gap-2 text-[12px] text-ink-500">
            <span className="size-1.5 rounded-full bg-accent-a-500" />
            {" Published "}
          </span>
        </div>
        <div className="flex items-center gap-3 border-t border-ink-950/10 bg-ink-50/60 px-6 py-4">
          <Icon name="solar:share-linear" className="size-4 shrink-0 text-ink-400" />
          <span className="min-w-0 truncate text-[13px] text-ink-700">{" chat.activepieces.com/s/store-desk "}</span>
        </div>
        <div className="tpl-divide-y border-t border-ink-950/10">
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="text-[14px] text-ink-900">Who can open it</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500">Anyone with the link</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="text-[14px] text-ink-900">Bot name</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500">Store Desk</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="text-[14px] text-ink-900">Draft version</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500">Stays private</span>
          </div>
        </div>
      </>
    ),
  },
  chatFile: {
    mode: 'center',
    body: (
      <>
        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex flex-col items-end gap-2">
            <span className="max-w-[85%] rounded-2xl rounded-tr-md bg-ink-950 px-4 py-3 text-[14px] text-white">Pull the numbers out of this for finance.</span>
            <span className="flex items-center gap-2 rounded-lg border border-ink-950/10 bg-ink-50 px-3 py-2 text-[13px] text-ink-700">
              <Icon name="solar:document-linear" className="size-4 shrink-0 text-ink-400" />
              {" march-invoices.csv "}
            </span>
          </div>
          <div className="flex flex-col gap-2 self-start">
            <p className="text-[14px] font-semibold text-ink-950">Berlin, week 14</p>
            <p className="text-[14px] text-ink-800">{" Revenue landed at €48,210, up 7.4% on the week before. "}</p>
            <span className="mt-1 flex w-fit items-center gap-2 rounded-lg border border-ink-950/10 bg-ink-50 px-3 py-2 text-[13px] text-ink-800">
              <Icon name="solar:file-text-linear" className="size-4 shrink-0 text-accent-c-500" />
              {" march-summary.pdf "}
            </span>
          </div>
        </div>
      </>
    ),
  },
  routerTable: {
    mode: 'wide',
    body: (
      <>
        <div className="flex items-baseline gap-3 px-6 py-5">
          <span className="text-[15px] font-semibold text-ink-950">Route the run</span>
          <span className="ml-auto text-[12px] text-ink-500">First match</span>
        </div>
        <div className="tpl-divide-y border-t border-ink-950/10">
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="bg-accent-a-500 size-1.5 shrink-0 rounded-full" />
            <span className="w-28 shrink-0 truncate text-[14px] text-ink-900">Enterprise</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">{"seats > 200"}</span>
            <span className="hidden shrink-0 items-center gap-2.5 sm:flex">
              <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/slack.svg" width="20" />
              <span className="truncate text-[13px] text-ink-700">Alert the account owner</span>
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="bg-accent-a-500 size-1.5 shrink-0 rounded-full" />
            <span className="w-28 shrink-0 truncate text-[14px] text-ink-900">Business</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">{"seats > 50"}</span>
            <span className="hidden shrink-0 items-center gap-2.5 sm:flex">
              <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/hubspot.svg" width="20" />
              <span className="truncate text-[13px] text-ink-700">Queue a check-in</span>
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="bg-accent-a-500 size-1.5 shrink-0 rounded-full" />
            <span className="w-28 shrink-0 truncate text-[14px] text-ink-900">Trialing</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">trial ends in 3</span>
            <span className="hidden shrink-0 items-center gap-2.5 sm:flex">
              <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/calendly.svg" width="20" />
              <span className="truncate text-[13px] text-ink-700">Book an onboarding call</span>
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="bg-accent-a-500 size-1.5 shrink-0 rounded-full" />
            <span className="w-28 shrink-0 truncate text-[14px] text-ink-900">Churn risk</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">usage down 40%</span>
            <span className="hidden shrink-0 items-center gap-2.5 sm:flex">
              <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/linear.svg" width="20" />
              <span className="truncate text-[13px] text-ink-700">Open a save task</span>
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="bg-accent-a-500 size-1.5 shrink-0 rounded-full" />
            <span className="w-28 shrink-0 truncate text-[14px] text-ink-900">Self-serve</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">plan is Free</span>
            <span className="hidden shrink-0 items-center gap-2.5 sm:flex">
              <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/gmail.svg" width="20" />
              <span className="truncate text-[13px] text-ink-700">Send the upgrade nudge</span>
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="bg-accent-a-500 size-1.5 shrink-0 rounded-full" />
            <span className="w-28 shrink-0 truncate text-[14px] text-ink-900">Past due</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">invoice unpaid</span>
            <span className="hidden shrink-0 items-center gap-2.5 sm:flex">
              <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/stripe.svg" width="20" />
              <span className="truncate text-[13px] text-ink-700">Retry the charge</span>
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="bg-ink-300 size-1.5 shrink-0 rounded-full" />
            <span className="w-28 shrink-0 truncate text-[14px] text-ink-900">Otherwise</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">nothing matched</span>
            <span className="hidden shrink-0 items-center gap-2.5 sm:flex">
              <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/google-sheets.svg" width="20" />
              <span className="truncate text-[13px] text-ink-700">Log it and carry on</span>
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <Icon name="solar:undo-left-linear" className="size-4 shrink-0 text-ink-400" />
            <span className="text-[14px] text-ink-900">Loop on items</span>
            <span className="ml-auto text-[13px] text-ink-500">Repeats every step above</span>
          </div>
        </div>
      </>
    ),
  },
  chatLimits: {
    mode: 'center',
    body: (
      <>
        <div className="flex items-center gap-2.5 px-6 py-5">
          <Icon name="solar:clock-circle-linear" className="size-4 shrink-0 text-ink-400" />
          <span className="text-[15px] font-semibold text-ink-950">Chat limits</span>
        </div>
        <div className="tpl-divide-y border-t border-ink-950/10">
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">Reply timeout</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">30s</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">File, cloud</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">10 MB</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">File, self-hosted</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">25 MB</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">Run history</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">30 days</span>
          </div>
        </div>
      </>
    ),
  },
  projectMembers: {
    mode: 'wide',
    body: (
      <>
        <div className="flex items-baseline gap-3 px-6 py-5">
          <span className="text-[15px] font-semibold text-ink-950">Marketing project</span>
          <span className="text-[12px] text-ink-500 tabular-nums">6 members</span>
        </div>
        <div className="tpl-divide-y border-t border-ink-950/10">
          <div className="flex items-center gap-3.5 px-6 py-4">
            <span className="bg-primary-200 size-8 shrink-0 rounded-full" />
            <span className="truncate text-[14px] text-ink-900">Dana Rowe</span>
            <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[13px] text-ink-600">
              {"Admin "}
              <Icon name="solar:alt-arrow-down-linear" className="size-3.5 text-ink-950/30" />
            </span>
          </div>
          <div className="flex items-center gap-3.5 px-6 py-4">
            <span className="bg-accent-a-200 size-8 shrink-0 rounded-full" />
            <span className="truncate text-[14px] text-ink-900">Sam Okafor</span>
            <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[13px] text-ink-600">
              {"Editor "}
              <Icon name="solar:alt-arrow-down-linear" className="size-3.5 text-ink-950/30" />
            </span>
          </div>
          <div className="flex items-center gap-3.5 px-6 py-4">
            <span className="bg-accent-b-200 size-8 shrink-0 rounded-full" />
            <span className="truncate text-[14px] text-ink-900">Ines Kaur</span>
            <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[13px] text-ink-600">
              {"Viewer "}
              <Icon name="solar:alt-arrow-down-linear" className="size-3.5 text-ink-950/30" />
            </span>
          </div>
          <div className="flex items-center gap-3.5 px-6 py-4">
            <span className="bg-accent-c-200 size-8 shrink-0 rounded-full" />
            <span className="truncate text-[14px] text-ink-900">Milo Tran</span>
            <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[13px] text-ink-600">
              {"Viewer "}
              <Icon name="solar:alt-arrow-down-linear" className="size-3.5 text-ink-950/30" />
            </span>
          </div>
          <div className="flex items-center gap-3.5 px-6 py-4">
            <span className="bg-ink-200 size-8 shrink-0 rounded-full" />
            <span className="truncate text-[14px] text-ink-900">Ari Bloom</span>
            <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[13px] text-ink-600">
              {"Editor "}
              <Icon name="solar:alt-arrow-down-linear" className="size-3.5 text-ink-950/30" />
            </span>
          </div>
          <div className="flex items-center gap-3.5 px-6 py-4">
            <span className="bg-ink-200 size-8 shrink-0 rounded-full" />
            <span className="truncate text-[14px] text-ink-900">Noor Haddad</span>
            <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[13px] text-ink-600">
              {"Viewer "}
              <Icon name="solar:alt-arrow-down-linear" className="size-3.5 text-ink-950/30" />
            </span>
          </div>
        </div>
        <div className="absolute top-[38%] right-10 w-[36%] max-w-[170px] min-w-[140px]">
          <div className="flex flex-col rounded-xl bg-ink-50 p-1.5 ring-1 ring-ink-950/10">
            <span className="text-ink-700 flex items-center gap-2 rounded-lg px-3 py-2 text-[13px]">{"Admin "}</span>
            <span className="bg-ink-900/5 text-ink-950 flex items-center gap-2 rounded-lg px-3 py-2 text-[13px]">
              {"Editor "}
              <Icon name="solar:check-circle-linear" className="ml-auto size-3.5 text-accent-a-700" />
            </span>
            <span className="text-ink-700 flex items-center gap-2 rounded-lg px-3 py-2 text-[13px]">{"Viewer "}</span>
          </div>
        </div>
      </>
    ),
  },
  typedFields: {
    mode: 'center',
    body: (
      <>
        <div className="flex items-center gap-2.5 px-6 py-5">
          <Icon name="solar:database-linear" className="size-4 shrink-0 text-ink-400" />
          <span className="text-[15px] font-semibold text-ink-950">Accounts</span>
        </div>
        <div className="tpl-divide-y border-t border-ink-950/10">
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">Company</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">Text</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">MRR</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">Number</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">Renews</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">Date</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">Stage</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">Single-select</span>
          </div>
        </div>
      </>
    ),
  },
  customersTable: {
    mode: 'crop',
    body: (
      <>
        <div className="flex items-baseline gap-3 py-5 pr-36 pl-8">
          <span className="text-[18px] font-semibold text-ink-950">Customers</span>
          <span className="ml-auto shrink-0 text-[14px] text-ink-500 tabular-nums">1,284 rows</span>
        </div>
        <div className="tpl-divide-y tpl-divide-8 border-t border-ink-950/8">
          <div className="grid grid-cols-[minmax(0,1fr)_7rem_5rem] items-center gap-4 pr-36 pl-8 py-5">
            <span className="truncate text-[16px] text-ink-900">Verano Coffee</span>
            <span className="flex items-center gap-2.5 text-[15px] text-ink-600">
              <span className="bg-accent-a-500 size-2 shrink-0 rounded-full" />
              {" Active"}
            </span>
            <span className="text-right text-[16px] text-ink-900 tabular-nums">$6,400</span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_7rem_5rem] items-center gap-4 pr-36 pl-8 py-5">
            <span className="truncate text-[16px] text-ink-900">Piera</span>
            <span className="flex items-center gap-2.5 text-[15px] text-ink-600">
              <span className="bg-accent-b-500 size-2 shrink-0 rounded-full" />
              {" Trial"}
            </span>
            <span className="text-right text-[16px] text-ink-900 tabular-nums">$2,800</span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_7rem_5rem] items-center gap-4 pr-36 pl-8 py-5">
            <span className="truncate text-[16px] text-ink-900">Wren Labs</span>
            <span className="flex items-center gap-2.5 text-[15px] text-ink-600">
              <span className="bg-accent-a-500 size-2 shrink-0 rounded-full" />
              {" Active"}
            </span>
            <span className="text-right text-[16px] text-ink-900 tabular-nums">$5,100</span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_7rem_5rem] items-center gap-4 pr-36 pl-8 py-5">
            <span className="truncate text-[16px] text-ink-900">Northaven</span>
            <span className="flex items-center gap-2.5 text-[15px] text-ink-600">
              <span className="bg-accent-a-500 size-2 shrink-0 rounded-full" />
              {" Active"}
            </span>
            <span className="text-right text-[16px] text-ink-900 tabular-nums">$9,750</span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_7rem_5rem] items-center gap-4 pr-36 pl-8 py-5">
            <span className="truncate text-[16px] text-ink-900">Halcyon Press</span>
            <span className="flex items-center gap-2.5 text-[15px] text-ink-600">
              <span className="bg-accent-b-500 size-2 shrink-0 rounded-full" />
              {" Trial"}
            </span>
            <span className="text-right text-[16px] text-ink-900 tabular-nums">$1,900</span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_7rem_5rem] items-center gap-4 pr-36 pl-8 py-5">
            <span className="truncate text-[16px] text-ink-900">Linden Freight</span>
            <span className="flex items-center gap-2.5 text-[15px] text-ink-600">
              <span className="bg-accent-a-500 size-2 shrink-0 rounded-full" />
              {" Active"}
            </span>
            <span className="text-right text-[16px] text-ink-900 tabular-nums">$8,300</span>
          </div>
        </div>
      </>
    ),
  },
  tablesPieceOps: {
    mode: 'center',
    body: (
      <>
        <div className="flex items-center gap-2.5 px-6 py-5">
          <Icon name="solar:layers-linear" className="size-4 shrink-0 text-ink-400" />
          <span className="text-[15px] font-semibold text-ink-950">Tables piece</span>
        </div>
        <div className="tpl-divide-y border-t border-ink-950/10">
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">create_records</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">find_records</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">update_record</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">delete_record</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">download_table</span>
          </div>
        </div>
      </>
    ),
  },
  tableTriggers: {
    mode: 'wide',
    body: (
      <>
        <div className="flex items-baseline gap-3 px-6 py-5">
          <span className="text-[15px] font-semibold text-ink-950">Accounts</span>
          <span className="ml-auto text-[12px] text-ink-500">3 triggers armed</span>
        </div>
        <div className="tpl-divide-y border-t border-ink-950/10">
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="bg-accent-a-500 size-1.5 shrink-0 rounded-full" />
            <span className="w-32 shrink-0 truncate text-[14px] text-ink-900">Record created</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">Northaven</span>
            <span className="flex shrink-0 items-center gap-2.5">
              <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/gmail.svg" width="20" />
              <span className="truncate text-[13px] text-ink-700">Send the welcome pack</span>
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="bg-accent-b-500 size-1.5 shrink-0 rounded-full" />
            <span className="w-32 shrink-0 truncate text-[14px] text-ink-900">Record updated</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">Piera</span>
            <span className="flex shrink-0 items-center gap-2.5">
              <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/slack.svg" width="20" />
              <span className="truncate text-[13px] text-ink-700">Post to #revenue</span>
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="bg-accent-a-500 size-1.5 shrink-0 rounded-full" />
            <span className="w-32 shrink-0 truncate text-[14px] text-ink-900">Record created</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">Wren Labs</span>
            <span className="flex shrink-0 items-center gap-2.5">
              <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/hubspot.svg" width="20" />
              <span className="truncate text-[13px] text-ink-700">Create the CRM company</span>
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="bg-accent-b-500 size-1.5 shrink-0 rounded-full" />
            <span className="w-32 shrink-0 truncate text-[14px] text-ink-900">Record updated</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">Verano Coffee</span>
            <span className="flex shrink-0 items-center gap-2.5">
              <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/google-sheets.svg" width="20" />
              <span className="truncate text-[13px] text-ink-700">Sync the renewal date</span>
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="bg-accent-c-200 size-1.5 shrink-0 rounded-full" />
            <span className="w-32 shrink-0 truncate text-[14px] text-ink-900">Record deleted</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">Linden Freight</span>
            <span className="flex shrink-0 items-center gap-2.5">
              <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/notion.svg" width="20" />
              <span className="truncate text-[13px] text-ink-700">Archive the account</span>
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="bg-accent-b-500 size-1.5 shrink-0 rounded-full" />
            <span className="w-32 shrink-0 truncate text-[14px] text-ink-900">Record updated</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">Halcyon Press</span>
            <span className="flex shrink-0 items-center gap-2.5">
              <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/stripe.svg" width="20" />
              <span className="truncate text-[13px] text-ink-700">Retry the invoice</span>
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="bg-accent-a-500 size-1.5 shrink-0 rounded-full" />
            <span className="w-32 shrink-0 truncate text-[14px] text-ink-900">Record created</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">{"Marlow & Co"}</span>
            <span className="flex shrink-0 items-center gap-2.5">
              <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/linear.svg" width="20" />
              <span className="truncate text-[13px] text-ink-700">Open an onboarding task</span>
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <span className="bg-accent-b-500 size-1.5 shrink-0 rounded-full" />
            <span className="w-32 shrink-0 truncate text-[14px] text-ink-900">Record updated</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">Piera</span>
            <span className="flex shrink-0 items-center gap-2.5">
              <img alt="" className="size-5 shrink-0" height="20" src="/logos/pieces/slack.svg" width="20" />
              <span className="truncate text-[13px] text-ink-700">Notify the owner</span>
            </span>
          </div>
        </div>
      </>
    ),
  },
  triggerTypes: {
    mode: 'center',
    body: (
      <>
        <div className="flex items-center gap-2.5 px-6 py-5">
          <Icon name="solar:bolt-linear" className="size-4 shrink-0 text-ink-400" />
          <span className="text-[15px] font-semibold text-ink-950">Trigger types</span>
        </div>
        <div className="tpl-divide-y border-t border-ink-950/10">
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">Webhook</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">Instant</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">App event</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">Instant</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">Polling</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">Scheduled</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">Schedule</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">Cron</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">Manual run</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">On demand</span>
          </div>
        </div>
      </>
    ),
  },
  testStepStripe: {
    mode: 'crop',
    body: (
      <>
        <div className="flex items-center gap-3 pt-6 pr-36 pb-5 pl-6">
          <img alt="" className="size-7 shrink-0" decoding="async" height="28" loading="lazy" src="/logos/pieces/stripe.svg" width="28" />
          <span className="truncate text-[18px] font-semibold text-ink-950">Charge in Stripe</span>
        </div>
        <div className="flex flex-col gap-4 border-t border-ink-950/10 pt-5 pr-36 pb-6 pl-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-[14px] text-ink-500">Amount</span>
            <span className="flex h-11 items-center rounded-lg bg-white px-3.5 font-mono text-[15px] text-ink-900 ring-1 ring-ink-950/10">4200</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[14px] text-ink-500">Currency</span>
            <span className="flex h-11 items-center rounded-lg bg-white px-3.5 font-mono text-[15px] text-ink-900 ring-1 ring-ink-950/10">eur</span>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-ink-950/10 bg-ink-900/5 py-5 pr-36 pl-6">
          <span className="size-1.5 shrink-0 rounded-full bg-accent-a-500" />
          <span className="text-[16px] text-ink-900">Succeeded in 0.42s</span>
        </div>
        <div className="tpl-divide-y border-t border-ink-950/10">
          <div className="flex items-baseline gap-6 py-4 pr-36 pl-6">
            <span className="shrink-0 font-mono text-[15px] text-ink-500">id</span>
            <span className="ml-auto truncate font-mono text-[15px] text-ink-900">ch_3PmQ8f</span>
          </div>
          <div className="flex items-baseline gap-6 py-4 pr-36 pl-6">
            <span className="shrink-0 font-mono text-[15px] text-ink-500">status</span>
            <span className="ml-auto truncate font-mono text-[15px] text-ink-900">succeeded</span>
          </div>
          <div className="flex items-baseline gap-6 py-4 pr-36 pl-6">
            <span className="shrink-0 font-mono text-[15px] text-ink-500">customer</span>
            <span className="ml-auto truncate font-mono text-[15px] text-ink-900">cus_QK41nd</span>
          </div>
          <div className="flex items-baseline gap-6 py-4 pr-36 pl-6">
            <span className="shrink-0 font-mono text-[15px] text-ink-500">receipt</span>
            <span className="ml-auto truncate font-mono text-[15px] text-ink-900">stripe.com/r/8f21</span>
          </div>
        </div>
      </>
    ),
  },
  versionHistory: {
    mode: 'center',
    body: (
      <>
        <div className="flex items-center gap-2.5 px-6 py-5">
          <Icon name="solar:clock-circle-linear" className="size-4 shrink-0 text-ink-400" />
          <span className="text-[15px] font-semibold text-ink-950">Version history</span>
        </div>
        <div className="tpl-divide-y border-t border-ink-950/10">
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">v13 · Draft</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">Editing</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">v12 · Published</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">Live</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">v11 · Published</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">Locked</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <span className="truncate text-[14px] text-ink-900">v10 · Published</span>
            <span className="ml-auto shrink-0 text-[13px] text-ink-500 tabular-nums">Locked</span>
          </div>
        </div>
      </>
    ),
  },
}
