// dax-backend/test/waitlist.test.js
//
// Waitlist storage contract. No real Firebase project is used: Firestore is
// replaced by an in-memory fake through the firebaseAdmin stub.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {startApp, stubModule} = require("../test-support/harness");

function fakeFirestore({failWith = null} = {}) {
  const docs = new Map();
  const firestore = () => ({
    collection: (name) => ({
      doc: (id) => ({
        create: async (data) => {
          if (failWith) throw failWith;
          const key = `${name}/${id}`;
          if (docs.has(key)) {
            const err = new Error("exists");
            err.code = 6;
            throw err;
          }
          docs.set(key, data);
        },
      }),
    }),
  });
  firestore.FieldValue = {serverTimestamp: () => "server-timestamp"};
  return {docs, firestore};
}

function stubFirebase({initialized, fake}) {
  stubModule("services/firebaseAdmin.js", {
    initFirebaseAdmin: () => initialized,
    isInitialized: () => initialized,
    getServiceAccount: () => null,
    getAdmin: () => {
      if (!initialized) throw new Error("not initialized");
      return {firestore: fake.firestore};
    },
  });
}

function signUp(app, body) {
  return fetch(`${app.base}/api/waitlist`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body),
  });
}

function tempFile(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dax-waitlist-"));
  t.after(() => fs.rmSync(dir, {recursive: true, force: true}));
  return path.join(dir, "waitlist.csv");
}

test("production defaults to the Firestore store and refuses without it", async (t) => {
  const file = tempFile(t);
  const app = await startApp(
      {NODE_ENV: "production", WAITLIST_STORE: "", WAITLIST_FILE_PATH: file},
      {beforeLoad: () => stubFirebase({initialized: false, fake: fakeFirestore()})},
  );
  t.after(app.close);

  const res = await signUp(app, {email: "visitor@example.test", source: "gods-vessel-hero"});
  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(body.success, undefined);
  assert.equal(fs.existsSync(file), false, "no local file may be written in firestore mode");
});

test("firestore store confirms a new sign-up only after the write", async (t) => {
  const fake = fakeFirestore();
  const file = tempFile(t);
  const app = await startApp(
      {NODE_ENV: "production", WAITLIST_STORE: "firestore", WAITLIST_FILE_PATH: file},
      {beforeLoad: () => stubFirebase({initialized: true, fake})},
  );
  t.after(app.close);

  const first = await signUp(app, {email: "  Visitor@Example.test ", source: "gods-vessel-hero"});
  assert.equal(first.status, 400, "untrimmed input is rejected by validation");

  const ok = await signUp(app, {email: "Visitor@Example.test", source: "gods-vessel-hero"});
  assert.equal(ok.status, 200);
  assert.deepEqual(await ok.json(), {success: true, created: true, message: "Subscribed successfully."});

  assert.equal(fake.docs.size, 1);
  const [[key, doc]] = [...fake.docs.entries()];
  assert.match(key, /^waitlist\/[0-9a-f]{64}$/);
  assert.equal(key.includes("visitor"), false, "the address is not part of the document path");
  assert.deepEqual(doc, {
    email: "visitor@example.test",
    source: "gods-vessel-hero",
    subscribedAt: "server-timestamp",
  });
  assert.equal(fs.existsSync(file), false);
});

test("a repeat sign-up is confirmed but not counted as created", async (t) => {
  const fake = fakeFirestore();
  const app = await startApp(
      {NODE_ENV: "production", WAITLIST_STORE: "firestore"},
      {beforeLoad: () => stubFirebase({initialized: true, fake})},
  );
  t.after(app.close);

  await signUp(app, {email: "visitor@example.test", source: "gods-vessel-hero"});
  const again = await signUp(app, {email: "VISITOR@example.test", source: "gods-vessel-cta"});
  assert.equal(again.status, 200);
  assert.deepEqual(await again.json(), {success: true, created: false, message: "Already subscribed."});
  assert.equal(fake.docs.size, 1);
});

test("a failed Firestore write is never reported as success", async (t) => {
  const failure = new Error("project detail that must not leak");
  failure.code = 7;
  const app = await startApp(
      {NODE_ENV: "production", WAITLIST_STORE: "firestore"},
      {beforeLoad: () => stubFirebase({initialized: true, fake: fakeFirestore({failWith: failure})})},
  );
  t.after(app.close);

  const res = await signUp(app, {email: "visitor@example.test", source: "gods-vessel-hero"});
  assert.equal(res.status, 503);
  const text = await res.text();
  assert.equal(text.includes("project detail"), false);
  assert.equal(JSON.parse(text).success, undefined);
});

test("unknown sources are stored as \"unknown\"", async (t) => {
  const fake = fakeFirestore();
  const app = await startApp(
      {NODE_ENV: "production", WAITLIST_STORE: "firestore"},
      {beforeLoad: () => stubFirebase({initialized: true, fake})},
  );
  t.after(app.close);

  await signUp(app, {email: "visitor@example.test", source: "<script>"});
  assert.equal([...fake.docs.values()][0].source, "unknown");
});

test("file store works for development and de-duplicates", async (t) => {
  const file = tempFile(t);
  const app = await startApp(
      {NODE_ENV: "test", WAITLIST_STORE: "", WAITLIST_FILE_PATH: file},
      {beforeLoad: () => stubFirebase({initialized: false, fake: fakeFirestore()})},
  );
  t.after(app.close);

  const first = await signUp(app, {email: "dev@example.test", source: "gods-vessel-hero"});
  assert.deepEqual(await first.json(), {success: true, created: true, message: "Subscribed successfully."});
  const second = await signUp(app, {email: "dev@example.test", source: "gods-vessel-hero"});
  assert.equal((await second.json()).created, false);

  const lines = fs.readFileSync(file, "utf8").trim().split("\n");
  assert.equal(lines.length, 2);
  assert.match(lines[1], /^dev@example\.test,gods-vessel-hero,/);
});

test("the waitlist cannot be read back through the public API", async (t) => {
  const app = await startApp({});
  t.after(app.close);

  for (const method of ["GET", "PUT", "DELETE"]) {
    const res = await fetch(`${app.base}/api/waitlist`, {method});
    assert.equal(res.status, 404, method);
  }
});

test("an invalid WAITLIST_STORE stops startup", () => {
  const {runServer} = require("../test-support/harness");
  const result = runServer({WAITLIST_STORE: "memory"});
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}${result.stderr}`, /WAITLIST_STORE must be one of/);
});
