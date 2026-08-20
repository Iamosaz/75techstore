// src/pages/Contact.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaLinkedin,
  FaTwitter,
  FaPaperPlane,
  FaCheckCircle,
  FaHeadset,
  FaRocket,
  FaShieldAlt,
  FaUsers,
  FaExclamationCircle,
} from 'react-icons/fa'
import PreFooter from '../components/prefooter/PreFooter'

const Contact = () => {
  const [formData, setFormData] = useState({
    name:     '',
    email:    '',
    phone:    '',
    subject:  '',
    message:  '',
    category: 'general',
  })

  const [submitted, setSubmitted]       = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [focusedField, setFocusedField] = useState(null)

  /* ─────────────────────────────────────────
     Contact methods
  ───────────────────────────────────────── */
  const contactMethods = [
    {
      icon:        <FaPhone size={32} />,
      title:       'Call Us',
      description: 'Available Monday to Saturday',
      contact:     '+234 703 562 0709',
      link:        'tel:+2347035620709',
      color:       'from-blue-500 to-cyan-500',
      bgColor:     'bg-blue-50',
      textColor:   'text-blue-600',
      time:        '8:00 AM - 8:00 PM',
    },
    {
      icon:        <FaWhatsapp size={32} />,
      title:       'WhatsApp',
      description: 'Instant messaging support',
      contact:     '+234 703 562 0709',
      link:        'https://wa.me/2347035620709',
      color:       'from-green-500 to-emerald-500',
      bgColor:     'bg-green-50',
      textColor:   'text-green-600',
      time:        'Quick Response',
    },
    {
      icon:        <FaEnvelope size={32} />,
      title:       'Email Us',
      description: 'We respond within 24 hours',
      contact:     '75techstore@gmail.com',       // ✅ fixed typo
      link:        'mailto:75techstore@gmail.com',
      color:       'from-purple-500 to-pink-500',
      bgColor:     'bg-purple-50',
      textColor:   'text-purple-600',
      time:        '24/7 Available',
    },
    {
      icon:        <FaMapMarkerAlt size={32} />,
      title:       'Visit Us',
      description: 'Computer Village, Ikeja',
      contact:     'M Plaza, Adepele St, Ikeja',
      link:        'https://maps.google.com/?q=M+Plaza+Adepele+St+Computer+Village+Ikeja',
      color:       'from-orange-500 to-red-500',
      bgColor:     'bg-orange-50',
      textColor:   'text-orange-600',
      time:        'Mon-Sat, 8 AM-8 PM',
    },
  ]

  /* ─────────────────────────────────────────
     FAQ items
  ───────────────────────────────────────── */
  const faqs = [
    {
      question: 'What are your business hours?',
      answer:   'We operate Monday to Saturday, 8:00 AM to 8:00 PM. We are closed on Sundays. WhatsApp and email support is available 24/7.',
      icon:     <FaClock />,
    },
    {
      question: 'How long does nationwide delivery take?',
      answer:   'Delivery typically takes 2-5 business days depending on your location within Nigeria. Express delivery options are available for urgent orders.',
      icon:     <FaRocket />,
    },
    {
      question: 'Do you offer repair services?',
      answer:   'Yes! We provide professional repair services for laptops, smartphones, and other gadgets. Visit us in-store or contact us for a quote.',
      icon:     <FaShieldAlt />,
    },
    {
      question: 'Are your products authentic?',
      answer:   '100% authentic! All our products come with manufacturer warranty. We only source from authorized distributors and verified suppliers.',
      icon:     <FaCheckCircle />,
    },
    {
      question: 'Can I return or exchange a product?',
      answer:   'Yes, we offer hassle-free returns and exchanges within 30 days of purchase. Products must be in original condition with packaging.',
      icon:     <FaUsers />,
    },
    {
      question: 'Do you offer corporate solutions?',
      answer:   'Absolutely! We provide custom software development and IT solutions for businesses. Contact us to discuss your requirements.',
      icon:     <FaHeadset />,
    },
  ]

  /* ─────────────────────────────────────────
     Form categories
  ───────────────────────────────────────── */
  const categories = [
    { value: 'general',   label: 'General Inquiry' },
    { value: 'support',   label: 'Technical Support' },
    { value: 'repair',    label: 'Repair Service' },
    { value: 'business',  label: 'Business Inquiry' },
    { value: 'feedback',  label: 'Feedback' },
    { value: 'complaint', label: 'Complaint' },
  ]

  /* ─────────────────────────────────────────
     Animation variants
  ───────────────────────────────────────── */
  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  /* ─────────────────────────────────────────
     Handlers
  ───────────────────────────────────────── */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  /* ─────────────────────────────────────────
     Submit — real API call
  ───────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     formData.name.trim(),
          email:    formData.email.trim(),
          phone:    formData.phone.trim(),
          subject:  formData.subject.trim(),
          category: formData.category,
          message:  formData.message.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      // ✅ Success
      setLoading(false)
      setSubmitted(true)
      setFormData({
        name:     '',
        email:    '',
        phone:    '',
        subject:  '',
        message:  '',
        category: 'general',
      })

      // Reset success message after 6 seconds
      setTimeout(() => setSubmitted(false), 6000)

    } catch (err) {
      setLoading(false)
      setError('Network error. Please check your connection or contact us via WhatsApp.')
    }
  }

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <>
      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className='relative min-h-screen flex items-center
        justify-center overflow-hidden pt-20 pb-20'>

        {/* Background */}
        <div className='absolute inset-0 bg-gradient-to-b from-white
          via-gray-50 to-gray-100 -z-10'>

          {/* Animated dots */}
          <div className='absolute inset-0'>
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className='absolute bg-gray-300 rounded-full animate-pulse'
                style={{
                  width:          Math.random() > 0.7 ? '3px' : '1.5px',
                  height:         Math.random() > 0.7 ? '3px' : '1.5px',
                  left:           `${Math.random() * 100}%`,
                  top:            `${Math.random() * 100}%`,
                  opacity:        Math.random() * 0.5 + 0.2,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Gradient orbs */}
          <div className='absolute top-0 left-0 w-96 h-96
            bg-blue-300/15 rounded-full blur-3xl opacity-40' />
          <div className='absolute top-1/2 right-0 w-96 h-96
            bg-yellow-300/15 rounded-full blur-3xl opacity-40' />
          <div className='absolute bottom-0 left-1/2 w-96 h-96
            bg-purple-300/15 rounded-full blur-3xl opacity-40' />
        </div>

        {/* Hero content */}
        <motion.div
          className='max-w-4xl mx-auto px-6 text-center relative z-10'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className='inline-flex items-center gap-2 bg-yellow-400/20
              border border-yellow-500/60 rounded-full px-6 py-2.5 mb-6
              backdrop-blur-md hover:border-yellow-500 transition-all duration-300'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className='w-2 h-2 bg-yellow-500 rounded-full animate-pulse' />
            <span className='text-yellow-700 font-semibold text-sm
              uppercase tracking-widest'>
              Get in Touch
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className='text-5xl md:text-7xl font-black text-gray-900
              mb-6 leading-tight'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Let's Connect &
            <br />
            <span className='bg-gradient-to-r from-yellow-500
              via-orange-500 to-red-600 bg-clip-text text-transparent'>
              Talk Tech
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className='text-xl md:text-2xl text-gray-700 max-w-3xl
              mx-auto mb-12 leading-relaxed'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Have questions about our products, services, or anything else?
            We're here to help! Reach out through any of our channels.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className='flex flex-col sm:flex-row gap-6 justify-center
              items-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* WhatsApp */}
            <motion.a
              href='https://wa.me/2347035620709'
              target='_blank'
              rel='noopener noreferrer'
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className='group relative px-8 py-4 rounded-xl font-bold
                text-lg text-white bg-gradient-to-r from-green-500
                to-emerald-600 hover:from-green-600 hover:to-emerald-700
                shadow-2xl hover:shadow-green-500/60 transition-all
                duration-300 flex items-center gap-3
                border border-green-400/30 overflow-hidden'
            >
              <div className='absolute inset-0 bg-gradient-to-r
                from-transparent via-white/20 to-transparent
                transform translate-x-full group-hover:translate-x-0
                transition-transform duration-500' />
              <FaWhatsapp size={20} className='relative z-10' />
              <span className='relative z-10'>Message on WhatsApp</span>
            </motion.a>

            {/* Send Message */}
            <motion.button
              onClick={() => {
                document.getElementById('contact-form')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className='group relative px-8 py-4 rounded-xl font-bold
                text-lg text-white bg-gradient-to-r from-yellow-500
                to-orange-600 hover:from-yellow-600 hover:to-orange-700
                shadow-2xl hover:shadow-yellow-500/60 transition-all
                duration-300 flex items-center gap-3
                border border-yellow-400/30 overflow-hidden'
            >
              <div className='absolute inset-0 bg-gradient-to-r
                from-transparent via-white/20 to-transparent
                transform translate-x-full group-hover:translate-x-0
                transition-transform duration-500' />
              <FaPaperPlane size={18} className='relative z-10' />
              <span className='relative z-10'>Send Message</span>
            </motion.button>
          </motion.div>

          {/* Direct call */}
          <motion.p
            className='text-gray-600 text-sm mt-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Or call us directly:{' '}
            <a
              href='tel:+2347035620709'
              className='font-bold text-gray-900 hover:text-orange-600
                transition-colors duration-300'
            >
              +234 703 562 0709
            </a>
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          CONTACT METHODS
      ══════════════════════════════════════ */}
      <section className='py-20 bg-gradient-to-b from-gray-100
        via-white to-gray-50'>
        <div className='max-w-7xl mx-auto px-6'>

          <div className='text-center mb-16'>
            <motion.h2
              className='text-5xl font-black text-gray-900 mb-4'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Multiple Ways to Reach Us
            </motion.h2>
            <motion.p
              className='text-xl text-gray-600 max-w-2xl mx-auto'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Choose the most convenient way to contact our team
            </motion.p>
          </div>

          <motion.div
            className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
          >
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.link}
                target={
                  method.link.startsWith('http') ? '_blank' : undefined
                }
                rel={
                  method.link.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`group relative rounded-3xl p-8 overflow-hidden
                  shadow-lg hover:shadow-2xl transition-all duration-300
                  ${method.bgColor} border-2 border-gray-200
                  hover:border-gray-300`}
              >
                <motion.div
                  className={`${method.textColor} text-4xl mb-6
                    group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 10 }}
                >
                  {method.icon}
                </motion.div>

                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                  {method.title}
                </h3>
                <p className='text-gray-600 text-sm mb-4'>
                  {method.description}
                </p>
                <p className='text-gray-900 font-bold text-lg mb-3'>
                  {method.contact}
                </p>
                <p className='text-gray-600 text-sm flex items-center gap-2'>
                  <FaClock size={12} />
                  {method.time}
                </p>

                <div className={`absolute bottom-0 left-0 right-0 h-1
                  bg-gradient-to-r ${method.color} transform scale-x-0
                  group-hover:scale-x-100 transition-transform duration-300
                  origin-left`} />
              </motion.a>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          CONTACT FORM
      ══════════════════════════════════════ */}
      <section className='py-20 bg-white'>
        <div className='max-w-4xl mx-auto px-6'>

          <motion.div
            id='contact-form'
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Form Header */}
            <div className='text-center mb-12'>
              <h2 className='text-5xl font-black text-gray-900 mb-4'>
                Send Us a Message
              </h2>
              <p className='text-xl text-gray-600'>
                Fill out the form below and we'll get back to you shortly
              </p>
            </div>

            {/* ── Success Message ── */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='mb-8 p-6 bg-green-100 border-2
                    border-green-500 rounded-2xl flex items-center gap-4'
                >
                  <FaCheckCircle className='text-green-600 text-2xl
                    flex-shrink-0' />
                  <div>
                    <p className='text-green-900 font-bold text-lg'>
                      Message Sent Successfully! 🎉
                    </p>
                    <p className='text-green-800 text-sm'>
                      Thank you for contacting us. We'll respond within
                      24 hours. Check your inbox for a confirmation email.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Error Message ── */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='mb-8 p-6 bg-red-100 border-2 border-red-500
                    rounded-2xl flex items-center gap-4'
                >
                  <FaExclamationCircle className='text-red-600 text-2xl
                    flex-shrink-0' />
                  <div>
                    <p className='text-red-900 font-bold text-lg'>
                      Message Failed to Send
                    </p>
                    <p className='text-red-800 text-sm'>{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Form ── */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className='bg-gradient-to-br from-gray-50 to-gray-100
                border-2 border-gray-200 rounded-3xl p-8 md:p-12
                shadow-lg'
            >
              <div className='grid md:grid-cols-2 gap-6 mb-6'>

                {/* Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <label className='block text-gray-900 font-bold
                    text-sm mb-3 uppercase tracking-widest'>
                    Full Name *
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder='Your full name'
                    className={`w-full px-6 py-3.5 rounded-xl bg-white
                      border-2 transition-all duration-300 text-gray-900
                      placeholder-gray-400 focus:outline-none
                      ${focusedField === 'name'
                        ? 'border-yellow-500 shadow-lg shadow-yellow-200'
                        : 'border-gray-300 hover:border-gray-400'
                      }`}
                  />
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <label className='block text-gray-900 font-bold
                    text-sm mb-3 uppercase tracking-widest'>
                    Email Address *
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder='your@email.com'
                    className={`w-full px-6 py-3.5 rounded-xl bg-white
                      border-2 transition-all duration-300 text-gray-900
                      placeholder-gray-400 focus:outline-none
                      ${focusedField === 'email'
                        ? 'border-yellow-500 shadow-lg shadow-yellow-200'
                        : 'border-gray-300 hover:border-gray-400'
                      }`}
                  />
                </motion.div>

              </div>

              <div className='grid md:grid-cols-2 gap-6 mb-6'>

                {/* Phone */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <label className='block text-gray-900 font-bold
                    text-sm mb-3 uppercase tracking-widest'>
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    placeholder='+234 703 562 0709'
                    className={`w-full px-6 py-3.5 rounded-xl bg-white
                      border-2 transition-all duration-300 text-gray-900
                      placeholder-gray-400 focus:outline-none
                      ${focusedField === 'phone'
                        ? 'border-yellow-500 shadow-lg shadow-yellow-200'
                        : 'border-gray-300 hover:border-gray-400'
                      }`}
                  />
                </motion.div>

                {/* Category */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <label className='block text-gray-900 font-bold
                    text-sm mb-3 uppercase tracking-widest'>
                    Inquiry Type *
                  </label>
                  <select
                    name='category'
                    value={formData.category}
                    onChange={handleInputChange}
                    className='w-full px-6 py-3.5 rounded-xl bg-white
                      border-2 border-gray-300 hover:border-gray-400
                      transition-all duration-300 text-gray-900
                      focus:outline-none focus:border-yellow-500
                      focus:shadow-lg focus:shadow-yellow-200'
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </motion.div>

              </div>

              {/* Subject */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className='mb-6'
              >
                <label className='block text-gray-900 font-bold
                  text-sm mb-3 uppercase tracking-widest'>
                  Subject *
                </label>
                <input
                  type='text'
                  name='subject'
                  value={formData.subject}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder='What is this about?'
                  className={`w-full px-6 py-3.5 rounded-xl bg-white
                    border-2 transition-all duration-300 text-gray-900
                    placeholder-gray-400 focus:outline-none
                    ${focusedField === 'subject'
                      ? 'border-yellow-500 shadow-lg shadow-yellow-200'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                />
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className='mb-8'
              >
                <label className='block text-gray-900 font-bold
                  text-sm mb-3 uppercase tracking-widest'>
                  Message *
                </label>
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  required
                  rows={6}
                  placeholder='Tell us more about your inquiry...'
                  className={`w-full px-6 py-3.5 rounded-xl bg-white
                    border-2 transition-all duration-300 text-gray-900
                    placeholder-gray-400 focus:outline-none resize-none
                    ${focusedField === 'message'
                      ? 'border-yellow-500 shadow-lg shadow-yellow-200'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type='submit'
                disabled={loading || submitted}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full md:w-fit group relative px-8 py-4
                  bg-gradient-to-r from-yellow-500 to-orange-600
                  hover:from-yellow-600 hover:to-orange-700 text-white
                  font-bold rounded-xl transition-all duration-300
                  flex items-center justify-center gap-2 shadow-lg
                  hover:shadow-yellow-500/60 text-lg
                  disabled:opacity-50 disabled:cursor-not-allowed
                  overflow-hidden border border-yellow-400/30'
              >
                <div className='absolute inset-0 bg-gradient-to-r
                  from-transparent via-white/20 to-transparent
                  transform translate-x-full group-hover:translate-x-0
                  transition-transform duration-500' />

                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity,
                        ease: 'linear' }}
                      className='w-5 h-5 border-2 border-white
                        border-t-transparent rounded-full'
                    />
                    <span className='relative z-10'>Sending...</span>
                  </>
                ) : submitted ? (
                  <>
                    <FaCheckCircle size={18} className='relative z-10' />
                    <span className='relative z-10'>Message Sent!</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={18} className='relative z-10
                      group-hover:scale-110 transition-transform' />
                    <span className='relative z-10'>Send Message</span>
                  </>
                )}
              </motion.button>

            </form>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ SECTION
      ══════════════════════════════════════ */}
      <section className='py-20 bg-gradient-to-b from-gray-100
        via-white to-gray-50'>
        <div className='max-w-4xl mx-auto px-6'>

          <div className='text-center mb-16'>
            <motion.h2
              className='text-5xl font-black text-gray-900 mb-4'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              className='text-xl text-gray-600'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Find answers to common questions about 75TechStore
            </motion.p>
          </div>

          <motion.div
            className='grid md:grid-cols-2 gap-6'
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className='bg-white border-2 border-gray-200
                  hover:border-gray-300 rounded-2xl p-6 shadow-md
                  hover:shadow-lg transition-all duration-300 group'
              >
                <div className='text-yellow-500 text-2xl mb-4
                  group-hover:scale-110 transition-transform duration-300'>
                  {faq.icon}
                </div>
                <h3 className='text-lg font-bold text-gray-900 mb-3'>
                  {faq.question}
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          SOCIAL MEDIA
      ══════════════════════════════════════ */}
      <section className='py-20 bg-white'>
        <div className='max-w-4xl mx-auto px-6 text-center'>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className='text-4xl font-black text-gray-900 mb-4'>
              Follow Us on Social Media
            </h2>
            <p className='text-xl text-gray-600 mb-12'>
              Stay updated with our latest products and announcements
            </p>

            <div className='flex flex-wrap justify-center gap-6'>
              {[
                {
                  icon:  <FaInstagram size={32} />,
                  link:  'https://instagram.com/75techstore',
                  name:  'Instagram',
                  color: 'from-pink-500 to-orange-500',
                },
                {
                  icon:  <FaFacebook size={32} />,
                  link:  'https://web.facebook.com/profile.php?id=100063533320700',
                  name:  'Facebook',
                  color: 'from-blue-600 to-blue-700',
                },
                {
                  icon:  <FaWhatsapp size={32} />,
                  link:  'https://wa.me/2347035620709',
                  name:  'WhatsApp',
                  color: 'from-green-500 to-green-600',
                },
                {
                  icon:  <FaTiktok size={32} />,
                  link:  'https://tiktok.com/@75techstore',
                  name:  'TikTok',
                  color: 'from-gray-900 to-black',
                },
                {
                  icon:  <FaTwitter size={32} />,
                  link:  'https://twitter.com/75Techstore',
                  name:  'Twitter',
                  color: 'from-blue-400 to-blue-500',
                },
                {
                  icon:  <FaLinkedin size={32} />,
                  link:  'https://linkedin.com/company/75techstore',
                  name:  'LinkedIn',
                  color: 'from-blue-600 to-blue-700',
                },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  whileHover={{ scale: 1.1, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-16 h-16 rounded-full bg-gradient-to-br
                    ${social.color} flex items-center justify-center
                    text-white shadow-lg hover:shadow-2xl
                    transition-all duration-300`}
                  title={social.name}
                  aria-label={social.name}
                >
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {social.icon}
                  </motion.div>
                </motion.a>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          MAP SECTION
      ══════════════════════════════════════ */}
      <section className='py-20 bg-gray-100'>
        <div className='max-w-6xl mx-auto px-6'>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-12'
          >
            <h2 className='text-4xl font-black text-gray-900 mb-4'>
              Visit Us
            </h2>
            <p className='text-xl text-gray-600'>
              Computer Village, Ikeja — Lagos, Nigeria
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='relative h-96 md:h-[500px] rounded-3xl
              overflow-hidden border-4 border-gray-300 shadow-2xl'
          >
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.1234567890!2d3.5478!3d6.5848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzUnMDIuNFMgM8KwMzInNDcuMkU!5e0!3m2!1sen!2sng!4v1234567890'
              width='100%'
              height='100%'
              style={{ border: 0 }}
              allowFullScreen=''
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              title='75TechStore Location'
            />
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════ */}
      <section className='relative py-20 overflow-hidden
        bg-gradient-to-b from-white via-gray-50 to-gray-100'>

        <div className='absolute top-0 right-0 w-80 h-80
          bg-yellow-300/20 rounded-full blur-3xl opacity-40' />
        <div className='absolute bottom-0 left-0 w-80 h-80
          bg-orange-300/20 rounded-full blur-3xl opacity-40' />

        <motion.div
          className='max-w-4xl mx-auto px-6 text-center relative z-10'
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className='text-5xl md:text-6xl font-black text-gray-900
            mb-6'>
            Ready to Get Started?
          </h2>
          <p className='text-xl text-gray-700 mb-12 max-w-2xl mx-auto'>
            Whether you need tech support, want to explore our products,
            or have a business inquiry, we're here to help. Reach out today!
          </p>

          <div className='flex flex-col sm:flex-row gap-6 justify-center
            items-center'>

            {/* WhatsApp CTA */}
            <motion.a
              href='https://wa.me/2347035620709'
              target='_blank'
              rel='noopener noreferrer'
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className='group relative px-10 py-4 bg-gradient-to-r
                from-green-500 to-emerald-600 hover:from-green-600
                hover:to-emerald-700 text-white font-bold rounded-xl
                transition-all duration-300 flex items-center gap-2
                shadow-2xl hover:shadow-green-500/60 text-lg
                overflow-hidden border border-green-400/30'
            >
              <div className='absolute inset-0 bg-gradient-to-r
                from-transparent via-white/20 to-transparent
                transform translate-x-full group-hover:translate-x-0
                transition-transform duration-500' />
              <FaWhatsapp size={20} className='relative z-10' />
              <span className='relative z-10'>Chat on WhatsApp</span>
            </motion.a>

            {/* Call CTA */}
            <motion.a
              href='tel:+2347035620709'
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className='group relative px-10 py-4 bg-gradient-to-r
                from-yellow-500 to-orange-600 hover:from-yellow-600
                hover:to-orange-700 text-white font-bold rounded-xl
                transition-all duration-300 flex items-center gap-2
                shadow-2xl hover:shadow-yellow-500/60 text-lg
                overflow-hidden border border-yellow-400/30'
            >
              <div className='absolute inset-0 bg-gradient-to-r
                from-transparent via-white/20 to-transparent
                transform translate-x-full group-hover:translate-x-0
                transition-transform duration-500' />
              <FaPhone size={20} className='relative z-10' />
              <span className='relative z-10'>Call Us Now</span>
            </motion.a>

          </div>
        </motion.div>
      </section>

      <PreFooter />
    </>
  )
}

export default Contact