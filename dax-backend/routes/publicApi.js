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
// degrade (see services/waitlistStore.js for the waitlist; Sheets answers 503).

const express = require("express");
const config = require("../config/env");
const {isInitialized} = require("../services/firebaseAdmin");
const {PUBLIC_SHEET_IDS, createSheetsHandler} = require("../services/sheets");
const {recordSignup, WaitlistUnavailableError} = require("../services/waitlistStore");

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
    waitlistStore: config.WAITLIST_STORE,
    waitlistReady: config.WAITLIST_STORE !== "firestore" || isInitialized(),
  });
});

// ─── Waitlist ────────────────────────────────────────────────────────────────
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

router.post("/waitlist", async (req, res) => {
  const body = req.body || {};
  const {email} = body;
  const rawSource = body.source || "unknown";
  const source = ALLOWED_SOURCES.has(rawSource) ? rawSource : "unknown";

  if (typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({error: "A valid email address is required."});
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Success is reported only once the configured store has the sign-up.
  // `created` tells the client whether this was a new sign-up or a repeat.
  let created;
  try {
    ({created} = await recordSignup(normalizedEmail, source));
  } catch (err) {
    if (err instanceof WaitlistUnavailableError) {
      return res.status(503).json({error: "The waitlist is temporarily unavailable."});
    }
    throw err;
  }

  if (!created) {
    return res.json({success: true, created: false, message: "Already subscribed."});
  }

  console.log(`✅ Waitlist signup recorded (source: ${source})`);
  return res.json({success: true, created: true, message: "Subscribed successfully."});
});

// ─── Google Sheets proxy (public content sheets only) ───────────────────────
// Serves only the spreadsheets that public website pages read. Operational,
// analytics and tracking sheets are refused here and are available solely
// through GET /api/admin/sheets — see services/sheets.js for the split.
router.get("/sheets", createSheetsHandler(PUBLIC_SHEET_IDS));

module.exports = router;
