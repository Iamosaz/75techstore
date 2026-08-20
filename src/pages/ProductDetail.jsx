// src/pages/ProductDetail.jsx
import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FaShoppingCart, FaCheck, FaArrowLeft,
  FaStar, FaShieldAlt, FaTruck, FaUndo
} from 'react-icons/fa'
import { FiMinus, FiPlus } from 'react-icons/fi'
import axios from 'axios'
import { CartContext } from '../context/CartContext'
import { UserContext } from '../context/UserContext'

const API_URL = import.meta.env.URL || 'http://localhost:5000/api'

const conditionBadge = {
  'UK Used':     { bg: 'bg-amber-100',  text: 'text-amber-700'  },
  'Brand New':   { bg: 'bg-green-100',  text: 'text-green-700'  },
  'Refurbished': { bg: 'bg-blue-100',   text: 'text-blue-700'   },
}

const gradeBadge = {
  'Grade A': 'bg-green-500',
  'Grade B': 'bg-yellow-500',
  'Grade C': 'bg-orange-500',
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, isInCart, getItemQuantity, updateQuantity } = useContext(CartContext)
  const { user } = useContext(UserContext)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`${API_URL}/products/${id}`)
        setProduct(data.product || data)
      } catch (err) {
        setError('Product not found')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    if (!product) return
    addToCart(product, quantity)
    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600
          border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center
        justify-center gap-4">
        <p className="text-5xl">📦</p>
        <p className="text-xl font-bold text-gray-700">Product not found</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl
            font-semibold hover:bg-blue-700 transition"
        >
          Back to Shop
        </button>
      </div>
    )
  }

  const finalPrice = product.price - (product.discount || 0)
  const cb = conditionBadge[product.condition]
  const gb = gradeBadge[product.grade]
  const inCart = isInCart(product._id)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600
            hover:text-gray-900 mb-6 transition font-medium"
        >
          <FaArrowLeft size={16} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ===== Product Image ===== */}
          <div className="bg-white rounded-2xl p-8 shadow-sm
            border border-gray-100 flex items-center justify-center
            min-h-80 relative">

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {cb && (
                <span className={`${cb.bg} ${cb.text} text-xs font-bold
                  px-3 py-1 rounded-full`}>
                  {product.condition}
                </span>
              )}
              {product.condition === 'UK Used' && gb &&
                product.grade !== 'N/A' && (
                <span className={`${gb} text-white text-xs font-bold
                  px-3 py-1 rounded-full`}>
                  {product.grade}
                </span>
              )}
            </div>

            {product.discount > 0 && (
              <span className="absolute top-4 right-4 bg-orange-500
                text-white text-sm font-bold px-3 py-1 rounded-full">
                -{Math.round((product.discount / product.price) * 100)}% OFF
              </span>
            )}

            <img
              src={product.imageUrl || 'https://via.placeholder.com/400'}
              alt={product.name}
              className="max-h-80 object-contain"
              onError={(e) => e.target.src = 'https://via.placeholder.com/400'}
            />
          </div>

          {/* ===== Product Info ===== */}
          <div className="space-y-5">

            {/* Category + Brand */}
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1
                rounded-full font-semibold">
                {product.category}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1
                rounded-full">
                {product.brand}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={14}
                      className={i < Math.round(product.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-200'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.numReviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-gray-900">
                ₦{Number(finalPrice).toLocaleString()}
              </span>
              {product.discount > 0 && (
                <span className="text-lg text-gray-400 line-through">
                  ₦{Number(product.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock */}
            <div>
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold text-sm
                  flex items-center gap-1">
                  ✅ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-500 font-semibold text-sm">
                  ❌ Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity */}
            {product.stock > 0 && (
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Quantity</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-100
                    rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center
                        rounded-lg bg-white shadow-sm hover:bg-red-50
                        hover:text-red-500 transition"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q =>
                        Math.min(product.stock, q + 1)
                      )}
                      disabled={quantity >= product.stock}
                      className="w-9 h-9 flex items-center justify-center
                        rounded-lg bg-white shadow-sm hover:bg-blue-50
                        hover:text-blue-500 transition
                        disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Max: {product.stock}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {product.stock > 0 ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2
                    py-4 rounded-xl font-bold text-base transition-all
                    ${added || inCart
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {added || inCart
                    ? <><FaCheck size={18} /> Added to Cart</>
                    : <><FaShoppingCart size={18} /> Add to Cart</>
                  }
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2
                    py-4 rounded-xl font-bold text-base bg-gray-900
                    text-white hover:bg-gray-700 transition-all"
                >
                  ⚡ Buy Now
                </button>
              </div>
            ) : (
              <button disabled
                className="w-full py-4 rounded-xl font-bold text-base
                  bg-gray-100 text-gray-400 cursor-not-allowed">
                Out of Stock
              </button>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: <FaShieldAlt className="text-blue-600" />, label: 'Genuine Product' },
                { icon: <FaTruck className="text-blue-600" />, label: 'Fast Delivery' },
                { icon: <FaUndo className="text-blue-600" />, label: 'Easy Returns' },
              ].map((badge) => (
                <div key={badge.label}
                  className="flex flex-col items-center gap-1 bg-blue-50
                    rounded-xl p-3 text-center">
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-xs font-medium text-gray-600">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}