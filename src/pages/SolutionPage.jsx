import { useParams } from 'react-router-dom'
import { SOLUTIONS } from '../data/solutions'
import TemplateHero from '../components/templates/TemplateHero'
import TemplateBento from '../components/templates/TemplateBento'
import LogoRotator from '../components/templates/LogoRotator'
import { SOLUTION_HERO_MOCKS } from '../components/templates/solutionHeroMocks'
import CaseFundingSocieties from '../components/CaseFundingSocieties'
import CaseAlan from '../components/CaseAlan'
import Testimonials from '../components/Testimonials'
import Faq from '../components/Faq'
import { usePageClosing } from '../components/PageMetaContext'
import NotFound from './NotFound'
import usePageHead from './usePageHead'
import './SolutionPage.css'

// /solutions/:slug (SPEC_PRODUCT_SOLUTIONS §1): Hero (static mock + rotating logos) → Bento (6 cards)
// → Case study → Testimonials → FAQ (4 items).
const CASES = { fundingSocieties: CaseFundingSocieties, alan: CaseAlan }

export default function SolutionPage() {
  const { slug } = useParams()
  const page = SOLUTIONS[slug]
  usePageClosing(page?.closing)
  usePageHead(page?.title, page?.metaDescription)
  if (!page) return <NotFound />
  const CaseStudy = CASES[page.caseStudy]

  return (
    <div className="tpl-page solution-page" key={slug}>
      <TemplateHero
        section={page.section}
        route={page.route}
        h1={page.h1}
        lede={page.lede}
        ctaKey={page.ctaKey}
        stageBg={page.stageBg}
        visual={
          <div aria-hidden="true" className="visual-pad tpl-visual">
            {SOLUTION_HERO_MOCKS[slug]}
          </div>
        }
        below={
          <div className="tpl-line mt-12 w-full md:mt-16" style={{ '--i': 4 }}>
            <LogoRotator />
          </div>
        }
      />
      <TemplateBento section={page.section} h2={page.grid.h2} cards={page.grid.cards} />
      <CaseStudy />
      <Testimonials section={`${page.section}-testimonials`} heading={page.testimonials.h2} />
      <Faq section={`${page.section}-faq`} heading={page.faq.h2} items={page.faq.items} />
    </div>
  )
}
