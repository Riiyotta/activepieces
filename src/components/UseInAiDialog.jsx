import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Icon from './ui/Icon'
import './UseInAiDialog.css'

// Q. MCP connect dialog (CLONE_SPEC §Q; CSS ported from mcp-connect-dialog.BUS9cZUT.css, data-v-5e369e15).
// Contract with App.jsx: props { open: boolean, onClose: () => void }.
// Native <dialog>.showModal(): open/close transitions are pure CSS (@starting-style + allow-discrete).
// Esc (cancel event) and backdrop click call onClose; Tab is trapped; body scroll is locked while open.
//
// DOM, classes and copy mirror the live dialog (www.activepieces.com, captured 2026-10-16 by stepping
// through every client tab and every setup mode).

const URL_MCP = 'https://cloud.activepieces.com/mcp'
const THEN_TRY = 'What Activepieces tools do you have? List a few things you could run for me.'
const BROWSER_STEP = 'Your browser opens on the first tool call. Sign in and approve the project.'

const json = (o) => JSON.stringify(o, null, 2)

// Step block kinds: link (dark button), file (light code card with a filename bar),
// terminal (dark code card), prompt (copyable prompt card).
const askAgent = (agent, intro, prompt) => ({
  label: 'Ask the agent',
  intro,
  steps: [
    { text: `Paste this into ${agent}.`, block: { kind: 'prompt', text: prompt } },
    { text: `${agent} writes the config, then walks you through authenticating.` },
  ],
})

const CLIENTS = [
  {
    id: 'claude',
    name: 'Claude',
    logo: '/logos/clients/claude.svg',
    docs: 'https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp',
    modes: [
      {
        label: 'One click',
        intro: 'Activepieces is listed in the Claude directory.',
        steps: [
          {
            text: 'Open the Activepieces listing and sign in to add it.',
            block: { kind: 'link', label: 'Add from the Claude directory', href: 'https://claude.ai/directory/cloud-activepieces-com' },
          },
          { text: 'Claude opens Activepieces in your browser. Approve the project it can reach.' },
        ],
      },
      {
        label: 'Custom connector',
        intro: 'Works on Claude, Claude Desktop and Cowork.',
        steps: [
          {
            text: 'Open Settings → Connectors → Add custom connector, then paste this URL.',
            block: { kind: 'file', label: 'Server URL', code: URL_MCP },
          },
          { text: 'Hit Add, then sign in to Activepieces and approve the project.' },
        ],
      },
    ],
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    logo: '/logos/clients/claude-code.svg',
    docs: 'https://code.claude.com/docs/en/mcp',
    modes: [
      {
        label: 'Terminal',
        intro: 'One line from the folder you want the tools in.',
        steps: [
          {
            text: 'Run this from the folder you want the tools available in.',
            block: { kind: 'terminal', code: `claude mcp add --transport http activepieces ${URL_MCP}` },
          },
          { text: 'Run /mcp inside Claude Code and pick Authenticate, or run claude mcp login activepieces.' },
        ],
      },
      askAgent(
        'Claude Code',
        'Paste one prompt and Claude Code sets itself up.',
        `Set up the Activepieces MCP server for me by running: claude mcp add --transport http activepieces ${URL_MCP} — then tell me to run /mcp and authenticate.`,
      ),
    ],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    logo: '/logos/clients/cursor.svg',
    docs: 'https://cursor.com/docs/mcp',
    modes: [
      {
        label: 'One click',
        intro: 'Opens Cursor and writes the config for you.',
        steps: [
          {
            text: 'This opens Cursor and writes the server into ~/.cursor/mcp.json.',
            block: {
              kind: 'link',
              label: 'Add to Cursor',
              href: 'cursor://anysphere.cursor-deeplink/mcp/install?name=activepieces&config=eyJ1cmwiOiJodHRwczovL2Nsb3VkLmFjdGl2ZXBpZWNlcy5jb20vbWNwIn0%3D',
            },
          },
          { text: BROWSER_STEP },
        ],
      },
      askAgent(
        'Cursor',
        'Paste one prompt and Cursor sets itself up.',
        `Add the Activepieces MCP server to my Cursor config. In ~/.cursor/mcp.json, add an "activepieces" entry under mcpServers with the url ${URL_MCP}. Then tell me how to reload Cursor and authenticate.`,
      ),
      {
        label: 'Config file',
        intro: 'Edit the config yourself if the deep link is blocked.',
        steps: [
          {
            text: 'Add the server to your Cursor config, then reload Cursor.',
            block: { kind: 'file', label: '~/.cursor/mcp.json', code: json({ mcpServers: { activepieces: { url: URL_MCP } } }) },
          },
          { text: BROWSER_STEP },
        ],
      },
    ],
  },
  {
    id: 'vscode',
    name: 'VS Code',
    logo: '/logos/clients/vscode.svg',
    docs: 'https://code.visualstudio.com/docs/agent-customization/mcp-servers',
    modes: [
      {
        label: 'One click',
        intro: 'Opens VS Code and writes the config for you.',
        steps: [
          {
            text: 'This opens VS Code and adds the server for this workspace.',
            block: {
              kind: 'link',
              label: 'Add to VS Code',
              href: 'vscode:mcp/install?%7B%22name%22%3A%22activepieces%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fcloud.activepieces.com%2Fmcp%22%7D',
            },
          },
          { text: BROWSER_STEP },
        ],
      },
      {
        label: 'Config file',
        intro: 'Add it to the workspace yourself, then hit Start.',
        steps: [
          {
            text: 'Create .vscode/mcp.json, then click Start above the server entry.',
            block: { kind: 'file', label: '.vscode/mcp.json', code: json({ servers: { activepieces: { type: 'http', url: URL_MCP } } }) },
          },
          { text: 'VS Code runs the OAuth flow in your browser. Approve the project.' },
        ],
      },
      askAgent(
        'Copilot',
        'Paste one prompt and Copilot sets itself up.',
        `Add the Activepieces MCP server to this workspace. In .vscode/mcp.json, add an "activepieces" entry under servers with type "http" and the url ${URL_MCP}. Then tell me how to start it and authenticate.`,
      ),
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    logo: '/logos/clients/chatgpt.svg',
    docs: 'https://learn.chatgpt.com/docs/extend/mcp?surface=chatgpt',
    modes: [
      {
        intro: 'Add Activepieces as a custom connector in settings.',
        steps: [
          {
            text: 'In ChatGPT, open Settings → Connectors → Create, then paste this server URL.',
            block: { kind: 'file', label: 'Server URL', code: URL_MCP },
          },
          { text: 'Hit Connect and sign in to Activepieces. Approve the project it can reach.' },
        ],
      },
    ],
  },
  {
    id: 'codex',
    name: 'Codex CLI',
    logo: '/logos/clients/codex.svg',
    docs: 'https://learn.chatgpt.com/docs/extend/mcp?surface=cli',
    modes: [
      {
        label: 'Terminal',
        intro: 'Add the server, then log in once.',
        steps: [
          {
            text: 'Run this from the folder you want the tools available in.',
            block: { kind: 'terminal', code: `codex mcp add activepieces --url ${URL_MCP}` },
          },
          {
            text: 'Log in to Activepieces and approve the project.',
            block: { kind: 'terminal', code: 'codex mcp login activepieces' },
          },
        ],
      },
      askAgent(
        'Codex',
        'Paste one prompt and Codex sets itself up.',
        `Set up the Activepieces MCP server for me by running: codex mcp add activepieces --url ${URL_MCP} — then run codex mcp login activepieces and walk me through approving the project.`,
      ),
    ],
  },
  {
    id: 'cline',
    name: 'Cline',
    logo: '/logos/clients/cline.svg',
    docs: 'https://docs.cline.bot/mcp/mcp-overview',
    modes: [
      {
        label: 'Config file',
        intro: 'Cline panel → MCP Servers → Configure MCP Servers.',
        steps: [
          {
            text: 'Add the server to cline_mcp_settings.json. The type has to be streamableHttp exactly, or Cline falls back to SSE and the connection fails.',
            block: {
              kind: 'file',
              label: 'cline_mcp_settings.json',
              code: json({ mcpServers: { activepieces: { type: 'streamableHttp', url: URL_MCP } } }),
            },
          },
          { text: BROWSER_STEP },
        ],
      },
      askAgent(
        'Cline',
        'Paste one prompt and Cline sets itself up.',
        `Add the Activepieces MCP server to my Cline config. In cline_mcp_settings.json, add an "activepieces" entry under mcpServers with type "streamableHttp" and the url ${URL_MCP}. Then walk me through authenticating.`,
      ),
    ],
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    logo: '/logos/clients/antigravity.png',
    docs: 'https://antigravity.google/docs/mcp/',
    modes: [
      {
        label: 'Config file',
        intro: 'One config covers Antigravity 2.0, the IDE and the CLI.',
        steps: [
          {
            text: 'Add the server to your Antigravity config. Remote servers use serverUrl, not url.',
            block: {
              kind: 'file',
              label: '~/.gemini/config/mcp_config.json',
              code: json({ mcpServers: { activepieces: { serverUrl: URL_MCP } } }),
            },
          },
          { text: BROWSER_STEP },
        ],
      },
      askAgent(
        'Antigravity',
        'Paste one prompt and Antigravity sets itself up.',
        `Add the Activepieces MCP server to my Antigravity config. In ~/.gemini/config/mcp_config.json, add an "activepieces" entry under mcpServers with serverUrl ${URL_MCP}. Then walk me through authenticating.`,
      ),
    ],
  },
  {
    id: 'devin',
    name: 'Devin Desktop',
    logo: '/logos/clients/devin.svg',
    docs: 'https://docs.devin.ai/desktop/cascade/mcp',
    modes: [
      {
        label: 'Config file',
        intro: 'Devin Settings → Cascade → MCP Servers.',
        steps: [
          {
            text: 'Add the server to your config, then refresh the server list in Devin.',
            block: {
              kind: 'file',
              label: '~/.codeium/windsurf/mcp_config.json',
              code: json({ mcpServers: { activepieces: { serverUrl: URL_MCP } } }),
            },
          },
          { text: BROWSER_STEP },
        ],
      },
      askAgent(
        'Devin',
        'Paste one prompt and Devin sets itself up.',
        `Add the Activepieces MCP server to my Devin Desktop config. In ~/.codeium/windsurf/mcp_config.json, add an "activepieces" entry under mcpServers with serverUrl ${URL_MCP}. Then walk me through authenticating.`,
      ),
    ],
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    logo: '/logos/clients/opencode.svg',
    docs: 'https://opencode.ai/docs/mcp-servers/',
    modes: [
      {
        label: 'Config file',
        intro: 'Add a remote server to your OpenCode config.',
        steps: [
          {
            text: 'Add the server to your OpenCode config.',
            block: {
              kind: 'file',
              label: '~/.config/opencode/opencode.json',
              code: json({ mcp: { activepieces: { type: 'remote', url: URL_MCP, enabled: true } } }),
            },
          },
          { text: BROWSER_STEP },
        ],
      },
      askAgent(
        'OpenCode',
        'Paste one prompt and OpenCode sets itself up.',
        `Add the Activepieces MCP server to my OpenCode config. In ~/.config/opencode/opencode.json, add an "activepieces" entry under mcp with type "remote", enabled true, and the url ${URL_MCP}. Then walk me through authenticating.`,
      ),
    ],
  },
  {
    id: 'other',
    name: 'Any MCP client',
    logo: '/logos/clients/mcp.svg',
    docs: 'https://modelcontextprotocol.io/docs/2026-07-28/develop/connect-remote-servers',
    modes: [
      {
        intro: 'Works with any client that speaks Streamable HTTP.',
        steps: [
          {
            text: 'Add a Streamable HTTP MCP server pointing at this URL. Your client docs say where its server list lives.',
            block: { kind: 'file', label: 'Server URL', code: URL_MCP },
          },
          {
            text: 'The server advertises OAuth and supports dynamic client registration, so a compliant client prompts you to sign in with no extra setup.',
          },
        ],
      },
    ],
  },
]

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700'
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

// Sliding white pill that tracks the active element inside a positioned container
// (inline style matches the original: translate3d + width + height + opacity).
// The first placement (mount, or the dialog going from display:none to shown) jumps without a transition,
// like the original: only moves between two visible targets slide.
function usePill(containerRef, activeSelector, deps) {
  const [style, setStyle] = useState({ opacity: 0 })
  const placed = useRef(false)
  const raf = useRef(0)
  const measure = useCallback(() => {
    const box = containerRef.current
    const el = box?.querySelector(activeSelector)
    if (!el || !el.offsetWidth) {
      placed.current = false
      return setStyle({ opacity: 0, transition: 'none' })
    }
    const next = {
      transform: `translate3d(${el.offsetLeft}px, ${el.offsetTop}px, 0px)`,
      width: el.offsetWidth,
      height: el.offsetHeight,
      opacity: 1,
    }
    if (placed.current) return setStyle(next)
    placed.current = true
    setStyle({ ...next, transition: 'none' })
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      raf.current = requestAnimationFrame(() => setStyle((cur) => (cur.transition ? { ...cur, transition: undefined } : cur)))
    })
  }, [containerRef, activeSelector])
  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  useLayoutEffect(measure, [measure, ...deps])
  useEffect(() => {
    const box = containerRef.current
    if (!box || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    return () => ro.disconnect()
  }, [containerRef, measure])
  return style
}

function Rail({ active, onSelect }) {
  const listRef = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: true })
  const pill = usePill(listRef, '[aria-selected="true"]', [active])

  const updateEdges = useCallback(() => {
    const el = listRef.current
    if (!el) return
    setEdges({
      start: el.scrollLeft <= 1,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
    })
  }, [])
  useEffect(() => {
    updateEdges()
    window.addEventListener('resize', updateEdges)
    return () => window.removeEventListener('resize', updateEdges)
  }, [updateEdges])

  const onKeyDown = (e) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
    let next = null
    if (e.key in keys) next = (active + keys[e.key] + CLIENTS.length) % CLIENTS.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = CLIENTS.length - 1
    if (next === null) return
    e.preventDefault()
    onSelect(next)
    const tab = listRef.current?.querySelectorAll('[role="tab"]')[next]
    tab?.focus()
    tab?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  return (
    <div className="mcp-rail flex shrink-0 flex-col border-ink-950/10 bg-ink-50 md:w-60 md:border-r">
      <p className="hidden px-5 pt-5 pb-2.5 text-xs font-semibold text-ink-500 md:block">Pick your client</p>
      <div
        ref={listRef}
        role="tablist"
        aria-label="MCP clients"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        onScroll={updateEdges}
        className={`mcp-rail-list relative flex gap-1 p-3 md:flex-col md:px-3 md:pt-0 md:pb-4${
          edges.start ? ' at-start' : ''
        }${edges.end ? ' at-end' : ''}`}
      >
        <span aria-hidden="true" className="mcp-pill mcp-rail-pill" style={pill} />
        {CLIENTS.map((c, i) => {
          const selected = i === active
          return (
            <button
              key={c.id}
              id={`mcp-tab-${c.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              aria-controls="mcp-connect-panel"
              onClick={() => onSelect(i)}
              className={`mcp-rail-item relative flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg px-3 py-3 text-left ${FOCUS} md:w-full md:py-2.5 ${
                selected ? 'text-ink-900' : 'text-ink-600 hover:bg-ink-950/5 hover:text-ink-900'
              }`}
            >
              <img src={c.logo} alt="" width="20" height="20" loading="lazy" decoding="async" className="size-5 shrink-0 object-contain" />
              <span className="truncate text-sm font-semibold">{c.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Segmented({ options, value, onChange }) {
  const ref = useRef(null)
  const pill = usePill(ref, '[aria-pressed="true"]', [value])
  return (
    <div ref={ref} role="group" aria-label="Setup method" className="mcp-seg relative flex w-fit gap-0.5 rounded-lg bg-ink-100 p-0.5">
      <span aria-hidden="true" className="mcp-pill mcp-seg-pill" style={pill} />
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          aria-pressed={i === value}
          onClick={() => onChange(i)}
          className={`mcp-seg-btn relative cursor-pointer rounded-[0.4rem] px-3 py-1.5 text-[13px] font-semibold ${FOCUS} ${
            i === value ? 'text-ink-900' : 'text-ink-600 hover:text-ink-900'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

function Block({ block, id, copied, onCopy }) {
  const isCopied = copied === id
  if (block.kind === 'link') {
    const external = /^https?:/.test(block.href)
    return (
      <a
        href={block.href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={`mcp-tap inline-flex w-fit items-center gap-1.5 rounded-lg bg-ink-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-ink-800 ${FOCUS}`}
      >
        {block.label}
        <Icon name="solar:arrow-right-linear" className="size-4" />
      </a>
    )
  }
  if (block.kind === 'terminal') {
    return (
      <div className="overflow-hidden rounded-xl">
        <div className="flex items-center gap-2 bg-ink-800 px-3 py-1.5">
          <span className="flex-1 text-[11px] font-medium text-ink-400">Terminal</span>
          <button
            type="button"
            onClick={() => onCopy(id, block.code)}
            className={`mcp-tap cursor-pointer rounded px-2 py-0.5 text-xs text-ink-200 hover:bg-white/10 hover:text-white ${FOCUS}`}
          >
            {isCopied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="overflow-x-auto bg-ink-900 px-3.5 py-3 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap text-ink-100">
          {block.code}
        </pre>
      </div>
    )
  }
  if (block.kind === 'file') {
    return (
      <div className="overflow-hidden rounded-xl border border-ink-950/10">
        <div className="flex items-center gap-2 border-b border-ink-950/10 bg-ink-50 px-3 py-1.5">
          <span className="flex-1 truncate font-mono text-[11px] text-ink-500">{block.label}</span>
          <button
            type="button"
            onClick={() => onCopy(id, block.code)}
            className={`mcp-tap cursor-pointer rounded px-2 py-0.5 text-xs text-ink-600 hover:bg-ink-100 hover:text-ink-900 ${FOCUS}`}
          >
            {isCopied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="overflow-x-auto px-3.5 py-3 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap text-ink-700">
          {block.code}
        </pre>
      </div>
    )
  }
  // prompt
  return (
    <div className="overflow-hidden rounded-xl border border-ink-950/10 bg-ink-50">
      <p className="px-3.5 py-3 text-[13px] leading-relaxed text-ink-700">{block.text}</p>
      <div className="border-t border-ink-950/10 bg-white px-3 py-2">
        <button
          type="button"
          onClick={() => onCopy(id, block.text)}
          className={`mcp-tap flex cursor-pointer items-center gap-1.5 rounded-lg bg-ink-900 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-ink-800 ${FOCUS}`}
        >
          <Icon name={isCopied ? 'solar:check-read-linear' : 'solar:copy-linear'} className="size-3.5" /> {isCopied ? 'Copied' : 'Copy prompt'}
        </button>
      </div>
    </div>
  )
}

function Panel({ client, onClose, copied, onCopy }) {
  const [modeIndex, setModeIndex] = useState(0)
  const mode = client.modes[modeIndex]
  const labels = client.modes.map((m) => m.label).filter(Boolean)
  return (
    <div
      id="mcp-connect-panel"
      role="tabpanel"
      aria-labelledby={`mcp-tab-${client.id}`}
      className="flex min-w-0 flex-1 flex-col"
    >
      <div className="flex shrink-0 items-start gap-3.5 border-b border-ink-950/10 px-5 py-4 md:px-7 md:py-5">
        <div className="mcp-fade flex min-w-0 flex-1 items-start gap-3.5">
          <img src={client.logo} alt="" width="36" height="36" className="mt-0.5 size-9 shrink-0 object-contain" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h2 id="mcp-connect-title" className="text-lg font-semibold text-ink-900">
              Connect to {client.name}
            </h2>
            <a
              href={client.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="mcp-tap flex w-fit items-center gap-1 text-sm text-ink-500 hover:text-ink-700"
            >
              {client.name} docs
              <Icon name="solar:arrow-right-up-linear" className="size-3.5" />
            </a>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={`mcp-tap -mt-1 -mr-1.5 flex cursor-pointer items-center justify-center rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-900 ${FOCUS}`}
        >
          <Icon name="solar:close-linear" className="size-4.5" />
        </button>
      </div>
      <div className="mcp-panel-scroll min-h-0 flex-1 px-5 py-5 md:px-7 md:py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            {labels.length > 1 && <Segmented options={labels} value={modeIndex} onChange={setModeIndex} />}
            <p className="text-sm text-ink-500">{mode.intro}</p>
          </div>
          <div key={modeIndex} className="mcp-fade flex flex-col gap-6">
            <ol className="flex flex-col gap-5">
              {mode.steps.map((s, i) => (
                <li key={i} className="flex gap-3.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-ink-900 pt-[0.5px] text-[11px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                    <p className="text-sm text-ink-600">{s.text}</p>
                    {s.block && <Block block={s.block} id={`${modeIndex}-${i}`} copied={copied} onCopy={onCopy} />}
                  </div>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-2 rounded-xl bg-ink-50 p-4">
              <span className="text-[13px] font-semibold text-ink-500">Then try</span>
              <div className="flex items-start gap-3">
                <p className="min-w-0 flex-1 text-sm text-ink-700">{THEN_TRY}</p>
                <button
                  type="button"
                  onClick={() => onCopy('then-try', THEN_TRY)}
                  className={`mcp-tap shrink-0 cursor-pointer rounded-lg border border-ink-950/10 bg-white px-2.5 py-1 text-xs font-semibold text-ink-700 hover:bg-ink-100 ${FOCUS}`}
                >
                  {copied === 'then-try' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Optional `initialClient` (a CLIENTS id, e.g. 'cursor'): selects that client each time the dialog opens.
// Omitted (homepage): every open starts on Claude with fresh panel state - the original remounts the dialog
// content on each open (measured: reopen after picking VS Code shows "Connect to Claude").
export default function UseInAiDialog({ open, onClose, initialClient }) {
  const ref = useRef(null)
  const lastFocus = useRef(null)
  const timer = useRef(0)
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(null)
  const [session, setSession] = useState(0)
  const resetTimer = useRef(0)
  useEffect(() => () => clearTimeout(resetTimer.current), [])

  // One shared "Copied" state, like the original: copying something else resets the previous button.
  const onCopy = useCallback(async (id, text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return
    }
    setCopied(id)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(null), 2000)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])

  const select = (i) => {
    setActive(i)
    setCopied(null)
  }

  // open/close the native modal
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      lastFocus.current = document.activeElement
      clearTimeout(resetTimer.current)
      if (initialClient) {
        const i = CLIENTS.findIndex((c) => c.id === initialClient)
        if (i >= 0) {
          setActive(i)
          setCopied(null)
        }
      }
      d.showModal()
    }
    if (!open && d.open) {
      d.close()
      lastFocus.current?.focus?.()
      // Fresh content for the next open, swapped in after the 130ms close transition (not on open, so
      // showModal()'s initial focus target isn't unmounted).
      clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => {
        setActive(0)
        setCopied(null)
        setSession((n) => n + 1)
      }, 160)
    }
  }, [open, initialClient])

  // body scroll lock
  useEffect(() => {
    if (!open) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [open])

  // Esc: route the native cancel through React state so the close transition plays
  const onCancel = (e) => {
    e.preventDefault()
    onClose()
  }

  // focus trap
  const onKeyDown = (e) => {
    if (e.key !== 'Tab') return
    const items = [...ref.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <dialog
      ref={ref}
      data-section="use-in-ai-dialog"
      aria-labelledby="mcp-connect-title"
      className="mcp-sheet m-auto overflow-hidden border border-ink-950/10 bg-white p-0 text-left"
      onCancel={onCancel}
      onClose={() => open && onClose()}
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div key={session} className="mcp-shell flex flex-col md:flex-row">
        <Rail active={active} onSelect={select} />
        <Panel key={CLIENTS[active].id} client={CLIENTS[active]} onClose={onClose} copied={copied} onCopy={onCopy} />
      </div>
      <span aria-live="polite" className="sr-only">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </dialog>
  )
}
