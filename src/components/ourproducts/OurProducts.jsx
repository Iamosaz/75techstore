// src/components/OurProducts.jsx
import React, { useContext, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { FaShoppingCart, FaCheck, FaStar, FaBolt, FaChevronRight, FaChevronLeft } from "react-icons/fa"
import { useProducts } from "../../hooks/useProducts"
import { CartContext } from "../../context/CartContext"

const OurProducts = () => {
  const navigate = useNavigate()
  const { products, loading, error } = useProducts({ limit: 20 })
  const { addToCart, isInCart } = useContext(CartContext)
  
  // Ref to target the sliding container
  const sliderRef = useRef(null)

  const flashSales = products.filter(p => p.isFeatured)
  const regularProducts = products.filter(p => !p.isFeatured)

  // Scroll handler for the slider
  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current
      const scrollAmount = clientWidth * 0.8 // Scroll 80% of the viewport width
      const targetScroll = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount

      sliderRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-red-500 font-bold bg-white rounded-xl shadow-sm">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 space-y-8 bg-gray-100/60">
      
      {/* Injecting CSS to completely hide horizontal scrollbars across all browsers */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 🔴 1. JUMIA FLASH SALES SLIDER BOX (Unified Template)     */}
      {/* ══════════════════════════════════════════════════════════ */}
      {flashSales.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative group/section">
          
          {/* Jumia Red Top Bar */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 px-4 sm:px-6 py-3.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <FaBolt className="text-yellow-300 animate-pulse" size={18} />
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wide">
                Flash Sales | Top Deals
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Desktop Slider Nav Controls */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => handleScroll('left')}
                  className="p-1.5 bg-black/20 hover:bg-black/40 rounded-full transition cursor-pointer active:scale-90"
                >
                  <FaChevronLeft size={12} />
                </button>
                <button
                  onClick={() => handleScroll('right')}
                  className="p-1.5 bg-black/20 hover:bg-black/40 rounded-full transition cursor-pointer active:scale-90"
                >
                  <FaChevronRight size={12} />
                </button>
              </div>

              <button
                onClick={() => navigate('/shop')}
                className="text-xs sm:text-sm font-bold flex items-center gap-1 hover:underline uppercase tracking-wider cursor-pointer"
              >
                See All <FaChevronRight size={10} />
              </button>
            </div>
          </div>

          {/* Slider Row */}
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none divide-x divide-gray-100"
          >
            {flashSales.map(product => {
              const discount = product.discount || 0
              const finalPrice = product.price - discount
              const discountPercent = discount > 0 ? Math.round((discount / product.price) * 100) : 0

              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/shop/${product._id}`)}
                  className="group bg-white p-3 sm:p-5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative cursor-pointer flex-shrink-0 w-1/2 sm:w-1/3 lg:w-1/4 snap-start"
                >
                  {/* Jumia Orange Discount Badge */}
                  {discountPercent > 0 && (
                    <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm z-10">
                      -{discountPercent}%
                    </span>
                  )}

                  {/* 📸 LARGE DOMINANT IMAGE */}
                  <div className="w-full h-44 sm:h-52 md:h-56 flex items-center justify-center p-2 mb-3 bg-white">
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
                      loading="lazy"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1.5 flex-grow">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.brand}</p>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  {/* Pricing & Add to Cart */}
                  <div className="mt-3 pt-2 flex items-end justify-between border-t border-gray-50">
                    <div>
                      <p className="text-sm sm:text-base font-black text-gray-900 leading-tight">
                        ₦{Number(finalPrice).toLocaleString()}
                      </p>
                      {discount > 0 && (
                        <p className="text-[11px] text-gray-400 line-through font-bold mt-0.5">
                          ₦{Number(product.price).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className={`p-2 rounded-lg transition cursor-pointer shadow-sm ${
                        isInCart(product._id)
                          ? "bg-emerald-500 text-white"
                          : "bg-orange-500 hover:bg-orange-600 text-white"
                      }`}
                      title={isInCart(product._id) ? "Added to Cart" : "Add to Cart"}
                    >
                      {isInCart(product._id) ? <FaCheck size={12} /> : <FaShoppingCart size={12} />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Left Absolute Floating Button (Appears on Hover on Large Screens) */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 shadow-md p-3 rounded-full hidden lg:group-hover/section:block border border-gray-200 transition-all active:scale-95 cursor-pointer"
          >
            <FaChevronLeft size={16} />
          </button>

          {/* Right Absolute Floating Button (Appears on Hover on Large Screens) */}
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 shadow-md p-3 rounded-full hidden lg:group-hover/section:block border border-gray-200 transition-all active:scale-95 cursor-pointer"
          >
            <FaChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 🛍️ 2. JUMIA POPULAR PRODUCTS (Single Unified Template)     */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-blue-600 rounded-sm" />
            <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-tight">
              Recommended For You
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase tracking-wider cursor-pointer"
          >
            See All <FaChevronRight size={10} />
          </button>
        </div>

        {/* Large Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-gray-100">
          {regularProducts.map(product => {
            const discount = product.discount || 0
            const finalPrice = product.price - discount
            const discountPercent = discount > 0 ? Math.round((discount / product.price) * 100) : 0

            return (
              <div
                key={product._id}
                onClick={() => navigate(`/shop/${product._id}`)}
                className="group bg-white p-3 sm:p-5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative cursor-pointer"
              >
                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm z-10">
                    -{discountPercent}%
                  </span>
                )}

                {/* 📸 LARGE DOMINANT IMAGE */}
                <div className="w-full h-48 sm:h-56 md:h-64 flex items-center justify-center p-2 mb-3 bg-white">
                  <img
                    src={product.imageUrl || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      {product.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{product.brand}</span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 pt-0.5">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FaStar key={s} size={9} fill="currentColor" />
                      ))}
                    </div>
                    <span className="font-bold">({product.numReviews || 0})</span>
                  </div>
                </div>

                {/* Pricing & Cart Action */}
                <div className="mt-3 pt-2 flex items-end justify-between border-t border-gray-50">
                  <div>
                    <p className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                      ₦{Number(finalPrice).toLocaleString()}
                    </p>
                    {discount > 0 && (
                      <p className="text-xs text-gray-400 line-through font-bold mt-0.5">
                        ₦{Number(product.price).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className={`p-2.5 rounded-xl transition cursor-pointer shadow-sm ${
                      isInCart(product._id)
                        ? "bg-emerald-500 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                    title={isInCart(product._id) ? "Added to Cart" : "Add to Cart"}
                  >
                    {isInCart(product._id) ? <FaCheck size={13} /> : <FaShoppingCart size={13} />}
                  </button>
                </div>

              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default OurProducts