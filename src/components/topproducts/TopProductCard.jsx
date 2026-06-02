import React from "react"
import { useNavigate } from "react-router-dom"
import { FaShoppingCart, FaEye } from "react-icons/fa"

const TopProductCard = ({ product }) => {
  const navigate = useNavigate()

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-10
      hover:-translate-y-2 hover:shadow-xl transition-all duration-300 
      flex flex-col justify-between group relative"
    >

      {/* BADGE */}
      <div className="absolute top-3 left-3 z-10 ">
        <span className="bg-red-600 text-white text-sm font-semibold
          px-2 py-1 ">
          {product.category || "Product"}
        </span>
      </div>

      {/* IMAGE AREA */}
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="cursor-pointer bg-gray-50 flex items-center 
          justify-center h-44 overflow-hidden px-4 pt-8 pb-2"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full object-contain group-hover:scale-110 
            transition-transform duration-500"
        />
      </div>

      {/* INFO */}
      <div className="p-4 flex flex-col gap-3">

        {/* NAME */}
        <h4
          onClick={() => navigate(`/product/${product.id}`)}
          className="text-sm font-semibold text-gray-800 
            line-clamp-2 cursor-pointer hover:text-blue-600 
            transition-colors duration-200"
        >
          {product.name}
        </h4>

        {/* PRICE + CART */}
        <div className="flex items-center justify-between">

          <span className="text-base font-extrabold text-gray-900">
            ₦{Number(product.price).toLocaleString()}
          </span>

          <div className="flex gap-2">

            {/* VIEW BUTTON */}
            {/* <button
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-gray-100 text-gray-600 p-2 rounded-full 
                hover:bg-gray-200 transition"
              title="View Product"
            >
              <FaEye size={13} />
            </button> */}

            {/* CART BUTTON */}
            <button
              onClick={() => console.log("Add to cart", product.id)}
              className="bg-blue-600 text-white p-2 rounded-full 
                hover:bg-blue-700 transition"
              title="Add to Cart"
            >
              <FaShoppingCart size={13} />
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default TopProductCard