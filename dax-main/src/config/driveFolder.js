// src/config/driveFolder.js
// Brand folder mapping that matches your .env exactly
export const BRAND_FOLDER_IDS = {
  "DaxTheTraveler": process.env.REACT_APP_DRIVE_DAX_TRAVELER_PHOTOS,
  "GodsVessel": process.env.REACT_APP_DRIVE_GODS_VESSEL_PHOTOS,
  "AniDax": process.env.REACT_APP_DRIVE_ANI_DAX_PHOTOS,
  "TimeZoneTravelers": process.env.REACT_APP_DRIVE_TIMEZONE_TRAVELERS_PHOTOS,
  "DaxHomepage": process.env.REACT_APP_DRIVE_DAX_HOMEPAGE_PHOTOS,
  "DaxAnalytics": process.env.REACT_APP_DRIVE_DAX_ANALYTICS_IMAGES
};

// Tag-based folder routing (matches your brand structure)
export const TAG_TO_FOLDER_MAP = {
  // Travel-related tags
  "travel": "DaxTheTraveler",
  "adventure": "DaxTheTraveler", 
  "backpacking": "DaxTheTraveler",
  "dax": "DaxTheTraveler",
  "traveler": "DaxTheTraveler",
  
  // Faith-related tags
  "faith": "GodsVessel",
  "god": "GodsVessel",
  "vessel": "GodsVessel",
  "christian": "GodsVessel",
  "spirituality": "GodsVessel",
  
  // Anime-related tags
  "anime": "AniDax",
  "ani": "AniDax",
  "manga": "AniDax",
  "otaku": "AniDax",
  
  // Productivity-related tags
  "productivity": "TimeZoneTravelers",
  "timezone": "TimeZoneTravelers",
  "time": "TimeZoneTravelers",
  "guide": "TimeZoneTravelers",
  "tips": "TimeZoneTravelers",
  
  // Homepage/general
  "homepage": "DaxHomepage",
  "hero": "DaxHomepage",
  "main": "DaxHomepage",
  
  // Analytics/charts
  "analytics": "DaxAnalytics",
  "chart": "DaxAnalytics",
  "data": "DaxAnalytics",
  "stats": "DaxAnalytics"
};

// Get folder ID by brand name
export const getFolderIdByBrand = (brandName) => {
  return BRAND_FOLDER_IDS[brandName];
};

// Get folder ID by tags (smart routing)
export const getFolderIdByTags = (tags) => {
  if (!tags) return null;
  
  const tagArray = tags.toLowerCase().split(/[,\s]+/).filter(Boolean);
  
  for (const tag of tagArray) {
    const brandName = TAG_TO_FOLDER_MAP[tag];
    if (brandName && BRAND_FOLDER_IDS[brandName]) {
      return BRAND_FOLDER_IDS[brandName];
    }
  }
  
  // Default to homepage if no match
  return BRAND_FOLDER_IDS.DaxHomepage;
};

// Enhanced validation function
export const validateFolderIds = () => {
  const missing = [];
  const configured = [];
  
  Object.entries(BRAND_FOLDER_IDS).forEach(([key, value]) => {
    if (!value) {
      missing.push(key);
    } else {
      configured.push(key);
    }
  });
  
  if (missing.length > 0) {
    console.warn('⚠️  Missing folder IDs for brands:', missing);
    console.log('✅ Configured folder IDs for brands:', configured);
  } else {
    console.log('✅ All brand folder IDs are configured');
  }
  
  return missing.length === 0;
};

// Get all configured brands
export const getConfiguredBrands = () => {
  return Object.entries(BRAND_FOLDER_IDS)
    .filter(([_, folderId]) => folderId)
    .map(([brandName, _]) => brandName);
};

// Export folder IDs for direct access (matches your .env variable names)
export const FOLDER_IDS = {
  DAX_TRAVELER_PHOTOS: process.env.REACT_APP_DRIVE_DAX_TRAVELER_PHOTOS,
  GODS_VESSEL_PHOTOS: process.env.REACT_APP_DRIVE_GODS_VESSEL_PHOTOS,
  ANI_DAX_PHOTOS: process.env.REACT_APP_DRIVE_ANI_DAX_PHOTOS,
  TIMEZONE_TRAVELERS_PHOTOS: process.env.REACT_APP_DRIVE_TIMEZONE_TRAVELERS_PHOTOS,
  DAX_HOMEPAGE_PHOTOS: process.env.REACT_APP_DRIVE_DAX_HOMEPAGE_PHOTOS,
  DAX_ANALYTICS_IMAGES: process.env.REACT_APP_DRIVE_DAX_ANALYTICS_IMAGES
};
