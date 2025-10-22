// src/components/hero/HeroPromo.jsx
import React from "react";
import banner from "../../assets/iphone-17.png"


const HeroPromo = () => {
  return (
   <section className="relative w-full h-screen bg-brand-dark text-white flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src={banner}
        alt="Holiday Sale Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-brand-blue to-brand-red bg-clip-text text-transparent drop-shadow-lg">
          Mega Good Deals 🎁
        </h2>

        <p className="mt-8 max-w-xl text-lg text-white/90">
          Save up to 15% on quality worthy gadgets - Laptops, Phones, Accessories & more.
        </p>

        <a
          href="/shop"
          className="btn-accent mt-10 mb-20 hover:scale-105 transition-transform duration-300"
        >
          Explore Offers
        </a>
      </div>

      {/* decorative overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
    </section>
  )
}

export default HeroPromo
