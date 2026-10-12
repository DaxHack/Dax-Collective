// dax-backend/routes/publicApi.js
//
// Routes mounted here are reachable with NO authentication:
//   GET  /api/health
//   POST /api/waitlist
//   GET  /api/sheets   (read-only, approved spreadsheet IDs only)
//
// Nothing in this file may require Firebase Admin, Drive, or any admin-only
// configuration to load — it must work in a deployment that has none of
// that configured. Features that need Firebase check for it per request and
// degrade (waitlist keeps its file copy, Sheets answers 503).

const express = require("express");
const fs = require("fs");
const path = require("path");
const config = require("../config/env");
const {getAdmin, getServiceAccount, isInitialized} = require("../services/firebaseAdmin");

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

// ─── Google Sheets proxy ─────────────────────────────────────────────────────
// Approved Google Sheet IDs for the proxy (blocks arbitrary spreadsheet access).
// Backend reads SHEET_* variables (no REACT_APP_ prefix) — these can be set
// via Replit Secrets shared across both frontend and backend, or via .env.
const APPROVED_SHEET_IDS = new Set([
  process.env.SHEET_GODS_VESSEL_QUOTES || process.env.REACT_APP_SHEET_GODS_VESSEL_QUOTES,
  process.env.SHEET_DAX_TRAVELER_BLOGS || process.env.REACT_APP_SHEET_DAX_TRAVELER_BLOGS,
  process.env.SHEET_TIMEZONE_TRAVELERS_BLOGS_ITINERARIES ||
    process.env.REACT_APP_SHEET_TIMEZONE_TRAVELERS_BLOGS_ITINERARIES,
  process.env.SHEET_GODS_VESSEL_DISCUSSIONS || process.env.REACT_APP_SHEET_GODS_VESSEL_DISCUSSIONS,
  process.env.SHEET_TSHIRT_DESIGNS_CANVA_BULK || process.env.REACT_APP_SHEET_TSHIRT_DESIGNS_CANVA_BULK,
  process.env.SHEET_SATIATED_TASTE_RECIPES || process.env.REACT_APP_SHEET_SATIATED_TASTE_RECIPES,
  process.env.SHEET_BRAND_ANALYTICS_DASHBOARD || process.env.REACT_APP_SHEET_BRAND_ANALYTICS_DASHBOARD,
  process.env.SHEET_SOCIAL_TRACKING_YOUTUBE || process.env.REACT_APP_SHEET_SOCIAL_TRACKING_YOUTUBE,
  process.env.SHEET_SOCIAL_TRACKING_INSTAGRAM || process.env.REACT_APP_SHEET_SOCIAL_TRACKING_INSTAGRAM,
  process.env.SHEET_SOCIAL_TRACKING_TIKTOK || process.env.REACT_APP_SHEET_SOCIAL_TRACKING_TIKTOK,
  process.env.SHEET_SOCIAL_TRACKING_TWITTER || process.env.REACT_APP_SHEET_SOCIAL_TRACKING_TWITTER,
  process.env.SHEET_SOCIAL_TRACKING_FACEBOOK || process.env.REACT_APP_SHEET_SOCIAL_TRACKING_FACEBOOK,
].filter(Boolean));

// Server-side read via the service account — no API key reaches the browser.
router.get("/sheets", async (req, res) => {
  const {spreadsheetId, range, valueRenderOption = "FORMATTED_VALUE"} = req.query;

  if (!spreadsheetId) {
    return res.status(400).json({error: "spreadsheetId is required"});
  }

  if (!APPROVED_SHEET_IDS.has(spreadsheetId)) {
    console.warn("Blocked sheet access attempt for a spreadsheet ID that is not in the approved list");
    return res.status(403).json({error: "Spreadsheet ID not in approved list"});
  }

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    return res.status(503).json({error: "Sheets proxy is not configured on this server"});
  }

  const sheetRange = range || "Sheet1!A1:Z1000";

  try {
    const {JWT} = require("google-auth-library");
    const client = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const token = await client.authorize();

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}` +
      `/values/${encodeURIComponent(sheetRange)}` +
      `?valueRenderOption=${encodeURIComponent(valueRenderOption)}`;
    const response = await fetch(url, {
      headers: {Authorization: `Bearer ${token.access_token}`},
    });
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error("Sheets proxy error:", err.message);
    res.status(502).json({error: "Sheets request failed"});
  }
});

module.exports = router;
