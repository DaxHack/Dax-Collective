// LOCATION: dax-main/src/services/enhanced-driveApi.js
// ACTION: CREATE NEW FILE

import { auth } from '../config/firebase';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Enhanced Drive API service with comprehensive upload and management features
 */
class DriveApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * All routes in this file are admin-only (mounted under /api/admin on the
   * backend, behind requireAuth + requireAdmin). Every call must carry the
   * signed-in user's current Firebase ID token — there is no other way in.
   * Uses the shared Firebase auth instance directly so callers don't need
   * to thread a `user` object through every method.
   */
  async getAuthHeaders(extra = {}) {
    const headers = { ...extra };
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Calls the backend admin-access check (GET /api/admin/access). This is
   * the ONLY source of truth for whether the current user may see admin
   * controls — the frontend never decides this on its own (no hardcoded
   * UID/email checks). Returns a structured result instead of throwing so
   * callers can render a clean state per outcome.
   */
  async checkAdminAccess() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/api/admin/access`, {
        method: 'GET',
        headers,
      });

      if (response.status === 401) {
        return { authorized: false, reason: 'unauthenticated' };
      }
      if (response.status === 403) {
        return { authorized: false, reason: 'forbidden' };
      }
      if (response.status === 404) {
        // /api/admin/* isn't mounted at all — ENABLE_ADMIN_UPLOADS isn't 'true'.
        return { authorized: false, reason: 'not_configured' };
      }
      if (!response.ok) {
        return { authorized: false, reason: 'error' };
      }

      const data = await response.json();
      return data.authorized === true ?
        { authorized: true, reason: 'ok' } :
        { authorized: false, reason: 'forbidden' };
    } catch (error) {
      // Network failure / backend unreachable — treat the same as "not
      // configured" rather than crashing the page.
      console.error('Error checking admin access:', error);
      return { authorized: false, reason: 'unreachable' };
    }
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

      const headers = await this.getAuthHeaders({ 'Content-Type': 'application/json' });
      const response = await fetch(`${this.baseUrl}/api/admin/drive/images/${folderId}?${params}`, {
        method: 'GET',
        headers,
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

      const headers = await this.getAuthHeaders(); // No Content-Type — browser sets multipart boundary.
      const response = await fetch(`${this.baseUrl}/api/admin/drive-upload`, {
        method: 'POST',
        headers,
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

      const headers = await this.getAuthHeaders(); // No Content-Type — browser sets multipart boundary.
      const response = await fetch(`${this.baseUrl}/api/admin/firebase-profile`, {
        method: 'POST',
        headers,
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

      const headers = await this.getAuthHeaders(); // No Content-Type — browser sets multipart boundary.
      const response = await fetch(`${this.baseUrl}/api/admin/check-duplicates`, {
        method: 'POST',
        headers,
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
      const headers = await this.getAuthHeaders({ 'Content-Type': 'application/json' });
      const response = await fetch(`${this.baseUrl}/api/admin/drive/folder/${folderId}`, {
        method: 'GET',
        headers,
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

      const headers = await this.getAuthHeaders({ 'Content-Type': 'application/json' });
      const response = await fetch(`${this.baseUrl}/api/admin/drive/batch-from-urls`, {
        method: 'POST',
        headers,
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
  checkAdminAccess,
  fetchDriveImages,
  uploadToDrive,
  uploadToFirebase,
  checkDuplicates,
  getFolderInfo,
  batchUploadFromUrls,
  getFolderIdForCategory,
  validateFolderConfiguration
} = driveApiService;
