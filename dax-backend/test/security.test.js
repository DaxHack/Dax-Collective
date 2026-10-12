// dax-backend/test/security.test.js
//
// Security-foundation checks, run with `npm test` (node:test, no extra
// dependencies). No real Firebase project, credential, or network call is
// used: where a verified token is needed, services/firebaseAdmin is replaced
// in the require cache with a stub that only knows the fake tokens below.

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const {spawnSync} = require("node:child_process");

const BACKEND_ROOT = path.join(__dirname, "..");
const FIREBASE_ADMIN_PATH = path.join(BACKEND_ROOT, "services", "firebaseAdmin.js");

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
};

const FAKE_TOKENS = {
  "token-regular-user": {uid: "user-1"},
  "token-allowlisted": {uid: "admin-uid-1"},
  "token-admin-claim": {uid: "user-2", admin: true},
};

function clearBackendModules() {
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(BACKEND_ROOT) && !key.includes("node_modules")) {
      delete require.cache[key];
    }
  }
}

function stubFirebaseAdmin() {
  const stub = {
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
  };
  require.cache[FIREBASE_ADMIN_PATH] = {
    id: FIREBASE_ADMIN_PATH,
    filename: FIREBASE_ADMIN_PATH,
    loaded: true,
    exports: stub,
  };
}

// Loads a fresh app with the given env and serves it on an ephemeral port.
async function startApp(env, {stubFirebase = false} = {}) {
  Object.assign(process.env, BASE_ENV, env);
  clearBackendModules();
  if (stubFirebase) stubFirebaseAdmin();
  const app = require(path.join(BACKEND_ROOT, "server.js"));
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  return {
    base,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

function runServer(env) {
  return spawnSync(process.execPath, ["server.js"], {
    cwd: BACKEND_ROOT,
    env: {...process.env, ...BASE_ENV, ...env},
    encoding: "utf8",
    timeout: 20000,
  });
}

test("public baseline boots without Firebase or admin configuration", async (t) => {
  const app = await startApp({});
  t.after(app.close);

  const health = await fetch(`${app.base}/api/health`);
  assert.equal(health.status, 200);
  const body = await health.json();
  assert.equal(body.status, "OK");
  assert.equal(body.adminUploadsEnabled, false);
  assert.equal(health.headers.get("x-powered-by"), null);
});

test("admin routes do not exist when ENABLE_ADMIN_UPLOADS is off", async (t) => {
  const app = await startApp({});
  t.after(app.close);

  for (const route of ["/api/admin/access", "/api/admin/drive-upload", "/api/admin/post/anidax"]) {
    const res = await fetch(`${app.base}${route}`, {
      method: route.endsWith("access") ? "GET" : "POST",
      headers: {Authorization: "Bearer token-admin-claim"},
    });
    assert.equal(res.status, 404, route);
  }
});

test("legacy unauthenticated-admin upload paths are gone", async (t) => {
  const app = await startApp({});
  t.after(app.close);

  for (const route of ["/api/drive-upload", "/api/firebase-profile", "/api/post/anidax"]) {
    const res = await fetch(`${app.base}${route}`, {method: "POST"});
    assert.equal(res.status, 404, route);
  }
});

test("public routes validate input and fail safely without credentials", async (t) => {
  const app = await startApp({});
  t.after(app.close);

  const badEmail = await fetch(`${app.base}/api/waitlist`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email: "not-an-email"}),
  });
  assert.equal(badEmail.status, 400);

  const badJson = await fetch(`${app.base}/api/waitlist`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: "{not json",
  });
  assert.equal(badJson.status, 400);

  const noSheetId = await fetch(`${app.base}/api/sheets`);
  assert.equal(noSheetId.status, 400);

  const unapprovedSheet = await fetch(`${app.base}/api/sheets?spreadsheetId=not-approved`);
  assert.equal(unapprovedSheet.status, 403);
});

test("rate limiter returns 429 with Retry-After once the limit is exceeded", async (t) => {
  const app = await startApp({RATE_LIMIT_MAX: "3"});
  t.after(app.close);

  const statuses = [];
  let last;
  for (let i = 0; i < 5; i++) {
    last = await fetch(`${app.base}/api/health`);
    statuses.push(last.status);
  }
  assert.deepEqual(statuses, [200, 200, 200, 429, 429]);
  assert.ok(Number(last.headers.get("retry-after")) >= 1);
});

test("admin routes require a valid token and admin authorization", async (t) => {
  const app = await startApp(
      {ENABLE_ADMIN_UPLOADS: "true", FIREBASE_STORAGE_BUCKET: "test-bucket", ADMIN_UIDS: "admin-uid-1"},
      {stubFirebase: true},
  );
  t.after(app.close);

  const call = (token) => fetch(`${app.base}/api/admin/access`, {
    headers: token ? {Authorization: `Bearer ${token}`} : {},
  });

  assert.equal((await call(null)).status, 401, "no token");
  assert.equal((await call("token-unknown")).status, 401, "invalid token");
  assert.equal((await call("token-regular-user")).status, 403, "signed in but not admin");
  assert.equal((await call("token-allowlisted")).status, 200, "ADMIN_UIDS allowlist");
  assert.equal((await call("token-admin-claim")).status, 200, "admin custom claim");

  const basicScheme = await fetch(`${app.base}/api/admin/access`, {
    headers: {Authorization: "Basic token-admin-claim"},
  });
  assert.equal(basicScheme.status, 401, "non-Bearer scheme");
});

test("Drive routes stay off unless ENABLE_DRIVE_AUTOMATION is on", async (t) => {
  const app = await startApp(
      {ENABLE_ADMIN_UPLOADS: "true", FIREBASE_STORAGE_BUCKET: "test-bucket"},
      {stubFirebase: true},
  );
  t.after(app.close);

  const res = await fetch(`${app.base}/api/admin/drive/images/some-folder`, {
    headers: {Authorization: "Bearer token-admin-claim"},
  });
  assert.equal(res.status, 503);
});

test("requireAuth rejects when Firebase Admin is not initialized", async () => {
  Object.assign(process.env, BASE_ENV);
  clearBackendModules();
  const requireAuth = require(path.join(BACKEND_ROOT, "middleware", "requireAuth.js"));

  let statusCode = null;
  let nextCalled = false;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json() {
      return this;
    },
  };
  await requireAuth({headers: {authorization: "Bearer anything"}}, res, () => {
    nextCalled = true;
  });

  assert.equal(statusCode, 503);
  assert.equal(nextCalled, false);
});

test("requireAdmin rejects a request that skipped requireAuth", () => {
  Object.assign(process.env, BASE_ENV, {ADMIN_UIDS: "admin-uid-1"});
  clearBackendModules();
  const requireAdmin = require(path.join(BACKEND_ROOT, "middleware", "requireAdmin.js"));

  let statusCode = null;
  let nextCalled = false;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json() {
      return this;
    },
  };
  requireAdmin({}, res, () => {
    nextCalled = true;
  });

  assert.equal(statusCode, 401);
  assert.equal(nextCalled, false);
});

test("startup fails when admin uploads are enabled without usable credentials", () => {
  const result = runServer({
    ENABLE_ADMIN_UPLOADS: "true",
    FIREBASE_STORAGE_BUCKET: "test-bucket",
    FIREBASE_SERVICE_ACCOUNT_PATH: "./credentials/does-not-exist.json",
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Firebase Admin failed to initialize/);
});

test("startup fails when Drive automation is enabled without its requirements", () => {
  const result = runServer({ENABLE_DRIVE_AUTOMATION: "true"});
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Startup validation failed/);
});
