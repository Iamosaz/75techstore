// src/pages/OrderTrackingPage.jsx
import React, { useState } from 'react'
import { FiSearch, FiPackage, FiCheckCircle,
  FiTruck, FiClock, FiXCircle } from 'react-icons/fi'
import { orderAPI } from "../admin/services/adminAPI";

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: FiClock },
  { key: 'confirmed', label: 'Confirmed', icon: FiCheckCircle },
  { key: 'processing', label: 'Processing', icon: FiPackage },
  { key: 'shipped', label: 'Shipped', icon: FiTruck },
  { key: 'delivered', label: 'Delivered', icon: FiCheckCircle },
]

const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!orderNumber.trim()) return

    try {
      setLoading(true)
      setError('')
      setOrder(null)
      const response = await orderAPI.trackOrder(orderNumber.trim())
      if (response.success) {
        setOrder(response.order)
      }
    } catch (err) {
      setError('Order not found. Please check your order number.')
    } finally {
      setLoading(false)
    }
  }

  const currentStep = order
    ? statusOrder.indexOf(order.orderStatus)
    : -1

  const statusColors = {
    delivered: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    pending: 'bg-gray-100 text-gray-800',
    confirmed: 'bg-purple-100 text-purple-800',
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex
            items-center justify-center mx-auto mb-4">
            <FiPackage size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Track Your Order
          </h1>
          <p className="text-gray-500 mt-1">
            Enter your order number to track your delivery
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleTrack}
          className="bg-white rounded-2xl p-6 shadow-sm
            border border-gray-100 mb-6">
          <label className="block text-sm font-semibold
            text-gray-700 mb-2">
            Order Number
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. 75TECH-1234567"
              className="flex-1 px-4 py-3 border border-gray-200
                rounded-xl focus:ring-2 focus:ring-blue-500
                focus:border-transparent outline-none text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl
                font-semibold hover:bg-blue-700 transition
                disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white
                  border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSearch size={18} />
              )}
              Track
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-3">⚠️ {error}</p>
          )}
        </form>

        {/* Order Result */}
        {order && (
          <div className="space-y-6">

            {/* Order Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm
              border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-gray-500">Order Number</p>
                  <p className="text-lg font-bold text-blue-600 font-mono">
                    {order.orderNumber}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs
                  font-semibold capitalize
                  ${statusColors[order.orderStatus]}`}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-NG', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-bold text-blue-600">
                    ₦{order.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Payment</p>
                  <p className="font-medium capitalize">
                    {order.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Status</p>
                  <p className={`font-medium capitalize
                    ${order.paymentStatus === 'paid'
                      ? 'text-green-600'
                      : 'text-yellow-600'
                    }`}>
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Tracker */}
            {order.orderStatus !== 'cancelled' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm
                border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6">
                  Delivery Progress
                </h3>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-4 top-4 bottom-4 w-0.5
                    bg-gray-200" />
                  <div
                    className="absolute left-4 top-4 w-0.5 bg-blue-600
                      transition-all duration-500"
                    style={{
                      height: currentStep >= 0
                        ? `${(currentStep / (statusSteps.length - 1)) * 100}%`
                        : '0%'
                    }}
                  />

                  <div className="space-y-6 relative">
                    {statusSteps.map((step, index) => {
                      const isCompleted = index <= currentStep
                      const isCurrent = index === currentStep
                      const Icon = step.icon

                      return (
                        <div key={step.key}
                          className="flex items-center gap-4 relative">
                          <div className={`w-8 h-8 rounded-full flex
                            items-center justify-center flex-shrink-0
                            transition-all duration-300 relative z-10
                            ${isCompleted
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-400'
                            }
                            ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                          >
                            <Icon size={14} />
                          </div>
                          <div>
                            <p className={`font-semibold text-sm
                              ${isCompleted
                                ? 'text-gray-900'
                                : 'text-gray-400'
                              }`}>
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-blue-600">
                                Current Status
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Cancelled */}
            {order.orderStatus === 'cancelled' && (
              <div className="bg-red-50 border border-red-200 rounded-2xl
                p-6 flex items-center gap-4">
                <FiXCircle size={32} className="text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-red-700">Order Cancelled</p>
                  {order.cancelReason && (
                    <p className="text-sm text-red-600 mt-1">
                      Reason: {order.cancelReason}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Status History */}
            <div className="bg-white rounded-2xl p-6 shadow-sm
              border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">
                Status History
              </h3>
              <div className="space-y-3 border-l-2 border-blue-200 pl-4">
                {order.statusHistory?.map((history, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-5 w-2.5 h-2.5
                      bg-blue-600 rounded-full top-1.5" />
                    <p className="text-sm font-semibold capitalize
                      text-gray-800">
                      {history.status}
                    </p>
                    {history.message && (
                      <p className="text-xs text-gray-500">
                        {history.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(history.updatedAt).toLocaleString('en-NG')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm
              border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">
                📍 Delivery Address
              </h3>
              <p className="text-sm text-gray-700">
                {order.shippingAddress?.fullName}
              </p>
              <p className="text-sm text-gray-600">
                {order.shippingAddress?.address}
              </p>
              <p className="text-sm text-gray-600">
                {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.state}
              </p>
              <p className="text-sm text-gray-600">
                📞 {order.shippingAddress?.phone}
              </p>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl p-6 shadow-sm
              border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">
                🛍️ Items Ordered
              </h3>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={item.imageUrl || '/placeholder.png'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg
                        bg-gray-100"
                      onError={(e) => e.target.src = '/placeholder.png'}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} • {item.condition}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}