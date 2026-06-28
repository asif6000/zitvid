import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CURRENCY_SYMBOLS = { BDT: "৳", USD: "$", EUR: "€", GBP: "£" };

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", currency: "BDT", interval: "MONTHLY", features: "" });

  const fetchPlans = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${API}/api/admin/plans`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPlans(data.plans ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", price: "", currency: "BDT", interval: "MONTHLY", features: "" });
    setShowForm(true);
  };

  const openEdit = (plan) => {
    setEditing(plan);
    setForm({
      name: plan.name,
      price: plan.price.toString(),
      currency: plan.currency,
      interval: plan.interval,
      features: Array.isArray(plan.features) ? plan.features.join("\n") : "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const body = {
      name: form.name,
      price: parseFloat(form.price),
      currency: form.currency,
      interval: form.interval,
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
    };

    const url = editing
      ? `${API}/api/admin/plans/${editing.id}`
      : `${API}/api/admin/plans`;
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.plan || data.message) {
      setShowForm(false);
      setEditing(null);
      fetchPlans();
    }
  };

  const handleDelete = (plan) => {
    if (!confirm(`Delete plan "${plan.name}"?`)) return;
    const token = localStorage.getItem("token");
    fetch(`${API}/api/admin/plans/${plan.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) fetchPlans();
        else alert(data.error || "Failed to delete");
      })
      .catch(() => {});
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plans</h1>
          <p className="mt-1 text-sm text-gray-500">{plans.length} subscription plans</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:shadow-xl hover:shadow-brand-500/30"
        >
          <Plus className="h-4 w-4" /> New Plan
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-3xl glass-card p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">{editing ? "Edit Plan" : "Create Plan"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="BDT">BDT</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interval</label>
                  <select
                    value={form.interval}
                    onChange={(e) => setForm({ ...form, interval: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                <textarea
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  rows={5}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:shadow-xl"
                >
                  {editing ? "Update Plan" : "Create Plan"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="glass-card group relative rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-1 flex items-baseline gap-0.5">
                  <span className="text-2xl font-extrabold text-gray-900">
                    {CURRENCY_SYMBOLS[plan.currency] || plan.currency}{plan.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400">/{plan.interval.toLowerCase()}</span>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => openEdit(plan)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(plan)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <ul className="mt-4 space-y-1.5">
              {(Array.isArray(plan.features) ? plan.features : []).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
