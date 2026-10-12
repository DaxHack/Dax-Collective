// dax-backend/middleware/requireAuth.js
//
// Verifies a Firebase ID token on the Authorization header.
// 401 if the token is missing or invalid. Attaches the decoded token to
// req.user. If Firebase Admin is not initialized the token cannot be
// verified, so the request is rejected with 503 — never allowed through.

const {getAdmin, isInitialized} = require("../services/firebaseAdmin");

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ?
    authHeader.slice("Bearer ".length).trim() :
    null;

  if (!token) {
    return res.status(401).json({error: "Unauthorized: No token provided"});
  }

  if (!isInitialized()) {
    return res.status(503).json({error: "Authentication is not available on this server"});
  }

  try {
    req.user = await getAdmin().auth().verifyIdToken(token);
    next();
  } catch (error) {
    console.error("requireAuth: token verification failed:", error.code || error.message);
    res.status(401).json({error: "Unauthorized: Invalid token"});
  }
}

module.exports = requireAuth;
