import { Fragment, useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Faq from '../components/Faq'
import Icon from '../components/ui/Icon'
import { buttonClasses } from '../components/ui/Button'
import NotFound from './NotFound'
import { HeroLogo, useDetail } from './DetailPage'
import { Breadcrumb, CapabilityList, RelatedGrid, usePageSetup } from '../components/catalog/parts'
import { BY_SLUG, DETAIL_CLOSING, automationIdeas, catLabel, signUp } from '../components/catalog/lib'

// SPEC_CATALOG §6: /pieces/:a/:b. Any two distinct known slugs render; a===b or unknown → NotFound.
// Hero renders from pieces.json; ideas/FAQ/related rows wait for both detail files.

function relatedRow(recipes, self, selfName, exclude) {
  return recipes
    .filter((s) => s !== exclude)
    .map((s) => BY_SLUG.get(s))
    .filter(Boolean)
    .slice(0, 6)
    .map((p) => ({
      slug: p.slug,
      to: `/pieces/${self}/${p.slug}`,
      title: `${selfName} + ${p.name}`,
      body: p.desc,
      logos: [{ slug: p.slug, src: p.logo, label: p.name }],
      tag: p.cats[0] ? catLabel(p.cats[0]) : null,
      meta: null,
    }))
}

export default function PairPage() {
  const { a, b } = useParams()
  const { pathname } = useLocation()
  const A0 = BY_SLUG.get(a)
  const B0 = BY_SLUG.get(b)
  const valid = Boolean(A0 && B0 && a !== b)
  const dA = useDetail(valid ? a : null)
  const dB = useDetail(valid ? b : null)
  const ready = dA && dB
  const An = A0?.name
  const Bn = B0?.name

  const ideas = useMemo(() => (ready ? automationIdeas(dA, dB) : []), [ready, dA, dB])
  usePageSetup(valid ? `Connect ${An} and ${Bn}` : null, valid ? DETAIL_CLOSING : null)
  if (!valid || dA === null || dB === null) return <NotFound />

  const crumbs = [
    { label: 'Pieces', to: '/pieces' },
    { label: An, to: `/pieces/${a}` },
    { label: `+ ${Bn}` },
  ]
  const facts = [
    { label: `${An} triggers`, value: A0.t },
    { label: `${An} actions`, value: A0.a },
    { label: `${Bn} triggers`, value: B0.t },
    { label: `${Bn} actions`, value: B0.a },
  ]
  const faq = [
    [`Do I need to write code to connect ${An} and ${Bn}?`, 'No. Pick a trigger on either piece and an action on the other, map the fields, and turn the flow on. Add a code step later only if you want to.'],
    [`Can ${An} and ${Bn} talk in both directions?`, `Yes. Build one flow that starts in ${An} and acts in ${Bn}, and a second that runs the other way, in the same project.`],
    ['Where does this run?', 'On our EU cloud in Frankfurt, or self-hosted on your own infrastructure with Docker or Kubernetes. The MIT-licensed core means there is always an exit.'],
  ]
  const srcRow = ready ? relatedRow(dA.recipes, a, An, b) : []
  const tgtRow = ready ? relatedRow(dB.recipes, b, Bn, a) : []

  return (
    <div key={pathname}>
      <div data-section="recipe-hero" className="mx-auto flex w-full max-w-7xl flex-col items-start px-5 pt-28 pb-24 md:px-6 md:pt-32 md:pb-32 lg:px-8">
        <Breadcrumb crumbs={crumbs} />
        <div className="mt-8 flex items-center gap-4 md:gap-5">
          {[A0, B0].map((p, i) => (
            <Fragment key={p.slug}>
              {i > 0 ? <Icon name="solar:transfer-horizontal-linear" className="size-7 shrink-0 text-ink-400 md:size-8" /> : null}
              <HeroLogo
                src={p.logo}
                name={p.name}
                imgSize="56"
                box="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-ink-950/10 bg-white p-4 md:size-24 md:p-5"
                letterClass="font-display text-2xl font-bold text-ink-600 md:text-3xl"
              />
            </Fragment>
          ))}
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold text-balance text-ink-900 md:text-5xl">{`Connect ${An} to ${Bn}`}</h1>
        <p className="mt-3 max-w-3xl text-xl text-ink-600">
          {`Move data between ${An} and ${Bn} the moment it happens. Build the flow visually, or let AI write it for you, then run it on our cloud or your own infrastructure.`}
        </p>
        <div className="mt-5 flex w-full flex-wrap items-center gap-3 max-sm:*:grow">
          <a href={signUp('recipe_detail_hero', pathname)} className={buttonClasses('lg', 'solid')}>
            Start building
          </a>
          <Link to={`/pieces/${a}`} className={buttonClasses('lg', 'secondary')}>
            {` Explore ${An}`}
          </Link>
          <Link to={`/pieces/${b}`} className={buttonClasses('lg', 'secondary')}>
            {` Explore ${Bn}`}
          </Link>
        </div>
        <dl className="mt-12 grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:mt-16 md:grid-cols-4 md:gap-0 md:divide-x md:divide-ink-950/10">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col gap-1 md:px-6 md:first:pl-0 md:last:pr-0">
              <dt className="text-sm font-semibold tracking-wide text-ink-600 uppercase">{f.label}</dt>
              <dd className="font-display text-3xl font-bold text-ink-900 md:text-4xl">{String(f.value)}</dd>
            </div>
          ))}
        </dl>
      </div>
      {!ready ? (
        <div className="min-h-screen" aria-busy="true" />
      ) : (
        <>
          {ideas.length ? (
            <CapabilityList
              section="recipe-ideas"
              kicker="Automation ideas"
              heading={`What you can build with ${An} and ${Bn}`}
              body={`A few flows teams run between ${An} and ${Bn}. Use one as a starting point, or build your own from scratch.`}
              items={ideas}
              showFields={false}
            />
          ) : null}
          <Faq heading="Questions, answered" items={faq} section="recipe-faq" />
          {srcRow.length ? (
            <RelatedGrid section="recipe-related-source" heading={`More ways to automate ${An}`} entries={srcRow} browseTo={`/pieces/${a}`} browseLabel={`View ${An}`} />
          ) : null}
          {tgtRow.length ? (
            <RelatedGrid section="recipe-related-target" heading={`More ways to automate ${Bn}`} entries={tgtRow} browseTo={`/pieces/${b}`} browseLabel={`View ${Bn}`} />
          ) : null}
        </>
      )}
    </div>
  )
}
