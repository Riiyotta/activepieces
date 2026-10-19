import './BentoSecond.css'
import Icon from './ui/Icon'
import { BentoCard, BentoSection, Dot, TwoLine } from './BentoPlatformCard'

// L. Bento: "One workspace your team and your agents share." (CLONE_SPEC §H/L). Static, no motion.

const CHAT_STEPS = [
  ['hubspot', 'Deal closed in HubSpot'],
  ['solar:database-linear', 'Add a row to Revenue'],
  ['slack', 'Post to #wins in Slack'],
  ['gmail', 'Email the account owner'],
]

const TOOLS = [
  ['stripe', 'create_invoice'],
  ['hubspot', 'find_customer'],
  ['slack', 'post_message'],
]

const CUSTOMERS = [
  ['Verano Coffee', true, '$6,400'],
  ['Piera', false, '$2,800'],
  ['Wren Labs', true, '$5,100'],
  ['Northaven', true, '$9,750'],
  ['Halcyon Press', false, '$1,900'],
  ['Linden Freight', true, '$8,300'],
]

const DOCS = [
  ['Refund policy', 'Policies · updated Aug 28'],
  ['Enterprise order form', 'Legal · updated Jul 14'],
  ['Support escalation ladder', 'Runbooks · updated Aug 02'],
]

export default function BentoSecond() {
  return (
    <BentoSection section="workspace" title="One workspace your team and your agents share.">
      {/* Chat */}
      <BentoCard span={12} title="Chat" desc="Say what you want in plain words and it gets built." art="water" position="50% 16%" mode="wide">
        <div className="flex flex-col gap-5 px-8 pt-7 pb-6">
          <div className="flex justify-end">
            <p className="max-w-[86%] rounded-2xl bg-ink-900/5 px-5 py-4 text-[16px] text-ink-900">
              When a deal closes in HubSpot, add a row to Revenue and post it in #wins
            </p>
          </div>
          <p className="text-[16px] text-ink-700">Here is the flow I built.</p>
        </div>
        <div className="flex flex-col px-8">
          {CHAT_STEPS.map(([logo, label]) => (
            <div key={label} className="flex items-center gap-4 py-3">
              <span className="flex size-10 shrink-0 items-center justify-center">
                {logo.startsWith('solar:') ? (
                  <Icon name={logo} className="size-6 text-ink-500" />
                ) : (
                  <img src={`/assets/${logo}.svg`} alt="" aria-hidden="true" className="size-7" width="28" height="28" loading="lazy" decoding="async" />
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-[16px] text-ink-900">{label}</span>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* MCP Server */}
      <BentoCard span={12} title="MCP Server" desc="Claude and Cursor can run what you built." art="clouds" position="50% 26%" mode="float">
        <div className="flex items-baseline gap-3 px-6 pt-6 pb-4">
          <span className="text-[18px] font-semibold text-ink-950">MCP server</span>
          <span className="ml-auto flex shrink-0 items-center gap-2 text-[14px] text-ink-500">
            <Dot />
            Live
          </span>
        </div>
        <div className="flex items-center gap-4 bg-ink-900/4 px-6 py-3.5">
          <span className="flex size-8 shrink-0 items-center justify-center">
            <Icon name="solar:link-minimalistic-2-linear" className="size-5 text-ink-950/30" />
          </span>
          <span className="min-w-0 flex-1 truncate font-mono text-[15px] text-ink-600">mcp.activepieces.com/v1</span>
        </div>
        <div className="flex flex-col px-6 pt-3 pb-6">
          {TOOLS.map(([logo, tool]) => (
            <div key={tool} className="flex items-center gap-4 py-3">
              <span className="flex size-8 shrink-0 items-center justify-center">
                <img src={`/assets/${logo}.svg`} alt="" aria-hidden="true" className="size-6" width="24" height="24" loading="lazy" decoding="async" />
              </span>
              <span className="min-w-0 flex-1 truncate font-mono text-[15px] text-ink-900">{tool}</span>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Tables */}
      <BentoCard span={12} title="Tables" desc="Data every flow and agent can read and write." art="meadow" position="50% 62%" mode="crop">
        <div className="flex items-baseline gap-3 py-5 pr-36 pl-8">
          <span className="text-[18px] font-semibold text-ink-950">Customers</span>
          <span className="ml-auto shrink-0 text-[14px] text-ink-500 tabular-nums">1,284 rows</span>
        </div>
        <div className="divide-y divide-ink-950/8 border-t border-ink-950/8">
          {CUSTOMERS.map(([name, active, value]) => (
            <div key={name} className="grid grid-cols-[minmax(0,1fr)_7rem_5rem] items-center gap-4 pr-36 pl-8 py-5">
              <span className="truncate text-[16px] text-ink-900">{name}</span>
              <span className="flex items-center gap-2.5 text-[15px] text-ink-600">
                <span className={`${active ? 'bg-accent-a-500' : 'bg-accent-b-500'} size-2 shrink-0 rounded-full`} />
                {active ? 'Active' : 'Trial'}
              </span>
              <span className="text-right text-[16px] text-ink-900 tabular-nums">{value}</span>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Knowledge Base */}
      <BentoCard span={12} title="Knowledge Base" desc="Your documents, searchable by every agent." art="iris" position="50% 100%" mode="center">
        <div className="flex items-center gap-4 bg-ink-900/4 px-6 py-4">
          <span className="flex size-10 shrink-0 items-center justify-center">
            <Icon name="solar:magnifer-linear" className="size-6 text-ink-950/30" />
          </span>
          <span className="min-w-0 flex-1 truncate text-[16px] text-ink-900">refund window for annual plans</span>
          <span className="shrink-0 text-[14px] text-ink-500 tabular-nums">3</span>
        </div>
        <div className="flex flex-col px-6 pt-3 pb-6">
          {DOCS.map(([title, meta]) => (
            <div key={title} className="flex items-center gap-4 py-3.5">
              <span className="flex size-10 shrink-0 items-center justify-center">
                <Icon name="solar:document-text-linear" className="size-6 text-ink-950/30" />
              </span>
              <TwoLine title={title} meta={meta} />
            </div>
          ))}
        </div>
      </BentoCard>
    </BentoSection>
  )
}
