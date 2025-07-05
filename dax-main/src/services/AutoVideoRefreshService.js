// src/services/AutoVideoRefreshService.js
// Automated Video Refresh System - Updates content every few months using APIs

class AutoVideoRefreshService {
  constructor() {
    this.channelId = 'UCuN9RFxD1_PUOci_AEa5DMQ'; // Dax the Traveler channel ID
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.refreshInterval = 3 * 30 * 24 * 60 * 60 * 1000; // 3 months in milliseconds
    this.lastRefresh = localStorage.getItem('lastVideoRefresh') || 0;
    this.cachedVideos = JSON.parse(localStorage.getItem('cachedVideos') || '{}');
    
    // Analytics weights for video selection
    this.selectionCriteria = {
      viewWeight: 0.4,        // 40% based on view count
      recentWeight: 0.3,      // 30% based on recency
      engagementWeight: 0.2,  // 20% based on likes/comments
      durationWeight: 0.1     // 10% based on optimal duration
    };
  }

  // Main refresh function - called automatically
  async refreshVideos() {
    try {
      console.log('🔄 Starting automated video refresh...');
      
      // Check if refresh is needed
      if (!this.shouldRefresh()) {
        console.log('⏰ Refresh not needed yet');
        return this.cachedVideos;
      }

      // Fetch latest videos from YouTube API
      const allVideos = await this.fetchAllVideos();
      
      // Analyze and categorize videos
      const categorizedVideos = await this.categorizeVideos(allVideos);
      
      // Select best videos using analytics
      const selectedVideos = this.selectBestVideos(categorizedVideos);
      
      // Cache the results
      this.cacheResults(selectedVideos);
      
      console.log('✅ Video refresh completed successfully');
      return selectedVideos;
      
    } catch (error) {
      console.error('❌ Video refresh failed:', error);
      return this.cachedVideos; // Return cached data on failure
    }
  }

  // Check if refresh is needed (every 3 months)
  shouldRefresh() {
    const now = Date.now();
    const timeSinceLastRefresh = now - parseInt(this.lastRefresh);
    return timeSinceLastRefresh > this.refreshInterval;
  }

  // Fetch all videos from YouTube API
  async fetchAllVideos() {
    const videos = [];
    let nextPageToken = '';
    
    do {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
        `key=${this.apiKey}&` +
        `channelId=${this.channelId}&` +
        `part=snippet&` +
        `order=date&` +
        `maxResults=50&` +
        `pageToken=${nextPageToken}`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Get detailed statistics for each video
      const videoIds = data.items.map(item => item.id.videoId).filter(Boolean);
      const detailedVideos = await this.getVideoDetails(videoIds);
      
      videos.push(...detailedVideos);
      nextPageToken = data.nextPageToken;
      
    } while (nextPageToken && videos.length < 200); // Limit to prevent excessive API calls
    
    return videos;
  }

  // Get detailed video information including statistics
  async getVideoDetails(videoIds) {
    if (!videoIds.length) return [];
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?` +
      `key=${this.apiKey}&` +
      `id=${videoIds.join(',')}&` +
      `part=snippet,statistics,contentDetails`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.items.map(this.formatVideoData);
  }

  // Format video data for consistent structure
  formatVideoData(video) {
    const duration = this.parseDuration(video.contentDetails.duration);
    const publishedDate = new Date(video.snippet.publishedAt);
    
    return {
      videoId: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default.url,
      publishedAt: publishedDate,
      duration: duration,
      durationFormatted: this.formatDuration(duration),
      views: parseInt(video.statistics.viewCount || 0),
      likes: parseInt(video.statistics.likeCount || 0),
      comments: parseInt(video.statistics.commentCount || 0),
      tags: video.snippet.tags || [],
      
      // Analytics scores
      viewScore: 0,
      recentScore: 0,
      engagementScore: 0,
      durationScore: 0,
      totalScore: 0
    };
  }

  // Parse YouTube duration format (PT15M33S) to seconds
  parseDuration(duration) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Format duration in seconds to readable format
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  // Categorize videos into longform and shorts
  async categorizeVideos(videos) {
    const longformVideos = [];
    const shortVideos = [];
    
    videos.forEach(video => {
      // Calculate analytics scores
      video.viewScore = this.calculateViewScore(video, videos);
      video.recentScore = this.calculateRecentScore(video);
      video.engagementScore = this.calculateEngagementScore(video);
      video.durationScore = this.calculateDurationScore(video);
      
      // Calculate total score
      video.totalScore = 
        (video.viewScore * this.selectionCriteria.viewWeight) +
        (video.recentScore * this.selectionCriteria.recentWeight) +
        (video.engagementScore * this.selectionCriteria.engagementWeight) +
        (video.durationScore * this.selectionCriteria.durationWeight);
      
      // Categorize by duration (shorts are typically under 60 seconds)
      if (video.duration <= 60) {
        shortVideos.push(video);
      } else {
        longformVideos.push(video);
      }
    });
    
    // Sort by total score (highest first)
    longformVideos.sort((a, b) => b.totalScore - a.totalScore);
    shortVideos.sort((a, b) => b.totalScore - a.totalScore);
    
    return { longformVideos, shortVideos };
  }

  // Calculate view score (normalized)
  calculateViewScore(video, allVideos) {
    const maxViews = Math.max(...allVideos.map(v => v.views));
    return maxViews > 0 ? video.views / maxViews : 0;
  }

  // Calculate recency score (newer videos get higher scores)
  calculateRecentScore(video) {
    const now = Date.now();
    const videoAge = now - video.publishedAt.getTime();
    const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
    return Math.max(0, 1 - (videoAge / maxAge));
  }

  // Calculate engagement score (likes + comments relative to views)
  calculateEngagementScore(video) {
    if (video.views === 0) return 0;
    const engagementRate = (video.likes + video.comments) / video.views;
    return Math.min(1, engagementRate * 100); // Cap at 1.0
  }

  // Calculate duration score (optimal durations get higher scores)
  calculateDurationScore(video) {
    if (video.duration <= 60) {
      // For shorts: 30-60 seconds is optimal
      return video.duration >= 30 ? 1 : video.duration / 30;
    } else {
      // For longform: 10-20 minutes is optimal
      const optimalMin = 10 * 60; // 10 minutes
      const optimalMax = 20 * 60; // 20 minutes
      
      if (video.duration >= optimalMin && video.duration <= optimalMax) {
        return 1;
      } else if (video.duration < optimalMin) {
        return video.duration / optimalMin;
      } else {
        return Math.max(0.3, optimalMax / video.duration);
      }
    }
  }

  // Select the best videos for display
  selectBestVideos(categorizedVideos) {
    const { longformVideos, shortVideos } = categorizedVideos;
    
    // Select top longform video for featured spot
    const featuredVideo = longformVideos[0];
    
    // Select top 3 alternative longform videos
    const alternativeLongform = longformVideos.slice(1, 4);
    
    // Select top 3 shorts
    const topShorts = shortVideos.slice(0, 3);
    
    return {
      featured: featuredVideo ? this.formatForDisplay(featuredVideo, 'featured') : null,
      alternativeFeatured: alternativeLongform.map(video => this.formatForDisplay(video, 'alternative')),
      shorts: topShorts.map(video => this.formatForDisplay(video, 'short')),
      lastUpdated: new Date().toISOString(),
      analytics: {
        totalVideosAnalyzed: longformVideos.length + shortVideos.length,
        longformCount: longformVideos.length,
        shortsCount: shortVideos.length,
        selectionCriteria: this.selectionCriteria
      }
    };
  }

  // Format video for display in the component
  formatForDisplay(video, type) {
    const baseFormat = {
      videoId: video.videoId,
      title: video.title,
      description: video.description.substring(0, 200) + '...',
      duration: video.durationFormatted,
      views: this.formatViews(video.views),
      thumbnail: video.thumbnail,
      publishedAt: video.publishedAt,
      score: Math.round(video.totalScore * 100) / 100
    };

    if (type === 'featured') {
      return {
        ...baseFormat,
        location: this.extractLocation(video.title, video.description),
        date: this.formatDate(video.publishedAt),
        category: this.extractCategory(video.title, video.tags)
      };
    }

    if (type === 'short') {
      return {
        ...baseFormat,
        category: this.extractCategory(video.title, video.tags)
      };
    }

    return baseFormat;
  }

  // Format view count for display
  formatViews(views) {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  }

  // Extract location from title or description
  extractLocation(title, description) {
    const locations = [
      'Honduras', 'Puerto Rico', 'Dubai', 'Spain', 'Toronto', 'California',
      'Barcelona', 'Madrid', 'Roatan', 'Europe', 'Canada', 'USA'
    ];
    
    const text = (title + ' ' + description).toLowerCase();
    const foundLocation = locations.find(location => 
      text.includes(location.toLowerCase())
    );
    
    return foundLocation || 'Adventure Destination';
  }

  // Extract category from title and tags
  extractCategory(title, tags) {
    const categories = {
      'travel tips': ['tip', 'hack', 'guide', 'how to'],
      'adventure': ['adventure', 'explore', 'journey'],
      'food': ['food', 'eat', 'restaurant', 'cuisine'],
      'culture': ['culture', 'local', 'tradition'],
      'budget': ['budget', 'cheap', 'affordable', 'money']
    };
    
    const text = (title + ' ' + tags.join(' ')).toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }
    
    return 'Travel Experience';
  }

  // Format date for display
  formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }

  // Cache results to localStorage
  cacheResults(videos) {
    localStorage.setItem('cachedVideos', JSON.stringify(videos));
    localStorage.setItem('lastVideoRefresh', Date.now().toString());
    this.cachedVideos = videos;
    this.lastRefresh = Date.now();
  }

  // Get cached videos (fallback)
  getCachedVideos() {
    return this.cachedVideos;
  }

  // Force refresh (manual trigger)
  async forceRefresh() {
    this.lastRefresh = 0; // Reset last refresh time
    return await this.refreshVideos();
  }

  // Initialize automatic refresh
  startAutoRefresh() {
    // Check immediately on startup
    this.refreshVideos();
    
    // Set up periodic refresh (check daily, refresh if needed)
    setInterval(() => {
      this.refreshVideos();
    }, 24 * 60 * 60 * 1000); // Check daily
  }

  // Get refresh status
  getRefreshStatus() {
    const now = Date.now();
    const timeSinceLastRefresh = now - parseInt(this.lastRefresh);
    const timeUntilNextRefresh = this.refreshInterval - timeSinceLastRefresh;
    
    return {
      lastRefresh: new Date(parseInt(this.lastRefresh)),
      nextRefresh: new Date(now + timeUntilNextRefresh),
      daysUntilRefresh: Math.ceil(timeUntilNextRefresh / (24 * 60 * 60 * 1000)),
      isRefreshNeeded: this.shouldRefresh()
    };
  }
}

// Export singleton instance
export const videoRefreshService = new AutoVideoRefreshService();
export default AutoVideoRefreshService;

