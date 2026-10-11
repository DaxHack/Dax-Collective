import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, Compass, Cross, Globe2, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const worlds = [
  {
    name: 'Dax the Traveler',
    descriptor: 'Cinematic solo travel and budget hacks.',
    route: '/dax-the-traveler',
    image: '/images/brands/dax-the-traveler/hero/me smiling cuba.jpg',
    imageAlt: 'Dax smiling while traveling in Cuba',
    icon: Compass,
    index: '01',
    tone: 'traveler',
  },
  {
    name: 'Ani-Dax',
    descriptor: 'Deep-dive anime commentary and lore.',
    route: '/ani-dax',
    image: '/assets/approved-media/anidax/setup-anidax-recording-space.png',
    imageAlt: 'Ani-Dax editorial recording workspace',
    icon: Sparkles,
    index: '02',
    tone: 'anime',
  },
  {
    name: "God's Vessel",
    descriptor: 'Faith-forward apparel and study.',
    route: '/gods-vessel',
    image: '/assets/approved-media/gods-vessel/hoodie-el-shaddai-front.png',
    imageAlt: "God's Vessel archive hoodie concept",
    icon: Cross,
    index: '03',
    tone: 'vessel',
  },
  {
    name: 'Time-Zone Travelers',
    descriptor: 'Destination discovery across the hours.',
    route: '/timezone-travelers',
    image: '/assets/approved-media/time-zone-travelers/2024-tokyo-zone-guide-shibuya.png',
    imageAlt: 'Tokyo at night for Time-Zone Travelers',
    icon: Globe2,
    index: '04',
    tone: 'timezone',
  },
];

const EaseUp = ({ children, className = '', delay = 0, reducedMotion }) => (
  <motion.div
    initial={reducedMotion ? false : { opacity: 0, y: 14 }}
    whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

function WorldTile({ world, reducedMotion }) {
  const Icon = world.icon;
  return (
    <Link
      to={world.route}
      data-testid={`link-world-${world.tone}`}
      className={`world-tile world-tile--${world.tone} group relative flex min-h-[205px] overflow-hidden bg-[#13265E] text-[#FFF9EB] outline-none focus-visible:ring-4 focus-visible:ring-[#D9F16A] sm:min-h-[240px] lg:min-h-0`}
    >
      <img
        src={world.image}
        alt={world.imageAlt}
        loading={world.index === '01' || world.index === '02' ? 'eager' : 'lazy'}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#101A38]/95 via-[#101A38]/25 to-[#101A38]/5 transition-opacity duration-500 group-hover:opacity-90" />
      <div className="absolute inset-0 border border-white/15" />
      <div className="relative z-10 flex w-full flex-col justify-between p-4 sm:p-5 lg:p-6">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] font-medium tracking-[0.22em] text-white/80">{world.index} / 04</span>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/45 bg-[#17234A]/25 transition-colors duration-300 group-hover:bg-[#D9F16A] group-hover:text-[#152A70]">
            <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          </span>
        </div>
        <div className="mt-10">
          <h2 className="max-w-[18ch] font-serif text-[1.45rem] leading-[1.02] tracking-[-0.04em] sm:text-[1.8rem]">
            {world.name}
          </h2>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="max-w-[25ch] text-xs leading-relaxed text-white/80 sm:text-sm">{world.descriptor}</p>
            <ArrowUpRight
              className={`mb-0.5 h-5 w-5 shrink-0 transition-transform duration-300 ${reducedMotion ? '' : 'group-hover:-translate-y-0.5 group-hover:translate-x-0.5'}`}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const reducedMotion = useReducedMotion();

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#F2EBDD] text-[#18213A] selection:bg-[#D9F16A] selection:text-[#17234A]">
      <Helmet>
        <title>The Dax Collective | One collective. Multiple worlds.</title>
        <meta
          name="description"
          content="Explore the Dax Collective: Dax the Traveler, Ani-Dax, God's Vessel, and Time-Zone Travelers."
        />
      </Helmet>

      <header className="relative z-20 border-b border-[#18213A]/15 bg-[#F2EBDD]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Link to="/" data-testid="link-home-brand" className="group inline-flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center bg-[#1745D1] font-serif text-lg font-bold text-[#F2EBDD] transition-transform duration-300 group-hover:rotate-[-7deg]">
              D
            </span>
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] sm:inline">Dax Collective</span>
          </Link>
          <a
            href="#worlds"
            data-testid="link-explore-worlds"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#18213A] transition-colors hover:text-[#1745D1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1745D1] sm:text-xs"
          >
            Explore the worlds <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="relative bg-[#1745D1] text-[#F2EBDD]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden="true">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.22) 1px, transparent 1px)', backgroundSize: '68px 68px' }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1745D1] via-transparent to-[#10297F]" />
        </div>
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-9 px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16 lg:min-h-[calc(100svh-73px)] lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 lg:px-12 lg:py-12 xl:gap-16">
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-5 flex items-center gap-3"
            >
              <span className="h-px w-8 bg-[#D9F16A]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.23em] text-[#D9F16A] sm:text-xs">A universe in four directions</span>
            </motion.div>
            <motion.h1
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-[clamp(3.4rem,9.1vw,7.6rem)] leading-[0.84] tracking-[-0.075em]"
            >
              One collective.
              <br />
              <span className="text-[#D9F16A]">Multiple</span>
              <br />
              worlds.
            </motion.h1>
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between lg:block"
            >
              <p className="max-w-md text-sm leading-[1.7] text-[#F2EBDD]/80 sm:text-base lg:mt-8">
                Four distinct worlds, each with its own point of view. Find the one that feels like yours.
              </p>
              <a href="#worlds" className="group inline-flex shrink-0 items-center gap-3 border-b border-[#D9F16A]/65 pb-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#D9F16A] transition-colors hover:text-[#F2EBDD] sm:text-xs lg:mt-8">
                Choose your entrance
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" aria-hidden="true" />
              </a>
            </motion.div>
            <div className="mt-8 hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 lg:flex">
              <span className="h-px w-8 bg-white/35" />
              Travel · Story · Faith · Discovery
            </div>
          </div>

          <div id="worlds" className="scroll-mt-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/65 sm:text-[10px]">Find your world</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/65 sm:text-[10px]">01 — 04</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:gap-3.5">
              {worlds.map((world, index) => (
                <EaseUp key={world.index} delay={reducedMotion ? 0 : index * 0.07} reducedMotion={reducedMotion}>
                  <WorldTile world={world} reducedMotion={reducedMotion} />
                </EaseUp>
              ))}
            </div>
          </div>
        </div>
        <div className="relative h-1.5 bg-[#D9F16A]" />
      </section>

      <section className="relative overflow-hidden bg-[#F2EBDD]">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16 lg:px-12 lg:py-28">
          <EaseUp reducedMotion={reducedMotion} className="flex flex-col justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#1745D1]">The collective / 001</div>
            <div className="mt-8 hidden h-px w-full bg-[#18213A]/20 lg:block" />
          </EaseUp>
          <EaseUp reducedMotion={reducedMotion}>
            <p className="max-w-5xl font-serif text-[clamp(2rem,5.1vw,4.9rem)] leading-[1.05] tracking-[-0.055em]">
              Different interests.
              <br />
              <span className="text-[#1745D1]">One open door</span> to all of them.
            </p>
            <div className="mt-8 grid gap-6 border-t border-[#18213A]/20 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="max-w-lg text-sm leading-[1.75] text-[#4A5060]">
                From a solo journey to a story worth unpacking, a study to carry with you, or a smarter way to see the world — the Dax Collective brings these separate passions together under one name.
              </p>
              <a href="#worlds" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1745D1] transition-colors hover:text-[#10297F]">
                Meet the worlds <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </EaseUp>
        </div>
      </section>

      <section className="bg-[#E7DFC9]">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#1745D1]">Four ways in</p>
              <h2 className="mt-3 font-serif text-4xl leading-none tracking-[-0.045em] sm:text-5xl">Go where curiosity leads.</h2>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4A5060]">Pick a direction →</span>
          </div>
          <div className="grid border-t border-[#18213A]/20 sm:grid-cols-2 lg:grid-cols-4">
            {worlds.map((world) => (
              <Link
                key={world.index}
                to={world.route}
                data-testid={`link-world-list-${world.tone}`}
                className="group flex min-h-[158px] flex-col justify-between border-b border-[#18213A]/20 py-5 pr-5 transition-colors hover:bg-[#F2EBDD]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1745D1] sm:border-r sm:px-5 sm:first:pl-0 lg:min-h-[185px] lg:first:pl-0"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-[#1745D1]">{world.index}</span>
                  <ArrowUpRight className="h-4 w-4 text-[#1745D1] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl tracking-[-0.035em] text-[#18213A]">{world.name}</h3>
                  <p className="mt-2 max-w-[25ch] text-xs leading-relaxed text-[#626675]">{world.descriptor}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#122A78] text-[#F2EBDD]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-9 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-12">
          <div>
            <Link to="/" data-testid="link-footer-home" className="inline-flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center bg-[#D9F16A] font-serif text-base font-bold text-[#122A78]">D</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Dax Collective</span>
            </Link>
            <p className="mt-3 font-serif text-xl tracking-[-0.02em]">One collective. Multiple worlds.</p>
          </div>
          <nav aria-label="Worlds" className="flex flex-wrap gap-x-5 gap-y-2">
            {worlds.map((world) => (
              <Link
                key={world.index}
                to={world.route}
                data-testid={`link-footer-${world.tone}`}
                className="text-[10px] uppercase tracking-[0.12em] text-white/65 transition-colors hover:text-[#D9F16A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9F16A]"
              >
                {world.name}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}