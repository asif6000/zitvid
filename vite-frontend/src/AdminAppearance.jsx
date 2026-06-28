import { useEffect, useState, useRef } from "react";
import { Palette, Save, Loader2, AlertCircle, CheckCircle2, Upload, X } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminAppearance() {
  const [form, setForm] = useState({
    siteName: "Zinvid",
    siteDescription: "Free Video Downloader",
    primaryColor: "#9333ea",
    accentColor: "#ec4899",
    logoUrl: "",
    faviconUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const logoRef = useRef(null);
  const faviconRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setForm((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (type, file) => {
    if (!file) return;
    setUploading(type);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch(`${API}/api/upload/${type}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }
      const data = await res.json();
      setForm((prev) => ({ ...prev, [`${type}Url`]: data.url }));
      setSuccess(`${type === "logo" ? "Logo" : "Favicon"} uploaded successfully`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings: form }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }

      setSuccess("Appearance settings saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
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
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appearance</h1>
        <p className="mt-1 text-sm text-gray-500">Customize your site's look and feel</p>
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

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100">
              <Palette className="h-4.5 w-4.5 text-brand-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900">General</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
              <textarea
                value={form.siteDescription}
                onChange={(e) => setForm({ ...form, siteDescription: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden">
                  {form.logoUrl ? (
                    <img src={form.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Upload className="h-6 w-6 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    ref={logoRef}
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/svg+xml,image/webp"
                    onChange={(e) => {
                      if (e.target.files[0]) handleUpload("logo", e.target.files[0]);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoRef.current?.click()}
                    disabled={uploading === "logo"}
                    className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
                  >
                    {uploading === "logo" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading === "logo" ? "Uploading..." : "Upload Logo"}
                  </button>
                  {form.logoUrl && (
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={form.logoUrl}
                        onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                        className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                        placeholder="Or paste image URL"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, logoUrl: "" })}
                        className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden">
                  {form.faviconUrl ? (
                    <img src={form.faviconUrl} alt="Favicon" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Upload className="h-5 w-5 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    ref={faviconRef}
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/svg+xml,image/x-icon,image/webp"
                    onChange={(e) => {
                      if (e.target.files[0]) handleUpload("favicon", e.target.files[0]);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => faviconRef.current?.click()}
                    disabled={uploading === "favicon"}
                    className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
                  >
                    {uploading === "favicon" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading === "favicon" ? "Uploading..." : "Upload Favicon"}
                  </button>
                  {form.faviconUrl && (
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={form.faviconUrl}
                        onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })}
                        className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                        placeholder="Or paste image URL"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, faviconUrl: "" })}
                        className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
              <Palette className="h-4.5 w-4.5 text-purple-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Colors</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  className="h-9 w-9 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.accentColor}
                  onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  className="h-9 w-9 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.accentColor}
                  onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 rounded-xl bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md" style={{ backgroundColor: form.primaryColor }} />
              <span className="text-xs text-gray-500">Primary</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md" style={{ backgroundColor: form.accentColor }} />
              <span className="text-xs text-gray-500">Accent</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="h-6 rounded-full bg-gradient-to-r px-3 text-xs font-bold text-white flex items-center" style={{ background: `linear-gradient(135deg, ${form.primaryColor}, ${form.accentColor})` }}>
                Preview
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Appearance"}
          </button>
        </div>
      </form>
    </div>
  );
}
