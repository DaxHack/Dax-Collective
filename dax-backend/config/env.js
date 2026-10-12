// dax-backend/config/env.js
//
// Single place where process.env is read, validated, and turned into a
// typed config object. Nothing else in the app should read process.env
// directly for these flags — import `config` from here instead.
//
// Design goal: the PUBLIC baseline (health check + any future public
// endpoints) must be able to boot with ZERO Firebase/Drive/admin
// configuration present. Privileged features are opt-in via explicit
// env flags and are validated only when they are turned on.

require("dotenv").config();

function isTrue(value) {
  return value === "true";
}

function parseAdminUids(raw) {
  if (!raw) return [];
  return raw
      .split(",")
      .map((uid) => uid.trim())
      .filter(Boolean);
}

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Production CORS origin(s). Comma-separated list supported via
// PRODUCTION_ORIGINS, falls back to the known hosting origin.
const PRODUCTION_ORIGINS = process.env.PRODUCTION_ORIGINS ?
  process.env.PRODUCTION_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean) :
  ["https://dax-collective.web.app"];

const corsOrigins = NODE_ENV === "production" ?
  PRODUCTION_ORIGINS :
  [FRONTEND_URL];

// ─── Feature flags (all default OFF / safest state) ───────────────────────
const ENABLE_ADMIN_UPLOADS = isTrue(process.env.ENABLE_ADMIN_UPLOADS);
const ENABLE_DRIVE_AUTOMATION = isTrue(process.env.ENABLE_DRIVE_AUTOMATION);
const ALLOW_PUBLIC_DRIVE_FILES = isTrue(process.env.ALLOW_PUBLIC_DRIVE_FILES);

const ADMIN_UIDS = parseAdminUids(process.env.ADMIN_UIDS);

// ─── Rate limiting ──────────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 min
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 100;

// ─── Validation ─────────────────────────────────────────────────────────────
// Only validate what is actually needed for features that are enabled.
// This keeps the public baseline (everything off) startup-clean.
const errors = [];

if (ENABLE_ADMIN_UPLOADS) {
  const hasInlineJson = !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const hasLocalPath = !!process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!hasInlineJson && !hasLocalPath) {
    errors.push(
        "ENABLE_ADMIN_UPLOADS=true but neither FIREBASE_SERVICE_ACCOUNT_JSON " +
      "(deployment secret) nor FIREBASE_SERVICE_ACCOUNT_PATH (local dev file) is set. " +
      "Admin uploads cannot start without one of these.",
    );
  }
  if (!process.env.FIREBASE_STORAGE_BUCKET) {
    errors.push("ENABLE_ADMIN_UPLOADS=true but FIREBASE_STORAGE_BUCKET is not set.");
  }
  if (ADMIN_UIDS.length === 0) {
    errors.push(
        "ENABLE_ADMIN_UPLOADS=true but ADMIN_UIDS is empty. " +
      "No UID will pass requireAdmin unless a Firebase custom claim admin:true is used instead. " +
      "Set ADMIN_UIDS to a comma-separated list of allowed Firebase UIDs, or confirm you are relying solely on custom claims.",
    );
  }
}

if (ENABLE_DRIVE_AUTOMATION) {
  const required = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REDIRECT_URI",
    "GOOGLE_REFRESH_TOKEN",
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    errors.push(
        `ENABLE_DRIVE_AUTOMATION=true but missing required Drive env vars: ${missing.join(", ")}`,
    );
  }
}

const config = {
  NODE_ENV,
  PORT,
  FRONTEND_URL,
  corsOrigins,
  ENABLE_ADMIN_UPLOADS,
  ENABLE_DRIVE_AUTOMATION,
  ALLOW_PUBLIC_DRIVE_FILES,
  ADMIN_UIDS,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX,
  validationErrors: errors,
};

module.exports = config;
