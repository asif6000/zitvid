import { prisma } from "../config/prisma.js";

interface RupantorPayConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  merchantNumber: string;
}

class RupantorPayService {
  private cachedConfig: RupantorPayConfig | null = null;

  async loadConfig(): Promise<RupantorPayConfig> {
    if (this.cachedConfig) return this.cachedConfig;

    const gateway = await prisma.paymentGateway.findUnique({
      where: { provider: "rupantorpay" },
    });

    if (gateway?.config) {
      const cfg = typeof gateway.config === "string" ? JSON.parse(gateway.config) : gateway.config as RupantorPayConfig;
      this.cachedConfig = {
        apiKey: cfg.apiKey || "",
        apiSecret: cfg.apiSecret || "",
        baseUrl: cfg.baseUrl || "https://sandbox.rupantorpay.com",
        merchantNumber: cfg.merchantNumber || "",
      };
      return this.cachedConfig;
    }

    this.cachedConfig = {
      apiKey: "",
      apiSecret: "",
      baseUrl: "https://sandbox.rupantorpay.com",
      merchantNumber: "",
    };
    return this.cachedConfig;
  }

  invalidateCache() {
    this.cachedConfig = null;
  }

  async initializePayment(params: {
    orderId: string;
    amount: number;
    productDescription: string;
  }): Promise<{ paymentUrl: string; orderId: string }> {
    const config = await this.loadConfig();
    const { orderId, amount, productDescription } = params;

    const body = {
      api_key: config.apiKey,
      secret: config.apiSecret,
      order_id: orderId,
      amount: amount.toFixed(2),
      description: productDescription,
      callback_url: `http://localhost:5000/api/payment/rupantorpay/callback`,
    };

    const res = await fetch(`${config.baseUrl}/api/v1/payment/init`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`RupantorPay init failed (${res.status}): ${errText}`);
    }

    const data: any = await res.json();
    return { paymentUrl: data.payment_url, orderId };
  }

  async verifyPayment(params: { orderId: string }): Promise<{ status: string; transactionId: string }> {
    const config = await this.loadConfig();

    const res = await fetch(`${config.baseUrl}/api/v1/payment/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: config.apiKey,
        secret: config.apiSecret,
        order_id: params.orderId,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`RupantorPay verify failed (${res.status}): ${errText}`);
    }

    const data: any = await res.json();
    return { status: data.status, transactionId: data.transaction_id || "" };
  }
}

export const rupantorPayService = new RupantorPayService();
