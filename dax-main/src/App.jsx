// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Import your page components
import Home from './pages/Home'
import DaxTheTravelerPage from './pages/DaxTheTravelerPage'
import AniDaxPage from './pages/AniDaxPage'
import TimeZoneTravelersPage from './pages/TimeZoneTravelersPage'
import GodsVesselPage from './pages/GodsVesselPage'
import Dashboard from './pages/Dashboard'
import DaxTheInvestorPage from './pages/DaxTheInvestorPage'

function App() {
  return (
    <div className="App min-h-screen bg-black">
      <Routes>
        {/* Hidden/Private Routes (NO Navbar/Footer) */}
        <Route path="/dax-the-investor" element={<DaxTheInvestorPage />} />
        <Route path="/investor" element={<DaxTheInvestorPage />} />
        <Route path="/internal/investor" element={<DaxTheInvestorPage />} />
        <Route path="/private/financial" element={<DaxTheInvestorPage />} />
        <Route path="/dax/investor" element={<DaxTheInvestorPage />} />
        <Route path="/rollo-investor" element={<DaxTheInvestorPage />} />
        <Route path="/internal/rollo" element={<DaxTheInvestorPage />} />
        
        {/* Public Routes (WITH Navbar/Footer) */}
        <Route path="/*" element={
          <>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dax-the-traveler" element={<DaxTheTravelerPage />} />
                <Route path="/ani-dax" element={<AniDaxPage />} />
                <Route path="/timezone-travelers" element={<TimeZoneTravelersPage />} />
                <Route path="/gods-vessel" element={<GodsVesselPage />} />
                <Route path="/automation" element={<Dashboard />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  )
}

export default App

