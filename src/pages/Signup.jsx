// src/pages/Signup.jsx
import React, { useState, useContext } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  FaUser, FaEnvelope, FaLock, FaPhone,
  FaSpinner, FaEye, FaEyeSlash, FaCheckCircle,
  FaShieldAlt
} from 'react-icons/fa'
import { UserContext } from '../context/UserContext'
import logo from '../assets/75TechstoreLOGO.png'

const Signup = () => {
  const { signup, loading } = useContext(UserContext)
  const navigate            = useNavigate()
  const [searchParams]      = useSearchParams()
  const redirect            = searchParams.get('redirect') || '/'

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]               = useState('')
  const [success, setSuccess]           = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      // ✅ Pass phone to signup
      await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      )
      setSuccess(true)
      setTimeout(() => navigate(redirect), 1500)
    } catch (err) {
      setError(err.message)
    }
  }

  // ── Success Screen ──
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100
        flex items-center justify-center py-12 px-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-10
          text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full
            flex items-center justify-center mx-auto mb-5">
            <FaCheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account Created! 🎉
          </h2>
          <p className="text-gray-500 text-sm mb-1">
            Welcome to 75TechStore, <strong>{formData.name}</strong>!
          </p>
          <p className="text-gray-400 text-xs">Redirecting you now...</p>
          <div className="mt-6 flex justify-center">
            <div className="w-6 h-6 border-2 border-blue-600
              border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100
      flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

        {/* Logo + Title */}
        <div className="text-center mb-8">
          <img src={logo} alt="75TechStore"
            className="h-14 w-auto object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-gray-900">
            Create Your Account
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Join 75TechStore to access all our services
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mb-6
            bg-blue-50 rounded-xl p-3">
            {['Free to join', 'Secure & Private', 'Instant Access'].map((badge) => (
              <div key={badge} className="flex items-center gap-1.5">
                <FaShieldAlt size={10} className="text-blue-600" />
                <span className="text-blue-700 text-xs font-medium">{badge}</span>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600
              px-4 py-3 rounded-xl text-sm mb-5 font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2
                  text-gray-400" size={13} />
                <input type="text" name="name" value={formData.name}
                  onChange={handleChange} placeholder="John Doe" required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border
                    border-gray-200 focus:ring-2 focus:ring-blue-500
                    focus:border-transparent outline-none bg-gray-50 text-sm" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2
                  text-gray-400" size={13} />
                <input type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="you@email.com" required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border
                    border-gray-200 focus:ring-2 focus:ring-blue-500
                    focus:border-transparent outline-none bg-gray-50 text-sm" />
              </div>
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone Number
                <span className="text-gray-400 font-normal ml-1">(optional)</span>
              </label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2
                  text-gray-400" size={13} />
                <input type="tel" name="phone" value={formData.phone}
                  onChange={handleChange} placeholder="080XXXXXXXX"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border
                    border-gray-200 focus:ring-2 focus:ring-blue-500
                    focus:border-transparent outline-none bg-gray-50 text-sm" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2
                  text-gray-400" size={13} />
                <input type={showPassword ? 'text' : 'password'}
                  name="password" value={formData.password}
                  onChange={handleChange} placeholder="Min 6 characters"
                  required minLength={6}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border
                    border-gray-200 focus:ring-2 focus:ring-blue-500
                    focus:border-transparent outline-none bg-gray-50 text-sm" />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2
                  text-gray-400" size={13} />
                <input type={showPassword ? 'text' : 'password'}
                  name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleChange} placeholder="Re-enter your password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border
                    border-gray-200 focus:ring-2 focus:ring-blue-500
                    focus:border-transparent outline-none bg-gray-50 text-sm" />
              </div>
              {formData.confirmPassword && (
                <p className={`text-xs mt-1.5 font-medium ${
                  formData.password === formData.confirmPassword
                    ? 'text-green-600' : 'text-red-500'
                }`}>
                  {formData.password === formData.confirmPassword
                    ? '✅ Passwords match'
                    : '❌ Passwords do not match'
                  }
                </p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full mt-2 bg-blue-600 text-white font-bold py-3.5
                rounded-xl hover:bg-blue-700 active:scale-95 transition-all
                shadow-lg shadow-blue-600/20 flex items-center justify-center
                gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" size={16} />
                  Creating Account...
                </>
              ) : 'Create Free Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to={`/login?redirect=${redirect}`}
              className="text-blue-600 font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup