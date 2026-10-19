import { lazy, Suspense } from 'react'

// Content templates (blog, resources, legal) are code-split; blog.json / resources.json are
// additionally loaded by dynamic import() inside the pages (components/content/data.jsx).
const pages = {
  BlogIndex: lazy(() => import('./blog/BlogIndex')),
  BlogCategory: lazy(() => import('./blog/BlogCategory')),
  BlogAuthor: lazy(() => import('./blog/BlogAuthor')),
  BlogArticle: lazy(() => import('./blog/BlogArticle')),
  ResourcesHub: lazy(() => import('./resources/ResourcesHub')),
  ResourceCategory: lazy(() => import('./resources/ResourceCategory')),
  ResourceDetail: lazy(() => import('./resources/ResourceDetail')),
  Legal: lazy(() => import('./Legal')),
}

const fallback = <div className="min-h-screen" />

export function ContentRoute({ page, ...props }) {
  const Page = pages[page]
  return (
    <Suspense fallback={fallback}>
      <Page {...props} />
    </Suspense>
  )
}
