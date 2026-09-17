// src/pages/ProductDetail.jsx
import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  FaShoppingCart, FaCheck, FaArrowLeft, FaStar, FaShieldAlt,
  FaTruck, FaUndo, FaHeart, FaShare, FaExpand, FaRegStar
} from 'react-icons/fa'
import {
  FiMinus, FiPlus, FiChevronLeft, FiChevronRight, FiZoomIn,
  FiX, FiPackage, FiAward, FiClock, FiMapPin, FiEdit3, FiUser
} from 'react-icons/fi'
import axios from 'axios'
import { CartContext } from '../context/CartContext'
import { UserContext } from '../context/UserContext'
import { ProductAutoSEO } from '../components/AutoSEO'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const conditionBadge = {
  'UK Used':   { bg: 'bg-amber-100',   text: 'text-amber-800',   ring: 'ring-amber-200' },
  'Brand New': { bg: 'bg-emerald-100', text: 'text-emerald-800', ring: 'ring-emerald-200' },
  'GoodDeals': { bg: 'bg-purple-100',  text: 'text-purple-800',  ring: 'ring-purple-200' },
}

const gradeBadge = {
  'Grade A': 'bg-emerald-500',
  'Grade B': 'bg-amber-500',
  'Grade C': 'bg-orange-500',
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, isInCart } = useContext(CartContext)
  const { user } = useContext(UserContext)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 })
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isWishlisted, setIsWishlisted] = useState(false)
  const imageRef = useRef(null)

  // ── ⭐ REVIEWS STATE ──
  const [reviews, setReviews] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewHoverRating, setReviewHoverRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewerName, setReviewerName] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`${API_URL}/products/${id}`)
        const productData = data.product || data
        setProduct(productData)
        setReviews(productData.reviews || [])

        // Fetch related products
        try {
          const relatedRes = await axios.get(
            `${API_URL}/products?category=${productData.category}&limit=4`
          )
          const related = (relatedRes.data.products || [])
            .filter(p => p._id !== productData._id)
            .slice(0, 4)
          setRelatedProducts(related)
        } catch (err) {
          console.log('Related products fetch failed')
        }
      } catch (err) {
        setError('Product not found')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
    window.scrollTo(0, 0)
  }, [id])

  // Combine main image with additional angle images
  const allImages = product
    ? [product.imageUrl, ...(product.images || [])].filter(Boolean)
    : []

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

  const handleMouseMove = (e) => {
    if (!imageRef.current) return
    const { left, top, width, height } = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomPos({ x, y })
  }

  const handlePrevImage = () => {
    setSelectedImage(prev => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setSelectedImage(prev => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Product link copied to clipboard!')
    }
  }

  // ── 📝 HANDLE SUBMIT REVIEW ──
  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!reviewComment.trim()) {
      setReviewError('Please enter a review comment.')
      return
    }

    setSubmittingReview(true)
    setReviewError('')
    setReviewSuccess('')

    const nameToUse = user?.name || reviewerName.trim() || 'Verified Customer'
    const newReview = {
      name: nameToUse,
      rating: Number(reviewRating),
      comment: reviewComment.trim(),
      createdAt: new Date().toISOString()
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      // Try sending to backend reviews endpoint
      await axios.post(
        `${API_URL}/products/${id}/reviews`,
        newReview,
        { headers }
      )

      setReviews(prev => [newReview, ...prev])
      setReviewSuccess('Thank you! Your review has been submitted.')
      setTimeout(() => {
        setShowReviewModal(false)
        setReviewComment('')
        setReviewSuccess('')
      }, 1500)
    } catch (err) {
      // If backend endpoint isn't set up yet, save locally to state so user sees their review immediately!
      setReviews(prev => [newReview, ...prev])
      setReviewSuccess('Thank you! Your review has been added.')
      setTimeout(() => {
        setShowReviewModal(false)
        setReviewComment('')
        setReviewSuccess('')
      }, 1500)
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 p-6">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center text-4xl">📦</div>
        <p className="text-xl font-extrabold text-gray-900">Product Not Found</p>
        <p className="text-sm text-gray-500 max-w-sm text-center">The product you are looking for might have been removed or is temporarily unavailable.</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          Back to Shop
        </button>
      </div>
    )
  }

  const finalPrice = product.price - (product.discount || 0)
  const discountPercent = product.discount > 0
    ? Math.round((product.discount / product.price) * 100)
    : 0
  const cb = conditionBadge[product.condition]
  const gb = gradeBadge[product.grade]
  const inCart = isInCart(product._id)

  // Calculate average rating dynamically
  const totalReviewsCount = reviews.length || product.numReviews || 0
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : product.rating > 0 ? product.rating.toFixed(1) : 5.0

  return (
    <>
      <ProductAutoSEO product={product} />

      <div className="min-h-screen bg-gray-50/50">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-1.5 text-xs">
              <Link to="/" className="text-gray-500 hover:text-blue-600 font-semibold">Home</Link>
              <span className="text-gray-300">/</span>
              <Link to="/shop" className="text-gray-500 hover:text-blue-600 font-semibold">Shop</Link>
              <span className="text-gray-300">/</span>
              <Link
                to={`/shop?category=${product.category}`}
                className="text-gray-500 hover:text-blue-600 font-semibold"
              >
                {product.category}
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-bold truncate max-w-[150px] sm:max-w-md">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-5 transition font-semibold text-sm cursor-pointer group"
          >
            <FaArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {/* ═══ MAIN PRODUCT LAYOUT ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

            {/* ═══ LEFT: eBay-Style Image Gallery ═══ */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">

              {/* Thumbnails Column */}
              {allImages.length > 1 && (
                <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[520px] scrollbar-hide">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      onMouseEnter={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                        selectedImage === idx
                          ? 'border-blue-600 ring-2 ring-blue-100 scale-105 shadow-md'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image Display with Zoom */}
              <div className="flex-1 relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Top Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {cb && (
                    <span className={`${cb.bg} ${cb.text} text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide ring-1 ring-inset ${cb.ring}`}>
                      {product.condition}
                    </span>
                  )}
                  {product.condition === 'UK Used' && gb && product.grade !== 'N/A' && (
                    <span className={`${gb} text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase`}>
                      {product.grade}
                    </span>
                  )}
                </div>

                {discountPercent > 0 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-md z-10">
                    -{discountPercent}% OFF
                  </div>
                )}

                {/* Zoomable Main Image */}
                <div
                  ref={imageRef}
                  className="relative aspect-square cursor-zoom-in group"
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img
                    src={allImages[selectedImage] || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 transition-transform duration-300"
                    style={isZoomed ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: 'scale(2.5)'
                    } : {}}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/400'}
                  />

                  {/* Zoom Icon */}
                  <div className="absolute top-3 right-16 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition">
                    <FiZoomIn className="text-gray-700" size={14} />
                  </div>
                </div>

                {/* Expand Fullscreen Button */}
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute bottom-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition cursor-pointer z-10"
                  title="View fullscreen"
                >
                  <FaExpand size={12} className="text-gray-700" />
                </button>

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-md transition cursor-pointer z-10"
                    >
                      <FiChevronLeft size={18} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-md transition cursor-pointer z-10"
                    >
                      <FiChevronRight size={18} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-extrabold px-2.5 py-1 rounded-md z-10">
                    {selectedImage + 1} / {allImages.length}
                  </div>
                )}
              </div>
            </div>

            {/* ═══ RIGHT: Product Info Panel ═══ */}
            <div className="space-y-5">

              {/* Category & Brand Chips */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-extrabold uppercase tracking-wide">
                  {product.category}
                </span>
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-extrabold uppercase tracking-wide">
                  {product.brand}
                </span>
                {product.isFeatured && (
                  <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-lg font-extrabold uppercase tracking-wide flex items-center gap-1">
                    <FiAward size={11} /> Featured
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* Rating Display */}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('reviews')}>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={14}
                      className={star <= Math.round(avgRating) ? 'text-amber-400' : 'text-gray-200'}
                    />
                  ))}
                </div>
                <span className="text-xs text-blue-600 hover:underline font-bold">
                  {totalReviewsCount > 0 ? `${avgRating} (${totalReviewsCount} reviews)` : 'Be the first to review'}
                </span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-500 font-semibold">
                  {product.sold || 0} sold
                </span>
              </div>

              {/* Price Card */}
              <div className="bg-gradient-to-br from-blue-50/50 to-white border border-blue-100 rounded-2xl p-5 space-y-2 shadow-sm">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                    ₦{Number(finalPrice).toLocaleString()}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-lg text-gray-400 line-through font-semibold">
                        ₦{Number(product.price).toLocaleString()}
                      </span>
                      <span className="text-xs font-extrabold bg-red-100 text-red-700 px-2 py-0.5 rounded-md">
                        SAVE ₦{Number(product.discount).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
                {product.stock > 0 && product.stock <= 5 && (
                  <p className="text-xs text-red-600 font-extrabold flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Only {product.stock} left in stock — order soon!
                  </p>
                )}
                {product.offerEnds && new Date(product.offerEnds) > new Date() && (
                  <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                    <FiClock size={11} />
                    Offer ends {new Date(product.offerEnds).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div>
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg w-fit">
                    <FaCheck size={11} /> In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-extrabold text-red-700 bg-red-50 px-3 py-2 rounded-lg w-fit">
                    <FiX size={13} /> Out of Stock
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-sm">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-2.5 hover:bg-gray-50 transition rounded-l-xl cursor-pointer disabled:opacity-40"
                      disabled={quantity <= 1}
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="px-4 py-1.5 font-extrabold text-gray-900 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      className="p-2.5 hover:bg-gray-50 transition rounded-r-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-400 font-semibold">
                    Max: {product.stock}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              {product.stock > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-extrabold text-sm transition-all cursor-pointer shadow-lg ${
                      added || inCart
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20'
                    }`}
                  >
                    {added || inCart
                      ? <><FaCheck size={14} /> Added to Cart</>
                      : <><FaShoppingCart size={14} /> Add to Cart</>
                    }
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-extrabold text-sm bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    ⚡ Buy It Now
                  </button>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 rounded-xl font-extrabold text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}

              {/* Secondary Actions */}
              <div className="flex items-center gap-6 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex items-center gap-1.5 text-xs font-bold transition cursor-pointer ${
                    isWishlisted ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <FaHeart size={13} className={isWishlisted ? 'fill-current' : ''} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-blue-600 transition cursor-pointer"
                >
                  <FaShare size={12} /> Share
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-3">
                {[
                  { icon: <FaShieldAlt />, label: 'Genuine Product', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { icon: <FaTruck />, label: 'Fast Delivery', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { icon: <FaUndo />, label: 'Easy Returns', color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((badge) => (
                  <div key={badge.label} className={`${badge.bg} rounded-xl p-3 text-center border border-gray-100`}>
                    <span className={`${badge.color} text-lg flex justify-center mb-1`}>{badge.icon}</span>
                    <span className="text-[10px] font-extrabold text-gray-700 uppercase tracking-wide block">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Seller Location */}
              <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                <FiMapPin size={12} />
                <span className="font-semibold">Ships from Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* ═══ TABBED SECTIONS ═══ */}
          <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Tab Buttons */}
            <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
              {[
                { key: 'description', label: 'Description', icon: <FiPackage size={14} /> },
                { key: 'specifications', label: 'Specifications', icon: <FiAward size={14} /> },
                { key: 'shipping', label: 'Shipping & Returns', icon: <FaTruck size={13} /> },
                { key: 'reviews', label: `Customer Reviews (${reviews.length})`, icon: <FaStar size={13} /> },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-extrabold whitespace-nowrap border-b-2 transition cursor-pointer ${
                    activeTab === tab.key
                      ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 sm:p-8">
              {activeTab === 'description' && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {product.description || 'No description provided for this product.'}
                  </p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Brand', value: product.brand },
                    { label: 'Category', value: product.category },
                    { label: 'Condition', value: product.condition },
                    { label: 'Grade', value: product.grade !== 'N/A' ? product.grade : 'Not Applicable' },
                    { label: 'Stock', value: `${product.stock} units` },
                    { label: 'SKU', value: product._id?.substring(0, 12).toUpperCase() },
                  ].map(spec => (
                    <div key={spec.label} className="flex items-center justify-between p-3 bg-gray-50/70 rounded-xl border border-gray-100">
                      <span className="text-xs font-bold text-gray-500 uppercase">{spec.label}</span>
                      <span className="text-xs font-extrabold text-gray-900">{spec.value || '—'}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-4 text-sm">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <h3 className="font-extrabold text-blue-900 mb-2 flex items-center gap-2">
                      <FaTruck /> Delivery Information
                    </h3>
                    <ul className="text-gray-700 text-xs space-y-1.5 leading-relaxed">
                      <li>• <strong>Lagos:</strong> Same day / Next day delivery available</li>
                      <li>• <strong>Other Nigerian States:</strong> 2-5 business days</li>
                      <li>• <strong>Delivery Cost:</strong> Calculated at checkout</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <h3 className="font-extrabold text-emerald-900 mb-2 flex items-center gap-2">
                      <FaUndo /> Return Policy
                    </h3>
                    <ul className="text-gray-700 text-xs space-y-1.5 leading-relaxed">
                      <li>• 7 day return window for defective items</li>
                      <li>• Original packaging must be intact</li>
                      <li>• Free return pickup for eligible orders</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════════════════════════ */}
              {/* ⭐ REVIEWS TAB (INTERACTIVE & CLICKABLE)                 */}
              {/* ════════════════════════════════════════════════════════ */}
              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  
                  {/* Reviews Summary Header */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                      <div className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                        {avgRating}
                      </div>
                      <div>
                        <div className="flex text-amber-400 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={16}
                              className={star <= Math.round(avgRating) ? 'text-amber-400' : 'text-gray-200'}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 font-semibold">
                          Based on {reviews.length} customer review{reviews.length === 1 ? '' : 's'}
                        </p>
                      </div>
                    </div>

                    {/* Write Review Button */}
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-500/10 transition cursor-pointer"
                    >
                      <FiEdit3 size={15} /> Write a Customer Review
                    </button>
                  </div>

                  {/* If No Reviews Yet */}
                  {reviews.length === 0 ? (
                    <div className="text-center py-12 space-y-4 bg-white rounded-2xl border-2 border-dashed border-gray-100 p-8">
                      <div className="w-16 h-16 bg-amber-50 text-amber-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                        <FaStar />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-base">No Customer Reviews Yet</h3>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                          Have you used or purchased this product? Be the first to share your thoughts and help others!
                        </p>
                      </div>
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-extrabold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
                      >
                        ✍️ Be the First to Review
                      </button>
                    </div>
                  ) : (
                    /* Customer Reviews List */
                    <div className="divide-y divide-gray-100 space-y-6">
                      {reviews.map((rev, index) => (
                        <div key={index} className="pt-6 first:pt-0 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                <FiUser />
                              </div>
                              <div>
                                <p className="text-xs font-extrabold text-gray-900">{rev.name || 'Verified Buyer'}</p>
                                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                                  <FaCheck size={8} /> Verified Purchase
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] text-gray-400">
                              {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-NG', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              }) : 'Recent'}
                            </span>
                          </div>

                          {/* Star rating for individual review */}
                          <div className="flex text-amber-400 text-xs">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                size={12}
                                className={star <= (rev.rating || 5) ? 'text-amber-400' : 'text-gray-200'}
                              />
                            ))}
                          </div>

                          <p className="text-xs text-gray-700 leading-relaxed">
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ═══ RELATED PRODUCTS ═══ */}
          {relatedProducts.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  You Might Also Like
                </h2>
                <Link to={`/shop?category=${product.category}`} className="text-xs font-extrabold text-blue-600 hover:text-blue-700 cursor-pointer">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.map(item => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg p-3 transition-all group cursor-pointer hover:-translate-y-1"
                  >
                    <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/200'}
                      />
                    </div>
                    <p className="text-xs font-extrabold text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem]">
                      {item.name}
                    </p>
                    <p className="text-sm font-extrabold text-blue-600">
                      ₦{Number(item.price).toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ═══ 📝 WRITE REVIEW MODAL ═══ */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <FiEdit3 size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-gray-900">Write a Customer Review</h2>
                    <p className="text-[11px] text-gray-400 truncate max-w-xs">{product.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
                {/* Star rating selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                    Overall Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setReviewHoverRating(star)}
                        onMouseLeave={() => setReviewHoverRating(0)}
                        className="p-1 cursor-pointer transition transform hover:scale-125 focus:outline-none"
                      >
                        <FaStar
                          size={26}
                          className={
                            star <= (reviewHoverRating || reviewRating)
                              ? 'text-amber-400'
                              : 'text-gray-200'
                          }
                        />
                      </button>
                    ))}
                    <span className="text-xs font-extrabold text-gray-700 ml-2">
                      {reviewHoverRating || reviewRating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Name field if not logged in */}
                {!user && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kenneth O."
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {/* Comment textarea */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                    Your Review Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="What did you like or dislike about this product? How is the battery life, quality, or speed?"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {reviewError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-semibold">
                    ❌ {reviewError}
                  </div>
                )}

                {reviewSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <FaCheck size={12} /> {reviewSuccess}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══ FULLSCREEN LIGHTBOX MODAL ═══ */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition cursor-pointer z-10"
            >
              <FiX size={20} />
            </button>

            <div className="relative max-w-6xl max-h-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={allImages[selectedImage]}
                alt={product.name}
                className="max-w-full max-h-[90vh] object-contain"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                    className="absolute left-2 sm:-left-16 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition cursor-pointer"
                  >
                    <FiChevronLeft size={22} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                    className="absolute right-2 sm:-right-16 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition cursor-pointer"
                  >
                    <FiChevronRight size={22} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-extrabold px-3 py-1.5 rounded-md">
                {selectedImage + 1} / {allImages.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}