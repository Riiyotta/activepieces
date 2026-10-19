// /product/:slug page content (SPEC_PRODUCT_SOLUTIONS §14), copied verbatim from the spec.
// cards: [span, title, desc, art, bgPosition, mock] (mock names: src/components/templates/bentoMocks.jsx).
// faq.items: [question, answer]; the first item is open by default.
// visual: hero demo (flowCanvas = FeatureFlowDemo, agentThread = FeatureAgentsDemo, tablesDemo, chatDemo).
export const PRODUCTS = {
  "workflow-builder": {
    "route": "/product/workflow-builder",
    "title": "Build automations without writing code | Activepieces",
    "metaDescription": "Pick a trigger, add the apps and steps you need, and publish. Every run is saved as it goes, so a crash or a deploy picks up from the last finished step, and…",
    "section": "builder",
    "h1": "Build automations without writing code.",
    "lede": "Pick a trigger, add the apps and steps you need, and publish. Runs are saved as they go, so a crash or a deploy doesn't lose work. Every run is kept for 30 days so you can check it and retry.",
    "ctaKey": "builder_hero",
    "stageBg": "clouds",
    "visual": "flowCanvas",
    "columns": [
      [
        "Use the apps you already have",
        "Build from 760+ integrations, and use a code or HTTP step for anything they don’t cover."
      ],
      [
        "Branch and repeat",
        "Send the run down different paths, and repeat a set of steps over every item in a list."
      ],
      [
        "See what every run did",
        "Each run keeps its inputs and outputs for 30 days, so you can retry the step that failed."
      ]
    ],
    "grid": {
      "h2": "What else the builder does.",
      "cards": [
        [
          12,
          "Any Trigger",
          "A webhook, a schedule, an event in one of your apps, or a manual run.",
          "clouds",
          "50% 26%",
          "triggerTypes"
        ],
        [
          12,
          "Test Every Step",
          "Run a single step on real data and read its output before you publish.",
          "meadow",
          "50% 62%",
          "testStepStripe"
        ],
        [
          9,
          "Code Steps",
          "Write TypeScript in any step you need it.",
          "water",
          "50% 16%",
          "codeSendQuote"
        ],
        [
          15,
          "Routers and Loops",
          "Branch on a condition, catch everything else, and repeat steps over a list.",
          "water",
          "50% 30%",
          "routerTable"
        ],
        [
          15,
          "Runs That Resume",
          "A crash or a deploy picks the run up from the last finished step.",
          "clouds",
          "50% 58%",
          "runResume"
        ],
        [
          9,
          "Build by Asking",
          "Describe what you want, and it gets built.",
          "iris",
          "50% 100%",
          "mcpServer"
        ],
        [
          12,
          "Draft and Publish",
          "Publishing locks that version. Editing a live automation opens a new draft.",
          "meadow",
          "22% 34%",
          "versionHistory"
        ],
        [
          12,
          "Open Source",
          "Run the MIT-licensed core yourself with Docker, Compose or the Helm chart.",
          "clouds",
          "50% 12%",
          "terminalCompose"
        ]
      ]
    },
    "faq": {
      "h2": "Common questions.",
      "items": [
        [
          "How many automations can we run at once, and how long can one run take?",
          "There is no cap per organization on our cloud, and no limit in the license when you self-host. Each worker handles 5 jobs at a time, and jobs queue instead of being dropped when you go over. A single run is capped at 10 minutes by default, which you can raise when self-hosting."
        ],
        [
          "When a run fails, how do we find out what happened?",
          "Every run appears on the Runs page with its status, the step it failed on, the error it returned, and the input and output of each step. Everyone in the project gets an email on failure, and a one-step automation can forward that to Slack, Teams or PagerDuty."
        ],
        [
          "Can we call a webhook, and is there an API to manage automations from our own systems?",
          "Both. Every webhook-triggered automation gets its own URL, and with a response step it answers right away, so you can publish one as an HTTP API without code. Separately, each automation is plain JSON you can export and re-import over the REST API, which is on paid plans."
        ],
        [
          "What do we have to stand up to run it on our own infrastructure?",
          "A stateless app, one or more stateless workers, PostgreSQL, Redis, and optionally S3-compatible storage for run logs. Docker, Docker Compose and our Helm chart all work. PostgreSQL is required, and we support containerized deployments only."
        ],
        [
          "What does a run cost?",
          "One credit for the whole run, however many steps it has. Branching, loops and code do not change it. A polling trigger that finds nothing is free, and so are test runs from the builder."
        ]
      ]
    },
    "closing": {
      "h2": "Build your first automation today.",
      "lede": "It takes a few minutes, and the free plan needs no card. Cloud or your own servers."
    }
  },
  "ai-agent-builder": {
    "route": "/product/ai-agent-builder",
    "title": "Let your AI agent do the work in your apps | Activepieces",
    "metaDescription": "Set a goal and choose which apps, automations, MCP servers and files the agent can use. It works out the steps and carries them out, and anything you want to…",
    "section": "ai-agents",
    "h1": "Let your AI agent work in your apps.",
    "lede": "You set the goal and choose which apps, flows and files the agent can use. It decides the steps and carries them out. Anything you want to check first waits for your approval.",
    "ctaKey": "ai_agents_hero",
    "stageBg": "meadow",
    "visual": "agentThread",
    "columns": [
      [
        "You choose its tools",
        "Any app action, one of your own automations, an MCP server, or files you upload for it to read."
      ],
      [
        "Your model, your key",
        "An admin sets up the provider once: OpenAI, Anthropic, Gemini, Azure or Bedrock."
      ],
      [
        "Approval before it acts",
        "Put a person in front of any step that matters. A paused run keeps its place for 30 days."
      ]
    ],
    "grid": {
      "h2": "How you decide what an agent can do.",
      "cards": [
        [
          12,
          "Locked Inputs",
          "Set the values the agent cannot change, and let it fill in the rest.",
          "clouds",
          "50% 26%",
          "sendMessageConfig"
        ],
        [
          12,
          "Your Own Model",
          "OpenAI, Anthropic, Gemini, Azure, Bedrock, or any compatible endpoint.",
          "meadow",
          "50% 62%",
          "aiProviders"
        ],
        [
          9,
          "External MCP",
          "Let the agent use your own MCP servers too.",
          "iris",
          "50% 100%",
          "mcpServer"
        ],
        [
          15,
          "Human Approvals",
          "The run waits for one person to approve. They need no account and no seat.",
          "water",
          "50% 30%",
          "approvalRefund"
        ],
        [
          15,
          "Runs That Resume",
          "Finished steps are kept, and every tool call is written to the run log.",
          "clouds",
          "50% 58%",
          "runResume"
        ],
        [
          9,
          "Custom Tools",
          "Write your own integration in TypeScript.",
          "water",
          "50% 16%",
          "codeSendQuote"
        ],
        [
          12,
          "Hosted Forms",
          "Text, long text, file and toggle fields on a page we host for you.",
          "meadow",
          "22% 34%",
          "refundForm"
        ],
        [
          12,
          "Open Source",
          "Agents work the same on our cloud and on your own instance.",
          "clouds",
          "50% 12%",
          "terminalCompose"
        ]
      ]
    },
    "faq": {
      "h2": "Common questions.",
      "items": [
        [
          "What does an agent come with: memory, our documents, tools?",
          "An instruction, the tools you allow it, and the knowledge you give it. Its tools can be any integration, another of your automations, or your own MCP servers. Knowledge comes from files you upload or tables you keep current. Two limits: it remembers nothing between runs, and there is no live sync from SharePoint, Drive or Notion."
        ],
        [
          "Can we plug in our own models and let IT hold the keys?",
          "Yes. An admin adds the provider credentials once and every project can use them, so nobody else handles a key. OpenAI, Anthropic, Google AI, Azure OpenAI and AWS Bedrock work directly, and anything else connects through the OpenAI-compatible provider with a base URL and key. Admins also choose which models are available."
        ],
        [
          "What does an AI step or an agent tool call cost?",
          "Three things: the run at 1 credit, each AI step at 2, 10 or 20 depending on the model tier, and each agent tool call at 1. A fifty-step automation with no AI in it costs 1 credit."
        ],
        [
          "If we bring our own AI key, do we still pay credits?",
          "It gets cheaper rather than free. An AI step costs 1 credit with your own key, and you pay your provider for the tokens. Calling your own AI service through a custom integration or an HTTP step is not counted as an AI step at all."
        ],
        [
          "Can we point Claude or our own agent at Activepieces and have it build the automations?",
          "Yes. Turn on the project's MCP server in settings and point Claude, Cursor or your own agent at the connection string. It creates and edits automations directly in your project, with nothing to import. It is on paid plans, and it builds them well but not perfectly."
        ]
      ]
    },
    "closing": {
      "h2": "Give your first agent a goal to work on.",
      "lede": "Start free, pick the tools it can use, and approve anything that matters before it runs."
    }
  },
  "tables": {
    "route": "/product/tables",
    "title": "Store your data without setting up a database | Activepieces",
    "metaDescription": "Tables live inside Activepieces and hold up to 10,000 rows each. Your automations create, find and update records, a change to a record starts a run, and your…",
    "section": "tables",
    "h1": "Store your data, no database needed.",
    "lede": "Tables hold up to 10,000 rows each. Your automations create, find and update rows, saving a row can start a run, and your agents can read the same data.",
    "ctaKey": "tables_hero",
    "stageBg": "coast",
    "visual": "tablesDemo",
    "columns": [
      [
        "Add a field like a column",
        "Text, number, date and single-select, added like a column in a spreadsheet."
      ],
      [
        "Your automations use it",
        "Create, find, update and delete records from any step, in tables of up to 10,000 rows."
      ],
      [
        "A change starts a run",
        "Creating, updating or deleting a record starts an automation right away, with no polling."
      ]
    ],
    "grid": {
      "h2": "What you can do with a table.",
      "cards": [
        [
          12,
          "Typed Fields",
          "Text, number, date and single-select. Nothing to migrate or connect.",
          "meadow",
          "50% 62%",
          "typedFields"
        ],
        [
          12,
          "Editable Rows",
          "Edit a row in place, so whoever owns the data can correct it.",
          "water",
          "50% 16%",
          "customersTable"
        ],
        [
          9,
          "Every Operation",
          "Create, find, update, delete and export.",
          "iris",
          "50% 100%",
          "tablesPieceOps"
        ],
        [
          15,
          "Change Triggers",
          "A new, edited or deleted record starts an automation right away.",
          "water",
          "50% 30%",
          "tableTriggers"
        ],
        [
          15,
          "Runs and History",
          "Every write is a step you can read back, kept for 30 days.",
          "clouds",
          "50% 58%",
          "runResume"
        ],
        [
          9,
          "Agents Can Read It",
          "Your agents read and write the same tables over MCP.",
          "clouds",
          "50% 12%",
          "mcpServer"
        ],
        [
          12,
          "Access Control",
          "Projects and roles decide who can edit a record, the same as an automation.",
          "meadow",
          "22% 34%",
          "projectMembers"
        ],
        [
          12,
          "Open Source",
          "Part of the MIT-licensed core, so you can self-host it anywhere.",
          "clouds",
          "50% 30%",
          "terminalCompose"
        ]
      ]
    },
    "faq": {
      "h2": "Common questions.",
      "items": [
        [
          "What can an automation do with a table?",
          "Create, find, update and delete records, filtered by field. A new, edited or deleted record can also start an automation the moment it happens."
        ],
        [
          "What are the limits on a table?",
          "10,000 records and 100 fields per table by default, both raisable when you self-host, and as many tables per project as you like. For data in the megabyte range, pass it between steps as a file."
        ],
        [
          "Can we keep each team's data separate?",
          "Projects are the boundary: someone in one project cannot see another project's records. The separation is logical rather than physical, since projects share an instance. Physical separation means a second instance or a self-hosted deployment."
        ],
        [
          "How long is run and table data kept?",
          "Records stay until you delete them. Run data is kept for 30 days by default and can go up to 365. When you self-host, you set the window yourself."
        ],
        [
          "Is Tables in the open-source edition?",
          "Yes, it is part of the MIT-licensed core, with no separate database to set up. Community Edition leaves out projects, SSO, audit logs, Git Sync and agents."
        ]
      ]
    },
    "closing": {
      "h2": "Put your data next to your work.",
      "lede": "Tables are free on every plan, with nothing to provision. Start with one and connect it."
    }
  },
  "chat": {
    "route": "/product/chat",
    "title": "Let people use your automation from a chat page",
    "metaDescription": "Publishing an automation gives it a chat page with its own link. Someone types a question, the automation runs, and the answer comes back in the same thread…",
    "section": "chat",
    "h1": "Give your automation a chat page.",
    "lede": "Publish an automation and it gets a link you can share. People type a question, the automation runs, and the answer comes back in the same thread with text, files and code. You don't build a front end.",
    "ctaKey": "chat_hero",
    "stageBg": "clouds",
    "visual": "chatDemo",
    "columns": [
      [
        "The answer comes back in the thread",
        "Your automation replies with formatted text, code and links, within a 30-second window."
      ],
      [
        "Files go both ways",
        "People can upload a file in the thread, and a reply can send one back, up to 10 MB."
      ],
      [
        "We host the page",
        "Publishing gives the chat its own URL. There is no front end to build and nothing to deploy."
      ]
    ],
    "grid": {
      "h2": "What the chat page handles for you.",
      "cards": [
        [
          12,
          "A Real Thread",
          "People ask in their own words instead of filling in a form.",
          "clouds",
          "50% 26%",
          "chatThreadBerlin"
        ],
        [
          12,
          "One Public Link",
          "Publishing gives the chat a URL. Drafts stay private until then.",
          "meadow",
          "50% 62%",
          "chatShareSettings"
        ],
        [
          9,
          "Files Both Ways",
          "People upload files, and replies can send files back.",
          "water",
          "50% 16%",
          "chatFile"
        ],
        [
          15,
          "Any Steps In Between",
          "Route by what was asked, call any app, or hand the message to an agent.",
          "water",
          "50% 30%",
          "routerTable"
        ],
        [
          15,
          "Every Message Logged",
          "Each message is a run you can open, read step by step, and retry.",
          "clouds",
          "50% 58%",
          "runResume"
        ],
        [
          9,
          "The Limits",
          "A 30-second reply window and 10 MB per file.",
          "iris",
          "50% 100%",
          "chatLimits"
        ],
        [
          12,
          "Access Control",
          "Only published automations open, and roles still decide who can edit them.",
          "meadow",
          "22% 34%",
          "projectMembers"
        ],
        [
          12,
          "Open Source",
          "The chat trigger and its reply step are part of the MIT-licensed core.",
          "clouds",
          "50% 12%",
          "terminalCompose"
        ]
      ]
    },
    "faq": {
      "h2": "Common questions.",
      "items": [
        [
          "How does an automation answer a chat message?",
          "Each message starts a run. Your steps run in order, and a reply step sends the answer back as formatted text plus an optional file. Each visitor keeps a session id that ties their messages together."
        ],
        [
          "Can someone non-technical build the automation behind it?",
          "Yes. They describe what they want and the assistant builds a real automation, using the accounts and tables already connected in your project. It appears on the canvas for an engineer to review, edit and version."
        ],
        [
          "Is there a limit on response time or size?",
          "The reply has to be sent within 30 seconds. Files are capped at 10 MB each on cloud and 25 MB when you self-host. For work that takes longer, answer straight away and send the result another way."
        ],
        [
          "Who can open a published chat page?",
          "Anyone with the link. The page is public and has no login, so treat the link as the access control. Only published automations open, and project roles decide who can edit the one behind it."
        ],
        [
          "Is the chat trigger in the open-source edition?",
          "Yes. The chat trigger and its reply step are part of the open-source core, with no account to connect."
        ]
      ]
    },
    "closing": {
      "h2": "Give your team a chat page to use.",
      "lede": "Publish an automation and share the link. Free to start, with no front end to build."
    }
  }
}
