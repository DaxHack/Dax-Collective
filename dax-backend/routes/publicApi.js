// dax-backend/routes/publicApi.js
//
// Routes mounted here are reachable with NO authentication:
//   GET  /api/health
//   POST /api/waitlist
//   GET  /api/sheets   (read-only, public content spreadsheets only)
//
// Nothing in this file may require Firebase Admin, Drive, or any admin-only
// configuration to load — it must work in a deployment that has none of
// that configured. Features that need Firebase check for it per request and
// degrade (waitlist keeps its file copy, Sheets answers 503).

const express = require("express");
const fs = require("fs");
const path = require("path");
const config = require("../config/env");
const {getAdmin, isInitialized} = require("../services/firebaseAdmin");
const {PUBLIC_SHEET_IDS, createSheetsHandler} = require("../services/sheets");

const router = express.Router(); // eslint-disable-line new-cap

// ─── Health ──────────────────────────────────────────────────────────────────
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    environment: config.NODE_ENV,
    version: "1.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    firebase: isInitialized(),
    adminUploadsEnabled: config.ENABLE_ADMIN_UPLOADS,
  });
});

// ─── Waitlist ────────────────────────────────────────────────────────────────
const WAITLIST_FILE = path.join(__dirname, "..", "data", "waitlist.csv");

function ensureWaitlistFile() {
  const dir = path.dirname(WAITLIST_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
  if (!fs.existsSync(WAITLIST_FILE)) {
    fs.writeFileSync(WAITLIST_FILE, "email,source,subscribedAt\n", "utf8");
  }
}

function isEmailInFile(email) {
  try {
    const contents = fs.readFileSync(WAITLIST_FILE, "utf8");
    return contents.split("\n").some((line) => line.startsWith(`${email},`));
  } catch (err) {
    return false;
  }
}

const ALLOWED_SOURCES = new Set([
  "gods-vessel-hero",
  "gods-vessel-cta",
  "gods-vessel-merch-hoodie",
  "gods-vessel-merch-hoodie-cta",
  "gods-vessel-merch-tee",
  "gods-vessel-merch-tee-cta",
  "gods-vessel-merch-study-cards",
  "gods-vessel-merch-study-cards-cta",
  "gods-vessel-merch-sticker-set",
  "gods-vessel-merch-sticker-set-cta",
  "unknown",
]);

function csvField(value) {
  const str = String(value).replace(/"/g, "\"\"");
  return /[,"\n\r]/.test(str) ? `"${str}"` : str;
}

function appendToWaitlistFile(email, source) {
  ensureWaitlistFile();
  const line = `${csvField(email)},${csvField(source)},${csvField(new Date().toISOString())}\n`;
  fs.appendFileSync(WAITLIST_FILE, line, "utf8");
}

router.post("/waitlist", async (req, res) => {
  const body = req.body || {};
  const {email} = body;
  const rawSource = body.source || "unknown";
  const source = ALLOWED_SOURCES.has(rawSource) ? rawSource : "unknown";

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({error: "A valid email address is required."});
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Always write to the local file so no submission is ever lost
  ensureWaitlistFile();
  const alreadyInFile = isEmailInFile(normalizedEmail);
  if (!alreadyInFile) {
    appendToWaitlistFile(normalizedEmail, source);
  }

  // Also persist to Firestore when Firebase Admin is available (best-effort)
  if (isInitialized()) {
    try {
      const admin = getAdmin();
      const ref = admin.firestore().collection("waitlist");
      const existing = await ref.where("email", "==", normalizedEmail).limit(1).get();
      if (existing.empty) {
        await ref.add({
          email: normalizedEmail,
          source,
          subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    } catch (firestoreErr) {
      // File write already succeeded above — log and continue
      console.warn(`⚠️  Firestore unavailable, waitlist signup saved to file only: ${firestoreErr.message}`);
    }
  }

  if (alreadyInFile) {
    return res.json({success: true, message: "Already subscribed."});
  }

  console.log(`✅ Waitlist signup recorded (source: ${source})`);
  return res.json({success: true, message: "Subscribed successfully."});
});

// ─── Google Sheets proxy (public content sheets only) ───────────────────────
// Serves only the spreadsheets that public website pages read. Operational,
// analytics and tracking sheets are refused here and are available solely
// through GET /api/admin/sheets — see services/sheets.js for the split.
router.get("/sheets", createSheetsHandler(PUBLIC_SHEET_IDS));

module.exports = router;
