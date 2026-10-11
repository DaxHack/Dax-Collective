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
import DaxTheInvestorPage from './pages/DaxTheInvestorPage'
import AboutPage from './pages/AboutPage'
import BrandsPage from './pages/BrandsPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ResourcesPage from './pages/ResourcesPage'
import DisclosurePage from './pages/DisclosurePage'
import PrivacyPage from './pages/PrivacyPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'

const DaxTravelerJourneyPage = React.lazy(() => import('./pages/experiments/DaxTravelerJourneyPage'))

function App() {
  return (
    <AuthProvider>
      <div className="App min-h-screen bg-black">
        <Routes>
          {/* Private/hidden routes — no Navbar or Footer */}
          <Route path="/dax-the-investor" element={<DaxTheInvestorPage />} />
          <Route path="/investor" element={<DaxTheInvestorPage />} />
          <Route path="/internal/investor" element={<DaxTheInvestorPage />} />
          <Route path="/private/financial" element={<DaxTheInvestorPage />} />
          <Route path="/dax/investor" element={<DaxTheInvestorPage />} />
          <Route path="/rollo-investor" element={<DaxTheInvestorPage />} />
          <Route path="/internal/rollo" element={<DaxTheInvestorPage />} />

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
                  {/* Legacy alias */}
                  <Route path="/terms" element={<DisclosurePage />} />

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
