import { useState } from 'react'
import Hero from '../components/Hero'
import AppMockup from '../components/AppMockup'
import Dream from '../components/Dream'
import CaseFundingSocieties from '../components/CaseFundingSocieties'
import CtaShip from '../components/CtaShip'
import FeatureAgents from '../components/FeatureAgents'
import FeatureFlow from '../components/FeatureFlow'
import BentoPlatform from '../components/BentoPlatform'
import CtaRollout from '../components/CtaRollout'
import CaseAlan from '../components/CaseAlan'
import FeaturePieces from '../components/FeaturePieces'
import BentoSecond from '../components/BentoSecond'
import Testimonials from '../components/Testimonials'
import Faq from '../components/Faq'
import UseInAiDialog from '../components/UseInAiDialog'

export default function Home() {
  const [aiDialogOpen, setAiDialogOpen] = useState(false)

  return (
    <div>
      <Hero onUseInAi={() => setAiDialogOpen(true)} />
      <AppMockup />
      <Dream />
      <CaseFundingSocieties />
      <CtaShip />
      <FeatureAgents />
      <FeatureFlow />
      <BentoPlatform />
      <CtaRollout />
      <CaseAlan />
      <FeaturePieces />
      <BentoSecond />
      <Testimonials />
      <Faq />
      <UseInAiDialog open={aiDialogOpen} onClose={() => setAiDialogOpen(false)} />
    </div>
  )
}
