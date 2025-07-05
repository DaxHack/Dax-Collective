// src/pages/AniDaxPage.jsx
// OPTIMIZED VERSION - Original styling preserved, improved functionality

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  StarIcon,
  HeartIcon,
  PlayIcon,
  PlusIcon,
  TvIcon,
  FireIcon,
  SparklesIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
  TrashIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolid,
  HeartIcon as HeartSolid
} from '@heroicons/react/24/solid';

// Import BrandGallery component
import BrandGallery from '../components/BrandGallery';

// Import CommentsSection component
import CommentsSection from '../components/CommentsSection';

// Firebase imports
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const AniDaxPage = () => {
  const [activeTab, setActiveTab] = useState('re-zero-glaze');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // OPTIMIZED STATE WITH CACHING
  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // VIDEO CAROUSEL STATE
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [animeVideoData, setAnimeVideoData] = useState([]);

  // CACHE DURATION: 5 minutes to limit API requests
  const CACHE_DURATION = 5 * 60 * 1000;

  // Initialize auth
  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      // Auto sign-in anonymously if no user
      if (!currentUser) {
        signInAnonymously(auth).catch((error) => {
          console.error('Anonymous auth failed:', error);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // OPTIMIZED DATA LOADING WITH CACHING
  const loadAnimeData = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    const cachedData = localStorage.getItem('ani-dax-data');
    const cachedTimestamp = localStorage.getItem('ani-dax-timestamp');
    
    // Use cached data if available and not expired
    if (!forceRefresh && cachedData && cachedTimestamp) {
      const timeDiff = now - parseInt(cachedTimestamp);
      if (timeDiff < CACHE_DURATION) {
        const parsed = JSON.parse(cachedData);
        setAnimeData(parsed.animeData);
        setAnimeVideoData(parsed.videoData || []);
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      
      // SIMULATE ANIME DATA LOADING (replace with real API)
      const mockAnimeData = getMockAnimeData();
      setAnimeData(mockAnimeData);
      setAnimeVideoData(mockAnimeData.videos);
      
      // CACHE THE DATA
      const dataToCache = {
        animeData: mockAnimeData,
        videoData: mockAnimeData.videos
      };
      localStorage.setItem('ani-dax-data', JSON.stringify(dataToCache));
      localStorage.setItem('ani-dax-timestamp', now.toString());
      
    } catch (err) {
      setError(err.message);
      const fallbackData = getMockAnimeData();
      setAnimeData(fallbackData);
      setAnimeVideoData(fallbackData.videos);
    } finally {
      setLoading(false);
      setLastFetch(now);
    }
  }, []);

  useEffect(() => {
    loadAnimeData();
  }, [loadAnimeData]);

  // MOCK ANIME DATA (OPTIMIZED)
  const getMockAnimeData = useCallback(() => ({
    reZeroContent: {
      title: "Re:Zero is the Greatest Anime Ever Made",
      sections: [
        {
          title: "Natsuki's Genius",
          content: "Subaru's writing style is absolutely revolutionary. He doesn't just write a time-loop story, he creates a psychological masterpiece that explores trauma, growth, and what it means to love someone."
        },
        {
          title: "Subaru: The Perfect Protagonist",
          content: "Subaru Natsuki is hands down the best MC in anime. He's flawed, not perfect, and that's exactly why he's incredible. His character development is unmatched."
        }
      ]
    },
    hottestThisSeason: [
      {
        id: 1,
        title: "Frieren's End",
        rating: 10,
        genre: ["Fantasy", "Drama"],
        episodes: "28 episodes • Completed",
        description: "How it handles time, loss, and the beauty of fleeting moments is incredible. Best anime of the year.",
        status: "Watching",
        imageUrl: "/api/placeholder/300/400"
      },
      {
        id: 2,
        title: "Dungeon Meshi",
        rating: 9,
        genre: ["Fantasy", "Comedy"],
        episodes: "24 episodes • Ongoing",
        description: "Studio Trigger absolutely killed it. The world-building and character dynamics are top-tier.",
        status: "Completed",
        imageUrl: "/api/placeholder/300/400"
      },
      {
        id: 3,
        title: "Solo Leveling",
        rating: 8,
        genre: ["Action", "Fantasy"],
        episodes: "12 episodes • Ongoing",
        description: "The animation quality is insane. A-1 Pictures really understood the assignment.",
        status: "Watching",
        imageUrl: "/api/placeholder/300/400"
      }
    ],
    animeReviews: [
      {
        id: 1,
        title: "Demon Slayer: Hashira Training Arc",
        rating: 7,
        review: "Visually stunning as always, but the pacing felt off. The training sequences were beautifully animated but lacked the emotional depth of previous arcs.",
        pros: ["Incredible animation", "Great character moments", "Beautiful fight scenes"],
        cons: ["Slow pacing", "Limited plot progression", "Felt like filler"],
        imageUrl: "/api/placeholder/300/200"
      },
      {
        id: 2,
        title: "Jujutsu Kaisen Season 2",
        rating: 9,
        review: "MAPPA outdid themselves with the Shibuya Incident. The emotional weight, animation quality, and character development were all phenomenal.",
        pros: ["Top-tier animation", "Emotional storytelling", "Character development"],
        cons: ["Some pacing issues", "Cliffhanger ending"],
        imageUrl: "/api/placeholder/300/200"
      }
    ],
    trendingNow: [
      { title: "Attack on Titan: Final Season", rank: 1, status: "Completed" },
      { title: "Demon Slayer: Hashira Training", rank: 2, status: "Ongoing" },
      { title: "My Hero Academia Season 7", rank: 3, status: "Ongoing" },
      { title: "Jujutsu Kaisen Season 2", rank: 4, status: "Completed" },
      { title: "Chainsaw Man", rank: 5, status: "Completed" }
    ],
    videos: [
      { id: 1, title: "Re:Zero Analysis", thumbnail: "/api/placeholder/300/200", videoUrl: "https://youtube.com/watch?v=anime1", views: 15420, duration: "18:34" },
      { id: 2, title: "Frieren Review", thumbnail: "/api/placeholder/300/200", videoUrl: "https://youtube.com/watch?v=anime2", views: 12567, duration: "12:22" },
      { id: 3, title: "Solo Leveling Thoughts", thumbnail: "/api/placeholder/300/200", videoUrl: "https://youtube.com/watch?v=anime3", views: 9876, duration: "15:45" },
      { id: 4, title: "Seasonal Picks", thumbnail: "/api/placeholder/300/200", videoUrl: "https://youtube.com/watch?v=anime4", views: 8234, duration: "20:12" }
    ]
  }), []);

  // VIDEO CAROUSEL CONTROLS
  const nextVideo = useCallback(() => {
    setCurrentVideoIndex(prev => (prev + 1) % animeVideoData.length);
  }, [animeVideoData.length]);

  const prevVideo = useCallback(() => {
    setCurrentVideoIndex(prev => (prev - 1 + animeVideoData.length) % animeVideoData.length);
  }, [animeVideoData.length]);

  const formatNumber = useCallback((num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  }, []);

  const tabs = useMemo(() => [
    { id: 're-zero-glaze', label: 'Re:Zero Glaze', icon: HeartIcon },
    { id: 'hottest-season', label: 'Hottest This Season', icon: FireIcon },
    { id: 'anime-reviews', label: 'Anime Reviews', icon: StarIcon },
    { id: 'trending-now', label: 'Trending Now', icon: SparklesIcon }
  ], []);

  // LOADING STATE (PRESERVE ORIGINAL STYLING)
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white">Loading anime content...</p>
          {lastFetch && (
            <p className="text-sm text-purple-300 mt-2">
              Last updated: {new Date(lastFetch).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    if (!animeData) return null;

    switch (activeTab) {
      case 're-zero-glaze':
        return (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-lg p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6">{animeData.reZeroContent.title}</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {animeData.reZeroContent.sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-purple-300">{section.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{section.content}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 'hottest-season':
        return (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animeData.hottestThisSeason.map((anime, index) => (
                <motion.div
                  key={anime.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-gray-800/70 transition-all group"
                >
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img
                      src={anime.imageUrl}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 rounded-full px-2 py-1 flex items-center">
                      <StarSolid className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-white text-sm font-medium">{anime.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{anime.title}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {anime.genre.map((g, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                          {g}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{anime.episodes}</p>
                    <p className="text-gray-300 text-sm mb-4">{anime.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        anime.status === 'Watching' ? 'bg-green-500/20 text-green-300' :
                        anime.status === 'Completed' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {anime.status}
                      </span>
                      <button className="text-purple-400 hover:text-purple-300 transition-colors">
                        <PlayIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* COMMENTS SECTION FOR HOTTEST THIS SEASON */}
            <CommentsSection 
              sectionId="hottest-this-season" 
              sectionTitle="Hottest This Season Comments" 
            />
          </div>
        );

      case 'anime-reviews':
        return (
          <div className="space-y-8">
            {animeData.animeReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={review.imageUrl}
                      alt={review.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{review.title}</h3>
                      <div className="flex items-center">
                        <StarSolid className="w-5 h-5 text-yellow-400 mr-1" />
                        <span className="text-white font-medium">{review.rating}/10</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4 leading-relaxed">{review.review}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-green-400 font-medium mb-2">Pros:</h4>
                        <ul className="space-y-1">
                          {review.pros.map((pro, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-center">
                              <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-red-400 font-medium mb-2">Cons:</h4>
                        <ul className="space-y-1">
                          {review.cons.map((con, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-center">
                              <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* COMMENTS SECTION FOR ANIME REVIEWS */}
            <CommentsSection 
              sectionId="anime-reviews" 
              sectionTitle="Anime Reviews Comments" 
            />
          </div>
        );

      case 'trending-now':
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Top 5 Anime Trending Now</h3>
              <div className="space-y-3">
                {animeData.trendingNow.map((anime, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-purple-400 mr-4 w-8">
                        {anime.rank}
                      </span>
                      <span className="text-white font-medium">{anime.title}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      anime.status === 'Ongoing' ? 'bg-green-500/20 text-green-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {anime.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Ani-Dax - Anime Reviews & Character Analysis | Dax Collective</title>
        <meta name="description" content="Deep dives into anime storytelling, character development, and why Re:Zero remains the greatest anime ever created." />
        <meta name="keywords" content="anime reviews, character analysis, Re:Zero, seasonal picks, anime recommendations" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Hero Section (ORIGINAL STYLING PRESERVED) */}
        <section className="relative py-20 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                ANI-DAX
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Anime Reviews • Character Analysis • Seasonal Picks
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Deep dives into anime storytelling, character development, and why Re:Zero remains 
              the greatest anime ever created.
            </p>
            
            {error && (
              <div className="bg-yellow-900/50 border border-yellow-600 text-yellow-300 px-4 py-3 rounded mb-4 max-w-md mx-auto">
                <p className="text-sm">Using cached content. {error}</p>
                <button 
                  onClick={() => loadAnimeData(true)}
                  className="text-yellow-200 underline text-sm mt-1"
                >
                  Refresh
                </button>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-purple-800/30 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-600/30">
                <TvIcon className="h-5 w-5 text-purple-400" />
                <span className="font-semibold text-white">Anime Analysis</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-800/30 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-600/30">
                <StarIcon className="h-5 w-5 text-blue-400" />
                <span className="font-semibold text-white">Reviews</span>
              </div>
              <div className="flex items-center gap-2 bg-pink-800/30 backdrop-blur-sm px-4 py-2 rounded-full border border-pink-600/30">
                <FireIcon className="h-5 w-5 text-pink-400" />
                <span className="font-semibold text-white">Seasonal Picks</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* OPTIMIZED VIDEO CAROUSEL - 1 MAIN + 3 SMALLER HORIZONTAL */}
        {animeVideoData.length > 0 && (
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
                <h2 className="text-2xl font-bold text-white mb-6">Latest Anime Content</h2>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* MAIN VIDEO */}
                  <div className="lg:col-span-2">
                    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <img 
                        src={animeVideoData[currentVideoIndex]?.thumbnail} 
                        alt={animeVideoData[currentVideoIndex]?.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                        <a 
                          href={animeVideoData[currentVideoIndex]?.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-purple-600 bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-300 transform hover:scale-110"
                        >
                          <PlayIcon className="h-8 w-8 text-white" />
                        </a>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        {animeVideoData[currentVideoIndex]?.duration}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {animeVideoData[currentVideoIndex]?.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <PlayIcon className="h-4 w-4" />
                          <span>{formatNumber(animeVideoData[currentVideoIndex]?.views)} views</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 SMALLER VIDEOS VERTICAL STACK */}
                  <div className="space-y-4">
                    {animeVideoData.slice(1, 4).map((video, index) => (
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
                        className="p-2 bg-purple-600/30 hover:bg-purple-600/50 rounded-full transition-colors"
                      >
                        <ChevronLeftIcon className="h-4 w-4 text-purple-300" />
                      </button>
                      <button 
                        onClick={nextVideo}
                        className="p-2 bg-purple-600/30 hover:bg-purple-600/50 rounded-full transition-colors"
                      >
                        <ChevronRightIcon className="h-4 w-4 text-purple-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content Tabs (ORIGINAL STYLING PRESERVED) */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* BrandGallery Section (OPTIMIZED) */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Ani-Dax Gallery
            </h2>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
              <BrandGallery 
                brand="ani-dax"
                category="gallery"
                maxImages={12}
                layout="grid"
                showControls={true}
                enableUpload={false}
                className="anime-gallery"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AniDaxPage;

