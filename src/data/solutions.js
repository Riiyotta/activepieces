// /solutions/:slug page content (SPEC_PRODUCT_SOLUTIONS §14), copied verbatim from the spec.
// cards: [span, title, desc, art, bgPosition, mock] (mock names: src/components/templates/bentoMocks.jsx).
// faq.items: [question, answer]; the first item is open by default.
// Hero visual = SOLUTION_HERO_MOCKS[slug]; caseStudy: fundingSocieties | alan.
export const SOLUTIONS = {
  "marketing": {
    "route": "/solutions/marketing",
    "title": "Marketing automation without engineering | Activepieces",
    "metaDescription": "Connect your CRM, email tool, ads and content stack from 760+ integrations, and launch a campaign without waiting on engineering.",
    "section": "marketing",
    "h1": "Launch campaigns without engineering.",
    "lede": "Connect your CRM, email tool, ads and content stack from 760+ integrations. AI drafts copy and scores leads, and each lead goes to the right list and owner based on where it came from.",
    "ctaKey": "solution_marketing_hero",
    "stageBg": "clouds",
    "grid": {
      "h2": "What a marketing automation can do.",
      "cards": [
        [
          12,
          "Lead Scoring",
          "Score a lead by intent the moment the form is submitted.",
          "clouds",
          "50% 26%",
          "testStepStripe"
        ],
        [
          12,
          "Campaign Reports",
          "Collect spend and performance from every channel on a schedule.",
          "meadow",
          "50% 62%",
          "terminalCompose"
        ],
        [
          9,
          "AI Actions",
          "Summarize, classify and extract data.",
          "water",
          "50% 16%",
          "codeSendQuote"
        ],
        [
          15,
          "760+ Integrations",
          "The ad platforms, CRM, CMS and email tools already on your media plan.",
          "water",
          "50% 30%",
          "approvalRefund"
        ],
        [
          15,
          "Lead Routing",
          "Send a lead down a different path by source, score or campaign.",
          "clouds",
          "50% 58%",
          "runResume"
        ],
        [
          9,
          "Chat and Forms",
          "Add a form or chat page without building one.",
          "iris",
          "50% 100%",
          "mcpServer"
        ]
      ]
    },
    "caseStudy": "fundingSocieties",
    "testimonials": {
      "h2": "Marketing teams already running it."
    },
    "faq": {
      "h2": "What marketing teams ask.",
      "items": [
        [
          "Do I need an engineer to build one?",
          "No. You connect a trigger to the steps you want, add an AI action or a branch, and publish. 760+ integrations cover most marketing tools without any code."
        ],
        [
          "What AI actions can I use in a marketing automation?",
          "Ask AI, summarize text, classify text, extract structured data, generate an image, and run an agent, using whichever provider your admin sets up."
        ],
        [
          "How is this priced for a marketing team?",
          "Free is one person and 1,000 credits a month. Plus is $16 a month billed yearly for 5 people and 10,000 credits. Team is $166 a month billed yearly for the first 25 people, with 50,000 credits, SSO and roles."
        ],
        [
          "Can I bring my own AI key?",
          "Yes, on Plus and above. A call with your own key costs 1 credit instead of 2, 10 or 20."
        ]
      ]
    },
    "closing": {
      "h2": "Launch your next campaign yourself.",
      "lede": "Connect your marketing stack and build the first one free. No card, and no ticket for engineering."
    }
  },
  "sales": {
    "route": "/solutions/sales",
    "title": "Sales automation that keeps the CRM current | Activepieces",
    "metaDescription": "Keep your CRM up to date automatically. Leads are scored and assigned, follow-ups are drafted for a rep to send, and every record is updated as the deal moves.",
    "section": "sales",
    "h1": "Keep your CRM up to date automatically.",
    "lede": "Connect the CRM your reps already use. Leads are scored and assigned by territory or deal size, follow-ups are drafted for a rep to send, and discounts above your limit go to a manager for approval.",
    "ctaKey": "solution_sales_hero",
    "stageBg": "meadow",
    "grid": {
      "h2": "What runs around your pipeline.",
      "cards": [
        [
          12,
          "Draft the Follow-up",
          "An agent writes the follow-up and logs the call summary for a rep to review.",
          "clouds",
          "50% 26%",
          "customersTable"
        ],
        [
          12,
          "Deal Tracking",
          "Track deals and accounts in tables, with no database to set up.",
          "meadow",
          "50% 62%",
          "projectMembers"
        ],
        [
          9,
          "Pipeline as a Tool",
          "Publish it as an MCP server AI tools can call.",
          "water",
          "50% 16%",
          "mcpServer"
        ],
        [
          15,
          "Territory Routing",
          "Assign a deal by territory, size or stage in the same automation.",
          "water",
          "50% 30%",
          "routerTable"
        ],
        [
          15,
          "Discount Approvals",
          "A discount above your limit waits for a manager to approve it.",
          "clouds",
          "50% 58%",
          "tableTriggers"
        ],
        [
          9,
          "Sales and CRM Apps",
          "The CRMs, dialers and enrichment tools you use.",
          "iris",
          "50% 100%",
          "codeSendQuote"
        ]
      ]
    },
    "caseStudy": "alan",
    "testimonials": {
      "h2": "Sales teams already running it."
    },
    "faq": {
      "h2": "What sales teams ask.",
      "items": [
        [
          "Does this replace my CRM?",
          "No, it connects to it and handles the work around it: intake, scoring, routing and keeping records updated."
        ],
        [
          "What can an AI agent actually do for a sales team?",
          "Complete a task for a rep, such as drafting a follow-up email or summarizing a call, using a model your admin sets up."
        ],
        [
          "How is this priced for a sales team?",
          "Plus is $16 a month billed yearly for 5 people and 10,000 credits. Team is $166 a month billed yearly for the first 25 people, then $25 each, with 50,000 credits, SSO and roles. You pay for runs, not seats."
        ],
        [
          "Can I try it before rolling it out to the whole team?",
          "Yes. The Free plan gives one person 1,000 credits a month with no credit card."
        ]
      ]
    },
    "closing": {
      "h2": "Stop the data entry, keep the pipeline current.",
      "lede": "Connect your CRM and let the scoring, routing and updates happen on their own. Free to start."
    }
  },
  "customer-support": {
    "route": "/solutions/customer-support",
    "title": "Support automation with a human handoff | Activepieces",
    "metaDescription": "Connect your helpdesk so every ticket is read and routed on arrival. A chat page answers the common questions, and anything needing judgment goes to an agent.",
    "section": "customer-support",
    "h1": "Route and answer tickets as they arrive.",
    "lede": "Connect your helpdesk and every ticket is read and routed when it arrives. A chat page handles questions with a known answer. Refunds and exceptions go to an agent to decide.",
    "ctaKey": "solution_customer-support_hero",
    "stageBg": "coast",
    "grid": {
      "h2": "What happens before an agent opens the ticket.",
      "cards": [
        [
          12,
          "A Person Decides",
          "The automation pauses whenever someone needs to make the call.",
          "clouds",
          "50% 26%",
          "sendMessageConfig"
        ],
        [
          12,
          "A Chat Page",
          "Answer the common questions directly, and pass the rest on.",
          "meadow",
          "50% 62%",
          "chatShareSettings"
        ],
        [
          9,
          "Ticket Routing",
          "Send a ticket to the right queue by topic, priority or account.",
          "water",
          "50% 16%",
          "codeSendQuote"
        ],
        [
          15,
          "Refund Review",
          "A refund goes out only after someone on your team approves it.",
          "water",
          "50% 30%",
          "approvalRefund"
        ],
        [
          15,
          "Every Ticket Logged",
          "Read any run step by step, and retry it if it failed.",
          "clouds",
          "50% 58%",
          "runResume"
        ],
        [
          9,
          "AI Triage",
          "Classify and summarize a ticket from any step.",
          "iris",
          "50% 100%",
          "mcpServer"
        ]
      ]
    },
    "caseStudy": "fundingSocieties",
    "testimonials": {
      "h2": "Support teams already running it."
    },
    "faq": {
      "h2": "What support teams ask.",
      "items": [
        [
          "Will this fully automate my support queue?",
          "It handles the routine parts: reading, tagging and routing. Anything you want a person to decide waits for them."
        ],
        [
          "What if a ticket needs a real person?",
          "Add an approval step and the automation pauses there. Nothing reaches the customer until someone signs off."
        ],
        [
          "How is this priced for a support team?",
          "Plus is $16 a month billed yearly for 5 people and 10,000 credits. Team is $166 a month billed yearly for the first 25 people, then $25 each, with 50,000 credits, SSO, roles and email support."
        ],
        [
          "Can the chat page reach our own systems?",
          "Yes. It runs an automation, so it reaches whatever that automation reaches, including your helpdesk, CRM and tables."
        ]
      ]
    },
    "closing": {
      "h2": "Let the routine tickets answer themselves.",
      "lede": "Connect your helpdesk, route what arrives, and keep a person on the calls that need one."
    }
  },
  "finance": {
    "route": "/solutions/finance",
    "title": "Finance automation with an audit trail | Activepieces",
    "metaDescription": "Match transactions against the ledger automatically, hold every payment until an approver signs off, and keep a record of what moved and who approved it.",
    "section": "finance",
    "h1": "Approve payments, reconcile the books.",
    "lede": "Connect your accounting and payment tools to match transactions against the ledger. Payments post only after the approver you choose signs off, and every run records what moved and who approved it.",
    "ctaKey": "solution_finance_hero",
    "stageBg": "clouds",
    "grid": {
      "h2": "What you get at the end of the month.",
      "cards": [
        [
          12,
          "Payment Approvals",
          "A payment or journal entry waits for a second person to sign off.",
          "clouds",
          "50% 26%",
          "refundForm"
        ],
        [
          12,
          "Reconciliation Queue",
          "Keep the queue in tables, with no database to set up.",
          "meadow",
          "50% 62%",
          "chatThreadBerlin"
        ],
        [
          9,
          "Scheduled Close",
          "The monthly close is assembled on a schedule you set.",
          "water",
          "50% 16%",
          "mcpServer"
        ],
        [
          15,
          "A Record of Each Run",
          "Every run keeps its inputs and outputs for 30 days.",
          "water",
          "50% 30%",
          "routerTable"
        ],
        [
          15,
          "Separate Duties",
          "Projects and roles decide who can build and who can approve.",
          "clouds",
          "50% 58%",
          "tableTriggers"
        ],
        [
          9,
          "Keep It In-House",
          "Self-host it if the data has to stay with you.",
          "iris",
          "50% 100%",
          "codeSendQuote"
        ]
      ]
    },
    "caseStudy": "alan",
    "testimonials": {
      "h2": "Finance teams already running it."
    },
    "faq": {
      "h2": "What finance teams ask.",
      "items": [
        [
          "How long are run logs kept?",
          "30 days by default on cloud and self-hosted, and up to 365."
        ],
        [
          "Can we require sign-off before a payment goes out?",
          "Yes. Add an approval step and the automation pauses until the person you name approves it."
        ],
        [
          "Do we get audit logs on our plan?",
          "Audit logs are an enterprise feature. Team includes SSO and global connections; audit logs are on the plan above it."
        ],
        [
          "Can we self-host to keep financial data in-house?",
          "Yes, with Docker, Docker Compose or Kubernetes. On our cloud, data is held in Frankfurt."
        ]
      ]
    },
    "closing": {
      "h2": "Close the month with a record of it.",
      "lede": "Match transactions, hold payments for approval, and keep every run. Free to start."
    }
  },
  "hr": {
    "route": "/solutions/hr",
    "title": "HR automation from offer to onboarded | Activepieces",
    "metaDescription": "A form collects the new hire’s details, then every account, introduction and check-in happens on its scheduled date. Offboarding runs the same steps in reverse.",
    "section": "hr",
    "h1": "Onboard and offboard on schedule.",
    "lede": "A form collects the new hire’s details, then each account, introduction and check-in happens on its scheduled date. Offboarding runs the same steps in reverse, and both keep a record.",
    "ctaKey": "solution_hr_hero",
    "stageBg": "meadow",
    "grid": {
      "h2": "What runs between the offer and the last day.",
      "cards": [
        [
          12,
          "Offboarding",
          "Access is removed on the exact date the person leaves.",
          "clouds",
          "50% 26%",
          "testStepStripe"
        ],
        [
          12,
          "Request Routing",
          "Time off, expenses and IT requests each go to the right person.",
          "meadow",
          "50% 62%",
          "terminalCompose"
        ],
        [
          9,
          "Forms and Surveys",
          "Collect details for onboarding, offboarding or feedback.",
          "water",
          "50% 16%",
          "codeSendQuote"
        ],
        [
          15,
          "Manager Sign-off",
          "The automation waits until the right manager approves.",
          "water",
          "50% 30%",
          "approvalRefund"
        ],
        [
          15,
          "One Place to Ask",
          "Give your team a single form or chat page for common requests.",
          "clouds",
          "50% 58%",
          "runResume"
        ],
        [
          9,
          "Handled Carefully",
          "Credentials are encrypted, never exposed.",
          "iris",
          "50% 100%",
          "mcpServer"
        ]
      ]
    },
    "caseStudy": "fundingSocieties",
    "testimonials": {
      "h2": "People teams already running it."
    },
    "faq": {
      "h2": "What HR teams ask.",
      "items": [
        [
          "How many people can use this?",
          "Free is one person. Plus is $16 a month billed yearly for 5 people. Team is $166 a month billed yearly for the first 25, then $25 each. All three are self-serve."
        ],
        [
          "Can this handle sensitive employee data?",
          "Credentials are stored with 256-bit encryption and never exposed through the API. If the data has to stay in your network, self-host the MIT-licensed core."
        ],
        [
          "Does it support a global team?",
          "Yes. The interface is available in 11 languages, including English, Spanish, French, German, Japanese and Chinese."
        ],
        [
          "What if a step needs a manager’s sign-off?",
          "Add an approval step and the automation pauses there until that manager approves it."
        ]
      ]
    },
    "closing": {
      "h2": "Onboard your next hire without a checklist.",
      "lede": "Collect the details once, and let each account and check-in happen on its own date."
    }
  },
  "operations": {
    "route": "/solutions/operations",
    "title": "Ops automation across every handoff | Activepieces",
    "metaDescription": "Keep your systems in sync without manual work. Route each record to the right place, process lists on a schedule, and reuse a step across every automation.",
    "section": "operations",
    "h1": "Keep your systems in sync.",
    "lede": "Route each record to the right place and process lists on a schedule. Build a step once and reuse it in every automation that needs it.",
    "ctaKey": "solution_operations_hero",
    "stageBg": "coast",
    "grid": {
      "h2": "What sits between one tool and the next.",
      "cards": [
        [
          12,
          "Systems in Sync",
          "Keep two tools matching each other without a nightly script.",
          "clouds",
          "50% 26%",
          "customersTable"
        ],
        [
          12,
          "Weekly Reporting",
          "The weekly numbers are gathered and sent out on a schedule.",
          "meadow",
          "50% 62%",
          "projectMembers"
        ],
        [
          9,
          "Queue Tracking",
          "Track where each handoff stands, in tables.",
          "water",
          "50% 16%",
          "mcpServer"
        ],
        [
          15,
          "Runs That Resume",
          "A crash or a deploy picks up from the last finished step.",
          "water",
          "50% 30%",
          "routerTable"
        ],
        [
          15,
          "Reusable Steps",
          "Build a set of steps once and call it from any automation.",
          "clouds",
          "50% 58%",
          "tableTriggers"
        ],
        [
          9,
          "Reporting Tools",
          "Pull numbers from your warehouse and dashboards.",
          "iris",
          "50% 100%",
          "codeSendQuote"
        ]
      ]
    },
    "caseStudy": "alan",
    "testimonials": {
      "h2": "Operations teams already running it."
    },
    "faq": {
      "h2": "What operations teams ask.",
      "items": [
        [
          "Can I chain several tools in one automation?",
          "Yes. One automation can call as many apps as you need, in order or down separate branches, and reuse steps you built elsewhere."
        ],
        [
          "What happens if a step fails partway through?",
          "Each run is saved as it goes, so a crash or a deploy picks it up from the last finished step. You can also open the run, see the error and retry that step."
        ],
        [
          "How is this priced for an ops team?",
          "Plus is $16 a month billed yearly for 5 people and 10,000 credits. Team is $166 a month billed yearly for the first 25 people, then $25 each, with 50,000 credits, SSO, roles and shared connections."
        ],
        [
          "Can we self-host if that is our policy?",
          "Yes, with Docker, Docker Compose or the Kubernetes Helm chart."
        ]
      ]
    },
    "closing": {
      "h2": "Stop moving data between your tools.",
      "lede": "Connect the systems your team runs on and let the handoffs happen on their own."
    }
  },
  "engineering": {
    "route": "/solutions/engineering",
    "title": "Engineering automation you extend in code | Activepieces",
    "metaDescription": "A sandboxed TypeScript step, MCP servers your agents can call, a CLI for building your own integration, and a REST API for the whole platform.",
    "section": "engineering",
    "h1": "Automate with code where you need it.",
    "lede": "Use a sandboxed TypeScript step for anything the integrations don’t cover. Publish an automation as an MCP server your agents and editor can call, build your own integration with the CLI, or use the REST API.",
    "ctaKey": "solution_engineering_hero",
    "stageBg": "clouds",
    "grid": {
      "h2": "What you can extend it with.",
      "cards": [
        [
          12,
          "Automations as MCP Tools",
          "Publish one at /mcp for your agents and editor to call.",
          "clouds",
          "50% 26%",
          "sendMessageConfig"
        ],
        [
          12,
          "pieces-cli",
          "Scaffold, build and publish your own integration in TypeScript.",
          "meadow",
          "50% 62%",
          "chatShareSettings"
        ],
        [
          9,
          "REST API",
          "A documented OpenAPI spec with API-key auth.",
          "water",
          "50% 16%",
          "codeSendQuote"
        ],
        [
          15,
          "Loops and Branches",
          "Work through a list or split on a condition in the same automation.",
          "water",
          "50% 30%",
          "approvalRefund"
        ],
        [
          15,
          "MIT-licensed Core",
          "Everything outside the enterprise directory is yours to read and fork.",
          "clouds",
          "50% 58%",
          "runResume"
        ],
        [
          9,
          "Weekly Releases",
          "Self-hosted releases ship every Monday.",
          "iris",
          "50% 100%",
          "mcpServer"
        ]
      ]
    },
    "caseStudy": "alan",
    "testimonials": {
      "h2": "Engineering teams already running it."
    },
    "faq": {
      "h2": "What engineers ask.",
      "items": [
        [
          "Can I build my own integration?",
          "Yes. The CLI scaffolds and publishes an integration, action or trigger in TypeScript. Community integrations are open source on npm."
        ],
        [
          "How is Code step execution sandboxed?",
          "Each code step runs in its own isolate, which is thrown away when the step finishes. Self-hosted deployments can pick a different execution mode."
        ],
        [
          "Is there an API for everything the UI does?",
          "Yes. A documented OpenAPI spec with API-key auth covers automations, runs, connections and projects, and webhook triggers cover the inbound direction."
        ],
        [
          "What exactly is open source?",
          "The engine, the builder and every integration are MIT licensed. The enterprise directory is under a separate commercial license."
        ]
      ]
    },
    "closing": {
      "h2": "Automate the glue work this afternoon.",
      "lede": "Build it visually, drop into TypeScript where you need to, and self-host the whole thing."
    }
  },
  "it": {
    "route": "/solutions/it",
    "title": "IT automation you can self-host and govern | Activepieces",
    "metaDescription": "Deploy with Docker, Compose or the Kubernetes Helm chart, then control access with SAML SSO, SCIM, roles and audit logs. The core is MIT-licensed.",
    "section": "it",
    "h1": "Run it on your own infrastructure.",
    "lede": "Deploy with Docker, Compose or the Kubernetes Helm chart. Sign in with SAML SSO, provision users with SCIM, scope access by role and project, and keep secrets in your own manager.",
    "ctaKey": "solution_it_hero",
    "stageBg": "meadow",
    "grid": {
      "h2": "What you deploy, and how you control it.",
      "cards": [
        [
          12,
          "SSO and SCIM",
          "Google, GitHub and SAML through Okta, Entra ID or JumpCloud.",
          "clouds",
          "50% 26%",
          "refundForm"
        ],
        [
          12,
          "Roles and Projects",
          "Admin, Editor and Viewer by default, or roles you define.",
          "meadow",
          "50% 62%",
          "chatThreadBerlin"
        ],
        [
          9,
          "Run Isolation",
          "One automation cannot read another’s files.",
          "water",
          "50% 16%",
          "mcpServer"
        ],
        [
          15,
          "Audit Logs",
          "A record of changes to automations, folders, connections and users.",
          "water",
          "50% 30%",
          "routerTable"
        ],
        [
          15,
          "Your Secret Manager",
          "Vault, Conjur, AWS Secrets Manager and 1Password.",
          "clouds",
          "50% 58%",
          "tableTriggers"
        ],
        [
          9,
          "MIT-licensed Core",
          "Everything but the enterprise directory is MIT.",
          "iris",
          "50% 100%",
          "codeSendQuote"
        ]
      ]
    },
    "caseStudy": "fundingSocieties",
    "testimonials": {
      "h2": "IT teams that signed it off."
    },
    "faq": {
      "h2": "What IT teams ask.",
      "items": [
        [
          "What exactly do we have to stand up?",
          "A stateless app, one or more stateless workers, PostgreSQL, Redis, and optionally an S3-compatible bucket. Docker, Docker Compose and Helm all work."
        ],
        [
          "Which identity providers do you support?",
          "SAML 2.0 and Google Workspace. Okta, Entra ID and JumpCloud are documented and tested, and any other SAML 2.0 provider connects the same way."
        ],
        [
          "Where do credentials live?",
          "Encrypted at rest and decrypted inside the worker only while a step runs, or left in your own vault and fetched at run time."
        ],
        [
          "Does self-hosting cost more?",
          "No. The price is the same either way, because what you buy is the license rather than our compute."
        ]
      ]
    },
    "closing": {
      "h2": "Run it on your own infrastructure.",
      "lede": "Docker, Compose or Helm, with SSO, SCIM, roles and audit logs. The core is MIT-licensed."
    }
  },
  "internal-tools": {
    "route": "/solutions/internal-tools",
    "title": "Build internal tools in an afternoon | Activepieces",
    "metaDescription": "A form or chat page for the interface, tables for the data, and a code step for the logic that is specific to you. Publish it and your team gets a link.",
    "section": "internal-tools",
    "h1": "Build internal tools in an afternoon.",
    "lede": "A form or chat page gives you the interface, tables hold the data, and a code step covers logic specific to you. Publish it and your team gets a link, and your agents get an MCP server.",
    "ctaKey": "solution_internal-tools_hero",
    "stageBg": "coast",
    "grid": {
      "h2": "What an internal tool needs, already built.",
      "cards": [
        [
          12,
          "Forms and Chat",
          "An interface for structured input, or for questions in plain words.",
          "clouds",
          "50% 26%",
          "testStepStripe"
        ],
        [
          12,
          "Code Step",
          "Sandboxed TypeScript for the parts specific to your team.",
          "meadow",
          "50% 62%",
          "terminalCompose"
        ],
        [
          9,
          "Available to Agents",
          "Publish it as an MCP server for your agents.",
          "water",
          "50% 16%",
          "codeSendQuote"
        ],
        [
          15,
          "Who Can Use It",
          "Projects and roles decide who can open it and who can edit it.",
          "water",
          "50% 30%",
          "approvalRefund"
        ],
        [
          15,
          "Every Use Logged",
          "Read any run step by step, and retry it if it failed.",
          "clouds",
          "50% 58%",
          "runResume"
        ],
        [
          9,
          "Keep It In-House",
          "Self-host it if the data has to stay with you.",
          "iris",
          "50% 100%",
          "mcpServer"
        ]
      ]
    },
    "caseStudy": "fundingSocieties",
    "testimonials": {
      "h2": "Teams that built their own tools on it."
    },
    "faq": {
      "h2": "What builders ask.",
      "items": [
        [
          "Is this a replacement for a real internal dev tool?",
          "It is a quick way to build a small internal app: a form, a table and a code step, with no infrastructure to set up. For larger custom software it works alongside your stack."
        ],
        [
          "Do non-engineers need help building one of these?",
          "Most of it is built by connecting a trigger to steps, with no code. A code step is there when you need it, and engineering can own just that part."
        ],
        [
          "Can we keep the data in-house?",
          "Yes, with Docker, Docker Compose or the Kubernetes Helm chart."
        ],
        [
          "What does this cost for internal-only use?",
          "One credit per run, whether the automation serves a customer or your own team."
        ]
      ]
    },
    "closing": {
      "h2": "Build the tool your team keeps asking for.",
      "lede": "A form, a table and a code step. Publish it and send your team the link."
    }
  },
  "open-source-developers": {
    "route": "/solutions/open-source-developers",
    "title": "Open source automation, self-hosted | Activepieces",
    "metaDescription": "MIT for the core, a separate commercial license for the enterprise directory. Community edition runs unlimited flows and users, with nothing metered.",
    "section": "open-source-developers",
    "h1": "Self-host the MIT-licensed core for free.",
    "lede": "The core is MIT; only the enterprise directory is licensed separately. Community edition runs unlimited flows and users, with nothing metered.",
    "ctaKey": "solution_open-source-developers_hero",
    "stageBg": "clouds",
    "grid": {
      "h2": "What open source means here.",
      "cards": [
        [
          12,
          "Where the Line Is",
          "The core is MIT. The commercial part is one clearly marked directory.",
          "clouds",
          "50% 26%",
          "customersTable"
        ],
        [
          12,
          "Build an Integration",
          "Scaffold, build and publish one in TypeScript with the CLI.",
          "meadow",
          "50% 62%",
          "projectMembers"
        ],
        [
          9,
          "Execution Modes",
          "Choose the sandbox model that suits each deployment.",
          "water",
          "50% 16%",
          "mcpServer"
        ],
        [
          15,
          "Community Integrations",
          "Every integration is open source and published on npm.",
          "water",
          "50% 30%",
          "routerTable"
        ],
        [
          15,
          "Unlimited Runs",
          "Community edition has no credit system and no cap on runs.",
          "clouds",
          "50% 58%",
          "tableTriggers"
        ],
        [
          9,
          "Fork It",
          "Read the code, change it, and run your own version.",
          "iris",
          "50% 100%",
          "codeSendQuote"
        ]
      ]
    },
    "caseStudy": "alan",
    "testimonials": {
      "h2": "Developers self-hosting it."
    },
    "faq": {
      "h2": "What self-hosters ask.",
      "items": [
        [
          "Is it really open source, or open-core with a catch?",
          "The core is MIT-licensed. The enterprise-licensed code sits in one clearly marked directory and needs a subscription only for production use."
        ],
        [
          "Does the Community edition have limits?",
          "Runs and users are unlimited, with no credit system. It leaves out projects, SSO, audit logs and Git Sync."
        ],
        [
          "How often do self-hosted releases ship?",
          "Every Monday, versioned on Docker Hub and GHCR, so you can pin a version and upgrade when it suits you."
        ],
        [
          "What do we have to run in production?",
          "A stateless app, one or more stateless workers, PostgreSQL, Redis, and optionally an S3-compatible bucket for run logs."
        ]
      ]
    },
    "closing": {
      "h2": "Read the code, then run it yourself.",
      "lede": "MIT-licensed core, self-hosted with Docker or Helm, with nothing metered."
    }
  }
}
