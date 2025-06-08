import React from 'react'
import { motion } from 'framer-motion'
import EnhancedBrandCard from '../components/EnhancedBrandCard'
import EnhancedStatsSection from '../components/EnhancedStatsSection'
import RainbowWhiteEffect from '../components/RainbowWhiteEffect'

const EnhancedHome = () => {
  const brandData = [
    {
      brand: 'dax-the-traveler',
      title: 'Dax the Traveler',
      description: 'Epic personal adventures & chaos',
      link: '/dax-the-traveler',
      baseColor: 'bg-gradient-to-br from-emerald-400 to-blue-500',
      icon: '🧳'
    },
    {
      brand: 'ani-dax',
      title: 'Ani-Dax',
      description: 'Anime bios, voiceovers, AI vids',
      link: '/ani-dax',
      baseColor: 'bg-gradient-to-br from-pink-500 to-purple-600',
      icon: '🎌'
    },
    {
      brand: 'timezone-travelers',
      title: 'Timezone Travelers',
      description: 'Travel guides & timezone magic',
      link: '/timezone-travelers',
      baseColor: 'bg-gradient-to-br from-orange-500 to-red-600',
      icon: '🌍'
    },
    {
      brand: 'gods-vessel',
      title: "God's Vessel",
      description: 'Faith-based content & inspiration',
      link: '/gods-vessel',
      baseColor: 'bg-gradient-to-br from-purple-600 to-indigo-700',
      icon: '✝️'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Hero section */}
        <section className="pt-20 pb-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <motion.h1 
                className="text-6xl md:text-8xl font-bold mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <span className="text-white">Dax</span>{' '}
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                  Collective
                </span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Building a content empire across multiple brands. From travel adventures to anime reviews, 
                faith-based content to travel hacks - creating content that inspires and entertains.
              </motion.p>
            </motion.div>

            {/* Enhanced Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <EnhancedStatsSection />
            </motion.div>
          </div>
        </section>

        {/* Brand cards section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Explore Our Brands
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {brandData.map((brand, index) => (
                <motion.div
                  key={brand.brand}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + (index * 0.1) }}
                >
                  <RainbowWhiteEffect>
                    <EnhancedBrandCard {...brand} />
                  </RainbowWhiteEffect>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to action section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <RainbowWhiteEffect>
              <motion.div
                className="bg-gray-900/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-700/50"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.h3
                  className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  Ready to Join the Adventure?
                </motion.h3>
                <motion.p
                  className="text-xl text-gray-300 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  Subscribe to stay updated with our latest content across all brands. 
                  From epic travel adventures to spiritual insights, there's something for everyone.
                </motion.p>
                <motion.button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe Now
                </motion.button>
              </motion.div>
            </RainbowWhiteEffect>
          </div>
        </section>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default EnhancedHome

