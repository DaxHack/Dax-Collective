// src/config/firebase.js
// CLEAN VERSION - NO FIREBASE ANALYTICS

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "placeholder-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "dax-collective.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "dax-collective",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "dax-collective.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:000000000000:web:placeholder",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || ""
}

// True only when a real Firebase web config was supplied at build time.
// Without it sign-in cannot work, and admin-only screens stay hidden.
export const isFirebaseConfigured = Boolean(process.env.REACT_APP_FIREBASE_API_KEY)

let firebaseApp, db, auth, storage

try {
  firebaseApp = initializeApp(firebaseConfig)
  db = getFirestore(firebaseApp)
  auth = getAuth(firebaseApp)
  storage = getStorage(firebaseApp)
} catch (error) {
  console.warn('Firebase initialization failed (API keys not configured):', error.message)
  firebaseApp = null
  db = null
  auth = null
  storage = null
}

export { firebaseApp, db, auth, storage }

// NO ANALYTICS - Using direct gtag in index.html instead
export const analytics = null

// Frontend environment variables
export const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || ""
export const DAX_TRAVELER_DRIVE_ID = process.env.REACT_APP_DRIVE_DAX_TRAVELER_PHOTOS || ""
