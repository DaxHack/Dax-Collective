// dax-backend/test-support/harness.js
//
// Shared helpers for the backend tests. Kept outside test/ so the test
// runner does not treat it as a test file.
//
// No real Firebase project, credential, or external network call is used:
// where a verified token is needed, services/firebaseAdmin is replaced in
// the require cache with a stub that only knows the fake tokens below.

const path = require("node:path");
const {spawnSync} = require("node:child_process");

const BACKEND_ROOT = path.join(__dirname, "..");

const BASE_ENV = {
  NODE_ENV: "test",
  ENABLE_ADMIN_UPLOADS: "false",
  ENABLE_DRIVE_AUTOMATION: "false",
  ALLOW_PUBLIC_DRIVE_FILES: "false",
  ADMIN_UIDS: "",
  RATE_LIMIT_MAX: "1000",
  RATE_LIMIT_WINDOW_MS: "60000",
  TRUST_PROXY: "",
  FIREBASE_SERVICE_ACCOUNT_JSON: "",
  FIREBASE_SERVICE_ACCOUNT_PATH: "",
  FIREBASE_STORAGE_BUCKET: "",
  FIREBASE_USE_APPLICATION_DEFAULT: "",
  WAITLIST_STORE: "",
  WAITLIST_FILE_PATH: "",
};

const FAKE_TOKENS = {
  "token-regular-user": {uid: "user-1", email: "user@example.test"},
  "token-allowlisted": {uid: "admin-uid-1", email: "admin@example.test"},
  "token-admin-claim": {uid: "user-2", email: "claim@example.test", admin: true},
};

// Env for an app with the admin group mounted and "admin-uid-1" allowlisted.
const ADMIN_ENV = {
  ENABLE_ADMIN_UPLOADS: "true",
  FIREBASE_STORAGE_BUCKET: "test-bucket",
  ADMIN_UIDS: "admin-uid-1",
};

function modulePath(relativePath) {
  return path.join(BACKEND_ROOT, ...relativePath.split("/"));
}

function clearBackendModules() {
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(BACKEND_ROOT) && !key.includes("node_modules")) {
      delete require.cache[key];
    }
  }
}

// Replace a backend module with fixed exports for the next require().
function stubModule(relativePath, exports) {
  const filename = modulePath(relativePath);
  require.cache[filename] = {id: filename, filename, loaded: true, exports};
}

function stubFirebaseAdmin() {
  stubModule("services/firebaseAdmin.js", {
    initFirebaseAdmin: () => true,
    isInitialized: () => true,
    getServiceAccount: () => null,
    getAdmin: () => ({
      auth: () => ({
        verifyIdToken: async (token) => {
          if (!FAKE_TOKENS[token]) throw new Error("invalid token");
          return FAKE_TOKENS[token];
        },
      }),
    }),
  });
}

/**
 * Load a fresh app with the given env and serve it on an ephemeral port.
 * @param {object} env overrides on top of BASE_ENV
 * @param {object} [options] stubFirebase: use the fake token verifier;
 *   beforeLoad: callback run after the module cache is cleared and before
 *   server.js is required (for extra stubs)
 * @return {Promise<{base: string, close: Function}>}
 */
async function startApp(env, {stubFirebase = false, beforeLoad = null} = {}) {
  Object.assign(process.env, BASE_ENV, env);
  clearBackendModules();
  if (stubFirebase) stubFirebaseAdmin();
  if (beforeLoad) beforeLoad();
  const app = require(modulePath("server.js"));
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  return {
    base: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

// Run `node server.js` as a child process and return its exit status/output.
function runServer(env) {
  return spawnSync(process.execPath, ["server.js"], {
    cwd: BACKEND_ROOT,
    env: {...process.env, ...BASE_ENV, ...env},
    encoding: "utf8",
    timeout: 20000,
  });
}

function bearer(token) {
  return token ? {Authorization: `Bearer ${token}`} : {};
}

module.exports = {
  BACKEND_ROOT,
  BASE_ENV,
  ADMIN_ENV,
  FAKE_TOKENS,
  modulePath,
  clearBackendModules,
  stubModule,
  startApp,
  runServer,
  bearer,
};
