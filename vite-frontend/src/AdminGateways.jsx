import { useEffect, useState } from "react";
import { Settings, Save, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function GatewaysPage() {
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showKey, setShowKey] = useState({});

  useEffect(() => {
    loadGateways();
  }, []);

  const loadGateways = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/api/admin/payment-gateways`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.gateways) setGateways(data.gateways);
    } catch {
      setError("Failed to load gateway configuration");
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (provider, config, isActive) => {
    setSaving(provider);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");

    try {
      const gateway = gateways.find((g) => g.provider === provider);
      const res = await fetch(`${API}/api/admin/payment-gateways/${provider}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          config: { ...gateway?.config, ...config },
          ...(isActive !== undefined && { isActive }),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }

      const data = await res.json();
      setGateways((prev) =>
        prev.map((g) => (g.provider === provider ? data.gateway : g))
      );
      setSuccess(`${provider} configuration saved`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Gateways</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure payment gateway credentials (Nagad, bKash, etc.)
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          {success}
        </div>
      )}

      <div className="space-y-6">
        {gateways.map((gateway) => (
          <GatewayCard
            key={gateway.provider}
            gateway={gateway}
            saving={saving === gateway.provider}
            showKey={showKey}
            onToggleKey={(field) =>
              setShowKey((prev) => ({ ...prev, [field]: !prev[field] }))
            }
            onSave={(config, isActive) =>
              updateConfig(gateway.provider, config, isActive)
            }
          />
        ))}

        {gateways.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <Settings className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">No payment gateways configured</p>
          </div>
        )}
      </div>
    </div>
  );
}

function configFields(provider) {
  const fields = [];

  if (provider === "nagad") {
    fields.push(
      { key: "merchantId", label: "Merchant ID", placeholder: "your_merchant_id" },
      { key: "merchantNumber", label: "Merchant Number", placeholder: "01XXXXXXXXX" },
      { key: "baseUrl", label: "API Base URL", placeholder: "https://sandbox.mynagad.com:10080", fullWidth: true },
      { key: "publicKey", label: "Public Key (Nagad provides this)", placeholder: "-----BEGIN PUBLIC KEY----- ...", multiline: true, fullWidth: true },
      { key: "privateKey", label: "Private Key (your RSA private key)", placeholder: "-----BEGIN RSA PRIVATE KEY----- ...", multiline: true, fullWidth: true },
    );
  } else if (provider === "bkash") {
    fields.push(
      { key: "username", label: "Username", placeholder: "bKash merchant username" },
      { key: "password", label: "Password", placeholder: "bKash merchant password", secure: true },
      { key: "apiKey", label: "API Key", placeholder: "App key from bKash", secure: true, fullWidth: true },
      { key: "apiSecret", label: "API Secret", placeholder: "App secret from bKash", secure: true, fullWidth: true },
      { key: "merchantNumber", label: "Merchant Number", placeholder: "01XXXXXXXXX" },
      { key: "baseUrl", label: "API Base URL", placeholder: "https://tokenized.sandbox.bka.sh/v1.2.0-beta", fullWidth: true },
    );
  } else if (provider === "paddle") {
    fields.push(
      { key: "vendorId", label: "Vendor ID", placeholder: "Paddle vendor ID" },
      { key: "vendorAuthCode", label: "Vendor Auth Code", placeholder: "Paddle auth code", secure: true },
      { key: "apiKey", label: "API Key", placeholder: "Paddle API key", secure: true, fullWidth: true },
      { key: "publicKey", label: "Public Key", placeholder: "Paddle public key", multiline: true, fullWidth: true },
      { key: "webhookSecret", label: "Webhook Secret", placeholder: "Paddle webhook secret key", secure: true, fullWidth: true },
      { key: "sandbox", label: "Sandbox Mode", placeholder: "", type: "boolean" },
    );
  } else if (provider === "rupantorpay") {
    fields.push(
      { key: "apiKey", label: "API Key", placeholder: "RupantorPay API key", secure: true },
      { key: "apiSecret", label: "API Secret", placeholder: "RupantorPay API secret", secure: true, fullWidth: true },
      { key: "merchantNumber", label: "Merchant Number", placeholder: "01XXXXXXXXX" },
      { key: "baseUrl", label: "API Base URL", placeholder: "https://sandbox.rupantorpay.com", fullWidth: true },
    );
  } else if (provider === "uddokta") {
    fields.push(
      { key: "apiKey", label: "API Key", placeholder: "Uddokta API key", secure: true },
      { key: "apiSecret", label: "API Secret", placeholder: "Uddokta API secret", secure: true, fullWidth: true },
      { key: "merchantNumber", label: "Merchant Number", placeholder: "01XXXXXXXXX" },
      { key: "baseUrl", label: "API Base URL", placeholder: "https://sandbox.uddokta.com", fullWidth: true },
    );
  }

  return fields;
}

function GatewayCard({
  gateway,
  saving,
  showKey,
  onToggleKey,
  onSave,
}) {
  const [form, setForm] = useState(() => {
    try { return JSON.parse(gateway.config); } catch { return {}; }
  });
  const [active, setActive] = useState(gateway.isActive);
  const [dirty, setDirty] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{gateway.label}</h2>
            <p className="text-xs text-gray-400">{gateway.provider}</p>
          </div>
        </div>
        <label className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Active</span>
          <button
            onClick={() => {
              setActive(!active);
              setDirty(true);
            }}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              active ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                active ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </label>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {configFields(gateway.provider).map((field) => (
          <div key={field.key} className={field.fullWidth ? "sm:col-span-2" : ""}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
            {field.multiline ? (
              <textarea
                value={form[field.key] ?? ""}
                onChange={(e) => update(field.key, e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                placeholder={field.placeholder}
              />
            ) : field.type === "boolean" ? (
              <button
                onClick={() => update(field.key, (!(form[field.key])).toString())}
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  form[field.key] === true || form[field.key] === "true"
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    form[field.key] === true || form[field.key] === "true"
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />
              </button>
            ) : (
              <input
                type={field.secure ? "password" : "text"}
                value={form[field.key] ?? ""}
                onChange={(e) => update(field.key, e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          {gateway.provider === "nagad" && (
            <>
              <span className="text-xs text-gray-500">
                Sandbox: <code className="text-gray-700">sandbox.mynagad.com:10080</code>
              </span>
              <br />
              <span className="text-xs text-gray-500">
                Production: <code className="text-gray-700">merchants.nagad.com</code>
              </span>
            </>
          )}
          {gateway.provider === "bkash" && (
            <>
              <span className="text-xs text-gray-500">
                Sandbox: <code className="text-gray-700">tokenized.sandbox.bka.sh/v1.2.0-beta</code>
              </span>
              <br />
              <span className="text-xs text-gray-500">
                Production: <code className="text-gray-700">tokenized.pay.bka.sh/v1.2.0-beta</code>
              </span>
            </>
          )}
          {gateway.provider === "paddle" && (
            <>
              <span className="text-xs text-gray-500">
                Sandbox: <code className="text-gray-700">sandbox-vendors.paddle.com</code>
              </span>
              <br />
              <span className="text-xs text-gray-500">
                Production: <code className="text-gray-700">vendors.paddle.com</code>
              </span>
            </>
          )}
          {gateway.provider === "rupantorpay" && (
            <>
              <span className="text-xs text-gray-500">
                Sandbox: <code className="text-gray-700">sandbox.rupantorpay.com</code>
              </span>
              <br />
              <span className="text-xs text-gray-500">
                Production: <code className="text-gray-700">secure.rupantorpay.com</code>
              </span>
            </>
          )}
          {gateway.provider === "uddokta" && (
            <>
              <span className="text-xs text-gray-500">
                Sandbox: <code className="text-gray-700">sandbox.uddokta.com</code>
              </span>
              <br />
              <span className="text-xs text-gray-500">
                Production: <code className="text-gray-700">pay.uddokta.com</code>
              </span>
            </>
          )}
        </div>
        <button
          onClick={() => onSave(form, active)}
          disabled={!dirty || saving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
