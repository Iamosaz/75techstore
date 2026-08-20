// src/pages/CheckoutPage.jsx
import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiMapPin, FiPhone, FiUser, FiFileText } from 'react-icons/fi'
import { CartContext } from '../context/CartContext'
import { UserContext } from '../context/UserContext'
import { orderAPI } from '../admin/services/adminAPI'

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
]

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, clearCart } = useContext(CartContext)
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const shippingFee = cartSubtotal > 50000 ? 0 : 2000
  const total = cartSubtotal + shippingFee

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    customerNote: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paystackReady, setPaystackReady] = useState(false)

  // ✅ Preload Paystack script
  useEffect(() => {
    if (window.PaystackPop) {
      setPaystackReady(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => setPaystackReady(true)
    document.body.appendChild(script)
  }, [])

  if (!user) {
    navigate('/login?redirect=/checkout')
    return null
  }

  if (cartItems.length === 0) {
    navigate('/cart')
    return null
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const validateForm = () => {
    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim() ||
        !form.city.trim() || !form.state) {
      setError('Please fill in all required delivery fields')
      return false
    }
    if (form.phone.trim().length < 10) {
      setError('Please enter a valid phone number')
      return false
    }
    return true
  }

  // ✅ Save order to database after payment succeeds
  const saveOrder = async (reference) => {
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          imageUrl: item.imageUrl,
          price: item.price,
          quantity: item.quantity,
          condition: item.condition,
          grade: item.grade || 'N/A'
        })),
        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state,
          landmark: form.landmark.trim()
        },
        paymentMethod: 'Paystack',
        paymentStatus: 'paid',
        paystackReference: reference,
        subtotal: cartSubtotal,
        shippingFee,
        discount: 0,
        totalAmount: total,
        customerNote: form.customerNote.trim()
      }

      const response = await orderAPI.createOrder(orderData)

      if (response && response.success) {
        clearCart()
        navigate(`/order-success?order=${response.order.orderNumber}`)
      } else {
        throw new Error(response.message || 'Could not finalize order')
      }
    } catch (err) {
      console.error('Save order error:', err)
      setError(err.message || 'Payment received but failed to record order. Please contact support.')
      setLoading(false)
    }
  }

  // ✅ Launch Paystack popup with correct callback & onClose
  const handlePaystackPayment = () => {
    if (!validateForm()) return

    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY
    if (!publicKey) {
      setError('Paystack public key is missing. Check your frontend .env file.')
      return
    }

    if (!window.PaystackPop) {
      setError('Payment gateway is still loading. Please try in a few seconds.')
      return
    }

    setLoading(true)
    setError('')

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: user.email,
      amount: Math.round(total * 100), // In Kobo
      currency: 'NGN',
      ref: `75T-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      metadata: {
        custom_fields: [
          {
            display_name: 'Customer Name',
            variable_name: 'customer_name',
            value: form.fullName
          },
          {
            display_name: 'Phone',
            variable_name: 'phone',
            value: form.phone
          },
          {
            display_name: 'Address',
            variable_name: 'address',
            value: `${form.address}, ${form.city}, ${form.state}`
          }
        ]
      },
      // ✅ Correct Paystack v1 callback
      callback: function (response) {
        console.log('✅ Paystack response reference:', response.reference)
        saveOrder(response.reference)
      },
      // ✅ Correct Paystack v1 close handler
      onClose: function () {
        setLoading(false)
      }
    })

    handler.openIframe()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-500 text-sm">
              Complete your delivery and payment details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===== Shipping Form ===== */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiMapPin className="text-blue-600" />
                Shipping Address
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                  ⚠️ {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3.5 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-gray-50"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3.5 text-gray-400" size={16} />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="08012345678"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-gray-50"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Example Street, Ikeja"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-gray-50"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Lagos"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-gray-50"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    State *
                  </label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-gray-50"
                  >
                    <option value="">Select State</option>
                    {NIGERIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Landmark */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={form.landmark}
                    onChange={handleChange}
                    placeholder="Near GTBank, opposite Shoprite..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Customer Note */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiFileText className="text-blue-600" />
                Order Note (Optional)
              </h2>
              <textarea
                name="customerNote"
                value={form.customerNote}
                onChange={handleChange}
                placeholder="Any special instructions for delivery..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-gray-50 resize-none"
              />
            </div>

            {/* Payment Badge */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">💳 Payment Method</h2>
              <div className="flex items-center gap-4 p-4 bg-green-50 border-2 border-green-500 rounded-xl">
                <div className="w-4 h-4 bg-green-600 rounded-full flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">Paystack Secure Checkout</p>
                  <p className="text-gray-500 text-xs mt-0.5">Cards, Bank Transfer, USSD & Apple Pay</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                    🔒 SSL Secured
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Order Summary ===== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img
                      src={item.imageUrl || '/placeholder.png'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                      onError={(e) => { e.target.src = '/placeholder.png' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900 flex-shrink-0">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₦{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>
                    {shippingFee === 0 ? 'FREE' : `₦${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Total</span>
                  <span className="text-blue-600">₦{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePaystackPayment}
                disabled={loading || !paystackReady}
                className="w-full mt-6 bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Payment...
                  </>
                ) : !paystackReady ? (
                  'Initializing Gateway...'
                ) : (
                  `Pay ₦${total.toLocaleString()} with Paystack`
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-xs">
                <span>🔒</span>
                <span>256-bit Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}