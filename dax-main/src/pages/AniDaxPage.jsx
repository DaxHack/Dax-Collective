// src/pages/AniDaxPage.jsx
import React, { useState, useEffect } from 'react';
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
  ShieldCheckIcon
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
import { db } from '../firebase/config';

const AniDaxPage = () => {
  const [activeTab, setActiveTab] = useState('re-zero-glaze');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Comments state
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});

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

  // Sample anime data
  const reZeroContent = {
    title: "Re:Zero is the Greatest Anime Ever Made",
    sections: [
      {
        title: "Natsuki's Genius",
        content: "Subaru's writing style is absolutely revolutionary. He doesn't just write a time-loop story, he creates a psychological masterpiece that explores trauma, growth, and what it means to love someone. His plot progression is methodical yet surprising, adding layers of complexity that reward careful viewers."
      },
      {
        title: "Subaru: The Perfect Protagonist",
        content: "Subaru Natsuki is hands down the best MC in anime. He's flawed, not perfect, and that's exactly why he's incredible. His character development is unmatched - we see him break down, build up, learn what it means to protect others is unmatched."
      }
    ]
  };

  const hottestThisSeason = [
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
  ];

  const animeReviews = [
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
  ];

  const trendingNow = [
    { title: "Attack on Titan: Final Season", rank: 1, status: "Completed" },
    { title: "Demon Slayer: Hashira Training", rank: 2, status: "Ongoing" },
    { title: "My Hero Academia Season 7", rank: 3, status: "Ongoing" },
    { title: "Jujutsu Kaisen Season 2", rank: 4, status: "Completed" },
    { title: "Chainsaw Man", rank: 5, status: "Completed" },
    { title: "Spy x Family Season 2", rank: 6, status: "Completed" },
    { title: "Frieren: Beyond Journey's End", rank: 7, status: "Ongoing" },
    { title: "Solo Leveling", rank: 8, status: "Ongoing" },
    { title: "Wind Breaker", rank: 9, status: "Ongoing" },
    { title: "Kaiju No. 8", rank: 10, status: "Ongoing" }
  ];

  const tabs = [
    { id: 're-zero-glaze', label: 'Re:Zero Glaze', icon: HeartIcon },
    { id: 'hottest-season', label: 'Hottest This Season', icon: FireIcon },
    { id: 'anime-reviews', label: 'Anime Reviews', icon: StarIcon },
    { id: 'trending-now', label: 'Trending Now', icon: SparklesIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 're-zero-glaze':
        return (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-lg p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6">{reZeroContent.title}</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {reZeroContent.sections.map((section, index) => (
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
            
            {/* NO COMMENTS SECTION HERE - This is Re:Zero Glaze (your favorites) */}
          </div>
        );

      case 'hottest-season':
        return (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hottestThisSeason.map((anime, index) => (
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
            {animeReviews.map((review, index) => (
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
              <h3 className="text-xl font-bold text-white mb-6">Top 10 Anime Trending Now</h3>
              <div className="space-y-3">
                {trendingNow.map((anime, index) => (
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
            
            {/* NO COMMENTS SECTION HERE - This is just trending data */}
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
        {/* Hero Section */}
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
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Re:Zero Analysis
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800/50 backdrop-blur-sm text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800/70 transition-all border border-gray-600"
              >
                Seasonal Picks
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Anime Photo Gallery Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-white mb-6 text-center"
            >
              Anime Photo Gallery
            </motion.h2>
            <BrandGallery folderId={process.env.REACT_APP_DRIVE_ANI_DAX_PHOTOS} />
          </div>
        </section>

        {/* Content Tabs */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center mb-8 bg-gray-800/30 backdrop-blur-sm rounded-lg p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
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
      </div>
    </>
  );
};

export default AniDaxPage;
