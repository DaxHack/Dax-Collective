//src/services/driveApi.js
import { API_BASE } from '../config/apiConfig';
// Assuming you have a driveFolders.js for folder IDs, if not, you can keep process.env directly
import { FOLDER_IDS, getFolderIdByTags } from '../config/driveFolder'; 

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
        const errorData = await response.json().catch(() => ({})); // Try to parse error, fallback to empty object
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

      const token = await user.getIdToken(); // Get token for FormData requests
      
      const response = await fetch(`${this.baseUrl}/api/drive`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Authorization for FormData
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
   * Check for duplicate images before upload
   * @param {FileList|Array} files - Files to check
   * @param {Object} user - The authenticated Firebase user object
   * @param {string} folderId - Target folder ID
   * @param {string} category - Category for folder lookup
   * @returns {Promise<Object>} Duplicate check results
   */
  async checkDuplicates(files, user, folderId = null, category = null) {
    try {
      const formData = new FormData();
      
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });
      
      if (folderId) {
        formData.append('folderId', folderId);
      }
      if (category) {
        formData.append('category', category);
      }

      const token = await user.getIdToken();

      const response = await fetch(`${this.baseUrl}/api/check-duplicates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Duplicate check failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking duplicates:', error);
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
   * Batch upload images from URLs (for photo search integration)
   * @param {Array} urls - Array of image URLs
   * @param {string} category - Category for smart routing
   * @param {Object} user - The authenticated Firebase user object
   * @param {Object} options - Additional options (tags, descriptions)
   * @returns {Promise<Object>} Batch upload results
   */
  async batchUploadFromUrls(urls, category = 'collective', user, options = {}) {
    try {
      const { tags = [], descriptions = [] } = options;
      const headers = await this.getAuthHeaders(user);

      const response = await fetch(`${this.baseUrl}/api/drive/batch-from-urls`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          urls,
          category,
          tags,
          descriptions
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Batch upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in batch upload from URLs:', error);
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
      // Use your driveFolders.js for these IDs if you have it, otherwise keep process.env
      const folders = {
        travel: process.env.REACT_APP_DRIVE_FOLDER_TRAVEL,
        faith: process.env.REACT_APP_DRIVE_FOLDER_FAITH,
        collective: process.env.REACT_APP_DRIVE_FOLDER_COLLECTIVE,
        timezone: process.env.REACT_APP_DRIVE_FOLDER_TIMEZONE
      };

      const stats = {};
      const promises = Object.entries(folders).map(async ([key, folderId]) => {
        if (folderId) {
          try {
            // Pass the user object to getFolderInfo
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
   * Search and fetch images from multiple folders
   * @param {Object} user - The authenticated Firebase user object
   * @param {Object} options - Search options (maxPerFolder, category)
   * @returns {Promise<Array>} Combined images from all folders
   */
  async searchAllFolders(user, options = {}) {
    try {
      const { maxPerFolder = 12, category = null } = options;
      // Use your driveFolders.js for these IDs if you have it, otherwise keep process.env
      const folders = {
        travel: process.env.REACT_APP_DRIVE_FOLDER_TRAVEL,
        faith: process.env.REACT_APP_DRIVE_FOLDER_FAITH,
        collective: process.env.REACT_APP_DRIVE_FOLDER_COLLECTIVE,
        timezone: process.env.REACT_APP_DRIVE_FOLDER_TIMEZONE
      };

      // If category specified, only search that folder
      const foldersToSearch = category && folders[category] 
        ? { [category]: folders[category] }
        : folders;

      const allImages = [];
      const promises = Object.entries(foldersToSearch).map(async ([key, folderId]) => {
        if (folderId) {
          try {
            // Pass the user object to fetchDriveImages
            const result = await this.fetchDriveImages(folderId, user, { pageSize: maxPerFolder });
            const imagesWithCategory = result.images.map(img => ({
              ...img,
              category: key,
              folderId
            }));
            allImages.push(...imagesWithCategory);
          } catch (error) {
            console.warn(`Failed to fetch images from ${key} folder:`, error);
          }
        }
      });

      await Promise.all(promises);

      // Sort by creation time (newest first)
      allImages.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

      return allImages;
    } catch (error) {
      console.error('Error searching all folders:', error);
      throw error;
    }
  }

  /**
   * Get category-specific folder ID
   * @param {string} category - Category name
   * @returns {string|null} Folder ID for the category
   */
  getFolderIdForCategory(category) {
    // Use your driveFolders.js for these IDs if you have it, otherwise keep process.env
    const folders = {
      travel: process.env.REACT_APP_DRIVE_FOLDER_TRAVEL,
      faith: process.env.REACT_APP_DRIVE_FOLDER_FAITH,
      collective: process.env.REACT_APP_DRIVE_FOLDER_COLLECTIVE,
      timezone: process.env.REACT_APP_DRIVE_FOLDER_TIMEZONE
    };

    return folders[category] || null;
  }

  /**
   * Validate if all required folder IDs are configured
   * @returns {Object} Validation results
   */
  validateFolderConfiguration() {
    // Use your driveFolders.js for these IDs if you have it, otherwise keep process.env
    const folders = {
      travel: process.env.REACT_APP_DRIVE_FOLDER_TRAVEL,
      faith: process.env.REACT_APP_DRIVE_FOLDER_FAITH,
      collective: process.env.REACT_APP_DRIVE_FOLDER_COLLECTIVE,
      timezone: process.env.REACT_APP_DRIVE_FOLDER_TIMEZONE
    };

    const missing = [];
    const configured = [];

    Object.entries(folders).forEach(([key, value]) => {
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
      totalFolders: Object.keys(folders).length
    };
  }
}

// Helper function to format bytes (kept from your original comprehensive file)
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Create and export singleton instance
const driveApiService = new DriveApiService();

// Export both the class and instance for flexibility
export { DriveApiService };
export default driveApiService;

// Also export individual functions for backward compatibility
// Note: These now require 'user' as an argument when called directly
export const {
  fetchDriveImages,
  uploadToDrive,
  uploadToFirebase,
  checkDuplicates,
  getFolderInfo,
  batchUploadFromUrls,
  getAllFolderStats,
  searchAllFolders,
  getFolderIdForCategory,
  validateFolderConfiguration
} = driveApiService;
