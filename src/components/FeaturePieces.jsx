import { useEffect, useRef, useState } from 'react'
import './FeaturePieces.css'
import Icon from './ui/Icon'

// K. Feature: "760+ open-source pieces" with the logo mosaic (CLONE_SPEC §F/G/K, "K visual: pieces mosaic").
// Motion: mount pop (.5s ease-smooth, --i * 6ms) in CSS; logo swap loop every 820ms (img opacity .38s) below.

// 5x7 glyphs for "7", "6", "0", "+", one empty column between glyphs -> 23 columns x 7 rows.
const GLYPHS = [
  ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  ['00000', '00100', '00100', '11111', '00100', '00100', '00000'],
]
const COLS = 23
const ROWS = 7
const LIT = []
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const g = Math.floor(c / 6)
    const x = c % 6
    LIT.push(x < 5 && GLYPHS[g][r][x] === '1')
  }
}

// Initial assignment, in DOM order, copied from the saved HTML (seeded shuffle, seed 42). The snapshot already
// contains two swapped-in pool logos (twitch, mistral-ai); kept as saved, per CLONE_SPEC.
const INITIAL = [
  'linear', 'notion', 'azure-openai', 'todoist', 'instagram-for-business', 'figma', 'monday-com', 'hootsuite',
  'google-gemini', 'linkedin', 'google-docs', 'cisco-webex-meetings', 'sendgrid', 'tableau', 'zendesk',
  'google-tasks', 'okta', 'deepl', 'twitter', 'microsoft-teams', 'mailchimp', 'calendly', 'snowflake', 'openai',
  'buffer', 'google-sheets', 'posthog', 'google-slides', 'microsoft-power-bi', 'mysql', 'twitch', 'jira-cloud', 'cal-com',
  'gmail', 'microsoft-sharepoint', 'slack', 'dropbox', 'mattermost', 'stripe', 'bitly', 'zoom', 'mistral-ai', 'deepseek',
  'help-scout', 'intercom', 'clickup', 'github', 'woocommerce', 'discord', 'quickbooks', 'google-chat',
]

// Swap pool: every /logos/pieces/* logo from ASSET_MANIFEST. §2 ones are served from /assets, §3e from /logos/pieces.
const LOCAL_PIECES = [
  ...INITIAL,
  'anthropic-claude', 'apollo', 'aws-bedrock', 'coda', 'cursor', 'drupal', 'google-drive', 'postgres', 'vimeo',
  'webhook',
]
const EXTRA_PIECES = [
  'activecampaign', 'airtable', 'amazon-s3', 'asana', 'box', 'canva', 'confluence', 'datadog', 'digitalocean',
  'elevenlabs', 'facebook-pages', 'gitlab', 'google-calendar', 'google-forms', 'hugging-face', 'mailgun',
  'microsoft-excel-365', 'microsoft-onedrive', 'microsoft-outlook', 'microsoft-to-do', 'mistral-ai', 'mongodb',
  'netlify', 'perplexity-ai', 'pinterest', 'reddit', 'resend', 'salesforce', 'shopify', 'spotify', 'square',
  'supabase', 'surveymonkey', 'telegram-bot', 'trello', 'twitch', 'vercel', 'webflow', 'whatsapp-business',
  'wordpress', 'xero', 'youtube',
]
const EXTRA_SET = new Set(EXTRA_PIECES)
const POOL = [...new Set([...LOCAL_PIECES, ...EXTRA_PIECES])]
const srcFor = (name) => (EXTRA_SET.has(name) ? `/logos/pieces/${name}.svg` : `/assets/${name}.svg`)

const SWAP_EVERY = 820
const FADE = 380

const COLUMNS = [
  ['Call any API', 'Hit any REST or GraphQL endpoint using the HTTP piece, with auth and pagination handled.'],
  ['Build it with AI', 'Describe a step in plain English and AI writes it, or drop into code and write TypeScript.'],
  ['All open source', 'Every piece is MIT-licensed, built by hundreds of contributors in the open.'],
]

function Mosaic() {
  const [logos, setLogos] = useState(INITIAL)
  const [swapping, setSwapping] = useState(-1)
  const current = useRef([...INITIAL])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let busy = -1
    let fadeTimer
    const tick = () => {
      // random lit cell not already swapping
      const candidates = []
      for (let i = 0; i < current.current.length; i++) if (i !== busy) candidates.push(i)
      const i = candidates[Math.floor(Math.random() * candidates.length)]
      busy = i
      setSwapping(i)
      fadeTimer = setTimeout(() => {
        const shown = new Set(current.current)
        const options = POOL.filter((n) => !shown.has(n))
        if (options.length) {
          current.current[i] = options[Math.floor(Math.random() * options.length)]
          setLogos([...current.current])
        }
        busy = -1
        setSwapping(-1)
      }, FADE)
    }
    const interval = setInterval(tick, SWAP_EVERY)
    return () => {
      clearInterval(interval)
      clearTimeout(fadeTimer)
    }
  }, [])

  let n = -1
  return (
    <div className="pieces-mosaic-outer">
      <div className="pieces-mosaic" style={{ '--tile': '3.752cqw', gridTemplateColumns: `repeat(${COLS}, var(--tile))` }}>
        {LIT.map((on, k) => {
          if (!on) return <span key={k} className="pieces-cell" />
          n += 1
          return (
            <span key={k} className={`pieces-cell on${swapping === n ? ' swapping' : ''}`} style={{ '--i': n }}>
              <img src={srcFor(logos[n])} alt="" width="48" height="48" loading="lazy" decoding="async" />
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default function FeaturePieces() {
  return (
    <section data-section="pieces" className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-24 md:gap-12 md:px-6 md:py-32 lg:px-8">
      <div className="relative z-10 grid gap-5 md:grid-cols-12 md:gap-12">
        <h2 className="font-display text-4xl font-bold text-balance text-ink-900 md:col-span-5 md:text-5xl">760+ open-source pieces</h2>
        <div className="max-w-md md:col-span-6 md:col-start-7 md:ml-auto">
          <p className="text-xl text-ink-600">For the apps you already run, with a clear path for everything else.</p>
          <a
            href="/pieces"
            className="group mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm text-ink-900 transition-colors duration-200 ease-out hover:text-ink-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 motion-reduce:transition-none"
          >
            View all pieces
            <Icon
              name="solar:alt-arrow-right-linear"
              className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </a>
        </div>
      </div>
      <div className="pieces-stage relative isolate overflow-hidden rounded-4xl shadow-lift">
        <img
          src="/assets/meadow.webp"
          alt=""
          aria-hidden="true"
          width="1920"
          height="1080"
          className="absolute inset-0 -z-10 size-full object-cover opacity-85 saturate-[.75]"
          loading="lazy"
          decoding="async"
        />
        <div className="grid w-full grid-cols-1 place-items-center">
          <div className="pieces-pad" aria-hidden="true">
            <Mosaic />
          </div>
        </div>
      </div>
      <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-ink-950/10">
        {COLUMNS.map(([title, body]) => (
          <div key={title} className="flex flex-col gap-2 md:px-6 md:first:pl-0 md:last:pr-0">
            <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
            <p className="text-base text-ink-600">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
