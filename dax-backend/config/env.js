// dax-backend/config/env.js
//
// Single place where process.env is read, validated, and turned into a
// typed config object for the security-relevant settings. Import `config`
// from here instead of reading these flags from process.env directly.
//
// Design goal: the PUBLIC baseline (health check, waitlist, Sheets proxy)
// must be able to boot with ZERO Firebase/Drive/admin configuration present.
// Privileged features are opt-in via explicit env flags and are validated
// only when they are turned on.

require("dotenv").config();

function isTrue(value) {
  return value === "true";
}

function parseList(raw) {
  if (!raw) return [];
  return raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
}

function parsePositiveInt(raw, fallback) {
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Production CORS origins. Comma-separated list via PRODUCTION_ORIGINS,
// otherwise the known production hosts.
const DEFAULT_PRODUCTION_ORIGINS = [
  "https://daxcollective.com",
  "https://www.daxcollective.com",
  "https://dax-collective.web.app",
];
const configuredOrigins = parseList(process.env.PRODUCTION_ORIGINS);
const PRODUCTION_ORIGINS = configuredOrigins.length > 0 ? configuredOrigins : DEFAULT_PRODUCTION_ORIGINS;

const corsOrigins = NODE_ENV === "production" ? PRODUCTION_ORIGINS : [FRONTEND_URL];

// ─── Feature flags (all default OFF / safest state) ─────────────────────────
const ENABLE_ADMIN_UPLOADS = isTrue(process.env.ENABLE_ADMIN_UPLOADS);
const ENABLE_DRIVE_AUTOMATION = isTrue(process.env.ENABLE_DRIVE_AUTOMATION);
const ALLOW_PUBLIC_DRIVE_FILES = isTrue(process.env.ALLOW_PUBLIC_DRIVE_FILES);

const ADMIN_UIDS = parseList(process.env.ADMIN_UIDS);

// ─── Rate limiting ──────────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = parsePositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000); // 15 min
const RATE_LIMIT_MAX = parsePositiveInt(process.env.RATE_LIMIT_MAX, 100);

// Number of reverse-proxy hops to trust when resolving the client IP
// (Express "trust proxy"). Leave unset when the server is reached directly.
// Behind a single proxy/load balancer (Replit, Render, Fly, Cloud Run) set
// TRUST_PROXY=1, otherwise every visitor shares the proxy's IP and therefore
// one rate-limit bucket.
const TRUST_PROXY = parsePositiveInt(process.env.TRUST_PROXY, 0);

// ─── Waitlist storage ───────────────────────────────────────────────────────
// "firestore": a sign-up is confirmed only after Firestore accepts it.
// "file": local CSV, for development. Production defaults to "firestore" so
// a deployment can never confirm sign-ups it keeps only on ephemeral disk.
const WAITLIST_STORES = ["firestore", "file"];
const WAITLIST_STORE = process.env.WAITLIST_STORE || (NODE_ENV === "production" ? "firestore" : "file");
const WAITLIST_FILE_PATH = process.env.WAITLIST_FILE_PATH || "";

// Opt-in: use the platform's attached service identity (Application Default
// Credentials — e.g. the Cloud Run service account) instead of a key file.
const FIREBASE_USE_APPLICATION_DEFAULT = isTrue(process.env.FIREBASE_USE_APPLICATION_DEFAULT);

// ─── Validation ─────────────────────────────────────────────────────────────
// Only validate what is actually needed for features that are enabled.
// This keeps the public baseline (everything off) startup-clean.
const errors = [];

if (!WAITLIST_STORES.includes(WAITLIST_STORE)) {
  errors.push(`WAITLIST_STORE must be one of: ${WAITLIST_STORES.join(", ")}.`);
}

if (ENABLE_ADMIN_UPLOADS) {
  if (!process.env.FIREBASE_STORAGE_BUCKET) {
    errors.push("ENABLE_ADMIN_UPLOADS=true but FIREBASE_STORAGE_BUCKET is not set.");
  }
}

if (ENABLE_DRIVE_AUTOMATION) {
  if (!ENABLE_ADMIN_UPLOADS) {
    errors.push(
        "ENABLE_DRIVE_AUTOMATION=true requires ENABLE_ADMIN_UPLOADS=true. " +
      "Drive routes only exist inside the admin route group.",
    );
  }
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

// Non-fatal notices, logged once at startup.
const warnings = [];

if (ENABLE_ADMIN_UPLOADS && ADMIN_UIDS.length === 0) {
  warnings.push(
      "ENABLE_ADMIN_UPLOADS=true and ADMIN_UIDS is empty: only accounts with the " +
    "Firebase custom claim admin:true will pass requireAdmin.",
  );
}

if (NODE_ENV === "production" && WAITLIST_STORE === "file") {
  warnings.push(
      "WAITLIST_STORE=file in production: sign-ups are kept only on this server's local disk " +
    "and are lost when the instance is replaced. Use the default (firestore).",
  );
}

if (NODE_ENV === "production" && TRUST_PROXY === 0) {
  warnings.push(
      "TRUST_PROXY is not set. If this server runs behind a reverse proxy, all clients " +
    "share one rate-limit bucket. Set TRUST_PROXY to the number of proxy hops.",
  );
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
  TRUST_PROXY,
  WAITLIST_STORE,
  WAITLIST_FILE_PATH,
  FIREBASE_USE_APPLICATION_DEFAULT,
  validationErrors: errors,
  warnings,
};

module.exports = config;
