import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const BRANDS = [
  {
    name: 'Dax the Traveler',
    route: '/dax-the-traveler',
    gradient: 'from-cyan-400 to-blue-500',
    textGradient: 'from-cyan-400 to-blue-400',
    tagline: 'Real trips. Real stories.',
    description:
      'Personal travel storytelling without the polish. Budget guides, solo trip notes, vlog-to-blog pieces, and honest takes on every destination.',
    content: ['From the Vlog', 'Wanderlost with Dax', 'Quick Blips', 'Quick Jumps', 'Dax Travel Kit', 'Side Quests'],
  },
  {
    name: 'Time-Zone Travelers',
    route: '/timezone-travelers',
    gradient: 'from-orange-400 to-pink-500',
    textGradient: 'from-orange-400 to-pink-400',
    tagline: 'Hacks. Itineraries. Adventures.',
    description:
      'The practical travel hub. Build itineraries, access zone guides, and get the real logistics on budget travel done right.',
    content: ['Zone Guides', 'Travel Dispatches', 'Time-Zone Tips', 'Route Packs', 'Travel Toolkits', 'Itinerary Builder'],
  },
  {
    name: 'Ani-Dax',
    route: '/ani-dax',
    gradient: 'from-purple-400 to-blue-500',
    textGradient: 'from-purple-400 to-blue-400',
    tagline: 'Arc Review • Character Files • AniDax Pulse',
    description:
      'Deep-dive anime analysis. Seasonal recaps, character breakdowns, arc reviews, and the ongoing argument about Re:Zero.',
    content: ['Anime Files', 'AniDax Pulse', 'Character Files', 'Arc Review', 'Ranking Runs', 'Lore Check'],
  },
  {
    name: "God's Vessel",
    route: '/gods-vessel',
    gradient: 'from-yellow-600 to-amber-400',
    textGradient: 'from-yellow-500 to-amber-400',
    tagline: 'The Names of God: The Dictionary Series',
    description:
      'A premium faithwear archive. Each piece built around a name of God — scripture, etymology, meaning, and product designed to be worn, read, and kept.',
    content: ['Archive Collection', 'Study Cards', 'Scripture Threads', 'Archive Notes', 'The Drop', 'The Collection'],
  },
];

const BrandsPage = () => {
  return (
    <>
      <Helmet>
        <title>Our Brands — Dax Collective</title>
        <meta
          name="description"
          content="Four brands under the Dax Collective umbrella: Dax the Traveler, Time-Zone Travelers, Ani-Dax, and God's Vessel."
        />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
              The Collective
            </p>
            <h1 className="text-5xl font-black mb-5">
              Four Brands.{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                One Voice.
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Each brand has its own identity, aesthetic, and audience — built independently,
              connected by the same commitment to honest content.
            </p>
          </div>

          <div className="space-y-6">
            {BRANDS.map((brand, i) => (
              <div
                key={brand.route}
                className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
              >
                <div className={`h-1 w-full bg-gradient-to-r ${brand.gradient}`} />
                <div className="p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono text-gray-600">
                          0{i + 1}
                        </span>
                        <h2
                          className={`text-2xl font-bold bg-gradient-to-r ${brand.textGradient} bg-clip-text text-transparent`}
                        >
                          {brand.name}
                        </h2>
                      </div>
                      <p className="text-xs text-gray-500 mb-4 italic">{brand.tagline}</p>
                      <p className="text-gray-300 leading-relaxed mb-5">{brand.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {brand.content.map((section) => (
                          <span
                            key={section}
                            className="text-xs font-medium text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      to={brand.route}
                      className={`shrink-0 self-start inline-flex items-center gap-2 bg-gradient-to-r ${brand.gradient} text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-opacity hover:opacity-90`}
                    >
                      Visit <ArrowRightIcon className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandsPage;
