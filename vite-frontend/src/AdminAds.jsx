import { useEffect, useState } from "react";
import { Newspaper, Save, Loader2, AlertCircle, CheckCircle2, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const adFields = {
  monetag: [
    { key: "siteId", label: "Site ID", placeholder: "Monetag Site ID" },
    { key: "publisherId", label: "Publisher ID", placeholder: "Monetag Publisher ID" },
    { key: "apiKey", label: "API Key", placeholder: "API Key", fullWidth: true },
    { key: "adCode", label: "Ad Code / Script", placeholder: "<script>... ad code ...</script>", multiline: true, fullWidth: true },
    { key: "placement", label: "Placement", placeholder: "header, footer, sidebar" },
  ],
  adsterra: [
    { key: "campaignId", label: "Campaign ID", placeholder: "Adsterra Campaign ID" },
    { key: "zoneId", label: "Zone ID", placeholder: "Adsterra Zone ID" },
    { key: "apiKey", label: "API Key", placeholder: "API Key", fullWidth: true },
    { key: "adCode", label: "Ad Code / Script", placeholder: "<script>... ad code ...</script>", multiline: true, fullWidth: true },
    { key: "placement", label: "Placement", placeholder: "header, footer, sidebar" },
  ],
};

const guides = {
  monetag: {
    title: "How to set up Monetag",
    steps: [
      "Go to Monetag.com and create an account",
      "Add your website/domain in Publisher Sites",
      "Create a new ad zone and copy the Zone ID",
      "Get your Site ID from Sites section",
      "Paste the ad script in the Ad Code field",
      "Set placement based on where you want ads (header/footer/sidebar)",
    ],
    links: [
      { label: "Monetag Login", url: "https://monetag.com" },
      { label: "Monetag Dashboard", url: "https://dashboard.monetag.com" },
    ],
  },
  adsterra: {
    title: "How to set up Adsterra",
    steps: [
      "Go to Adsterra.com and create an account",
      "Add your website in Publishers section",
      "Create a new ad campaign and get Campaign ID",
      "Create an ad zone and copy the Zone ID",
      "Get your API Key from Settings > API",
      "Paste the ad script code in the Ad Code field",
    ],
    links: [
      { label: "Adsterra Login", url: "https://adsterra.com" },
      { label: "Adsterra for Publishers", url: "https://publishers.adsterra.com" },
    ],
  },
};

function SetupGuide() {
  const [open, setOpen] = useState(null);

  return (
    <div className="mb-6 rounded-2xl bg-blue-50 p-5 ring-1 ring-blue-100">
      <div className="flex items-center gap-2 mb-3">
        <Newspaper className="h-5 w-5 text-blue-600" />
        <h2 className="text-sm font-bold text-blue-900">Setup Guides</h2>
      </div>
      <div className="space-y-2">
        {Object.entries(guides).map(([key, guide]) => (
          <div key={key} className="rounded-xl bg-white p-3 shadow-sm">
            <button
              onClick={() => setOpen(open === key ? null : key)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-sm font-semibold text-gray-800">{guide.title}</span>
              {open === key ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </button>
            {open === key && (
              <div className="mt-3 space-y-2">
                <ol className="list-inside list-decimal space-y-1">
                  {guide.steps.map((step, i) => (
                    <li key={i} className="text-xs text-gray-600 leading-relaxed">{step}</li>
                  ))}
                </ol>
                <div className="mt-3 flex flex-wrap gap-2">
                  {guide.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdsPage() {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadNetworks();
  }, []);

  const loadNetworks = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/api/admin/ad-networks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.networks) setNetworks(data.networks);
    } catch {
      setError("Failed to load ad networks");
    } finally {
      setLoading(false);
    }
  };

  const updateNetwork = async (provider, config, isActive) => {
    setSaving(provider);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");

    try {
      const net = networks.find((n) => n.provider === provider);
      const res = await fetch(`${API}/api/admin/ad-networks/${provider}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          config: { ...net?.config, ...config },
          ...(isActive !== undefined && { isActive }),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }

      const data = await res.json();
      setNetworks((prev) =>
        prev.map((n) => (n.provider === provider ? data.network : n))
      );
      setSuccess(`${provider} ad network saved`);
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
        <h1 className="text-2xl font-bold text-gray-900">Ad Networks</h1>
        <p className="mt-1 text-sm text-gray-500">Configure Monetag, Adsterra, and other ad networks</p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />{success}
        </div>
      )}

      <SetupGuide />

      <div className="space-y-6">
        {networks.map((net) => (
          <AdCard
            key={net.provider}
            network={net}
            saving={saving === net.provider}
            onSave={(config, isActive) => updateNetwork(net.provider, config, isActive)}
          />
        ))}
        {networks.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <Newspaper className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">No ad networks configured</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AdCard({
  network,
  saving,
  onSave,
}) {
  const [form, setForm] = useState({ ...network.config });
  const [active, setActive] = useState(network.isActive);
  const [dirty, setDirty] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const fields = adFields[network.provider] || [];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${
            network.provider === "monetag" ? "from-blue-500 to-indigo-600" : "from-orange-400 to-red-500"
          }`}>
            <Newspaper className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{network.label}</h2>
            <p className="text-xs text-gray-400">{network.provider}</p>
          </div>
        </div>
        <label className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Active</span>
          <button
            onClick={() => { setActive(!active); setDirty(true); }}
            className={`relative h-5 w-9 rounded-full transition-colors ${active ? "bg-green-500" : "bg-gray-300"}`}
          >
            <div className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${active ? "translate-x-4" : "translate-x-0"}`} />
          </button>
        </label>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
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
            ) : (
              <input
                type="text"
                value={form[field.key] ?? ""}
                onChange={(e) => update(field.key, e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-end border-t border-gray-100 pt-4">
        <button
          onClick={() => onSave(form, active)}
          disabled={!dirty || saving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
