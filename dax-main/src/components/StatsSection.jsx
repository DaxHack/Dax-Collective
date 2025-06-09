import React, { useState } from 'react'
import { motion } from 'framer-motion'

const StatsSection = () => {
  const [hoveredStat, setHoveredStat] = useState(null)

  const stats = [
    {
      id: 'brands',
      value: '4',
      label: 'Active Brands',
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'countries',
      value: '15+',
      label: 'Countries Visited',
      gradient: 'from-emerald-400 to-teal-400'
    },
    {
      id: 'views',
      value: '1M+',
      label: 'Views Generated',
      gradient: 'from-orange-400 to-red-400'
    },
    {
      id: 'adventures',
      value: '∞',
      label: 'Adventures Await',
      gradient: 'from-purple-400 to-pink-400'
    }
  ]

  return (
    <section className="py-16" aria-labelledby="stats-heading">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          id="stats-heading"
          className="sr-only"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Company Statistics
        </motion.h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="text-center group cursor-default"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeInOut"
              }}
              onMouseEnter={() => setHoveredStat(stat.id)}
              onMouseLeave={() => setHoveredStat(null)}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeInOut" }
              }}
            >
              <div className="relative">
                {/* Elegant glow effect on hover */}
                {hoveredStat === stat.id && (
                  <motion.div
                    className={`absolute inset-0 -m-6 rounded-2xl bg-gradient-to-r ${stat.gradient} opacity-10 blur-xl`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.15, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}

                <motion.div
                  className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}
                  animate={hoveredStat === stat.id ? {
                    scale: [1, 1.08, 1],
                  } : {}}
                  transition={{ 
                    duration: 0.4, 
                    ease: "easeInOut"
                  }}
                >
                  {stat.value}
                </motion.div>

                <p className="text-white/70 text-sm font-medium tracking-wide uppercase">
                  {stat.label}
                </p>

                {/* Elegant underline on hover */}
                {hoveredStat === stat.id && (
                  <motion.div
                    className={`h-0.5 bg-gradient-to-r ${stat.gradient} mt-3 mx-auto rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: '50%' }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection

