import crypto from "crypto";
import fs from "fs";
import { prisma } from "../config/prisma.js";

interface NagadConfig {
  merchantId: string;
  merchantNumber: string;
  baseUrl: string;
  publicKey: string;
  privateKey: string;
}

interface NagadInitResponse {
  sensitiveData: string;
  signature: string;
  callBackUrl: string;
}

interface NagadCompleteResponse {
  status: "Success" | "Aborted" | "Pending" | "Failed";
  paymentRefId: string;
  sensitiveData: string;
  signature: string;
  merchantId: string;
  orderId: string;
}

class NagadService {
  private cachedConfig: NagadConfig | null = null;

  async loadConfig(): Promise<NagadConfig> {
    if (this.cachedConfig) return this.cachedConfig;

    const gateway = await prisma.paymentGateway.findUnique({
      where: { provider: "nagad" },
    });

    if (gateway?.config) {
      const cfg = typeof gateway.config === "string" ? JSON.parse(gateway.config) : gateway.config as NagadConfig;
      let publicKey = cfg.publicKey || process.env.NAGAD_PUBLIC_KEY || "";
      let privateKey = cfg.privateKey || process.env.NAGAD_PRIVATE_KEY || "";
      if (process.env.NAGAD_PUBLIC_KEY_PATH) {
        publicKey = fs.readFileSync(process.env.NAGAD_PUBLIC_KEY_PATH, "utf-8");
      }
      if (process.env.NAGAD_PRIVATE_KEY_PATH) {
        privateKey = fs.readFileSync(process.env.NAGAD_PRIVATE_KEY_PATH, "utf-8");
      }

      this.cachedConfig = {
        merchantId: cfg.merchantId || process.env.NAGAD_MERCHANT_ID || "",
        merchantNumber: cfg.merchantNumber || process.env.NAGAD_MERCHANT_NUMBER || "",
        baseUrl: cfg.baseUrl || process.env.NAGAD_BASE_URL || "https://sandbox.mynagad.com:10080",
        publicKey,
        privateKey,
      };
      return this.cachedConfig;
    }

    let publicKey = process.env.NAGAD_PUBLIC_KEY || "";
    let privateKey = process.env.NAGAD_PRIVATE_KEY || "";
    if (process.env.NAGAD_PUBLIC_KEY_PATH) {
      publicKey = fs.readFileSync(process.env.NAGAD_PUBLIC_KEY_PATH, "utf-8");
    }
    if (process.env.NAGAD_PRIVATE_KEY_PATH) {
      privateKey = fs.readFileSync(process.env.NAGAD_PRIVATE_KEY_PATH, "utf-8");
    }

    this.cachedConfig = {
      merchantId: process.env.NAGAD_MERCHANT_ID || "",
      merchantNumber: process.env.NAGAD_MERCHANT_NUMBER || "",
      baseUrl: process.env.NAGAD_BASE_URL || "https://sandbox.mynagad.com:10080",
      publicKey,
      privateKey,
    };
    return this.cachedConfig;
  }

  invalidateCache() {
    this.cachedConfig = null;
  }

  private encryptSensitiveData(data: Record<string, unknown>, publicKey: string): string {
    const json = JSON.stringify(data);
    const buffer = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(json, "utf-8")
    );
    return buffer.toString("base64");
  }

  private generateSignature(data: string, privateKey: string): string {
    const signer = crypto.createSign("SHA256");
    signer.update(data);
    return signer.sign(
      { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
      "base64"
    );
  }

  async initializePayment(params: {
    orderId: string;
    amount: number;
    productDescription: string;
  }): Promise<{ callBackUrl: string; orderId: string }> {
    const config = await this.loadConfig();
    const { orderId, amount, productDescription } = params;
    const amountStr = amount.toFixed(2);

    const sensitivePayload = {
      merchantId: config.merchantId,
      orderId,
      currencyCode: "050",
      amount: amountStr,
      chanceAmount: "0.00",
    };

    const sensitiveData = this.encryptSensitiveData(sensitivePayload, config.publicKey);
    const signatureStr = config.merchantId + orderId + amountStr + new Date().toISOString();
    const signature = this.generateSignature(signatureStr, config.privateKey);
    const datetime = new Date().toISOString();
    const url = `${config.baseUrl}/remote-payment-gateway-1.0/api/merchant/checkout/initialize/${config.merchantId}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Merchant-Id": config.merchantId,
        "X-Datetime": datetime,
        "X-Signature": signature,
        "X-Request-Id": crypto.randomUUID(),
      },
      body: JSON.stringify({
        merchantId: config.merchantId,
        orderId,
        currencyCode: "050",
        amount: amountStr,
        chanceAmount: "0.00",
        productDescription,
        sensitiveData,
        signature,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Nagad initialize failed (${res.status}): ${errText}`);
    }

    const data = (await res.json()) as NagadInitResponse;
    return { callBackUrl: data.callBackUrl, orderId };
  }

  async completePayment(params: {
    paymentRefId: string;
    orderId: string;
  }): Promise<{ status: string; paymentRefId: string }> {
    const config = await this.loadConfig();
    const { paymentRefId, orderId } = params;

    const sensitivePayload = {
      merchantId: config.merchantId,
      orderId,
      paymentRefId,
    };

    const sensitiveData = this.encryptSensitiveData(sensitivePayload, config.publicKey);
    const signatureStr = config.merchantId + orderId + paymentRefId + new Date().toISOString();
    const signature = this.generateSignature(signatureStr, config.privateKey);
    const datetime = new Date().toISOString();
    const url = `${config.baseUrl}/remote-payment-gateway-1.0/api/merchant/checkout/complete/${config.merchantId}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Merchant-Id": config.merchantId,
        "X-Datetime": datetime,
        "X-Signature": signature,
        "X-Request-Id": crypto.randomUUID(),
      },
      body: JSON.stringify({
        merchantId: config.merchantId,
        orderId,
        paymentRefId,
        sensitiveData,
        signature,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Nagad complete failed (${res.status}): ${errText}`);
    }

    const data = (await res.json()) as NagadCompleteResponse;
    return { status: data.status, paymentRefId: data.paymentRefId };
  }
}

export const nagadService = new NagadService();
