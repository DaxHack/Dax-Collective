// src/components/HeroMedia.jsx
// Full-width hero section. Accepts a single approved hero media record.
// Falls back to fallbackUrl if no approved record is available.
// Display-only — no editing controls.

import React from 'react';

const HeroMedia = ({ item = null, fallbackUrl = null, fallbackAlt = '', children }) => {
  const src = item?.storageUrl || fallbackUrl;
  const alt = item?.altText || fallbackAlt;
  const caption = item?.caption || null;

  if (!src) return null;

  return (
    <div className="relative w-full h-full">
      <div
        className="h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('${src}')`
        }}
        role="img"
        aria-label={alt}
      >
        {children}
      </div>
      {caption && (
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
          <p className="text-white text-sm">{caption}</p>
        </div>
      )}
    </div>
  );
};

export default HeroMedia;
