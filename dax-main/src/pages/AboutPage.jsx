import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const BRANDS = [
  {
    name: 'Dax the Traveler',
    route: '/dax-the-traveler',
    gradient: 'from-cyan-500 to-blue-600',
    description:
      'Personal travel storytelling — real trips, honest guides, no hiker-outdoorsy aesthetic. From solo budget trips to vlog-to-blog posts.',
  },
  {
    name: 'Time-Zone Travelers',
    route: '/timezone-travelers',
    gradient: 'from-orange-500 to-pink-600',
    description:
      'The practical travel hub. Zone guides, route packs, travel toolkits, and an itinerary builder for people who plan.',
  },
  {
    name: 'Ani-Dax',
    route: '/ani-dax',
    gradient: 'from-purple-500 to-blue-600',
    description:
      'Sharp anime analysis. Arc reviews, character breakdowns, seasonal recaps, and the ongoing argument that Re:Zero is the best anime ever made.',
  },
  {
    name: "God's Vessel",
    route: '/gods-vessel',
    gradient: 'from-yellow-600 to-amber-500',
    description:
      'A premium faithwear archive. The Names of God Dictionary Series — every piece built around scripture, etymology, and meaning.',
  },
];

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About — Dax Collective</title>
        <meta
          name="description"
          content="Dax Collective is a multi-brand content platform spanning travel, anime, faith, and lifestyle. Built around storytelling, culture, and purpose."
        />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
              About
            </p>
            <h1 className="text-5xl font-black mb-6 leading-tight">
              The{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dax Collective
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
              A multi-brand content platform built around travel, anime, faith, and lifestyle —
              connecting people through honest storytelling, culture, and purpose-driven content.
            </p>
          </div>

          <div className="space-y-6 text-gray-300 leading-relaxed text-lg mb-16">
            <p>
              The Dax Collective started as one channel and became four brands because the
              interests were too different to force into a single feed. Travel writing feels
              different from anime analysis. Faith-based product design feels different from
              budget itinerary building. Each brand has its own voice, its own aesthetic, its own
              audience.
            </p>
            <p>
              What connects them is a commitment to not faking it. No stock photography pretending
              to be personal. No generic devotional content. No affiliate links for products we
              haven't used. No anime takes written for engagement rather than honesty.
            </p>
            <p>
              The Collective is built slowly, on purpose, one piece at a time.
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">The Four Brands</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {BRANDS.map((brand) => (
                <Link
                  key={brand.route}
                  to={brand.route}
                  className="group block bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-6 transition-all"
                >
                  <div
                    className={`inline-block text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${brand.gradient} bg-clip-text text-transparent mb-3`}
                  >
                    {brand.name}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{brand.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 group-hover:text-white transition-colors">
                    Visit {brand.name} <ArrowRightIcon className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-800 pt-10">
            <h2 className="text-xl font-bold text-white mb-4">Support the Collective</h2>
            <p className="text-gray-400 mb-6">
              All content is independently produced. No team, no agency. If something we've made
              has been useful to you, you can support the work directly.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://buymeacoffee.com/DaxCollective"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm"
              >
                💡 Keep the Lights On
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-5 py-2.5 rounded-full border border-gray-700 transition-colors text-sm"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
