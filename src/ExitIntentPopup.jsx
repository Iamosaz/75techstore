// src/components/ExitIntentPopup.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { FaShoppingCart, FaTimes, FaFire } from 'react-icons/fa'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const ExitIntentPopup = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPopup, setShowPopup] = useState(false)
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  // ✅ Don't show on admin pages
  const isAdminPage = location.pathname.startsWith('/admin')

  // ✅ Check if user has browsed enough before showing
  const hasUserBrowsed = useCallback(() => {
    const pagesVisited = JSON.parse(sessionStorage.getItem('pagesVisited') || '[]')
    const timeOnSite = Date.now() - Number(sessionStorage.getItem('siteEntryTime') || Date.now())
    const hasViewedProducts = sessionStorage.getItem('hasViewedProducts') === 'true'
    const hasAddedToCart = sessionStorage.getItem('cartItems')
    const hasPurchased = sessionStorage.getItem('hasPurchased') === 'true'

    // ✅ Never show if user already purchased
    if (hasPurchased) return false

    // ✅ Never show if already shown this session
    if (sessionStorage.getItem('exitPopupShown') === 'true') return false

    // ✅ Only show if user has:
    // - Visited at least 2 pages
    // - Been on site for at least 60 seconds
    // - Viewed at least 1 product or shop page
    return (
      pagesVisited.length >= 2 &&
      timeOnSite > 60000 &&
      hasViewedProducts &&
      !hasAddedToCart
    )
  }, [])

  // ✅ Track pages visited
  useEffect(() => {
    // Don't track admin pages
    if (isAdminPage) return

    // Set site entry time on first visit
    if (!sessionStorage.getItem('siteEntryTime')) {
      sessionStorage.setItem('siteEntryTime', Date.now().toString())
    }

    // Track pages visited
    const pagesVisited = JSON.parse(sessionStorage.getItem('pagesVisited') || '[]')
    if (!pagesVisited.includes(location.pathname)) {
      pagesVisited.push(location.pathname)
      sessionStorage.setItem('pagesVisited', JSON.stringify(pagesVisited))
    }

    // Track if user viewed products/shop
    if (
      location.pathname.includes('/shop') ||
      location.pathname.includes('/product') ||
      location.pathname.includes('/category')
    ) {
      sessionStorage.setItem('hasViewedProducts', 'true')
    }
  }, [location.pathname, isAdminPage])

  // Fetch deals from MongoDB
  const fetchDeals = async () => {
    try {
      setLoading(true)

      // ✅ Get user's recently viewed category if available
      const lastCategory = sessionStorage.getItem('lastViewedCategory') || ''

      const { data } = await axios.get(`${API_URL}/products`, {
        params: {
          limit: 3,
          isDealOfDay: true,
          ...(lastCategory && { category: lastCategory })
        }
      })

      let products = data.products || []

      // ✅ If no deals in user's category, get any deals
      if (products.length === 0) {
        const fallback = await axios.get(`${API_URL}/products`, {
          params: {
            limit: 3,
            isFeatured: true
          }
        })
        products = fallback.data.products || []
      }

      setDeals(products)
    } catch (err) {
      console.error('Failed to fetch deals:', err)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Exit Intent Detection - ONLY mouse leave at top
  useEffect(() => {
    // ❌ Don't run on admin pages
    if (isAdminPage) return

    const handleMouseLeave = (e) => {
      // ✅ Only trigger when mouse goes to TOP of page (real exit intent)
      if (e.clientY <= 5 && !hasShown && hasUserBrowsed()) {
        setShowPopup(true)
        setHasShown(true)
        sessionStorage.setItem('exitPopupShown', 'true')
        fetchDeals()
      }
    }

    // ✅ Desktop only - mouse leave detection
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [hasShown, isAdminPage, hasUserBrowsed])

  // ✅ Mobile - detect back button press only
  useEffect(() => {
    if (isAdminPage) return

    const handleBackButton = () => {
      if (!hasShown && hasUserBrowsed()) {
        setShowPopup(true)
        setHasShown(true)
        sessionStorage.setItem('exitPopupShown', 'true')
        fetchDeals()
      }
    }

    window.addEventListener('popstate', handleBackButton)

    return () => {
      window.removeEventListener('popstate', handleBackButton)
    }
  }, [hasShown, isAdminPage, hasUserBrowsed])

  // ✅ Countdown Timer
  const [timeLeft, setTimeLeft] = useState(600)

  useEffect(() => {
    if (!showPopup) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showPopup])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return { m, s }
  }

  const { m, s } = formatTime(timeLeft)

  const handleClose = () => {
    setShowPopup(false)
  }

  const handleShopNow = (category) => {
    setShowPopup(false)
    if (category) {
      navigate(`/shop?category=${category}`)
    } else {
      navigate('/shop')
    }
  }

  // ✅ Don't render anything on admin pages
  if (isAdminPage) return null

  if (!showPopup) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center
                    justify-center z-[9999] p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl
                      overflow-hidden animate-slideUp">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800
                        p-6 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/70
                       hover:text-white transition text-xl"
          >
            <FaTimes />
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaFire className="text-orange-400 text-2xl" />
              <h2 className="text-2xl font-extrabold">
                Wait! Don't Leave Yet!
              </h2>
              <FaFire className="text-orange-400 text-2xl" />
            </div>
            <p className="text-blue-200 text-sm">
              You're missing out on these amazing deals!
            </p>

            {/* Countdown Timer */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <p className="text-sm text-blue-200">Offer expires in:</p>
              <div className="flex gap-2">
                {[
                  { value: m, label: 'Min' },
                  { value: s, label: 'Sec' }
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="bg-white text-blue-700 font-extrabold
                                    text-xl w-12 h-12 flex items-center
                                    justify-center rounded-xl shadow-md">
                      {item.value}
                    </div>
                    <span className="text-[10px] text-blue-200 uppercase">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Deals Section */}
        <div className="p-6">
          <h3 className="text-center font-bold text-gray-900 mb-4">
            🔥 Exclusive Deals Just For You
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600
                              border-t-transparent rounded-full animate-spin" />
            </div>
          ) : deals.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">
                Check out our amazing products!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {deals.map(product => (
                <div
                  key={product._id}
                  onClick={() => {
                    setShowPopup(false)
                    navigate(`/product/${product._id}`)
                  }}
                  className="flex items-center gap-4 bg-gray-50 rounded-2xl
                             p-3 hover:bg-blue-50 transition cursor-pointer
                             border border-gray-100 hover:border-blue-200"
                >
                  <img
                    src={product.imageUrl || 'https://via.placeholder.com/60'}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-xl
                               border border-gray-200"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm
                                  line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {product.category}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {product.discount > 0 && (
                        <span className="text-gray-400 line-through text-xs">
                          ₦{Number(product.price).toLocaleString()}
                        </span>
                      )}
                      <span className="text-blue-600 font-bold text-sm">
                        ₦{Number(
                          product.price - (product.discount || 0)
                        ).toLocaleString()}
                      </span>
                      {product.discount > 0 && (
                        <span className="bg-red-100 text-red-600 text-xs
                                         font-bold px-1.5 py-0.5 rounded-full">
                          -{Math.round(
                            (product.discount / product.price) * 100
                          )}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('Add to cart:', product._id)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white
                               p-2.5 rounded-full transition shrink-0"
                  >
                    <FaShoppingCart size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200
                         text-gray-700 rounded-xl text-sm font-medium
                         transition"
            >
              No Thanks
            </button>
            <button
              onClick={() => handleShopNow()}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700
                         text-white rounded-xl text-sm font-bold
                         transition flex items-center justify-center gap-2"
            >
              <FaShoppingCart size={14} />
              Shop All Deals
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-3">
            🔒 Secure checkout • Free delivery on orders over ₦100,000
          </p>
        </div>
      </div>
    </div>
  )
}

export default ExitIntentPopup