// src/components/BrandGallery.jsx
// OPTIMIZED VERSION - Handles imageSourcer errors gracefully

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import './BrandGallery.css';

const BrandGallery = ({ 
  brand = 'dax-collective',
  category = 'gallery',
  maxImages = 12,
  layout = 'grid',
  showControls = true,
  enableUpload = false,
  className = '',
  folderId = null // Legacy prop support
}) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastFetch, setLastFetch] = useState(null);

  // CACHE DURATION: 10 minutes for gallery images
  const CACHE_DURATION = 10 * 60 * 1000;

  // OPTIMIZED IMAGE LOADING WITH CACHING AND ERROR HANDLING
  const loadImages = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    const cacheKey = `brand-gallery-${brand}-${category}`;
    const timestampKey = `brand-gallery-timestamp-${brand}-${category}`;
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(timestampKey);
    
    // Use cached data if available and not expired
    if (!forceRefresh && cachedData && cachedTimestamp) {
      const timeDiff = now - parseInt(cachedTimestamp);
      if (timeDiff < CACHE_DURATION) {
        const parsed = JSON.parse(cachedData);
        setImages(parsed);
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      // Try to load from imageSourcer if available
      let loadedImages = [];
      
      try {
        // Dynamic import to handle missing imageSourcer gracefully
        const imageSourcer = await import('../utils/imageSourcer');
        if (imageSourcer.default && typeof imageSourcer.default.sourceImagesForBrand === 'function') {
          loadedImages = await imageSourcer.default.sourceImagesForBrand(brand, { 
            limit: maxImages,
            category: category 
          });
        } else {
          throw new Error('imageSourcer.sourceImagesForBrand is not available');
        }
      } catch (importError) {
        console.warn('imageSourcer not available, using fallback images:', importError.message);
        // Use fallback images
        loadedImages = getMockImages(brand, maxImages);
      }
      
      // Process and limit images
      const processedImages = loadedImages.slice(0, maxImages).map((img, index) => ({
        id: img.id || `${brand}-${index}`,
        src: img.src || img.url || img.thumbnail || `/api/placeholder/400/400`,
        alt: img.alt || img.title || `${brand} image ${index + 1}`,
        title: img.title || `${brand} Gallery Image`,
        description: img.description || '',
        category: img.category || category
      }));

      setImages(processedImages);
      
      // CACHE THE PROCESSED IMAGES
      localStorage.setItem(cacheKey, JSON.stringify(processedImages));
      localStorage.setItem(timestampKey, now.toString());
      
    } catch (err) {
      console.error('Failed to load gallery images:', err);
      setError(err.message);
      
      // Use fallback mock images on error
      const fallbackImages = getMockImages(brand, maxImages);
      setImages(fallbackImages);
    } finally {
      setLoading(false);
      setLastFetch(now);
    }
  }, [brand, category, maxImages]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // FALLBACK MOCK IMAGES FOR EACH BRAND
  const getMockImages = useCallback((brandName, count) => {
    const brandImages = {
      'dax-the-traveler': [
        { id: 1, src: '/api/placeholder/400/400', alt: 'Travel Adventure 1', title: 'Mountain Hiking' },
        { id: 2, src: '/api/placeholder/400/400', alt: 'Travel Adventure 2', title: 'City Exploration' },
        { id: 3, src: '/api/placeholder/400/400', alt: 'Travel Adventure 3', title: 'Beach Sunset' },
        { id: 4, src: '/api/placeholder/400/400', alt: 'Travel Adventure 4', title: 'Local Culture' },
        { id: 5, src: '/api/placeholder/400/400', alt: 'Travel Adventure 5', title: 'Food Discovery' },
        { id: 6, src: '/api/placeholder/400/400', alt: 'Travel Adventure 6', title: 'Night Markets' }
      ],
      'ani-dax': [
        { id: 1, src: '/api/placeholder/400/400', alt: 'Anime Content 1', title: 'Character Analysis' },
        { id: 2, src: '/api/placeholder/400/400', alt: 'Anime Content 2', title: 'Season Review' },
        { id: 3, src: '/api/placeholder/400/400', alt: 'Anime Content 3', title: 'Manga Discussion' },
        { id: 4, src: '/api/placeholder/400/400', alt: 'Anime Content 4', title: 'Voice Acting' },
        { id: 5, src: '/api/placeholder/400/400', alt: 'Anime Content 5', title: 'Studio Spotlight' },
        { id: 6, src: '/api/placeholder/400/400', alt: 'Anime Content 6', title: 'Fan Art Feature' }
      ],
      'timezone-travelers': [
        { id: 1, src: '/api/placeholder/400/400', alt: 'Travel Hack 1', title: 'Budget Tips' },
        { id: 2, src: '/api/placeholder/400/400', alt: 'Travel Hack 2', title: 'Packing Guide' },
        { id: 3, src: '/api/placeholder/400/400', alt: 'Travel Hack 3', title: 'Flight Deals' },
        { id: 4, src: '/api/placeholder/400/400', alt: 'Travel Hack 4', title: 'Local Transport' },
        { id: 5, src: '/api/placeholder/400/400', alt: 'Travel Hack 5', title: 'Safety Tips' },
        { id: 6, src: '/api/placeholder/400/400', alt: 'Travel Hack 6', title: 'Hidden Gems' }
      ],
      'gods-vessel': [
        { id: 1, src: '/api/placeholder/400/400', alt: 'Faith Content 1', title: 'Daily Devotional' },
        { id: 2, src: '/api/placeholder/400/400', alt: 'Faith Content 2', title: 'Scripture Study' },
        { id: 3, src: '/api/placeholder/400/400', alt: 'Faith Content 3', title: 'Prayer Guide' },
        { id: 4, src: '/api/placeholder/400/400', alt: 'Faith Content 4', title: 'Faith Apparel' },
        { id: 5, src: '/api/placeholder/400/400', alt: 'Faith Content 5', title: 'Community' },
        { id: 6, src: '/api/placeholder/400/400', alt: 'Faith Content 6', title: 'Testimonies' }
      ],
      'dax-collective': [
        { id: 1, src: '/api/placeholder/400/400', alt: 'Collective 1', title: 'Brand Overview' },
        { id: 2, src: '/api/placeholder/400/400', alt: 'Collective 2', title: 'Community' },
        { id: 3, src: '/api/placeholder/400/400', alt: 'Collective 3', title: 'Creative Process' },
        { id: 4, src: '/api/placeholder/400/400', alt: 'Collective 4', title: 'Behind Scenes' },
        { id: 5, src: '/api/placeholder/400/400', alt: 'Collective 5', title: 'Team Moments' },
        { id: 6, src: '/api/placeholder/400/400', alt: 'Collective 6', title: 'Future Vision' }
      ]
    };

    const defaultImages = brandImages[brandName] || brandImages['dax-collective'];
    return defaultImages.slice(0, count);
  }, []);

  // LIGHTBOX NAVIGATION
  const openLightbox = useCallback((image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setCurrentIndex(0);
  }, []);

  const navigateLightbox = useCallback((direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % images.length
      : (currentIndex - 1 + images.length) % images.length;
    
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  }, [currentIndex, images]);

  // KEYBOARD NAVIGATION
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateLightbox('prev');
          break;
        case 'ArrowRight':
          navigateLightbox('next');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, closeLightbox, navigateLightbox]);

  // LOADING STATE
  if (loading) {
    return (
      <div className={`brand-gallery-container ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading gallery...</p>
            {lastFetch && (
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {new Date(lastFetch).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ERROR STATE WITH RETRY
  if (error && images.length === 0) {
    return (
      <div className={`brand-gallery-container ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-400 mb-4">Failed to load gallery images</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => loadImages(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY STATE
  if (images.length === 0) {
    return (
      <div className={`brand-gallery-container ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-400 mb-4">No images available</p>
            <p className="text-sm text-gray-500">Check back later for new content</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`brand-gallery-container ${className}`}>
      {/* GALLERY CONTROLS */}
      {showControls && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-white">
              {brand.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Gallery
            </h3>
            <span className="text-sm text-gray-400">
              {images.length} {images.length === 1 ? 'image' : 'images'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {error && (
              <span className="text-xs text-yellow-400 mr-2">Using cached content</span>
            )}
            <button 
              onClick={() => loadImages(true)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
              title="Refresh gallery"
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* GALLERY GRID */}
      <div className={`brand-gallery ${layout === 'masonry' ? 'masonry-layout' : ''}`}>
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="gallery-item"
            onClick={() => openLightbox(image, index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="gallery-img"
              loading="lazy"
              onError={(e) => {
                e.target.src = '/api/placeholder/400/400';
              }}
            />
            <div className="gallery-overlay">
              <span className="gallery-overlay-text">{image.title}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="lightbox-close"
                onClick={closeLightbox}
                aria-label="Close lightbox"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              {/* NAVIGATION ARROWS */}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    onClick={() => navigateLightbox('prev')}
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    onClick={() => navigateLightbox('next')}
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </>
              )}

              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="lightbox-image"
                onError={(e) => {
                  e.target.src = '/api/placeholder/800/600';
                }}
              />

              {selectedImage.title && (
                <div className="lightbox-caption">
                  <h4 className="font-semibold">{selectedImage.title}</h4>
                  {selectedImage.description && (
                    <p className="text-sm text-gray-300 mt-1">{selectedImage.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {currentIndex + 1} of {images.length}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandGallery;

