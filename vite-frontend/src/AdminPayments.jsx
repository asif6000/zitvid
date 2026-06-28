import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Clock, DollarSign } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${API}/api/admin/payments?page=${page}&limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setPayments(data.payments ?? []);
        setTotal(data.total ?? 0);
        setPages(data.pages ?? 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const statusColor = {
    COMPLETED: "bg-green-100 text-green-700",
    PENDING: "bg-amber-100 text-amber-700",
    FAILED: "bg-red-100 text-red-700",
    REFUNDED: "bg-blue-100 text-blue-700",
  };

  const filtered = search
    ? payments.filter((p) => p.user.email.toLowerCase().includes(search.toLowerCase()) || p.provider.toLowerCase().includes(search.toLowerCase()))
    : payments;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="mt-1 text-sm text-gray-500">{total} total payments</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search payments..."
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
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Provider</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-50 transition-colors hover:bg-brand-50/30">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-accent-500 text-xs font-bold text-white">
                        {(payment.user.name || payment.user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{payment.user.name || "Unnamed"}</p>
                        <p className="text-xs text-gray-400">{payment.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-gray-900">
                      <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                      {payment.currency} {payment.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-medium text-gray-700 capitalize">{payment.provider}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor[payment.status] || "bg-gray-100 text-gray-600"}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3.5 w-3.5" /> {new Date(payment.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">
                    {search ? "No payments match your search." : "No payments found."}
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
