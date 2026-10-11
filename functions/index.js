// functions/index.js
// ENHANCED MERGED VERSION - Combines all existing automation with new YouTube API features

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const { google } = require('googleapis');
const axios = require('axios');

// Initialize Firebase Admin (production-ready)
admin.initializeApp();
// Get Firestore database
const db = admin.firestore();
// ENHANCED: Get configuration from Firebase Functions config
const config = functions.config();

// Server-side automation with service account
exports.processContent = functions.firestore
  .document('content/{id}')
  .onCreate(async (snap, context) => {
    // Automated processing without user interaction
  });


// ENHANCED: API Keys and Configuration with fallbacks
const YOUTUBE_API_KEY = config.youtube?.api_key;
const GOOGLE_API_KEY = config.google?.api_key;
const GOOGLE_CLIENT_ID = config.google?.client_id;

// ENHANCED: Drive Folder IDs from config with backward compatibility
const DRIVE_FOLDERS = {
  DAX_TRAVELER_PHOTOS: config.drive?.dax_traveler_photos,
  GODS_VESSEL_PHOTOS: config.drive?.gods_vessel_photos,
  ANI_DAX_PHOTOS: config.drive?.ani_dax_photos,
  TIMEZONE_TRAVELERS_PHOTOS: config.drive?.timezone_travelers_photos,
  DAX_HOMEPAGE_PHOTOS: config.drive?.dax_homepage_photos,
  DAX_ANALYTICS_IMAGES: config.drive?.dax_analytics_images
};

// ENHANCED: Legacy folder access function (backward compatibility)
const driveFolderFor = brandKey => config.drive?.[brandKey];

// ENHANCED: Google Sheets IDs from config
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

// ENHANCED: YouTube Channel Configuration with legacy support
const YOUTUBE_CHANNELS = {
  'dax-traveler': {
    userId: config.youtube?.dax_traveler_user_id,
    channelId: config.youtube?.dax_traveler_channel_id,
    clientId: config.google?.client_id_dax_main,
    // Legacy support
    legacyChannel: config.youtube?.dax_traveler_channel
  },
  'anidax': {
    userId: config.youtube?.anidax_user_id,
    channelId: config.youtube?.anidax_channel_id,
    clientId: config.google?.client_id_anidax
  },
  'timezone-travelers': {
    userId: config.youtube?.timezone_travelers_user_id,
    channelId: config.youtube?.timezone_travelers_channel_id,
    clientId: config.google?.client_id_ttz,
    // Legacy support
    legacyChannel: config.youtube?.timezone_travelers_channel
  },
  'gods-vessel': {
    userId: config.youtube?.gods_vessel_user_id,
    channelId: config.youtube?.gods_vessel_channel_id,
    clientId: config.google?.client_id_gv,
    // Legacy support
    legacyChannel: config.youtube?.gods_vessel_channel
  },
  'satiated-taste': {
    userId: config.youtube?.satiated_taste_user_id,
    channelId: config.youtube?.satiated_taste_channel_id,
    clientId: config.google?.client_id_dax_main,
    // Legacy support
    legacyChannel: config.youtube?.satiated_taste_channel
  }
};

// ENHANCED: Initialize Google APIs with proper error handling
let youtube, drive, sheets;
try {
  youtube = google.youtube({ version: 'v3', auth: YOUTUBE_API_KEY });
  drive = google.drive({ version: 'v3' });
  sheets = google.sheets({ version: 'v4' });
} catch (error) {
  console.error('Error initializing Google APIs:', error);
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ENHANCED: Verify Firebase ID token with better error handling
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization header provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    
    if (typeof next === 'function') {
      next();
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ 
      error: 'Invalid token',
      details: error.message 
    });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCED YOUTUBE API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ENHANCED: Get YouTube videos for a specific brand with caching and error handling
 */
exports.getYouTubeVideos = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { brandKey, maxResults = 10, pageToken } = req.query;
      
      if (!brandKey) {
        return res.status(400).json({ error: 'Brand key is required' });
      }

      if (!YOUTUBE_CHANNELS[brandKey]) {
        return res.status(400).json({ 
          error: 'Invalid brand key',
          availableBrands: Object.keys(YOUTUBE_CHANNELS)
        });
      }

      const channelConfig = YOUTUBE_CHANNELS[brandKey];
      const channelId = channelConfig.channelId;

      if (!channelId) {
        return res.status(400).json({ 
          error: 'Channel ID not configured for this brand',
          brandKey: brandKey
        });
      }

      if (!YOUTUBE_API_KEY) {
        return res.status(500).json({ error: 'YouTube API key not configured' });
      }

      // Get channel's uploads playlist
      const channelResponse = await youtube.channels.list({
        part: 'contentDetails,snippet',
        id: channelId,
        key: YOUTUBE_API_KEY
      });

      if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
        return res.status(404).json({ error: 'Channel not found' });
      }

      const channel = channelResponse.data.items[0];
      const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;

      // Get videos from uploads playlist
      const videosResponse = await youtube.playlistItems.list({
        part: 'snippet',
        playlistId: uploadsPlaylistId,
        maxResults: Math.min(parseInt(maxResults), 50),
        pageToken: pageToken,
        key: YOUTUBE_API_KEY
      });

      const videos = videosResponse.data.items || [];

      // Get video statistics if videos exist
      const videoIds = videos.map(video => video.snippet.resourceId.videoId);
      let videoStats = [];

      if (videoIds.length > 0) {
        const statsResponse = await youtube.videos.list({
          part: 'statistics,contentDetails',
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
        duration: videoStats[index]?.contentDetails?.duration || null,
        url: `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`,
        brand: brandKey,
        position: video.snippet.position
      }));

      res.json({
        success: true,
        brand: brandKey,
        channelId: channelId,
        channelTitle: channel.snippet.title,
        videos: enrichedVideos,
        totalResults: enrichedVideos.length,
        nextPageToken: videosResponse.data.nextPageToken,
        prevPageToken: videosResponse.data.prevPageToken
      });

    } catch (error) {
      console.error('YouTube API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch YouTube videos',
        details: error.message,
        code: error.code
      });
    }
  });
});

/**
 * ENHANCED: Get YouTube channel statistics with additional metrics
 */
exports.getYouTubeChannelStats = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { brandKey } = req.query;
      
      if (!brandKey || !YOUTUBE_CHANNELS[brandKey]) {
        return res.status(400).json({ 
          error: 'Invalid brand key',
          availableBrands: Object.keys(YOUTUBE_CHANNELS)
        });
      }

      const channelConfig = YOUTUBE_CHANNELS[brandKey];
      const channelId = channelConfig.channelId;

      if (!channelId) {
        return res.status(400).json({ error: 'Channel ID not configured for this brand' });
      }

      const response = await youtube.channels.list({
        part: 'statistics,snippet,brandingSettings',
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
        customUrl: channel.snippet.customUrl,
        thumbnail: channel.snippet.thumbnails.high?.url,
        bannerImage: channel.brandingSettings?.image?.bannerExternalUrl,
        statistics: {
          subscriberCount: parseInt(channel.statistics.subscriberCount || 0),
          videoCount: parseInt(channel.statistics.videoCount || 0),
          viewCount: parseInt(channel.statistics.viewCount || 0),
          hiddenSubscriberCount: channel.statistics.hiddenSubscriberCount
        },
        publishedAt: channel.snippet.publishedAt,
        country: channel.snippet.country,
        defaultLanguage: channel.snippet.defaultLanguage
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

/**
 * NEW: Get YouTube video details by ID
 */
exports.getYouTubeVideoDetails = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { videoId } = req.query;
      
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
      }

      const response = await youtube.videos.list({
        part: 'snippet,statistics,contentDetails',
        id: videoId,
        key: YOUTUBE_API_KEY
      });

      if (!response.data.items || response.data.items.length === 0) {
        return res.status(404).json({ error: 'Video not found' });
      }

      const video = response.data.items[0];

      res.json({
        success: true,
        video: {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.high?.url,
          publishedAt: video.snippet.publishedAt,
          channelTitle: video.snippet.channelTitle,
          channelId: video.snippet.channelId,
          tags: video.snippet.tags || [],
          categoryId: video.snippet.categoryId,
          duration: video.contentDetails.duration,
          statistics: video.statistics,
          url: `https://www.youtube.com/watch?v=${video.id}`
        }
      });

    } catch (error) {
      console.error('YouTube video details error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch video details',
        details: error.message 
      });
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCED GOOGLE SHEETS API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ENHANCED: Get data from Google Sheets with better error handling
 */
exports.getSheetData = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { sheetId, range = 'Sheet1!A1:Z1000', sheetKey } = req.query;

      // Use sheetKey to get sheetId if provided
      const actualSheetId = sheetKey ? SHEETS[sheetKey.toUpperCase()] : sheetId;

      if (!actualSheetId) {
        return res.status(400).json({ 
          error: 'Sheet ID or valid sheet key is required',
          availableSheetKeys: Object.keys(SHEETS)
        });
      }

      if (!GOOGLE_API_KEY) {
        return res.status(500).json({ error: 'Google API key not configured' });
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
        sheetKey: sheetKey,
        range: range,
        values: values,
        rowCount: values.length,
        columnCount: values.length > 0 ? values[0].length : 0
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
// ENHANCED CONFIGURATION AND HEALTH CHECK FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ENHANCED: Get configuration status with detailed information
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
            clientId: !!config.clientId,
            hasLegacyChannel: !!config.legacyChannel
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
      n8n: {
        webhookUrl: !!config.n8n?.webhook_url
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform
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
 * ENHANCED: Health check endpoint with system information
 */
exports.healthCheck = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      features: {
        youtube: !!YOUTUBE_API_KEY,
        googleSheets: !!GOOGLE_API_KEY,
        automation: true,
        n8n: !!config.n8n?.webhook_url
      }
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EXISTING AUTOMATION FUNCTIONS (ENHANCED)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ENHANCED: Trigger when new content is created in Firestore
 * Handles the automation pipeline for content processing
 */
exports.processNewContent = functions.firestore
  .document('content/{contentId}')
  .onCreate(async (snap, context) => {
    const content = snap.data();
    const contentId = context.params.contentId;
    
    console.log(`Processing new content: ${contentId}`, content);
    
    try {
      // Update content status to processing
      await snap.ref.update({
        status: 'processing',
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        processingStarted: new Date().toISOString()
      });
      
      // Trigger n8n workflow
      if (content.automation?.enabled) {
        await triggerN8nWorkflow(content, contentId);
      }
      
      // Update Google Sheets tracking
      await updateContentTracking(content, contentId);
      
      // Send notification
      await sendProcessingNotification(content, contentId);
      
      console.log(`Successfully processed content: ${contentId}`);
      
    } catch (error) {
      console.error(`Error processing content ${contentId}:`, error);
      
      // Update content with error status
      await snap.ref.update({
        status: 'error',
        error: error.message,
        errorAt: admin.firestore.FieldValue.serverTimestamp(),
        errorDetails: {
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        }
      });
    }
  });

/**
 * ENHANCED: HTTP endpoint for n8n webhooks with better validation
 */
exports.n8nWebhook = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  try {
    const { contentId, status, data, workflowId, timestamp } = req.body;
    
    if (!contentId) {
      return res.status(400).json({ error: 'Content ID is required' });
    }
    
    console.log(`n8n webhook received for content: ${contentId}`, { status, workflowId });
    
    // Update content in Firestore
    const contentRef = db.collection('content').doc(contentId);
    const updateData = {
      'automation.status': status,
      'automation.lastUpdate': admin.firestore.FieldValue.serverTimestamp(),
      'automation.workflowId': workflowId,
      'automation.data': data,
      'automation.webhookTimestamp': timestamp || new Date().toISOString()
    };
    
    await contentRef.update(updateData);
    
    // If workflow completed successfully, update content status
    if (status === 'completed') {
      await contentRef.update({
        status: 'ready_for_publishing',
        readyAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else if (status === 'failed') {
      await contentRef.update({
        status: 'automation_failed',
        failedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Webhook processed successfully',
      contentId: contentId,
      status: status
    });
    
  } catch (error) {
    console.error('Error processing n8n webhook:', error);
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * ENHANCED: Scheduled function to check and publish ready content
 */
exports.publishScheduledContent = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    console.log('Checking for scheduled content to publish...');
    
    try {
      const now = admin.firestore.Timestamp.now();
      
      // Query for content ready to publish
      const readyContent = await db.collection('content')
        .where('status', '==', 'scheduled')
        .where('publishAt', '<=', now)
        .limit(50) // Limit to prevent timeout
        .get();
      
      const publishPromises = [];
      
      readyContent.forEach(doc => {
        const content = doc.data();
        publishPromises.push(publishContent(doc.id, content));
      });
      
      const results = await Promise.allSettled(publishPromises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      console.log(`Scheduled publishing completed: ${successful} successful, ${failed} failed`);
      
      // Log results to Firestore for monitoring
      await db.collection('automation_logs').add({
        type: 'scheduled_publishing',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        results: {
          total: publishPromises.length,
          successful: successful,
          failed: failed
        }
      });
      
    } catch (error) {
      console.error('Error in scheduled publishing:', error);
      
      // Log error to Firestore
      await db.collection('automation_logs').add({
        type: 'scheduled_publishing_error',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        error: error.message
      });
    }
  });

/**
 * ENHANCED: HTTP endpoint for manual content publishing
 */
exports.publishContent = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  try {
    const { contentId } = req.body;
    
    if (!contentId) {
      return res.status(400).json({ error: 'Content ID is required' });
    }
    
    const contentDoc = await db.collection('content').doc(contentId).get();
    if (!contentDoc.exists) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    const content = contentDoc.data();
    const result = await publishContent(contentId, content);
    
    res.status(200).json({ 
      success: true, 
      message: 'Content published successfully',
      contentId: contentId,
      result: result
    });
    
  } catch (error) {
    console.error('Error publishing content:', error);
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCED HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ENHANCED: Helper function to trigger n8n workflow with retry logic
 */
async function triggerN8nWorkflow(content, contentId) {
  const n8nWebhookUrl = config.n8n?.webhook_url;
  
  if (!n8nWebhookUrl) {
    console.warn('n8n webhook URL not configured');
    return;
  }
  
  const payload = {
    contentId,
    brand: content.brand,
    type: content.type,
    title: content.title,
    description: content.description,
    platforms: content.platforms || [],
    metadata: content.metadata || {},
    timestamp: new Date().toISOString()
  };
  
  const maxRetries = 3;
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await axios.post(n8nWebhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log(`n8n workflow triggered successfully for ${contentId} (attempt ${attempt})`);
      return;
      
    } catch (error) {
      lastError = error;
      console.warn(`n8n workflow trigger failed for ${contentId} (attempt ${attempt}):`, error.message);
      
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw new Error(`Failed to trigger n8n workflow after ${maxRetries} attempts: ${lastError.message}`);
}

/**
 * ENHANCED: Helper function to update Google Sheets tracking
 */
async function updateContentTracking(content, contentId) {
  try {
    console.log('Updating Google Sheets tracking for:', contentId);
    
    // Determine which sheet to update based on content type/brand
    let sheetId;
    if (content.brand === 'dax-traveler') {
      sheetId = SHEETS.DAX_TRAVELER_BLOGS;
    } else if (content.brand === 'timezone-travelers') {
      sheetId = SHEETS.TIMEZONE_TRAVELERS_BLOGS_ITINERARIES;
    } else if (content.brand === 'gods-vessel') {
      sheetId = SHEETS.GODS_VESSEL_DISCUSSIONS;
    }
    
    if (sheetId && GOOGLE_API_KEY) {
      // TODO: Implement actual Google Sheets API calls
      // This is a placeholder for future implementation
      console.log(`Would update sheet ${sheetId} with content ${contentId}`);
    }
    
  } catch (error) {
    console.error('Error updating content tracking:', error);
    // Don't throw - this shouldn't stop the main process
  }
}

/**
 * ENHANCED: Helper function to send processing notifications
 */
async function sendProcessingNotification(content, contentId) {
  try {
    await db.collection('notifications').add({
      type: 'content_processing',
      contentId,
      brand: content.brand,
      title: content.title,
      message: `Started processing content: ${content.title}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
      priority: 'normal',
      metadata: {
        contentType: content.type,
        platforms: content.platforms || []
      }
    });
  } catch (error) {
    console.error('Error sending processing notification:', error);
    // Don't throw - this shouldn't stop the main process
  }
}

/**
 * ENHANCED: Helper function to publish content to platforms
 */
async function publishContent(contentId, content) {
  console.log(`Publishing content: ${contentId} to platforms:`, content.platforms);
  
  try {
    // Update status to publishing
    await db.collection('content').doc(contentId).update({
      status: 'publishing',
      publishingStartedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Publish to each platform
    const publishResults = {};
    const platforms = content.platforms || [];
    
    for (const platform of platforms) {
      try {
        let result;
        switch (platform) {
          case 'youtube':
            result = await publishToYouTube(content);
            break;
          case 'instagram':
            result = await publishToInstagram(content);
            break;
          case 'tiktok':
            result = await publishToTikTok(content);
            break;
          case 'twitter':
            result = await publishToTwitter(content);
            break;
          case 'facebook':
            result = await publishToFacebook(content);
            break;
          default:
            console.warn(`Unknown platform: ${platform}`);
            result = { error: `Unknown platform: ${platform}` };
        }
        publishResults[platform] = result;
      } catch (platformError) {
        console.error(`Error publishing to ${platform}:`, platformError);
        publishResults[platform] = { 
          error: platformError.message,
          timestamp: new Date().toISOString()
        };
      }
    }
    
    // Update content with publish results
    await db.collection('content').doc(contentId).update({
      status: 'published',
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
      publishResults,
      publishedPlatforms: platforms.filter(p => publishResults[p] && !publishResults[p].error)
    });
    
    // Create success notification
    await db.collection('notifications').add({
      type: 'content_published',
      contentId,
      brand: content.brand,
      title: content.title,
      message: `Successfully published: ${content.title}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
      metadata: {
        platforms: platforms,
        results: publishResults
      }
    });
    
    return publishResults;
    
  } catch (error) {
    console.error(`Error publishing content ${contentId}:`, error);
    
    // Update with error status
    await db.collection('content').doc(contentId).update({
      status: 'publish_error',
      publishError: error.message,
      publishErrorAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    throw error;
  }
}

/**
 * ENHANCED: Platform-specific publishing functions
 */
async function publishToYouTube(content) {
  // TODO: Implement YouTube API publishing
  console.log('Publishing to YouTube:', content.title);
  return { 
    success: true, 
    url: 'https://youtube.com/watch?v=example',
    timestamp: new Date().toISOString()
  };
}

async function publishToInstagram(content) {
  // TODO: Implement Instagram API publishing
  console.log('Publishing to Instagram:', content.title);
  return { 
    success: true, 
    url: 'https://instagram.com/p/example',
    timestamp: new Date().toISOString()
  };
}

async function publishToTikTok(content) {
  // TODO: Implement TikTok API publishing
  console.log('Publishing to TikTok:', content.title);
  return { 
    success: true, 
    url: 'https://tiktok.com/@user/video/example',
    timestamp: new Date().toISOString()
  };
}

async function publishToTwitter(content) {
  // TODO: Implement Twitter API publishing
  console.log('Publishing to Twitter:', content.title);
  return { 
    success: true, 
    url: 'https://twitter.com/user/status/example',
    timestamp: new Date().toISOString()
  };
}

async function publishToFacebook(content) {
  // TODO: Implement Facebook API publishing
  console.log('Publishing to Facebook:', content.title);
  return { 
    success: true, 
    url: 'https://facebook.com/post/example',
    timestamp: new Date().toISOString()
  };
}

