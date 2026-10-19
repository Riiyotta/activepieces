import Icon from './ui/Icon'
import './AppMockup.css'

// B. Hero shot: static app mockup overlapping the hero by -292px (md -308px). Markup from the saved HTML.
const NAV_TOP = [
  ['solar:chat-round-dots-linear', 'Chat'],
  ['solar:cpu-bolt-linear', 'Agents', true],
  ['solar:branching-paths-down-linear', 'Flows'],
  ['solar:play-circle-linear', 'Runs'],
  ['solar:widget-linear', 'Tables'],
]
const NAV_BOTTOM = [
  ['solar:socket-linear', 'Connections'],
  ['solar:copy-linear', 'Templates'],
  ['solar:server-minimalistic-linear', 'MCP server'],
]

const AGENTS = [
  {
    avatar: 'atlas.svg',
    title: 'Support triage',
    ran: 'Ran 4 min ago',
    desc: 'Answers the questions you get every day and escalates anything that needs a human.',
    tools: ['intercom', 'openai', 'slack', 'zendesk'],
    more: '+2',
  },
  {
    avatar: 'beacon.svg',
    title: 'Invoice intake',
    ran: 'Ran 20 min ago',
    desc: 'Pulls invoices out of the inbox, matches them to the PO, files them for approval.',
    tools: ['gmail', 'quickbooks', 'google-drive', 'stripe'],
    more: '+1',
  },
  {
    avatar: 'cinder.svg',
    title: 'Inbound lead routing',
    ran: 'Ran 2 hours ago',
    desc: 'Researches every demo request, scores it, and hands it to an owner within the minute.',
    tools: ['hubspot', 'calendly', 'apollo', 'google-sheets'],
    more: '+3',
  },
]

const ROW = 'flex items-center gap-2.5 rounded-xl px-3 py-2 text-[15px] lg:gap-3 lg:py-2.5 lg:text-[16px]'

function NavRow([icon, label, active]) {
  return (
    <div
      key={label}
      className={`${active ? 'bg-white font-medium text-ink-900 shadow-sm ring-1 ring-ink-950/6' : 'text-ink-500'} ${ROW}`}
    >
      <Icon name={icon} className="size-5 shrink-0 lg:size-[22px]" /> {label}
    </div>
  )
}

const CHIP = 'flex size-12 items-center justify-center rounded-xl bg-ink-50 ring-1 ring-ink-950/6 lg:size-14'

function AgentCard({ avatar, title, ran, desc, tools, more }) {
  return (
    <div className="agent-card rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink-950/8 lg:p-7">
      <img src={`/assets/${avatar}`} alt="" className="size-18 rounded-2xl bg-ink-50 lg:size-22" decoding="async" />
      <div className="agent-card-head mt-4 flex flex-col items-start gap-1 lg:mt-5">
        <span className="agent-card-title min-w-0 text-[19px] font-medium text-ink-900 lg:text-[22px]">{title}</span>
        <span className="flex shrink-0 items-center gap-2 text-[14px] whitespace-nowrap text-ink-400 lg:text-[15px]">
          <span className="size-2 rounded-full bg-accent-a-500" /> {ran}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-[15px] leading-snug text-ink-500 lg:text-[17px]">{desc}</p>
      <div className="mt-5 flex items-center gap-2 border-t border-ink-150 pt-4 lg:mt-6 lg:pt-5">
        {tools.map((t) => (
          <span key={t} className={CHIP}>
            <span className="flex shrink-0 items-center justify-center" style={{ width: 34, height: 34 }}>
              <img src={`/assets/${t}.svg`} alt="" aria-hidden="true" className="size-[76%] object-contain" decoding="async" />
            </span>
          </span>
        ))}
        <span className={`${CHIP} text-[15px] font-medium text-ink-400 lg:text-[16px]`}> {more}</span>
      </div>
    </div>
  )
}

export default function AppMockup() {
  return (
    <div data-section="hero-shot" className="hero-line relative z-65 -mt-73 px-5 md:-mt-77 md:px-6 lg:px-8" style={{ '--i': 4 }}>
      <div inert="" aria-hidden="true" className="relative mx-auto w-full max-w-7xl select-none">
        <div className="frame pointer-events-none aspect-[2/3] w-full overflow-hidden rounded-2xl bg-white sm:aspect-[4/3] lg:aspect-[2/1] lg:rounded-3xl">
          <div className="flex h-full w-full bg-white font-sans text-ink-950">
            <aside className="hidden w-52 shrink-0 flex-col border-r border-ink-200 bg-ink-50 px-3 md:flex lg:w-62 lg:px-4">
              <div className="mt-6 mb-5 ml-3 aspect-[945/147] h-5 bg-ink-900 [mask-image:url(/assets/activepieces-logo.svg)] [mask-position:left] [mask-repeat:no-repeat] [mask-size:contain] lg:mt-7 lg:mb-6 lg:h-6" />
              <div className="flex flex-col gap-0.5">{NAV_TOP.map(NavRow)}</div>
              <div className="my-3 h-px bg-ink-200" />
              <div className="flex flex-col gap-0.5">{NAV_BOTTOM.map(NavRow)}</div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
              <header className="flex shrink-0 items-center gap-4 px-5 pt-7 pb-5 sm:px-7 lg:px-10 lg:pt-10 lg:pb-7">
                <h2 className="text-[26px] leading-none font-semibold tracking-tight text-ink-950 sm:text-[30px] lg:text-[36px]">
                  Agents
                </h2>
                <div className="ml-auto flex items-center gap-2.5">
                  <div className="hidden size-10 items-center justify-center rounded-xl border border-ink-200 text-ink-400 sm:flex lg:size-11">
                    <Icon name="solar:tuning-linear" className="size-5" />
                  </div>
                  <div className="flex h-10 items-center rounded-xl bg-ink-900 px-4 text-[14px] font-medium whitespace-nowrap text-white lg:h-11 lg:px-6 lg:text-[15px]">
                    New agent
                  </div>
                </div>
              </header>

              <div className="min-h-0 flex-1 px-5 pb-6 sm:px-7 lg:px-10 lg:pb-10">
                <div className="flex flex-wrap items-center gap-3 pb-5 lg:gap-4 lg:pb-6">
                  <div className="flex h-11 min-w-0 basis-full items-center gap-3 rounded-2xl border border-ink-200 bg-white px-4 text-[15px] text-ink-400 sm:flex-1 sm:basis-auto sm:pr-8 lg:h-12 lg:px-5 lg:text-[16px]">
                    <Icon name="solar:magnifer-linear" className="size-5 shrink-0" />
                    <span className="truncate">Search agents</span>
                  </div>
                  <div className="hidden h-11 shrink-0 items-center gap-2 rounded-2xl border border-ink-200 bg-white px-4 text-[15px] text-ink-600 sm:flex lg:h-12 lg:px-5 lg:text-[16px]">
                    All teams <Icon name="solar:alt-arrow-down-linear" className="size-4 text-ink-400" />
                  </div>
                  <span className="ml-auto hidden text-[15px] text-ink-400 sm:block lg:text-[16px]">23 agents</span>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
                  {AGENTS.map((a) => (
                    <AgentCard key={a.title} {...a} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="cover pointer-events-none absolute -inset-x-12 -bottom-12 h-[62%]" />
      </div>
    </div>
  )
}
