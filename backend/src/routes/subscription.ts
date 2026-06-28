import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/plans", async (_req, res) => {
  try {
    const plans = await prisma.plan.findMany();
    res.json({ plans });
  } catch (err) {
    console.error("Plans error:", err);
    res.status(500).json({ error: "Failed to fetch plans" });
  }
});

router.post("/seed-plans", async (_req, res) => {
  try {
    const existing = await prisma.plan.count();
    if (existing > 0) {
      res.json({ message: "Plans already exist" });
      return;
    }

    const plans = await prisma.plan.createMany({
      data: [
        {
          name: "Free",
          price: 0,
          currency: "BDT",
          interval: "MONTHLY",
          features: JSON.stringify([
            "Basic quality downloads",
            "5 downloads per day",
            "Standard speed",
            "MP4 format only",
          ]),
        },
        {
          name: "Pro",
          price: 999,
          currency: "BDT",
          interval: "MONTHLY",
          features: JSON.stringify([
            "HD & 4K downloads",
            "Unlimited downloads",
            "High-speed servers",
            "MP3 + MP4 formats",
            "Priority support",
          ]),
        },
        {
          name: "Premium",
          price: 1999,
          currency: "BDT",
          interval: "MONTHLY",
          features: JSON.stringify([
            "8K & 4K downloads",
            "Unlimited downloads",
            "Fastest servers",
            "All formats (MP3, MP4, AVI, MOV)",
            "24/7 priority support",
            "Batch downloads",
            "No ads",
          ]),
        },
        {
          name: "Pro Yearly",
          price: 7999,
          currency: "BDT",
          interval: "YEARLY",
          features: JSON.stringify([
            "Everything in Pro",
            "Save 33% vs monthly",
            "Bonus: 50GB cloud storage",
          ]),
        },
      ],
    });

    res.json({ message: "Plans seeded", count: plans.count });
  } catch (err) {
    console.error("Seed plans error:", err);
    res.status(500).json({ error: "Failed to seed plans" });
  }
});

router.post("/subscribe", authenticate, async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) {
      res.status(400).json({ error: "Plan ID is required" });
      return;
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      res.status(404).json({ error: "Plan not found" });
      return;
    }

    const existingSub = await prisma.subscription.findFirst({
      where: { userId: req.user!.userId, status: "ACTIVE" },
    });

    if (existingSub) {
      await prisma.subscription.update({
        where: { id: existingSub.id },
        data: { status: "CANCELED" },
      });
    }

    const intervalMonths = plan.interval === "YEARLY" ? 12 : 1;
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + intervalMonths);

    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user!.userId,
        planId,
        status: "ACTIVE",
        currentPeriodEnd,
      },
      include: { plan: true },
    });

    if (plan.price > 0) {
      await prisma.payment.create({
        data: {
          userId: req.user!.userId,
          amount: plan.price,
          currency: plan.currency,
          provider: "stripe",
          status: "COMPLETED",
        },
      });
    }

    res.status(201).json({ subscription });
  } catch (err) {
    console.error("Subscribe error:", err);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

router.get("/my-subscription", authenticate, async (req, res) => {
  try {
    const sub = await prisma.subscription.findFirst({
      where: { userId: req.user!.userId, status: "ACTIVE" },
      include: { plan: true },
      orderBy: { currentPeriodEnd: "desc" },
    });

    res.json({ subscription: sub });
  } catch (err) {
    console.error("My subscription error:", err);
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
});

router.post("/cancel", authenticate, async (req, res) => {
  try {
    const sub = await prisma.subscription.findFirst({
      where: { userId: req.user!.userId, status: "ACTIVE" },
    });

    if (!sub) {
      res.status(404).json({ error: "No active subscription found" });
      return;
    }

    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: "CANCELED" },
    });

    res.json({ message: "Subscription canceled" });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
});

export default router;
