// src/pages/ServicesPage.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaTools, FaLaptopCode, FaMobileAlt, FaWrench,
  FaUserCog, FaSearch, FaShoppingCart, FaChevronRight,
  FaShieldAlt, FaClock, FaHeadset, FaStar, FaWhatsapp,
  FaRocket, FaCheckCircle, FaTruck, FaHome
} from 'react-icons/fa'

// ── Your WhatsApp number ──
const WHATSAPP_NUMBER = '2347035620709' // ✅ Replace with your real number

// ── All services ──
const allServices = [
  {
    icon: <FaWrench size={32} />,
    title: 'Device Repairs',
    desc: 'Expert repairs for smartphones, laptops, tablets, gaming consoles, and all gadgets. Walk in or send via dispatch.',
    features: [
      'Screen & display repair',
      'Battery replacement',
      'Motherboard repair',
      'Water damage recovery',
      'Software & OS fixes',
      'Data recovery',
    ],
    color: 'blue',
    path: '/repairs',
    buttonLabel: 'Book a Repair',
    tag: 'Most Popular',
  },
  {
    icon: <FaUserCog size={32} />,
    title: 'Request an Engineer',
    desc: 'Need a tech expert at your location? Request a certified engineer to come to your home or office for on-site repairs and setup.',
    features: [
      'On-site device repairs',
      'Network & WiFi setup',
      'Computer troubleshooting',
      'Smart home installation',
      'Office IT setup',
      'WhatsApp/Phone contact',
    ],
    color: 'green',
    path: '/requestengineer',
    buttonLabel: 'Request Engineer',
    tag: 'On-Site',
  },
  {
    icon: <FaLaptopCode size={32} />,
    title: 'Website Development',
    desc: 'Professional websites, e-commerce stores, landing pages, and web applications built with modern technologies.',
    features: [
      'Custom business websites',
      'E-commerce stores',
      'Landing pages',
      'Web app development',
      'WordPress & CMS',
      'SEO optimization',
    ],
    color: 'indigo',
    path: '/digital-services',
    buttonLabel: 'Get a Quote',
    tag: 'Digital',
  },
  {
    icon: <FaMobileAlt size={32} />,
    title: 'App Development',
    desc: 'Mobile apps for iOS and Android. From concept to App Store submission, we build apps that your users love.',
    features: [
      'iOS app development',
      'Android app development',
      'Cross-platform apps',
      'App UI/UX design',
      'App Store submission',
      'App maintenance',
    ],
    color: 'purple',
    path: '/digital services?tab=quote',
    buttonLabel: 'Start a Project',
    tag: 'Premium',
  },
  {
    icon: <FaSearch size={32} />,
    title: 'SEO & Digital Marketing',
    desc: 'Rank higher on Google, grow your social media, run ads, and get more customers with our digital marketing services.',
    features: [
      'Search engine optimization',
      'Google & Facebook Ads',
      'Social media management',
      'Content marketing',
      'Email campaigns',
      'Analytics & reporting',
    ],
    color: 'orange',
    path: '/digital-services?tab=quote',
    buttonLabel: 'Grow My Business',
    tag: 'Growth',
  },
  {
    icon: <FaShoppingCart size={32} />,
    title: 'Buy Gadgets',
    desc: 'Shop the latest smartphones, laptops, tablets, accessories, and tech gadgets at competitive prices with warranty.',
    features: [
      'Smartphones & iPhones',
      'Laptops & MacBooks',
      'Tablets & iPads',
      'Gaming accessories',
      'Audio & wearables',
      'Genuine products only',
    ],
    color: 'red',
    path: '/shop',
    buttonLabel: 'Visit Shop',
    tag: 'Shop',
  },
  {
    icon: <FaSearch size={32} />,
    title: 'Track My Repair',
    desc: 'Already dropped off your device? Enter your tracking ID to check the real-time status of your repair.',
    features: [
      'Real-time status updates',
      'Diagnosis notes visible',
      'Estimated cost shown',
      'Technician assigned',
      'Step-by-step progress',
      'No login required',
    ],
    color: 'cyan',
    path: '/repairs?tab=track',
    buttonLabel: 'Track Repair',
    tag: 'Tracking',
  },
  {
    icon: <FaShieldAlt size={32} />,
    title: 'Cybersecurity & Cloud',
    desc: 'Protect your business from cyber threats. We offer security audits, hosting setup, SSL, domain registration, and more.',
    features: [
      'Security audits',
      'Website hosting',
      'Domain registration',
      'SSL certificates',
      'Cloud server setup',
      'Firewall configuration',
    ],
    color: 'gray',
    path: '/digital-services?tab=quote',
    buttonLabel: 'Secure My Business',
    tag: 'Security',
  },
]

// ── Color config ──
const colorMap = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200',   btnBg: 'bg-blue-600 hover:bg-blue-700',     badge: 'bg-blue-100 text-blue-700'    },
  green:  { bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-200',  btnBg: 'bg-green-600 hover:bg-green-700',   badge: 'bg-green-100 text-green-700'   },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', btnBg: 'bg-indigo-600 hover:bg-indigo-700', badge: 'bg-indigo-100 text-indigo-700' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', btnBg: 'bg-purple-600 hover:bg-purple-700', badge: 'bg-purple-100 text-purple-700' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', btnBg: 'bg-orange-600 hover:bg-orange-700', badge: 'bg-orange-100 text-orange-700' },
  red:    { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200',    btnBg: 'bg-red-600 hover:bg-red-700',       badge: 'bg-red-100 text-red-700'      },
  cyan:   { bg: 'bg-cyan-50',   text: 'text-cyan-600',   border: 'border-cyan-200',   btnBg: 'bg-cyan-600 hover:bg-cyan-700',     badge: 'bg-cyan-100 text-cyan-700'    },
  gray:   { bg: 'bg-gray-50',   text: 'text-gray-600',   border: 'border-gray-200',   btnBg: 'bg-gray-700 hover:bg-gray-800',     badge: 'bg-gray-100 text-gray-700'    },
}

// ── Why Choose Us ──
const whyChooseUs = [
  {
    icon: <FaShieldAlt size={24} />,
    title: 'Certified Experts',
    desc: 'All our technicians and developers are trained and certified professionals.',
  },
  {
    icon: <FaClock size={24} />,
    title: 'Fast Turnaround',
    desc: 'Most repairs in 24-48hrs. Digital projects delivered on schedule, always.',
  },
  {
    icon: <FaHeadset size={24} />,
    title: '24/7 Support',
    desc: 'Got questions? Our support team is available round the clock via WhatsApp.',
  },
  {
    icon: <FaStar size={24} />,
    title: 'Client Satisfaction',
    desc: '98% satisfaction rate. We don\'t stop until you\'re completely happy.',
  },
  {
    icon: <FaTruck size={24} />,
    title: 'Pickup & Delivery',
    desc: 'Can\'t come to us? We pick up your device and deliver it back repaired.',
  },
  {
    icon: <FaCheckCircle size={24} />,
    title: 'Genuine Parts',
    desc: 'We only use quality, genuine replacement parts with warranty coverage.',
  },
]

const ServicesPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ══════════════════════════════════════════════ */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900
        text-white py-20 px-4 relative overflow-hidden">

        {/* Decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-56 h-56 border
            border-white/30 rounded-full" />
          <div className="absolute bottom-10 left-20 w-72 h-72 border
            border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 border
            border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="absolute top-16 left-16 text-white/5 hidden lg:block">
          <FaTools size={120} />
        </div>
        <div className="absolute bottom-16 right-16 text-white/5 hidden lg:block">
          <FaLaptopCode size={120} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10
            border border-white/20 rounded-full px-5 py-2.5 text-sm
            font-medium mb-6 backdrop-blur-sm">
            <FaRocket size={14} className="text-yellow-400" />
            <span>Everything Tech All in One Place</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight">
            Our <span className="text-yellow-400">Services</span>
          </h1>
          <p className="text-blue-200 max-w-2xl mx-auto text-sm md:text-base
            leading-relaxed mb-10">
            From device repairs and engineer visits to web development, app
            building, digital marketing, and gadget sales 75TechStore is
            your one-stop tech partner.
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { value: '500+',  label: 'Devices Repaired'   },
              { value: '50+',   label: 'Digital Projects'   },
              { value: '98%',   label: 'Satisfaction Rate'  },
              { value: '24hr',  label: 'Support Response'   },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm
                rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-extrabold text-yellow-400">
                  {stat.value}
                </p>
                <p className="text-blue-200 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* ALL SERVICES GRID */}
      {/* ══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-16">

        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            What We Offer
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Comprehensive tech services tailored to individuals and businesses.
            Click any service to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allServices.map((service, index) => {
            const cc = colorMap[service.color]
            return (
              <div key={index}
                className="bg-white rounded-2xl border border-gray-100
                  shadow-sm hover:shadow-xl transition-all duration-300
                  overflow-hidden group"
              >
                <div className="flex flex-col md:flex-row">

                  {/* Left: Icon & Tag */}
                  <div className={`${cc.bg} p-6 md:p-8 md:w-2/5 flex
                    flex-col items-center justify-center text-center
                    relative`}>
                    <span className={`absolute top-3 right-3 text-[10px]
                      font-bold px-2 py-1 rounded-full ${cc.badge}`}>
                      {service.tag}
                    </span>
                    <div className={`w-16 h-16 rounded-2xl ${cc.bg}
                      ${cc.text} flex items-center justify-center border
                      ${cc.border} group-hover:scale-110 transition-transform
                      duration-300 mb-3`}>
                      {service.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {service.title}
                    </h3>
                  </div>

                  {/* Right: Info & Features */}
                  <div className="p-6 md:w-3/5 flex flex-col">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {service.desc}
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-5
                      flex-grow">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <FaCheckCircle size={10}
                            className={`${cc.text} shrink-0`} />
                          <span className="text-gray-600 text-xs">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => navigate(service.path)}
                      className={`w-full py-3 rounded-xl text-white font-bold
                        text-sm ${cc.btnBg} transition-all duration-300
                        shadow-sm flex items-center justify-center gap-2
                        active:scale-95`}
                    >
                      {service.buttonLabel}
                      <FaChevronRight size={11} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* WHY CHOOSE US */}
      {/* ══════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Why Choose 75TechStore?
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              We go above and beyond to deliver quality service every time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border
                border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1
                transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl
                  flex items-center justify-center mb-4 group-hover:bg-blue-600
                  group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* HOW IT WORKS */}
      {/* ══════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            How It Works
          </h2>
          <p className="text-gray-500 text-sm">
            Getting started is easy just 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: <FaSearch size={22} />,        title: 'Choose a Service',
              desc: 'Browse our services and pick what you need.' },
            { icon: <FaHome size={22} />,           title: 'Contact Us',
              desc: 'Fill a form, call us, or message on WhatsApp.' },
            { icon: <FaTools size={22} />,          title: 'We Get to Work',
              desc: 'Our team works on your request with regular updates.' },
            { icon: <FaCheckCircle size={22} />,   title: 'Done & Delivered',
              desc: 'We deliver quality results and ongoing support.' },
          ].map((step, i) => (
            <div key={i} className="text-center relative">
              {/* Connector */}
              {i < 3 && (
                <div className="hidden md:block absolute top-7 left-3/4
                  w-1/2 h-0.5 bg-blue-200 z-0" />
              )}
              <div className="relative z-10 inline-block">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl
                  flex items-center justify-center mx-auto mb-4 shadow-lg
                  shadow-blue-600/30">
                  {step.icon}
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6
                  bg-yellow-400 text-gray-900 rounded-full flex items-center
                  justify-center text-xs font-black">
                  {i + 1}
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm">
                {step.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* CTA BANNER */}
      {/* ══════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800
          rounded-3xl p-10 md:p-14 text-white text-center relative
          overflow-hidden">

          {/* Decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5
            rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5
            rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
              Ready to Get Started?
            </h2>
            <p className="text-blue-200 mb-8 max-w-lg mx-auto text-sm
              leading-relaxed">
              Whether you need a device fixed, an app built, or your business
              taken online we're here to help. Contact us today!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/repairs')}
                className="bg-white text-blue-700 font-bold px-8 py-3.5
                  rounded-xl hover:bg-gray-100 transition shadow-lg
                  flex items-center justify-center gap-2 text-sm"
              >
                <FaWrench size={15} /> Book a Repair
              </button>
              <button
                onClick={() => navigate('/digital-services?tab=quote')}
                className="bg-yellow-400 text-gray-900 font-bold px-8 py-3.5
                  rounded-xl hover:bg-yellow-500 transition shadow-lg
                  flex items-center justify-center gap-2 text-sm"
              >
                <FaLaptopCode size={15} /> Get a Digital Quote
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white
                  font-bold px-8 py-3.5 rounded-xl transition shadow-lg
                  flex items-center justify-center gap-2 text-sm"
              >
                <FaWhatsapp size={18} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesPage