// LOCATION: dax-main/src/services/enhanced-driveApi.js
//
// Drive / Firebase Storage operations for the admin dashboard.
// Every call goes to the backend's protected /api/admin/* routes through
// adminFetch, which attaches the signed-in user's Firebase ID token and
// refuses to send anything when nobody is signed in.

import { adminFetch, checkAdminAccess } from './adminApi';

/**
 * Enhanced Drive API service with comprehensive upload and management features
 */
class DriveApiService {
  /**
   * Ask the backend whether the signed-in user may use the admin routes.
   * @returns {Promise<{authorized: boolean, reason: string|null}>}
   */
  checkAdminAccess() {
    return checkAdminAccess();
  }

  /**
   * Fetch images from a Google Drive folder with pagination
   */
  async fetchDriveImages(folderId, options = {}) {
    if (!folderId) {
      throw new Error('Folder ID is required');
    }

    const { pageSize = 50, pageToken } = options;
    const params = new URLSearchParams({
      pageSize: pageSize.toString(),
      ...(pageToken && { pageToken })
    });

    const data = await adminFetch(`/drive/images/${encodeURIComponent(folderId)}?${params}`);
    return {
      images: data.images || [],
      nextPageToken: data.nextPageToken,
      hasMore: !!data.nextPageToken,
      totalCount: data.totalCount || data.images?.length || 0
    };
  }

  /**
   * Upload files to Google Drive with smart folder routing
   */
  async uploadToDrive(files, category = 'collective', options = {}) {
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

    return adminFetch('/drive-upload', { method: 'POST', body: formData });
  }

  /**
   * Upload to Firebase Storage (for profile pictures)
   */
  async uploadToFirebase(file) {
    const formData = new FormData();
    formData.append('file', file);

    return adminFetch('/firebase-profile', { method: 'POST', body: formData });
  }

  /**
   * Check for duplicate images before upload
   */
  async checkDuplicates(files, folderId = null, category = null) {
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

    return adminFetch('/check-duplicates', { method: 'POST', body: formData });
  }

  /**
   * Get folder information and statistics
   */
  async getFolderInfo(folderId) {
    return adminFetch(`/drive/folder/${encodeURIComponent(folderId)}`);
  }

  /**
   * Batch upload images from URLs (for photo search integration).
   * The backend accepts at most 10 URLs per request.
   */
  async batchUploadFromUrls(urls, category = 'collective', options = {}) {
    const { tags = [], descriptions = [] } = options;

    return adminFetch('/drive/batch-from-urls', {
      method: 'POST',
      json: { urls, category, tags, descriptions }
    });
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

// Bound so the named exports keep working when called on their own.
export const fetchDriveImages = driveApiService.fetchDriveImages.bind(driveApiService);
export const uploadToDrive = driveApiService.uploadToDrive.bind(driveApiService);
export const uploadToFirebase = driveApiService.uploadToFirebase.bind(driveApiService);
export const checkDuplicates = driveApiService.checkDuplicates.bind(driveApiService);
export const getFolderInfo = driveApiService.getFolderInfo.bind(driveApiService);
export const batchUploadFromUrls = driveApiService.batchUploadFromUrls.bind(driveApiService);
export const getFolderIdForCategory = driveApiService.getFolderIdForCategory.bind(driveApiService);
export const validateFolderConfiguration = driveApiService.validateFolderConfiguration.bind(driveApiService);
