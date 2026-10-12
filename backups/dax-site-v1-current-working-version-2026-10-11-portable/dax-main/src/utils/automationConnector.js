// src/utils/automationConnector.js
// CORRECTED VERSION - Copy this to replace your existing automationConnector.js

import hybridDriveApi from '../services/hybridDriveApi';
import { sheetsApi } from '../services/sheetsApi';

// FIXED: Brand configuration matching your .env setup with proper fallbacks
const BRAND_CONFIG = {
  'dax-traveler': {
    channelId: process.env.REACT_APP_YOUTUBE_CHANNEL_ID_DAX_TRAVELER || 'UCuN9RFxD1_PUOci_AEa5DMQ',
    voiceId: process.env.REACT_APP_VOICE_ID_DAX_TRAVELER || '',
    driveFolder: process.env.REACT_APP_DRIVE_DAX_TRAVELER_PHOTOS || '',
    blogSheet: process.env.REACT_APP_SHEET_DAX_TRAVELER_BLOGS || '',
    email: process.env.REACT_APP_EMAIL_MAIN || '',
    subreddits: (process.env.REACT_APP_REDDIT_SUBREDDIT_DAX_TRAVELER || '').split(',').filter(Boolean),
    category: 'travel'
  },
  'timezone-travelers': {
    channelId: process.env.REACT_APP_YOUTUBE_CHANNEL_ID_TIMEZONE_TRAVELERS || 'UCKan3hAUmcy0Q49d7MIXhdA',
    voiceId: process.env.REACT_APP_VOICE_ID_TIMEZONE_TRAVELERS || '',
    driveFolder: process.env.REACT_APP_DRIVE_TIMEZONE_TRAVELERS_PHOTOS || '',
    blogSheet: process.env.REACT_APP_SHEET_TIMEZONE_TRAVELERS_BLOGS_ITINERARIES || '',
    email: process.env.REACT_APP_EMAIL_TIMEZONE_TRAVELERS || '',
    subreddits: (process.env.REACT_APP_REDDIT_SUBREDDIT_TIMEZONE_TRAVELERS || '').split(',').filter(Boolean),
    category: 'timezone'
  },
  'satiated-taste': {
    channelId: process.env.REACT_APP_YOUTUBE_CHANNEL_ID_SATIATED_TASTE || 'UCmlTPphxXdZ3T2gDQ_kPZQQ',
    voiceId: process.env.REACT_APP_VOICE_ID_SATIATED_TASTE || '',
    driveFolder: process.env.REACT_APP_DRIVE_SATIATED_TASTE_PHOTOS || '',
    recipeSheet: process.env.REACT_APP_SHEET_SATIATED_TASTE_RECIPES || '',
    email: process.env.REACT_APP_EMAIL_SATIATED_TASTE || '',
    subreddits: (process.env.REACT_APP_REDDIT_SUBREDDIT_SATIATED_TASTE || '').split(',').filter(Boolean),
    category: 'food'
  },
  'gods-vessel': {
    channelId: process.env.REACT_APP_YOUTUBE_CHANNEL_ID_GODS_VESSEL || 'UCAzuegEphw7oQRarESOjuqA',
    voiceId: process.env.REACT_APP_VOICE_ID_GODS_VESSEL || '',
    driveFolder: process.env.REACT_APP_DRIVE_GODS_VESSEL_PHOTOS || '',
    quotesSheet: process.env.REACT_APP_SHEET_GODS_VESSEL_QUOTES || '',
    discussionsSheet: process.env.REACT_APP_SHEET_GODS_VESSEL_DISCUSSIONS || '',
    email: process.env.REACT_APP_EMAIL_GODS_VESSEL || '',
    subreddits: (process.env.REACT_APP_REDDIT_SUBREDDIT_GODS_VESSEL || '').split(',').filter(Boolean),
    category: 'faith'
  }
};

// FIXED: Social tracking sheets for automation
const SOCIAL_SHEETS = {
  youtube: process.env.REACT_APP_SHEET_SOCIAL_TRACKING_YOUTUBE || '',
  instagram: process.env.REACT_APP_SHEET_SOCIAL_TRACKING_INSTAGRAM || '',
  tiktok: process.env.REACT_APP_SHEET_SOCIAL_TRACKING_TIKTOK || '',
  twitter: process.env.REACT_APP_SHEET_SOCIAL_TRACKING_TWITTER || '',
  facebook: process.env.REACT_APP_SHEET_SOCIAL_TRACKING_FACEBOOK || ''
};

// N8N webhook configuration
const N8N_CONFIG = {
  baseUrl: process.env.REACT_APP_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook',
  apiKey: process.env.REACT_APP_N8N_API_KEY || '',
  webhooks: {
    contentGeneration: process.env.REACT_APP_N8N_WEBHOOK_CONTENT_GENERATION || '',
    socialDistribution: process.env.REACT_APP_N8N_WEBHOOK_SOCIAL_DISTRIBUTION || '',
    youtubeSync: process.env.REACT_APP_N8N_WEBHOOK_YOUTUBE_SYNC || '',
    revenueOptimization: process.env.REACT_APP_N8N_WEBHOOK_REVENUE_OPTIMIZATION || ''
  }
};

/**
 * Trigger automation workflow - connects to your N8N automation system
 * @param {string} type - Type of automation workflow
 * @param {Object} data - Data to send to the workflow
 * @returns {Promise<Object>} Automation result
 */
export const triggerAutomationWorkflow = async (type, data) => {
  console.log('🚀 Automation triggered:', type, data);
  
  try {
    const timestamp = new Date().toISOString();
    const brandConfig = BRAND_CONFIG[data.brandKey];
    
    if (!brandConfig) {
      throw new Error(`Brand configuration not found for: ${data.brandKey}`);
    }

    switch (type) {
      case 'youtube_sync':
        return await handleYouTubeSyncAutomation(data, brandConfig, timestamp);
      
      case 'content_generation':
        return await handleContentGenerationAutomation(data, brandConfig, timestamp);
      
      case 'social_distribution':
        return await handleSocialDistributionAutomation(data, brandConfig, timestamp);
      
      case 'revenue_optimization':
        return await handleRevenueOptimizationAutomation(data, brandConfig, timestamp);
      
      default:
        console.warn('Unknown automation type:', type);
        return { success: false, error: 'Unknown automation type' };
    }
  } catch (error) {
    console.error('Automation workflow error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Add content to pipeline - connects to your existing content management
 * @param {string} contentType - Type of content to add
 * @param {Object} content - Content data
 * @returns {Promise<Object>} Pipeline result
 */
export const addToContentPipeline = async (contentType, content) => {
  console.log('📝 Content added to pipeline:', contentType, content);
  
  try {
    const timestamp = new Date().toISOString();
    const brandConfig = BRAND_CONFIG[content.brandKey];
    
    if (!brandConfig) {
      throw new Error(`Brand configuration not found for: ${content.brandKey}`);
    }

    switch (contentType) {
      case 'youtube_video':
        return await addYouTubeVideoToPipeline(content, brandConfig, timestamp);
      
      case 'blog_post':
        return await addBlogPostToPipeline(content, brandConfig, timestamp);
      
      case 'social_post':
        return await addSocialPostToPipeline(content, brandConfig, timestamp);
      
      case 'product_idea':
        return await addProductIdeaToPipeline(content, brandConfig, timestamp);
      
      case 'recipe':
        return await addRecipeToPipeline(content, brandConfig, timestamp);
      
      case 'quote':
        return await addQuoteToPipeline(content, brandConfig, timestamp);
      
      default:
        console.warn('Unknown content type:', contentType);
        return { success: false, error: 'Unknown content type' };
    }
  } catch (error) {
    console.error('Content pipeline error:', error);
    return { success: false, error: error.message };
  }
};

// ========================================
// AUTOMATION WORKFLOW HANDLERS
// ========================================

/**
 * Handle YouTube sync automation
 */
async function handleYouTubeSyncAutomation(data, brandConfig, timestamp) {
  const automationLog = {
    type: 'youtube_sync',
    brand: data.brandKey,
    timestamp,
    status: 'running',
    details: {
      videosFound: data.videos?.length || 0,
      channelStats: data.channelStats,
      syncType: 'full'
    }
  };

  try {
    // Log to social tracking sheet
    if (SOCIAL_SHEETS.youtube) {
      await logToSocialSheet('youtube', {
        brand: data.brandKey,
        action: 'sync',
        timestamp,
        data: automationLog.details
      });
    }

    // Trigger N8N webhook if configured
    if (N8N_CONFIG.webhooks.youtubeSync) {
      await triggerN8NWebhook('youtubeSync', {
        ...data,
        brandConfig,
        timestamp
      });
    }

    // Trigger content generation for new videos
    if (data.videos && data.videos.length > 0) {
      for (const video of data.videos) {
        await triggerAutomationWorkflow('content_generation', {
          brandKey: data.brandKey,
          sourceVideo: video,
          contentTypes: ['blog_post', 'social_posts', 'reddit_post']
        });
      }
    }

    automationLog.status = 'completed';
    return { success: true, log: automationLog };
  } catch (error) {
    automationLog.status = 'failed';
    automationLog.error = error.message;
    return { success: false, log: automationLog, error: error.message };
  }
}

/**
 * Handle content generation automation
 */
async function handleContentGenerationAutomation(data, brandConfig, timestamp) {
  const automationLog = {
    type: 'content_generation',
    brand: data.brandKey,
    timestamp,
    status: 'running',
    details: {
      sourceVideo: data.sourceVideo?.title,
      contentTypes: data.contentTypes,
      voiceId: brandConfig.voiceId
    }
  };

  try {
    // Trigger N8N webhook if configured
    if (N8N_CONFIG.webhooks.contentGeneration) {
      await triggerN8NWebhook('contentGeneration', {
        ...data,
        brandConfig,
        timestamp
      });
    }

    // Generate blog post if requested
    if (data.contentTypes.includes('blog_post') && brandConfig.blogSheet) {
      const blogContent = await generateBlogFromVideo(data.sourceVideo, brandConfig);
      await addToContentPipeline('blog_post', {
        brandKey: data.brandKey,
        content: blogContent,
        sourceVideo: data.sourceVideo
      });
    }

    // Generate social posts if requested
    if (data.contentTypes.includes('social_posts')) {
      const socialPosts = await generateSocialPostsFromVideo(data.sourceVideo, brandConfig);
      for (const post of socialPosts) {
        await addToContentPipeline('social_post', {
          brandKey: data.brandKey,
          content: post,
          sourceVideo: data.sourceVideo
        });
      }
    }

    // Generate Reddit posts if requested
    if (data.contentTypes.includes('reddit_post') && brandConfig.subreddits.length > 0) {
      const redditPost = await generateRedditPostFromVideo(data.sourceVideo, brandConfig);
      await scheduleRedditPost(redditPost, brandConfig.subreddits);
    }

    automationLog.status = 'completed';
    return { success: true, log: automationLog };
  } catch (error) {
    automationLog.status = 'failed';
    automationLog.error = error.message;
    return { success: false, log: automationLog, error: error.message };
  }
}

/**
 * Handle social distribution automation
 */
async function handleSocialDistributionAutomation(data, brandConfig, timestamp) {
  const automationLog = {
    type: 'social_distribution',
    brand: data.brandKey,
    timestamp,
    status: 'running',
    details: {
      platforms: data.platforms || ['instagram', 'tiktok', 'twitter', 'facebook'],
      contentType: data.contentType
    }
  };

  try {
    // Trigger N8N webhook if configured
    if (N8N_CONFIG.webhooks.socialDistribution) {
      await triggerN8NWebhook('socialDistribution', {
        ...data,
        brandConfig,
        timestamp
      });
    }

    // Distribute to each platform
    for (const platform of data.platforms) {
      if (SOCIAL_SHEETS[platform]) {
        await logToSocialSheet(platform, {
          brand: data.brandKey,
          action: 'post_scheduled',
          timestamp,
          content: data.content
        });
      }
    }

    automationLog.status = 'completed';
    return { success: true, log: automationLog };
  } catch (error) {
    automationLog.status = 'failed';
    automationLog.error = error.message;
    return { success: false, log: automationLog, error: error.message };
  }
}

/**
 * Handle revenue optimization automation
 */
async function handleRevenueOptimizationAutomation(data, brandConfig, timestamp) {
  const automationLog = {
    type: 'revenue_optimization',
    brand: data.brandKey,
    timestamp,
    status: 'running',
    details: {
      currentRevenue: data.currentRevenue,
      targetRevenue: data.targetRevenue,
      optimizationStrategies: data.strategies
    }
  };

  try {
    // Trigger N8N webhook if configured
    if (N8N_CONFIG.webhooks.revenueOptimization) {
      await triggerN8NWebhook('revenueOptimization', {
        ...data,
        brandConfig,
        timestamp
      });
    }

    // Log to analytics dashboard
    if (process.env.REACT_APP_SHEET_BRAND_ANALYTICS_DASHBOARD) {
      await logToAnalyticsSheet({
        brand: data.brandKey,
        timestamp,
        revenue: data.currentRevenue,
        strategies: data.strategies
      });
    }

    automationLog.status = 'completed';
    return { success: true, log: automationLog };
  } catch (error) {
    automationLog.status = 'failed';
    automationLog.error = error.message;
    return { success: false, log: automationLog, error: error.message };
  }
}

// ========================================
// CONTENT PIPELINE HANDLERS
// ========================================

/**
 * Add YouTube video to pipeline
 */
async function addYouTubeVideoToPipeline(content, brandConfig, timestamp) {
  const pipelineEntry = {
    type: 'youtube_video',
    brand: content.brandKey,
    timestamp,
    video: {
      title: content.title,
      description: content.description,
      tags: content.tags,
      thumbnail: content.thumbnail,
      url: content.url,
      stats: content.stats
    },
    status: 'processed'
  };

  // Add to appropriate tracking sheet
  if (SOCIAL_SHEETS.youtube) {
    await logToSocialSheet('youtube', pipelineEntry);
  }

  return { success: true, entry: pipelineEntry };
}

/**
 * Add blog post to pipeline
 */
async function addBlogPostToPipeline(content, brandConfig, timestamp) {
  const pipelineEntry = {
    type: 'blog_post',
    brand: content.brandKey,
    timestamp,
    blog: {
      title: content.title,
      content: content.content,
      tags: content.tags,
      sourceVideo: content.sourceVideo?.url
    },
    status: 'draft'
  };

  // Add to brand's blog sheet
  if (brandConfig.blogSheet) {
    await addToBlogSheet(brandConfig.blogSheet, pipelineEntry);
  }

  return { success: true, entry: pipelineEntry };
}

/**
 * Add social post to pipeline
 */
async function addSocialPostToPipeline(content, brandConfig, timestamp) {
  const pipelineEntry = {
    type: 'social_post',
    brand: content.brandKey,
    timestamp,
    post: {
      platform: content.platform,
      content: content.content,
      hashtags: content.hashtags,
      scheduledTime: content.scheduledTime
    },
    status: 'scheduled'
  };

  // Add to appropriate social tracking sheet
  const platform = content.platform.toLowerCase();
  if (SOCIAL_SHEETS[platform]) {
    await logToSocialSheet(platform, pipelineEntry);
  }

  return { success: true, entry: pipelineEntry };
}

/**
 * Add product idea to pipeline
 */
async function addProductIdeaToPipeline(content, brandConfig, timestamp) {
  const pipelineEntry = {
    type: 'product_idea',
    brand: content.brandKey,
    timestamp,
    product: {
      name: content.name,
      description: content.description,
      category: content.category,
      estimatedRevenue: content.estimatedRevenue,
      sourceContent: content.sourceContent
    },
    status: 'idea'
  };

  // Add to T-shirt designs sheet if it's apparel
  if (content.category === 'apparel' && process.env.REACT_APP_SHEET_TSHIRT_DESIGNS_CANVA_BULK) {
    await addToDesignSheet(process.env.REACT_APP_SHEET_TSHIRT_DESIGNS_CANVA_BULK, pipelineEntry);
  }

  return { success: true, entry: pipelineEntry };
}

/**
 * Add recipe to pipeline
 */
async function addRecipeToPipeline(content, brandConfig, timestamp) {
  const pipelineEntry = {
    type: 'recipe',
    brand: content.brandKey,
    timestamp,
    recipe: {
      title: content.title,
      ingredients: content.ingredients,
      instructions: content.instructions,
      prepTime: content.prepTime,
      cookTime: content.cookTime,
      servings: content.servings
    },
    status: 'draft'
  };

  // Add to recipe sheet
  if (brandConfig.recipeSheet) {
    await addToRecipeSheet(brandConfig.recipeSheet, pipelineEntry);
  }

  return { success: true, entry: pipelineEntry };
}

/**
 * Add quote to pipeline
 */
async function addQuoteToPipeline(content, brandConfig, timestamp) {
  const pipelineEntry = {
    type: 'quote',
    brand: content.brandKey,
    timestamp,
    quote: {
      text: content.text,
      reference: content.reference,
      category: content.category,
      featured: content.featured
    },
    status: 'active'
  };

  // Add to quotes sheet
  if (brandConfig.quotesSheet) {
    await addToQuoteSheet(brandConfig.quotesSheet, pipelineEntry);
  }

  return { success: true, entry: pipelineEntry };
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Trigger N8N webhook
 */
async function triggerN8NWebhook(webhookType, data) {
  const webhookUrl = N8N_CONFIG.webhooks[webhookType];
  if (!webhookUrl) {
    console.warn(`N8N webhook not configured for: ${webhookType}`);
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(N8N_CONFIG.apiKey && { 'Authorization': `Bearer ${N8N_CONFIG.apiKey}` })
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`N8N webhook failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`N8N webhook error for ${webhookType}:`, error);
    throw error;
  }
}

/**
 * Log to social tracking sheet
 */
async function logToSocialSheet(platform, data) {
  try {
    console.log(`📊 Logging to ${platform} sheet:`, data);
    
    // This would use your Google Sheets API integration
    // For now, we'll just log the action
    return { success: true };
  } catch (error) {
    console.error(`Error logging to ${platform} sheet:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Add to blog sheet
 */
async function addToBlogSheet(sheetId, entry) {
  try {
    console.log('📝 Adding to blog sheet:', entry);
    return { success: true };
  } catch (error) {
    console.error('Error adding to blog sheet:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Add to analytics sheet
 */
async function logToAnalyticsSheet(data) {
  try {
    console.log('📈 Logging to analytics sheet:', data);
    return { success: true };
  } catch (error) {
    console.error('Error logging to analytics sheet:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Add to design sheet
 */
async function addToDesignSheet(sheetId, entry) {
  try {
    console.log('🎨 Adding to design sheet:', entry);
    return { success: true };
  } catch (error) {
    console.error('Error adding to design sheet:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Add to recipe sheet
 */
async function addToRecipeSheet(sheetId, entry) {
  try {
    console.log('🍳 Adding to recipe sheet:', entry);
    return { success: true };
  } catch (error) {
    console.error('Error adding to recipe sheet:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Add to quote sheet
 */
async function addToQuoteSheet(sheetId, entry) {
  try {
    console.log('📖 Adding to quote sheet:', entry);
    return { success: true };
  } catch (error) {
    console.error('Error adding to quote sheet:', error);
    return { success: false, error: error.message };
  }
}

// ========================================
// AI CONTENT GENERATION FUNCTIONS
// ========================================

/**
 * Generate blog from video (placeholder for N8N integration)
 */
async function generateBlogFromVideo(video, brandConfig) {
  console.log('🤖 Generating blog from video:', video.title);
  
  return {
    title: `${video.title} - Complete Guide`,
    content: `Generated blog content based on ${video.title}...`,
    tags: video.tags || [],
    estimatedReadTime: '5 min'
  };
}

/**
 * Generate social posts from video (placeholder for N8N integration)
 */
async function generateSocialPostsFromVideo(video, brandConfig) {
  console.log('📱 Generating social posts from video:', video.title);
  
  return [
    {
      platform: 'instagram',
      content: `Check out my latest adventure! ${video.title} 🌍✈️`,
      hashtags: ['#travel', '#adventure', '#explore']
    },
    {
      platform: 'twitter',
      content: `Just dropped a new video: ${video.title} 🎥`,
      hashtags: ['#travel', '#youtube']
    }
  ];
}

/**
 * Generate Reddit post from video (placeholder for N8N integration)
 */
async function generateRedditPostFromVideo(video, brandConfig) {
  console.log('🔴 Generating Reddit post from video:', video.title);
  
  return {
    title: video.title,
    content: `Hey everyone! Just wanted to share my experience with ${video.title}...`,
    subreddits: brandConfig.subreddits
  };
}

/**
 * Schedule Reddit post (placeholder for N8N integration)
 */
async function scheduleRedditPost(post, subreddits) {
  console.log('📅 Scheduling Reddit post to:', subreddits);
  return { success: true, scheduled: true };
}

// ========================================
// CONFIGURATION AND VALIDATION
// ========================================

/**
 * Validate automation configuration
 */
export const validateAutomationConfig = () => {
  const validation = {
    brands: {},
    socialSheets: {},
    n8nConfig: {},
    overall: { isValid: true, errors: [], warnings: [] }
  };

  // Validate brand configurations
  Object.entries(BRAND_CONFIG).forEach(([brandKey, config]) => {
    const brandValidation = {
      isValid: true,
      configured: [],
      missing: []
    };

    Object.entries(config).forEach(([key, value]) => {
      if (value) {
        brandValidation.configured.push(key);
      } else {
        brandValidation.missing.push(key);
        if (key === 'channelId') {
          brandValidation.isValid = false;
        }
      }
    });

    validation.brands[brandKey] = brandValidation;
  });

  // Validate social sheets
  Object.entries(SOCIAL_SHEETS).forEach(([platform, sheetId]) => {
    validation.socialSheets[platform] = {
      configured: !!sheetId,
      sheetId
    };
  });

  // Validate N8N configuration
  validation.n8nConfig = {
    baseUrl: !!N8N_CONFIG.baseUrl,
    apiKey: !!N8N_CONFIG.apiKey,
    webhooks: Object.entries(N8N_CONFIG.webhooks).reduce((acc, [key, value]) => {
      acc[key] = !!value;
      return acc;
    }, {})
  };

  return validation;
};

// Export all functions and configurations
export default {
  triggerAutomationWorkflow,
  addToContentPipeline,
  validateAutomationConfig,
  BRAND_CONFIG,
  SOCIAL_SHEETS,
  N8N_CONFIG
};

