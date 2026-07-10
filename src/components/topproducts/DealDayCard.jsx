import React, { useEffect, useState } from "react"
import { FaFire, FaShoppingCart } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const DealDayCard = ({ deals = [] }) => {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(3600)

  useEffect(() => {
    if (deals.length === 0) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % deals.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [deals.length])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3600))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0")
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return { h, m, s }
  }

  const { h, m, s } = formatTime(timeLeft)

  if (deals.length === 0) {
    return (
      <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl text-center">
        <p className="text-2xl mb-2">🔥</p>
        <p className="font-medium text-sm">No deals available</p>
        <p className="text-xs text-gray-400 mt-1">
          Add deals from admin panel
        </p>
      </div>
    )
  }

  const deal = deals[current]

  return (
    <div className="bg-gradient-to-b from-blue-600 to-blue-800
      rounded-2xl overflow-hidden shadow-xl text-white flex flex-col h-full">

      {/* HEADER */}
      <div className="p-5 text-center border-b border-blue-500">
        <div className="flex items-center justify-center gap-2 mb-1">
          <FaFire className="text-orange-400" size={18} />
          <h3 className="text-lg font-extrabold tracking-wide uppercase">
            Deal of the Day
          </h3>
          <FaFire className="text-orange-400" size={18} />
        </div>
        <p className="text-blue-200 text-xs">Hurry up! Offer ends soon</p>
      </div>

      {/* COUNTDOWN TIMER */}
      <div className="flex justify-center gap-3 py-4 px-5">
        {[
          { label: "Hrs", value: h },
          { label: "Min", value: m },
          { label: "Sec", value: s }
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <div className="bg-white text-blue-700 font-extrabold text-xl
              w-12 h-12 flex items-center justify-center rounded-xl shadow-md">
              {item.value}
            </div>
            <span className="text-[10px] text-blue-200 mt-1 uppercase tracking-widest">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* PRODUCT IMAGE */}
      <div
        onClick={() => navigate(`/product/${deal._id}`)}
        className="bg-white/10 mx-4 rounded-xl flex items-center
          justify-center h-44 overflow-hidden cursor-pointer"
      >
        <img
          // ✅ Fixed - use imageUrl not image
          src={deal.imageUrl || 'https://via.placeholder.com/200'}
          alt={deal.name}
          className="h-40 object-contain transition-all duration-500
                     hover:scale-110"
        />
      </div>

      {/* PRODUCT INFO */}
      <div className="p-5 flex flex-col gap-3 flex-1">

        {/* CATEGORY */}
        <span className="bg-orange-400 text-white text-[10px] font-bold
          px-2 py-1 rounded-full w-fit uppercase">
          {deal.category || "Hot Deal"}
        </span>

        {/* NAME */}
        <h4
          onClick={() => navigate(`/product/${deal._id}`)}
          className="text-sm font-semibold leading-snug line-clamp-2
                     cursor-pointer hover:text-orange-300 transition"
        >
          {deal.name}
        </h4>

        {/* PRICE */}
        <div>
          {deal.discount > 0 && (
            <span className="text-blue-300 line-through text-xs mr-2">
              ₦{Number(deal.price).toLocaleString()}
            </span>
          )}
          <span className="text-2xl font-extrabold text-orange-300">
            ₦{Number(deal.price - (deal.discount || 0)).toLocaleString()}
          </span>
        </div>

        {/* DOTS */}
        {deals.length > 1 && (
          <div className="flex justify-center gap-2 mt-1">
            {deals.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-white w-4" : "bg-blue-400 w-2"
                }`}
              />
            ))}
          </div>
        )}

        {/* ADD TO CART */}
        <button
          className="mt-2 w-full bg-orange-400 hover:bg-orange-500
            text-white font-bold py-2.5 rounded-xl flex items-center
            justify-center gap-2 transition-all duration-300"
          onClick={() => console.log("Add to cart", deal._id)}
        >
          <FaShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default DealDayCard