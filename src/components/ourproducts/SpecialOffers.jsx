import React, { useEffect, useState } from "react"

const SpecialOffers = ({ product, image }) => {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(product.offerEnds).getTime()
      const distance = end - now

      if (distance <= 0) {
        setTimeLeft("Offer Expired")
        clearInterval(interval)
      } else {
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

        setTimeLeft(
          `${days}d ${hours}h ${minutes}m ${seconds}s`
        )
      }
    }, 1000)

    // Cleanup function (very important)
    return () => clearInterval(interval)

  }, [product.offerEnds])

  const totalStock = product.available + product.sold
  const soldPercentage =
    totalStock > 0 ? (product.sold / totalStock) * 100 : 0

  const finalPrice = product.price - product.discount

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg text-center relative h-full flex flex-col justify-between">

      {/* Discount Badge */}
      <div className="absolute top-3 right-3 bg-yellow-400 text-black rounded-full h-14 w-14 flex items-center justify-center font-bold text-xs shadow-md leading-tight">
        Save <br /> ₦{product.discount}
      </div>

      <img
        src={image}
        alt={product.name}
        className=" mx-auto mb-4 object-contain"
      />

      <h3 className="font-semibold text-sm leading-tight">
        {product.name}
      </h3>

      <div className="mt-2">
        <span className="text-gray-400 line-through mr-2 text-sm">
          ₦{product.price}
        </span>
        <span className="text-red-600 font-bold text-lg">
          ₦{finalPrice}
        </span>
      </div>

      {/* Stock Info */}
      <div className="mt-4 text-left text-sm">

        <div className="flex justify-between">
          <span>Available: {product.available}</span>
          <span>Sold: {product.sold}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-yellow-400 h-full transition-all duration-1000 ease-in-out"
            style={{ width: `${soldPercentage}%` }}
          />
        </div>

        {product.available < 5 && (
          <div className="text-red-600 mt-2 font-semibold text-xs">
            Limited Stock!
          </div>
        )}

        {/* Countdown */}
        <div className="mt-2 text-gray-600 text-xs">
          Ends in: {timeLeft}
        </div>

      </div>
    </div>
  )
}

export default SpecialOffers
