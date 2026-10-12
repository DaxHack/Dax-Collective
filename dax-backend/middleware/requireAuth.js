// dax-backend/middleware/requireAuth.js
//
// Verifies a Firebase ID token on the Authorization header.
// 401 if missing or invalid. Attaches the decoded token to req.user.
// This middleware assumes Firebase Admin has already been initialized
// (only happens when ENABLE_ADMIN_UPLOADS=true) — it is only ever
// mounted on the admin route group.

const {getAdmin} = require("../services/firebaseAdmin");

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ?
    authHeader.split("Bearer ")[1].trim() :
    null;

  if (!token) {
    return res.status(401).json({error: "Unauthorized: No token provided"});
  }

  try {
    const admin = getAdmin();
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("requireAuth: token verification failed:", error.message);
    res.status(401).json({error: "Unauthorized: Invalid token"});
  }
}

module.exports = requireAuth;
