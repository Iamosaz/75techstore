// src/pages/MembershipVerify.jsx
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaCrown, FaArrowRight } from 'react-icons/fa';

// ✅ Fixed Base URL to match your backend port
const API_URL = 'http://localhost:5000/api';

const MembershipVerify = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [data, setData] = useState(null);

  // 🛡️ Prevent double-calling in React 18 Strict Mode
  const verifiedRef = useRef(false);

  // Safe Token Extraction from all possible storage keys
  const getAuthToken = () => {
    try {
      const directToken = localStorage.getItem('token') || localStorage.getItem('adminToken');
      if (directToken) return directToken;

      const userObject = JSON.parse(localStorage.getItem('user') || '{}');
      if (userObject?.token) return userObject.token;

      const userInfoObject = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfoObject?.token) return userInfoObject.token;
    } catch (e) {
      console.error('Token extraction error:', e);
    }
    return null;
  };

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setMessage('No payment reference found in the URL.');
      return;
    }

    // Stop if already verified once in this session
    if (verifiedRef.current) return;
    verifiedRef.current = true;

    verifyPayment(reference);
  }, [reference]);

  const verifyPayment = async (refCode) => {
    const token = getAuthToken();

    // Configure headers properly (do not send "Bearer null")
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await axios.get(
        `${API_URL}/membership/verify/${refCode}`,
        { headers }
      );

      if (response.data?.success || response.data?.status === 'success') {
        const payload = response.data.data || response.data;
        setStatus('success');
        setMessage(response.data.message || 'Subscription successfully activated!');
        setData(payload);

        // ✅ Update both 'user' and 'userInfo' in localStorage
        try {
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

          const updatedTier = payload.user?.membershipTier || payload.membershipTier;
          const updatedExpiry = payload.user?.membershipExpiry || payload.membershipExpiry;

          if (updatedTier) {
            if (Object.keys(storedUser).length > 0) {
              storedUser.membershipTier = updatedTier;
              storedUser.membershipExpiry = updatedExpiry;
              localStorage.setItem('user', JSON.stringify(storedUser));
            }

            if (Object.keys(storedUserInfo).length > 0) {
              storedUserInfo.membershipTier = updatedTier;
              storedUserInfo.membershipExpiry = updatedExpiry;
              localStorage.setItem('userInfo', JSON.stringify(storedUserInfo));
            }
          }
        } catch (storageErr) {
          console.error('Failed to sync updated user in storage:', storageErr);
        }
      } else {
        setStatus('error');
        setMessage(response.data?.message || 'Payment validation declined.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setStatus('error');
      setMessage(
        err.response?.data?.message ||
        'Payment verification failed. If your account was debited, please contact support.'
      );
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-16 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 sm:p-10 text-center border border-gray-100">
        
        {/* ─── 1. VERIFYING STATE ─── */}
        {status === 'verifying' && (
          <div className="py-8">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Verifying Payment...</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Please wait a moment while we confirm your transaction with Paystack. Do not close or refresh this page.
            </p>
          </div>
        )}

        {/* ─── 2. SUCCESS STATE ─── */}
        {status === 'success' && (
          <div>
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100">
              <FaCheckCircle className="text-4xl" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">VIP Active! 🎉</h2>
            <p className="text-gray-600 text-sm mb-6">{message}</p>

            {(data?.user || data?.membershipTier) && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-yellow-400/60 rounded-2xl p-5 mb-6 text-center">
                <FaCrown className="text-yellow-500 text-3xl mx-auto mb-2" />
                <p className="text-lg font-black text-gray-900">
                  {data.user?.name || 'Valued Member'}
                </p>
                <div className="inline-block bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mt-1">
                  {data.user?.membershipTier || data.membershipTier} VIP
                </div>
                {(data.user?.membershipExpiry || data.membershipExpiry) && (
                  <p className="text-xs text-gray-500 mt-2">
                    Valid until {new Date(data.user?.membershipExpiry || data.membershipExpiry).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Link
                to="/shop"
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-extrabold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                Start Shopping with VIP Discounts <FaArrowRight />
              </Link>
              <Link
                to="/"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition text-sm"
              >
                Return Home
              </Link>
            </div>
          </div>
        )}

        {/* ─── 3. ERROR STATE ─── */}
        {status === 'error' && (
          <div>
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
              <FaTimesCircle className="text-4xl" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{message}</p>

            <div className="flex flex-col gap-3">
              <Link
                to="/membership-plan"
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition shadow-md"
              >
                Try Plan Selection Again
              </Link>
              <Link
                to="/contact"
                className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-3.5 rounded-xl transition text-sm"
              >
                Contact Customer Support
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default MembershipVerify;