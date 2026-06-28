import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@savetube.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      if (data.user.role !== "ADMIN") {
        setError("This account does not have admin access");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/admin", { replace: true });
    } catch {
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-brand-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 shadow-lg shadow-brand-500/20">
            <Download className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Admin Login
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to manage SaveTube
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                placeholder="admin@savetube.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:shadow-xl hover:shadow-brand-500/30 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Default admin:</span>{" "}
              admin@savetube.com / admin123
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Run <code className="rounded bg-gray-200 px-1 py-0.5 text-[11px]">npx tsx src/seed.ts</code> in backend to create/reset.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          <a href="/" className="underline hover:text-gray-600">
            Back to SaveTube
          </a>
        </p>
      </div>
    </div>
  );
}
