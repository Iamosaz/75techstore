// src/pages/RequestEngineer.jsx
import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  FaTools, FaCheckCircle, FaUserLock,
  FaHeadset, FaSpinner, FaShieldAlt
} from 'react-icons/fa'
import axios from 'axios'
// ✅ CORRECT - UserContext NOT AdminContext
import { UserContext } from '../context/UserContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const RequestEngineer = () => {
  const navigate = useNavigate()

  // ✅ Reading from UserContext - regular customers
  const { user, isReady } = useContext(UserContext)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const [formData, setFormData] = useState({
    gadgetType:       'Laptop',
    brand:            '',
    issueDescription: '',
    contactNumber:    '',
    address:          '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')

      // ✅ Uses the customer token key '75token'
      const token = localStorage.getItem('75token')

      if (!token) {
        setError('Session expired. Please log in again.')
        setLoading(false)
        return
      }

      const { data } = await axios.post(
        `${API_URL}/engineer`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (data.success) {
        setSuccess(true)
        setFormData({
          gadgetType:       'Laptop',
          brand:            '',
          issueDescription: '',
          contactNumber:    '',
          address:          '',
        })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  // ── Still checking auth ──
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600
            border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // ── Not logged in as a customer ──
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Page Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16
              bg-blue-600 text-white rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
              <FaTools size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Request an Engineer
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Get expert help for your gadgets from certified 75TechStore engineers.
            </p>
          </div>

          {/* Login Required Card */}
          <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl
            border border-gray-100 overflow-hidden">

            {/* Blue top section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800
              text-white p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex
                items-center justify-center mx-auto mb-4">
                <FaUserLock size={36} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Account Required</h2>
              <p className="text-blue-200 text-sm leading-relaxed">
                For your safety and to provide the best service, please
                log in or create a free account to request an engineer.
              </p>
            </div>

            {/* Benefits + buttons */}
            <div className="p-8">
              <div className="space-y-3 mb-8">
                {[
                  'Your request is securely linked to your account',
                  'Track your request status anytime',
                  'Engineers are verified by 75TechStore',
                  'Your personal info stays protected',
                ].map((reason, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <FaShieldAlt size={12} className="text-green-500 shrink-0" />
                    <p className="text-gray-600 text-sm">{reason}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {/* ✅ Goes to customer login page */}
                <Link
                  to="/login?redirect=/requestengineer"
                  className="w-full bg-blue-600 text-white font-bold py-3.5
                    rounded-xl hover:bg-blue-700 transition text-center
                    shadow-lg shadow-blue-600/30 text-sm"
                >
                  Log In to Continue
                </Link>

                {/* ✅ Goes to customer signup page */}
                <Link
                  to="/signup?redirect=/requestengineer"
                  className="w-full bg-gray-100 text-gray-800 font-bold py-3.5
                    rounded-xl hover:bg-gray-200 transition text-center text-sm"
                >
                  Create a Free Account
                </Link>

                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-400 text-sm hover:text-gray-600
                    transition mt-1"
                >
                  ← Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Success screen ──
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center
        justify-center py-12 px-4">
        <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl
          p-8 text-center border border-gray-100">

          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full
            flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle size={40} />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Request Sent! 🎉
          </h2>
          <p className="text-gray-600 mb-2 leading-relaxed">
            Our admin team will review your request and assign a certified
            engineer to you.
          </p>
          <p className="text-gray-800 font-semibold mb-8">
            📞 You will be contacted via WhatsApp/Phone shortly.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setSuccess(false)}
              className="w-full bg-blue-600 text-white font-bold py-3.5
                rounded-xl hover:bg-blue-700 transition shadow-lg
                shadow-blue-600/30"
            >
              Submit Another Request
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 font-semibold
                py-3 rounded-xl hover:bg-gray-200 transition"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main Form (only shows when user is logged in as customer) ──
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16
            bg-blue-600 text-white rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <FaTools size={28} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Request an Engineer
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
            Fill out the form and a certified 75TechStore engineer will
            contact you directly.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100
          overflow-hidden flex flex-col md:flex-row">

          {/* ── Left Info Panel ── */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-900
            text-white p-8 md:w-2/5 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-6">How it works</h3>
              <ul className="space-y-5">
                {[
                  'Fill out your gadget details and describe the issue.',
                  'Admin reviews and assigns the best engineer for you.',
                  'Engineer contacts you via WhatsApp or Phone.',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex
                      items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      {step}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { label: 'Avg Response', value: '< 2hrs' },
                  { label: 'Engineers',    value: '10+'    },
                ].map((stat) => (
                  <div key={stat.label}
                    className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-blue-200 text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="mt-8 p-4 bg-white/10 rounded-xl flex
              items-start gap-3">
              <FaHeadset size={20} className="text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Need urgent help?</p>
                <p className="text-blue-200 text-xs mt-1">
                  Call us: +234-XXX-XXX-XXXX
                </p>
              </div>
            </div>
          </div>

          {/* ── Right Form Panel ── */}
          <div className="p-8 md:w-3/5">

            {/* Logged in as banner */}
            <div className="flex items-center gap-3 bg-green-50 border
              border-green-100 rounded-xl px-4 py-3 mb-6">
              <div className="w-9 h-9 bg-blue-600 rounded-full flex
                items-center justify-center text-white font-bold text-sm shrink-0">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-green-800 font-semibold text-sm">
                  Logged in as{' '}
                  <span className="text-blue-700 font-bold">
                    {user?.name || user?.email}
                  </span>
                </p>
                <p className="text-green-600 text-xs">
                  Your request will be linked to your account
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-5
                text-sm font-medium border border-red-100">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Gadget Type + Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold
                    text-gray-700 mb-1.5">
                    Gadget Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gadgetType"
                    value={formData.gadgetType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      outline-none bg-gray-50 text-gray-800 text-sm"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop PC</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Printer">Printer</option>
                    <option value="Networking">Networking / Router</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold
                    text-gray-700 mb-1.5">
                    Brand / Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. HP EliteBook, iPhone 13..."
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      outline-none bg-gray-50 text-sm"
                  />
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <label className="block text-sm font-semibold
                  text-gray-700 mb-1.5">
                  Describe the Issue <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe exactly what is wrong with your device..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    outline-none bg-gray-50 resize-none text-sm"
                />
              </div>

              {/* Contact + Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold
                    text-gray-700 mb-1.5">
                    WhatsApp / Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="080XXXXXXXX"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      outline-none bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold
                    text-gray-700 mb-1.5">
                    Your Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full address for meetup..."
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      outline-none bg-gray-50 text-sm"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-blue-600 text-white font-bold py-4
                  rounded-xl hover:bg-blue-700 active:scale-95 transition-all
                  shadow-lg shadow-blue-600/30 flex items-center justify-center
                  gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" size={16} />
                    Submitting...
                  </>
                ) : (
                  '🔧 Submit Engineer Request'
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                By submitting, you agree to be contacted by our engineers
                via the phone number provided.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestEngineer