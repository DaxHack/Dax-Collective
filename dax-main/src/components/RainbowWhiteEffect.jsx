// src/components/RainbowWhiteEffect.jsx
import React, { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'

const RainbowWhiteEffect = ({ 
  children, 
  trigger = 'hover', 
  intensity = 0.6, 
  whiteAccent = 0.3,
  speed = 4,
  className = '',
  preserveDarkTheme = true 
}) => {
  const [isActive, setIsActive] = useState(false)
  const elementRef = useRef(null)
  const controls = useAnimation()

  useEffect(() => {
    if (isActive) {
      controls.start({
        '--rainbow-opacity': intensity,
        '--white-glow-intensity': whiteAccent,
        transition: { duration: 0.3, ease: 'easeOut' }
      })
    } else {
      controls.start({
        '--rainbow-opacity': 0,
        '--white-glow-intensity': 0.05, // Subtle white glow even when inactive
        transition: { duration: 0.5, ease: 'easeIn' }
      })
    }
  }, [isActive, intensity, whiteAccent, controls])

  const handleInteraction = () => {
    if (trigger === 'hover') {
      setIsActive(true)
    } else if (trigger === 'click') {
      setIsActive(!isActive)
    }
  }

  const handleLeave = () => {
    if (trigger === 'hover') {
      setIsActive(false)
    }
  }

  return (
    <motion.div
      ref={elementRef}
      className={`rainbow-white-effect-container ${className}`}
      animate={controls}
      onMouseEnter={handleInteraction}
      onMouseLeave={handleLeave}
      onClick={trigger === 'click' ? handleInteraction : undefined}
      style={{
        '--rainbow-speed': `${speed}s`,
        position: 'relative'
      }}
    >
      <div className={`rainbow-white-border-effect ${preserveDarkTheme ? 'preserve-dark' : ''}`}>
        <div className="content">
          {children}
        </div>
      </div>
    </motion.div>
  )
}

export default RainbowWhiteEffect
