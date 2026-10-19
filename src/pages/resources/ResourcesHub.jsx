import { Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import { usePageClosing } from '../../components/PageMetaContext'
import { useResources, SIGNUP } from '../../components/content/data'
import { RES_TYPES } from '../../components/content/parts'
import usePageHead from '../usePageHead'

export const RES_CLOSING = {
  h2: 'Put what you read into practice today.',
  lede: 'Free to start with no card. Open source, on our cloud or your own servers.',
}

const HERO_BTN =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-medium whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700'

// §6 / §7.1 hero stage (shared by hub and category pages). `crumb` renders above the h1.
// `res-hero-line` + --i drive the §6 load animation (content.css).
export function ResHero({ crumb, title, lede, cta = '' }) {
  return (
    <div className="hero-wash relative isolate overflow-hidden">
      <div className="res-stage mx-auto flex w-full max-w-3xl flex-col items-center px-5 pt-28 pb-24 text-center md:px-6 md:pt-32 md:pb-32">
        {crumb}
        <h1 className={`${crumb ? 'mt-5 ' : ''}font-display text-5xl font-bold text-balance text-ink-900 md:text-6xl`}>
          {title}
        </h1>
        <p className="res-hero-line mt-3 max-w-2xl text-xl text-balance text-ink-600" style={{ '--i': 2 }}>
          {lede}
        </p>
        <div
          className="res-hero-line mt-5 flex w-full flex-wrap items-center justify-center gap-3 max-sm:*:grow"
          style={{ '--i': 3 }}
        >
          <a href={`${SIGNUP}${cta}`} className={`${HERO_BTN} bg-ink-950 text-white hover:bg-ink-900`}>
            Start building
          </a>
          <a
            href="/sales"
            className={`${HERO_BTN} bg-ink-50 text-ink-950 shadow-edge hover:bg-ink-100 hover:shadow-edge-hover`}
          >
            Talk to sales
          </a>
        </div>
      </div>
    </div>
  )
}

// SPEC_CONTENT §6: /resources
export default function ResourcesHub() {
  const res = useResources()
  usePageClosing(RES_CLOSING)
  usePageHead('Resources | Activepieces')
  const counts = res?.counts
  const total = counts ? Object.keys(RES_TYPES).reduce((s, k) => s + counts[k], 0) : 1063

  return (
    <>
      <ResHero
        title="Stop redoing the same work every week"
        lede={`Find the job you handle by hand, then the flow that handles it for you. ${total.toLocaleString('en-US')} free pages, no account needed.`}
      />
      <section className="mx-auto w-full max-w-7xl px-5 pb-24 md:px-6 md:pb-32 lg:px-8">
        <div className="flex flex-col gap-5 md:gap-8">
          <h2 className="max-w-3xl font-display text-3xl font-bold text-balance text-ink-900 md:text-4xl">
            Pick the shortcut you need today.
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
            {Object.entries(RES_TYPES).map(([type, t]) => (
              <Link
                key={type}
                to={`/resources/${type}`}
                className="group flex h-full flex-col gap-6 rounded-3xl bg-white p-8 shadow-edge transition-shadow duration-200 ease-out hover:shadow-edge-hover motion-reduce:transition-none md:p-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-white ring-1 ring-ink-950/10">
                  <Icon name={t.icon} className="size-7 text-ink-600" />
                </span>
                <span className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 font-display text-2xl font-bold text-ink-900">
                    {t.label}
                    <Icon
                      name="solar:alt-arrow-right-linear"
                      className="size-5 text-ink-600 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
                    />
                  </span>
                  <span className="text-base text-ink-600">{t.desc}</span>
                </span>
                <span className="mt-auto border-t border-ink-950/10 pt-5 text-sm text-ink-600 tabular-nums">
                  {counts ? `${counts[type]} ${t.noun}` : ' '}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
