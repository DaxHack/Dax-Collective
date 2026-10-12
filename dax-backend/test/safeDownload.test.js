// dax-backend/test/safeDownload.test.js
//
// SSRF, timeout, size and count protections for POST
// /api/admin/drive/batch-from-urls. Nothing here reaches the public
// internet: blocked targets are rejected before any connection, and the
// limit tests talk to a local server through explicit test-only overrides.

const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const {ADMIN_ENV, startApp, bearer, modulePath} = require("../test-support/harness");

const {
  safeDownload,
  validateUrl,
  isBlockedAddress,
  DownloadError,
} = require(modulePath("services/safeDownload.js"));

function assertBlocked(fn, label) {
  assert.throws(fn, (err) => err instanceof DownloadError && err.code === "blocked", label);
}

async function rejectsWithCode(promise, code, label) {
  await assert.rejects(promise, (err) => err instanceof DownloadError && err.code === code, label);
}

// Local server for the limit tests. Reaching it needs the test-only
// overrides: loopback is blocked and non-default ports are refused by default.
async function startLocalServer(handler) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    port: server.address().port,
    close: () => new Promise((resolve) => {
      server.closeAllConnections();
      server.close(resolve);
    }),
  };
}

const LOCAL_TEST_OVERRIDES = {
  isBlocked: (address) => address !== "127.0.0.1" && isBlockedAddress(address),
  allowPort: () => true,
};

test("blocks loopback, private, link-local and reserved IPv4 addresses", () => {
  const blocked = [
    "127.0.0.1", "127.255.255.254", // loopback
    "10.0.0.1", "10.255.255.255", // RFC1918
    "172.16.0.1", "172.31.255.255", // RFC1918
    "192.168.0.1", "192.168.255.255", // RFC1918
    "169.254.169.254", "169.254.0.1", // link-local / cloud metadata
    "100.64.0.1", // carrier-grade NAT
    "0.0.0.0", "224.0.0.1", "255.255.255.255", // unspecified, multicast, broadcast
  ];
  for (const address of blocked) assert.equal(isBlockedAddress(address), true, address);

  const allowed = ["8.8.8.8", "1.1.1.1", "172.15.255.255", "172.32.0.1", "192.167.1.1", "169.253.1.1", "11.0.0.1"];
  for (const address of allowed) assert.equal(isBlockedAddress(address), false, address);
});

test("blocks local, private and link-local IPv6 addresses and embedded IPv4", () => {
  const blocked = [
    "::1", "::", // loopback, unspecified
    "fe80::1", "fe80::1%eth0", "febf::1", // link-local
    "fc00::1", "fd12:3456:789a::1", // unique local
    "ff02::1", // multicast
    "::ffff:127.0.0.1", "::ffff:10.0.0.1", "::ffff:169.254.169.254", // IPv4-mapped
    "::ffff:7f00:1", // IPv4-mapped, hex form
    "64:ff9b::a9fe:a9fe", // NAT64 of 169.254.169.254
    "2002:7f00:1::", // 6to4 of 127.0.0.1
  ];
  for (const address of blocked) assert.equal(isBlockedAddress(address), true, address);

  const allowed = ["2606:4700:4700::1111", "2001:4860:4860::8888", "::ffff:8.8.8.8"];
  for (const address of allowed) assert.equal(isBlockedAddress(address), false, address);
});

test("treats anything that is not an IP address as blocked", () => {
  for (const value of ["", "not-an-ip", "999.1.1.1", "1.2.3", "gggg::1"]) {
    assert.equal(isBlockedAddress(value), true, value);
  }
});

test("validateUrl rejects disallowed schemes, hosts, ports and credentials", () => {
  const rejected = [
    "ftp://example.com/a.jpg",
    "file:///etc/passwd",
    "gopher://example.com/",
    "javascript:alert(1)",
    "not a url",
    "http://localhost/a.jpg",
    "http://LOCALHOST./a.jpg",
    "http://api.localhost/a.jpg",
    "http://printer.local/a.jpg",
    "http://metadata.google.internal/computeMetadata/v1/",
    "http://127.0.0.1/a.jpg",
    "http://2130706433/a.jpg", // decimal spelling of 127.0.0.1
    "http://0x7f.0.0.1/a.jpg", // hex spelling of 127.0.0.1
    "http://10.1.2.3/a.jpg",
    "http://172.20.0.5/a.jpg",
    "http://192.168.1.10/a.jpg",
    "http://169.254.169.254/latest/meta-data/",
    "http://[::1]/a.jpg",
    "http://[fe80::1]/a.jpg",
    "http://[fd00::1]/a.jpg",
    "http://[::ffff:127.0.0.1]/a.jpg",
    "http://example.com:8080/a.jpg", // non-default port
    "https://example.com:22/a.jpg",
    "https://user:pass@example.com/a.jpg",
  ];
  for (const url of rejected) assertBlocked(() => validateUrl(url), url);

  assert.equal(validateUrl("https://example.com/a.jpg").hostname, "example.com");
  assert.equal(validateUrl("http://example.com:80/a.jpg").hostname, "example.com");
  assert.equal(validateUrl("https://8.8.8.8/a.jpg").hostname, "8.8.8.8");
});

test("rejects a hostname that resolves to a private address", async () => {
  let lookups = 0;
  const lookup = (hostname, options, callback) => {
    lookups++;
    callback(null, [{address: "10.0.0.5", family: 4}]);
  };
  await rejectsWithCode(safeDownload("http://images.example.test/a.jpg", {lookup}), "blocked");
  assert.equal(lookups, 1, "the guarded lookup ran instead of trusting the hostname");
});

test("rejects a hostname when any resolved address is private", async () => {
  const lookup = (hostname, options, callback) => {
    callback(null, [{address: "93.184.216.34", family: 4}, {address: "169.254.169.254", family: 4}]);
  };
  await rejectsWithCode(safeDownload("http://images.example.test/a.jpg", {lookup}), "blocked");
});

test("rejects a hostname that resolves to a private IPv6 address", async () => {
  const lookup = (hostname, options, callback) => callback(null, [{address: "fd00::1", family: 6}]);
  await rejectsWithCode(safeDownload("https://images.example.test/a.jpg", {lookup}), "blocked");
});

test("downloads within limits when the target is allowed", async (t) => {
  const server = await startLocalServer((req, res) => res.end(Buffer.alloc(2048, 1)));
  t.after(server.close);

  const body = await safeDownload(`${server.url}/a.jpg`, LOCAL_TEST_OVERRIDES);
  assert.equal(body.length, 2048);
});

test("the default policy refuses the same local server", async (t) => {
  const server = await startLocalServer((req, res) => res.end("secret"));
  t.after(server.close);

  await rejectsWithCode(safeDownload(`${server.url}/a.jpg`), "blocked", "loopback literal");
  await rejectsWithCode(
      safeDownload(`http://127.0.0.1:${server.port}/a.jpg`, {allowPort: () => true}),
      "blocked",
      "loopback literal even when the port is allowed",
  );
});

test("stops when Content-Length exceeds the size limit", async (t) => {
  const server = await startLocalServer((req, res) => res.end(Buffer.alloc(5000, 1)));
  t.after(server.close);

  await rejectsWithCode(
      safeDownload(`${server.url}/big.jpg`, {...LOCAL_TEST_OVERRIDES, maxBytes: 1000}),
      "too_large",
  );
});

test("stops a streamed response once it passes the size limit", async (t) => {
  const server = await startLocalServer((req, res) => {
    res.writeHead(200); // chunked: no Content-Length to check up front
    const timer = setInterval(() => res.write(Buffer.alloc(400, 1)), 5);
    res.on("close", () => clearInterval(timer));
  });
  t.after(server.close);

  await rejectsWithCode(
      safeDownload(`${server.url}/stream.jpg`, {...LOCAL_TEST_OVERRIDES, maxBytes: 1000}),
      "too_large",
  );
});

test("times out a server that never finishes responding", async (t) => {
  const server = await startLocalServer(() => {}); // accepts the request, never responds
  t.after(server.close);

  const started = Date.now();
  await rejectsWithCode(
      safeDownload(`${server.url}/slow.jpg`, {...LOCAL_TEST_OVERRIDES, timeoutMs: 200}),
      "timeout",
  );
  assert.ok(Date.now() - started < 3000, "returned promptly");
});

test("validates every redirect hop", async (t) => {
  const server = await startLocalServer((req, res) => {
    res.writeHead(302, {Location: "http://169.254.169.254/latest/meta-data/"});
    res.end();
  });
  t.after(server.close);

  await rejectsWithCode(safeDownload(`${server.url}/redirect`, LOCAL_TEST_OVERRIDES), "blocked");
});

test("gives up on redirect loops", async (t) => {
  const server = await startLocalServer((req, res) => {
    res.writeHead(302, {Location: "/again"});
    res.end();
  });
  t.after(server.close);

  await rejectsWithCode(safeDownload(`${server.url}/loop`, LOCAL_TEST_OVERRIDES), "failed");
});

test("error messages carry no internal detail", () => {
  for (const code of ["blocked", "timeout", "too_large", "failed", "something-else"]) {
    const message = new DownloadError(code).message;
    assert.match(message, /^(URL is not allowed|Download timed out|File is too large|Download failed)$/);
  }
});

// ─── Route level ─────────────────────────────────────────────────────────────
const DRIVE_ENV = {
  ...ADMIN_ENV,
  ENABLE_DRIVE_AUTOMATION: "true",
  GOOGLE_CLIENT_ID: "test-client-id",
  GOOGLE_CLIENT_SECRET: "test-client-secret",
  GOOGLE_REDIRECT_URI: "http://localhost/callback",
  GOOGLE_REFRESH_TOKEN: "test-refresh-token",
  DRIVE_FOLDER_COLLECTIVE: "test-folder-id",
};

function postBatch(app, urls, token = "token-admin-claim") {
  return fetch(`${app.base}/api/admin/drive/batch-from-urls`, {
    method: "POST",
    headers: {"Content-Type": "application/json", ...bearer(token)},
    body: JSON.stringify({urls}),
  });
}

test("batch-from-urls refuses internal targets and reports only generic errors", async (t) => {
  const app = await startApp(DRIVE_ENV, {stubFirebase: true});
  t.after(app.close);

  const urls = [
    "http://169.254.169.254/latest/meta-data/iam/security-credentials/",
    "http://localhost:5000/api/health",
    "http://127.0.0.1/",
    "http://[::1]/",
    "http://10.0.0.1/a.jpg",
    "http://192.168.1.1/a.jpg",
    "ftp://example.com/a.jpg",
  ];
  const res = await postBatch(app, urls);
  assert.equal(res.status, 200);
  const body = await res.json();

  assert.equal(body.totalUploaded, 0);
  assert.equal(body.totalErrors, urls.length);
  for (const entry of body.errors) assert.equal(entry.error, "URL is not allowed");
});

test("batch-from-urls caps the number of URLs per request", async (t) => {
  const app = await startApp(DRIVE_ENV, {stubFirebase: true});
  t.after(app.close);

  const tooMany = Array.from({length: 11}, (_, i) => `https://example.com/${i}.jpg`);
  const res = await postBatch(app, tooMany);
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /Maximum is 10/);
});

test("batch-from-urls rejects non-string URL entries", async (t) => {
  const app = await startApp(DRIVE_ENV, {stubFirebase: true});
  t.after(app.close);

  const res = await postBatch(app, ["https://example.com/a.jpg", {href: "http://127.0.0.1/"}]);
  assert.equal(res.status, 400);
});

test("batch-from-urls still requires admin authorization", async (t) => {
  const app = await startApp(DRIVE_ENV, {stubFirebase: true});
  t.after(app.close);

  assert.equal((await postBatch(app, ["https://example.com/a.jpg"], null)).status, 401);
  assert.equal((await postBatch(app, ["https://example.com/a.jpg"], "token-regular-user")).status, 403);
});
