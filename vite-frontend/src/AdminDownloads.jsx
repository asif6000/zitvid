import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Globe, Download, Clock } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDownloads() {
  const [downloads, setDownloads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${API}/api/admin/downloads?page=${page}&limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setDownloads(data.downloads ?? []);
        setTotal(data.total ?? 0);
        setPages(data.pages ?? 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const statusColor = {
    PENDING: "bg-amber-100 text-amber-700",
    COMPLETED: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
    PROCESSING: "bg-blue-100 text-blue-700",
  };

  const filtered = search
    ? downloads.filter((d) => d.title?.toLowerCase().includes(search.toLowerCase()) || d.url.toLowerCase().includes(search.toLowerCase()))
    : downloads;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Downloads</h1>
          <p className="mt-1 text-sm text-gray-500">{total} total downloads</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search downloads..."
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
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Title / URL</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Platform</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Quality</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">User</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dl) => (
                <tr key={dl.id} className="border-b border-gray-50 transition-colors hover:bg-brand-50/30">
                  <td className="max-w-[250px] px-4 py-3.5">
                    <p className="truncate font-semibold text-gray-900">{dl.title || "Untitled"}</p>
                    <p className="truncate text-xs text-gray-400">{dl.url}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                      <Globe className="h-3.5 w-3.5 text-gray-400" /> {dl.platform}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-sm font-medium text-gray-700">{dl.quality} • {dl.format}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor[dl.status] || "bg-gray-100 text-gray-600"}`}>
                      {dl.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-gray-600">
                      {dl.user ? (dl.user.name || dl.user.email) : "Guest"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3.5 w-3.5" /> {new Date(dl.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                    {search ? "No downloads match your search." : "No downloads found."}
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
