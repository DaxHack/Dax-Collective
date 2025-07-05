// src/services/hybridDriveApi.js
// CORRECTED VERSION - Copy this to replace your existing hybridDriveApi.js

import { FOLDER_IDS, fetchDriveImages as fetchDirectly, fetchBrandImages } from './driveApi';
import driveApiService from './driveApi';

/**
 * Hybrid Drive API that combines the best of both approaches:
 * - Fast direct reads using your existing driveApi.js
 * - Full automation features using enhanced backend API
 * - YouTube integration for all 4 brands
 */
class HybridDriveApi {
  constructor() {
    this.folderMapping = {
      // Map your existing folder structure to enhanced categories
      'DAX_TRAVELER_PHOTOS': 'travel',
      'GODS_VESSEL_PHOTOS': 'faith',
      'TIMEZONE_TRAVELERS_PHOTOS': 'timezone',
      'DAX_HOMEPAGE_PHOTOS': 'collective',
      'ANI_DAX_PHOTOS': 'collective',
      'DAX_ANALYTICS_IMAGES': 'collective',
      'SATIATED_TASTE_PHOTOS': 'food',
      'TSHIRT_DESIGNS': 'design'
    };

    // YouTube API integration
    this.youtubeApiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.youtubeBaseUrl = 'https://www.googleapis.com/youtube/v3';
    
    // YouTube brand configuration with your actual channel IDs
    this.youtubeBrands = {
      'dax-the-traveler': { 
        channelId: process.env.REACT_APP_YOUTUBE_CHANNEL_ID_DAX_TRAVELER || 'UCuN9RFxD1_PUOci_AEa5DMQ',
        showVideos: true,
        category: 'travel'
      },
      'timezone-travelers': { 
        channelId: process.env.REACT_APP_YOUTUBE_CHANNEL_ID_TIMEZONE_TRAVELERS || 'UCKan3hAUmcy0Q49d7MIXhdA',
        showVideos: false,
        category: 'timezone'
      },
      'satiated-taste': { 
        channelId: process.env.REACT_APP_YOUTUBE_CHANNEL_ID_SATIATED_TASTE || 'UCmlTPphxXdZ3T2gDQ_kPZQQ',
        showVideos: false,
        category: 'food'
      },
      'gods-vessel': { 
        channelId: process.env.REACT_APP_YOUTUBE_CHANNEL_ID_GODS_VESSEL || 'UCAzuegEphw7oQRarESOjuqA',
        showVideos: false,
        category: 'faith'
      }
    };
  }

  /**
   * Fetch images with automatic fallback strategy
   */
  async fetchImages(folderId, user, options = {}) {
    const { 
      useBackend = false, 
      maxResults = 50, 
      enablePagination = false,
      pageToken = null 
    } = options;

    try {
      if (useBackend || enablePagination) {
        // Use enhanced API for backend features and pagination
        return await driveApiService.fetchDriveImages(folderId, user, {
          pageSize: maxResults,
          pageToken
        });
      } else {
        // Use direct API for fast, simple reads
        const images = await fetchDirectly(folderId, maxResults, user);
        return {
          images: images.map(img => ({
            ...img,
            // Ensure compatibility with enhanced API format
            directLink: img.directImageUrl,
            thumbnail: img.thumbnailLink,
            createdTime: img.createdTime,
            category: this.getCategoryFromFolderId(folderId)
          })),
          hasMore: false,
          nextPageToken: null,
          totalCount: images.length
        };
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error;
    }
  }

  /**
   * Fetch images by brand key (using your existing structure)
   */
  async fetchBrandImages(brandKey, user, options = {}) {
    const folderId = FOLDER_IDS[brandKey];
    
    if (!folderId) {
      throw new Error(`Folder ID not found for brand: ${brandKey}`);
    }

    return this.fetchImages(folderId, user, {
      ...options,
      brand: brandKey
    });
  }

  /**
   * Upload files to Google Drive (always uses enhanced API)
   */
  async uploadImages(files, category = 'collective', user, options = {}) {
    return driveApiService.uploadToDrive(files, category, user, options);
  }

  /**
   * Upload to Firebase Storage for profile pictures
   */
  async uploadProfilePicture(file, user) {
    return driveApiService.uploadToFirebase(file, user);
  }

  /**
   * Get folder information and statistics
   */
  async getFolderInfo(folderId, user) {
    return driveApiService.getFolderInfo(folderId, user);
  }

  /**
   * Get statistics for all configured folders
   */
  async getAllFolderStats(user) {
    try {
      const stats = {};
      const promises = Object.entries(FOLDER_IDS).map(async ([key, folderId]) => {
        if (folderId) {
          try {
            const info = await this.getFolderInfo(folderId, user);
            stats[key] = {
              count: info.imageCount || 0,
              size: info.totalSize || 0,
              formattedSize: info.formattedSize || '0 Bytes',
              name: info.name,
              lastModified: info.modifiedTime,
              category: this.folderMapping[key] || 'collective'
            };
          } catch (error) {
            console.warn(`Failed to load ${key} folder stats:`, error);
            stats[key] = { 
              count: 0, 
              size: 0, 
              formattedSize: '0 Bytes',
              category: this.folderMapping[key] || 'collective'
            };
          }
        }
      });

      await Promise.all(promises);
      return stats;
    } catch (error) {
      console.error('Error getting all folder stats:', error);
      throw error;
    }
  }

  /**
   * Search images across all configured folders
   */
  async searchAllFolders(user, options = {}) {
    const { maxPerFolder = 12, category = null, useBackend = false } = options;
    
    const foldersToSearch = category 
      ? Object.entries(FOLDER_IDS).filter(([key]) => this.folderMapping[key] === category)
      : Object.entries(FOLDER_IDS);

    const allImages = [];
    const promises = foldersToSearch.map(async ([key, folderId]) => {
      if (folderId) {
        try {
          const result = await this.fetchImages(folderId, user, { 
            maxResults: maxPerFolder,
            useBackend 
          });
          
          const imagesWithBrand = result.images.map(img => ({
            ...img,
            brand: key,
            category: this.folderMapping[key] || 'collective',
            folderId
          }));
          
          allImages.push(...imagesWithBrand);
        } catch (error) {
          console.warn(`Failed to fetch images from ${key} folder:`, error);
        }
      }
    });

    await Promise.all(promises);

    // Sort by creation time (newest first)
    allImages.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

    return allImages;
  }

  /**
   * Get folder ID for a specific category
   */
  getFolderIdForCategory(category) {
    const categoryToFolderKey = {
      travel: 'DAX_TRAVELER_PHOTOS',
      faith: 'GODS_VESSEL_PHOTOS',
      timezone: 'TIMEZONE_TRAVELERS_PHOTOS',
      collective: 'DAX_HOMEPAGE_PHOTOS',
      food: 'SATIATED_TASTE_PHOTOS',
      design: 'TSHIRT_DESIGNS'
    };

    const folderKey = categoryToFolderKey[category];
    return folderKey ? FOLDER_IDS[folderKey] : null;
  }

  /**
   * Get category from folder ID
   */
  getCategoryFromFolderId(folderId) {
    for (const [key, id] of Object.entries(FOLDER_IDS)) {
      if (id === folderId) {
        return this.folderMapping[key] || 'collective';
      }
    }
    return 'collective';
  }

  /**
   * Map brand name to category
   */
  mapBrandToCategory(brand) {
    const brandMapping = {
      'dax-the-traveler': 'travel',
      'gods-vessel': 'faith',
      'timezone-travelers': 'timezone',
      'ani-dax': 'collective',
      'dax-collective': 'collective',
      'satiated-taste': 'food'
    };
    return brandMapping[brand] || 'collective';
  }

  /**
   * Get your existing folder IDs structure
   */
  getFolderIds() {
    return FOLDER_IDS;
  }

  /**
   * Validate folder configuration
   */
  validateConfiguration() {
    const configured = [];
    const missing = [];

    Object.entries(FOLDER_IDS).forEach(([key, folderId]) => {
      if (folderId) {
        configured.push(key);
      } else {
        missing.push(key);
      }
    });

    return {
      isValid: configured.length > 0,
      configured,
      missing,
      totalFolders: Object.keys(FOLDER_IDS).length,
      youtubeConfigured: this.isYouTubeConfigured()
    };
  }

  // ========================================
  // YOUTUBE INTEGRATION METHODS
  // ========================================

  /**
   * Fetch YouTube videos for a specific brand
   */
  async fetchYouTubeVideos(brandKey, maxResults = 10) {
    const brand = this.youtubeBrands[brandKey];
    if (!brand?.channelId || !this.youtubeApiKey) {
      console.warn(`YouTube not configured for brand: ${brandKey}`);
      return [];
    }

    try {
      // Get uploads playlist
      const channelResponse = await fetch(
        `${this.youtubeBaseUrl}/channels?part=contentDetails&id=${brand.channelId}&key=${this.youtubeApiKey}`
      );
      const channelData = await channelResponse.json();
      
      if (!channelData.items?.[0]) return [];
      
      const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
      
      // Get videos
      const videosResponse = await fetch(
        `${this.youtubeBaseUrl}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${this.youtubeApiKey}`
      );
      const videosData = await videosResponse.json();
      
      if (!videosData.items) return [];
      
      // Get video stats
      const videoIds = videosData.items.map(item => item.snippet.resourceId.videoId);
      const statsResponse = await fetch(
        `${this.youtubeBaseUrl}/videos?part=statistics&id=${videoIds.join(',')}&key=${this.youtubeApiKey}`
      );
      const statsData = await statsResponse.json();
      
      // Combine data
      return videosData.items.map((video, index) => ({
        id: video.snippet.resourceId.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high?.url,
        publishedAt: video.snippet.publishedAt,
        views: parseInt(statsData.items[index]?.statistics.viewCount || 0),
        likes: parseInt(statsData.items[index]?.statistics.likeCount || 0),
        comments: parseInt(statsData.items[index]?.statistics.commentCount || 0),
        location: this.extractLocation(video.snippet.title),
        url: `https://youtube.com/watch?v=${video.snippet.resourceId.videoId}`,
        brand: brandKey,
        category: brand.category
      }));
    } catch (error) {
      console.error(`Error fetching YouTube videos for ${brandKey}:`, error);
      return [];
    }
  }

  /**
   * Get YouTube channel statistics
   */
  async getYouTubeChannelStats(brandKey) {
    const brand = this.youtubeBrands[brandKey];
    if (!brand?.channelId || !this.youtubeApiKey) return null;

    try {
      const statsResponse = await fetch(
        `${this.youtubeBaseUrl}/channels?part=statistics&id=${brand.channelId}&key=${this.youtubeApiKey}`
      );
      const statsData = await statsResponse.json();
      
      if (!statsData.items?.[0]) return null;
      
      const stats = statsData.items[0].statistics;
      return {
        subscribers: parseInt(stats.subscriberCount || 0),
        videos: parseInt(stats.videoCount || 0),
        views: parseInt(stats.viewCount || 0),
        channelId: brand.channelId
      };
    } catch (error) {
      console.error(`Error fetching YouTube stats for ${brandKey}:`, error);
      return null;
    }
  }

  /**
   * Sync all YouTube brands
   */
  async syncAllYouTubeBrands() {
    const results = {};
    
    for (const [brandKey, brand] of Object.entries(this.youtubeBrands)) {
      if (brand.channelId) {
        try {
          const [videos, stats] = await Promise.all([
            this.fetchYouTubeVideos(brandKey, 5),
            this.getYouTubeChannelStats(brandKey)
          ]);
          
          results[brandKey] = {
            success: true,
            videos: videos.length,
            stats,
            lastSync: new Date().toISOString()
          };
          
          console.log(`✅ Synced ${brandKey}: ${videos.length} videos, ${stats?.subscribers || 0} subscribers`);
        } catch (error) {
          results[brandKey] = {
            success: false,
            error: error.message,
            lastSync: new Date().toISOString()
          };
          console.error(`❌ Failed to sync ${brandKey}:`, error);
        }
      } else {
        results[brandKey] = {
          success: false,
          error: 'No channel ID configured',
          lastSync: new Date().toISOString()
        };
      }
    }
    
    return results;
  }

  /**
   * Get videos for DaxTheTravelerPage (replaces mock data)
   */
  async getDaxTravelerContent() {
    try {
      const videos = await this.fetchYouTubeVideos('dax-the-traveler', 10);
      const stats = await this.getYouTubeChannelStats('dax-the-traveler');
      
      // Convert to page format
      const adventures = videos.map((video, index) => ({
        id: index + 1,
        title: video.title,
        location: video.location || 'Adventure Destination',
        date: new Date(video.publishedAt).toISOString().split('T')[0],
        image: video.thumbnail,
        description: video.description.substring(0, 150) + '...',
        type: 'Adventure',
        duration: '1 day',
        views: video.views,
        likes: video.likes,
        comments: video.comments,
        videoUrl: video.url
      }));
      
      // Featured trip (most popular video)
      const featuredTrip = adventures.length > 0 ? {
        title: adventures[0].title,
        location: adventures[0].location,
        duration: "Adventure",
        date: adventures[0].date,
        description: adventures[0].description,
        image: adventures[0].image,
        videoUrl: adventures[0].videoUrl,
        highlights: ["Real Adventure", "YouTube Content", "Travel Experience"],
        stats: { 
          views: adventures[0].views, 
          likes: adventures[0].likes, 
          comments: adventures[0].comments 
        }
      } : null;
      
      return {
        adventures,
        featuredTrip,
        channelStats: stats,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting Dax Traveler content:', error);
      return {
        adventures: [],
        featuredTrip: null,
        channelStats: null,
        error: error.message
      };
    }
  }

  /**
   * Extract location from video title
   */
  extractLocation(title) {
    const patterns = [
      /in ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
      /([A-Z][a-z]+) adventure/i,
      /exploring ([A-Z][a-z]+)/i,
      /([A-Z][a-z]+) travel/i
    ];
    
    for (const pattern of patterns) {
      const match = title.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  /**
   * Check if YouTube is configured
   */
  isYouTubeConfigured() {
    return !!this.youtubeApiKey;
  }

  /**
   * Get YouTube brand configuration
   */
  getYouTubeBrands() {
    return this.youtubeBrands;
  }
}

// Create and export singleton instance
const hybridDriveApi = new HybridDriveApi();

export { HybridDriveApi };
export default hybridDriveApi;

export const {
  fetchImages,
  uploadImages,
  uploadProfilePicture,
  getFolderInfo,
  getAllFolderStats,
  searchAllFolders,
  getFolderIdForCategory,
  getCategoryFromFolderId,
  mapBrandToCategory,
  getFolderIds,
  validateConfiguration,
  // YouTube methods
  fetchYouTubeVideos,
  getYouTubeChannelStats,
  syncAllYouTubeBrands,
  getDaxTravelerContent,
  isYouTubeConfigured,
  getYouTubeBrands
} = hybridDriveApi;

