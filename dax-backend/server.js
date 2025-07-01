// dax-backend/server.js
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const admin   = require('firebase-admin');
const uploadRoutes = require('./routes/uploadApi'); // Correct path to your backend routes

// ─── 1. Firebase Admin Initialization ───────────────────────────────────────
// Allow pointing GOOGLE_APPLICATION_CREDENTIALS at your JSON, else use default:
const serviceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || // Use this env var for flexibility
  path.join(__dirname, 'credentials/firebase-adminsdk.json');

// Check if the service account file exists before requiring it
let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error(`Error: Firebase service account file not found at ${serviceAccountPath}. Please ensure it exists or FIREBASE_SERVICE_ACCOUNT_PATH is set correctly.`);
  process.exit(1); // Exit if critical credential is missing
}

if (!admin.apps.length) { // Initialize only if not already initialized
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL, // if you need RTDB
    projectId:   process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET // Crucial for Firebase Storage
  });
}


// ─── 2. Pull in ALL your env-vars (grouped for clarity) ─────────────────────
// ... (all your process.env variables) ...
const {
  // APP & ENV
  PORT = 5000,
  NODE_ENV = 'development',
  FRONTEND_URL,

  // GOOGLE CLOUD & ANALYTICS
  GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_API_KEY,
  GOOGLE_MAPS_KEY,
  GOOGLE_ANALYTICS_ACCOUNT_ID,
  GOOGLE_ANALYTICS_STREAM_ID,
  GOOGLE_ANALYTICS_PROPERTY_ID,
  GOOGLE_ANALYTICS_API_SECRET,

  // GOOGLE OAUTH & DRIVE (These are for the backend's Google API access)
  GOOGLE_CLIENT_ID, // Use GOOGLE_CLIENT_ID for backend
  GOOGLE_CLIENT_SECRET, // Use GOOGLE_CLIENT_SECRET for backend
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_SHEETS_API_KEY,
  BACKEND_GOOGLE_API_KEY, // If you have a separate key for backend server-side calls

  // DRIVE FOLDER IDs (Backend needs these for smart routing)
  DRIVE_FOLDER_TRAVEL,
  DRIVE_FOLDER_FAITH,
  DRIVE_FOLDER_COLLECTIVE,
  DRIVE_FOLDER_TIMEZONE,
  // Add other specific folder IDs if your backend uploadApi.js uses them directly
  // e.g., REACT_APP_DRIVE_DAX_HOMEPAGE_PHOTOS if used in /profile-picture route

  // YOUTUBE
  YOUTUBE_API_KEY,
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,

  // TIKTOK
  TIKTOK_ACCESS_TOKEN,
  TIKTOK_ACCOUNT_ID_ANIDAX,
  TIKTOK_ACCOUNT_ID_DAX_TRAVELER,
  TIKTOK_ACCOUNT_ID_GODS_VESSEL,
  TIKTOK_ACCOUNT_ID_TIMEZONE_TRAVELERS,

  // FACEBOOK
  FACEBOOK_ACCESS_TOKEN,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  FACEBOOK_PAGE_ID_ANIDAX,
  FACEBOOK_PAGE_ID_DAX_TRAVELER,
  FACEBOOK_PAGE_ID_GODS_VESSEL,
  FACEBOOK_PAGE_ID_TIMEZONE_TRAVELERS,

  // INSTAGRAM
  INSTAGRAM_ACCESS_TOKEN,
  INSTAGRAM_APP_ID,
  INSTAGRAM_APP_SECRET,
  INSTAGRAM_ACCOUNT_ID_ANIDAX,
  INSTAGRAM_ACCOUNT_ID_DAX_TRAVELER,
  INSTAGRAM_ACCOUNT_ID_GODS_VESSEL,
  INSTAGRAM_ACCOUNT_ID_TIMEZONE_TRAVELERS,

  // AI / LLM / TTS
  OPENAI_API_KEY,
  CLAUDE_API_KEY,
  OPENROUTER_API_KEY,
  ELEVENLABS_API_KEY,
  MODEL_MIXTRAL,
  MODEL_GEMINI,
  MODEL_CLAUDE,
  MODEL_COMMANDR,
  OPENROUTER_MODEL,
  MODEL_DEEPSEEK,
  MODEL_OPENCHAT,

  // AUTOMATIONS / n8n
  N8N_WEBHOOK_URL,
  N8N_API_KEY,

  // FEATURE TOGGLES & SCHEDULES
  BRAND_ANIDAX_ENABLED,
  BRAND_DAX_TRAVELER_ENABLED,
  BRAND_GODS_VESSEL_ENABLED,
  BRAND_TIMEZONE_TRAVELERS_ENABLED,
  AUTO_POSTING_ENABLED,
  SCHEDULE_ANIDAX_POSTING,
  MAX_POSTS_PER_DAY_ANIDAX

  // …and any other keys you’ll need…
} = process.env;


// ─── 3. Brand-lookup helper for multi-platform IDs ──────────────────────────
function getAccountIds(brand) {
  const B = brand.toUpperCase();
  return {
    tiktok:    process.env[`TIKTOK_ACCOUNT_ID_${B}`],
    facebook:  process.env[`FACEBOOK_PAGE_ID_${B}`],
    instagram: process.env[`INSTAGRAM_ACCOUNT_ID_${B}`],
    youtube:   process.env[`YOUTUBE_CHANNEL_ID_${B}`],
  };
}

// ─── 4. Optional Firebase ID-token guard ───────────────────────────────────
// This authGuard is good, but your uploadApi.js already has verifyAuth middleware.
// You can choose to use this one for all /api routes, or rely on the middleware
// within uploadApi.js for specific routes. For simplicity, let's use the one
// from uploadApi.js directly on its routes.
/*
async function authGuard(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/, '');
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
*/

// ─── 5. Express App Setup ────────────────────────────────────────────────
const app = express();

// Enhanced, environment-aware CORS
const corsOrigins = NODE_ENV === 'production'
  ? ['https://daxcollective.com', 'https://www.daxcollective.com']
  : [FRONTEND_URL || 'http://localhost:3000'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Body parsers with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} • ${req.method} ${req.path}`);
  next();
});

// ─── 6. Routes ────────────────────────────────────────────────────────────
// Mount your upload routes. The authGuard is now handled within uploadApi.js
// for specific routes, or you can add it here to protect all routes under /api
app.use('/api', uploadRoutes); // This will apply all routes from uploadApi.js under /api

// If you ever need a public mount, you can also do:
// app.use('/api/public', uploadRoutes);

// Brand-aware posting endpoint (stub)
app.post('/api/post/:brand', async (req, res) => {
  const ids = getAccountIds(req.params.brand);
  if (Object.values(ids).some(v => !v)) {
    return res.status(400).json({
      error: `Missing one of [tiktok,facebook,instagram,youtube] ID for "${req.params.brand}"`
    });
  }
  try {
    // TODO: call your actual social-post functions here
    return res.json({ success: true, used: ids });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Health check with uptime and memory info
app.get('/api/health', (req, res) => {
  res.json({
    status:      'OK',
    environment: NODE_ENV,
    version:     '1.0.0',
    uptime:      process.uptime(),
    memory:      process.memoryUsage(),
    timestamp:   new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error', err);
  res.status(500).json({
    error: NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// ─── 7. Start the server ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Dax Backend listening on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔗 CORS allowed origins: ${corsOrigins.join(', ')}`);
});
