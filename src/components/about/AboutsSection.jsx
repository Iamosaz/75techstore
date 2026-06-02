import React from 'react'
import { Link } from 'react-router-dom'
import {
  FaShieldAlt,
  FaTruck,
  FaUndoAlt,
  FaHeadset,
  FaMobileAlt,
  FaTools,
  FaGlobe,
  FaArrowRight,
} from 'react-icons/fa'

const AboutSection = () => {
  const commitments = [
    {
      icon: <FaShieldAlt size={20} />,
      title: "Transparent Pricing",
      desc: "Competitive and honest pricing with no hidden charges.",
      color: "bg-blue-500",
    },
    {
      icon: <FaTruck size={20} />,
      title: "Nationwide Delivery",
      desc: "Fast and reliable delivery to every corner of Nigeria.",
      color: "bg-orange-500",
    },
    {
      icon: <FaUndoAlt size={20} />,
      title: "Flexible Returns",
      desc: "Hassle-free return options designed for your peace of mind.",
      color: "bg-green-500",
    },
    {
      icon: <FaHeadset size={20} />,
      title: "Dedicated Support",
      desc: "Our team is always ready to help when you need us most.",
      color: "bg-purple-500",
    },
  ]

  const services = [
    {
      icon: <FaMobileAlt size={18} />,
      label: "Gadgets & Accessories",
    },
    {
      icon: <FaTools size={18} />,
      label: "Device Repairs",
    },
    {
      icon: <FaGlobe size={18} />,
      label: "Digital Services",
    },
  ]

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── TOP GRID ── */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">

          {/* LEFT: TEXT */}
          <div>

            {/* BADGE */}
            <span className="inline-block bg-blue-50 text-blue-600 text-xs 
              font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
              Who We Are
            </span>

            {/* TITLE */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 
              leading-tight mb-6">
              Your All-in-One{" "}
              <span className="text-blue-600">Tech Solution</span>
            </h2>

            {/* DESCRIPTION */}
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              75TechStore is a modern online tech store built to deliver{" "}
              <span className="text-gray-800 font-semibold">quality</span>,{" "}
              <span className="text-gray-800 font-semibold">reliability</span>, and{" "}
              <span className="text-gray-800 font-semibold">convenience</span>. 
              We provide a wide range of gadgets including smartphones, laptops, 
              tablets, accessories, and more all carefully sourced to meet 
              high standards.
            </p>

            <p className="text-gray-500 text-base leading-relaxed mb-8">
              Beyond sales, we go further. From professional device repairs to 
              digital services for individuals and businesses, we are designed 
              to be your complete tech partner.
            </p>

            {/* SERVICE PILLS */}
            <div className="flex flex-wrap gap-3 mb-8">
              {services.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-gray-50 border 
                    border-gray-200 text-gray-700 text-sm font-medium 
                    px-4 py-2 rounded-full"
                >
                  <span className="text-blue-600">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-blue-600 
                hover:bg-blue-700 text-white font-bold px-7 py-3.5 
                rounded-xl transition-all duration-300 shadow-lg 
                hover:shadow-blue-600/30 group"
            >
              Learn More About Us
              <FaArrowRight
                className="group-hover:translate-x-1 transition-transform 
                  duration-300"
              />
            </Link>

          </div>

          {/* RIGHT: STATS CARD */}
          <div className="relative">

            {/* GLOW */}
            <div className="absolute inset-0 bg-blue-100 rounded-3xl 
              blur-3xl opacity-50 pointer-events-none" />

            {/* CARD */}
            <div className="relative bg-gradient-to-br from-[#0b1b3f] 
              to-blue-700 rounded-3xl p-8 text-white shadow-2xl">

              {/* TOP */}
              <p className="text-blue-200 text-sm mb-6 leading-relaxed">
                At 75TechStore, we understand that technology is constantly 
                evolving and so is the way people shop. That's why we 
                continue to improve our platform, services, and support 
                system to better serve you every day.
              </p>

              <div className="w-10 h-0.5 bg-orange-400 mb-6" />

              {/* STATS */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "500+", label: "Happy Customers" },
                  { value: "5+", label: "Years Experience" },
                  { value: "1000+", label: "Products Sold" },
                  { value: "24/7", label: "Customer Support" },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-3xl font-extrabold text-white">
                      {stat.value}
                    </p>
                    <p className="text-blue-200 text-xs mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* BOTTOM BADGE */}
              <div className="mt-8 bg-white/10 border border-white/20 
                rounded-2xl px-4 py-3 text-center">
                <p className="text-yellow-300 font-bold text-sm">
                   Trusted by Nigerians Nationwide
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ── COMMITMENTS GRID ── */}
        <div>

          {/* HEADER */}
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-50 text-orange-500 
              text-xs font-bold px-4 py-1.5 rounded-full uppercase 
              tracking-widest mb-4">
              Why choose 75Techstore?
            </span>
            <h3 className="text-3xl font-extrabold text-gray-900">
              What We're Committed To
            </h3>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commitments.map((item, i) => (
              <div
                key={i}
                className="group bg-gray-50 border border-gray-100 
                  rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 
                  transition-all duration-300 text-center"
              >

                {/* ICON */}
                <div className={`${item.color} text-white w-12 h-12 
                  rounded-2xl flex items-center justify-center mx-auto mb-4 
                  group-hover:scale-110 transition-transform duration-300 
                  shadow-md`}>
                  {item.icon}
                </div>

                {/* TITLE */}
                <h4 className="text-gray-900 font-bold text-base mb-2">
                  {item.title}
                </h4>

                {/* DESC */}
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}

export default AboutSection