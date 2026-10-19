import { useEffect, useRef, useState } from 'react'
import Icon from '../ui/Icon'
import { buttonClasses } from '../ui/Button'

// /sales form card (SPEC_MARKETING §2, "Form column"; specs/ref/html/sales.ssr.html + sales.e5BFP-yD.js).
// Client-side work-email check only. The clone never submits: a valid form swaps to the "Thanks" state.
const LABEL = 'mb-2 flex items-baseline gap-2 text-sm font-medium text-ink-900'
const FIELD =
  'w-full rounded-xl border border-ink-950/20 bg-white px-4 py-3.5 text-base text-ink-900 placeholder:text-ink-400 transition-colors duration-200 outline-none hover:border-ink-950/35 focus:border-primary-700 focus:ring-2 focus:ring-primary-700/15'
const SELECT = `${FIELD} appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-11 select-chevron`
const SIGN_UP = 'https://cloud.activepieces.com/sign-up'

const FREE_MAIL = new Set([
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'zoho.com',
  'yandex.com',
  'protonmail.com',
  'gmx.com',
  'live.com',
  'me.com',
  'mail.ru',
  'qq.com',
  '163.com',
])

const SOURCES = [
  'Search (Google, Bing, etc)',
  'AI Search (ChatGPT, Claude, etc)',
  'GitHub',
  'A friend or colleague',
  'YouTube',
  'LinkedIn',
  'Reddit',
  'Other',
]

const EMAIL_ERROR = 'Please use your work email so we can tailor the demo.'

// Returns the normalised work email, or null for invalid / free-mail addresses (original's Y()).
function workEmail(value) {
  const v = value.trim().toLowerCase()
  const domain = v.split('@')[1]
  return !domain || !domain.includes('.') || FREE_MAIL.has(domain) ? null : v
}

function Label({ htmlFor, children, required }) {
  return (
    <label htmlFor={htmlFor} className={LABEL}>
      <span>{children}</span>
      {required && (
        <span aria-hidden="true" className="text-ink-400">
          *
        </span>
      )}
    </label>
  )
}

export default function SalesForm() {
  const [view, setView] = useState('form')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')
  const [goal, setGoal] = useState('')
  const [source, setSource] = useState('')
  const [sourceOther, setSourceOther] = useState('')
  const [error, setError] = useState('')
  const emailRef = useRef(null)

  // Autofocus the work email on non-coarse pointers.
  useEffect(() => {
    if (!window.matchMedia('(pointer: coarse)').matches) emailRef.current?.focus()
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!workEmail(email)) {
      setError(EMAIL_ERROR)
      requestAnimationFrame(() => emailRef.current?.focus())
      return
    }
    setView('thanks')
  }

  if (view === 'thanks') {
    return (
      <div>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-ink-600 transition-colors duration-200 hover:text-ink-950"
          onClick={() => setView('form')}
        >
          <Icon name="solar:alt-arrow-left-linear" className="size-4" /> Edit details
        </button>
        <h2 className="mt-5 font-display text-2xl font-bold text-ink-900">Thanks, {firstName || 'there'}</h2>
        <p className="mt-2 text-ink-600">
          Someone from the team will email you within one working day, from an activepieces.com address.
        </p>
        <a href={SIGN_UP} className={buttonClasses('lg', 'secondary', 'mt-8 w-full')}>
          Start building while you wait
        </a>
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <Label htmlFor="email" required>
          Work email
        </Label>
        <input
          ref={emailRef}
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          className={FIELD}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? 'email-error' : undefined}
        />
        {error && (
          <p id="email-error" role="alert" className="mt-1.5 text-sm text-accent-c-700">
            {error}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="first-name" required>
            First name
          </Label>
          <input
            id="first-name"
            type="text"
            name="first_name"
            autoComplete="given-name"
            className={FIELD}
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="last-name" required>
            Last name
          </Label>
          <input
            id="last-name"
            type="text"
            name="last_name"
            autoComplete="family-name"
            className={FIELD}
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="company" required>
          Company
        </Label>
        <input
          id="company"
          type="text"
          name="company"
          autoComplete="organization"
          className={FIELD}
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="goal" required>
          What would you like help with?
        </Label>
        <textarea
          id="goal"
          name="goal"
          rows={4}
          required
          placeholder="The work you want to automate, or the problem you are trying to solve."
          className={`${FIELD} resize-y`}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="source">Where did you hear about us?</Label>
        <select id="source" name="source" className={SELECT} value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">Pick one</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {source === 'Other' && (
          <input
            type="text"
            name="source_other"
            placeholder="Tell us where"
            className={`${FIELD} mt-2`}
            value={sourceOther}
            onChange={(e) => setSourceOther(e.target.value)}
          />
        )}
      </div>
      <button type="submit" className={buttonClasses('lg', 'solid', 'w-full disabled:cursor-not-allowed disabled:opacity-40')}>
        Talk to sales
      </button>
    </form>
  )
}
