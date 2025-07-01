// src/utils/analytics.js
// Enhanced analytics utility for Dax Collective

// Declare gtag globally to avoid no-inner-declarations ESLint error
// This function will be defined by the Google Analytics script
let gtag = function() {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(arguments);
  }
};

// Initialize Google Analytics
export const initializeAnalytics = (measurementId) => {
  if (typeof window !== 'undefined' && measurementId) {
    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Load gtag script only if not already loaded
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    // Update the global gtag function
    gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', measurementId);

    console.log('Google Analytics initialized with ID:', measurementId);
  }
};

// Track donation button clicks
export const trackDonationClick = (source = 'unknown', buttonText = 'Keep the Lights On') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'donation_button_click', {
      event_category: 'donation',
      event_label: source,
      button_text: buttonText,
      page_location: window.location.href,
      timestamp: new Date().toISOString()
    });

    // Also track as a conversion event (remove the AW- line if you don't have Google Ads conversion tracking)
    window.gtag('event', 'conversion', {
      event_category: 'donation_intent',
      value: 1
    });

    console.log(`Donation click tracked: ${source} - ${buttonText}`);
  }
};

// Track page views
export const trackPageView = (pageName, pageTitle) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageTitle || document.title,
      page_location: window.location.href,
      page_name: pageName,
      timestamp: new Date().toISOString()
    });

    console.log(`Page view tracked: ${pageName}`);
  }
};

// Track brand page visits
export const trackBrandVisit = (brandName) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'brand_visit', {
      event_category: 'navigation',
      event_label: brandName.toLowerCase().replace(/\s+/g, '_'),
      brand_name: brandName,
      page_location: window.location.href,
      timestamp: new Date().toISOString()
    });

    console.log(`Brand visit tracked: ${brandName}`);
  }
};

// Track gallery interactions
export const trackGalleryInteraction = (action, imageId = null, folderId = null) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'gallery_interaction', {
      event_category: 'engagement',
      event_label: action, // 'image_view', 'image_click', 'gallery_load'
      image_id: imageId,
      folder_id: folderId,
      page_location: window.location.href,
      timestamp: new Date().toISOString()
    });

    console.log(`Gallery interaction tracked: ${action}`);
  }
};

// Track external link clicks
export const trackExternalLink = (url, linkText, source = 'unknown') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'outbound_link',
      event_label: url,
      link_text: linkText,
      link_source: source,
      page_location: window.location.href,
      timestamp: new Date().toISOString()
    });

    console.log(`External link tracked: ${url}`);
  }
};

// Track social media clicks
export const trackSocialClick = (platform, action = 'click') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'social_interaction', {
      event_category: 'social',
      event_label: platform.toLowerCase(),
      social_platform: platform,
      social_action: action,
      page_location: window.location.href,
      timestamp: new Date().toISOString()
    });

    console.log(`Social interaction tracked: ${platform} - ${action}`);
  }
};

// Track user engagement
export const trackEngagement = (action, category = 'engagement', value = 1) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      value: value,
      page_location: window.location.href,
      timestamp: new Date().toISOString()
    });

    console.log(`Engagement tracked: ${category} - ${action}`);
  }
};

// Track errors
export const trackError = (errorMessage, errorSource = 'unknown') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: errorMessage,
      fatal: false,
      error_source: errorSource,
      page_location: window.location.href,
      timestamp: new Date().toISOString()
    });

    console.log(`Error tracked: ${errorMessage}`);
  }
};

// Track custom events
export const trackCustomEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      page_location: window.location.href,
      timestamp: new Date().toISOString()
    });

    console.log(`Custom event tracked: ${eventName}`, parameters);
  }
};

// Utility to check if analytics is loaded
export const isAnalyticsLoaded = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Export all tracking functions as a single object
export const analytics = {
  initialize: initializeAnalytics,
  trackDonation: trackDonationClick,
  trackPage: trackPageView,
  trackBrand: trackBrandVisit,
  trackGallery: trackGalleryInteraction,
  trackExternal: trackExternalLink,
  trackSocial: trackSocialClick,
  trackEngagement: trackEngagement,
  trackError: trackError,
  trackCustom: trackCustomEvent,
  isLoaded: isAnalyticsLoaded
};