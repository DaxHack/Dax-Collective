import { motion } from 'framer-motion'
import BrandCard from '../components/BrandCard'
import StatsSection from '../components/StatsSection'
import RainbowWhiteEffect from '../components/RainbowWhiteEffect'

const projects = [
  {
    name: "Dax the Traveler",
    link: "/dax-the-traveler",
    desc: "My personal adventures & chaos",
    gradient: "from-blue-600 to-green-600",
    emoji: "🧳"
  },
  {
    name: "Ani-Dax",
    link: "/ani-dax", 
    desc: "Anime bios, voiceovers, AI vids",
    gradient: "from-purple-600 to-pink-600",
    emoji: "🎌"
  },
  {
    name: "Timezone Travelers",
    link: "/timezone-travelers",
    desc: "Faceless travel brand & hacks",
    gradient: "from-orange-600 to-red-600",
    emoji: "🌍"
  },
  {
    name: "God's Vessel",
    link: "/gods-vessel",
    desc: "Faith-based fashion, content, and power",
    gradient: "from-indigo-600 to-purple-600",
    emoji: "✝️"
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-12 relative">
      {/* Subtle rainbow background orbs */}
      <div className="subtle-rainbow-white-bg">
        <div className="rainbow-white-orb rainbow-orb-1" />
        <div className="rainbow-white-orb rainbow-orb-2" />
        <div className="rainbow-white-orb rainbow-orb-3" />
        <div className="white-accent-particles" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-white">⚡ The </span>
            <span className="text-white">Dax</span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Collective</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Building a content empire across multiple brands. From travel adventures to anime reviews, 
            faith-based content to travel hacks - creating content that inspires and entertains.
          </motion.p>
          <div className="white-accent-line max-w-md mx-auto"></div>
        </div>

        {/* Stats Section - Using the new StatsSection component */}
        <StatsSection />

        {/* Projects Grid - Using the new BrandCard component */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {projects.map((project, index) => (
            <BrandCard 
              key={index}
              brand={project}
              index={index}
            />
          ))}
        </motion.div>

        {/* Call to Action Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-20"
        >
          <RainbowWhiteEffect 
            trigger="hover" 
            intensity={0.7} 
            whiteAccent={0.5} 
            speed={3}
            className="inline-block"
          >
            <div className="p-8 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Join the Adventure?
              </h2>
              <p className="text-gray-300 mb-6">
                Follow along as I build multiple brands, travel the world, and create content that matters.
              </p>
              <div className="white-accent-line mb-6"></div>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Subscribe to Updates
              </button>
            </div>
          </RainbowWhiteEffect>
        </motion.div>
      </div>
    </div>
  )
}

