import React from 'react'
import { Link } from 'react-router-dom'
import banner from '../../assets/75logo.png'
import { FaStar, FaTools, FaTag } from 'react-icons/fa'

const TechCard75 = () => {
  const perks = [
    { icon: <FaStar size={14} />, text: "5% Cashback on every purchase" },
    { icon: <FaTools size={14} />, text: "Priority repair support" },
    { icon: <FaTag size={14} />, text: "Exclusive member discounts" },
  ]

  return (
    <section className="max-w-6xl mx-auto my-20 px-6">
      <div className="relative bg-gradient-to-r from-[#0b1b3f] via-brand-blue 
        to-[#b8a58f] text-white rounded-3xl flex flex-col md:flex-row 
        items-center justify-between overflow-hidden shadow-2xl">

        {/* GLOW EFFECT */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400/20 
          rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-400/20 
          rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        {/* LEFT TEXT SECTION */}
        <div className="p-10 md:w-1/2 text-center md:text-left relative z-10">

          {/* BADGE */}
          <span className="inline-block bg-yellow-400 text-black text-xs 
            font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
             Members Only
          </span>

          {/* TITLE */}
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
            Become a{" "}
            <span className="text-brand-blue">7</span>
            <span className="text-red-400">5</span>
            <span className="bg-gradient-to-r from-white via-blue-200 
              to-orange-300 bg-clip-text text-transparent">
              Techstore
            </span>{" "}
            <span className="text-yellow-300">Member</span>
          </h2>

          {/* DESCRIPTION */}
          <p className="text-white/80 mb-6 text-sm leading-relaxed">
            Join thousands of happy customers enjoying exclusive rewards,
            priority service, and amazing deals every day.
          </p>

          {/* PERKS LIST */}
          <ul className="flex flex-col gap-2 mb-8">
            {perks.map((perk, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-white/90">
                <span className="bg-yellow-400 text-black p-1 rounded-full">
                  {perk.icon}
                </span>
                {perk.text}
              </li>
            ))}
          </ul>

          {/* CTA BUTTONS */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link
              to="/signup"
              className="inline-block bg-yellow-400 text-black font-bold 
                px-6 py-3 rounded-xl hover:bg-yellow-300 transition-all 
                duration-300 shadow-lg hover:shadow-yellow-400/40"
            >
              Join Now →
            </Link>
            <Link
              to="/about"
              className="inline-block border border-white/40 text-white 
                font-semibold px-6 py-3 rounded-xl hover:bg-white/10 
                transition-all duration-300"
            >
              Learn More
            </Link>
          </div>

        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="md:w-1/2 flex justify-center md:justify-end relative z-10 p-6">
          <div className="relative">
            {/* GLOW BEHIND IMAGE */}
            <div className="absolute inset-0 bg-blue-400/30 rounded-full 
              blur-2xl scale-75 pointer-events-none" />
            <img
              src={banner}
              alt="75TechStore Member Rewards"
              className="relative w-full md:w-[380px] object-contain 
                drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

      </div>
    </section>
  )
}

export default TechCard75