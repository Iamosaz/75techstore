// src/components/hero/HeroPromo.jsx
import React from "react";
import banner from "../../assets/iPhone-17.png";

const HeroPromo = () => {
  return (
    <section className="relative w-full h-full min-h-[400px] bg-brand-dark text-white flex flex-col items-center justify-center overflow-hidden">

      {/* Background image */}
      <img
        src={banner}
        alt="Holiday Sale Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      {/* Decorative overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-16 max-w-4xl mx-auto">
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold 
                       bg-gradient-to-r from-brand-blue to-brand-red 
                       bg-clip-text text-transparent drop-shadow-lg leading-tight">
          Mega Good Deals
        </h2>

        <p className="mt-4 sm:mt-6 max-w-xs sm:max-w-sm md:max-w-xl 
                      text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
          Save up to 15% on quality worthy gadgets - Laptops, Phones, Accessories & more.
        </p>

        {/* ✅ FIXED - removed stray 's' */}
        <a
          href="/shop"
          className="mt-6 sm:mt-8 inline-block bg-yellow-500 hover:bg-yellow-600 
                     text-gray-900 font-bold px-6 sm:px-8 py-2.5 sm:py-3 
                     rounded-full hover:scale-105 transition-all duration-300 
                     shadow-lg hover:shadow-yellow-500/50 text-sm sm:text-base"
        >
          Explore Offers
        </a>
      </div>
    </section>
  );
};

export default HeroPromo;