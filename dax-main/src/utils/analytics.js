// src/utils/analytics.js
// FINAL VERSION - GTAG ONLY, NO FIREBASE ANALYTICS

// Initialize gtag tracking
const initializeAnalytics = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('gtag loaded: true');
    return true;
  } else {
    console.log('gtag not available');
    return false;
  }
};

// Public initialize function (for compatibility)
export const initialize = (measurementId) => {
  console.log(`Analytics initialize called with ID: ${measurementId}`);
  return initializeAnalytics();
};

// Track donation button clicks
export const trackDonation = (source = 'unknown', buttonText = 'Keep the Lights On') => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', 'donation_button_click', {
        event_category: 'donation',
        event_label: source,
        button_text: buttonText,
        page_location: window.location.href
      });
      console.log(`Donation tracked: ${source} - ${buttonText}`);
    } catch (error) {
      console.error('Error tracking donation:', error);
    }
  }
};

// Track page views
export const trackPageView = (pageName, pageTitle) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', 'page_view', {
        page_title: pageTitle || document.title,
        page_location: window.location.href,
        page_name: pageName
      });
      console.log(`Page view tracked: ${pageName}`);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }
};

// Track brand page visits
export const trackBrandVisit = (brandName) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', 'brand_visit', {
        event_category: 'navigation',
        event_label: brandName.toLowerCase().replace(/\s+/g, '_'),
        brand_name: brandName,
        page_location: window.location.href
      });
      console.log(`Brand visit tracked: ${brandName}`);
    } catch (error) {
      console.error('Error tracking brand visit:', error);
    }
  }
};

// Track gallery interactions
export const trackGalleryInteraction = (action, imageId = null, folderId = null) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', 'gallery_interaction', {
        event_category: 'engagement',
        event_label: action,
        image_id: imageId,
        folder_id: folderId,
        page_location: window.location.href
      });
      console.log(`Gallery interaction tracked: ${action}`);
    } catch (error) {
      console.error('Error tracking gallery interaction:', error);
    }
  }
};

// Track external link clicks
export const trackExternalLink = (url, linkText, source = 'unknown') => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', 'click', {
        event_category: 'outbound_link',
        event_label: url,
        link_text: linkText,
        link_source: source,
        page_location: window.location.href
      });
      console.log(`External link tracked: ${url}`);
    } catch (error) {
      console.error('Error tracking external link:', error);
    }
  }
};

// Track social media clicks
export const trackSocialClick = (platform, action = 'click') => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', 'social_interaction', {
        event_category: 'social',
        event_label: platform.toLowerCase(),
        social_platform: platform,
        social_action: action,
        page_location: window.location.href
      });
      console.log(`Social interaction tracked: ${platform} - ${action}`);
    } catch (error) {
      console.error('Error tracking social interaction:', error);
    }
  }
};

// Track user engagement
export const trackEngagement = (action, category = 'engagement', value = 1) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', action, {
        event_category: category,
        value: value,
        page_location: window.location.href
      });
      console.log(`Engagement tracked: ${category} - ${action}`);
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  }
};

// Track errors
export const trackError = (errorMessage, errorSource = 'unknown') => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', 'exception', {
        description: errorMessage,
        fatal: false,
        error_source: errorSource,
        page_location: window.location.href
      });
      console.log(`Error tracked: ${errorMessage}`);
    } catch (error) {
      console.error('Error tracking error:', error);
    }
  }
};

// Track custom events
export const trackCustomEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', eventName, {
        ...parameters,
        page_location: window.location.href
      });
      console.log(`Custom event tracked: ${eventName}`, parameters);
    } catch (error) {
      console.error('Error tracking custom event:', error);
    }
  }
};

// Utility to check if analytics is loaded
export const isAnalyticsLoaded = () => {
  return typeof window !== 'undefined' && !!window.gtag;
};

// Export all tracking functions as a single object for convenience
export const analytics = {
  initialize,
  trackDonation,
  trackPage: trackPageView,
  trackBrand: trackBrandVisit,
  trackGallery: trackGalleryInteraction,
  trackExternal: trackExternalLink,
  trackSocial: trackSocialClick,
  trackEngagement,
  trackError,
  trackCustom: trackCustomEvent,
  isLoaded: isAnalyticsLoaded
};

