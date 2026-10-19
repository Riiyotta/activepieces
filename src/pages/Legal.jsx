import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { usePageClosing } from '../components/PageMetaContext'
import { ReadFullLink } from '../components/content/parts'
import usePageHead from './usePageHead'
import '../components/content/prose.css'

// SPEC_CONTENT §9: /privacy and /terms. No legal text is stored in the clone; the body below is a
// neutral placeholder that mirrors the heading pattern of each document, plus a link to the original.

const LOREM = [
  'This is placeholder text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.',
]

const DOCS = {
  terms: {
    path: '/terms',
    nav: 'Terms of Service',
    full: 'Terms of Service',
    h1: 'Terms of Service & Subscription Agreement',
    lede: 'The agreement that covers your use of Activepieces, whether you run it on our cloud or your own.',
    updated: 'November 29, 2023',
    closing: {
      h2: 'Make something this afternoon.',
      lede: 'Start free with no card, on our cloud in Frankfurt or on servers you run yourself.',
    },
    // numbered all-caps h2s, then an appendix h2 with caps h3s, then "Contact Us"
    sections: [
      { id: '1-definitions', text: 'DEFINITIONS', num: '01', caps: true },
      { id: '2-use-of-the-service', text: 'USE OF THE SERVICE', num: '02', caps: true },
      { id: '3-fees-and-payment', text: 'FEES AND PAYMENT', num: '03', caps: true },
      { id: '4-term-and-termination', text: 'TERM AND TERMINATION', num: '04', caps: true },
      { id: '5-miscellaneous', text: 'MISCELLANEOUS', num: '05', caps: true },
      {
        id: 'appendix-1-placeholder',
        text: 'APPENDIX 1: Placeholder',
        subs: ['PLACEHOLDER SUBSECTION A', 'PLACEHOLDER SUBSECTION B'],
      },
      { id: 'contact-us', text: 'Contact Us' },
    ],
  },
  privacy: {
    path: '/privacy',
    nav: 'Privacy Policy',
    full: 'Privacy Policy',
    h1: 'Privacy Policy',
    lede: 'What personal data we collect, why we collect it, and the choices you have over it.',
    updated: 'January 20, 2026',
    closing: {
      h2: 'Keep your data where you want it.',
      lede: 'Start free with no card, on our cloud in Frankfurt or on servers you run yourself.',
    },
    // Title Case h2s; h5s used as emphasised lead-ins
    sections: [
      { id: 'note-to-customer-end-users', text: 'Note To Customer End Users' },
      { id: 'information-we-collect', text: 'Information We Collect', lead: 'Placeholder lead-in.' },
      { id: 'how-we-use-information', text: 'How We Use Information' },
      { id: 'your-choices', text: 'Your Choices', lead: 'Placeholder lead-in.' },
      { id: 'contacting-activepieces', text: 'Contacting Activepieces' },
    ],
  },
}
const ORDER = ['terms', 'privacy']

export default function Legal({ doc }) {
  const d = DOCS[doc]
  usePageClosing(d.closing)
  usePageHead(`${d.full} | Activepieces`, d.lede)
  const [menuOpen, setMenuOpen] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pt-32 pb-24 md:px-6 md:pt-40 md:pb-32 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-24">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <button
            type="button"
            className="flex min-h-11 w-full items-center justify-between gap-3 rounded-sm border-b border-ink-950/8 text-base text-ink-700 hover:text-ink-900 lg:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
            aria-expanded={menuOpen}
            aria-controls="legal-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            Contents
            <Icon
              name="solar:alt-arrow-down-linear"
              className={`size-4 transition-transform duration-200 motion-reduce:transition-none${menuOpen ? ' rotate-180' : ''}`}
            />
          </button>
          <nav
            id="legal-nav"
            aria-label="Legal documents"
            className={`${menuOpen ? 'block' : 'hidden'} pt-7 lg:block lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto lg:pt-0 lg:pb-10 lg:[scrollbar-gutter:stable]`}
          >
            <p className="border-b border-ink-950/8 pb-5 text-base font-medium text-ink-900">Legal</p>
            <ul className="mt-8 flex flex-col gap-5">
              {ORDER.map((k) => {
                const item = DOCS[k]
                const current = k === doc
                return (
                  <li key={k}>
                    <div className="flex items-center justify-between gap-3">
                      <Link
                        to={item.path}
                        aria-current={current ? 'page' : undefined}
                        className={`block rounded-sm text-lg leading-snug transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 ${
                          current ? 'font-semibold text-ink-900' : 'font-medium text-ink-700 hover:text-ink-900'
                        }`}
                      >
                        {item.nav}
                      </Link>
                      {current && (
                        <button
                          type="button"
                          className="flex size-9 shrink-0 items-center justify-center rounded-sm text-ink-500 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                          aria-label={`Show sections of ${item.nav}`}
                          aria-expanded={tocOpen}
                          aria-controls="legal-toc"
                          onClick={() => setTocOpen((o) => !o)}
                        >
                          <Icon
                            name="solar:alt-arrow-down-linear"
                            className={`size-4 transition-transform duration-200 motion-reduce:transition-none${tocOpen ? ' rotate-180' : ''}`}
                          />
                        </button>
                      )}
                    </div>
                    {current && (
                      <div>
                        <ul id="legal-toc" className={`${tocOpen ? 'flex' : 'hidden'} flex-col gap-5 pt-5`}>
                          {d.sections.map((s) => (
                            <li key={s.id}>
                              <a
                                href={`#${s.id}`}
                                className="block rounded-sm text-base leading-relaxed text-ink-600 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                              >
                                {s.text}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        <article className="max-w-[52rem] min-w-0">
          <header>
            <h1 className="font-display text-4xl font-bold text-balance text-ink-900 md:text-5xl">{d.h1}</h1>
            <p className="mt-3 text-lg text-ink-600">{d.lede}</p>
            <p className="mt-4 text-sm text-ink-600">Last updated {d.updated}</p>
          </header>
          <div className="legal-prose mt-12 max-w-none md:mt-16">
            <p>
              <ReadFullLink href={`https://www.activepieces.com${d.path}`} className="">
                Read the full {d.full} on activepieces.com
              </ReadFullLink>
            </p>
            {d.sections.map((s) => (
              <LegalSection key={s.id} s={s} />
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}

function LegalSection({ s }) {
  return (
    <>
      <h2 id={s.id} className={s.caps ? 'is-caps' : undefined}>
        {s.num && <span className="legal-num">{s.num}</span>}
        {s.text}
      </h2>
      {s.lead && <h5>{s.lead}</h5>}
      <p>{LOREM[0]}</p>
      {!s.subs && <p>{LOREM[1]}</p>}
      {s.subs?.map((t) => (
        <SubSection key={t} text={t} />
      ))}
    </>
  )
}

function SubSection({ text }) {
  return (
    <>
      <h3 className="is-caps">{text}</h3>
      <p>{LOREM[1]}</p>
    </>
  )
}
