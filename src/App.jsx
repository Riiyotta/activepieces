import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ExternalRedirect from './pages/ExternalRedirect'
import ProductPage from './pages/ProductPage'
import SolutionPage from './pages/SolutionPage'
import { CatalogRoute, DetailRoute, PairRoute } from './pages/catalogRoutes'
import { ContentRoute } from './pages/contentRoutes'
import Security from './pages/Security'
import AiGovernance from './pages/AiGovernance'
import Embed from './pages/Embed'
import Pricing from './pages/Pricing'
import Sales from './pages/Sales'
import OssFriends from './pages/OssFriends'

// Route table. Page builders register their routes here (one line each).
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          {/* ROUTES:BEGIN */}
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/solutions/:slug" element={<SolutionPage />} />
          <Route path="/pieces" element={<CatalogRoute kind="pieces" />} />
          <Route path="/pieces/category/:key" element={<CatalogRoute kind="pieces" />} />
          <Route path="/pieces/:slug" element={<DetailRoute kind="pieces" />} />
          <Route path="/pieces/:a/:b" element={<PairRoute />} />
          <Route path="/mcp" element={<CatalogRoute kind="mcp" />} />
          <Route path="/mcp/category/:key" element={<CatalogRoute kind="mcp" />} />
          <Route path="/mcp/:slug" element={<DetailRoute kind="mcp" />} />
          <Route path="/security" element={<Security />} />
          <Route path="/ai-governance" element={<AiGovernance />} />
          <Route path="/embed" element={<Embed />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/oss-friends" element={<OssFriends />} />
          <Route path="/blog" element={<ContentRoute page="BlogIndex" />} />
          <Route path="/blog/page/:n" element={<ContentRoute page="BlogIndex" />} />
          <Route path="/blog/category/:slug" element={<ContentRoute page="BlogCategory" />} />
          <Route path="/blog/category/:slug/:n" element={<ContentRoute page="BlogCategory" />} />
          <Route path="/blog/author/:slug" element={<ContentRoute page="BlogAuthor" />} />
          <Route path="/blog/author/:slug/:n" element={<ContentRoute page="BlogAuthor" />} />
          <Route path="/blog/:slug" element={<ContentRoute page="BlogArticle" />} />
          <Route path="/resources" element={<ContentRoute page="ResourcesHub" />} />
          <Route path="/resources/:category" element={<ContentRoute page="ResourceCategory" />} />
          <Route path="/resources/:category/:slug" element={<ContentRoute page="ResourceDetail" />} />
          <Route path="/privacy" element={<ContentRoute page="Legal" doc="privacy" />} />
          <Route path="/terms" element={<ContentRoute page="Legal" doc="terms" />} />
          <Route path="/docs/*" element={<ExternalRedirect />} />
          {/* ROUTES:END */}
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* Standalone layout (no shared Header/Footer/FloatingCard): SPEC_MARKETING §2 */}
        <Route path="/sales" element={<Sales />} />
      </Routes>
    </BrowserRouter>
  )
}
