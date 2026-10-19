import { useParams } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import TemplateHero, { HeroColumns } from '../components/templates/TemplateHero'
import TemplateBento from '../components/templates/TemplateBento'
import TablesDemo from '../components/templates/TablesDemo'
import ChatDemo from '../components/templates/ChatDemo'
import FeatureFlowDemo from '../components/FeatureFlowDemo'
import FeatureAgentsDemo from '../components/FeatureAgentsDemo'
import Faq from '../components/Faq'
import { usePageClosing } from '../components/PageMetaContext'
import NotFound from './NotFound'
import usePageHead from './usePageHead'
import './ProductPage.css'
// Scoped CSS of the reused homepage demos ([data-section='builder'|'agents'] rules)
import '../components/FeatureFlow.css'
import '../components/FeatureAgents.css'

// /product/:slug (SPEC_PRODUCT_SOLUTIONS §1): Hero (demo + 3 columns) → Bento (8 cards) → FAQ (5 items).
const VISUALS = {
  flowCanvas: [FeatureFlowDemo, 'builder'],
  agentThread: [FeatureAgentsDemo, 'agents'],
  tablesDemo: [TablesDemo, undefined],
  chatDemo: [ChatDemo, undefined],
}

export default function ProductPage() {
  const { slug } = useParams()
  const page = PRODUCTS[slug]
  usePageClosing(page?.closing)
  usePageHead(page?.title, page?.metaDescription)
  if (!page) return <NotFound />
  const [Visual, scope] = VISUALS[page.visual]

  return (
    <div className="tpl-page product-page" key={slug}>
      <TemplateHero
        section={page.section}
        route={page.route}
        h1={page.h1}
        lede={page.lede}
        ctaKey={page.ctaKey}
        stageBg={page.stageBg}
        scope={scope}
        visual={<Visual />}
        below={<HeroColumns columns={page.columns} />}
      />
      <TemplateBento section={page.section} h2={page.grid.h2} cards={page.grid.cards} />
      <Faq section={`${page.section}-faq`} heading={page.faq.h2} items={page.faq.items} />
    </div>
  )
}
