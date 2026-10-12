// src/pages/GodsVesselPage.jsx
// Restored to the earlier purple/indigo/blue visual world (recovered from
// git history, commit e4c5bad — the version before the archive-style
// rewrite). This is a restoration, not a new interpretation: layered
// gradient light, floating atmosphere, glass cards, smooth scroll-reveal
// rhythm. Product content is honest — no fake shop, no fake prices, no
// fake buy buttons, no fake testimonials. The Phase One collection concept
// below is drawn from the real (unpublished) garment matrix in
// planning/operations/gods-vessel-merch-production-phase1.md, which is
// explicitly still in the design/sample phase — nothing is for sale.

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SixEntriesSection from '../components/SixEntriesSection';
import FloatingBubbles from '../components/FloatingBubbles';
import { analytics } from '../utils/analytics';

// Real Phase One garment concepts — see
// planning/operations/gods-vessel-merch-production-phase1.md. Nothing here
// is produced, photographed, priced, or for sale yet.
const collectionConcepts = [
  {
    title: 'Premium Hoodies',
    detail: 'El Shaddai (stone) and Peace (black) — heavyweight hoodie concepts.',
    status: 'Sample Phase'
  },
  {
    title: 'Heavyweight & Washed Tees',
    detail: 'Adonai, Grace, Faith, and Hope — tee concepts across the six-entry set.',
    status: 'Sample Phase'
  },
  {
    title: 'Phase One: Six Entries Collection',
    detail: 'The full six-entry faithwear release, grouped as one collection.',
    status: 'Collection in Development'
  },
  {
    title: 'Devotional Study Card Deck',
    detail: 'A printed card set carrying the same six names, definitions, and references.',
    status: 'In Development'
  }
];

const handleSupportClick = () => {
  analytics.trackDonation('gods-vessel-cta', 'Support The Collective');
  window.open('https://buymeacoffee.com/DaxCollective', '_blank', 'noopener,noreferrer');
};

const GodsVesselPage = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <Helmet>
        <title>God's Vessel – Faith, Scripture, and a Collection in Development</title>
        <meta
          name="description"
          content="God's Vessel is a faith-based brand built around scripture and the names of God, with a faithwear collection currently in development."
        />
        <meta property="og:title" content="God's Vessel – Faith, Scripture, and a Collection in Development" />
        <meta property="og:description" content="A faith-based brand built around scripture and the names of God." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
        {/* Floating atmosphere — same soft-light system used across the site */}
        <FloatingBubbles />

        {/* Hero — restored purple/indigo/blue world, layered light */}
        <section className="relative py-24 px-4 text-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 10%, rgba(147,51,234,0.45), transparent 55%), radial-gradient(circle at 15% 65%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(circle at 85% 80%, rgba(59,130,246,0.3), transparent 55%)'
            }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 30%, rgba(168,85,247,0.3), transparent 65%)' }}
            animate={shouldReduceMotion ? {} : { opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative max-w-3xl mx-auto"
          >
            <span className="inline-block text-xs tracking-[0.2em] uppercase text-white/60 border border-white/15 rounded-full px-4 py-1.5 mb-6">
              Faith &middot; Scripture &middot; Faithwear
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-5">
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
                God's Vessel
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
              Truth and testimony, built one entry at a time.
            </p>
          </motion.div>
        </section>

        {/* Phase One: Six Entries — devotional card deck */}
        <SixEntriesSection />

        {/* Future Collection — honest, drawn from the real Phase One garment matrix */}
        <section className="relative py-20 px-4" aria-labelledby="collection-heading">
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 30% 50%, rgba(99,102,241,0.3), transparent 60%)' }}
            aria-hidden="true"
          />
          <div className="relative max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <span className="inline-block text-[10px] tracking-[0.25em] uppercase text-white/50 border border-white/15 rounded-full px-4 py-1.5 mb-6">
                The Faithwear Collection
              </span>
              <h2 id="collection-heading" className="text-3xl md:text-4xl font-bold mb-4">
                Planned, Not Yet for Sale
              </h2>
              <p className="text-white/55 max-w-xl mx-auto leading-relaxed">
                Every piece below is a real design direction currently in the sample and
                approval phase — nothing here has a price, inventory, or a working checkout yet.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {collectionConcepts.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-sm shadow-[0_15px_40px_-20px_rgba(99,102,241,0.4)] transition-shadow duration-300 hover:border-white/20 hover:shadow-[0_20px_50px_-15px_rgba(147,51,234,0.35)]"
                >
                  <span className="inline-block text-[9px] tracking-wider uppercase text-purple-300/80 border border-purple-300/25 rounded-full px-2.5 py-1 mb-4">
                    {item.status}
                  </span>
                  <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{item.detail}</p>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-white/35 text-sm mt-10 max-w-lg mx-auto">
              No items are listed for sale. When the collection opens, pieces will appear here
              with real photography, real pricing, and a real checkout — not before.
            </p>
          </div>
        </section>

        {/* Call to Action — honest, layered glow matching the restored atmosphere */}
        <section className="px-4 py-20" aria-labelledby="cta-heading">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <motion.div
                className="absolute inset-0 -m-8 rounded-3xl blur-xl opacity-40 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.2), rgba(99,102,241,0.15) 55%, transparent 80%)' }}
                animate={shouldReduceMotion ? {} : { scale: [1, 1.02, 1], opacity: [0.3, 0.45, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              />
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
                <h2 id="cta-heading" className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Follow the Build
                </h2>
                <p className="text-white/55 mb-8">
                  God's Vessel is early. Support the wider Dax Collective studio, or explore
                  what's already live across the other brands.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={handleSupportClick}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-7 rounded-full text-base transition-all duration-300 shadow-lg"
                  >
                    Support the Collective
                  </button>
                  <Link
                    to="/"
                    className="border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-medium py-3 px-7 rounded-full text-base transition-colors duration-300"
                  >
                    Back to The Dax Collective
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default GodsVesselPage;
