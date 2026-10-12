// src/components/TravelMatchmaker.jsx
// Professional trip-planning tool for Time-Zone Travelers.
// Filters destinations client-side — no API, no backend dependency.
// MapMasters keeps the gamified version; this is the practical planner.

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapPinIcon, CurrencyDollarIcon, CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

// ─── DESTINATION DATA ────────────────────────────────────────────────────────
// Source: expanded from MapMasters travelCities.js. Shared concept, separate data.
const DESTINATIONS = [
  {
    name: 'Tulum',
    country: 'Mexico',
    description: 'Ancient Mayan ruins overlooking pristine Caribbean beaches. Perfect for culture and beach in one trip.',
    tags: ['beaches', 'culture', 'adventure'],
    budget: 'budget',
    duration: ['weekend', 'week'],
    budgetRange: '$50–100/day',
    blogSlug: null,
  },
  {
    name: 'Santorini',
    country: 'Greece',
    description: 'Iconic white-washed cliffs, volcanic sunsets, and world-class seafood.',
    tags: ['romance', 'beaches', 'scenery'],
    budget: 'luxury',
    duration: ['weekend', 'week'],
    budgetRange: '$200–350/day',
    blogSlug: null,
  },
  {
    name: 'Koh Lanta',
    country: 'Thailand',
    description: 'Quiet beaches and jungle trails without the tourist crowds of Phuket.',
    tags: ['beaches', 'budget', 'adventure'],
    budget: 'budget',
    duration: ['week', 'extended'],
    budgetRange: '$30–60/day',
    blogSlug: null,
  },
  {
    name: 'Lisbon',
    country: 'Portugal',
    description: 'Colorful hilltop neighborhoods, legendary pastéis de nata, and deep maritime history.',
    tags: ['city', 'history', 'culture'],
    budget: 'mid',
    duration: ['weekend', 'week'],
    budgetRange: '$80–150/day',
    blogSlug: null,
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    description: 'Ancient temples, tea ceremony culture, and cherry blossom season in one city.',
    tags: ['culture', 'history', 'romance'],
    budget: 'mid',
    duration: ['week', 'extended'],
    budgetRange: '$100–180/day',
    blogSlug: null,
  },
  {
    name: 'Cape Town',
    country: 'South Africa',
    description: 'Table Mountain, penguin beaches, and some of the world\'s best wine — all in one city.',
    tags: ['adventure', 'scenery', 'city'],
    budget: 'mid',
    duration: ['week', 'extended'],
    budgetRange: '$70–130/day',
    blogSlug: null,
  },
  {
    name: 'Medellín',
    country: 'Colombia',
    description: 'Eternal spring climate, innovative neighborhoods, and one of the great urban transformation stories.',
    tags: ['city', 'budget', 'culture'],
    budget: 'budget',
    duration: ['week', 'extended'],
    budgetRange: '$40–80/day',
    blogSlug: null,
  },
  {
    name: 'Queenstown',
    country: 'New Zealand',
    description: 'Bungee jumping, skiing, and jaw-dropping fjords. The adventure capital of the world.',
    tags: ['adventure', 'scenery', 'mountains'],
    budget: 'luxury',
    duration: ['week', 'extended'],
    budgetRange: '$150–250/day',
    blogSlug: null,
  },
  {
    name: 'Istanbul',
    country: 'Turkey',
    description: 'Two continents, one city. Grand bazaars, Byzantine mosaics, and Bosphorus sunsets.',
    tags: ['history', 'culture', 'city'],
    budget: 'mid',
    duration: ['weekend', 'week'],
    budgetRange: '$60–120/day',
    blogSlug: null,
  },
  {
    name: 'Reykjavík',
    country: 'Iceland',
    description: 'Northern lights, geothermal pools, and volcanic landscapes unlike anything else on Earth.',
    tags: ['adventure', 'scenery', 'mountains'],
    budget: 'luxury',
    duration: ['week', 'extended'],
    budgetRange: '$200–350/day',
    blogSlug: null,
  },
  {
    name: 'Hoi An',
    country: 'Vietnam',
    description: 'Lantern-lit ancient town with the best tailors in Southeast Asia and sublime local cuisine.',
    tags: ['culture', 'budget', 'romance'],
    budget: 'budget',
    duration: ['weekend', 'week'],
    budgetRange: '$25–55/day',
    blogSlug: null,
  },
  {
    name: 'Vancouver',
    country: 'Canada',
    description: 'World-class food scene backed by mountains and ocean — summer hiking or winter skiing.',
    tags: ['city', 'adventure', 'mountains'],
    budget: 'luxury',
    duration: ['weekend', 'week', 'extended'],
    budgetRange: '$150–250/day',
    blogSlug: null,
  },
]

const VIBES = ['beaches', 'mountains', 'city', 'culture', 'history', 'adventure', 'romance', 'budget']
const VIBE_LABELS = {
  beaches: 'Beaches', mountains: 'Mountains', city: 'City Break',
  culture: 'Culture', history: 'History', adventure: 'Adventure',
  romance: 'Romance', budget: 'Budget-Friendly',
}
const BUDGET_OPTIONS = [
  { value: 'any', label: 'Any Budget' },
  { value: 'budget', label: 'Budget (< $80/day)' },
  { value: 'mid', label: 'Mid-Range ($80–180/day)' },
  { value: 'luxury', label: 'Luxury ($180+/day)' },
]
const DURATION_OPTIONS = [
  { value: 'any', label: 'Any Length' },
  { value: 'weekend', label: 'Weekend (2–4 days)' },
  { value: 'week', label: '1 Week' },
  { value: 'extended', label: '2+ Weeks' },
]

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function TravelMatchmaker() {
  const [selectedVibes, setSelectedVibes] = useState([])
  const [budget, setBudget] = useState('any')
  const [duration, setDuration] = useState('any')
  const [hasSearched, setHasSearched] = useState(false)

  function toggleVibe(vibe) {
    setSelectedVibes(prev =>
      prev.includes(vibe) ? prev.filter(v => v !== vibe) : [...prev, vibe]
    )
  }

  const results = useMemo(() => {
    if (!hasSearched) return []
    return DESTINATIONS.filter(dest => {
      const vibeMatch = selectedVibes.length === 0 ||
        selectedVibes.some(v => dest.tags.includes(v))
      const budgetMatch = budget === 'any' || dest.budget === budget
      const durationMatch = duration === 'any' || dest.duration.includes(duration)
      return vibeMatch && budgetMatch && durationMatch
    })
  }, [hasSearched, selectedVibes, budget, duration])

  function handleSearch() {
    setHasSearched(true)
  }

  function handleReset() {
    setSelectedVibes([])
    setBudget('any')
    setDuration('any')
    setHasSearched(false)
  }

  const tzUrl = process.env.REACT_APP_TIMEZONE_TRAVELERS_URL || '#'

  return (
    <div className="space-y-8">

      {/* ── FILTER PANEL ────────────────────────────────────────────────────── */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6">What kind of trip are you looking for?</h3>

        {/* Vibe multi-select */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-orange-300 mb-3 uppercase tracking-wide">Travel Vibe (pick any)</p>
          <div className="flex flex-wrap gap-2">
            {VIBES.map(vibe => (
              <button
                key={vibe}
                onClick={() => toggleVibe(vibe)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedVibes.includes(vibe)
                    ? 'bg-gradient-to-r from-orange-600 to-pink-600 text-white shadow-md'
                    : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 border border-gray-600'
                }`}
              >
                {VIBE_LABELS[vibe]}
              </button>
            ))}
          </div>
        </div>

        {/* Budget + Duration row */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-orange-300 mb-2 uppercase tracking-wide">Budget</p>
            <select
              value={budget}
              onChange={e => setBudget(e.target.value)}
              className="w-full bg-gray-700/60 text-white border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-500"
            >
              {BUDGET_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-sm font-semibold text-orange-300 mb-2 uppercase tracking-wide">Trip Length</p>
            <select
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full bg-gray-700/60 text-white border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-500"
            >
              {DURATION_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Find My Destination
          </button>
          {hasSearched && (
            <button
              onClick={handleReset}
              className="bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 px-6 py-3 rounded-full font-medium transition-colors border border-gray-600"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── RESULTS ─────────────────────────────────────────────────────────── */}
      {hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {results.length === 0 ? (
            <div className="bg-gray-800/40 rounded-xl p-8 text-center border border-gray-700">
              <p className="text-gray-300 text-lg mb-2">No destinations matched those filters.</p>
              <p className="text-gray-400 text-sm">Try selecting fewer vibes or changing your budget.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-4">
                {results.length} destination{results.length !== 1 ? 's' : ''} matched your preferences
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.map((dest, i) => (
                  <motion.div
                    key={dest.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.35 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-orange-500/60 transition-all duration-300 flex flex-col"
                  >
                    {/* Card header */}
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-white">{dest.name}</h4>
                          <div className="flex items-center gap-1 text-orange-300 text-sm mt-0.5">
                            <MapPinIcon className="h-3.5 w-3.5" />
                            <span>{dest.country}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs bg-gray-700/50 px-2 py-1 rounded-full">
                          <CurrencyDollarIcon className="h-3 w-3" />
                          <span>{dest.budgetRange}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">{dest.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {dest.tags.map(tag => (
                          <span key={tag} className="text-xs bg-orange-900/40 text-orange-300 border border-orange-800/40 px-2 py-0.5 rounded-full capitalize">
                            {VIBE_LABELS[tag] || tag}
                          </span>
                        ))}
                        <span className="text-xs bg-gray-700/40 text-gray-400 border border-gray-600/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {dest.duration.join(' / ')}
                        </span>
                      </div>
                    </div>

                    {/* Card CTAs */}
                    <div className="border-t border-gray-700/60 p-4 space-y-2">
                      {/* Plan this trip — links to blog when available, placeholder otherwise */}
                      <a
                        href={dest.blogSlug ? `/timezone-travelers/guides/${dest.blogSlug}` : tzUrl}
                        target={dest.blogSlug ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
                      >
                        <span>Plan this trip</span>
                        <ArrowRightIcon className="h-4 w-4" />
                      </a>
                      {/* Read travel guide — placeholder until blog posts exist */}
                      <button
                        disabled
                        className="flex items-center justify-between w-full bg-gray-700/40 text-gray-400 px-4 py-2.5 rounded-lg text-sm border border-gray-600/40 cursor-not-allowed"
                        title="Travel guide coming soon"
                      >
                        <span>Read travel guide</span>
                        <span className="text-xs bg-gray-600/60 px-2 py-0.5 rounded-full">Coming soon</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ── ITINERARY OFFER PLACEHOLDER ─────────────────────────────── */}
              {/* Activate at $250-$500/week milestone: wire to email capture or booking CTA */}
              <div className="mt-8 bg-gradient-to-r from-orange-900/40 to-pink-900/40 border border-orange-700/40 rounded-2xl p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">Want a custom itinerary?</h4>
                <p className="text-gray-300 text-sm mb-4 max-w-lg mx-auto">
                  We're building personalized day-by-day itineraries for top destinations.
                  Join the waitlist to be first to access them.
                </p>
                {/* TODO: Replace with email capture form at $250-$500/week milestone */}
                <button
                  disabled
                  className="bg-orange-600/40 text-orange-200 px-6 py-2.5 rounded-full font-medium text-sm border border-orange-600/40 cursor-not-allowed"
                >
                  Join Itinerary Waitlist — Coming Soon
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}
