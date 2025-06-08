import React from 'react'
import { motion } from 'framer-motion'
import RainbowWhiteEffect from './RainbowWhiteEffect'

const StatsSection = () => {
  const stats = [
    {
      value: "4",
      label: "Brands",
      color: "text-blue-400",
      icon: "🎯"
    },
    {
      value: "50K+",
      label: "Followers", 
      color: "text-purple-400",
      icon: "👥"
    },
    {
      value: "1M+",
      label: "Views",
      color: "text-pink-400", 
      icon: "👁️"
    },
    {
      value: "∞",
      label: "Adventures",
      color: "text-green-400",
      icon: "🌟"
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
        >
          <RainbowWhiteEffect 
            trigger="hover" 
            intensity={0.5} 
            whiteAccent={0.4} 
            speed={4}
          >
            <motion.div 
              className="text-center p-6 bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800/30 hover:border-gray-700/50 transition-all duration-300"
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Floating icon */}
              <motion.div
                className="text-2xl mb-3"
                whileHover={{ 
                  scale: 1.2,
                  rotate: [0, -10, 10, 0],
                  y: [-2, -8, -2]
                }}
                transition={{ duration: 0.6 }}
              >
                {stat.icon}
              </motion.div>
              
              {/* Animated value */}
              <motion.div 
                className={`text-4xl font-bold ${stat.color} mb-2`}
                whileHover={{ 
                  scale: 1.1,
                  textShadow: "0 0 20px currentColor"
                }}
                transition={{ duration: 0.3 }}
              >
                {stat.value}
              </motion.div>
              
              {/* Label */}
              <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </div>
              
              {/* White accent line */}
              <div className="white-accent-line mt-3"></div>
              
              {/* Hover particles */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                whileHover={{
                  background: [
                    "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </RainbowWhiteEffect>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default StatsSection

