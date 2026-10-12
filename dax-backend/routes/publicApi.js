// dax-backend/routes/publicApi.js
//
// Routes mounted here are reachable with NO authentication. Nothing in
// this file may depend on Firebase Admin, Drive, or any admin-only
// configuration — it must work in a deployment that has none of that
// configured.

const express = require("express");
const config = require("../config/env");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    environment: config.NODE_ENV,
    version: "1.0.0",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    adminUploadsEnabled: config.ENABLE_ADMIN_UPLOADS,
  });
});

module.exports = router;
