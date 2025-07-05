// src/automation/ImageUpload.jsx
// FINAL VERSION - Clean, simple, no conflicts

import React, { useState, useEffect } from 'react';
import { 
  PhotoIcon, 
  TagIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FolderIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Import your existing folder configuration
import { FOLDER_IDS } from '../config/driveFolder';
import { useAuth } from '../contexts/AuthContext';
import { uploadApiHelper } from '../services/uploadApiHelper';

const ImageUpload = ({ 
  onUploadComplete, 
  onUploadStart, 
  onUploadProgress, 
  onError,
  category = 'collective',
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}) => {
  const { user } = useAuth();
  
  // State management
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrls, setPreviewUrls] = useState({});
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [description, setDescription] = useState('');
  const [smartTags, setSmartTags] = useState([]);
  const [errors, setErrors] = useState([]);

  // Smart tag analysis
  useEffect(() => {
    if (selectedFiles.length === 0) {
      setSmartTags([]);
      return;
    }
    
    const suggestedTags = [];
    
    // Analyze file names for keywords
    selectedFiles.forEach(file => {
      const fileName = file.name.toLowerCase();
      
      // Location-based tags
      if (fileName.includes('beach') || fileName.includes('ocean')) {
        suggestedTags.push('beach', 'ocean');
      }
      if (fileName.includes('mountain') || fileName.includes('hiking')) {
        suggestedTags.push('mountain', 'hiking');
      }
      if (fileName.includes('city') || fileName.includes('urban')) {
        suggestedTags.push('city', 'urban');
      }
      if (fileName.includes('sunset') || fileName.includes('sunrise')) {
        suggestedTags.push('sunset', 'golden-hour');
      }
      if (fileName.includes('food') || fileName.includes('restaurant')) {
        suggestedTags.push('food', 'cuisine');
      }
      
      // Activity-based tags
      if (fileName.includes('travel') || fileName.includes('trip')) {
        suggestedTags.push('travel', 'adventure');
      }
      if (fileName.includes('portrait') || fileName.includes('selfie')) {
        suggestedTags.push('portrait', 'people');
      }
      if (fileName.includes('landscape')) {
        suggestedTags.push('landscape', 'nature');
      }
    });
    
    // Category-based suggestions
    if (category === 'travel') {
      suggestedTags.push('travel', 'adventure', 'explore');
    } else if (category === 'faith') {
      suggestedTags.push('faith', 'inspiration', 'spiritual');
    } else if (category === 'collective') {
      suggestedTags.push('collective', 'community', 'lifestyle');
    }
    
    // Remove duplicates and limit to 8
    const uniqueTags = [...new Set(suggestedTags)].slice(0, 8);
    setSmartTags(uniqueTags);
  }, [selectedFiles, category]);

  // Handle file selection
  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (!acceptedTypes.includes(file.type)) {
        setErrors(prev => [...prev, `${file.name}: Invalid file type`]);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors(prev => [...prev, `${file.name}: File too large (max 10MB)`]);
        return false;
      }
      return true;
    });

    if (selectedFiles.length + validFiles.length > maxFiles) {
      setErrors(prev => [...prev, `Maximum ${maxFiles} files allowed`]);
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Generate preview URLs
    validFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({ ...prev, [file.name]: url }));
    });
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Add tag
  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      setTags(prev => [...prev, tag]);
      setCurrentTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  // Remove file
  const removeFile = (fileName) => {
    setSelectedFiles(prev => prev.filter(file => file.name !== fileName));
    if (previewUrls[fileName]) {
      URL.revokeObjectURL(previewUrls[fileName]);
      setPreviewUrls(prev => {
        const newUrls = { ...prev };
        delete newUrls[fileName];
        return newUrls;
      });
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !user) return;

    setUploading(true);
    setErrors([]);
    onUploadStart?.(selectedFiles.length);

    try {
      const uploadOptions = {
        tags: tags.length > 0 ? tags : smartTags,
        description: description.trim()
      };

      const result = await uploadApiHelper.uploadToDrive(
        selectedFiles,
        category,
        user,
        uploadOptions
      );

      setUploadResults(result.uploads || []);
      onUploadComplete?.(result);
      
      // Clear form
      setSelectedFiles([]);
      setTags([]);
      setDescription('');
      setPreviewUrls({});
      
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(prev => [...prev, error.message]);
      onError?.(error);
    } finally {
      setUploading(false);
    }
  };

  // Get folder info for current category
  const getFolderInfo = () => {
    const folderId = FOLDER_IDS[category];
    return {
      id: folderId,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      available: !!folderId
    };
  };

  const folderInfo = getFolderInfo();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Images</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FolderIcon className="w-4 h-4" />
          <span>Uploading to: {folderInfo.name}</span>
          {!folderInfo.available && (
            <span className="text-red-500">(Folder not configured)</span>
          )}
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
            <ExclamationTriangleIcon className="w-5 h-5" />
            Errors
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="space-y-4">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto" />
          <div>
            <p className="text-lg font-medium text-gray-900">
              Drop images here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports JPEG, PNG, WebP, GIF up to 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Selected Files ({selectedFiles.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedFiles.map((file) => (
              <div key={file.name} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {previewUrls[file.name] && (
                    <img
                      src={previewUrls[file.name]}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <button
                  onClick={() => removeFile(file.name)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
                <p className="mt-2 text-xs text-gray-600 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags Section */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 space-y-4">
          {/* Smart Tags */}
          {smartTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Suggested Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {smartTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Manual Tags */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TagIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag(currentTag)}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => addTag(currentTag)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for these images..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={uploading || !user || !folderInfo.available}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CloudArrowUpIcon className="w-5 h-5" />
            {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Files`}
          </button>
        </div>
      )}

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
            <CheckCircleIcon className="w-5 h-5" />
            Upload Complete
          </div>
          <p className="text-sm text-green-700">
            Successfully uploaded {uploadResults.length} files
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

