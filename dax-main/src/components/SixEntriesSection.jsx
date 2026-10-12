// src/components/SixEntriesSection.jsx
// "Phase One: Six Entries" for God's Vessel. Static, curated, no external
// data fetch — replaces the old "Daily Inspiration" feed that depended on
// a Google Sheet and rendered an empty state when unconfigured.
// Restoration pass: each entry is now a hover/tap flip card (front = term,
// back = definition + reference) — the "devotional card deck" interaction —
// with true scroll-reveal (whileInView) and a prefers-reduced-motion
// fallback. Content (six approved definitions) is unchanged.

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const SIX_ENTRIES = [
  {
    term: 'Adonai',
    pronunciation: 'ah-doh-NAI',
    definition: 'Lord; a title of reverence and authority.',
    reference: 'Psalm 8:1'
  },
  {
    term: 'El Shaddai',
    pronunciation: 'el shah-DAI',
    definition: 'God Almighty.',
    reference: 'Genesis 17:1'
  },
  {
    term: 'Grace',
    pronunciation: null,
    definition: 'God’s undeserved favor, received as gift.',
    reference: 'Ephesians 2:8'
  },
  {
    term: 'Hope',
    pronunciation: null,
    definition: 'Confident expectation rooted in God’s faithfulness.',
    reference: 'Romans 15:13'
  },
  {
    term: 'Faith',
    pronunciation: null,
    definition: 'Trust in God beyond what is seen.',
    reference: 'Hebrews 11:1'
  },
  {
    term: 'Peace',
    pronunciation: null,
    definition: 'The peace of God that guards heart and mind.',
    reference: 'Philippians 4:7'
  }
];

const EntryCard = ({ entry, index }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="h-60 cursor-pointer select-none"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
      role="button"
      tabIndex={0}
      aria-label={`${entry.term} — tap to reveal definition`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setFlipped((f) => !f);
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front — term + pronunciation */}
        <div
          className="absolute inset-0 rounded-2xl p-6 bg-vessel-indigo/25 border border-white/10 backdrop-blur-sm shadow-[0_15px_40px_-20px_rgba(49,46,129,0.6)] flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <h3 className="text-2xl font-semibold text-white mb-1">{entry.term}</h3>
          {entry.pronunciation && (
            <p className="text-xs text-white/40 italic mb-4">{entry.pronunciation}</p>
          )}
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            Tap to reveal
          </span>
        </div>

        {/* Back — definition + reference */}
        <div
          className="absolute inset-0 rounded-2xl p-6 bg-vessel-indigo/40 border border-white/15 backdrop-blur-sm shadow-[0_20px_50px_-15px_rgba(99,102,241,0.4)] flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-white/80 text-sm leading-relaxed mb-3">{entry.definition}</p>
          <p className="text-xs text-white/40 uppercase tracking-wide">{entry.reference}</p>
        </div>
      </div>
    </motion.div>
  );
};

const SixEntriesSection = () => {
  return (
    <section className="relative py-16 px-4 overflow-hidden" aria-labelledby="six-entries-heading">
      {/* Ambient glow — purely decorative, non-interactive, does not cycle or change */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 40%, rgba(99,102,241,0.35), transparent 60%)' }}
        aria-hidden="true"
      />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <span className="inline-block text-[10px] tracking-[0.2em] uppercase text-vessel-cream/60 border border-vessel-cream/20 rounded-full px-3 py-1">
            Phase One
          </span>
        </div>
        <h2
          id="six-entries-heading"
          className="text-3xl md:text-4xl font-bold text-center text-white mb-3"
        >
          Six Entries
        </h2>
        <p className="text-center text-white/50 max-w-xl mx-auto mb-3">
          The starting archive — six names and words this brand is built on.
        </p>
        <p className="text-center text-white/35 text-sm max-w-md mx-auto mb-12">
          Also planned as a printed devotional study-card deck — in development.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SIX_ENTRIES.map((entry, index) => (
            <EntryCard key={entry.term} entry={entry} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SixEntriesSection;
