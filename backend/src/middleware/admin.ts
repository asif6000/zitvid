import type { Request, Response, NextFunction } from "express";
import { authenticate } from "./auth.js";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  authenticate(req, res, () => {
    if (req.user?.role !== "ADMIN") {
      res.status(403).json({ error: "Forbidden: Admin access required" });
      return;
    }
    next();
  });
}
