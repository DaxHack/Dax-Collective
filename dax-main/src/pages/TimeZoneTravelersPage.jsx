// src/pages/TimeZoneTravelersPage.jsx
// OPTIMIZED VERSION - Original styling preserved, improved functionality

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  MapPinIcon, 
  ClockIcon, 
  StarIcon, 
  GlobeAltIcon,
  CameraIcon,
  PlayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import BrandGallery from '../components/BrandGallery';

const TimeZoneTravelersPage = () => {
  const [activeSection, setActiveSection] = useState('hacks');
  
  // OPTIMIZED STATE WITH CACHING
  const [travelData, setTravelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  
  // VIDEO CAROUSEL STATE
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [travelVideoData, setTravelVideoData] = useState([]);

  // CACHE DURATION: 5 minutes to limit API requests
  const CACHE_DURATION = 5 * 60 * 1000;

  // OPTIMIZED DATA LOADING WITH CACHING
  const loadTravelData = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    const cachedData = localStorage.getItem('timezone-travelers-data');
    const cachedTimestamp = localStorage.getItem('timezone-travelers-timestamp');
    
    // Use cached data if available and not expired
    if (!forceRefresh && cachedData && cachedTimestamp) {
      const timeDiff = now - parseInt(cachedTimestamp);
      if (timeDiff < CACHE_DURATION) {
        const parsed = JSON.parse(cachedData);
        setTravelData(parsed.travelData);
        setTravelVideoData(parsed.videoData || []);
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      
      // SIMULATE TRAVEL DATA LOADING (replace with real API)
      const mockTravelData = getMockTravelData();
      setTravelData(mockTravelData);
      setTravelVideoData(mockTravelData.videos);
      
      // CACHE THE DATA
      const dataToCache = {
        travelData: mockTravelData,
        videoData: mockTravelData.videos
      };
      localStorage.setItem('timezone-travelers-data', JSON.stringify(dataToCache));
      localStorage.setItem('timezone-travelers-timestamp', now.toString());
      
    } catch (err) {
      setError(err.message);
      const fallbackData = getMockTravelData();
      setTravelData(fallbackData);
      setTravelVideoData(fallbackData.videos);
    } finally {
      setLoading(false);
      setLastFetch(now);
    }
  }, []);

  useEffect(() => {
    loadTravelData();
  }, [loadTravelData]);

  // MOCK TRAVEL DATA (OPTIMIZED)
  const getMockTravelData = useCallback(() => ({
    travelHacks: [
      {
        id: 1,
        title: "The 2-Minute Airport Security Hack",
        category: "Airport Tips",
        description: "Skip the long lines with this simple preparation trick that 99% of travelers don't know.",
        readTime: "2 min",
        saves: 1247
      },
      {
        id: 2,
        title: "Free WiFi Anywhere in the World",
        category: "Tech Hacks",
        description: "Never pay for internet again with these 5 foolproof methods that work in any country.",
        readTime: "3 min",
        saves: 2156
      },
      {
        id: 3,
        title: "Book Hotels 40% Cheaper",
        category: "Budget Hacks",
        description: "The exact timing and platform strategy that saves hundreds on accommodation.",
        readTime: "4 min",
        saves: 3421
      }
    ],
    quickItineraries: [
      {
        destination: "Tokyo in 48 Hours",
        highlights: ["Shibuya Crossing", "Tsukiji Market", "Senso-ji Temple", "Harajuku District"],
        budget: "$200-300",
        bestFor: "First-time visitors"
      },
      {
        destination: "Paris Weekend Escape",
        highlights: ["Eiffel Tower", "Louvre Museum", "Montmartre", "Seine River Cruise"],
        budget: "$250-400",
        bestFor: "Romantic getaway"
      },
      {
        destination: "Bangkok Street Food Tour",
        highlights: ["Chatuchak Market", "Khao San Road", "Floating Market", "Temple Hopping"],
        budget: "$50-100",
        bestFor: "Food lovers"
      }
    ],
    videos: [
      { id: 1, title: "Travel Hacks 2024", thumbnail: "/api/placeholder/300/200", videoUrl: "https://youtube.com/watch?v=travel1", views: 25420, duration: "10:34" },
      { id: 2, title: "Budget Travel Guide", thumbnail: "/api/placeholder/300/200", videoUrl: "https://youtube.com/watch?v=travel2", views: 18567, duration: "15:22" },
      { id: 3, title: "Tokyo Itinerary", thumbnail: "/api/placeholder/300/200", videoUrl: "https://youtube.com/watch?v=travel3", views: 32876, duration: "12:45" },
      { id: 4, title: "Packing Tips", thumbnail: "/api/placeholder/300/200", videoUrl: "https://youtube.com/watch?v=travel4", views: 14234, duration: "8:12" }
    ]
  }), []);

  // VIDEO CAROUSEL CONTROLS
  const nextVideo = useCallback(() => {
    setCurrentVideoIndex(prev => (prev + 1) % travelVideoData.length);
  }, [travelVideoData.length]);

  const prevVideo = useCallback(() => {
    setCurrentVideoIndex(prev => (prev - 1 + travelVideoData.length) % travelVideoData.length);
  }, [travelVideoData.length]);

  const formatNumber = useCallback((num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  }, []);

  // LOADING STATE (PRESERVE ORIGINAL STYLING)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-white">Loading travel content...</p>
          {lastFetch && (
            <p className="text-sm text-orange-300 mt-2">
              Last updated: {new Date(lastFetch).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Timezone Travelers – Travel Hacks & Global Gems</title>
        <meta 
          name="description" 
          content="Find travel inspiration, destination tips, and hidden gems from across the globe. Your guide to smart and soulful travel." />
        <meta property="og:title" content="Timezone Travelers – Travel Hacks & Global Gems" />
        <meta property="og:description" content="Discover the world's best travel tips and adventures in one place." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 text-white">
        {/* Hero Section (ORIGINAL STYLING PRESERVED) */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('/api/placeholder/1920/600')`
            }}
          >
            <div className="text-center max-w-4xl px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  🌍 TIMEZONE TRAVELERS
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-6">
                  Hacks. Itineraries. Adventures.
                </p>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  This is the hub for all our travel content—quick tips, travel hacks, and daily dose of wanderlust. 
                  Find your next destination, get inspired, or support the movement to travel smarter and freer.
                </p>
                
                {error && (
                  <div className="bg-yellow-900/50 border border-yellow-600 text-yellow-300 px-4 py-3 rounded mb-4 max-w-md mx-auto mt-4">
                    <p className="text-sm">Using cached content. {error}</p>
                    <button 
                      onClick={() => loadTravelData(true)}
                      className="text-yellow-200 underline text-sm mt-1"
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* OPTIMIZED VIDEO CAROUSEL - 1 MAIN + 3 SMALLER HORIZONTAL */}
        {travelVideoData.length > 0 && (
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
                <h2 className="text-2xl font-bold text-white mb-6">Latest Travel Content</h2>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* MAIN VIDEO */}
                  <div className="lg:col-span-2">
                    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <img 
                        src={travelVideoData[currentVideoIndex]?.thumbnail} 
                        alt={travelVideoData[currentVideoIndex]?.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                        <a 
                          href={travelVideoData[currentVideoIndex]?.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-orange-600 bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-300 transform hover:scale-110"
                        >
                          <PlayIcon className="h-8 w-8 text-white" />
                        </a>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        {travelVideoData[currentVideoIndex]?.duration}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {travelVideoData[currentVideoIndex]?.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <EyeIcon className="h-4 w-4" />
                          <span>{formatNumber(travelVideoData[currentVideoIndex]?.views)} views</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 SMALLER VIDEOS VERTICAL STACK */}
                  <div className="space-y-4">
                    {travelVideoData.slice(1, 4).map((video, index) => (
                      <div 
                        key={video.id}
                        className="flex gap-3 cursor-pointer hover:bg-gray-700/30 p-2 rounded-lg transition-colors"
                        onClick={() => setCurrentVideoIndex(index + 1)}
                      >
                        <div className="relative w-24 h-16 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <PlayIcon className="h-4 w-4 text-white" />
                          </div>
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white px-1 text-xs rounded">
                            {video.duration}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white line-clamp-2 mb-1">
                            {video.title}
                          </h4>
                          <p className="text-xs text-gray-400">
                            {formatNumber(video.views)} views
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* NAVIGATION CONTROLS */}
                    <div className="flex justify-center gap-2 pt-4">
                      <button 
                        onClick={prevVideo}
                        className="p-2 bg-orange-600/30 hover:bg-orange-600/50 rounded-full transition-colors"
                      >
                        <ChevronLeftIcon className="h-4 w-4 text-orange-300" />
                      </button>
                      <button 
                        onClick={nextVideo}
                        className="p-2 bg-orange-600/30 hover:bg-orange-600/50 rounded-full transition-colors"
                      >
                        <ChevronRightIcon className="h-4 w-4 text-orange-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content Tabs (ORIGINAL STYLING PRESERVED) */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-8 bg-gray-800/30 backdrop-blur-sm rounded-full p-2 border border-gray-700">
              {[
                { id: 'hacks', label: 'Travel Hacks' },
                { id: 'itineraries', label: 'Quick Itineraries' },
                { id: 'inspiration', label: 'Daily Inspiration' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeSection === tab.id
                      ? 'bg-gradient-to-r from-orange-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Travel Hacks Section (ORIGINAL STYLING PRESERVED) */}
            {activeSection === 'hacks' && travelData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {travelData.travelHacks.map((hack) => (
                  <div key={hack.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-orange-500 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-orange-600/30 text-orange-300 px-3 py-1 rounded-full text-sm font-semibold">
                        {hack.category}
                      </span>
                      <span className="text-gray-400 text-sm">{hack.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">{hack.title}</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">{hack.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{hack.saves} saves</span>
                      <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                        Read Hack
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Quick Itineraries Section (ORIGINAL STYLING PRESERVED) */}
            {activeSection === 'itineraries' && travelData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {travelData.quickItineraries.map((itinerary, index) => (
                  <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{itinerary.destination}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                          <span>Budget: {itinerary.budget}</span>
                          <span>Best for: {itinerary.bestFor}</span>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <h4 className="text-lg font-semibold text-white mb-3">Must-See Highlights:</h4>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {itinerary.highlights.map((highlight, idx) => (
                            <div key={idx} className="flex items-center text-gray-300">
                              <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                              {highlight}
                            </div>
                          ))}
                        </div>
                        
                        <button className="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300">
                          Get Full Itinerary
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Daily Inspiration Section (ORIGINAL STYLING PRESERVED) */}
            {activeSection === 'inspiration' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700">
                  <h3 className="text-3xl font-bold text-white mb-6">Today's Travel Inspiration</h3>
                  <blockquote className="text-2xl text-gray-300 italic mb-6 leading-relaxed">
                    "The world is a book and those who do not travel read only one page."
                  </blockquote>
                  <p className="text-gray-400 mb-8">- Saint Augustine</p>
                  
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-400 mb-2">195</div>
                      <div className="text-gray-400">Countries to Explore</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-pink-400 mb-2">∞</div>
                      <div className="text-gray-400">Adventures Waiting</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-400 mb-2">1</div>
                      <div className="text-gray-400">Life to Live</div>
                    </div>
                  </div>
                  
                  <button className="mt-8 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                    Start Your Journey Today
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* BrandGallery Section (OPTIMIZED) */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Photo Gallery
            </h2>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
              <BrandGallery 
                brand="timezone-travelers"
                category="gallery"
                maxImages={12}
                layout="grid"
                showControls={true}
                enableUpload={false}
                className="travel-gallery"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TimeZoneTravelersPage;

