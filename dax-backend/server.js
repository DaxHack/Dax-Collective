// dax-backend/server.js
const express = require("express");
const cors = require("cors");
const rateLimit = require("./middleware/rateLimit");

const config = require("./config/env");
const publicRoutes = require("./routes/publicApi");

// ─── 1. Fail-fast validation for ENABLED features only ─────────────────────
// config/env.js only collects errors for features that are actually turned
// on via env flags. The public baseline (everything off) always passes.
if (config.validationErrors.length > 0) {
  console.error("❌ Startup validation failed:");
  config.validationErrors.forEach((msg) => console.error(`   - ${msg}`));
  process.exit(1);
}

// ─── 2. Conditionally initialize Firebase Admin ─────────────────────────────
// Only required when ENABLE_ADMIN_UPLOADS=true. The public baseline never
// initializes Firebase Admin and never requires a credentials file.
let adminRoutes = null;
let requireAuth = null;
let requireAdmin = null;

if (config.ENABLE_ADMIN_UPLOADS) {
  const {initFirebaseAdmin} = require("./services/firebaseAdmin");
  try {
    initFirebaseAdmin();
    console.log("✅ Firebase Admin initialized (ENABLE_ADMIN_UPLOADS=true).");
  } catch (error) {
    console.error("❌ Firebase Admin failed to initialize:", error.message);
    process.exit(1); // Fail securely — do not start with admin routes half-working.
  }

  requireAuth = require("./middleware/requireAuth");
  requireAdmin = require("./middleware/requireAdmin");
  adminRoutes = require("./routes/adminUploadApi");
} else {
  console.log("ℹ️  Admin uploads disabled (ENABLE_ADMIN_UPLOADS is not 'true'). Admin routes will not be mounted.");
}

// ─── 3. Express App Setup ───────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Body parsers with size limits
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true, limit: "10mb"}));

// Production-safe rate limiting — applies to every request.
app.use(rateLimit);

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} • ${req.method} ${req.path}`);
  next();
});

// ─── 4. Routes ───────────────────────────────────────────────────────────────
// Public baseline — always mounted, no auth required.
app.use("/api", publicRoutes);

// Admin routes — only mounted when ENABLE_ADMIN_UPLOADS=true. If the flag is
// off, /api/admin/* simply does not exist (404), it does not silently
// become public.
if (config.ENABLE_ADMIN_UPLOADS && adminRoutes) {
  app.use("/api/admin", requireAuth, requireAdmin, adminRoutes);
  console.log("✅ Admin routes mounted at /api/admin (requireAuth + requireAdmin).");
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error", err);
  res.status(500).json({
    error: config.NODE_ENV === "development" ? err.message : "Internal server error",
  });
});

// ─── 5. Start the server ────────────────────────────────────────────────────
app.listen(config.PORT, () => {
  console.log(`🚀 Dax Backend listening on port ${config.PORT}`);
  console.log(`📡 Health: http://localhost:${config.PORT}/api/health`);
  console.log(`🔗 CORS allowed origins: ${config.corsOrigins.join(", ")}`);
  console.log(`🔐 Admin uploads: ${config.ENABLE_ADMIN_UPLOADS ? "ENABLED" : "disabled"}`);
  console.log(`📁 Drive automation: ${config.ENABLE_DRIVE_AUTOMATION ? "ENABLED" : "disabled"}`);
});

module.exports = app;
