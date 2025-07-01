// src/components/GodsVesselQuotes.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchGodsVesselQuotes } from '../services/sheetsApi';
import { BookOpenIcon, HeartIcon } from '@heroicons/react/24/outline';

export function GodsVesselQuotesSection({ maxQuotes = 3, showTitle = true }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    loadQuotes();
  }, [maxQuotes]);

  useEffect(() => {
    if (quotes.length > 1) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      }, 5000); // Change quote every 5 seconds

      return () => clearInterval(interval);
    }
  }, [quotes.length]);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const quoteData = await fetchGodsVesselQuotes(maxQuotes);
      setQuotes(quoteData);
    } catch (err) {
      console.error('Error loading quotes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        {showTitle && <h2 className="text-3xl font-bold text-white mb-6">Daily Inspiration</h2>}
        <div className="bg-purple-900/30 rounded-lg p-8 animate-pulse">
          <div className="h-4 bg-purple-700 rounded mb-4"></div>
          <div className="h-3 bg-purple-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        {showTitle && <h2 className="text-3xl font-bold text-white mb-6">Daily Inspiration</h2>}
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
          <p className="text-red-400">Error loading quotes: {error}</p>
        </div>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="py-8">
        {showTitle && <h2 className="text-3xl font-bold text-white mb-6">Daily Inspiration</h2>}
        <div className="text-center py-12">
          <BookOpenIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <p className="text-gray-400">No quotes found. Check back soon for daily inspiration!</p>
        </div>
      </div>
    );
  }

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className="py-8">
      {showTitle && (
        <h2 className="text-3xl font-bold text-white mb-6">Daily Inspiration</h2>
      )}
      
      <motion.div
        key={currentQuoteIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-lg p-8 text-center"
      >
        <BookOpenIcon className="w-12 h-12 text-purple-300 mx-auto mb-6" />
        
        <blockquote className="text-xl md:text-2xl text-white font-medium mb-6 leading-relaxed">
          "{currentQuote.text}"
        </blockquote>
        
        <div className="flex items-center justify-center text-purple-300">
          <HeartIcon className="w-5 h-5 mr-2" />
          <cite className="font-semibold">
            {currentQuote.reference}
            {currentQuote.author && ` - ${currentQuote.author}`}
          </cite>
        </div>
        
        {currentQuote.category && (
          <span className="inline-block mt-4 px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
            {currentQuote.category}
          </span>
        )}
      </motion.div>
      
      {quotes.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuoteIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentQuoteIndex ? 'bg-purple-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GodsVesselQuotesSection;
