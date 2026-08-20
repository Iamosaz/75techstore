// src/pages/MembershipVerify.jsx
import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaCrown } from 'react-icons/fa'

const MembershipVerify = () => {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference') || searchParams.get('trxref')

  const [status, setStatus]   = useState('verifying')
  const [message, setMessage] = useState('')
  const [data, setData]       = useState(null)

  // Safe Token Extraction
  const getAuthToken = () => {
    try {
      const directToken = localStorage.getItem('token');
      if (directToken) return directToken;

      const userObject = JSON.parse(localStorage.getItem('user') || '{}');
      if (userObject?.token) return userObject.token;

      const userInfoObject = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfoObject?.token) return userInfoObject.token;
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  useEffect(() => {
    if (!reference) {
      setStatus('error')
      setMessage('No payment reference found.')
      return
    }
    verifyPayment()
  }, [reference])

  const verifyPayment = async () => {
    const token = getAuthToken()
    try {
      const response = await axios.get(
        `/api/membership/verify/${reference}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data?.success) {
        setStatus('success')
        setMessage(response.data.message)
        setData(response.data.data)

        // Update local storage user object so UI updates state immediately
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser && response.data.data?.user) {
          storedUser.membershipTier = response.data.data.user.membershipTier;
          storedUser.membershipExpiry = response.data.data.user.membershipExpiry;
          localStorage.setItem('user', JSON.stringify(storedUser));
        }
      } else {
        setStatus('error')
        setMessage(response.data.message || 'Payment validation declined.')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
      setMessage(err.response?.data?.message || 'Verification failed.')
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
        {status === 'verifying' && (
          <>
            <FaSpinner className="animate-spin text-blue-500 text-6xl mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-900 mb-3">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your subscription status with Paystack.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-emerald-500 text-5xl" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Subscription Active! 🎉</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            {data?.user && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-6 mb-6">
                <FaCrown className="text-yellow-500 text-3xl mx-auto mb-2" />
                <p className="text-xl font-black text-gray-900 mb-1">{data.user.name}</p>
                <p className="text-sm text-gray-600">
                  Plan Category:{' '}
                  <span className="font-bold text-yellow-600 uppercase">
                    {data.user.membershipTier}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Active until {data.user?.membershipExpiry ? new Date(data.user.membershipExpiry).toLocaleDateString() : ''}
                </p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Link to="/shop" className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3.5 rounded-xl hover:shadow-lg text-center">
                Start Shopping
              </Link>
              <Link to="/" className="w-full border-2 border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-100 text-center">
                Return Home
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimesCircle className="text-red-500 text-5xl" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex flex-col gap-3">
              <Link to="/membership-plan" className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-black text-center">
                Try Selection Again
              </Link>
              <Link to="/contact" className="w-full border-2 border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-100 text-center">
                Contact Support
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default MembershipVerify