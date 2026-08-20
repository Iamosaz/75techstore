// src/pages/Login.jsx
import React, { useState, useContext } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  FaEnvelope, FaLock, FaSpinner,
  FaEye, FaEyeSlash, FaShieldAlt
} from 'react-icons/fa'
import { UserContext } from '../context/UserContext'
import logo from '../assets/75TechstoreLOGO.png'

const Login = () => {
  const { login, loading } = useContext(UserContext)
  const navigate           = useNavigate()
  const [searchParams]     = useSearchParams()
  const redirect           = searchParams.get('redirect') || '/'

  const [formData, setFormData]       = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]             = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(formData.email, formData.password)
      navigate(redirect)
    } catch (err) {
      setError(err.message || 'Login failed')
    }
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
            Welcome Back!
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Sign in to your 75TechStore account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mb-6
            bg-blue-50 rounded-xl p-3">
            {['Secure Login', 'Your Data is Safe', 'Instant Access'].map((badge) => (
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
                  onChange={handleChange} placeholder="Your password" required
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

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full mt-2 bg-blue-600 text-white font-bold py-3.5
                rounded-xl hover:bg-blue-700 active:scale-95 transition-all
                shadow-lg shadow-blue-600/20 flex items-center justify-center
                gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" size={16} />
                  Signing In...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to={`/signup?redirect=${redirect}`}
              className="text-blue-600 font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login