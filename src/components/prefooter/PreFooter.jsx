import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaFacebook, FaTwitter, FaInstagram,
  FaLinkedin, FaYoutube, FaPhone,
  FaEnvelope, FaMapMarkerAlt, FaArrowRight,
  FaCheckCircle, FaExclamationCircle,
} from 'react-icons/fa'

const PreFooter = () => {
  const [email, setEmail]         = useState('')
  const [status, setStatus]       = useState('idle')
  const [statusMsg, setStatusMsg] = useState('')

  /* ── email validation ── */
  const isValidEmail = (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())

  /* ── subscribe handler ── */
  const handleSubscribe = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setStatus('error')
      setStatusMsg('Please enter your email address.')
      return
    }
    if (!isValidEmail(email)) {
      setStatus('error')
      setStatusMsg('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setStatusMsg('')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Handle already subscribed (409) differently
        setStatus('error')
        setStatusMsg(data.message || 'Something went wrong. Try again.')
        setTimeout(() => { setStatus('idle'); setStatusMsg('') }, 4000)
        return
      }

      setStatus('success')
      setStatusMsg(data.message || '🎉 Subscribed! Check your inbox.')
      setEmail('')
      setTimeout(() => { setStatus('idle'); setStatusMsg('') }, 6000)

    } catch (err) {
      setStatus('error')
      setStatusMsg('Network error. Please check your connection.')
      setTimeout(() => { setStatus('idle'); setStatusMsg('') }, 4000)
    }
  }

  /* ──────────────────────────────────────────────────────
     FOOTER LINKS — Fixed to match your actual App.jsx routes
  ────────────────────────────────────────────────────── */
  const columns = [
    {
      title: 'Shop',
      accent: 'bg-blue-500',
      hover: 'hover:text-blue-400',
      bar: 'bg-blue-400',
      links: [
        { label: 'All Products',   to: '/shop' },
        { label: 'Smartphones',    to: '/shop' },
        { label: 'Laptops',        to: '/shop' },
        { label: 'Accessories',    to: '/shop' },
        { label: 'Swap Deals',     to: '/swap-deals' },
      ],
    },
    {
      title: 'Services',
      accent: 'bg-orange-500',
      hover: 'hover:text-orange-400',
      bar: 'bg-orange-400',
      links: [
        { label: 'All Services',        to: '/services' },
        { label: 'Device Repairs',      to: '/repairs' },
        { label: 'Digital Services',    to: '/digital-services' },
        { label: 'Request Engineer',    to: '/requestengineer' },
        { label: 'Marketplace',         to: '/marketplace' },
      ],
    },
    {
      title: 'Company',
      accent: 'bg-green-500',
      hover: 'hover:text-green-400',
      bar: 'bg-green-400',
      links: [
        { label: 'About Us',    to: '/about' },
        { label: 'Blog',        to: '/blog' },
        { label: 'Contact Us',  to: '/contact' },
        { label: 'Login',       to: '/login' },
        { label: 'Sign Up',     to: '/signup' },
      ],
    },
    {
      title: 'Support',
      accent: 'bg-purple-500',
      hover: 'hover:text-purple-400',
      bar: 'bg-purple-400',
      links: [
        { label: 'Track Order',     to: '/track-order' },
        { label: 'Cart',            to: '/cart' },
        { label: 'Checkout',        to: '/checkout' },
        { label: 'Contact Support', to: '/contact' },
        { label: 'Request Engineer', to: '/requestengineer' },
      ],
    },
  ]

  /* ── social links ── */
  const socialLinks = [
    {
      icon: <FaFacebook size={20} />,
      href: 'https://web.facebook.com/profile.php?id=100063533320700',
      label: 'Facebook',
    },
    {
      icon: <FaTwitter size={20} />,
      href: 'https://twitter.com/75Techstore',
      label: 'Twitter',
    },
    {
      icon: <FaInstagram size={20} />,
      href: 'https://instagram.com/75Techstore',
      label: 'Instagram',
    },
    {
      icon: <FaLinkedin size={20} />,
      href: 'https://linkedin.com/company/75techstore',
      label: 'LinkedIn',
    },
    {
      icon: <FaYoutube size={20} />,
      href: 'https://youtube.com/@75Techstore',
      label: 'YouTube',
    },
  ]

  /* ── contact items ── */
  const contactItems = [
    {
      icon: <FaPhone size={16} className="text-blue-400" />,
      iconBg: 'bg-blue-500/20 group-hover:bg-blue-500/40',
      label: 'Call Us',
      value: '+234 703 562 0709',
      href: 'tel:+2347035620709',
    },
    {
      icon: <FaEnvelope size={16} className="text-orange-400" />,
      iconBg: 'bg-orange-500/20 group-hover:bg-orange-500/40',
      label: 'Email Us',
      value: '75techstore@gmail.com',
      href: '75techstore@gmail.com',
    },
    {
      icon: <FaMapMarkerAlt size={16} className="text-green-400" />,
      iconBg: 'bg-green-500/20 group-hover:bg-green-500/40',
      label: 'Visit Us',
      value: 'Lagos, Nigeria',
      href: 'https://maps.google.com/?q=Lagos,Nigeria',
    },
  ]

  /* ── feedback styles ── */
  const feedbackStyle = {
    success: 'bg-green-500/20 border-green-500/50 text-green-200',
    error:   'bg-red-500/20   border-red-500/50   text-red-200',
  }

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <section className="bg-gradient-to-br from-slate-900 via-blue-900
      to-slate-800 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16">

          {/* ── LEFT: LINK COLUMNS ── */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {columns.map((col) => (
                <div key={col.title}>
                  <h4 className="text-lg font-bold mb-5 text-white
                    flex items-center gap-2">
                    <span className={`w-1 h-6 ${col.accent} rounded-full`} />
                    {col.title}
                  </h4>
                  <ul className="space-y-3">
                    {col.links.map((link) => (
                      <li key={link.to + link.label}>
                        <Link
                          to={link.to}
                          className={`text-gray-300 ${col.hover}
                            transition-colors duration-300 text-sm
                            font-medium flex items-center gap-2 group`}
                        >
                          <span
                            className={`w-0 group-hover:w-2 h-0.5
                              ${col.bar} transition-all duration-300`}
                          />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: NEWSLETTER ── */}
          <div className="lg:col-span-1 relative">
            <div className="absolute inset-0 bg-blue-500 rounded-3xl
              blur-3xl opacity-10 pointer-events-none -z-10" />

            <div className="bg-white/5 border border-white/10 rounded-2xl
              p-8 backdrop-blur-md hover:border-blue-500/30
              transition-all duration-300">

              <h4 className="text-2xl font-bold mb-2 text-white">
                Stay Updated
              </h4>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                Get exclusive deals, tech tips, and early access to
                new products.
              </p>

              {/* Form */}
              <form onSubmit={handleSubscribe} noValidate className="mb-4">
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (status === 'error') {
                        setStatus('idle')
                        setStatusMsg('')
                      }
                    }}
                    placeholder="your@email.com"
                    disabled={status === 'loading'}
                    className={`w-full px-4 py-3 rounded-lg bg-white/10
                      border text-white placeholder-gray-400
                      focus:outline-none focus:bg-white/15
                      transition-all duration-300
                      disabled:opacity-60 disabled:cursor-not-allowed
                      ${status === 'error'
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-white/20 focus:border-blue-500'
                      }`}
                  />

                  <button
                    type="submit"
                    disabled={
                      status === 'loading' || status === 'success'
                    }
                    className="w-full bg-gradient-to-r from-blue-500
                      to-blue-600 hover:from-blue-600 hover:to-blue-700
                      text-white font-bold py-3 rounded-lg
                      transition-all duration-300 flex items-center
                      justify-center gap-2 shadow-lg
                      hover:shadow-blue-500/50
                      disabled:opacity-60 disabled:cursor-not-allowed
                      group"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none" viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25" cx="12" cy="12"
                            r="10" stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Subscribing…
                      </>
                    ) : (
                      <>
                        Subscribe
                        <FaArrowRight
                          size={16}
                          className="group-hover:translate-x-1
                            transition-transform duration-300"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Status message */}
              {(status === 'success' || status === 'error') && (
                <div
                  className={`border rounded-lg p-3 text-sm
                    text-center flex items-center justify-center
                    gap-2 mb-4 ${feedbackStyle[status]}`}
                >
                  {status === 'success'
                    ? <FaCheckCircle size={14} />
                    : <FaExclamationCircle size={14} />
                  }
                  {statusMsg}
                </div>
              )}

              <p className="text-xs text-gray-400 text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="h-px bg-gradient-to-r from-transparent
          via-white/20 to-transparent mb-12" />

        {/* ── BOTTOM ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8
          items-center">

          {/* Contact */}
          <div className="flex flex-col gap-4">
            {contactItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={
                  item.href.startsWith('http') ? '_blank' : undefined
                }
                rel={
                  item.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                className="flex items-center gap-3 group"
              >
                <div
                  className={`w-10 h-10 ${item.iconBg} rounded-lg
                    flex items-center justify-center
                    transition-all duration-300`}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-white font-semibold text-sm">
                    {item.value}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Brand */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              75TechStore
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Your trusted tech partner for quality gadgets,
              expert repairs &amp; digital services.
            </p>
            <div className="inline-block bg-gradient-to-r
              from-blue-500 to-purple-500 px-4 py-1 rounded-full
              text-xs font-bold text-white">
              Nigeria's #1 Tech Solution Destination
            </div>
          </div>

          {/* Social */}
          <div className="flex justify-center md:justify-end
            gap-3 flex-wrap">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                aria-label={social.label}
                className="w-12 h-12 bg-white/10 border
                  border-white/20 rounded-lg flex items-center
                  justify-center text-white hover:bg-blue-500
                  hover:border-blue-500 hover:scale-110
                  transition-all duration-300 group"
              >
                <span className="group-hover:-rotate-6
                  transition-transform duration-300">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default PreFooter