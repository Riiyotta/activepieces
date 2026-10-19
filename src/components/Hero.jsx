import Icon from './ui/Icon'
import './Hero.css'

// Marquee order, --s and --shift copied verbatim from the saved HTML (CLONE_SPEC §A.1).
const LOGOS = [
  ['Bosch', 'bosch.svg', 1.016749105209648, 0.0005667582420479313],
  ['Alan', 'alan.svg', 0.9590502150308953, 0],
  ['SAP', 'sap.svg', 0.9440139544658975, 0],
  ['Tryg', 'tryg.svg', 0.86, 0],
  ['Funding Societies', 'funding-societies.svg', 0.8999525985708504, 0],
  ['Carrefour', 'carrefour.svg', 1.2, 0],
  ['Corgi', 'corgi.webp', 0.9659771711943536, 0],
  ['Hilton', 'hilton.svg', 0.9843917783188842, 0],
  ['Lumen Technologies', 'lumen.svg', 1.19925118049282, 0.00042915930095118094],
  ['Pipefy', 'pipefy.svg', 0.9043703044090191, 0],
  ['Dell Technologies', 'dell-technologies.svg', 1.2002605929767638, 0],
  ['ZeroFox', 'zerofox.svg', 1.2, 0],
  ['Decathlon', 'decathlon.svg', 1.0734548151218513, 0],
  ['Merkle', 'merkle.svg', 1.1867256997505, 0],
  ['Orange', 'orange.svg', 0.9414784979558909, 0],
  ['EXL', 'exl.svg', 0.8788840284313281, 0],
  ['Concentrix', 'concentrix.svg', 1.1023719373546688, 0],
  ['Odoo', 'odoo.svg', 0.8681394147615933, 0],
  ['Keller Williams', 'keller-williams.svg', 1.2, 0],
  ['HackerOne', 'hackerone.svg', 1.1051823328289159, -0.0016960050882286655],
  ['Shopee', 'shopee.svg', 0.9613055000731067, 0],
  ['ITV', 'itv.svg', 0.9544929508883678, 0],
  ['MoneyGram', 'moneygram.svg', 1.0816859862567225, 0],
  ['Capgemini', 'capgemini.svg', 1.0653524474501934, 0],
]

function DriftLogo({ label, file, s, shift, copy }) {
  const url = `url(/logos/customers/${file})`
  const a11y = copy ? { 'aria-hidden': 'true' } : { role: 'img', 'aria-label': label }
  return (
    <span
      {...a11y}
      className="drift-logo bg-ink-700"
      style={{ WebkitMaskImage: url, maskImage: url, '--s': s, '--shift': shift }}
    />
  )
}

const AI_LOGOS = [
  ['/assets/cursor.svg', 'Cursor'],
  ['/assets/chatgpt.svg', 'ChatGPT'],
  ['/assets/claude.svg', 'Claude'],
]

const BTN =
  'inline-flex cursor-pointer items-center justify-center rounded-full font-medium whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.99] motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 h-12.5'

export default function Hero({ onUseInAi }) {
  return (
    <div
      id="top"
      className="hero-stage relative isolate flex flex-col items-center overflow-hidden pt-34 pb-84 md:pt-38 md:pb-88"
    >
      <img
        src="/assets/hero-base-2064.webp"
        srcSet="/hero/hero-base-1376.webp 1376w, /assets/hero-base-2064.webp 2064w, /hero/hero-base-2752.webp 2752w"
        sizes="(max-width: 1630px) 1630px, 100vw"
        width="2752"
        height="1536"
        alt=""
        aria-hidden="true"
        className="plate base"
        fetchpriority="high"
        decoding="async"
      />
      <img
        src="/assets/hero-front-2064.webp"
        srcSet="/hero/hero-front-1376.webp 1376w, /assets/hero-front-2064.webp 2064w, /hero/hero-front-2752.webp 2752w"
        sizes="(max-width: 1630px) 1630px, 100vw"
        width="2752"
        height="1536"
        alt=""
        aria-hidden="true"
        className="plate front"
        decoding="async"
      />
      <div className="hero-fade" aria-hidden="true" />

      <div className="relative z-70 flex w-full max-w-4xl flex-col gap-7 text-center md:gap-8">
        <div className="flex flex-col gap-5 md:gap-6">
          <h1 className="font-display text-4xl leading-display font-bold text-balance text-primary-950 sm:text-5xl sm:leading-display md:text-6xl md:leading-display lg:text-7xl lg:leading-display">
            AI Agents with enterprise control
          </h1>
          <p
            className="hero-line mx-auto max-w-2xl text-base text-balance text-ink-700 sm:text-lg md:max-w-3xl md:text-2xl"
            style={{ '--i': 1 }}
          >
            Chat, agents, flows, tables, and 760+ apps in one workspace, so your whole team works with AI in the tools they
            already use.
          </p>
        </div>

        <div className="hero-line flex flex-col items-center gap-5" style={{ '--i': 2 }}>
          <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <button
              type="button"
              className={`${BTN} ai-cta w-full gap-3.5 bg-ink-950 pr-5 pl-6 text-[17px] leading-normal text-white hover:bg-ink-900 sm:w-auto sm:pr-6 sm:pl-7`}
              onClick={onUseInAi}
            >
              <span className="relative">Use in your AI</span>
              <span className="h-5 w-px bg-white/20" aria-hidden="true" />
              <span className="relative flex shrink-0 items-center gap-2">
                {AI_LOGOS.map(([src, alt], n) => (
                  <img
                    key={alt}
                    src={src}
                    alt={alt}
                    width="20"
                    height="20"
                    loading="lazy"
                    decoding="async"
                    className="ai-cta-logo size-5 object-contain brightness-0 invert"
                    style={{ '--n': n }}
                  />
                ))}
              </span>
            </button>
            <a
              href="/sales?ap_cta=hero"
              className={`${BTN} group w-full gap-2 bg-white/70 px-8 text-[17px] leading-normal text-ink-950 backdrop-blur-md hover:bg-white sm:w-auto`}
            >
              Talk to sales{' '}
              <Icon
                name="solar:alt-arrow-right-linear"
                className="size-4.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </a>
          </div>
          <p className="text-sm text-ink-700 sm:text-base">Free plan, no credit card required</p>
        </div>
      </div>

      <div className="hero-line relative z-25 mt-6 w-full md:mt-8" style={{ '--i': 3 }}>
        <div className="drift" style={{ '--logo-ratio': 3.111111111111111 }}>
          <div className="drift-track">
            {LOGOS.map(([label, file, s, shift]) => (
              <DriftLogo key={label} label={label} file={file} s={s} shift={shift} />
            ))}
            {LOGOS.map(([label, file, s, shift]) => (
              <DriftLogo key={`${label}-copy`} label={label} file={file} s={s} shift={shift} copy />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
