import React from 'react'
import console from '../../assets/console3.png'
import virtual from '../../assets/VR.png'
import speaker from '../../assets/speaker.png'

const Category2 = () => {
  return (
    <section className="py-2 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Console Card */}
          <div className="relative h-[320px] rounded-3xl bg-gray-500 text-white p-6 flex items-end sm:col-span-2 overflow-hidden">

            <div className="z-10">
              <p className="text-sm text-black">Enjoy</p>
              <p className="text-lg">with</p>
              <p className="text-2xl font-semibold mb-4">
                Consoles
              </p>

              <a
                href="/shop"
                className="inline-block bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
              >
                Shop Now
              </a>
            </div>

            <img
              src={console}
              alt="Gaming Console"
              className="absolute right-0 top-0 h-full max-w-[60%] object-contain"
            />
          </div>

          {/* Speaker Card */}
          <div className="relative h-[320px] rounded-3xl bg-yellow-800 text-white p-6 flex items-end overflow-hidden">

            <div className="z-10">
              <p className="text-sm text-black">Enjoy</p>
              <p className="text-lg">with</p>
              <p className="text-2xl font-semibold mb-4">
                Speakers
              </p>

              <a
                href="/shop"
                className="inline-block bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
              >
                Shop Now
              </a>
            </div>

            <img
              src={speaker}
              alt="Speaker"
              className="absolute right-0 bottom-0 h-[220px] object-contain"
            />
          </div>

          {/* VR Card */}
          <div className="relative h-[320px] rounded-3xl bg-blue-950 text-white p-6 flex items-end overflow-hidden">

            <div className="z-10">
              <p className="text-sm text-gray-300">Enjoy</p>
              <p className="text-lg">with</p>
              <p className="text-2xl font-semibold mb-4">
                Virtual Reality
              </p>

              <a
                href="/shop"
                className="inline-block bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
              >
                Shop Now
              </a>
            </div>

            <img
              src={virtual}
              alt="Virtual Reality"
              className="absolute right-0 bottom-0 h-[220px] object-contain"
            />
          </div>

        </div>
      </div>
    </section>
  )
}

export default Category2