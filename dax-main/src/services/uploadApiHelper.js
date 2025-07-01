// src/services/uploadApiHelper.js
// REVIEW: This file looks correct! Here's what's working well and minor suggestions:

import { API_BASE } from '../config/apiConfig';
import { getFolderIdByTags, FOLDER_IDS } from '../config/driveFolder';

export const uploadApiHelper = {
  // ✅ GOOD: Proper authentication check
  async uploadProfilePicture(file, user) {
    if (!user) throw new Error('User not authenticated for profile picture upload.');
    
    const formData = new FormData();
    formData.append('image', file);
    const token = await user.getIdToken();
    
    const response = await fetch(`${API_BASE}/api/profile-picture`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Upload failed: ${errorData.details || response.statusText}`);
    }
    return response.json();
  },

  // ✅ GOOD: Smart routing with folder ID lookup
  async uploadSmartImage(file, tags, user) {
    if (!user) throw new Error('User not authenticated for smart image upload.');
    
    const folderId = getFolderIdByTags(tags);
    if (!folderId) throw new Error('No folder found for tags. Please check driveFolders.js configuration.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId);
    formData.append('tags', tags);
    formData.append('timestamp', Date.now());

    const token = await user.getIdToken();
    
    const response = await fetch(`${API_BASE}/api/drive-image`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Upload failed: ${errorData.details || response.statusText}`);
    }
    return response.json();
  },

  // ✅ GOOD: Batch upload functionality
  async batchUpload(files, tags, user) {
    if (!user) throw new Error('User not authenticated for batch upload.');
    
    const folderId = getFolderIdByTags(tags);
    if (!folderId) throw new Error('No folder found for tags. Please check driveFolders.js configuration.');

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('folderId', folderId);
    formData.append('tags', tags);

    const token = await user.getIdToken();
    
    const response = await fetch(`${API_BASE}/api/batch-upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Batch upload failed: ${errorData.details || response.statusText}`);
    }
    return response.json();
  },

  // 💡 SUGGESTION: Add a helper method for checking upload status
  async checkUploadStatus(uploadId, user) {
    if (!user) throw new Error('User not authenticated.');
    
    const token = await user.getIdToken();
    const response = await fetch(`${API_BASE}/api/upload-status/${uploadId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Failed to check upload status');
    }
    return response.json();
  },

  // 💡 SUGGESTION: Add a helper method for deleting uploaded files
  async deleteUploadedFile(fileId, user) {
    if (!user) throw new Error('User not authenticated.');
    
    const token = await user.getIdToken();
    const response = await fetch(`${API_BASE}/api/file/${fileId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Delete failed: ${errorData.details || response.statusText}`);
    }
    return response.json();
  }
};


// Minor suggestions (optional):
// - Consider adding upload progress tracking
// - Add file validation (size, type) before upload
// - Add retry logic for failed uploads
// 
// This file is ready to use as-is!
