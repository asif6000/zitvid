import { useEffect, useState } from "react";
import {
  Users, Download, CreditCard, DollarSign,
  ArrowUpRight, TrendingUp, Activity, ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const statCards = [
  { label: "Total Users", key: "totalUsers", icon: Users, color: "from-blue-400 to-blue-600", shadow: "shadow-blue-500/20", href: "/admin/users" },
  { label: "Downloads", key: "totalDownloads", icon: Download, color: "from-brand-400 to-brand-600", shadow: "shadow-brand-500/20", href: "/admin/downloads" },
  { label: "Active Subs", key: "activeSubscriptions", icon: CreditCard, color: "from-emerald-400 to-teal-500", shadow: "shadow-teal-500/20", href: "/admin/subscriptions" },
  { label: "Revenue", key: "totalRevenue", icon: DollarSign, color: "from-amber-400 to-orange-500", shadow: "shadow-orange-500/20", href: "/admin/payments", format: true },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      fetch(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(`${API}/api/admin/stats/timeline`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([statsData, timelineData]) => {
        setStats(statsData);
        setTimeline(timelineData.timeline || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your platform</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const value = stats ? stats[card.key] ?? 0 : 0;
          const display = card.format ? `৳${Number(value).toFixed(2)}` : Number(value).toLocaleString();
          return (
            <Link
              key={card.key}
              to={card.href}
              className="glass-card group relative rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-extrabold text-gray-900">{display}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} shadow-lg ${card.shadow}`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                View details <ArrowUpRight className="h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Download Trends</h2>
            <TrendingUp className="h-4 w-4 text-brand-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} stroke="#d0d0d0" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="#d0d0d0" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                />
                <Area type="monotone" dataKey="downloads" stroke="#9333ea" strokeWidth={2} fill="url(#downloadGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Revenue (30 days)</h2>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} stroke="#d0d0d0" />
                <YAxis tick={{ fontSize: 10 }} stroke="#d0d0d0" tickFormatter={(v) => `৳${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  formatter={(v) => [`৳${Number(v).toFixed(2)}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">User Growth (30 days)</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} stroke="#d0d0d0" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="#d0d0d0" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} fill="url(#userGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-base font-bold text-gray-900">Activity Summary</h2>
          <div className="mt-4 space-y-4">
            {stats && (
              <>
                <div className="flex items-center justify-between rounded-xl bg-green-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                      <TrendingUp className="h-4.5 w-4.5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Total Payments</p>
                      <p className="text-xs text-gray-500">{stats.totalPayments} completed</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-600">{stats.totalPayments}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-brand-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100">
                      <Activity className="h-4.5 w-4.5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Active Subscriptions</p>
                      <p className="text-xs text-gray-500">Currently active</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-brand-600">{stats.activeSubscriptions}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-amber-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                      <ShoppingCart className="h-4.5 w-4.5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Total Revenue</p>
                      <p className="text-xs text-gray-500">All time</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-amber-600">৳{(stats.totalRevenue ?? 0).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
