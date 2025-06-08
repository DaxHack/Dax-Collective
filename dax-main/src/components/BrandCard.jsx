import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import RainbowWhiteEffect from './RainbowWhiteEffect'

const BrandCard = ({ brand, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [animationPhase, setAnimationPhase] = useState(0)
  const intervalRef = useRef(null)

  // Video-like animations for each brand
  const getAnimationContent = () => {
    switch (brand.name) {
      case "Timezone Travelers":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Interactive Globe Animation */}
            <motion.div
              className="relative"
              animate={isHovered ? {
                scale: [1, 1.2, 1.1],
                rotateY: [0, 180, 360],
              } : { scale: 1, rotateY: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <div className="text-6xl relative">🌍</div>
              {isHovered && (
                <>
                  {/* Zoom effect pins */}
                  <motion.div
                    className="absolute -top-2 -right-2 text-red-400 text-xl"
                    animate={{ scale: [0, 1, 0.8], opacity: [0, 1, 0.7] }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  >
                    📍
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-1 -left-1 text-yellow-400 text-lg"
                    animate={{ scale: [0, 1, 0.9], opacity: [0, 1, 0.8] }}
                    transition={{ duration: 1.5, delay: 1 }}
                  >
                    📍
                  </motion.div>
                  {/* Zoom lines */}
                  <motion.div
                    className="absolute inset-0 border-2 border-white/30 rounded-full"
                    animate={{ scale: [1, 2, 1.5], opacity: [0.8, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </>
              )}
            </motion.div>
          </div>
        )

      case "Dax the Traveler":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Adventure Map Animation */}
            <motion.div
              className="relative"
              animate={isHovered ? { scale: [1, 1.1, 1.05] } : { scale: 1 }}
              transition={{ duration: 1.5 }}
            >
              <div className="text-6xl">🗺️</div>
              {isHovered && (
                <>
                  {/* Moving adventure pins */}
                  <motion.div
                    className="absolute -top-3 left-2 text-red-500 text-2xl"
                    animate={{ 
                      y: [-5, 5, -5],
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎒
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-2 -right-2 text-blue-400 text-xl"
                    animate={{ 
                      scale: [0.8, 1.3, 1],
                      opacity: [0.6, 1, 0.8]
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
                  >
                    ✈️
                  </motion.div>
                  {/* Route lines */}
                  <motion.div
                    className="absolute inset-0 border border-dashed border-yellow-400/50 rounded-lg"
                    animate={{ 
                      borderColor: ["rgba(251, 191, 36, 0.5)", "rgba(251, 191, 36, 0.8)", "rgba(251, 191, 36, 0.3)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </>
              )}
            </motion.div>
          </div>
        )

      case "Ani-Dax":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Anime Character Transformation */}
            <motion.div
              className="relative"
              animate={isHovered ? {
                scale: [1, 1.15, 1.1],
                rotateZ: [0, 5, -5, 0]
              } : { scale: 1, rotateZ: 0 }}
              transition={{ duration: 2 }}
            >
              <div className="text-6xl">🎌</div>
              {isHovered && (
                <>
                  {/* Sparkle effects */}
                  <motion.div
                    className="absolute -top-4 -left-2 text-pink-400 text-xl"
                    animate={{ 
                      scale: [0, 1.5, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-3 right-1 text-purple-400 text-lg"
                    animate={{ 
                      scale: [0, 1.2, 0],
                      y: [0, -10, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: 0.7 }}
                  >
                    💫
                  </motion.div>
                  {/* Character aura */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-sm"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </>
              )}
            </motion.div>
          </div>
        )

      case "God's Vessel":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Spiritual Light Animation */}
            <motion.div
              className="relative"
              animate={isHovered ? {
                scale: [1, 1.1, 1.05],
                rotateY: [0, 360]
              } : { scale: 1, rotateY: 0 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <div className="text-6xl">✝️</div>
              {isHovered && (
                <>
                  {/* Light rays */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-20 h-1 bg-gradient-to-r from-transparent via-yellow-300/60 to-transparent" />
                    <div className="w-1 h-20 bg-gradient-to-b from-transparent via-yellow-300/60 to-transparent absolute" />
                  </motion.div>
                  {/* Spiritual glow */}
                  <motion.div
                    className="absolute inset-0 bg-yellow-300/20 rounded-full blur-lg"
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.2, 0.6, 0.2]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                  {/* Floating elements */}
                  <motion.div
                    className="absolute -top-6 left-4 text-yellow-300 text-sm"
                    animate={{ 
                      y: [0, -15, 0],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🕊️
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        )

      default:
        return <div className="text-6xl">{brand.emoji}</div>
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <RainbowWhiteEffect 
        trigger="hover" 
        intensity={0.8} 
        whiteAccent={0.5} 
        speed={3}
        className="h-full"
      >
        <Link to={brand.link} className="block h-full">
          <motion.div
            whileHover={{ scale: 1.02, y: -8 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden rounded-xl bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 h-full min-h-[280px] flex flex-col transition-all duration-500 group-hover:border-gray-700/70"
            onClick={(e) => {
              // Add zoom click effect for Timezone Travelers
              if (brand.name === "Timezone Travelers") {
                e.preventDefault()
                // Create zoom effect
                const card = e.currentTarget
                card.style.transform = "scale(1.1)"
                card.style.transition = "transform 0.3s ease"
                setTimeout(() => {
                  card.style.transform = "scale(1)"
                  setTimeout(() => {
                    window.location.href = brand.link
                  }, 200)
                }, 300)
              }
            }}
          >
            {/* Animated Top Section - Vibrant colors with video animations! */}
            <div className={`relative h-32 bg-gradient-to-br ${brand.gradient} flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:h-36`}>
              <div className="white-shimmer-effect"></div>
              
              {/* Video-like animation content */}
              <div className="relative z-10">
                {getAnimationContent()}
              </div>

              {/* Hover overlay effect */}
              <motion.div
                className="absolute inset-0 bg-black/20"
                animate={isHovered ? { opacity: 0 } : { opacity: 0.1 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Content Section - Seamlessly integrated */}
            <div className="flex-1 p-6 flex flex-col justify-between bg-gradient-to-b from-gray-900/50 to-gray-900/80">
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                  {brand.name}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-4">
                  {brand.desc}
                </p>
              </div>
              
              <div className="white-accent-line mb-4"></div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                  Explore →
                </span>
                <motion.div 
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 45 }}
                >
                  <span className="text-white text-lg">→</span>
                </motion.div>
              </div>
            </div>

            {/* White corner accents */}
            <div className="white-corner-accent top-left" />
            <div className="white-corner-accent top-right" />
            <div className="white-corner-accent bottom-left" />
            <div className="white-corner-accent bottom-right" />
          </motion.div>
        </Link>
      </RainbowWhiteEffect>
    </motion.div>
  )
}

export default BrandCard