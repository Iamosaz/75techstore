// src/components/prefooter/TechCard75.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import banner from '../../assets/75TechstoreLOGO.png'
import {
  FaCrown, FaStar, FaGem, FaCheck,
  FaArrowRight, FaTools, FaShippingFast, 
  FaPercent, FaShieldAlt
} from 'react-icons/fa'

const TechCard75 = () => {
  const [activeTier, setActiveTier] = useState(1) // Default to Gold
  const [memberCount, setMemberCount] = useState(3842)

  useEffect(() => {
    const interval = setInterval(() => {
      setMemberCount(prev => prev + Math.floor(Math.random() * 2) + 1)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const tiers = [
    {
      id: 'silver',
      name: 'Silver VIP',
      icon: <FaStar className="text-gray-400 text-xl" />,
      price: '2,000',
      color: 'from-slate-400 to-slate-500',
      border: 'border-slate-300',
      perks: [
        '5% Flat Discount On All Products',
        'Priority Technical Support',
        '₦1,000 Birthday Voucher'
      ]
    },
    {
      id: 'gold',
      name: 'Gold VIP',
      icon: <FaCrown className="text-yellow-400 text-xl" />,
      price: '5,000',
      color: 'from-amber-400 to-amber-600',
      border: 'border-amber-400/50',
      perks: [
        '10% Flat Discount On All Products',
        '2 Free Repairs Per Month',
        '50% Off Delivery Fees'
      ],
      popular: true
    },
    {
      id: 'platinum',
      name: 'Platinum VIP',
      icon: <FaGem className="text-purple-400 text-xl" />,
      price: '10,000',
      color: 'from-purple-500 to-indigo-600',
      border: 'border-purple-300',
      perks: [
        '15% Flat Discount On Everything',
        'Free Delivery Nationwide',
        'Unlimited Device Repairs'
      ]
    }
  ]

  const miniStats = [
    { icon: <FaPercent />, label: 'Save up to 15%' },
    { icon: <FaShippingFast />, label: 'Free Delivery' },
    { icon: <FaTools />, label: 'Free Repairs' },
    { icon: <FaShieldAlt />, label: 'Warranty Extended' }
  ]

  return (
    <section className="max-w-7xl mx-auto my-24 px-6 relative">
      <div className="relative bg-gradient-to-br from-[#0c152b] via-[#10244c] to-[#080d1a] text-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
        <div className="flex flex-col lg:flex-row items-stretch justify-between relative z-10">
          
          {/* Left Column Copywriting */}
          <div className="p-8 md:p-12 lg:p-16 lg:w-3/5 flex flex-col justify-center">
            <div className="self-start flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                {memberCount.toLocaleString()} Live VIP Members
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.1]">
              Join The Exclusive
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                75TechStore VIP
              </span>
              <br />
              Membership Club
            </h2>

            <p className="text-gray-300 text-lg mb-8 max-w-xl leading-relaxed">
              Unlock wholesale pricing, priority repair support lines, and exclusive members-only drops. Save an average of <span className="text-yellow-400 font-extrabold">₦75,000+ annually</span>.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg">
              {miniStats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                  <span className="text-yellow-400 text-base">{stat.icon}</span>
                  <span className="text-white font-medium text-xs md:text-sm">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <Link
                to="/membership-plan"
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-extrabold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg text-lg hover:scale-105"
              >
                <FaCrown />
                Join VIP Club
                <FaArrowRight className="group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <Link
                to="/membership-benefits"
                className="flex items-center justify-center gap-2 border-2 border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-lg"
              >
                See All Benefits
              </Link>
            </div>
          </div>

          {/* Right Column Plans */}
          <div className="lg:w-2/5 bg-white/[0.02] border-t lg:border-t-0 lg:border-l border-white/10 p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center relative">
            <div className="flex bg-black/40 rounded-2xl p-1 border border-white/10 mb-8 w-full max-w-sm relative z-10">
              {tiers.map((tier, index) => (
                <button
                  key={tier.id}
                  onClick={() => setActiveTier(index)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-wider
                    ${activeTier === index 
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-md' 
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {tier.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className={`w-full max-w-sm bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-2 ${tiers[activeTier].border} rounded-[2rem] p-6 shadow-2xl relative overflow-hidden`}>
              {tiers[activeTier].popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                  POPULAR
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${tiers[activeTier].color} text-white rounded-xl flex items-center justify-center shadow-md`}>
                  {tiers[activeTier].icon}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest block">VIP Tier</span>
                  <h4 className="text-xl font-extrabold text-white leading-none">{tiers[activeTier].name}</h4>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-gray-400 font-bold text-lg">₦</span>
                <span className="text-4xl font-black text-gray-900">{tiers[activeTier].price}</span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>

              <hr className="border-white/10 mb-6" />

              <ul className="space-y-3.5 mb-8">
                {tiers[activeTier].perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-200 font-medium">
                    <span className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaCheck className="text-emerald-400 text-[10px]" />
                    </span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/membership-plan"
                className="block w-full text-center bg-white/10 hover:bg-yellow-400 hover:text-black text-white font-extrabold py-3.5 rounded-xl transition-all"
              >
                Claim This Tier
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default TechCard75