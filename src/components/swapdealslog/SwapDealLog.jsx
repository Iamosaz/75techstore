
import React from 'react'
import { Link } from 'react-router-dom'
import { FaMobileAlt, FaExchangeAlt, FaCheckCircle, FaArrowRight } from 'react-icons/fa'

const SwapDealLog = () => {
  const steps = [
    {
      step: "01",
      title: "Submit Your Device",
      desc: "Tell us what device you have and its current condition.",
      icon: <FaMobileAlt size={20} />,
    },
    {
      step: "02",
      title: "Get a Valuation",
      desc: "We assess your device and give you the best trade-in value.",
      icon: <FaExchangeAlt size={20} />,
    },
    {
      step: "03",
      title: "Swap & Save",
      desc: "Use your credit towards any new device in our store.",
      icon: <FaCheckCircle size={20} />,
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-[#0b1b3f] to-gray-900">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── HEADER ── */}
        <div className="text-center mb-14">
          <span className="inline-block bg-orange-500 text-white text-xs 
            font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
             Swap Deals
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Upgrade Your Device{" "}
            <span className="text-orange-400">Without</span> Breaking the Bank
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
            Trade in your old device and get amazing value towards your next 
            purchase. It's fast, easy, and totally worth it.
          </p>
        </div>

        {/* ── MAIN CARD ── */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md 
          rounded-3xl overflow-hidden shadow-2xl">

          <div className="grid md:grid-cols-2 gap-0">

            {/* LEFT: INFO */}
            <div className="p-10 flex flex-col justify-between">

              {/* WHAT IS SWAP DEAL */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-3">
                  What is a Swap Deal? 
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  A Swap Deal allows you to exchange your current device — 
                  whether it's a phone, laptop, or tablet — for a brand new or 
                  refurbished one at 75TechStore. We assess your device's value 
                  and give you credit to use instantly. No stress, no hassle!
                </p>
              </div>

              {/* BENEFITS */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-4">
                  Why Swap with Us? 
                </h3>
                <ul className="flex flex-col gap-3">
                  {[
                    "Get the best trade-in value for your device",
                    "Instant credit — use it the same day",
                    "All brands accepted (iPhone, Samsung, etc.)",
                    "No hidden fees or charges",
                    "Trusted by 500+ happy customers",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <FaCheckCircle className="text-orange-400 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA BUTTON */}
              <Link
                to="/swap-deals"
                className="inline-flex items-center gap-2 bg-orange-500 
                  hover:bg-orange-400 text-white font-bold px-8 py-4 
                  rounded-2xl transition-all duration-300 shadow-lg 
                  hover:shadow-orange-500/40 w-fit group"
              >
                Start Your Swap
                <FaArrowRight 
                  className="group-hover:translate-x-1 transition-transform duration-300" 
                />
              </Link>

            </div>

            {/* RIGHT: HOW IT WORKS */}
            <div className="bg-white/5 border-l border-white/10 p-10">
              <h3 className="text-xl font-bold text-white mb-8">
                How It Works 
              </h3>

              <div className="flex flex-col gap-8">
                {steps.map((item, i) => (
                  <div key={i} className="flex gap-5 group">

                    {/* STEP NUMBER + ICON */}
                    <div className="flex flex-col items-center">
                      <div className="bg-orange-500 text-white w-12 h-12 
                        rounded-2xl flex items-center justify-center 
                        shadow-lg group-hover:scale-110 transition-transform 
                        duration-300 shrink-0">
                        {item.icon}
                      </div>
                      {i < steps.length - 1 && (
                        <div className="w-0.5 h-8 bg-white/10 mt-2" />
                      )}
                    </div>

                    {/* STEP INFO */}
                    <div className="pt-2">
                      <span className="text-orange-400 text-xs font-bold 
                        uppercase tracking-widest">
                        Step {item.step}
                      </span>
                      <h4 className="text-white font-bold text-base mt-0.5 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                  </div>
                ))}
              </div>

              {/* BOTTOM NOTE */}
              <div className="mt-10 bg-orange-500/10 border border-orange-500/20 
                rounded-2xl p-4">
                <p className="text-orange-300 text-xs leading-relaxed text-center">
                   <span className="font-bold">Pro Tip:</span> Devices in good 
                  condition get up to <span className="font-bold">70% of their 
                  market value</span> as trade-in credit!
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM MINI CTA */}
        <div className="text-center mt-10">
          <p className="text-gray-500 text-sm">
            Want to know more?{" "}
            <Link
              to="/swap-deals"
              className="text-orange-400 font-semibold hover:text-orange-300 
                underline underline-offset-4 transition"
            >
              Visit our full Swap Deals page →
            </Link>
          </p>
        </div>

      </div>
    </section>
  )
}

export default SwapDealLog