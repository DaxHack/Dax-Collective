// dax-backend/middleware/requireAdmin.js
//
// Must run AFTER requireAuth (expects req.user to be a decoded Firebase
// ID token). Allows the request through if either:
//   - the token has a custom claim `admin: true`, OR
//   - the token's uid is present in the server-only ADMIN_UIDS allowlist
// Returns 403 otherwise. Never relies on the route URL being "hidden" —
// this check runs on every request to an admin-mounted route.

const config = require("../config/env");

function requireAdmin(req, res, next) {
  if (!req.user || !req.user.uid) {
    // Defensive: requireAdmin should always run after requireAuth.
    return res.status(401).json({error: "Unauthorized: No authenticated user"});
  }

  const hasAdminClaim = req.user.admin === true;
  const isAllowlistedUid = config.ADMIN_UIDS.includes(req.user.uid);

  if (hasAdminClaim || isAllowlistedUid) {
    return next();
  }

  console.warn(`requireAdmin: blocked uid=${req.user.uid} (not in ADMIN_UIDS, no admin claim)`);
  return res.status(403).json({error: "Forbidden: Admin access required"});
}

module.exports = requireAdmin;
