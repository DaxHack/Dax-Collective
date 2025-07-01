// src/utils/analytics.js
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics'
import { firebaseApp } from '../firebase/config'

let firebaseAnalytics = null

// Initialize Firebase Analytics
const initializeAnalytics = async () => {
  try {
    // Check if analytics is supported in this environment
    const supported = await isSupported()
    if (supported && typeof window !== 'undefined') {
      firebaseAnalytics = getAnalytics(firebaseApp)
      console.log('Firebase Analytics initialized successfully')
    } else {
      console.log('Firebase Analytics not supported in this environment')
    }
  } catch (error) {
    console.error('Error initializing Firebase Analytics:', error)
  }
}

// Initialize analytics when module loads
initializeAnalytics()

// Public initialize function (for compatibility with existing code)
export const initialize = (measurementId) => {
  console.log(`Analytics initialize called with ID: ${measurementId}`)
  // Firebase Analytics gets the measurement ID from the config, so we don't need to do anything here
  // This function exists for compatibility with existing code that calls analytics.initialize()
}

// Track donation button clicks
export const trackDonation = (source = 'unknown', buttonText = 'Keep the Lights On') => {
  if (firebaseAnalytics) {
    try {
      logEvent(firebaseAnalytics, 'donation_button_click', {
        event_category: 'donation',
        event_label: source,
        button_text: buttonText,
        page_location: window.location.href,
        timestamp: new Date().toISOString()
      })
      console.log(`Donation click tracked: ${source} - ${buttonText}`)
    } catch (error) {
      console.error('Error tracking donation:', error)
    }
  }
}

// Track page views
export const trackPageView = (pageName, pageTitle) => {
  if (firebaseAnalytics) {
    try {
      logEvent(firebaseAnalytics, 'page_view', {
        page_title: pageTitle || document.title,
        page_location: window.location.href,
        page_name: pageName,
        timestamp: new Date().toISOString()
      })
      console.log(`Page view tracked: ${pageName}`)
    } catch (error) {
      console.error('Error tracking page view:', error)
    }
  }
}

// Track brand page visits
export const trackBrandVisit = (brandName) => {
  if (firebaseAnalytics) {
    try {
      logEvent(firebaseAnalytics, 'brand_visit', {
        event_category: 'navigation',
        event_label: brandName.toLowerCase().replace(/\s+/g, '_'),
        brand_name: brandName,
        page_location: window.location.href,
        timestamp: new Date().toISOString()
      })
      console.log(`Brand visit tracked: ${brandName}`)
    } catch (error) {
      console.error('Error tracking brand visit:', error)
    }
  }
}

// Track gallery interactions
export const trackGalleryInteraction = (action, imageId = null, folderId = null) => {
  if (firebaseAnalytics) {
    try {
      logEvent(firebaseAnalytics, 'gallery_interaction', {
        event_category: 'engagement',
        event_label: action,
        image_id: imageId,
        folder_id: folderId,
        page_location: window.location.href,
        timestamp: new Date().toISOString()
      })
      console.log(`Gallery interaction tracked: ${action}`)
    } catch (error) {
      console.error('Error tracking gallery interaction:', error)
    }
  }
}

// Track external link clicks
export const trackExternalLink = (url, linkText, source = 'unknown') => {
  if (firebaseAnalytics) {
    try {
      logEvent(firebaseAnalytics, 'click', {
        event_category: 'outbound_link',
        event_label: url,
        link_text: linkText,
        link_source: source,
        page_location: window.location.href,
        timestamp: new Date().toISOString()
      })
      console.log(`External link tracked: ${url}`)
    } catch (error) {
      console.error('Error tracking external link:', error)
    }
  }
}

// Track social media clicks
export const trackSocialClick = (platform, action = 'click') => {
  if (firebaseAnalytics) {
    try {
      logEvent(firebaseAnalytics, 'social_interaction', {
        event_category: 'social',
        event_label: platform.toLowerCase(),
        social_platform: platform,
        social_action: action,
        page_location: window.location.href,
        timestamp: new Date().toISOString()
      })
      console.log(`Social interaction tracked: ${platform} - ${action}`)
    } catch (error) {
      console.error('Error tracking social interaction:', error)
    }
  }
}

// Track user engagement
export const trackEngagement = (action, category = 'engagement', value = 1) => {
  if (firebaseAnalytics) {
    try {
      logEvent(firebaseAnalytics, action, {
        event_category: category,
        value: value,
        page_location: window.location.href,
        timestamp: new Date().toISOString()
      })
      console.log(`Engagement tracked: ${category} - ${action}`)
    } catch (error) {
      console.error('Error tracking engagement:', error)
    }
  }
}

// Track errors
export const trackError = (errorMessage, errorSource = 'unknown') => {
  if (firebaseAnalytics) {
    try {
      logEvent(firebaseAnalytics, 'exception', {
        description: errorMessage,
        fatal: false,
        error_source: errorSource,
        page_location: window.location.href,
        timestamp: new Date().toISOString()
      })
      console.log(`Error tracked: ${errorMessage}`)
    } catch (error) {
      console.error('Error tracking error:', error)
    }
  }
}

// Track custom events
export const trackCustomEvent = (eventName, parameters = {}) => {
  if (firebaseAnalytics) {
    try {
      logEvent(firebaseAnalytics, eventName, {
        ...parameters,
        page_location: window.location.href,
        timestamp: new Date().toISOString()
      })
      console.log(`Custom event tracked: ${eventName}`, parameters)
    } catch (error) {
      console.error('Error tracking custom event:', error)
    }
  }
}

// Utility to check if analytics is loaded
export const isAnalyticsLoaded = () => {
  return firebaseAnalytics !== null
}

// Export all tracking functions as a single object
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
}