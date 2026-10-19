import { useEffect, useState } from 'react'

// blog.json and resources.json (~1 MB each) are loaded with dynamic import() so they ship as
// their own chunks and never land in the homepage bundle. Module-level cache = one fetch per session.
const cache = {}
const loaders = {
  // `posts` = what the live listings show; `allPosts` adds sitemap-only posts (listed: false),
  // which are reachable at /blog/<slug> but never appear in the index, category or author lists.
  blog: () =>
    import('../../data/blog.json').then(({ default: b }) => ({
      ...b,
      allPosts: b.posts,
      posts: b.posts.filter((p) => p.listed !== false),
    })),
  resources: () => import('../../data/resources.json').then((m) => m.default),
}

function useData(key) {
  const [data, setData] = useState(() => cache[key]?.value ?? null)
  useEffect(() => {
    if (data) return
    let live = true
    cache[key] ??= { promise: loaders[key]() }
    cache[key].promise.then((value) => {
      cache[key].value = value
      if (live) setData(value)
    })
    return () => {
      live = false
    }
  }, [key, data])
  return data
}

export const useBlog = () => useData('blog')
export const useResources = () => useData('resources')

// "Oct 16, 2026" (short) / "October 16, 2026" (long) — SPEC_CONTENT §1.4, §2.3
export function formatDate(iso, month = 'short') {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month, day: 'numeric' })
}

// Parse a pagination segment: integer ≥ 2 (page 1 lives at the base path). Returns null when invalid.
export function parsePage(n) {
  if (n == null) return 1
  return /^\d+$/.test(n) && Number(n) >= 2 ? Number(n) : null
}

export const SIGNUP = 'https://cloud.activepieces.com/sign-up'

// Shared full-page placeholder while a data chunk loads.
export const Loading = () => <div className="min-h-screen" />
