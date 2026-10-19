import { Link, useParams } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import { usePageClosing } from '../../components/PageMetaContext'
import { useResources, formatDate, Loading, SIGNUP } from '../../components/content/data'
import {
  CONTAINER,
  RES_GRID,
  RES_TYPES,
  ReadFullLink,
  ResBreadcrumb,
  ResourceCard,
  ResourceFaq,
  ShareButtons,
  Toc,
} from '../../components/content/parts'
import { RESOURCE_TOC, ResourceBody } from '../../components/content/placeholder'
import usePageHead from '../usePageHead'
import NotFound from '../NotFound'
import { RES_CLOSING } from './ResourcesHub'

const H2 = 'font-display text-3xl font-bold text-balance text-ink-900 md:text-4xl'

// SPEC_CONTENT §8: /resources/:category/:slug
export default function ResourceDetail() {
  const { category, slug } = useParams()
  const res = useResources()
  const meta = RES_TYPES[category]
  const item = res?.items.find((i) => i.type === category && i.slug === slug)
  usePageClosing(RES_CLOSING)
  usePageHead(item ? `${item.title} | Activepieces` : null, item?.excerpt)

  if (!meta) return <NotFound />
  if (!res) return <Loading />
  if (!item) return <NotFound />

  const related = item.related
    .map((r) => res.items.find((i) => i.type === r.type && i.slug === r.slug))
    .filter(Boolean)
    .slice(0, 6)
  // Body FAQs are not stored (faqCount only): placeholder Q/A × min(faqCount, 3).
  const faqs = Array.from({ length: Math.min(item.faqCount || 0, 3) }, (_, i) => [
    `Placeholder question ${i + 1}`,
    'Placeholder answer. The full answer is published on activepieces.com.',
  ])

  return (
    <>
      <div className={CONTAINER}>
        <ResBreadcrumb
          trail={[
            { label: 'Resources', to: '/resources' },
            { label: meta.label, to: `/resources/${category}` },
            { label: item.title },
          ]}
        />
        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
          <article className="max-w-[44rem] min-w-0">
            <header className="flex flex-col gap-5">
              <h1 className="font-display text-4xl font-bold text-balance text-ink-900 md:text-5xl">{item.title}</h1>
              {item.excerpt && <p className="text-lg leading-relaxed text-ink-600">{item.excerpt}</p>}
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-500">
                {item.readingTime && (
                  <>
                    <span>{item.readingTime}</span>
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <span>Updated {formatDate(item.updatedAt)}</span>
              </p>
            </header>
            <div className="mt-8">
              <ResourceBody />
            </div>
            <ReadFullLink href={item.url}>Read the full guide on activepieces.com</ReadFullLink>
            <div className="mt-8 border-t border-ink-950/10 pt-6">
              <ShareButtons title={item.title} url={item.url} variant="bordered" />
            </div>
            <div className="mt-8">
              <aside className="rounded-2xl border border-ink-950/8 bg-ink-950/2 p-7">
                <h2 className="font-display text-xl font-bold text-ink-900">Build this in Activepieces</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-600">
                  Start free with 1,000 credits a month. Connect 760+ pieces, or run the whole thing on your own servers.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={SIGNUP}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-ink-950 px-6 text-[15px] font-medium whitespace-nowrap text-white transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:bg-ink-900 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                  >
                    Start building
                  </a>
                  <a
                    href="/sales"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-ink-50 px-6 text-[15px] font-medium whitespace-nowrap text-ink-950 shadow-edge transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:bg-ink-100 hover:shadow-edge-hover active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                  >
                    Talk to sales
                  </a>
                </div>
              </aside>
            </div>
          </article>
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <Toc entries={RESOURCE_TOC} />
            </div>
          </aside>
        </div>
      </div>

      {faqs.length > 0 && <ResourceFaq key={slug} heading={`Questions about ${item.title}`} items={faqs} />}

      {item.apps.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-5 pb-16 md:px-6 md:pb-20 lg:px-8">
          <div className="flex flex-col gap-5 md:gap-8">
            <h2 className={H2}>Apps in this guide</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
              {item.apps.map((a) => (
                <ResourceCard key={a.path} to={a.path} title={a.title} excerpt={a.excerpt} />
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-5 pb-24 md:px-6 md:pb-32 lg:px-8">
          <div className="flex flex-col gap-5 md:gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className={H2}>{meta.more}</h2>
              <Link
                to={`/resources/${category}`}
                className="group inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm text-ink-900 hover:text-ink-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
              >
                {meta.all}
                <Icon
                  name="solar:alt-arrow-right-linear"
                  className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </Link>
            </div>
            <div className={RES_GRID}>
              {related.map((r) => (
                <ResourceCard key={`${r.type}/${r.slug}`} to={`/resources/${r.type}/${r.slug}`} title={r.title} excerpt={r.excerpt} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
