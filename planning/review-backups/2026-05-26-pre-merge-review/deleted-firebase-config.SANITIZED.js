// ============================================================
// SANITIZED REVIEW COPY — DO NOT USE DIRECTLY
// Source: dax-main/src/firebase/config.js
// Deleted in commit: f5209aa25 ("Updated structure and components for dashboard integration")
// All real values have been replaced with YOUR_* placeholders.
// ============================================================
//
// REVIEW NOTES:
// - This file used hardcoded credential values instead of process.env variables.
// - The real Firebase config was embedded directly in source code (NOT best practice).
// - If you restore this, rewrite it to use process.env.REACT_APP_FIREBASE_* vars
//   so the values come from your .env file and are not hardcoded.
// - The current app likely uses dax-main/src/config/firebase.js (still tracked).
//   Check that file before considering restoring this one.
// ============================================================

// src/firebase/config.js

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY            || 'YOUR_FIREBASE_API_KEY',
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN        || 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID         || 'YOUR_PROJECT_ID',
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET     || 'YOUR_PROJECT_ID.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId:             process.env.REACT_APP_FIREBASE_APP_ID             || 'YOUR_APP_ID',
  measurementId:     process.env.REACT_APP_FIREBASE_MEASUREMENT_ID     || 'YOUR_MEASUREMENT_ID',
}

export const firebaseApp = initializeApp(firebaseConfig)
export const db          = getFirestore(firebaseApp)
export const auth        = getAuth(firebaseApp)
export const storage     = getStorage(firebaseApp)

// Note: Analytics is initialized separately in utils/analytics.js
