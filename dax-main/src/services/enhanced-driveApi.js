// LOCATION: dax-main/src/services/enhanced-driveApi.js
// ACTION: CREATE NEW FILE

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Enhanced Drive API service with comprehensive upload and management features
 */
class DriveApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Fetch images from a Google Drive folder with pagination
   */
  async fetchDriveImages(folderId, options = {}) {
    try {
      if (!folderId) {
        throw new Error('Folder ID is required');
      }

      const { pageSize = 50, pageToken } = options;
      const params = new URLSearchParams({
        pageSize: pageSize.toString(),
        ...(pageToken && { pageToken })
      });

      const response = await fetch(`${this.baseUrl}/api/drive/images/${folderId}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.statusText}`);
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
   */
  async uploadToDrive(files, category = 'collective', options = {}) {
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

      const response = await fetch(`${this.baseUrl}/api/drive`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading to Drive:', error);
      throw error;
    }
  }

  /**
   * Upload to Firebase Storage (for profile pictures)
   */
  async uploadToFirebase(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/api/firebase`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
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
   */
  async checkDuplicates(files, folderId = null, category = null) {
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

      const response = await fetch(`${this.baseUrl}/api/check-duplicates`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Duplicate check failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking duplicates:', error);
      throw error;
    }
  }

  /**
   * Get folder information and statistics
   */
  async getFolderInfo(folderId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/drive/folder/${folderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get folder info: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting folder info:', error);
      throw error;
    }
  }

  /**
   * Batch upload images from URLs (for photo search integration)
   */
  async batchUploadFromUrls(urls, category = 'collective', options = {}) {
    try {
      const { tags = [], descriptions = [] } = options;

      const response = await fetch(`${this.baseUrl}/api/drive/batch-from-urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls,
          category,
          tags,
          descriptions
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Batch upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in batch upload from URLs:', error);
      throw error;
    }
  }

  /**
   * Get category-specific folder ID
   */
  getFolderIdForCategory(category) {
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
   */
  validateFolderConfiguration() {
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

// Create and export singleton instance
const driveApiService = new DriveApiService();

export { DriveApiService };
export default driveApiService;

export const {
  fetchDriveImages,
  uploadToDrive,
  uploadToFirebase,
  checkDuplicates,
  getFolderInfo,
  batchUploadFromUrls,
  getFolderIdForCategory,
  validateFolderConfiguration
} = driveApiService;

