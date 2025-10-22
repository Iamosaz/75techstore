// src/components/hero/HeroBrandNew.jsx
import React from "react";
import banner from "../../assets/brandnew.png"; // replace with your actual image


const Brandnewgadget = () => {
  return (
    <section className="relative w-full h-screen bg-brand-dark text-white flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src={banner}
        alt="Brand New Gadgets Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-brand-blue via-brand-red to-orange bg-clip-text text-transparent drop-shadow-lg">
          Discover Brand New Gadgets ✨
        </h2>
        <p className="mt-8 max-w-xl text-lg text-white/90">
          Explore the latest laptops, smartphones and accessories fresh from the factory.
        </p>
        <a
          href="/shop/all"
          className="btn-accent mt-10 hover:scale-105 transition-transform duration-300"
        >
          Shop Now
        </a>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    </section>
  );
};

export default Brandnewgadget
