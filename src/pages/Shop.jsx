// src/pages/Shop.jsx
import React, { useState, useEffect, useContext } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaFilter, FaTimes, FaCheck } from 'react-icons/fa'
import axios from 'axios'
import { CartContext } from '../context/CartContext'

const API_URL = import.meta.env.URL || 'http://localhost:5000/api'

const categories = [
  'All', 'Laptops', 'Phones', 'Tablets',
  'Accessories', 'Monitors', 'Storage',
  'Networking', 'Gaming', 'Audio', 'Cameras', 'Printers', 'Software',
  'Wearables', 'Smart Home', 'Components',
  'Consoles', 'Other'
]

const conditions = ['All', 'Brand New', 'UK Used', 'Good Deals']

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

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addToCart, isInCart } = useContext(CartContext) // ✅ NEW

  const [products, setProducts]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages]   = useState(1)
  const [totalCount, setTotalCount]   = useState(0)
  const [sortBy, setSortBy]           = useState('newest')

  const selectedCategory  = searchParams.get('category')  || 'All'
  const selectedCondition = searchParams.get('condition')  || 'All'
  const searchTerm        = searchParams.get('keyword')    || ''

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (selectedCategory !== 'All') params.append('category', selectedCategory)
        if (selectedCondition !== 'All') params.append('condition', selectedCondition)
        if (searchTerm.trim()) params.append('keyword', searchTerm.trim())
        params.append('page', currentPage)
        params.append('limit', 12)
        const { data } = await axios.get(`${API_URL}/products?${params}`)
        setProducts(data.products || [])
        setTotalPages(data.totalPages || 1)
        setTotalCount(data.totalCount || 0)
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [selectedCategory, selectedCondition, searchTerm, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedCondition, searchTerm])

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'newest')     return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'price-low')  return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'name')       return a.name.localeCompare(b.name)
    return 0
  })

  const handleCategoryClick = (cat) => {
    setSearchParams(prev => {
      if (cat !== 'All') prev.set('category', cat)
      else prev.delete('category')
      return prev
    })
  }

  const handleConditionClick = (cond) => {
    setSearchParams(prev => {
      if (cond !== 'All') prev.set('condition', cond)
      else prev.delete('condition')
      return prev
    })
  }

  const clearSearch = () => {
    setSearchParams(prev => { prev.delete('keyword'); return prev })
  }

  const clearAllFilters = () => { setSearchParams({}) }

  const getTitle = () => {
    if (searchTerm) return <>Results for <span className='text-yellow-300'>"{searchTerm}"</span></>
    const parts = []
    if (selectedCondition !== 'All') parts.push(selectedCondition)
    if (selectedCategory !== 'All') parts.push(selectedCategory)
    if (parts.length > 0) return parts.join(' ')
    return 'All Products'
  }

  const hasActiveFilters = selectedCategory !== 'All' ||
    selectedCondition !== 'All' || searchTerm

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white
        py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            {getTitle()}
          </h1>
          <p className="text-blue-200">
            {loading
              ? 'Loading...'
              : `${totalCount} product${totalCount !== 1 ? 's' : ''} found`
            }
          </p>

          {hasActiveFilters && (
            <div className='flex items-center justify-center gap-2 mt-3 flex-wrap'>
              {searchTerm && (
                <button onClick={clearSearch}
                  className='inline-flex items-center gap-2 bg-white/20
                    hover:bg-white/30 text-white px-4 py-1.5 rounded-full
                    text-sm transition-all'>
                  <FaTimes size={10} /> Search: "{searchTerm}"
                </button>
              )}
              {selectedCondition !== 'All' && (
                <button onClick={() => handleConditionClick('All')}
                  className='inline-flex items-center gap-2 bg-amber-500/30
                    hover:bg-amber-500/50 text-white px-4 py-1.5 rounded-full
                    text-sm transition-all'>
                  <FaTimes size={10} /> {selectedCondition}
                </button>
              )}
              {selectedCategory !== 'All' && (
                <button onClick={() => handleCategoryClick('All')}
                  className='inline-flex items-center gap-2 bg-white/20
                    hover:bg-white/30 text-white px-4 py-1.5 rounded-full
                    text-sm transition-all'>
                  <FaTimes size={10} /> {selectedCategory}
                </button>
              )}
              <button onClick={clearAllFilters}
                className='text-blue-200 hover:text-white text-sm
                  underline transition-all ml-2'>
                Clear all
              </button>
            </div>
          )}

          {selectedCondition === 'UK Used' && (
            <div className='mt-4 inline-flex items-center gap-2
              bg-amber-500/20 border border-amber-400/30 text-amber-200
              px-5 py-2.5 rounded-xl text-sm'>
              🇬🇧 All UK used items are tested, graded and guaranteed
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm border
              border-gray-100 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaFilter size={14} /> Filters
              </h3>

              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500
                  uppercase mb-2 block">Search</label>
                <div className='relative'>
                  <input type="text" placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchParams(prev => {
                        if (e.target.value) prev.set('keyword', e.target.value)
                        else prev.delete('keyword')
                        return prev
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-200
                      rounded-lg text-sm focus:outline-none focus:ring-2
                      focus:ring-blue-500 pr-8" />
                  {searchTerm && (
                    <button onClick={clearSearch}
                      className='absolute right-2 top-1/2 -translate-y-1/2
                        text-gray-400 hover:text-gray-600'>
                      <FaTimes size={12} />
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500
                  uppercase mb-2 block">Condition</label>
                <div className="space-y-1">
                  {conditions.map(cond => (
                    <button key={cond}
                      onClick={() => handleConditionClick(cond)}
                      className={`w-full text-left px-3 py-2 rounded-lg
                        text-sm transition-all duration-200 flex items-center
                        justify-between ${
                        selectedCondition === cond
                          ? cond === 'UK Used'
                            ? 'bg-amber-500 text-white font-medium'
                            : 'bg-blue-600 text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}>
                      <span>{cond}</span>
                      {cond === 'UK Used' && selectedCondition !== cond && (
                        <span className='text-[10px] bg-amber-100 text-amber-700
                          px-1.5 py-0.5 rounded-full font-semibold'>
                          🇬🇧
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500
                  uppercase mb-2 block">Category</label>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg
                        text-sm transition-all duration-200 ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Showing {products.length} of {totalCount}
                {selectedCondition !== 'All' && (
                  <span className='ml-1 text-amber-600 font-medium'>
                    {selectedCondition}
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className='ml-1 text-blue-600 font-medium'>
                    {selectedCategory}
                  </span>
                )}
              </p>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg
                  text-sm focus:outline-none bg-white">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-blue-600
                  border-t-transparent rounded-full animate-spin" />
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-5xl mb-4">📦</p>
                <p className="font-medium text-lg">No products found</p>
                <p className="text-sm mt-1">Try a different filter</p>
                <button onClick={clearAllFilters}
                  className='mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg
                    text-sm font-medium hover:bg-blue-700 transition'>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3
                  lg:grid-cols-4 gap-5">
                  {sortedProducts.map(product => {
                    const cb = conditionBadge[product.condition]
                    const gb = gradeBadge[product.grade]
                    const inCart = isInCart(product._id) // ✅ NEW
                    return (
                      <div key={product._id}
                        className="bg-white border border-gray-100 rounded-2xl
                          overflow-hidden hover:-translate-y-1 hover:shadow-xl
                          transition-all duration-300 flex flex-col group">

                        <div className="relative">
                          {cb && (
                            <span className={`absolute top-3 left-3 z-10
                              ${cb.bg} ${cb.text} text-[10px] font-bold
                              px-2 py-1 rounded-full`}>
                              {product.condition}
                            </span>
                          )}
                          {product.condition === 'UK Used' && gb &&
                            product.grade !== 'N/A' && (
                            <span className={`absolute top-10 left-3 z-10
                              ${gb} text-white text-[10px] font-bold
                              px-2 py-0.5 rounded-full`}>
                              {product.grade}
                            </span>
                          )}
                          {product.discount > 0 && (
                            <span className="absolute top-3 right-3 z-10
                              bg-orange-500 text-white text-xs font-bold
                              px-2 py-1 rounded-full">
                              -{Math.round((product.discount / product.price) * 100)}%
                            </span>
                          )}
                          <div
                            onClick={() => navigate(`/shop/${product._id}`)}
                            className="cursor-pointer bg-gray-50 flex items-center
                              justify-center h-44 overflow-hidden px-4 pt-6 pb-2">
                            <img
                              src={product.imageUrl || 'https://via.placeholder.com/200'}
                              alt={product.name}
                              className="h-full object-contain group-hover:scale-110
                                transition-transform duration-500" />
                          </div>
                        </div>

                        <div className="p-4 flex flex-col gap-1.5 flex-1">
                          <h4
                            onClick={() => navigate(`/shop/${product._id}`)}
                            className="text-sm font-semibold text-gray-800
                              line-clamp-2 cursor-pointer hover:text-blue-600
                              transition">
                            {product.name}
                          </h4>
                          <p className='text-xs text-gray-400'>{product.brand}</p>
                          {product.stock > 0
                            ? <span className="text-xs text-green-600">✅ In Stock</span>
                            : <span className="text-xs text-red-500">❌ Out of Stock</span>
                          }
                          <div className="flex items-center justify-between
                            mt-auto pt-2">
                            <div>
                              {product.discount > 0 && (
                                <span className="text-gray-400 line-through
                                  text-xs mr-1">
                                  ₦{Number(product.price).toLocaleString()}
                                </span>
                              )}
                              <span className="text-base font-extrabold text-gray-900">
                                ₦{Number(
                                  product.price - (product.discount || 0)
                                ).toLocaleString()}
                              </span>
                            </div>
                            {/* ✅ FIXED Add to Cart Button */}
                            <button
                              onClick={() => addToCart(product)}
                              disabled={product.stock <= 0}
                              className={`p-2 rounded-full transition
                                disabled:opacity-50
                                ${inCart
                                  ? 'bg-green-500 text-white'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                              {inCart
                                ? <FaCheck size={13} />
                                : <FaShoppingCart size={13} />
                              }
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-200
                        text-sm disabled:opacity-40 hover:bg-gray-50">
                      ← Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-200 hover:bg-gray-50'
                        }`}>
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-200
                        text-sm disabled:opacity-40 hover:bg-gray-50">
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop