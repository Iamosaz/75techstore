import React, { useEffect, useState } from "react"
import { FaStar } from "react-icons/fa"

const SpecialOffers = ({ product, image }) => {
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
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      )
      const seconds = Math.floor(
        (distance % (1000 * 60)) / 1000
      )

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }, 1000)

    return () => clearInterval(interval)

  }, [product?.offerEnds])

  // Total stock calculation
  const totalStock = (product.available || 0) + (product.sold || 0)

  const soldPercentage =
    totalStock > 0 ? (product.sold / totalStock) * 100 : 0

  // Final discounted price
  const finalPrice = product.price - product.discount

  // Discount percentage
  const discountPercent = Math.round(
    (product.discount / product.price) * 100
  )

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition relative flex flex-col">

      {/* Discount Percentage Badge */}
      <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full h-14 w-14 flex items-center justify-center font-bold text-sm shadow-md">
        -{discountPercent}%
      </div>

      {/* Product Image */}
      <img
        src={image}
        alt={product.name}
        className="h-40 mx-auto mb-4 object-contain"
      />

      {/* Product Name */}
      <h3 className="font-semibold text-sm text-center leading-tight">
        {product.name}
      </h3>

      {/* Product Description */}
      {product.description && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          {product.description}
        </p>
      )}

      {/* Star Ratings */}
      <div className="flex justify-center mt-2 text-yellow-400 text-xs">
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar className="text-gray-300" />
      </div>

      {/* Price Section */}
      <div className="mt-3 text-center">
        <span className="text-gray-400 line-through mr-2 text-sm">
          ₦{product.price.toLocaleString()}
        </span>

        <span className="text-red-600 font-bold text-lg">
          ₦{finalPrice.toLocaleString()}
        </span>
      </div>

      {/* Stock Info */}
      <div className="mt-4 text-sm">

        <div className="flex justify-between text-gray-600">
          <span>Available: {product.available}</span>
          <span>Sold: {product.sold}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-yellow-400 h-full transition-all duration-700"
            style={{ width: `${soldPercentage}%` }}
          />
        </div>

        {/* Urgency Message */}
        {product.available <= 5 && (
          <div className="text-red-500 text-xs font-semibold mt-2 text-center">
            Hurry! Only {product.available} left
          </div>
        )}

        {/* Countdown Timer */}
        <div className="mt-3 text-gray-600 text-xs text-center">
          Ends in: {timeLeft}
        </div>

      </div>
    </div>
  )
}

export default SpecialOffers
