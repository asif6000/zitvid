import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download, Loader2, AlertCircle, Eye, EyeOff, Mail, Lock, User,
  Sparkles, ChevronRight, Globe, ArrowLeft,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (mode === "signup" && password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = { email, password, ...(mode === "signup" && { name: name || undefined }) };
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/", { replace: true });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API}/api/auth/google`;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-brand-50/30 to-accent-50/30 p-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-400/20 blur-[120px] animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-accent-400/20 blur-[120px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-300/10 blur-[150px]" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        <div className="rounded-3xl bg-white/80 backdrop-blur-2xl p-8 shadow-2xl ring-1 ring-gray-200/50">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 shadow-lg shadow-brand-500/20 ring-1 ring-white/20 mb-4">
              <Download className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="mt-1.5 text-sm text-gray-400">
              {mode === "login"
                ? "Sign in to continue downloading"
                : "Start downloading videos from any platform"}
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md hover:border-gray-300"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {mode === "login" ? "Sign in with Google" : "Sign up with Google"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white/80 backdrop-blur-sm px-4 text-xs text-gray-400">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-3 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-3 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:bg-white"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-10 py-3 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:bg-white"
                  placeholder={mode === "login" ? "Enter your password" : "At least 6 characters"}
                  required
                  minLength={mode === "signup" ? 6 : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading
                ? mode === "login" ? "Signing in..." : "Creating account..."
                : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
                className="ml-1.5 font-semibold text-brand-600 hover:text-brand-700 transition-colors"
              >
                {mode === "login" ? "Sign Up" : "Sign In"}
                <ChevronRight className="inline h-3.5 w-3.5 ml-0.5" />
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline hover:text-gray-600">Terms</a>
          {" "}and{" "}
          <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
