import React from 'react'
import { useNavigate } from 'react-router-dom'
import earphone from '../../assets/airpods1.png'
import gadget from '../../assets/gadget.png'
import laptop from '../../assets/macb.png'

const Category = () => {
  const navigate = useNavigate()

  const categories = [
    {
      name: 'Smartwatches',
      category: 'Accessories',
      image: gadget,
      bgClass: 'bg-gradient-to-br from-red-600 to-red-500',
      isWide: false,
      imgClass: 'h-[400px]'
    },
    {
      name: 'Earphones',
      category: 'Audio',
      image: earphone,
      bgClass: 'bg-amber-500',
      isWide: false,
      imgClass: 'h-[380px] max-w-[45%] mr-[50px]'
    },
    {
      name: 'Laptops',
      category: 'Laptops',
      image: laptop,
      bgClass: 'bg-blue-400',
      isWide: true,
      imgClass:'h-[300px] max-w-[45%] mr-[80px]'
    }
  ]

  return (
    <section className="py-4 overflow-x-hidden">
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
                <p className="text-sm text-black">Enjoy</p>
                <p className="text-lg">with</p>
                <p className={`${cat.isWide ? 'text-2xl' : 'text-3xl'} 
                  font-semibold mb-4`}>
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
                className={`absolute right-0 bottom-0 ${cat.imgClass} 
                  object-contain`}
              />
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}

export default Category