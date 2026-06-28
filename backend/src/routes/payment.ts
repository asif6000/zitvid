import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { nagadService } from "../services/nagad.js";
import { rupantorPayService } from "../services/rupantorpay.js";
import { uddoktaService } from "../services/uddokta.js";

const router = Router();

function getFrontendUrl(): string {
  const raw = process.env["FRONTEND_URL"] || "http://localhost:5173";
  return raw.split(",")[0]!.trim();
}

router.post("/nagad/initiate", authenticate, async (req, res) => {
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

    if (plan.price === 0) {
      res.status(400).json({ error: "Free plan does not require payment" });
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

    const orderId = `SAVETUBE_${req.user!.userId}_${Date.now()}`;

    const intervalMonths = plan.interval === "YEARLY" ? 12 : 1;
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + intervalMonths);

    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user!.userId,
        planId,
        status: "PENDING",
        currentPeriodEnd,
      },
      include: { plan: true },
    });

    const payment = await prisma.payment.create({
      data: {
        userId: req.user!.userId,
        amount: plan.price,
        currency: plan.currency,
        provider: "nagad",
        status: "PENDING",
      },
    });

    const nagadResponse = await nagadService.initializePayment({
      orderId,
      amount: plan.price,
      productDescription: `SaveTube ${plan.name} - ${plan.interval}`,
    });

    res.json({
      callBackUrl: nagadResponse.callBackUrl,
      orderId,
      subscriptionId: subscription.id,
      paymentId: payment.id,
    });
  } catch (err) {
    console.error("Nagad initiate error:", err);
    res.status(500).json({
      error: "Failed to initiate Nagad payment",
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

router.get("/nagad/callback", async (req, res) => {
  try {
    const { payment_ref_id, status, order_id } = req.query;

    if (!payment_ref_id) {
      res.redirect(`${getFrontendUrl()}/checkout?status=failed&error=missing_ref`);
      return;
    }

    const orderId = order_id as string || "";

    const verifyResult = await nagadService.completePayment({
      paymentRefId: payment_ref_id as string,
      orderId,
    });

    if (verifyResult.status === "Success") {
      const orderParts = orderId.split("_");
      if (orderParts.length >= 2) {
        const userId = orderParts[1];

        const pendingPayment = await prisma.payment.findFirst({
          where: { userId, status: "PENDING", provider: "nagad" },
          orderBy: { createdAt: "desc" },
        });

        if (pendingPayment) {
          await prisma.payment.update({
            where: { id: pendingPayment.id },
            data: { status: "COMPLETED" },
          });
        }

        const pendingSub = await prisma.subscription.findFirst({
          where: { userId, status: "PENDING" },
          orderBy: { currentPeriodEnd: "desc" },
        });

        if (pendingSub) {
          await prisma.subscription.update({
            where: { id: pendingSub.id },
            data: { status: "ACTIVE" },
          });
        }
      }

      res.redirect(`${getFrontendUrl()}/checkout?status=success`);
    } else {
      res.redirect(`${getFrontendUrl()}/checkout?status=${verifyResult.status.toLowerCase()}`);
    }
  } catch (err) {
    console.error("Nagad callback error:", err);
    res.redirect(`${getFrontendUrl()}/checkout?status=failed`);
  }
});

router.post("/nagad/ipn", async (req, res) => {
  try {
    const { payment_ref_id, status, order_id } = req.body;

    if (!payment_ref_id || !status) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const orderId = order_id || "";
    const verifyResult = await nagadService.completePayment({
      paymentRefId: payment_ref_id,
      orderId,
    });

    const orderParts = orderId.split("_");
    if (orderParts.length >= 2) {
      const userId = orderParts[1];

      if (verifyResult.status === "Success") {
        await prisma.payment.updateMany({
          where: { userId, status: "PENDING", provider: "nagad" },
          data: { status: "COMPLETED" },
        });

        await prisma.subscription.updateMany({
          where: { userId, status: "PENDING" },
          data: { status: "ACTIVE" },
        });
      } else {
        await prisma.payment.updateMany({
          where: { userId, status: "PENDING", provider: "nagad" },
          data: { status: "FAILED" },
        });

        await prisma.subscription.updateMany({
          where: { userId, status: "PENDING" },
          data: { status: "CANCELED" },
        });
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Nagad IPN error:", err);
    res.status(500).json({ error: "IPN processing failed" });
  }
});

// ========== RupantorPay ==========
router.post("/rupantorpay/initiate", authenticate, async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) { res.status(400).json({ error: "Plan ID is required" }); return; }

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) { res.status(404).json({ error: "Plan not found" }); return; }
    if (plan.price === 0) { res.status(400).json({ error: "Free plan does not require payment" }); return; }

    const existingSub = await prisma.subscription.findFirst({
      where: { userId: req.user!.userId, status: "ACTIVE" },
    });
    if (existingSub) {
      await prisma.subscription.update({ where: { id: existingSub.id }, data: { status: "CANCELED" } });
    }

    const orderId = `SAVETUBE_${req.user!.userId}_${Date.now()}`;
    const intervalMonths = plan.interval === "YEARLY" ? 12 : 1;
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + intervalMonths);

    const subscription = await prisma.subscription.create({
      data: { userId: req.user!.userId, planId, status: "PENDING", currentPeriodEnd },
      include: { plan: true },
    });

    await prisma.payment.create({
      data: { userId: req.user!.userId, amount: plan.price, currency: plan.currency, provider: "rupantorpay", status: "PENDING" },
    });

    const response = await rupantorPayService.initializePayment({
      orderId, amount: plan.price, productDescription: `SaveTube ${plan.name} - ${plan.interval}`,
    });

    res.json({ callBackUrl: response.paymentUrl, orderId, subscriptionId: subscription.id });
  } catch (err) {
    console.error("RupantorPay initiate error:", err);
    res.status(500).json({ error: "Failed to initiate RupantorPay payment", details: err instanceof Error ? err.message : String(err) });
  }
});

router.get("/rupantorpay/callback", async (req, res) => {
  try {
    const { order_id } = req.query;
    if (!order_id) { res.redirect(`${getFrontendUrl()}/checkout?status=failed`); return; }

    const verifyResult = await rupantorPayService.verifyPayment({ orderId: order_id as string });

    if (verifyResult.status === "Success" || verifyResult.status === "COMPLETED") {
      const orderParts = (order_id as string).split("_");
      if (orderParts.length >= 2) {
        await prisma.payment.updateMany({ where: { userId: orderParts[1], status: "PENDING", provider: "rupantorpay" }, data: { status: "COMPLETED" } });
        await prisma.subscription.updateMany({ where: { userId: orderParts[1], status: "PENDING" }, data: { status: "ACTIVE" } });
      }
      res.redirect(`${getFrontendUrl()}/checkout?status=success`);
    } else {
      res.redirect(`${getFrontendUrl()}/checkout?status=${verifyResult.status.toLowerCase()}`);
    }
  } catch (err) {
    console.error("RupantorPay callback error:", err);
    res.redirect(`${getFrontendUrl()}/checkout?status=failed`);
  }
});

router.post("/rupantorpay/ipn", async (req, res) => {
  try {
    const { order_id } = req.body;
    if (!order_id) { res.status(400).json({ error: "Missing order_id" }); return; }

    const verifyResult = await rupantorPayService.verifyPayment({ orderId: order_id });
    const orderParts = order_id.split("_");
    if (orderParts.length >= 2) {
      const userId = orderParts[1];
      if (verifyResult.status === "Success" || verifyResult.status === "COMPLETED") {
        await prisma.payment.updateMany({ where: { userId, status: "PENDING", provider: "rupantorpay" }, data: { status: "COMPLETED" } });
        await prisma.subscription.updateMany({ where: { userId, status: "PENDING" }, data: { status: "ACTIVE" } });
      } else {
        await prisma.payment.updateMany({ where: { userId, status: "PENDING", provider: "rupantorpay" }, data: { status: "FAILED" } });
        await prisma.subscription.updateMany({ where: { userId, status: "PENDING" }, data: { status: "CANCELED" } });
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error("RupantorPay IPN error:", err);
    res.status(500).json({ error: "IPN processing failed" });
  }
});

// ========== Uddokta ==========
router.post("/uddokta/initiate", authenticate, async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) { res.status(400).json({ error: "Plan ID is required" }); return; }

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) { res.status(404).json({ error: "Plan not found" }); return; }
    if (plan.price === 0) { res.status(400).json({ error: "Free plan does not require payment" }); return; }

    const existingSub = await prisma.subscription.findFirst({
      where: { userId: req.user!.userId, status: "ACTIVE" },
    });
    if (existingSub) {
      await prisma.subscription.update({ where: { id: existingSub.id }, data: { status: "CANCELED" } });
    }

    const orderId = `SAVETUBE_${req.user!.userId}_${Date.now()}`;
    const intervalMonths = plan.interval === "YEARLY" ? 12 : 1;
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + intervalMonths);

    const subscription = await prisma.subscription.create({
      data: { userId: req.user!.userId, planId, status: "PENDING", currentPeriodEnd },
      include: { plan: true },
    });

    await prisma.payment.create({
      data: { userId: req.user!.userId, amount: plan.price, currency: plan.currency, provider: "uddokta", status: "PENDING" },
    });

    const response = await uddoktaService.initializePayment({
      orderId, amount: plan.price, productDescription: `SaveTube ${plan.name} - ${plan.interval}`,
    });

    res.json({ callBackUrl: response.paymentUrl, orderId, subscriptionId: subscription.id });
  } catch (err) {
    console.error("Uddokta initiate error:", err);
    res.status(500).json({ error: "Failed to initiate Uddokta payment", details: err instanceof Error ? err.message : String(err) });
  }
});

router.get("/uddokta/callback", async (req, res) => {
  try {
    const { order_id } = req.query;
    if (!order_id) { res.redirect(`${getFrontendUrl()}/checkout?status=failed`); return; }

    const verifyResult = await uddoktaService.verifyPayment({ orderId: order_id as string });

    if (verifyResult.status === "Success" || verifyResult.status === "COMPLETED") {
      const orderParts = (order_id as string).split("_");
      if (orderParts.length >= 2) {
        await prisma.payment.updateMany({ where: { userId: orderParts[1], status: "PENDING", provider: "uddokta" }, data: { status: "COMPLETED" } });
        await prisma.subscription.updateMany({ where: { userId: orderParts[1], status: "PENDING" }, data: { status: "ACTIVE" } });
      }
      res.redirect(`${getFrontendUrl()}/checkout?status=success`);
    } else {
      res.redirect(`${getFrontendUrl()}/checkout?status=${verifyResult.status.toLowerCase()}`);
    }
  } catch (err) {
    console.error("Uddokta callback error:", err);
    res.redirect(`${getFrontendUrl()}/checkout?status=failed`);
  }
});

router.post("/uddokta/ipn", async (req, res) => {
  try {
    const { order_id } = req.body;
    if (!order_id) { res.status(400).json({ error: "Missing order_id" }); return; }

    const verifyResult = await uddoktaService.verifyPayment({ orderId: order_id });
    const orderParts = order_id.split("_");
    if (orderParts.length >= 2) {
      const userId = orderParts[1];
      if (verifyResult.status === "Success" || verifyResult.status === "COMPLETED") {
        await prisma.payment.updateMany({ where: { userId, status: "PENDING", provider: "uddokta" }, data: { status: "COMPLETED" } });
        await prisma.subscription.updateMany({ where: { userId, status: "PENDING" }, data: { status: "ACTIVE" } });
      } else {
        await prisma.payment.updateMany({ where: { userId, status: "PENDING", provider: "uddokta" }, data: { status: "FAILED" } });
        await prisma.subscription.updateMany({ where: { userId, status: "PENDING" }, data: { status: "CANCELED" } });
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error("Uddokta IPN error:", err);
    res.status(500).json({ error: "IPN processing failed" });
  }
});

router.get("/gateways", async (_req, res) => {
  try {
    const gateways = await prisma.paymentGateway.findMany({ where: { isActive: true } });
    res.json({ gateways: gateways.map((g) => ({ provider: g.provider, label: g.label })) });
  } catch {
    res.json({ gateways: [] });
  }
});

router.get("/history", authenticate, async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.json({ payments });
  } catch (err) {
    console.error("Payment history error:", err);
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
});

export default router;
