// src/firebase/config.js
// REPLACE THE PLACEHOLDER VALUES BELOW WITH YOUR ACTUAL FIREBASE PROJECT VALUES

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'


  // REPLACE THESE WITH YOUR ACTUAL FIREBASE PROJECT VALUES
  // Get these from: Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyBBo7l2IcO5Y0HFPkGh1qlvU_kF_TPKyC4",
  authDomain: "dax-collective.firebaseapp.com",
  projectId: "dax-collective",
  storageBucket: "dax-collective.firebasestorage.app",
  messagingSenderId: "1045143135628",
  appId: "1:1045143135628:web:461e30f4b783a5835922a9",
  measurementId: "G-KVXQJ21CZW"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)

// Initialize services
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)
export const storage = getStorage(firebaseApp)

// Note: Analytics is initialized separately in utils/analytics.js
