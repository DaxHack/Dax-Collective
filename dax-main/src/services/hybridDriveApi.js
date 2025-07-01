// LOCATION: dax-main/src/services/hybridDriveApi.js
// ACTION: CREATE NEW FILE

import { FOLDER_IDS, fetchDriveImages as fetchDirectly, fetchBrandImages } from './driveApi';
import enhancedDriveApi from './enhanced-driveApi';

/**
 * Hybrid Drive API that combines the best of both approaches:
 * - Fast direct reads using your existing driveApi.js
 * - Full automation features using enhanced-driveApi.js
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
      'DAX_ANALYTICS_IMAGES': 'collective'
    };
  }

  /**
   * Fetch images with automatic fallback strategy
   */
  async fetchImages(folderId, options = {}) {
    const { 
      useBackend = false, 
      maxResults = 50, 
      enablePagination = false,
      pageToken = null 
    } = options;

    try {
      if (useBackend || enablePagination) {
        // Use enhanced API for backend features and pagination
        return await enhancedDriveApi.fetchDriveImages(folderId, {
          pageSize: maxResults,
          pageToken
        });
      } else {
        // Use direct API for fast, simple reads
        const images = await fetchDirectly(folderId, maxResults);
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
  async fetchBrandImages(brandKey, options = {}) {
    const folderId = FOLDER_IDS[brandKey];
    
    if (!folderId) {
      throw new Error(`Folder ID not found for brand: ${brandKey}`);
    }

    return this.fetchImages(folderId, {
      ...options,
      brand: brandKey
    });
  }

  /**
   * Upload files to Google Drive (always uses enhanced API)
   */
  async uploadImages(files, category = 'collective', options = {}) {
    return enhancedDriveApi.uploadToDrive(files, category, options);
  }

  /**
   * Upload to Firebase Storage for profile pictures
   */
  async uploadProfilePicture(file) {
    return enhancedDriveApi.uploadToFirebase(file);
  }

  /**
   * Check for duplicate files before upload
   */
  async checkDuplicates(files, folderId = null, category = null) {
    return enhancedDriveApi.checkDuplicates(files, folderId, category);
  }

  /**
   * Batch upload from URLs (for photo search integration)
   */
  async batchUploadFromUrls(urls, category = 'collective', options = {}) {
    return enhancedDriveApi.batchUploadFromUrls(urls, category, options);
  }

  /**
   * Get folder information and statistics
   */
  async getFolderInfo(folderId) {
    return enhancedDriveApi.getFolderInfo(folderId);
  }

  /**
   * Get statistics for all configured folders
   */
  async getAllFolderStats() {
    try {
      const stats = {};
      const promises = Object.entries(FOLDER_IDS).map(async ([key, folderId]) => {
        if (folderId) {
          try {
            const info = await this.getFolderInfo(folderId);
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
  async searchAllFolders(options = {}) {
    const { maxPerFolder = 12, category = null, useBackend = false } = options;
    
    const foldersToSearch = category 
      ? Object.entries(FOLDER_IDS).filter(([key]) => this.folderMapping[key] === category)
      : Object.entries(FOLDER_IDS);

    const allImages = [];
    const promises = foldersToSearch.map(async ([key, folderId]) => {
      if (folderId) {
        try {
          const result = await this.fetchImages(folderId, { 
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
    // First try enhanced mapping
    const enhancedFolderId = enhancedDriveApi.getFolderIdForCategory(category);
    if (enhancedFolderId) return enhancedFolderId;

    // Fallback to your existing structure
    const categoryToFolderKey = {
      travel: 'DAX_TRAVELER_PHOTOS',
      faith: 'GODS_VESSEL_PHOTOS',
      timezone: 'TIMEZONE_TRAVELERS_PHOTOS',
      collective: 'DAX_HOMEPAGE_PHOTOS'
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
      'dax-collective': 'collective'
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

    // Also check enhanced API configuration
    const enhancedValidation = enhancedDriveApi.validateFolderConfiguration();

    return {
      isValid: configured.length > 0,
      configured,
      missing,
      totalFolders: Object.keys(FOLDER_IDS).length,
      enhancedApiValid: enhancedValidation.isValid,
      enhancedConfigured: enhancedValidation.configured,
      enhancedMissing: enhancedValidation.missing
    };
  }
}

// Create and export singleton instance
const hybridDriveApi = new HybridDriveApi();

export { HybridDriveApi };
export default hybridDriveApi;

export const {
  fetchImages,
  fetchBrandImages,
  uploadImages,
  uploadProfilePicture,
  checkDuplicates,
  batchUploadFromUrls,
  getFolderInfo,
  getAllFolderStats,
  searchAllFolders,
  getFolderIdForCategory,
  getCategoryFromFolderId,
  mapBrandToCategory,
  getFolderIds,
  validateConfiguration
} = hybridDriveApi;

