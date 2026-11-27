// src/components/hero/HeroWelcome.jsx
import React from 'react';
import { motion } from "framer-motion";
import { services as defaultServices } from "../../data/services";

// `services` can be passed in (e.g. fetched from your API) or it falls
// back to the curated list in src/data/services.js. The slide stays
// dynamic either way — edit the data, not the markup.
const HeroWelcome = ({ services: servicesProp }) => {
  const services =
    servicesProp && servicesProp.length ? servicesProp : defaultServices;

  return (
    <section className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white overflow-y-auto">

      {/* ✅ Centered single column keeps clear of your carousel arrows */}
      <div className="max-w-6xl mx-auto h-full flex flex-col items-center justify-center text-center
                      px-6 sm:px-10 md:px-16 py-10 md:py-0">

        {/* Welcome heading */}
        <motion.h1
          className="font-bold leading-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <span className="block text-white/80 text-base sm:text-lg md:text-xl font-medium mb-2 tracking-wide">
            Welcome to
          </span>
          <div className="flex items-baseline justify-center flex-wrap gap-x-1">
            <span className="text-blue-400 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black">7</span>
            <span className="text-red-500 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black">5</span>
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-400 via-white to-orange-400 bg-clip-text text-transparent">
              TechStore
            </span>
          </div>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="mt-4 max-w-xl text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Build, buy, repair, and upgrade your tech with trusted, quality and fast service from custom apps to the latest gadgets.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-6 flex justify-center gap-3 sm:gap-4 flex-wrap"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <a
            href="/shop"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold
                       px-6 sm:px-7 py-3 rounded-full transition-all duration-300
                       hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            Shop Now
          </a>
          <a
            href="/repairs"
            className="border-2 border-white/80 text-white hover:bg-white hover:text-blue-900
                       font-bold px-6 sm:px-7 py-3 rounded-full transition-all duration-300
                       text-sm sm:text-base backdrop-blur-sm"
          >
            Book Repair
          </a>
        </motion.div>

        {/* Services as glassy pills (dynamic from data) */}
        <motion.div
          className="mt-8 sm:mt-10 w-full flex flex-wrap items-center justify-center
                     gap-2.5 sm:gap-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 1 } },
          }}
        >
          {services.map((service) => (
            <motion.a
              key={service.id}
              href={service.href || "#"}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.06, backgroundColor: "rgba(255,255,255,0.18)" }}
              className="flex items-center gap-2 rounded-full border border-white/20
                         bg-white/10 backdrop-blur-sm px-3.5 py-2
                         transition-colors duration-200"
            >
              <img
                src={service.image}
                alt=""
                loading="lazy"
                className="w-6 h-6 rounded-md object-contain"
              />
              <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
                {service.title}
              </span>
            </motion.a>
          ))}
        </motion.div>

        {/* View all services */}
        <motion.a
          href="/services"
          className="mt-6 text-xs sm:text-sm text-blue-300 hover:text-white
                     transition-colors duration-200 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          View all services →
        </motion.a>

      </div>
    </section>
  );
};

export default HeroWelcome;