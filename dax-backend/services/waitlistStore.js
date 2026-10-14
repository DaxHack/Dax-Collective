// dax-backend/services/waitlistStore.js
//
// Where waitlist sign-ups are stored. Two modes (config.WAITLIST_STORE):
//
//   "firestore" (default in production) — the sign-up is confirmed only after
//     Firestore has accepted the write. Nothing is written to local disk:
//     container filesystems are ephemeral, so a file copy would be lost and
//     would only leave email addresses lying in an instance's memory.
//     Without Firebase Admin the store is unavailable and the route answers
//     503 — it never reports a sign-up it could not keep.
//
//   "file" (default elsewhere) — local CSV for development, plus a
//     best-effort Firestore copy when Firebase Admin happens to be available.
//
// Documents live in the "waitlist" collection, keyed by a SHA-256 of the
// normalized email. That makes a repeat sign-up a no-op without a query and
// keeps the address out of the document path. The collection is reachable
// only through the Admin SDK; firestore.rules grants clients no access to it.

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const config = require("../config/env");
const {getAdmin, isInitialized} = require("./firebaseAdmin");

const COLLECTION = "waitlist";
const DEFAULT_FILE = path.join(__dirname, "..", "data", "waitlist.csv");

class WaitlistUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = "WaitlistUnavailableError";
  }
}

function waitlistFile() {
  return config.WAITLIST_FILE_PATH || DEFAULT_FILE;
}

function documentId(email) {
  return crypto.createHash("sha256").update(email).digest("hex");
}

function isAlreadyExists(err) {
  return Boolean(err) && (err.code === 6 || err.code === "already-exists" || err.code === "ALREADY_EXISTS");
}

/**
 * Create the Firestore document for a sign-up.
 * @param {string} email normalized email
 * @param {string} source allowlisted source label
 * @return {Promise<boolean>} true when created, false when it already existed
 */
async function createInFirestore(email, source) {
  const admin = getAdmin();
  const ref = admin.firestore().collection(COLLECTION).doc(documentId(email));
  try {
    await ref.create({
      email,
      source,
      subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return true;
  } catch (err) {
    if (isAlreadyExists(err)) return false;
    throw err;
  }
}

function ensureFile() {
  const file = waitlistFile();
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "email,source,subscribedAt\n", "utf8");
  }
}

function isEmailInFile(email) {
  try {
    const contents = fs.readFileSync(waitlistFile(), "utf8");
    return contents.split("\n").some((line) => line.startsWith(`${email},`));
  } catch (err) {
    return false;
  }
}

function csvField(value) {
  const str = String(value).replace(/"/g, "\"\"");
  return /[,"\n\r]/.test(str) ? `"${str}"` : str;
}

function appendToFile(email, source) {
  const line = `${csvField(email)},${csvField(source)},${csvField(new Date().toISOString())}\n`;
  fs.appendFileSync(waitlistFile(), line, "utf8");
}

/**
 * Record a waitlist sign-up in the configured store.
 * Resolves only when the sign-up is safely stored (or was already stored).
 * @param {string} email normalized email
 * @param {string} source allowlisted source label
 * @return {Promise<{created: boolean}>} created is false for a repeat sign-up
 * @throws {WaitlistUnavailableError} when the durable store cannot take it
 */
async function recordSignup(email, source) {
  if (config.WAITLIST_STORE === "firestore") {
    if (!isInitialized()) {
      throw new WaitlistUnavailableError("Firestore is not configured on this server.");
    }
    try {
      return {created: await createInFirestore(email, source)};
    } catch (err) {
      // err.message may describe the project; keep it out of logs and responses.
      console.error(`❌ Waitlist write to Firestore failed: ${err.code || err.name}`);
      throw new WaitlistUnavailableError("Firestore write failed.");
    }
  }

  ensureFile();
  const alreadyInFile = isEmailInFile(email);
  if (!alreadyInFile) appendToFile(email, source);

  if (isInitialized()) {
    try {
      await createInFirestore(email, source);
    } catch (err) {
      console.warn(`⚠️  Firestore unavailable, waitlist signup saved to file only: ${err.code || err.name}`);
    }
  }
  return {created: !alreadyInFile};
}

module.exports = {recordSignup, WaitlistUnavailableError, documentId};
