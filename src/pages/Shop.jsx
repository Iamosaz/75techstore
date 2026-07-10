import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaFilter } from 'react-icons/fa'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const categories = [
  'All', 'Laptops', 'Phones', 'Tablets',
  'Accessories', 'Monitors', 'Storage',
  'Networking', 'Gaming', 'Audio',
  'Cameras', 'Printers', 'Software',
  'Wearables', 'Smart Home', 'Components',
  'Consoles', 'Other'
]

const Shop = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [sortBy, setSortBy] = useState('newest')

  // ✅ Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory)
      }
      if (searchTerm) params.append('keyword', searchTerm)
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

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchTerm, currentPage])

  // ✅ Update URL when category changes
  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setSelectedCategory(category)
    }
  }, [searchParams])

  // ✅ Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white
                      py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold mb-2">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h1>
          <p className="text-blue-200">
            {totalCount} products found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm border
                            border-gray-100 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaFilter size={14} /> Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-gray-500
                                  uppercase mb-2 block">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg
                             text-sm focus:outline-none focus:ring-2
                             focus:ring-blue-500"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs font-semibold text-gray-500
                                  uppercase mb-2 block">
                  Categories
                </label>
                <div className="space-y-1 max-h-[400px] overflow-y-auto">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat)
                        setCurrentPage(1)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg
                        text-sm transition ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">

            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Showing {products.length} of {totalCount} products
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg
                           text-sm focus:outline-none bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-blue-600
                                border-t-transparent rounded-full animate-spin" />
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-5xl mb-4">📦</p>
                <p className="font-medium text-lg">No products found</p>
                <p className="text-sm mt-1">Try a different category or search term</p>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3
                                lg:grid-cols-4 gap-5">
                  {sortedProducts.map(product => (
                    <div
                      key={product._id}
                      className="bg-white border border-gray-100 rounded-2xl
                        overflow-hidden hover:-translate-y-1 hover:shadow-xl
                        transition-all duration-300 flex flex-col group"
                    >
                      {/* Badge */}
                      <div className="relative">
                        <span className="absolute top-3 left-3 z-10 bg-red-600
                          text-white text-xs font-semibold px-2 py-1 rounded">
                          {product.category}
                        </span>

                        {product.discount > 0 && (
                          <span className="absolute top-3 right-3 z-10
                            bg-orange-500 text-white text-xs font-bold
                            px-2 py-1 rounded-full">
                            -{Math.round((product.discount / product.price) * 100)}%
                          </span>
                        )}

                        {/* Image */}
                        <div
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="cursor-pointer bg-gray-50 flex items-center
                            justify-center h-44 overflow-hidden px-4 pt-6 pb-2"
                        >
                          <img
                            src={product.imageUrl || 'https://via.placeholder.com/200'}
                            alt={product.name}
                            className="h-full object-contain group-hover:scale-110
                              transition-transform duration-500"
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex flex-col gap-2 flex-1">
                        <h4
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="text-sm font-semibold text-gray-800
                            line-clamp-2 cursor-pointer hover:text-blue-600
                            transition"
                        >
                          {product.name}
                        </h4>

                        {/* Stock */}
                        {product.stock > 0 ? (
                          <span className="text-xs text-green-600">
                            ✅ In Stock
                          </span>
                        ) : (
                          <span className="text-xs text-red-500">
                            ❌ Out of Stock
                          </span>
                        )}

                        {/* Price */}
                        <div className="flex items-center justify-between mt-auto pt-2">
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

                          <button
                            onClick={() => console.log("Add to cart", product._id)}
                            className="bg-blue-600 text-white p-2 rounded-full
                              hover:bg-blue-700 transition"
                            disabled={product.stock <= 0}
                          >
                            <FaShoppingCart size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-200
                        text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium
                          ${currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-200
                        text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
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