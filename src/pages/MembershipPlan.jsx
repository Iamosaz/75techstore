// src/pages/MembershipPlan.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaCrown, FaStar, FaGem, FaCheck,
  FaArrowRight, FaSpinner, FaLock, FaExclamationCircle
} from 'react-icons/fa';
import PreFooter from '../components/prefooter/PreFooter';

// ✅ Fixed backend URL
const API_URL = 'http://localhost:5000/api';

const MembershipPlan = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loadingTier, setLoadingTier] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentMembership, setCurrentMembership] = useState(null);

  // Robust token finder
  const getAuthToken = () => {
    try {
      const direct = localStorage.getItem('token') || localStorage.getItem('adminToken');
      if (direct && direct.startsWith('ey')) return direct;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const val = localStorage.getItem(key);
        if (val) {
          if (typeof val === 'string' && val.startsWith('ey')) return val;
          try {
            const parsed = JSON.parse(val);
            if (parsed?.token && parsed.token.startsWith('ey')) return parsed.token;
            if (parsed?.user?.token && parsed.user.token.startsWith('ey')) return parsed.user.token;
          } catch (e) { /* ignore */ }
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const getStoredUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user?.email) return user;
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      return userInfo;
    } catch {
      return {};
    }
  };

  const token = getAuthToken();

  useEffect(() => {
    if (token) {
      axios
        .get(`${API_URL}/membership/my-membership`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          if (res.data?.hasMembership && res.data?.data) {
            setCurrentMembership(res.data.data);
          }
        })
        .catch(() => {});
    }
  }, [token]);

  const tiers = [
    {
      id: 'silver',
      name: 'Silver VIP',
      icon: <FaStar size={28} />,
      monthly: 3000,
      yearly: 36000,
      color: 'from-slate-400 to-slate-500',
      border: 'border-slate-300',
      benefits: [
        '10% Flat Discount On All Products',
        'Priority Customer & Repair Support',
        '₦1,500 Birthday Bonus Credit',
        'Early Flash Sales Notification'
      ]
    },
    {
      id: 'gold',
      name: 'Gold VIP',
      icon: <FaCrown size={28} />,
      monthly: 7000,
      yearly: 84000,
      color: 'from-amber-400 to-yellow-500',
      border: 'border-amber-400',
      popular: true,
      benefits: [
        '10% Flat Discount On All Products',
        '12% Flat Discount on Repairs',
        '40% Off Nationwide Delivery',
        '+2 Months Extended Device Warranty',
        '₦2,500 Birthday Bonus Credit',
        'Early access to new products (24hr)'
      ]
    },
    {
      id: 'platinum',
      name: 'Platinum VIP',
      icon: <FaGem size={28} />,
      monthly: 12000,
      yearly: 144000,
      color: 'from-purple-500 to-indigo-600',
      border: 'border-purple-300',
      benefits: [
        '15% Flat Discount On All Products',
        '100% FREE Nationwide Delivery Always',
        '50% Flat Discount on Repairs Per month',
        '+5 Months Extended Warranty',
        'Private VIP Dedicated WhatsApp Line',
        '₦4,000 Birthday Bonus Credit',
        'First access to new products (48hr)'
      ]
    }
  ];

  const handleSubscribe = async (tierId) => {
    setErrorMsg('');
    const activeToken = getAuthToken();
    const storedUser = getStoredUser();

    if (!activeToken) {
      setErrorMsg('Please log in to subscribe to a membership plan.');
      setTimeout(() => (window.location.href = '/login'), 1800);
      return;
    }

    setLoadingTier(tierId);

    try {
      const response = await axios.post(
        `${API_URL}/membership/initialize`,
        {
          tier: tierId,
          billingCycle,
          email: storedUser?.email
        },
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // ✅ Support both naming conventions from backend
      const authUrl =
        response.data?.data?.authorizationUrl ||
        response.data?.data?.authorization_url;

      if (response.data?.success && authUrl) {
        window.location.href = authUrl;
      } else {
        setErrorMsg(response.data?.message || 'Failed to open Paystack gateway.');
        setLoadingTier(null);
      }
    } catch (err) {
      console.error('Paystack error:', err);
      setErrorMsg(
        err.response?.data?.message ||
          'Could not connect to payment gateway. Please check your backend is running.'
      );
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        {/* Banner */}
        <section className="bg-gradient-to-br from-[#0c152b] via-[#10244c] to-[#080d1a] text-white py-16 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider mb-4">
              <FaCrown /> 75TechStore VIP Club
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Invest In A Plan That Pays For Itself
            </h1>
            <p className="text-gray-300 max-w-xl mx-auto text-base">
              Get wholesale discounts, free nationwide shipping, and priority device repairs.
            </p>

            {currentMembership && (
              <div className="mt-6 inline-block bg-emerald-500/20 border border-emerald-500 text-emerald-300 px-6 py-2 rounded-full font-bold text-sm">
                ✓ Active {currentMembership.tier?.toUpperCase()} Member
              </div>
            )}
          </div>
        </section>

        {/* Billing Toggle */}
        <div className="max-w-xs mx-auto my-8 bg-gray-200 p-1.5 rounded-2xl flex items-center">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
              billingCycle === 'monthly' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all relative ${
              billingCycle === 'yearly' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
              SAVE 20%
            </span>
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="max-w-md mx-auto mb-8 px-4">
            <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl flex items-center gap-3 text-sm">
              <FaExclamationCircle className="text-red-500 text-lg flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <section id="benefits" className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {tiers.map((tier) => {
              const price = billingCycle === 'monthly' ? tier.monthly : tier.yearly;
              const isCurrent = currentMembership?.tier === tier.id;
              const isLoading = loadingTier === tier.id;

              return (
                <div
                  key={tier.id}
                  className={`relative flex flex-col justify-between rounded-3xl p-8 border-2 ${
                    tier.popular ? tier.border : 'border-gray-200'
                  } bg-white shadow-xl hover:shadow-2xl transition-all`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} text-white flex items-center justify-center shadow-md`}
                      >
                        {tier.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-gray-900">{tier.name}</h3>
                        <p className="text-xs text-gray-500">VIP Subscription</p>
                      </div>
                    </div>

                    <div className="my-6">
                      <span className="text-gray-400 font-bold text-lg">₦</span>
                      <span className="text-4xl font-black text-gray-900">
                        {price.toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-sm font-medium">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>

                    <hr className="border-gray-100 my-6" />

                    <ul className="space-y-3.5 mb-8">
                      {tier.benefits.map((b, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-gray-700 font-medium"
                        >
                          <FaCheck className="text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={isLoading || isCurrent}
                    className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
                      tier.popular
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/30'
                        : 'bg-gray-900 hover:bg-black text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin text-lg" />
                        <span>Opening Paystack...</span>
                      </>
                    ) : isCurrent ? (
                      <span>Current Active Plan</span>
                    ) : (
                      <>
                        <span>Select Plan & Pay</span>
                        <FaArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-2 mt-12">
            <FaLock /> Encrypted and processed directly via Paystack
          </p>
        </section>
      </div>

      <PreFooter />
    </div>
  );
};

export default MembershipPlan;