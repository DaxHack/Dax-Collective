const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const axios = require('axios');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Google Sheets API setup
const sheets = google.sheets('v4');

/**
 * Trigger when new content is created in Firestore
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
        processedAt: admin.firestore.FieldValue.serverTimestamp()
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
        errorAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });

/**
 * HTTP endpoint for n8n webhooks
 * Receives updates from n8n workflows
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
    const { contentId, status, data, workflowId } = req.body;
    
    console.log(`n8n webhook received for content: ${contentId}`, { status, workflowId });
    
    // Update content in Firestore
    const contentRef = db.collection('content').doc(contentId);
    await contentRef.update({
      'automation.status': status,
      'automation.lastUpdate': admin.firestore.FieldValue.serverTimestamp(),
      'automation.workflowId': workflowId,
      'automation.data': data
    });
    
    // If workflow completed successfully, update content status
    if (status === 'completed') {
      await contentRef.update({
        status: 'ready_for_publishing',
        readyAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    res.status(200).json({ success: true, message: 'Webhook processed successfully' });
    
  } catch (error) {
    console.error('Error processing n8n webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Scheduled function to check and publish ready content
 * Runs every hour to check for content ready to be published
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
        .get();
      
      const publishPromises = [];
      
      readyContent.forEach(doc => {
        const content = doc.data();
        publishPromises.push(publishContent(doc.id, content));
      });
      
      await Promise.all(publishPromises);
      
      console.log(`Published ${publishPromises.length} pieces of content`);
      
    } catch (error) {
      console.error('Error in scheduled publishing:', error);
    }
  });

/**
 * HTTP endpoint for manual content publishing
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
    
    const contentDoc = await db.collection('content').doc(contentId).get();
    if (!contentDoc.exists) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    const content = contentDoc.data();
    await publishContent(contentId, content);
    
    res.status(200).json({ success: true, message: 'Content published successfully' });
    
  } catch (error) {
    console.error('Error publishing content:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Helper function to trigger n8n workflow
 */
async function triggerN8nWorkflow(content, contentId) {
  const n8nWebhookUrl = functions.config().n8n?.webhook_url;
  
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
    metadata: content.metadata || {}
  };
  
  await axios.post(n8nWebhookUrl, payload, {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 30000
  });
}

/**
 * Helper function to update Google Sheets tracking
 */
async function updateContentTracking(content, contentId) {
  // This will be implemented when we set up Google Sheets integration
  console.log('Updating Google Sheets tracking for:', contentId);
  // TODO: Implement Google Sheets API calls
}

/**
 * Helper function to send processing notifications
 */
async function sendProcessingNotification(content, contentId) {
  // Store notification in Firestore for dashboard display
  await db.collection('notifications').add({
    type: 'content_processing',
    contentId,
    brand: content.brand,
    title: content.title,
    message: `Started processing content: ${content.title}`,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    read: false
  });
}

/**
 * Helper function to publish content to platforms
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
    
    for (const platform of content.platforms || []) {
      try {
        switch (platform) {
          case 'youtube':
            publishResults.youtube = await publishToYouTube(content);
            break;
          case 'instagram':
            publishResults.instagram = await publishToInstagram(content);
            break;
          case 'tiktok':
            publishResults.tiktok = await publishToTikTok(content);
            break;
          default:
            console.warn(`Unknown platform: ${platform}`);
        }
      } catch (platformError) {
        console.error(`Error publishing to ${platform}:`, platformError);
        publishResults[platform] = { error: platformError.message };
      }
    }
    
    // Update content with publish results
    await db.collection('content').doc(contentId).update({
      status: 'published',
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
      publishResults
    });
    
    // Create success notification
    await db.collection('notifications').add({
      type: 'content_published',
      contentId,
      brand: content.brand,
      title: content.title,
      message: `Successfully published: ${content.title}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });
    
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
 * Platform-specific publishing functions
 * These will be implemented based on each platform's API
 */
async function publishToYouTube(content) {
  // TODO: Implement YouTube API publishing
  console.log('Publishing to YouTube:', content.title);
  return { success: true, url: 'https://youtube.com/watch?v=example' };
}

async function publishToInstagram(content) {
  // TODO: Implement Instagram API publishing
  console.log('Publishing to Instagram:', content.title);
  return { success: true, url: 'https://instagram.com/p/example' };
}

async function publishToTikTok(content) {
  // TODO: Implement TikTok API publishing
  console.log('Publishing to TikTok:', content.title);
  return { success: true, url: 'https://tiktok.com/@user/video/example' };
}

