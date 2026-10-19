import './BentoPlatform.css'
import Icon from './ui/Icon'
import { BentoCard, BentoSection, Dot, TwoLine } from './BentoPlatformCard'

// H. Bento: "Everything you need to run this for the whole company." (CLONE_SPEC §H/L). Static, no motion.

const PROJECTS = [
  ['growth', 'Growth', '14 members', '412k'],
  ['revenue-ops', 'Revenue Ops', '9 members', '268k'],
  ['support', 'Support', '21 members', '191k'],
  ['data-platform', 'Data Platform', '11 members', '154k'],
]

const ROLES = [
  ['Admin', 'Everything, including billing', true],
  ['Editor', 'Build and publish flows', false],
  ['Viewer', 'Read only', false],
]

const SECRETS = [
  ['stripe', 'Stripe', 'prod/stripe', '••••8f21'],
  ['hubspot', 'HubSpot', 'prod/hubspot', '••••4b0c'],
  ['snowflake', 'Snowflake', 'data/warehouse', '••••1d55'],
]

// [indent rem, [text, class][]]
const AUDIT = [
  [0, [['{', '']]],
  [1.4, [['"time"', 'code-fn'], [': ', ''], ['"2026-09-02T10:03:41Z"', 'code-str'], [',', '']]],
  [1.4, [['"actor"', 'code-fn'], [': ', ''], ['"sarah@calder.co"', 'code-str'], [',', '']]],
  [1.4, [['"action"', 'code-fn'], [': ', ''], ['"sso.configuration.updated"', 'code-str'], [',', '']]],
  [1.4, [['"project"', 'code-fn'], [': ', ''], ['"growth"', 'code-str'], [',', '']]],
  [1.4, [['"change"', 'code-fn'], [': {', '']]],
  [2.8, [['"metadata_url"', 'code-fn'], [': ', ''], ['"https://calder.okta.com/sso/saml"', 'code-str'], [',', '']]],
  [2.8, [['"signing_cert"', 'code-fn'], [': ', ''], ['"rotated"', 'code-str']]],
  [1.4, [['},', '']]],
  [1.4, [['"result"', 'code-fn'], [': ', ''], ['"success"', 'code-str']]],
  [0, [['}', '']]],
]

const PROVIDERS = [
  ['anthropic-claude', 'Anthropic', '••••4c2a', true, 'border-r border-ink-950/10'],
  ['openai', 'OpenAI', '••••91be', true, ''],
  ['aws-bedrock', 'AWS Bedrock', 'eu-west-1', true, 'border-r border-ink-950/10 border-t border-ink-950/10'],
  ['google-gemini', 'Google Gemini', 'Add key', false, 'border-t border-ink-950/10'],
]

const RUN_BEFORE = [
  ['stripe', 'Charge in Stripe', '1.20s'],
  ['gmail', 'Send the receipt', '0.38s'],
]
const RUN_AFTER = [
  ['google-sheets', 'Append to revenue sheet', '0.21s'],
  ['slack', 'Notify the account owner', '0.12s'],
  ['zendesk', 'Close the ticket', '0.09s'],
]

const BARS = [42, 51, 46, 60, 55, 68, 63, 76, 71, 84, 79, 92, 87, 100]

const TEAMS = [
  ['Growth', '412k'],
  ['Revenue Ops', '268k'],
  ['Support', '191k'],
]

const DEPLOY = [
  ['solar:cloud-linear', 'Activepieces Cloud', 'Managed, nothing to run', true],
  ['solar:server-linear', 'Your infrastructure', 'Docker or Kubernetes', false],
  ['solar:lock-keyhole-linear', 'Air-gapped', 'No outbound network', false],
]

function RunRow([logo, label, time]) {
  return (
    <div key={label} className="flex items-center gap-4 py-3.5">
      <span className="flex size-10 shrink-0 items-center justify-center">
        <img src={`/assets/${logo}.svg`} alt="" aria-hidden="true" className="size-7" width="28" height="28" loading="lazy" decoding="async" />
      </span>
      <span className="min-w-0 flex-1 truncate text-[16px] text-ink-900">{label}</span>
      <Icon name="solar:check-circle-linear" className="size-5 shrink-0 text-accent-a-700" />
      <span className="w-12 shrink-0 text-right text-[15px] text-ink-500 tabular-nums">{time}</span>
    </div>
  )
}

export default function BentoPlatform() {
  return (
    <BentoSection section="feature-grid" title="Everything you need to run this for the whole company.">
      {/* Projects */}
      <BentoCard span={12} title="Projects" desc="Each team gets its own space, sealed off." art="meadow" position="50% 62%" mode="crop">
        <div className="flex items-baseline gap-3 py-5 pr-36 pl-8">
          <span className="text-[18px] font-semibold text-ink-950">Projects</span>
          <span className="ml-auto text-[14px] text-ink-500 tabular-nums">6 projects</span>
        </div>
        <div className="divide-y divide-ink-950/8 border-t border-ink-950/8">
          {PROJECTS.map(([img, name, members, runs]) => (
            <div key={name} className="flex items-center gap-4 py-5 pr-36 pl-8">
              <img src={`/assets/${img}.svg`} alt="" aria-hidden="true" className="size-10 shrink-0 rounded-lg bg-ink-100 object-contain" width="40" height="40" loading="lazy" decoding="async" />
              <TwoLine title={name} meta={members} />
              <span className="shrink-0 text-[15px] text-ink-700 tabular-nums">{runs}</span>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Access Control */}
      <BentoCard span={12} title="Access Control" desc="Okta or Entra sign-in, roles to the permission." art="clouds" position="50% 12%" mode="float">
        <div className="flex items-center gap-4 px-6 pt-6 pb-5">
          <span className="size-10 shrink-0 rounded-full bg-primary-200" />
          <TwoLine title="Sarah Chen" meta="sarah@calder.co" titleClass="text-ink-950" />
          <Icon name="solar:shield-check-linear" className="size-5 shrink-0 text-accent-a-700" />
        </div>
        <div className="pb-4">
          {ROLES.map(([role, desc, on]) => (
            <div key={role} className={`${on ? 'bg-ink-900/5 ' : ''}flex items-center gap-4 px-6 py-3.5`}>
              <span className="flex size-10 shrink-0 items-center justify-center">
                <span className={`${on ? 'bg-primary-600 ring-4 ring-white ring-inset' : 'ring-1 ring-ink-950/20'} size-5 rounded-full`} />
              </span>
              <TwoLine title={role} meta={desc} />
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Secret Managers */}
      <BentoCard span={9} title="Secret Managers" desc="Credentials stay in your own vault." art="water" position="50% 30%" mode="float">
        <div className="flex items-baseline gap-3 px-6 pt-6 pb-2">
          <span className="text-[18px] font-semibold text-ink-950">Credentials</span>
          <span className="ml-auto flex shrink-0 items-center gap-2 text-[14px] text-ink-500">
            <Dot />
            HashiCorp Vault
          </span>
        </div>
        <div className="flex flex-col px-6 pt-2 pb-6">
          {SECRETS.map(([logo, name, path, mask]) => (
            <div key={name} className="flex items-center gap-4 py-3.5">
              <span className="flex size-10 shrink-0 items-center justify-center">
                <img src={`/assets/${logo}.svg`} alt={name} className="size-8" width="32" height="32" loading="lazy" decoding="async" />
              </span>
              <TwoLine title={name} meta={path} metaClass="font-mono text-ink-500" />
              <span className="shrink-0 font-mono text-[15px] text-ink-500">{mask}</span>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Audit Logs */}
      <BentoCard span={15} title="Audit Logs" desc="Who did what and when, streamed to your SIEM in real time." art="clouds" position="50% 58%" mode="crop">
        <div className="flex items-baseline gap-3 pt-6 pr-36 pb-2 pl-8">
          <span className="text-[18px] font-semibold text-ink-950">Audit stream</span>
          <span className="ml-auto flex shrink-0 items-center gap-2 text-[14px] text-ink-600">
            <Dot />
            Splunk
          </span>
        </div>
        <div className="pt-2 pr-36 pb-6 pl-8">
          {AUDIT.map(([indent, parts], i) => (
            <p key={i} className="font-mono text-[15px] leading-[1.95] whitespace-pre code-text" style={{ paddingLeft: `${indent}rem` }}>
              {parts.map(([text, cls], j) => (
                <span key={j} className={cls}>
                  {text}
                </span>
              ))}
            </p>
          ))}
        </div>
      </BentoCard>

      {/* AI Providers */}
      <BentoCard span={9} title="AI Providers" desc="Bring your own keys and models." art="meadow" position="22% 34%" mode="center">
        <div className="flex items-baseline gap-3 px-6 pt-6 pb-5">
          <span className="text-[18px] font-semibold text-ink-950">AI providers</span>
          <span className="ml-auto shrink-0 text-[14px] text-ink-500 tabular-nums">3 of 4</span>
        </div>
        <div className="grid grid-cols-2 border-t border-ink-950/10">
          {PROVIDERS.map(([logo, name, meta, on, borders]) => (
            <div key={name} className={`${borders ? `${borders} ` : ''}flex min-w-0 flex-col gap-3 px-6 py-5`}>
              <div className="flex items-center gap-2">
                <img src={`/assets/${logo}.svg`} alt={name} className={`${on ? '' : 'opacity-30 saturate-0 '}size-8 shrink-0`} width="32" height="32" loading="lazy" decoding="async" />
                {on && <Icon name="solar:check-circle-linear" className="ml-auto size-5 shrink-0 text-accent-a-700" />}
              </div>
              <div className="min-w-0">
                <span className={`${on ? 'text-ink-900' : 'text-ink-600'} block truncate text-[16px]`}>{name}</span>
                <span className="block truncate font-mono text-[14px] text-ink-500">{meta}</span>
              </div>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Reliability */}
      <BentoCard span={15} title="Reliability" desc="Runs resume from their last checkpoint, never from the start." art="water" position="50% 16%" mode="crop-left">
        <div className="flex items-baseline gap-3 pt-6 pr-8 pb-3 pl-36">
          <span className="text-[18px] font-semibold text-ink-950">Run #48,213</span>
          <span className="ml-auto shrink-0 text-[14px] text-ink-500 tabular-nums">2.44s</span>
        </div>
        <div className="flex flex-col pr-8 pl-36">
          {RUN_BEFORE.map(RunRow)}
          <div className="flex items-center gap-3 py-5">
            <span className="h-px flex-1 border-t border-dashed border-accent-c-200" />
            <span className="shrink-0 text-[15px] text-ink-700">Resumed from checkpoint</span>
            <span className="h-px flex-1 border-t border-dashed border-accent-c-200" />
          </div>
          {RUN_AFTER.map(RunRow)}
        </div>
      </BentoCard>

      {/* Analytics */}
      <BentoCard span={12} title="Analytics" desc="See which teams build, and what actually runs." art="clouds" position="50% 30%" mode="wide">
        <div className="flex items-baseline gap-3 px-8 pt-6 pb-2">
          <span className="text-[18px] font-semibold text-ink-950">Runs</span>
          <span className="ml-auto text-[18px] text-ink-900 tabular-nums">1.28M</span>
          <span className="text-[14px] text-accent-a-700 tabular-nums">+18%</span>
        </div>
        <div className="px-8 pt-4 pb-5">
          <div className="flex h-[132px] items-end gap-2">
            {BARS.map((h, i) => (
              <span key={i} className={`${i === BARS.length - 1 ? 'bg-primary-600' : 'bg-primary-400'} flex-1 rounded-t-sm`} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[14px] text-ink-500">
            <span>Aug 5</span>
            <span>Aug 19</span>
          </div>
        </div>
        <div className="flex flex-col px-8">
          {TEAMS.map(([name, runs]) => (
            <div key={name} className="flex items-center gap-4 py-3">
              <span className="min-w-0 flex-1 truncate text-[16px] text-ink-900">{name}</span>
              <span className="shrink-0 text-[15px] text-ink-700 tabular-nums">{runs}</span>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Deployment Options */}
      <BentoCard span={12} title="Deployment Options" desc="Our cloud, your servers, or fully air-gapped." art="iris" position="50% 100%" mode="center">
        <div className="flex items-baseline gap-3 px-6 pt-6 pb-3">
          <span className="text-[18px] font-semibold text-ink-950">Deployment</span>
          <span className="ml-auto shrink-0 text-[14px] text-ink-500">Same build</span>
        </div>
        <div className="pb-4">
          {DEPLOY.map(([icon, name, desc, on]) => (
            <div key={name} className={`${on ? 'bg-ink-900/5 ' : ''}flex items-center gap-4 px-6 py-3.5`}>
              <span className="flex size-10 shrink-0 items-center justify-center">
                <Icon name={icon} className="size-6 text-ink-700" />
              </span>
              <TwoLine title={name} meta={desc} />
              {on && <Icon name="solar:check-circle-linear" className="size-5 shrink-0 text-accent-a-700" />}
            </div>
          ))}
        </div>
      </BentoCard>
    </BentoSection>
  )
}
