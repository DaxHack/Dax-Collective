import React from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import FloatingBubbles from '../components/FloatingBubbles'
import StatsSection from '../components/StatsSection'
import BrandCard from '../components/BrandCard'

const brands = [
  {
    name: "Dax the Traveler",
    description: "Epic personal adventures & chaos",
    link: "/dax-the-traveler",
    icon: "Luggage",
    gradient: "from-blue-400 via-cyan-400 to-green-400"
  },
  {
    name: "Timezone Travelers", 
    description: "Interactive travel experiences & hacks",
    link: "/timezone-travelers",
    icon: "Globe",
    gradient: "from-orange-500 via-red-500 to-orange-600"
  },
  {
    name: "Ani-Dax",
    description: "Anime bios, voiceovers, AI vids",
    link: "/ani-dax",
    icon: "Sparkles",
    gradient: "from-purple-500 via-pink-500 to-purple-600"
  },
  {
    name: "God's Vessel",
    description: "Faith-based fashion, content, and power",
    link: "/gods-vessel",
    icon: "Cross",
    gradient: "from-indigo-600 via-purple-600 to-indigo-700"
  }
]

export default function Home() {
  return (
    <>
      {/* <Helmet>
        <title>The Dax Collective - Creative Content Empire</title>
        <meta 
          name="description" 
          content="Explore The Dax Collective's multi-brand content empire featuring travel adventures, anime reviews, faith-based content, and travel guides across four unique brands." 
        />
        <meta name="keywords" content="travel, anime, faith, content creation, Dax Collective" />
        <meta property="og:title" content="The Dax Collective - Creative Content Empire" />
        <meta property="og:description" content="Multi-brand content empire featuring travel, anime, faith, and lifestyle content." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://daxcollective.com" />
      </Helmet> */}

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Floating Bubbles Background */}
        <FloatingBubbles />

        {/* Ambient gradient overlays */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, -25, 0],
              y: [0, 15, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />
        </div>

        {/* Main content */}
        <main className="relative z-10">
          {/* Hero Section */}
          <section className="px-4 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
              >
                <span className="text-white">The </span>
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Dax Collective
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              >
                Building a creative content empire across travel, anime, faith, and lifestyle — 
                inspiring audiences through authentic storytelling and innovative experiences.
              </motion.p>

              {/* Decorative element */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent max-w-md mx-auto mt-12"
                aria-hidden="true"
              />
            </div>
          </section>

          {/* Stats Section */}
          <StatsSection />

          {/* Brands Section */}
          <section className="px-4 py-20" aria-labelledby="brands-heading">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                id="brands-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
              >
                Explore Our Brands
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {brands.map((brand, index) => (
                  <BrandCard 
                    key={brand.name}
                    brand={brand}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="px-4 py-20" aria-labelledby="cta-heading">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative"
              >
                {/* Background glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl -m-8"
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.5, 0.7, 0.5]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden="true"
                />
                
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-12 border border-gray-700/50">
                  <h2 
                    id="cta-heading"
                    className="text-3xl md:text-4xl font-bold text-white mb-6"
                  >
                    Ready to Join the Journey?
                  </h2>
                  
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Follow our multi-brand adventure as we create content that matters, 
                    explore new horizons, and build meaningful connections worldwide.
                  </p>
                  
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    aria-label="Subscribe to updates from The Dax Collective"
                  >
                    Subscribe to Updates
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

