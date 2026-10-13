import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from './contexts/AuthContext';

import Home from './pages/Home'
import DaxTheTravelerPage from './pages/DaxTheTravelerPage'
import AniDaxPage from './pages/AniDaxPage'
import TimeZoneTravelersPage from './pages/TimeZoneTravelersPage'
import GodsVesselPage from './pages/GodsVesselPage'
import GodsVesselMerchPage from './pages/GodsVesselMerchPage'
import Dashboard from './pages/Dashboard'
import AboutPage from './pages/AboutPage'
import BrandsPage from './pages/BrandsPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ResourcesPage from './pages/ResourcesPage'
import DisclosurePage from './pages/DisclosurePage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'

// Internal concept page (future Rollo Dax / The Rollo Investor work). It holds
// example figures and is not a public page, so it is loaded and routed in
// development builds only. In production these paths do not exist and fall
// through to the normal 404. The condition is written inline so the bundler
// drops the page from production builds entirely.
const DaxTheInvestorPage = process.env.NODE_ENV !== 'production'
  ? React.lazy(() => import('./pages/DaxTheInvestorPage'))
  : null

const INTERNAL_INVESTOR_PATHS = [
  '/dax-the-investor',
  '/investor',
  '/internal/investor',
  '/private/financial',
  '/dax/investor',
  '/rollo-investor',
  '/internal/rollo',
]

const DaxTravelerJourneyPage = React.lazy(() => import('./pages/experiments/DaxTravelerJourneyPage'))
const DaxUniverseApp = React.lazy(() => import('./pages/experiments/universe/DaxUniverseApp'))
const DaxUniverseV3App = React.lazy(() => import('./pages/experiments/universe-v3/DaxUniverseV3App'))
const MotionProofApp = React.lazy(() => import('./pages/experiments/motion-proof/MotionProofApp'))

function App() {
  return (
    <AuthProvider>
      <div className="App min-h-screen bg-black">
        <Routes>
          {/* Internal concept routes — development builds only (see above). */}
          {DaxTheInvestorPage && INTERNAL_INVESTOR_PATHS.map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <React.Suspense fallback={null}>
                  <DaxTheInvestorPage />
                </React.Suspense>
              }
            />
          ))}

          {/* Isolated V3 motion proof (test only, placeholder content). */}
          <Route path="/experiments/dax-universe-v3/motion-proof/*" element={
            <React.Suspense fallback={<p role="status" className="p-6 text-white">Loading motion proof…</p>}>
              <MotionProofApp />
            </React.Suspense>
          } />

          {/* Separate local redesign — V1 routes and layout stay unchanged. */}
          <Route path="/experiments/dax-universe-v3/*" element={
            <React.Suspense fallback={<p role="status" className="p-6 text-white">Loading V3 foundation…</p>}>
              <DaxUniverseV3App />
            </React.Suspense>
          } />
          <Route path="/experiments/dax-universe/*" element={
            <React.Suspense fallback={<p role="status" className="p-6 text-white">Entering Dax Collective…</p>}>
              <DaxUniverseApp />
            </React.Suspense>
          } />

          {/* Public routes — with Navbar and Footer */}
          <Route path="/*" element={
            <>
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />

                  {/* Brand pages */}
                  <Route path="/dax-the-traveler" element={<DaxTheTravelerPage />} />
                  <Route path="/experiments/dax-the-traveler-v2" element={
                    <React.Suspense fallback={<p role="status" className="p-6 text-white">Loading Daniel’s journey…</p>}>
                      <DaxTravelerJourneyPage />
                    </React.Suspense>
                  } />
                  <Route path="/ani-dax" element={<AniDaxPage />} />
                  <Route path="/timezone-travelers" element={<TimeZoneTravelersPage />} />
                  <Route path="/gods-vessel" element={<GodsVesselPage />} />
                  <Route path="/gods-vessel/merch/:id" element={<GodsVesselMerchPage />} />

                  {/* Content pages */}
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />

                  {/* Info pages */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/brands" element={<BrandsPage />} />
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/contact" element={<ContactPage />} />

                  {/* Legal */}
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/disclosure" element={<DisclosurePage />} />
                  <Route path="/terms" element={<TermsPage />} />

                  {/* Internal */}
                  <Route path="/automation" element={<Dashboard />} />

                  {/* 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
