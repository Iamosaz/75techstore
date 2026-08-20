// src/pages/Home.jsx
import React from "react";
import { FaLaptop, FaTools, FaHome, FaRobot } from "react-icons/fa";
import HeroCarousel from "../components/hero/HeroCarousel";
import { Link } from "react-router-dom";
import TechCard75 from "../components/hero/TechCard75";
import Category from "../components/category/Category";
import Category2 from "../components/category/Category2";
import Services from "../components/Services/Services";
import OurProducts from "../components/ourproducts/OurProducts";
import LogoBrand from "../components/brandslogo/LogoBrand";
import TopProduct from "../components/topproducts/TopProduct";
import SwapDealLog from "../components/swapdealslog/SwapDealLog";
import AboutSection from "../components/about/AboutsSection";
import PreFooter from "../components/prefooter/PreFooter";
import { FiTool } from "react-icons/fi";

const quickServices = [
  { icon: <FaLaptop size={22} />, label: "Buy Gadgets", path: "/shop" },
  { icon: <FaTools size={22} />, label: "Repairs", path: "/repairs" },
  { icon: <FiTool size={22} />, label: "Request Engineer", path: "/requestengineer" },
  { icon: <FaRobot size={22} />, label: "Digital Services", path: "/digital-services" },
];

const Home = () => {
  return (
    <main className="font-sans text-gray-800">

      {/* ── HERO CAROUSEL ── */}
      <HeroCarousel />

      {/* ── QUICK SERVICE CARDS ── */}
      <section className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {quickServices.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="flex flex-col items-center justify-center gap-2
                           bg-gray-50 hover:bg-blue-50 border border-gray-200
                           hover:border-blue-400 rounded-xl p-3 sm:p-4
                           shadow-sm hover:shadow-md transition-all duration-300
                           group"
              >
                <div className="text-blue-600 group-hover:scale-110
                                transition-transform duration-300">
                  {item.icon}
                </div>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm
                               text-center group-hover:text-blue-600 transition-colors">
                  {item.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAGE SECTIONS ── */}
      <Category />
      <Category2 />
      <Services />
      <OurProducts />
      <TechCard75 />
      <AboutSection />
      <TopProduct />
      <SwapDealLog />
      <LogoBrand />
      <PreFooter />

    </main>
  );
};

export default Home;