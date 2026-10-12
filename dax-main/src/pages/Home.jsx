// src/pages/Home.jsx
// Restored to the pre-redesign visual base per explicit instruction: no
// operational grid, no route-line decoration, no flat charcoal dashboard
// cards. Base recovered from git history (commit e4c5bad, the commit
// before this session's redesign work) — floating bubbles, ambient
// gradient orbs, gradient-text hero, per-brand gradient card tiles, and a
// glow-behind-glass CTA. Fake stats (StatsSection) and the fake-image
// gallery (BrandGallery) are intentionally NOT restored — those were fake
// proof / placeholder content. CTA buttons keep their current honest,
// working handlers rather than the old dead "Subscribe" button.

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import FloatingBubbles from '../components/FloatingBubbles';
import BrandCard from '../components/BrandCard';
import { analytics } from '../utils/analytics';

// Per-brand gradient identity — restored from the pre-redesign version.
// Descriptions kept as the current, honest copy (no fake claims either way).
const brands = [
  {
    name: "Dax the Traveler",
    description: "Personal travel adventures, vlogs, and storytelling.",
    link: "/dax-the-traveler",
    icon: "Luggage",
    gradient: "from-blue-400 via-cyan-400 to-green-400"
  },
  {
    name: "Timezone Travelers",
    description: "Faceless travel guides, itineraries, and travel tips.",
    link: "/timezone-travelers",
    icon: "Globe",
    gradient: "from-orange-500 via-red-500 to-orange-600"
  },
  {
    name: "Ani-Dax",
    description: "Anime commentary, character analysis, and editorial reviews.",
    link: "/ani-dax",
    icon: "Sparkles",
    gradient: "from-purple-500 via-pink-500 to-purple-600"
  },
  {
    name: "God's Vessel",
    description: "Faith-based content, scripture, and apparel.",
    link: "/gods-vessel",
    icon: "Cross",
    gradient: "from-indigo-600 via-purple-600 to-indigo-700"
  }
];

const handleSupportClick = () => {
  analytics.trackDonation('home-cta', 'Support The Collective');
  window.open('https://buymeacoffee.com/DaxCollective', '_blank', 'noopener,noreferrer');
};

export default function Home() {
  return (
    <>
      <Helmet>
        <title>The Dax Collective – Multi-Brand Creative Studio</title>
        <meta
          name="description"
          content="The Dax Collective is the parent hub for Dax the Traveler, Timezone Travelers, Ani-Dax, and God's Vessel."
        />
        <meta name="keywords" content="dax collective, travel, anime, faith, content studio, creator systems" />
        <meta property="og:title" content="The Dax Collective – Multi-Brand Creative Studio" />
        <meta property="og:description" content="Parent hub for Dax the Traveler, Timezone Travelers, Ani-Dax, and God's Vessel." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://dax-collective.web.app" />
      </Helmet>

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Floating Bubbles Background */}
        <FloatingBubbles />

        {/* Ambient gradient overlays */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -25, 0],
              y: [0, 15, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />
        </div>

        {/* Main content */}
        <main className="relative z-10">
          {/* Hero Section */}
          <section className="px-4 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
              >
                <span className="text-white">The </span>
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Dax Collective
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              >
                A multi-brand studio across travel, faith, and anime commentary.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: "easeInOut" }}
                className="flex flex-wrap items-center justify-center gap-4 mt-10"
              >
                <a
                  href="#brands"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-7 rounded-full text-base transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  Explore the Brands
                </a>
                <button
                  onClick={handleSupportClick}
                  className="border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-medium py-3 px-7 rounded-full text-base transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  Support the Collective
                </button>
              </motion.div>

              {/* Decorative element */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent max-w-md mx-auto mt-12"
                aria-hidden="true"
              />
            </div>
          </section>

          {/* Brands Section */}
          <section id="brands" className="px-4 py-20 scroll-mt-20" aria-labelledby="brands-heading">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                id="brands-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
              >
                Explore Our Brands
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {brands.map((brand, index) => (
                  <BrandCard
                    key={brand.name}
                    brand={brand}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="px-4 py-20" aria-labelledby="cta-heading">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative"
              >
                {/* Background glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl -m-8"
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.5, 0.7, 0.5]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden="true"
                />

                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-12 border border-gray-700/50">
                  <h2
                    id="cta-heading"
                    className="text-3xl md:text-4xl font-bold text-white mb-6"
                  >
                    Start with a Brand
                  </h2>

                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Each brand runs on its own — pick the one that fits what you're into,
                    or support the studio behind all four.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <motion.a
                      href="#brands"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      View All Brands
                    </motion.a>
                    <Link
                      to="/dax-the-traveler"
                      className="border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-medium py-4 px-8 rounded-full text-lg transition-colors duration-300"
                    >
                      Start with Dax the Traveler
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
