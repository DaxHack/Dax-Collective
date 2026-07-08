import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChevronRight, Activity, Terminal, Zap } from 'lucide-react';
import ApprovedMediaGallery from '../components/ApprovedMediaGallery';
import Tilt from 'react-parallax-tilt';

// ─── PALETTE & STYLES ────────────────────────────────────────────────────────
const THEME = {
  blue: '#00D4FF',
  violet: '#8B5CF6',
  cyan: '#06B6D4',
  magenta: '#E879F9',
  bg: '#05050A',
  bgLight: '#0A0A12',
};

const scanlineStyle = {
  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.015) 2px, rgba(0,212,255,0.015) 4px)',
};

const grainStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
};

// ─── DATA ───────────────────────────────────────────────────────────────────
const TOPICS = [
  { id: 'all', label: 'All Takes', color: THEME.blue },
  { id: 'character', label: 'Character Deep-Dives', color: THEME.violet },
  { id: 'arc', label: 'Arc Reviews', color: THEME.cyan },
  { id: 'seasonal', label: 'Seasonal Takes', color: THEME.magenta },
  { id: 'theory', label: 'Theory Board', color: THEME.blue },
];

const LATEST_TAKES = [
  {
    id: 1,
    topic: 'Theory Board',
    topicColor: THEME.blue,
    headline: 'Return by Death Isn\'t a Power — It\'s a Psychological Sentence',
    summary: 'The ability selects for high emotional capacity and low self-preservation. Subaru survives because he\'s built to absorb consequences others can\'t.',
    asset: '/assets/approved-media/anidax/rezero-theory-research-notes.png',
  },
  {
    id: 2,
    topic: 'Arc Review',
    topicColor: THEME.violet,
    headline: 'Frieren\'s Silence Is the Argument, Not the Mood',
    summary: 'The show is not about learning to care. It\'s about the gap between caring and being present. That distinction is what every arc is actually about.',
    asset: '/assets/approved-media/anidax/character-files-editorial-workspace.png',
  },
  {
    id: 3,
    topic: 'Seasonal Takes',
    topicColor: THEME.cyan,
    headline: 'Dungeon Meshi Did What Isekai Forgot: Make the World Feel Lived-In',
    summary: 'Studio Trigger didn\'t add flash. They added texture. Every background, every meal, every monster death communicates a world that existed before the camera arrived.',
    asset: '/assets/approved-media/anidax/anime-collection-shelf-display.png',
  },
];

// ─── COMPONENTS ─────────────────────────────────────────────────────────────
const GlitchText = ({ text, className }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-[2px] -z-10 opacity-70 text-cyan-500 animate-pulse mix-blend-screen">{text}</span>
      <span className="absolute top-0 -left-[2px] -z-10 opacity-70 text-fuchsia-500 animate-pulse mix-blend-screen" style={{ animationDelay: '0.1s' }}>{text}</span>
    </div>
  );
};

const AbstractSilhouette = () => (
  <div className="relative w-full h-[500px] flex items-end justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A12]">
    <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity" style={{ backgroundImage: "url('/assets/approved-media/anidax/setup-anidax-recording-space.png')" }} />
    <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-transparent z-10" />
    
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="relative z-20 flex items-end gap-6 pb-0"
    >
      {/* Main Host Silhouette */}
      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-col items-center">
        <div className="w-24 h-32 rounded-t-[3rem] bg-gradient-to-b from-[#00D4FF]/20 to-transparent border-t border-[#00D4FF]/40 backdrop-blur-sm" />
      </motion.div>
      {/* Secondary Element */}
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="flex flex-col items-center">
        <div className="w-16 h-20 rounded-t-[2rem] bg-gradient-to-b from-[#8B5CF6]/20 to-transparent border-t border-[#8B5CF6]/40 backdrop-blur-sm" />
      </motion.div>
    </motion.div>
    
    <div className="absolute top-4 left-4 z-30 flex items-center gap-2 text-[10px] font-mono text-[#00D4FF]/70 tracking-widest uppercase">
      <Activity size={12} className="animate-pulse" /> REC // STUDIO_01
    </div>
  </div>
);

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function AniDaxPage() {
  const [activeTopic, setActiveTopic] = useState('all');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <>
      <Helmet>
        <title>Ani-Dax — Anime Editorial & Commentary | Dax Collective</title>
        <meta name="description" content="Original anime analysis, character deep-dives, and seasonal commentary." />
      </Helmet>

      <div className="min-h-screen bg-[#05050A] text-white selection:bg-[#00D4FF]/30 relative overflow-hidden" style={scanlineStyle}>
        <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]" style={grainStyle} />

        {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
        <section ref={heroRef} className="relative min-h-[90vh] flex items-center pt-24 pb-12 px-6 lg:px-12">
          {/* Ambient Background Glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div style={{ y: yBg }} className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#00D4FF]/5 blur-[120px]" />
            <motion.div style={{ y: yBg }} className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#8B5CF6]/5 blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
            <motion.div style={{ opacity }} className="flex flex-col items-start">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-8"
              >
                <Terminal size={14} className="text-[#00D4FF]" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#00D4FF]">Editorial Broadcast</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-6"
              >
                ANIME.<br/>
                <GlitchText text="DISSECTED." className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#E879F9]" />
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
                className="text-lg lg:text-xl text-white/50 max-w-md font-light leading-relaxed mb-10"
              >
                Opinionated commentary on character writing, arc construction, and storytelling. <span className="text-white/80">No filler. No fake metrics.</span>
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                <a href="#featured" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full font-mono text-xs uppercase tracking-widest hover:bg-white/10 hover:border-[#00D4FF]/50 transition-all overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/20 to-[#8B5CF6]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">Read Featured Story</span>
                  <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform text-[#00D4FF]" />
                </a>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <AbstractSilhouette />
            </motion.div>
          </div>
        </section>

        {/* ── 2. TOPIC RAIL ────────────────────────────────────────────────── */}
        <section className="sticky top-[60px] z-40 bg-[#05050A]/80 backdrop-blur-xl border-y border-white/5 py-4">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 min-w-max">
              {TOPICS.map((t) => {
                const isActive = activeTopic === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTopic(t.id)}
                    className="relative px-5 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all duration-300"
                    style={{
                      color: isActive ? t.color : 'rgba(255,255,255,0.4)',
                      backgroundColor: isActive ? `${t.color}15` : 'transparent',
                      border: `1px solid ${isActive ? `${t.color}40` : 'rgba(255,255,255,0.05)'}`,
                    }}
                  >
                    {t.label}
                    {isActive && (
                      <motion.div layoutId="topicGlow" className="absolute inset-0 rounded-full opacity-50 pointer-events-none" style={{ boxShadow: `0 0 15px ${t.color}` }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 3. FEATURED STORY ────────────────────────────────────────────── */}
        <section id="featured" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-px bg-gradient-to-r from-[#00D4FF] to-transparent" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00D4FF]">Spotlight Piece</span>
            </div>

            <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.01} transitionSpeed={2000} className="w-full">
              <div className="relative rounded-3xl overflow-hidden bg-[#0A0A12] border border-white/10 group min-h-[500px] flex flex-col justify-end">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-screen group-hover:opacity-30 transition-opacity duration-700"
                  style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/approved-media/anidax/rezero-theory-research-notes.png)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/80 to-transparent" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00D4FF]/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 p-8 lg:p-14 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#00D4FF]/30 bg-[#00D4FF]/10 text-[#00D4FF] font-mono text-[10px] uppercase tracking-widest mb-6">
                    Theory Board // Re:Zero
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-black leading-[1.1] tracking-tight mb-6">
                    Why Return by Death Is the Most Psychologically Complex Ability in Contemporary Anime
                  </h2>
                  <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-2xl font-light">
                    It doesn't grant power — it sentences the bearer to live every consequence twice. The ability is designed around a specific psychological profile, and the narrative earns its reputation by understanding that difference.
                  </p>
                  <button className="flex items-center gap-2 text-[#00D4FF] font-mono text-xs uppercase tracking-widest hover:text-white transition-colors">
                    Read Full Editorial <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </Tilt>
          </motion.div>
        </section>

        {/* ── 4. LATEST TAKES ──────────────────────────────────────────────── */}
        <section className="py-12 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl lg:text-3xl font-black tracking-tight">Latest Transmissions</h3>
            <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase text-white/30 tracking-widest">
              <Zap size={12} className="text-[#E879F9]" /> Max 3 Entries
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {LATEST_TAKES.map((take, i) => (
              <motion.div 
                key={take.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl border border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md" />
                <div className="relative h-full flex flex-col p-6 rounded-2xl bg-[#0A0A12] border border-white/[0.05] group-hover:border-white/15 transition-colors overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity rounded-bl-3xl mix-blend-screen" style={{ backgroundImage: `url('${take.asset}')` }} />
                  
                  <span className="self-start text-[9px] font-mono uppercase tracking-[0.2em] mb-4 px-2 py-1 rounded border" style={{ color: take.topicColor, borderColor: `${take.topicColor}40`, backgroundColor: `${take.topicColor}10` }}>
                    {take.topic}
                  </span>
                  
                  <h4 className="text-xl font-bold leading-snug mb-3">{take.headline}</h4>
                  <p className="text-sm text-white/50 leading-relaxed flex-grow font-light mb-6">{take.summary}</p>
                  
                  <button className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors mt-auto" style={{ color: take.topicColor }}>
                    Access File <ChevronRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 5. MEDIA ARCHIVE ─────────────────────────────────────────────── */}
        <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.05]">
           <div className="mb-10">
             <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8B5CF6] mb-2 block">Visual Context</span>
             <h3 className="text-2xl font-black">Editorial Workspace Archives</h3>
           </div>
           <ApprovedMediaGallery brand="Ani-Dax" section="Behind the Commentary" />
        </section>

        {/* ── 6. IN DEVELOPMENT ────────────────────────────────────────────── */}
        <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-10 lg:p-16 rounded-3xl overflow-hidden border border-[#06B6D4]/20 bg-[#06B6D4]/[0.02]"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDYsIDE4MiwgMjEyLCAwLjE1KSI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-50" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#06B6D4]/10 blur-[80px] rounded-full" />
            
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#06B6D4]"></span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#06B6D4]">Status: Building</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-4">The Next Phase</h2>
              <p className="text-white/60 leading-relaxed mb-8 max-w-lg font-light">
                Co-host integration, dedicated community architecture, and long-form video essays are currently in active development. We deploy when ready, not to meet an artificial calendar.
              </p>

              <div className="flex flex-wrap gap-4">
                {['Video Editorial Infrastructure', 'Community Protocols', 'Co-Host Audio Setup'].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/5 rounded-md font-mono text-[10px] uppercase tracking-wider text-white/50">
                    <Terminal size={12} className="text-[#06B6D4]/50" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
}
