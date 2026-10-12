// dax-backend/services/sheets.js
//
// Read-only Google Sheets access through the service account, shared by the
// public and the admin Sheets routes.
//
// Spreadsheets are split into two sets:
//
//   PUBLIC     Content that public website pages read anonymously today.
//              Served by GET /api/sheets.
//   PROTECTED  Operational, analytics, tracking and production sheets, plus
//              any sheet whose public use is not established by a public
//              page. Served only by GET /api/admin/sheets, behind
//              requireAuth + requireAdmin.
//
// A sheet is public only if it is listed in PUBLIC_SHEET_KEYS. Anything else
// defaults to protected, and an ID configured under both wins as protected.

const {getServiceAccount} = require("./firebaseAdmin");

// Read by public components: BlogSection (blogs, itineraries) and
// GodsVesselQuotes (quotes).
const PUBLIC_SHEET_KEYS = [
  "SHEET_GODS_VESSEL_QUOTES",
  "SHEET_DAX_TRAVELER_BLOGS",
  "SHEET_TIMEZONE_TRAVELERS_BLOGS_ITINERARIES",
];

const PROTECTED_SHEET_KEYS = [
  // Analytics and social tracking
  "SHEET_BRAND_ANALYTICS_DASHBOARD",
  "SHEET_SOCIAL_TRACKING_YOUTUBE",
  "SHEET_SOCIAL_TRACKING_INSTAGRAM",
  "SHEET_SOCIAL_TRACKING_TIKTOK",
  "SHEET_SOCIAL_TRACKING_TWITTER",
  "SHEET_SOCIAL_TRACKING_FACEBOOK",
  // Production pipeline
  "SHEET_TSHIRT_DESIGNS_CANVA_BULK",
  // No public page reads these today; protected until one is approved.
  "SHEET_GODS_VESSEL_DISCUSSIONS",
  "SHEET_SATIATED_TASTE_RECIPES",
];

const VALUE_RENDER_OPTIONS = new Set(["FORMATTED_VALUE", "UNFORMATTED_VALUE", "FORMULA"]);

// Backend reads SHEET_* (no REACT_APP_ prefix); the REACT_APP_ spelling is
// accepted so one shared secret can serve frontend and backend.
function readIds(keys) {
  return keys
      .map((key) => process.env[key] || process.env[`REACT_APP_${key}`])
      .filter(Boolean);
}

const PROTECTED_SHEET_IDS = new Set(readIds(PROTECTED_SHEET_KEYS));
const PUBLIC_SHEET_IDS = new Set(readIds(PUBLIC_SHEET_KEYS).filter((id) => !PROTECTED_SHEET_IDS.has(id)));
const ALL_SHEET_IDS = new Set([...PUBLIC_SHEET_IDS, ...PROTECTED_SHEET_IDS]);

/**
 * Fetch a range from Google Sheets with the service account.
 * @return {Promise<{status: number, data: object}>}
 */
async function fetchSheetValues({spreadsheetId, range, valueRenderOption}) {
  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    return {status: 503, data: {error: "Sheets proxy is not configured on this server"}};
  }

  const {JWT} = require("google-auth-library");
  const client = new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const token = await client.authorize();

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}` +
    `/values/${encodeURIComponent(range)}` +
    `?valueRenderOption=${encodeURIComponent(valueRenderOption)}`;
  const response = await fetch(url, {
    headers: {Authorization: `Bearer ${token.access_token}`},
  });
  return {status: response.status, data: await response.json()};
}

/**
 * Express handler that serves only the spreadsheet IDs in `allowedIds`.
 * Unknown IDs and IDs from the other set get the same 403, so the response
 * does not reveal which protected sheets exist.
 * @param {Set<string>} allowedIds
 * @return {Function}
 */
function createSheetsHandler(allowedIds) {
  return async (req, res) => {
    const {spreadsheetId, range} = req.query;
    const valueRenderOption = req.query.valueRenderOption || "FORMATTED_VALUE";

    if (typeof spreadsheetId !== "string" || !spreadsheetId) {
      return res.status(400).json({error: "spreadsheetId is required"});
    }
    if (!VALUE_RENDER_OPTIONS.has(valueRenderOption)) {
      return res.status(400).json({error: "Invalid valueRenderOption"});
    }
    if (!allowedIds.has(spreadsheetId)) {
      console.warn("Blocked sheet access attempt for a spreadsheet ID that is not allowed on this route");
      return res.status(403).json({error: "Spreadsheet ID not in approved list"});
    }

    try {
      const result = await module.exports.fetchSheetValues({
        spreadsheetId,
        range: typeof range === "string" && range ? range : "Sheet1!A1:Z1000",
        valueRenderOption,
      });
      res.status(result.status).json(result.data);
    } catch (err) {
      console.error("Sheets proxy error:", err.message);
      res.status(502).json({error: "Sheets request failed"});
    }
  };
}

module.exports = {
  PUBLIC_SHEET_KEYS,
  PROTECTED_SHEET_KEYS,
  PUBLIC_SHEET_IDS,
  PROTECTED_SHEET_IDS,
  ALL_SHEET_IDS,
  fetchSheetValues,
  createSheetsHandler,
};
