// src/utils/imageSourcer.js
import driveApiService from '../services/enhanced-driveApi';

/**
 * Enhanced Image Sourcer with Google Drive integration
 * Handles photo search, categorization, and automatic storage
 * FIXED: Resolved naming conflict by renaming class to ImageSourcerClass
 */
class ImageSourcerClass {
  constructor() {
    this.apiKeys = {
      unsplash: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
      pexels: process.env.REACT_APP_PEXELS_API_KEY,
      pixabay: process.env.REACT_APP_PIXABAY_API_KEY
    };
    
    this.categoryMapping = {
      travel: ['travel', 'adventure', 'journey', 'destination', 'vacation', 'explore', 'wanderlust'],
      faith: ['faith', 'prayer', 'church', 'cross', 'bible', 'spiritual', 'worship', 'christian'],
      collective: ['business', 'team', 'collaboration', 'office', 'meeting', 'professional'],
      timezone: ['time', 'clock', 'schedule', 'planning', 'calendar', 'productivity']
    };

    this.cache = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    // Initialize any required services here
    this.initialized = true;
  }

  /**
   * Search for images across multiple platforms
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Array of image results
   */
  async searchImages(query, options = {}) {
    await this.initialize();
    
    const {
      maxResults = 20,
      category = null,
      platforms = ['unsplash', 'pexels'],
      orientation = 'all', // 'landscape', 'portrait', 'square', 'all'
      minWidth = 1920,
      minHeight = 1080
    } = options;

    try {
      const searchPromises = platforms.map(platform => {
        switch (platform) {
          case 'unsplash':
            return this.searchUnsplash(query, { maxResults: Math.ceil(maxResults / platforms.length), orientation, minWidth, minHeight });
          case 'pexels':
            return this.searchPexels(query, { maxResults: Math.ceil(maxResults / platforms.length), orientation, minWidth, minHeight });
          case 'pixabay':
            return this.searchPixabay(query, { maxResults: Math.ceil(maxResults / platforms.length), orientation, minWidth, minHeight });
          default:
            return Promise.resolve([]);
        }
      });

      const results = await Promise.allSettled(searchPromises);
      const allImages = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allImages.push(...result.value);
        } else {
          console.warn(`Search failed for ${platforms[index]}:`, result.reason);
        }
      });

      // Deduplicate and enhance results
      const uniqueImages = this.deduplicateImages(allImages);
      const enhancedImages = uniqueImages.map(img => this.enhanceImageData(img, category));

      // Sort by relevance and quality
      const sortedImages = this.sortImagesByQuality(enhancedImages, query);

      return sortedImages.slice(0, maxResults);
    } catch (error) {
      console.error('Image search failed:', error);
      throw error;
    }
  }

  /**
   * Search Unsplash for images
   */
  async searchUnsplash(query, options = {}) {
    if (!this.apiKeys.unsplash) {
      console.warn('Unsplash API key not configured');
      return [];
    }

    try {
      const { maxResults = 10, orientation = 'all', minWidth = 1920, minHeight = 1080 } = options;
      
      const params = new URLSearchParams({
        query,
        per_page: Math.min(maxResults, 30),
        orientation: orientation === 'all' ? '' : orientation,
        order_by: 'relevance'
      });

      const response = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
        headers: {
          'Authorization': `Client-ID ${this.apiKeys.unsplash}`
        }
      });

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.results
        .filter(photo => photo.width >= minWidth && photo.height >= minHeight)
        .map(photo => ({
          id: `unsplash_${photo.id}`,
          title: photo.description || photo.alt_description || 'Untitled',
          url: photo.urls.full,
          thumbnail: photo.urls.small,
          width: photo.width,
          height: photo.height,
          source: 'unsplash',
          author: photo.user.name,
          authorUrl: photo.user.links.html,
          downloadUrl: photo.links.download,
          tags: photo.tags?.map(tag => tag.title) || [],
          color: photo.color,
          likes: photo.likes,
          quality: this.calculateImageQuality(photo.width, photo.height, photo.likes)
        }));
    } catch (error) {
      console.error('Unsplash search error:', error);
      return [];
    }
  }

  /**
   * Search Pexels for images
   */
  async searchPexels(query, options = {}) {
    if (!this.apiKeys.pexels) {
      console.warn('Pexels API key not configured');
      return [];
    }

    try {
      const { maxResults = 10, orientation = 'all', minWidth = 1920, minHeight = 1080 } = options;
      
      const params = new URLSearchParams({
        query,
        per_page: Math.min(maxResults, 80),
        orientation: orientation === 'all' ? '' : orientation
      });

      const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
        headers: {
          'Authorization': this.apiKeys.pexels
        }
      });

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.photos
        .filter(photo => photo.width >= minWidth && photo.height >= minHeight)
        .map(photo => ({
          id: `pexels_${photo.id}`,
          title: photo.alt || 'Untitled',
          url: photo.src.original,
          thumbnail: photo.src.medium,
          width: photo.width,
          height: photo.height,
          source: 'pexels',
          author: photo.photographer,
          authorUrl: photo.photographer_url,
          downloadUrl: photo.src.original,
          tags: [],
          color: photo.avg_color,
          likes: 0,
          quality: this.calculateImageQuality(photo.width, photo.height, 0)
        }));
    } catch (error) {
      console.error('Pexels search error:', error);
      return [];
    }
  }

  /**
   * Search Pixabay for images
   */
  async searchPixabay(query, options = {}) {
    if (!this.apiKeys.pixabay) {
      console.warn('Pixabay API key not configured');
      return [];
    }

    try {
      const { maxResults = 10, orientation = 'all', minWidth = 1920, minHeight = 1080 } = options;
      
      const params = new URLSearchParams({
        key: this.apiKeys.pixabay,
        q: query,
        image_type: 'photo',
        orientation: orientation === 'all' ? 'all' : orientation,
        min_width: minWidth,
        min_height: minHeight,
        per_page: Math.min(maxResults, 200),
        safesearch: 'true',
        order: 'popular'
      });

      const response = await fetch(`https://pixabay.com/api/?${params}`);

      if (!response.ok) {
        throw new Error(`Pixabay API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.hits.map(photo => ({
        id: `pixabay_${photo.id}`,
        title: photo.tags,
        url: photo.fullHDURL || photo.webformatURL,
        thumbnail: photo.webformatURL,
        width: photo.imageWidth,
        height: photo.imageHeight,
        source: 'pixabay',
        author: photo.user,
        authorUrl: `https://pixabay.com/users/${photo.user}-${photo.user_id}/`,
        downloadUrl: photo.fullHDURL || photo.webformatURL,
        tags: photo.tags.split(', '),
        color: null,
        likes: photo.likes,
        quality: this.calculateImageQuality(photo.imageWidth, photo.imageHeight, photo.likes)
      }));
    } catch (error) {
      console.error('Pixabay search error:', error);
      return [];
    }
  }

  /**
   * Automatically categorize images based on content
   * @param {string} query - Original search query
   * @param {Array} tags - Image tags
   * @returns {string} Suggested category
   */
  suggestCategory(query, tags = []) {
    const allTerms = [query, ...tags].join(' ').toLowerCase();
    
    let bestMatch = 'collective';
    let maxScore = 0;

    Object.entries(this.categoryMapping).forEach(([category, keywords]) => {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (allTerms.includes(keyword.toLowerCase()) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        bestMatch = category;
      }
    });

    return bestMatch;
  }

  /**
   * Search and automatically upload images to Google Drive
   * @param {string} query - Search query
   * @param {Object} options - Search and upload options
   * @param {Object} user - User object for authentication (optional)
   * @returns {Promise<Object>} Search and upload results
   */
  async searchAndUpload(query, options = {}, user = null) {
    await this.initialize();
    
    const {
      maxResults = 10,
      category = null,
      autoCategory = true,
      uploadSelected = false,
      selectedIndices = []
    } = options;

    try {
      // Search for images
      const searchResults = await this.searchImages(query, { maxResults, category });
      
      if (searchResults.length === 0) {
        return {
          success: false,
          message: 'No images found for the search query',
          searchResults: [],
          uploads: []
        };
      }

      // Determine which images to upload
      let imagesToUpload = searchResults;
      if (uploadSelected && selectedIndices.length > 0) {
        imagesToUpload = selectedIndices.map(index => searchResults[index]).filter(Boolean);
      }

      if (imagesToUpload.length === 0) {
        return {
          success: true,
          message: 'Search completed, no images selected for upload',
          searchResults,
          uploads: []
        };
      }

      // Determine category for upload
      const uploadCategory = category || (autoCategory ? this.suggestCategory(query, imagesToUpload[0]?.tags) : 'collective');

      // Extract URLs for batch upload
      const urls = imagesToUpload.map(img => img.downloadUrl || img.url);
      const descriptions = imagesToUpload.map(img => `${img.title} - Source: ${img.source} by ${img.author}`);
      const tags = imagesToUpload.map(img => [...(img.tags || []), query, img.source]);

      // Upload to Google Drive
      const uploadResult = await driveApiService.batchUploadFromUrls(urls, uploadCategory, {
        descriptions,
        tags
      });

      return {
        success: true,
        message: `Successfully uploaded ${uploadResult.totalUploaded} images to ${uploadCategory} folder`,
        searchResults,
        uploads: uploadResult.uploads,
        errors: uploadResult.errors,
        category: uploadCategory,
        totalSearched: searchResults.length,
        totalUploaded: uploadResult.totalUploaded
      };

    } catch (error) {
      console.error('Search and upload failed:', error);
      return {
        success: false,
        message: `Search and upload failed: ${error.message}`,
        searchResults: [],
        uploads: [],
        error: error.message
      };
    }
  }

  /**
   * Get curated images for a specific brand/category
   * @param {string} brand - Brand name
   * @param {string} category - Content category
   * @param {number} maxImages - Maximum number of images
   * @returns {Promise<Array>} Curated images
   */
  async sourceImagesForBrand(brand, category = 'gallery', maxImages = 12) {
    await this.initialize();
    
    const brandQueries = {
      'dax-the-traveler': ['travel adventure', 'wanderlust journey', 'destination explore'],
      'gods-vessel': ['faith spiritual', 'prayer worship', 'christian inspiration'],
      'timezone-travelers': ['time management', 'productivity planning', 'schedule organization'],
      'ani-dax': ['anime style', 'animation art', 'creative design'],
      'anidax': ['anime style', 'animation art', 'creative design'],
      'dax-collective': ['business professional', 'team collaboration', 'modern office']
    };

    const queries = brandQueries[brand] || ['professional business'];
    const imagesPerQuery = Math.ceil(maxImages / queries.length);

    try {
      // If API keys are not configured, return mock data
      const config = this.validateConfiguration();
      if (!config.isValid) {
        console.warn('No API keys configured, returning mock images');
        const mockImages = [
          {
            id: `${brand}-1`,
            url: `https://picsum.photos/400/300?random=${Math.random()}`,
            title: `${brand} Image 1`,
            source: 'sourced',
            category: category
          },
          {
            id: `${brand}-2`,
            url: `https://picsum.photos/400/300?random=${Math.random()}`,
            title: `${brand} Image 2`,
            source: 'sourced',
            category: category
          }
        ];
        return mockImages.slice(0, maxImages);
      }

      const searchPromises = queries.map(query => 
        this.searchImages(query, { 
          maxResults: imagesPerQuery,
          category: this.mapBrandToCategory(brand)
        })
      );

      const results = await Promise.all(searchPromises);
      const allImages = results.flat();

      // Shuffle and limit results
      const shuffled = this.shuffleArray(allImages);
      return shuffled.slice(0, maxImages);
    } catch (error) {
      console.error('Brand image sourcing failed:', error);
      return [];
    }
  }

  /**
   * Map brand to category
   * @param {string} brand - Brand name
   * @returns {string} Category
   */
  mapBrandToCategory(brand) {
    const brandCategoryMap = {
      'dax-the-traveler': 'travel',
      'gods-vessel': 'faith',
      'timezone-travelers': 'timezone',
      'dax-collective': 'collective',
      'anidax': 'anidax',
      'ani-dax': 'anidax',
      'homepage': 'homepage',
      'analytics': 'analytics'
    };

    return brandCategoryMap[brand] || 'collective';
  }

  /**
   * Get folder ID for category
   * @param {string} category - Category name
   * @returns {string|null} Folder ID
   */
  getFolderIdForCategory(category) {
    // Map categories to environment variables
    const categoryFolderMap = {
      'travel': process.env.REACT_APP_DRIVE_DAX_TRAVELER_PHOTOS,
      'faith': process.env.REACT_APP_DRIVE_GODS_VESSEL_PHOTOS,
      'timezone': process.env.REACT_APP_DRIVE_TIMEZONE_TRAVELERS_PHOTOS,
      'collective': process.env.REACT_APP_DRIVE_DAX_HOMEPAGE_PHOTOS,
      'anidax': process.env.REACT_APP_DRIVE_ANI_DAX_PHOTOS,
      'homepage': process.env.REACT_APP_DRIVE_DAX_HOMEPAGE_PHOTOS,
      'analytics': process.env.REACT_APP_DRIVE_DAX_ANALYTICS_IMAGES
    };

    return categoryFolderMap[category] || null;
  }

  /**
   * Helper functions
   */
  
  calculateImageQuality(width, height, likes = 0) {
    const resolution = width * height;
    const aspectRatio = width / height;
    const isGoodAspectRatio = (aspectRatio >= 1.3 && aspectRatio <= 2.0) || (aspectRatio >= 0.5 && aspectRatio <= 0.8);
    
    let score = 0;
    
    // Resolution score (0-40 points)
    if (resolution >= 3840 * 2160) score += 40; // 4K+
    else if (resolution >= 1920 * 1080) score += 30; // Full HD
    else if (resolution >= 1280 * 720) score += 20; // HD
    else score += 10;
    
    // Aspect ratio score (0-20 points)
    if (isGoodAspectRatio) score += 20;
    else score += 10;
    
    // Popularity score (0-40 points)
    if (likes > 1000) score += 40;
    else if (likes > 100) score += 30;
    else if (likes > 10) score += 20;
    else score += 10;
    
    return score;
  }

  deduplicateImages(images) {
    const seen = new Set();
    return images.filter(img => {
      const key = `${img.title}_${img.width}_${img.height}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  enhanceImageData(image, category) {
    return {
      ...image,
      suggestedCategory: category || this.suggestCategory(image.title, image.tags),
      aspectRatio: image.width / image.height,
      isHighRes: image.width >= 1920 && image.height >= 1080,
      sizeCategory: this.getSizeCategory(image.width, image.height)
    };
  }

  sortImagesByQuality(images, query) {
    return images.sort((a, b) => {
      // Primary sort by quality score
      if (a.quality !== b.quality) {
        return b.quality - a.quality;
      }
      
      // Secondary sort by relevance to query
      const aRelevance = this.calculateRelevance(a, query);
      const bRelevance = this.calculateRelevance(b, query);
      
      return bRelevance - aRelevance;
    });
  }

  calculateRelevance(image, query) {
    const queryLower = query.toLowerCase();
    const titleLower = image.title.toLowerCase();
    const tagsLower = image.tags.join(' ').toLowerCase();
    
    let score = 0;
    
    // Exact title match
    if (titleLower.includes(queryLower)) score += 10;
    
    // Tag matches
    const queryWords = queryLower.split(' ');
    queryWords.forEach(word => {
      if (tagsLower.includes(word)) score += 5;
      if (titleLower.includes(word)) score += 3;
    });
    
    return score;
  }

  getSizeCategory(width, height) {
    const resolution = width * height;
    if (resolution >= 3840 * 2160) return '4K';
    if (resolution >= 1920 * 1080) return 'Full HD';
    if (resolution >= 1280 * 720) return 'HD';
    return 'Standard';
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Validate API configuration
   * @returns {Object} Configuration status
   */
  validateConfiguration() {
    const configured = [];
    const missing = [];

    Object.entries(this.apiKeys).forEach(([service, key]) => {
      if (key) {
        configured.push(service);
      } else {
        missing.push(service);
      }
    });

    return {
      isValid: configured.length > 0,
      configured,
      missing,
      totalServices: Object.keys(this.apiKeys).length
    };
  }
}

// Create and export singleton instance with different name to avoid conflict
const ImageSourcer = new ImageSourcerClass();

export { ImageSourcer };
export default ImageSourcer;
