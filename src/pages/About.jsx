import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FaRocket,
  FaAward,
  FaUsers,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaLightbulb,
  FaHandshake,
  FaArrowRight,
  FaCheckCircle,
  FaTrophy,
  FaHeadset,
  FaTruck,
  FaShieldAlt,
  FaCode,
  FaTools,
  FaGlobeAmericas,
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
} from 'react-icons/fa'
import PreFooter from '../components/prefooter/PreFooter'

const About = () => {
  // Animated counter state
  const [counters, setCounters] = useState({
    customers: 0,
    gadgets: 0,
    years: 5,
    support: '24/7',
  })

  // Animated counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => ({
        ...prev,
        customers: prev.customers < 500 ? prev.customers + Math.floor(Math.random() * 5) + 1 : 500,
        gadgets: prev.gadgets < 1000 ? prev.gadgets + Math.floor(Math.random() * 10) + 1 : 1000,
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Statistics
  const stats = [
    {
      value: `${counters.customers}+`,
      label: 'Happy Customers',
      icon: <FaUsers size={28} />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      value: `${counters.gadgets}+`,
      label: 'Gadgets Sold',
      icon: <FaTrophy size={28} />,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      value: `${counters.years}+`,
      label: 'Years Experience',
      icon: <FaAward size={28} />,
      color: 'from-purple-500 to-pink-500',
    },
    {
      value: counters.support,
      label: 'Customer Support',
      icon: <FaHeadset size={28} />,
      color: 'from-green-500 to-emerald-500',
    },
  ]

  // Core services
  const services = [
    {
      icon: <FaCode size={40} />,
      title: 'Software Development',
      description: 'Building modern web applications and mobile apps for various industries',
      features: [
        'Custom Web Applications',
        'Mobile App Development',
        'Enterprise Solutions',
        'API Integration',
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FaTruck size={40} />,
      title: 'Gadget Sales',
      description: 'Retailing brand new and premium UK-used electronic gadgets',
      features: [
        'Authentic Products',
        'Brand New & UK-Used',
        'Competitive Pricing',
        'Wide Selection',
      ],
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <FaTools size={40} />,
      title: 'Repairs & Maintenance',
      description: 'Professional hardware repair services for laptops and smartphones',
      features: [
        'Laptop Repairs',
        'Smartphone Repairs',
        'Hardware Maintenance',
        'Warranty Support',
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <FaGlobeAmericas size={40} />,
      title: 'Nationwide Delivery',
      description: 'Reliable logistics and delivery services across Nigeria',
      features: [
        'Fast Shipping',
        'Track Orders',
        'Safe Packaging',
        'Nationwide Coverage',
      ],
      color: 'from-green-500 to-emerald-500',
    },
  ]

  // Core values
  const coreValues = [
    {
      icon: <FaRocket size={28} />,
      title: 'Innovation',
      description: 'Cutting-edge technology and continuous improvement in everything we do',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FaShieldAlt size={28} />,
      title: 'Authenticity',
      description: 'Guaranteed authentic products and transparent business practices',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <FaHandshake size={28} />,
      title: 'Partnership',
      description: 'Building lasting relationships with customers and business partners',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <FaTrophy size={28} />,
      title: 'Excellence',
      description: 'Delivering premium quality in every product and service',
      color: 'from-green-500 to-emerald-500',
    },
  ]

  // Why choose us
  const whyChooseUs = [
    {
      icon: <FaCheckCircle size={24} />,
      title: 'Authentic Products',
      description: '100% genuine gadgets with manufacturer warranty and guarantee',
      color: 'text-green-500',
    },
    {
      icon: <FaHeadset size={24} />,
      title: 'Expert Support',
      description: 'Professional tech assistance and customer service support',
      color: 'text-blue-500',
    },
    {
      icon: <FaTruck size={24} />,
      title: 'Fast Delivery',
      description: 'Nationwide shipping with real-time order tracking',
      color: 'text-orange-500',
    },
    {
      icon: <FaShieldAlt size={24} />,
      title: 'Quality Assurance',
      description: 'Every product tested and verified before delivery',
      color: 'text-purple-500',
    },
    {
      icon: <FaLightbulb size={24} />,
      title: 'Competitive Pricing',
      description: 'Best prices without compromising on quality',
      color: 'text-yellow-500',
    },
    {
      icon: <FaTools size={24} />,
      title: 'Professional Services',
      description: 'Expert repair and maintenance services available',
      color: 'text-pink-500',
    },
  ]

  return (
    <>

      
      {/* HERO SECTION - IMPROVED COLORS */}
      

      <section className='relative min-h-screen flex items-center justify-center 
        overflow-hidden pt-20 pb-20 bg-gradient-to-b from-gray-900 via-gray-950 to-black'>

        {/* Animated Background - Improved for Better Button Visibility */}
        <div className='absolute inset-0 -z-10'>
          {/* Animated stars */}
          <div className='absolute inset-0'>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className='absolute bg-white rounded-full animate-pulse'
                style={{
                  width: Math.random() > 0.7 ? '2px' : '1px',
                  height: Math.random() > 0.7 ? '2px' : '1px',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Gradient orbs - Made more subtle */}
          <div className='absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full 
            blur-3xl opacity-30' />
          <div className='absolute top-1/2 right-0 w-96 h-96 bg-yellow-600/10 rounded-full 
            blur-3xl opacity-30' />
          <div className='absolute bottom-0 left-1/2 w-96 h-96 bg-purple-600/10 rounded-full 
            blur-3xl opacity-30' />
        </div>

        {/* Content */}
        <div className='max-w-6xl mx-auto px-6 text-center relative z-10'>

          {/* Badge */}
          <div className='inline-flex items-center gap-2 bg-white/10 border border-yellow-400/50 
            rounded-full px-6 py-2.5 mb-6 backdrop-blur-md hover:border-yellow-300/80 
            transition-all duration-300'>
            <FaRocket className='text-yellow-400 animate-bounce' size={18} />
            <span className='text-yellow-400 font-semibold text-sm'>About 75TechStore</span>
          </div>

          {/* Main Title */}
          <h1 className='text-5xl md:text-7xl font-black text-white mb-6 leading-tight'>
            Nigeria's Premier
            <br />
            <span className='bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 
              bg-clip-text text-transparent'>Tech & Solutions Hub</span>
          </h1>

          {/* Subtitle */}
          <p className='text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 
            leading-relaxed font-light'>
            75TechStore Limited is a legitimate Nigerian tech startup delivering premium gadgets, 
            professional repairs, and cutting-edge software solutions since 2019.
          </p>

          {/* CTA Buttons - IMPROVED VISIBILITY */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Link
              to='/shop'
              className='group px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 
                hover:from-yellow-500 hover:to-orange-600 text-gray-950 font-bold rounded-xl 
                transition-all duration-300 flex items-center gap-2 shadow-xl 
                hover:shadow-yellow-400/60 text-lg hover:scale-105'
            >
              Shop Now
              <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
            </Link>
            <a
              href='https://wa.me/2347035620709'
              target='_blank'
              rel='noopener noreferrer'
              className='px-8 py-4 bg-white hover:bg-gray-100 text-gray-950 font-bold 
                rounded-xl transition-all duration-300 border border-white 
                shadow-lg hover:shadow-white/50 text-lg flex items-center gap-2 hover:scale-105'
            >
              <FaWhatsapp size={20} />
              WhatsApp Us
            </a>
          </div>

        </div>
      </section>

    
      {/* STATS SECTION - ANIMATED COUNTERS */}
     

      <section className='relative py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'>
        <div className='max-w-7xl mx-auto px-6'>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {stats.map((stat, i) => (
              <div
                key={i}
                className='group relative bg-gradient-to-br from-white/15 to-white/8 
                  border border-white/20 rounded-2xl p-8 backdrop-blur-md 
                  hover:border-yellow-400/60 hover:from-white/25 transition-all 
                  duration-300 overflow-hidden shadow-lg'
              >
                {/* Glow on hover */}
                <div className='absolute inset-0 bg-yellow-400/15 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300 blur-xl' />

                {/* Icon */}
                <div className='relative z-10 text-yellow-400 mb-4 group-hover:scale-110 
                  transition-transform duration-300'>
                  {stat.icon}
                </div>

                {/* Value - Animated */}
                <p className='relative z-10 text-5xl font-black text-white mb-2 
                  font-mono tracking-wider'>
                  {stat.value}
                </p>

                {/* Label */}
                <p className='relative z-10 text-gray-300 font-medium text-lg'>
                  {stat.label}
                </p>

                {/* Bottom accent line animation */}
                <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r 
                  from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 
                  transition-transform duration-300 origin-left' />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* OUR STORY */}
   

      <section className='py-20 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900'>
        <div className='max-w-6xl mx-auto px-6'>

          <div className='grid md:grid-cols-2 gap-16 items-center'>

            {/* Left - Story */}
            <div className='group'>
              <div className='inline-flex items-center gap-2 mb-4'>
                <div className='w-2 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full' />
                <span className='text-yellow-400 font-bold text-sm uppercase tracking-widest'>OUR STORY</span>
              </div>

              <h2 className='text-4xl font-black text-white mb-6'>
                Building the Future of
                <br />
                <span className='bg-gradient-to-r from-yellow-400 to-orange-500 
                  bg-clip-text text-transparent'>Tech in Nigeria</span>
              </h2>

              <p className='text-gray-300 text-lg leading-relaxed mb-6'>
                Founded in 2019, 75TechStore Limited started with a simple vision: 
                to make premium technology accessible and affordable to every Nigerian.
              </p>

              <p className='text-gray-300 text-lg leading-relaxed mb-8'>
                Today, we've grown into a comprehensive tech hub offering gadget sales, 
                professional repair services, and custom software development solutions for 
                businesses across Nigeria.
              </p>

              <div className='space-y-4'>
                {[
                  'Premium gadgets at competitive prices',
                  'Professional repair & maintenance services',
                  'Custom software development',
                  'Nationwide reliable delivery',
                ].map((item, i) => (
                  <div key={i} className='flex items-start gap-3 group/item'>
                    <FaCheckCircle className='text-yellow-400 mt-1 flex-shrink-0 
                      group-hover/item:scale-110 transition-transform' size={20} />
                    <span className='text-gray-200 font-medium'>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Location & Contact */}
            <div className='space-y-6'>
              {/* Location Card */}
              <div className='group relative bg-gradient-to-br from-white/15 to-white/8 
                border border-white/20 rounded-2xl p-8 backdrop-blur-md 
                hover:border-yellow-400/60 transition-all duration-300 overflow-hidden
                shadow-lg'>

                <div className='absolute inset-0 bg-gradient-to-br from-yellow-400/10 
                  to-transparent opacity-0 group-hover:opacity-100 transition-opacity 
                  duration-300 -z-10' />

                <div className='flex items-start gap-4 mb-6'>
                  <div className='text-yellow-400 text-3xl flex-shrink-0'>
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-white mb-2'>Location</h3>
                    <p className='text-gray-300 leading-relaxed'>
                      M Plaza, Adepele St,<br />
                      Computer Village,<br />
                      Ikeja, 100102, Lagos, Nigeria
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className='group relative bg-gradient-to-br from-white/15 to-white/8 
                border border-white/20 rounded-2xl p-8 backdrop-blur-md 
                hover:border-yellow-400/60 transition-all duration-300 overflow-hidden
                shadow-lg'>

                <div className='absolute inset-0 bg-gradient-to-br from-yellow-400/10 
                  to-transparent opacity-0 group-hover:opacity-100 transition-opacity 
                  duration-300 -z-10' />

                <div className='flex items-start gap-4 mb-6'>
                  <div className='text-yellow-400 text-3xl flex-shrink-0'>
                    <FaPhone />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-white mb-2'>Contact</h3>
                    <a
                      href='tel:+2347035620709'
                      className='text-gray-300 hover:text-yellow-400 transition-colors block mb-2'
                    >
                      +234 703 562 0709
                    </a>
                    <a
                      href='https://wa.me/2347035620709'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-gray-300 hover:text-yellow-400 transition-colors flex items-center gap-2'
                    >
                      <FaWhatsapp size={16} /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className='group relative bg-gradient-to-br from-white/15 to-white/8 
                border border-white/20 rounded-2xl p-8 backdrop-blur-md 
                hover:border-yellow-400/60 transition-all duration-300 overflow-hidden
                shadow-lg'>

                <div className='absolute inset-0 bg-gradient-to-br from-yellow-400/10 
                  to-transparent opacity-0 group-hover:opacity-100 transition-opacity 
                  duration-300 -z-10' />

                <div className='flex items-start gap-4'>
                  <div className='text-yellow-400 text-3xl flex-shrink-0'>
                    <FaClock />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-white mb-2'>Hours</h3>
                    <p className='text-gray-300 mb-2'>
                      Monday - Saturday<br />
                      8:00 AM – 8:00 PM
                    </p>
                    <p className='text-gray-400 text-sm'>
                      Closed on Sundays
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      
      {/* CORE SERVICES */}
   

      <section className='py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'>
        <div className='max-w-6xl mx-auto px-6'>

          {/* Section Header */}
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 mb-4'>
              <FaTrophy className='text-yellow-400' size={20} />
              <span className='text-yellow-400 font-bold text-sm uppercase tracking-widest'>WHAT WE DO</span>
            </div>
            <h2 className='text-5xl font-black text-white mb-4'>
              Our Core Services
            </h2>
            <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
              A complete tech ecosystem designed to meet all your digital needs
            </p>
          </div>

          {/* Services Grid */}
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {services.map((service, i) => (
              <div
                key={i}
                className='group relative bg-gradient-to-br from-white/15 to-white/8 
                  border border-white/20 rounded-2xl p-8 backdrop-blur-md 
                  hover:border-yellow-400/60 hover:from-white/25 transition-all 
                  duration-300 overflow-hidden h-full shadow-lg'
              >
                {/* Colored gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} 
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`} />

                {/* Icon Container */}
                <div className={`inline-flex items-center justify-center w-16 h-16 
                  rounded-2xl bg-gradient-to-br ${service.color} text-white mb-6 
                  group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className='text-2xl font-bold text-white mb-3'>
                  {service.title}
                </h3>

                {/* Description */}
                <p className='text-gray-300 leading-relaxed font-medium mb-6'>
                  {service.description}
                </p>

                {/* Features */}
                <ul className='space-y-2'>
                  {service.features.map((feature, j) => (
                    <li key={j} className='flex items-center gap-2 text-sm text-gray-300'>
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r 
                  ${service.color} transform scale-x-0 group-hover:scale-x-100 
                  transition-transform duration-300 origin-left`} />
              </div>
            ))}
          </div>

        </div>
      </section>

   
      {/* CORE VALUES */}
   

      <section className='py-20 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900'>
        <div className='max-w-6xl mx-auto px-6'>

          {/* Section Header */}
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 mb-4'>
              <FaLightbulb className='text-yellow-400 animate-pulse' size={20} />
              <span className='text-yellow-400 font-bold text-sm uppercase tracking-widest'>OUR VALUES</span>
            </div>
            <h2 className='text-5xl font-black text-white mb-4'>
              What Drives Us Forward
            </h2>
            <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
              These core principles guide every decision and action we take
            </p>
          </div>

          {/* Values Grid */}
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {coreValues.map((value, i) => (
              <div
                key={i}
                className='group relative bg-gradient-to-br from-white/15 to-white/8 
                  border border-white/20 rounded-2xl p-8 backdrop-blur-md 
                  overflow-hidden hover:border-yellow-400/60 transition-all duration-300 
                  cursor-pointer shadow-lg'
              >
                {/* Colored gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} 
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`} />

                {/* Icon Container */}
                <div className={`inline-flex items-center justify-center w-14 h-14 
                  rounded-xl bg-gradient-to-br ${value.color} text-white mb-4 
                  group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {value.icon}
                </div>

                {/* Title */}
                <h3 className='text-xl font-bold text-white mb-3'>
                  {value.title}
                </h3>

                {/* Description */}
                <p className='text-gray-300 leading-relaxed text-sm'>
                  {value.description}
                </p>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r 
                  ${value.color} transform scale-x-0 group-hover:scale-x-100 
                  transition-transform duration-300 origin-left`} />
              </div>
            ))}
          </div>

        </div>
      </section>

     
      {/* WHY CHOOSE US */}
    

      <section className='py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'>
        <div className='max-w-6xl mx-auto px-6'>

          {/* Section Header */}
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 mb-4'>
              <FaTrophy className='text-yellow-400 animate-bounce' size={20} />
              <span className='text-yellow-400 font-bold text-sm uppercase tracking-widest'>WHY CHOOSE US</span>
            </div>
            <h2 className='text-5xl font-black text-white mb-4'>
              Why Trust 75TechStore?
            </h2>
            <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
              We've earned the trust of thousands through commitment to excellence
            </p>
          </div>

          {/* Features Grid */}
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {whyChooseUs.map((feature, i) => (
              <div
                key={i}
                className='group flex gap-4 p-6 bg-gradient-to-br from-white/15 to-white/8 
                  border border-white/20 rounded-2xl backdrop-blur-md 
                  hover:border-yellow-400/60 hover:from-white/25 transition-all duration-300
                  shadow-lg'
              >
                {/* Icon */}
                <div className={`flex-shrink-0 text-3xl group-hover:scale-110 
                  transition-transform duration-300 ${feature.color}`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <div className='flex-grow'>
                  <h3 className='text-lg font-bold text-white mb-2'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-300 text-sm leading-relaxed'>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    
      {/* CONNECT WITH US */}
      

      <section className='py-20 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900'>
        <div className='max-w-6xl mx-auto px-6'>

          {/* Section Header */}
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 mb-4'>
              <FaGlobeAmericas className='text-yellow-400' size={20} />
              <span className='text-yellow-400 font-bold text-sm uppercase tracking-widest'>CONNECT WITH US</span>
            </div>
            <h2 className='text-5xl font-black text-white mb-4'>
              Let's Talk Tech
            </h2>
            <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
              Reach out through any of our channels to get started
            </p>
          </div>

          {/* Contact Methods */}
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>

            {/* WhatsApp */}
            <a
              href='https://wa.me/2347035620709'
              target='_blank'
              rel='noopener noreferrer'
              className='group relative bg-gradient-to-br from-white/15 to-white/8 
                border border-white/20 rounded-2xl p-8 backdrop-blur-md 
                hover:border-green-400/60 hover:from-white/25 transition-all duration-300 
                overflow-hidden text-center shadow-lg'
            >
              <div className='absolute inset-0 bg-green-400/10 opacity-0 
                group-hover:opacity-100 transition-opacity duration-300 blur-xl' />

              <div className='relative z-10'>
                <div className='text-5xl text-green-400 mb-4 group-hover:scale-110 
                  transition-transform duration-300'>
                  <FaWhatsapp />
                </div>
                <h3 className='text-2xl font-bold text-white mb-2'>WhatsApp</h3>
                <p className='text-gray-300 mb-4'>+234 703 562 0709</p>
                <p className='text-gray-400 text-sm'>Fast response on WhatsApp</p>
              </div>
            </a>

            {/* Phone */}
            <a
              href='tel:+2347035620709'
              className='group relative bg-gradient-to-br from-white/15 to-white/8 
                border border-white/20 rounded-2xl p-8 backdrop-blur-md 
                hover:border-blue-400/60 hover:from-white/25 transition-all duration-300 
                overflow-hidden text-center shadow-lg'
            >
              <div className='absolute inset-0 bg-blue-400/10 opacity-0 
                group-hover:opacity-100 transition-opacity duration-300 blur-xl' />

              <div className='relative z-10'>
                <div className='text-5xl text-blue-400 mb-4 group-hover:scale-110 
                  transition-transform duration-300'>
                  <FaPhone />
                </div>
                <h3 className='text-2xl font-bold text-white mb-2'>Call Us</h3>
                <p className='text-gray-300 mb-4'>+234 703 562 0709</p>
                <p className='text-gray-400 text-sm'>Mon-Sat, 8 AM - 8 PM</p>
              </div>
            </a>

            {/* Visit Us */}
            <a
              href='https://maps.google.com/?q=M+Plaza+Adepele+St+Computer+Village+Ikeja'
              target='_blank'
              rel='noopener noreferrer'
              className='group relative bg-gradient-to-br from-white/15 to-white/8 
                border border-white/20 rounded-2xl p-8 backdrop-blur-md 
                hover:border-orange-400/60 hover:from-white/25 transition-all duration-300 
                overflow-hidden text-center shadow-lg'
            >
              <div className='absolute inset-0 bg-orange-400/10 opacity-0 
                group-hover:opacity-100 transition-opacity duration-300 blur-xl' />

              <div className='relative z-10'>
                <div className='text-5xl text-orange-400 mb-4 group-hover:scale-110 
                  transition-transform duration-300'>
                  <FaMapMarkerAlt />
                </div>
                <h3 className='text-2xl font-bold text-white mb-2'>Visit Us</h3>
                <p className='text-gray-300 mb-2 text-sm'>Computer Village, Ikeja</p>
                <p className='text-gray-400 text-xs'>Get directions on Google Maps</p>
              </div>
            </a>

          </div>

          {/* Social Media */}
          <div className='text-center'>
            <h3 className='text-2xl font-bold text-white mb-6'>Follow Our Updates</h3>
            <div className='flex justify-center gap-6'>
              <a
                href='https://instagram.com/75techstore'
                target='_blank'
                rel='noopener noreferrer'
                className='group w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 
                  rounded-full flex items-center justify-center text-white 
                  hover:scale-110 transition-transform duration-300 shadow-lg 
                  hover:shadow-pink-500/50'
              >
                <FaInstagram size={28} />
              </a>
              <a
                href='https://facebook.com/75techstore'
                target='_blank'
                rel='noopener noreferrer'
                className='group w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 
                  rounded-full flex items-center justify-center text-white 
                  hover:scale-110 transition-transform duration-300 shadow-lg 
                  hover:shadow-blue-600/50'
              >
                <FaFacebook size={28} />
              </a>
              <a
                href='https://wa.me/2347035620709'
                target='_blank'
                rel='noopener noreferrer'
                className='group w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 
                  rounded-full flex items-center justify-center text-white 
                  hover:scale-110 transition-transform duration-300 shadow-lg 
                  hover:shadow-green-500/50'
              >
                <FaWhatsapp size={28} />
              </a>
            </div>
          </div>

        </div>
      </section>

      
      {/* CALL TO ACTION */}
     

      <section className='relative py-20 overflow-hidden bg-gradient-to-b 
        from-gray-950 via-gray-900 to-gray-950'>

        {/* Animated orbs */}
        <div className='absolute top-0 right-0 w-80 h-80 bg-yellow-500/15 rounded-full 
          blur-3xl opacity-40 animate-blob' />
        <div className='absolute bottom-0 left-0 w-80 h-80 bg-orange-500/15 rounded-full 
          blur-3xl opacity-40 animate-blob animation-delay-2000' />

        <div className='max-w-4xl mx-auto px-6 text-center relative z-10'>

          <h2 className='text-5xl md:text-6xl font-black text-white mb-6'>
            Ready to Experience the
            <br />
            <span className='bg-gradient-to-r from-yellow-400 to-orange-500 
              bg-clip-text text-transparent'>Best of Tech?</span>
          </h2>

          <p className='text-xl text-gray-300 mb-12 max-w-2xl mx-auto'>
            Whether you're looking for quality gadgets, professional repairs, or custom software solutions, 
            75TechStore is your trusted partner.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Link
              to='/shop'
              className='group px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 
                hover:from-yellow-500 hover:to-orange-600 text-gray-950 font-bold rounded-xl 
                transition-all duration-300 flex items-center gap-2 shadow-2xl 
                hover:shadow-yellow-400/60 text-lg hover:scale-105'
            >
              Start Shopping
              <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
            </Link>
            <a
              href='https://wa.me/2347035620709'
              target='_blank'
              rel='noopener noreferrer'
              className='px-10 py-4 bg-white hover:bg-gray-100 text-gray-950 font-bold 
                rounded-xl transition-all duration-300 border border-white 
                shadow-lg hover:shadow-white/50 text-lg flex items-center gap-2 hover:scale-105'
            >
              <FaWhatsapp size={20} />
              Contact Us
            </a>
          </div>

        </div>
      </section>
     <PreFooter />
    </>
  )
}

export default About