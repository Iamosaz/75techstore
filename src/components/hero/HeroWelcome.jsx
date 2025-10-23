import { motion } from "framer-motion";

import React from 'react'

const HeroWelcome = () => {
  return (
 <section className="w-full bg-gradient-to-br from brand-dark via-gray-700 to-brand-blue-400 text-white py-20 px-6 text-center">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">

        <motion.div
          className="flex-1 text-center md:text-left space-y-6"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 6,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            <span>Welcome to </span>
            <span className="text-brand-blue text-7xl">7</span>
            <span className="text-brand-red text-7xl">5</span>
            <span className="text-7xl bg-gradient-to-r from-[#010e1b] via-brand-blue to-[#d77a33] bg-clip-text text-transparent">
              TechStore
            </span>
          </motion.h1>

          <motion.p
            className="max-w-md mx-auto md:mx-0 text-lg opacity-90"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Buy, repair, and upgrade your tech with trusted quality and
            lightning - fast service.
          </motion.p>

          <motion.div
            className="flex justify-center md:justify-start gap-4 flex-wrap"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <a href="/shop" className="btn-accent">Shop Now</a>
            <a
              href="/repairs"
              className="btn-outline border-white text-white hover:bg-white hover:text-brand-blue"
            >
              Book Repair
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex-1 max-w-md w-full bg-white text-gray-800 rounded-lg shadow-lg p-8"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <h3 className="text-2xl font-bold mb-3 text-brand-blue">Weekly Deals</h3>
          <div className="space-y-4">
            {[
              { title: "Laptop Good Deals - Up to 30% Off", detail: "Until Sunday midnight" },
              { title: "Phone Screen Repair Bonus", detail: "Samsung & iPhones" },
              { title: "Accessory Bundles - 3 for 2", detail: "Cables • Chargers • Headsets" },
            ].map((offer, i) => (
              <motion.div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md" whileHover={{ scale: 1.03 }}>
                <p className="font-semibold mb-1">{offer.title}</p>
                <span className="text-sm text-gray-600">{offer.detail}</span>
              </motion.div>
            ))}
          </div>

          <motion.div className="mt-6 text-center" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}>
            <a href="/shop" className="inline-block btn-primary w-full md:w-auto px-6 text-center">View All Offers</a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroWelcome
