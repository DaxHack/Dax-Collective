// src/services/sheetsApi.js
// CORRECTED VERSION - Copy this to replace your existing sheetsApi.js

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

// FIXED: Sheet ID mappings from environment variables with proper fallbacks
export const SHEET_IDS = {
  DAX_TRAVELER_BLOGS: process.env.REACT_APP_SHEET_DAX_TRAVELER_BLOGS || "",
  BRAND_ANALYTICS_DASHBOARD: process.env.REACT_APP_SHEET_BRAND_ANALYTICS_DASHBOARD || "",
  TIMEZONE_TRAVELERS_BLOGS_ITINERARIES: process.env.REACT_APP_SHEET_TIMEZONE_TRAVELERS_BLOGS_ITINERARIES || "",
  GODS_VESSEL_DISCUSSIONS: process.env.REACT_APP_SHEET_GODS_VESSEL_DISCUSSIONS || "",
  TSHIRT_DESIGNS_CANVA_BULK: process.env.REACT_APP_SHEET_TSHIRT_DESIGNS_CANVA_BULK || "",
  GODS_VESSEL_QUOTES: process.env.REACT_APP_SHEET_GODS_VESSEL_QUOTES || "",
  SOCIAL_TRACKING_YOUTUBE: process.env.REACT_APP_SHEET_SOCIAL_TRACKING_YOUTUBE || "",
  SOCIAL_TRACKING_INSTAGRAM: process.env.REACT_APP_SHEET_SOCIAL_TRACKING_INSTAGRAM || "",
  SOCIAL_TRACKING_TIKTOK: process.env.REACT_APP_SHEET_SOCIAL_TRACKING_TIKTOK || "",
  SOCIAL_TRACKING_TWITTER: process.env.REACT_APP_SHEET_SOCIAL_TRACKING_TWITTER || "",
  SOCIAL_TRACKING_FACEBOOK: process.env.REACT_APP_SHEET_SOCIAL_TRACKING_FACEBOOK || "",
  SATIATED_TASTE_RECIPES: process.env.REACT_APP_SHEET_SATIATED_TASTE_RECIPES || ""
};

/**
 * Fetches data from a Google Sheets spreadsheet
 * @param {string} spreadsheetId - The Google Sheets spreadsheet ID
 * @param {string} range - The range to fetch (e.g., 'Sheet1!A1:Z100')
 * @param {string} valueRenderOption - How to render values ('FORMATTED_VALUE', 'UNFORMATTED_VALUE', 'FORMULA')
 * @returns {Promise<Array>} Array of rows
 */
export async function fetchSheetData(spreadsheetId, range = 'Sheet1!A1:Z1000', valueRenderOption = 'FORMATTED_VALUE') {
  if (!spreadsheetId) {
    throw new Error('Spreadsheet ID is required');
  }

  if (!GOOGLE_API_KEY) {
    throw new Error('Google API key is not configured. Please set REACT_APP_GOOGLE_API_KEY in your environment variables.');
  }

  try {
    const url = `${SHEETS_API_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${GOOGLE_API_KEY}&valueRenderOption=${valueRenderOption}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Spreadsheet not found. Please check the spreadsheet ID and ensure it is publicly accessible.');
      } else if (response.status === 403) {
        throw new Error('Access denied. Please ensure the spreadsheet is publicly accessible or check your API key.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to fetch spreadsheet: ${errorData.error?.message || response.statusText}`);
      }
    }

    const data = await response.json();
    
    if (!data.values || data.values.length === 0) {
      console.warn('No data found in the specified range');
      return [];
    }

    return data.values;

  } catch (error) {
    console.error('Sheets API Error:', error);
    throw error;
  }
}

/**
 * Fetches data from a specific brand sheet
 * @param {string} sheetKey - Key from SHEET_IDS object
 * @param {string} range - The range to fetch
 * @returns {Promise<Array>} Array of rows
 */
export async function fetchBrandSheetData(sheetKey, range = 'Sheet1!A1:Z1000') {
  const spreadsheetId = SHEET_IDS[sheetKey];
  
  if (!spreadsheetId) {
    throw new Error(`Spreadsheet ID not found for sheet: ${sheetKey}. Please check your environment variables.`);
  }

  return fetchSheetData(spreadsheetId, range);
}

/**
 * Converts sheet data to objects using first row as headers
 * @param {Array} sheetData - Raw sheet data from fetchSheetData
 * @param {boolean} skipEmptyRows - Whether to skip rows with all empty values
 * @returns {Array} Array of objects with header keys
 */
export function convertSheetToObjects(sheetData, skipEmptyRows = true) {
  if (!sheetData || sheetData.length === 0) {
    return [];
  }

  const [headers, ...rows] = sheetData;
  
  if (!headers || headers.length === 0) {
    return [];
  }

  return rows
    .map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    })
    .filter(obj => {
      if (!skipEmptyRows) return true;
      return Object.values(obj).some(value => value && value.toString().trim() !== '');
    });
}

/**
 * Fetches blog posts from Dax Traveler blogs sheet
 * @param {number} limit - Maximum number of posts to return
 * @returns {Promise<Array>} Array of blog post objects
 */
export async function fetchDaxTravelerBlogs(limit = 10) {
  try {
    const sheetData = await fetchBrandSheetData('DAX_TRAVELER_BLOGS');
    const blogs = convertSheetToObjects(sheetData);
    
    return blogs
      .filter(blog => blog.published === 'TRUE' || blog.published === 'true' || blog.published === '1')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
      .map(blog => ({
        id: blog.id || `blog-${Date.now()}-${Math.random()}`,
        title: blog.title || 'Untitled',
        excerpt: blog.excerpt || blog.description || '',
        content: blog.content || '',
        date: blog.date || new Date().toISOString(),
        author: blog.author || 'Dax',
        tags: blog.tags ? blog.tags.split(',').map(tag => tag.trim()) : [],
        featured: blog.featured === 'TRUE' || blog.featured === 'true' || blog.featured === '1',
        imageUrl: blog.imageUrl || blog.image || '',
        slug: blog.slug || blog.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
        location: blog.location || '',
        videoUrl: blog.videoUrl || blog.youtube_url || ''
      }));
  } catch (error) {
    console.error('Error fetching Dax Traveler blogs:', error);
    return [];
  }
}

/**
 * Fetches travel itineraries from Timezone Travelers sheet
 * @param {number} limit - Maximum number of itineraries to return
 * @returns {Promise<Array>} Array of itinerary objects
 */
export async function fetchTimezoneItineraries(limit = 10) {
  try {
    const sheetData = await fetchBrandSheetData('TIMEZONE_TRAVELERS_BLOGS_ITINERARIES');
    const itineraries = convertSheetToObjects(sheetData);
    
    return itineraries
      .filter(item => item.published === 'TRUE' || item.published === 'true' || item.published === '1')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
      .map(item => ({
        id: item.id || `itinerary-${Date.now()}-${Math.random()}`,
        title: item.title || 'Untitled Itinerary',
        destination: item.destination || '',
        duration: item.duration || '',
        budget: item.budget || '',
        highlights: item.highlights ? item.highlights.split(',').map(h => h.trim()) : [],
        description: item.description || '',
        date: item.date || new Date().toISOString(),
        difficulty: item.difficulty || 'Medium',
        category: item.category || 'General',
        imageUrl: item.imageUrl || item.image || '',
        slug: item.slug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
        bestTimeToVisit: item.bestTimeToVisit || '',
        transportation: item.transportation || ''
      }));
  } catch (error) {
    console.error('Error fetching Timezone Travelers itineraries:', error);
    return [];
  }
}

/**
 * Fetches God's Vessel quotes
 * @param {number} limit - Maximum number of quotes to return
 * @returns {Promise<Array>} Array of quote objects
 */
export async function fetchGodsVesselQuotes(limit = 20) {
  try {
    const sheetData = await fetchBrandSheetData('GODS_VESSEL_QUOTES');
    const quotes = convertSheetToObjects(sheetData);
    
    return quotes
      .filter(quote => quote.active === 'TRUE' || quote.active === 'true' || quote.active === '1')
      .slice(0, limit)
      .map(quote => ({
        id: quote.id || `quote-${Date.now()}-${Math.random()}`,
        text: quote.text || quote.quote || '',
        reference: quote.reference || quote.verse || '',
        category: quote.category || 'Faith',
        author: quote.author || '',
        featured: quote.featured === 'TRUE' || quote.featured === 'true' || quote.featured === '1',
        book: quote.book || '',
        chapter: quote.chapter || '',
        verse: quote.verse || ''
      }));
  } catch (error) {
    console.error('Error fetching God\'s Vessel quotes:', error);
    return [];
  }
}

/**
 * Fetches Satiated Taste recipes
 * @param {number} limit - Maximum number of recipes to return
 * @returns {Promise<Array>} Array of recipe objects
 */
export async function fetchSatiatedTasteRecipes(limit = 10) {
  try {
    const sheetData = await fetchBrandSheetData('SATIATED_TASTE_RECIPES');
    const recipes = convertSheetToObjects(sheetData);
    
    return recipes
      .filter(recipe => recipe.published === 'TRUE' || recipe.published === 'true' || recipe.published === '1')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
      .map(recipe => ({
        id: recipe.id || `recipe-${Date.now()}-${Math.random()}`,
        title: recipe.title || 'Untitled Recipe',
        description: recipe.description || '',
        ingredients: recipe.ingredients ? recipe.ingredients.split(',').map(i => i.trim()) : [],
        instructions: recipe.instructions || '',
        prepTime: recipe.prepTime || '',
        cookTime: recipe.cookTime || '',
        servings: recipe.servings || '',
        difficulty: recipe.difficulty || 'Medium',
        cuisine: recipe.cuisine || '',
        imageUrl: recipe.imageUrl || recipe.image || '',
        videoUrl: recipe.videoUrl || '',
        tags: recipe.tags ? recipe.tags.split(',').map(tag => tag.trim()) : [],
        date: recipe.date || new Date().toISOString()
      }));
  } catch (error) {
    console.error('Error fetching Satiated Taste recipes:', error);
    return [];
  }
}

/**
 * Fetches analytics data from the brand dashboard
 * @returns {Promise<Object>} Analytics data object
 */
export async function fetchBrandAnalytics() {
  try {
    const sheetData = await fetchBrandSheetData('BRAND_ANALYTICS_DASHBOARD');
    const analytics = convertSheetToObjects(sheetData);
    
    // Process analytics data into a structured format
    const processedData = {
      overview: {},
      brands: {},
      metrics: [],
      lastUpdated: new Date().toISOString()
    };

    analytics.forEach(row => {
      if (row.type === 'overview') {
        processedData.overview[row.metric] = {
          value: row.value,
          change: row.change || '',
          period: row.period || 'monthly'
        };
      } else if (row.type === 'brand') {
        if (!processedData.brands[row.brand]) {
          processedData.brands[row.brand] = {};
        }
        processedData.brands[row.brand][row.metric] = {
          value: row.value,
          change: row.change || '',
          period: row.period || 'monthly'
        };
      } else {
        processedData.metrics.push({
          ...row,
          timestamp: row.timestamp || new Date().toISOString()
        });
      }
    });

    return processedData;
  } catch (error) {
    console.error('Error fetching brand analytics:', error);
    return { 
      overview: {}, 
      brands: {}, 
      metrics: [], 
      lastUpdated: new Date().toISOString(),
      error: error.message 
    };
  }
}

/**
 * Fetches social media tracking data
 * @param {string} platform - Platform name (youtube, instagram, tiktok, twitter, facebook)
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>} Array of social media tracking objects
 */
export async function fetchSocialTrackingData(platform, limit = 50) {
  try {
    const sheetKey = `SOCIAL_TRACKING_${platform.toUpperCase()}`;
    const sheetData = await fetchBrandSheetData(sheetKey);
    const trackingData = convertSheetToObjects(sheetData);
    
    return trackingData
      .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date))
      .slice(0, limit)
      .map(item => ({
        id: item.id || `${platform}-${Date.now()}-${Math.random()}`,
        platform: platform,
        brand: item.brand || '',
        action: item.action || '',
        content: item.content || '',
        metrics: {
          views: parseInt(item.views || 0),
          likes: parseInt(item.likes || 0),
          comments: parseInt(item.comments || 0),
          shares: parseInt(item.shares || 0),
          engagement: parseFloat(item.engagement || 0)
        },
        timestamp: item.timestamp || item.date || new Date().toISOString(),
        url: item.url || '',
        status: item.status || 'active'
      }));
  } catch (error) {
    console.error(`Error fetching ${platform} tracking data:`, error);
    return [];
  }
}

/**
 * Validates a Google Sheets spreadsheet ID format
 * @param {string} spreadsheetId - The spreadsheet ID to validate
 * @returns {boolean} Whether the spreadsheet ID appears valid
 */
export function isValidSpreadsheetId(spreadsheetId) {
  if (!spreadsheetId || typeof spreadsheetId !== 'string') {
    return false;
  }
  
  // Google Sheets IDs are typically 44 characters long
  const spreadsheetIdPattern = /^[a-zA-Z0-9_-]{40,50}$/;
  return spreadsheetIdPattern.test(spreadsheetId);
}

/**
 * Get all configured sheet IDs with validation
 * @returns {Object} Object with sheet IDs and their validation status
 */
export function validateAllSheetIds() {
  const validation = {};
  
  Object.entries(SHEET_IDS).forEach(([key, sheetId]) => {
    validation[key] = {
      sheetId,
      isValid: isValidSpreadsheetId(sheetId),
      isConfigured: !!sheetId
    };
  });
  
  const configuredCount = Object.values(validation).filter(v => v.isConfigured).length;
  const validCount = Object.values(validation).filter(v => v.isValid).length;
  
  return {
    sheets: validation,
    summary: {
      total: Object.keys(SHEET_IDS).length,
      configured: configuredCount,
      valid: validCount,
      isFullyConfigured: configuredCount === Object.keys(SHEET_IDS).length,
      hasApiKey: !!GOOGLE_API_KEY
    }
  };
}

/**
 * Append data to a Google Sheet (requires backend API)
 * @param {string} spreadsheetId - The spreadsheet ID
 * @param {Array} values - Array of values to append
 * @param {string} range - Range to append to (e.g., 'Sheet1!A:Z')
 * @returns {Promise<Object>} Append result
 */
export async function appendToSheet(spreadsheetId, values, range = 'Sheet1!A:Z') {
  // This would require backend implementation with service account
  console.warn('appendToSheet requires backend implementation with service account credentials');
  return {
    success: false,
    message: 'Append functionality requires backend implementation'
  };
}

// Export sheet IDs for direct access
export { SHEET_IDS as default };

// Export all functions for easy importing
export const sheetsApi = {
  fetchSheetData,
  fetchBrandSheetData,
  convertSheetToObjects,
  fetchDaxTravelerBlogs,
  fetchTimezoneItineraries,
  fetchGodsVesselQuotes,
  fetchSatiatedTasteRecipes,
  fetchBrandAnalytics,
  fetchSocialTrackingData,
  isValidSpreadsheetId,
  validateAllSheetIds,
  appendToSheet,
  SHEET_IDS
};

