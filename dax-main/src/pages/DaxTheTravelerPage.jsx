import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MapPinIcon, CameraIcon, PlayIcon, ArrowRightIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import Tilt from 'react-parallax-tilt';
import useEmblaCarousel from 'embla-carousel-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { daxTravelerSocialLinks } from '../config/socialLinks';

// Register GSAP Plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ── DATA ──────────────────────────────────────────────────────────────────────
const BASE = '/assets/approved-media/dax-the-traveler';

const HERO_DATA = {
  bgPhoto: `${BASE}/2024-cuba-havana-vieja-facade.png`,
  fgPhoto: `${BASE}/2024-puerto-rico-old-san-juan-street.png`,
  detailPhoto: `${BASE}/2024-cuba-havana-classic-car.png`,
  title: "Dax the Traveler",
  tagline: "Real trips. Honest stories. No influencer fluff.",
  metadata: {
    route: "ATL → HAV → SJU",
    coordinates: "18.4655° N, 66.1057° W",
    year: "2024"
  }
};

const CHAPTERS = [
  {
    id: 'cuba-2024',
    title: 'Havana, Cuba',
    year: '2024',
    coords: '23.1330° N, 82.3830° W',
    description: 'No tourist traps, no resorts. Just casas, classic cars, and the best mojito of my life.',
    photos: [
      `${BASE}/2024-cuba-havana-classic-car.png`,
      `${BASE}/2024-cuba-street-food-mofongo.png`,
      `${BASE}/2024-cuba-street-walk-broll.png`
    ],
    accent: '#F59E0B' // Destination gold
  },
  {
    id: 'puertorico-2024',
    title: 'Puerto Rico',
    year: '2024',
    coords: '18.2208° N, 66.5901° W',
    description: 'Old San Juan, El Morro, and a zipline I almost said no to. Learning to slow down.',
    photos: [
      `${BASE}/2024-puerto-rico-old-san-juan-street.png`,
      `${BASE}/2024-puerto-rico-condado-beach-morning.png`,
      `${BASE}/2024-puerto-rico-toro-verde-zipline.png`
    ],
    accent: '#0EA5E9' // Ocean blue
  },
  {
    id: 'atlanta-2024',
    title: 'Atlanta, GA',
    year: '2024',
    coords: '33.7490° N, 84.3880° W',
    description: 'Home base. Gear packed. Always ready for the next departure.',
    photos: [
      `${BASE}/2024-atlanta-camera-bag-gear.png`,
      `${BASE}/2024-atlanta-packing-flatlay.png`
    ],
    accent: '#38BDF8' // Sky blue
  }
];

const PASSPORT_NOTES = [
  { location: 'El Morro, San Juan', coords: '18.4710° N, 66.1235° W', date: 'Spring 2024', note: 'The wind off the Atlantic hits different here. Spent two hours just watching the kites.' },
  { location: 'Havana Vieja', coords: '23.1368° N, 82.3533° W', date: 'Winter 2024', note: 'Met a guy named Carlos who fixed his 1957 Chevy with spare refrigerator parts.' },
  { location: 'Toro Verde', coords: '18.2546° N, 66.3916° W', date: 'Spring 2024', note: 'Terrified of heights. Went anyway. The silence when you are airborne is absolute.' }
];

const MEMORIES = [
  { id: 1, title: 'Old San Juan', image: `${BASE}/2024-puerto-rico-old-san-juan-street.png`, hook: 'A solo walk through cobblestone streets.' },
  { id: 2, title: 'Above the Canopy', image: `${BASE}/2024-puerto-rico-toro-verde-zipline.png`, hook: 'The 90 seconds I was airborne.' },
  { id: 3, title: 'Cuba on a Budget', image: `${BASE}/2024-cuba-havana-classic-car.png`, hook: '$40 a Day, Real Talk.' },
  { id: 4, title: 'Condado Morning', image: `${BASE}/2024-puerto-rico-condado-beach-morning.png`, hook: 'Sunrise before the city wakes.' }
];

const ROUTE_STOPS = [
  { code: 'ATL', x: 10, y: 50 },
  { code: 'MIA', x: 40, y: 70 },
  { code: 'HAV', x: 60, y: 85 },
  { code: 'SJU', x: 90, y: 40 }
];

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function LayeredHero() {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', prefersReducedMotion ? '0%' : '30%']);
  const yFg = useTransform(scrollYProgress, [0, 1], ['0%', prefersReducedMotion ? '0%' : '15%']);
  const yCard = useTransform(scrollYProgress, [0, 1], ['0%', prefersReducedMotion ? '0%' : '-10%']);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={heroRef} className="relative h-[90vh] md:h-[100vh] min-h-[600px] w-full overflow-hidden bg-[#0A0E17]">
      {/* Background Layer */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-[120%]">
        <img src={HERO_DATA.bgPhoto} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17]/40 via-[#0A0E17]/20 to-[#0A0E17]" />
      </motion.div>

      {/* Foreground Image (Desktop) */}
      <motion.div style={{ y: yFg }} className="hidden md:block absolute bottom-0 right-0 w-[55%] h-[80%] max-w-[800px]">
        <img src={HERO_DATA.fgPhoto} alt="" className="w-full h-full object-cover object-left opacity-80 rounded-tl-3xl shadow-2xl" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0A0E17]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-transparent to-transparent" />
      </motion.div>

      {/* Detail Card Layer */}
      <motion.div style={{ y: yCard }} className="absolute bottom-[5%] md:bottom-[15%] right-6 md:right-[50%] lg:right-[45%] w-[40%] md:w-[280px] aspect-[3/4] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 rotate-[-2deg] z-20">
        <img src={HERO_DATA.detailPhoto} alt="Detail" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="font-mono text-[9px] text-[#F59E0B] tracking-widest uppercase">{HERO_DATA.metadata.coordinates}</div>
        </div>
      </motion.div>

      {/* Typography Layer */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 z-30 pointer-events-none">
        <motion.div style={{ opacity: opacityText }} className="max-w-2xl pointer-events-auto mt-20 md:mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
          >
            <GlobeAltIcon className="w-4 h-4 text-[#0EA5E9]" />
            <span className="text-xs font-medium text-white/80 uppercase tracking-wider">{HERO_DATA.metadata.route} {'//'} {HERO_DATA.metadata.year}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tight mb-6 pr-[45%] md:pr-0"
          >
            Dax the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]">Traveler</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/70 max-w-md mb-8 leading-relaxed pr-[45%] md:pr-0"
          >
            {HERO_DATA.tagline}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <a href="#chapters" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0EA5E9] text-white font-semibold hover:bg-[#0284C7] transition-colors focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-2 focus:ring-offset-[#0A0E17]">
              Read the Stories <ArrowRightIcon className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedRoute() {
  const svgRef = useRef(null);
  
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    gsap.fromTo(el.querySelector('.route-line'), 
      { strokeDasharray: "1000", strokeDashoffset: "1000" },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom 40%",
          scrub: 1
        }
      }
    );

    gsap.fromTo(el.querySelectorAll('.route-node'),
      { scale: 0, opacity: 0, transformOrigin: "center" },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "bottom 50%",
          scrub: 0.5
        }
      }
    );
  }, []);

  return (
    <section className="py-24 bg-[#0A0E17] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-center font-mono text-[10px] text-white/40 uppercase tracking-[0.2em] mb-12">Flight Path</p>
        <div className="relative w-full h-32 md:h-48">
          <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
            <path 
              className="route-line"
              d={`M ${ROUTE_STOPS[0].x} ${ROUTE_STOPS[0].y} Q 25 20, ${ROUTE_STOPS[1].x} ${ROUTE_STOPS[1].y} T ${ROUTE_STOPS[2].x} ${ROUTE_STOPS[2].y} T ${ROUTE_STOPS[3].x} ${ROUTE_STOPS[3].y}`}
              fill="none"
              stroke="rgba(14, 165, 233, 0.4)"
              strokeWidth="0.5"
              strokeDasharray="1 1"
            />
            <path 
              className="route-line"
              d={`M ${ROUTE_STOPS[0].x} ${ROUTE_STOPS[0].y} Q 25 20, ${ROUTE_STOPS[1].x} ${ROUTE_STOPS[1].y} T ${ROUTE_STOPS[2].x} ${ROUTE_STOPS[2].y} T ${ROUTE_STOPS[3].x} ${ROUTE_STOPS[3].y}`}
              fill="none"
              stroke="url(#route-gradient)"
              strokeWidth="0.8"
            />
            <defs>
              <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0EA5E9" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#E879F9" />
              </linearGradient>
            </defs>
            {ROUTE_STOPS.map((stop, i) => (
              <g key={stop.code} className="route-node" transform={`translate(${stop.x}, ${stop.y})`}>
                <circle r="1.5" fill="#0EA5E9" />
                <circle r="3" fill="rgba(14, 165, 233, 0.2)" />
                <text y="-4" fontSize="3" fill="rgba(255,255,255,0.8)" textAnchor="middle" fontFamily="monospace" letterSpacing="0.1em">{stop.code}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}

function DestinationChapters() {
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const texts = gsap.utils.toArray('.chapter-text');
      
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${texts.length * 100}%`,
        pin: leftRef.current,
        anticipatePin: 1
      });

      texts.forEach((text, i) => {
        ScrollTrigger.create({
          trigger: text,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if(self.isActive) setActiveIndex(i);
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="chapters" ref={containerRef} className="relative bg-[#070A11] text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        
        {/* Left: Pinned Visual Scene */}
        <div ref={leftRef} className="w-full md:w-1/2 h-[50vh] md:h-screen sticky top-0 flex items-center justify-center p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
            >
              <img 
                src={CHAPTERS[activeIndex].photos[0]} 
                alt={CHAPTERS[activeIndex].title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070A11]/90 via-[#070A11]/20 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-8">
                <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: CHAPTERS[activeIndex].accent }}>{CHAPTERS[activeIndex].coords}</p>
                <h3 className="text-3xl font-bold mt-2 mb-1">{CHAPTERS[activeIndex].title}</h3>
                <p className="text-white/60 text-sm font-mono">{CHAPTERS[activeIndex].year}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Scrolling Content */}
        <div ref={rightRef} className="w-full md:w-1/2 py-[10vh] md:py-[50vh] px-6 md:px-12 flex flex-col gap-[30vh] md:gap-[80vh]">
          {CHAPTERS.map((chapter, i) => (
            <div key={chapter.id} className="chapter-text min-h-[30vh]">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-white/20" />
                <span className="font-mono text-sm tracking-widest text-white/40">0{i + 1}</span>
              </div>
              <h4 className="text-2xl md:text-4xl font-bold mb-6 leading-tight">{chapter.title}</h4>
              <p className="text-lg text-white/70 leading-relaxed mb-8">{chapter.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                {chapter.photos.slice(1).map((photo, pIdx) => (
                  <div key={pIdx} className="aspect-square rounded-xl overflow-hidden">
                    <img src={photo} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function TravelMemoryRail() {
  const [emblaRef] = useEmblaCarousel({ dragFree: true, align: 'start' });

  return (
    <section className="py-24 bg-[#0A0E17] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Fragments</h2>
        <p className="text-white/60 font-mono text-sm tracking-wide">Moments frozen in time.</p>
      </div>

      {/* Mobile Swipe Rail */}
      <div className="md:hidden overflow-hidden pl-6" ref={emblaRef}>
        <div className="flex gap-4 cursor-grab active:cursor-grabbing">
          {MEMORIES.map((mem) => (
            <div key={mem.id} className="flex-[0_0_75%] min-w-0">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <img src={mem.image} alt={mem.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                  <h4 className="text-white font-bold text-lg">{mem.title}</h4>
                  <p className="text-white/70 text-sm mt-2">{mem.hook}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Tilt Rail */}
      <div className="hidden md:flex justify-center gap-6 px-6">
        {MEMORIES.map((mem, i) => (
          <Tilt 
            key={mem.id} 
            tiltMaxAngleX={10} 
            tiltMaxAngleY={10} 
            perspective={1000} 
            scale={1.02} 
            transitionSpeed={2000}
            className={`w-[280px] h-[380px] rounded-2xl overflow-hidden relative shadow-2xl transition-all duration-500 hover:z-10 ${i % 2 === 0 ? 'translate-y-8' : '-translate-y-8'}`}
          >
            <img src={mem.image} alt={mem.title} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17]/90 via-transparent to-transparent flex flex-col justify-end p-6 border border-white/5 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4">
                <CameraIcon className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-bold text-xl mb-2">{mem.title}</h4>
              <p className="text-white/60 text-sm line-clamp-2">{mem.hook}</p>
            </div>
          </Tilt>
        ))}
      </div>
    </section>
  );
}

function PassportPieces() {
  return (
    <section className="py-24 bg-[#070A11] border-t border-white/5 relative">
      {/* Texture bg */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <MapPinIcon className="w-8 h-8 text-[#F59E0B] mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold text-white mb-2">Field Notes</h2>
          <p className="text-white/50 font-mono text-xs tracking-widest uppercase">Raw thoughts from the road</p>
        </div>

        <div className="space-y-12">
          {PASSPORT_NOTES.map((note, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative pl-8 md:pl-0 border-l border-white/10 md:border-none"
            >
              <div className="md:grid md:grid-cols-12 md:gap-8 items-start">
                <div className="md:col-span-4 mb-4 md:mb-0 md:text-right relative">
                  <div className="hidden md:block absolute right-[-2.25rem] top-2 w-2 h-2 rounded-full bg-[#0EA5E9] shadow-[0_0_10px_#0EA5E9]" />
                  <div className="md:hidden absolute left-[-2.35rem] top-2 w-2 h-2 rounded-full bg-[#0EA5E9] shadow-[0_0_10px_#0EA5E9]" />
                  
                  <p className="font-mono text-sm text-[#0EA5E9] mb-1">{note.location}</p>
                  <p className="font-mono text-[10px] text-white/40">{note.coords}</p>
                  <p className="font-mono text-[10px] text-white/40 mt-1">{note.date}</p>
                </div>
                <div className="md:col-span-8 md:border-l border-white/10 md:pl-8">
                  <p className="text-lg md:text-xl text-white/80 leading-relaxed italic">"{note.note}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkWithDax() {
  return (
    <section className="py-32 bg-[#0A0E17] relative overflow-hidden">
      {/* Abstract Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0EA5E9]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Let's tell a real story.</h2>
        <p className="text-xl text-white/70 mb-12 leading-relaxed">
          I don't do polished hotel reviews or fake enthusiastic brand reads. If you have a destination, gear, or experience that needs an honest, cinematic eye — let's talk.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            href={`mailto:${daxTravelerSocialLinks?.email || 'contact@daxcollective.com'}`}
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors focus:ring-4 focus:ring-white/50 focus:outline-none"
          >
            Start a Conversation
          </a>
          <a 
            href={daxTravelerSocialLinks?.youtube || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-transparent text-white border border-white/20 font-bold rounded-full hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <PlayIcon className="w-5 h-5" /> Watch the Films
          </a>
        </div>
      </div>
    </section>
  );
}

// ── MAIN PAGE COMPONENT ───────────────────────────────────────────────────────

export default function DaxTheTravelerPage() {
  return (
    <div className="min-h-screen bg-[#0A0E17] selection:bg-[#0EA5E9]/30 selection:text-white font-sans overflow-x-hidden">
      <Helmet>
        <title>Dax the Traveler | Honest Travel Stories</title>
        <meta name="description" content="Real trips. Honest stories. Cinematic travel documentary and photography by Dax." />
      </Helmet>

      <LayeredHero />
      <AnimatedRoute />
      <DestinationChapters />
      <TravelMemoryRail />
      <PassportPieces />
      <WorkWithDax />

      {/* Global CSS overrides for the page aesthetic */}
      <style>{`
        :root {
          --travel-accent: #0EA5E9;
        }
        body {
          background-color: #0A0E17;
        }
        /* Custom scrollbar for this page */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #070A11; 
        }
        ::-webkit-scrollbar-thumb {
          background: #1E293B; 
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #334155; 
        }
      `}</style>
    </div>
  );
}
