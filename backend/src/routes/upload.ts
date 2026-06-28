import { Router } from "express";
import multer from "multer";
import path from "path";
import { prisma } from "../config/prisma.js";

const storage = multer.diskStorage({
  destination: path.resolve("uploads"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const router = Router();

router.post("/:type", upload.single("file"), async (req, res) => {
  try {
    const { type } = req.params;
    if (type !== "logo" && type !== "favicon") {
      res.status(400).json({ error: "Type must be 'logo' or 'favicon'" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const filename = req.file.filename;
    const host = req.get("host") || "localhost:5000";
    const protocol = req.protocol || "http";
    const url = `${protocol}://${host}/uploads/${filename}`;

    const key = type === "logo" ? "logoUrl" : "faviconUrl";
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: url },
      create: { key, value: url },
    });

    res.json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
