// src/components/YouTubeIntegration.jsx
// ENHANCED VERSION - Real brand data and analytics with intelligent video selection

import React, { useState, useEffect, useCallback } from 'react';
import hybridDriveApi from '../services/hybridDriveApi';
import { triggerAutomationWorkflow, addToContentPipeline } from '../utils/automationConnector';

// Brand configuration with your actual .env variables
const BRAND_CONFIG = {
  'dax-traveler': {
    channelUsername: 'daxthetraveler',
    displayName: 'Dax the Traveler',
    contentType: 'travel',
    color: '#3B82F6',
    showVideosOnPage: true,
    description: 'Personal travel adventures and experiences',
    voiceId: process.env.VOICE_ID_DAX_TRAVELER,
    email: process.env.EMAIL_MAIN
  },
  'timezone-travelers': {
    channelUsername: 'timezone.travelers',
    displayName: 'Timezone Travelers',
    contentType: 'travel-guides',
    color: '#EF4444',
    showVideosOnPage: false,
    description: 'Faceless travel guides and itineraries',
    voiceId: process.env.VOICE_ID_TIMEZONE_TRAVELERS,
    email: process.env.EMAIL_TIMEZONE_TRAVELERS
  },
  'anidax': {
    channelUsername: 'ani.dax',
    displayName: 'AniDax',
    contentType: 'anime',
    color: '#8B5CF6',
    showVideosOnPage: false,
    description: 'Anime content and reviews',
    voiceId: process.env.VOICE_ID_ANIDAX,
    email: process.env.EMAIL_GAMING
  },
  'gods-vessel': {
    channelUsername: 'godsvesselapparel',
    displayName: "God's Vessel",
    contentType: 'faith',
    color: '#10B981',
    showVideosOnPage: false,
    description: 'Faith-based content and merchandise',
    voiceId: process.env.VOICE_ID_GODS_VESSEL,
    email: process.env.EMAIL_GODS_VESSEL
  }
};

// Enhanced YouTube service for direct API calls
class YouTubeService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes cache
  }

  // Check if cache is valid
  isCacheValid(key) {
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    return (Date.now() - cached.timestamp) < this.cacheTimeout;
  }

  // Get channel by username with caching
  async getChannelByUsername(username) {
    if (!username || !this.apiKey) return null;
    
    const cacheKey = `channel_${username}`;
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }
    
    try {
      const response = await fetch(
        `${this.baseUrl}/search?part=snippet&type=channel&q=${username}&key=${this.apiKey}`
      );
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const channelInfo = {
          channelId: data.items[0].id.channelId,
          title: data.items[0].snippet.title,
          thumbnail: data.items[0].snippet.thumbnails.high?.url,
          description: data.items[0].snippet.description
        };
        
        // Cache the result
        this.cache.set(cacheKey, {
          data: channelInfo,
          timestamp: Date.now()
        });
        
        return channelInfo;
      }
      return null;
    } catch (error) {
      console.error('Error fetching channel:', error);
      return null;
    }
  }

  // Get channel stats with caching
  async getChannelStats(channelId) {
    if (!channelId || !this.apiKey) return null;
    
    const cacheKey = `stats_${channelId}`;
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }
    
    try {
      const response = await fetch(
        `${this.baseUrl}/channels?part=statistics,brandingSettings&id=${channelId}&key=${this.apiKey}`
      );
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const stats = data.items[0].statistics;
        const branding = data.items[0].brandingSettings?.channel || {};
        
        const channelStats = {
          subscriberCount: parseInt(stats.subscriberCount || 0),
          videoCount: parseInt(stats.videoCount || 0),
          viewCount: parseInt(stats.viewCount || 0),
          hiddenSubscriberCount: stats.hiddenSubscriberCount,
          keywords: branding.keywords,
          country: branding.country,
          banner: branding.image?.bannerExternalUrl
        };
        
        // Cache the result
        this.cache.set(cacheKey, {
          data: channelStats,
          timestamp: Date.now()
        });
        
        return channelStats;
      }
      return null;
    } catch (error) {
      console.error('Error fetching channel stats:', error);
      return null;
    }
  }

  // Get channel videos with caching and advanced processing
  async getChannelVideos(channelId, maxResults = 10) {
    if (!channelId || !this.apiKey) return [];
    
    const cacheKey = `videos_${channelId}_${maxResults}`;
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }
    
    try {
      // Get uploads playlist
      const channelResponse = await fetch(
        `${this.baseUrl}/channels?part=contentDetails&id=${channelId}&key=${this.apiKey}`
      );
      const channelData = await channelResponse.json();
      
      if (!channelData.items || channelData.items.length === 0) return [];
      
      const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
      
      // Get videos from playlist
      const playlistResponse = await fetch(
        `${this.baseUrl}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${this.apiKey}`
      );
      const playlistData = await playlistResponse.json();
      
      if (!playlistData.items) return [];
      
      const videoIds = playlistData.items.map(item => item.snippet.resourceId.videoId);
      
      // Get detailed video stats
      const videosResponse = await fetch(
        `${this.baseUrl}/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(',')}&key=${this.apiKey}`
      );
      const videosData = await videosResponse.json();
      
      if (!videosData.items) return [];
      
      // Process videos with enhanced metadata
      const processedVideos = videosData.items.map(video => {
        const duration = this.parseDuration(video.contentDetails.duration);
        
        return {
          videoId: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url,
          publishedAt: video.snippet.publishedAt,
          viewCount: parseInt(video.statistics.viewCount || 0),
          likeCount: parseInt(video.statistics.likeCount || 0),
          commentCount: parseInt(video.statistics.commentCount || 0),
          duration: video.contentDetails.duration,
          durationSeconds: duration,
          durationFormatted: this.formatDuration(duration),
          location: this.extractLocation(video.snippet.title, video.snippet.description),
          travelType: this.categorizeTravelContent(video.snippet.description),
          tags: video.snippet.tags || [],
          isShort: duration <= 60,
          embedUrl: `https://www.youtube.com/embed/${video.id}`,
          watchUrl: `https://www.youtube.com/watch?v=${video.id}`,
          score: this.calculateVideoScore(video, duration)
        };
      });
      
      // Categorize videos
      const categorizedVideos = this.categorizeVideos(processedVideos);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: categorizedVideos,
        timestamp: Date.now()
      });
      
      return categorizedVideos;
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      return [];
    }
  }

  // Parse ISO 8601 duration to seconds
  parseDuration(duration) {
    if (!duration) return 0;
    
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Format duration for display
  formatDuration(seconds) {
    if (seconds < 60) return `0:${seconds.toString().padStart(2, '0')}`;
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Extract location from title and description
  extractLocation(title, description) {
    const locationPatterns = [
      /in ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*) adventure/i,
      /exploring ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
      /travel(?:ing)? (?:to|in) ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i
    ];
    
    // Check title first
    for (const pattern of locationPatterns) {
      const match = title.match(pattern);
      if (match) return match[1];
    }
    
    // Then check description
    if (description) {
      const firstParagraph = description.split('\n')[0];
      for (const pattern of locationPatterns) {
        const match = firstParagraph.match(pattern);
        if (match) return match[1];
      }
    }
    
    return null;
  }

  // Categorize travel content
  categorizeTravelContent(description) {
    if (!description) return 'general';
    
    const categories = {
      adventure: ['adventure', 'hiking', 'exploring', 'backpacking', 'trekking'],
      city: ['city', 'urban', 'downtown', 'metropolis', 'capital'],
      nature: ['nature', 'wildlife', 'beach', 'mountain', 'forest', 'ocean', 'lake'],
      culture: ['culture', 'local', 'food', 'cuisine', 'history', 'museum', 'tradition'],
      tips: ['tips', 'guide', 'how to', 'advice', 'hack', 'budget', 'planning'],
      vlog: ['vlog', 'daily', 'experience', 'journey', 'diary']
    };
    
    const desc = description.toLowerCase();
    const matchedCategories = [];
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => desc.includes(keyword))) {
        matchedCategories.push(category);
      }
    }
    
    return matchedCategories.length > 0 ? matchedCategories[0] : 'general';
  }

  // Calculate video score for ranking
  calculateVideoScore(video, durationSeconds) {
    const viewCount = parseInt(video.statistics.viewCount || 0);
    const likeCount = parseInt(video.statistics.likeCount || 0);
    const commentCount = parseInt(video.statistics.commentCount || 0);
    
    // Calculate days since publication
    const publishDate = new Date(video.snippet.publishedAt);
    const daysSincePublish = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Engagement rate (likes + comments per view)
    const engagementRate = viewCount > 0 ? (likeCount + commentCount) / viewCount : 0;
    
    // Scoring algorithm (weighted)
    const viewScore = Math.log(viewCount + 1) * 0.35;
    const engagementScore = engagementRate * 10000 * 0.25;
    const recencyScore = Math.max(0, 30 - daysSincePublish) / 30 * 10 * 0.25;
    const durationScore = this.getDurationScore(durationSeconds) * 0.15;
    
    return viewScore + engagementScore + recencyScore + durationScore;
  }

  // Get duration score (prefer optimal lengths)
  getDurationScore(seconds) {
    if (seconds <= 60) {
      // Shorts: prefer 30-60 seconds
      return seconds >= 30 ? 10 : 5;
    } else {
      // Longform: prefer 10-20 minutes
      const minutes = seconds / 60;
      if (minutes >= 10 && minutes <= 20) return 10;
      if (minutes >= 5 && minutes <= 30) return 7;
      return 3;
    }
  }

  // Categorize videos into different types
  categorizeVideos(videos) {
    // Separate shorts and longform
    const shorts = videos.filter(video => video.isShort);
    const longform = videos.filter(video => !video.isShort);
    
    // Sort by score
    shorts.sort((a, b) => b.score - a.score);
    longform.sort((a, b) => b.score - a.score);
    
    // Get featured video (highest scoring longform)
    const featured = longform.length > 0 ? longform[0] : null;
    
    // Get top shorts
    const topShorts = shorts.slice(0, 3);
    
    // Categorize by travel type
    const byCategory = {};
    videos.forEach(video => {
      if (!byCategory[video.travelType]) {
        byCategory[video.travelType] = [];
      }
      byCategory[video.travelType].push(video);
    });
    
    // Sort each category by score
    Object.keys(byCategory).forEach(category => {
      byCategory[category].sort((a, b) => b.score - a.score);
    });
    
    return {
      all: videos,
      shorts,
      longform,
      featured,
      topShorts,
      byCategory
    };
  }

  // Format number for display
  formatNumber(num) {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }
}

const YouTubeIntegration = ({ brandKey = 'dax-traveler', onDataLoaded = null, displayMode = 'full' }) => {
  const [selectedBrand, setSelectedBrand] = useState(brandKey);
  const [brandData, setBrandData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [syncResults, setSyncResults] = useState(null);
  const [automationLogs, setAutomationLogs] = useState([]);
  const [youtubeService] = useState(new YouTubeService());

  // Load brand data on mount and when selected brand changes
  useEffect(() => {
    loadBrandData(selectedBrand);
  }, [selectedBrand]);

  // Load data for a specific brand
  const loadBrandData = async (brandKey) => {
    setIsLoading(true);
    
    try {
      const config = BRAND_CONFIG[brandKey];
      if (!config) throw new Error(`Brand configuration not found for ${brandKey}`);
      
      // Try hybrid API first, fallback to direct API
      let videos = await hybridDriveApi.fetchYouTubeVideos(brandKey, 10);
      let stats = await hybridDriveApi.getYouTubeChannelStats(brandKey);
      let channelInfo = null;
      
      // Fallback to direct YouTube API if hybrid fails
      if ((!videos || !stats) && config.channelUsername) {
        channelInfo = await youtubeService.getChannelByUsername(config.channelUsername);
        if (channelInfo) {
          if (!videos) {
            videos = await youtubeService.getChannelVideos(channelInfo.channelId, 10);
          }
          if (!stats) {
            stats = await youtubeService.getChannelStats(channelInfo.channelId);
          }
        }
      }
      
      const brandDataResult = {
        ...config,
        videos: videos || [],
        stats: stats || { subscriberCount: 0, videoCount: 0, viewCount: 0 },
        channelInfo: channelInfo || {},
        status: videos ? 'connected' : 'disconnected',
        lastSync: new Date().toISOString()
      };
      
      setBrandData(prev => ({
        ...prev,
        [brandKey]: brandDataResult
      }));
      
      // Notify parent component if callback provided
      if (onDataLoaded && typeof onDataLoaded === 'function') {
        onDataLoaded(brandDataResult);
      }
      
      return brandDataResult;
    } catch (error) {
      console.error(`Error loading brand data for ${brandKey}:`, error);
      
      setBrandData(prev => ({
        ...prev,
        [brandKey]: {
          ...BRAND_CONFIG[brandKey],
          videos: [],
          stats: { subscriberCount: 0, videoCount: 0, viewCount: 0 },
          status: 'error',
          error: error.message
        }
      }));
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Sync a single brand
  const syncSingleBrand = async (brandKey) => {
    setIsLoading(true);
    
    try {
      const result = await loadBrandData(brandKey);
      
      if (result && result.videos.length > 0) {
        // Trigger automation
        const automationResult = await triggerAutomationWorkflow('youtube_sync', {
          brandKey,
          videos: result.videos,
          channelStats: result.stats,
          syncType: 'single'
        });

        if (automationResult.success) {
          setAutomationLogs(prev => [automationResult.log, ...prev.slice(0, 9)]);
        }

        // Add to content pipeline
        for (const video of result.videos.slice(0, 3)) {
          await addToContentPipeline('youtube_video', {
            brandKey,
            ...video
          });
        }
      }

      return { success: true, videos: result?.videos?.length || 0, stats: result?.stats };
    } catch (error) {
      console.error(`Error syncing ${brandKey}:`, error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sync all brands
  const syncAllBrands = async () => {
    setIsLoading(true);
    
    try {
      const bulkResults = await hybridDriveApi.syncAllYouTubeBrands();
      
      for (const [brandKey, result] of Object.entries(bulkResults)) {
        if (result.success) {
          await loadBrandData(brandKey);
          
          const automationResult = await triggerAutomationWorkflow('youtube_sync', {
            brandKey,
            videos: result.videos,
            channelStats: result.stats,
            syncType: 'bulk'
          });
          
          if (automationResult.success) {
            setAutomationLogs(prev => [automationResult.log, ...prev.slice(0, 9)]);
          }
        }
      }
      
      setSyncResults(bulkResults);
      
    } catch (error) {
      console.error('Bulk sync error:', error);
      setSyncResults({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate content from video
  const generateContentFromVideo = async (video, brandKey) => {
    try {
      const result = await triggerAutomationWorkflow('content_generation', {
        brandKey,
        sourceVideo: video,
        contentTypes: ['blog_post', 'social_posts', 'reddit_post']
      });

      if (result.success) {
        setAutomationLogs(prev => [result.log, ...prev.slice(0, 9)]);
        alert(`Content generation started for: ${video.title}`);
      }
    } catch (error) {
      console.error('Content generation error:', error);
      alert(`Error generating content: ${error.message}`);
    }
  };

  // Schedule content distribution
  const scheduleContentDistribution = async (brandKey) => {
    try {
      const brand = brandData[brandKey];
      if (!brand || !brand.videos.length) return;

      const result = await triggerAutomationWorkflow('social_distribution', {
        brandKey,
        platforms: ['instagram', 'tiktok', 'twitter', 'facebook'],
        contentType: 'video_promotion',
        videos: brand.videos.slice(0, 3)
      });

      if (result.success) {
        setAutomationLogs(prev => [result.log, ...prev.slice(0, 9)]);
        alert(`Content distribution scheduled for ${brand.displayName}`);
      }
    } catch (error) {
      console.error('Content distribution error:', error);
      alert(`Error scheduling distribution: ${error.message}`);
    }
  };

  // Get videos for a specific brand
  const getBrandVideos = useCallback((brandKey) => {
    return brandData[brandKey]?.videos || [];
  }, [brandData]);

  // Get featured video for a brand
  const getFeaturedVideo = useCallback((brandKey) => {
    const videos = getBrandVideos(brandKey);
    if (!videos.length) return null;
    
    // Find videos longer than 60 seconds
    const longVideos = videos.filter(v => (v.durationSeconds || 0) > 60);
    if (!longVideos.length) return videos[0];
    
    // Sort by score and return highest
    return [...longVideos].sort((a, b) => (b.score || 0) - (a.score || 0))[0];
  }, [getBrandVideos]);

  // Get top shorts for a brand
  const getTopShorts = useCallback((brandKey, count = 3) => {
    const videos = getBrandVideos(brandKey);
    if (!videos.length) return [];
    
    // Find videos 60 seconds or shorter
    const shorts = videos.filter(v => (v.durationSeconds || 0) <= 60);
    if (!shorts.length) return [];
    
    // Sort by score and return top N
    return [...shorts].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, count);
  }, [getBrandVideos]);

  // Get videos by category
  const getVideosByCategory = useCallback((brandKey, category, count = 5) => {
    const videos = getBrandVideos(brandKey);
    if (!videos.length) return [];
    
    const categoryVideos = videos.filter(v => v.travelType === category);
    if (!categoryVideos.length) return [];
    
    return [...categoryVideos].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, count);
  }, [getBrandVideos]);

  // Format number for display
  const formatNumber = (num) => {
    return youtubeService.formatNumber(num);
  };

  // Get selected brand data
  const selectedBrandData = brandData[selectedBrand];

  // Compact mode for embedding in other components
  if (displayMode === 'compact') {
    return (
      <div className="youtube-integration-compact">
        {isLoading && <div className="loading-indicator">Loading videos...</div>}
        
        {/* Export functions for parent component */}
        {typeof onDataLoaded === 'function' && (
          <div style={{ display: 'none' }}>
            {onDataLoaded({
              brandData: selectedBrandData,
              getBrandVideos,
              getFeaturedVideo,
              getTopShorts,
              getVideosByCategory,
              formatNumber,
              syncBrand: () => syncSingleBrand(selectedBrand),
              isLoading
            })}
          </div>
        )}
      </div>
    );
  }

  // Full display mode
  return (
    <div className="youtube-integration-container" style={{ 
      padding: '20px', 
      backgroundColor: '#1a1a1a', 
      color: 'white', 
      borderRadius: '8px',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div className="header-section" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', marginBottom: '10px' }}>
          YouTube Integration & Automation
        </h2>
        <p style={{ color: '#ccc', fontSize: '14px' }}>
          Manage all 4 brands with automated content generation and distribution
        </p>
      </div>

      {/* Multi-Brand Controls */}
      <div className="controls-section" style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        backgroundColor: '#2a2a2a', 
        borderRadius: '8px' 
      }}>
        <h3 style={{ marginBottom: '15px' }}>Multi-Brand Automation</h3>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <button 
            onClick={syncAllBrands}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              backgroundColor: isLoading ? '#555' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {isLoading ? 'Syncing All Brands...' : '🚀 Sync All Brands'}
          </button>

          <button 
            onClick={() => scheduleContentDistribution(selectedBrand)}
            disabled={isLoading || !selectedBrandData?.videos?.length}
            style={{
              padding: '12px 24px',
              backgroundColor: isLoading ? '#555' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            📱 Schedule Distribution
          </button>
        </div>

        {/* Brand Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '15px' 
        }}>
          {Object.entries(BRAND_CONFIG).map(([key, brand]) => (
            <div 
              key={key}
              onClick={() => setSelectedBrand(key)}
              style={{
                padding: '15px',
                backgroundColor: selectedBrand === key ? '#3a3a3a' : '#2a2a2a',
                border: `2px solid ${selectedBrand === key ? brand.color : 'transparent'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '10px' 
              }}>
                <h4 style={{ margin: 0, color: brand.color }}>
                  {brand.displayName}
                </h4>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  backgroundColor: brandData[key]?.status === 'connected' ? '#4CAF50' : 
                                 brandData[key]?.status === 'error' ? '#f44336' : '#ff9800',
                  color: 'white'
                }}>
                  {brandData[key]?.status || 'pending'}
                </div>
              </div>
              
              {brandData[key]?.stats && (
                <div style={{ fontSize: '12px', color: '#ccc', marginBottom: '10px' }}>
                  <div>{formatNumber(brandData[key].stats.subscriberCount || 0)} subscribers</div>
                  <div>{brandData[key].stats.videoCount || 0} videos</div>
                  <div>{brandData[key].videos?.length || 0} recent videos loaded</div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    syncSingleBrand(key);
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: brand.color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Sync
                </button>
                
                {brandData[key]?.videos?.length > 0 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      generateContentFromVideo(brandData[key].videos[0], key);
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#FF9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Generate Content
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sync Results */}
        {syncResults && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#1a1a1a', 
            borderRadius: '6px' 
          }}>
            <h5 style={{ marginBottom: '10px' }}>Last Sync Results:</h5>
            {Object.entries(syncResults).map(([brand, result]) => (
              <div key={brand} style={{ 
                padding: '5px 0', 
                fontSize: '14px', 
                display: 'flex', 
                justifyContent: 'space-between' 
              }}>
                <strong>{BRAND_CONFIG[brand]?.displayName || brand}:</strong>
                {result.success ? (
                  <span style={{ color: '#4CAF50' }}>
                    ✓ {result.videos?.length || 0} videos, {formatNumber(result.stats?.subscriberCount || 0)} subs
                  </span>
                ) : (
                  <span style={{ color: '#f44336' }}>
                    ✗ {result.error}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Configuration Warning */}
        {!process.env.REACT_APP_YOUTUBE_API_KEY && (
          <div style={{ 
            color: '#ff9800', 
            marginTop: '15px', 
            fontSize: '14px', 
            padding: '10px', 
            backgroundColor: '#2a1a00', 
            borderRadius: '4px' 
          }}>
            ⚠ YouTube API key not configured. Add REACT_APP_YOUTUBE_API_KEY to your .env file.
          </div>
        )}
      </div>

      {/* Selected Brand Details */}
      {selectedBrandData && (
        <div className="brand-details-section" style={{ 
          padding: '20px', 
          backgroundColor: '#2a2a2a', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: selectedBrandData.color, marginBottom: '15px' }}>
            {selectedBrandData.displayName} Details
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px', 
            marginBottom: '20px' 
          }}>
            <div>
              <h5>Channel Stats</h5>
              <div style={{ fontSize: '14px', color: '#ccc' }}>
                <div>Subscribers: {formatNumber(selectedBrandData.stats?.subscriberCount || 0)}</div>
                <div>Total Videos: {selectedBrandData.stats?.videoCount || 0}</div>
                <div>Total Views: {formatNumber(selectedBrandData.stats?.viewCount || 0)}</div>
              </div>
            </div>
            
            <div>
              <h5>Automation Config</h5>
              <div style={{ fontSize: '14px', color: '#ccc' }}>
                <div>Voice ID: {selectedBrandData.voiceId || 'Not set'}</div>
                <div>Email: {selectedBrandData.email || 'Not set'}</div>
                <div>Content Type: {selectedBrandData.contentType}</div>
              </div>
            </div>
          </div>

          {/* Recent Videos */}
          {selectedBrandData.videos && selectedBrandData.videos.length > 0 && (
            <div>
              <h5>Recent Videos</h5>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {selectedBrandData.videos.slice(0, 5).map((video, index) => (
                  <div key={index} style={{ 
                    padding: '10px', 
                    backgroundColor: '#1a1a1a', 
                    marginBottom: '8px', 
                    borderRadius: '4px',
                    display: 'flex',
                    gap: '12px'
                  }}>
                    {/* Thumbnail */}
                    <div style={{ flexShrink: 0, width: '120px', height: '68px', overflow: 'hidden', borderRadius: '4px' }}>
                      <img 
                        src={video.thumbnail || 'https://via.placeholder.com/120x68'} 
                        alt={video.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    
                    {/* Video details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start' 
                      }}>
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            {video.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#ccc', display: 'flex', gap: '8px' }}>
                            <span>{formatNumber(video.viewCount || 0)} views</span>
                            <span>•</span>
                            <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{video.durationFormatted || '0:00'}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => generateContentFromVideo(video, selectedBrand)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#FF9800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Generate Content
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Automation Logs */}
      {automationLogs.length > 0 && (
        <div className="automation-logs-section" style={{ 
          padding: '20px', 
          backgroundColor: '#2a2a2a', 
          borderRadius: '8px' 
        }}>
          <h3 style={{ marginBottom: '15px' }}>Recent Automation Activity</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {automationLogs.map((log, index) => (
              <div key={index} style={{ 
                padding: '10px', 
                backgroundColor: '#1a1a1a', 
                marginBottom: '8px', 
                borderRadius: '4px' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {log.action || 'Automation Task'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#ccc' }}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: log.status === 'success' ? '#4CAF50' : 
                                   log.status === 'error' ? '#f44336' : '#ff9800',
                    color: 'white'
                  }}>
                    {log.status || 'pending'}
                  </div>
                </div>
                {log.message && (
                  <div style={{ 
                    marginTop: '8px', 
                    fontSize: '12px', 
                    color: '#ddd',
                    padding: '8px',
                    backgroundColor: '#222',
                    borderRadius: '4px'
                  }}>
                    {log.message}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export functions for parent component */}
      {typeof onDataLoaded === 'function' && (
        <div style={{ display: 'none' }}>
          {onDataLoaded({
            brandData: selectedBrandData,
            getBrandVideos,
            getFeaturedVideo,
            getTopShorts,
            getVideosByCategory,
            formatNumber,
            syncBrand: () => syncSingleBrand(selectedBrand),
            isLoading
          })}
        </div>
      )}
    </div>
  );
};

export default YouTubeIntegration;

// Export utility functions for direct use
export const getYouTubeService = () => new YouTubeService();

// Export for legacy compatibility
export const getBrandVideos = async (brandKey) => {
  const service = new YouTubeService();
  const channelInfo = await service.getChannelByUsername(BRAND_CONFIG[brandKey]?.channelUsername);
  if (channelInfo) {
    const videos = await service.getChannelVideos(channelInfo.channelId, 10);
    return videos.all || [];
  }
  return [];
};

