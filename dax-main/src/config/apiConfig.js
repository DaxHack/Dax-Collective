// src/config/apiConfig.js
// CORRECTED VERSION - Copy this to replace your existing apiConfig.js

// FIXED: API Base URL configuration with proper fallbacks
export const API_BASE = process.env.REACT_APP_API_BASE_URL || 
                       process.env.REACT_APP_FIREBASE_FUNCTIONS_URL || 
                       'http://localhost:5001/dax-collective/us-central1';

// FIXED: Firebase configuration with all required fields
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "dax-collective.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "dax-collective",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "dax-collective.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || ""
};

// FIXED: Google APIs configuration
export const googleConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
  driveApiKey: process.env.REACT_APP_GOOGLE_DRIVE_API_KEY || process.env.REACT_APP_GOOGLE_API_KEY || "",
  sheetsApiKey: process.env.REACT_APP_GOOGLE_SHEETS_API_KEY || process.env.REACT_APP_GOOGLE_API_KEY || "",
  youtubeApiKey: process.env.REACT_APP_YOUTUBE_API_KEY || process.env.REACT_APP_GOOGLE_API_KEY || ""
};

// FIXED: YouTube channels configuration
export const youtubeChannels = {
  daxTraveler: {
    channelId: process.env.REACT_APP_YOUTUBE_CHANNEL_ID_DAX_TRAVELER || "UCuN9RFxD1_PUOci_AEa5DMQ",
    name: "Dax the Traveler",
    category: "travel",
    enabled: true
  },
  timezoneTravel: {
    channelId: process.env.REACT_APP_YOUTUBE_CHANNEL_ID_TIMEZONE_TRAVELERS || "UCKan3hAUmcy0Q49d7MIXhdA",
    name: "Timezone Travelers",
    category: "productivity",
    enabled: true
  },
  satiatedTaste: {
    channelId: process.env.REACT_APP_YOUTUBE_CHANNEL_ID_SATIATED_TASTE || "UCmlTPphxXdZ3T2gDQ_kPZQQ",
    name: "Satiated Taste",
    category: "food",
    enabled: true
  },
  godsVessel: {
    channelId: process.env.REACT_APP_YOUTUBE_CHANNEL_ID_GODS_VESSEL || "UCAzuegEphw7oQRarESOjuqA",
    name: "God's Vessel",
    category: "faith",
    enabled: true
  }
};

// FIXED: External APIs configuration
export const externalApis = {
  unsplash: {
    accessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY || "",
    baseUrl: "https://api.unsplash.com",
    enabled: !!process.env.REACT_APP_UNSPLASH_ACCESS_KEY
  },
  pexels: {
    apiKey: process.env.REACT_APP_PEXELS_API_KEY || "",
    baseUrl: "https://api.pexels.com/v1",
    enabled: !!process.env.REACT_APP_PEXELS_API_KEY
  },
  pixabay: {
    apiKey: process.env.REACT_APP_PIXABAY_API_KEY || "",
    baseUrl: "https://pixabay.com/api",
    enabled: !!process.env.REACT_APP_PIXABAY_API_KEY
  },
  openai: {
    apiKey: process.env.REACT_APP_OPENAI_API_KEY || "",
    baseUrl: "https://api.openai.com/v1",
    enabled: !!process.env.REACT_APP_OPENAI_API_KEY
  }
};

// FIXED: N8N automation configuration
export const n8nConfig = {
  baseUrl: process.env.REACT_APP_N8N_WEBHOOK_URL || "http://localhost:5678",
  apiKey: process.env.REACT_APP_N8N_API_KEY || "",
  enabled: !!process.env.REACT_APP_N8N_WEBHOOK_URL,
  webhooks: {
    contentGeneration: process.env.REACT_APP_N8N_WEBHOOK_CONTENT_GENERATION || "",
    socialDistribution: process.env.REACT_APP_N8N_WEBHOOK_SOCIAL_DISTRIBUTION || "",
    youtubeSync: process.env.REACT_APP_N8N_WEBHOOK_YOUTUBE_SYNC || "",
    revenueOptimization: process.env.REACT_APP_N8N_WEBHOOK_REVENUE_OPTIMIZATION || ""
  }
};

// FIXED: Analytics configuration
export const analyticsConfig = {
  googleAnalytics: {
    measurementId: process.env.REACT_APP_GA_MEASUREMENT_ID || "G-KVXQJ21CZW",
    enabled: !!process.env.REACT_APP_GA_MEASUREMENT_ID
  },
  mixpanel: {
    token: process.env.REACT_APP_MIXPANEL_TOKEN || "",
    enabled: !!process.env.REACT_APP_MIXPANEL_TOKEN
  },
  hotjar: {
    siteId: process.env.REACT_APP_HOTJAR_SITE_ID || "",
    enabled: !!process.env.REACT_APP_HOTJAR_SITE_ID
  }
};

// FIXED: Social media configuration
export const socialConfig = {
  reddit: {
    clientId: process.env.REACT_APP_REDDIT_CLIENT_ID || "",
    enabled: !!process.env.REACT_APP_REDDIT_CLIENT_ID,
    subreddits: {
      daxTraveler: (process.env.REACT_APP_REDDIT_SUBREDDIT_DAX_TRAVELER || "").split(",").filter(Boolean),
      timezoneTravel: (process.env.REACT_APP_REDDIT_SUBREDDIT_TIMEZONE_TRAVELERS || "").split(",").filter(Boolean),
      satiatedTaste: (process.env.REACT_APP_REDDIT_SUBREDDIT_SATIATED_TASTE || "").split(",").filter(Boolean),
      godsVessel: (process.env.REACT_APP_REDDIT_SUBREDDIT_GODS_VESSEL || "").split(",").filter(Boolean)
    }
  },
  twitter: {
    apiKey: process.env.REACT_APP_TWITTER_API_KEY || "",
    enabled: !!process.env.REACT_APP_TWITTER_API_KEY
  },
  instagram: {
    accessToken: process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN || "",
    enabled: !!process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN
  }
};

// FIXED: Email configuration
export const emailConfig = {
  main: process.env.REACT_APP_EMAIL_MAIN || "",
  daxTraveler: process.env.REACT_APP_EMAIL_DAX_TRAVELER || process.env.REACT_APP_EMAIL_MAIN || "",
  timezoneTravel: process.env.REACT_APP_EMAIL_TIMEZONE_TRAVELERS || process.env.REACT_APP_EMAIL_MAIN || "",
  satiatedTaste: process.env.REACT_APP_EMAIL_SATIATED_TASTE || process.env.REACT_APP_EMAIL_MAIN || "",
  godsVessel: process.env.REACT_APP_EMAIL_GODS_VESSEL || process.env.REACT_APP_EMAIL_MAIN || "",
  support: process.env.REACT_APP_EMAIL_SUPPORT || process.env.REACT_APP_EMAIL_MAIN || "",
  business: process.env.REACT_APP_EMAIL_BUSINESS || process.env.REACT_APP_EMAIL_MAIN || ""
};

// FIXED: Voice/AI configuration
export const voiceConfig = {
  daxTraveler: process.env.REACT_APP_VOICE_ID_DAX_TRAVELER || "",
  timezoneTravel: process.env.REACT_APP_VOICE_ID_TIMEZONE_TRAVELERS || "",
  satiatedTaste: process.env.REACT_APP_VOICE_ID_SATIATED_TASTE || "",
  godsVessel: process.env.REACT_APP_VOICE_ID_GODS_VESSEL || "",
  elevenlabs: {
    apiKey: process.env.REACT_APP_ELEVENLABS_API_KEY || "",
    enabled: !!process.env.REACT_APP_ELEVENLABS_API_KEY
  }
};

// FIXED: Development/Environment configuration
export const envConfig = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),
  enableDebugLogs: process.env.REACT_APP_ENABLE_DEBUG_LOGS === 'true',
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS !== 'false', // Default to true
  enableServiceWorker: process.env.REACT_APP_ENABLE_SERVICE_WORKER !== 'false' // Default to true
};

// FIXED: API endpoints configuration
export const apiEndpoints = {
  // Firebase Functions
  drive: `${API_BASE}/api/drive`,
  driveImages: `${API_BASE}/api/drive/images`,
  driveUpload: `${API_BASE}/api/drive/upload`,
  sheets: `${API_BASE}/api/sheets`,
  youtube: `${API_BASE}/api/youtube`,
  analytics: `${API_BASE}/api/analytics`,
  
  // External APIs
  unsplashSearch: `${externalApis.unsplash.baseUrl}/search/photos`,
  pexelsSearch: `${externalApis.pexels.baseUrl}/search`,
  pixabaySearch: `${externalApis.pixabay.baseUrl}/`,
  
  // Google APIs
  googleSheets: "https://sheets.googleapis.com/v4/spreadsheets",
  googleDrive: "https://www.googleapis.com/drive/v3",
  youtubeApi: "https://www.googleapis.com/youtube/v3"
};

// FIXED: Validation functions
export const validateConfig = () => {
  const validation = {
    firebase: {
      isValid: !!(firebaseConfig.apiKey && firebaseConfig.projectId),
      missing: []
    },
    google: {
      isValid: !!googleConfig.apiKey,
      missing: []
    },
    youtube: {
      isValid: !!googleConfig.youtubeApiKey,
      channels: Object.values(youtubeChannels).filter(ch => ch.enabled && ch.channelId).length
    },
    external: {
      unsplash: externalApis.unsplash.enabled,
      pexels: externalApis.pexels.enabled,
      pixabay: externalApis.pixabay.enabled,
      openai: externalApis.openai.enabled
    },
    n8n: {
      isValid: n8nConfig.enabled,
      webhooksConfigured: Object.values(n8nConfig.webhooks).filter(Boolean).length
    },
    analytics: {
      googleAnalytics: analyticsConfig.googleAnalytics.enabled,
      mixpanel: analyticsConfig.mixpanel.enabled,
      hotjar: analyticsConfig.hotjar.enabled
    }
  };

  // Check for missing Firebase config
  Object.entries(firebaseConfig).forEach(([key, value]) => {
    if (!value && key !== 'measurementId') { // measurementId is optional
      validation.firebase.missing.push(key);
    }
  });

  // Check for missing Google config
  if (!googleConfig.apiKey) validation.google.missing.push('apiKey');
  if (!googleConfig.clientId) validation.google.missing.push('clientId');

  return validation;
};

// FIXED: Get configuration summary
export const getConfigSummary = () => {
  const validation = validateConfig();
  
  return {
    environment: process.env.NODE_ENV,
    apiBase: API_BASE,
    firebase: {
      projectId: firebaseConfig.projectId,
      isConfigured: validation.firebase.isValid
    },
    google: {
      hasApiKey: !!googleConfig.apiKey,
      hasClientId: !!googleConfig.clientId
    },
    youtube: {
      hasApiKey: !!googleConfig.youtubeApiKey,
      channelsConfigured: validation.youtube.channels
    },
    externalApis: {
      unsplash: externalApis.unsplash.enabled,
      pexels: externalApis.pexels.enabled,
      pixabay: externalApis.pixabay.enabled,
      openai: externalApis.openai.enabled
    },
    automation: {
      n8nEnabled: n8nConfig.enabled,
      webhooksConfigured: validation.n8n.webhooksConfigured
    },
    analytics: {
      googleAnalytics: analyticsConfig.googleAnalytics.enabled,
      mixpanel: analyticsConfig.mixpanel.enabled,
      hotjar: analyticsConfig.hotjar.enabled
    },
    lastValidated: new Date().toISOString()
  };
};

// FIXED: Export default configuration object
export default {
  API_BASE,
  firebaseConfig,
  googleConfig,
  youtubeChannels,
  externalApis,
  n8nConfig,
  analyticsConfig,
  socialConfig,
  emailConfig,
  voiceConfig,
  envConfig,
  apiEndpoints,
  validateConfig,
  getConfigSummary
};

