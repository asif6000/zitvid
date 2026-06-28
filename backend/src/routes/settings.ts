import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    res.json({ settings: map });
  } catch (err) {
    console.error("Settings fetch error:", err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.put("/", async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== "object") {
      res.status(400).json({ error: "Settings object is required" });
      return;
    }

    for (const [key, value] of Object.entries(settings)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    res.json({ message: "Settings updated" });
  } catch (err) {
    console.error("Settings update error:", err);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
