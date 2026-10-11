// src/services/uploadApiHelper.js
// CORRECTED VERSION - Copy this to replace your existing uploadApiHelper.js

import { API_BASE } from '../config/apiConfig';
import { getFolderIdByTags, FOLDER_IDS } from '../config/driveFolder';

/**
 * Enhanced Upload API Helper with comprehensive error handling and authentication
 */
export const uploadApiHelper = {
  /**
   * Upload profile picture to Firebase Storage
   * @param {File} file - Image file to upload
   * @param {Object} user - Authenticated Firebase user object
   * @returns {Promise<Object>} Upload result with download URL
   */
  async uploadProfilePicture(file, user) {
    if (!user) {
      throw new Error('User not authenticated for profile picture upload.');
    }
    
    if (!file) {
      throw new Error('No file provided for upload.');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed for profile pictures.');
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB.');
    }
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', user.uid);
      formData.append('timestamp', Date.now().toString());
      
      const token = await user.getIdToken();
      
      const response = await fetch(`${API_BASE}/api/profile-picture`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Upload failed: ${errorData.details || errorData.error || response.statusText}`);
      }
      
      const result = await response.json();
      return {
        success: true,
        downloadURL: result.downloadURL,
        fileName: result.fileName,
        fileSize: result.fileSize,
        uploadedAt: result.uploadedAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('Profile picture upload error:', error);
      throw error;
    }
  },

  /**
   * Upload image with smart folder routing based on tags
   * @param {File} file - Image file to upload
   * @param {string} tags - Tags to determine folder routing
   * @param {Object} user - Authenticated Firebase user object
   * @param {Object} options - Additional upload options
   * @returns {Promise<Object>} Upload result
   */
  async uploadSmartImage(file, tags, user, options = {}) {
    if (!user) {
      throw new Error('User not authenticated for smart image upload.');
    }
    
    if (!file) {
      throw new Error('No file provided for upload.');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed.');
    }

    // Get folder ID based on tags
    const folderId = getFolderIdByTags(tags);
    if (!folderId) {
      throw new Error('No folder found for tags. Please check driveFolders.js configuration.');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderId', folderId);
      formData.append('tags', tags);
      formData.append('timestamp', Date.now().toString());
      formData.append('userId', user.uid);

      // Add optional metadata
      if (options.description) {
        formData.append('description', options.description);
      }
      if (options.location) {
        formData.append('location', options.location);
      }
      if (options.category) {
        formData.append('category', options.category);
      }

      const token = await user.getIdToken();
      
      const response = await fetch(`${API_BASE}/api/drive-image`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Upload failed: ${errorData.details || errorData.error || response.statusText}`);
      }
      
      const result = await response.json();
      return {
        success: true,
        fileId: result.fileId,
        fileName: result.fileName,
        downloadURL: result.downloadURL,
        thumbnailURL: result.thumbnailURL,
        folderId: folderId,
        tags: tags,
        uploadedAt: result.uploadedAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('Smart image upload error:', error);
      throw error;
    }
  },

  /**
   * Batch upload multiple files
   * @param {FileList|Array} files - Files to upload
   * @param {string} tags - Tags to determine folder routing
   * @param {Object} user - Authenticated Firebase user object
   * @param {Object} options - Additional upload options
   * @returns {Promise<Object>} Batch upload results
   */
  async batchUpload(files, tags, user, options = {}) {
    if (!user) {
      throw new Error('User not authenticated for batch upload.');
    }
    
    if (!files || files.length === 0) {
      throw new Error('No files provided for upload.');
    }

    // Get folder ID based on tags
    const folderId = getFolderIdByTags(tags);
    if (!folderId) {
      throw new Error('No folder found for tags. Please check driveFolders.js configuration.');
    }

    // Validate all files
    const validFiles = [];
    const invalidFiles = [];
    
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ index, name: file.name, reason: 'Not an image file' });
      }
    });

    if (validFiles.length === 0) {
      throw new Error('No valid image files found in the selection.');
    }

    try {
      const formData = new FormData();
      
      validFiles.forEach(file => {
        formData.append('files', file);
      });
      
      formData.append('folderId', folderId);
      formData.append('tags', tags);
      formData.append('userId', user.uid);
      formData.append('timestamp', Date.now().toString());

      // Add optional metadata
      if (options.description) {
        formData.append('description', options.description);
      }
      if (options.location) {
        formData.append('location', options.location);
      }
      if (options.category) {
        formData.append('category', options.category);
      }

      const token = await user.getIdToken();
      
      const response = await fetch(`${API_BASE}/api/batch-upload`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Batch upload failed: ${errorData.details || errorData.error || response.statusText}`);
      }
      
      const result = await response.json();
      return {
        success: true,
        totalFiles: files.length,
        validFiles: validFiles.length,
        invalidFiles: invalidFiles,
        uploadedFiles: result.uploadedFiles || [],
        failedFiles: result.failedFiles || [],
        folderId: folderId,
        tags: tags,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Batch upload error:', error);
      throw error;
    }
  },

  /**
   * Check upload status by upload ID
   * @param {string} uploadId - Upload ID to check
   * @param {Object} user - Authenticated Firebase user object
   * @returns {Promise<Object>} Upload status
   */
  async checkUploadStatus(uploadId, user) {
    if (!user) {
      throw new Error('User not authenticated.');
    }
    
    if (!uploadId) {
      throw new Error('Upload ID is required.');
    }
    
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE}/api/upload-status/${uploadId}`, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to check upload status: ${errorData.error || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload status check error:', error);
      throw error;
    }
  },

  /**
   * Delete uploaded file
   * @param {string} fileId - File ID to delete
   * @param {Object} user - Authenticated Firebase user object
   * @returns {Promise<Object>} Delete result
   */
  async deleteUploadedFile(fileId, user) {
    if (!user) {
      throw new Error('User not authenticated.');
    }
    
    if (!fileId) {
      throw new Error('File ID is required.');
    }
    
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE}/api/file/${fileId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Delete failed: ${errorData.details || errorData.error || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('File deletion error:', error);
      throw error;
    }
  },

  /**
   * Upload from URL (for photo search integration)
   * @param {string} imageUrl - URL of image to upload
   * @param {string} tags - Tags to determine folder routing
   * @param {Object} user - Authenticated Firebase user object
   * @param {Object} options - Additional upload options
   * @returns {Promise<Object>} Upload result
   */
  async uploadFromUrl(imageUrl, tags, user, options = {}) {
    if (!user) {
      throw new Error('User not authenticated.');
    }
    
    if (!imageUrl) {
      throw new Error('Image URL is required.');
    }

    // Get folder ID based on tags
    const folderId = getFolderIdByTags(tags);
    if (!folderId) {
      throw new Error('No folder found for tags. Please check driveFolders.js configuration.');
    }

    try {
      const token = await user.getIdToken();
      
      const response = await fetch(`${API_BASE}/api/upload-from-url`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageUrl,
          folderId,
          tags,
          userId: user.uid,
          timestamp: Date.now(),
          ...options
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`URL upload failed: ${errorData.details || errorData.error || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('URL upload error:', error);
      throw error;
    }
  },

  /**
   * Get upload history for user
   * @param {Object} user - Authenticated Firebase user object
   * @param {Object} options - Query options (limit, offset, category)
   * @returns {Promise<Array>} Upload history
   */
  async getUploadHistory(user, options = {}) {
    if (!user) {
      throw new Error('User not authenticated.');
    }
    
    try {
      const { limit = 50, offset = 0, category = null } = options;
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        ...(category && { category })
      });

      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE}/api/upload-history?${params}`, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to get upload history: ${errorData.error || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload history error:', error);
      throw error;
    }
  },

  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  validateFile(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      minWidth = 0,
      minHeight = 0
    } = options;

    const errors = [];
    const warnings = [];

    // Check file existence
    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors, warnings };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
    }

    // Check if file is too small
    if (file.size < 1024) {
      warnings.push('File size is very small, may indicate a corrupted file');
    }

    // For images, we could check dimensions if needed (requires loading the image)
    if (file.type.startsWith('image/') && (minWidth > 0 || minHeight > 0)) {
      warnings.push('Image dimension validation requires loading the image');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }
    };
  },

  /**
   * Get available folder IDs and their categories
   * @returns {Object} Folder configuration
   */
  getFolderConfiguration() {
    return {
      folders: FOLDER_IDS,
      categories: {
        travel: 'DAX_TRAVELER_PHOTOS',
        faith: 'GODS_VESSEL_PHOTOS',
        timezone: 'TIMEZONE_TRAVELERS_PHOTOS',
        collective: 'DAX_HOMEPAGE_PHOTOS',
        anime: 'ANI_DAX_PHOTOS',
        analytics: 'DAX_ANALYTICS_IMAGES',
        food: 'SATIATED_TASTE_PHOTOS',
        design: 'TSHIRT_DESIGNS'
      },
      getFolderIdByTags
    };
  }
};

export default uploadApiHelper;

