import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Tilt from 'react-parallax-tilt';
import { 
  MapPin, Clock, Compass, Globe2, Sun, Camera, 
  ArrowRight, Navigation, Ticket, Utensils, Zap, BookOpen 
} from 'lucide-react';
import BrandGallery from '../components/BrandGallery';
import ApprovedMediaGallery from '../components/ApprovedMediaGallery';
import { countBrandPhotos } from '../data/mediaCounts';

// --- Reusable Thematic Components ---

const DepartureBoardText = ({ text, className = '' }) => (
  <div className={`flex gap-[2px] font-mono font-bold uppercase tracking-wider ${className}`}>
    {text.split('').map((char, i) => (
      <div 
        key={i} 
        className="w-5 h-7 sm:w-6 sm:h-8 flex items-center justify-center bg-[#111] border-b border-t border-gray-800 text-orange-400 rounded-sm relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/60 z-10" />
        <span className="relative z-0 text-xs sm:text-sm">{char}</span>
      </div>
    ))}
  </div>
);

const PassportStamp = ({ text, date, angle, color = "border-rose-500 text-rose-500", top, left, right, bottom }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.5, rotate: angle - 30 }}
    whileInView={{ opacity: 0.8, scale: 1, rotate: angle }}
    viewport={{ once: true }}
    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
    className={`absolute pointer-events-none rounded-full border-4 border-dashed p-4 flex flex-col items-center justify-center w-32 h-32 opacity-80 mix-blend-screen z-0 ${color}`}
    style={{ top, left, right, bottom, transform: `rotate(${angle}deg)` }}
  >
    <span className="uppercase tracking-[0.2em] font-black text-center leading-none text-sm mb-1">{text}</span>
    <span className="text-[10px] font-mono font-bold">{date}</span>
    <span className="mt-1 flex gap-1">
      <Globe2 size={12} strokeWidth={3} />
      <Compass size={12} strokeWidth={3} />
    </span>
  </motion.div>
);

const RouteLine = ({ className }) => (
  <svg 
    viewBox="0 0 400 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`w-full overflow-visible ${className}`}
  >
    <motion.path 
      d="M0,50 Q100,0 200,50 T400,50" 
      stroke="url(#route-gradient)" 
      strokeWidth="2" 
      strokeDasharray="6 6"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
    <defs>
      <linearGradient id="route-gradient" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f43f5e" stopOpacity="0" />
        <stop offset="0.5" stopColor="#f97316" />
        <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

// --- Sections ---

const CinematicHero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0A0F1A]">
      {/* Background Gradients & Glows */}
      <motion.div style={{ y: y1, opacity }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0F1A]/50 to-[#0A0F1A] z-10" />
        <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr from-rose-600/30 via-orange-500/20 to-amber-400/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-pink-600/20 via-rose-500/10 to-transparent blur-[80px]" />
        
        {/* Abstract topographic grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </motion.div>

      {/* Decorative Stamps */}
      <PassportStamp text="GLOBAL" date="HUB" angle={-15} top="20%" left="10%" color="border-orange-500/30 text-orange-500/30" />
      <PassportStamp text="DISCOVER" date="TZ-TRVL" angle={25} bottom="30%" right="10%" color="border-rose-500/30 text-rose-500/30" />

      <div className="relative z-10 container mx-auto px-6 pt-20 pb-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-orange-300 uppercase">
              Global Discovery Clubhouse
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-orange-400 to-rose-600 tracking-tighter mb-4 filter drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            TIME-ZONE
            <br />
            <span className="text-white filter drop-shadow-none">TRAVELERS</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-400 max-w-2xl font-light mb-12">
            A warm, energetic hub for those who chase sunsets, embrace new cultures, and master the art of exploration.
          </p>

          <DepartureBoardText text="DEPARTURES" className="mb-12 opacity-80" />

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-full overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-shadow hover:shadow-[0_0_60px_rgba(249,115,22,0.6)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative flex items-center gap-2">
              Start Exploring <ArrowRight size={18} />
            </span>
          </motion.button>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        style={{ opacity: useTransform(scrollY, [0, 200], [1, 0]) }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
      >
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-orange-500/50 to-transparent" />
      </motion.div>
    </div>
  );
};

const DiscoveryRail = () => {
  const destinations = [
    { city: "Tokyo", desc: "Neon & Tradition", coords: "35.6762° N, 139.6503° E", color: "from-purple-500 to-rose-500" },
    { city: "Oaxaca", desc: "Culinary Capital", coords: "17.0732° N, 96.7266° W", color: "from-orange-500 to-amber-500" },
    { city: "Kyoto", desc: "Ancient Streets", coords: "35.0116° N, 135.7681° E", color: "from-emerald-500 to-teal-500" },
    { city: "Lisbon", desc: "Golden Hour Hills", coords: "38.7223° N, 9.1393° W", color: "from-amber-400 to-orange-500" },
    { city: "Havana", desc: "Time Capsule", coords: "23.1136° N, 82.3666° W", color: "from-sky-400 to-blue-600" },
  ];

  return (
    <section className="py-24 bg-[#0A0F1A] relative overflow-hidden border-y border-white/5">
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Culture Radar</h2>
            <p className="text-gray-400 max-w-md">Our curated picks for where the energy is flowing right now. Time zones to watch.</p>
          </div>
          <div className="font-mono text-sm text-orange-400 flex flex-col items-end opacity-70">
            <span>RADAR: ACTIVE</span>
            <span>SCANNING: GLOBAL</span>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-12 pt-4 px-6 gap-6 snap-x snap-mandatory scrollbar-hide -mx-6 w-[calc(100%+3rem)]">
        {destinations.map((dest, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="snap-center shrink-0 w-[280px] md:w-[360px]"
          >
            <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.02} transitionSpeed={2000}>
              <div className="relative h-[400px] rounded-3xl overflow-hidden group border border-white/10 bg-gray-900">
                <div className={`absolute inset-0 bg-gradient-to-br ${dest.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                
                {/* Abstract texture */}
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <span className="w-10 h-10 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/70">
                      <MapPin size={18} />
                    </span>
                    <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                      {dest.coords}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-black text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 transition-all">
                      {dest.city}
                    </h3>
                    <p className="text-gray-300 font-medium">{dest.desc}</p>
                    
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm text-orange-400 font-semibold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <span>Explore</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </Tilt>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const WaypointScene = () => {
  return (
    <section className="py-32 bg-[#0A0F1A] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-950/10 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <MapPin className="mx-auto text-rose-500 mb-6 w-12 h-12 opacity-80" />
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Connect the Dots</h2>
          <p className="text-xl text-gray-400 font-light">
            Travel isn't just about the destination. It's the friction, the transit, the layovers, and the unexpected waypoints that define the journey.
          </p>
        </div>

        <div className="relative h-64 md:h-48 max-w-5xl mx-auto flex items-center justify-center">
          <RouteLine className="absolute inset-0 z-0 opacity-50" />
          
          <div className="relative z-10 w-full flex justify-between items-center px-4 md:px-12">
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.8)]" />
              <div className="font-mono text-xs text-orange-400 uppercase tracking-widest bg-[#0A0F1A] px-2 py-1">Origin</div>
            </motion.div>

            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-3 h-3 rounded-full bg-rose-500 border-2 border-[#0A0F1A] shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
              <div className="font-mono text-[10px] text-rose-400 uppercase tracking-widest bg-[#0A0F1A] px-2 py-1">Transit</div>
            </motion.div>

            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 1.8 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
              <div className="font-mono text-xs text-amber-400 uppercase tracking-widest bg-[#0A0F1A] px-2 py-1">Arrival</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StoryCards = () => {
  const stories = [
    {
      category: "Productivity",
      title: "Working from the Shinkansen",
      excerpt: "How to stay focused at 320km/h while traversing the Japanese countryside.",
      icon: <Zap size={20} />,
      color: "border-orange-500/30 hover:border-orange-500 text-orange-400"
    },
    {
      category: "Culture",
      title: "The Midnight Street Food Rules",
      excerpt: "Navigating night markets without a map: look for the longest line of locals.",
      icon: <Utensils size={20} />,
      color: "border-rose-500/30 hover:border-rose-500 text-rose-400"
    },
    {
      category: "Hacks",
      title: "Beating the 12-Hour Jet Lag",
      excerpt: "Strategic sunlight, fasting windows, and why you shouldn't nap at 3 PM.",
      icon: <Sun size={20} />,
      color: "border-amber-400/30 hover:border-amber-400 text-amber-300"
    }
  ];

  return (
    <section className="py-24 bg-[#0A0F1A]">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <BookOpen className="text-gray-500" />
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Curated Field Notes</h2>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-800 to-transparent ml-4" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`group bg-[#111827] border rounded-2xl p-8 transition-all duration-300 hover:bg-[#1f2937] ${story.color}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl bg-[#0A0F1A] border border-inherit text-inherit`}>
                  {story.icon}
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase border border-inherit px-2 py-1 rounded-full opacity-60">
                  {story.category}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-inherit transition-colors">
                {story.title}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-8">
                {story.excerpt}
              </p>
              
              <div className="flex items-center gap-2 text-sm font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                Read Dispatch <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TimeZoneTravelersPage = () => {
  return (
    <>
      <Helmet>
        <title>Time-Zone Travelers | Global Discovery Clubhouse</title>
        <meta name="description" content="A warm, energetic hub for people who love culture and exploration across time zones." />
      </Helmet>

      <main className="bg-[#0A0F1A] text-slate-200 min-h-screen selection:bg-orange-500/30">
        <CinematicHero />
        <DiscoveryRail />
        <WaypointScene />
        <StoryCards />
        
        {/* BrandGallery Section */}
        <section className="py-24 bg-[#0A0F1A] relative border-t border-gray-800">
          <div className="container mx-auto px-6 mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 text-center tracking-tight">Visual Archive</h2>
            <div className="max-w-4xl mx-auto">
              <BrandGallery 
                brand="timezone-travelers"
                category="gallery"
                maxImages={12}
                layout="grid"
                showControls={true}
                enableUpload={false}
              />
            </div>
          </div>
        </section>

        {/* Approved Media Section */}
        <section className="py-24 bg-[#111827] relative">
          <PassportStamp text="APPROVED" date="VERIFIED" angle={-20} top="-40px" left="10%" color="border-emerald-500/20 text-emerald-500/20" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center gap-3 px-4 py-2 bg-gray-900 border border-gray-800 rounded-full mb-6">
                <Camera size={16} className="text-gray-400" />
                <span className="font-mono text-xs uppercase tracking-widest text-gray-400">Curated Collection</span>
                <span className="bg-gray-800 text-gray-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {countBrandPhotos('Time-Zone Travelers')} items
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Approved Media</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Official visual assets for Time-Zone Travelers. Manually reviewed to maintain the discovery clubhouse aesthetic.
              </p>
            </div>
            
            <div className="max-w-6xl mx-auto bg-[#0A0F1A] border border-gray-800 rounded-3xl p-6 md:p-12 shadow-2xl">
              <ApprovedMediaGallery brand="Time-Zone Travelers" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default TimeZoneTravelersPage;
