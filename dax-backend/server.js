// dax-backend/server.js
const express = require("express");
const cors = require("cors");

const config = require("./config/env");
const rateLimit = require("./middleware/rateLimit");
const publicRoutes = require("./routes/publicApi");
const {initFirebaseAdmin} = require("./services/firebaseAdmin");

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

// ─── 1. Fail-fast validation for ENABLED features only ──────────────────────
// config/env.js only collects errors for features that are actually turned
// on via env flags. The public baseline (everything off) always passes.
if (config.validationErrors.length > 0) {
  console.error("❌ Startup validation failed:");
  config.validationErrors.forEach((msg) => console.error(`   - ${msg}`));
  process.exit(1);
}
config.warnings.forEach((msg) => console.warn(`⚠️  ${msg}`));

// ─── 2. Firebase Admin ──────────────────────────────────────────────────────
// Required when ENABLE_ADMIN_UPLOADS=true: the server refuses to start
// without usable credentials rather than mount admin routes it cannot guard.
// Otherwise optional: without credentials the public baseline still boots,
// and the features that need Firebase (Firestore copy of the waitlist, the
// Sheets proxy) report themselves unavailable. A missing credential never
// grants access to anything.
let firebaseReady = false;
try {
  firebaseReady = initFirebaseAdmin();
} catch (error) {
  if (config.ENABLE_ADMIN_UPLOADS) {
    fail(`Firebase Admin failed to initialize: ${error.message}`);
  }
  console.warn(`⚠️  Firebase Admin not initialized: ${error.message}`);
}

if (config.ENABLE_ADMIN_UPLOADS && !firebaseReady) {
  fail(
      "ENABLE_ADMIN_UPLOADS=true but no Firebase credential source was found. " +
    "Set FIREBASE_SERVICE_ACCOUNT_JSON (deployment secret) or FIREBASE_SERVICE_ACCOUNT_PATH " +
    "(gitignored local file).",
  );
}

// ─── 3. Express App Setup ───────────────────────────────────────────────────
const app = express();

app.disable("x-powered-by");
if (config.TRUST_PROXY > 0) {
  app.set("trust proxy", config.TRUST_PROXY);
}

app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Rate limiting runs before body parsing so throttled requests are cheap.
app.use(rateLimit);

// Body parsers with size limits
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true, limit: "10mb"}));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} • ${req.method} ${req.path}`);
  next();
});

// ─── 4. Routes ──────────────────────────────────────────────────────────────
// Public baseline — always mounted, no auth required.
app.use("/api", publicRoutes);

// Admin routes — only mounted when ENABLE_ADMIN_UPLOADS=true, and always
// behind requireAuth + requireAdmin. With the flag off, /api/admin/* does
// not exist (404); it never silently becomes public.
if (config.ENABLE_ADMIN_UPLOADS) {
  const requireAuth = require("./middleware/requireAuth");
  const requireAdmin = require("./middleware/requireAdmin");
  const adminSheetsRoutes = require("./routes/adminSheetsApi");
  const adminRoutes = require("./routes/adminUploadApi");
  app.use("/api/admin", requireAuth, requireAdmin, adminSheetsRoutes, adminRoutes);
}

// Unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({error: "Not found"});
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({error: "Invalid JSON body"});
  }
  if (err && err.type === "entity.too.large") {
    return res.status(413).json({error: "Request body too large"});
  }
  console.error("❌ Server error", err);
  res.status(500).json({
    error: config.NODE_ENV === "development" ? err.message : "Internal server error",
  });
});

// ─── 5. Start the server ────────────────────────────────────────────────────
// Only listen when run directly (`node server.js`); tests import the app.
if (require.main === module) {
  app.listen(config.PORT, () => {
    console.log(`🚀 Dax Backend listening on port ${config.PORT}`);
    console.log(`📡 Health: http://localhost:${config.PORT}/api/health`);
    console.log(`🔗 CORS allowed origins: ${config.corsOrigins.join(", ")}`);
    const firebaseStatus = firebaseReady ? "initialized" : "not configured (Firestore + Sheets proxy unavailable)";
    const adminStatus = config.ENABLE_ADMIN_UPLOADS ? "ENABLED (requireAuth + requireAdmin)" : "not mounted";
    console.log(`🔥 Firebase Admin: ${firebaseStatus}`);
    console.log(`🔐 Admin routes (/api/admin): ${adminStatus}`);
    console.log(`📁 Drive automation: ${config.ENABLE_DRIVE_AUTOMATION ? "ENABLED" : "disabled"}`);
  });
}

module.exports = app;
