// src/components/GodsVesselQuotes.jsx
// Brand palette: cream (#F5F1E8), charcoal (#2C2A26), gold (#B8956A / #8B6F3D)
// No purple. No pink. No gradients.

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchGodsVesselQuotes } from '../services/sheetsApi';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const serif = { fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif' };

export function GodsVesselQuotesSection({ maxQuotes = 3, showTitle = true }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    loadQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxQuotes]);

  useEffect(() => {
    if (quotes.length > 1) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      }, 5000);
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

  const Label = () =>
    showTitle ? (
      <div className="mb-6 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
        Scripture &bull; Daily
      </div>
    ) : null;

  if (loading) {
    return (
      <div className="py-8">
        <Label />
        <div className="border border-stone-200 bg-[#F5F1E8] p-8 animate-pulse">
          <div className="mx-auto mb-8 h-px w-12 bg-stone-200" />
          <div className="h-5 bg-stone-200 rounded mx-auto w-3/4 mb-3" />
          <div className="h-5 bg-stone-200 rounded mx-auto w-1/2" />
          <div className="mx-auto mt-8 h-px w-12 bg-stone-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <Label />
        <div className="border-l-2 border-[#B8956A] bg-[#F5F1E8] px-6 py-5">
          <p className="text-sm leading-relaxed text-stone-500">
            Today&rsquo;s scripture will return shortly. The archive is being updated.
          </p>
        </div>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="py-8">
        <Label />
        <div className="border border-stone-200 bg-[#F5F1E8] p-10 text-center">
          <BookOpenIcon className="mx-auto h-10 w-10 text-[#B8956A]" />
          <p className="mt-4 text-sm text-stone-500">
            The daily scripture rotation is being prepared.
          </p>
        </div>
      </div>
    );
  }

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className="py-8">
      <Label />

      <motion.div
        key={currentQuoteIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="border border-stone-200 bg-[#F5F1E8] px-8 py-10 md:px-14 md:py-14"
      >
        <div className="mx-auto h-px w-12 bg-[#B8956A] mb-10" />

        <blockquote
          className="text-2xl font-medium leading-relaxed text-[#2C2A26] text-center md:text-3xl"
          style={serif}
        >
          &ldquo;{currentQuote.text}&rdquo;
        </blockquote>

        <div className="mt-8 text-center">
          <cite className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B6F3D] not-italic">
            {currentQuote.reference}
            {currentQuote.author && ` \u2014 ${currentQuote.author}`}
          </cite>
        </div>

        {currentQuote.category && (
          <div className="mt-5 flex justify-center">
            <span className="border border-[#B8956A]/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8B6F3D]">
              {currentQuote.category}
            </span>
          </div>
        )}

        <div className="mx-auto mt-10 h-px w-12 bg-[#B8956A]" />
      </motion.div>

      {quotes.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuoteIndex(index)}
              aria-label={`Scripture ${index + 1}`}
              className={`h-1 transition-all duration-300 ${
                index === currentQuoteIndex
                  ? 'w-6 bg-[#B8956A]'
                  : 'w-1.5 rounded-full bg-stone-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GodsVesselQuotesSection;
