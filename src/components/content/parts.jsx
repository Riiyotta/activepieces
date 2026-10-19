import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import { formatDate } from './data'
import './content.css'
import './prose.css'

const FOCUS = 'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-700'

// §1.1 page container (blog listings, article, resource detail)
export const CONTAINER = 'mx-auto w-full max-w-7xl px-5 pt-28 pb-24 md:px-6 md:pt-32 md:pb-32 lg:px-8'

// §1.2 Hero cover: cover background with the post title as live text.
export function HeroCover({ post, as: Tag = 'h3', kicker, banner = false, eager = false, priority = false, className = '' }) {
  const { cover } = post
  const size = ((banner ? 4.4 : 6) * (cover.titleScale ?? 1)).toFixed(2)
  return (
    <div
      className={`hero-cover relative isolate w-full overflow-hidden ink-${cover.ink === 'light' ? 'light' : 'dark'}${banner ? ' banner' : ''} ${className}`}
      style={{ '--title-size': `${size}cqw` }}
    >
      <img
        className="absolute inset-0 -z-10 size-full object-cover"
        src={cover.local}
        alt=""
        aria-hidden="true"
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchpriority: 'high' } : {})}
      />
      <div className="col">
        {kicker && !banner && <div className="kicker font-sans font-semibold uppercase">{kicker}</div>}
        <Tag className="title font-display font-bold text-balance">{post.title}</Tag>
      </div>
    </div>
  )
}

// §1.3 cover frame
export function CoverFrame({ featured = false, children }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-ink-950/8 bg-ink-950/3 transition-transform duration-500 ease-smooth motion-reduce:transition-none ${
        featured ? 'group-hover:scale-[1.01]' : 'group-hover:scale-[1.02]'
      }`}
    >
      {children}
    </div>
  )
}

const Dot = () => <span aria-hidden="true">·</span>

// §1.4 post card
export function PostCard({ post }) {
  const cat = post.categories[0]
  return (
    <article className="group flex flex-col">
      <Link
        to={`/blog/${post.slug}`}
        className="flex flex-col gap-4 rounded-2xl outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-700"
      >
        <CoverFrame>
          <HeroCover post={post} as="h3" />
        </CoverFrame>
        <div className="flex flex-col gap-2">
          {cat && <p className="text-xs font-medium text-primary-800">{cat.name}</p>}
          {post.excerpt && <p className="line-clamp-2 text-sm leading-relaxed text-ink-600">{post.excerpt}</p>}
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-ink-500">
            <span>{post.author.name}</span>
            <Dot />
            <span>{formatDate(post.publishedAt)}</span>
            {post.readingTime && (
              <>
                <Dot />
                <span>{post.readingTime}</span>
              </>
            )}
          </p>
        </div>
      </Link>
    </article>
  )
}

export function PostGrid({ posts, className = 'mt-12' }) {
  return (
    <div className={`${className} grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3`}>
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  )
}

// §1.5 category pills. `active` = category slug, or null for "All".
export function CategoryPills({ categories, active }) {
  const pill = (on) =>
    `rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-in-out outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 ${
      on ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-950/10 text-ink-600 hover:bg-ink-950/4 hover:text-ink-900'
    }`
  return (
    <nav aria-label="Categories" className="flex flex-wrap gap-2">
      <Link to="/blog" className={pill(!active)} aria-current={!active ? 'page' : undefined}>
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          to={`/blog/category/${c.slug}`}
          className={pill(active === c.slug)}
          aria-current={active === c.slug ? 'page' : undefined}
        >
          {c.name}
        </Link>
      ))}
    </nav>
  )
}

// §1.6 pagination. href(p) builds each page's path.
export function Pagination({ current, pages, href }) {
  if (pages <= 1) return null
  const item =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700'
  const normal = `${item} border-ink-950/10 text-ink-600 hover:bg-ink-950/4 hover:text-ink-900`
  const disabled = `${item} pointer-events-none border-transparent text-ink-300`
  const list = []
  let gap = false
  for (let p = 1; p <= pages; p++) {
    if (Math.abs(p - current) <= 1 || p === 1 || p === pages) {
      list.push(p)
      gap = false
    } else if (!gap) {
      list.push(`gap-${p}`)
      gap = true
    }
  }
  return (
    <div className="mt-12 flex justify-center">
      <nav aria-label="Pagination" className="flex flex-wrap items-center gap-2">
        {current > 1 ? (
          <Link to={href(current - 1)} className={normal} rel="prev">
            Previous
          </Link>
        ) : (
          <span className={disabled} aria-disabled="true">
            Previous
          </span>
        )}
        {list.map((p) =>
          typeof p === 'string' ? (
            <span key={p} className="px-1 text-sm text-ink-400">
              …
            </span>
          ) : p === current ? (
            <span key={p} className={`${item} border-ink-900 bg-ink-900 text-white`} aria-current="page">
              {p}
            </span>
          ) : (
            <Link key={p} to={href(p)} className={normal}>
              {p}
            </Link>
          )
        )}
        {current < pages ? (
          <Link to={href(current + 1)} className={normal} rel="next">
            Next
          </Link>
        ) : (
          <span className={disabled} aria-disabled="true">
            Next
          </span>
        )}
      </nav>
    </div>
  )
}

// §1.8 blog empty state
export function BlogEmpty({ message, hint }) {
  return (
    <div className="mt-12 rounded-2xl border border-dashed border-ink-950/12 px-6 py-20 text-center">
      <p className="text-ink-600">{message}</p>
      {hint && <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-500">{hint}</p>}
    </div>
  )
}

// §1.9 share buttons. variant: 'compact' (article meta row) | 'bordered' (bottom share row)
export function ShareButtons({ title, url, variant = 'compact' }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef()
  useEffect(() => () => clearTimeout(timer.current), [])
  const cls =
    variant === 'compact'
      ? 'inline-flex size-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 ease-in-out hover:bg-ink-950/5 hover:text-ink-900'
      : 'inline-flex size-9 items-center justify-center rounded-lg border border-ink-950/10 bg-white text-ink-600 transition-colors duration-200 ease-in-out hover:bg-ink-950/4 hover:text-ink-900'
  const focus = ' focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700'
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* clipboard unavailable: still show the state */
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className={`flex items-center ${variant === 'compact' ? 'gap-0.5' : 'gap-2'}`}>
      {variant === 'bordered' && <span className="mr-1 text-sm text-ink-500">Share</span>}
      <a
        className={cls + focus}
        href={`https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
      >
        <Icon name="simple-icons:x" className="size-4" />
      </a>
      <a
        className={cls + focus}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >
        <Icon name="simple-icons:linkedin" className="size-4" />
      </a>
      <button type="button" className={cls + focus} onClick={copy} aria-label={copied ? 'Link copied' : 'Copy link'}>
        <Icon name={copied ? 'solar:check-read-linear' : 'solar:link-linear'} className="size-4" />
      </button>
    </div>
  )
}

// §1.10 "On this page" TOC with scroll-spy. entries: [{ id, text }]. Renders nothing below 3 entries.
export function Toc({ entries }) {
  const [open, setOpen] = useState(true)
  const [active, setActive] = useState(entries[0]?.id)
  const key = entries.map((e) => e.id).join('|')

  useEffect(() => {
    const els = entries.map((e) => document.getElementById(e.id)).filter(Boolean)
    if (!els.length) return
    const seen = new Map()
    const io = new IntersectionObserver(
      (records) => {
        for (const r of records) {
          if (r.isIntersecting) seen.set(r.target.id, r.boundingClientRect.top)
          else seen.delete(r.target.id)
        }
        let best = null
        let top = Infinity
        for (const [id, t] of seen) if (t < top) (top = t), (best = id)
        if (best) setActive(best)
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (entries.length < 3) return null
  return (
    <nav aria-label="On this page" className="flex min-h-0 flex-col gap-3">
      <button
        type="button"
        className={`group flex w-full items-center justify-between gap-2 rounded-md text-left text-sm font-medium text-ink-900 hover:text-ink-950 ${FOCUS} focus-visible:outline-offset-2`}
        aria-expanded={open}
        aria-controls="toc-list"
        onClick={() => setOpen((o) => !o)}
      >
        On this page
        <Icon
          name="solar:alt-arrow-down-linear"
          className={`size-4 text-ink-500 transition-transform duration-200 ease-smooth group-hover:text-ink-700 motion-reduce:transition-none${
            open ? '' : ' -rotate-90'
          }`}
        />
      </button>
      <ul
        id="toc-list"
        className="flex max-h-[calc(100vh-16rem)] min-h-0 flex-1 flex-col overflow-y-auto border-l border-ink-950/10"
        style={open ? undefined : { display: 'none' }}
      >
        {entries.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              className={`-ml-px block border-l-2 py-1.5 text-sm leading-snug transition-colors duration-200 ease-in-out outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-700 ${
                e.depth === 3 ? 'pl-7' : 'pl-4'
              } ${
                active === e.id
                  ? 'border-primary-700 font-medium text-ink-900'
                  : 'border-transparent text-ink-600 hover:border-ink-950/25 hover:text-ink-900'
              }`}
              aria-current={active === e.id ? 'location' : undefined}
            >
              {e.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// §5.4 clone addition: outbound "Read the full … on activepieces.com" link.
export function ReadFullLink({ href, children, className = 'mt-10' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`read-full ${className} inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary-800 underline decoration-primary-800/35 underline-offset-[3px] transition-[text-decoration-color] duration-200 ease-smooth hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700`}
    >
      {children}
      <Icon name="solar:arrow-right-up-linear" className="size-4" />
    </a>
  )
}

// §1.12 resource card
export function ResourceCard({ to, title, excerpt }) {
  const external = /^https?:/.test(to)
  const Comp = external ? 'a' : Link
  const props = external ? { href: to } : { to }
  return (
    <Comp
      {...props}
      className="group flex h-full flex-col gap-2 rounded-2xl bg-white p-6 shadow-edge transition-shadow duration-200 ease-out hover:shadow-edge-hover motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
    >
      <span className="flex items-start gap-1.5 text-lg font-semibold text-balance text-ink-900">
        {title}
        <Icon
          name="solar:alt-arrow-right-linear"
          className="mt-1.5 size-4 shrink-0 text-ink-600 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </span>
      {excerpt && <span className="line-clamp-3 text-[15px] text-ink-600">{excerpt}</span>}
    </Comp>
  )
}

export const RES_GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3'

// §1.13 resources FAQ accordion: rows are independent, first open, panel toggles instantly (display).
// (The homepage Faq component is single-open with a height animation, so it is not reused here.)
export function ResourceFaq({ heading, items }) {
  const [open, setOpen] = useState(() => new Set([0]))
  const toggle = (i) =>
    setOpen((s) => {
      const n = new Set(s)
      n.has(i) ? n.delete(i) : n.add(i)
      return n
    })
  return (
    <section className="px-5 py-24 md:px-6 md:py-32 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 md:mb-8">
          <h2 className="font-display text-3xl font-bold text-balance text-ink-900 md:text-4xl">{heading}</h2>
        </div>
        <div className="flex flex-col gap-3">
          {items.map(([q, a], i) => {
            const isOpen = open.has(i)
            return (
              <div key={i} className="rounded-2xl bg-white px-5 shadow-edge sm:px-6">
                <button
                  type="button"
                  id={`faq-q${i}`}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                  aria-expanded={isOpen}
                  aria-controls={`faq-a${i}`}
                  onClick={() => toggle(i)}
                >
                  <span className="text-lg font-semibold text-ink-900">{q}</span>
                  <Icon
                    name="solar:add-linear"
                    className={`size-5 shrink-0 text-ink-600 transition-transform duration-200 motion-reduce:transition-none${
                      isOpen ? ' rotate-45' : ''
                    }`}
                  />
                </button>
                <div id={`faq-a${i}`} role="region" aria-labelledby={`faq-q${i}`} hidden={!isOpen}>
                  <p className="pb-5 text-base text-ink-600">{a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Resource type labels (§6, §7)
export const RES_TYPES = {
  glossary: {
    label: 'Glossary',
    noun: 'terms',
    one: 'term',
    empty: 'Try a shorter word. The glossary indexes the term itself, not the definition.',
    icon: 'solar:book-2-linear',
    h1: 'Automation and AI terms, explained',
    desc: 'Clear, jargon-free definitions for the automation and AI concepts behind modern work, from triggers and webhooks to AI agents.',
    more: 'More terms',
    all: 'All terms',
  },
  'automation-guides': {
    label: 'Automation guides',
    noun: 'guides',
    one: 'guide',
    empty: 'Search matches the app name and the title. If the app you want is not here yet, the piece may still exist in the catalog.',
    icon: 'solar:bookmark-linear',
    h1: 'Automate any app with Activepieces',
    desc: 'Practical, app-by-app guides showing what you can automate and how to wire it up in minutes, no code required.',
    more: 'More guides',
    all: 'All guides',
  },
  'automation-use-cases': {
    label: 'Automation use cases',
    noun: 'use cases',
    one: 'use case',
    empty: 'Try the job rather than the tool: onboarding, handoff, reporting, follow-up, approval.',
    icon: 'solar:lightbulb-linear',
    h1: 'Automation ideas for every team',
    desc: 'Real automation scenarios across sales, marketing, support, finance and ops, with the workflows to make them happen.',
    more: 'More use cases',
    all: 'All use cases',
  },
  'integration-use-cases': {
    label: 'Integration use cases',
    noun: 'integrations',
    one: 'integration',
    empty: 'Search either app on its own. If the pair is not written up, both pieces may still exist in the catalog.',
    icon: 'solar:socket-linear',
    h1: 'Connect your apps, automate the busywork',
    desc: 'See what becomes possible when you connect two of your favorite apps, and build the integration in a few clicks.',
    more: 'More integrations',
    all: 'All integrations',
  },
}

// §1.11 resources breadcrumb. trail: [{ label, to }], last item = current (no link).
export function ResBreadcrumb({ trail, centered = false, className = '', style }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center gap-2 text-sm text-ink-600 ${centered ? 'justify-center' : ''} ${className}`}
      style={style}
    >
      {trail.map((t, i) => {
        const last = i === trail.length - 1
        return (
          <span key={i} className={`contents`}>
            {i > 0 && <Icon name="solar:alt-arrow-right-linear" className="size-3.5 text-ink-500" />}
            {last ? (
              <span className="min-w-0 truncate font-medium text-ink-900" aria-current="page">
                {t.label}
              </span>
            ) : (
              <Link
                to={t.to}
                className="inline-flex min-h-11 items-center rounded-md transition-colors duration-200 ease-out hover:text-ink-900 md:min-h-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
              >
                {t.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

// §1.7 resources search
export function ResSearch({ value, onChange, placeholder }) {
  return (
    <label className="relative block">
      <span className="sr-only">{placeholder}</span>
      <Icon
        name="solar:magnifer-linear"
        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-600"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-ink-950/10 bg-white py-3.5 pr-4 pl-11 text-ink-900 transition-colors duration-200 ease-in-out outline-none placeholder:text-ink-500 focus:border-ink-950/40"
      />
    </label>
  )
}
