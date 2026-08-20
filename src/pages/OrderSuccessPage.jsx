// src/pages/OrderSuccessPage.jsx
import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi'

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('order')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center
      justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">

        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-50 rounded-full flex
          items-center justify-center mx-auto">
          <FiCheckCircle size={48} className="text-green-500" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-gray-500 mt-2">
            Thank you for shopping with 75TechStore
          </p>
        </div>

        {/* Order Number */}
        {orderNumber && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <p className="text-sm text-gray-500 mb-1">Your Order Number</p>
            <p className="text-2xl font-bold text-blue-600 font-mono">
              {orderNumber}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Save this number to track your order
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm
          border border-gray-100 text-left space-y-3">
          <h3 className="font-semibold text-gray-900">What happens next?</h3>
          {[
            '✅ You will receive a confirmation email shortly',
            '📦 We will process your order within 24 hours',
            '🚚 Delivery within 1-3 business days',
            '📞 We will call you before delivery',
          ].map((step) => (
            <p key={step} className="text-sm text-gray-600">{step}</p>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/track-order"
            className="flex-1 flex items-center justify-center gap-2
              bg-blue-600 text-white font-bold py-3 rounded-xl
              hover:bg-blue-700 transition"
          >
            <FiPackage size={18} />
            Track Order
          </Link>
          <Link
            to="/shop"
            className="flex-1 flex items-center justify-center gap-2
              bg-gray-100 text-gray-700 font-bold py-3 rounded-xl
              hover:bg-gray-200 transition"
          >
            <FiHome size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}