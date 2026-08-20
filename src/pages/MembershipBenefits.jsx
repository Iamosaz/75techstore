// src/pages/MembershipBenfits.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import {
  FaCrown, FaStar, FaGem, FaPercent, FaShippingFast,
  FaTools, FaShieldAlt, FaBolt, FaUsers, FaHeadset,
  FaGift, FaCalendarCheck, FaArrowRight, FaCheck,
  FaWhatsapp, FaTrophy,
} from 'react-icons/fa'
import PreFooter from '../components/prefooter/PreFooter'

const MembershipBenefits = () => {
  const tiers = [
    {
      name: 'Silver VIP',
      icon: <FaStar size={32} />,
      price: '2,000',
      color: 'from-gray-400 to-gray-500',
      bgCard: 'bg-white',
      border: 'border-slate-200',
      benefits: [
        '5% discount on all products',
        'Priority customer support',
        'Birthday bonus reward (₦1,000)',
        'Early access to flash sales',
        'Members-only community group'
      ],
      idealFor: 'Casual shoppers who want basic savings'
    },
    {
      name: 'Gold VIP',
      icon: <FaCrown size={32} />,
      price: '5,000',
      color: 'from-yellow-400 to-yellow-600',
      bgCard: 'bg-amber-50/20',
      border: 'border-yellow-400',
      popular: true,
      benefits: [
        '10% discount on all products',
        'Free device repairs (2x per month)',
        'Early access to new products (24hr)',
        '50% off delivery fees',
        'Extended warranty (+6 months)',
        'Birthday bonus reward (₦3,000)'
      ],
      idealFor: 'Regular customers who want real savings'
    },
    {
      name: 'Platinum VIP',
      icon: <FaGem size={32} />,
      price: '10,000',
      color: 'from-purple-400 to-purple-700',
      bgCard: 'bg-purple-50/10',
      border: 'border-purple-300',
      benefits: [
        '15% discount on everything',
        'Free nationwide delivery always',
        'Unlimited free device repairs',
        'First access to new products (48hr)',
        'Extended warranty (+12 months)',
        'Birthday bonus reward (₦5,000)',
        'Personal VIP WhatsApp line'
      ],
      idealFor: 'Businesses & tech enthusiasts'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0c152b] via-[#10244c] to-[#080d1a] text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-wider">
            <FaCrown /> 75TechStore VIP Club
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            VIP Perks Built To Save You Money
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Enjoy exclusive discounts on gadgets, free shipping, and priority device repairs. Pick your tier and start saving instantly.
          </p>
          <Link
            to="/membership-plan"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-extrabold px-8 py-4 rounded-xl shadow-lg hover:shadow-yellow-500/30 transition-all text-lg"
          >
            Choose Subscription Plan <FaArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Grid Display */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`relative ${tier.bgCard} border-2 ${tier.border} rounded-3xl p-8 shadow-xl flex flex-col justify-between`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider">
                  Recommended Plan
                </span>
              )}

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${tier.color} text-white rounded-xl flex items-center justify-center shadow-md`}>
                    {tier.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900">{tier.name}</h3>
                    <p className="text-xs text-gray-500">{tier.idealFor}</p>
                  </div>
                </div>

                <div className="my-6">
                  <span className="text-gray-400 font-bold text-lg">₦</span>
                  <span className="text-4xl font-black text-gray-900">{tier.price}</span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>

                <hr className="border-gray-100 my-6" />

                <ul className="space-y-4 mb-8">
                  {tier.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <FaCheck className="text-emerald-500 mt-1 flex-shrink-0" size={12} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/membership-plan"
                className="block w-full text-center bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all"
              >
                Select {tier.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <PreFooter />
    </div>
  )
}

export default MembershipBenefits