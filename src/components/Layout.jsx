import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import FloatingCard from './FloatingCard'
import { PageMetaContext } from './PageMetaContext'

// Shared shell for every route. Pages render inside <main> via <Outlet />.
export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  // The live site shows the floating demo card on /product/* and /solutions/* too;
  // it is hidden only on /sales, /pricing, /admin, /customers, /blog and their subpaths (SPEC_MARKETING §0.1).
  const showFloatingCard =
    !/^\/(sales|pricing|admin|customers|blog)(\/|$)/.test(pathname)
  // Per-page footer closing copy (PageMetaContext); null = homepage defaults.
  const [closing, setClosing] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <PageMetaContext.Provider value={{ closing, setClosing }}>
      <div className="min-h-screen overflow-x-clip bg-white font-sans text-ink-600 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-120 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-900 focus:shadow-edge focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
        >
          Skip to content
        </a>
        <Header heroArt={isHome} />
        <main id="main-content">
          <Outlet />
        </main>
        <Footer />
        {showFloatingCard && <FloatingCard />}
      </div>
    </PageMetaContext.Provider>
  )
}
