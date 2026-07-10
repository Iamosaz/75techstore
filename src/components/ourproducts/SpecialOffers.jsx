import React, { useEffect, useState } from "react"
import { FaStar } from "react-icons/fa"

const SpecialOffers = ({ product }) => {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    if (!product?.offerEnds) return
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(product.offerEnds).getTime()
      const distance = end - now

      if (distance <= 0) {
        setTimeLeft("Offer Expired")
        clearInterval(interval)
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }, 1000)

    return () => clearInterval(interval)
  }, [product?.offerEnds])

  // ✅ Use stock from MongoDB
  const stock = product.stock || 0
  const sold = product.sold || 0
  const totalStock = stock + sold
  const soldPercentage = totalStock > 0 ? (sold / totalStock) * 100 : 0

  // ✅ Use discount from MongoDB if exists
  const discount = product.discount || 0
  const finalPrice = product.price - discount
  const discountPercent = discount > 0
    ? Math.round((discount / product.price) * 100)
    : 0

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl 
                    transition relative flex flex-col">

      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-3 right-3 bg-red-500 text-white 
                        rounded-full h-14 w-14 flex items-center justify-center 
                        font-bold text-sm shadow-md">
          -{discountPercent}%
        </div>
      )}

      {/* ✅ Image from MongoDB imageUrl */}
      <img
        src={product.imageUrl || 'https://via.placeholder.com/200'}
        alt={product.name}
        className="h-40 mx-auto mb-4 object-contain"
      />

      <h3 className="font-semibold text-sm text-center leading-tight">
        {product.name}
      </h3>

      {product.description && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          {product.description}
        </p>
      )}

      <div className="flex justify-center mt-2 text-yellow-400 text-xs">
        <FaStar /><FaStar /><FaStar /><FaStar />
        <FaStar className="text-gray-300" />
      </div>

      <div className="mt-3 text-center">
        {discount > 0 && (
          <span className="text-gray-400 line-through mr-2 text-sm">
            ₦{product.price.toLocaleString()}
          </span>
        )}
        <span className="text-red-600 font-bold text-lg">
          ₦{finalPrice.toLocaleString()}
        </span>
      </div>

      {/* Stock Info */}
      <div className="mt-4 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Available: {stock}</span>
          <span>Sold: {sold}</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-yellow-400 h-full transition-all duration-700"
            style={{ width: `₦{soldPercentage}%` }}
          />
        </div>
        {stock <= 5 && stock > 0 && (
          <div className="text-red-500 text-xs font-semibold mt-2 text-center">
            Hurry! Only {stock} left
          </div>
        )}
        {timeLeft && (
          <div className="mt-3 text-gray-600 text-xs text-center">
            Ends in: {timeLeft}
          </div>
        )}
      </div>
    </div>
  )
}

export default SpecialOffers