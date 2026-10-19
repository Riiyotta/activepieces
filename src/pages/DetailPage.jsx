import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import Faq from '../components/Faq'
import NotFound from './NotFound'
import { buttonClasses } from '../components/ui/Button'
import {
  Breadcrumb,
  CapabilityList,
  GuidesSection,
  InlineCta,
  RelatedGrid,
  SmartLink,
  usePageSetup,
} from '../components/catalog/parts'
import { BY_SLUG, detailCopy, loadDetail, signUp, stubDetail, toEntry } from '../components/catalog/lib'

// SPEC_CATALOG §5: /pieces/:slug and /mcp/:slug.
// Hero renders immediately from pieces.json; the rest waits for /data/pieces/<slug>.json.

// Fetch a detail file; `undefined` while loading, `null` on error.
export function useDetail(slug) {
  const [state, setState] = useState({ slug: null, data: undefined })
  useEffect(() => {
    if (!slug) return
    let live = true
    loadDetail(slug).then(
      (d) => live && setState({ slug, data: d }),
      () => live && setState({ slug, data: null })
    )
    return () => {
      live = false
    }
  }, [slug])
  return state.slug === slug ? state.data : undefined
}

function HeroLogo({ src, name, box, imgSize, letterClass }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className={box}>
      {src && !failed ? (
        <img src={src} alt={`${name} logo`} width={imgSize} height={imgSize} className="size-full object-contain" decoding="async" onError={() => setFailed(true)} />
      ) : (
        <span className={letterClass}>{name.charAt(0)}</span>
      )}
    </span>
  )
}
export { HeroLogo }

function DetailHero({ kind, d, c, section }) {
  const { pathname } = useLocation()
  // While loading, Auth/Updated are unknown: hold their slot with a placeholder so the row does not jump.
  const facts = d.loading ? [...c.facts, { label: 'Updated', value: null }] : c.facts
  return (
    <div data-section={section} className="mx-auto flex w-full max-w-7xl flex-col items-start px-5 pt-28 pb-24 md:px-6 md:pt-32 md:pb-32 lg:px-8">
      <Breadcrumb crumbs={c.crumbs} />
      <div className="mt-8 flex items-center gap-5">
        <HeroLogo
          key={d.slug}
          src={d.logo}
          name={d.name}
          imgSize="40"
          box="flex size-16 shrink-0 items-center justify-center rounded-xl border border-ink-950/10 bg-white p-3"
          letterClass="font-display text-xl font-bold text-ink-600"
        />
        <h1 className="font-display text-4xl font-bold text-balance text-ink-900 md:text-5xl">{c.title}</h1>
      </div>
      <p className="mt-3 max-w-3xl text-xl text-ink-600">{c.lead}</p>
      {c.note ? <p className="mt-2.5 max-w-2xl text-[15px] text-ink-500">{c.note}</p> : null}
      <div className="mt-5 flex w-full flex-wrap items-center gap-3 max-sm:*:grow">
        <a href={signUp(`${kind}_detail_hero`, pathname)} className={buttonClasses('lg', 'solid')}>
          Start building
        </a>
        <SmartLink to={c.crossLinkTo} className={buttonClasses('lg', 'secondary')}>
          {c.crossLinkLabel}
        </SmartLink>
      </div>
      <dl className="mt-12 grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:mt-16 md:grid-cols-3 md:gap-0 md:divide-x md:divide-ink-950/10 lg:grid-cols-5">
        {facts.map((f) => (
          <div key={f.label} className="flex flex-col gap-1 md:px-6 md:first:pl-0 md:last:pr-0">
            <dt className="text-xs leading-[1.33333] font-semibold tracking-wide text-ink-600 uppercase">{f.label}</dt>
            <dd className="text-lg font-semibold text-ink-900">
              {f.value == null ? <span className="cat-skel" aria-hidden="true">October 2026</span> : f.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default function DetailPage({ kind }) {
  const { slug } = useParams()
  const row = BY_SLUG.get(slug)
  const data = useDetail(row ? slug : null)
  const d = data || (row ? stubDetail(row) : null)
  const c = useMemo(() => (d ? detailCopy(kind, d) : null), [kind, d])

  usePageSetup(c?.seoTitle, c?.closing)
  if (!row || data === null) return <NotFound />

  const base = c.base
  const sections = c.sections.filter((s) => s.items.length)
  const related = d.related.map((s) => BY_SLUG.get(s)).filter(Boolean).slice(0, 6).map((p) => toEntry(p, base))
  const pairings =
    kind === 'pieces' && d.pairable
      ? d.recipes
          .map((s) => BY_SLUG.get(s))
          .filter(Boolean)
          .slice(0, 6)
          .map((p) => {
            const e = toEntry(p, '/pieces')
            return {
              ...e,
              to: `/pieces/${d.slug}/${p.slug}`,
              title: `${d.name} + ${e.title}`,
              logos: [{ slug: d.slug, src: d.logo, label: d.name }, ...e.logos],
            }
          })
      : []

  return (
    <div key={`${kind}-${slug}`}>
      <DetailHero kind={kind} d={d} c={c} section={`${kind}-detail-hero`} />
      {d.loading ? (
        // Placeholder while the detail file loads (local fetch; usually a single frame).
        <div className="min-h-screen" aria-busy="true" />
      ) : (
        <>
          <section data-section={`${kind}-detail-about`} className="mx-auto w-full max-w-7xl px-5 py-16 md:px-6 md:py-20 lg:px-8">
            <div className="flex max-w-3xl flex-col gap-4">
              <h2 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">{c.aboutHeading}</h2>
              <p className="text-lg text-ink-600">{c.aboutBody}</p>
            </div>
          </section>
          {sections.map((s) => (
            <CapabilityList
              key={s.kicker}
              section={`${kind}-detail-${s.kicker.toLowerCase()}`}
              kicker={s.kicker}
              heading={s.heading}
              body={s.body}
              items={s.items}
            />
          ))}
          {sections.length ? (
            <InlineCta
              section={`${kind}-detail-cta`}
              title={c.midCta.title}
              body={c.midCta.body}
              primaryLabel={c.midCta.primaryLabel}
              location={`${kind}_detail_mid`}
            />
          ) : null}
          <Faq heading={c.faqHeading} items={c.faq} section={`${kind}-detail-faq`} />
          <GuidesSection section={`${kind}-detail-guides`} heading={`Guides using ${d.name}`} guides={d.guides} />
          {pairings.length ? (
            <RelatedGrid
              section={`${kind}-detail-pairings`}
              heading={`Popular ${d.name} pairings`}
              entries={pairings}
              browseTo={base}
              browseLabel={c.browseAllLabel}
            />
          ) : null}
          {related.length ? (
            <RelatedGrid section={`${kind}-detail-related`} heading={c.relatedHeading} entries={related} browseTo={base} browseLabel={c.browseAllLabel} />
          ) : null}
        </>
      )}
    </div>
  )
}
