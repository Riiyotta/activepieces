import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import { usePageClosing } from '../../components/PageMetaContext'
import { useBlog, formatDate, Loading, SIGNUP } from '../../components/content/data'
import { HeroCover, PostCard, ReadFullLink, ShareButtons, Toc } from '../../components/content/parts'
import { ARTICLE_TOC, articleChunks, articleIntent } from '../../components/content/placeholder'
import { hasTocRail } from '../../components/content/noToc'
import usePageHead from '../usePageHead'
import NotFound from '../NotFound'
import { BLOG_CLOSING } from './BlogIndex'

// §5.8 closing card copy by intent: [eyebrow, headline, body, primary label, primary href]
const CLOSE = {
  default: ['Get started', 'Automate this without code.', 'Cloud or your own servers.', 'Start free', SIGNUP],
  'how-to': [
    'Build it',
    'Set this up in minutes.',
    'No code required. Connect your accounts, and Activepieces runs it from there.',
    'Start free',
    SIGNUP,
  ],
  comparison: [
    'Still comparing',
    'The fastest way to settle it is to build something.',
    'Open source under MIT, so you can self-host the same thing later.',
    'Start free',
    SIGNUP,
  ],
  pricing: [
    'Running the numbers',
    'See what the same workload costs here.',
    'Free forever plan, and every paid plan self-hosts at no extra cost.',
    'See pricing',
    '/pricing',
  ],
}

const BOTS = ['atlas', 'ember', 'dorian', 'beacon', 'cinder']
const STOP = new Set(['the', 'and', 'for', 'with', 'your', 'how', 'what', 'that', 'this', 'from', 'are', 'you', 'best', 'vs'])
const words = (t) => new Set(t.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w)))

// §0.1 "Keep reading": 3 posts from the same first category, excluding the current one;
// prefer ones sharing title words, otherwise newest (posts are sorted newest first).
function related(posts, post) {
  const cat = post.categories[0]?.slug
  const mine = words(post.title)
  const pool = posts.filter((p) => p.id !== post.id && (!cat || p.categories[0]?.slug === cat))
  return pool
    .map((p, i) => {
      let score = 0
      for (const w of words(p.title)) if (mine.has(w)) score++
      return { p, i, score }
    })
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, 3)
    .map((x) => x.p)
}

// §5.7 reading progress bar (target = whole body wrapper)
function ProgressBar({ target }) {
  const bar = useRef(null)
  const wrap = useRef(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = target.current
      if (!el || !bar.current) return
      const p = Math.min(
        1,
        Math.max(0, (window.scrollY + window.innerHeight - el.offsetTop) / (el.offsetHeight + window.innerHeight * 0.2))
      )
      bar.current.style.transform = `scaleX(${p})`
      wrap.current.setAttribute('aria-valuenow', String(Math.round(p * 100)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [target])
  return (
    <div
      ref={wrap}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="pointer-events-none fixed inset-x-0 top-0 z-120 h-0.5"
    >
      <div
        ref={bar}
        className="h-full origin-left bg-primary-700 transition-transform duration-100 ease-out motion-reduce:transition-none"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}

// SPEC_CONTENT §5: /blog/:slug
export default function BlogArticle() {
  const { slug } = useParams()
  const blog = useBlog()
  const post = blog?.allPosts.find((p) => p.slug === slug)
  const body = useRef(null)
  usePageClosing(BLOG_CLOSING)
  usePageHead(post ? `${post.title} | Activepieces` : null, post?.excerpt || undefined)

  if (!blog) return <Loading />
  if (!post) return <NotFound />

  const intent = articleIntent(post)
  const cat = post.categories[0]
  const [eyebrow, headline, lede, primary, primaryHref] = CLOSE[intent]
  const ink = post.cover.ink === 'light' ? 'ink-light' : 'ink-dark'
  const picks = related(blog.posts, post)

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pt-28 pb-24 md:px-6 md:pt-32 md:pb-32 lg:px-8 art-wrap">
      <ProgressBar target={body} />
      <div className="flex justify-center gap-10 art-cols">
        {hasTocRail(post) && ARTICLE_TOC.length >= 3 && (
          <aside className="hidden w-52 shrink-0 xl:block art-toc">
            <div className="sticky top-28 flex max-h-[calc(100vh-9rem)] flex-col gap-6">
              <Toc entries={ARTICLE_TOC} />
            </div>
          </aside>
        )}

        <article className="w-full max-w-[40rem] min-w-0 art-main">
          {/* §1.11 breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-3 flex min-w-0 flex-nowrap items-center gap-2 text-[13px] text-ink-500">
            <Link to="/blog" className={CRUMB}>
              Blog
            </Link>
            {cat && (
              <>
                <Icon name="solar:alt-arrow-right-linear" className="size-3 shrink-0 text-ink-500" />
                <Link to={`/blog/category/${cat.slug}`} className={CRUMB}>
                  {cat.name}
                </Link>
              </>
            )}
          </nav>

          {/* §5.2 header */}
          <header className="flex flex-col gap-5">
            <HeroCover post={post} as="h1" banner eager className="rounded-2xl ring-1 ring-ink-950/10" />
            {post.excerpt && <p className="max-w-2xl text-lg leading-relaxed text-ink-600">{post.excerpt}</p>}
          </header>

          {/* §5.3 meta row */}
          <div className="mt-4 border-b border-ink-950/10 pb-4">
            <section aria-label="About this article" className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5">
                <AuthorChip post={post} />
                <p className="flex min-w-0 items-center gap-2 text-sm text-ink-500">
                  <span className="text-ink-300 max-sm:hidden" aria-hidden="true">
                    ·
                  </span>
                  <span className="whitespace-nowrap">{formatDate(post.publishedAt)}</span>
                  {post.readingTime && (
                    <>
                      <span className="text-ink-300" aria-hidden="true">
                        ·
                      </span>
                      <span>{post.readingTime}</span>
                    </>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 items-center max-sm:hidden">
                <ShareButtons title={post.title} url={post.url} variant="compact" />
              </div>
            </section>
          </div>

          {/* §5.5 / §5.6 placeholder body, chunked at every h2 */}
          <div className="mt-7" ref={body}>
            {articleChunks(post, intent).map((c) => (
              <div key={c.key} className={c.inline ? 'blog-prose blog-prose-inline' : 'blog-prose'}>
                {c.body}
              </div>
            ))}
          </div>

          <ReadFullLink href={post.url}>Read the full article on activepieces.com</ReadFullLink>

          {/* §5.4 share row */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink-950/10 pt-6">
            <ShareButtons title={post.title} url={post.url} variant="bordered" />
          </div>

          {/* §5.8 closing card */}
          <div className="mt-8">
            <section
              aria-label="Get started with Activepieces"
              className={`close relative isolate overflow-hidden rounded-2xl ring-1 ring-ink-950/10 ${ink}`}
            >
              <img
                className="absolute inset-0 -z-10 size-full object-cover"
                src={post.cover.local}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
              <div className="max-w-lg p-7 md:p-9">
                <p className="text-xs font-semibold tracking-[0.22em] uppercase" style={{ color: 'var(--close-ink)' }}>
                  {eyebrow}
                </p>
                <p
                  className="mt-3 font-display text-2xl leading-tight font-bold text-balance md:text-3xl md:leading-tight"
                  style={{ color: 'var(--close-ink)' }}
                >
                  {headline}
                </p>
                <p className="mt-2.5 text-sm leading-relaxed" style={{ color: 'var(--close-quiet)' }}>
                  {lede}
                </p>
                <a
                  href={primaryHref}
                  className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary-700 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 ease-in-out hover:bg-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                >
                  {primary} <span aria-hidden="true">→</span>
                </a>
                <a
                  href="/sales"
                  className="mt-6 ml-4 inline-flex items-center text-sm font-semibold underline decoration-2 underline-offset-4 opacity-80 transition-opacity duration-200 ease-in-out hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                  style={{ color: 'var(--close-ink)' }}
                >
                  Talk to sales
                </a>
              </div>
            </section>
          </div>
        </article>

        {/* §5.9 right-rail CTA */}
        <aside className="hidden w-[17rem] shrink-0 lg:block art-rail">
          <div className="sticky top-28">
            <SignupCard />
          </div>
        </aside>
      </div>

      {/* §5.10 keep reading */}
      {picks.length > 0 && (
        <div className="mt-16">
          <section className="border-t border-ink-950/10 pt-10">
            <h2 className="font-display text-2xl font-bold text-ink-900">Keep reading</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {picks.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

const CRUMB =
  'inline-flex min-h-11 shrink-0 items-center rounded-md transition-colors duration-200 ease-out hover:text-ink-950 md:min-h-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700'

// §5.3 author + hover/focus popover
function AuthorChip({ post }) {
  const a = post.author
  return (
    <div className="group/author relative flex items-center gap-2.5">
      {a.photoLocal && (
        <img src={a.photoLocal} alt="" width="32" height="32" className="size-8 rounded-full border border-ink-950/8 object-cover" />
      )}
      <Link
        to={`/blog/author/${a.slug ?? 'activepieces'}`}
        className="text-sm font-semibold whitespace-nowrap text-ink-900 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
      >
        {a.name}
      </Link>
      {post.aiGenerated && (
        <span role="img" aria-label="Verified" className="inline-flex">
          <Icon name="solar:verified-check-bold" className="size-4 shrink-0 text-accent-a-700" />
        </span>
      )}
      <div className="invisible absolute top-full left-0 z-20 mt-2 w-[min(20rem,calc(100vw-2.5rem))] rounded-xl bg-white p-4 opacity-0 shadow-lift ring-1 ring-ink-950/8 transition-opacity duration-200 ease-in-out group-hover/author:visible group-hover/author:opacity-100 group-focus-within/author:visible group-focus-within/author:opacity-100">
        <p className="font-display text-base font-bold text-ink-900">{a.name}</p>
        {a.role && <p className="text-xs text-ink-500">{a.role}</p>}
        {a.bio && <p className="mt-2 text-[13px] leading-snug text-ink-600">{a.bio}</p>}
        {post.aiGenerated && (
          <p className="mt-3 flex gap-1.5 border-t border-ink-950/8 pt-3 text-xs leading-snug text-ink-700">
            <Icon name="solar:verified-check-bold" className="mt-px size-3.5 shrink-0 text-accent-a-700" />
            This article was researched and fact-checked by an advanced research system.
          </p>
        )}
      </div>
    </div>
  )
}

// §5.9 sticky sign-up card with the bot avatars (§5.11 peek loop in content.css)
function SignupCard() {
  return (
    <a
      href={SIGNUP}
      className="group relative isolate block overflow-hidden rounded-2xl bg-accent-a-100 transition-[box-shadow,transform] duration-300 ease-smooth hover:-translate-y-0.5 hover:shadow-lift motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
    >
      <img
        className="cta-meadow absolute inset-0 -z-10 size-full object-cover object-bottom"
        src="/panel/meadow-640.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
      <div className="p-3 pb-2">
        <div className="rounded-xl bg-white/80 p-4 backdrop-blur-md">
          <span role="img" aria-label="Activepieces" className="relative mb-3.5 block aspect-[945/147] h-4">
            <span className="logo-layer wordmark bg-ink-950" />
            <span className="logo-layer logomark bg-primary-700" />
          </span>
          <p className="text-xl leading-snug font-semibold text-ink-950">
            Build AI agents that do the work in your apps.{' '}
            <span className="font-display font-normal whitespace-nowrap text-primary-800 italic">Free to start.</span>
          </p>
          <span className="mt-4 flex w-full items-center justify-between rounded-lg bg-ink-950 py-3 pr-3.5 pl-4 text-sm font-medium text-white transition-colors duration-200 ease-in-out group-hover:bg-primary-900">
            Build my agent free
            <Icon
              name="solar:alt-arrow-right-linear"
              className="size-4 transition-transform duration-300 ease-smooth group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </span>
        </div>
      </div>
      <div className="bots" aria-hidden="true">
        {BOTS.map((b, i) => (
          <img key={b} className="bot" src={`/avatars/bots/${b}.svg`} alt="" width="44" height="44" style={{ '--i': i }} />
        ))}
      </div>
    </a>
  )
}
