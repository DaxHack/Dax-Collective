// dax-backend/services/firebaseAdmin.js
//
// The ONLY place Firebase Admin SDK gets initialized. Everything else
// (middleware, routes) should call getAdmin() from here rather than
// calling admin.initializeApp() themselves.
//
// This module is lazy: requiring it does nothing until initFirebaseAdmin()
// is called explicitly by server.js, and server.js only calls it when
// config.ENABLE_ADMIN_UPLOADS is true. The public baseline never touches
// this file's init path at all.

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let initialized = false;

/**
 * Resolve service account credentials from environment.
 * Priority:
 *   1. FIREBASE_SERVICE_ACCOUNT_JSON — full JSON string (deployment secret).
 *   2. FIREBASE_SERVICE_ACCOUNT_PATH — path to a gitignored local file (local dev only).
 * Never logs, prints, or returns the credential contents.
 * @return {object} parsed service account object
 */
function resolveServiceAccount() {
  const inlineJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (inlineJson) {
    try {
      return JSON.parse(inlineJson);
    } catch (err) {
      // Do not include `inlineJson` or `err.message` if it could echo partial secret content.
      throw new Error(
          "FIREBASE_SERVICE_ACCOUNT_JSON is set but is not valid JSON. " +
        "Check that the full service-account JSON was pasted as a single-line string into the deployment secret.",
      );
    }
  }

  const localPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (localPath) {
    const resolvedPath = path.isAbsolute(localPath) ? localPath : path.join(__dirname, "..", localPath);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(
          `FIREBASE_SERVICE_ACCOUNT_PATH is set to "${localPath}" but no file exists at that path. ` +
        "This is a local-development-only option; the file must stay out of git (already covered by .gitignore).",
      );
    }
    try {
      return JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
    } catch (err) {
      throw new Error(
          `Failed to parse the service account file at "${localPath}" as JSON.`,
      );
    }
  }

  throw new Error(
      "Admin uploads are enabled (ENABLE_ADMIN_UPLOADS=true) but no Firebase credential source " +
    "was found. Set FIREBASE_SERVICE_ACCOUNT_JSON (deployment secret) for production, or " +
    "FIREBASE_SERVICE_ACCOUNT_PATH (gitignored local file) for local development.",
  );
}

/**
 * Initialize Firebase Admin SDK exactly once. Throws (does not exit the
 * process itself) if credentials are missing or invalid — callers decide
 * how to fail.
 * @return {admin.app.App} the initialized admin app
 */
function initFirebaseAdmin() {
  if (initialized && admin.apps.length) {
    return admin.app();
  }

  const serviceAccount = resolveServiceAccount();

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  initialized = true;
  return admin.app();
}

function isInitialized() {
  return initialized && admin.apps.length > 0;
}

/**
 * Get the firebase-admin namespace. Throws if not initialized yet —
 * callers must ensure initFirebaseAdmin() ran at startup before using this.
 * @return {object} the firebase-admin module
 */
function getAdmin() {
  if (!isInitialized()) {
    throw new Error(
        "Firebase Admin was requested but has not been initialized. " +
      "This should only happen if ENABLE_ADMIN_UPLOADS=true was set after startup, " +
      "or a code path called getAdmin() outside the admin route group.",
    );
  }
  return admin;
}

module.exports = {initFirebaseAdmin, getAdmin, isInitialized};
