import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Icon from '../ui/Icon'
import { buttonClasses } from '../ui/Button'
import UseInAiDialog from '../UseInAiDialog'
import { FACTS, fmt, sales, signUp } from './lib'
import { FOCUS } from './parts'

// §4.1 hero variants. Scatter placement math is `_()` / `r()` from
// specs/catalog-ref/js/pieces-index+pieces-hero.*.js and mcp-index+mcp-hero+mcp-connect.*.js.

const PIECES_DROPS = [
  { slug: 'github', angle: -34, t: 0.42, pitch: 21, turn: -9, spin: 28, float: 5.8 },
  { slug: 'gmail', angle: -8, t: 0.86, pitch: 22, turn: -12, spin: 21, float: 7.4 },
  { slug: 'salesforce', angle: 20, t: 0.56, pitch: 18, turn: -13, spin: -11, float: 8.5 },
  { slug: 'hubspot', angle: 40, t: 0.88, pitch: 20, turn: -8, spin: 27, float: 6.8 },
  { slug: 'linear', angle: 58, t: 0.62, pitch: 23, turn: -7, spin: -19, float: 6.3 },
  { slug: 'shopify', angle: 124, t: 0.7, pitch: 17, turn: 15, spin: -26, float: 6.6 },
  { slug: 'discord', angle: 146, t: 0.84, pitch: 22, turn: 11, spin: 12, float: 7.1 },
  { slug: 'telegram-bot', angle: 172, t: 0.46, pitch: 25, turn: 14, spin: 9, float: 6.9 },
  { slug: 'slack', angle: 196, t: 0.88, pitch: 19, turn: 13, spin: -16, float: 7.9 },
  { slug: 'google-sheets', angle: 222, t: 0.5, pitch: 15, turn: 8, spin: -23, float: 6.4 },
  { slug: 'openai', angle: 240, t: 0.74, pitch: 16, turn: 6, spin: 14, float: 5.9 },
  { slug: 'figma', angle: 298, t: 0.86, pitch: 19, turn: -5, spin: -29, float: 6.1 },
].map((d) => {
  const r = (d.angle * Math.PI) / 180
  const c = Math.cos(r)
  const s = Math.sin(r)
  const m = Math.max(Math.abs(c), Math.abs(s))
  return { ...d, nx: c / m, ny: s / m }
})

const MCP_DROPS = [
  { slug: 'google-sheets', nx: -0.92, ny: -0.967, t: 0.4, pitch: 15, turn: 9, spin: -23, float: 6.4 },
  { slug: 'openai', nx: -1, ny: -0.59, t: 0.52, pitch: 16, turn: 13, spin: 14, float: 5.9 },
  { slug: 'slack', nx: -1, ny: -0.106, t: 0.68, pitch: 19, turn: 7, spin: -16, float: 7.9 },
  { slug: 'telegram-bot', nx: -0.9, ny: 0.234, t: 0.58, pitch: 25, turn: 15, spin: 9, float: 6.9 },
  { slug: 'discord', nx: -1, ny: 0.62, t: 0.86, pitch: 22, turn: 6, spin: 12, float: 7.1 },
  { slug: 'shopify', nx: -0.93, ny: 0.994, t: 0.72, pitch: 17, turn: 12, spin: -26, float: 6.6 },
  { slug: 'figma', nx: 0.96, ny: -0.985, t: 0.62, pitch: 19, turn: -11, spin: -29, float: 6.1 },
  { slug: 'github', nx: 0.88, ny: -0.544, t: 0.44, pitch: 21, turn: -6, spin: 28, float: 5.8 },
  { slug: 'gmail', nx: 1, ny: -0.166, t: 0.76, pitch: 22, turn: -14, spin: 21, float: 7.4 },
  { slug: 'salesforce', nx: 0.91, ny: 0.168, t: 0.5, pitch: 18, turn: -8, spin: -11, float: 8.5 },
  { slug: 'linear', nx: 0.97, ny: 0.57, t: 0.66, pitch: 23, turn: -15, spin: -19, float: 6.3 },
  { slug: 'hubspot', nx: 1, ny: 0.858, t: 0.84, pitch: 20, turn: -7, spin: 27, float: 6.8 },
]

// Row constants: pieces s=22 (both rows), c = 9 (top) / 13 (bottom); mcp s=28, c = 9 / 13.
function dropStyle(d, i, S) {
  const { nx, ny } = d
  const c = ny < 0 ? 9 : 13
  const top = 50 + ny * (S + d.t * c)
  const u = `${Math.abs(nx).toFixed(3)} * (var(--ring) + ${d.t} * var(--reach))`
  return {
    left: `calc(50% ${nx < 0 ? '-' : '+'} ${u})`,
    top: `${top.toFixed(2)}%`,
    '--from-x': `calc(${nx < 0 ? '-1 * ' : ''}${u})`,
    '--from-y': `calc(${(top - 50).toFixed(2)} * var(--span) / 100)`,
    '--t': d.t,
    '--nx': nx.toFixed(3),
    '--ny': ny.toFixed(3),
    '--s': (0.44 + d.t * 0.62).toFixed(3),
    '--pitch': `${d.pitch}deg`,
    '--turn': `${d.turn}deg`,
    '--spin': `${d.spin}deg`,
    '--sheen': `${152 - d.spin}deg`,
    '--float': `${d.float}s`,
    '--i': i,
  }
}

const LAYERS = Array.from({ length: 12 }, (_, i) => i + 1)

function Scatter({ drops, S }) {
  return (
    <div className="cat-scatter" aria-hidden="true">
      {drops.map((d, i) => (
        <span key={d.slug} className="cat-drop" style={dropStyle(d, i, S)}>
          <span className="cat-plate">
            {LAYERS.map((l) => (
              <span key={l} className="cat-layer" style={{ '--l': l }} />
            ))}
            <span className="cat-face">
              <img src={`/logos/pieces/${d.slug}.svg`} alt="" width="64" height="64" decoding="async" />
            </span>
          </span>
        </span>
      ))}
    </div>
  )
}

const CLUSTER = ['slack', 'gmail', 'notion', 'github', 'google-sheets', 'stripe', 'salesforce', 'openai']

export function PiecesHero({ copy }) {
  const { pathname } = useLocation()
  const loc = 'catalog_pieces_hero'
  return (
    <div className="cat-stage cat-hero relative isolate overflow-hidden" data-section="pieces-hero">
      <Scatter drops={PIECES_DROPS} S={22} />
      <div className="cat-col relative mx-auto flex flex-col items-center justify-center px-5 pt-28 pb-24 text-center md:px-6 md:pt-32">
        <h1 className="font-display text-5xl font-bold text-balance text-ink-900 md:text-6xl lg:text-7xl">{copy.title}</h1>
        <p className="hero-line mt-3 max-w-2xl text-xl text-ink-600" style={{ '--i': 1 }}>
          {copy.subtitle}
        </p>
        <div className="hero-line mt-5 flex w-full flex-wrap items-center justify-center gap-3 max-sm:*:grow" style={{ '--i': 2 }}>
          <a href={signUp(loc, pathname)} className={buttonClasses('lg', 'solid')}>
            Start building
          </a>
          <a href={sales(loc)} className={buttonClasses('lg', 'secondary')}>
            Talk to sales
          </a>
        </div>
        <div className="hero-line cat-cluster mt-12 flex max-w-md flex-wrap items-center justify-center gap-3.5" style={{ '--i': 3 }} aria-hidden="true">
          {CLUSTER.map((s) => (
            <span key={s} className="cat-face compact">
              <img src={`/logos/pieces/${s}.svg`} alt="" width="48" height="48" decoding="async" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// §4.7 McpConnect (5 popular cards + reveal with 6 more). Opens the shared UseInAiDialog on the client.
const POPULAR = [
  { key: 'claude', name: 'Claude', logo: '/logos/clients/claude.svg', hint: 'One click install' },
  { key: 'claude-code', name: 'Claude Code', logo: '/logos/clients/claude-code.svg', hint: 'One command' },
  { key: 'cursor', name: 'Cursor', logo: '/logos/clients/cursor.svg', hint: 'One click install' },
  { key: 'vscode', name: 'VS Code', logo: '/logos/clients/vscode.svg', hint: 'Works in Copilot' },
  { key: 'chatgpt', name: 'ChatGPT', logo: '/logos/clients/chatgpt.svg', hint: 'Add a connector' },
]
const MORE = [
  { key: 'codex', name: 'Codex CLI', logo: '/logos/clients/codex.svg' },
  { key: 'cline', name: 'Cline', logo: '/logos/clients/cline.svg' },
  { key: 'antigravity', name: 'Antigravity', logo: '/logos/clients/antigravity.png' },
  { key: 'devin', name: 'Devin Desktop', logo: '/logos/clients/devin.svg' },
  { key: 'opencode', name: 'OpenCode', logo: '/logos/clients/opencode.svg' },
  { key: 'other', name: 'Any MCP client', logo: '/logos/clients/mcp.svg' },
]

function McpConnect() {
  const [more, setMore] = useState(false)
  const [client, setClient] = useState(null)
  const [open, setOpen] = useState(false)
  const pick = (k) => {
    setClient(k)
    setOpen(true)
  }
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full flex-wrap justify-center gap-4">
        {POPULAR.map((c, i) => (
          <button
            key={c.key}
            type="button"
            className={`mcp-card mcp-client-card flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl bg-white px-3 py-6 ${FOCUS}`}
            style={{ '--i': i }}
            onClick={() => pick(c.key)}
          >
            <img src={c.logo} alt="" width="40" height="40" loading="lazy" decoding="async" className="size-10 object-contain" />
            <span className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-semibold text-ink-900">{c.name}</span>
              <span className="text-xs leading-[1.33333] text-ink-500">{c.hint}</span>
            </span>
          </button>
        ))}
      </div>
      <div className={`mcp-reveal w-full${more ? ' is-open' : ''}`} inert={more ? undefined : ''}>
        <div className="mcp-reveal-clip">
          <div className="flex w-full flex-wrap justify-center gap-2.5 px-1 pt-4 pb-2">
            {MORE.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`mcp-card flex cursor-pointer items-center gap-2.5 rounded-xl bg-white py-2.5 pr-4 pl-3 ${FOCUS}`}
                onClick={() => pick(c.key)}
              >
                <img src={c.logo} alt="" width="24" height="24" loading="lazy" decoding="async" className="size-6 object-contain" />
                <span className="text-sm font-semibold text-ink-900">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        type="button"
        className={`mcp-tap mt-5 flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-ink-900 ${FOCUS}`}
        aria-expanded={more}
        onClick={() => setMore((v) => !v)}
      >
        {more ? 'Show fewer' : 'Using something else?'}{' '}
        <Icon name="solar:alt-arrow-down-linear" className={`mcp-chevron size-4${more ? ' is-flipped' : ''}`} />
      </button>
      <UseInAiDialog open={open} onClose={() => setOpen(false)} initialClient={client} />
    </div>
  )
}

export function McpHero({ copy }) {
  const items = ['Build flows', `Use ${fmt(FACTS.pieces)} apps`, 'Manage tables', 'Debug runs']
  return (
    <div className="cat-stage cat-hero is-mcp relative isolate overflow-hidden" data-section="mcp-hero">
      <Scatter drops={MCP_DROPS} S={28} />
      <div className="cat-col relative mx-auto flex flex-col items-center justify-start px-5 pt-32 pb-20 text-center md:px-6 md:pt-40">
        <h1 className="font-display text-5xl font-bold text-balance text-ink-900 md:text-6xl lg:text-7xl">{copy.title}</h1>
        <p className="hero-line mt-3 max-w-2xl text-xl text-ink-600" style={{ '--i': 1 }}>
          {copy.subtitle}
        </p>
        <ul className="hero-line mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-ink-500" style={{ '--i': 2 }}>
          {items.map((t, i) => (
            <li key={t} className="flex items-center gap-3">
              {i ? (
                <span aria-hidden="true" className="text-ink-300">
                  ·
                </span>
              ) : null}
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <div className="hero-line mt-9 w-full" style={{ '--i': 3 }}>
          <McpConnect />
        </div>
      </div>
    </div>
  )
}

// §4.1 C: category pages (product-hero without art).
export function CategoryHero({ copy, section }) {
  const { pathname } = useLocation()
  const loc = `catalog_${copy.kind}_hero`
  return (
    <div
      className="cat-hero mx-auto flex w-full max-w-7xl flex-col items-start px-5 pt-28 pb-24 text-left md:px-6 md:pt-32 md:pb-32 lg:px-8"
      data-section={section}
    >
      <h1 className="font-display text-5xl font-bold text-balance text-ink-900 md:text-6xl">{copy.title}</h1>
      <p className="hero-line mt-3 max-w-5xl text-xl text-ink-600" style={{ '--i': 1 }}>
        {copy.subtitle}
      </p>
      <div className="hero-line mt-5 flex w-full flex-wrap items-center gap-3 max-sm:*:grow" style={{ '--i': 2 }}>
        <a href={signUp(loc, pathname)} className={buttonClasses('lg', 'solid')}>
          Start building
        </a>
        <a href={sales(loc)} className={buttonClasses('lg', 'secondary')}>
          Talk to sales
        </a>
      </div>
    </div>
  )
}
