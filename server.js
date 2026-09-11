import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = Number(process.env.PORT || 3000);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

const ROUTES = new Map([
  ["/", "index.html"],
  ["/app", "index.html"],
  ["/app/", "index.html"],
  ["/admin", "admin.html"],
  ["/admin/", "admin.html"],
  ["/import", "import.html"],
  ["/import/", "import.html"]
]);

function respond(res, status, body, type, cache = "no-store") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": cache,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "same-origin",
    "X-Frame-Options": "SAMEORIGIN"
  });
  res.end(body);
}

async function fileResponse(file, res) {
  const filePath = join(ROOT, file);
  const data = await readFile(filePath);
  const ext = extname(filePath).toLowerCase();
  const type = TYPES[ext] || "application/octet-stream";
  const cache = ext === ".html" || ext === ".js" || ext === ".webmanifest"
    ? "no-store"
    : "public, max-age=86400";
  respond(res, 200, data, type, cache);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", "http://localhost");

    if (url.pathname === "/health") {
      return respond(
        res, 200,
        JSON.stringify({ ok: true, service: "gangwon-daily-check", routes: ["/", "/admin", "/import"] }),
        "application/json; charset=utf-8"
      );
    }

    if (ROUTES.has(url.pathname)) {
      return await fileResponse(ROUTES.get(url.pathname), res);
    }

    const decoded = decodeURIComponent(url.pathname);
    const safe = normalize(decoded).replace(/^(\.\.[/\\])+/, "").replace(/^[/\\]+/, "");
    if (!safe || safe.includes("..")) {
      return respond(res, 400, "Bad Request", "text/plain; charset=utf-8");
    }

    const full = join(ROOT, safe);
    const st = await stat(full);
    if (!st.isFile()) throw Object.assign(new Error("not found"), { code: "ENOENT" });
    return await fileResponse(safe, res);
  } catch (err) {
    if (err?.code === "ENOENT") {
      return respond(res, 404, "Not Found", "text/plain; charset=utf-8");
    }
    console.error(err);
    return respond(res, 500, "Internal Server Error", "text/plain; charset=utf-8");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Gangwon daily-check running on http://0.0.0.0:${PORT}`);
});
