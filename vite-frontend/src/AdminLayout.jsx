import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Download, CreditCard, DollarSign,
  Settings, Shield, LogOut, Menu, X, Newspaper, BarChart3,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Downloads", icon: Download, href: "/admin/downloads" },
  { label: "Subscriptions", icon: CreditCard, href: "/admin/subscriptions" },
  { label: "Plans", icon: Shield, href: "/admin/plans" },
  { label: "Payments", icon: DollarSign, href: "/admin/payments" },
  { label: "Gateways", icon: Settings, href: "/admin/gateways" },
  { label: "Ad Networks", icon: Newspaper, href: "/admin/ads" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Appearance", icon: Settings, href: "/admin/appearance" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "ADMIN") {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg ring-1 ring-gray-100 transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
          <NavLink to="/admin" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500">
              <Download className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900">Zinvid Admin</span>
          </NavLink>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/admin"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-500 transition-all hover:bg-red-50"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-gray-600">
            <Menu className="h-5 w-5" />
          </button>
          <div />
          <NavLink to="/" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View Site
          </NavLink>
        </header>

        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
