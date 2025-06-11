// src/pages/AniDaxPage-Enhanced.jsx
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
import { StarIcon as StarSolid, HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

// Firebase imports
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Developer UID - Replace with your actual UID
const DEV_UID = 'YOUR_DEV_UID_HERE';

const AniDaxPage = () => {
  // Core state
  const [activeTab, setActiveTab] = useState('rezero');
  const [currentSeason, setCurrentSeason] = useState('Winter 2024');
  const [showAddForm, setShowAddForm] = useState(false);

  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const isDeveloper = user?.uid === DEV_UID;

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
        signInAnonymously(auth).catch(console.error);
      }
    });

    return () => unsubscribe();
  }, []);

  // Comments subscription
  useEffect(() => {
    if (!user) return;

    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsByAnime = {};
      snapshot.docs.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        const animeId = data.animeId;
        if (!commentsByAnime[animeId]) commentsByAnime[animeId] = [];
        commentsByAnime[animeId].push({
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });
      setComments(commentsByAnime);
    });

    return () => unsubscribe();
  }, [user]);

  // Re:Zero character data
  const reZeroCharacters = [
    {
      name: "Subaru Natsuki",
      role: "Protagonist",
      description: "The most realistic and relatable MC in anime. His growth from a shut-in NEET to someone who truly understands love and sacrifice is unmatched.",
      image: "/api/placeholder/300/400",
      whyGreat: "Subaru's character development is phenomenal. He starts weak, makes terrible mistakes, but learns from each death loop. His emotional intelligence grows tremendously."
    },
    {
      name: "Rem",
      role: "Best Girl",
      description: "Unconditional love, unwavering loyalty, and incredible character depth. Her confession scene in episode 18 is pure perfection.",
      image: "/api/placeholder/300/400",
      whyGreat: "Rem represents pure, selfless love. Her development from hatred to devotion, and her ability to see Subaru's true worth is beautiful."
    },
    {
      name: "Emilia",
      role: "Main Heroine",
      description: "Kind, strong, and complex. Her past trauma and growth throughout the series shows incredible depth beyond the 'perfect girl' trope.",
      image: "/api/placeholder/300/400",
      whyGreat: "Emilia's kindness isn't weakness - it's strength. Her struggles with self-worth and identity make her incredibly human and relatable."
    }
  ];

  // Current season anime
  const [seasonalAnime, setSeasonalAnime] = useState([
    {
      id: 1,
      title: "Frieren: Beyond Journey's End",
      myRating: 10,
      genre: ["Fantasy", "Drama"],
      episodes: "28 episodes",
      status: "Ongoing",
      streamingOn: ["Crunchyroll", "Funimation"],
      myReview: "Absolutely phenomenal. The way it handles time, loss, and what it means to be human is incredible. Best anime of the year.",
      poster: "/api/placeholder/300/450",
      malLink: "https://myanimelist.net/anime/52991",
      trailer: "https://youtube.com/watch?v=example"
    },
    {
      id: 2,
      title: "Dungeon Meshi",
      myRating: 9,
      genre: ["Fantasy", "Comedy"],
      episodes: "24 episodes",
      status: "Ongoing",
      streamingOn: ["Netflix"],
      myReview: "Studio Trigger absolutely killed it. The world-building and character dynamics are top-tier.",
      poster: "/api/placeholder/300/450",
      malLink: "https://myanimelist.net/anime/52701",
      trailer: "https://youtube.com/watch?v=example"
    }
  ]);

  // Form for adding new seasonal anime
  const [newAnime, setNewAnime] = useState({
    title: '',
    myRating: 8,
    genre: '',
    episodes: '',
    status: 'Ongoing',
    streamingOn: '',
    myReview: '',
    malLink: '',
    trailer: ''
  });

  // Add anime function
  const handleAddAnime = () => {
    const anime = {
      id: Date.now(),
      ...newAnime,
      genre: newAnime.genre.split(',').map(g => g.trim()),
      streamingOn: newAnime.streamingOn.split(',').map(s => s.trim()),
      poster: "/api/placeholder/300/450"
    };
    setSeasonalAnime([...seasonalAnime, anime]);
    setNewAnime({
      title: '',
      myRating: 8,
      genre: '',
      episodes: '',
      status: 'Ongoing',
      streamingOn: '',
      myReview: '',
      malLink: '',
      trailer: ''
    });
    setShowAddForm(false);
  };

  // Comment functions
  const handleAddComment = async (animeId, animeTitle) => {
    const text = newComment[animeId];
    if (!user || !text?.trim()) return;

    setSubmittingComment(prev => ({ ...prev, [animeId]: true }));

    try {
      await addDoc(collection(db, 'comments'), {
        animeId,
        animeTitle,
        author: {
          uid: user.uid,
          displayName: user.displayName || 'Anonymous User',
          photoURL: user.photoURL || null
        },
        text: text.trim(),
        createdAt: serverTimestamp()
      });
      setNewComment(prev => ({ ...prev, [animeId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }

    setSubmittingComment(prev => ({ ...prev, [animeId]: false }));
  };

  const handleDeleteComment = async (commentId) => {
    if (!isDeveloper || !window.confirm('Delete this comment?')) return;

    try {
      await deleteDoc(doc(db, 'comments', commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Developer badge component
  const DeveloperBadge = () => (
    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-sm mb-4">
      <ShieldCheckIcon className="h-4 w-4 mr-2" />
      Developer Mode Active
    </div>
  );

  // Comments component
  const CommentsSection = ({ animeId, animeTitle }) => {
    const animeComments = comments[animeId] || [];

    return (
      <div className="mt-6 bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center mb-4">
          <ChatBubbleLeftIcon className="h-5 w-5 text-purple-400 mr-2" />
          <h4 className="text-lg font-semibold text-white">
            Comments ({animeComments.length})
          </h4>
        </div>

        {/* Add comment form */}
        {user && (
          <div className="mb-6">
            <div className="flex gap-3">
              <UserCircleIcon className="w-8 h-8 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <textarea
                  value={newComment[animeId] || ''}
                  onChange={(e) => setNewComment(prev => ({ ...prev, [animeId]: e.target.value }))}
                  placeholder={`Share your thoughts about ${animeTitle}...`}
                  className="w-full bg-gray-700/50 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none resize-none text-sm"
                  rows="2"
                  maxLength="300"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {(newComment[animeId] || '').length}/300
                  </span>
                  <button
                    onClick={() => handleAddComment(animeId, animeTitle)}
                    disabled={!(newComment[animeId]?.trim()) || submittingComment[animeId]}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center transition-colors disabled:cursor-not-allowed"
                  >
                    {submittingComment[animeId] ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                    ) : (
                      <PaperAirplaneIcon className="h-3 w-3 mr-1" />
                    )}
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments list */}
        <div className="space-y-3">
          <AnimatePresence>
            {animeComments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <UserCircleIcon className="w-6 h-6 text-gray-400 mr-2" />
                    <div>
                      <p className="text-white font-medium text-sm">
                        {comment.author.displayName}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {comment.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {isDeveloper && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{comment.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {animeComments.length === 0 && (
            <div className="text-center py-6">
              <ChatBubbleLeftIcon className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ----- SEO and Meta Tags ----- */}
      <Helmet>
        <title>Ani-Dax – Anime Lore & Voiceovers</title>
        <meta name="description" content="Anime bios, character voiceovers, and AI-powered lore breakdowns. Explore the world of anime with Ani-Dax." />
        <meta property="og:title" content="Ani-Dax – Anime Lore & Voiceovers" />
        <meta property="og:description" content="Discover compelling anime content, character profiles, and creative commentary." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* --- Main Page Content --- */}
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-black/50"></div>
          <div 
            className="h-screen bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('/api/placeholder/1920/1080')`
            }}
          >
            <div className="relative z-10 flex items-center justify-center h-full px-4">
              <div className="text-center max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    🎌 ANI-DAX
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 mb-6">
                    Anime Reviews • Character Analysis • Seasonal Picks
                  </p>
                  <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
                    Deep dives into anime storytelling, character development, and why Re:Zero remains the greatest anime ever created.
                  </p>
                  
                  {isDeveloper && <DeveloperBadge />}
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                      Re:Zero Analysis
                    </button>
                    <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-300">
                      Seasonal Picks
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center mb-8 bg-gray-800/30 backdrop-blur-sm rounded-full p-2 border border-gray-700">
              {[
                { id: 'rezero', label: 'Re:Zero Glaze', icon: HeartIcon },
                { id: 'seasonal', label: 'Hottest This Season', icon: FireIcon },
                { id: 'reviews', label: 'Anime Reviews', icon: StarIcon },
                { id: 'trending', label: 'Trending Now', icon: SparklesIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Re:Zero Glaze Tab */}
            {activeTab === 'rezero' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Why I Love Re:Zero Section */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-8">
                  <h2 className="text-4xl font-bold text-white mb-6 flex items-center">
                    <HeartSolid className="h-8 w-8 mr-3 text-red-400" />
                    Why Re:Zero is the Greatest Anime Ever Made
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-purple-400 mb-4">Tappei Nagatsuki's Genius</h3>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        Tappei's writing style is absolutely revolutionary. He doesn't just write a time-loop story - he crafts 
                        a psychological masterpiece that explores trauma, growth, and what it truly means to love someone. 
                        His plot progression is methodical yet surprising, building layers of complexity that reward careful viewers.
                      </p>
                      <p className="text-gray-300 leading-relaxed">
                        The way he handles Subaru's mental state, the consequences of Return by Death, and the ripple effects 
                        of every decision creates a narrative depth that most anime can only dream of achieving.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-blue-400 mb-4">Subaru: The Perfect Protagonist</h3>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        Subaru Natsuki is hands down the best MC in anime. He's not overpowered, he's not perfect, and that's 
                        exactly why he's incredible. His journey from a selfish, delusional shut-in to someone who truly 
                        understands love, sacrifice, and what it means to protect others is unmatched.
                      </p>
                      <p className="text-gray-300 leading-relaxed">
                        His breakdowns feel real, his growth feels earned, and his love for both Rem and Emilia showcases 
                        emotional maturity that most protagonists never achieve.
                      </p>
                    </div>
                  </div>

                  {/* Comments for Re:Zero section */}
                  <CommentsSection animeId="rezero-analysis" animeTitle="Re:Zero Analysis" />
                </div>

                {/* Character Analysis */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-6 text-center">Character Deep Dive</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {reZeroCharacters.map((character, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300"
                      >
                        <img 
                          src={character.image} 
                          alt={character.name}
                          className="w-full h-64 object-cover"
                        />
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-white">{character.name}</h3>
                            <span className="bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold">
                              {character.role}
                            </span>
                          </div>
                          
                          <p className="text-gray-300 text-sm mb-4">{character.description}</p>
                          
                          <div className="bg-gray-700/50 rounded-lg p-4">
                            <h4 className="text-purple-400 font-semibold mb-2">Why They're Amazing:</h4>
                            <p className="text-gray-300 text-sm">{character.whyGreat}</p>
                          </div>

                          {/* Comments for each character */}
                          <CommentsSection animeId={`character-${character.name.toLowerCase().replace(' ', '-')}`} animeTitle={character.name} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Subaru's Love Triangle Analysis */}
                <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                  <h2 className="text-3xl font-bold text-white mb-6 text-center">The Beautiful Complexity of Love</h2>
                  <div className="max-w-4xl mx-auto">
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      What makes Re:Zero extraordinary is how it handles Subaru's feelings for both Rem and Emilia. 
                      This isn't a typical love triangle - it's a mature exploration of different types of love and what they mean.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-500/30">
                        <h3 className="text-2xl font-bold text-blue-400 mb-4">Rem's Unconditional Love</h3>
                        <p className="text-gray-300 leading-relaxed">
                          Rem loves Subaru for who he truly is, flaws and all. Her love is pure, selfless, and transformative. 
                          She sees his worth when he can't see it himself, and her confession in episode 18 remains one of 
                          anime's greatest moments.
                        </p>
                      </div>
                      
                      <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/30">
                        <h3 className="text-2xl font-bold text-purple-400 mb-4">Emilia's Inspiring Love</h3>
                        <p className="text-gray-300 leading-relaxed">
                          Emilia represents Subaru's growth and aspiration. His love for her pushes him to become better, 
                          to overcome his flaws. Their relationship is built on mutual growth, understanding, and the desire 
                          to support each other's dreams.
                        </p>
                      </div>
                    </div>

                    {/* Comments for love triangle analysis */}
                    <CommentsSection animeId="love-triangle-analysis" animeTitle="Love Triangle Analysis" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Seasonal Anime Tab */}
            {activeTab === 'seasonal' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2 flex items-center">
                      <FireIcon className="h-8 w-8 mr-3 text-orange-400" />
                      Hottest Anime of {currentSeason}
                    </h2>
                    <p className="text-gray-400">My personal picks for this season's must-watch anime</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <select 
                      value={currentSeason}
                      onChange={(e) => setCurrentSeason(e.target.value)}
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600"
                    >
                      <option>Winter 2024</option>
                      <option>Spring 2024</option>
                      <option>Summer 2024</option>
                      <option>Fall 2024</option>
                    </select>
                    
                    {/* Developer-only Add Anime button */}
                    {isDeveloper && (
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center transition-all duration-300"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Anime
                      </button>
                    )}
                  </div>
                </div>

                {/* Seasonal Anime Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {seasonalAnime.map((anime) => (
                    <motion.div
                      key={anime.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300"
                    >
                      <img 
                        src={anime.poster} 
                        alt={anime.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-white">{anime.title}</h3>
                          <div className="flex items-center">
                            <StarSolid className="h-5 w-5 text-yellow-400 mr-1" />
                            <span className="text-yellow-400 font-bold">{anime.myRating}/10</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {anime.genre.map((g, index) => (
                            <span key={index} className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded text-xs">
                              {g}
                            </span>
                          ))}
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-3">{anime.episodes} • {anime.status}</p>
                        
                        <p className="text-gray-300 text-sm mb-4">{anime.myReview}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {anime.streamingOn.map((platform, index) => (
                            <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                              {platform}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                          <a 
                            href={anime.malLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            MAL
                          </a>
                          <a 
                            href={anime.trailer} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center transition-colors"
                          >
                            <PlayIcon className="h-4 w-4 mr-1" />
                            Trailer
                          </a>
                        </div>

                        {/* Comments for each anime */}
                        <CommentsSection animeId={`anime-${anime.id}`} animeTitle={anime.title} />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Developer-only Add New Anime Form */}
                {isDeveloper && showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8"
                  >
                    <div className="flex items-center mb-4">
                      <ShieldCheckIcon className="h-5 w-5 text-yellow-400 mr-2" />
                      <h3 className="text-2xl font-bold text-white">Add New Anime (Developer Only)</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Anime Title"
                        value={newAnime.title}
                        onChange={(e) => setNewAnime({...newAnime, title: e.target.value})}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                      />
                      <input
                        type="number"
                        placeholder="My Rating (1-10)"
                        min="1"
                        max="10"
                        value={newAnime.myRating}
                        onChange={(e) => setNewAnime({...newAnime, myRating: parseInt(e.target.value)})}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                      />
                      <input
                        type="text"
                        placeholder="Genres (comma separated)"
                        value={newAnime.genre}
                        onChange={(e) => setNewAnime({...newAnime, genre: e.target.value})}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                      />
                      <input
                        type="text"
                        placeholder="Episodes"
                        value={newAnime.episodes}
                        onChange={(e) => setNewAnime({...newAnime, episodes: e.target.value})}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                      />
                      <select
                        value={newAnime.status}
                        onChange={(e) => setNewAnime({...newAnime, status: e.target.value})}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                      >
                        <option>Ongoing</option>
                        <option>Completed</option>
                        <option>Upcoming</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Streaming Platforms (comma separated)"
                        value={newAnime.streamingOn}
                        onChange={(e) => setNewAnime({...newAnime, streamingOn: e.target.value})}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                      />
                      <input
                        type="url"
                        placeholder="MyAnimeList Link"
                        value={newAnime.malLink}
                        onChange={(e) => setNewAnime({...newAnime, malLink: e.target.value})}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                      />
                      <input
                        type="url"
                        placeholder="Trailer Link"
                        value={newAnime.trailer}
                        onChange={(e) => setNewAnime({...newAnime, trailer: e.target.value})}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                      />
                    </div>
                    <textarea
                      placeholder="My Review"
                      value={newAnime.myReview}
                      onChange={(e) => setNewAnime({...newAnime, myReview: e.target.value})}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 mt-4"
                      rows="3"
                    />
                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={handleAddAnime}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                      >
                        Add Anime
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Other tabs content */}
            {activeTab === 'reviews' && (
              <div className="text-center py-16">
                <TvIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Anime Reviews Coming Soon</h3>
                <p className="text-gray-400">Detailed reviews and analysis of the latest anime releases</p>
              </div>
            )}

            {activeTab === 'trending' && (
              <div className="text-center py-16">
                <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Trending Content Coming Soon</h3>
                <p className="text-gray-400">What's hot in the anime community right now</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default AniDaxPage;

