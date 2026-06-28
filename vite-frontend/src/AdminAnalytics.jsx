import { useEffect, useState } from "react";
import {
  BarChart3, Save, Loader2, AlertCircle, CheckCircle2,
  TrendingUp, Users, Download, DollarSign,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const COLORS = ["#9333ea", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function AdminAnalytics() {
  const [timeline, setTimeline] = useState([]);
  const [platformBreakdown, setPlatformBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    googleAnalyticsId: "",
    googleAnalyticsEnabled: "false",
    googleAnalyticsScript: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      fetch(`${API}/api/admin/stats/timeline`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(`${API}/api/settings`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([timelineData, settingsData]) => {
        setTimeline(timelineData.timeline || []);
        setPlatformBreakdown(timelineData.platformBreakdown || []);
        if (settingsData.settings) {
          setForm((prev) => ({ ...prev, ...settingsData.settings }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ settings: form }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      setSuccess("Google Analytics settings saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const totalDownloads = timeline.reduce((s, d) => s + d.downloads, 0);
  const totalRevenue = timeline.reduce((s, d) => s + d.revenue, 0);
  const totalUsers = timeline.reduce((s, d) => s + d.users, 0);

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
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Platform analytics and Google Analytics configuration</p>
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

      <div className="grid gap-5 sm:grid-cols-3 mb-8">
        <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-purple-50 p-5">
          <div className="flex items-center gap-2 text-brand-600 mb-1">
            <Download className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Downloads</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{totalDownloads.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Last 30 days</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Users className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">New Users</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{totalUsers.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Last 30 days</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-5">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Revenue</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Last 30 days</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Download Trends</h2>
            <TrendingUp className="h-4 w-4 text-brand-500" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="dlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} stroke="#d0d0d0" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="#d0d0d0" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }} />
                <Area type="monotone" dataKey="downloads" stroke="#9333ea" strokeWidth={2} fill="url(#dlGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Platform Breakdown</h2>
            <BarChart3 className="h-4 w-4 text-brand-500" />
          </div>
          <div className="h-72 flex items-center justify-center">
            {platformBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="platform"
                    label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`}
                  >
                    {platformBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-400">No download data yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">User Growth</h2>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="usGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} stroke="#d0d0d0" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="#d0d0d0" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }} />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} fill="url(#usGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Revenue Trend</h2>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} stroke="#d0d0d0" />
                <YAxis tick={{ fontSize: 10 }} stroke="#d0d0d0" tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }}
                  formatter={(v) => [`$${Number(v).toFixed(2)}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100">
            <BarChart3 className="h-4.5 w-4.5 text-brand-600" />
          </div>
          <h2 className="text-base font-bold text-gray-900">Google Analytics Configuration</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Measurement ID</label>
            <input
              type="text"
              value={form.googleAnalyticsId}
              onChange={(e) => setForm({ ...form, googleAnalyticsId: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              placeholder="G-XXXXXXXXXX"
            />
            <p className="mt-1 text-xs text-gray-400">Found in your Google Analytics admin panel</p>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setForm({ ...form, googleAnalyticsEnabled: form.googleAnalyticsEnabled === "true" ? "false" : "true" })}
                className={`relative h-5 w-9 rounded-full transition-colors ${form.googleAnalyticsEnabled === "true" ? "bg-green-500" : "bg-gray-300"}`}
              >
                <div className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.googleAnalyticsEnabled === "true" ? "translate-x-4" : "translate-x-0"}`} />
              </button>
              <span className="text-sm font-medium text-gray-700">Enable Google Analytics</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Script (optional)</label>
            <textarea
              value={form.googleAnalyticsScript}
              onChange={(e) => setForm({ ...form, googleAnalyticsScript: e.target.value })}
              rows={6}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-mono outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none"
              placeholder="Paste full tracking script if needed (overrides Measurement ID)"
            />
            <p className="mt-1 text-xs text-gray-400">Only use if you need a custom tracking setup</p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : "Save Analytics Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
