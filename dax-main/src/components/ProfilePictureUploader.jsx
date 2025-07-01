// src/components/ProfilePictureUploader.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ProfilePictureUploader = ({ onUploadComplete, currentImage = null }) => {
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadStatus('error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setUploadStatus(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('profileImage', file);
      formData.append('timestamp', Date.now());

      // Upload to your backend endpoint
      const response = await fetch('/api/upload/profile-picture', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadStatus('success');
        
        // Call parent callback with uploaded image URL
        if (onUploadComplete) {
          onUploadComplete(result.imageUrl);
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setPreview(currentImage);
    setUploadStatus(null);
    setUploading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Profile Picture
      </h3>

      {/* Upload Area */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="profile-upload"
          disabled={uploading}
        />
        
        <label
          htmlFor="profile-upload"
          className={`
            block w-full h-48 border-2 border-dashed rounded-lg cursor-pointer
            transition-colors duration-200
            ${uploading ? 'border-gray-300 cursor-not-allowed' : 'border-gray-300 hover:border-blue-400'}
            ${uploadStatus === 'error' ? 'border-red-400' : ''}
            ${uploadStatus === 'success' ? 'border-green-400' : ''}
          `}
        >
          <div className="flex flex-col items-center justify-center h-full p-4">
            {preview ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-32 h-32 rounded-full overflow-hidden"
              >
                <img
                  src={preview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload profile picture
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}
          </div>
        </label>
      </div>

      {/* Status Messages */}
      {uploadStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center"
        >
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-sm text-green-700">
            Profile picture uploaded successfully!
          </span>
        </motion.div>
      )}

      {uploadStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center"
        >
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-sm text-red-700">
            Upload failed. Please try again.
          </span>
        </motion.div>
      )}

      {/* Action Buttons */}
      {preview && !uploading && (
        <div className="mt-4 flex space-x-3">
          <button
            onClick={resetUpload}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
          
          <label
            htmlFor="profile-upload"
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors cursor-pointer text-center"
          >
            Change Photo
          </label>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUploader;
