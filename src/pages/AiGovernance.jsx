import GovernanceHero from '../components/governance/GovernanceHero'
import ModelsGrid from '../components/governance/ModelsGrid'
import RolloutDeck from '../components/governance/RolloutDeck'
import CaseAlan from '../components/CaseAlan'
import IconBand from '../components/IconBand'
import Faq from '../components/Faq'
import { usePageClosing } from '../components/PageMetaContext'
import usePageHead from './usePageHead'
import '../components/governance/governance.css'

// /ai-governance (SPEC_MARKETING §5): hero → models grid (scrubbed) → case study Alan → rollout deck
// (pinned) → IconBand (9, solid) → FAQ.

const CARDS = [
  { icon: 'solar:widget-5-bold', title: 'Scoped tool access', body: 'An agent reaches only the individual actions you grant it, never the whole app behind them.' },
  { icon: 'solar:user-check-rounded-bold', title: 'Approval gates', body: 'An agent stops on anything that writes and waits for a person to approve the exact call.' },
  { icon: 'solar:key-bold', title: 'Centralized keys', body: 'Provider keys are held and rotated in one place. Builders pick a model, never a secret.' },
  { icon: 'solar:document-text-bold', title: 'Execution tracing', body: 'Reasoning, tool calls and payloads are kept, so a review reads the run, not a summary.' },
  { icon: 'solar:wallet-money-bold', title: 'Spend governance', body: 'Every run is metered and billed to the project that spent it, under a ceiling you set.' },
  { icon: 'solar:bell-bing-bold', title: 'Operational alerts', body: 'Failures email the people you nominate, and webhooks push run events wherever you want.' },
  { icon: 'solar:users-group-rounded-bold', title: 'SSO, SCIM, RBAC', body: 'Identity from the directory you already run, with roles and access scoped per project.' },
  { icon: 'solar:cloud-bold', title: 'Data residency', body: 'Run on our EU cloud, or deploy the whole platform inside your own network.' },
  { icon: 'solar:shield-check-bold', title: 'Open and audited', body: 'Audited against SOC 2 Type II, with the source on GitHub and the core under MIT.' },
]

const FAQ = [
  ['Can a builder or a model ever see a credential?', 'No. Connections are resolved inside the worker at run time. They are never returned by the API and never shown back in the interface, so a flow can use a credential without anyone reading it.'],
  ['Can we stop business users touching what engineering depends on?', 'Keep those flows in their own project and give the wider organization viewer rights there, or none at all. A project is a boundary, not a label.'],
  ['What happens when someone leaves?', 'SCIM removes them in step with your directory. Deactivating a person revokes access and frees the seat without deleting their projects, so the work they built keeps running.'],
  ['Can we pilot with one team before opening it to everyone?', 'Yes, and it is how most rollouts start. Give one project a narrow role set, watch it in the audit log, then widen the roles rather than rebuilding anything.'],
  ['Can failure alerts reach the on-call we already run?', 'Failure alerts go by email to the addresses you nominate. Beyond that, platform and project webhooks push execution and audit events, every finished run included, to any destination you own, including back into a flow of your own.'],
  ['How much of this can we verify before signing anything?', 'The source is on GitHub, with the core under MIT, so your team can read how permissions, connections and execution are implemented rather than take our description of them on trust.'],
]

const CLOSING = {
  h2: 'Bring AI into your team, with the guardrails.',
  lede: 'Choose the models, scope what agents can reach, and approve anything that matters.',
}

export default function AiGovernance() {
  usePageHead(
    'AI governance | Activepieces',
    'Roles built from 30 permissions and assigned per project, identity from your own directory, an audit log you can stream out, scoped agent tools, central model keys and atomic releases with rollback.',
  )
  usePageClosing(CLOSING)
  return (
    <div className="gov-page">
      <GovernanceHero />
      <ModelsGrid />
      <CaseAlan />
      <RolloutDeck />
      <IconBand section="governance_cards" cards={CARDS} />
      <Faq section="governance_faq" heading="What your security team will ask" items={FAQ} />
    </div>
  )
}
