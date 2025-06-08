// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Import your page components
import Home from './pages/Home'
import DaxTheTravelerPage from './pages/DaxTheTravelerPage'
import AniDaxPage from './pages/AniDaxPage'
import TimezoneTravelersPage from './pages/TimeZoneTravelersPage'  // Fixed to match your actual filename
import GodsVesselPage from './pages/GodsVesselPage'

function App() {
  return (
    <div className="App min-h-screen bg-black">
      <Navbar />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dax-the-traveler" element={<DaxTheTravelerPage />} />
          <Route path="/ani-dax" element={<AniDaxPage />} />
          <Route path="/timezone-travelers" element={<TimezoneTravelersPage />} />
          <Route path="/gods-vessel" element={<GodsVesselPage />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App

