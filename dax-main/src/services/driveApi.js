// src/services/driveApi.js
// CORRECTED VERSION - Copy this to replace your existing driveApi.js

import { API_BASE } from '../config/apiConfig';

// FIXED: Proper FOLDER_IDS export with all your folder IDs
export const FOLDER_IDS = {
  DAX_TRAVELER_PHOTOS: process.env.REACT_APP_DRIVE_DAX_TRAVELER_PHOTOS || "1Jn-3NZ38qiy7nm-VFfmSOrriXCBA7ccr",
  GODS_VESSEL_PHOTOS: process.env.REACT_APP_DRIVE_GODS_VESSEL_PHOTOS || "",
  TIMEZONE_TRAVELERS_PHOTOS: process.env.REACT_APP_DRIVE_TIMEZONE_TRAVELERS_PHOTOS || "",
  DAX_HOMEPAGE_PHOTOS: process.env.REACT_APP_DRIVE_DAX_HOMEPAGE_PHOTOS || "",
  ANI_DAX_PHOTOS: process.env.REACT_APP_DRIVE_ANI_DAX_PHOTOS || "",
  DAX_ANALYTICS_IMAGES: process.env.REACT_APP_DRIVE_DAX_ANALYTICS_IMAGES || "",
  SATIATED_TASTE_PHOTOS: process.env.REACT_APP_DRIVE_SATIATED_TASTE_PHOTOS || "",
  TSHIRT_DESIGNS: process.env.REACT_APP_DRIVE_TSHIRT_DESIGNS || ""
};

// FIXED: Proper getFolderIdByTags function
export const getFolderIdByTags = (tags) => {
  if (!tags) return FOLDER_IDS.DAX_HOMEPAGE_PHOTOS;
  
  const tagLower = tags.toLowerCase();
  
  if (tagLower.includes('travel') || tagLower.includes('adventure') || tagLower.includes('dax-traveler')) {
    return FOLDER_IDS.DAX_TRAVELER_PHOTOS;
  }
  if (tagLower.includes('faith') || tagLower.includes('god') || tagLower.includes('vessel')) {
    return FOLDER_IDS.GODS_VESSEL_PHOTOS;
  }
  if (tagLower.includes('timezone') || tagLower.includes('productivity')) {
    return FOLDER_IDS.TIMEZONE_TRAVELERS_PHOTOS;
  }
  if (tagLower.includes('anime') || tagLower.includes('ani-dax')) {
    return FOLDER_IDS.ANI_DAX_PHOTOS;
  }
  if (tagLower.includes('food') || tagLower.includes('satiated')) {
    return FOLDER_IDS.SATIATED_TASTE_PHOTOS;
  }
  if (tagLower.includes('tshirt') || tagLower.includes('design')) {
    return FOLDER_IDS.TSHIRT_DESIGNS;
  }
  if (tagLower.includes('analytics') || tagLower.includes('dashboard')) {
    return FOLDER_IDS.DAX_ANALYTICS_IMAGES;
  }
  
  return FOLDER_IDS.DAX_HOMEPAGE_PHOTOS; // Default fallback
};

/**
 * Enhanced Drive API service with comprehensive upload and management features
 */
class DriveApiService {
  constructor() {
    this.baseUrl = API_BASE; // Use API_BASE from config
  }

  /**
   * Helper to get authorization headers
   * @param {Object} user - The Firebase user object
   * @returns {Promise<Object>} Headers object with Authorization token
   */
  async getAuthHeaders(user) {
    if (!user) {
      throw new Error('Authentication required. User object is missing.');
    }
    const token = await user.getIdToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  /**
   * Fetch images from a Google Drive folder with pagination
   * @param {string} folderId - The Google Drive folder ID
   * @param {Object} user - The authenticated Firebase user object
   * @param {Object} options - Query options (pageSize, pageToken)
   * @returns {Promise<Object>} Response with images and pagination info
   */
  async fetchDriveImages(folderId, user, options = {}) {
    try {
      if (!folderId) {
        throw new Error('Folder ID is required');
      }
      if (!user) {
        console.warn("User not authenticated for fetchDriveImages. Returning empty array.");
        return { images: [], nextPageToken: null, hasMore: false, totalCount: 0 };
      }

      const { pageSize = 50, pageToken } = options;
      const params = new URLSearchParams({
        pageSize: pageSize.toString(),
        ...(pageToken && { pageToken })
      });

      const headers = await this.getAuthHeaders(user);

      const response = await fetch(`${this.baseUrl}/api/drive/images/${folderId}?${params}`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to fetch images: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      return {
        images: data.images || [],
        nextPageToken: data.nextPageToken,
        hasMore: !!data.nextPageToken,
        totalCount: data.totalCount || data.images?.length || 0
      };
    } catch (error) {
      console.error('Error fetching Drive images:', error);
      throw error;
    }
  }

  /**
   * Upload files to Google Drive with smart folder routing
   * @param {FileList|Array} files - Files to upload
   * @param {string} category - Category for smart routing
   * @param {Object} user - The authenticated Firebase user object
   * @param {Object} options - Additional upload options (tags, description)
   * @returns {Promise<Object>} Upload results
   */
  async uploadToDrive(files, category = 'collective', user, options = {}) {
    try {
      const formData = new FormData();
      
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });
      
      formData.append('category', category);
      if (options.tags) {
        formData.append('tags', JSON.stringify(options.tags));
      }
      if (options.description) {
        formData.append('description', options.description);
      }

      const token = await user.getIdToken();
      
      const response = await fetch(`${this.baseUrl}/api/drive`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error uploading to Drive:', error);
      throw error;
    }
  }

  /**
   * Upload to Firebase Storage (for profile pictures)
   * @param {File} file - File to upload
   * @param {Object} user - The authenticated Firebase user object
   * @returns {Promise<Object>} Upload result
   */
  async uploadToFirebase(file, user) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = await user.getIdToken();

      const response = await fetch(`${this.baseUrl}/api/firebase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading to Firebase:', error);
      throw error;
    }
  }

  /**
   * Get all folder statistics for dashboard
   * @param {Object} user - The authenticated Firebase user object
   * @returns {Promise<Object>} Statistics for all folders
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
              lastModified: info.modifiedTime
            };
          } catch (error) {
            console.warn(`Failed to load ${key} folder stats:`, error);
            stats[key] = { count: 0, size: 0, formattedSize: '0 Bytes' };
          }
        } else {
          stats[key] = { count: 0, size: 0, formattedSize: '0 Bytes' };
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
   * Get folder information and statistics
   * @param {string} folderId - Google Drive folder ID
   * @param {Object} user - The authenticated Firebase user object
   * @returns {Promise<Object>} Folder information
   */
  async getFolderInfo(folderId, user) {
    try {
      const headers = await this.getAuthHeaders(user);

      const response = await fetch(`${this.baseUrl}/api/drive/folder/${folderId}`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to get folder info: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting folder info:', error);
      throw error;
    }
  }

  /**
   * Validate if all required folder IDs are configured
   * @returns {Object} Validation results
   */
  validateFolderConfiguration() {
    const missing = [];
    const configured = [];

    Object.entries(FOLDER_IDS).forEach(([key, value]) => {
      if (value) {
        configured.push(key);
      } else {
        missing.push(key);
      }
    });

    return {
      isValid: missing.length === 0,
      configured,
      missing,
      totalFolders: Object.keys(FOLDER_IDS).length
    };
  }
}

// FIXED: Direct fetch function for backward compatibility
export const fetchDriveImages = async (folderId, maxResults = 50, user = null) => {
  try {
    if (!folderId) {
      console.warn('No folder ID provided to fetchDriveImages');
      return [];
    }

    // If no user provided, try to get from auth context or return empty
    if (!user) {
      console.warn('No user authentication provided to fetchDriveImages');
      return [];
    }

    const driveService = new DriveApiService();
    const result = await driveService.fetchDriveImages(folderId, user, { pageSize: maxResults });
    return result.images || [];
  } catch (error) {
    console.error('Error in fetchDriveImages:', error);
    return [];
  }
};

// FIXED: Fetch brand images function
export const fetchBrandImages = async (brandKey, maxResults = 50, user = null) => {
  try {
    const folderId = FOLDER_IDS[brandKey];
    if (!folderId) {
      console.warn(`No folder ID found for brand: ${brandKey}`);
      return [];
    }

    return await fetchDriveImages(folderId, maxResults, user);
  } catch (error) {
    console.error(`Error fetching brand images for ${brandKey}:`, error);
    return [];
  }
};

// Create and export singleton instance
const driveApiService = new DriveApiService();

// Export both the class and instance for flexibility
export { DriveApiService };
export default driveApiService;

// Export individual functions for backward compatibility
export const {
  uploadToDrive,
  uploadToFirebase,
  getFolderInfo,
  getAllFolderStats,
  validateFolderConfiguration
} = driveApiService;

