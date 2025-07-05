// src/config/firebase.js
// CLEAN VERSION - NO FIREBASE ANALYTICS

import { initializeApp } from 'firebase/app'
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

export const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)
export const storage = getStorage(firebaseApp)

// NO ANALYTICS - Using direct gtag in index.html instead
export const analytics = null

// Frontend environment variables
export const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || ""
export const DAX_TRAVELER_DRIVE_ID = process.env.REACT_APP_DRIVE_DAX_TRAVELER_PHOTOS || ""

