// src/components/hero/HeroWelcome.jsx
import React from 'react';
import { motion } from "framer-motion";

const HeroWelcome = () => {
  return (
    <section className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white overflow-y-auto">

      {/* ✅ Centers content vertically on all screens */}
      <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row
                      items-center justify-center
                      gap-4 md:gap-10 px-4 sm:px-6
                      py-4 sm:py-6 md:py-0">

        {/* ── LEFT: Text Content ── */}
        <motion.div
          className="flex-1 text-center md:text-left space-y-3 sm:space-y-4 w-full"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <motion.h1 className="font-bold leading-tight">
            <span className="block text-white text-base sm:text-lg md:text-xl font-medium mb-1">
              Welcome to
            </span>
            <span className="text-blue-400 text-3xl sm:text-4xl md:text-5xl lg:text-7xl">7</span>
            <span className="text-red-500 text-3xl sm:text-4xl md:text-5xl lg:text-7xl">5</span>
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl bg-gradient-to-r from-blue-400 via-white to-orange-400 bg-clip-text text-transparent">
              TechStore
            </span>
          </motion.h1>

          <motion.p
            className="max-w-sm mx-auto md:mx-0 text-xs sm:text-sm md:text-base text-white/80 leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Buy, repair, and upgrade your tech with trusted quality and
            lightning-fast service.
          </motion.p>

          <motion.div
            className="flex justify-center md:justify-start gap-2 sm:gap-3 flex-wrap"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <a
              href="/shop"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold
                         px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all
                         duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm"
            >
              Shop Now
            </a>
            <a
              href="/repairs"
              className="border-2 border-white text-white hover:bg-white
                         hover:text-blue-700 font-bold px-4 sm:px-6 py-2 sm:py-2.5
                         rounded-full transition-all duration-300 text-xs sm:text-sm"
            >
              Book Repair
            </a>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Weekly Deals Card ── */}
        <motion.div
          className="flex-1 w-full md:max-w-md bg-white text-gray-800
                     rounded-2xl shadow-2xl flex flex-col
                     max-h-[42vh] sm:max-h-[45vh] md:max-h-[60vh] lg:max-h-[65vh]"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          {/* ✅ Sticky Header */}
          <div className="bg-blue-600 px-4 sm:px-5 py-2.5 sm:py-3 rounded-t-2xl flex-shrink-0">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
              🔥 Weekly Deals
            </h3>
            <p className="text-blue-200 text-[10px] sm:text-xs mt-0.5">
              Scroll to see all deals ↓
            </p>
          </div>

          {/* ✅ Scrollable Body */}
          <div className="overflow-y-auto flex-1 p-3 sm:p-4 space-y-2 sm:space-y-3">
            {[
              {
                title: "Laptop Good Deals - Up to 30% Off",
                detail: "Until Sunday midnight",
                icon: "💻",
                badge: "30% OFF"
              },
              {
                title: "Phone Screen Repair Bonus",
                detail: "Samsung & iPhones",
                icon: "📱",
                badge: "BONUS"
              },
              {
                title: "Accessory Bundles - 3 for 2",
                detail: "Cables • Chargers • Headsets",
                icon: "🎧",
                badge: "3 FOR 2"
              },
              {
                title: "Gaming Console Deals",
                detail: "PS5, Xbox & Nintendo Switch",
                icon: "🎮",
                badge: "HOT"
              },
              {
                title: "Smart Watch Collection",
                detail: "Apple Watch & Samsung Galaxy Watch",
                icon: "⌚",
                badge: "NEW"
              },
            ].map((offer, i) => (
              <motion.div
                key={i}
                className="border border-gray-100 bg-gray-50 rounded-xl
                           p-2.5 sm:p-3 hover:shadow-md hover:border-blue-200
                           transition-all duration-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl flex-shrink-0">{offer.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-[11px] sm:text-xs leading-tight">
                      {offer.title}
                    </p>
                    <span className="text-[10px] sm:text-xs text-gray-500 block">
                      {offer.detail}
                    </span>
                  </div>
                  <span className="bg-red-100 text-red-600 text-[9px] sm:text-xs font-bold
                                   px-1.5 py-0.5 rounded-full flex-shrink-0">
                    {offer.badge}
                  </span>
                </div>
              </motion.div>
            ))}

            <p className="text-center text-[10px] sm:text-xs text-gray-400 py-1">
              🎉 That's all our current deals!
            </p>
          </div>

          {/* ✅ Sticky Footer - ALWAYS visible above dots */}
          <div className="p-3 sm:p-4 border-t border-gray-100 flex-shrink-0
                          rounded-b-2xl bg-white">
            <a
              href="/shop"
              className="block w-full text-center bg-blue-600 hover:bg-blue-700
                         text-white font-bold py-2 sm:py-2.5 rounded-xl
                         transition-all duration-300 hover:scale-105
                         shadow-lg text-xs sm:text-sm"
            >
              View All Offers →
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroWelcome;