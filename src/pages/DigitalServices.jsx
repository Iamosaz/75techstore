// src/pages/DigitalServices.jsx
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FaLaptopCode, FaMobileAlt, FaSearch, FaChartLine,
  FaShieldAlt, FaCloud, FaPaintBrush, FaBullhorn,
  FaCheckCircle, FaSpinner, FaWhatsapp, FaChevronRight,
  FaStar, FaRocket, FaHeadset, FaCode, FaGlobe,
  FaCog, FaDatabase, FaEnvelope, FaExternalLinkAlt,
  FaTimes,
} from 'react-icons/fa'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ── Your WhatsApp number (international format, no +) ──
const WHATSAPP_NUMBER = '2347035620709' // 

const VALID_TABS = ['services', 'portfolio', 'reviews', 'quote']

// ── All digital services offered ──
const services = [
  {
    id: 'web-dev',
    icon: <FaLaptopCode size={32} />,
    title: 'Website Development',
    shortDesc: 'Professional websites that drive results',
    color: 'blue',
    features: [
      'Custom business websites',
      'E-commerce stores',
      'Landing pages',
      'Portfolio websites',
      'WordPress & CMS sites',
      'Web app development',
    ],
    deliverables: '7 - 30 days delivery',
    tag: 'Most Popular',
  },
  {
    id: 'web-mgmt',
    icon: <FaCog size={32} />,
    title: 'Website Management',
    shortDesc: 'Keep your website running smoothly 24/7',
    color: 'purple',
    features: [
      'Regular content updates',
      'Security monitoring',
      'Performance optimization',
      'Backup & recovery',
      'Bug fixes & maintenance',
      'Monthly reporting',
    ],
    deliverables: 'Monthly retainer',
    tag: 'Recurring',
  },
  {
    id: 'app-dev',
    icon: <FaMobileAlt size={32} />,
    title: 'App Development',
    shortDesc: 'Mobile apps for iOS & Android',
    color: 'green',
    features: [
      'iOS app development',
      'Android app development',
      'Cross-platform apps',
      'App UI/UX design',
      'App Store submission',
      'App maintenance',
    ],
    deliverables: '30 - 90 days delivery',
    tag: 'Premium',
  },
  {
    id: 'seo',
    icon: <FaSearch size={32} />,
    title: 'SEO Services',
    shortDesc: 'Rank higher on Google & get more traffic',
    color: 'orange',
    features: [
      'Keyword research',
      'On-page SEO optimization',
      'Technical SEO audit',
      'Link building',
      'Local SEO',
      'Monthly SEO reports',
    ],
    deliverables: 'Results in 60-90 days',
    tag: 'High ROI',
  },
  {
    id: 'ui-ux',
    icon: <FaPaintBrush size={32} />,
    title: 'UI/UX Design',
    shortDesc: 'Beautiful designs that convert visitors',
    color: 'pink',
    features: [
      'Website UI design',
      'App UI/UX design',
      'Brand identity design',
      'Logo creation',
      'Design systems',
      'Figma prototypes',
    ],
    deliverables: '5 - 14 days delivery',
    tag: 'Creative',
  },
  {
    id: 'digital-marketing',
    icon: <FaBullhorn size={32} />,
    title: 'Digital Marketing',
    shortDesc: 'Grow your business online fast',
    color: 'red',
    features: [
      'Social media management',
      'Facebook & Instagram Ads',
      'Google Ads campaigns',
      'Email marketing',
      'Content marketing',
      'Analytics & reporting',
    ],
    deliverables: 'Monthly campaigns',
    tag: 'Growth',
  },
  {
    id: 'cloud',
    icon: <FaCloud size={32} />,
    title: 'Cloud & Hosting',
    shortDesc: 'Fast, secure hosting for your business',
    color: 'cyan',
    features: [
      'Website hosting setup',
      'Domain registration',
      'SSL certificates',
      'Cloud server setup',
      'Email hosting',
      'CDN configuration',
    ],
    deliverables: 'Setup in 24 hours',
    tag: 'Infrastructure',
  },
  {
    id: 'cybersecurity',
    icon: <FaShieldAlt size={32} />,
    title: 'Cybersecurity',
    shortDesc: 'Protect your business from cyber threats',
    color: 'indigo',
    features: [
      'Security audits',
      'Vulnerability assessment',
      'Firewall setup',
      'Data encryption',
      'Security training',
      'Incident response',
    ],
    deliverables: 'Audit in 3-5 days',
    tag: 'Protection',
  },
]

const serviceCategories = [
  'All',
  'Website Development',
  'Website Management',
  'App Development',
  'SEO Services',
  'UI/UX Design',
  'Digital Marketing',
  'Cloud & Hosting',
  'Cybersecurity',
  'Other',
]

// ── Color config ──
const colorConfig = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700'    },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
  green:  { bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-200',  badge: 'bg-green-100 text-green-700'   },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
  pink:   { bg: 'bg-pink-50',   text: 'text-pink-600',   border: 'border-pink-200',   badge: 'bg-pink-100 text-pink-700'    },
  red:    { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700'      },
  cyan:   { bg: 'bg-cyan-50',   text: 'text-cyan-600',   border: 'border-cyan-200',   badge: 'bg-cyan-100 text-cyan-700'    },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700' },
}

// ── Process steps ──
const processSteps = [
  { icon: <FaEnvelope size={20} />,  title: 'Contact Us',        desc: 'Reach out via the form or WhatsApp to discuss your project.' },
  { icon: <FaChartLine size={20} />, title: 'Get a Quote',       desc: 'We analyse your requirements and send a custom quote within 24hrs.' },
  { icon: <FaCode size={20} />,      title: 'We Build',          desc: 'Our team gets to work, keeping you updated throughout.' },
  { icon: <FaRocket size={20} />,    title: 'Launch & Support',  desc: 'We deliver your project and provide ongoing support after launch.' },
]

// ── Star Rating Component ──
const StarRating = ({ rating, onRate, interactive = false }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type={interactive ? 'button' : 'button'}
        onClick={() => interactive && onRate && onRate(star)}
        className={interactive ? 'cursor-pointer' : 'cursor-default'}
      >
        <FaStar
          size={interactive ? 24 : 14}
          className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
        />
      </button>
    ))}
  </div>
)

const DigitalServices = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // ── Tab management ──
  const getTabFromUrl = () => {
    const tab = searchParams.get('tab')
    return VALID_TABS.includes(tab) ? tab : 'services'
  }

  const [activeTab, setActiveTab] = useState(getTabFromUrl)

  // ── Data from backend ──
  const [projects, setProjects]           = useState([])
  const [clientReviews, setClientReviews] = useState([])
  const [loadingData, setLoadingData]     = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')

  // ── Quote form ──
  const [quoteForm, setQuoteForm] = useState({
    fullName: '', email: '', phone: '', businessName: '',
    serviceType: '', projectDetails: '', budget: '', timeline: '',
  })
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteSuccess, setQuoteSuccess] = useState(false)
  const [quoteError, setQuoteError]     = useState('')

  // ── Review form ──
  const [reviewForm, setReviewForm] = useState({
    clientName: '', clientEmail: '', businessName: '',
    rating: 5, title: '', reviewText: '', serviceUsed: 'Website Development',
  })
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [reviewError, setReviewError]     = useState('')

  // ── Sync tab from URL ──
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && VALID_TABS.includes(tab)) {
      setActiveTab(tab)
    } else if (!tab) {
      setActiveTab('services')
    }
  }, [searchParams])

  // ── Scroll to top on tab change ──
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

  // ── Fetch projects & reviews from backend ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)
        const [projRes, revRes] = await Promise.all([
          axios.get(`${API_URL}/digital/projects`),
          axios.get(`${API_URL}/digital/reviews`),
        ])
        if (projRes.data.success) setProjects(projRes.data.data || [])
        if (revRes.data.success) setClientReviews(revRes.data.data || [])
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [])

  // ── Change tab ──
  const changeTab = (tabId, serviceTitle = '') => {
    setActiveTab(tabId)
    setQuoteError('')
    setQuoteSuccess(false)
    setReviewError('')
    setReviewSuccess(false)
    if (serviceTitle) {
      setQuoteForm(prev => ({ ...prev, serviceType: serviceTitle }))
    }
    setSearchParams(tabId === 'services' ? {} : { tab: tabId })
  }

  // ── Quote form submit → WhatsApp ──
  const handleQuoteSubmit = async (e) => {
    e.preventDefault()
    try {
      setQuoteLoading(true)
      setQuoteError('')

      const message = encodeURIComponent(
        `*New Digital Service Enquiry - 75TechStore*\n\n` +
        `*Name:* ${quoteForm.fullName}\n` +
        `*Email:* ${quoteForm.email}\n` +
        `*Phone:* ${quoteForm.phone}\n` +
        `*Business:* ${quoteForm.businessName || 'N/A'}\n` +
        `*Service:* ${quoteForm.serviceType}\n` +
        `*Budget:* ${quoteForm.budget}\n` +
        `*Timeline:* ${quoteForm.timeline}\n\n` +
        `*Project Details:*\n${quoteForm.projectDetails}`
      )

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
      setQuoteSuccess(true)
      setQuoteForm({
        fullName: '', email: '', phone: '', businessName: '',
        serviceType: '', projectDetails: '', budget: '', timeline: '',
      })
    } catch (err) {
      setQuoteError('Something went wrong. Please try again.')
    } finally {
      setQuoteLoading(false)
    }
  }

  // ── Review form submit → backend ──
  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    try {
      setReviewLoading(true)
      setReviewError('')
      const { data } = await axios.post(`${API_URL}/digital/reviews`, reviewForm)
      if (data.success) {
        setReviewSuccess(true)
        setReviewForm({
          clientName: '', clientEmail: '', businessName: '',
          rating: 5, title: '', reviewText: '',
          serviceUsed: 'Website Development',
        })
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setReviewLoading(false)
    }
  }

  // ── Filtered projects ──
  const filteredProjects = projects.filter(p =>
    filterCategory === 'All' || p.category === filterCategory
  )

  // ── Average rating ──
  const avgRating = clientReviews.length > 0
    ? (clientReviews.reduce((sum, r) => sum + r.rating, 0) / clientReviews.length).toFixed(1)
    : '5.0'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════════════════ */}
      {/* HERO */}
      {/* ══════════════════════════════════════════════ */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-800
        to-purple-900 text-white py-20 px-4 relative overflow-hidden">

        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 border
            border-white/30 rounded-full" />
          <div className="absolute bottom-10 left-10 w-40 h-40 border
            border-white/20 rounded-full" />
          <div className="absolute top-1/3 left-1/3 w-96 h-96 border
            border-white/10 rounded-full" />
        </div>
        <div className="absolute top-12 left-12 text-white/10 hidden lg:block">
          <FaCode size={80} />
        </div>
        <div className="absolute bottom-12 right-12 text-white/10 hidden lg:block">
          <FaGlobe size={80} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10
            border border-white/20 rounded-full px-4 py-2 text-sm
            font-medium mb-6 backdrop-blur-sm">
            <FaRocket size={14} className="text-yellow-400" />
            <span>Tech Solutions for Your Business</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight">
            Digital Services That{' '}
            <span className="text-yellow-400">Grow</span> Your Business
          </h1>
          <p className="text-indigo-200 max-w-2xl mx-auto text-sm md:text-base
            leading-relaxed mb-10">
            From stunning websites to powerful mobile apps, SEO, digital
            marketing and more. We build the digital infrastructure your
            business needs to succeed online.
          </p>

          {/* Tab Buttons */}
          <div className="inline-flex bg-white/10 rounded-xl p-1.5
            backdrop-blur-sm border border-white/20 gap-1 flex-wrap
            justify-center">
            {[
              { id: 'services',  label: 'Our Services', icon: <FaGlobe size={13} />       },
              { id: 'portfolio', label: 'Our Work',     icon: <FaLaptopCode size={13} />  },
              { id: 'reviews',   label: `Reviews (${clientReviews.length})`, icon: <FaStar size={13} /> },
              { id: 'quote',     label: 'Get a Quote',  icon: <FaRocket size={13} />      },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => changeTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg
                  text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-700 shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-14 max-w-xl mx-auto">
            {[
              { value: `${projects.length || '50'}+`, label: 'Projects Completed' },
              { value: `${avgRating}★`,               label: 'Average Rating'     },
              { value: '24hr',                         label: 'Support Response'   },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-extrabold text-yellow-400">
                  {stat.value}
                </p>
                <p className="text-indigo-300 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* TAB: SERVICES */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'services' && (
        <div className="max-w-7xl mx-auto px-4 py-12">

          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              What We Offer
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Complete digital solutions tailored to your needs and budget.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {services.map((service) => {
              const cc = colorConfig[service.color]
              return (
                <div key={service.id} className="bg-white rounded-2xl border
                  border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1
                  transition-all duration-300 overflow-hidden group flex flex-col">
                  <div className={`${cc.bg} p-6 relative`}>
                    <span className={`absolute top-3 right-3 text-[10px]
                      font-bold px-2 py-1 rounded-full ${cc.badge}`}>
                      {service.tag}
                    </span>
                    <div className={`w-14 h-14 rounded-xl ${cc.bg} ${cc.text}
                      flex items-center justify-center mb-3 border ${cc.border}
                      group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>
                  <div className="p-5 flex-grow">
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2
                          text-gray-600 text-xs">
                          <FaCheckCircle size={11} className={`${cc.text} shrink-0`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-5 pb-5">
                    <p className={`text-xs font-semibold ${cc.text} mb-3`}>
                      ⏱ {service.deliverables}
                    </p>
                    <button
                      onClick={() => changeTab('quote', service.title)}
                      className={`w-full py-2.5 rounded-xl text-sm font-bold
                        transition-all duration-300 ${cc.text} ${cc.bg}
                        hover:opacity-80 border ${cc.border} flex items-center
                        justify-center gap-2`}
                    >
                      Get a Quote <FaChevronRight size={11} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50
            rounded-3xl p-10 mb-16">
            <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-2">
              How It Works
            </h2>
            <p className="text-gray-500 text-sm text-center mb-10">
              Getting started with us is simple and fast
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {processSteps.map((step, i) => (
                <div key={i} className="text-center relative">
                  {i < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-3/4
                      w-1/2 h-0.5 bg-indigo-200 z-0" />
                  )}
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-indigo-600 text-white
                      rounded-2xl flex items-center justify-center mx-auto
                      mb-4 shadow-lg shadow-indigo-600/30">
                      {step.icon}
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

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-indigo-700 to-purple-700
            rounded-3xl p-10 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
              Ready to take your business online?
            </h2>
            <p className="text-indigo-200 mb-8 max-w-xl mx-auto text-sm">
              Get a free consultation and custom quote. No commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => changeTab('quote')}
                className="bg-white text-indigo-700 font-bold px-8 py-3.5
                  rounded-xl hover:bg-gray-100 transition shadow-lg flex
                  items-center justify-center gap-2 text-sm">
                <FaRocket size={16} /> Get a Free Quote
              </button>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank" rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-bold
                  px-8 py-3.5 rounded-xl transition shadow-lg flex items-center
                  justify-center gap-2 text-sm">
                <FaWhatsapp size={18} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* TAB: PORTFOLIO */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'portfolio' && (
        <div className="max-w-7xl mx-auto px-4 py-12">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Our Work
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Real projects we've built for real clients
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {serviceCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold
                  transition-all duration-300 ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loadingData && (
            <div className="flex items-center justify-center py-20">
              <FaSpinner size={32} className="animate-spin text-indigo-600" />
            </div>
          )}

          {/* No projects */}
          {!loadingData && filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <FaLaptopCode size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-700 font-semibold text-lg mb-2">
                No projects yet
              </h3>
              <p className="text-gray-500 text-sm">
                Portfolio projects will appear here once added by admin
              </p>
            </div>
          )}

          {/* Projects Grid */}
          {!loadingData && filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project._id} className="bg-white rounded-2xl border
                  border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1
                  transition-all duration-300 overflow-hidden group">

                  {/* Image */}
                  <div className="relative h-52 bg-gray-100 overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105
                        transition-transform duration-500"
                    />
                    {project.isFeatured && (
                      <span className="absolute top-3 left-3 bg-yellow-400
                        text-yellow-900 text-[10px] font-bold px-2 py-1
                        rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 right-3 bg-white text-indigo-600
                          p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100
                          transition-all duration-300 hover:bg-indigo-600
                          hover:text-white">
                        <FaExternalLinkAlt size={12} />
                      </a>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <span className="text-[10px] bg-indigo-100 text-indigo-700
                      font-semibold px-2 py-0.5 rounded-full">
                      {project.category}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base mt-2 mb-1">
                      {project.title}
                    </h3>
                    <p className="text-indigo-600 text-xs font-medium mb-2">
                      Client: {project.clientName}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4
                      line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech stack */}
                    {project.techUsed?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.techUsed.map((tech, i) => (
                          <span key={i} className="bg-gray-100 text-gray-600
                            text-[10px] font-medium px-2 py-0.5 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-indigo-600
                          text-xs font-semibold hover:underline">
                        <FaExternalLinkAlt size={10} /> View Live Site
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-14 bg-gradient-to-r from-indigo-600 to-purple-700
            rounded-2xl p-8 text-white text-center">
            <h3 className="text-xl font-bold mb-2">
              Want us to build something like this for you?
            </h3>
            <p className="text-indigo-200 text-sm mb-5">
              Get a free quote today - no obligation
            </p>
            <button
              onClick={() => changeTab('quote')}
              className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-xl
                hover:bg-gray-100 transition text-sm inline-flex items-center gap-2"
            >
              <FaRocket size={14} /> Start Your Project
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* TAB: REVIEWS */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'reviews' && (
        <div className="max-w-6xl mx-auto px-4 py-12">

          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Client Reviews
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Honest feedback from our clients
            </p>

            {/* Rating summary */}
            {clientReviews.length > 0 && (
              <div className="inline-flex items-center gap-3 bg-yellow-50
                border border-yellow-100 rounded-2xl px-6 py-3 mt-4">
                <div className="text-4xl font-extrabold text-yellow-500">
                  {avgRating}
                </div>
                <div>
                  <StarRating rating={Math.round(Number(avgRating))} />
                  <p className="text-gray-500 text-xs mt-1">
                    Based on {clientReviews.length} review{clientReviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Reviews List */}
            <div className="lg:col-span-2">
              {loadingData && (
                <div className="flex items-center justify-center py-20">
                  <FaSpinner size={32} className="animate-spin text-indigo-600" />
                </div>
              )}

              {!loadingData && clientReviews.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100
                  p-12 text-center">
                  <FaStar size={40} className="text-gray-200 mx-auto mb-4" />
                  <h3 className="text-gray-700 font-semibold mb-1">
                    No reviews yet
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Be the first to leave a review!
                  </p>
                </div>
              )}

              {!loadingData && clientReviews.length > 0 && (
                <div className="space-y-4">
                  {clientReviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-2xl
                      border border-gray-100 shadow-sm p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-600 rounded-full
                            flex items-center justify-center text-white font-bold
                            text-sm">
                            {review.clientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {review.clientName}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {review.businessName || 'Customer'} · {review.serviceUsed}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <StarRating rating={review.rating} />
                          <p className="text-gray-400 text-xs mt-1">
                            {new Date(review.createdAt).toLocaleDateString('en-NG', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      {review.title && (
                        <p className="font-semibold text-gray-800 text-sm mb-2">
                          "{review.title}"
                        </p>
                      )}
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {review.reviewText}
                      </p>

                      {review.isFeatured && (
                        <div className="mt-3 flex items-center gap-1">
                          <FaStar size={10} className="text-yellow-400" />
                          <span className="text-yellow-600 text-[10px] font-bold">
                            Featured Review
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Review Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100
                shadow-sm p-6 sticky top-4">
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  Leave a Review
                </h3>
                <p className="text-gray-500 text-xs mb-5">
                  Worked with us? Share your experience!
                </p>

                {reviewSuccess ? (
                  <div className="text-center py-8">
                    <FaCheckCircle size={40}
                      className="text-green-500 mx-auto mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">
                      Thank you! 🎉
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Your review has been submitted and will appear after
                      admin approval.
                    </p>
                    <button
                      onClick={() => setReviewSuccess(false)}
                      className="text-indigo-600 text-sm font-semibold
                        hover:underline">
                      Submit another review
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {reviewError && (
                      <div className="bg-red-50 text-red-600 text-xs p-3
                        rounded-lg border border-red-100">
                        ⚠️ {reviewError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold
                        text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input type="text" value={reviewForm.clientName}
                        onChange={(e) => setReviewForm({
                          ...reviewForm, clientName: e.target.value
                        })}
                        required placeholder="John Doe"
                        className="w-full px-3 py-2.5 rounded-xl border
                          border-gray-200 focus:ring-2 focus:ring-indigo-500
                          focus:border-transparent outline-none bg-gray-50
                          text-sm" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold
                        text-gray-700 mb-1">
                        Business Name
                      </label>
                      <input type="text" value={reviewForm.businessName}
                        onChange={(e) => setReviewForm({
                          ...reviewForm, businessName: e.target.value
                        })}
                        placeholder="Your company (optional)"
                        className="w-full px-3 py-2.5 rounded-xl border
                          border-gray-200 focus:ring-2 focus:ring-indigo-500
                          focus:border-transparent outline-none bg-gray-50
                          text-sm" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold
                        text-gray-700 mb-1">
                        Email
                      </label>
                      <input type="email" value={reviewForm.clientEmail}
                        onChange={(e) => setReviewForm({
                          ...reviewForm, clientEmail: e.target.value
                        })}
                        placeholder="you@email.com (optional)"
                        className="w-full px-3 py-2.5 rounded-xl border
                          border-gray-200 focus:ring-2 focus:ring-indigo-500
                          focus:border-transparent outline-none bg-gray-50
                          text-sm" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold
                        text-gray-700 mb-1">
                        Service Used *
                      </label>
                      <select value={reviewForm.serviceUsed}
                        onChange={(e) => setReviewForm({
                          ...reviewForm, serviceUsed: e.target.value
                        })}
                        className="w-full px-3 py-2.5 rounded-xl border
                          border-gray-200 focus:ring-2 focus:ring-indigo-500
                          focus:border-transparent outline-none bg-gray-50
                          text-sm">
                        {serviceCategories.filter(c => c !== 'All').map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold
                        text-gray-700 mb-2">
                        Your Rating *
                      </label>
                      <StarRating
                        rating={reviewForm.rating}
                        interactive={true}
                        onRate={(star) => setReviewForm({
                          ...reviewForm, rating: star
                        })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold
                        text-gray-700 mb-1">
                        Review Title
                      </label>
                      <input type="text" value={reviewForm.title}
                        onChange={(e) => setReviewForm({
                          ...reviewForm, title: e.target.value
                        })}
                        placeholder="Summarize your experience"
                        className="w-full px-3 py-2.5 rounded-xl border
                          border-gray-200 focus:ring-2 focus:ring-indigo-500
                          focus:border-transparent outline-none bg-gray-50
                          text-sm" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold
                        text-gray-700 mb-1">
                        Your Review *
                      </label>
                      <textarea value={reviewForm.reviewText}
                        onChange={(e) => setReviewForm({
                          ...reviewForm, reviewText: e.target.value
                        })}
                        required rows="4"
                        placeholder="Tell others about your experience..."
                        className="w-full px-3 py-2.5 rounded-xl border
                          border-gray-200 focus:ring-2 focus:ring-indigo-500
                          focus:border-transparent outline-none bg-gray-50
                          text-sm resize-none" />
                    </div>

                    <button type="submit" disabled={reviewLoading}
                      className="w-full bg-indigo-600 text-white font-bold
                        py-3 rounded-xl hover:bg-indigo-700 transition
                        flex items-center justify-center gap-2 text-sm
                        disabled:opacity-70 disabled:cursor-not-allowed">
                      {reviewLoading ? (
                        <><FaSpinner className="animate-spin" size={14} />
                          Submitting...</>
                      ) : '⭐ Submit Review'}
                    </button>

                    <p className="text-[10px] text-gray-400 text-center">
                      Reviews are moderated before appearing publicly
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* TAB: GET A QUOTE */}
      {/* ══════════════════════════════════════════════ */}
      {activeTab === 'quote' && (
        <div className="max-w-4xl mx-auto px-4 py-12">

          {/* Success Screen */}
          {quoteSuccess && (
            <div className="bg-white rounded-3xl shadow-xl border
              border-gray-100 p-10 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-500
                rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Quote Request Sent! 🚀
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Your request has been sent via WhatsApp. We'll reply with a
                custom quote within <strong>24 hours</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => changeTab('services')}
                  className="bg-indigo-600 text-white font-bold px-6 py-3
                    rounded-xl hover:bg-indigo-700 transition text-sm">
                  View Our Services
                </button>
                <button onClick={() => setQuoteSuccess(false)}
                  className="bg-gray-100 text-gray-700 font-semibold px-6
                    py-3 rounded-xl hover:bg-gray-200 transition text-sm">
                  Submit Another
                </button>
              </div>
            </div>
          )}

          {!quoteSuccess && (
            <div className="bg-white rounded-3xl shadow-xl border
              border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-700 to-purple-700
                text-white p-8">
                <h2 className="text-2xl font-bold mb-2">Get a Free Quote</h2>
                <p className="text-indigo-200 text-sm leading-relaxed">
                  Tell us about your project and we'll send you a custom
                  proposal within 24 hours. No hidden fees, no commitment.
                </p>
              </div>

              <div className="p-8">
                {quoteError && (
                  <div className="bg-red-50 border border-red-200 text-red-600
                    px-4 py-3 rounded-xl text-sm mb-6 font-medium">
                    ⚠️ {quoteError}
                  </div>
                )}

                <form onSubmit={handleQuoteSubmit} className="space-y-6">

                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase
                      tracking-wider mb-4 flex items-center gap-2">
                      <FaHeadset size={12} /> Your Contact Information
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" value={quoteForm.fullName}
                          onChange={(e) => setQuoteForm({
                            ...quoteForm, fullName: e.target.value
                          })}
                          required placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-indigo-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Phone / WhatsApp{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <input type="tel" value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({
                            ...quoteForm, phone: e.target.value
                          })}
                          required placeholder="080XXXXXXXX"
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-indigo-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input type="email" value={quoteForm.email}
                          onChange={(e) => setQuoteForm({
                            ...quoteForm, email: e.target.value
                          })}
                          required placeholder="you@email.com"
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-indigo-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Business Name
                        </label>
                        <input type="text" value={quoteForm.businessName}
                          onChange={(e) => setQuoteForm({
                            ...quoteForm, businessName: e.target.value
                          })}
                          placeholder="Your company name (optional)"
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-indigo-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase
                      tracking-wider mb-4 flex items-center gap-2">
                      <FaCode size={12} /> Project Details
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Service Needed <span className="text-red-500">*</span>
                        </label>
                        <select value={quoteForm.serviceType}
                          onChange={(e) => setQuoteForm({
                            ...quoteForm, serviceType: e.target.value
                          })}
                          required
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-indigo-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm">
                          <option value="">Select a service...</option>
                          {services.map((s) => (
                            <option key={s.id} value={s.title}>{s.title}</option>
                          ))}
                          <option value="Multiple Services">Multiple Services</option>
                          <option value="Not Sure">Not Sure - Need Consultation</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Budget Range <span className="text-red-500">*</span>
                        </label>
                        <select value={quoteForm.budget}
                          onChange={(e) => setQuoteForm({
                            ...quoteForm, budget: e.target.value
                          })}
                          required
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-indigo-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm">
                          <option value="">Select budget...</option>
                          <option value="Under ₦100,000">Under ₦100,000</option>
                          <option value="₦100,000 - ₦300,000">₦100,000 - ₦300,000</option>
                          <option value="₦300,000 - ₦500,000">₦300,000 - ₦500,000</option>
                          <option value="₦500,000 - ₦1,000,000">₦500,000 - ₦1,000,000</option>
                          <option value="Above ₦1,000,000">Above ₦1,000,000</option>
                          <option value="To be discussed">To be discussed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Timeline <span className="text-red-500">*</span>
                        </label>
                        <select value={quoteForm.timeline}
                          onChange={(e) => setQuoteForm({
                            ...quoteForm, timeline: e.target.value
                          })}
                          required
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-indigo-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm">
                          <option value="">Select timeline...</option>
                          <option value="ASAP">As soon as possible</option>
                          <option value="Within 1 month">Within 1 month</option>
                          <option value="1-3 months">1 - 3 months</option>
                          <option value="3-6 months">3 - 6 months</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold
                        text-gray-700 mb-1.5">
                        Tell us about your project{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea value={quoteForm.projectDetails}
                        onChange={(e) => setQuoteForm({
                          ...quoteForm, projectDetails: e.target.value
                        })}
                        rows="5" required
                        placeholder="Describe your project in detail. What do you want to build? Who is your target audience? Any specific features needed?"
                        className="w-full px-4 py-3 rounded-xl border
                          border-gray-200 focus:ring-2 focus:ring-indigo-500
                          focus:border-transparent outline-none bg-gray-50
                          resize-none text-sm" />
                    </div>
                  </div>

                  {/* Info note */}
                  <div className="bg-indigo-50 border border-indigo-100
                    rounded-xl p-4 flex items-start gap-3">
                    <FaWhatsapp size={18}
                      className="text-green-600 shrink-0 mt-0.5" />
                    <p className="text-indigo-700 text-xs leading-relaxed">
                      <strong>How it works:</strong> Clicking submit will open
                      WhatsApp with your project details pre-filled. Send it
                      to our team and we'll reply with a custom quote within
                      24 hours.
                    </p>
                  </div>

                  <button type="submit" disabled={quoteLoading}
                    className="w-full bg-indigo-600 text-white font-bold py-4
                      rounded-xl hover:bg-indigo-700 active:scale-95 transition-all
                      shadow-lg shadow-indigo-600/30 flex items-center justify-center
                      gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm">
                    {quoteLoading ? (
                      <><FaSpinner className="animate-spin" size={16} /> Sending...</>
                    ) : (
                      <><FaWhatsapp size={18} /> Send via WhatsApp</>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Free consultation · No commitment · Response within 24hrs
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DigitalServices