// dax-backend/services/firebaseAdmin.js
//
// The ONLY place the Firebase Admin SDK gets initialized and the only place
// the service-account credential is read. Everything else (middleware,
// routes) calls getAdmin() / getServiceAccount() from here.
//
// Requiring this module does nothing. server.js decides when to initialize:
//   - ENABLE_ADMIN_UPLOADS=true  -> credentials are REQUIRED; startup fails
//     without them.
//   - otherwise                  -> credentials are OPTIONAL; when none are
//     found the server still boots and every Firebase-backed feature
//     reports itself unavailable. Missing credentials never grant access.

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const DEFAULT_CREDENTIAL_PATH = path.join(__dirname, "..", "credentials", "firebase-adminsdk.json");

let initialized = false;
let serviceAccount = null;

function readJsonFile(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    // Never include file contents or parser output: either could echo key material.
    throw new Error(`Failed to read ${label} as service-account JSON.`);
  }
}

/**
 * Resolve service-account credentials.
 * Priority:
 *   1. FIREBASE_SERVICE_ACCOUNT_JSON — full JSON string (deployment secret).
 *   2. FIREBASE_SERVICE_ACCOUNT_PATH — path to a gitignored local file.
 *   3. credentials/firebase-adminsdk.json — gitignored default location.
 * When none of these exist, initFirebaseAdmin() may still use Application
 * Default Credentials if FIREBASE_USE_APPLICATION_DEFAULT=true.
 * Never logs, prints, or returns credential contents in an error.
 * @return {object|null} parsed service account, or null when none is configured
 */
function resolveServiceAccount() {
  const inlineJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (inlineJson) {
    try {
      return JSON.parse(inlineJson);
    } catch (err) {
      throw new Error(
          "FIREBASE_SERVICE_ACCOUNT_JSON is set but is not valid JSON. " +
        "Paste the full service-account JSON as a single-line string into the deployment secret.",
      );
    }
  }

  const configuredPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (configuredPath) {
    const resolvedPath = path.isAbsolute(configuredPath) ?
      configuredPath :
      path.join(__dirname, "..", configuredPath);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(
          "FIREBASE_SERVICE_ACCOUNT_PATH is set but no file exists at that path. " +
        "The file must stay out of git (credentials/ is gitignored).",
      );
    }
    return readJsonFile(resolvedPath, "the file at FIREBASE_SERVICE_ACCOUNT_PATH");
  }

  if (fs.existsSync(DEFAULT_CREDENTIAL_PATH)) {
    return readJsonFile(DEFAULT_CREDENTIAL_PATH, "credentials/firebase-adminsdk.json");
  }

  return null;
}

/**
 * Initialize Firebase Admin exactly once.
 * Throws (does not exit the process) when a credential source is configured
 * but unusable — callers decide how to fail.
 * @return {boolean} true when Firebase Admin is initialized, false when no
 *   credential source is configured
 */
function initFirebaseAdmin() {
  if (initialized && admin.apps.length) {
    return true;
  }

  const resolved = resolveServiceAccount();
  if (!resolved) {
    // Opt-in keyless mode: the platform's attached service identity
    // (Application Default Credentials). No key material is read or stored.
    // getServiceAccount() stays null, so the Sheets proxy — which signs with
    // a service-account key — reports itself unavailable in this mode.
    if (process.env.FIREBASE_USE_APPLICATION_DEFAULT !== "true") {
      return false;
    }
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }
    initialized = true;
    return true;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(resolved),
      projectId: process.env.FIREBASE_PROJECT_ID,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  serviceAccount = resolved;
  initialized = true;
  return true;
}

function isInitialized() {
  return initialized && admin.apps.length > 0;
}

/**
 * Get the firebase-admin namespace. Throws when Firebase Admin is not
 * initialized, so a caller can never proceed as if a token had been verified.
 * @return {object} the firebase-admin module
 */
function getAdmin() {
  if (!isInitialized()) {
    throw new Error("Firebase Admin is not initialized on this server.");
  }
  return admin;
}

/**
 * Service-account identity for server-to-server Google API calls
 * (the read-only Sheets proxy).
 * @return {{client_email: string, private_key: string}|null}
 */
function getServiceAccount() {
  return isInitialized() ? serviceAccount : null;
}

module.exports = {initFirebaseAdmin, getAdmin, getServiceAccount, isInitialized};
