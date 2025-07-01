// src/pages/DaxTheTravelerPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async'
import { 
  MapPinIcon, 
  CameraIcon, 
  HeartIcon, 
  ShareIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  PaperAirplaneIcon,
  SunIcon,
  MoonIcon,
  StarIcon,
  EyeIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import BrandGallery from '../components/BrandGallery';

const DaxTheTravelerPage = () => {
  const [activeTab, setActiveTab] = useState('adventures');
  const [likedPosts, setLikedPosts] = useState(new Set());

  // Mock data for travel content
  const featuredTrip = {
    title: "Solo Backpacking Through Southeast Asia",
    location: "Thailand, Vietnam, Cambodia",
    duration: "3 weeks",
    date: "March 2024",
    description: "An incredible journey through the heart of Southeast Asia, discovering hidden temples, street food culture, and meeting amazing people along the way.",
    image: "/api/placeholder/800/500",
    videoUrl: "https://youtube.com/watch?v=example",
    highlights: ["Angkor Wat Sunrise", "Bangkok Street Food", "Ha Long Bay Cruise", "Siem Reap Night Markets"],
    stats: { views: 15420, likes: 892, comments: 156 }
  };

  const recentAdventures = [
    {
      id: 1,
      title: "24 Hours in Tokyo: A Whirlwind Adventure",
      location: "Tokyo, Japan",
      date: "2024-05-15",
      image: "/api/placeholder/400/300",
      description: "From sunrise at Tsukiji Fish Market to late-night karaoke in Shibuya, here's how I maximized every minute in Japan's capital.",
      type: "City Guide",
      duration: "1 day",
      views: 8234,
      likes: 445,
      comments: 67
    },
    {
      id: 2,
      title: "Budget Backpacking: Europe for Under $50/Day",
      location: "Multiple European Cities",
      date: "2024-04-20",
      image: "/api/placeholder/400/300",
      description: "Proving that you don't need a fortune to explore Europe. Here are my tried-and-tested tips for budget travel.",
      type: "Travel Tips",
      duration: "2 weeks",
      views: 12567,
      likes: 789,
      comments: 123
    },
    {
      id: 3,
      title: "The Most Beautiful Hidden Beach in Bali",
      location: "Bali, Indonesia",
      date: "2024-03-10",
      image: "/api/placeholder/400/300",
      description: "Away from the crowds, I discovered a pristine beach that locals have kept secret for years. Here's how to find it.",
      type: "Hidden Gems",
      duration: "3 days",
      views: 9876,
      likes: 567,
      comments: 89
    }
  ];

  const travelTips = [
    {
      id: 1,
      title: "Pack Light, Travel Far: My 7kg Backpack Setup",
      category: "Packing",
      readTime: "5 min",
      description: "Everything you need for months of travel in one small backpack. Here's my complete packing list and strategy.",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "How to Find Cheap Flights: My Secret Strategy",
      category: "Budget",
      readTime: "8 min",
      description: "The exact method I use to find flights for 70% less than regular prices. No expensive tools required.",
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Solo Travel Safety: Staying Safe While Exploring",
      category: "Safety",
      readTime: "6 min",
      description: "Essential safety tips for solo travelers, especially for first-timers venturing out alone.",
      image: "/api/placeholder/300/200"
    }
  ];

  const upcomingTrips = [
    {
      destination: "Patagonia, Argentina",
      date: "July 2024",
      type: "Hiking Expedition",
      description: "Trekking through the stunning landscapes of Patagonia"
    },
    {
      destination: "Iceland Ring Road",
      date: "September 2024",
      type: "Road Trip",
      description: "Chasing the Northern Lights and exploring volcanic landscapes"
    },
    {
      destination: "Nepal Himalayas",
      date: "November 2024",
      type: "Mountain Adventure",
      description: "Everest Base Camp trek and cultural immersion"
    }
  ];

  const handleLike = (id ) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedPosts(newLiked);
  };

  return (
    // ===== comment for helmet =====
     <>
    <Helmet>
      <title>Dax the Traveler – Adventures & Life Abroad</title>
      <meta 
        name="description" 
        content="Personal travel stories, cultural experiences, and lessons from the road. Join Dax’s journey around the world." />
      <meta property="og:title" content="Dax the Traveler – Adventures & Life Abroad" />
      <meta property="og:description" content="Explore global journeys and cultural insights with Dax the Traveler." />
      <meta property="og:type" content="website" />
    </Helmet>


    {/* --- comment for divs ---- */}
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div 
          className="h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('/api/placeholder/1920/1080')`
          }}
        >
          <div className="relative z-10 flex items-center justify-center h-full px-4">
            <div className="text-center max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-6"
              >
                <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  DAX THE TRAVELER
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8">
                  Adventures • Chaos • Real Stories
                </p>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Join me as I explore the world one adventure at a time. From solo backpacking 
                  to group escapades, I document the real, unfiltered journey of modern travel.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Latest Adventures
                </button>
                <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-300">
                  Travel Tips
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Trip Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <PaperAirplaneIcon className="h-8 w-8 mr-3 text-blue-400" />
              Latest Epic Journey
            </h2>
          </motion.div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <img 
                  src={featuredTrip.image} 
                  alt={featuredTrip.title}
                  className="w-full h-80 object-cover rounded-xl shadow-2xl"
                />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="flex items-center text-white text-sm">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {featuredTrip.location}
                  </div>
                </div>
                <button className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors rounded-xl">
                  <PlayIcon className="h-16 w-16 text-white" />
                </button>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">{featuredTrip.title}</h3>
                
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-300">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {featuredTrip.date}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {featuredTrip.duration}
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">{featuredTrip.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Trip Highlights:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {featuredTrip.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center text-gray-300 text-sm">
                        <StarSolid className="h-4 w-4 text-yellow-400 mr-2" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {featuredTrip.stats.views.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <HeartIcon className="h-4 w-4 mr-1" />
                      {featuredTrip.stats.likes}
                    </div>
                    <div className="flex items-center">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                      {featuredTrip.stats.comments}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors">
                    <PlayIcon className="h-5 w-5 mr-2" />
                    Watch Full Video
                  </button>
                  <button className="border-2 border-gray-500 text-gray-300 hover:border-white hover:text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors">
                    <ShareIcon className="h-5 w-5 mr-2" />
                    Share Journey
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center mb-8 bg-gray-800/30 backdrop-blur-sm rounded-full p-2 border border-gray-700">
            {[
              { id: 'adventures', label: 'Recent Adventures', icon: CameraIcon },
              { id: 'tips', label: 'Travel Tips', icon: GlobeAltIcon },
              { id: 'upcoming', label: 'Upcoming Trips', icon: CalendarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Adventures Tab */}
          {activeTab === 'adventures' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recentAdventures.map((adventure) => (
                <div key={adventure.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105">
                  <div className="relative">
                    <img 
                      src={adventure.image} 
                      alt={adventure.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-xs font-semibold">{adventure.type}</span>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                      <div className="flex items-center">
                        <ClockIcon className="h-3 w-3 text-white mr-1" />
                        <span className="text-white text-xs">{adventure.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {adventure.location}
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{adventure.title}</h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{adventure.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <span>{adventure.date}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          {adventure.views.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <HeartIcon className="h-4 w-4 mr-1" />
                          {adventure.likes}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors">
                        Read More
                      </button>
                      <button 
                        onClick={() => handleLike(adventure.id)}
                        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        {likedPosts.has(adventure.id) ? (
                          <HeartSolid className="h-4 w-4 text-red-400" />
                        ) : (
                          <HeartIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Tips Tab */}
          {activeTab === 'tips' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {travelTips.map((tip) => (
                <div key={tip.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-green-500 transition-all duration-300">
                  <img 
                    src={tip.image} 
                    alt={tip.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                        {tip.category}
                      </span>
                      <span className="text-gray-400 text-sm">{tip.readTime}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-3">{tip.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{tip.description}</p>
                    
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors">
                      Read Full Guide
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Upcoming Trips Tab */}
          {activeTab === 'upcoming' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {upcomingTrips.map((trip, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{trip.destination}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {trip.date}
                        </div>
                        <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full font-semibold">
                          {trip.type}
                        </span>
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300">
                      Follow Journey
                    </button>
                  </div>
                  
                  <p className="text-gray-300">{trip.description}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* BrandGallery insertion */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">
            Photo Gallery
          </h2>
          <BrandGallery folderId={process.env. REACT_APP_DRIVE_DAX_TRAVELER_PHOTOS} />
        </div>
      </section>

      {/* Travel Stats */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">My Travel Journey So Far</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">47</div>
              <div className="text-gray-400">Countries Visited</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">156</div>
              <div className="text-gray-400">Cities Explored</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">89K</div>
              <div className="text-gray-400">Miles Traveled</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">234</div>
              <div className="text-gray-400">Adventures Shared</div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default DaxTheTravelerPage;
