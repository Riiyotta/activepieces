import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import { buttonClasses } from '../ui/Button'
import { CONTAINER, CatalogCard, FOCUS, SmartLink } from './parts'

// §4.2 catalog-browser. Behaviour from specs/catalog-ref/js/catalog-page+browser+az.*.js.
const PAGE = 24
const SORTS = ['featured', 'name', 'weight']
const collator = new Intl.Collator('en', { sensitivity: 'base' })

const ROW = 'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors duration-200 ease-out motion-reduce:transition-none'
const ROW_ON = 'font-medium text-ink-950'
const ROW_OFF = 'text-ink-900 hover:text-ink-950'
const BOX = 'flex size-4.5 shrink-0 items-center justify-center rounded-sm transition-colors duration-200 ease-out motion-reduce:transition-none'
const BOX_ON = 'bg-ink-950'
const BOX_OFF = 'bg-white ring-1 ring-ink-950/20'

function Check() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="size-3 text-white">
      <path d="M2.6 6.2 4.9 8.5 9.4 3.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const parseCats = (v) =>
  String(v ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
const parseSort = (v) => (SORTS.includes(String(v ?? '')) ? String(v) : 'featured')

export default function CatalogBrowser({ section, entries, facets, copy }) {
  const location = useLocation()
  const navigate = useNavigate()
  const initial = useMemo(() => new URLSearchParams(location.search), []) // eslint-disable-line react-hooks/exhaustive-deps

  const [raw, setRaw] = useState(() => initial.get('q') ?? '')
  const [query, setQuery] = useState(() => (initial.get('q') ?? '').trim().toLowerCase())
  const [cats, setCats] = useState(() => parseCats(initial.get('cat')))
  const [sort, setSort] = useState(() => parseSort(initial.get('sort')))
  const [limit, setLimit] = useState(PAGE)
  const [panelOpen, setPanelOpen] = useState(false)
  const resultsRef = useRef(null)
  const moreRef = useRef(null)
  const moreTop = useRef(null)

  // 120 ms search debounce; clearing applies immediately.
  useEffect(() => {
    const t = raw.trim().toLowerCase()
    if (!t) {
      setQuery('')
      return
    }
    const id = setTimeout(() => setQuery(t), 120)
    return () => clearTimeout(id)
  }, [raw])

  const byName = useMemo(() => [...entries].sort((a, b) => collator.compare(a.title, b.title)), [entries])
  const byWeight = useMemo(
    () => [...entries].sort((a, b) => b.weight - a.weight || collator.compare(a.title, b.title)),
    [entries]
  )
  const sorted = sort === 'name' ? byName : sort === 'weight' ? byWeight : entries
  const filtered = useMemo(() => {
    const sel = new Set(cats)
    if (!sel.size && !query) return sorted
    return sorted.filter((e) => (query && !e.search.includes(query) ? false : !sel.size || e.categories.some((c) => sel.has(c))))
  }, [sorted, cats, query])
  const shown = filtered.slice(0, limit)

  // Filtered list changed: reset the page size; if the results top is above the viewport, scroll to it.
  const firstFilter = useRef(true)
  useEffect(() => {
    if (firstFilter.current) {
      firstFilter.current = false
      return
    }
    setLimit(PAGE)
    const el = resultsRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top
    if (top >= 0) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: window.scrollY + top - 96, behavior: reduce ? 'auto' : 'smooth' })
  }, [filtered])

  // URL sync, 250 ms after query / cats / sort change.
  const firstSync = useRef(true)
  useEffect(() => {
    if (firstSync.current) {
      firstSync.current = false
      return
    }
    const id = setTimeout(() => {
      const p = new URLSearchParams(window.location.search)
      p.delete('q')
      p.delete('cat')
      p.delete('sort')
      if (query) p.set('q', raw.trim())
      if (cats.length) p.set('cat', cats.join(','))
      if (sort !== 'featured') p.set('sort', sort)
      const search = p.toString().replace(/%2C/g, ',')
      navigate({ pathname: window.location.pathname, search: search ? `?${search}` : '' }, { replace: true, preventScrollReset: true })
    }, 250)
    return () => clearTimeout(id)
  }, [query, cats, sort]) // eslint-disable-line react-hooks/exhaustive-deps

  // "Show more": keep the button where it was (scroll-compensate after render).
  const showMore = () => {
    moreTop.current = moreRef.current?.getBoundingClientRect().top ?? null
    setLimit((l) => l + PAGE)
  }
  useLayoutEffect(() => {
    const before = moreTop.current
    moreTop.current = null
    if (before == null || !moreRef.current) return
    const d = moreRef.current.getBoundingClientRect().top - before
    if (Math.abs(d) >= 1) window.scrollBy({ top: d, behavior: 'instant' })
  }, [limit])

  const toggleCat = (k) => setCats((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]))
  const clearAll = () => {
    setCats([])
    setRaw('')
    setQuery('')
  }

  const labels = useMemo(() => new Map(facets.map((f) => [f.key, f.label])), [facets])
  const chips = cats.map((k) => ({ key: k, label: labels.get(k) ?? k }))
  const noun = filtered.length === 1 ? copy.noun : copy.nounPlural
  const hasQ = query.length > 0
  const hasC = cats.length > 0
  const q = `“${raw.trim()}”`
  const emptyTitle =
    hasQ && hasC
      ? `No ${copy.nounPlural} match ${q} in those categories`
      : hasQ
        ? `No ${copy.nounPlural} match ${q}`
        : hasC
          ? cats.length === 1
            ? `No ${copy.nounPlural} in that category`
            : `No ${copy.nounPlural} in those categories`
          : `No ${copy.nounPlural} to show`
  const clearLabel = hasQ && hasC ? 'Clear search and filters' : hasQ ? 'Clear search' : 'Clear filters'

  return (
    <section data-section={section} className={`${CONTAINER} pb-24 md:pb-32`}>
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {facets.length ? (
          <aside className="lg:sticky lg:top-28 lg:w-76 lg:shrink-0 lg:self-start">
            <button
              type="button"
              className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 text-left shadow-edge lg:hidden ${FOCUS}`}
              aria-expanded={panelOpen}
              onClick={() => setPanelOpen((v) => !v)}
            >
              <span className="text-sm font-semibold text-ink-900">
                {' Filter by category '}
                {cats.length ? <span className="text-ink-600">({cats.length})</span> : null}
              </span>
              <Icon
                name="solar:alt-arrow-down-linear"
                className={`size-4 text-ink-600 transition-transform duration-200 ease-out motion-reduce:transition-none${panelOpen ? ' rotate-180' : ''}`}
              />
            </button>
            <div className={`${panelOpen ? 'mt-3' : 'hidden'} lg:mt-0 lg:block`}>
              <div className="flex max-h-[60svh] flex-col rounded-2xl bg-white p-3 shadow-edge lg:max-h-[calc(100svh-9rem)]">
                <div className="flex shrink-0 items-center justify-between gap-3 px-2 py-1.5">
                  <h2 className="text-[13px] font-semibold text-ink-600">Category</h2>
                  {cats.length ? (
                    <button
                      type="button"
                      className={`cursor-pointer rounded-md text-xs leading-[1.33333] font-medium text-ink-600 transition-colors duration-200 ease-out hover:text-ink-950 ${FOCUS} motion-reduce:transition-none`}
                      onClick={() => setCats([])}
                    >
                      Reset
                    </button>
                  ) : null}
                </div>
                <ul className="facet-scroll -mx-1 mt-1 flex min-h-0 flex-col gap-0.5 overflow-y-auto px-1">
                  <li>
                    <button
                      type="button"
                      className={`${ROW} ${cats.length === 0 ? ROW_ON : ROW_OFF} ${FOCUS}`}
                      aria-pressed={cats.length === 0}
                      onClick={() => setCats([])}
                    >
                      <span className={`${BOX} ${cats.length === 0 ? BOX_ON : BOX_OFF}`}>{cats.length === 0 ? <Check /> : null}</span>
                      <span className="min-w-0 flex-1 text-left leading-snug">All categories</span>
                      <span className="shrink-0 text-xs leading-[1.33333] text-ink-600 tabular-nums">{entries.length}</span>
                    </button>
                  </li>
                  {facets.map((f) => {
                    const on = cats.includes(f.key)
                    return (
                      <li key={f.key}>
                        <label
                          className={`${ROW} cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary-700 ${on ? ROW_ON : ROW_OFF}`}
                        >
                          <input type="checkbox" className="sr-only" value={f.key} checked={on} onChange={() => toggleCat(f.key)} />
                          <span className={`${BOX} ${on ? BOX_ON : BOX_OFF}`}>{on ? <Check /> : null}</span>
                          <span className="min-w-0 flex-1 text-left leading-snug">{f.label}</span>
                          <span className="shrink-0 text-xs leading-[1.33333] text-ink-600 tabular-nums">{f.count}</span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </aside>
        ) : null}

        <div ref={resultsRef} className="flex min-w-0 flex-1 flex-col gap-8">
          <label className="relative block">
            <Icon name="solar:magnifer-linear" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-600" />
            <input
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              type="search"
              placeholder={copy.searchPlaceholder}
              aria-label={copy.searchPlaceholder}
              className="w-full rounded-xl border border-ink-950/10 bg-white py-3.5 pr-4 pl-11 text-ink-900 transition-colors duration-200 outline-none placeholder:text-ink-500 focus:border-ink-950/40 motion-reduce:transition-none"
            />
          </label>

          {chips.length ? (
            <div className="chip-scroll -mx-5 -my-1 flex items-center gap-2 overflow-x-auto px-5 py-1 md:-mx-6 md:px-6 lg:hidden">
              {chips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className={`group inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-white py-1.5 pr-2.5 pl-3.5 text-sm whitespace-nowrap text-ink-900 shadow-edge transition-shadow duration-200 ease-out hover:shadow-edge-hover ${FOCUS} motion-reduce:transition-none`}
                  aria-label={`Remove ${c.label} filter`}
                  onClick={() => toggleCat(c.key)}
                >
                  {c.label}{' '}
                  <Icon
                    name="solar:close-circle-linear"
                    className="size-3.5 text-ink-500 transition-colors duration-200 ease-out group-hover:text-ink-950 motion-reduce:transition-none"
                  />
                </button>
              ))}
              <button
                type="button"
                className={`shrink-0 cursor-pointer rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap text-ink-600 transition-colors duration-200 ease-out hover:text-ink-950 ${FOCUS} motion-reduce:transition-none`}
                onClick={() => setCats([])}
              >
                Clear all
              </button>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-600" aria-live="polite">
              {` Showing ${shown.length} of ${filtered.length} ${noun}`}
            </p>
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <span className="hidden sm:inline">Sort by</span>
              <span className="relative inline-flex items-center">
                <select
                  aria-label="Sort by"
                  value={sort}
                  onChange={(e) => setSort(parseSort(e.target.value))}
                  className="cursor-pointer appearance-none rounded-full border border-ink-950/10 bg-white py-2 pr-9 pl-4 text-base text-ink-900 outline-none focus:border-ink-950/40 md:text-sm"
                >
                  <option value="featured">{copy.featuredSort}</option>
                  <option value="name">A to Z</option>
                  <option value="weight">{copy.weightSort}</option>
                </select>
                <Icon name="solar:alt-arrow-down-linear" className="pointer-events-none absolute right-3.5 size-4 text-ink-600" />
              </span>
            </label>
          </div>

          {shown.length ? (
            <div className="flex flex-col gap-10">
              <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6${facets.length ? '' : ' lg:grid-cols-3'}`}>
                {shown.map((e) => (
                  <CatalogCard key={e.slug} entry={e} />
                ))}
              </div>
              {limit < filtered.length ? (
                <div className="flex justify-center">
                  <button ref={moreRef} type="button" className={buttonClasses('lg', 'secondary')} onClick={showMore}>
                    Show more
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center py-14 text-center md:py-20">
              <h3 className="max-w-xl text-xl font-semibold text-balance text-ink-950 md:text-2xl">{emptyTitle}</h3>
              <p className="mt-3 max-w-md text-[15px] text-pretty text-ink-600">{copy.empty.body}</p>
              {hasQ || hasC ? (
                <button type="button" className={buttonClasses('md', 'secondary', 'mt-5')} onClick={clearAll}>
                  {clearLabel}
                </button>
              ) : null}
              <div className="mt-12 w-full max-w-3xl border-t border-ink-950/10 pt-10">
                <h4 className="text-sm font-semibold text-ink-900">{copy.empty.heading}</h4>
                <div className="mt-5 flex flex-col gap-2.5 text-left">
                  {copy.empty.routes.map((r) => {
                    const ext = r.href.startsWith('http')
                    return (
                      <SmartLink
                        key={r.href}
                        to={r.href}
                        target={ext ? '_blank' : undefined}
                        rel={ext ? 'noopener' : undefined}
                        className={`group flex items-center gap-5 rounded-2xl bg-ink-50 p-5 transition-colors duration-200 ease-out hover:bg-ink-100 ${FOCUS} motion-reduce:transition-none md:px-6`}
                      >
                        <span className="flex min-w-0 flex-1 items-start gap-3.5">
                          <Icon name={r.icon} className="mt-0.5 size-5 shrink-0 text-ink-600" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[15px] font-semibold text-ink-950">{r.title}</span>
                            <span className="mt-1.5 block text-sm text-pretty text-ink-600">{r.body}</span>
                          </span>
                        </span>
                        <span className="hidden shrink-0 items-center gap-1 text-sm font-medium whitespace-nowrap text-ink-950 sm:inline-flex">
                          {r.cta}{' '}
                          <Icon
                            name="solar:alt-arrow-right-linear"
                            className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
                          />
                        </span>
                        <Icon name="solar:alt-arrow-right-linear" className="size-4 shrink-0 text-ink-600 sm:hidden" />
                      </SmartLink>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
