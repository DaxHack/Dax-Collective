import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { Compass, Sparkles, Globe2, Cross, ArrowRight, PlayCircle, Star, MoveRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const BUBBLE_COUNT = 30;

const FloatingOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#02000a] mix-blend-multiply" />
      {/* Background ambient gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/20 blur-[120px] opacity-60 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-fuchsia-600/20 blur-[150px] opacity-50 animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-[40%] left-[60%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/10 blur-[100px] opacity-40 animate-pulse" style={{ animationDuration: '12s' }} />
      
      {/* Orbs */}
      {Array.from({ length: BUBBLE_COUNT }).map((_, i) => {
        const size = Math.random() * 6 + 2;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * -20;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: size,
              height: size,
              left: `${startX}%`,
              top: `${startY}%`,
              boxShadow: `0 0 ${size * 2}px ${size / 2}px rgba(255,255,255,0.8), 0 0 ${size * 4}px rgba(255,255,255,0.4)`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              y: [0, -100, -200, -300],
              x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25, Math.random() * 50 - 25],
              opacity: [0, Math.random() * 0.8 + 0.2, Math.random() * 0.8 + 0.2, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
      })}
    </div>
  );
};

const brands = [
  {
    name: "Dax the Traveler",
    desc: "Cinematic solo travel and budget hacks.",
    link: "/dax-the-traveler",
    icon: Compass,
    color: "from-sky-400 to-blue-600",
    shadow: "shadow-sky-500/50",
    bg: "bg-sky-950/30",
    border: "border-sky-500/30",
    accent: "text-sky-400",
    image: "/images/brands/dax-the-traveler/hero/me smiling cuba.jpg"
  },
  {
    name: "Ani-Dax",
    desc: "Deep-dive anime commentary and lore.",
    link: "/ani-dax",
    icon: Sparkles,
    color: "from-fuchsia-400 to-purple-600",
    shadow: "shadow-fuchsia-500/50",
    bg: "bg-fuchsia-950/30",
    border: "border-fuchsia-500/30",
    accent: "text-fuchsia-400",
    image: "/images/brands/ani-dax/hero/ani-dax.jpg"
  },
  {
    name: "Time-Zone Travelers",
    desc: "Global itineraries & smarter adventures.",
    link: "/timezone-travelers",
    icon: Globe2,
    color: "from-orange-400 to-coral-600",
    shadow: "shadow-orange-500/50",
    bg: "bg-orange-950/30",
    border: "border-orange-500/30",
    accent: "text-orange-400",
    image: "/images/brands/timezone-travelers/hero/timezone-travelers.jpg"
  },
  {
    name: "God's Vessel",
    desc: "Faith-forward apparel and study.",
    link: "/gods-vessel",
    icon: Cross,
    color: "from-amber-300 to-yellow-600",
    shadow: "shadow-amber-500/50",
    bg: "bg-amber-950/30",
    border: "border-amber-500/30",
    accent: "text-amber-400",
    image: "/images/brands/gods-vessel/hero/gods-vessel.jpg"
  }
];

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#02000a] text-white selection:bg-indigo-500/30 font-sans overflow-hidden">
      <Helmet>
        <title>The Dax Collective | A Creator Universe</title>
        <meta name="description" content="Step into the Dax Collective. A multi-brand universe spanning cinematic travel, anime analysis, global itineraries, and faith-forward design." />
      </Helmet>

      <FloatingOrbs />

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center items-center px-6 pt-20 z-10">
        <motion.div 
          style={{ y }}
          className="max-w-5xl mx-auto text-center relative"
        >
          {/* Prismatic flare behind text */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-[80px] -z-10 rounded-full" />
          
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <Star className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium tracking-wide uppercase text-indigo-100">Welcome to the Universe</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-6"
          >
            The Dax
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-300 relative inline-block">
              Collective
              {/* Shimmer sweep */}
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
                style={{ mixBlendMode: 'overlay' }}
              />
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-2xl text-indigo-100/70 max-w-2xl mx-auto font-light leading-relaxed mb-12"
          >
            Four distinct worlds. One unified vision. 
            Journey through travel, anime, culture, and faith.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <button onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95">
              <span className="relative z-10">Explore the Portals</span>
              <MoveRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured World Spotlight: Ani-Dax */}
      <section className="relative py-32 z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-sm font-semibold mb-6">
                <PlayCircle className="w-4 h-4" />
                Featured World
              </div>
              <h2 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-fuchsia-200">
                Ani-Dax
              </h2>
              <p className="text-xl text-fuchsia-100/70 leading-relaxed mb-8">
                Step into the depths of anime culture. Where storytelling meets critical analysis, exploring the psychological and thematic layers of your favorite series.
              </p>
              <Link to="/ani-dax" className="inline-flex items-center gap-2 text-fuchsia-400 font-bold hover:text-fuchsia-300 transition-colors group text-lg">
                Enter Ani-Dax 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-[4/5] md:aspect-video lg:aspect-[4/5] rounded-3xl overflow-hidden group border border-white/10"
              style={{ perspective: '1000px' }}
            >
              <div className="absolute inset-0 bg-fuchsia-500/20 mix-blend-color z-10 group-hover:opacity-0 transition-opacity duration-700" />
              <img 
                src="/images/brands/ani-dax/hero/ani-dax.jpg" 
                alt="Ani-Dax Featured" 
                className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#02000a] via-[#02000a]/40 to-transparent z-20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Portals (Gateway Cards) */}
      <section className="relative py-32 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Choose Your Portal</h2>
            <p className="text-xl text-indigo-200/60 max-w-2xl mx-auto">
              Four distinct domains. Each crafted with intention, waiting to be explored.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brands.map((brand, i) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Tilt
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  perspective={1000}
                  scale={1.02}
                  transitionSpeed={2000}
                  gyroscope={true}
                  className="h-full"
                >
                  <Link to={brand.link} className={`block h-full relative group rounded-3xl overflow-hidden border ${brand.border} ${brand.bg} backdrop-blur-xl p-1`}>
                    {/* Inner Glow on Hover */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${brand.color} mix-blend-overlay`} />
                    
                    <div className="relative h-full rounded-2xl overflow-hidden bg-[#050014] z-10 p-6 flex flex-col items-start border border-white/5 group-hover:border-white/20 transition-colors">
                      {/* Background Image subtle reveal */}
                      <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                        {brand.image && <img src={brand.image} alt="" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050014] via-[#050014]/80 to-[#050014]/20" />
                      </div>

                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${brand.color} p-0.5 mb-8 relative z-20 group-hover:scale-110 transition-transform duration-500 shadow-lg ${brand.shadow}`}>
                        <div className="w-full h-full bg-[#050014] rounded-full flex items-center justify-center">
                          <brand.icon className={`w-6 h-6 ${brand.accent}`} />
                        </div>
                      </div>

                      <h3 className={`text-2xl font-bold mb-3 relative z-20 group-hover:${brand.accent} transition-colors`}>{brand.name}</h3>
                      <p className="text-white/60 relative z-20 mb-8 flex-grow">{brand.desc}</p>

                      <div className="relative z-20 w-full flex items-center justify-between text-sm font-bold uppercase tracking-wider text-white/40 group-hover:text-white transition-colors">
                        <span>Enter World</span>
                        <ArrowRight className={`w-5 h-5 ${brand.accent} transform -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300`} />
                      </div>
                    </div>
                  </Link>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-32 z-10 border-t border-white/10 bg-gradient-to-b from-transparent to-indigo-950/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 blur-[100px] -z-10" />
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to Connect?</h2>
            <p className="text-xl text-indigo-100/70 mb-10 max-w-2xl mx-auto">
              Join the collective. Stories that spark curiosity and celebrate identity across the globe.
            </p>
            <button className="px-10 py-5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all hover:scale-105 active:scale-95 text-white">
              Subscribe to Updates
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
