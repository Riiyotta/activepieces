import { useParams } from 'react-router-dom'
import { usePageClosing } from '../../components/PageMetaContext'
import { useBlog, parsePage, Loading } from '../../components/content/data'
import { CONTAINER, Pagination, PostGrid } from '../../components/content/parts'
import usePageHead from '../usePageHead'
import NotFound from '../NotFound'
import { BLOG_CLOSING } from './BlogIndex'

const PAGE = 12

// SPEC_CONTENT §4: /blog/author/:slug and /blog/author/:slug/:n
export default function BlogAuthor() {
  const { slug, n } = useParams()
  const blog = useBlog()
  const author = blog?.authors.find((a) => a.slug === slug)
  usePageClosing(BLOG_CLOSING)
  usePageHead(author ? `${author.name} | Activepieces blog` : null)

  const page = parsePage(n)
  if (page == null) return <NotFound />
  if (!blog) return <Loading />
  if (!author) return <NotFound />

  const all = blog.posts.filter((p) => p.author.slug === slug)
  const pages = Math.ceil(all.length / PAGE)
  if (page > Math.max(pages, 1)) return <NotFound />
  const base = `/blog/author/${slug}`

  return (
    <div className={CONTAINER}>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {author.photoLocal && (
          <img
            src={author.photoLocal}
            alt=""
            width="72"
            height="72"
            className="size-18 shrink-0 rounded-full border border-ink-950/8 object-cover"
          />
        )}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-ink-600">Author</p>
          <h1 className="font-display text-4xl font-bold text-balance text-ink-900 md:text-5xl">{author.name}</h1>
          {author.role && <p className="text-ink-600">{author.role}</p>}
          <p className="text-sm text-ink-500">{all.length} posts</p>
        </div>
      </header>
      {author.bio && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">{author.bio}</p>}
      <PostGrid posts={all.slice((page - 1) * PAGE, page * PAGE)} />
      <Pagination current={page} pages={pages} href={(p) => (p === 1 ? base : `${base}/${p}`)} />
    </div>
  )
}
