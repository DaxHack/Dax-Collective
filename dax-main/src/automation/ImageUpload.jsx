import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PhotoIcon, 
  TagIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Import your existing folder configuration (FIXED PATH)
import { BRAND_FOLDER_IDS } from '../config/driveFolder';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import { uploadApiHelper } from '../services/uploadApiHelper'; // Import uploadAPI helper

const ImageUpload = ({ 
  onUploadComplete = () => {},
  onUploadError = () => {},
  onDuplicateDetected = () => {},
  maxSizeMB = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  enableDuplicateCheck = true,
  className = ''
}) => {
  const { user, loading: authLoading } = useAuth(); // Get user and auth loading state

  // State management
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadResults, setUploadResults] = useState([]);
  const [error, setError] = useState(null);
  
  // Smart routing state
  const [tags, setTags] = useState('');
  const [suggestedFolder, setSuggestedFolder] = useState(null);
  const [manualFolder, setManualFolder] = useState('');
  const [routingMode, setRoutingMode] = useState('auto'); // 'auto', 'manual'
  
  // Duplicate detection state
  const [duplicateChecks, setDuplicateChecks] = useState({});
  const [showDuplicates, setShowDuplicates] = useState(false);

  // Smart folder routing logic
  const folderRouting = useMemo(() => ({
    'DaxTheTraveler': {
      keywords: ['travel', 'adventure', 'dax', 'journey', 'explore', 'wanderlust', 'trip', 'vacation'],
      description: 'Travel and adventure content for Dax the Traveler brand'
    },
    'GodsVessel': {
      keywords: ['faith', 'god', 'vessel', 'spiritual', 'prayer', 'bible', 'christian', 'worship', 'ministry'],
      description: 'Faith-based content for God\'s Vessel brand'
    },
    'AniDax': {
      keywords: ['anime', 'ani', 'animation', 'manga', 'otaku', 'cosplay', 'japanese', 'cartoon'],
      description: 'Anime and animation content for AniDax brand'
    },
    'TimeZoneTravelers': {
      keywords: ['timezone', 'guide', 'tips', 'hack', 'tutorial', 'advice', 'how-to', 'travel-guide'],
      description: 'Travel guides and tips for Timezone Travelers brand'
    },
    'DaxHomepage': {
      keywords: ['homepage', 'hero', 'main', 'landing', 'featured', 'banner', 'cover'],
      description: 'Homepage and featured content'
    },
    'DaxAnalytics': {
      keywords: ['analytics', 'chart', 'graph', 'data', 'stats', 'metrics', 'report', 'dashboard'],
      description: 'Analytics and data visualization content'
    }
  }), []);

  // Analyze tags and suggest folder
  const analyzeTags = (inputTags) => {
    if (!inputTags.trim()) {
      setSuggestedFolder(null);
      return;
    }

    const tagWords = inputTags.toLowerCase().split(/[\s,]+/).filter(Boolean);
    const scores = {};

    // Score each folder based on keyword matches
    Object.entries(folderRouting).forEach(([folder, config]) => {
      scores[folder] = 0;
      config.keywords.forEach(keyword => {
        tagWords.forEach(tag => {
          if (tag.includes(keyword) || keyword.includes(tag)) {
            scores[folder] += keyword === tag ? 2 : 1; // Exact match gets higher score
          }
        });
      });
    });

    // Find best match
    const bestMatch = Object.entries(scores).reduce((best, [folder, score]) => {
      return score > best.score ? { folder, score } : best;
    }, { folder: null, score: 0 });

    if (bestMatch.score > 0) {
      setSuggestedFolder({
        folder: bestMatch.folder,
        confidence: Math.min(bestMatch.score / tagWords.length, 1),
        description: folderRouting[bestMatch.folder].description
      });
    } else {
      setSuggestedFolder(null);
    }
  };

  // Handle tag input changes
  useEffect(() => {
    if (routingMode === 'auto') {
      analyzeTags(tags);
    }
  }, [tags, routingMode]);

  // Validate files
  const validateFiles = (files) => {
    const errors = [];
    
    Array.from(files).forEach((file, index) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`File ${index + 1}: Invalid type. Use ${allowedTypes.join(', ')}`);
      }
      
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        errors.push(`File ${index + 1}: Too large (${fileSizeMB.toFixed(1)}MB). Max: ${maxSizeMB}MB`);
      }
    });

    return errors;
  };

  // Handle file selection
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validationErrors = validateFiles(files);
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
      return;
    }

    setSelectedFiles(files);
    setError(null);
    setUploadResults([]);

    // Create previews
    const newPreviews = await Promise.all(
      files.map(async (file) => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type
      }))
    );
    
    setPreviews(newPreviews);

    // Check for duplicates if enabled
    if (enableDuplicateCheck) {
      checkForDuplicates(files);
    }
  };

  // Simple duplicate check based on file name and size
  const checkForDuplicates = async (files) => {
    const checks = {};
    
    // This is a simplified check - in production you'd want to check against actual Drive files
    files.forEach(file => {
      const key = `${file.name}-${file.size}`;
      checks[file.name] = {
        isDuplicate: false, // Would implement actual checking logic here
        confidence: 0,
        existingPath: null
      };
    });
    
    setDuplicateChecks(checks);
  };

  // Get target folder
  const getTargetFolder = () => {
    if (routingMode === 'manual' && manualFolder) {
      return manualFolder;
    }
    
    if (routingMode === 'auto' && suggestedFolder) {
      return suggestedFolder.folder;
    }
    
    return 'DaxHomepage'; // Default fallback
  };

  // Upload files
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    if (!user) {
      setError("You must be signed in to upload files.");
      return;
    }

    const targetFolder = getTargetFolder();
    const folderId = BRAND_FOLDER_IDS[targetFolder];
    
    if (!folderId) {
      setError(`Invalid folder: ${targetFolder}. Please check your configuration.`);
      return;
    }

    setUploading(true);
    setUploadProgress({});
    setError(null);

    const results = [];

    try {
      if (selectedFiles.length === 1) {
        const file = selectedFiles[0];
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: { status: 'uploading', progress: 0 }
        }));
        try {
          const result = await uploadApiHelper.uploadSmartImage(file, tags, user);
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: { status: 'success', progress: 100 }
          }));
          results.push({
            file: file.name,
            success: true,
            url: result.file.url, // Assuming the backend returns a file object with url
            id: result.file.id,
            folder: targetFolder
          });
        } catch (fileError) {
          console.error(`Error uploading ${file.name}:`, fileError);
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: { status: 'error', progress: 0 }
          }));
          results.push({
            file: file.name,
            success: false,
            error: fileError.message
          });
        }
      } else { // Batch upload
        try {
          // For batch upload, progress might be handled differently or not per-file
          // For simplicity, we'll just show overall progress
          setUploadProgress({ overall: { status: 'uploading', progress: 0 } });
          const batchResult = await uploadApiHelper.batchUpload(selectedFiles, tags, user);
          
          batchResult.uploaded.forEach(uploadedFile => {
            results.push({
              file: uploadedFile.originalName,
              success: true,
              url: uploadedFile.url,
              id: uploadedFile.id,
              folder: targetFolder
            });
          });
          batchResult.errors.forEach(failedFile => {
            results.push({
              file: failedFile.filename,
              success: false,
              error: failedFile.error
            });
          });
          setUploadProgress({ overall: { status: 'success', progress: 100 } });

        } catch (batchError) {
          console.error('Error during batch upload:', batchError);
          setError(batchError.message);
          setUploadProgress({ overall: { status: 'error', progress: 0 } });
        }
      }

      setUploadResults(results);
      
      // Call success callback with successful uploads
      const successfulUploads = results.filter(r => r.success);
      if (successfulUploads.length > 0) {
        onUploadComplete(successfulUploads);
      }

      // Call error callback if any failed
      const failedUploads = results.filter(r => !r.success);
      if (failedUploads.length > 0) {
        onUploadError(failedUploads);
      }

    } catch (error) {
      console.error('Overall upload error:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  // Reset uploader
  const resetUploader = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setUploadProgress({});
    setUploadResults([]);
    setError(null);
    setTags('');
    setSuggestedFolder(null);
    setManualFolder('');
    setDuplicateChecks({});
    
    // Clear file input
    const fileInput = document.getElementById('smart-image-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className={`smart-image-upload max-w-4xl mx-auto ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <SparklesIcon className="w-8 h-8 text-blue-500 mr-2" />
            <CloudArrowUpIcon className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Smart Image Upload</h3>
          <p className="text-sm text-gray-600">
            Upload images with automatic folder routing based on tags
          </p>
        </div>

        {/* Tag Input and Routing */}
        <div className="mb-6 space-y-4">
          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TagIcon className="w-4 h-4 inline mr-1" />
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., travel, adventure, dax, faith, anime..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Routing Mode */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Routing:</span>
            <label className="flex items-center">
              <input
                type="radio"
                value="auto"
                checked={routingMode === 'auto'}
                onChange={(e) => setRoutingMode(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Auto (AI-suggested)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="manual"
                checked={routingMode === 'manual'}
                onChange={(e) => setRoutingMode(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Manual</span>
            </label>
          </div>

          {/* Folder Selection */}
          {routingMode === 'auto' && suggestedFolder && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center mb-1">
                <FolderIcon className="w-4 h-4 text-blue-500 mr-2" />
                <span className="font-medium text-blue-700">
                  Suggested: {suggestedFolder.folder}
                </span>
                <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  {Math.round(suggestedFolder.confidence * 100)}% confidence
                </span>
              </div>
              <p className="text-sm text-blue-600">{suggestedFolder.description}</p>
            </motion.div>
          )}

          {routingMode === 'manual' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Folder
              </label>
              <select
                value={manualFolder}
                onChange={(e) => setManualFolder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a folder...</option>
                {Object.entries(folderRouting).map(([folder, config]) => (
                  <option key={folder} value={folder}>
                    {folder} - {config.description}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* File Upload Area */}
        <div className="mb-6">
          {previews.length === 0 ? (
            <label 
              htmlFor="smart-image-input"
              className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="text-center">
                <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  Multiple files supported • PNG, JPG, WebP, GIF up to {maxSizeMB}MB each
                </p>
              </div>
              <input
                id="smart-image-input"
                type="file"
                accept={allowedTypes.join(',')}
                onChange={handleFileSelect}
                multiple
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-4">
              {/* Preview Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={preview.url}
                        alt={preview.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Upload Progress Overlay */}
                    {uploadProgress[preview.name] && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        {uploadProgress[preview.name].status === 'uploading' && (
                          <div className="text-white text-center">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <span className="text-xs">Uploading...</span>
                          </div>
                        )}
                        {uploadProgress[preview.name].status === 'success' && (
                          <CheckCircleIcon className="w-8 h-8 text-green-400" />
                        )}
                        {uploadProgress[preview.name].status === 'error' && (
                          <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
                        )}
                      </div>
                    )}
                    
                    {/* File Info */}
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 truncate" title={preview.name}>
                        {preview.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(preview.size / 1024 / 1024).toFixed(1)}MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add More Button */}
              <label 
                htmlFor="smart-image-input"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <PhotoIcon className="w-4 h-4 mr-2" />
                Add More Images
              </label>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start"
          >
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700 whitespace-pre-line">{error}</div>
          </motion.div>
        )}

        {/* Upload Results */}
        {uploadResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 space-y-2"
          >
            {uploadResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.success
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {result.file}
                  </span>
                  {result.success ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                  )}
                </div>
                {result.success ? (
                  <p className="text-xs text-green-600 mt-1">
                    Uploaded to {result.folder}
                  </p>
                ) : (
                  <p className="text-xs text-red-600 mt-1">
                    {result.error}
                  </p>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {previews.length > 0 && !uploading && (
            <button
              onClick={handleUpload}
              disabled={!getTargetFolder() || authLoading || !user} // Disable if not authenticated
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <CloudArrowUpIcon className="w-4 h-4 mr-2" />
              {authLoading ? 'Checking Auth...' : user ? `Upload to ${getTargetFolder() || 'Folder'}` : 'Sign In to Upload'}
            </button>
          )}
          
          {(previews.length > 0 || uploadResults.length > 0) && (
            <button
              onClick={resetUploader}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {uploadResults.length > 0 ? 'Upload More' : 'Clear'}
            </button>
          )}
        </div>

        {/* Folder Mapping Reference */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Smart Routing Keywords:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
            {Object.entries(folderRouting).map(([folder, config]) => (
              <div key={folder}>
                <span className="font-medium">{folder}:</span> {config.keywords.slice(0, 4).join(', ')}
                {config.keywords.length > 4 && '...'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
