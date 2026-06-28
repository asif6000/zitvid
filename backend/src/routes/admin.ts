import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAdmin } from "../middleware/admin.js";
import { nagadService } from "../services/nagad.js";
import { rupantorPayService } from "../services/rupantorpay.js";
import { uddoktaService } from "../services/uddokta.js";

const router = Router();

router.use(requireAdmin);

router.get("/stats", async (_req, res) => {
  try {
    const [
      totalUsers,
      totalDownloads,
      activeSubscriptions,
      totalPayments,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.download.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.payment.count({ where: { status: "COMPLETED" } }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
    ]);

    res.json({
      totalUsers,
      totalDownloads,
      activeSubscriptions,
      totalPayments,
      totalRevenue: totalRevenue._sum.amount || 0,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/stats/timeline", async (_req, res) => {
  try {
    const days = 30;
    const now = new Date();
    const dates: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }

    const [downloads, users, payments] = await Promise.all([
      prisma.download.findMany({ select: { createdAt: true } }),
      prisma.user.findMany({ select: { createdAt: true } }),
      prisma.payment.findMany({ where: { status: "COMPLETED" }, select: { amount: true, createdAt: true } }),
    ]);

    const timeline = dates.map((date) => {
      const downloadsCount = downloads.filter((d) => d.createdAt.toISOString().slice(0, 10) === date).length;
      const usersCount = users.filter((u) => u.createdAt.toISOString().slice(0, 10) === date).length;
      const revenue = payments
        .filter((p) => p.createdAt.toISOString().slice(0, 10) === date)
        .reduce((sum, p) => sum + p.amount, 0);
      return { date, downloads: downloadsCount, users: usersCount, revenue };
    });

    const platformBreakdown = await prisma.download.groupBy({
      by: ["platform"],
      _count: true,
      orderBy: { _count: { platform: "desc" } },
    });

    res.json({ timeline, platformBreakdown: platformBreakdown.map((p) => ({ platform: p.platform, count: p._count })) });
  } catch (err) {
    console.error("Stats timeline error:", err);
    res.status(500).json({ error: "Failed to fetch timeline" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          _count: {
            select: { downloads: true, subscriptions: true, payments: true },
          },
        },
      }),
      prisma.user.count(),
    ]);

    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Admin users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id as string },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        subscriptions: { include: { plan: true }, orderBy: { currentPeriodEnd: "desc" } },
        downloads: { orderBy: { createdAt: "desc" }, take: 20 },
        payments: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user });
  } catch (err) {
    console.error("Admin user detail error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id as string } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await prisma.$transaction([
      prisma.payment.deleteMany({ where: { userId: user.id } }),
      prisma.subscription.deleteMany({ where: { userId: user.id } }),
      prisma.download.deleteMany({ where: { userId: user.id } }),
      prisma.user.delete({ where: { id: user.id } }),
    ]);

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.get("/downloads", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [downloads, total] = await Promise.all([
      prisma.download.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.download.count(),
    ]);

    res.json({ downloads, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Admin downloads error:", err);
    res.status(500).json({ error: "Failed to fetch downloads" });
  }
});

router.get("/subscriptions", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        skip,
        take: limit,
        orderBy: { currentPeriodEnd: "desc" },
        include: {
          user: { select: { id: true, email: true, name: true } },
          plan: true,
        },
      }),
      prisma.subscription.count(),
    ]);

    res.json({ subscriptions, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Admin subscriptions error:", err);
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
});

router.patch("/subscriptions/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["ACTIVE", "CANCELED", "EXPIRED"].includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    const sub = await prisma.subscription.update({
      where: { id: req.params.id as string },
      data: { status },
      include: { user: { select: { id: true, email: true, name: true } }, plan: true },
    });

    res.json({ subscription: sub });
  } catch (err) {
    console.error("Admin update subscription error:", err);
    res.status(500).json({ error: "Failed to update subscription" });
  }
});

router.get("/payments", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.payment.count(),
    ]);

    res.json({ payments, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Admin payments error:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

router.get("/plans", async (_req, res) => {
  try {
    const plans = await prisma.plan.findMany();
    res.json({ plans });
  } catch (err) {
    console.error("Admin plans error:", err);
    res.status(500).json({ error: "Failed to fetch plans" });
  }
});

router.post("/plans", async (req, res) => {
  try {
    const { name, price, currency, interval, features } = req.body;
    if (!name || price === undefined || !currency || !interval) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        price: parseFloat(price),
        currency,
        interval,
        features: features || [],
      },
    });

    res.status(201).json({ plan });
  } catch (err) {
    console.error("Admin create plan error:", err);
    res.status(500).json({ error: "Failed to create plan" });
  }
});

router.put("/plans/:id", async (req, res) => {
  try {
    const { name, price, currency, interval, features } = req.body;

    const plan = await prisma.plan.update({
      where: { id: req.params.id as string },
      data: {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(currency !== undefined && { currency }),
        ...(interval !== undefined && { interval }),
        ...(features !== undefined && { features }),
      },
    });

    res.json({ plan });
  } catch (err) {
    console.error("Admin update plan error:", err);
    res.status(500).json({ error: "Failed to update plan" });
  }
});

router.delete("/plans/:id", async (req, res) => {
  try {
    const subCount = await prisma.subscription.count({
      where: { planId: req.params.id as string },
    });

    if (subCount > 0) {
      res.status(400).json({ error: "Cannot delete plan with active subscriptions" });
      return;
    }

    await prisma.plan.delete({ where: { id: req.params.id as string } });
    res.json({ message: "Plan deleted" });
  } catch (err) {
    console.error("Admin delete plan error:", err);
    res.status(500).json({ error: "Failed to delete plan" });
  }
});

router.get("/payment-gateways", async (_req, res) => {
  try {
    const gateways = await prisma.paymentGateway.findMany();
    res.json({ gateways });
  } catch (err) {
    console.error("Payment gateways error:", err);
    res.status(500).json({ error: "Failed to fetch gateways" });
  }
});

router.get("/payment-gateways/:provider", async (req, res) => {
  try {
    const gateway = await prisma.paymentGateway.findUnique({
      where: { provider: req.params.provider as string },
    });
    if (!gateway) {
      res.status(404).json({ error: "Gateway not found" });
      return;
    }
    res.json({ gateway });
  } catch (err) {
    console.error("Payment gateway error:", err);
    res.status(500).json({ error: "Failed to fetch gateway" });
  }
});

router.put("/payment-gateways/:provider", async (req, res) => {
  try {
    const { label, config, isActive } = req.body;

    const gateway = await prisma.paymentGateway.upsert({
      where: { provider: req.params.provider as string },
      update: {
        ...(label !== undefined && { label }),
        ...(config !== undefined && { config: JSON.stringify(config) }),
        ...(isActive !== undefined && { isActive }),
      },
      create: {
        provider: req.params.provider as string,
        label: label || req.params.provider,
        config: JSON.stringify(config || {}),
        isActive: isActive ?? true,
      },
    });

    nagadService.invalidateCache();
    rupantorPayService.invalidateCache();
    uddoktaService.invalidateCache();

    res.json({ gateway });
  } catch (err) {
    console.error("Update payment gateway error:", err);
    res.status(500).json({ error: "Failed to update gateway" });
  }
});

router.get("/ad-networks", async (_req, res) => {
  try {
    const networks = await prisma.adNetwork.findMany();
    res.json({ networks });
  } catch (err) {
    console.error("Ad networks error:", err);
    res.status(500).json({ error: "Failed to fetch ad networks" });
  }
});

router.get("/ad-networks/:provider", async (req, res) => {
  try {
    const network = await prisma.adNetwork.findUnique({
      where: { provider: req.params.provider as string },
    });
    if (!network) {
      res.status(404).json({ error: "Ad network not found" });
      return;
    }
    res.json({ network });
  } catch (err) {
    console.error("Ad network error:", err);
    res.status(500).json({ error: "Failed to fetch ad network" });
  }
});

router.put("/ad-networks/:provider", async (req, res) => {
  try {
    const { label, config, isActive } = req.body;

    const network = await prisma.adNetwork.upsert({
      where: { provider: req.params.provider as string },
      update: {
        ...(label !== undefined && { label }),
        ...(config !== undefined && { config }),
        ...(isActive !== undefined && { isActive }),
      },
      create: {
        provider: req.params.provider as string,
        label: label || req.params.provider,
        config: config || {},
        isActive: isActive ?? true,
      },
    });

    res.json({ network });
  } catch (err) {
    console.error("Update ad network error:", err);
    res.status(500).json({ error: "Failed to update ad network" });
  }
});

export default router;
