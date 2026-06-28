import "dotenv/config";
import { prisma } from "./config/prisma.js";
import bcrypt from "bcryptjs";

async function seed() {
  const email = process.env["ADMIN_EMAIL"] || "admin@savetube.com";
  const password = process.env["ADMIN_PASSWORD"] || "admin123";
  const name = process.env["ADMIN_NAME"] || "Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });
    console.log("Admin role ensured.");
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, name, role: "ADMIN" },
    });

    console.log(`Admin user created:`);
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Name:     ${name}`);
  }

  const gateways = [
    {
      provider: "nagad",
      label: "Nagad",
      config: {
        merchantId: "",
        merchantNumber: "",
        baseUrl: "https://sandbox.mynagad.com:10080",
        publicKey: "",
        privateKey: "",
      },
    },
    {
      provider: "bkash",
      label: "bKash",
      config: {
        merchantNumber: "",
        walletNumber: "",
        apiKey: "",
        apiSecret: "",
        baseUrl: "https://tokenized.sandbox.bka.sh/v1.2.0-beta",
        username: "",
        password: "",
      },
    },
    {
      provider: "paddle",
      label: "Paddle",
      config: {
        vendorId: "",
        vendorAuthCode: "",
        apiKey: "",
        publicKey: "",
        webhookSecret: "",
        sandbox: true,
      },
    },
    {
      provider: "rupantorpay",
      label: "RupantorPay",
      config: {
        apiKey: "",
        apiSecret: "",
        merchantNumber: "",
        baseUrl: "https://sandbox.rupantorpay.com",
      },
    },
    {
      provider: "uddokta",
      label: "Uddokta",
      config: {
        apiKey: "",
        apiSecret: "",
        merchantNumber: "",
        baseUrl: "https://sandbox.uddokta.com",
      },
    },
  ];

  for (const gw of gateways) {
    const existing = await prisma.paymentGateway.findUnique({ where: { provider: gw.provider } });
    if (!existing) {
      await prisma.paymentGateway.create({
        data: { provider: gw.provider, label: gw.label, isActive: true, config: JSON.stringify(gw.config) },
      });
      console.log(`${gw.label} gateway config created.`);
    } else {
      console.log(`${gw.label} gateway config already exists.`);
    }
  }

  const adNetworks = [
    {
      provider: "monetag",
      label: "Monetag",
      config: {
        siteId: "",
        publisherId: "",
        apiKey: "",
        adCode: "",
        placement: "header",
      },
    },
    {
      provider: "adsterra",
      label: "Adsterra",
      config: {
        campaignId: "",
        zoneId: "",
        apiKey: "",
        adCode: "",
        placement: "footer",
      },
    },
  ];

  for (const ad of adNetworks) {
    const existing = await prisma.adNetwork.findUnique({ where: { provider: ad.provider } });
    if (!existing) {
      await prisma.adNetwork.create({
        data: { provider: ad.provider, label: ad.label, isActive: true, config: JSON.stringify(ad.config) },
      });
      console.log(`${ad.label} ad network created.`);
    } else {
      console.log(`${ad.label} ad network already exists.`);
    }
  }
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
