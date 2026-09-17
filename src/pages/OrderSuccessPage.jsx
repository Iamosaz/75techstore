// src/pages/OrderSuccessPage.jsx
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiCheckCircle, FiPackage, FiHome, FiLoader } from 'react-icons/fi'
import axios from 'axios'
import { trackEvent } from '../utils/trafficTracker' // ✅ Imported traffic tracker

const API_URL = import.meta.env.URL || 'http://localhost:5000/api'

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('order')
  
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  // 📦 1. Fetch real order details from your database to extract total amount and items
  useEffect(() => {
    if (!orderNumber) {
      setLoading(false)
      return
    }

    const fetchOrderDetails = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/orders/${orderNumber}`)
        const fetchedOrder = data.order || data
        setOrder(fetchedOrder)

        // 🎯 2. Attribute conversion & revenue directly to the visitor's traffic source session
        trackEvent("purchase_completed", {
          amount: fetchedOrder.totalAmount || fetchedOrder.total || 0,
          productName: fetchedOrder.items?.map(item => item.name).join(", ") || "Gadget Purchase",
          productId: fetchedOrder.items?.[0]?._id || fetchedOrder.items?.[0]?.product || undefined
        })

      } catch (err) {
        console.error("Tracking conversion failed: Could not resolve order details", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderNumber])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <FiLoader size={40} className="text-blue-600 animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Securing transaction details...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6">

        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <FiCheckCircle size={48} className="text-green-500 animate-bounce" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Thank you for shopping with 75TechStore
          </p>
        </div>

        {/* Order Number */}
        {orderNumber && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Your Order Number</p>
            <p className="text-2xl font-bold text-blue-600 font-mono tracking-wider">
              {orderNumber}
            </p>
            {order && (
              <p className="text-sm font-bold text-gray-800 mt-2">
                Total Amount Paid: ₦{(order.totalAmount || order.total || 0).toLocaleString()}
              </p>
            )}
            <p className="text-[10px] text-gray-400 mt-3">
              Save this number to track your order delivery
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left space-y-3.5">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">What happens next?</h3>
          <div className="space-y-2.5">
            {[
              '✅ You will receive a confirmation email shortly',
              '📦 We will process your order within 24 hours',
              '🚚 Delivery within 1-3 business days',
              '📞 We will call you before delivery',
            ].map((step) => (
              <p key={step} className="text-xs sm:text-sm text-gray-600 font-medium">{step}</p>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/track-order"
            className="flex-1 flex items-center justify-center gap-2
              bg-blue-600 text-white font-bold py-3.5 rounded-xl text-sm
              hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            <FiPackage size={18} />
            Track Order
          </Link>
          <Link
            to="/shop"
            className="flex-1 flex items-center justify-center gap-2
              bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl text-sm
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