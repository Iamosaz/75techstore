// src/pages/CartPage.jsx
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiTrash2, FiPlus, FiMinus,
  FiShoppingCart, FiArrowLeft, FiArrowRight
} from 'react-icons/fi'
import { CartContext } from '../context/CartContext'
import { UserContext } from '../context/UserContext'

export default function CartPage() {
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useContext(CartContext)

  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  // ✅ Free shipping above ₦50,000
  const shippingFee = cartSubtotal > 50000 ? 0 : 2000
  const total = cartSubtotal + shippingFee

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout')
      return
    }
    navigate('/checkout')
  }

  // ✅ Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col
        items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex
            items-center justify-center mx-auto">
            <FiShoppingCart size={40} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Your cart is empty
          </h2>
          <p className="text-gray-500">
            Looks like you haven't added anything yet
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-blue-600
              text-white px-6 py-3 rounded-xl font-semibold
              hover:bg-blue-700 transition"
          >
            <FiArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Shopping Cart
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {cartCount} item(s) in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-red-500
              hover:text-red-700 text-sm font-medium transition"
          >
            <FiTrash2 size={16} />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===== Cart Items ===== */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-4 shadow-sm
                  border border-gray-100 flex gap-4"
              >
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0 rounded-xl
                  overflow-hidden bg-gray-100">
                  <img
                    src={item.imageUrl || '/placeholder.png'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = '/placeholder.png'}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900
                    text-sm truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-blue-50 text-blue-700
                      px-2 py-0.5 rounded-full font-medium">
                      {item.condition}
                    </span>
                    {item.grade && item.grade !== 'N/A' && (
                      <span className="text-xs bg-gray-50 text-gray-600
                        px-2 py-0.5 rounded-full">
                        {item.grade}
                      </span>
                    )}
                  </div>
                  <p className="text-blue-600 font-bold mt-2">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs">
                    ₦{item.price.toLocaleString()} each
                  </p>
                </div>

                {/* Quantity + Remove */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    <FiTrash2 size={16} />
                  </button>

                  <div className="flex items-center gap-2 bg-gray-50
                    rounded-xl p-1">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      className="w-7 h-7 flex items-center justify-center
                        rounded-lg bg-white shadow-sm hover:bg-red-50
                        hover:text-red-500 transition"
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.stock}
                      className="w-7 h-7 flex items-center justify-center
                        rounded-lg bg-white shadow-sm hover:bg-blue-50
                        hover:text-blue-500 transition
                        disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/shop"
              className="flex items-center gap-2 text-blue-600
                hover:text-blue-800 font-medium text-sm transition"
            >
              <FiArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>

          {/* ===== Order Summary ===== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm
              border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal ({cartCount} items)
                  </span>
                  <span className="font-medium">
                    ₦{cartSubtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping Fee</span>
                  <span className={shippingFee === 0
                    ? 'text-green-600 font-medium'
                    : 'font-medium'
                  }>
                    {shippingFee === 0
                      ? 'FREE'
                      : `₦${shippingFee.toLocaleString()}`
                    }
                  </span>
                </div>

                {shippingFee > 0 && (
                  <p className="text-xs text-gray-400">
                    Free shipping on orders above ₦50,000
                  </p>
                )}

                <div className="border-t pt-3 flex justify-between
                  font-bold text-base">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-blue-600 text-white font-bold
                  py-4 rounded-xl hover:bg-blue-700 active:scale-95
                  transition-all shadow-lg shadow-blue-600/20 flex
                  items-center justify-center gap-2"
              >
                Proceed to Checkout
                <FiArrowRight size={18} />
              </button>

              {!user && (
                <p className="text-center text-xs text-gray-400 mt-3">
                  You need to login to checkout
                </p>
              )}

              <div className="mt-4 flex items-center justify-center
                gap-2 text-gray-400 text-xs">
                <span>🔒</span>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}