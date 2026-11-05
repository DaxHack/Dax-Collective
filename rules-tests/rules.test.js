// rules-tests/rules.test.js
//
// Runs firestore.rules and storage.rules against the Firebase emulators.
// Start with `npm test` in this folder (uses `firebase emulators:exec`).
// Uses a demo project id: no real Firebase project is contacted.

const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} = require("@firebase/rules-unit-testing");
const {doc, getDoc, setDoc, deleteDoc, collection, getDocs, addDoc} = require("firebase/firestore");
const {ref, uploadString, getBytes} = require("firebase/storage");

const ROOT = path.join(__dirname, "..");
const hostPort = (value, fallbackPort) => {
  const [host, port] = String(value || `127.0.0.1:${fallbackPort}`).split(":");
  return {host, port: Number(port)};
};

let env;

// A caller, with its Firestore/Storage handles created once (the SDK does not
// allow a context's Firestore to be configured twice).
const caller = (ctx) => {
  let db;
  let storage;
  return {
    firestore: () => (db = db || ctx.firestore()),
    storage: () => (storage = storage || ctx.storage()),
  };
};

// The four kinds of caller a rule can see.
let cached;
const callers = () => (cached = cached || {
  visitor: caller(env.unauthenticatedContext()),
  anonymous: caller(env.authenticatedContext("anon-1", {firebase: {sign_in_provider: "anonymous"}})),
  member: caller(env.authenticatedContext("user-1", {email: "member@example.test", email_verified: true})),
  admin: caller(env.authenticatedContext("admin-1", {admin: true})),
});
const NON_ADMINS = ["visitor", "anonymous", "member"];

test.before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-dax-rules",
    firestore: {
      rules: fs.readFileSync(path.join(ROOT, "firestore.rules"), "utf8"),
      ...hostPort(process.env.FIRESTORE_EMULATOR_HOST, 8080),
    },
    storage: {
      rules: fs.readFileSync(path.join(ROOT, "storage.rules"), "utf8"),
      ...hostPort(process.env.FIREBASE_STORAGE_EMULATOR_HOST, 9199),
    },
  });

  // Seed data with rules bypassed, as the Admin SDK would.
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    for (const name of [
      "content", "brands", "workflows", "notifications", "analytics", "settings",
      "automation_logs", "public", "waitlist", "comments", "users", "anything_else",
    ]) {
      await setDoc(doc(db, name, "seed"), {seeded: true});
    }
    await setDoc(doc(db, "users", "user-1"), {seeded: true});
    const storage = ctx.storage();
    for (const p of [
      "public/seed.txt", "content/seed.txt", "brands/seed.txt", "temp/seed.txt",
      "profile-pictures/admin-1/seed.txt", "users/user-1/seed.txt", "other/seed.txt",
    ]) {
      await uploadString(ref(storage, p), "seed");
    }
  });
});

test.after(async () => {
  if (env) await env.cleanup();
});

const ADMIN_COLLECTIONS = ["content", "brands", "workflows", "notifications", "analytics", "settings"];

test("Firestore: non-admins cannot read or write admin/operational collections", async () => {
  const who = callers();
  for (const name of ADMIN_COLLECTIONS) {
    for (const caller of NON_ADMINS) {
      const db = who[caller].firestore();
      await assertFails(getDoc(doc(db, name, "seed")));
      await assertFails(getDocs(collection(db, name)));
      await assertFails(setDoc(doc(db, name, "new"), {x: 1}));
      await assertFails(setDoc(doc(db, name, "seed"), {x: 1}));
      await assertFails(deleteDoc(doc(db, name, "seed")));
      await assertFails(setDoc(doc(db, name, "seed", "nested", "doc"), {x: 1}));
    }
  }
});

test("Firestore: the admin custom claim grants access to admin collections", async () => {
  const db = callers().admin.firestore();
  for (const name of ADMIN_COLLECTIONS) {
    await assertSucceeds(getDoc(doc(db, name, "seed")));
    await assertSucceeds(setDoc(doc(db, name, "admin-write"), {x: 1}));
    await assertSucceeds(deleteDoc(doc(db, name, "admin-write")));
  }
});

test("Firestore: a claim that merely looks like admin is not enough", async () => {
  const lookalikes = [
    env.authenticatedContext("u-2", {admin: "true"}),
    env.authenticatedContext("u-3", {admin: 1}),
    env.authenticatedContext("u-4", {role: "admin"}),
    env.authenticatedContext("u-5", {email: "your-admin-email@example.com", email_verified: true}),
  ];
  for (const ctx of lookalikes) {
    const db = ctx.firestore();
    await assertFails(getDoc(doc(db, "settings", "seed")));
    await assertFails(setDoc(doc(db, "settings", "seed"), {x: 1}));
  }
});

test("Firestore: automation logs are admin-read, never client-written", async () => {
  const who = callers();
  for (const caller of NON_ADMINS) {
    await assertFails(getDoc(doc(who[caller].firestore(), "automation_logs", "seed")));
    await assertFails(addDoc(collection(who[caller].firestore(), "automation_logs"), {x: 1}));
  }
  await assertSucceeds(getDoc(doc(who.admin.firestore(), "automation_logs", "seed")));
  await assertFails(addDoc(collection(who.admin.firestore(), "automation_logs"), {x: 1}));
});

test("Firestore: public content is readable by anyone and writable only by admins", async () => {
  const who = callers();
  for (const caller of NON_ADMINS) {
    const db = who[caller].firestore();
    await assertSucceeds(getDoc(doc(db, "public", "seed")));
    await assertFails(setDoc(doc(db, "public", "seed"), {x: 1}));
    await assertFails(setDoc(doc(db, "public", "new"), {x: 1}));
    await assertFails(deleteDoc(doc(db, "public", "seed")));
  }
  await assertSucceeds(setDoc(doc(who.admin.firestore(), "public", "admin-write"), {x: 1}));
});

test("Firestore: the waitlist is closed to every client, admins included", async () => {
  const who = callers();
  for (const caller of [...NON_ADMINS, "admin"]) {
    const db = who[caller].firestore();
    await assertFails(getDoc(doc(db, "waitlist", "seed")));
    await assertFails(getDocs(collection(db, "waitlist")));
    await assertFails(setDoc(doc(db, "waitlist", "new"), {email: "x@example.test"}));
    await assertFails(addDoc(collection(db, "waitlist"), {email: "x@example.test"}));
    await assertFails(deleteDoc(doc(db, "waitlist", "seed")));
  }
});

test("Firestore: comments and user profiles stay disabled", async () => {
  const who = callers();
  for (const caller of [...NON_ADMINS, "admin"]) {
    const db = who[caller].firestore();
    await assertFails(getDocs(collection(db, "comments")));
    await assertFails(addDoc(collection(db, "comments"), {text: "hi", sectionId: "s", userId: "anon-1"}));
    await assertFails(getDoc(doc(db, "users", "user-1")));
    await assertFails(setDoc(doc(db, "users", "user-1"), {x: 1}));
  }
});

test("Firestore: unlisted collections are denied by default", async () => {
  const who = callers();
  for (const caller of [...NON_ADMINS, "admin"]) {
    const db = who[caller].firestore();
    await assertFails(getDoc(doc(db, "anything_else", "seed")));
    await assertFails(setDoc(doc(db, "anything_else", "new"), {x: 1}));
  }
});

test("Storage: public assets are readable by anyone and writable only by admins", async () => {
  const who = callers();
  for (const caller of NON_ADMINS) {
    const storage = who[caller].storage();
    await assertSucceeds(getBytes(ref(storage, "public/seed.txt")));
    await assertFails(uploadString(ref(storage, "public/new.txt"), "x"));
  }
  await assertSucceeds(uploadString(ref(who.admin.storage(), "public/admin.txt"), "x"));
});

test("Storage: internal paths are admin-only", async () => {
  const who = callers();
  for (const folder of ["content", "brands", "temp"]) {
    for (const caller of NON_ADMINS) {
      const storage = who[caller].storage();
      await assertFails(getBytes(ref(storage, `${folder}/seed.txt`)));
      await assertFails(uploadString(ref(storage, `${folder}/new.txt`), "x"));
    }
    await assertSucceeds(getBytes(ref(who.admin.storage(), `${folder}/seed.txt`)));
    await assertSucceeds(uploadString(ref(who.admin.storage(), `${folder}/admin.txt`), "x"));
  }
});

test("Storage: backend-only, user-upload and unlisted paths are closed to every client", async () => {
  const who = callers();
  for (const caller of [...NON_ADMINS, "admin"]) {
    const storage = who[caller].storage();
    for (const p of ["profile-pictures/admin-1/seed.txt", "users/user-1/seed.txt", "other/seed.txt"]) {
      await assertFails(getBytes(ref(storage, p)));
    }
    for (const p of ["profile-pictures/admin-1/new.txt", "users/user-1/new.txt", "other/new.txt", "new.txt"]) {
      await assertFails(uploadString(ref(storage, p), "x"));
    }
  }
});
