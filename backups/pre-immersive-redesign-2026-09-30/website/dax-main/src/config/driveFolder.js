// src/config/driveFolder.js
// CORRECTED VERSION - Copy this to replace your existing driveFolder.js

// FIXED: Complete folder IDs configuration with proper environment variable mapping
export const FOLDER_IDS = {
  // Main brand folders
  DAX_TRAVELER_PHOTOS: process.env.REACT_APP_DRIVE_DAX_TRAVELER_PHOTOS || "1Jn-3NZ38qiy7nm-VFfmSOrriXCBA7ccr",
  GODS_VESSEL_PHOTOS: process.env.REACT_APP_DRIVE_GODS_VESSEL_PHOTOS || "",
  TIMEZONE_TRAVELERS_PHOTOS: process.env.REACT_APP_DRIVE_TIMEZONE_TRAVELERS_PHOTOS || "",
  SATIATED_TASTE_PHOTOS: process.env.REACT_APP_DRIVE_SATIATED_TASTE_PHOTOS || "",
  
  // Collective and shared folders
  DAX_HOMEPAGE_PHOTOS: process.env.REACT_APP_DRIVE_DAX_HOMEPAGE_PHOTOS || "",
  ANI_DAX_PHOTOS: process.env.REACT_APP_DRIVE_ANI_DAX_PHOTOS || "",
  DAX_ANALYTICS_IMAGES: process.env.REACT_APP_DRIVE_DAX_ANALYTICS_IMAGES || "",
  
  // Design and product folders
  TSHIRT_DESIGNS: process.env.REACT_APP_DRIVE_TSHIRT_DESIGNS || "",
  LOGO_ASSETS: process.env.REACT_APP_DRIVE_LOGO_ASSETS || "",
  BRAND_ASSETS: process.env.REACT_APP_DRIVE_BRAND_ASSETS || "",
  
  // Content creation folders
  YOUTUBE_THUMBNAILS: process.env.REACT_APP_DRIVE_YOUTUBE_THUMBNAILS || "",
  SOCIAL_MEDIA_ASSETS: process.env.REACT_APP_DRIVE_SOCIAL_MEDIA_ASSETS || "",
  BLOG_IMAGES: process.env.REACT_APP_DRIVE_BLOG_IMAGES || "",
  
  // Backup and archive folders
  BACKUP_PHOTOS: process.env.REACT_APP_DRIVE_BACKUP_PHOTOS || "",
  ARCHIVE_PHOTOS: process.env.REACT_APP_DRIVE_ARCHIVE_PHOTOS || ""
};

// FIXED: Category to folder mapping for smart routing
export const CATEGORY_FOLDER_MAPPING = {
  // Brand categories
  'travel': 'DAX_TRAVELER_PHOTOS',
  'adventure': 'DAX_TRAVELER_PHOTOS',
  'dax-traveler': 'DAX_TRAVELER_PHOTOS',
  
  'faith': 'GODS_VESSEL_PHOTOS',
  'spiritual': 'GODS_VESSEL_PHOTOS',
  'god': 'GODS_VESSEL_PHOTOS',
  'gods-vessel': 'GODS_VESSEL_PHOTOS',
  
  'timezone': 'TIMEZONE_TRAVELERS_PHOTOS',
  'productivity': 'TIMEZONE_TRAVELERS_PHOTOS',
  'time': 'TIMEZONE_TRAVELERS_PHOTOS',
  'timezone-travelers': 'TIMEZONE_TRAVELERS_PHOTOS',
  
  'food': 'SATIATED_TASTE_PHOTOS',
  'recipe': 'SATIATED_TASTE_PHOTOS',
  'cooking': 'SATIATED_TASTE_PHOTOS',
  'satiated-taste': 'SATIATED_TASTE_PHOTOS',
  
  // Content types
  'design': 'TSHIRT_DESIGNS',
  'tshirt': 'TSHIRT_DESIGNS',
  'apparel': 'TSHIRT_DESIGNS',
  'merchandise': 'TSHIRT_DESIGNS',
  
  'logo': 'LOGO_ASSETS',
  'branding': 'BRAND_ASSETS',
  'brand': 'BRAND_ASSETS',
  
  'thumbnail': 'YOUTUBE_THUMBNAILS',
  'youtube': 'YOUTUBE_THUMBNAILS',
  'video': 'YOUTUBE_THUMBNAILS',
  
  'social': 'SOCIAL_MEDIA_ASSETS',
  'instagram': 'SOCIAL_MEDIA_ASSETS',
  'twitter': 'SOCIAL_MEDIA_ASSETS',
  'facebook': 'SOCIAL_MEDIA_ASSETS',
  'tiktok': 'SOCIAL_MEDIA_ASSETS',
  
  'blog': 'BLOG_IMAGES',
  'article': 'BLOG_IMAGES',
  'post': 'BLOG_IMAGES',
  
  // Special categories
  'collective': 'DAX_HOMEPAGE_PHOTOS',
  'homepage': 'DAX_HOMEPAGE_PHOTOS',
  'main': 'DAX_HOMEPAGE_PHOTOS',
  
  'anime': 'ANI_DAX_PHOTOS',
  'ani-dax': 'ANI_DAX_PHOTOS',
  'animation': 'ANI_DAX_PHOTOS',
  
  'analytics': 'DAX_ANALYTICS_IMAGES',
  'dashboard': 'DAX_ANALYTICS_IMAGES',
  'chart': 'DAX_ANALYTICS_IMAGES',
  'graph': 'DAX_ANALYTICS_IMAGES',
  
  'backup': 'BACKUP_PHOTOS',
  'archive': 'ARCHIVE_PHOTOS'
};

// Add this line to your driveFolder.js:
export const BRAND_FOLDER_IDS = FOLDER_IDS;


// FIXED: Tag-based folder routing with multiple tag support
export const getFolderIdByTags = (tags) => {
  if (!tags) {
    return FOLDER_IDS.DAX_HOMEPAGE_PHOTOS; // Default fallback
  }

  // Convert tags to lowercase for matching
  const tagString = typeof tags === 'string' ? tags.toLowerCase() : 
                   Array.isArray(tags) ? tags.join(' ').toLowerCase() : 
                   String(tags).toLowerCase();

  // Check each category mapping
  for (const [category, folderKey] of Object.entries(CATEGORY_FOLDER_MAPPING)) {
    if (tagString.includes(category)) {
      const folderId = FOLDER_IDS[folderKey];
      if (folderId) {
        return folderId;
      }
    }
  }

  // Fallback to default folder
  return FOLDER_IDS.DAX_HOMEPAGE_PHOTOS || FOLDER_IDS.DAX_TRAVELER_PHOTOS;
};

// FIXED: Get folder key by category
export const getFolderKeyByCategory = (category) => {
  if (!category) return 'DAX_HOMEPAGE_PHOTOS';
  
  const categoryLower = category.toLowerCase();
  return CATEGORY_FOLDER_MAPPING[categoryLower] || 'DAX_HOMEPAGE_PHOTOS';
};

// FIXED: Get folder ID by category
export const getFolderIdByCategory = (category) => {
  const folderKey = getFolderKeyByCategory(category);
  return FOLDER_IDS[folderKey];
};

// FIXED: Get all configured folders with metadata
export const getAllConfiguredFolders = () => {
  return Object.entries(FOLDER_IDS)
    .filter(([key, folderId]) => folderId) // Only include configured folders
    .map(([key, folderId]) => ({
      key,
      folderId,
      name: formatFolderName(key),
      category: getFolderCategory(key),
      isConfigured: true
    }));
};

// FIXED: Get missing folder configurations
export const getMissingFolderConfigurations = () => {
  return Object.entries(FOLDER_IDS)
    .filter(([key, folderId]) => !folderId) // Only include missing folders
    .map(([key]) => ({
      key,
      name: formatFolderName(key),
      category: getFolderCategory(key),
      isConfigured: false,
      envVar: `REACT_APP_DRIVE_${key}`
    }));
};

// FIXED: Format folder name for display
export const formatFolderName = (folderKey) => {
  return folderKey
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// FIXED: Get folder category from key
export const getFolderCategory = (folderKey) => {
  const categoryMap = {
    'DAX_TRAVELER_PHOTOS': 'travel',
    'GODS_VESSEL_PHOTOS': 'faith',
    'TIMEZONE_TRAVELERS_PHOTOS': 'timezone',
    'SATIATED_TASTE_PHOTOS': 'food',
    'DAX_HOMEPAGE_PHOTOS': 'collective',
    'ANI_DAX_PHOTOS': 'collective',
    'DAX_ANALYTICS_IMAGES': 'analytics',
    'TSHIRT_DESIGNS': 'design',
    'LOGO_ASSETS': 'design',
    'BRAND_ASSETS': 'design',
    'YOUTUBE_THUMBNAILS': 'content',
    'SOCIAL_MEDIA_ASSETS': 'content',
    'BLOG_IMAGES': 'content',
    'BACKUP_PHOTOS': 'backup',
    'ARCHIVE_PHOTOS': 'backup'
  };
  
  return categoryMap[folderKey] || 'collective';
};

// FIXED: Validate folder configuration
export const validateFolderConfiguration = () => {
  const configured = getAllConfiguredFolders();
  const missing = getMissingFolderConfigurations();
  const total = Object.keys(FOLDER_IDS).length;
  
  // Check for essential folders
  const essentialFolders = [
    'DAX_TRAVELER_PHOTOS',
    'DAX_HOMEPAGE_PHOTOS'
  ];
  
  const missingEssential = essentialFolders.filter(key => !FOLDER_IDS[key]);
  
  return {
    isValid: configured.length > 0 && missingEssential.length === 0,
    isComplete: missing.length === 0,
    configured: configured.length,
    missing: missing.length,
    total,
    completionPercentage: Math.round((configured.length / total) * 100),
    essentialConfigured: essentialFolders.length - missingEssential.length,
    essentialTotal: essentialFolders.length,
    missingEssential,
    configuredFolders: configured,
    missingFolders: missing
  };
};

// FIXED: Get folder suggestions based on content type
export const getFolderSuggestions = (contentType, tags = []) => {
  const suggestions = [];
  
  // Primary suggestion based on content type
  const primaryFolder = getFolderIdByCategory(contentType);
  if (primaryFolder) {
    suggestions.push({
      folderId: primaryFolder,
      folderKey: getFolderKeyByCategory(contentType),
      reason: `Primary folder for ${contentType} content`,
      confidence: 'high'
    });
  }
  
  // Secondary suggestions based on tags
  tags.forEach(tag => {
    const tagFolder = getFolderIdByTags(tag);
    if (tagFolder && tagFolder !== primaryFolder) {
      suggestions.push({
        folderId: tagFolder,
        folderKey: Object.keys(FOLDER_IDS).find(key => FOLDER_IDS[key] === tagFolder),
        reason: `Matches tag: ${tag}`,
        confidence: 'medium'
      });
    }
  });
  
  // Fallback suggestion
  if (suggestions.length === 0) {
    const fallbackFolder = FOLDER_IDS.DAX_HOMEPAGE_PHOTOS || FOLDER_IDS.DAX_TRAVELER_PHOTOS;
    if (fallbackFolder) {
      suggestions.push({
        folderId: fallbackFolder,
        folderKey: 'DAX_HOMEPAGE_PHOTOS',
        reason: 'Default fallback folder',
        confidence: 'low'
      });
    }
  }
  
  return suggestions;
};

// FIXED: Get brand-specific folders
export const getBrandFolders = (brandKey) => {
  const brandFolderMap = {
    'dax-traveler': ['DAX_TRAVELER_PHOTOS'],
    'gods-vessel': ['GODS_VESSEL_PHOTOS'],
    'timezone-travelers': ['TIMEZONE_TRAVELERS_PHOTOS'],
    'satiated-taste': ['SATIATED_TASTE_PHOTOS'],
    'ani-dax': ['ANI_DAX_PHOTOS'],
    'dax-collective': ['DAX_HOMEPAGE_PHOTOS', 'DAX_ANALYTICS_IMAGES']
  };
  
  const folderKeys = brandFolderMap[brandKey] || ['DAX_HOMEPAGE_PHOTOS'];
  
  return folderKeys.map(key => ({
    key,
    folderId: FOLDER_IDS[key],
    name: formatFolderName(key),
    isConfigured: !!FOLDER_IDS[key]
  })).filter(folder => folder.isConfigured);
};

// FIXED: Search folders by name or category
export const searchFolders = (query) => {
  if (!query) return getAllConfiguredFolders();
  
  const queryLower = query.toLowerCase();
  
  return getAllConfiguredFolders().filter(folder => 
    folder.name.toLowerCase().includes(queryLower) ||
    folder.category.toLowerCase().includes(queryLower) ||
    folder.key.toLowerCase().includes(queryLower)
  );
};

// FIXED: Get folder usage statistics (placeholder for future implementation)
export const getFolderUsageStats = async () => {
  // This would integrate with your Drive API to get actual usage stats
  return {
    totalFolders: Object.keys(FOLDER_IDS).length,
    configuredFolders: getAllConfiguredFolders().length,
    missingFolders: getMissingFolderConfigurations().length,
    lastUpdated: new Date().toISOString(),
    // Placeholder stats - would be populated by actual API calls
    folderStats: getAllConfiguredFolders().map(folder => ({
      ...folder,
      fileCount: 0,
      totalSize: 0,
      lastModified: null
    }))
  };
};

// Export default object with all functions
export default {
  FOLDER_IDS,
  CATEGORY_FOLDER_MAPPING,
  getFolderIdByTags,
  getFolderKeyByCategory,
  getFolderIdByCategory,
  getAllConfiguredFolders,
  getMissingFolderConfigurations,
  formatFolderName,
  getFolderCategory,
  validateFolderConfiguration,
  getFolderSuggestions,
  getBrandFolders,
  searchFolders,
  getFolderUsageStats
};

