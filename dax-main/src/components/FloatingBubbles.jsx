import React from 'react'
import { motion } from 'framer-motion'

const FloatingBubbles = () => {
  // Generate optimized bubble data
  const bubbles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 4, // 4-10px
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10, // 10-20s
    opacity: 0.2 + Math.random() * 0.3, // 0.2-0.5
  }))

  const largeBubbles = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    size: 20 + Math.random() * 20, // 20-40px
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 15 + Math.random() * 10,
    rotation: Math.random() * 360,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Regular floating bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            background: `radial-gradient(circle, 
              rgba(255, 255, 255, ${bubble.opacity}) 0%, 
              rgba(255, 255, 255, ${bubble.opacity * 0.5}) 50%, 
              rgba(255, 255, 255, 0.1) 100%)`,
            boxShadow: `0 0 ${bubble.size * 2}px rgba(255, 255, 255, 0.1)`,
            backdropFilter: 'blur(0.5px)',
          }}
          animate={{
            y: [0, -30, -60, -30, 0],
            x: [0, 10, -5, 15, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
            opacity: [bubble.opacity, bubble.opacity * 1.2, bubble.opacity * 0.8, bubble.opacity],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Large iridescent bubbles */}
      {largeBubbles.map((bubble) => (
        <motion.div
          key={`large-${bubble.id}`}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            background: `conic-gradient(
              from ${bubble.rotation}deg,
              rgba(255, 255, 255, 0.15),
              rgba(147, 197, 253, 0.15),
              rgba(196, 181, 253, 0.15),
              rgba(251, 207, 232, 0.15),
              rgba(255, 255, 255, 0.15)
            )`,
            boxShadow: `0 0 40px rgba(255, 255, 255, 0.05)`,
            backdropFilter: 'blur(1px)',
          }}
          animate={{
            y: [0, -50, -100, -50, 0],
            x: [0, 20, -10, 25, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 0.8, 1.1, 1],
            opacity: [0.2, 0.4, 0.15, 0.3, 0.2],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default FloatingBubbles

