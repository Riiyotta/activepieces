import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import { usePageClosing } from '../../components/PageMetaContext'
import { useResources, Loading } from '../../components/content/data'
import {
  RES_GRID,
  RES_TYPES,
  ResBreadcrumb,
  ResourceCard,
  ResourceFaq,
  ResSearch,
} from '../../components/content/parts'
import usePageHead from '../usePageHead'
import NotFound from '../NotFound'
import { RES_CLOSING, ResHero } from './ResourcesHub'

// §7.3 category FAQ copy (hub-level UI copy)
const FAQS = {
  glossary: [
    'Questions about the terms',
    [
      ['Who is the glossary written for?', 'Anyone who has just been handed an automation project and keeps hitting words nobody defined. Every entry opens with a one-sentence answer, then goes deeper if you want it.'],
      ['Are these definitions specific to Activepieces?', 'The definitions are general and apply whatever tool you use. Where a term maps onto something concrete in Activepieces, the entry says so and links to it.'],
      ['A term is missing. Can you add it?', 'Ask on the community forum or open an issue on GitHub. Gaps that come up more than once get written first.'],
    ],
  ],
  'automation-guides': [
    'Questions about the guides',
    [
      ['Do I need to write code to follow a guide?', 'No. Every guide is built on pieces you configure in the visual builder. A Code step is there when you need it, but no guide requires one.'],
      ['What if my app has no guide yet?', 'Check the piece catalog first. There are far more pieces than guides, and a piece with the trigger and actions you need is all it takes to build the flow yourself.'],
      ['Can I run these on my own infrastructure?', 'Yes. Everything in these guides works the same on Activepieces Cloud and on a self-hosted install, because it is the same engine.'],
    ],
  ],
  'automation-use-cases': [
    'Questions about the use cases',
    [
      ['How is a use case different from a guide?', 'A use case explains the problem and the shape of the fix, including the judgment calls. A guide walks through building one specific automation, step by step.'],
      ['Are these based on real teams?', 'They are drawn from the patterns we see most often across sales, marketing, support, finance and ops. The apps are named so you can tell straight away whether it maps to your stack.'],
      ['How long does one of these take to build?', 'Most are a handful of steps and land inside an afternoon. The slow part is usually agreeing what should happen, not building it.'],
    ],
  ],
  'integration-use-cases': [
    'Questions about the integrations',
    [
      ['What counts as an integration here?', 'Two apps connected so that something happening in one causes work in the other. Each page starts from the pairing and shows what becomes possible once it is wired.'],
      ['My two apps are not paired here. Now what?', 'Look both apps up in the piece catalog. If both exist as pieces, the integration is buildable today whether or not anyone has written it up.'],
      ['Do these need an API key for each app?', 'You connect each app once, usually through OAuth and sometimes with a key. That connection is reused by every flow you build afterwards.'],
    ],
  ],
}

const LETTERS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '#']
const letterOf = (title) => {
  const c = title.trim().charAt(0).toUpperCase()
  return c >= 'A' && c <= 'Z' ? c : '#'
}
const letterId = (l) => `letter-${l === '#' ? 'num' : l.toLowerCase()}`
const STEP = 24

// SPEC_CONTENT §7: /resources/:category
export default function ResourceCategory() {
  const { category } = useParams()
  const res = useResources()
  const meta = RES_TYPES[category]
  usePageClosing(RES_CLOSING)
  usePageHead(meta ? `${meta.label} | Activepieces` : null, meta?.desc)

  if (!meta) return <NotFound />
  if (!res) return <Loading />
  return <CategoryView key={category} res={res} type={category} meta={meta} />
}

// Exported for the "Keep exploring." section on other pages.
export function KeepExploring({ res, type }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-24 md:px-6 md:pb-32 lg:px-8">
      <div className="flex flex-col gap-5 md:gap-8">
        <h2 className="max-w-3xl font-display text-3xl font-bold text-balance text-ink-900 md:text-4xl">Keep exploring.</h2>
        <div className={RES_GRID}>
          {Object.entries(RES_TYPES)
            .filter(([k]) => k !== type)
            .map(([k, t]) => (
              <Link
                key={k}
                to={`/resources/${k}`}
                className="group flex flex-col gap-1.5 rounded-2xl bg-white p-6 shadow-edge transition-shadow duration-200 ease-out hover:shadow-edge-hover motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
              >
                <span className="flex items-center gap-1.5 text-lg font-semibold text-ink-900">
                  {t.label}
                  <Icon
                    name="solar:alt-arrow-right-linear"
                    className="size-4 text-ink-600 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </span>
                <span className="text-[15px] text-ink-600">
                  {res.counts[k]} {t.noun}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </section>
  )
}

function CategoryView({ res, type, meta }) {
  const [q, setQ] = useState('')
  const [shown, setShown] = useState(STEP)
  const glossary = type === 'glossary'
  const all = useMemo(() => res.items.filter((i) => i.type === type), [res, type])
  const needle = q.trim().toLowerCase()
  const items = useMemo(
    () =>
      needle
        ? all.filter((i) => i.title.toLowerCase().includes(needle) || (i.excerpt || '').toLowerCase().includes(needle))
        : all,
    [all, needle]
  )
  const groups = useMemo(() => {
    if (!glossary) return null
    const m = new Map(LETTERS.map((l) => [l, []]))
    for (const i of items) m.get(letterOf(i.title)).push(i)
    return m
  }, [glossary, items])

  const [faqHeading, faqItems] = FAQS[type]
  const visible = glossary ? items : items.slice(0, shown)

  return (
    <>
      <ResHero
        crumb={
          <ResBreadcrumb
            centered
            className="res-hero-line"
            style={{ '--i': 0 }}
            trail={[{ label: 'Resources', to: '/resources' }, { label: meta.label }]}
          />
        }
        title={meta.h1}
        lede={meta.desc}
        cta={`?ap_cta=resources_${type}_hero&ref=%2Fresources%2F${type}`}
      />
      <section className="mx-auto w-full max-w-7xl px-5 pb-24 md:px-6 md:pb-32 lg:px-8">
        <div className="flex flex-col gap-8">
          <ResSearch
            value={q}
            onChange={(v) => {
              setQ(v)
              setShown(STEP)
            }}
            placeholder={glossary ? 'Search terms' : 'Search by app or task'}
          />
          {glossary && (
            <nav aria-label="Jump to letter" className="flex flex-wrap gap-1">
              {LETTERS.map((l) =>
                groups.get(l).length ? (
                  <a
                    key={l}
                    href={`#${letterId(l)}`}
                    className="flex size-9 items-center justify-center rounded-lg text-sm font-medium text-ink-900 transition-colors duration-200 ease-out hover:bg-ink-950/6 hover:text-ink-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                  >
                    {l}
                  </a>
                ) : (
                  <span
                    key={l}
                    aria-disabled="true"
                    className="pointer-events-none flex size-9 items-center justify-center rounded-lg text-sm font-medium text-ink-300"
                  >
                    {l}
                  </span>
                )
              )}
            </nav>
          )}
          <p className="text-sm text-ink-600" aria-live="polite">
            {glossary
              ? `${items.length} ${items.length === 1 ? meta.one : meta.noun}`
              : `Showing ${visible.length} of ${items.length} ${items.length === 1 ? meta.one : meta.noun}`}
          </p>
          {items.length === 0 ? (
            <ResEmpty q={q.trim()} meta={meta} onClear={() => setQ('')} />
          ) : glossary ? (
            <div className="flex flex-col gap-10">
              {LETTERS.filter((l) => groups.get(l).length).map((l) => (
                <section key={l} id={letterId(l)} className="flex scroll-mt-28 flex-col gap-5">
                  <h2 className="border-b border-ink-950/10 pb-3 font-display text-2xl font-bold text-ink-900">{l}</h2>
                  <div className={RES_GRID}>
                    {groups.get(l).map((i) => (
                      <ResourceCard key={i.slug} to={`/resources/${type}/${i.slug}`} title={i.title} excerpt={i.excerpt} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              <div className={RES_GRID}>
                {visible.map((i) => (
                  <ResourceCard key={i.slug} to={`/resources/${type}/${i.slug}`} title={i.title} excerpt={i.excerpt} />
                ))}
              </div>
              {visible.length < items.length && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShown((s) => s + STEP)}
                    className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-ink-50 px-7 text-base font-medium whitespace-nowrap text-ink-950 shadow-edge transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:bg-ink-100 hover:shadow-edge-hover active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                  >
                    Show more
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <KeepExploring res={res} type={type} />
      <ResourceFaq heading={faqHeading} items={faqItems} />
    </>
  )
}

// §1.8 resources empty state
function ResEmpty({ q, meta, onClear }) {
  return (
    <div className="flex flex-col items-center py-14 text-center md:py-20">
      <h2 className="max-w-xl text-xl font-semibold text-balance text-ink-950 md:text-2xl">
        No {meta.noun} match “{q}”
      </h2>
      <p className="mt-3 max-w-md text-[15px] text-pretty text-ink-600">{meta.empty}</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-ink-50 px-6 text-[15px] font-medium text-ink-950 shadow-edge transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:bg-ink-100 hover:shadow-edge-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
      >
        Clear search
      </button>
    </div>
  )
}
