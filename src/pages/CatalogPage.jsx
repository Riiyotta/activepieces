import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import Faq from '../components/Faq'
import NotFound from './NotFound'
import CatalogBrowser from '../components/catalog/CatalogBrowser'
import { CategoryHero, McpHero, PiecesHero } from '../components/catalog/heroes'
import { AzIndex, CategoryGrid, InlineCta, usePageSetup } from '../components/catalog/parts'
import { CATEGORIES, PIECES, allEntries, catLabel, catalogCopy, toEntry } from '../components/catalog/lib'

// SPEC_CATALOG §4: /pieces, /mcp, /pieces/category/:key, /mcp/category/:key.
// Section order: hero → browser → browser-cta → categories → faq → az (then the closing band).
export default function CatalogPage({ kind }) {
  const { key } = useParams()
  const { pathname } = useLocation()
  const catKey = key ? String(key).toUpperCase() : null

  const model = useMemo(() => {
    const base = `/${kind}`
    if (!catKey) {
      return { copy: catalogCopy(kind), entries: allEntries(base), facets: CATEGORIES, others: CATEGORIES }
    }
    const pieces = PIECES.filter((p) => p.cats.includes(catKey))
    if (!pieces.length) return null
    const category = CATEGORIES.find((c) => c.key === catKey) ?? { key: catKey, label: catLabel(catKey), count: pieces.length }
    return {
      copy: catalogCopy(kind, category),
      entries: pieces.map((p) => toEntry(p, base)),
      facets: [],
      others: CATEGORIES.filter((c) => c.key !== catKey),
    }
  }, [kind, catKey])

  usePageSetup(model?.copy.seoTitle, model?.copy.closing)
  if (!model) return <NotFound />

  const { copy, entries, facets, others } = model
  const cards = others.map((c) => ({ to: `${copy.categoryBase}/${c.key.toLowerCase()}`, label: c.label, blurb: `${c.count} ${copy.categoryUnit}` }))
  const azLinks = [...entries].sort((a, b) => a.title.localeCompare(b.title)).map((e) => ({ label: e.title, to: e.to }))

  return (
    <div key={pathname}>
      {catKey ? (
        <CategoryHero copy={copy} section={`${kind}-hero`} />
      ) : kind === 'mcp' ? (
        <McpHero copy={copy} />
      ) : (
        <PiecesHero copy={copy} />
      )}
      <CatalogBrowser section={`${kind}-browser`} entries={entries} facets={facets} copy={copy} />
      <InlineCta
        section={`${kind}-browser-cta`}
        title={copy.browseCta.title}
        body={copy.browseCta.body}
        primaryLabel={copy.browseCta.primaryLabel}
        location={`catalog_${kind}_browser`}
      />
      {cards.length ? <CategoryGrid section={`${kind}-categories`} heading={copy.categoryHeading} cards={cards} /> : null}
      <Faq heading={copy.faqHeading} items={copy.faq} section={`${kind}-faq`} />
      <AzIndex section={`${kind}-az`} heading={copy.azHeading} links={azLinks} />
    </div>
  )
}
