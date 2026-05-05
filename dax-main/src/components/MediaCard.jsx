// src/components/MediaCard.jsx
// Display-only. Renders one approved media record. No editing, no admin controls.

import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

const MediaCard = ({ item, className = '' }) => {
  if (!item) return null;

  const { storageUrl, altText, caption, series, location } = item;
  const locationLabel = location?.city || location?.region || location?.country || null;

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700 ${className}`}>
      <img
        src={storageUrl}
        alt={altText}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      {(locationLabel || series || caption) && (
        <div className="p-3">
          {locationLabel && (
            <div className="flex items-center text-xs text-gray-400 mb-1">
              <MapPinIcon className="h-3 w-3 mr-1 flex-shrink-0" />
              {locationLabel}
            </div>
          )}
          {series && (
            <div className="text-xs text-blue-400 font-medium mb-1">{series}</div>
          )}
          {caption && (
            <p className="text-sm text-gray-300 line-clamp-2">{caption}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaCard;
