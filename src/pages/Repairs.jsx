// src/pages/Repairs.jsx
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaTools, FaMobileAlt, FaLaptop, FaDesktop, FaTabletAlt,
  FaGamepad, FaClock, FaPrint, FaTv, FaSearch, FaCheckCircle,
  FaSpinner, FaTruck, FaWalking, FaMapMarkerAlt, FaPhoneAlt,
  FaChevronRight, FaShieldAlt, FaWrench
} from 'react-icons/fa'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const repairDevices = [
  { icon: <FaMobileAlt size={28} />, name: 'Smartphones',    desc: 'iPhone, Samsung, Tecno, Infinix & more' },
  { icon: <FaLaptop size={28} />,    name: 'Laptops',         desc: 'HP, Dell, Lenovo, MacBook, Asus & more' },
  { icon: <FaDesktop size={28} />,   name: 'Desktops',        desc: 'Custom PCs, All-in-Ones, Workstations'  },
  { icon: <FaTabletAlt size={28} />, name: 'Tablets',         desc: 'iPad, Samsung Tab, Surface & more'      },
  { icon: <FaGamepad size={28} />,   name: 'Gaming Consoles', desc: 'PS5, Xbox, Nintendo Switch'             },
  { icon: <FaClock size={28} />,     name: 'Smartwatches',    desc: 'Apple Watch, Samsung Watch, Fitbit'     },
  { icon: <FaTv size={28} />,        name: 'Monitors',        desc: 'LED, LCD, Curved screens'               },
  { icon: <FaPrint size={28} />,     name: 'Printers',        desc: 'HP, Canon, Epson, Brother'              },
]

const repairServices = [
  { name: 'Screen / Display Repair',  icon: '📱' },
  { name: 'Battery Replacement',      icon: '🔋' },
  { name: 'Charging Port Fix',        icon: '🔌' },
  { name: 'Software / OS Issues',     icon: '💻' },
  { name: 'Motherboard Repair',       icon: '🔧' },
  { name: 'Keyboard Replacement',     icon: '⌨️' },
  { name: 'Water Damage Recovery',    icon: '💧' },
  { name: 'Speaker / Mic Fix',        icon: '🔊' },
  { name: 'Camera Repair',            icon: '📷' },
  { name: 'Storage / RAM Upgrade',    icon: '💾' },
  { name: 'Virus Removal',            icon: '🛡️' },
  { name: 'Data Recovery',            icon: '📂' },
]

const statusSteps = [
  'Booked',
  'Device Received',
  'Diagnosing',
  'Awaiting Parts',
  'Repairing',
  'Testing',
  'Ready for Pickup',
  'Completed',
]

const VALID_TABS = ['services', 'book', 'track']

const Repairs = () => {
  // ✅ Read URL search params
  const [searchParams, setSearchParams] = useSearchParams()

  // ✅ Initialize activeTab from URL ?tab= param
  const getTabFromUrl = () => {
    const tab = searchParams.get('tab')
    return VALID_TABS.includes(tab) ? tab : 'services'
  }

  const [activeTab, setActiveTab] = useState(getTabFromUrl)
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState(false)
  const [error, setError]         = useState('')
  const [bookingData, setBookingData] = useState(null)

  const [form, setForm] = useState({
    customerName:     '',
    customerEmail:    '',
    customerPhone:    '',
    deviceType:       'Smartphone',
    deviceBrand:      '',
    deviceModel:      '',
    issueCategory:    'Screen/Display',
    issueDescription: '',
    dropOffMethod:    'Walk-in',
    preferredDate:    '',
    preferredTime:    '9:00 AM - 10:00 AM',
    dispatchAddress:  '',
  })

  const [trackId, setTrackId]         = useState('')
  const [trackResult, setTrackResult] = useState(null)
  const [trackError, setTrackError]   = useState('')
  const [tracking, setTracking]       = useState(false)

  // ✅ When URL ?tab= changes (e.g. navbar clicks "Track My Repair")
  // sync activeTab with URL
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && VALID_TABS.includes(tab)) {
      setActiveTab(tab)
    } else if (!tab) {
      setActiveTab('services')
    }
  }, [searchParams])

  // ✅ Scroll to top whenever activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

  // ✅ Change tab - updates BOTH state AND URL param
  const changeTab = (tabId) => {
    setActiveTab(tabId)
    setSuccess(false)
    setError('')
    setTrackError('')
    setTrackResult(null)

    // Update URL without page reload
    setSearchParams(tabId === 'services' ? {} : { tab: tabId })
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const { data } = await axios.post(`${API_URL}/repairs`, form)
      if (data.success) {
        setBookingData(data.data)
        setSuccess(true)
        setForm({
          customerName: '', customerEmail: '', customerPhone: '',
          deviceType: 'Smartphone', deviceBrand: '', deviceModel: '',
          issueCategory: 'Screen/Display', issueDescription: '',
          dropOffMethod: 'Walk-in', preferredDate: '',
          preferredTime: '9:00 AM - 10:00 AM', dispatchAddress: '',
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book repair')
    } finally {
      setLoading(false)
    }
  }

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!trackId.trim()) return
    try {
      setTracking(true)
      setTrackError('')
      setTrackResult(null)
      const { data } = await axios.get(`${API_URL}/repairs/track/${trackId.trim()}`)
      if (data.success) setTrackResult(data.data)
    } catch (err) {
      setTrackError(err.response?.data?.message || 'Repair not found. Check your ID.')
    } finally {
      setTracking(false)
    }
  }

  const getMinDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900
        text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white/30 rounded-full" />
          <div className="absolute bottom-10 right-20 w-60 h-60 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 border border-white/10
            rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16
            bg-white/20 rounded-2xl mb-5 backdrop-blur-sm">
            <FaTools size={28} />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Device Repair Services
          </h1>
          <p className="text-blue-200 max-w-2xl mx-auto text-sm md:text-base
            leading-relaxed mb-8">
            Expert repairs for all your gadgets. Walk in to our shop or send
            your device via dispatch. Fast turnaround, genuine parts,
            certified technicians.
          </p>

          {/* ✅ Tab buttons - uses changeTab() which updates URL */}
          <div className="inline-flex bg-white/10 rounded-xl p-1.5
            backdrop-blur-sm border border-white/20">
            {[
              { id: 'services', label: 'What We Fix',     icon: <FaWrench size={14} /> },
              { id: 'book',     label: 'Book a Repair',   icon: <FaTools size={14} />  },
              { id: 'track',    label: 'Track My Repair', icon: <FaSearch size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => changeTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg
                  text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-700 shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB: WHAT WE FIX ── */}
      {activeTab === 'services' && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Devices We Repair
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">
              We fix all major brands and models
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {repairDevices.map((device, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100
                  p-5 text-center hover:shadow-lg hover:-translate-y-1
                  transition-all duration-300 group">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl
                    flex items-center justify-center mx-auto mb-3
                    group-hover:bg-blue-600 group-hover:text-white
                    transition-all duration-300">
                    {device.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    {device.name}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {device.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Common Repairs
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">
              Issues we fix every day — prices vary based on device and market value
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {repairServices.map((service, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100
                  px-4 py-3.5 flex items-center gap-3 hover:border-blue-300
                  hover:shadow-sm transition-all duration-300">
                  <span className="text-xl">{service.icon}</span>
                  <span className="text-sm font-medium text-gray-800">
                    {service.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50
            rounded-2xl p-8 flex flex-col md:flex-row items-center
            justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Ready to get your device fixed?
              </h3>
              <p className="text-gray-600 text-sm">
                Book a repair appointment or walk in to our shop today.
              </p>
            </div>
            <button
              onClick={() => changeTab('book')}
              className="bg-blue-600 text-white font-bold px-8 py-3.5
                rounded-xl hover:bg-blue-700 transition shadow-lg
                shadow-blue-600/30 flex items-center gap-2 text-sm
                whitespace-nowrap shrink-0"
            >
              Book a Repair <FaChevronRight size={12} />
            </button>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FaShieldAlt size={22} />,
                title: 'Certified Technicians',
                desc: 'All our engineers are trained and certified to handle your devices with care.',
              },
              {
                icon: <FaClock size={22} />,
                title: 'Fast Turnaround',
                desc: 'Most repairs completed within 24-48 hours. Complex repairs within 3-5 days.',
              },
              {
                icon: <FaTools size={22} />,
                title: 'Genuine Parts',
                desc: 'We use only quality and genuine replacement parts for all repairs.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100
                p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl
                  flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: BOOK A REPAIR ── */}
      {activeTab === 'book' && (
        <div className="max-w-3xl mx-auto px-4 py-12">
          {success && bookingData && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100
              p-8 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full
                flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Repair Booked Successfully! 🎉
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your repair appointment has been confirmed. Save your tracking
                ID to check the status anytime.
              </p>
              <div className="bg-blue-50 border-2 border-blue-200 border-dashed
                rounded-2xl p-6 mb-8 max-w-sm mx-auto">
                <p className="text-xs text-blue-600 font-semibold uppercase
                  tracking-wider mb-2">Your Tracking ID</p>
                <p className="text-3xl font-extrabold text-blue-700 tracking-wider">
                  {bookingData.repairId}
                </p>
                <p className="text-xs text-blue-500 mt-2">
                  Save this ID to track your repair status
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setTrackId(bookingData.repairId)
                    changeTab('track')
                  }}
                  className="bg-blue-600 text-white font-bold px-6 py-3
                    rounded-xl hover:bg-blue-700 transition text-sm"
                >
                  Track My Repair
                </button>
                <button
                  onClick={() => { setSuccess(false); setBookingData(null) }}
                  className="bg-gray-100 text-gray-700 font-semibold px-6 py-3
                    rounded-xl hover:bg-gray-200 transition text-sm"
                >
                  Book Another Repair
                </button>
              </div>
            </div>
          )}

          {!success && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100
              overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700
                text-white p-6">
                <h2 className="text-xl font-bold mb-1">Book a Repair</h2>
                <p className="text-blue-200 text-sm">
                  Fill in your details and we'll get your device fixed.
                </p>
              </div>
              <div className="p-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600
                    px-4 py-3 rounded-xl text-sm mb-6 font-medium">
                    ⚠️ {error}
                  </div>
                )}
                <form onSubmit={handleBooking} className="space-y-6">

                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase
                      tracking-wider mb-3 flex items-center gap-2">
                      <FaPhoneAlt size={10} /> Your Information
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="customerName"
                          value={form.customerName} onChange={handleChange}
                          required placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-blue-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input type="tel" name="customerPhone"
                          value={form.customerPhone} onChange={handleChange}
                          required placeholder="080XXXXXXXX"
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-blue-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Email{' '}
                          <span className="text-gray-400 font-normal">
                            (optional)
                          </span>
                        </label>
                        <input type="email" name="customerEmail"
                          value={form.customerEmail} onChange={handleChange}
                          placeholder="you@email.com"
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-blue-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase
                      tracking-wider mb-3 flex items-center gap-2">
                      <FaMobileAlt size={10} /> Device Information
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Device Type <span className="text-red-500">*</span>
                        </label>
                        <select name="deviceType" value={form.deviceType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-blue-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm">
                          <option value="Smartphone">Smartphone</option>
                          <option value="Laptop">Laptop</option>
                          <option value="Desktop">Desktop</option>
                          <option value="Tablet">Tablet</option>
                          <option value="Gaming Console">Gaming Console</option>
                          <option value="Smartwatch">Smartwatch</option>
                          <option value="Monitor">Monitor</option>
                          <option value="Printer">Printer</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Brand <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="deviceBrand"
                          value={form.deviceBrand} onChange={handleChange}
                          required placeholder="e.g. Apple, Samsung..."
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-blue-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Model{' '}
                          <span className="text-gray-400 font-normal">
                            (optional)
                          </span>
                        </label>
                        <input type="text" name="deviceModel"
                          value={form.deviceModel} onChange={handleChange}
                          placeholder="e.g. iPhone 13, Galaxy S24..."
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-blue-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Issue Category <span className="text-red-500">*</span>
                        </label>
                        <select name="issueCategory" value={form.issueCategory}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-blue-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm">
                          <option value="Screen/Display">Screen / Display</option>
                          <option value="Battery">Battery</option>
                          <option value="Charging Port">Charging Port</option>
                          <option value="Software/OS">Software / OS</option>
                          <option value="Motherboard">Motherboard</option>
                          <option value="Keyboard">Keyboard</option>
                          <option value="Water Damage">Water Damage</option>
                          <option value="Speaker/Mic">Speaker / Mic</option>
                          <option value="Camera">Camera</option>
                          <option value="Storage/RAM Upgrade">
                            Storage / RAM Upgrade
                          </option>
                          <option value="Virus Removal">Virus Removal</option>
                          <option value="Data Recovery">Data Recovery</option>
                          <option value="General Diagnosis">General Diagnosis</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold
                        text-gray-700 mb-1.5">
                        Describe the Issue <span className="text-red-500">*</span>
                      </label>
                      <textarea name="issueDescription"
                        value={form.issueDescription} onChange={handleChange}
                        rows="3" required
                        placeholder="Describe what is wrong with your device..."
                        className="w-full px-4 py-3 rounded-xl border
                          border-gray-200 focus:ring-2 focus:ring-blue-500
                          focus:border-transparent outline-none bg-gray-50
                          resize-none text-sm" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase
                      tracking-wider mb-3 flex items-center gap-2">
                      <FaMapMarkerAlt size={10} /> Drop-off Method
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { value: 'Walk-in',  icon: <FaWalking size={18} />,
                          label: 'Walk-in',  desc: 'Bring it to our shop'  },
                        { value: 'Dispatch', icon: <FaTruck size={18} />,
                          label: 'Dispatch', desc: 'We pick it up'         },
                      ].map((method) => (
                        <button key={method.value} type="button"
                          onClick={() => setForm({
                            ...form, dropOffMethod: method.value
                          })}
                          className={`p-4 rounded-xl border-2 text-left
                            transition-all duration-300 ${
                            form.dropOffMethod === method.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}>
                          <div className={`mb-2 ${
                            form.dropOffMethod === method.value
                              ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                            {method.icon}
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {method.label}
                          </p>
                          <p className="text-gray-500 text-xs">{method.desc}</p>
                        </button>
                      ))}
                    </div>

                    {form.dropOffMethod === 'Dispatch' && (
                      <div className="mb-4">
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Pickup Address <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="dispatchAddress"
                          value={form.dispatchAddress} onChange={handleChange}
                          required={form.dropOffMethod === 'Dispatch'}
                          placeholder="Full address for pickup..."
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-blue-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm" />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Preferred Date <span className="text-red-500">*</span>
                        </label>
                        <input type="date" name="preferredDate"
                          value={form.preferredDate} onChange={handleChange}
                          min={getMinDate()} required
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-blue-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold
                          text-gray-700 mb-1.5">
                          Preferred Time <span className="text-red-500">*</span>
                        </label>
                        <select name="preferredTime" value={form.preferredTime}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border
                            border-gray-200 focus:ring-2 focus:ring-blue-500
                            focus:border-transparent outline-none bg-gray-50
                            text-sm">
                          <option>9:00 AM - 10:00 AM</option>
                          <option>10:00 AM - 11:00 AM</option>
                          <option>11:00 AM - 12:00 PM</option>
                          <option>12:00 PM - 1:00 PM</option>
                          <option>1:00 PM - 2:00 PM</option>
                          <option>2:00 PM - 3:00 PM</option>
                          <option>3:00 PM - 4:00 PM</option>
                          <option>4:00 PM - 5:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-4
                      rounded-xl hover:bg-blue-700 active:scale-95 transition-all
                      shadow-lg shadow-blue-600/30 flex items-center justify-center
                      gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm">
                    {loading
                      ? <><FaSpinner className="animate-spin" size={16} /> Booking...</>
                      : '🔧 Book Repair Appointment'
                    }
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: TRACK MY REPAIR ── */}
      {activeTab === 'track' && (
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100
            p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
              Track Your Repair
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              Enter your Repair Tracking ID to check the status
            </p>
            <form onSubmit={handleTrack} className="flex gap-3">
              <input
                type="text"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                placeholder="e.g. 75TR-0001"
                className="flex-grow px-4 py-3.5 rounded-xl border border-gray-200
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  outline-none bg-gray-50 text-sm font-mono text-center
                  tracking-widest uppercase"
              />
              <button type="submit" disabled={tracking}
                className="bg-blue-600 text-white font-bold px-6 py-3.5
                  rounded-xl hover:bg-blue-700 transition flex items-center
                  gap-2 text-sm disabled:opacity-70 shrink-0">
                {tracking
                  ? <FaSpinner className="animate-spin" size={16} />
                  : <FaSearch size={16} />
                }
                Track
              </button>
            </form>
            {trackError && (
              <div className="bg-red-50 border border-red-200 text-red-600
                px-4 py-3 rounded-xl text-sm mt-4 font-medium text-center">
                ❌ {trackError}
              </div>
            )}
          </div>

          {trackResult && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100
              overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700
                text-white p-6 flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-xs font-medium">Repair ID</p>
                  <p className="text-2xl font-extrabold tracking-wider">
                    {trackResult.repairId}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  trackResult.status === 'Completed'
                    ? 'bg-green-500 text-white'
                    : trackResult.status === 'Cancelled'
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-blue-700'
                }`}>
                  {trackResult.status}
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs text-gray-500 font-semibold uppercase
                  tracking-wider mb-4">Repair Progress</p>
                <div className="space-y-0">
                  {statusSteps.map((step, i) => {
                    const currentIdx  = statusSteps.indexOf(trackResult.status)
                    const isCompleted = i <= currentIdx
                    const isCurrent   = i === currentIdx
                    return (
                      <div key={step} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full border-2 flex
                            items-center justify-center shrink-0 ${
                            isCompleted
                              ? 'bg-blue-600 border-blue-600'
                              : 'bg-white border-gray-300'
                          }`}>
                            {isCompleted && (
                              <FaCheckCircle size={8} className="text-white" />
                            )}
                          </div>
                          {i < statusSteps.length - 1 && (
                            <div className={`w-0.5 h-8 ${
                              isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        <p className={`text-sm pb-6 ${
                          isCurrent
                            ? 'text-blue-700 font-bold'
                            : isCompleted
                            ? 'text-gray-700 font-medium'
                            : 'text-gray-400'
                        }`}>
                          {step}
                          {isCurrent && (
                            <span className="ml-2 text-xs bg-blue-100
                              text-blue-600 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="px-6 pb-6 grid grid-cols-2 gap-3">
                {[
                  { label: 'Device',     value: `${trackResult.deviceBrand} ${trackResult.deviceModel || ''}` },
                  { label: 'Type',       value: trackResult.deviceType                                        },
                  { label: 'Issue',      value: trackResult.issueCategory                                     },
                  { label: 'Drop-off',   value: trackResult.dropOffMethod                                     },
                  { label: 'Booked On',  value: new Date(trackResult.createdAt).toLocaleDateString('en-NG')   },
                  { label: 'Technician', value: trackResult.assignedTechnician || 'Not assigned yet'          },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 uppercase
                      tracking-wider font-semibold">{item.label}</p>
                    <p className="text-gray-900 font-medium text-sm mt-0.5">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {trackResult.diagnosisNotes && (
                <div className="px-6 pb-6">
                  <div className="bg-yellow-50 border border-yellow-100
                    rounded-xl p-4">
                    <p className="text-xs text-yellow-700 font-semibold
                      uppercase tracking-wider mb-1">Diagnosis Notes</p>
                    <p className="text-gray-800 text-sm">
                      {trackResult.diagnosisNotes}
                    </p>
                  </div>
                </div>
              )}

              {trackResult.estimatedCost && (
                <div className="px-6 pb-6">
                  <div className="bg-green-50 border border-green-100
                    rounded-xl p-4 flex items-center justify-between">
                    <p className="text-green-800 font-semibold text-sm">
                      Estimated Repair Cost
                    </p>
                    <p className="text-green-700 font-extrabold text-lg">
                      {trackResult.estimatedCost}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Repairs