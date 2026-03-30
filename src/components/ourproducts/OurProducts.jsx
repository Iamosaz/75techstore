import React from "react"
import { useNavigate } from "react-router-dom"
import { FaShoppingCart } from "react-icons/fa"
import SpecialOffers from "./SpecialOffers"
import ProductData from "../Data.json"
import phone from "../../assets/SAMSUNG Galaxy A13.png"
import speakers from "../../assets/speaker.png"

const imageMap = {
  phone,
  speakers,
}

const OurProducts = () => {
  const navigate = useNavigate()

  const products = ProductData.products
  const specialProducts = products.filter(p => p.discount)
  const normalProducts = products.filter(p => !p.discount)

  return (
    <section className="px-[8%] lg:px-[12%] my-20">

      {/* SECTION HEADER */}
      <div className="mb-10">
        <span className="text-white font-semibold bg-blue-500 px-5 py-2 rounded-full text-sm">
          Our Products
        </span>

        <h2 className="text-3xl font-black mt-4">
          Popular Products
        </h2>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">

        {/* SPECIAL OFFER COLUMN */}
        <div className="lg:col-span-1">

          <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-2xl p-6 h-full flex flex-col shadow-xl">

            <h3 className="text-xl ml-2 font-bold mb-6">
               Special Offer Deal
            </h3>

            <div className="flex flex-col gap-6 flex-1">
              {specialProducts.map(product => (
                <SpecialOffers
                  key={product.id}
                  product={product}
                  image={imageMap[product.image]}
                />
              ))}
            </div>

          </div>

        </div>

        {/* PRODUCTS GRID */}
        <div className="lg:col-span-3">

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {normalProducts.map(product => (
              <div
                key={product.id}
                className="bg-white border border-gray-100 rounded-xl p-5 
                hover:-translate-y-1 hover:shadow-2xl transition duration-300 
                flex flex-col justify-between group"
              >

                {/* PRODUCT INFO */}
                <div
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="cursor-pointer"
                >

                  <p className="text-xs text-white font-semibold mb-2 bg-red-500 px-3 py-1 rounded w-fit">
                    {product.category}
                  </p>

                  <img
                    src={imageMap[product.image]}
                    alt={product.name}
                    className="w-full h-32 object-contain mb-4 group-hover:scale-105 transition-transform duration-300"
                  />

                  <h4 className="text-sm font-semibold line-clamp-2 text-gray-700">
                    {product.name}
                  </h4>

                </div>

                {/* PRICE + CART */}
                <div className="flex items-center justify-between mt-4">

                  <span className="font-bold text-lg text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </span>

                  <button
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
                    onClick={() => console.log("Add to cart", product.id)}
                  >
                    <FaShoppingCart size={14} />
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  )
}

export default OurProducts
