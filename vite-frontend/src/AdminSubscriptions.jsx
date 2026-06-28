import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Calendar, User as UserIcon } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSubscriptions = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${API}/api/admin/subscriptions?page=${page}&limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setSubscriptions(data.subscriptions ?? []);
        setTotal(data.total ?? 0);
        setPages(data.pages ?? 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [page]);

  const handleStatusChange = (id, status) => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/admin/subscriptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.subscription) fetchSubscriptions();
      })
      .catch(() => {});
  };

  const statusColor = {
    ACTIVE: "bg-green-100 text-green-700",
    CANCELED: "bg-red-100 text-red-700",
    EXPIRED: "bg-gray-100 text-gray-600",
  };

  const filtered = search
    ? subscriptions.filter((s) => s.user.email.toLowerCase().includes(search.toLowerCase()) || s.plan.name.toLowerCase().includes(search.toLowerCase()))
    : subscriptions;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="mt-1 text-sm text-gray-500">{total} total subscriptions</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 sm:w-72"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">User</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Plan</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Price</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">End Date</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-50 transition-colors hover:bg-brand-50/30">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-accent-500 text-xs font-bold text-white">
                        {(sub.user.name || sub.user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{sub.user.name || "Unnamed"}</p>
                        <p className="flex items-center gap-1 text-xs text-gray-400">
                          <UserIcon className="h-3 w-3" /> {sub.user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-gray-900">{sub.plan.name}</span>
                    <p className="text-xs text-gray-400">{sub.plan.interval}</p>
                  </td>
                  <td className="px-4 py-3.5 text-center font-medium text-gray-700">
                    {sub.plan.currency} {sub.plan.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor[sub.status] || "bg-gray-100 text-gray-600"}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5" /> {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <select
                      value={sub.status}
                      onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="CANCELED">Cancel</option>
                      <option value="EXPIRED">Expire</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                    {search ? "No subscriptions match your search." : "No subscriptions found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page} of {pages}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <button
              onClick={() => setPage(Math.min(pages, page + 1))}
              disabled={page === pages}
              className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
