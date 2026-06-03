import React from 'react'
import earphone from '../../assets/airpods1.png'
import gadget from '../../assets/gadget.png'
import laptop from '../../assets/macb.png'

const Category = () => {
  return (
    <section className="py-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Gadgets Card */}
          <div className="relative h-[320px] rounded-3xl bg-gradient-to-br from-red-600 to-red-500 text-white p-6 flex items-end overflow-hidden">

            <div className="z-10">
              <p className="text-sm text-black">Enjoy</p>
              <p className="text-lg">with</p>
              <p className="text-3xl font-semibold mb-4">
                Gadgets
              </p>

              <a
                href="/shop"
                className="inline-block bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
              >
                Shop Now
              </a>
            </div>

            <img
              src={gadget}
              alt="Gadgets"
              className="absolute right-0 bottom-0 h-[220px] object-contain"
            />
          </div>

          {/* Earphones Card */}
          <div className="relative h-[320px] rounded-3xl bg-amber-500 text-white p-6 flex items-end overflow-hidden">

            <div className="z-10">
              <p className="text-sm text-black">Enjoy</p>
              <p className="text-lg">with</p>
              <p className="text-2xl font-semibold mb-4">
                Earphones
              </p>

              <a
                href="/shop"
                className="inline-block bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
              >
                Shop Now
              </a>
            </div>

            <img
              src={earphone}
              alt="Earphones"
              className="absolute right-0 bottom-0 h-[220px] object-contain"
            />
          </div>

          {/* Laptops Card */}
          <div className="relative h-[320px] rounded-3xl bg-blue-400 text-white p-6 flex items-end sm:col-span-2 overflow-hidden">

            <div className="z-10">
              <p className="text-sm text-black">Enjoy</p>
              <p className="text-lg">with</p>
              <p className="text-2xl font-semibold mb-4">
                Laptops
              </p>

              <a
                href="/shop"
                className="inline-block bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
              >
                Shop Now
              </a>
            </div>

            <img
              src={laptop}
              alt="Laptop"
              className="absolute right-0 bottom-0 h-[260px] max-w-[60%] object-contain"
            />
          </div>

        </div>
      </div>
    </section>
  )
}

export default Category