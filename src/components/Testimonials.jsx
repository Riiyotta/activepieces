import './Testimonials.css'

// M. Testimonials (CLONE_SPEC §M). Markup, order and copy from the saved HTML (data-section="testimonials").
// Static section: no scroll/entrance motion (spec §R "Measured to be absent").

const PLATFORMS = {
  trustpilot: { src: '/assets/trustpilot-logo.webp', alt: 'Trustpilot' },
  g2: { src: '/assets/g2-logo.webp', alt: 'G2' },
  reddit: { src: '/assets/reddit-logo.webp', alt: 'Reddit' },
}

const REVIEWS = [
  {
    quote: 'Connect apps, APIs and webhooks together to avoid menial tasks. It helps us do all of this at a much lower price.',
    name: 'Kevin Hu',
    source: 'Trustpilot',
    platform: 'trustpilot',
    avatar: '/assets/trustpilot-kevinhu.webp',
  },
  {
    quote: 'The completely customizable and fluid builder is much better than Zapier. It took me under an hour to rebuild everything I had.',
    name: 'Christian D.',
    source: 'G2',
    platform: 'g2',
    avatar: '/assets/g2-christiand.webp',
  },
  {
    quote: 'The modular way pieces are built, with MCP at its core, is genuinely how I see the future of the internet.',
    name: 'Vikranth K.',
    source: 'G2',
    platform: 'g2',
    initials: 'VK',
    tint: 'bg-accent-b-200',
  },
  {
    quote: 'The visual designer is approachable for beginners but powerful enough for advanced users.',
    name: 'Mark D.',
    source: 'G2',
    platform: 'g2',
    avatar: '/assets/g2-markd.webp',
  },
  {
    quote: 'Once you get the hang of it, this thing is a powerhouse. It already handles the most critical automations in my daily operations.',
    name: 'Rida',
    source: 'Trustpilot',
    platform: 'trustpilot',
    avatar: '/assets/trustpilot-rida.webp',
  },
  {
    quote: 'As simple as Zapier but with the more advanced options of Make, and cheaper. That is my dream.',
    name: 'CaptainJamie',
    source: 'Reddit, r/selfhosted',
    platform: 'reddit',
    initials: 'CA',
    tint: 'bg-primary-200',
  },
  {
    quote: 'User-friendly, even for those without technical skills. Highly flexible and powerful, with options to add code when needed.',
    name: 'Giuseppe "Peps" C.',
    source: 'G2',
    platform: 'g2',
    avatar: '/assets/g2-giuseppec.webp',
  },
  {
    quote: 'My experience has been nothing but positive. It stands out as not just an alternative, but in many ways a preferred choice.',
    name: 'Dennis Klappe',
    source: 'Trustpilot',
    platform: 'trustpilot',
    avatar: '/assets/trustpilot-dennisklappe.webp',
  },
  {
    quote: 'The easiest and most user friendly automation software I have used. It was extremely easy to set up flows and get automations running.',
    name: 'Patrick F.',
    source: 'G2',
    platform: 'g2',
    avatar: '/assets/g2-patrickf.webp',
  },
]

// GitHub stars are fetched at runtime on the original; spec §M / §S says hard-code 25.1k.
const STATS = [
  { label: 'GitHub stars', value: '25.1k', extra: 'min-w-[4.5ch]' },
  { label: 'Contributors', value: '356', extra: '' },
]

function Review({ quote, name, source, platform, avatar, initials, tint }) {
  const mark = PLATFORMS[platform]
  return (
    <figure className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-edge">
      <blockquote className="text-base text-ink-600">{`“${quote}”`}</blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            aria-hidden="true"
            className="size-10 shrink-0 rounded-full object-cover ring-1 ring-ink-950/10"
            width="40"
            height="40"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span
            aria-hidden="true"
            className={`${tint} flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-ink-900 ring-1 ring-ink-950/10`}
          >
            {initials}
          </span>
        )}
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-ink-900">{name}</span>
          <span className="truncate text-xs text-ink-600">{source}</span>
        </span>
        <img
          src={mark.src}
          alt={mark.alt}
          className="ml-auto size-5 shrink-0 object-contain opacity-70"
          width="20"
          height="20"
          loading="lazy"
          decoding="async"
        />
      </figcaption>
    </figure>
  )
}

const HEADING = "Here's how it's going for the teams building with us."

// Optional props (solution template): heading, section (data-section). Defaults reproduce the homepage.
export default function Testimonials({ heading = HEADING, section = 'testimonials' }) {
  return (
    <section className="px-5 py-24 md:px-6 md:py-32 lg:px-8" data-section={section}>
      <div className="mx-auto flex max-w-7xl flex-col gap-5 md:gap-8">
        <div className="flex flex-col gap-5 pt-1 md:flex-row md:items-end md:justify-between md:gap-10">
          <h2 className="max-w-4xl font-display text-3xl font-bold text-balance text-ink-900 md:text-4xl">
            {heading}
          </h2>
          <dl className="flex shrink-0 testi-stats-divide">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-1 px-5 first:pl-0 last:pr-0">
                <dt className="order-2 text-sm whitespace-nowrap text-ink-600">{s.label}</dt>
                <dd
                  className={`${s.extra} order-1 font-display text-2xl font-bold text-ink-900 tabular-nums md:text-3xl`}
                >
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="testimonials-fade fade-b -m-3 p-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <Review key={r.name} {...r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
