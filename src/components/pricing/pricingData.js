// /pricing copy and data (SPEC_MARKETING §3; specs/ref/html/pricing.ssr.html, specs/ref/js/pricing.BeJfHQmB.js).

export const SIGN_UP_PRICING = 'https://cloud.activepieces.com/sign-up?ap_cta=pricing&ref=%2Fpricing'
export const SIGN_UP = 'https://cloud.activepieces.com/sign-up'

// Plan cards (§3.A). `exclusive` = the stars-linear "Chat to automation" row.
export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    audience: 'For getting started',
    monthlyPrice: 0,
    annualMonthlyPrice: 0,
    cta: { label: 'Get started', href: SIGN_UP_PRICING },
    inherits: null,
    highlights: [
      { text: '1,000 credits a month', tooltip: 'A fresh 1,000 credits every month, so there is always room to build and test. One credit runs a whole flow.' },
      { text: 'Unlimited flows', tooltip: 'Build as many automations as you want. We never cap the number of flows.' },
      { text: 'Up to 5 users', tooltip: 'Invite up to five teammates to build and run automations together.' },
      {
        text: 'Chat to automation',
        tooltip: 'Chat with your tools and turn the boring work into automations. Still rolling out, so chat may not be on your account yet.',
        exclusive: true,
      },
      { text: 'Flows, Agents, Tables', tooltip: 'Build visual Flows, add Agents and Chat, and keep your data in Tables.' },
      { text: 'MCPs and API access', tooltip: 'Serve your tools to any AI assistant over MCP, and manage Activepieces from your own code over the API.' },
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    audience: 'For daily builders',
    monthlyPrice: 20,
    annualMonthlyPrice: 16,
    cta: { label: 'Get started', href: SIGN_UP_PRICING },
    inherits: 'Free',
    highlights: [
      { text: '10× the Free plan', tooltip: '10,000 credits a month, ten times what the Free plan gets.' },
      { text: 'Then pay as you go', tooltip: 'Keep running past your allowance at $0.007 per credit. Nothing switches off.' },
      { text: 'Up to 5 users', tooltip: 'Invite up to five teammates to build and run automations together.' },
      {
        text: 'Bring your own AI keys',
        tooltip: 'Connect your own AI provider keys and every AI step costs 1 credit. The model cost goes to your AI provider, not to your credits.',
      },
    ],
  },
  {
    id: 'team',
    name: 'Team',
    audience: 'For growing teams',
    monthlyPrice: 200,
    annualMonthlyPrice: 166,
    cta: { label: 'Get started', href: SIGN_UP_PRICING },
    inherits: 'Plus',
    highlights: [
      { text: '5× the Plus plan', tooltip: '50,000 credits a month, then $0.007 per extra credit.' },
      {
        text: 'Unlimited projects',
        tooltip: 'Projects start on Team: separate workspaces for teams, clients, or environments, and you can create as many as you need.',
      },
      { text: '25 users included', tooltip: 'The price is flat, not per seat: twenty-five people for one price.' },
      { text: 'SSO and standard roles', tooltip: 'Single sign-on plus built-in roles to control who can do what.' },
      { text: 'Global connections', tooltip: 'Shared service-account connections available to every project.' },
      { text: 'Email support', tooltip: 'Reach our team by email whenever you need a hand.' },
    ],
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    audience: 'For enterprise scale',
    monthlyPrice: null,
    annualMonthlyPrice: null,
    cta: { label: 'Talk to sales', href: '/sales?selectedPlan=InVsdGltYXRlIg%3D%3D&ap_cta=pricing' },
    inherits: 'Team',
    highlights: [
      {
        text: 'Credits sized to you, yearly',
        tooltip: 'Your allowance runs across the whole year, so a heavy month is covered by a quiet month, and we size the volume to how you run.',
      },
      { text: 'Dedicated workers', tooltip: 'Your own isolated workers on cloud, not shared with anyone else.' },
      { text: 'Execution priority', tooltip: 'Set execution priority per project, so the flows that matter run first.' },
      { text: 'SCIM and custom roles', tooltip: 'Provision users automatically and define exactly what each role is allowed to do.' },
      { text: 'Releases and Git Sync', tooltip: 'Promote changes across environments and keep every flow versioned in your own Git repo.' },
      { text: 'Audit logs and secrets', tooltip: 'Track every action, connect your own secret manager, and govern the whole platform centrally.' },
      { text: 'Dedicated support', tooltip: 'A dedicated contact and priority help from our team.' },
    ],
  },
]

export function planSub(plan, annual) {
  if (plan.monthlyPrice === null) return 'We shape it with you'
  if (plan.monthlyPrice === 0) return 'Free forever, no card'
  return annual ? 'flat per month, billed yearly' : 'flat per month'
}

// Embed / Enterprise rows (§3.A).
export const SPLIT_ROWS = [
  {
    side: 'left',
    name: 'Embed',
    price: 'From $36k a year',
    pitch: 'Put a flow builder, AI agents and 760+ integrations inside your own product, under your own brand.',
    proofs: ['White-label builder', 'One SDK', 'Your pieces and templates'],
    href: '/sales?selectedPlan=ImVtYmVkIg%3D%3D&ap_cta=pricing_embed_band',
  },
  {
    side: 'right',
    name: 'Enterprise control',
    price: 'Custom',
    pitch: "Run Activepieces on your own servers, or fully air-gapped, on your security team's terms.",
    proofs: ['SSO and SCIM', 'Custom RBAC', 'Audit logs', 'Secret managers'],
    href: '/sales?selectedPlan=InVsdGltYXRlIg%3D%3D&ap_cta=pricing_enterprise_band',
  },
]

// Compare table (§3.B). Columns free/plus/team/ultimate; values: string, true (check), false (dash).
export const COMPARE_COLUMNS = [
  { id: 'free', name: 'Free', priceLine: '$0', cta: { label: 'Get started', href: SIGN_UP } },
  { id: 'plus', name: 'Plus', priceLine: '$16/mo', cta: { label: 'Get started', href: SIGN_UP } },
  { id: 'team', name: 'Team', priceLine: '$166/mo', cta: { label: 'Get started', href: SIGN_UP } },
  { id: 'ultimate', name: 'Ultimate', priceLine: 'Talk to us', cta: { label: 'Talk to sales', href: '/sales' } },
]

const all = (v) => [v, v, v, v]
const ultimateOnly = [false, false, false, true]
const teamUp = [false, false, true, true]

export const COMPARE_MATRIX = [
  {
    label: 'Pricing',
    rows: [
      { feature: 'Price', dynamicPrice: true, values: ['$0', '$16/mo', '$166/mo', 'Talk to us'] },
      { feature: 'Hosting', values: all('Cloud or on-prem') },
      { feature: 'How to buy', values: ['Self-serve', 'Self-serve', 'Self-serve', 'Sales'] },
    ],
  },
  {
    label: 'Credits',
    rows: [
      {
        feature: 'Credits included',
        tooltip: 'Credits power runs, tool calls, and AI, never the connectors you use. A fifty-step flow costs the same as a two-step flow.',
        values: ['1,000 a month', '10,000 a month', '50,000 a month', 'Sized with you'],
      },
      {
        feature: 'Credit reset',
        tooltip: 'How often your allowance refreshes. A yearly pool absorbs uneven months instead of capping you in a busy month.',
        values: ['Daily', 'Monthly', 'Monthly', 'Yearly'],
      },
      {
        feature: 'Going over',
        tooltip: 'On Free your flows wait for tomorrow’s credits. On Plus and Team your flows keep running and you pay the per-credit rate.',
        values: ['Waits for tomorrow', '$0.007/credit', '$0.007/credit', 'Volume rates'],
      },
    ],
  },
  {
    label: 'Limits',
    rows: [
      {
        feature: 'Users',
        tooltip: 'We never bill per seat. Team covers 25 people at one flat price.',
        values: ['Up to 5', 'Up to 5', '25 users', 'Unlimited'],
      },
      { feature: 'Flows', values: all('Unlimited') },
    ],
  },
  {
    label: 'Products',
    rows: [
      { feature: 'Flows', values: all(true) },
      { feature: 'Agents and Chat', values: all(true) },
      { feature: 'Tables', values: all(true) },
      { feature: 'MCPs', values: all(true) },
      { feature: 'Projects', values: [false, false, 'Unlimited', 'Unlimited'] },
    ],
  },
  {
    label: 'Capabilities',
    rows: [
      {
        feature: 'Bring your own AI keys',
        tooltip: 'Run AI steps on your own provider keys at 1 credit each. The model cost goes to your AI provider, not to your credits.',
        values: [false, true, true, true],
      },
      { feature: 'Global connections', tooltip: 'Shared service-account connections available to every project.', values: teamUp },
      { feature: 'Team analytics', values: all(true) },
      {
        feature: 'API and SDK',
        tooltip: 'Manage Activepieces from your own code. The API is not needed to trigger a flow, a webhook trigger does that on any plan.',
        values: all(true),
      },
      { feature: 'Releases and Git Sync', values: ultimateOnly },
      { feature: 'Priority execution', tooltip: 'Dedicated workers on cloud for faster, isolated execution.', values: ultimateOnly },
      { feature: 'Per-project execution priority', values: ultimateOnly },
    ],
  },
  {
    label: 'Governance',
    rows: [
      { feature: 'SSO', values: teamUp },
      { feature: 'Standard roles', values: teamUp },
      { feature: 'SCIM', values: ultimateOnly },
      { feature: 'Custom RBAC', values: ultimateOnly },
      { feature: 'Secret managers', values: ultimateOnly },
      { feature: 'Audit logs', values: ultimateOnly },
      { feature: 'Event streaming', values: ultimateOnly },
      { feature: 'Private pieces', values: ultimateOnly },
      {
        feature: 'Credit usage by project',
        tooltip: 'See credit spend broken down by project. Auto recharge takes a monthly limit, but per-project ceilings are not available yet.',
        values: ultimateOnly,
      },
      {
        feature: 'Branding',
        tooltip: 'Put your own logo, colors, and domain on the platform, so Activepieces looks like an internal tool your organization built.',
        values: ultimateOnly,
      },
      { feature: 'Platform governance', values: ultimateOnly },
      { feature: 'Custom terms and invoicing', values: ultimateOnly },
    ],
  },
  {
    label: 'Support',
    rows: [
      { feature: 'Support by humans', values: ['Community', 'Community', 'Email', 'Dedicated'] },
      { feature: 'AI support', tooltip: 'An AI agent that answers product questions in the app. You can turn the agent off.', values: all(true) },
    ],
  },
]

// FAQ "Pricing questions." (§3.C), [question, answer] for the shared Faq component.
export const PRICING_FAQ = [
  [
    'Is the free plan really free?',
    'Yes. No card, no time limit. It is meant for exploring the product and building lightweight automations. You get a fresh 1,000 credits every month, so if you use them all, you wait until the next month.',
  ],
  [
    'What happens when I run out of credits?',
    'Depends on your plan. On Free, your flows stay switched on but any runs past your quota do not go through until credits refresh the next day. On Plus and Team they keep running and you pay for the extra at $0.007 per credit. Ultimate has a yearly pool, so one heavy month is fine.',
  ],
  [
    'Why do AI steps cost more than one credit?',
    'A run is one credit however many steps it has, and AI is the exception that sits on top, because we are paying the model provider on your behalf. A step on a fast model is 2 credits, a smart model is 10, and a frontier model is 20. Agentic actions are 1 credit each. On Plus and up you can connect your own AI provider keys, which drops every AI step to 1 credit and moves the model cost to your provider bill instead of ours.',
  ],
  [
    'Can I cancel, change plans, or add seats anytime?',
    'Yes. Upgrades and added seats take effect immediately and are prorated. Downgrades apply at the end of the billing period so you keep what you paid for.',
  ],
  [
    'What payment methods do you accept?',
    'All major cards on any plan. Team and Ultimate can pay by ACH or wire, and Ultimate can be invoiced with custom terms.',
  ],
  [
    'Why would I pay if I can self-host for free?',
    'Self-hosting decides where Activepieces runs, not what it can do. Community Edition is the automation core on its own. Paying adds the layer you need once more than a couple of people depend on it: controlling who has access, seeing who changed what, keeping teams and clients separate, shipping changes safely, and running Agents and Chat. It also puts our team on the other end instead of a forum.',
  ],
  [
    'What if my tool is not supported?',
    'You are not stuck. Anything with an API works right away through the HTTP piece or a webhook. For a proper integration, pieces are open source TypeScript, so you or we can build one.',
  ],
  [
    'Is my data secure?',
    'Data is encrypted in transit and at rest, and you choose where it lives: our EU cloud in Frankfurt, another region on request, or your own servers. Ultimate adds SCIM, custom roles, audit logs streamed to your SIEM, and your own secret manager. Our SOC 2 program is in progress, so we will not claim a certification we do not hold yet. Ask us and we will send the penetration test summary, our DPA and the current sub-processor list.',
  ],
]
