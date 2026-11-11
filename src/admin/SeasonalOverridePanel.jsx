// src/admin/SeasonalOverridePanel.jsx
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
  const [tab, setTab] = useState("status");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [customName, setCustomName] = useState("");
  const [expiresIn, setExpiresIn] = useState("24");
  const [customCountry, setCustomCountry] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  const themeIds = Object.keys(SEASONAL_THEMES);
  const allCountries = [...new Set(Object.values(REGIONS).flat())].sort();

  const handleApplyOverride = () => {
    if (!selectedTheme) return;
    const theme = SEASONAL_THEMES[selectedTheme];
    setAdminOverride({
      themeId: selectedTheme,
      name: customName || theme.title,
      expiresAt: new Date(
        Date.now() + parseInt(expiresIn) * 60 * 60 * 1000
      ).toISOString(),
    });
    setSaveMsg("Override applied!");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleClearOverride = () => {
    clearOverride();
    setSelectedTheme("");
    setCustomName("");
    setSaveMsg("Override cleared!");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleCountryOverride = () => {
    if (!customCountry) return;
    setCountryOverride(customCountry);
    setSaveMsg(`Country set to ${customCountry}`);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleResetCountry = () => {
    localStorage.removeItem("75tech_country_override");
    sessionStorage.removeItem("75tech_detected_country");
    setSaveMsg("Country reset — reload to re-detect");
    setTimeout(() => setSaveMsg(""), 3000);
  };

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
      {/* Floating Admin Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] bg-zinc-800 hover:bg-zinc-700
                   text-white w-12 h-12 rounded-full shadow-2xl
                   flex items-center justify-center
                   transition-all hover:scale-110 ring-1 ring-white/10"
        title="Seasonal Theme Admin (Ctrl+Shift+S)"
      >
        <img
          src="https://unpkg.com/lucide-static@latest/icons/palette.svg"
          alt=""
          className="w-5 h-5 invert"
        />
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
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Seasonal Theme Control
                  </h2>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    75TechStore admin override
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-500 hover:text-white text-xl transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-zinc-800">
                {[
                  { key: "status", label: "Status" },
                  { key: "override", label: "Override" },
                  { key: "country", label: "Country" },
                  { key: "preview", label: "Preview" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex-1 py-3 text-xs font-semibold transition-all ${
                      tab === t.key
                        ? "text-white border-b-2 border-white bg-zinc-800/50"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 140px)" }}>

                {/* ──── STATUS TAB ──── */}
                {tab === "status" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <StatusCard label="Detected Country" value={country} />
                      <StatusCard label="Active Event" value={event?.name || "None"} />
                      <StatusCard label="Theme ID" value={event?.theme || "default"} />
                      <StatusCard
                        label="Override"
                        value={override ? "Active" : "None"}
                        highlight={!!override}
                      />
                    </div>

                    {override && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                        <h3 className="text-amber-400 font-bold text-sm mb-2">
                          Override Active
                        </h3>
                        <p className="text-zinc-400 text-xs">
                          Theme: <strong className="text-white">{override.themeId}</strong>
                        </p>
                        <p className="text-zinc-400 text-xs">
                          Name: <strong className="text-white">{override.name}</strong>
                        </p>
                        <p className="text-zinc-400 text-xs">
                          Expires: <strong className="text-white">{new Date(override.expiresAt).toLocaleString()}</strong>
                        </p>
                        <button
                          onClick={handleClearOverride}
                          className="mt-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-xs font-bold transition-colors ring-1 ring-red-500/20"
                        >
                          Clear Override
                        </button>
                      </div>
                    )}

                    <div className="bg-zinc-800/50 rounded-xl p-4">
                      <h3 className="text-zinc-300 font-bold text-xs mb-2">How It Works</h3>
                      <ul className="text-zinc-500 text-[11px] space-y-1">
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
                      <label className="text-zinc-400 text-xs font-semibold block mb-2">
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
                                setCustomName(t.title);
                              }}
                              className={`text-left p-3 rounded-xl border text-xs transition-all ${
                                selectedTheme === id
                                  ? "border-white/30 bg-white/5 text-white"
                                  : "border-zinc-800 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={t.icon}
                                  alt=""
                                  className="w-4 h-4 flex-shrink-0"
                                  style={{ filter: `drop-shadow(0 0 4px ${t.iconColor})` }}
                                />
                                <span className="font-bold truncate">{t.title}</span>
                              </div>
                              <div className="text-[10px] text-zinc-600 mt-1 font-mono">
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
                          <label className="text-zinc-400 text-xs font-semibold block mb-2">
                            Custom Display Name (optional)
                          </label>
                          <input
                            type="text"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="e.g. Flash Friday Sale"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm focus:border-white/30 focus:ring-1 focus:ring-white/10 outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="text-zinc-400 text-xs font-semibold block mb-2">
                            Expires In
                          </label>
                          <div className="flex gap-2">
                            {["1", "6", "12", "24", "48", "72", "168"].map((h) => (
                              <button
                                key={h}
                                onClick={() => setExpiresIn(h)}
                                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                                  expiresIn === h
                                    ? "bg-white text-black"
                                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                }`}
                              >
                                {parseInt(h) >= 24 ? `${parseInt(h) / 24}d` : `${h}h`}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleApplyOverride}
                          className="w-full bg-white hover:bg-zinc-100 text-black font-bold py-3 rounded-xl text-sm transition-all hover:scale-[1.01] shadow-lg"
                        >
                          Apply Override
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* ──── COUNTRY TAB ──── */}
                {tab === "country" && (
                  <div className="space-y-5">
                    <div className="bg-zinc-800/50 rounded-xl p-4">
                      <p className="text-zinc-400 text-sm">
                        Detected: <span className="text-white font-bold">{country}</span>
                      </p>
                    </div>

                    <div>
                      <label className="text-zinc-400 text-xs font-semibold block mb-2">
                        Override Country
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={customCountry}
                          onChange={(e) => setCustomCountry(e.target.value)}
                          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm focus:border-white/30 outline-none"
                        >
                          <option value="">Select country...</option>
                          {allCountries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <button
                          onClick={handleCountryOverride}
                          disabled={!customCountry}
                          className="bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold px-6 py-3 rounded-lg text-sm transition-all"
                        >
                          Apply
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-zinc-400 text-xs font-semibold block mb-2">
                        Quick Pick
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["NG", "US", "GB", "IN", "SA", "AE", "CN", "BR", "DE", "ZA", "JP", "AU"].map((code) => (
                          <button
                            key={code}
                            onClick={() => {
                              setCustomCountry(code);
                              setCountryOverride(code);
                              setSaveMsg(`Set to ${code}`);
                              setTimeout(() => setSaveMsg(""), 2000);
                            }}
                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                              country === code
                                ? "bg-white text-black"
                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            }`}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleResetCountry}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded-xl text-sm transition-all"
                    >
                      Reset to Auto-Detect
                    </button>
                  </div>
                )}

                {/* ──── PREVIEW TAB ──── */}
                {tab === "preview" && (
                  <div className="space-y-3">
                    <p className="text-zinc-500 text-xs">
                      Preview any theme without applying it:
                    </p>
                    <div className="grid gap-2 max-h-[50vh] overflow-y-auto pr-2">
                      {themeIds.map((id) => {
                        const t = SEASONAL_THEMES[id];
                        return (
                          <div
                            key={id}
                            className="relative rounded-xl overflow-hidden border border-zinc-800"
                          >
                            {/* Background image thumbnail */}
                            <img
                              src={t.image}
                              alt=""
                              className="w-full h-20 object-cover"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-r ${t.overlay}`} />

                            <div className="relative z-10 p-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <img
                                  src={t.icon}
                                  alt=""
                                  className="w-5 h-5"
                                  style={{ filter: `drop-shadow(0 0 6px ${t.iconColor})` }}
                                />
                                <div>
                                  <h3 className="text-white font-bold text-sm">
                                    {t.title}
                                  </h3>
                                  <p className="text-white/50 text-[10px]">
                                    {t.subtitle}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedTheme(id);
                                  setCustomName(t.title);
                                  setTab("override");
                                }}
                                className="text-white/60 text-xs font-bold hover:text-white transition-colors"
                              >
                                Use →
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
                      className="mt-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold px-4 py-3 rounded-xl text-center"
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

function StatusCard({ label, value, highlight }) {
  return (
    <div
      className={`rounded-xl p-3 border ${
        highlight
          ? "bg-amber-500/10 border-amber-500/20"
          : "bg-zinc-800/50 border-zinc-800"
      }`}
    >
      <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold">
        {label}
      </p>
      <p className="text-white font-bold text-sm mt-1">{value}</p>
    </div>
  );
}