// dax-backend/routes/adminSheetsApi.js
//
// GET /api/admin/sheets — read access to every configured spreadsheet,
// including the protected operational/analytics/tracking sheets that the
// public GET /api/sheets refuses to serve (see services/sheets.js).
//
// server.js mounts this router inside the /api/admin group, so requireAuth
// and requireAdmin have already run before the handler below is reached,
// and the route does not exist unless ENABLE_ADMIN_UPLOADS=true.

const express = require("express");
const {ALL_SHEET_IDS, createSheetsHandler} = require("../services/sheets");

const router = express.Router(); // eslint-disable-line new-cap

router.get("/sheets", createSheetsHandler(ALL_SHEET_IDS));

module.exports = router;
