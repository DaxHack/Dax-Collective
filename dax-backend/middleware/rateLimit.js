// dax-backend/middleware/rateLimit.js
//
// Minimal in-memory sliding-window rate limiter, no external dependency.
// Good enough for a single-instance deployment. State is per-process: if
// the backend is ever scaled to several instances behind a load balancer,
// swap this for a shared-store limiter (for example Redis-backed).
//
// The client is identified by req.ip, so set TRUST_PROXY when running
// behind a reverse proxy (see config/env.js).

const config = require("../config/env");

const hits = new Map(); // ip -> [timestamps]

function rateLimit(req, res, next) {
  const ip = req.ip || (req.socket && req.socket.remoteAddress) || "unknown";
  const now = Date.now();
  const windowStart = now - config.RATE_LIMIT_WINDOW_MS;

  let timestamps = hits.get(ip) || [];
  timestamps = timestamps.filter((t) => t > windowStart);

  if (timestamps.length >= config.RATE_LIMIT_MAX) {
    hits.set(ip, timestamps);
    const retryAfterMs = timestamps[0] + config.RATE_LIMIT_WINDOW_MS - now;
    res.set("Retry-After", String(Math.max(1, Math.ceil(retryAfterMs / 1000))));
    return res.status(429).json({error: "Too many requests, please try again later."});
  }

  timestamps.push(now);
  hits.set(ip, timestamps);
  next();
}

// Periodic cleanup so the Map doesn't grow unbounded on a long-running process.
const cleanupInterval = setInterval(() => {
  const cutoff = Date.now() - config.RATE_LIMIT_WINDOW_MS;
  for (const [ip, timestamps] of hits.entries()) {
    const fresh = timestamps.filter((t) => t > cutoff);
    if (fresh.length === 0) {
      hits.delete(ip);
    } else {
      hits.set(ip, fresh);
    }
  }
}, Math.min(config.RATE_LIMIT_WINDOW_MS, 5 * 60 * 1000));
cleanupInterval.unref();

module.exports = rateLimit;
