// src/services/uploadApiHelper.js
//
// Upload helpers for the admin dashboard. Every network call goes to the
// backend's protected /api/admin/* routes through adminFetch, which attaches
// the signed-in user's Firebase ID token and sends nothing when signed out.
//
// Backend routes used (dax-backend/routes/adminUploadApi.js):
//   POST /api/admin/firebase-profile        field "file"
//   POST /api/admin/drive-upload            field "files" (up to 10)
//   POST /api/admin/drive/batch-from-urls   JSON { urls, category, tags, descriptions }
import { adminFetch, AdminApiError } from './adminApi';
import { getFolderIdByTags, FOLDER_IDS } from '../config/driveFolder';

// The backend parses `tags` as JSON, so always send a JSON array.
const tagsToJson = (tags) => {
  const list = Array.isArray(tags)
    ? tags
    : String(tags || '').split(',').map((tag) => tag.trim()).filter(Boolean);
  return JSON.stringify(list);
};

const requireUser = (user, action) => {
  if (!user) {
    throw new Error(`User not authenticated for ${action}.`);
  }
};

// Operations the dashboard code refers to that the backend does not provide.
const notSupported = () => {
  throw new AdminApiError(
    { reason: 'not_available', message: 'This admin feature is not enabled on the server.' },
    404
  );
};

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
    requireUser(user, 'profile picture upload');
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

    const formData = new FormData();
    formData.append('file', file);

    const result = await adminFetch('/firebase-profile', { method: 'POST', body: formData });

    return {
      success: true,
      downloadURL: result.url,
      fileName: result.fileName,
      fileSize: result.size,
      uploadedAt: new Date().toISOString()
    };
  },

  /**
   * Upload files to Google Drive, routed by category
   * @param {FileList|Array} files - Files to upload (the backend accepts up to 10)
   * @param {string} category - Category for folder routing
   * @param {Object} user - Authenticated Firebase user object
   * @param {Object} options - Additional upload options (tags, description, folderId)
   * @returns {Promise<Object>} Backend response ({ uploads, totalFiles, ... })
   */
  async uploadToDrive(files, category = 'collective', user, options = {}) {
    requireUser(user, 'Drive upload');
    if (!files || files.length === 0) {
      throw new Error('No files provided for upload.');
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });
    formData.append('category', category);
    if (options.folderId) {
      formData.append('folderId', options.folderId);
    }
    if (options.tags) {
      formData.append('tags', tagsToJson(options.tags));
    }
    if (options.description) {
      formData.append('description', options.description);
    }

    return adminFetch('/drive-upload', { method: 'POST', body: formData });
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
    requireUser(user, 'smart image upload');
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

    const result = await this.uploadToDrive([file], options.category || 'collective', user, {
      folderId,
      tags,
      description: options.description
    });
    const uploaded = (result.uploads || [])[0] || {};

    return {
      success: true,
      fileId: uploaded.id,
      fileName: uploaded.fileName,
      downloadURL: uploaded.directLink,
      thumbnailURL: uploaded.thumbnailLink,
      folderId: folderId,
      tags: tags,
      uploadedAt: uploaded.createdTime || new Date().toISOString()
    };
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
    requireUser(user, 'batch upload');
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

    const result = await this.uploadToDrive(validFiles, options.category || 'collective', user, {
      folderId,
      tags,
      description: options.description
    });

    return {
      success: true,
      totalFiles: files.length,
      validFiles: validFiles.length,
      invalidFiles: invalidFiles,
      uploadedFiles: result.uploads || [],
      failedFiles: [],
      folderId: folderId,
      tags: tags,
      uploadedAt: new Date().toISOString()
    };
  },

  /**
   * Check upload status by upload ID.
   * Not provided by the backend: uploads complete within the upload request.
   */
  async checkUploadStatus(uploadId, user) {
    requireUser(user, 'upload status');
    return notSupported();
  },

  /**
   * Delete uploaded file. Not provided by the backend.
   */
  async deleteUploadedFile(fileId, user) {
    requireUser(user, 'file deletion');
    return notSupported();
  },

  /**
   * Upload from URL (for photo search integration)
   * The backend downloads the image itself, with its own safety limits, and
   * files it in the Drive folder for `options.category`.
   * @param {string} imageUrl - URL of image to upload
   * @param {string} tags - Tags stored with the upload
   * @param {Object} user - Authenticated Firebase user object
   * @param {Object} options - Additional upload options (category, description)
   * @returns {Promise<Object>} Upload result
   */
  async uploadFromUrl(imageUrl, tags, user, options = {}) {
    requireUser(user, 'URL upload');
    if (!imageUrl) {
      throw new Error('Image URL is required.');
    }

    const result = await adminFetch('/drive/batch-from-urls', {
      method: 'POST',
      json: {
        urls: [imageUrl],
        category: options.category || 'collective',
        tags: [JSON.parse(tagsToJson(tags))],
        descriptions: options.description ? [options.description] : []
      }
    });

    const uploaded = (result.uploads || [])[0];
    if (!uploaded) {
      // The backend reports a short, generic reason per URL.
      const reason = (result.errors || [])[0];
      throw new Error((reason && reason.error) || 'Upload failed');
    }

    return {
      success: true,
      fileId: uploaded.id,
      fileName: uploaded.fileName,
      downloadURL: uploaded.directLink,
      thumbnailURL: uploaded.thumbnailLink,
      uploadedAt: uploaded.createdTime || new Date().toISOString()
    };
  },

  /**
   * Get upload history for user. Not provided by the backend.
   */
  async getUploadHistory(user) {
    requireUser(user, 'upload history');
    return notSupported();
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

