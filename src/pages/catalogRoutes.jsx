import { lazy, Suspense } from 'react'

// Catalog templates are code-split so pieces.json (≈157 KB) stays out of the main bundle.
const CatalogPage = lazy(() => import('./CatalogPage'))
const DetailPage = lazy(() => import('./DetailPage'))
const PairPage = lazy(() => import('./PairPage'))

const fallback = <div className="min-h-screen" />

export function CatalogRoute(props) {
  return (
    <Suspense fallback={fallback}>
      <CatalogPage {...props} />
    </Suspense>
  )
}
export function DetailRoute(props) {
  return (
    <Suspense fallback={fallback}>
      <DetailPage {...props} />
    </Suspense>
  )
}
export function PairRoute() {
  return (
    <Suspense fallback={fallback}>
      <PairPage />
    </Suspense>
  )
}
