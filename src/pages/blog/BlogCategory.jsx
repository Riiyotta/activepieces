import { useParams } from 'react-router-dom'
import { usePageClosing } from '../../components/PageMetaContext'
import { useBlog, parsePage, Loading } from '../../components/content/data'
import { CategoryPills, CONTAINER, Pagination, PostGrid } from '../../components/content/parts'
import usePageHead from '../usePageHead'
import NotFound from '../NotFound'
import { BLOG_CLOSING } from './BlogIndex'

const PAGE = 12

// SPEC_CONTENT §3: /blog/category/:slug and /blog/category/:slug/:n
export default function BlogCategory() {
  const { slug, n } = useParams()
  const blog = useBlog()
  const cat = blog?.categories.find((c) => c.slug === slug)
  usePageClosing(BLOG_CLOSING)
  usePageHead(cat ? `${cat.name} | Activepieces blog` : null)

  const page = parsePage(n)
  if (page == null) return <NotFound />
  if (!blog) return <Loading />
  if (!cat) return <NotFound />

  const all = blog.posts.filter((p) => p.categories.some((c) => c.slug === slug))
  const pages = Math.ceil(all.length / PAGE)
  if (page > Math.max(pages, 1)) return <NotFound />
  const base = `/blog/category/${slug}`

  return (
    <div className={CONTAINER}>
      <header className="flex flex-col gap-3">
        <p className="text-sm text-ink-600">Blog</p>
        <h1 className="font-display text-4xl font-bold text-balance text-ink-900 capitalize md:text-5xl">{cat.name}</h1>
        <p className="text-ink-600">{all.length} posts</p>
      </header>
      <div className="mt-8">
        <CategoryPills categories={blog.categories} active={slug} />
      </div>
      <PostGrid posts={all.slice((page - 1) * PAGE, page * PAGE)} />
      <Pagination current={page} pages={pages} href={(p) => (p === 1 ? base : `${base}/${p}`)} />
    </div>
  )
}
