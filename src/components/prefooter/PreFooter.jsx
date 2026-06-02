import React, { useState } from 'react'
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
} from 'react-icons/fa'

const PreFooter = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000) // Reset after 3 seconds
    }
  }

  // Footer links data
  const footerLinks = {
    shop: [
      { label: 'Smartphones', href: '/shop/smartphones' },
      { label: 'Laptops & Computers', href: '/shop/laptops' },
      { label: 'Tablets', href: '/shop/tablets' },
      { label: 'Accessories', href: '/shop/accessories' },
      { label: 'Wearables', href: '/shop/wearables' },
    ],
    services: [
      { label: 'Device Repairs', href: '/services/repairs' },
      { label: 'Tech Support', href: '/services/support' },
      { label: 'Trade-In Program', href: '/services/trade-in' },
      { label: 'Extended Warranty', href: '/services/warranty' },
      { label: 'Installation Service', href: '/services/installation' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Press Kit', href: '/press' },
    ],
    support: [
      { label: 'FAQs', href: '/help/faq' },
      { label: 'Shipping Info', href: '/help/shipping' },
      { label: 'Returns & Refunds', href: '/help/returns' },
      { label: 'Track Order', href: '/help/track' },
      { label: 'Warranty', href: '/help/warranty' },
    ],
  }

  // Social media links
  const socialLinks = [
    { icon: <FaFacebook size={20} />, href: 'https://facebook.com/75techstore', label: 'Facebook' },
    { icon: <FaTwitter size={20} />, href: 'https://twitter.com/75techstore', label: 'Twitter' },
    { icon: <FaInstagram size={20} />, href: 'https://instagram.com/75techstore', label: 'Instagram' },
    { icon: <FaLinkedin size={20} />, href: 'https://linkedin.com/company/75techstore', label: 'LinkedIn' },
    { icon: <FaYoutube size={20} />, href: 'https://youtube.com/@75techstore', label: 'YouTube' },
  ]

  return (
    <>
      {/* ════════════════════════════════════════════════════════════ */}
      {/* NEWSLETTER + LINKS SECTION (PREFOOTER) */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* ─── MAIN GRID: LEFT (LINKS) + RIGHT (NEWSLETTER) ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16">

            {/* ════════════════════════════════════════ */}
            {/* LEFT SIDE: FOOTER LINKS (2 COLS) */}
            {/* ════════════════════════════════════════ */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

                {/* Shop Column */}
                <div>
                  <h4 className="text-lg font-bold mb-5 text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full" />
                    Shop
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.shop.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-blue-400 transition-colors 
                            duration-300 text-sm font-medium flex items-center gap-2 group"
                        >
                          <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 
                            transition-all duration-300" />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Services Column */}
                <div>
                  <h4 className="text-lg font-bold mb-5 text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-orange-500 rounded-full" />
                    Services
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.services.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-orange-400 transition-colors 
                            duration-300 text-sm font-medium flex items-center gap-2 group"
                        >
                          <span className="w-0 group-hover:w-2 h-0.5 bg-orange-400 
                            transition-all duration-300" />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company Column */}
                <div>
                  <h4 className="text-lg font-bold mb-5 text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-green-500 rounded-full" />
                    Company
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-green-400 transition-colors 
                            duration-300 text-sm font-medium flex items-center gap-2 group"
                        >
                          <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 
                            transition-all duration-300" />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support Column */}
                <div>
                  <h4 className="text-lg font-bold mb-5 text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-purple-500 rounded-full" />
                    Support
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.support.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-purple-400 transition-colors 
                            duration-300 text-sm font-medium flex items-center gap-2 group"
                        >
                          <span className="w-0 group-hover:w-2 h-0.5 bg-purple-400 
                            transition-all duration-300" />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>

            {/* ════════════════════════════════════════ */}
            {/* RIGHT SIDE: NEWSLETTER SIGNUP */}
            {/* ════════════════════════════════════════ */}
            <div className="lg:col-span-1">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-blue-500 rounded-3xl blur-3xl 
                opacity-20 pointer-events-none -z-10" />

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 
                backdrop-blur-md hover:border-blue-500/30 transition-all duration-300">

                {/* Title */}
                <h4 className="text-2xl font-bold mb-2 text-white">
                  Stay Updated
                </h4>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  Get exclusive deals, tech tips, and early access to new products.
                </p>

                {/* Newsletter Form */}
                <form onSubmit={handleSubscribe} className="mb-6">
                  <div className="flex flex-col gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border 
                        border-white/20 text-white placeholder-gray-400 
                        focus:outline-none focus:border-blue-500 focus:bg-white/15 
                        transition-all duration-300"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
                        hover:from-blue-600 hover:to-blue-700 text-white font-bold 
                        py-3 rounded-lg transition-all duration-300 flex items-center 
                        justify-center gap-2 shadow-lg hover:shadow-blue-500/50 group"
                    >
                      Subscribe
                      <FaArrowRight className="group-hover:translate-x-1 
                        transition-transform duration-300" size={16} />
                    </button>
                  </div>
                </form>

                {/* Success Message */}
                {subscribed && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg 
                    p-3 text-green-200 text-sm text-center mb-6 animate-pulse">
                    ✓ Thanks for subscribing!
                  </div>
                )}

                {/* Privacy Notice */}
                <p className="text-xs text-gray-400 text-center">
                  We respect your privacy. Unsubscribe anytime.
                </p>

              </div>

            </div>

          </div>

          {/* ════════════════════════════════════════ */}
          {/* DIVIDER */}
          {/* ════════════════════════════════════════ */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-12" />

          {/* ════════════════════════════════════════ */}
          {/* BOTTOM: CONTACT INFO + SOCIAL ICONS */}
          {/* ════════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

            {/* Contact Info */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center 
                  justify-center group-hover:bg-blue-500/30 transition-all duration-300">
                  <FaPhone size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Call Us</p>
                  <p className="text-white font-semibold">+234 800 000 7500</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center 
                  justify-center group-hover:bg-orange-500/30 transition-all duration-300">
                  <FaEnvelope size={18} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email Us</p>
                  <p className="text-white font-semibold">support@75techstore.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center 
                  justify-center group-hover:bg-green-500/30 transition-all duration-300">
                  <FaMapMarkerAlt size={18} className="text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Visit Us</p>
                  <p className="text-white font-semibold">Lagos, Nigeria</p>
                </div>
              </div>
            </div>

            {/* Brand/Info Center */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">75TechStore</h3>
              <p className="text-gray-300 text-sm mb-4">
                Your trusted tech partner for quality gadgets, expert repairs & digital services.
              </p>
              <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 
                px-4 py-1 rounded-full text-xs font-bold text-white">
                Nigeria's #1 Tech Solution Destination 
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center md:justify-end gap-4">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  className="w-12 h-12 bg-white/10 border border-white/20 rounded-lg 
                    flex items-center justify-center text-white 
                    hover:bg-blue-500 hover:border-blue-500 hover:scale-110 
                    transition-all duration-300 group"
                >
                  <span className="group-hover:-rotate-6 transition-transform duration-300">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>

          </div>

        </div>
      </section>
    </>
  )
}

export default PreFooter