import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Luggage, Globe, Sparkles, Cross } from 'lucide-react'

const BrandCard = ({ brand, index }) => {
<<<<<<< HEAD
  const iconComponents = {
    'Luggage': Luggage,
    'Globe': Globe,
=======
  // Map of available icons - using correct lucide-react names
  const iconComponents = {
    'Luggage': Luggage,
    'Globe': Globe, 
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
    'Sparkles': Sparkles,
    'Cross': Cross
  }

<<<<<<< HEAD
  const IconComponent = iconComponents[brand.icon]
=======
  // Get the icon component or fallback to Luggage
  const IconComponent = iconComponents[brand.icon] || Luggage
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeInOut"
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeInOut" }
      }}
      className="group"
    >
      <Link 
        to={brand.link}
        className="block h-full"
        aria-label={`Explore ${brand.name}`}
      >
        <div className={`
<<<<<<< HEAD
          relative overflow-hidden rounded-3xl p-8 h-72
=======
          relative overflow-hidden rounded-2xl p-8 h-64
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
          bg-gradient-to-br ${brand.gradient}
          transition-all duration-300 ease-in-out
          group-hover:shadow-2xl group-hover:shadow-black/20
          border border-white/10
        `}>
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Icon */}
            <div className="flex justify-between items-start">
              <motion.div
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2, ease: "easeInOut" }
                }}
<<<<<<< HEAD
                className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl"
              >
                <IconComponent 
                  size={28} 
=======
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
              >
                <IconComponent 
                  size={32} 
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
                  className="text-white drop-shadow-sm"
                  aria-hidden="true"
                />
              </motion.div>
              
              {/* Status indicator */}
              <motion.div
<<<<<<< HEAD
                className="w-3 h-3 bg-white/60 rounded-full"
=======
                className="w-2 h-2 bg-white/60 rounded-full"
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5
                }}
                aria-hidden="true"
              />
            </div>

            {/* Text content */}
<<<<<<< HEAD
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-white/95 transition-colors duration-200 leading-tight">
                {brand.name}
              </h3>
              <p className="text-white/85 text-sm leading-relaxed">
=======
            <div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-white/95 transition-colors duration-200">
                {brand.name}
              </h3>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
                {brand.description}
              </p>
              
              {/* Call to action */}
<<<<<<< HEAD
              <div className="flex items-center text-white/80 text-sm font-medium pt-2">
=======
              <div className="flex items-center text-white/80 text-sm font-medium">
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
                <span>Explore</span>
                <motion.span 
                  className="ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut"
                  }}
                  aria-hidden="true"
                >
                  →
                </motion.span>
              </div>
            </div>
          </div>

<<<<<<< HEAD
          {/* Enhanced hover glow */}
          <motion.div
            className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
            initial={{ opacity: 0 }}
          />
          
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
=======
          {/* Subtle hover glow */}
          <motion.div
            className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
            initial={{ opacity: 0 }}
          />
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
        </div>
      </Link>
    </motion.article>
  )
}

export default BrandCard
<<<<<<< HEAD
=======

>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
