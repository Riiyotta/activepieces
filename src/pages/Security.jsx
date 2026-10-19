import SecurityHero, { GITHUB_URL, TRUST_URL } from '../components/security/SecurityHero'
import FeatureRows from '../components/security/FeatureRows'
import IconBand from '../components/IconBand'
import Faq from '../components/Faq'
import { usePageClosing } from '../components/PageMetaContext'
import usePageHead from './usePageHead'

// /security (SPEC_MARKETING §4): dark hero (cipher wall) → feature rows (sticky stage) → IconBand → FAQ.

const CARDS = [
  { icon: 'solar:clock-circle-bold', title: 'What we keep', body: 'Your automations, runs, files, documents and connections, kept only as long as you choose.' },
  { icon: 'solar:lock-keyhole-bold', title: 'Always encrypted', body: 'AES-256 on disk and TLS on the wire, with every credential encrypted as its own value.' },
  { icon: 'solar:brain-bold', title: 'Never training data', body: "Your automations, runs, documents and prompts never train a model, ours or anyone else's." },
  { icon: 'solar:checklist-bold', title: 'A full audit trail', body: 'Every action is recorded, by a person or a model, and the trail can stream to your SIEM.' },
  { icon: 'solar:export-bold', title: 'Export it all', body: 'Automations are plain JSON and export through the API, with your tables, files and runs.' },
  {
    icon: 'solar:verified-check-bold',
    title: 'Outside auditors',
    body: `SOC 2 Type 2 and a penetration test from early 2026, with the reports in the [trust center](${TRUST_URL}).`,
  },
]

const FAQ = [
  ['Which regions can it run in?', 'Our cloud runs in Frankfurt by default, and we can host elsewhere if your policy needs it, so ask. Self-hosted, the same enterprise build runs on your own infrastructure in any region you choose, on hardware nobody else shares.'],
  ['Can it run with no outbound internet?', 'Yes. An air-gapped deployment keeps everything inside your network and runs your own model on your own hardware. Short of that, inference can point at any OpenAI-compatible endpoint you operate.'],
  ['Can an agent or a builder read a credential?', 'No. An agent references a connection by name and the platform resolves it inside the worker as the step runs. The value is never returned by the API, never shown back in the interface, and never included in an export.'],
  ['Do you train models on our data?', 'No. Your automations, runs, documents and prompts are never training data. Model input and output are stored in run history like any other step, under the retention window you set.'],
  ['Will you complete our security questionnaire?', 'Yes. Questionnaires and vendor reviews go through our team. The current SOC 2 Type 2 documents are in the trust center if that answers the question sooner.'],
  ['What happens to our data if we leave?', 'Automations are plain JSON and export through the API, along with your tables, files and run history. The core is MIT licensed, so you can keep running the same automations on your own infrastructure.'],
]

const CLOSING = {
  h2: 'Questions from your security team?',
  lede: 'Send the questionnaire over and our team will fill it in. The audit documents are in the trust center.',
  primary: { label: 'Talk to our team', href: '/sales?ap_cta=closing' },
  secondary: { label: 'Read the source', href: GITHUB_URL },
  reassurance: ['SOC 2 Type 2', 'Pen tested in 2026', 'MIT licensed core'],
}

export default function Security() {
  usePageHead(
    'Security | Activepieces',
    'How Activepieces is built: where it runs, what we store, how credentials and execution are isolated, and what your security team can verify for themselves.',
  )
  usePageClosing(CLOSING)
  return (
    <div>
      <SecurityHero />
      <FeatureRows />
      <IconBand section="security_cards" heading="Adopt with confidence" background="gradient" cards={CARDS} />
      <Faq section="security_faq" heading="Where a review usually starts" items={FAQ} />
    </div>
  )
}
