import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import downloadRoutes from "./routes/download.js";
import paymentRoutes from "./routes/payment.js";
import subscriptionRoutes from "./routes/subscription.js";
import settingsRoutes from "./routes/settings.js";
import uploadRoutes from "./routes/upload.js";

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
