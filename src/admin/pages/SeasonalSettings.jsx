// src/admin/pages/SeasonalSettings.jsx
import { useState, useEffect, useCallback } from "react";
import { useSeasonalTheme } from "../../context/SeasonalContext";
import {
  SEASONAL_THEMES,
  getTheme,
  getThemeKeys,
} from "../../utils/seasonalThemes";

/* ─── tiny reusable pieces ─── */
const Glass = ({ children, className = "" }) => (
  <div
    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl ${className}`}
  >
    {children}
  </div>
);

const Label = ({ children }) => (
  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
    {children}
  </label>
);

const Input = ({ ...props }) => (
  <input
    {...props}
    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
               placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50
               focus:border-indigo-500/50 transition-all text-sm"
  />
);

/* ─── cloud upload helper (Cloudinary unsigned) ─── */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "YOUR_CLOUD";
const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "YOUR_PRESET";

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: fd }
  );
  const data = await res.json();
  return data.secure_url;
}

/* ─── country list for simulator ─── */
const COUNTRIES = [
  { code: "NG", name: "Nigeria" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "GH", name: "Ghana" },
  { code: "ZA", name: "South Africa" },
  { code: "KE", name: "Kenya" },
  { code: "IN", name: "India" },
  { code: "CA", name: "Canada" },
  { code: "AE", name: "UAE" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "BR", name: "Brazil" },
  { code: "JP", name: "Japan" },
  { code: "AU", name: "Australia" },
];

/* ─── expiry presets ─── */
const EXPIRY_OPTIONS = [
  { label: "12 hours", hours: 12 },
  { label: "24 hours", hours: 24 },
  { label: "3 days", hours: 72 },
  { label: "1 week", hours: 168 },
  { label: "1 month", hours: 720 },
];

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function SeasonalSettings() {
  const { event, setAdminOverride, clearOverride } = useSeasonalTheme();

  /* ── form state ── */
  const [selectedTheme, setSelectedTheme] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customSubtitle, setCustomSubtitle] = useState("");
  const [customDiscount, setCustomDiscount] = useState("");
  const [showBadge, setShowBadge] = useState(false);
  const [customImage, setCustomImage] = useState("");
  const [expiryHours, setExpiryHours] = useState(24);
  const [simCountry, setSimCountry] = useState("NG");

  /* ── ui state ── */
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  /* ── seed form from active event ── */
  useEffect(() => {
    if (event) {
      setSelectedTheme(event.theme || "");
      setCustomTitle(event.customTitle || event.name || "");
      setCustomSubtitle(event.customSubtitle || "");
      setCustomDiscount(event.customDiscount || "");
      setShowBadge(event.showBadge ?? !!event.customDiscount);
      setCustomImage(event.customImage || "");
    }
  }, [event]);

  /* ── resolve theme data ── */
  const theme = getTheme(selectedTheme);

  /* ── image upload ── */
  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setCustomImage(url);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  }, []);

  /* ── apply override ── */
  const handleApply = () => {
    const expiresAt = new Date(
      Date.now() + expiryHours * 60 * 60 * 1000
    ).toISOString();

    setAdminOverride({
      themeId: selectedTheme,
      name: customTitle || theme.title,
      customTitle: customTitle || "",
      customSubtitle: customSubtitle || "",
      customDiscount: showBadge ? customDiscount : "",
      showBadge,
      customImage: customImage || "",
      expiresAt,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  /* ── clear ── */
  const handleClear = () => {
    clearOverride();
    setSelectedTheme("");
    setCustomTitle("");
    setCustomSubtitle("");
    setCustomDiscount("");
    setShowBadge(false);
    setCustomImage("");
  };

  /* ── preview values ── */
  const previewTitle = customTitle || theme.title;
  const previewSubtitle = customSubtitle || theme.subtitle;
  const previewImage = customImage || theme.image;
  const previewDiscount =
    showBadge && customDiscount ? customDiscount : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ── header ── */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Seasonal Theme</h1>
          <p className="text-white/40 text-sm mt-1">
            Control the seasonal hero banner your customers see.
          </p>
        </div>

        {/* ── info strip ── */}
        <Glass className="px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="text-white/40">Current theme:</span>
          <span className="text-white font-medium">
            {selectedTheme || "None"}
          </span>

          <span className="text-white/20">|</span>

          <span className="text-white/40">Discount badge:</span>
          <span
            className={`font-medium ${
              showBadge && customDiscount
                ? "text-emerald-400"
                : "text-white/30"
            }`}
          >
            {showBadge && customDiscount
              ? `${customDiscount} OFF — Visible`
              : "Hidden"}
          </span>
        </Glass>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
          {/* ══════════════════════════════════════════
              LEFT — CONTROLS
              ══════════════════════════════════════════ */}
          <div className="space-y-6">
            {/* ── theme selector grid ── */}
            <Glass className="p-5 space-y-4">
              <Label>Select Theme</Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
                {getThemeKeys().map((key) => {
                  const t = SEASONAL_THEMES[key];
                  const active = selectedTheme === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedTheme(key)}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border
                        transition-all text-[11px] leading-tight text-center
                        ${
                          active
                            ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                    >
                      <img
                        src={t.icon}
                        alt=""
                        className="w-6 h-6"
                        style={{
                          filter: `brightness(0) saturate(100%) drop-shadow(0 0 4px ${t.iconColor})`,
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <span className="text-white/70 truncate w-full">
                        {t.title}
                      </span>
                      {active && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </Glass>

            {/* ── custom fields ── */}
            <Glass className="p-5 space-y-4">
              <Label>Custom Title</Label>
              <Input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={theme.title}
              />

              <Label>Custom Subtitle</Label>
              <Input
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                placeholder={theme.subtitle}
              />

              {/* ── DISCOUNT BADGE SECTION ── */}
              <div className="border border-white/10 rounded-xl p-4 space-y-3 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <Label>Discount Badge</Label>
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showBadge}
                    onClick={() => setShowBadge(!showBadge)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${showBadge ? "bg-emerald-500" : "bg-white/20"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform
                        ${showBadge ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>

                <p className="text-[11px] text-white/30">
                  {showBadge
                    ? "Badge is visible on the banner. Enter a value below."
                    : "Badge is hidden. Toggle on to show a discount badge."}
                </p>

                {showBadge && (
                  <Input
                    value={customDiscount}
                    onChange={(e) => setCustomDiscount(e.target.value)}
                    placeholder="e.g. 20%"
                  />
                )}
              </div>
            </Glass>

            {/* ── image upload ── */}
            <Glass className="p-5 space-y-4">
              <Label>Custom Banner Image</Label>
              <div className="flex items-center gap-3">
                <label
                  className={`flex-1 flex items-center justify-center gap-2 border border-dashed
                    border-white/20 rounded-xl py-3 cursor-pointer hover:bg-white/5 transition text-sm text-white/50
                    ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {uploading ? "Uploading..." : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                {customImage && (
                  <button
                    onClick={() => setCustomImage("")}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
              {customImage && (
                <img
                  src={customImage}
                  alt="Preview"
                  className="w-full h-28 object-cover rounded-xl border border-white/10"
                />
              )}
            </Glass>

            {/* ── country simulator ── */}
            <Glass className="p-5 space-y-3">
              <Label>Country Simulator</Label>
              <select
                value={simCountry}
                onChange={(e) => setSimCountry(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                           text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {COUNTRIES.map((c) => (
                  <option
                    key={c.code}
                    value={c.code}
                    className="bg-zinc-900 text-white"
                  >
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-white/30">
                Simulates what users in this country will see. Detection is
                automatic in production.
              </p>
            </Glass>

            {/* ── expiry ── */}
            <Glass className="p-5 space-y-3">
              <Label>Override Expiry</Label>
              <div className="flex flex-wrap gap-2">
                {EXPIRY_OPTIONS.map((opt) => (
                  <button
                    key={opt.hours}
                    onClick={() => setExpiryHours(opt.hours)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all
                      ${
                        expiryHours === opt.hours
                          ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                          : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Glass>

            {/* ── action buttons ── */}
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5
                           rounded-xl transition-all text-sm active:scale-[0.98]"
              >
                {saved ? "✓ Saved!" : "Apply Override"}
              </button>
              <button
                onClick={handleClear}
                className="px-6 border border-white/10 text-white/50 hover:text-white hover:bg-white/5
                           rounded-xl transition-all text-sm"
              >
                Clear
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════════
              RIGHT — LIVE PREVIEW
              ══════════════════════════════════════════ */}
          <div className="space-y-4">
            <Label>Banner Preview</Label>
            <Glass className="overflow-hidden">
              <div className="relative w-full aspect-[16/7] overflow-hidden rounded-xl">
                {/* bg image */}
                <img
                  src={previewImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${theme.overlay}`}
                />

                {/* discount badge */}
                {previewDiscount && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                      {previewDiscount} OFF
                    </span>
                  </div>
                )}

                {/* content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 gap-3">
                  {/* icon */}
                  <div
                    className={`w-10 h-10 rounded-2xl ${theme.glass} flex items-center justify-center`}
                  >
                    <img
                      src={theme.icon}
                      alt=""
                      className="w-5 h-5"
                      style={{
                        filter: `brightness(0) saturate(100%) drop-shadow(0 0 6px ${theme.iconColor})`,
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>

                  {/* title */}
                  <h2
                    className="text-white text-lg sm:text-xl font-light"
                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
                  >
                    {previewTitle}
                  </h2>

                  {/* subtitle */}
                  {previewSubtitle && (
                    <p className="text-white/60 text-[11px] font-light max-w-xs">
                      {previewSubtitle}
                    </p>
                  )}

                  {/* CTA */}
                  <button
                    className={`mt-1 px-6 py-2 rounded-full text-xs font-bold ${theme.accent} shadow-lg pointer-events-none`}
                  >
                    {theme.cta || "Shop Now"} →
                  </button>
                </div>
              </div>
            </Glass>

            {/* preview info */}
            <Glass className="p-4 space-y-2 text-xs text-white/40">
              <div className="flex justify-between">
                <span>Theme ID</span>
                <span className="text-white/60 font-mono">
                  {selectedTheme || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discount Badge</span>
                <span
                  className={
                    previewDiscount ? "text-emerald-400" : "text-white/30"
                  }
                >
                  {previewDiscount
                    ? `${previewDiscount} OFF — Showing`
                    : showBadge
                      ? "Toggle ON but no value"
                      : "Hidden"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Expires in</span>
                <span className="text-white/60">{expiryHours}h</span>
              </div>
              <div className="flex justify-between">
                <span>Simulated Country</span>
                <span className="text-white/60">{simCountry}</span>
              </div>
              <div className="flex justify-between">
                <span>Custom Image</span>
                <span className="text-white/60">
                  {customImage ? "Yes (uploaded)" : "Using theme default"}
                </span>
              </div>
            </Glass>
          </div>
        </div>
      </div>
    </div>
  );
}