// src/pages/SeasonalShop.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSeasonalTheme } from "../context/SeasonalContext";
import { getTheme } from "../utils/seasonalThemes";

export default function SeasonalShop() {
  const { event } = useSeasonalTheme();

  /* ── resolve theme ── */
  const themeId = event?.theme || "";
  const theme = getTheme(themeId);

  /* ── merge admin overrides ── */
  const title = event?.customTitle || theme.title;
  const subtitle = event?.customSubtitle || theme.subtitle;
  const image = event?.customImage || theme.image;
  const discount =
    event?.showBadge && event?.customDiscount
      ? event.customDiscount
      : null;

  /* ── placeholder products ── */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts([
        { id: 1, name: "Wireless Earbuds Pro", price: 29999, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400" },
        { id: 2, name: 'Smart TV 55"', price: 189999, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400" },
        { id: 3, name: "Gaming Laptop", price: 459999, image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400" },
        { id: 4, name: "Bluetooth Speaker", price: 14999, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400" },
        { id: 5, name: "Smartwatch Ultra", price: 79999, image: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400" },
        { id: 6, name: "Power Bank 20000mAh", price: 9999, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400" },
      ]);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [themeId]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(price);

  /* ── no event ── */
  if (!event) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white gap-6 px-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl flex items-center justify-center">
          <img src="https://unpkg.com/lucide-static@latest/icons/calendar-x.svg" alt="" className="w-8 h-8 opacity-40" style={{ filter: "brightness(0) invert(1)" }} />
        </div>
        <h1 className="text-2xl font-light text-white/60">No active seasonal event</h1>
        <p className="text-white/30 text-sm max-w-md text-center">Check back soon — seasonal deals will appear here when an event is active.</p>
        <Link to="/shop" className="mt-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full text-sm font-semibold transition-colors">
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* ═══ HERO ═══ */}
      <section className="relative w-full h-[50vh] min-h-[320px] max-h-[480px] overflow-hidden">
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.overlay}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        {discount && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
            <span className="bg-red-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg ring-2 ring-red-500/30">
              {discount} OFF
            </span>
          </motion.div>
        )}

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 gap-4">
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl ${theme.glass} flex items-center justify-center border border-white/10`}>
            <img src={theme.icon} alt="" className="w-8 h-8 sm:w-10 sm:h-10"
              style={{ filter: `brightness(0) saturate(100%) invert(1) drop-shadow(0 0 8px ${theme.iconColor}) drop-shadow(0 0 20px ${theme.iconColor}66)` }}
              onError={(e) => { e.target.style.display = "none"; }} />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="text-white/60 text-sm sm:text-base font-light max-w-lg">
              {subtitle}
            </motion.p>
          )}
        </div>
      </section>

      {/* ═══ PRODUCTS ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">{title} Deals</h2>
            <p className="text-white/40 text-sm mt-1">Handpicked products for this season</p>
          </div>
          <Link to="/shop" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
            View all products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {products.map((product) => (
                <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -4 }} className="group">
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
                      {discount && (
                        <div className="absolute top-2.5 right-2.5 z-10">
                          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{discount} OFF</span>
                        </div>
                      )}
                      <div className="aspect-square overflow-hidden bg-zinc-900">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                      <div className="p-3.5 sm:p-4 space-y-1.5">
                        <h3 className="text-sm font-medium text-white/90 truncate">{product.name}</h3>
                        <p className="text-sm font-bold text-white">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className={`relative overflow-hidden rounded-3xl border border-white/10 ${theme.glass}`}>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-10">
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-semibold">Don't miss out</h3>
              <p className="text-white/50 text-sm mt-1.5">Explore our full catalog for more amazing deals.</p>
            </div>
            <Link to="/shop"
              className={`px-8 py-3.5 rounded-full font-bold text-sm ${theme.accent} shadow-lg hover:shadow-xl transition-all active:scale-[0.97] whitespace-nowrap flex items-center gap-2`}>
              Browse All Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}