import React from "react"
import { useNavigate } from "react-router-dom"
import { FaShoppingCart } from "react-icons/fa"

const imageSizeClasses = {
  small: 'h-28',
  medium: 'h-44',
  large: 'h-56'
}

const TopProductCard = ({ product }) => {
  const navigate = useNavigate()

  // ✅ Get image size class from database
  const imgSize = imageSizeClasses[product.imageSize] || imageSizeClasses.medium

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-10
      hover:-translate-y-2 hover:shadow-xl transition-all duration-300
      flex flex-col justify-between group relative">

      <div className="absolute top-3 left-3 z-10">
        <span className="bg-red-600 text-white text-sm font-semibold px-2 py-1">
          {product.category || "Product"}
        </span>
      </div>

      {/* ✅ Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-3 right-3 z-10 bg-orange-500 text-white
                        text-xs font-bold px-2 py-1 rounded-full">
          -{Math.round((product.discount / product.price) * 100)}%
        </div>
      )}

      {/* ✅ Image with dynamic size */}
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        className={`cursor-pointer bg-gray-50 flex items-center
          justify-center ₦{imgSize} overflow-hidden px-4 pt-8 pb-2`}
      >
        <img
          src={product.imageUrl || 'https://via.placeholder.com/200'}
          alt={product.name}
          className="h-full object-contain group-hover:scale-110
            transition-transform duration-500"
        />
      </div>

      <div className="p-4 flex flex-col gap-3">
        <h4
          onClick={() => navigate(`/product/${product._id}`)}
          className="text-sm font-semibold text-gray-800
            line-clamp-2 cursor-pointer hover:text-blue-600
            transition-colors duration-200"
        >
          {product.name}
        </h4>

        <div className="flex items-center justify-between">
          <div>
            {product.discount > 0 && (
              <span className="text-gray-400 line-through text-xs mr-1">
                ₦{Number(product.price).toLocaleString()}
              </span>
            )}
            <span className="text-base font-extrabold text-gray-900">
              ₦{Number(product.price - (product.discount || 0)).toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => console.log("Add to cart", product._id)}
            className="bg-blue-600 text-white p-2 rounded-full
              hover:bg-blue-700 transition"
          >
            <FaShoppingCart size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TopProductCard