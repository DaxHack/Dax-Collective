import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CameraIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { approvedMedia as staticMedia } from '../data/approvedMedia';
import MediaCard from './MediaCard';
import { MEDIA_LIBRARY_KEY } from '../data/mediaLibraryKey';

const BLOCKED_PRIVACY = new Set(['Private', 'Sensitive', 'Needs Review']);

function transformIntakeToApproved(item) {
  return {
    id: item.id,
    brand: item.brand,
    title: item.title,
    sourcePlatform: item.sourcePlatform,
    sourceUrl: item.sourceUrl || '',
    filePath: item.filePath || '',
    assetType: item.assetType || 'Photo',
    location: item.relatedTrip || '',
    tripYear: '',
    relatedSeries: item.contentSeries && item.contentSeries !== 'None' ? item.contentSeries : '',
    usageStatus: item.usageStatus,
    privacyStatus: item.privacyStatus || 'Public Safe',
    peopleShown: [],
    tags: item.tags
      ? item.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [],
    notes: item.notes || '',
  };
}

function loadLiveMedia() {
  try {
    const stored = localStorage.getItem(MEDIA_LIBRARY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.map(transformIntakeToApproved);
      }
    }
  } catch (e) {
    // noop
  }
  return staticMedia;
}

const ApprovedMediaGallery = ({ brand, section }) => {
  const [mediaSource, setMediaSource] = useState(() => loadLiveMedia());
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMediaSource(loadLiveMedia());
    setActiveFilter('All');
    setSearchQuery('');

    function handleStorageChange(e) {
      if (e.key === MEDIA_LIBRARY_KEY || e.key === null) {
        setMediaSource(loadLiveMedia());
      }
    }
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [brand, section]);

  const brandFiltered = mediaSource.filter((asset) => {
    if (asset.usageStatus !== 'Approved') return false;
    if (BLOCKED_PRIVACY.has(asset.privacyStatus)) return false;
    if (asset.privacyStatus !== 'Public Safe') return false;

    const brandMatch =
      asset.brand === brand ||
      (brand === 'shared' && asset.brand === 'shared');

    if (!brandMatch) return false;

    if (section) {
      const sectionLower = section.toLowerCase();
      const seriesMatch =
        asset.relatedSeries &&
        asset.relatedSeries.toLowerCase() === sectionLower;
      const tagMatch =
        asset.tags &&
        asset.tags.some((t) => t.toLowerCase() === sectionLower);
      return seriesMatch || tagMatch;
    }

    return true;
  });

  const chips = React.useMemo(() => {
    const seen = new Set();
    const locations = [];
    const tags = [];
    brandFiltered.forEach((asset) => {
      if (asset.location && !seen.has(asset.location)) {
        seen.add(asset.location);
        locations.push(asset.location);
      }
      if (asset.tags) {
        asset.tags.forEach((t) => {
          if (!seen.has(t)) {
            seen.add(t);
            tags.push(t);
          }
        });
      }
    });
    return ['All', ...locations.sort(), ...tags.sort()];
  }, [brandFiltered]);

  const searchLower = searchQuery.trim().toLowerCase();

  const filtered = brandFiltered.filter((asset) => {
    const chipMatch =
      activeFilter === 'All' ||
      asset.location === activeFilter ||
      (asset.tags && asset.tags.includes(activeFilter));

    if (!chipMatch) return false;

    if (!searchLower) return true;

    const inTitle = (asset.title || '').toLowerCase().includes(searchLower);
    const inLocation = (asset.location || '').toLowerCase().includes(searchLower);
    const inTags = asset.tags && asset.tags.some((t) => t.toLowerCase().includes(searchLower));

    return inTitle || inLocation || inTags;
  });

  useEffect(() => {
    if (activeFilter !== 'All' && !chips.includes(activeFilter)) {
      setActiveFilter('All');
    }
  }, [chips, activeFilter]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const navigateLightbox = useCallback((direction) => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      if (direction === 'next') return (prev + 1) % filtered.length;
      return (prev - 1 + filtered.length) % filtered.length;
    });
  }, [filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e) => {
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

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, closeLightbox, navigateLightbox]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  const selectedAsset = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  if (brandFiltered.length === 0) {
    return (
      <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 mt-6">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
          <CameraIcon className="h-4 w-4 text-gray-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {section ? `${section} \u2014 Media Coming Soon` : 'Approved Media Coming Soon'}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Assets for this section will appear here once they have been reviewed and approved.
          </p>
          <p className="mt-2 text-xs text-gray-600">
            No private, sensitive, or unreviewed content is ever shown.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Search + chips row */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-72">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setLightboxIndex(null);
            }}
            placeholder="Search title, location, tag..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-8 text-sm text-white placeholder-gray-500 transition focus:border-white/30 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setLightboxIndex(null);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:text-white"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-gray-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 shrink-0">
            {brandFiltered.length} {brandFiltered.length === 1 ? 'photo' : 'photos'}
          </span>
          {chips.length > 1 && chips.map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setActiveFilter(chip);
                  setLightboxIndex(null);
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ring-1 ${
                  activeFilter === chip
                    ? 'bg-white text-gray-900 ring-white'
                    : 'bg-white/5 text-gray-400 ring-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 mt-4">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
            <CameraIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              No assets match
              {searchQuery ? ` \u201c${searchQuery}\u201d` : ''}
              {activeFilter !== 'All' ? ` in \u201c${activeFilter}\u201d` : ''}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Try a different search or select{' '}
              <button className="underline" onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}>All</button>{' '}
              to see everything.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset, index) => (
            <MediaCard
              key={asset.id}
              asset={asset}
              onClick={() => setLightboxIndex(index)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-gray-950 ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/70"
                onClick={closeLightbox}
                aria-label="Close lightbox"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>

              {filtered.length > 1 && (
                <>
                  <button
                    className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/70"
                    onClick={() => navigateLightbox('prev')}
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/70"
                    onClick={() => navigateLightbox('next')}
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </>
              )}

              <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black">
                {selectedAsset.filePath ? (
                  <img
                    key={selectedAsset.id}
                    src={selectedAsset.filePath}
                    alt={selectedAsset.title}
                    className="max-h-[70vh] w-auto max-w-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.nextSibling;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="h-64 items-center justify-center text-gray-600"
                  style={{ display: selectedAsset.filePath ? 'none' : 'flex' }}
                >
                  <CameraIcon className="h-16 w-16" />
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-base font-semibold text-white">{selectedAsset.title}</h4>
                  {(selectedAsset.location || selectedAsset.tripYear) && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      {selectedAsset.location && (
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          {selectedAsset.location}
                        </span>
                      )}
                      {selectedAsset.tripYear && (
                        <span>{selectedAsset.tripYear}</span>
                      )}
                    </div>
                  )}
                  {selectedAsset.tags && selectedAsset.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedAsset.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-gray-400 ring-1 ring-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {filtered.length > 1 && (
                  <span className="shrink-0 text-xs text-gray-500">
                    {lightboxIndex + 1} / {filtered.length}
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ApprovedMediaGallery;
