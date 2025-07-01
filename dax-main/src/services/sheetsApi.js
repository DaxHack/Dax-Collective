// src/services/sheetsApi.js
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';
const PROJECT_ID = process.env.REACT_APP_GOOGLE_PROJECT_ID;
const PROJECT_NUMBER = process.env.REACT_APP_GOOGLE_PROJECT_NUMBER;


// Sheet ID mappings from environment variables
export const SHEET_IDS = {
  DAX_TRAVELER_BLOGS: process.env.REACT_APP_SHEET_DAX_TRAVELER_BLOGS,
  BRAND_ANALYTICS_DASHBOARD: process.env.REACT_APP_SHEET_BRAND_ANALYTICS_DASHBOARD,
  TIMEZONE_TRAVELERS_BLOGS_ITINERARIES: process.env.REACT_APP_SHEET_TIMEZONE_TRAVELERS_BLOGS_ITINERARIES,
  GODS_VESSEL_DISCUSSIONS: process.env.REACT_APP_SHEET_GODS_VESSEL_DISCUSSIONS,
  TSHIRT_DESIGNS_CANVA_BULK: process.env.REACT_APP_SHEET_TSHIRT_DESIGNS_CANVA_BULK,
  GODS_VESSEL_QUOTES: process.env.REACT_APP_SHEET_GODS_VESSEL_QUOTES,
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
        throw new Error(`Failed to fetch spreadsheet: ${response.status} ${response.statusText}`);
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
      .filter(blog => blog.published === 'TRUE' || blog.published === 'true')
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
        featured: blog.featured === 'TRUE' || blog.featured === 'true',
        imageUrl: blog.imageUrl || blog.image || '',
        slug: blog.slug || blog.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
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
      .filter(item => item.published === 'TRUE' || item.published === 'true')
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
      .filter(quote => quote.active === 'TRUE' || quote.active === 'true')
      .slice(0, limit)
      .map(quote => ({
        id: quote.id || `quote-${Date.now()}-${Math.random()}`,
        text: quote.text || quote.quote || '',
        reference: quote.reference || quote.verse || '',
        category: quote.category || 'Faith',
        author: quote.author || '',
        featured: quote.featured === 'TRUE' || quote.featured === 'true',
      }));
  } catch (error) {
    console.error('Error fetching God\'s Vessel quotes:', error);
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
    };

    analytics.forEach(row => {
      if (row.type === 'overview') {
        processedData.overview[row.metric] = row.value;
      } else if (row.type === 'brand') {
        if (!processedData.brands[row.brand]) {
          processedData.brands[row.brand] = {};
        }
        processedData.brands[row.brand][row.metric] = row.value;
      } else {
        processedData.metrics.push(row);
      }
    });

    return processedData;
  } catch (error) {
    console.error('Error fetching brand analytics:', error);
    return { overview: {}, brands: {}, metrics: [] };
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
  
  return validation;
}

// Export sheet IDs for direct access
export { SHEET_IDS as default };
