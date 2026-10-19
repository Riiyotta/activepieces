import Icon from '../ui/Icon'
import { BentoCard, BentoSection } from '../BentoPlatformCard'

// /embed bento "What the SDK gives you." (SPEC_MARKETING §6.B). Reuses the homepage bento section/card
// (BentoPlatformCard.jsx: same 24-col grid, art presets and frame modes); 8 new cells, markup from the
// embed SSR HTML. Static. Art: /panel/clouds|meadow.webp are the same files as the presets' /assets/*.

const PIECE = (slug) => `/logos/pieces/${slug}.svg`

// [indent, [text, class][]]
const TOKEN_LINES = [
  [0, [['const', 'code-key'], [' token = ', 'code-text'], ['jwt.sign', 'code-fn'], ['({', 'code-text']]],
  [1, [['externalUserId', 'code-dim'], [': ', 'code-text'], ["'usr_8412'", 'code-str'], [',', 'code-text']]],
  [1, [['externalProjectId', 'code-dim'], [': ', 'code-text'], ["'calder'", 'code-str'], [',', 'code-text']]],
  [1, [['role', 'code-dim'], [': ', 'code-text'], ["'EDITOR'", 'code-str'], [',', 'code-text']]],
  [1, [['pieceSet', 'code-dim'], [': ', 'code-text'], ["'premium'", 'code-str'], [',', 'code-text']]],
  [0, [['}, ', 'code-text'], ['privateKey', 'code-dim'], [')', 'code-text']]],
]

const STEPS = [
  ['stripe', 'New payment', 'Trigger'],
  ['hubspot', 'Find the customer', 'Action'],
  ['slack', 'Post to #revenue', 'Action'],
]

const FLAGS = [
  ['hideSidebar', 'Your navigation stays the only one', true],
  ['hideFolders', 'No folder tree for your customers', true],
  ['hideFlowName', 'You title the page yourself', true],
  ['hideGlobalSearch', 'Command palette off', true],
  ['hideTables', 'Keep the tables interface', false],
]

const WEIGHTS = [
  ['Regular', 'font-normal'],
  ['Medium', 'font-medium'],
  ['Semibold', 'font-semibold'],
]

const APPS = [
  ['slack', true],
  ['google-sheets', true],
  ['hubspot', true],
  ['gmail', true],
  ['stripe', false],
  ['notion', false],
]

const LIMITS = [
  ['31,204', 'of 50,000', 'Tasks this month', '62%'],
  ['164', 'of 250', 'AI credits', '66%'],
  ['18', 'of 25', 'Concurrent runs', '72%'],
]

const TOOLS = ['refund_payment', 'post_message']

export default function EmbedBento() {
  return (
    <BentoSection section="embed-grid" title="What the SDK gives you.">
      {/* 1. Sign Them In Once: sheet with chrome + file label */}
      <BentoCard span={12} title="Sign Them In Once" desc="Your backend signs a token, and the account exists." art="clouds" position="50% 26%" mode="center">
        <div className="relative flex shrink-0 items-center gap-2 border-b border-ink-950/10 px-5 py-3.5">
          <span className="size-2.5 rounded-full bg-ink-950/10" />
          <span className="size-2.5 rounded-full bg-ink-950/10" />
          <span className="size-2.5 rounded-full bg-ink-950/10" />
          <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-[12px] text-ink-500">your-backend.ts</span>
        </div>
        <div className="flex flex-col gap-1 px-6 py-6 font-mono text-[13px] leading-relaxed">
          {TOKEN_LINES.map(([indent, parts], i) => (
            <p key={i} style={{ paddingLeft: `${indent * 1.5}rem` }}>
              {parts.map(([text, cls], j) => (
                <span key={j} className={cls}>
                  {text}
                </span>
              ))}
            </p>
          ))}
        </div>
      </BentoCard>

      {/* 2. The Builder In Your Page */}
      <BentoCard span={12} title="The Builder In Your Page" desc="One configure() call and the builder appears." art="meadow" position="50% 62%" mode="crop">
        <div className="flex items-center gap-3 py-5 pr-32 pl-6">
          <img src="/logos/calder.svg" alt="" className="size-5 shrink-0 object-contain" />
          <span className="text-[15px] font-semibold text-ink-950">Calder</span>
          <span className="text-[13px] text-ink-500">Automations</span>
        </div>
        <div className="border-t border-ink-950/10 py-6 pr-32 pl-6">
          <div className="flex flex-col">
            {STEPS.map(([logo, name, kind], i) => (
              <div key={name} className="contents">
                {i > 0 && <span aria-hidden="true" className="ml-6 h-6 w-px border-l border-ink-950/15" />}
                <div className="flex items-center gap-3.5 rounded-xl border border-ink-950/10 bg-white px-4 py-4">
                  <img src={PIECE(logo)} alt="" className="size-8 shrink-0" />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-[14px] text-ink-900">{name}</span>
                    <span className="text-[12px] text-ink-500">{kind}</span>
                  </span>
                  <Icon name="solar:menu-dots-linear" className="ml-auto size-4 shrink-0 text-ink-950/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </BentoCard>

      {/* 3. Accounts Already Connected */}
      <BentoCard span={9} title="Accounts Already Connected" desc="Connect their accounts for them, or let them." art="iris" position="50% 100%" mode="float">
        <div className="flex items-center gap-3.5 px-6 pt-6 pb-5">
          <img src={PIECE('google-sheets')} alt="" className="size-9 shrink-0" />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-[15px] font-semibold text-ink-950">Google Sheets</span>
            <span className="text-[12px] text-ink-500">Requested by Calder</span>
          </span>
        </div>
        <div className="flex flex-col gap-4 border-t border-ink-950/10 px-6 py-6">
          <span className="flex flex-col gap-2">
            <span className="text-[13px] text-ink-600">Connection name</span>
            <span className="rounded-lg border border-ink-950/10 bg-white px-3.5 py-3">
              <span className="text-[14px] text-ink-900">Calder sheets</span>
            </span>
          </span>
          <span className="flex items-center gap-2.5">
            <span className="flex-1 rounded-lg border border-ink-950/10 bg-ink-950 px-4 py-2.5 text-center text-[13px] font-medium text-white"> Connect </span>
            <span className="rounded-lg border border-ink-950/10 bg-ink-50 px-4 py-2.5 text-[13px] font-medium text-ink-800"> Cancel </span>
          </span>
        </div>
      </BentoCard>

      {/* 4. Hide What You Don't Need */}
      <BentoCard span={15} title="Hide What You Don't Need" desc="Sidebar, folders, search, import and export." art="water" position="50% 30%" mode="wide">
        <div className="flex items-baseline gap-3 px-6 py-5">
          <span className="text-[15px] font-semibold text-ink-950">Embedding</span>
          <span className="ml-auto text-[13px] text-ink-500 tabular-nums">4 of 5 on</span>
        </div>
        <div className="divide-y divide-ink-950/10 border-t border-ink-950/10">
          {FLAGS.map(([key, note, on]) => (
            <div key={key} className="flex items-center gap-4 px-6 py-4">
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate font-mono text-[13px] text-ink-900">{key}</span>
                <span className="truncate text-[12px] text-ink-500">{note}</span>
              </span>
              <span
                className={`${on ? 'justify-end bg-ink-950' : 'justify-start bg-ink-950/15'} ml-auto flex h-6 w-10 shrink-0 items-center rounded-full px-0.5`}
              >
                <span className="size-5 rounded-full bg-white" />
              </span>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* 5. Your Domain, Your Font */}
      <BentoCard span={15} title="Your Domain, Your Font" desc="Your own subdomain and font, light or dark." art="clouds" position="50% 58%" mode="crop-left">
        <div className="py-5 pr-7 pl-32">
          <span className="flex w-full items-center gap-2.5 rounded-lg border border-ink-950/10 bg-white px-3.5 py-2.5">
            <Icon name="solar:lock-linear" className="size-3.5 shrink-0 text-accent-a-700" />
            <span className="font-mono text-[13px] text-ink-700">flows.calder.com</span>
          </span>
        </div>
        <div className="border-t border-ink-950/10 py-6 pr-7 pl-32">
          <span className="text-[12px] text-ink-500">Interface font</span>
          <p className="mt-2 text-[15px] font-semibold text-ink-950">Söhne</p>
          <div className="mt-5 flex flex-col gap-4">
            {WEIGHTS.map(([label, weight]) => (
              <div key={label} className="flex items-baseline gap-4">
                <span className="w-20 shrink-0 text-[12px] text-ink-500">{label}</span>
                <span className={`${weight} truncate text-[14px] text-ink-900`}> Automations </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-ink-950/10 py-4 pr-7 pl-32">
          <span className="size-4 shrink-0 rounded-md bg-accent-d-600" />
          <span className="text-[13px] text-ink-600">Accent</span>
          <span className="ml-auto font-mono text-[13px] text-ink-500 tabular-nums">#7F22FE</span>
        </div>
      </BentoCard>

      {/* 6. Only The Apps You Sell */}
      <BentoCard span={9} title="Only The Apps You Sell" desc="Build one list of integrations and reuse it." art="water" position="50% 16%" mode="float">
        <div className="flex items-baseline gap-3 px-6 pt-6 pb-5">
          <span className="text-[15px] font-semibold text-ink-950">premium</span>
          <span className="ml-auto text-[13px] text-ink-500 tabular-nums">4 of 6</span>
        </div>
        <div className="grid grid-cols-3 gap-3 border-t border-ink-950/10 px-6 py-6">
          {APPS.map(([slug, on]) => (
            <span
              key={slug}
              className={`${on ? 'border-ink-950/10 bg-white' : 'border-ink-950/5 bg-ink-50'} relative flex items-center justify-center rounded-xl border py-5`}
            >
              <img src={PIECE(slug)} alt="" className={`${on ? '' : 'opacity-25 grayscale '}size-8`} />
              {on && <Icon name="solar:check-circle-linear" className="absolute top-2 right-2 size-4 text-accent-a-700" />}
            </span>
          ))}
        </div>
      </BentoCard>

      {/* 7. Limits Per Customer */}
      <BentoCard span={12} title="Limits Per Customer" desc="Set each customer's task and credit ceiling." art="meadow" position="22% 34%" mode="wide">
        <div className="flex items-baseline gap-3 px-9 py-6">
          <span className="text-[15px] font-semibold text-ink-950">Calder</span>
          <span className="ml-auto text-[13px] text-ink-500">Set by your token</span>
        </div>
        <div className="flex flex-col gap-8 border-t border-ink-950/10 px-9 py-8">
          {LIMITS.map(([used, cap, label, pct]) => (
            <div key={label} className="flex flex-col gap-3">
              <span className="flex items-baseline gap-2">
                <span className="text-[28px] leading-none font-semibold text-ink-950 tabular-nums">{used}</span>
                <span className="text-[13px] text-ink-500 tabular-nums">{cap}</span>
                <span className="ml-auto text-[13px] text-ink-600">{label}</span>
              </span>
              <span className="h-2 rounded-full bg-ink-950/8">
                <span className="block h-2 rounded-full bg-primary-700" style={{ width: pct }} />
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 border-t border-ink-950/10 px-9 py-5">
          <span className="text-[13px] text-ink-600">Shared pool</span>
          <span className="ml-auto font-mono text-[13px] text-ink-500">calder-pro</span>
        </div>
      </BentoCard>

      {/* 8. Ready For Their AI */}
      <BentoCard span={12} title="Ready For Their AI" desc="An assistant can run their automations." art="clouds" position="50% 12%" mode="center">
        <div className="flex flex-col gap-5 px-6 py-6">
          <div className="flex items-start gap-3">
            <span className="size-7 shrink-0 rounded-full bg-ink-200" />
            <span className="pt-1 text-[14px] text-ink-900"> Refund the duplicate charge on Northaven and tell the account owner. </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink-950">
              <Icon name="solar:stars-linear" className="size-3.5 text-white" />
            </span>
            <span className="flex min-w-0 flex-col gap-3 pt-1">
              <span className="text-[14px] text-ink-900">Done. Refunded and posted the note.</span>
              <span className="flex flex-col divide-y divide-ink-950/10 rounded-xl border border-ink-950/10">
                {TOOLS.map((t) => (
                  <span key={t} className="flex items-center gap-3 px-4 py-3">
                    <Icon name="solar:check-circle-linear" className="size-4 shrink-0 text-accent-a-700" />
                    <span className="truncate font-mono text-[13px] text-ink-700">{t}</span>
                  </span>
                ))}
              </span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-ink-950/10 px-6 py-4">
          <span className="size-1.5 shrink-0 rounded-full bg-accent-a-500" />
          <span className="text-[12px] text-ink-500">Calder project only</span>
        </div>
      </BentoCard>
    </BentoSection>
  )
}
