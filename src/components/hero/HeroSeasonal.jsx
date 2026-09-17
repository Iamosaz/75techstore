// src/components/hero/HeroSeasonal.jsx
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSeasonalTheme } from "../../context/SeasonalContext";
import { getTheme } from "../../utils/seasonalThemes";

export default function HeroSeasonal() {
  const { event, country, loading } = useSeasonalTheme();
  const [countdown, setCountdown] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  const theme = useMemo(() => {
    return event ? getTheme(event.theme) : getTheme("default");
  }, [event]);

  // ⏳ Live Countdown Timer
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

  // 🖼️ Reset image loaded state when image changes (e.g., admin uploads new Cloudinary image)
  useEffect(() => {
    setImageLoaded(false);
  }, [event?.customImage, theme.image]);

  if (loading) {
    return (
      <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayTitle = event?.customTitle || theme.title;
  const displaySubtitle = event?.customSubtitle || theme.subtitle;
  const displayDiscount = event?.customDiscount || theme.discount || "50%";
  const displayImage = event?.customImage || theme.image; // ✅ Cloudinary priority

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-900">
      
      {/* ── Background Image with Ken Burns Zoom Effect ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 12, ease: "easeOut" }}
      >
        <img
          key={displayImage}
          src={displayImage}
          alt={displayTitle}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </motion.div>

      {/* ── Gradient Overlay for Text Readability ── */}
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.overlay}`} />

      {/* ── Bottom Gradient Fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

      {/* ── Subtle Grain Texture Overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-8 max-w-5xl mx-auto">
        
        {/* Country Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6"
        >
          <span className="bg-black/40 backdrop-blur-md text-white/70 text-[10px] sm:text-xs font-mono px-3 py-1.5 rounded-full border border-white/10">
            📍 {country}
          </span>
        </motion.div>

        {/* Discount Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="absolute top-4 left-4 sm:top-6 sm:left-6"
        >
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-2xl rotate-6 flex flex-col items-center justify-center shadow-2xl shadow-red-600/40 border border-white/20">
              <span className="text-white font-black text-xl sm:text-2xl leading-none -rotate-6">
                {displayDiscount}
              </span>
              <span className="text-white/80 text-[8px] sm:text-[10px] font-bold uppercase -rotate-6">
                OFF
              </span>
            </div>
          </div>
        </motion.div>

        {/* Campaign Badge */}
        <motion.div
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.25 }}
          className="mb-4 sm:mb-5"
        >
          <span
            className={`${theme.accent} inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] sm:text-xs font-black tracking-[0.2em] shadow-xl uppercase backdrop-blur-sm`}
          >
            <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
            {theme.badge}
            <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 sm:mb-4 leading-[1.1] tracking-tight"
          style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
        >
          {displayTitle}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-base sm:text-xl md:text-2xl lg:text-3xl text-yellow-300 font-bold mb-2"
          style={{ textShadow: "0 2px 15px rgba(0,0,0,0.4)" }}
        >
          {displaySubtitle}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-xs sm:text-sm md:text-base text-white/70 max-w-xl mb-5 sm:mb-7 font-light"
        >
          "{theme.tagline}"
        </motion.p>

        {/* Countdown Timer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="mb-6 sm:mb-7"
        >
          <div className="bg-black/50 backdrop-blur-xl px-5 sm:px-8 py-3 sm:py-4 rounded-2xl border border-white/10 shadow-2xl">
            <p className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold">
              Deal Expires In
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              {countdown.split(" : ").map((unit, i) => (
                <React.Fragment key={i}>
                  <div className="bg-white/10 rounded-lg px-2.5 sm:px-4 py-1.5 sm:py-2 min-w-[42px] sm:min-w-[56px]">
                    <span className="text-xl sm:text-3xl font-mono font-black text-white tabular-nums">
                      {unit}
                    </span>
                  </div>
                  {i < 2 && (
                    <span className="text-white/40 text-xl sm:text-2xl font-bold animate-pulse">
                      :
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between px-1 sm:px-2 mt-1.5">
              {["HRS", "MIN", "SEC"].map((label) => (
                <span
                  key={label}
                  className="text-[8px] sm:text-[9px] text-white/30 uppercase tracking-wider font-medium"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
        >
          <Link
            to="/shop"
            className={`${theme.accent} group inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-black text-sm sm:text-base shadow-2xl hover:scale-105 transition-all duration-300`}
          >
            {theme.cta}
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            to="/deals"
            className="text-white/60 hover:text-white text-xs sm:text-sm font-medium underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all"
          >
            View All Deals
          </Link>
        </motion.div>

        {/* Trust Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-white/40 text-[9px] sm:text-[11px] font-medium"
        >
          {[
            { icon: "🚚", text: "Free Delivery" },
            { icon: "💳", text: "Pay on Delivery" },
            { icon: "🔒", text: "Secure Checkout" },
            { icon: "↩️", text: "Easy Returns" },
          ].map((item, i) => (
            <React.Fragment key={item.text}>
              <span className="flex items-center gap-1">
                <span className="text-xs">{item.icon}</span> {item.text}
              </span>
              {i < 3 && <span className="text-white/20">|</span>}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
}