// src/pages/AniDaxPage.jsx
// Neon Urban Editorial Anime Commentary Hub.
// Near-black base, electric blue / violet / controlled magenta-cyan accents,
// spacious editorial hierarchy. No official anime art, cover art, show
// logos, screenshots, fake thumbnails, or fake view counts — original text
// commentary only until original mascot/assets exist. Re:Zero remains as a
// text discussion topic. Every unbuilt feature is labeled "In Development".
// Visual-correction pass: layered brighter accent glow, a CSS-only scanline
// texture (page-local, see AniDaxPage.css — tailwind.config.js untouched),
// and stronger card hover depth. Decoration only, no new content/deps.

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  HeartIcon,
  SparklesIcon,
  FilmIcon,
  StarIcon,
  FireIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

import CommentsSection from '../components/CommentsSection';
import './AniDaxPage.css';

// Original commentary only — no cover art, no official imagery.
const reZeroDiscussion = {
  title: "Re:Zero — Why It Still Holds Up",
  sections: [
    {
      title: "The Time-Loop as Character Study",
      content: "Re:Zero doesn't use its time loop as a gimmick — it uses it as a pressure test. Every reset strips away plot armor and forces the story to deal with trauma, failure, and what it actually costs to keep trying."
    },
    {
      title: "Subaru, Unfiltered",
      content: "Subaru Natsuki works as a protagonist because he isn't written to be liked. He's reckless, often wrong, and his growth is slow and uneven — which is exactly why it reads as real instead of scripted."
    }
  ]
};

// Future sections — explicitly unbuilt. No fabricated data lives here.
const inDevelopment = [
  {
    icon: FireIcon,
    title: "Seasonal Picks",
    description: "Editorial coverage of what's airing each season, written from scratch — no pulled cover art, no placeholder ratings."
  },
  {
    icon: StarIcon,
    title: "Full Reviews",
    description: "Long-form written reviews. Will go up once the first batch is actually finished and edited."
  },
  {
    icon: FilmIcon,
    title: "Video Essays",
    description: "Original video commentary, hosted on Ani-Dax's own channel — no stock thumbnails standing in for it."
  },
  {
    icon: PhotoIcon,
    title: "Original Art Gallery",
    description: "Original mascot and editorial art for Ani-Dax. Nothing goes here until it's actually drawn."
  }
];

const AniDaxPage = () => {
  return (
    <>
      <Helmet>
        <title>Ani-Dax — Anime Commentary Hub | Dax Collective</title>
        <meta
          name="description"
          content="Ani-Dax is an editorial anime commentary hub — original written discussion, starting with Re:Zero, with more formats in development."
        />
        <meta name="keywords" content="anime commentary, Re:Zero discussion, anime editorial" />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        {/* Hero — editorial, not a streaming dashboard. Layered, brighter accent glow */}
        <section className="relative py-24 px-4 text-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.28] pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 25% 15%, rgba(124,92,255,0.55), transparent 50%), radial-gradient(circle at 78% 60%, rgba(34,211,238,0.4), transparent 50%), radial-gradient(circle at 55% 85%, rgba(217,70,239,0.3), transparent 55%)'
            }}
            aria-hidden="true"
          />
          <div className="ani-dax-scanline absolute inset-0 opacity-60 pointer-events-none" aria-hidden="true" />
          <motion.div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 40% 30%, rgba(124,92,255,0.3), transparent 60%)' }}
            animate={{ opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-edge-cyan/80 border border-edge-cyan/30 rounded-full px-4 py-1.5 mb-6">
              <SparklesIcon className="w-3.5 h-3.5" />
              Editorial Anime Commentary
            </span>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white">
              ANI-DAX
            </h1>
            <p className="text-lg md:text-xl text-white/55 max-w-xl mx-auto leading-relaxed">
              Written commentary and discussion on anime — starting small, built around
              original writing instead of borrowed art.
            </p>
          </motion.div>
        </section>

        {/* Re:Zero — the one anime kept as a text discussion topic */}
        <section className="py-16 px-4" aria-labelledby="rezero-heading">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl p-8 md:p-10 bg-charcoal-900 border border-edge-violet/20 shadow-[0_20px_60px_-25px_rgba(124,92,255,0.4)] transition-shadow duration-300 hover:border-edge-violet/40 hover:shadow-[0_25px_70px_-20px_rgba(124,92,255,0.5)]">
              <span className="inline-block text-[10px] tracking-[0.2em] uppercase text-edge-violet/80 border border-edge-violet/30 rounded-full px-3 py-1 mb-5">
                Discussion
              </span>
              <h2 id="rezero-heading" className="text-2xl md:text-3xl font-bold text-white mb-8">
                {reZeroDiscussion.title}
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {reZeroDiscussion.sections.map((section) => (
                  <div key={section.title} className="space-y-3">
                    <h3 className="text-base font-semibold text-edge-cyan">{section.title}</h3>
                    <p className="text-white/65 text-sm leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Real comments — backed by Firestore, not seeded content */}
            <div className="mt-10">
              <CommentsSection
                sectionId="rezero-discussion"
                sectionTitle="Discuss Re:Zero"
              />
            </div>
          </div>
        </section>

        {/* What's next — honestly labeled, nothing fabricated */}
        <section className="py-20 px-4" aria-labelledby="next-heading">
          <div className="max-w-6xl mx-auto">
            <h2 id="next-heading" className="text-3xl md:text-4xl font-bold text-center text-white mb-3">
              What's Next
            </h2>
            <p className="text-center text-white/50 max-w-xl mx-auto mb-14">
              Ani-Dax is starting with written discussion only. Everything below is planned,
              not live.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {inDevelopment.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group relative rounded-2xl p-6 bg-charcoal-900 border border-charcoal-700 overflow-hidden transition-all duration-300 hover:border-edge-cyan/30 hover:-translate-y-1"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at 30% 20%, rgba(34,211,238,0.12), transparent 65%)' }}
                    aria-hidden="true"
                  />
                  <Icon className="w-6 h-6 text-edge-cyan mb-4" aria-hidden="true" />
                  <span className="inline-block text-[10px] tracking-wider uppercase text-white/40 border border-white/15 rounded-full px-3 py-1 mb-3">
                    In Development
                  </span>
                  <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing note */}
        <section className="py-16 px-4 border-t border-charcoal-800">
          <div className="max-w-2xl mx-auto text-center">
            <HeartIcon className="w-6 h-6 text-edge-magenta mx-auto mb-4" aria-hidden="true" />
            <p className="text-white/50 text-sm leading-relaxed">
              Ani-Dax doesn't use official cover art, character art, or show screenshots —
              everything here is original writing, and original visuals will follow as
              they're made.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default AniDaxPage;
