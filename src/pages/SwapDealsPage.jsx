
import React from 'react'
import { Link } from 'react-router-dom'
import { FaMobileAlt, FaExchangeAlt, FaCheckCircle, FaWhatsapp } from 'react-icons/fa'

const SwapDeals = () => {
  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* ── HERO ── */}
      <section className="py-24 px-6 text-center bg-gradient-to-b 
        from-[#0b1b3f] to-gray-950">
        <span className="inline-block bg-orange-500 text-white text-xs 
          font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
          🔄 Swap Deals
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Trade In. Upgrade.{" "}
          <span className="text-orange-400">Save Big.</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-10">
          Got an old device gathering dust? Exchange it for something 
          brand new at 75TechStore and pay less!
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-orange-500 
            hover:bg-orange-400 text-white font-bold px-10 py-4 
            rounded-2xl transition-all shadow-lg hover:shadow-orange-500/40"
        >
          <FaWhatsapp size={18} />
          Contact Us to Start
        </Link>
      </section>

      {/* ── WHAT WE ACCEPT ── */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          What We Accept 📱💻
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["iPhones", "Samsung", "MacBooks", "iPads", 
            "Laptops", "Tablets", "Smartwatches", "Gaming Consoles"
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 
              rounded-2xl p-4 text-center hover:border-orange-500/50 
              hover:bg-orange-500/5 transition-all duration-300">
              <p className="text-white font-semibold text-sm">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Frequently Asked Questions ❓
        </h2>
        <div className="flex flex-col gap-4">
          {[
            {
              q: "What condition does my device need to be in?",
              a: "We accept devices in all conditions — working, cracked screen, or even faulty. The better the condition, the higher the value!"
            },
            {
              q: "How long does the swap process take?",
              a: "The assessment takes less than 30 minutes. You can walk out with your new device the same day!"
            },
            {
              q: "Can I add cash to the trade-in value?",
              a: "Absolutely! If your trade-in value doesn't cover the full price, you can top up with cash or transfer."
            },
            {
              q: "Do you offer swap deals online?",
              a: "Yes! Contact us via WhatsApp and we'll guide you through the process remotely."
            },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 
              rounded-2xl p-6 hover:border-orange-500/30 transition-all">
              <h4 className="text-white font-bold mb-2">❓ {item.q}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">💬 {item.a}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}

export default SwapDeals