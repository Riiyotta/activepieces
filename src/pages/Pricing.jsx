import { useState } from 'react'
import Faq from '../components/Faq'
import { usePageClosing } from '../components/PageMetaContext'
import BillingToggle from '../components/pricing/BillingToggle'
import PlanCards from '../components/pricing/PlanCards'
import SplitRows from '../components/pricing/SplitRows'
import RotatingLogos from '../components/pricing/RotatingLogos'
import CompareTable from '../components/pricing/CompareTable'
import { PRICING_FAQ } from '../components/pricing/pricingData'
import usePageHead from './usePageHead'

// /pricing (SPEC_MARKETING §3): A plans (hero, toggle, cards, Embed/Enterprise rows, logos),
// B compare table, C FAQ. All inside the white -> ink-50 gradient wrapper. Monthly by default.
const CLOSING = {
  h2: 'Pick a plan, and change it whenever.',
  lede: 'Start free with no card. Move up when a flow earns it, and run it on our cloud or your own servers either way.',
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false)
  usePageClosing(CLOSING)
  usePageHead(
    'Pricing | Activepieces',
    'Start free with 1,000 credits a month, upgrade from $16 per month, and scale to enterprise. Open source at the core, with self-hosting on every plan.',
  )

  return (
    <div className="bg-gradient-to-b from-white via-ink-50 to-ink-50">
      <section className="mx-auto w-full max-w-7xl px-5 pt-24 md:px-6 md:pt-26 lg:px-8">
        <div>
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="font-display text-4xl font-bold text-balance text-ink-900 sm:text-5xl lg:text-6xl">Pricing</h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-ink-600">
              A path for every team at your company to build with AI.
            </p>
          </div>
          <BillingToggle annual={annual} onChange={setAnnual} />
          <PlanCards annual={annual} />
          <SplitRows />
          <div className="mt-10">
            <RotatingLogos />
          </div>
        </div>
      </section>
      <CompareTable annual={annual} />
      <Faq heading="Pricing questions." items={PRICING_FAQ} section="pricing-faq" />
    </div>
  )
}
