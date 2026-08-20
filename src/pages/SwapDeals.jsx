// src/pages/SwapDeals.jsx
import React, { useState } from 'react'
import {
  FaExchangeAlt, FaMobileAlt, FaCheckCircle,
  FaSpinner, FaWhatsapp, FaCloudUploadAlt,
  FaArrowRight, FaTimes, FaInfoCircle,
} from 'react-icons/fa'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ── iPhone models ──
const iPhoneModels = [
  'iPhone 6', 'iPhone 6 Plus', 'iPhone 6s', 'iPhone 6s Plus',
  'iPhone 7', 'iPhone 7 Plus', 'iPhone 8', 'iPhone 8 Plus',
  'iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max',
  'iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max',
  'iPhone 12', 'iPhone 12 Mini', 'iPhone 12 Pro', 'iPhone 12 Pro Max',
  'iPhone 13', 'iPhone 13 Mini', 'iPhone 13 Pro', 'iPhone 13 Pro Max',
  'iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
  'iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
]

// ── Samsung models ──
const samsungModels = [
  'Galaxy S10', 'Galaxy S10+', 'Galaxy S10e',
  'Galaxy S20', 'Galaxy S20+', 'Galaxy S20 Ultra',
  'Galaxy S21', 'Galaxy S21+', 'Galaxy S21 Ultra',
  'Galaxy S22', 'Galaxy S22+', 'Galaxy S22 Ultra',
  'Galaxy S23', 'Galaxy S23+', 'Galaxy S23 Ultra',
  'Galaxy S24', 'Galaxy S24+', 'Galaxy S24 Ultra',
  'Galaxy A32', 'Galaxy A52', 'Galaxy A53', 'Galaxy A54',
  'Galaxy A72', 'Galaxy A73', 'Galaxy Note 20', 'Galaxy Note 20 Ultra',
  'Galaxy Z Flip 3', 'Galaxy Z Flip 4', 'Galaxy Z Flip 5',
  'Galaxy Z Fold 3', 'Galaxy Z Fold 4', 'Galaxy Z Fold 5',
]

const storageOptions = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB']

const conditionOptions = [
  {
    value: 'Excellent',
    label: 'Excellent',
    desc: 'No scratches, works perfectly, original parts',
    color: 'green',
  },
  {
    value: 'Good',
    label: 'Good',
    desc: 'Minor scratches, fully functional, may have minor wear',
    color: 'blue',
  },
  {
    value: 'Fair',
    label: 'Fair',
    desc: 'Visible scratches or dents, works but has minor issues',
    color: 'yellow',
  },
  {
    value: 'Poor',
    label: 'Poor',
    desc: 'Heavy damage, cracked screen, or major issues',
    color: 'red',
  },
]

const colorMap = {
  green:  'border-green-400 bg-green-50 text-green-700',
  blue:   'border-blue-400 bg-blue-50 text-blue-700',
  yellow: 'border-yellow-400 bg-yellow-50 text-yellow-700',
  red:    'border-red-400 bg-red-50 text-red-700',
}

const SwapDeals = () => {
  const [step, setStep]           = useState(1) // 1=their device, 2=what they want, 3=contact
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState(false)
  const [swapId, setSwapId]       = useState('')
  const [error, setError]         = useState('')
  const [uploadingMedia, setUploadingMedia] = useState(false)

  const [form, setForm] = useState({
    // Customer
    customerName:        '',
    customerPhone:       '',
    customerEmail:       '',
    // Their device
    deviceBrand:         '',
    deviceModel:         '',
    deviceStorage:       '',
    deviceCondition:     '',
    hasRepairs:          false,
    repairDetails:       '',
    hasChangedParts:     false,
    changedPartsDetails: '',
    batteryHealth:       '',
    mediaUrls:           [],
    // What they want
    wantedBrand:         '',
    wantedModel:         '',
    wantedStorage:       '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Reset model when brand changes
      ...(name === 'deviceBrand' ? { deviceModel: '' } : {}),
    }))
  }

  // ── Get models based on brand ──
  const getModels = (brand) => {
    if (brand === 'iPhone')  return iPhoneModels
    if (brand === 'Samsung') return samsungModels
    return []
  }

  // ── Media upload (Cloudinary via your existing /api/upload) ──
  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    if (form.mediaUrls.length + files.length > 5) {
      setError('Maximum 5 photos/videos allowed')
      return
    }

    setUploadingMedia(true)
    setError('')

    try {
      const uploaded = []
      for (const file of files) {
        const fd = new FormData()
        fd.append('image', file)
        const { data } = await axios.post(`${API_URL}/upload`, fd)
        uploaded.push(data.imageUrl)
      }
      setForm(prev => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, ...uploaded]
      }))
    } catch (err) {
      setError('Media upload failed. Please try again.')
    } finally {
      setUploadingMedia(false)
    }
  }

  const removeMedia = (index) => {
    setForm(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index)
    }))
  }

  // ── Step validation ──
  const canProceedStep1 = () => {
    return (
      form.deviceBrand &&
      form.deviceModel &&
      form.deviceStorage &&
      form.deviceCondition
    )
  }

  const canProceedStep2 = () => {
    return form.wantedBrand
  }

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.customerName || !form.customerPhone) {
      setError('Please fill in your name and phone number')
      return
    }

    try {
      setLoading(true)
      setError('')

      const { data } = await axios.post(`${API_URL}/swap`, form)

      if (data.success) {
        setSwapId(data.data.swapId)
        setSuccess(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ── Step indicator ──
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-0 mb-8">
      {[
        { num: 1, label: 'Your Device' },
        { num: 2, label: 'Want Device' },
        { num: 3, label: 'Contact'     },
      ].map((s, i) => (
        <React.Fragment key={s.num}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center
              justify-center font-bold text-sm transition-all duration-300 ${
              step === s.num
                ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/30'
                : step > s.num
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step > s.num ? '✓' : s.num}
            </div>
            <p className={`text-xs mt-1 font-medium ${
              step === s.num ? 'text-orange-500' : 'text-gray-400'
            }`}>
              {s.label}
            </p>
          </div>
          {i < 2 && (
            <div className={`w-16 md:w-24 h-0.5 mb-5 transition-all
              duration-300 ${step > s.num ? 'bg-green-500' : 'bg-gray-200'}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )

  // ── Success Screen ──
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900
        via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg
          w-full text-center">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full
            flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            Swap Request Sent! 🎉
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Your swap deal request has been received. Our team will review
            your device details and contact you with an offer soon.
          </p>

          {/* Swap ID */}
          <div className="bg-orange-50 border-2 border-orange-200
            border-dashed rounded-2xl p-5 mb-6 mx-auto max-w-xs">
            <p className="text-xs text-orange-600 font-semibold uppercase
              tracking-wider mb-1">Your Swap ID</p>
            <p className="text-2xl font-extrabold text-orange-700 tracking-wider">
              {swapId}
            </p>
            <p className="text-xs text-orange-500 mt-1">
              Save this for reference
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-blue-800 text-sm font-semibold mb-2">
              📞 What happens next:
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Our team reviews your submission</li>
              <li>• We contact you via WhatsApp/Phone with an offer</li>
              <li>• You decide to accept or decline</li>
              <li>• If accepted, bring device to our store to complete swap</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setSuccess(false)
                setStep(1)
                setForm({
                  customerName: '', customerPhone: '', customerEmail: '',
                  deviceBrand: '', deviceModel: '', deviceStorage: '',
                  deviceCondition: '', hasRepairs: false, repairDetails: '',
                  hasChangedParts: false, changedPartsDetails: '',
                  batteryHealth: '', mediaUrls: [],
                  wantedBrand: '', wantedModel: '', wantedStorage: '',
                })
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white
                font-bold py-3 rounded-xl transition text-sm"
            >
              Submit Another Swap Request
            </button>
            <a href="/"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                font-semibold py-3 rounded-xl transition text-sm text-center">
              Back to Homepage
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900
      via-[#0b1b3f] to-gray-900">

      {/* ── HERO ── */}
      <div className="py-14 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-20 w-64 h-64 border
            border-orange-500 rounded-full" />
          <div className="absolute bottom-5 right-20 w-40 h-40 border
            border-orange-400 rounded-full" />
        </div>

        <div className="relative z-10">
          <span className="inline-block bg-orange-500 text-white text-xs
            font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Swap Deals
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Upgrade Without{' '}
            <span className="text-orange-400">Breaking the Bank</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base
            leading-relaxed">
            Trade in your iPhone or Samsung and get amazing value towards
            your next device. Fast, easy, and totally worth it.
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-3xl mx-auto px-4 pb-16">

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Card Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600
            text-white p-6 text-center">
            <h2 className="text-xl font-bold mb-1">
              Submit Your Swap Request
            </h2>
            <p className="text-orange-200 text-sm">
              Fill in the details below and we'll get back to you with an offer
            </p>
          </div>

          <div className="p-6 md:p-8">
            <StepIndicator />

            {/* ════════════════════════════════ */}
            {/* STEP 1: THEIR DEVICE           */}
            {/* ════════════════════════════════ */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  📱 Tell us about your device
                </h3>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700
                    mb-2">
                    Device Brand <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['iPhone', 'Samsung'].map((brand) => (
                      <button key={brand} type="button"
                        onClick={() => setForm(prev => ({
                          ...prev, deviceBrand: brand, deviceModel: ''
                        }))}
                        className={`py-4 rounded-xl border-2 font-bold text-sm
                          transition-all duration-300 flex items-center
                          justify-center gap-2 ${
                          form.deviceBrand === brand
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 text-gray-600 hover:border-orange-300'
                        }`}>
                        <FaMobileAlt size={18} />
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model */}
                {form.deviceBrand && (
                  <div>
                    <label className="block text-sm font-semibold
                      text-gray-700 mb-1.5">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <select name="deviceModel" value={form.deviceModel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border
                        border-gray-200 focus:ring-2 focus:ring-orange-500
                        focus:border-transparent outline-none bg-gray-50
                        text-sm">
                      <option value="">Select model...</option>
                      {getModels(form.deviceBrand).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Storage */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700
                    mb-2">
                    Storage Capacity <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {storageOptions.map((s) => (
                      <button key={s} type="button"
                        onClick={() => setForm(prev => ({
                          ...prev, deviceStorage: s
                        }))}
                        className={`py-2.5 rounded-xl border-2 text-sm
                          font-semibold transition-all duration-200 ${
                          form.deviceStorage === s
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 text-gray-600 hover:border-orange-300'
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700
                    mb-2">
                    Device Condition <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {conditionOptions.map((c) => (
                      <button key={c.value} type="button"
                        onClick={() => setForm(prev => ({
                          ...prev, deviceCondition: c.value
                        }))}
                        className={`p-3 rounded-xl border-2 text-left
                          transition-all duration-200 ${
                          form.deviceCondition === c.value
                            ? colorMap[c.color]
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                        <p className="font-bold text-sm">{c.label}</p>
                        <p className="text-xs mt-0.5 text-gray-500">
                          {c.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Battery Health (iPhone only) */}
                {form.deviceBrand === 'iPhone' && (
                  <div>
                    <label className="block text-sm font-semibold
                      text-gray-700 mb-1.5">
                      Battery Health{' '}
                      <span className="text-gray-400 font-normal">
                        (Settings → Battery → Battery Health)
                      </span>
                    </label>
                    <div className="relative">
                      <input type="text" name="batteryHealth"
                        value={form.batteryHealth} onChange={handleChange}
                        placeholder="e.g. 87%"
                        className="w-full px-4 py-3 rounded-xl border
                          border-gray-200 focus:ring-2 focus:ring-orange-500
                          focus:border-transparent outline-none bg-gray-50
                          text-sm" />
                    </div>
                    <div className="mt-2 bg-blue-50 border border-blue-100
                      rounded-lg p-2.5 flex items-start gap-2">
                      <FaInfoCircle size={13}
                        className="text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-blue-700 text-xs">
                        Battery health affects the value of your device.
                        80%+ is considered good.
                      </p>
                    </div>
                  </div>
                )}

                {/* Repairs */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl
                  p-4 space-y-3">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    Repair & Parts History
                  </h4>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="hasRepairs"
                      checked={form.hasRepairs} onChange={handleChange}
                      className="w-4 h-4 accent-orange-500" />
                    <span className="text-sm text-gray-700">
                      This device has been repaired before
                    </span>
                  </label>
                  {form.hasRepairs && (
                    <textarea name="repairDetails" value={form.repairDetails}
                      onChange={handleChange} rows="2"
                      placeholder="Describe the repairs (e.g. screen replaced, 
charging port fixed...)"
                      className="w-full px-4 py-2.5 rounded-xl border
                        border-gray-200 focus:ring-2 focus:ring-orange-500
                        focus:border-transparent outline-none bg-white
                        resize-none text-sm" />
                  )}

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="hasChangedParts"
                      checked={form.hasChangedParts} onChange={handleChange}
                      className="w-4 h-4 accent-orange-500" />
                    <span className="text-sm text-gray-700">
                      Parts have been changed (screen, battery, back glass, etc.)
                    </span>
                  </label>
                  {form.hasChangedParts && (
                    <textarea name="changedPartsDetails"
                      value={form.changedPartsDetails} onChange={handleChange}
                      rows="2"
                      placeholder="What parts were changed? 
(e.g. original screen replaced with aftermarket)"
                      className="w-full px-4 py-2.5 rounded-xl border
                        border-gray-200 focus:ring-2 focus:ring-orange-500
                        focus:border-transparent outline-none bg-white
                        resize-none text-sm" />
                  )}
                </div>

                {/* Media Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700
                    mb-1.5">
                    Photos & Videos of Your Device{' '}
                    <span className="text-gray-400 font-normal">(up to 5)</span>
                  </label>

                  {/* Upload button */}
                  <label className="cursor-pointer block">
                    <div className={`border-2 border-dashed rounded-xl p-5
                      text-center transition-all duration-300 ${
                      uploadingMedia
                        ? 'border-orange-300 bg-orange-50'
                        : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                    }`}>
                      {uploadingMedia ? (
                        <div className="flex flex-col items-center gap-2">
                          <FaSpinner size={24}
                            className="text-orange-500 animate-spin" />
                          <p className="text-orange-600 text-sm font-medium">
                            Uploading...
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <FaCloudUploadAlt size={28}
                            className="text-gray-400" />
                          <p className="text-gray-600 text-sm font-medium">
                            Click to upload photos/videos
                          </p>
                          <p className="text-gray-400 text-xs">
                            Show front, back, screen & any damage
                          </p>
                        </div>
                      )}
                    </div>
                    <input type="file" multiple accept="image/*,video/*"
                      onChange={handleMediaUpload} className="hidden"
                      disabled={uploadingMedia || form.mediaUrls.length >= 5} />
                  </label>

                  {/* Uploaded media preview */}
                  {form.mediaUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {form.mediaUrls.map((url, i) => (
                        <div key={i} className="relative group">
                          <img src={url} alt={`Upload ${i + 1}`}
                            className="w-full h-24 object-cover rounded-lg
                              border border-gray-200" />
                          <button type="button" onClick={() => removeMedia(i)}
                            className="absolute top-1 right-1 w-5 h-5
                              bg-red-500 text-white rounded-full flex
                              items-center justify-center opacity-0
                              group-hover:opacity-100 transition-opacity">
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    💡 Clear photos of front, back, screen and any
                    damage help us give you a better offer
                  </p>
                </div>

                {/* Next button */}
                <button type="button"
                  onClick={() => {
                    if (!canProceedStep1()) {
                      setError('Please fill in brand, model, storage and condition')
                      return
                    }
                    setError('')
                    setStep(2)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  disabled={!canProceedStep1()}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white
                    font-bold py-4 rounded-xl transition-all shadow-lg
                    shadow-orange-500/30 flex items-center justify-center gap-2
                    disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                  Continue <FaArrowRight size={14} />
                </button>
              </div>
            )}

            {/* ════════════════════════════════ */}
            {/* STEP 2: WHAT THEY WANT         */}
            {/* ════════════════════════════════ */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  🎯 What device do you want?
                </h3>

                {/* Wanted Brand */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700
                    mb-2">
                    Preferred Brand <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['iPhone', 'Samsung', 'Open to suggestions'].map((brand) => (
                      <button key={brand} type="button"
                        onClick={() => setForm(prev => ({
                          ...prev, wantedBrand: brand, wantedModel: ''
                        }))}
                        className={`py-3 px-2 rounded-xl border-2 text-xs
                          font-semibold transition-all duration-200 ${
                          form.wantedBrand === brand
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 text-gray-600 hover:border-orange-300'
                        }`}>
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wanted Model */}
                {form.wantedBrand && form.wantedBrand !== 'Open to suggestions' && (
                  <div>
                    <label className="block text-sm font-semibold
                      text-gray-700 mb-1.5">
                      Preferred Model{' '}
                      <span className="text-gray-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <select name="wantedModel" value={form.wantedModel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border
                        border-gray-200 focus:ring-2 focus:ring-orange-500
                        focus:border-transparent outline-none bg-gray-50
                        text-sm">
                      <option value="">Any model / Not sure yet</option>
                      {getModels(form.wantedBrand).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Wanted Storage */}
                {form.wantedBrand && form.wantedBrand !== 'Open to suggestions' && (
                  <div>
                    <label className="block text-sm font-semibold
                      text-gray-700 mb-2">
                      Preferred Storage{' '}
                      <span className="text-gray-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {storageOptions.map((s) => (
                        <button key={s} type="button"
                          onClick={() => setForm(prev => ({
                            ...prev, wantedStorage: prev.wantedStorage === s ? '' : s
                          }))}
                          className={`py-2.5 rounded-xl border-2 text-sm
                            font-semibold transition-all duration-200 ${
                            form.wantedStorage === s
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-200 text-gray-600 hover:border-orange-300'
                          }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary of their device */}
                <div className="bg-orange-50 border border-orange-200
                  rounded-xl p-4">
                  <p className="text-sm font-semibold text-orange-800 mb-2">
                    📋 Your Device Summary:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      { label: 'Brand',     value: form.deviceBrand     },
                      { label: 'Model',     value: form.deviceModel     },
                      { label: 'Storage',   value: form.deviceStorage   },
                      { label: 'Condition', value: form.deviceCondition },
                    ].map((item) => (
                      <div key={item.label}>
                        <span className="text-orange-600 text-xs">
                          {item.label}:
                        </span>
                        <span className="text-orange-900 font-semibold
                          ml-1 text-xs">
                          {item.value}
                        </span>
                      </div>
                    ))}
                    {form.deviceBrand === 'iPhone' && form.batteryHealth && (
                      <div>
                        <span className="text-orange-600 text-xs">Battery:</span>
                        <span className="text-orange-900 font-semibold ml-1 text-xs">
                          {form.batteryHealth}
                        </span>
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => setStep(1)}
                    className="text-orange-600 text-xs underline mt-2">
                    ← Edit device details
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl
                    text-sm border border-red-100">
                    ⚠️ {error}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700
                      font-semibold py-3.5 rounded-xl transition text-sm">
                    ← Back
                  </button>
                  <button type="button"
                    onClick={() => {
                      if (!canProceedStep2()) {
                        setError('Please select your preferred brand')
                        return
                      }
                      setError('')
                      setStep(3)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    disabled={!canProceedStep2()}
                    className="flex-1 bg-orange-500 hover:bg-orange-600
                      text-white font-bold py-3.5 rounded-xl transition
                      shadow-lg shadow-orange-500/30 flex items-center
                      justify-center gap-2 disabled:opacity-50 text-sm">
                    Continue <FaArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ════════════════════════════════ */}
            {/* STEP 3: CONTACT INFO           */}
            {/* ════════════════════════════════ */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  👤 Your Contact Details
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700
                    mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="customerName"
                    value={form.customerName} onChange={handleChange}
                    required placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200
                      focus:ring-2 focus:ring-orange-500 focus:border-transparent
                      outline-none bg-gray-50 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700
                    mb-1.5">
                    WhatsApp / Phone <span className="text-red-500">*</span>
                  </label>
                  <input type="tel" name="customerPhone"
                    value={form.customerPhone} onChange={handleChange}
                    required placeholder="080XXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200
                      focus:ring-2 focus:ring-orange-500 focus:border-transparent
                      outline-none bg-gray-50 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700
                    mb-1.5">
                    Email{' '}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input type="email" name="customerEmail"
                    value={form.customerEmail} onChange={handleChange}
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200
                      focus:ring-2 focus:ring-orange-500 focus:border-transparent
                      outline-none bg-gray-50 text-sm" />
                </div>

                {/* Full summary */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl
                  p-4">
                  <p className="font-semibold text-gray-800 text-sm mb-3">
                    📋 Full Swap Summary
                  </p>
                  <div className="space-y-1.5 text-xs">
                    <p className="text-gray-500 font-semibold uppercase
                      tracking-wider text-[10px] mb-1">
                      Your Device
                    </p>
                    {[
                      { label: 'Brand',     value: form.deviceBrand     },
                      { label: 'Model',     value: form.deviceModel     },
                      { label: 'Storage',   value: form.deviceStorage   },
                      { label: 'Condition', value: form.deviceCondition },
                      ...(form.deviceBrand === 'iPhone' && form.batteryHealth
                        ? [{ label: 'Battery Health', value: form.batteryHealth }]
                        : []),
                      ...(form.hasRepairs
                        ? [{ label: 'Repairs', value: form.repairDetails || 'Yes' }]
                        : []),
                      ...(form.hasChangedParts
                        ? [{ label: 'Changed Parts', value: form.changedPartsDetails || 'Yes' }]
                        : []),
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-2">
                        <span className="text-gray-500 w-28 shrink-0">
                          {item.label}:
                        </span>
                        <span className="text-gray-900 font-medium">
                          {item.value}
                        </span>
                      </div>
                    ))}

                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <p className="text-gray-500 font-semibold uppercase
                        tracking-wider text-[10px] mb-1">
                        Wanted Device
                      </p>
                      {[
                        { label: 'Brand',   value: form.wantedBrand   },
                        ...(form.wantedModel
                          ? [{ label: 'Model', value: form.wantedModel }]
                          : []),
                        ...(form.wantedStorage
                          ? [{ label: 'Storage', value: form.wantedStorage }]
                          : []),
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-2">
                          <span className="text-gray-500 w-28 shrink-0">
                            {item.label}:
                          </span>
                          <span className="text-gray-900 font-medium">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {form.mediaUrls.length > 0 && (
                      <p className="text-green-600 font-medium pt-1">
                        ✅ {form.mediaUrls.length} photo(s) attached
                      </p>
                    )}
                  </div>
                </div>

                {/* WhatsApp note */}
                <div className="bg-green-50 border border-green-100 rounded-xl
                  p-3 flex items-start gap-3">
                  <FaWhatsapp size={18} className="text-green-500 shrink-0
                    mt-0.5" />
                  <p className="text-green-700 text-xs leading-relaxed">
                    We will contact you via <strong>WhatsApp or Phone</strong>{' '}
                    to discuss your swap offer. Make sure your number is correct.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl
                    text-sm border border-red-100">
                    ⚠️ {error}
                  </div>
                )}

                {/* Submit */}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700
                      font-semibold py-3.5 rounded-xl transition text-sm">
                    ← Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 bg-orange-500 hover:bg-orange-600
                      text-white font-bold py-3.5 rounded-xl transition
                      shadow-lg shadow-orange-500/30 flex items-center
                      justify-center gap-2 disabled:opacity-70 text-sm">
                    {loading ? (
                      <><FaSpinner className="animate-spin" size={16} />
                        Submitting...</>
                    ) : (
                      <><FaExchangeAlt size={16} /> Submit Swap Request</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Benefits below form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[
            { icon: '🏆', title: 'Best Value', desc: 'We offer competitive trade-in prices' },
            { icon: '⚡', title: 'Fast Process', desc: 'Get an offer within 24 hours' },
            { icon: '🔒', title: '100% Safe',   desc: 'Trusted by 500+ happy customers' },
          ].map((item) => (
            <div key={item.title} className="bg-white/5 border border-white/10
              rounded-2xl p-5 text-center backdrop-blur-sm">
              <div className="text-3xl mb-2">{item.icon}</div>
              <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
              <p className="text-gray-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SwapDeals