import React from 'react'
import { useNavigate } from 'react-router-dom'
import consoleImg from '../../assets/console3.png'
import virtual from '../../assets/VR.png'
import speaker from '../../assets/speaker.png'

const Category2 = () => {
  const navigate = useNavigate()

  const categories = [
    {
      name: 'Consoles',
      category: 'Consoles',
      image: consoleImg,
      bgClass: 'bg-gray-500',
      isWide: true,
      imgPosition: 'absolute right-0 top-0 h-full max-w-[55%] object-contain mr-[20px]'
    },
    {
      name: 'Speakers',
      category: 'Audio',
      image: speaker,
      bgClass: 'bg-yellow-800',
      isWide: false,
      imgPosition: 'absolute right-0 bottom-0 h-[350px] object-contain max-w-[75%]'
    },
    {
      name: 'Virtual Reality',
      category: 'Wearables',
      image: virtual,
      bgClass: 'bg-blue-950',
      isWide: false,
      imgPosition: 'absolute right-0 bottom-0 h-[350px] object-contain max-w-[75%]'
    }
  ]

  return (
    <section className="py-2 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => navigate(`/shop?category=${cat.category}`)}
              className={`relative h-[320px] rounded-3xl ${cat.bgClass}
                text-white p-6 flex items-end overflow-hidden cursor-pointer
                hover:scale-[1.02] transition-all duration-300
                ${cat.isWide ? 'sm:col-span-2' : ''}`}
            >
              {/* Text */}
              <div className="z-10">
                <p className={`text-sm ${cat.bgClass === 'bg-blue-950' 
                  ? 'text-gray-300' : 'text-black'}`}>
                  Enjoy
                </p>
                <p className="text-lg">with</p>
                <p className="text-2xl font-semibold mb-4">
                  {cat.name}
                </p>
                <span className="inline-block bg-white text-black px-5 py-2 
                  rounded-full text-sm font-medium hover:scale-105 transition">
                  Shop Now
                </span>
              </div>

              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className={cat.imgPosition}
              />
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}

export default Category2