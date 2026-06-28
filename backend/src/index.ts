import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import downloadRoutes from "./routes/download.js";
import paymentRoutes from "./routes/payment.js";
import subscriptionRoutes from "./routes/subscription.js";
import settingsRoutes from "./routes/settings.js";
import uploadRoutes from "./routes/upload.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = parseInt(process.env["PORT"] || "5000");

app.use(cors({
  origin: process.env["FRONTEND_URL"]
    ? process.env["FRONTEND_URL"].split(",")
    : ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
  credentials: true,
}));
app.use(express.json());

app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve frontend dist files (configurable via FRONTEND_DIST_PATH env var)
// Production: set FRONTEND_DIST_PATH=../ (relative to api/ dir)
// Development: defaults to ../vite-frontend/dist/ (relative to backend dir)
const frontendDistPath = process.env["FRONTEND_DIST_PATH"]
  ? path.resolve(process.env["FRONTEND_DIST_PATH"])
  : path.resolve(__dirname, "../../vite-frontend/dist");

// Try to find index.html at possible locations
const distPathsToTry = [
  frontendDistPath,
  path.resolve(process.cwd(), ".."),         // from api/ to public_html/
  path.resolve(process.cwd(), "public"),     // from api/ to api/public/
];

let distPath = null;
for (const p of distPathsToTry) {
  try {
    if (fs.existsSync(path.join(p, "index.html"))) {
      distPath = p;
      break;
    }
  } catch {}
}

if (distPath) {
  app.use(express.static(distPath, {
    maxAge: "1y",
    immutable: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
      } else if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css; charset=utf-8");
      }
    },
  }));

  // SPA fallback: serve index.html for any non-API GET request
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });

  console.log(`Serving frontend from: ${distPath}`);
} else {
  console.warn("Frontend dist not found. Set FRONTEND_DIST_PATH env var for static file serving.");
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
