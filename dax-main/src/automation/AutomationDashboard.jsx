// src/automation/AutomationDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhotoIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

// Import services and components - Fixed imports
import ImageSourcer from '../utils/imageSourcer'; // Fixed: Use default export
import driveApiService from '../services/enhanced-driveApi';
import ImageUpload from './ImageUpload';
import ProfilePictureUploader from '../components/ProfilePictureUploader';
import { useAuth } from '../contexts/AuthContext';

const AutomationDashboard = () => {
  const { user } = useAuth();
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState('overview');
  const [automationStatus, setAutomationStatus] = useState('idle'); // 'idle', 'running', 'paused', 'error'
  const [stats, setStats] = useState({
    totalImages: 0,
    recentUploads: 0,
    driveStorage: 0,
    automationRuns: 0
  });

  // Photo search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  // Upload state
  const [uploadProgress, setUploadProgress] = useState({});
  const [recentUploads, setRecentUploads] = useState([]);

  // Folder management
  const [folderStats, setFolderStats] = useState({
    travel: { count: 0, size: 0 },
    faith: { count: 0, size: 0 },
    collective: { count: 0, size: 0 },
    timezone: { count: 0, size: 0 }
  });

  // Load dashboard data
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load folder statistics using environment variables
      const folders = {
        travel: process.env.REACT_APP_DRIVE_DAX_TRAVELER_PHOTOS,
        faith: process.env.REACT_APP_DRIVE_GODS_VESSEL_PHOTOS,
        collective: process.env.REACT_APP_DRIVE_DAX_HOMEPAGE_PHOTOS,
        timezone: process.env.REACT_APP_DRIVE_TIMEZONE_TRAVELERS_PHOTOS
      };

      const folderData = {};
      let totalImages = 0;

      for (const [key, folderId] of Object.entries(folders)) {
        if (folderId) {
          try {
            // Use driveApiService instead of direct getFolderInfo
            const images = await driveApiService.fetchDriveImages(folderId, { pageSize: 1000 }, user);
            const count = images.images?.length || 0;
            folderData[key] = {
              count,
              size: count * 2048 // Estimate 2MB per image
            };
            totalImages += count;
          } catch (error) {
            console.warn(`Failed to load ${key} folder stats:`, error);
            folderData[key] = { count: 0, size: 0 };
          }
        } else {
          folderData[key] = { count: 0, size: 0 };
        }
      }

      setFolderStats(folderData);
      setStats(prev => ({ ...prev, totalImages }));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  // Photo search functionality - Fixed to use ImageSourcer correctly
  const handlePhotoSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const results = await ImageSourcer.searchImages(searchQuery, {
        maxResults: 20,
        category: 'mixed'
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Photo search failed:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Bulk upload selected images
  const handleBulkUpload = async (category = 'collective') => {
    if (selectedImages.length === 0 || !user) return;

    setAutomationStatus('running');
    
    try {
      // Use ImageSourcer's searchAndUpload method
      const uploadResult = await ImageSourcer.searchAndUpload(searchQuery, {
        maxResults: selectedImages.length,
        category: ImageSourcer.mapBrandToCategory(category),
        uploadSelected: true,
        selectedIndices: selectedImages.map((_, index) => index)
      }, user);

      if (uploadResult.success) {
        setRecentUploads(prev => [
          ...uploadResult.uploads.map(upload => ({
            fileName: upload.name || 'Unknown',
            category: uploadResult.category,
            timestamp: Date.now(),
            fileSize: '~2MB'
          })),
          ...prev
        ].slice(0, 10));
        
        setSelectedImages([]);
        setAutomationStatus('idle');
        
        // Refresh stats
        loadDashboardData();
      } else {
        throw new Error(uploadResult.message);
      }
    } catch (error) {
      console.error('Bulk upload failed:', error);
      setAutomationStatus('error');
    }
  };

  // Automation controls
  const startAutomation = async () => {
    if (!user) return;
    
    setAutomationStatus('running');
    try {
      // Implement automated photo sourcing and uploading
      const result = await ImageSourcer.searchAndUpload('professional business', {
        maxResults: 5,
        autoCategory: true
      }, user);
      
      if (result.success) {
        setRecentUploads(prev => [
          ...result.uploads.map(upload => ({
            fileName: upload.name || 'Auto-sourced',
            category: result.category,
            timestamp: Date.now(),
            fileSize: '~2MB'
          })),
          ...prev
        ].slice(0, 10));
        
        setAutomationStatus('idle');
        loadDashboardData();
      } else {
        setAutomationStatus('error');
      }
    } catch (error) {
      console.error('Automation failed:', error);
      setAutomationStatus('error');
    }
  };

  const pauseAutomation = () => {
    setAutomationStatus('paused');
  };

  const resetAutomation = () => {
    setAutomationStatus('idle');
    setUploadProgress({});
    setSelectedImages([]);
    setSearchResults([]);
    setSearchQuery('');
  };

  // Tab content components
  const OverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center">
          <PhotoIcon className="h-8 w-8 text-blue-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Images</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalImages}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center">
          <CloudArrowUpIcon className="h-8 w-8 text-green-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Recent Uploads</p>
            <p className="text-2xl font-bold text-gray-900">{recentUploads.length}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center">
          <FolderIcon className="h-8 w-8 text-purple-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Drive Folders</p>
            <p className="text-2xl font-bold text-gray-900">4</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center">
          <ChartBarIcon className="h-8 w-8 text-orange-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Automation Status</p>
            <p className={`text-lg font-bold capitalize ${
              automationStatus === 'running' ? 'text-green-600' :
              automationStatus === 'error' ? 'text-red-600' :
              automationStatus === 'paused' ? 'text-yellow-600' :
              'text-gray-900'
            }`}>
              {automationStatus}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Folder Statistics */}
      <div className="col-span-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Folder Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(folderStats).map(([folder, stats]) => (
            <div key={folder} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 capitalize">{folder}</h4>
              <p className="text-sm text-gray-600">{stats.count} images</p>
              <p className="text-xs text-gray-500">{(stats.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PhotoSearchTab = () => (
    <div className="space-y-6">
      {/* Search Interface */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Search & Collection</h3>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for photos (e.g., 'travel sunset', 'faith cross', 'nature landscape')"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handlePhotoSearch()}
            />
          </div>
          <button
            onClick={handlePhotoSearch}
            disabled={searchLoading || !searchQuery.trim() || !user}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {searchLoading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <MagnifyingGlassIcon className="h-5 w-5" />
            )}
            Search
          </button>
        </div>

        {!user && (
          <div className="text-center py-4">
            <InformationCircleIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Please sign in to search and upload photos</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && user && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">
                Search Results ({searchResults.length})
              </h4>
              {selectedImages.length > 0 && (
                <div className="flex gap-2">
                  <select
                    onChange={(e) => handleBulkUpload(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>Upload to...</option>
                    <option value="dax-the-traveler">Travel (DaxTheTraveler)</option>
                    <option value="gods-vessel">Faith (GodsVessel)</option>
                    <option value="dax-collective">Collective</option>
                    <option value="timezone-travelers">Timezone Travelers</option>
                  </select>
                  <button
                    onClick={() => setSelectedImages([])}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear ({selectedImages.length})
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {searchResults.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImages.includes(image)
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedImages(prev => 
                      prev.includes(image)
                        ? prev.filter(img => img.id !== image.id)
                        : [...prev, image]
                    );
                  }}
                >
                  <img
                    src={image.thumbnail || image.url}
                    alt={image.title}
                    className="w-full h-24 object-cover"
                  />
                  {selectedImages.includes(image) && (
                    <div className="absolute top-2 right-2">
                      <CheckCircleIcon className="h-5 w-5 text-blue-500 bg-white rounded-full" />
                    </div>
                  )}
                  {uploadProgress[image.id] && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50">
                      <div 
                        className="h-1 bg-blue-500 transition-all duration-300"
                        style={{ width: `${uploadProgress[image.id].progress}%` }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const UploadTab = () => (
    <div className="space-y-6">
      {/* Upload Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture Upload</h3>
          <ProfilePictureUploader 
            onUploadComplete={(result) => {
              setRecentUploads(prev => [{
                fileName: result.fileName || 'Profile Picture',
                category: 'Profile',
                timestamp: Date.now(),
                fileSize: result.fileSize || '~1MB'
              }, ...prev].slice(0, 10));
            }}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Drive Upload</h3>
          <ImageUpload 
            onUploadComplete={(results) => {
              setRecentUploads(prev => [
                ...results.map(result => ({
                  fileName: result.file,
                  category: result.folder,
                  timestamp: Date.now(),
                  fileSize: '~2MB'
                })),
                ...prev
              ].slice(0, 10));
              loadDashboardData();
            }}
          />
        </div>
      </div>

      {/* Recent Uploads */}
      {recentUploads.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h3>
          <div className="space-y-3">
            {recentUploads.map((upload, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">{upload.fileName}</p>
                    <p className="text-sm text-gray-600">
                      Uploaded to {upload.category} • {new Date(upload.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{upload.fileSize}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const SettingsTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Settings</h3>
      
      <div className="space-y-6">
        {/* API Configuration Status */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">API Configuration</h4>
          <div className="space-y-2">
            {ImageSourcer.validateConfiguration && (() => {
              const config = ImageSourcer.validateConfiguration();
              return (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Configured APIs</p>
                    <p className="text-xs text-green-600">
                      {config.configured.join(', ') || 'None'}
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800">Missing APIs</p>
                    <p className="text-xs text-red-600">
                      {config.missing.join(', ') || 'None'}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Folder Configuration */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Drive Folders</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {Object.entries(folderStats).map(([folder, stats]) => (
              <div key={folder} className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="capitalize">{folder}</span>
                <span className="text-gray-600">{stats.count} images</span>
              </div>
            ))}
          </div>
        </div>

        {/* Automation Controls */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Automation Controls</h4>
          <div className="flex gap-2">
            <button
              onClick={resetAutomation}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Reset All Data
            </button>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'search', name: 'Photo Search', icon: MagnifyingGlassIcon },
    { id: 'upload', name: 'Upload', icon: CloudArrowUpIcon },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <InformationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please sign in to access the automation dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automation Dashboard</h1>
          <p className="text-gray-600">Manage your photo automation and uploads</p>
        </div>

        {/* Automation Controls */}
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            automationStatus === 'running' ? 'bg-green-100 text-green-800' :
            automationStatus === 'paused' ? 'bg-yellow-100 text-yellow-800' :
            automationStatus === 'error' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {automationStatus}
          </div>

          <div className="flex gap-2">
            {automationStatus === 'idle' || automationStatus === 'paused' ? (
              <button
                onClick={startAutomation}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                title="Start Automation"
              >
                <PlayIcon className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={pauseAutomation}
                className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                title="Pause Automation"
              >
                <PauseIcon className="h-5 w-5" />
              </button>
            )}
            
            <button
              onClick={resetAutomation}
              className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              title="Reset Automation"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'search' && <PhotoSearchTab />}
          {activeTab === 'upload' && <UploadTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AutomationDashboard;