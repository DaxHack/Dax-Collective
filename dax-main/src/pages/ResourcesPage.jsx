import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const RESOURCES = [
  {
    id: 1,
    brand: 'dax-the-traveler',
    brandLabel: 'Dax the Traveler',
    brandColor: 'text-cyan-400',
    title: 'Cuba Travel Checklist',
    description:
      'What to pack, what documents you need, how much cash to bring, and what to leave at home.',
    type: 'Checklist',
    status: 'Coming soon',
    affiliate: false,
    href: '#',
  },
  {
    id: 2,
    brand: 'dax-the-traveler',
    brandLabel: 'Dax the Traveler',
    brandColor: 'text-cyan-400',
    title: 'Puerto Rico 5-Day Budget Template',
    description:
      'A day-by-day budget template for a 5-day Puerto Rico trip. Editable Google Sheets format.',
    type: 'Template',
    status: 'Coming soon',
    affiliate: false,
    href: '#',
  },
  {
    id: 3,
    brand: 'time-zone-travelers',
    brandLabel: 'Time-Zone Travelers',
    brandColor: 'text-orange-400',
    title: 'Travel Toolkit — Booking Stack',
    description:
      'The flight, hotel, and activity booking tools we actually use. Includes notes on when each is cheapest.',
    type: 'Resource Guide',
    status: 'Available',
    affiliate: true,
    href: '/timezone-travelers',
  },
  {
    id: 4,
    brand: 'time-zone-travelers',
    brandLabel: 'Time-Zone Travelers',
    brandColor: 'text-orange-400',
    title: 'Zone Guide: Caribbean',
    description:
      'A practical region guide covering Cuba, Puerto Rico, Dominican Republic, and Jamaica. Climate, cost, best entry points.',
    type: 'Zone Guide',
    status: 'Coming soon',
    affiliate: false,
    href: '#',
  },
  {
    id: 5,
    brand: 'ani-dax',
    brandLabel: 'Ani-Dax',
    brandColor: 'text-purple-400',
    title: 'Re:Zero Character Overview',
    description:
      'Non-spoiler breakdown of main characters and their arcs through Season 2. Good for newcomers.',
    type: 'Reference Sheet',
    status: 'Coming soon',
    affiliate: false,
    href: '#',
  },
  {
    id: 6,
    brand: 'ani-dax',
    brandLabel: 'Ani-Dax',
    brandColor: 'text-purple-400',
    title: 'AniDax Watch Queue — Starter List',
    description:
      'A curated entry-point list for people new to serious anime. 10 shows, explained without spoilers.',
    type: 'Curated List',
    status: 'Available',
    affiliate: false,
    href: '/ani-dax',
  },
  {
    id: 7,
    brand: 'gods-vessel',
    brandLabel: "God's Vessel",
    brandColor: 'text-yellow-500',
    title: 'Names of God — Study Reference (Free)',
    description:
      'A single-page reference sheet covering 6 names of God with scripture, etymology, and definition. Printable PDF.',
    type: 'Study Sheet',
    status: 'Coming soon',
    affiliate: false,
    href: '#',
  },
  {
    id: 8,
    brand: 'gods-vessel',
    brandLabel: "God's Vessel",
    brandColor: 'text-yellow-500',
    title: 'Archive Waitlist',
    description:
      "Early access to Phase 1 drops of The Names of God: The Dictionary Series. El Shaddai, Adonai, and Elohim.",
    type: 'Waitlist',
    status: 'Open',
    affiliate: false,
    href: '/gods-vessel',
  },
];

const FILTERS = ['All', "Dax the Traveler", 'Time-Zone Travelers', 'Ani-Dax', "God's Vessel"];

const ResourcesPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered =
    activeFilter === 'All'
      ? RESOURCES
      : RESOURCES.filter((r) => r.brandLabel === activeFilter);

  return (
    <>
      <Helmet>
        <title>Resources — Dax Collective</title>
        <meta
          name="description"
          content="Free guides, checklists, templates, and curated lists from Dax the Traveler, Time-Zone Travelers, AniDax, and God's Vessel."
        />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
              Resources
            </p>
            <h1 className="text-4xl font-bold text-white mb-4">Guides, Checklists & Tools</h1>
            <p className="text-gray-400">
              Free resources from all four brands. Use them, share them.
            </p>
          </div>

          <div className="mb-8 p-4 bg-gray-900 border border-gray-800 rounded-xl flex items-start gap-3">
            <InformationCircleIcon className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-gray-400 text-xs leading-relaxed">
              Some resources on this page may contain affiliate links — products or services we
              use and recommend. We earn a small commission at no cost to you.{' '}
              <Link to="/disclosure" className="text-blue-400 hover:underline">
                Read our full disclosure.
              </Link>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {filtered.map((resource) => (
              <div
                key={resource.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${resource.brandColor}`}>
                    {resource.brandLabel}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      resource.status === 'Available' || resource.status === 'Open'
                        ? 'bg-green-500/15 text-green-400'
                        : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {resource.status}
                  </span>
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-1">
                  {resource.type}
                </span>
                <h3 className="text-white font-bold mb-2">{resource.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-5">
                  {resource.description}
                </p>

                {resource.affiliate && (
                  <p className="text-xs text-gray-600 mb-3">
                    * May contain affiliate links.{' '}
                    <Link to="/disclosure" className="hover:text-gray-400">Disclosure</Link>
                  </p>
                )}

                <a
                  href={resource.href}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    resource.status === 'Available' || resource.status === 'Open'
                      ? 'text-white hover:text-blue-400'
                      : 'text-gray-600 pointer-events-none'
                  }`}
                >
                  {resource.status === 'Coming soon'
                    ? 'Notify me when available'
                    : resource.type === 'Waitlist'
                    ? 'Join waitlist'
                    : 'Access resource'}
                  {resource.status !== 'Coming soon' && (
                    <ArrowRightIcon className="h-3 w-3" />
                  )}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourcesPage;
