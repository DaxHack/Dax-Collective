// dax-backend/test/sheets.test.js
//
// Public vs protected Google Sheets access. The Google API is never called:
// services/sheets.fetchSheetValues is replaced with a recorder after the app
// loads, so a 200 here means "the route allowed the request through".

const test = require("node:test");
const assert = require("node:assert/strict");
const {ADMIN_ENV, startApp, bearer, modulePath} = require("../test-support/harness");

const SHEET_ENV = {
  // Public website content
  SHEET_GODS_VESSEL_QUOTES: "public-quotes-id",
  SHEET_DAX_TRAVELER_BLOGS: "public-blogs-id",
  SHEET_TIMEZONE_TRAVELERS_BLOGS_ITINERARIES: "public-itineraries-id",
  // Protected
  SHEET_BRAND_ANALYTICS_DASHBOARD: "protected-analytics-id",
  SHEET_SOCIAL_TRACKING_YOUTUBE: "protected-youtube-id",
  SHEET_SOCIAL_TRACKING_INSTAGRAM: "protected-instagram-id",
  SHEET_SOCIAL_TRACKING_TIKTOK: "protected-tiktok-id",
  SHEET_SOCIAL_TRACKING_TWITTER: "protected-twitter-id",
  SHEET_SOCIAL_TRACKING_FACEBOOK: "protected-facebook-id",
  SHEET_TSHIRT_DESIGNS_CANVA_BULK: "protected-designs-id",
  SHEET_GODS_VESSEL_DISCUSSIONS: "protected-discussions-id",
  SHEET_SATIATED_TASTE_RECIPES: "protected-recipes-id",
};

const PUBLIC_IDS = ["public-quotes-id", "public-blogs-id", "public-itineraries-id"];
const PROTECTED_IDS = Object.values(SHEET_ENV).filter((id) => !PUBLIC_IDS.includes(id));

// Starts the app and swaps the Google call for a recorder.
async function startSheetsApp(env) {
  const app = await startApp({...SHEET_ENV, ...env}, {stubFirebase: true});
  const sheets = require(modulePath("services/sheets.js"));
  const calls = [];
  sheets.fetchSheetValues = async (request) => {
    calls.push(request);
    return {status: 200, data: {values: [["ok"]]}};
  };
  return {...app, calls};
}

const publicSheet = (app, id) => fetch(`${app.base}/api/sheets?spreadsheetId=${id}`);
const adminSheet = (app, id, token) => fetch(`${app.base}/api/admin/sheets?spreadsheetId=${id}`, {
  headers: bearer(token),
});

test("public content sheets are readable anonymously", async (t) => {
  const app = await startSheetsApp({});
  t.after(app.close);

  for (const id of PUBLIC_IDS) {
    const res = await publicSheet(app, id);
    assert.equal(res.status, 200, id);
    assert.deepEqual(await res.json(), {values: [["ok"]]});
  }
  assert.deepEqual(app.calls.map((call) => call.spreadsheetId), PUBLIC_IDS);
});

test("protected sheets cannot be read anonymously through the public route", async (t) => {
  const app = await startSheetsApp({});
  t.after(app.close);

  for (const id of PROTECTED_IDS) {
    const res = await publicSheet(app, id);
    assert.equal(res.status, 403, id);
  }
  assert.equal(app.calls.length, 0, "Google was never called for a protected sheet");
});

test("a signed-in admin token does not unlock protected sheets on the public route", async (t) => {
  const app = await startSheetsApp(ADMIN_ENV);
  t.after(app.close);

  const res = await fetch(`${app.base}/api/sheets?spreadsheetId=protected-analytics-id`, {
    headers: bearer("token-admin-claim"),
  });
  assert.equal(res.status, 403);
  assert.equal(app.calls.length, 0);
});

test("protected and unknown sheets get the same public response", async (t) => {
  const app = await startSheetsApp({});
  t.after(app.close);

  const protectedRes = await publicSheet(app, "protected-analytics-id");
  const unknownRes = await publicSheet(app, "never-configured-id");
  assert.equal(protectedRes.status, unknownRes.status);
  assert.deepEqual(await protectedRes.json(), await unknownRes.json());
});

test("the admin sheets route does not exist when admin routes are off", async (t) => {
  const app = await startSheetsApp({});
  t.after(app.close);

  const res = await adminSheet(app, "protected-analytics-id", "token-admin-claim");
  assert.equal(res.status, 404);
  assert.equal(app.calls.length, 0);
});

test("protected sheets require authenticated admin authorization", async (t) => {
  const app = await startSheetsApp(ADMIN_ENV);
  t.after(app.close);

  const id = "protected-analytics-id";
  assert.equal((await adminSheet(app, id, null)).status, 401, "anonymous");
  assert.equal((await adminSheet(app, id, "token-unknown")).status, 401, "invalid token");
  assert.equal((await adminSheet(app, id, "token-regular-user")).status, 403, "signed in, not admin");
  assert.equal(app.calls.length, 0, "no sheet was read before authorization passed");

  assert.equal((await adminSheet(app, id, "token-allowlisted")).status, 200, "ADMIN_UIDS allowlist");
  assert.equal((await adminSheet(app, id, "token-admin-claim")).status, 200, "admin custom claim");
  assert.equal(app.calls.length, 2);
});

test("an admin can read every configured sheet but nothing outside the list", async (t) => {
  const app = await startSheetsApp(ADMIN_ENV);
  t.after(app.close);

  for (const id of [...PROTECTED_IDS, ...PUBLIC_IDS]) {
    assert.equal((await adminSheet(app, id, "token-admin-claim")).status, 200, id);
  }
  assert.equal((await adminSheet(app, "never-configured-id", "token-admin-claim")).status, 403);
});

test("an ID configured as both public and protected is treated as protected", async (t) => {
  const app = await startSheetsApp({SHEET_GODS_VESSEL_QUOTES: "protected-analytics-id"});
  t.after(app.close);

  assert.equal((await publicSheet(app, "protected-analytics-id")).status, 403);
});

test("sheets routes validate their query", async (t) => {
  const app = await startSheetsApp({});
  t.after(app.close);

  assert.equal((await fetch(`${app.base}/api/sheets`)).status, 400);
  const badOption = await fetch(`${app.base}/api/sheets?spreadsheetId=public-quotes-id&valueRenderOption=EVIL`);
  assert.equal(badOption.status, 400);
});

test("public sheets answer 503, not data, when no service account is configured", async (t) => {
  // No fetch stub here: the real fetchSheetValues runs and finds no credentials.
  const app = await startApp(SHEET_ENV, {stubFirebase: true});
  t.after(app.close);

  const res = await publicSheet(app, "public-quotes-id");
  assert.equal(res.status, 503);
});
