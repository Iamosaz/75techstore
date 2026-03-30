import React from 'react'
import earphone from '../../assets/airpods1.png'
import gadget from '../../assets/gadget.png'
import laptop from '../../assets/macb.png'

const Category = () => {
  return (
    <div className="py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* First Card */}
          <div className="relative h-[320px] rounded-3xl bg-gradient-to-br from-red-600 to-red-500 text-white p-6 flex items-end">
            <div>
              <p className="text-sm text-black">Enjoy</p>
              <p className="text-lg">with</p>
              <p className="text-3xl font-semibold mb-4">Gadgets</p>

              <a
                href="/shop"
                className="inline-block bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
              >
                Shop Now
              </a>
            </div>

            <img
              src={gadget}
              alt="gadget"
              className="absolute top-24 ml-2 w-80"
            />
          </div>

          {/* Second Card */}
          <div className="relative h-[320px] rounded-3xl bg-amber-500 text-white p-6 flex items-end">
            <div>
              <p className="text-sm text-black">Enjoy</p>
              <p className="text-lg">with</p>
              <p className="text-2xl font-semibold mb-4">Earphones</p>

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
              className="absolute top-20 ml-20 w-30"
            />
          </div>

          {/* Third Card (Wide) */}
          <div className="relative h-[320px] rounded-3xl bg-blue-400 text-white p-6 flex items-end sm:col-span-2">
            <div>
              <p className="text-sm text-black">Enjoy</p>
              <p className="text-lg">with</p>
              <p className="text-2xl font-semibold mb-4">Laptops</p>

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
              className="absolute top-14 ml-42 w-80"
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Category
