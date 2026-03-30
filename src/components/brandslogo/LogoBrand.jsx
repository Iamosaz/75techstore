import React from 'react'

// Import swiper 
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"

import "swiper/css"

// import the brand logos
import dell from "../../assets/Brands/dell.png"
import msi from "../../assets/Brands/MSI.png"
import samsung from "../../assets/Brands/samsung.png"
import hp from "../../assets/Brands/hp.png"
import nvidia from "../../assets/Brands/Nvidia.png"
import lenovo from "../../assets/Brands/Lenovo.png"
import acer from "../../assets/Brands/acer.png"
import apple from "../../assets/Brands/apple.png"
import sony from "../../assets/Brands/sony.png"
import toshiba from "../../assets/Brands/toshiba.png"
import Techstore75 from "../../assets/Brands/75logo.png"

const LogoBrand = () => {
   const  brands = [msi, samsung, Techstore75, hp, dell, nvidia, lenovo, acer, toshiba, sony, apple]
  return (
  <section className='py-10 bg-gray-50'>
     <h2 className='text-center text-3xl font-bold mb-10'>
       Top Brands
     </h2>
     <div className="max-w-6xl mx-auto px-4">
        {/* Brands logo display setup */}
         <Swiper
      modules={[Autoplay]}
      slidesPerView={2}
        spaceBetween={30}
        loop={true}
       speed={2000} // smooth continuous motion
          autoplay={{
            delay: 0, // makes it continuous instead of jumping
            disableOnInteraction: false,
            pauseOnMouseEnter: true, // pause on hover
          }}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
      >
        {brands.map((logo, index) =>(
          <SwiperSlide key={index}>
            <div className='flex items-center justify-center bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition duration-300'>
             <img src={logo} alt="brands" className='h-16 object-contain '/>
            </div>
          </SwiperSlide>
        ))}

     </Swiper>
     </div>
  
   
  </section>
  )
}

export default LogoBrand