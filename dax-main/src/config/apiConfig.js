// src/config/apiConfig.js
export const API_CONFIG = {
  googleApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  driveApiBase: 'https://www.googleapis.com/drive/v3',
  youtubeApiBase: 'https://www.googleapis.com/youtube/v3',
  backendUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'
};

// Enhanced validation with better error messages
export const validateApiConfig = () => {
  const missing = [];
  
  if (!API_CONFIG.googleApiKey) {
    missing.push('REACT_APP_GOOGLE_API_KEY');
  }
  
  if (!API_CONFIG.backendUrl) {
    missing.push('REACT_APP_API_BASE_URL');
  }
  
  if (missing.length > 0) {
    throw new Error(`
      Missing required environment variables: ${missing.join(', ')}
      Please check your .env file and ensure these are set:
      ${missing.map(key => `${key}=your_value_here`).join('\n')}
    `);
  }
  
  return true;
};

// Export individual config values that match your .env structure
export const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
export const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
export const FRONTEND_URL = process.env.REACT_APP_SITE_URL || 'http://localhost:3000';
export const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
