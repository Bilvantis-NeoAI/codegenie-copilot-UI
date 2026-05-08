/**
 * GitHub Copilot OAuth Device-Flow proxy.
 * Runs on port 3001. Reads GITHUB_COPILOT_CLIENT_ID from .env.
 * Proxies GitHub API calls so the browser avoids CORS restrictions.
 */

import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import { URL, fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load .env ──────────────────────────────────────────────────────────────
function loadDotenv() {
  try {
    const lines = fs.readFileSync(path.join(__dirname, ".env"), "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch { /* no .env — use process.env */ }
}

loadDotenv();

const PORT = 3001;
const CLIENT_ID = process.env.GITHUB_COPILOT_CLIENT_ID || process.env.GITHUB_CLIENT_ID || "";

// ── Simple HTTPS GET/POST ──────────────────────────────────────────────────
function ghRequest(url, { method = "GET", headers = {}, body = null } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const bodyStr = body ? new URLSearchParams(body).toString() : "";
    const reqHeaders = {
      Accept: "application/json",
      "User-Agent": "genie-dashboard/1.0",
      ...headers,
      ...(bodyStr ? { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": String(Buffer.byteLength(bodyStr)) } : {}),
    };
    const req = https.request(
      { hostname: u.hostname, port: 443, path: u.pathname + u.search, method, headers: reqHeaders },
      (res) => {
        let raw = "";
        res.on("data", (c) => (raw += c));
        res.on("end", () => { try { resolve(JSON.parse(raw)); } catch { resolve({ error: "parse_error" }); } });
      }
    );
    req.on("error", reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// ── HTTP helpers ───────────────────────────────────────────────────────────
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

function send(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, { ...CORS, "Content-Length": Buffer.byteLength(body) });
  res.end(body);
}

// ── Routes ─────────────────────────────────────────────────────────────────
http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") { res.writeHead(204, CORS); res.end(); return; }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // POST /auth/device
  if (req.method === "POST" && url.pathname === "/auth/device") {
    if (!CLIENT_ID) { send(res, 503, { error: "GITHUB_COPILOT_CLIENT_ID not set in .env" }); return; }
    try {
      send(res, 200, await ghRequest("https://github.com/login/device/code", {
        method: "POST",
        body: { client_id: CLIENT_ID, scope: "read:user user:email" },
      }));
    } catch (e) { send(res, 502, { error: String(e) }); }
    return;
  }

  // POST /auth/token?device_code=...
  if (req.method === "POST" && url.pathname === "/auth/token") {
    const device_code = url.searchParams.get("device_code");
    if (!device_code) { send(res, 400, { error: "device_code required" }); return; }
    if (!CLIENT_ID) { send(res, 503, { error: "GITHUB_COPILOT_CLIENT_ID not set in .env" }); return; }
    try {
      send(res, 200, await ghRequest("https://github.com/login/oauth/access_token", {
        method: "POST",
        body: { client_id: CLIENT_ID, device_code, grant_type: "urn:ietf:params:oauth:grant-type:device_code" },
      }));
    } catch (e) { send(res, 502, { error: String(e) }); }
    return;
  }

  // GET /auth/user
  if (req.method === "GET" && url.pathname === "/auth/user") {
    const auth = req.headers["authorization"];
    if (!auth) { send(res, 401, { error: "Authorization header required" }); return; }
    try {
      const ghHeaders = { Authorization: auth, Accept: "application/vnd.github.v3+json" };
      const [user, emails] = await Promise.all([
        ghRequest("https://api.github.com/user", { headers: ghHeaders }),
        ghRequest("https://api.github.com/user/emails", { headers: ghHeaders }),
      ]);
      if (!user.email && Array.isArray(emails)) {
        const primary = emails.find((e) => e.primary && e.verified);
        if (primary) user.email = primary.email;
      }
      send(res, 200, user);
    } catch (e) { send(res, 502, { error: String(e) }); }
    return;
  }

  send(res, 404, { error: "Not found" });
}).listen(PORT, () => {
  console.log(`[auth-proxy] http://localhost:${PORT}`);
  console.log(`[auth-proxy] Client ID: ${CLIENT_ID ? CLIENT_ID.slice(0, 10) + "…" : "NOT SET — check .env"}`);
});
