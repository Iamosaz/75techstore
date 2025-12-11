import React from 'react'
import { Link } from 'react-router-dom'
import banner from  '../../assets/75logo.png'


// Become a member banner header 
const TechCard75 = () => {
  return (
    <section className="max-w-6xl mx-auto my-20 px-6">
      <div className="bg-gradient-to-r from-[#0b1b3f] via-brand-blue to-[#b8a58f] text-white rounded-3xl flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-md">
        
        {/* Left Text Section */}
        <div className="p-10 md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-3">
            Become a <span className="text-brand-blue">7</span>
            <span className='text-brand-red'>5</span>
            <span className=' bg-gradient-to-r from-[#010e1b] via-brand-blue to-[#d77a33] bg-clip-text text-transparent'>Techstore</span>
            <span className="text-yellow-300"> Member</span>
          </h2>
          <p className="text-white/90 mb-6">
            Earn up to <span className="font-semibold text-yellow-300">5% cashback</span> on every
            gadget purchase, enjoy priority repair support, and unlock exclusive
            digital service discounts.
          </p>

          <Link
            to="/signup"
            className="inline-block bg-white text-brand-blue font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Join Now →
          </Link>
        </div>

        {/* Right Image Section */}
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <img
            src={banner}
            alt="75TechStore Member Rewards"
            className="w-full md:w-[420px] object-cover"
          />
        </div>
      </div>
    </section>
  );
};


export default TechCard75
