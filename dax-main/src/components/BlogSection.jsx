// src/components/BlogSection.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchDaxTravelerBlogs, fetchTimezoneItineraries } from '../services/sheetsApi';
import { CalendarIcon, ClockIcon, TagIcon, MapPinIcon } from '@heroicons/react/24/outline';

export function DaxTravelerBlogSection({ maxPosts = 6, showTitle = true }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBlogs();
  }, [maxPosts]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const blogData = await fetchDaxTravelerBlogs(maxPosts);
      setBlogs(blogData);
    } catch (err) {
      console.error('Error loading Dax Traveler blogs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        {showTitle && <h2 className="text-3xl font-bold text-white mb-6">Latest Adventures</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-4"></div>
              <div className="h-3 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        {showTitle && <h2 className="text-3xl font-bold text-white mb-6">Latest Adventures</h2>}
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
          <p className="text-red-400">Error loading blog posts: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {showTitle && (
        <h2 className="text-3xl font-bold text-white mb-6">Latest Adventures</h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <motion.article
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-gray-800/70 transition-colors"
          >
            {blog.imageUrl && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-400 mb-3">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {new Date(blog.date).toLocaleDateString()}
                <span className="mx-2">•</span>
                <span>{blog.author}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                {blog.title}
              </h3>
              
              <p className="text-gray-300 mb-4 line-clamp-3">
                {blog.excerpt}
              </p>
              
              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300"
                    >
                      <TagIcon className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <button className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
                Read More →
              </button>
            </div>
          </motion.article>
        ))}
      </div>
      
      {blogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No blog posts found. Check back soon for new adventures!</p>
        </div>
      )}
    </div>
  );
}

export function TimezoneTravelersItinerarySection({ maxItineraries = 6, showTitle = true }) {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadItineraries();
  }, [maxItineraries]);

  const loadItineraries = async () => {
    try {
      setLoading(true);
      const itineraryData = await fetchTimezoneItineraries(maxItineraries);
      setItineraries(itineraryData);
    } catch (err) {
      console.error('Error loading itineraries:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        {showTitle && <h2 className="text-3xl font-bold text-white mb-6">Travel Itineraries</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-4"></div>
              <div className="h-3 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        {showTitle && <h2 className="text-3xl font-bold text-white mb-6">Travel Itineraries</h2>}
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
          <p className="text-red-400">Error loading itineraries: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {showTitle && (
        <h2 className="text-3xl font-bold text-white mb-6">Travel Itineraries</h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {itineraries.map((itinerary, index) => (
          <motion.article
            key={itinerary.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-blue-900/50 to-teal-900/50 backdrop-blur-sm rounded-lg overflow-hidden hover:from-blue-900/70 hover:to-teal-900/70 transition-all"
          >
            {itinerary.imageUrl && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={itinerary.imageUrl}
                  alt={itinerary.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-sm text-blue-300">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {itinerary.destination}
                </div>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                  {itinerary.difficulty}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                {itinerary.title}
              </h3>
              
              <p className="text-gray-300 mb-4 line-clamp-2">
                {itinerary.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {itinerary.duration}
                </div>
                {itinerary.budget && (
                  <div>Budget: {itinerary.budget}</div>
                )}
              </div>
              
              {itinerary.highlights.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Highlights:</p>
                  <div className="flex flex-wrap gap-1">
                    {itinerary.highlights.slice(0, 3).map((highlight, highlightIndex) => (
                      <span
                        key={highlightIndex}
                        className="text-xs bg-teal-500/20 text-teal-300 px-2 py-1 rounded"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                View Itinerary →
              </button>
            </div>
          </motion.article>
        ))}
      </div>
      
      {itineraries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No itineraries found. Check back soon for new travel guides!</p>
        </div>
      )}
    </div>
  );
}
