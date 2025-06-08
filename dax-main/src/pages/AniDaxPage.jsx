// src/pages/AniDaxPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon, 
  HeartIcon, 
  PlayIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  CalendarIcon,
  TvIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid, HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const AniDaxPage = () => {
  const [activeTab, setActiveTab] = useState('rezero');
  const [currentSeason, setCurrentSeason] = useState('Winter 2024');
  const [showAddForm, setShowAddForm] = useState(false);

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

  // Current season anime (user can update this)
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

  return (
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
              { id: 'rezero', label: 'Re:Zero Shrine', icon: HeartIcon },
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

          {/* Re:Zero Shrine Tab */}
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
                  
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center transition-all duration-300"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Anime
                  </button>
                </div>
              </div>

              {/* Add Anime Form */}
              {showAddForm && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Add New Seasonal Pick</h3>
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
                      placeholder="Episodes (e.g., 12 episodes)"
                      value={newAnime.episodes}
                      onChange={(e) => setNewAnime({...newAnime, episodes: e.target.value})}
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                    />
                    <input
                      type="text"
                      placeholder="Streaming On (comma separated)"
                      value={newAnime.streamingOn}
                      onChange={(e) => setNewAnime({...newAnime, streamingOn: e.target.value})}
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
                      type="url"
                      placeholder="MAL Link"
                      value={newAnime.malLink}
                      onChange={(e) => setNewAnime({...newAnime, malLink: e.target.value})}
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                    />
                    <input
                      type="url"
                      placeholder="Trailer URL"
                      value={newAnime.trailer}
                      onChange={(e) => setNewAnime({...newAnime, trailer: e.target.value})}
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                    />
                  </div>
                  <textarea
                    placeholder="My Review/Why It's Hot"
                    value={newAnime.myReview}
                    onChange={(e) => setNewAnime({...newAnime, myReview: e.target.value})}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 mt-4"
                    rows="3"
                  />
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={handleAddAnime}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Add Anime
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Seasonal Anime Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seasonalAnime.map((anime) => (
                  <div key={anime.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300">
                    <div className="relative">
                      <img 
                        src={anime.poster} 
                        alt={anime.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-2">
                        <div className="flex items-center text-yellow-400">
                          <StarSolid className="h-4 w-4 mr-1" />
                          <span className="font-bold">{anime.myRating}/10</span>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                        <span className="text-white text-xs font-semibold">{anime.status}</span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-white mb-2">{anime.title}</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {anime.genre.map((g, idx) => (
                          <span key={idx} className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded-full text-xs font-semibold">
                            {g}
                          </span>
                        ))}
                      </div>
                      
                      <div className="text-sm text-gray-400 mb-3">
                        <div className="flex items-center mb-1">
                          <TvIcon className="h-4 w-4 mr-2" />
                          {anime.episodes}
                        </div>
                        <div className="flex items-center">
                          <PlayIcon className="h-4 w-4 mr-2" />
                          {anime.streamingOn.join(', ')}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">{anime.myReview}</p>
                      
                      <div className="flex gap-2">
                        <a 
                          href={anime.malLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-semibold text-center transition-colors"
                        >
                          MAL Page
                        </a>
                        <a 
                          href={anime.trailer}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-semibold text-center transition-colors"
                        >
                          Trailer
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Detailed Reviews Coming Soon!</h2>
              <p className="text-gray-400 text-lg">
                In-depth episode breakdowns, character analysis, and seasonal reviews will be added here.
              </p>
            </motion.div>
          )}

          {/* Trending Tab */}
          {activeTab === 'trending' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Trending Anime Tracker</h2>
              <p className="text-gray-400 text-lg">
                Auto-updating trending anime from MAL and AniList will be integrated here.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AniDaxPage;

