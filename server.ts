import { Hono } from "hono";
import { RegisterSchema } from "./src/schemas/user";

// ====== Konfigurasi Security Headers ======
// Development CSP (more permissive for HMR)
const DEV_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'", // Allow inline scripts for HMR
  "style-src 'self' 'unsafe-inline'",  // Allow inline styles for HMR
  "img-src 'self' data: http://localhost:*",
  "font-src 'self' data:",
  "connect-src 'self' ws://localhost:*", // Allow WebSocket connections for HMR
  "frame-ancestors 'self'", // Allow framing from same origin for development testing
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

// Production CSP (more restrictive)
const PROD_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'", // Remove unsafe-inline for production
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'", // Restrict framing in production
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

// Determine if we're in development mode
const isDev = process.env.NODE_ENV === "development";
const CSP = isDev ? DEV_CSP : PROD_CSP;

const app = new Hono();

// Middleware headers untuk semua response
app.use("*", async (c, next) => {
  // Apply CSP header (skip in development if needed for HMR)
  if (!isDev || !c.req.path.startsWith("/@vite")) { // Skip CSP for Vite HMR paths in development
    c.header("Content-Security-Policy", CSP);
  }
  
  c.header("X-Content-Type-Options", "nosniff");
  
  // Adjust X-Frame-Options based on environment
  if (isDev) {
    // In development, we allow framing for testing purposes
    c.header("X-Frame-Options", "SAMEORIGIN");
  } else {
    // In production, we deny framing
    c.header("X-Frame-Options", "DENY");
  }
  
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  c.header("Cross-Origin-Opener-Policy", "same-origin");
  c.header("Cross-Origin-Resource-Policy", "same-origin");
  // HSTS hanya untuk HTTPS & domain publik:
  // c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  await next();
});

// ====== API Contoh: /api/register ======
app.post("/api/register", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        { message: "Validasi gagal", issues: parsed.error.format() },
        400
      );
    }

    // TODO: simpan ke DB (jangan lupa validasi ULANG di server seperti ini)
    // Untuk demo, kita kembalikan data yang sudah tervalidasi.
    return c.json({ ok: true });
  } catch {
    return c.json({ message: "Bad Request" }, 400);
  }
});

// ====== Serve file static hasil build Vite ======
const dist = "./dist";

// asset (JS/CSS/font/img)
app.get("/assets/*", async (c) => {
  const file = Bun.file(`${dist}${c.req.path}`);
  if (!(await file.exists())) return c.notFound();
  return new Response(file);
});

// index.html
app.get("/", async () => {
  return new Response(Bun.file(`${dist}/index.html`), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});

// SPA fallback: route lain (kecuali /api/*) -> index.html
app.get("*", async (c) => {
  if (c.req.path.startsWith("/api/")) return c.notFound();
  return new Response(Bun.file(`${dist}/index.html`), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});

Bun.serve({
  port: 8787,
  fetch: app.fetch,
});

console.log("✅ Bun server jalan di http://localhost:8787");
