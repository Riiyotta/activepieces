import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import { usePageClosing } from '../../components/PageMetaContext'
import { useBlog, formatDate, parsePage, Loading } from '../../components/content/data'
import {
  BlogEmpty,
  CategoryPills,
  CONTAINER,
  CoverFrame,
  HeroCover,
  Pagination,
  PostGrid,
} from '../../components/content/parts'
import usePageHead from '../usePageHead'
import NotFound from '../NotFound'

export const BLOG_CLOSING = {
  h2: 'Read about it, then go and build it yourself.',
  lede: 'Everything we write about is in the product. Free to start, cloud or your own servers.',
}
const PAGE = 12

// SPEC_CONTENT §2: /blog and /blog/page/:n
export default function BlogIndex() {
  const { n } = useParams()
  const blog = useBlog()
  usePageClosing(BLOG_CLOSING)
  usePageHead('Blog | Activepieces', 'Guides, product updates and practical walkthroughs for building automations and AI agents.')

  const page = parsePage(n)
  if (n === '1') return <Navigate to="/blog" replace />
  if (page == null) return <NotFound />
  if (!blog) return <Loading />

  const rest = blog.posts.slice(1)
  const pages = Math.ceil(rest.length / PAGE)
  if (page > pages) return <NotFound />
  const posts = rest.slice((page - 1) * PAGE, page * PAGE)
  const href = (p) => (p === 1 ? '/blog' : `/blog/page/${p}`)

  return (
    <div className={CONTAINER}>
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-5xl font-bold text-balance text-ink-900 md:text-6xl">The Activepieces blog</h1>
        <p className="max-w-2xl text-xl text-balance text-ink-600">
          {page === 1
            ? 'Guides, product updates and practical walkthroughs for building automations and AI agents.'
            : `Page ${page} of ${pages}.`}
        </p>
      </header>
      {page === 1 ? (
        <SearchableFirstPage blog={blog} posts={posts} pages={pages} href={href} />
      ) : (
        <>
          <div className="mt-8 flex flex-col gap-5">
            <CategoryPills categories={blog.categories} active={null} />
          </div>
          <PostGrid posts={posts} />
          <Pagination current={page} pages={pages} href={href} />
        </>
      )}
    </div>
  )
}

function SearchableFirstPage({ blog, posts, pages, href }) {
  const [input, setInput] = useState('')
  const [q, setQ] = useState('')
  // §0.1 / §2.1: 250 ms debounce, case-insensitive match on title + excerpt, max 24
  useEffect(() => {
    const t = setTimeout(() => setQ(input.trim()), 250)
    return () => clearTimeout(t)
  }, [input])
  const results = useMemo(() => {
    if (!q) return null
    const needle = q.toLowerCase()
    return blog.posts
      .filter((p) => p.title.toLowerCase().includes(needle) || (p.excerpt || '').toLowerCase().includes(needle))
      .slice(0, 24)
  }, [blog, q])

  return (
    <>
      <div className="mt-8 flex flex-col gap-5">
        <div className="relative">
          <Icon
            name="solar:magnifer-linear"
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-400"
          />
          <input
            type="search"
            aria-label="Search posts"
            placeholder="Search posts"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-xl border border-ink-950/10 bg-white py-3 pr-4 pl-11 text-ink-900 transition-colors duration-200 ease-in-out outline-none placeholder:text-ink-400 focus:border-ink-950/30"
          />
        </div>
        {results && (
          <p className="text-sm text-ink-500" aria-live="polite">
            {results.length} {results.length === 1 ? 'post' : 'posts'} matching “{q}”
          </p>
        )}
        <CategoryPills categories={blog.categories} active={null} />
      </div>
      {results ? (
        results.length ? (
          <PostGrid posts={results} />
        ) : (
          <BlogEmpty
            message="Nothing matches that search."
            hint="Try a shorter word, or clear the box to browse everything."
          />
        )
      ) : (
        <>
          <div className="mt-12">
            <Featured post={blog.posts[0]} />
          </div>
          <PostGrid posts={posts} />
          <Pagination current={1} pages={pages} href={href} />
        </>
      )}
    </>
  )
}

// §2.3 featured post
function Featured({ post }) {
  const cat = post.categories[0]
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group grid grid-cols-1 gap-8 rounded-3xl outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-700 lg:grid-cols-2 lg:items-center"
    >
      <CoverFrame featured>
        <HeroCover post={post} as="h2" kicker={cat?.name} eager priority />
      </CoverFrame>
      <div className="flex flex-col gap-4">
        {cat && <p className="text-xs font-medium tracking-wide text-primary-800">{cat.name}</p>}
        {post.excerpt && <p className="line-clamp-3 text-lg leading-relaxed text-ink-600">{post.excerpt}</p>}
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-ink-500">
          <span>{post.author.name}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(post.publishedAt, 'long')}</span>
          {post.readingTime && (
            <>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime}</span>
            </>
          )}
        </p>
      </div>
    </Link>
  )
}
