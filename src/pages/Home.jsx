// src/pages/Home.jsx
import React from "react";
import { FaLaptop, FaTools, FaHome, FaRobot } from "react-icons/fa";
import HeroCarousel from "../components/hero/HeroCarousel";  // rotating hero section //
// import SplashDeals from "../components/deals/SplashDeals";
import { Link } from "react-router-dom";
// import DigitalServicePreview from "../components/hero/DigitalServicePreview";
import TechCard75 from "../components/hero/TechCard75";
import OurMembers from "../components/hero/OurMembers";
import Category from "../components/category/Category";
import Category2 from "../components/category/Category2";
import Services from "../components/Services/Services";
import OurProducts from "../components/ourproducts/OurProducts";
import LogoBrand from "../components/brandslogo/LogoBrand";

const Home = () => {
  return ( 
    <main className="font-sans text-gray-800">
      {/* ───────────── HERO SECTION ───────────── */}
      <HeroCarousel />
    
      {/* ───────────── QUICK SERVICE CARDS ───────────── */}
      <section className="max-w-3xl mx-auto py-10 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <FaLaptop size={18} />, label: "Buy Gadgets", path:"/shop" },
          { icon: <FaTools size={18} />, label: "Repairs", Path:"/repairs" },
          { icon: <FaHome size={18} />, label: "Request Engineer", path:"/requestengineer"},
          { icon: <FaRobot size={18} />, label: "Digital Services", path:"/digital-services"},
        ].map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className="bg-white border rounded-lg p-2 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="text-brand-blue flex justify-center mb-2">
              {item.icon}
            </div>
            <p className="font-semibold">{item.label}</p>
          </Link>
        ))}
      </section>
        
         <Category />
         <Category2 />
         <Services />
         <OurProducts />
         {/* <SplashDeals /> */}
         {/* <DigitalServicePreview /> */}
         <TechCard75 />
         <LogoBrand />
         {/* <OurMembers /> */}
      {/* ───────────── WHY CHOOSE US ───────────── */}
      <section className="max-w-5xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-brand-blue mb-10">
          Why Choose 75TechStore?
        </h2>
        <ul className="grid md:grid-cols-3 gap-8 text-left">
          <li className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold mb-2 text-brand-blue">⚡ Fast Delivery</h3>
            <p>
              Nationwide logistics ensuring your gadgets arrive safely and swiftly.
            </p>
          </li>
          <li className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold mb-2 text-brand-blue">🛡️ Warranty Coverage</h3>
            <p>
              Every product and service includes dependable after sales warranty.
            </p>
          </li>
          <li className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold mb-2 text-brand-blue">🤝 Trusted Experts</h3>
            <p>
              5 years of experience serving startups and tech enthusiasts nationwide.
            </p>
          </li>
        </ul>
      </section>

      {/* ───────────── NEWSLETTER ───────────── */}
      <section className="bg-gradient-to-br from brand-dark via-gray-700 to-brand-blue-400 text-white py-14 text-center px-6">
        <h2 className="text-3xl font-bold mb-3">Stay Up to Date</h2>
        <p className="text-white/80 mb-6">
          Get product deals, tech tips, and early access to our sales.
        </p>

        <form className="flex justify-center flex-wrap gap-2 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 rounded-md w-64 text-black focus:outline-none"
          />
          <button type="submit" className="btn-accent">
            Subscribe
          </button>
        </form>
      </section>
    </main>
  );
};

export default Home;