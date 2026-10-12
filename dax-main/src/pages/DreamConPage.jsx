import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  MapPinIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const brandCards = [
  {
    name: 'Dax the Traveler',
    path: '/dax-the-traveler',
    image: '/images/brands/dax-the-traveler/hero/1714962873240.jpeg',
    line: 'Travel stories, gear ideas, city resets, and creator-life adventures.',
    accent: 'from-sky-500 to-emerald-400'
  },
  {
    name: 'Time-Zone Travelers',
    path: '/timezone-travelers',
    image: '/images/brands/timezone-travelers/hero/timezone-travelers.jpg',
    line: 'Travel hacks, trip templates, packing systems, and remote-work routes.',
    accent: 'from-orange-500 to-rose-500'
  },
  {
    name: 'Ani-Dax',
    path: '/ani-dax',
    image: '/images/brands/ani-dax/hero/ani-dax.jpg',
    line: 'Anime commentary, character takes, fan prompts, and creator experiments.',
    accent: 'from-fuchsia-500 to-violet-500'
  },
  {
    name: "God's Vessel",
    path: '/gods-vessel',
    image: '/images/brands/gods-vessel/hero/gods-vessel.jpg',
    line: 'Faith-forward stories, apparel concepts, quotes, and testimony content.',
    accent: 'from-indigo-500 to-blue-500'
  }
];

const launchActions = [
  {
    label: 'Brand Collabs',
    value: 'Panels, creators, vendors, and community partners'
  },
  {
    label: 'Creator Builds',
    value: 'Videos, merch, stickers, blogs, and short-form campaigns'
  },
  {
    label: 'Fan Entry',
    value: 'Start with the brand that matches your world'
  }
];

export default function DreamConPage() {
  const contactEmail = process.env.REACT_APP_EMAIL_BUSINESS || process.env.REACT_APP_EMAIL_MAIN || 'daxdaniel2013@gmail.com';
  const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent('Dax Collective Dream Con connection')}`;

  return (
    <>
      <Helmet>
        <title>Dax Collective at Dream Con 2026</title>
        <meta
          name="description"
          content="Start here for Dax Collective at Dream Con 2026: travel, anime, faith, merch, and creator collaboration paths."
        />
        <meta property="og:title" content="Dax Collective at Dream Con 2026" />
        <meta property="og:description" content="Travel, anime, faith, and creator brands built for community and collaboration." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://dax-collective.web.app/dream-con" />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <section className="relative min-h-[82vh] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.28),transparent_34%),radial-gradient(circle_at_78%_24%,rgba(236,72,153,0.22),transparent_28%),linear-gradient(135deg,#030712_0%,#111827_48%,#020617_100%)]" />
          <img
            src="/images/brands/dax-collective/logos/primary/logo-main(yellow).png"
            alt=""
            className="absolute right-[-6rem] top-8 hidden h-[36rem] max-w-none opacity-30 blur-[1px] lg:block"
          />
          <div className="absolute inset-0 bg-black/35" />

          <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-center px-5 py-20 sm:px-8 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl"
            >
              <div className="mb-6 flex flex-wrap gap-3 text-sm font-semibold text-cyan-100">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
                  <CalendarDaysIcon className="h-4 w-4" />
                  July 10-12, 2026
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
                  <MapPinIcon className="h-4 w-4" />
                  Houston
                </span>
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
                Dax Collective at Dream Con
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
                A creator hub where travel, anime, faith, merch, and community ideas connect into one system.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={mailto}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  <EnvelopeIcon className="h-5 w-5" />
                  Connect
                </a>
                <a
                  href="#brands"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/15"
                >
                  Explore Brands
                  <ArrowRightIcon className="h-5 w-5" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-zinc-950 px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {launchActions.map((item) => (
              <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">{item.label}</p>
                <p className="mt-2 text-base leading-7 text-slate-200">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="brands" className="px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cyan-300">
                  <SparklesIcon className="h-4 w-4" />
                  Choose a Door
                </p>
                <h2 className="text-3xl font-black tracking-normal text-white sm:text-4xl">Four ways into the collective</h2>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {brandCards.map((brand) => (
                <Link
                  key={brand.name}
                  to={brand.path}
                  className="group overflow-hidden rounded-lg border border-white/10 bg-zinc-900 transition hover:-translate-y-1 hover:border-white/25"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-zinc-800">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className={`mb-4 h-1 w-20 rounded bg-gradient-to-r ${brand.accent}`} />
                    <h3 className="text-xl font-black text-white">{brand.name}</h3>
                    <p className="mt-3 min-h-[5rem] text-sm leading-6 text-slate-300">{brand.line}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-cyan-300">
                      Enter
                      <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-zinc-950 px-5 py-14 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-normal text-white">Creator, vendor, or community partner?</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Reach out with the brand, audience, or offer you want to connect around.
              </p>
            </div>
            <a
              href={mailto}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-100"
            >
              <EnvelopeIcon className="h-5 w-5" />
              Start a Conversation
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
