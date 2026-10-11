// dax-backend/index.js
// CORRECTED VERSION - Copy this to replace your existing Firebase Functions index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const { google } = require('googleapis');

// Initialize Firebase Admin
admin.initializeApp();

// Server-side automation with service account
exports.processContent = functions.firestore
  .document('content/{id}')
  .onCreate(async (snap, context) => {
    // Automated processing without user interaction
  });


// FIXED: Get configuration from Firebase Functions config
const config = functions.config();

// FIXED: API Keys and Configuration
const YOUTUBE_API_KEY = config.youtube?.api_key;
const GOOGLE_API_KEY = config.google?.api_key;
const GOOGLE_CLIENT_ID = config.google?.client_id;

// FIXED: Drive Folder IDs from config
const DRIVE_FOLDERS = {
  DAX_TRAVELER_PHOTOS: config.drive?.dax_traveler_photos,
  GODS_VESSEL_PHOTOS: config.drive?.gods_vessel_photos,
  ANI_DAX_PHOTOS: config.drive?.ani_dax_photos,
  TIMEZONE_TRAVELERS_PHOTOS: config.drive?.timezone_travelers_photos,
  DAX_HOMEPAGE_PHOTOS: config.drive?.dax_homepage_photos,
  DAX_ANALYTICS_IMAGES: config.drive?.dax_analytics_images
};

// FIXED: Google Sheets IDs from config
const SHEETS = {
  // Social Tracking
  SOCIAL_TRACKING_YOUTUBE: config.sheets?.social_tracking_youtube,
  SOCIAL_TRACKING_INSTAGRAM: config.sheets?.social_tracking_instagram,
  SOCIAL_TRACKING_TIKTOK: config.sheets?.social_tracking_tiktok,
  SOCIAL_TRACKING_TWITTER: config.sheets?.social_tracking_twitter,
  SOCIAL_TRACKING_FACEBOOK: config.sheets?.social_tracking_facebook,
  
  // Brand Content
  GODS_VESSEL_DISCUSSIONS: config.sheets?.gods_vessel_discussions,
  GODS_VESSEL_QUOTES: config.sheets?.gods_vessel_quotes,
  TSHIRT_DESIGNS_CANVA_BULK: config.sheets?.tshirt_designs_canva_bulk,
  
  // Blogs & Analytics
  DAX_TRAVELER_BLOGS: config.sheets?.dax_traveler_blogs,
  TIMEZONE_TRAVELERS_BLOGS_ITINERARIES: config.sheets?.timezone_travelers_blogs_itineraries,
  BRAND_ANALYTICS_DASHBOARD: config.sheets?.brand_analytics_dashboard
};

// FIXED: YouTube Channel Configuration
const YOUTUBE_CHANNELS = {
  'dax-traveler': {
    userId: config.youtube?.dax_traveler_user_id,
    channelId: config.youtube?.dax_traveler_channel_id,
    clientId: config.google?.client_id_dax_main
  },
  'anidax': {
    userId: config.youtube?.anidax_user_id,
    channelId: config.youtube?.anidax_channel_id,
    clientId: config.google?.client_id_anidax
  },
  'timezone-travelers': {
    userId: config.youtube?.timezone_travelers_user_id,
    channelId: config.youtube?.timezone_travelers_channel_id,
    clientId: config.google?.client_id_ttz
  },
  'gods-vessel': {
    userId: config.youtube?.gods_vessel_user_id,
    channelId: config.youtube?.gods_vessel_channel_id,
    clientId: config.google?.client_id_gv
  }
};

// FIXED: Initialize Google APIs
const youtube = google.youtube({ version: 'v3', auth: YOUTUBE_API_KEY });
const drive = google.drive({ version: 'v3' });
const sheets = google.sheets({ version: 'v4' });

// ═══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Verify Firebase ID token
 */
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// YOUTUBE API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get YouTube videos for a specific brand
 */
exports.getYouTubeVideos = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { brandKey, maxResults = 10 } = req.query;
      
      if (!brandKey || !YOUTUBE_CHANNELS[brandKey]) {
        return res.status(400).json({ error: 'Invalid brand key' });
      }

      const channelConfig = YOUTUBE_CHANNELS[brandKey];
      const channelId = channelConfig.channelId;

      if (!channelId) {
        return res.status(400).json({ error: 'Channel ID not configured for this brand' });
      }

      // Get channel's uploads playlist
      const channelResponse = await youtube.channels.list({
        part: 'contentDetails',
        id: channelId,
        key: YOUTUBE_API_KEY
      });

      if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
        return res.status(404).json({ error: 'Channel not found' });
      }

      const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

      // Get videos from uploads playlist
      const videosResponse = await youtube.playlistItems.list({
        part: 'snippet',
        playlistId: uploadsPlaylistId,
        maxResults: parseInt(maxResults),
        key: YOUTUBE_API_KEY
      });

      const videos = videosResponse.data.items || [];

      // Get video statistics
      const videoIds = videos.map(video => video.snippet.resourceId.videoId);
      let videoStats = [];

      if (videoIds.length > 0) {
        const statsResponse = await youtube.videos.list({
          part: 'statistics',
          id: videoIds.join(','),
          key: YOUTUBE_API_KEY
        });
        videoStats = statsResponse.data.items || [];
      }

      // Combine video data with statistics
      const enrichedVideos = videos.map((video, index) => ({
        id: video.snippet.resourceId.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
        publishedAt: video.snippet.publishedAt,
        channelTitle: video.snippet.channelTitle,
        statistics: videoStats[index]?.statistics || {},
        url: `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`,
        brand: brandKey
      }));

      res.json({
        success: true,
        brand: brandKey,
        channelId: channelId,
        videos: enrichedVideos,
        totalResults: enrichedVideos.length
      });

    } catch (error) {
      console.error('YouTube API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch YouTube videos',
        details: error.message 
      });
    }
  });
});

/**
 * Get YouTube channel statistics
 */
exports.getYouTubeChannelStats = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { brandKey } = req.query;
      
      if (!brandKey || !YOUTUBE_CHANNELS[brandKey]) {
        return res.status(400).json({ error: 'Invalid brand key' });
      }

      const channelConfig = YOUTUBE_CHANNELS[brandKey];
      const channelId = channelConfig.channelId;

      const response = await youtube.channels.list({
        part: 'statistics,snippet',
        id: channelId,
        key: YOUTUBE_API_KEY
      });

      if (!response.data.items || response.data.items.length === 0) {
        return res.status(404).json({ error: 'Channel not found' });
      }

      const channel = response.data.items[0];

      res.json({
        success: true,
        brand: brandKey,
        channelId: channelId,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails.high?.url,
        statistics: {
          subscriberCount: parseInt(channel.statistics.subscriberCount || 0),
          videoCount: parseInt(channel.statistics.videoCount || 0),
          viewCount: parseInt(channel.statistics.viewCount || 0)
        },
        publishedAt: channel.snippet.publishedAt
      });

    } catch (error) {
      console.error('YouTube channel stats error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch channel statistics',
        details: error.message 
      });
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GOOGLE DRIVE API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get images from Google Drive folder
 */
exports.getDriveImages = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      // Verify authentication
      await verifyToken(req, res, async () => {
        const { folderId, maxResults = 50, pageToken } = req.query;

        if (!folderId) {
          return res.status(400).json({ error: 'Folder ID is required' });
        }

        // Get user's access token (this would need to be implemented based on your auth flow)
        const accessToken = await getUserAccessToken(req.user.uid);
        
        if (!accessToken) {
          return res.status(401).json({ error: 'Google Drive access not authorized' });
        }

        // Set up authenticated Drive client
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });
        const authenticatedDrive = google.drive({ version: 'v3', auth });

        // Query for images in the folder
        const query = `'${folderId}' in parents and (mimeType contains 'image/')`;
        
        const response = await authenticatedDrive.files.list({
          q: query,
          pageSize: parseInt(maxResults),
          pageToken: pageToken,
          fields: 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, thumbnailLink, imageMediaMetadata)',
          orderBy: 'createdTime desc'
        });

        const files = response.data.files || [];

        // Generate direct download links
        const images = files.map(file => ({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          size: file.size,
          createdTime: file.createdTime,
          modifiedTime: file.modifiedTime,
          webViewLink: file.webViewLink,
          thumbnailLink: file.thumbnailLink,
          directImageUrl: `https://drive.google.com/uc?id=${file.id}`,
          imageMediaMetadata: file.imageMediaMetadata
        }));

        res.json({
          success: true,
          folderId: folderId,
          images: images,
          nextPageToken: response.data.nextPageToken,
          totalCount: images.length
        });
      });

    } catch (error) {
      console.error('Drive API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch Drive images',
        details: error.message 
      });
    }
  });
});

/**
 * Get folder information and statistics
 */
exports.getDriveFolderInfo = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      await verifyToken(req, res, async () => {
        const { folderId } = req.query;

        if (!folderId) {
          return res.status(400).json({ error: 'Folder ID is required' });
        }

        const accessToken = await getUserAccessToken(req.user.uid);
        if (!accessToken) {
          return res.status(401).json({ error: 'Google Drive access not authorized' });
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });
        const authenticatedDrive = google.drive({ version: 'v3', auth });

        // Get folder info
        const folderResponse = await authenticatedDrive.files.get({
          fileId: folderId,
          fields: 'id, name, createdTime, modifiedTime'
        });

        // Count images in folder
        const query = `'${folderId}' in parents and (mimeType contains 'image/')`;
        const filesResponse = await authenticatedDrive.files.list({
          q: query,
          fields: 'files(size)',
          pageSize: 1000 // Get all files to count them
        });

        const files = filesResponse.data.files || [];
        const totalSize = files.reduce((sum, file) => sum + parseInt(file.size || 0), 0);

        res.json({
          success: true,
          folder: folderResponse.data,
          imageCount: files.length,
          totalSize: totalSize,
          formattedSize: formatBytes(totalSize)
        });
      });

    } catch (error) {
      console.error('Drive folder info error:', error);
      res.status(500).json({ 
        error: 'Failed to get folder information',
        details: error.message 
      });
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GOOGLE SHEETS API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get data from Google Sheets
 */
exports.getSheetData = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { sheetId, range = 'Sheet1!A1:Z1000', sheetKey } = req.query;

      // Use sheetKey to get sheetId if provided
      const actualSheetId = sheetKey ? SHEETS[sheetKey.toUpperCase()] : sheetId;

      if (!actualSheetId) {
        return res.status(400).json({ error: 'Sheet ID or valid sheet key is required' });
      }

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: actualSheetId,
        range: range,
        key: GOOGLE_API_KEY
      });

      const values = response.data.values || [];

      res.json({
        success: true,
        sheetId: actualSheetId,
        range: range,
        values: values,
        rowCount: values.length
      });

    } catch (error) {
      console.error('Sheets API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch sheet data',
        details: error.message 
      });
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION AND HEALTH CHECK FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get configuration status
 */
exports.getConfigStatus = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    const configStatus = {
      youtube: {
        apiKey: !!YOUTUBE_API_KEY,
        channels: Object.entries(YOUTUBE_CHANNELS).reduce((acc, [key, config]) => {
          acc[key] = {
            channelId: !!config.channelId,
            userId: !!config.userId,
            clientId: !!config.clientId
          };
          return acc;
        }, {})
      },
      google: {
        apiKey: !!GOOGLE_API_KEY,
        clientId: !!GOOGLE_CLIENT_ID
      },
      drive: {
        folders: Object.entries(DRIVE_FOLDERS).reduce((acc, [key, folderId]) => {
          acc[key] = !!folderId;
          return acc;
        }, {})
      },
      sheets: {
        configured: Object.entries(SHEETS).reduce((acc, [key, sheetId]) => {
          acc[key] = !!sheetId;
          return acc;
        }, {})
      },
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      config: configStatus
    });
  });
});

/**
 * Health check endpoint
 */
exports.healthCheck = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get user's Google access token from Firestore
 * This is a placeholder - implement based on your auth flow
 */
async function getUserAccessToken(userId) {
  try {
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    return userDoc.data()?.googleAccessToken;
  } catch (error) {
    console.error('Error getting user access token:', error);
    return null;
  }
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT CONFIGURATION FOR DEBUGGING
// ═══════════════════════════════════════════════════════════════════════════════

exports.debugConfig = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    // Only show this in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Debug endpoint not available in production' });
    }

    res.json({
      driveFolder: DRIVE_FOLDERS,
      sheets: SHEETS,
      youtubeChannels: Object.keys(YOUTUBE_CHANNELS),
      hasYouTubeKey: !!YOUTUBE_API_KEY,
      hasGoogleKey: !!GOOGLE_API_KEY
    });
  });
});

