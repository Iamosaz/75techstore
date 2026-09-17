import React from "react"
import { useNavigate } from "react-router-dom"
import { FaShoppingCart } from "react-icons/fa"

const TopProductCard = ({ product }) => {
  const navigate = useNavigate()

  // Calculate discount percentage if discount exists
  const discountPercent = product.discount && product.price
    ? Math.round((product.discount / product.price) * 100)
    : 0

  const finalPrice = product.price - (product.discount || 0)

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-orange-300 transition-all duration-300 flex flex-col justify-between group relative">

      {/* 🏷️ Category Badge */}
      {product.category && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-gray-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded">
            {product.category}
          </span>
        </div>
      )}

      {/* 🏷️ Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">
          -{discountPercent}%
        </div>
      )}

      {/* 🖼️ LARGE JUMIA-STYLE IMAGE CONTAINER */}
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        className="cursor-pointer w-full aspect-square bg-gray-50 flex items-center justify-center p-4 overflow-hidden relative"
      >
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* 📝 Details & Price Section */}
      <div className="p-3 flex flex-col justify-between flex-grow gap-2">
        <h4
          onClick={() => navigate(`/product/${product._id}`)}
          title={product.name}
          className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 cursor-pointer hover:text-orange-500 transition-colors leading-snug"
        >
          {product.name}
        </h4>

        <div className="flex items-end justify-between pt-1 border-t border-gray-100 mt-auto">
          <div className="flex flex-col">
            {product.discount > 0 && (
              <span className="text-gray-400 line-through text-xs">
                ₦{Number(product.price).toLocaleString()}
              </span>
            )}
            <span className="text-sm sm:text-base font-bold text-gray-900">
              ₦{Number(finalPrice).toLocaleString()}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              console.log("Add to cart", product._id)
            }}
            aria-label="Add to cart"
            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white p-2 rounded-lg transition-all shadow-sm"
          >
            <FaShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TopProductCard