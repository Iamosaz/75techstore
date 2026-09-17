// src/pages/SeasonalShop.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useSeasonalTheme } from "../context/SeasonalContext";
import { useCart } from "../context/CartContext";
import { getTheme } from "../utils/seasonalThemes";

export default function SeasonalShop() {
  const { event, country } = useSeasonalTheme();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("discount");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedId, setAddedId] = useState(null);

  const theme = useMemo(() => {
    return event ? getTheme(event.theme) : getTheme("default");
  }, [event]);

  const displayImage = event?.customImage || theme.image;
  const displayTitle = event?.customTitle || theme.title;
  const displaySubtitle = event?.customSubtitle || theme.subtitle;
  const displayDiscount = event?.customDiscount || theme.discount || "50%";

  // ⏳ Urgency Timer
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

  // 📦 Fetch gadgets matching current active campaign
  useEffect(() => {
    async function fetchSeasonalGadgets() {
      try {
        setLoading(true);
        const res = await fetch(`/api/seasonal-products?season=${event?.theme || "all"}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load seasonal devices:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSeasonalGadgets();
  }, [event?.theme]);

  // Extract Categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["all", ...cats];
  }, [products]);

  // Filter & Search
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case "discount":
        result.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case "price-low":
        result.sort((a, b) => a.dealPrice - b.dealPrice);
        break;
      case "price-high":
        result.sort((a, b) => b.dealPrice - a.dealPrice);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.dealPrice,
      originalPrice: product.originalPrice,
      image: product.images?.[0],
      category: product.category,
      quantity: 1,
    });

    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ── Banner ── */}
      <div className="relative h-[280px] sm:h-[340px] md:h-[400px] overflow-hidden">
        <img src={displayImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.overlay}`} />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
          <span className={`${theme.accent} inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-3 shadow-lg`}>
             {theme.badge} 
          </span>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">
            {displayTitle}
          </h1>

          <p className="text-sm sm:text-lg text-yellow-200 font-bold mb-3 drop-shadow">
            {displaySubtitle}
          </p>

          <div className="bg-black/50 backdrop-blur-md px-5 py-2 rounded-xl border border-white/10 inline-flex items-center gap-3">
            <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold">⚡ Ends In</span>
            <span className="text-lg sm:text-xl font-mono font-black text-yellow-300 tabular-nums">
              {countdown}
            </span>
          </div>

          <div className="absolute top-4 right-4">
            <span className="bg-black/40 backdrop-blur-md text-white/70 text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/10">
              📍 {country}
            </span>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Search uploaded gadgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 px-3.5 py-2 text-sm bg-gray-100 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
              <span className="text-xs text-gray-500 font-semibold">
                {filteredProducts.length} devices available
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-gray-100 border rounded-lg px-3 py-2 font-bold outline-none"
              >
                <option value="discount">Biggest Discount</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="newest">Newest Deals</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  activeCategory === c
                    ? "bg-gray-900 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c === "all" ? " All Deals" : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Gadget Grid ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Fetching real-time deals...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* ✅ Shopper-Friendly clean loading message without developer/admin notices */
          <div className="text-center py-16 bg-white rounded-3xl border p-8 max-w-md mx-auto space-y-5 shadow-sm">
            <p className="text-5xl"></p>
            <h3 className="text-xl font-bold text-gray-900">Campaign Deals Loading Soon!</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We are currently selecting premium devices for this season's offers. Check back soon or visit our main shop to browse existing items.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white font-extrabold px-6 py-3 rounded-xl text-xs transition shadow-md"
            >
              Browse Main Shop →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] sm:text-xs font-black px-2 py-1 rounded-lg shadow">
                      -{product.discountPercentage}%
                    </span>
                    {product.stock <= 5 && (
                      <span className="absolute bottom-2.5 left-2.5 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                        Only {product.stock} left
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">
                      {product.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 mb-2 leading-snug">
                      {product.name}
                    </h3>

                    <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
                      <div>
                        <p className="text-sm sm:text-base font-black text-gray-900">
                          ₦{product.dealPrice?.toLocaleString()}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400 line-through">
                          ₦{product.originalPrice?.toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition ${
                          addedId === product._id
                            ? "bg-green-600 text-white"
                            : "bg-yellow-500 hover:bg-yellow-400 text-black shadow hover:shadow-md"
                        }`}
                      >
                        {addedId === product._id ? "✓ Added" : "+ Cart"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}