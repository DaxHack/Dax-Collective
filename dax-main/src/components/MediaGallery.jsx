// src/components/MediaGallery.jsx
// Grid of MediaCard components from useApprovedMedia results.
// Handles loading, empty, and error states. Display-only.

import React from 'react';
import MediaCard from './MediaCard';

const MediaGallery = ({ media = [], loading = false, error = null, emptyMessage = 'No media available.' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 rounded-xl bg-gray-700/40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        Media unavailable.
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {media.map(item => (
        <MediaCard key={item.mediaId} item={item} />
      ))}
    </div>
  );
};

export default MediaGallery;
