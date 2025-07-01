// src/components/BrandGallery.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhotoIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CloudIcon,
  FolderIcon,
  PlusIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  HeartIcon,
  UserIcon
} from '@heroicons/react/24/outline';

// Import services and components
import driveApiService from '../services/enhanced-driveApi';
import ImageSourcer from '../utils/imageSourcer';
import ImageUpload from '../automation/ImageUpload';
import ProfilePictureUploader from './ProfilePictureUploader';
import SignInButton from './SignInButton';
import { useAuth } from '../contexts/AuthContext';

const BrandGallery = ({ 
  brand,
  category = 'gallery',
  folderId = null,
  maxImages = 12,
  enableAutoSource = true,
  fallbackImages = [],
  layout = 'grid', // 'grid', 'masonry', 'carousel'
  showControls = true,
  enableUpload = true,
  uploadMode = 'smart', // 'smart', 'profile', 'both'
  className = '',
  autoRefresh = true,
  showImageInfo = true,
  enableLazyLoading = true
}) => {
  const { user, loading: authLoading } = useAuth();
  
  // State management
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageSource, setImageSource] = useState('auto');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Upload state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState('smart');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);

  // Auto-source state
  const [autoSourceLoading, setAutoSourceLoading] = useState(false);

  // Determine folder ID based on brand/category
  const targetFolderId = useMemo(() => {
    if (folderId) return folderId;
    
    // Fixed: Use the correct environment variable names from your .env
    const brandFolderMapping = {
      'dax-the-traveler': process.env.REACT_APP_DRIVE_DAX_TRAVELER_PHOTOS,
      'gods-vessel': process.env.REACT_APP_DRIVE_GODS_VESSEL_PHOTOS,
      'timezone-travelers': process.env.REACT_APP_DRIVE_TIMEZONE_TRAVELERS_PHOTOS,
      'dax-collective': process.env.REACT_APP_DRIVE_DAX_HOMEPAGE_PHOTOS, // Using homepage as collective fallback
      'anidax': process.env.REACT_APP_DRIVE_ANI_DAX_PHOTOS,
      'homepage': process.env.REACT_APP_DRIVE_DAX_HOMEPAGE_PHOTOS,
      'analytics': process.env.REACT_APP_DRIVE_DAX_ANALYTICS_IMAGES
    };
    
    return brandFolderMapping[brand] || driveApiService.getFolderIdForCategory(category);
  }, [brand, category, folderId]);

  // Load images from Google Drive
  const loadDriveImages = useCallback(async (pageToken = null) => {
    if (!targetFolderId) {
      throw new Error('No folder ID configured for this brand/category');
    }
    
    // Fixed: Check for user authentication before making Drive API calls
    if (!user) {
      console.warn('User not authenticated. Cannot load Drive images.');
      return { images: [], hasMore: false, nextPageToken: null };
    }

    try {
      const result = await driveApiService.fetchDriveImages(targetFolderId, {
        pageSize: maxImages,
        pageToken
      }, user); // Pass user for authentication

      return {
        images: result.images.map(img => ({
          ...img,
          source: 'drive',
          category: brand || category
        })),
        hasMore: result.hasMore,
        nextPageToken: result.nextPageToken
      };
    } catch (error) {
      console.error('Failed to load Drive images:', error);
      throw error;
    }
  }, [targetFolderId, maxImages, brand, category, user]);

  // Load auto-sourced images
  const loadSourcedImages = useCallback(async () => {
    try {
      // Fixed: Use ImageSourcer instead of enhancedImageSourcer
      const sourcedImages = await ImageSourcer.sourceImagesForBrand(
        brand || 'dax-collective',
        category,
        maxImages
      );

      return {
        images: sourcedImages.map(img => ({
          ...img,
          source: 'sourced',
          category: brand || category
        })),
        hasMore: false,
        nextPageToken: null
      };
    } catch (error) {
      console.error('Failed to load sourced images:', error);
      throw error;
    }
  }, [brand, category, maxImages]);

  // Load local fallback images
  const loadLocalImages = useCallback(async () => {
    return {
      images: fallbackImages.map((url, index) => ({
        id: `fallback-${index}`,
        url,
        title: `${brand || 'Gallery'} Image ${index + 1}`,
        source: 'local',
        category: brand || category
      })),
      hasMore: false,
      nextPageToken: null
    };
  }, [fallbackImages, brand, category]);

  // Image source loaders - Fixed: Added proper dependencies and user check for drive
  const imageSources = useMemo(() => ({
    drive: {
      name: 'Google Drive',
      icon: CloudIcon,
      enabled: !!targetFolderId && !!user, // Only enabled if user is authenticated
      loader: () => loadDriveImages()
    },
    sourced: {
      name: 'Auto-Sourced',
      icon: MagnifyingGlassIcon,
      enabled: enableAutoSource,
      loader: () => loadSourcedImages()
    },
    local: {
      name: 'Local Fallback',
      icon: FolderIcon,
      enabled: fallbackImages.length > 0,
      loader: () => loadLocalImages()
    }
  }), [targetFolderId, user, enableAutoSource, fallbackImages, loadDriveImages, loadSourcedImages, loadLocalImages]);

  // Main image loading function
  const loadImages = useCallback(async (source = imageSource, pageToken = null) => {
    setLoading(true);
    setError(null);

    try {
      let result = { images: [], hasMore: false, nextPageToken: null };

      if (source === 'auto') {
        // Try sources in priority order
        const sources = ['drive', 'sourced', 'local'];
        
        for (const sourceKey of sources) {
          const sourceConfig = imageSources[sourceKey];
          if (sourceConfig?.enabled) {
            try {
              result = await sourceConfig.loader();
              if (result.images && result.images.length > 0) {
                setImageSource(sourceKey);
                break;
              }
            } catch (error) {
              console.warn(`Failed to load from ${sourceKey}:`, error);
              continue;
            }
          }
        }
      } else {
        const sourceConfig = imageSources[source];
        if (sourceConfig?.enabled) {
          result = await sourceConfig.loader();
        } else {
          throw new Error(`Source ${source} is not available`);
        }
      }

      if (pageToken) {
        // Append to existing images for pagination
        setImages(prev => [...prev, ...result.images]);
      } else {
        // Replace images for new load
        setImages(result.images);
      }

      setHasMore(result.hasMore || false);
      setNextPageToken(result.nextPageToken || null);

    } catch (error) {
      console.error('Failed to load images:', error);
      setError(error.message);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [imageSource, imageSources]);

  // Load more images (pagination)
  const loadMore = useCallback(() => {
    if (hasMore && nextPageToken && !loading) {
      loadImages(imageSource, nextPageToken);
    }
  }, [hasMore, nextPageToken, loading, imageSource, loadImages]);

  // Auto-source and upload images
  const handleAutoSource = useCallback(async () => {
    if (!user) {
      setError('Please sign in to use auto-sourcing');
      return;
    }

    setAutoSourceLoading(true);
    try {
      const query = searchQuery || `${brand || category} professional`;
      
      // Fixed: Use ImageSourcer instead of enhancedImageSourcer
      const result = await ImageSourcer.searchAndUpload(query, {
        maxResults: 6,
        category: ImageSourcer.mapBrandToCategory(brand),
        autoCategory: true,
        uploadSelected: false
      }, user); // Pass user for authentication

      if (result.success) {
        // Refresh gallery to show new images
        setRefreshTrigger(prev => prev + 1);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Auto-source failed:', error);
      setError('Auto-sourcing failed. Please try again.');
    } finally {
      setAutoSourceLoading(false);
    }
  }, [user, searchQuery, brand, category]);

  // Handle upload completion
  const handleUploadComplete = useCallback((results) => {
    console.log('Upload completed:', results);
    setRefreshTrigger(prev => prev + 1);
    setShowUpload(false);
  }, []);

  // Initial load and refresh trigger - Fixed: Wait for auth to complete
  useEffect(() => {
    if (!authLoading && brand) {
      loadImages();
    }
  }, [loadImages, refreshTrigger, authLoading, brand]);

  // Auto-refresh effect - Fixed: Only refresh if user is authenticated for drive
  useEffect(() => {
    if (autoRefresh && imageSource === 'drive' && user) {
      const interval = setInterval(() => {
        loadImages();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, imageSource, loadImages, user]);

  // Render loading state
  if (loading && images.length === 0) {
    return (
      <div className={`brand-gallery ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading images...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && images.length === 0) {
    return (
      <div className={`brand-gallery ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            {enableAutoSource && user && (
              <button
                onClick={handleAutoSource}
                disabled={autoSourceLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {autoSourceLoading ? 'Sourcing...' : 'Auto-Source Images'}
              </button>
            )}
            {!user && (
              <div className="mt-4">
                <p className="text-gray-500 text-sm mb-2">Sign in to access more features.</p>
                <SignInButton />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render empty state
  if (images.length === 0) {
    return (
      <div className={`brand-gallery ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No images found</p>
            <div className="flex gap-2 justify-center">
              {enableUpload && user && (
                <button
                  onClick={() => setShowUpload(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  Upload Images
                </button>
              )}
              {enableAutoSource && user && (
                <button
                  onClick={handleAutoSource}
                  disabled={autoSourceLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  {autoSourceLoading ? 'Sourcing...' : 'Auto-Source'}
                </button>
              )}
              {!user && (
                <div className="mt-4">
                  <p className="text-gray-500 text-sm mb-2">Sign in to upload or auto-source images.</p>
                  <SignInButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`brand-gallery ${className}`}>
      {/* Gallery Controls */}
      {showControls && (
        <div className="gallery-controls mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Source Selection */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Source:</span>
              <select
                value={imageSource}
                onChange={(e) => {
                  setImageSource(e.target.value);
                  setImages([]);
                  loadImages(e.target.value);
                }}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="auto">Auto</option>
                {Object.entries(imageSources).map(([key, source]) => (
                  source.enabled && (
                    <option key={key} value={key}>{source.name}</option>
                  )
                ))}
              </select>
            </div>

            {/* Search and Auto-Source - Only show if user is authenticated */}
            {enableAutoSource && user && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for images..."
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAutoSource()}
                />
                <button
                  onClick={handleAutoSource}
                  disabled={autoSourceLoading}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {autoSourceLoading ? 'Sourcing...' : 'Source'}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadImages()}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                title="Refresh"
              >
                <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>

              {enableUpload && user && (
                <button
                  onClick={() => setShowUpload(true)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1"
                >
                  <PlusIcon className="h-4 w-4" />
                  Upload
                </button>
              )}

              {!user && (
                <SignInButton size="sm" />
              )}
            </div>
          </div>

          {/* Status Info */}
          <div className="mt-2 text-xs text-gray-500">
            Showing {images.length} images from {imageSources[imageSource]?.name || imageSource}
            {hasMore && ` (more available)`}
          </div>
        </div>
      )}

      {/* Image Grid */}
      <div className={`image-grid ${layout === 'masonry' ? 'masonry-grid' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'}`}>
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div
              key={`${image.id || image.url}_${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="image-card group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              {/* Image */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src={image.thumbnail || image.directLink || image.url}
                  alt={image.title || image.name || 'Gallery image'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading={enableLazyLoading ? 'lazy' : 'eager'}
                  onError={(e) => {
                    // Fallback to direct link if thumbnail fails
                    if (image.directLink && e.target.src !== image.directLink) {
                      e.target.src = image.directLink;
                    } else {
                      // Fallback to placeholder
                      e.target.src = '/images/placeholder.jpg';
                    }
                  }}
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(image);
                    }}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                    title="View"
                  >
                    <EyeIcon className="h-5 w-5 text-gray-700" />
                  </button>
                  
                  {image.downloadLink && (
                    <a
                      href={image.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                      title="Download"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5 text-gray-700" />
                    </a>
                  )}
                </div>
              </div>

              {/* Image Info */}
              {showImageInfo && (
                <div className="p-3">
                  <h4 className="font-medium text-gray-900 text-sm truncate">
                    {image.title || image.name || 'Untitled'}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 capitalize">
                      {image.source}
                    </span>
                    {image.likes > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <HeartIcon className="h-3 w-3" />
                        {image.likes}
                      </div>
                    )}
                  </div>
                  {image.author && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <UserIcon className="h-3 w-3" />
                      <span className="truncate">{image.author}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Source Badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  image.source === 'drive' ? 'bg-blue-100 text-blue-800' :
                  image.source === 'sourced' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {image.source}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Upload Images</h3>
                <button
                  onClick={() => setShowUpload(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Upload Type Selection */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setUploadType('smart')}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      uploadType === 'smart'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Smart Upload
                  </button>
                  <button
                    onClick={() => setUploadType('profile')}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      uploadType === 'profile'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Profile Picture
                  </button>
                </div>
              </div>

              {/* Upload Component */}
              {uploadType === 'smart' ? (
                <ImageUpload
                  category={ImageSourcer.mapBrandToCategory ? ImageSourcer.mapBrandToCategory(brand) : brand}
                  onUploadComplete={handleUploadComplete}
                />
              ) : (
                <ProfilePictureUploader
                  onUploadComplete={handleUploadComplete}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl max-h-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.directLink || selectedImage.url}
                alt={selectedImage.title || selectedImage.name}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Image Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">
                  {selectedImage.title || selectedImage.name || 'Untitled'}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-300">Source:</span> {selectedImage.source}
                  </div>
                  {selectedImage.author && (
                    <div>
                      <span className="text-gray-300">Author:</span> {selectedImage.author}
                    </div>
                  )}
                  {selectedImage.width && selectedImage.height && (
                    <div>
                      <span className="text-gray-300">Size:</span> {selectedImage.width} × {selectedImage.height}
                    </div>
                  )}
                  {selectedImage.createdTime && (
                    <div>
                      <span className="text-gray-300">Created:</span> {new Date(selectedImage.createdTime).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandGallery;
