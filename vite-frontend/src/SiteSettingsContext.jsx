import { createContext, useContext, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SiteSettingsContext = createContext({ settings: {}, loading: true });

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/settings`)
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export default SiteSettingsContext;
