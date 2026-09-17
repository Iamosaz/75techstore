  import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSeasonalTheme } from "../../context/SeasonalContext";
import { SEASONAL_THEMES } from "../../utils/seasonalThemes";
import { REGIONS } from "../../utils/holidayDatabase";

export default function SeasonalOverridePanel() {
  const {
    country,
    event,
    override,
    setAdminOverride,
    clearOverride,
    setCountryOverride,
  } = useSeasonalTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("status"); // status | override | country | preview
  const [selectedTheme, setSelectedTheme] = useState("");
  const [customName, setCustomName] = useState("");
  const [expiresIn, setExpiresIn] = useState("24"); // hours
  const [customCountry, setCustomCountry] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  // All available theme IDs
  const themeIds = Object.keys(SEASONAL_THEMES);

  // All country codes
  const allCountries = [...new Set(Object.values(REGIONS).flat())].sort();

  const handleApplyOverride = () => {
    if (!selectedTheme) return;
    const theme = SEASONAL_THEMES[selectedTheme];
    setAdminOverride({
      themeId: selectedTheme,
      name: customName || theme.title.replace(/[^\w\s]/g, "").trim(),
      expiresAt: new Date(
        Date.now() + parseInt(expiresIn) * 60 * 60 * 1000
      ).toISOString(),
    });
    setSaveMsg("✅ Override applied!");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleClearOverride = () => {
    clearOverride();
    setSelectedTheme("");
    setCustomName("");
    setSaveMsg("🗑️ Override cleared!");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleCountryOverride = () => {
    if (!customCountry) return;
    setCountryOverride(customCountry);
    setSaveMsg(`🌍 Country set to ${customCountry}`);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleResetCountry = () => {
    localStorage.removeItem("75tech_country_override");
    sessionStorage.removeItem("75tech_detected_country");
    setSaveMsg("🔄 Country reset — reload to re-detect");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  // Admin toggle: Ctrl + Shift + S
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* 🔧 Floating Admin Button (only visible on dev/admin) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] bg-yellow-500 hover:bg-yellow-400
                   text-black w-12 h-12 rounded-full shadow-2xl
                   flex items-center justify-center text-xl
                   transition-all hover:scale-110 hover:rotate-12"
        title="Seasonal Theme Admin (Ctrl+Shift+S)"
      >
        🎨
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    🎨 Seasonal Theme Control
                  </h2>
                  <p className="text-zinc-500 text-xs mt-1">
                    Admin override panel — 75TechStore
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-white text-2xl transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-zinc-700">
                {[
                  { key: "status", label: "📊 Status" },
                  { key: "override", label: "🎯 Override" },
                  { key: "country", label: "🌍 Country" },
                  { key: "preview", label: "👁️ Preview" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex-1 py-3 text-sm font-semibold transition-all ${
                      tab === t.key
                        ? "text-yellow-400 border-b-2 border-yellow-400 bg-zinc-800"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 180px)" }}>

                {/* ──── STATUS TAB ──── */}
                {tab === "status" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <StatusCard
                        label="Detected Country"
                        value={country}
                        icon="🌍"
                      />
                      <StatusCard
                        label="Active Event"
                        value={event?.name || "None"}
                        icon="🎉"
                      />
                      <StatusCard
                        label="Theme ID"
                        value={event?.theme || "default"}
                        icon="🎨"
                      />
                      <StatusCard
                        label="Override Active"
                        value={override ? "YES" : "NO"}
                        icon={override ? "🟢" : "🔴"}
                        highlight={!!override}
                      />
                    </div>

                    {override && (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <h3 className="text-yellow-400 font-bold text-sm mb-2">
                          ⚠️ Override Active
                        </h3>
                        <p className="text-zinc-300 text-sm">
                          Theme: <strong>{override.themeId}</strong>
                        </p>
                        <p className="text-zinc-300 text-sm">
                          Name: <strong>{override.name}</strong>
                        </p>
                        <p className="text-zinc-300 text-sm">
                          Expires:{" "}
                          <strong>
                            {new Date(override.expiresAt).toLocaleString()}
                          </strong>
                        </p>
                        <button
                          onClick={handleClearOverride}
                          className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                          🗑️ Clear Override
                        </button>
                      </div>
                    )}

                    <div className="bg-zinc-800 rounded-xl p-4">
                      <h3 className="text-zinc-300 font-bold text-sm mb-2">
                        ℹ️ How It Works
                      </h3>
                      <ul className="text-zinc-500 text-xs space-y-1">
                        <li>• Auto-detects country via IP address</li>
                        <li>• Matches today's date against holiday database</li>
                        <li>• Falls back to seasonal theme if no holiday</li>
                        <li>• Admin override bypasses all detection</li>
                        <li>• Override auto-expires after set duration</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* ──── OVERRIDE TAB ──── */}
                {tab === "override" && (
                  <div className="space-y-5">
                    <div>
                      <label className="text-zinc-400 text-sm font-semibold block mb-2">
                        Select Theme
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2">
                        {themeIds.map((id) => {
                          const t = SEASONAL_THEMES[id];
                          return (
                            <button
                              key={id}
                              onClick={() => {
                                setSelectedTheme(id);
                                setCustomName(t.title.replace(/[^\w\s]/g, "").trim());
                              }}
                              className={`text-left p-3 rounded-xl border text-xs transition-all ${
                                selectedTheme === id
                                  ? "border-yellow-400 bg-yellow-400/10 text-yellow-300"
                                  : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500"
                              }`}
                            >
                              <div className="font-bold truncate">{t.badge}</div>
                              <div className="text-[10px] text-zinc-500 mt-1 truncate">
                                {id}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {selectedTheme && (
                      <>
                        <div>
                          <label className="text-zinc-400 text-sm font-semibold block mb-2">
                            Custom Display Name (optional)
                          </label>
                          <input
                            type="text"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="e.g. Flash Friday Sale"
                            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="text-zinc-400 text-sm font-semibold block mb-2">
                            Expires In (hours)
                          </label>
                          <div className="flex gap-2">
                            {["1", "6", "12", "24", "48", "72", "168"].map(
                              (h) => (
                                <button
                                  key={h}
                                  onClick={() => setExpiresIn(h)}
                                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                                    expiresIn === h
                                      ? "bg-yellow-400 text-black"
                                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                  }`}
                                >
                                  {parseInt(h) >= 24
                                    ? `${parseInt(h) / 24}d`
                                    : `${h}h`}
                                </button>
                              )
                            )}
                          </div>
                        </div>

                        <button
                          onClick={handleApplyOverride}
                          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 rounded-xl text-sm transition-all hover:scale-[1.02] shadow-lg"
                        >
                          ✅ Apply Override
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* ──── COUNTRY TAB ──── */}
                {tab === "country" && (
                  <div className="space-y-5">
                    <div className="bg-zinc-800 rounded-xl p-4">
                      <p className="text-zinc-400 text-sm">
                        Currently detected:{" "}
                        <span className="text-white font-bold text-lg">
                          {country}
                        </span>
                      </p>
                    </div>

                    <div>
                      <label className="text-zinc-400 text-sm font-semibold block mb-2">
                        Override Country Code
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={customCountry}
                          onChange={(e) => setCustomCountry(e.target.value)}
                          className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white text-sm focus:border-yellow-400 outline-none"
                        >
                          <option value="">Select country...</option>
                          {allCountries.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handleCountryOverride}
                          disabled={!customCountry}
                          className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold px-6 py-3 rounded-lg text-sm transition-all"
                        >
                          Apply
                        </button>
                      </div>
                    </div>

                    {/* Quick pick popular countries */}
                    <div>
                      <label className="text-zinc-400 text-sm font-semibold block mb-2">
                        Quick Pick
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { code: "NG", flag: "🇳🇬" },
                          { code: "US", flag: "🇺🇸" },
                          { code: "GB", flag: "🇬🇧" },
                          { code: "IN", flag: "🇮🇳" },
                          { code: "SA", flag: "🇸🇦" },
                          { code: "AE", flag: "🇦🇪" },
                          { code: "CN", flag: "🇨🇳" },
                          { code: "BR", flag: "🇧🇷" },
                          { code: "DE", flag: "🇩🇪" },
                          { code: "ZA", flag: "🇿🇦" },
                          { code: "JP", flag: "🇯🇵" },
                          { code: "AU", flag: "🇦🇺" },
                        ].map((c) => (
                          <button
                            key={c.code}
                            onClick={() => {
                              setCustomCountry(c.code);
                              setCountryOverride(c.code);
                              setSaveMsg(`🌍 Set to ${c.code}`);
                              setTimeout(() => setSaveMsg(""), 2000);
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                              country === c.code
                                ? "bg-yellow-400 text-black"
                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            }`}
                          >
                            {c.flag} {c.code}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleResetCountry}
                      className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-bold py-3 rounded-xl text-sm transition-all"
                    >
                      🔄 Reset to Auto-Detect
                    </button>
                  </div>
                )}

                {/* ──── PREVIEW TAB ──── */}
                {tab === "preview" && (
                  <div className="space-y-4">
                    <p className="text-zinc-400 text-sm">
                      Preview any theme without applying it:
                    </p>
                    <div className="grid gap-3 max-h-[50vh] overflow-y-auto pr-2">
                      {themeIds.map((id) => {
                        const t = SEASONAL_THEMES[id];
                        return (
                          <div
                            key={id}
                            className={`bg-gradient-to-r ${t.bg} rounded-xl p-4 border border-white/10`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span
                                  className={`${t.accent} text-[10px] font-bold px-2 py-0.5 rounded-full`}
                                >
                                  {t.badge}
                                </span>
                                <h3 className="text-white font-bold mt-2 text-lg">
                                  {t.title}
                                </h3>
                                <p className="text-white/60 text-xs mt-1">
                                  {t.subtitle}
                                </p>
                              </div>
                              <div className="text-3xl">
                                {t.particles.slice(0, 3).join("")}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-white/40 text-[10px] font-mono">
                                ID: {id}
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedTheme(id);
                                  setCustomName(t.title.replace(/[^\w\s]/g, "").trim());
                                  setTab("override");
                                }}
                                className="text-yellow-300 text-xs font-bold hover:underline"
                              >
                                Use this →
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Save message */}
                <AnimatePresence>
                  {saveMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-4 bg-green-500/20 border border-green-500/40 text-green-300 text-sm font-bold px-4 py-3 rounded-xl text-center"
                    >
                      {saveMsg}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Status card sub-component
function StatusCard({ label, value, icon, highlight }) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        highlight
          ? "bg-yellow-500/10 border-yellow-500/30"
          : "bg-zinc-800 border-zinc-700"
      }`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold">
        {label}
      </p>
      <p className="text-white font-bold text-sm mt-1">{value}</p>
    </div>
  );
}