import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

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
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            ⚡ The Dax Collective
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
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">4</div>
            <div className="text-gray-400">Brands</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">50K+</div>
            <div className="text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">1M+</div>
            <div className="text-gray-400">Views</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">∞</div>
            <div className="text-gray-400">Adventures</div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {projects.map((proj, i) => (
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + (i * 0.1) }}
              className="group"
            >
              <Link to={proj.link}>
                <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-gray-600">
                  {/* Gradient Header */}
                  <div className={`h-48 bg-gradient-to-br ${proj.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {proj.emoji}
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors duration-300">
                      {proj.name}
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-4">
                      {proj.desc}
                    </p>
                    
                    <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300 transition-colors duration-300">
                      Explore Brand
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-16"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join the Journey?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Follow along as we build something extraordinary across multiple platforms and brands. 
            Every adventure, every story, every moment documented.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Subscribe to Updates
            </button>
            <button className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300">
              View Latest Content
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

