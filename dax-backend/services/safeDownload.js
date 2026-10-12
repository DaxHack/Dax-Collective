// dax-backend/services/safeDownload.js
//
// Downloads a remote file for the admin "batch from URLs" route without
// letting the caller point the server at itself or its private network
// (server-side request forgery), and without unbounded time or memory.
//
// Protections:
//   - http/https only, default ports only, no credentials in the URL
//   - localhost-style hostnames rejected
//   - literal IPs checked against loopback, private, link-local (including
//     the 169.254.169.254 metadata address), CGNAT, multicast, reserved and
//     the IPv6 equivalents (and IPv4 embedded in IPv6)
//   - hostnames are checked at connection time: the socket's DNS lookup is
//     wrapped, so the address that was validated is the address connected
//     to (no resolve-then-fetch gap for DNS rebinding)
//   - redirects are followed manually, at most a few times, and every hop is
//     validated again
//   - one overall deadline for the whole download
//   - response size capped while streaming (Content-Length is checked first
//     but never trusted)
//
// Errors thrown are DownloadError with a short public message that carries
// no internal detail.

const dns = require("node:dns");
const http = require("node:http");
const https = require("node:https");
const net = require("node:net");

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024; // 10MB — same as the upload limit
const DEFAULT_TIMEOUT_MS = 10 * 1000;
const DEFAULT_MAX_REDIRECTS = 3;

const PUBLIC_MESSAGES = {
  blocked: "URL is not allowed",
  timeout: "Download timed out",
  too_large: "File is too large",
  failed: "Download failed",
};

class DownloadError extends Error {
  constructor(code) {
    super(PUBLIC_MESSAGES[code] || PUBLIC_MESSAGES.failed);
    this.name = "DownloadError";
    this.code = PUBLIC_MESSAGES[code] ? code : "failed";
  }
}

// ─── Address policy ──────────────────────────────────────────────────────────
// [network, prefix length] — everything that is not a public unicast address.
const BLOCKED_IPV4_RANGES = [
  ["0.0.0.0", 8], // "this" network
  ["10.0.0.0", 8], // RFC1918 private
  ["100.64.0.0", 10], // carrier-grade NAT
  ["127.0.0.0", 8], // loopback
  ["169.254.0.0", 16], // link-local, cloud metadata
  ["172.16.0.0", 12], // RFC1918 private
  ["192.0.0.0", 24], // IETF protocol assignments
  ["192.0.2.0", 24], // documentation
  ["192.168.0.0", 16], // RFC1918 private
  ["198.18.0.0", 15], // benchmarking
  ["198.51.100.0", 24], // documentation
  ["203.0.113.0", 24], // documentation
  ["224.0.0.0", 4], // multicast
  ["240.0.0.0", 4], // reserved, broadcast
];

function ipv4ToInt(ip) {
  return ip.split(".").reduce((acc, octet) => ((acc << 8) + Number(octet)) >>> 0, 0);
}

function isBlockedIPv4(ip) {
  const value = ipv4ToInt(ip);
  return BLOCKED_IPV4_RANGES.some(([network, bits]) => {
    const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
    return (value & mask) >>> 0 === (ipv4ToInt(network) & mask) >>> 0;
  });
}

// Expands an IPv6 address to its eight 16-bit groups, or null if malformed.
function expandIPv6(input) {
  let ip = input.split("%")[0]; // drop zone id
  const lastColon = ip.lastIndexOf(":");
  const tail = ip.slice(lastColon + 1);
  if (tail.includes(".")) { // embedded IPv4 in the last 32 bits
    if (!net.isIPv4(tail)) return null;
    const v4 = ipv4ToInt(tail);
    ip = `${ip.slice(0, lastColon + 1)}${(v4 >>> 16).toString(16)}:${(v4 & 0xffff).toString(16)}`;
  }
  const halves = ip.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const rest = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const missing = 8 - head.length - rest.length;
  if (halves.length === 1 ? missing !== 0 : missing < 1) return null;
  const groups = [...head, ...Array(halves.length === 2 ? missing : 0).fill("0"), ...rest]
      .map((group) => parseInt(group, 16));
  return groups.length === 8 && groups.every((g) => Number.isInteger(g) && g >= 0 && g <= 0xffff) ?
    groups :
    null;
}

function groupsToIPv4(high, low) {
  return `${high >>> 8}.${high & 0xff}.${low >>> 8}.${low & 0xff}`;
}

function isBlockedIPv6(ip) {
  const g = expandIPv6(ip);
  if (!g) return true;

  const firstFiveZero = g.slice(0, 5).every((group) => group === 0);
  if (firstFiveZero && g[5] === 0 && g[6] === 0 && g[7] <= 1) return true; // :: and ::1
  if (firstFiveZero && (g[5] === 0xffff || g[5] === 0)) { // IPv4-mapped / IPv4-compatible
    return isBlockedIPv4(groupsToIPv4(g[6], g[7]));
  }
  if (g[0] === 0x64 && g[1] === 0xff9b && g.slice(2, 6).every((group) => group === 0)) { // NAT64
    return isBlockedIPv4(groupsToIPv4(g[6], g[7]));
  }
  if (g[0] === 0x2002) return isBlockedIPv4(groupsToIPv4(g[1], g[2])); // 6to4

  if ((g[0] & 0xfe00) === 0xfc00) return true; // fc00::/7 unique local
  if ((g[0] & 0xffc0) === 0xfe80) return true; // fe80::/10 link-local
  if ((g[0] & 0xffc0) === 0xfec0) return true; // fec0::/10 site-local (deprecated)
  if ((g[0] & 0xff00) === 0xff00) return true; // ff00::/8 multicast
  if (g[0] === 0x2001 && g[1] === 0x0db8) return true; // documentation
  return false;
}

/**
 * @param {string} address literal IPv4 or IPv6 address
 * @return {boolean} true when the address must not be fetched from
 */
function isBlockedAddress(address) {
  if (net.isIPv4(address)) return isBlockedIPv4(address);
  if (net.isIPv6(address)) return isBlockedIPv6(address);
  return true; // not an IP at all
}

function isBlockedHostname(hostname) {
  const name = hostname.toLowerCase().replace(/\.$/, "");
  return name === "" ||
    name === "localhost" ||
    name.endsWith(".localhost") ||
    name.endsWith(".local") ||
    name.endsWith(".internal");
}

const defaultPortPolicy = (port) => port === ""; // URL drops the scheme's default port

// ─── URL validation ──────────────────────────────────────────────────────────
function validateUrl(rawUrl, options = {}) {
  const isBlocked = options.isBlocked || isBlockedAddress;
  const allowPort = options.allowPort || defaultPortPolicy;

  let url;
  try {
    url = new URL(rawUrl);
  } catch (err) {
    throw new DownloadError("blocked");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") throw new DownloadError("blocked");
  if (url.username || url.password) throw new DownloadError("blocked");
  if (!allowPort(url.port)) throw new DownloadError("blocked");

  // WHATWG URL already normalizes exotic IPv4 spellings (decimal, hex, octal)
  // to dotted form, so a literal check here sees the real address.
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  if (net.isIP(hostname)) {
    if (isBlocked(hostname)) throw new DownloadError("blocked");
  } else if (isBlockedHostname(hostname)) {
    throw new DownloadError("blocked");
  }

  return {url, hostname};
}

// Wraps a dns.lookup-compatible function so that a hostname resolving to ANY
// blocked address fails the connection.
function createGuardedLookup(isBlocked, baseLookup) {
  return (hostname, lookupOptions, callback) => {
    const cb = typeof lookupOptions === "function" ? lookupOptions : callback;
    const opts = typeof lookupOptions === "object" && lookupOptions !== null ? lookupOptions : {};

    baseLookup(hostname, {...opts, all: true}, (err, result) => {
      if (err) return cb(err);
      const addresses = Array.isArray(result) ? result : [{address: result, family: net.isIP(result)}];
      if (addresses.length === 0 || addresses.some((entry) => isBlocked(entry.address))) {
        return cb(new DownloadError("blocked"));
      }
      if (opts.all) return cb(null, addresses);
      cb(null, addresses[0].address, addresses[0].family);
    });
  };
}

function requestOnce(target, lookup, signal) {
  const {url, hostname} = target;
  const client = url.protocol === "https:" ? https : http;

  return new Promise((resolve, reject) => {
    const req = client.request({
      protocol: url.protocol,
      hostname,
      port: url.port || undefined,
      path: `${url.pathname}${url.search}`,
      method: "GET",
      headers: {"Accept": "image/*", "User-Agent": "dax-backend-image-fetch"},
      agent: false, // no connection reuse: every request performs its own guarded lookup
      lookup,
      signal,
    }, resolve);
    req.on("error", reject);
    req.end();
  });
}

function readBody(res, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    res.on("data", (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        // Reject first: destroy() emits "aborted" synchronously.
        reject(new DownloadError("too_large"));
        res.destroy();
        return;
      }
      chunks.push(chunk);
    });
    res.on("end", () => resolve(Buffer.concat(chunks)));
    res.on("error", reject);
    res.on("aborted", () => reject(new DownloadError("failed")));
  });
}

/**
 * Download a remote file with SSRF, time and size protections.
 * @param {string} rawUrl
 * @param {object} [options] maxBytes, timeoutMs, maxRedirects; `isBlocked`,
 *   `allowPort` and `lookup` exist so tests can exercise limits against a
 *   local server — production callers must not pass them.
 * @return {Promise<Buffer>}
 */
async function safeDownload(rawUrl, options = {}) {
  const maxBytes = options.maxBytes || DEFAULT_MAX_BYTES;
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
  const maxRedirects = options.maxRedirects === undefined ? DEFAULT_MAX_REDIRECTS : options.maxRedirects;
  const isBlocked = options.isBlocked || isBlockedAddress;
  const lookup = createGuardedLookup(isBlocked, options.lookup || dns.lookup);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let current = rawUrl;
    for (let hop = 0; hop <= maxRedirects; hop++) {
      const target = validateUrl(current, options);
      const res = await requestOnce(target, lookup, controller.signal);

      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        res.resume();
        if (!res.headers.location) throw new DownloadError("failed");
        current = new URL(res.headers.location, target.url).toString();
        continue;
      }

      if (res.statusCode < 200 || res.statusCode >= 300) {
        res.resume();
        throw new DownloadError("failed");
      }

      const declaredLength = Number(res.headers["content-length"]);
      if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
        res.destroy();
        throw new DownloadError("too_large");
      }

      return await readBody(res, maxBytes);
    }
    throw new DownloadError("failed"); // too many redirects
  } catch (err) {
    if (controller.signal.aborted) throw new DownloadError("timeout");
    if (err instanceof DownloadError) throw err;
    throw new DownloadError("failed");
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  safeDownload,
  validateUrl,
  isBlockedAddress,
  DownloadError,
  DEFAULT_MAX_BYTES,
  DEFAULT_TIMEOUT_MS,
};
