import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Luggage, Globe, Sparkles, Cross } from 'lucide-react';

const BrandCard = ({ brand, index }) => {
  const iconComponents = { Luggage, Globe, Sparkles, Cross };
  const IconComponent = iconComponents[brand.icon] || Luggage;
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      y:  ((e.clientX - (r.left + r.width  / 2)) / r.width)  * 8,
      x: -((e.clientY - (r.top  + r.height / 2)) / r.height) * 6,
      gx: ((e.clientX - r.left) / r.width)  * 100,
      gy: ((e.clientY - r.top)  / r.height) * 100,
    });
  };
  const onLeave = () => setTilt({ x: 0, y: 0, gx: 50, gy: 50 });

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeInOut' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 900,
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s ease' : 'transform 0.08s ease',
      }}
      className="group"
    >
      <Link to={brand.link} className="block h-full" aria-label={`Explore ${brand.name}`}>
        <div className={`
          relative overflow-hidden rounded-3xl p-8 h-72
          bg-gradient-to-br ${brand.gradient}
          transition-shadow duration-300 ease-in-out
          border border-white/10
        `}
          style={{ boxShadow: `0 4px 24px ${brand.glowColor || 'rgba(255,255,255,0.05)'}` }}
        >
          {/* Depth overlay */}
          <div className="absolute inset-0 bg-black/12 group-hover:bg-black/4 transition-colors duration-300" />

          {/* Light sweep glare that follows cursor */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background: `radial-gradient(ellipse at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.11) 0%, transparent 55%)`,
              opacity: tilt.x !== 0 || tilt.y !== 0 ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          />

          {/* Hover glow ring */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.22), 0 0 48px ${brand.glowColor || 'rgba(255,255,255,0.08)'}` }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl"
              >
                <IconComponent size={28} className="text-white drop-shadow-sm" aria-hidden="true" />
              </motion.div>

              {/* Live pulse indicator */}
              <motion.div
                className="w-3 h-3 bg-white/60 rounded-full"
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
                aria-hidden="true"
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white leading-tight">
                {brand.name}
              </h3>
              <p className="text-white/85 text-sm leading-relaxed">{brand.description}</p>

              <div className="flex items-center text-white/80 text-sm font-medium pt-1">
                <span>Enter this world</span>
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden="true"
                >
                  →
                </motion.span>
              </div>
            </div>
          </div>

          {/* Bottom inner shadow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>
      </Link>
    </motion.article>
  );
};

export default BrandCard;
