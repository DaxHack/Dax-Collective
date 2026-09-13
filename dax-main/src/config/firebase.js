// src/config/firebase.js
// CLEAN VERSION - NO FIREBASE ANALYTICS

import { getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || ""
}

const requiredFirebaseEnv = [
  ['apiKey', 'REACT_APP_FIREBASE_API_KEY'],
  ['authDomain', 'REACT_APP_FIREBASE_AUTH_DOMAIN'],
  ['projectId', 'REACT_APP_FIREBASE_PROJECT_ID'],
  ['storageBucket', 'REACT_APP_FIREBASE_STORAGE_BUCKET'],
  ['messagingSenderId', 'REACT_APP_FIREBASE_MESSAGING_SENDER_ID'],
  ['appId', 'REACT_APP_FIREBASE_APP_ID'],
  ['measurementId', 'REACT_APP_FIREBASE_MEASUREMENT_ID']
]

export const missingFirebaseConfig = requiredFirebaseEnv
  .filter(([configKey]) => !String(firebaseConfig[configKey] || '').trim())
  .map(([, envKey]) => envKey)

export const isFirebaseConfigured = missingFirebaseConfig.length === 0

const createFirebaseApp = () => {
  if (!isFirebaseConfigured) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(
        `Firebase client config is incomplete. Missing: ${missingFirebaseConfig.join(', ')}`
      )
    }
    return null
  }

  return getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)
}

export const firebaseApp = createFirebaseApp()
export const db = firebaseApp ? getFirestore(firebaseApp) : null
export const auth = firebaseApp ? getAuth(firebaseApp) : null
export const storage = firebaseApp ? getStorage(firebaseApp) : null

// NO ANALYTICS - Using direct gtag in index.html instead
export const analytics = null

// Frontend environment variables
export const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || ""
export const DAX_TRAVELER_DRIVE_ID = process.env.REACT_APP_DRIVE_DAX_TRAVELER_PHOTOS || ""

