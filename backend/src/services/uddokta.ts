import { prisma } from "../config/prisma.js";

interface UddoktaConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  merchantNumber: string;
}

class UddoktaService {
  private cachedConfig: UddoktaConfig | null = null;

  async loadConfig(): Promise<UddoktaConfig> {
    if (this.cachedConfig) return this.cachedConfig;

    const gateway = await prisma.paymentGateway.findUnique({
      where: { provider: "uddokta" },
    });

    if (gateway?.config) {
      const cfg = typeof gateway.config === "string" ? JSON.parse(gateway.config) : gateway.config as UddoktaConfig;
      this.cachedConfig = {
        apiKey: cfg.apiKey || "",
        apiSecret: cfg.apiSecret || "",
        baseUrl: cfg.baseUrl || "https://sandbox.uddokta.com",
        merchantNumber: cfg.merchantNumber || "",
      };
      return this.cachedConfig;
    }

    this.cachedConfig = {
      apiKey: "",
      apiSecret: "",
      baseUrl: "https://sandbox.uddokta.com",
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
      api_secret: config.apiSecret,
      order_id: orderId,
      amount: amount.toFixed(2),
      description: productDescription,
      callback_url: `http://localhost:5000/api/payment/uddokta/callback`,
    };

    const res = await fetch(`${config.baseUrl}/api/v1/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Uddokta init failed (${res.status}): ${errText}`);
    }

    const data: any = await res.json();
    return { paymentUrl: data.payment_url, orderId };
  }

  async verifyPayment(params: { orderId: string }): Promise<{ status: string; transactionId: string }> {
    const config = await this.loadConfig();

    const res = await fetch(`${config.baseUrl}/api/v1/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: config.apiKey,
        api_secret: config.apiSecret,
        order_id: params.orderId,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Uddokta verify failed (${res.status}): ${errText}`);
    }

    const data: any = await res.json();
    return { status: data.status, transactionId: data.transaction_id || "" };
  }
}

export const uddoktaService = new UddoktaService();
