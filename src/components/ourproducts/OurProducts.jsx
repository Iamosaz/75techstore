import React from "react"
import { useNavigate } from "react-router-dom"
import { FaShoppingCart } from "react-icons/fa"
import SpecialOffers from "./SpecialOffers"
import { useProducts } from "../../hooks/useProducts"

const OurProducts = () => {
  const navigate = useNavigate()
  const { products, loading, error } = useProducts({ limit: 20 })

  // ✅ Split into special (featured) and normal products
  const specialProducts = products.filter(p => p.isFeatured)
  const normalProducts = products.filter(p => !p.isFeatured)

  if (loading) {
    return (
      <section className="px-[8%] lg:px-[12%] my-20">
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 
                          border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="px-[8%] lg:px-[12%] my-20">
        <div className="text-center text-red-500 py-10">{error}</div>
      </section>
    )
  }

  return (
    <section className="px-[8%] lg:px-[12%] my-20">

      {/* SECTION HEADER */}
      <div className="mb-10">
        <span className="text-white font-semibold bg-blue-500 
                         px-5 py-2 rounded-full text-sm">
          Our Products
        </span>
        <h2 className="text-3xl font-black mt-4">Popular Products</h2>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">📦</p>
          <p className="font-medium">No products available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">

          {/* SPECIAL OFFER COLUMN */}
          {specialProducts.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 
                              text-white rounded-2xl p-6 h-full flex flex-col shadow-xl">
                <h3 className="text-xl ml-2 font-bold mb-6">
                  Special Offer Deal
                </h3>
                <div className="flex flex-col gap-6 flex-1">
                  {specialProducts.map(product => (
                    <SpecialOffers
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS GRID */}
          <div className={specialProducts.length > 0 
            ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {normalProducts.map(product => (
                <div
                  key={product._id}
                  className="bg-white border border-gray-100 rounded-xl p-5
                  hover:-translate-y-1 hover:shadow-2xl transition duration-300
                  flex flex-col justify-between group"
                >
                  {/* PRODUCT INFO */}
                  <div
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="cursor-pointer"
                  >
                    <p className="text-xs text-white font-semibold mb-2 
                                  bg-red-500 px-3 py-1 rounded w-fit">
                      {product.category}
                    </p>

                    {/* ✅ Use imageUrl from MongoDB */}
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/200'}
                      alt={product.name}
                      className="w-full h-45 object-contain mb-4 
                                 group-hover:scale-105 transition-transform duration-300"
                    />

                    <h4 className="text-sm font-semibold line-clamp-2 text-gray-700">
                      {product.name}
                    </h4>
                  </div>

                  {/* PRICE + CART */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-lg text-gray-900">
                      ₦{Number(product.price).toLocaleString()}
                    </span>
                    <button
                      className="bg-blue-600 text-white p-2 rounded-full 
                                 hover:bg-blue-700 transition"
                      onClick={() => console.log("Add to cart", product._id)}
                    >
                      <FaShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default OurProducts