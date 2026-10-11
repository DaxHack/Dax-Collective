import React from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, CameraIcon, FilmIcon } from '@heroicons/react/24/outline';

const MediaCard = ({ asset, onClick }) => {
  const isVideo = asset.assetType === 'Video';

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`group flex flex-col overflow-hidden rounded-2xl bg-gray-900/60 ring-1 ring-white/10 transition hover:ring-cyan-400/40 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      aria-label={onClick ? `View ${asset.title} full screen` : undefined}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-800/60">
        {asset.filePath ? (
          <img
            src={asset.filePath}
            alt={asset.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        <div
          className={`absolute inset-0 flex items-center justify-center ${asset.filePath ? 'hidden' : 'flex'}`}
          style={{ display: asset.filePath ? 'none' : 'flex' }}
        >
          {isVideo ? (
            <FilmIcon className="h-10 w-10 text-gray-600" />
          ) : (
            <CameraIcon className="h-10 w-10 text-gray-600" />
          )}
        </div>

        {onClick && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/30">
            <span className="scale-75 rounded-full bg-white/10 p-3 opacity-0 backdrop-blur transition duration-300 group-hover:scale-100 group-hover:opacity-100">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
          {isVideo ? (
            <FilmIcon className="h-3 w-3" />
          ) : (
            <CameraIcon className="h-3 w-3" />
          )}
          {asset.assetType}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-sm font-semibold leading-snug text-white">{asset.title}</h3>

        {(asset.location || asset.tripYear) && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            {asset.location && (
              <span className="flex items-center gap-1">
                <MapPinIcon className="h-3 w-3" />
                {asset.location}
              </span>
            )}
            {asset.tripYear && (
              <span className="text-gray-600">{asset.tripYear}</span>
            )}
          </div>
        )}

        {asset.tags && asset.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {asset.tags.slice(0, 3).map((tag) => (
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
    </motion.article>
  );
};

export default MediaCard;
