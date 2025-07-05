// src/utils/imageSourcer.js
// CORRECTED VERSION - Copy this to replace your existing imageSourcer.js

import hybridDriveApi from '../services/hybridDriveApi';
import { uploadApiHelper } from '../services/uploadApiHelper';

// FIXED: Image search configuration with proper API keys
const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const PEXELS_API_KEY = process.env.REACT_APP_PEXELS_API_KEY;
const PIXABAY_API_KEY = process.env.REACT_APP_PIXABAY_API_KEY;

// FIXED: Image source priorities and fallbacks
const IMAGE_SOURCES = {
  unsplash: {
    enabled: !!UNSPLASH_ACCESS_KEY,
    baseUrl: 'https://api.unsplash.com',
    priority: 1,
    quality: 'high',
    attribution: true
  },
  pexels: {
    enabled: !!PEXELS_API_KEY,
    baseUrl: 'https://api.pexels.com/v1',
    priority: 2,
    quality: 'high',
    attribution: true
  },
  pixabay: {
    enabled: !!PIXABAY_API_KEY,
    baseUrl: 'https://pixabay.com/api',
    priority: 3,
    quality: 'medium',
    attribution: false
  },
  drive: {
    enabled: true,
    priority: 0, // Highest priority - use existing images first
    quality: 'high',
    attribution: false
  }
};

/**
 * Enhanced Image Sourcer with multiple providers and smart caching
 */
export class ImageSourcer {
  constructor() {
    this.cache = new Map();
    this.downloadQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Search for images across all available sources
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Array of image results
   */
  async searchImages(query, options = {}) {
    const {
      maxResults = 20,
      category = null,
      orientation = 'all', // 'landscape', 'portrait', 'square', 'all'
      minWidth = 800,
      minHeight = 600,
      includeDrive = true,
      sources = ['drive', 'unsplash', 'pexels', 'pixabay']
    } = options;

    try {
      const allResults = [];
      const cacheKey = `${query}-${JSON.stringify(options)}`;

      // Check cache first
      if (this.cache.has(cacheKey)) {
        console.log('🎯 Returning cached results for:', query);
        return this.cache.get(cacheKey);
      }

      // Search Drive first if enabled
      if (includeDrive && sources.includes('drive')) {
        try {
          const driveResults = await this.searchDriveImages(query, { maxResults: Math.ceil(maxResults / 2), category });
          allResults.push(...driveResults);
        } catch (error) {
          console.warn('Drive search failed:', error);
        }
      }

      // Search external sources
      const externalSources = sources.filter(s => s !== 'drive' && IMAGE_SOURCES[s]?.enabled);
      const remainingResults = maxResults - allResults.length;

      if (remainingResults > 0 && externalSources.length > 0) {
        const resultsPerSource = Math.ceil(remainingResults / externalSources.length);
        
        const searchPromises = externalSources.map(source => 
          this.searchExternalSource(source, query, {
            maxResults: resultsPerSource,
            orientation,
            minWidth,
            minHeight
          }).catch(error => {
            console.warn(`${source} search failed:`, error);
            return [];
          })
        );

        const externalResults = await Promise.all(searchPromises);
        externalResults.forEach(results => allResults.push(...results));
      }

      // Sort by quality and relevance
      const sortedResults = this.sortImageResults(allResults, query);
      const finalResults = sortedResults.slice(0, maxResults);

      // Cache results
      this.cache.set(cacheKey, finalResults);

      return finalResults;
    } catch (error) {
      console.error('Image search error:', error);
      return [];
    }
  }

  /**
   * Search Drive images with smart categorization
   */
  async searchDriveImages(query, options = {}) {
    const { maxResults = 10, category = null, user = null } = options;

    try {
      if (!user) {
        console.warn('No user provided for Drive search');
        return [];
      }

      // Determine category from query if not provided
      const searchCategory = category || this.categorizeQuery(query);
      
      // Search specific category folder
      if (searchCategory) {
        const folderId = hybridDriveApi.getFolderIdForCategory(searchCategory);
        if (folderId) {
          const result = await hybridDriveApi.fetchImages(folderId, user, { maxResults });
          return result.images.map(img => ({
            id: img.id,
            url: img.directLink || img.webViewLink,
            thumbnail: img.thumbnailLink,
            title: img.name,
            description: `From ${searchCategory} collection`,
            source: 'drive',
            category: searchCategory,
            width: img.imageMediaMetadata?.width || 1920,
            height: img.imageMediaMetadata?.height || 1080,
            attribution: null,
            downloadUrl: img.directLink,
            createdAt: img.createdTime
          }));
        }
      }

      // Fallback: search all folders
      const allImages = await hybridDriveApi.searchAllFolders(user, { maxPerFolder: 5 });
      return allImages
        .filter(img => this.matchesQuery(img.name || '', query))
        .slice(0, maxResults)
        .map(img => ({
          id: img.id,
          url: img.directLink || img.webViewLink,
          thumbnail: img.thumbnailLink,
          title: img.name,
          description: `From ${img.brand} collection`,
          source: 'drive',
          category: img.category,
          width: img.imageMediaMetadata?.width || 1920,
          height: img.imageMediaMetadata?.height || 1080,
          attribution: null,
          downloadUrl: img.directLink,
          createdAt: img.createdTime
        }));
    } catch (error) {
      console.error('Drive search error:', error);
      return [];
    }
  }

  /**
   * Search external image source
   */
  async searchExternalSource(source, query, options = {}) {
    const { maxResults = 10, orientation = 'all', minWidth = 800, minHeight = 600 } = options;

    switch (source) {
      case 'unsplash':
        return this.searchUnsplash(query, { maxResults, orientation, minWidth, minHeight });
      case 'pexels':
        return this.searchPexels(query, { maxResults, orientation, minWidth, minHeight });
      case 'pixabay':
        return this.searchPixabay(query, { maxResults, orientation, minWidth, minHeight });
      default:
        return [];
    }
  }

  /**
   * Search Unsplash
   */
  async searchUnsplash(query, options = {}) {
    if (!UNSPLASH_ACCESS_KEY) return [];

    const { maxResults = 10, orientation = 'all' } = options;

    try {
      const params = new URLSearchParams({
        query,
        per_page: Math.min(maxResults, 30),
        ...(orientation !== 'all' && { orientation })
      });

      const response = await fetch(`${IMAGE_SOURCES.unsplash.baseUrl}/search/photos?${params}`, {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });

      if (!response.ok) throw new Error(`Unsplash API error: ${response.statusText}`);

      const data = await response.json();
      
      return data.results.map(photo => ({
        id: photo.id,
        url: photo.urls.regular,
        thumbnail: photo.urls.thumb,
        title: photo.alt_description || photo.description || 'Untitled',
        description: photo.description || photo.alt_description || '',
        source: 'unsplash',
        width: photo.width,
        height: photo.height,
        attribution: {
          author: photo.user.name,
          authorUrl: photo.user.links.html,
          sourceUrl: photo.links.html,
          required: true
        },
        downloadUrl: photo.urls.full,
        createdAt: photo.created_at
      }));
    } catch (error) {
      console.error('Unsplash search error:', error);
      return [];
    }
  }

  /**
   * Search Pexels
   */
  async searchPexels(query, options = {}) {
    if (!PEXELS_API_KEY) return [];

    const { maxResults = 10, orientation = 'all' } = options;

    try {
      const params = new URLSearchParams({
        query,
        per_page: Math.min(maxResults, 80),
        ...(orientation !== 'all' && { orientation })
      });

      const response = await fetch(`${IMAGE_SOURCES.pexels.baseUrl}/search?${params}`, {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      });

      if (!response.ok) throw new Error(`Pexels API error: ${response.statusText}`);

      const data = await response.json();
      
      return data.photos.map(photo => ({
        id: photo.id.toString(),
        url: photo.src.large,
        thumbnail: photo.src.medium,
        title: photo.alt || 'Untitled',
        description: photo.alt || '',
        source: 'pexels',
        width: photo.width,
        height: photo.height,
        attribution: {
          author: photo.photographer,
          authorUrl: photo.photographer_url,
          sourceUrl: photo.url,
          required: true
        },
        downloadUrl: photo.src.original,
        createdAt: null
      }));
    } catch (error) {
      console.error('Pexels search error:', error);
      return [];
    }
  }

  /**
   * Search Pixabay
   */
  async searchPixabay(query, options = {}) {
    if (!PIXABAY_API_KEY) return [];

    const { maxResults = 10, orientation = 'all', minWidth = 800, minHeight = 600 } = options;

    try {
      const params = new URLSearchParams({
        key: PIXABAY_API_KEY,
        q: query,
        image_type: 'photo',
        per_page: Math.min(maxResults, 200),
        min_width: minWidth,
        min_height: minHeight,
        safesearch: 'true'
      });

      const response = await fetch(`${IMAGE_SOURCES.pixabay.baseUrl}/?${params}`);

      if (!response.ok) throw new Error(`Pixabay API error: ${response.statusText}`);

      const data = await response.json();
      
      return data.hits.map(photo => ({
        id: photo.id.toString(),
        url: photo.webformatURL,
        thumbnail: photo.previewURL,
        title: photo.tags,
        description: photo.tags,
        source: 'pixabay',
        width: photo.imageWidth,
        height: photo.imageHeight,
        attribution: {
          author: photo.user,
          authorUrl: `https://pixabay.com/users/${photo.user}-${photo.user_id}/`,
          sourceUrl: photo.pageURL,
          required: false
        },
        downloadUrl: photo.largeImageURL,
        createdAt: null
      }));
    } catch (error) {
      console.error('Pixabay search error:', error);
      return [];
    }
  }

  /**
   * Download and save image to Drive
   */
  async downloadAndSave(imageResult, tags, user, options = {}) {
    const { description = '', location = '', category = null } = options;

    try {
      if (imageResult.source === 'drive') {
        // Already in Drive, just return the result
        return {
          success: true,
          fileId: imageResult.id,
          downloadURL: imageResult.url,
          source: 'drive',
          alreadyInDrive: true
        };
      }

      // Download from external source and upload to Drive
      const uploadResult = await uploadApiHelper.uploadFromUrl(
        imageResult.downloadUrl || imageResult.url,
        tags,
        user,
        {
          description: description || imageResult.description,
          location,
          category: category || this.categorizeQuery(tags),
          attribution: imageResult.attribution,
          originalSource: imageResult.source,
          originalId: imageResult.id
        }
      );

      return {
        success: true,
        ...uploadResult,
        originalImage: imageResult
      };
    } catch (error) {
      console.error('Download and save error:', error);
      throw error;
    }
  }

  /**
   * Batch download multiple images
   */
  async batchDownloadAndSave(imageResults, tags, user, options = {}) {
    const results = [];
    const { maxConcurrent = 3 } = options;

    // Process in batches to avoid overwhelming the API
    for (let i = 0; i < imageResults.length; i += maxConcurrent) {
      const batch = imageResults.slice(i, i + maxConcurrent);
      
      const batchPromises = batch.map(async (imageResult, index) => {
        try {
          const result = await this.downloadAndSave(imageResult, tags, user, {
            ...options,
            description: `Batch download ${i + index + 1}: ${imageResult.title}`
          });
          return { success: true, index: i + index, result };
        } catch (error) {
          return { success: false, index: i + index, error: error.message, imageResult };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Small delay between batches
      if (i + maxConcurrent < imageResults.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return {
      total: imageResults.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  /**
   * Get image recommendations based on existing content
   */
  async getRecommendations(user, options = {}) {
    const { category = null, maxResults = 10, includeExternal = true } = options;

    try {
      // Get existing images to understand user's style
      const existingImages = await hybridDriveApi.searchAllFolders(user, { 
        maxPerFolder: 5, 
        category 
      });

      // Analyze existing images for common themes
      const themes = this.extractThemes(existingImages);
      
      // Search for similar images
      const recommendations = [];
      
      for (const theme of themes.slice(0, 3)) {
        const searchResults = await this.searchImages(theme, {
          maxResults: Math.ceil(maxResults / 3),
          category,
          includeDrive: false, // Don't include existing Drive images
          sources: includeExternal ? ['unsplash', 'pexels', 'pixabay'] : []
        });
        
        recommendations.push(...searchResults);
      }

      return recommendations.slice(0, maxResults);
    } catch (error) {
      console.error('Recommendations error:', error);
      return [];
    }
  }

  /**
   * Helper: Categorize search query
   */
  categorizeQuery(query) {
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('travel') || queryLower.includes('adventure') || queryLower.includes('destination')) {
      return 'travel';
    }
    if (queryLower.includes('faith') || queryLower.includes('god') || queryLower.includes('spiritual')) {
      return 'faith';
    }
    if (queryLower.includes('food') || queryLower.includes('recipe') || queryLower.includes('cooking')) {
      return 'food';
    }
    if (queryLower.includes('productivity') || queryLower.includes('timezone') || queryLower.includes('time')) {
      return 'timezone';
    }
    if (queryLower.includes('design') || queryLower.includes('tshirt') || queryLower.includes('apparel')) {
      return 'design';
    }
    
    return 'collective';
  }

  /**
   * Helper: Check if image name matches query
   */
  matchesQuery(imageName, query) {
    const nameWords = imageName.toLowerCase().split(/[\s\-_]+/);
    const queryWords = query.toLowerCase().split(/[\s\-_]+/);
    
    return queryWords.some(queryWord => 
      nameWords.some(nameWord => 
        nameWord.includes(queryWord) || queryWord.includes(nameWord)
      )
    );
  }

  /**
   * Helper: Sort image results by relevance and quality
   */
  sortImageResults(results, query) {
    return results.sort((a, b) => {
      // Prioritize Drive images
      if (a.source === 'drive' && b.source !== 'drive') return -1;
      if (b.source === 'drive' && a.source !== 'drive') return 1;
      
      // Then by source priority
      const aPriority = IMAGE_SOURCES[a.source]?.priority || 999;
      const bPriority = IMAGE_SOURCES[b.source]?.priority || 999;
      if (aPriority !== bPriority) return aPriority - bPriority;
      
      // Then by relevance (title/description match)
      const aRelevance = this.calculateRelevance(a, query);
      const bRelevance = this.calculateRelevance(b, query);
      if (aRelevance !== bRelevance) return bRelevance - aRelevance;
      
      // Finally by image quality (resolution)
      const aQuality = (a.width || 0) * (a.height || 0);
      const bQuality = (b.width || 0) * (b.height || 0);
      return bQuality - aQuality;
    });
  }

  /**
   * Helper: Calculate relevance score
   */
  calculateRelevance(image, query) {
    const queryLower = query.toLowerCase();
    const titleLower = (image.title || '').toLowerCase();
    const descLower = (image.description || '').toLowerCase();
    
    let score = 0;
    
    // Exact matches
    if (titleLower.includes(queryLower)) score += 10;
    if (descLower.includes(queryLower)) score += 5;
    
    // Word matches
    const queryWords = queryLower.split(/\s+/);
    queryWords.forEach(word => {
      if (titleLower.includes(word)) score += 3;
      if (descLower.includes(word)) score += 1;
    });
    
    return score;
  }

  /**
   * Helper: Extract themes from existing images
   */
  extractThemes(images) {
    const themes = new Map();
    
    images.forEach(image => {
      const words = (image.name || '').toLowerCase().split(/[\s\-_]+/);
      words.forEach(word => {
        if (word.length > 3) { // Ignore short words
          themes.set(word, (themes.get(word) || 0) + 1);
        }
      });
    });
    
    // Return most common themes
    return Array.from(themes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme]) => theme);
  }

  /**
   * Get available image sources configuration
   */
  getAvailableSources() {
    return Object.entries(IMAGE_SOURCES)
      .filter(([, config]) => config.enabled)
      .map(([name, config]) => ({
        name,
        priority: config.priority,
        quality: config.quality,
        attribution: config.attribution
      }))
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Clear search cache
   */
  clearCache() {
    this.cache.clear();
  }
}

// Create and export singleton instance
const imageSourcer = new ImageSourcer();

export default imageSourcer;

// Export individual functions for convenience
export const {
  searchImages,
  searchDriveImages,
  downloadAndSave,
  batchDownloadAndSave,
  getRecommendations,
  getAvailableSources,
  clearCache
} = imageSourcer;

