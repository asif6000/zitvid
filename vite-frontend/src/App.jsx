import { Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { SiteSettingsProvider, useSiteSettings } from "./SiteSettingsContext.jsx";
import { Loader2 } from "lucide-react";

const Home = lazy(() => import("./Home.jsx"));
const Auth = lazy(() => import("./Auth.jsx"));
const Checkout = lazy(() => import("./Checkout.jsx"));
const DownloadConditions = lazy(() => import("./DownloadConditions.jsx"));
const About = lazy(() => import("./About.jsx"));
const PrivacyPolicy = lazy(() => import("./PrivacyPolicy.jsx"));
const TermsOfService = lazy(() => import("./TermsOfService.jsx"));
const AdminLogin = lazy(() => import("./AdminLogin.jsx"));
const AdminLayout = lazy(() => import("./AdminLayout.jsx"));
const AdminDashboard = lazy(() => import("./AdminDashboard.jsx"));
const AdminUsers = lazy(() => import("./AdminUsers.jsx"));
const AdminSubscriptions = lazy(() => import("./AdminSubscriptions.jsx"));
const AdminPlans = lazy(() => import("./AdminPlans.jsx"));
const AdminPayments = lazy(() => import("./AdminPayments.jsx"));
const AdminDownloads = lazy(() => import("./AdminDownloads.jsx"));
const AdminGateways = lazy(() => import("./AdminGateways.jsx"));
const AdminAds = lazy(() => import("./AdminAds.jsx"));
const AdminSettings = lazy(() => import("./AdminSettings.jsx"));
const AdminAppearance = lazy(() => import("./AdminAppearance.jsx"));
const AdminAnalytics = lazy(() => import("./AdminAnalytics.jsx"));

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F9]">
      <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
    </div>
  );
}

function GoogleAnalytics() {
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (settings.googleAnalyticsEnabled !== "true") return;
    const gaId = settings.googleAnalyticsScript || settings.googleAnalyticsId;
    if (!gaId) return;

    if (settings.googleAnalyticsScript) {
      const div = document.createElement("div");
      div.innerHTML = gaId;
      Array.from(div.children).forEach((el) => document.head.appendChild(el));
    } else if (gaId.startsWith("G-")) {
      const s1 = document.createElement("script");
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      s1.async = true;
      document.head.appendChild(s1);
      const s2 = document.createElement("script");
      s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
      document.head.appendChild(s2);
    }
  }, [settings.googleAnalyticsEnabled, settings.googleAnalyticsId, settings.googleAnalyticsScript]);

  return null;
}

export default function App() {
  return (
    <SiteSettingsProvider>
      <GoogleAnalytics />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/download-conditions" element={<DownloadConditions />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="downloads" element={<AdminDownloads />} />
            <Route path="gateways" element={<AdminGateways />} />
            <Route path="ads" element={<AdminAds />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="appearance" element={<AdminAppearance />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
        </Routes>
      </Suspense>
    </SiteSettingsProvider>
  );
}
