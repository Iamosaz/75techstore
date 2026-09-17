// src/context/SeasonalContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { detectCountry } from "../utils/countryDetector";
import { detectCurrentEvent } from "../utils/HolidayDetector";

const SeasonalContext = createContext();

export function useSeasonalTheme() {
  const context = useContext(SeasonalContext);
  if (!context) {
    throw new Error("useSeasonalTheme must be used within a SeasonalProvider");
  }
  return context;
}

export function SeasonalProvider({ children }) {
  const [country, setCountry] = useState("NG");
  const [event, setEvent] = useState(null);
  const [override, setOverride] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialLoadRef = useRef(false);

  // 1. Load active admin override from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem("75tech_seasonal_override");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
          setOverride(parsed);
        } else {
          localStorage.removeItem("75tech_seasonal_override");
        }
      }
    } catch (e) {
      console.warn("Could not read local override:", e);
    }
  }, []);

  // 2. Real-time background sync from backend (if server is active)
  const fetchActiveOverride = useCallback(async () => {
    try {
      const res = await fetch("/api/seasonal/override");
      if (res.ok) {
        const data = await res.json();
        if (data.override && new Date(data.override.expiresAt) > new Date()) {
          setOverride(data.override);
          localStorage.setItem(
            "75tech_seasonal_override",
            JSON.stringify(data.override)
          );
        }
      }
    } catch {
      // Backend offline — silently fallback to localStorage
    }
  }, []);

  // 3. Initialize: Detect visitor country + fetch live holidays
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    async function initializeSystem() {
      try {
        // Fetch admin overrides first
        await fetchActiveOverride();

        // Read manual country override from localStorage if set by admin
        const savedCountryOverride = localStorage.getItem("75tech_country_override");
        let detectedCountry;

        if (savedCountryOverride) {
          detectedCountry = savedCountryOverride;
        } else {
          detectedCountry = await detectCountry();
        }

        setCountry(detectedCountry);

        // Fetch real-time holiday for the detected/overridden country
        const detectedEvent = await detectCurrentEvent(detectedCountry);
        setEvent(detectedEvent);
      } catch (err) {
        console.error("Seasonal detection fallback:", err);
        const fallback = await detectCurrentEvent("NG");
        setEvent(fallback);
      } finally {
        setLoading(false);
      }
    }

    initializeSystem();

    // Poll backend every 30 seconds for real-time cloud updates
    const pollInterval = setInterval(fetchActiveOverride, 30000);
    return () => clearInterval(pollInterval);
  }, [fetchActiveOverride]);

  // 4. Save Campaign Override (local first, then cloud)
  const setAdminOverride = useCallback(async (overrideData) => {
    try {
      setOverride(overrideData);
      localStorage.setItem(
        "75tech_seasonal_override",
        JSON.stringify(overrideData)
      );

      // Attempt background cloud push to MongoDB
      fetch("/api/seasonal/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(overrideData),
      }).catch(() => {});

      return true;
    } catch (err) {
      console.error("Save error:", err);
      return false;
    }
  }, []);

  // 5. Clear All Overrides
  const clearOverride = useCallback(async () => {
    try {
      setOverride(null);
      localStorage.removeItem("75tech_seasonal_override");
      localStorage.removeItem("75tech_country_override");

      // Notify backend to deactivate override
      fetch("/api/seasonal/override", { method: "DELETE" }).catch(() => {});
      return true;
    } catch (err) {
      console.error("Clear error:", err);
      return false;
    }
  }, []);

  // 6. Country Simulator — persists across entire site via localStorage
  const setCountryOverride = useCallback(async (code) => {
    setLoading(true);
    try {
      localStorage.setItem("75tech_country_override", code);
      setCountry(code);

      const newEvent = await detectCurrentEvent(code);
      setEvent(newEvent);
    } catch (e) {
      console.error("Failed to update country simulation:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // 7. Active event prioritization
  //    Admin override > Live API holiday > Local database > Season > Default
  const activeEvent = override
    ? {
        id: override.themeId,
        name: override.name,
        theme: override.themeId,
        customTitle: override.customTitle,
        customSubtitle: override.customSubtitle,
        customDiscount: override.customDiscount,
        customImage: override.customImage,
        country,
      }
    : event || { id: "default", name: "Welcome", theme: "default" };

  return (
    <SeasonalContext.Provider
      value={{
        country,
        event: activeEvent,
        override,
        loading,
        setAdminOverride,
        clearOverride,
        setCountryOverride,
        forceRefreshOverrides: fetchActiveOverride,
      }}
    >
      {children}
    </SeasonalContext.Provider>
  );
}