import React from 'react'
import console from '../../assets/console3.png'
import virtual from '../../assets/VR.png'
import speaker from '../../assets/speaker.png'

const Category2 = () => {
  return (
   <div className="py-2">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    
              {/* First Card */}
                <div className="relative h-[320px] rounded-3xl bg-gray-500 text-white p-6 flex items-end sm:col-span-2">
                          <div>
                            <p className="text-sm text-black">Enjoy</p>
                            <p className="text-lg">with</p>
                            <p className="text-2xl font-semibold mb-4">Consoles</p>
              
                            <a
                              href="/shop"
                              className="inline-block bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
                            >
                              Shop Now
                            </a>
                          </div>
              
                          <img
                            src={console}
                            alt="Laptop"
                            className="absolute top-0 ml-45 w-65"
                          />
                        </div>
    
              {/* Second Card */}
              <div className="relative h-[320px] rounded-3xl bg-yellow-800 text-white p-6 flex items-end">
                <div>
                  <p className="text-sm text-black">Enjoy</p>
                  <p className="text-lg">with</p>
                  <p className="text-2xl font-semibold mb-4">Speaker</p>
    
                  <a
                    href="/shop"
                    className="inline-block bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
                  >
                    Shop Now
                  </a>
                </div>
    
                <img
                  src={speaker}
                  alt="Speakers"
                  className="absolute top-22 ml-10 w-50"
                />
              </div>
    
              {/* Third Card (Wide) */}
               <div className="relative h-[320px] rounded-3xl bg-blue-950 text-white p-6 flex items-end">
                <div>
                  <p className="text-sm text-black">Enjoy</p>
                  <p className="text-lg">with</p>
                  <p className="text-2xl font-semibold mb-4">Virtual Reality</p>
    
                  <a
                    href="/shop"
                    className="inline-block bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
                  >
                    Shop Now
                  </a>
                </div>
    
                <img
                  src={virtual}
                  alt="Virtual"
                  className="absolute top-18 ml-11 w-50"
                />
              </div>
    
            </div>
          </div>
        </div>
  )
};

export default Category2
