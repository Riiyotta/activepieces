import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from '../ui/Icon'
import { buttonClasses } from '../ui/Button'
import { usePageClosing } from '../PageMetaContext'
import { sales, signUp } from './lib'
import './catalog.css'

// Shared catalog components (SPEC_CATALOG §3). Class strings copied from specs/catalog-ref/html + js.

export const CONTAINER = 'mx-auto w-full max-w-7xl px-5 md:px-6 lg:px-8'
export const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700'
const H2 = 'font-display text-3xl font-bold text-balance text-ink-900 md:text-4xl'

// <title> + footer closing copy for the route.
export function usePageSetup(title, closing) {
  usePageClosing(closing)
  useEffect(() => {
    if (!title) return
    const prev = document.title
    document.title = `${title} | Activepieces`
    return () => {
      document.title = prev
    }
  }, [title])
}

// Internal links use the router; external (http) links are plain anchors.
export function SmartLink({ to, children, ...rest }) {
  if (/^https?:/.test(to)) {
    return (
      <a href={to} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to} {...rest}>
      {children}
    </Link>
  )
}

// Logo tile inside a card (§3.1): img, or the first letter on error.
function LogoTile({ logo }) {
  const [failed, setFailed] = useState(false)
  return (
    <span title={logo.label} className="flex size-14 items-center justify-center rounded-xl bg-white p-2.5 ring-1 ring-ink-950/10">
      {logo.src && !failed ? (
        <img src={logo.src} alt={logo.label} width="36" height="36" loading="lazy" decoding="async" className="size-full object-contain" onError={() => setFailed(true)} />
      ) : (
        <span className="text-base font-semibold text-ink-600">{logo.label.charAt(0)}</span>
      )}
    </span>
  )
}

// §3.1
export function CatalogCard({ entry }) {
  return (
    <Link
      to={entry.to}
      className={`group flex h-full flex-col gap-5 rounded-2xl bg-white p-6 shadow-edge transition-shadow duration-200 ease-out hover:shadow-edge-hover ${FOCUS} motion-reduce:transition-none`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {entry.logos.map((l) => (
          <LogoTile key={l.slug} logo={l} />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-balance text-ink-900">{entry.title}</h2>
        {entry.body ? <p className="line-clamp-2 text-[15px] text-ink-600">{entry.body}</p> : null}
      </div>
      {entry.tag || entry.meta ? (
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink-950/10 pt-4">
          {entry.tag ? <span className="truncate text-xs leading-[1.33333] font-medium text-ink-500">{entry.tag}</span> : null}
          {entry.meta ? <span className="shrink-0 text-xs leading-[1.33333] text-ink-600">{entry.meta}</span> : null}
        </div>
      ) : null}
    </Link>
  )
}

// §3.2
export function CapabilityList({ section, kicker, heading, body, items, showFields = true }) {
  return (
    <section data-section={section} className={`${CONTAINER} py-24 md:py-32`}>
      <div className="flex flex-col gap-8 md:gap-10">
        <div className="flex max-w-3xl flex-col gap-3">
          <p className="text-xs leading-[1.33333] font-semibold tracking-wide text-ink-600 uppercase">{kicker}</p>
          <h2 className={H2}>{heading}</h2>
          <p className="text-lg text-ink-600">{body}</p>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {items.map((it, i) => (
            <li key={`${it.name}-${i}`} className="flex flex-col gap-2 rounded-2xl bg-white p-6 shadow-edge">
              <h3 className="text-base font-semibold text-ink-900">{it.displayName}</h3>
              {it.description ? <p className="text-[15px] text-ink-600">{it.description}</p> : null}
              {showFields && it.fields > 0 ? (
                <p className="mt-auto pt-3 text-xs leading-[1.33333] text-ink-600">{`${it.fields} field${it.fields === 1 ? '' : 's'}`}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// §3.3
export function RelatedGrid({ section, heading, entries, browseTo, browseLabel }) {
  return (
    <section data-section={section} className={`${CONTAINER} pb-24 md:pb-32`}>
      <div className="flex flex-col gap-5 md:gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={H2}>{heading}</h2>
          <Link
            to={browseTo}
            className={`group inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm text-ink-900 transition-colors duration-200 ease-out hover:text-ink-950 ${FOCUS} motion-reduce:transition-none`}
          >
            {browseLabel}{' '}
            <Icon name="solar:alt-arrow-right-linear" className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {entries.map((e) => (
            <CatalogCard key={e.slug} entry={e} />
          ))}
        </div>
      </div>
    </section>
  )
}

// §3.5
export function InlineCta({ section, title, body, primaryLabel = 'Start building', location }) {
  const { pathname } = useLocation()
  return (
    <section data-section={section} className={`${CONTAINER} py-12 md:py-16`}>
      <div className="flex flex-col gap-7 rounded-3xl bg-white p-8 shadow-edge md:flex-row md:items-center md:justify-between md:gap-10 md:p-10">
        <div className="flex max-w-2xl flex-col gap-2">
          <h2 className="font-display text-2xl font-bold text-balance text-ink-900 md:text-[28px] md:leading-[1.33333]">{title}</h2>
          <p className="text-base text-pretty text-ink-600 md:text-lg">{body}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 max-sm:*:grow">
          <a href={signUp(location, pathname)} className={buttonClasses('lg', 'brand')}>
            {primaryLabel}
          </a>
          <a href={sales(location)} className={buttonClasses('lg', 'secondary')}>
            Talk to sales
          </a>
        </div>
      </div>
    </section>
  )
}

// §3.6
export function GuidesSection({ section, heading, guides }) {
  if (!guides.length) return null
  return (
    <section data-section={section} className={`${CONTAINER} pb-16 md:pb-20`}>
      <div className="flex flex-col gap-5 md:gap-8">
        <h2 className={H2}>{heading}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {guides.map((g) => (
            <a
              key={g.path}
              href={g.path}
              className={`group flex h-full flex-col gap-2 rounded-2xl bg-white p-6 shadow-edge transition-shadow duration-200 ease-out hover:shadow-edge-hover ${FOCUS} motion-reduce:transition-none`}
            >
              <span className="flex items-start gap-1.5 text-lg font-semibold text-balance text-ink-900">
                {g.title}{' '}
                <Icon
                  name="solar:alt-arrow-right-linear"
                  className="mt-1.5 size-4 shrink-0 text-ink-600 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </span>
              {g.excerpt ? <span className="line-clamp-3 text-[15px] text-ink-600">{g.excerpt}</span> : null}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// §3.7
export function Breadcrumb({ crumbs }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-ink-600">
      {crumbs.map((c, i) => (
        <span key={c.label} className="contents">
          {i > 0 ? <Icon name="solar:alt-arrow-right-linear" className="size-3.5 text-ink-500" /> : null}
          {c.to ? (
            <Link
              to={c.to}
              className={`inline-flex min-h-11 items-center rounded-md transition-colors duration-200 ease-out hover:text-ink-950 ${FOCUS} motion-reduce:transition-none md:min-h-0`}
            >
              {c.label}
            </Link>
          ) : (
            <span className="font-medium text-ink-900">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

// §4.4 link-card-grid
export function CategoryGrid({ section, heading, cards }) {
  return (
    <section data-section={section} className={`${CONTAINER} pb-24 md:pb-32`}>
      <div className="flex flex-col gap-5 md:gap-8">
        <h2 className={`max-w-3xl ${H2}`}>{heading}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className={`group flex flex-col gap-1.5 rounded-2xl bg-white p-6 shadow-edge transition-shadow duration-200 ease-out hover:shadow-edge-hover ${FOCUS} motion-reduce:transition-none`}
            >
              <span className="flex items-center gap-1.5 text-lg font-semibold text-ink-900">
                {c.label}{' '}
                <Icon
                  name="solar:alt-arrow-right-linear"
                  className="size-4 text-ink-600 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </span>
              <span className="text-[15px] text-ink-600">{c.blurb}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// §4.6 az-index. The list is always rendered (crawlable) and toggled with `hidden`.
export function AzIndex({ section, heading, links }) {
  const [open, setOpen] = useState(false)
  return (
    <section data-section={section} className={`${CONTAINER} pb-24 md:pb-32`}>
      <div className="rounded-2xl bg-white px-6 py-5 shadow-edge md:px-8">
        <button
          type="button"
          className={`flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 text-left ${FOCUS}`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-lg font-semibold text-ink-900">{heading}</span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="hidden text-sm text-ink-600 sm:inline">{links.length} entries </span>
            <Icon
              name="solar:alt-arrow-down-linear"
              className={`size-4 text-ink-600 transition-transform duration-200 ease-out motion-reduce:transition-none${open ? ' rotate-180' : ''}`}
            />
          </span>
        </button>
        <nav
          aria-label="Full index"
          className={`${open ? 'az-list grid' : 'hidden'} mt-6 grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3 lg:grid-cols-4`}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`truncate rounded-md text-sm text-ink-600 transition-colors duration-200 ease-out hover:text-ink-950 ${FOCUS} motion-reduce:transition-none`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}
