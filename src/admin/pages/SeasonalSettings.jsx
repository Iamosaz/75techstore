// src/admin/pages/SeasonalSettings.jsx
import React, { useState, useEffect } from "react";
import { useSeasonalTheme } from "../../context/SeasonalContext";
import { SEASONAL_THEMES, getTheme } from "../../utils/seasonalThemes";

export default function SeasonalSettings() {
  const {
    country,
    event,
    override,
    setAdminOverride,
    clearOverride,
    setCountryOverride,
  } = useSeasonalTheme();

  const [selectedTheme, setSelectedTheme] = useState("christmas");
  const [customTitle, setCustomTitle] = useState("");
  const [customSubtitle, setCustomSubtitle] = useState("");
  const [customDiscount, setCustomDiscount] = useState("");
  const [customImage, setCustomImage] = useState(""); // ✅ Cloudinary URL state
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [expiresInHours, setExpiresInHours] = useState("48");
  const [testCountry, setTestCountry] = useState(country || "NG");
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState("23 : 59 : 59");

  // Load existing override data into inputs
  useEffect(() => {
    if (override) {
      setSelectedTheme(override.themeId);
      setCustomTitle(override.customTitle || "");
      setCustomSubtitle(override.customSubtitle || "");
      setCustomDiscount(override.customDiscount || "");
      setCustomImage(override.customImage || "");
    }
  }, [override]);

  // Live countdown for realistic preview
  useEffect(() => {
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tick = () => {
      const diff = endOfDay - new Date();
      if (diff <= 0) return setCountdown("00 : 00 : 00");
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setCountdown(`${h} : ${m} : ${s}`);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const themeList = Object.keys(SEASONAL_THEMES);
  const previewThemeData = getTheme(selectedTheme);
  const activePreviewImage = customImage || previewThemeData.image;

  // ☁️ Direct Upload to Cloudinary
  const handleCloudinaryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use your Cloudinary details from .env or fallback
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your_preset";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    setIsUploadingImage(true);
    setStatusMessage({ type: "info", text: "⏳ Uploading image to Cloudinary..." });

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        const data = await res.json();
        setCustomImage(data.secure_url);
        setStatusMessage({
          type: "success",
          text: "✅ Cloudinary image uploaded successfully!",
        });
      } else {
        // If unsigned upload fails, user can still paste URL directly
        setStatusMessage({
          type: "error",
          text: "⚠️ Direct upload failed. You can paste the Cloudinary URL directly in the input box below.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "⚠️ Upload error. You can paste your Cloudinary image link directly.",
      });
    } finally {
      setIsUploadingImage(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const handleApplyOverride = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await setAdminOverride({
      themeId: selectedTheme,
      name: customTitle || previewThemeData.title,
      customTitle,
      customSubtitle,
      customDiscount,
      customImage, // ✅ Saves Cloudinary URL
      expiresAt: new Date(
        Date.now() + Number(expiresInHours) * 60 * 60 * 1000
      ).toISOString(),
    });

    setIsSubmitting(false);
    if (success) {
      setStatusMessage({
        type: "success",
        text: "🚀 Campaign published successfully with custom Cloudinary banner!",
      });
    } else {
      setStatusMessage({
        type: "error",
        text: "❌ Failed to publish override settings.",
      });
    }
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleResetToAuto = async () => {
    setIsSubmitting(true);
    const success = await clearOverride();
    setIsSubmitting(false);

    if (success) {
      setCustomTitle("");
      setCustomSubtitle("");
      setCustomDiscount("");
      setCustomImage("");
      setStatusMessage({
        type: "info",
        text: "🔄 Manual override cleared. Reverted to Auto Holiday API.",
      });
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleCountryTest = async (code) => {
    setTestCountry(code);
    await setCountryOverride(code);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
            🎉 Festive Season & Real-Time Holiday Manager
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Publish database-synced campaign overrides, custom Cloudinary banners, and geo-targeted discount sliders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              override
                ? "bg-amber-100 text-amber-800 border-amber-300 animate-pulse"
                : "bg-emerald-100 text-emerald-800 border-emerald-300"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            {override ? "MANUAL OVERRIDE LIVE" : "AUTOMATIC (API TRACKING)"}
          </span>
        </div>
      </div>

      {/* Status Notification */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold border ${
            statusMessage.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : statusMessage.type === "error"
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-blue-50 text-blue-800 border-blue-200"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Settings Panel */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleApplyOverride}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6"
          >
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
              ⚙️ Campaign Settings
            </h2>

            {/* Theme Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                1. Select Preset Theme Foundation
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1.5 border border-gray-200 rounded-xl bg-gray-50">
                {themeList.map((tKey) => {
                  const t = SEASONAL_THEMES[tKey];
                  const isSelected = selectedTheme === tKey;
                  return (
                    <button
                      key={tKey}
                      type="button"
                      onClick={() => setSelectedTheme(tKey)}
                      className={`p-2.5 text-left rounded-lg border transition-all text-xs flex flex-col justify-between ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-sm"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <span className="truncate">{t.badge}</span>
                      <span className="text-[10px] text-gray-400 font-mono mt-0.5">
                        {tKey}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ☁️ Cloudinary Image Upload Section */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 rounded-xl border border-blue-100 space-y-3">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                📸 Custom Cloudinary Banner Image
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* File Upload to Cloudinary */}
                <div>
                  <label className="block text-[11px] text-gray-600 font-semibold mb-1">
                    Upload from Device:
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-3 bg-white cursor-pointer transition">
                    <span className="text-xl mb-1">☁️</span>
                    <span className="text-xs font-bold text-gray-700">
                      {isUploadingImage ? "Uploading to Cloudinary..." : "Choose Image File"}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      JPG, PNG, WebP (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCloudinaryUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Paste Cloudinary URL directly */}
                <div>
                  <label className="block text-[11px] text-gray-600 font-semibold mb-1">
                    Or Paste Cloudinary URL:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="https://res.cloudinary.com/your-cloud/image/upload/..."
                    value={customImage}
                    onChange={(e) => setCustomImage(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono"
                  />
                </div>
              </div>

              {customImage && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
                    ✓ Custom image active
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomImage("")}
                    className="text-[11px] text-red-600 hover:underline font-bold"
                  >
                    Reset to Default Theme Image
                  </button>
                </div>
              )}
            </div>

            {/* Custom Title & Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Custom Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder={previewThemeData.title}
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Discount Tag Overwrite
                </label>
                <input
                  type="text"
                  placeholder={previewThemeData.discount || "50%"}
                  value={customDiscount}
                  onChange={(e) => setCustomDiscount(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Custom Subtitle */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Custom Subtitle / Marketing Line
              </label>
              <input
                type="text"
                placeholder={previewThemeData.subtitle}
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {/* Expiry Picker */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Set Expiration Time Limit
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "12h", val: "12" },
                  { label: "24h (1 Day)", val: "24" },
                  { label: "3 Days", val: "72" },
                  { label: "1 Week", val: "168" },
                  { label: "1 Month", val: "720" },
                ].map((d) => (
                  <button
                    key={d.val}
                    type="button"
                    onClick={() => setExpiresInHours(d.val)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      expiresInHours === d.val
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-gray-100 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-md transition disabled:opacity-50"
              >
                {isSubmitting ? "Syncing..." : "🚀 Publish Real-time Campaign"}
              </button>

              {override && (
                <button
                  type="button"
                  onClick={handleResetToAuto}
                  disabled={isSubmitting}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 rounded-xl text-sm font-bold transition disabled:opacity-50"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Country Simulator */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
              🌍 Simulate Country Holiday API Feed
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Select any country code below to test geo-targeted, live holiday calendars.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { code: "NG", label: "🇳🇬 Nigeria" },
                { code: "US", label: "🇺🇸 United States" },
                { code: "GB", label: "🇬🇧 United Kingdom" },
                { code: "IN", label: "🇮🇳 India" },
                { code: "AE", label: "🇦🇪 UAE" },
                { code: "SA", label: "🇸🇦 Saudi Arabia" },
                { code: "ZA", label: "🇿🇦 South Africa" },
              ].map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCountryTest(c.code)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                    testCountry === c.code
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Live Preview Panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              👀 Live Campaign Preview
            </h2>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[520px] flex flex-col justify-between border border-gray-800 bg-zinc-900">
              {/* Background Image (Custom Cloudinary or Preset) */}
              <img
                src={activePreviewImage}
                alt="preview"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
              />

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${previewThemeData.overlay}`}
              />

              {/* Top Row: Discount + Country */}
              <div className="relative z-10 flex items-center justify-between p-5">
                <span className="bg-red-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg">
                  {customDiscount || previewThemeData.discount || "50%"} OFF
                </span>
                <span className="text-[10px] font-mono bg-black/40 backdrop-blur-md px-3 py-1 rounded-md border border-white/15 text-white">
                  📍 {testCountry}
                </span>
              </div>

              {/* Middle Content */}
              <div className="relative z-10 text-center my-auto py-6 px-5 space-y-3">
                <span
                  className={`${previewThemeData.accent} inline-block text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full shadow-md uppercase`}
                >
                  🔥 {previewThemeData.badge}
                </span>

                <h3
                  className="text-2xl sm:text-3xl font-black text-white leading-tight"
                  style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
                >
                  {customTitle || previewThemeData.title}
                </h3>

                <p
                  className="text-yellow-200 text-sm sm:text-base font-bold"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}
                >
                  {customSubtitle || previewThemeData.subtitle}
                </p>

                <p className="text-xs text-white/70 italic max-w-xs mx-auto">
                  "{previewThemeData.tagline}"
                </p>

                <div className="bg-black/50 backdrop-blur-lg px-4 py-2.5 rounded-xl border border-white/10 inline-block mt-2">
                  <span className="text-[9px] text-white/50 uppercase block font-semibold tracking-widest">
                    ⏰ Ends In
                  </span>
                  <span className="text-lg font-mono font-black text-yellow-300 tabular-nums">
                    {countdown}
                  </span>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="relative z-10 p-5 text-center">
                <div
                  className={`${previewThemeData.accent} w-full py-3 rounded-xl font-bold text-xs shadow-lg`}
                >
                  {previewThemeData.cta} →
                </div>
                <p className="text-[9px] text-white/50 mt-2.5">
                  🚚 Free Delivery • 💳 Card Payments • ↩️ 7-Day Refund Policy
                </p>
              </div>
            </div>

            {/* Cloudinary Info Banner */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-xs text-gray-600 space-y-1.5">
              <p className="flex items-center justify-between">
                <span className="font-bold text-gray-800">Banner Image Source:</span>
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                  customImage ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"
                }`}>
                  {customImage ? "☁️ Cloudinary Custom" : "🖼️ Unsplash Preset"}
                </span>
              </p>
              <p>
                <span className="font-bold text-gray-800">Theme ID:</span>{" "}
                <span className="font-mono text-blue-600">{selectedTheme}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}