// src/pages/TimezoneTravelersPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TimezoneTravelersPage = () => {
  const [activeSection, setActiveSection] = useState('hacks');

  const travelHacks = [
    {
      id: 1,
      title: "The 2-Minute Airport Security Hack",
      category: "Airport Tips",
      description: "Skip the long lines with this simple preparation trick that 99% of travelers don't know.",
      readTime: "2 min",
      saves: 1247
    },
    {
      id: 2,
      title: "Free WiFi Anywhere in the World",
      category: "Tech Hacks",
      description: "Never pay for internet again with these 5 foolproof methods that work in any country.",
      readTime: "3 min",
      saves: 2156
    },
    {
      id: 3,
      title: "Book Hotels 40% Cheaper",
      category: "Budget Hacks",
      description: "The exact timing and platform strategy that saves hundreds on accommodation.",
      readTime: "4 min",
      saves: 3421
    }
  ];

  const quickItineraries = [
    {
      destination: "Tokyo in 48 Hours",
      highlights: ["Shibuya Crossing", "Tsukiji Market", "Senso-ji Temple", "Harajuku District"],
      budget: "$200-300",
      bestFor: "First-time visitors"
    },
    {
      destination: "Paris Weekend Escape",
      highlights: ["Eiffel Tower", "Louvre Museum", "Montmartre", "Seine River Cruise"],
      budget: "$250-400",
      bestFor: "Romantic getaway"
    },
    {
      destination: "Bangkok Street Food Tour",
      highlights: ["Chatuchak Market", "Khao San Road", "Floating Market", "Temple Hopping"],
      budget: "$50-100",
      bestFor: "Food lovers"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div 
          className="h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('/api/placeholder/1920/600')`
          }}
        >
          <div className="text-center max-w-4xl px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                🌍 TIMEZONE TRAVELERS
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-6">
                Hacks. Itineraries. Adventures.
              </p>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                This is the hub for all our travel content—quick tips, travel hacks, and daily dose of wanderlust. 
                Find your next destination, get inspired, or support the movement to travel smarter and freer.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8 bg-gray-800/30 backdrop-blur-sm rounded-full p-2 border border-gray-700">
            {[
              { id: 'hacks', label: 'Travel Hacks' },
              { id: 'itineraries', label: 'Quick Itineraries' },
              { id: 'inspiration', label: 'Daily Inspiration' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeSection === tab.id
                    ? 'bg-gradient-to-r from-orange-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Travel Hacks Section */}
          {activeSection === 'hacks' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {travelHacks.map((hack) => (
                <div key={hack.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-orange-500 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-orange-600/30 text-orange-300 px-3 py-1 rounded-full text-sm font-semibold">
                      {hack.category}
                    </span>
                    <span className="text-gray-400 text-sm">{hack.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{hack.title}</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">{hack.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{hack.saves} saves</span>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                      Read Hack
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Quick Itineraries Section */}
          {activeSection === 'itineraries' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {quickItineraries.map((itinerary, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{itinerary.destination}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <span>Budget: {itinerary.budget}</span>
                        <span>Best for: {itinerary.bestFor}</span>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <h4 className="text-lg font-semibold text-white mb-3">Must-See Highlights:</h4>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {itinerary.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center text-gray-300">
                            <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                            {highlight}
                          </div>
                        ))}
                      </div>
                      
                      <button className="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300">
                        Get Full Itinerary
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Daily Inspiration Section */}
          {activeSection === 'inspiration' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700">
                <h3 className="text-3xl font-bold text-white mb-6">Today's Travel Inspiration</h3>
                <blockquote className="text-2xl text-gray-300 italic mb-6 leading-relaxed">
                  "The world is a book and those who do not travel read only one page."
                </blockquote>
                <p className="text-gray-400 mb-8">- Saint Augustine</p>
                
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-400 mb-2">195</div>
                    <div className="text-gray-400">Countries to Explore</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-pink-400 mb-2">∞</div>
                    <div className="text-gray-400">Adventures Waiting</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-400 mb-2">1</div>
                    <div className="text-gray-400">Life to Live</div>
                  </div>
                </div>
                
                <button className="mt-8 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                  Start Your Journey Today
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TimezoneTravelersPage;

