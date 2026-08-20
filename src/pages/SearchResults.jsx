// src/pages/SearchResults.jsx
// ── Full search results page ──
import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FaSearch, FaStar, FaFilter, FaTimes, FaShoppingCart, FaChevronDown } from 'react-icons/fa'
import { searchProducts } from '../data/products'
import { useSearch } from '../context/SearchContext'

const SearchResults = () => {
  const [searchParams]              = useSearchParams()
  const query                       = searchParams.get('q') || ''
  const { setSearchQuery }          = useSearch()

  const [results, setResults]       = useState([])
  const [filtered, setFiltered]     = useState([])
  const [sortBy, setSortBy]         = useState('relevance')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterBrand, setFilterBrand]       = useState('all')
  const [priceRange, setPriceRange]         = useState([0, 3000])
  const [showFilters, setShowFilters]       = useState(false)

  // ── Run search whenever query changes ──
  useEffect(() => {
    setSearchQuery(query)
    const res = searchProducts(query)
    setResults(res)
    setFiltered(res)
    setFilterCategory('all')
    setFilterBrand('all')
    setSortBy('relevance')
  }, [query])

  // ── Apply filters & sort ──
  useEffect(() => {
    let out = [...results]

    if (filterCategory !== 'all')
      out = out.filter((p) => p.category === filterCategory)

    if (filterBrand !== 'all')
      out = out.filter((p) => p.brand === filterBrand)

    out = out.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (sortBy === 'price-low')  out.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-high') out.sort((a, b) => b.price - a.price)
    if (sortBy === 'rating')     out.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'reviews')    out.sort((a, b) => b.reviews - a.reviews)

    setFiltered(out)
  }, [results, filterCategory, filterBrand, sortBy, priceRange])

  // ── Unique categories & brands from results ──
  const categories = ['all', ...new Set(results.map((p) => p.category))]
  const brands     = ['all', ...new Set(results.map((p) => p.brand))]

  // ── Star rating renderer ──
  const renderStars = (rating) => (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar
          key={s}
          size={12}
          className={s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}
        />
      ))}
    </div>
  )

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-900 to-neutral-900'>

      {/* ── SEARCH HEADER BANNER ── */}
      <div className='bg-gradient-to-r from-neutral-900 via-slate-800 to-neutral-900 
        border-b border-yellow-500/20 py-8'>
        <div className='max-w-7xl mx-auto px-4'>

          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
            <div>
              <div className='flex items-center gap-2 text-gray-400 text-sm mb-1'>
                <FaSearch size={12} />
                <span>Search Results</span>
              </div>
              <h1 className='text-white text-2xl lg:text-3xl font-bold'>
                {query
                  ? <>Results for <span className='text-yellow-500'>"{query}"</span></>
                  : 'Search Products'}
              </h1>
              <p className='text-gray-400 text-sm mt-1'>
                {filtered.length === 0
                  ? 'No products found'
                  : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='appearance-none bg-white/10 border border-white/20 text-white 
                    px-4 py-2.5 pr-9 rounded-lg focus:outline-none focus:border-yellow-500 
                    text-sm cursor-pointer'
                >
                  <option value='relevance' className='bg-gray-800'>Sort: Relevance</option>
                  <option value='price-low' className='bg-gray-800'>Price: Low to High</option>
                  <option value='price-high' className='bg-gray-800'>Price: High to Low</option>
                  <option value='rating' className='bg-gray-800'>Highest Rated</option>
                  <option value='reviews' className='bg-gray-800'>Most Reviewed</option>
                </select>
                <FaChevronDown
                  size={12}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
                />
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className='lg:hidden flex items-center gap-2 bg-white/10 border 
                  border-white/20 hover:border-yellow-500 text-white px-4 py-2.5 
                  rounded-lg text-sm transition-all duration-300'
              >
                <FaFilter size={14} />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='flex gap-8'>

          {/* ════════════════════════════════════ */}
          {/* FILTERS SIDEBAR */}
          {/* ════════════════════════════════════ */}
          <aside className={`
            ${showFilters ? 'block' : 'hidden'} lg:block
            fixed lg:static inset-0 lg:inset-auto z-50 lg:z-auto
            bg-slate-900 lg:bg-transparent
            w-72 lg:w-64 flex-shrink-0
            overflow-y-auto lg:overflow-visible
            p-6 lg:p-0
          `}>

            {/* Mobile close button */}
            <div className='flex items-center justify-between mb-6 lg:hidden'>
              <h2 className='text-white font-bold text-lg'>Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className='text-gray-400 hover:text-white transition-colors'
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className='space-y-6 sticky top-24'>

              {/* ── Category Filter ── */}
              <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                <h3 className='text-white font-semibold mb-3 text-sm uppercase tracking-wider'>
                  Category
                </h3>
                <div className='space-y-2'>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm 
                        capitalize transition-all duration-200 
                        ${filterCategory === cat
                          ? 'bg-yellow-500 text-gray-900 font-semibold'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                      {cat === 'all' ? 'All Categories' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Brand Filter ── */}
              <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                <h3 className='text-white font-semibold mb-3 text-sm uppercase tracking-wider'>
                  Brand
                </h3>
                <div className='space-y-2'>
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setFilterBrand(brand)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm 
                        capitalize transition-all duration-200 
                        ${filterBrand === brand
                          ? 'bg-yellow-500 text-gray-900 font-semibold'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                      {brand === 'all' ? 'All Brands' : brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Price Range ── */}
              <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                <h3 className='text-white font-semibold mb-3 text-sm uppercase tracking-wider'>
                  Max Price
                </h3>
                <input
                  type='range'
                  min={0}
                  max={3000}
                  step={50}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className='w-full accent-yellow-500 cursor-pointer'
                />
                <div className='flex justify-between text-gray-400 text-xs mt-2'>
                  <span>$0</span>
                  <span className='text-yellow-500 font-semibold'>${priceRange[1]}</span>
                  <span>$3000</span>
                </div>
              </div>

              {/* ── Clear Filters ── */}
              <button
                onClick={() => {
                  setFilterCategory('all')
                  setFilterBrand('all')
                  setPriceRange([0, 3000])
                  setSortBy('relevance')
                }}
                className='w-full py-2.5 border border-red-500/50 text-red-400 
                  hover:bg-red-500/10 rounded-lg text-sm font-medium transition-all 
                  duration-300 flex items-center justify-center gap-2'
              >
                <FaTimes size={12} />
                Clear All Filters
              </button>

            </div>
          </aside>

          {/* Mobile overlay backdrop */}
          {showFilters && (
            <div
              className='fixed inset-0 bg-black/60 z-40 lg:hidden'
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* ════════════════════════════════════ */}
          {/* RESULTS GRID */}
          {/* ════════════════════════════════════ */}
          <main className='flex-grow'>

            {/* ── No Results ── */}
            {filtered.length === 0 && (
              <div className='flex flex-col items-center justify-center py-24 text-center'>
                <div className='text-7xl mb-4'>🔍</div>
                <h2 className='text-white text-2xl font-bold mb-2'>No products found</h2>
                <p className='text-gray-400 mb-6 max-w-md'>
                  We couldn't find any products matching "{query}". 
                  Try different keywords or browse our categories.
                </p>
                <div className='flex flex-wrap gap-3 justify-center'>
                  <Link
                    to='/shop'
                    className='px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 
                      font-bold rounded-lg transition-all duration-300'
                  >
                    Browse All Products
                  </Link>
                  <Link
                    to='/'
                    className='px-6 py-3 bg-white/10 hover:bg-white/20 text-white 
                      rounded-lg transition-all duration-300'
                  >
                    Go Home
                  </Link>
                </div>
              </div>
            )}

            {/* ── Product Cards Grid ── */}
            {filtered.length > 0 && (
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    to={`/shop/${product.category}/${product.id}`}
                    className='group bg-white/5 border border-white/10 rounded-2xl 
                      overflow-hidden hover:border-yellow-500/50 hover:shadow-xl 
                      hover:shadow-yellow-500/10 transition-all duration-300 
                      hover:-translate-y-1'
                  >
                    {/* Product Image */}
                    <div className='relative overflow-hidden bg-white/5 h-48'>
                      <img
                        src={product.image}
                        alt={product.name}
                        className='w-full h-full object-cover group-hover:scale-105 
                          transition-transform duration-500'
                      />

                      {/* Discount Badge */}
                      {product.originalPrice > product.price && (
                        <span className='absolute top-3 left-3 bg-red-500 text-white 
                          text-xs font-bold px-2 py-1 rounded-full'>
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                      )}

                      {/* Stock badge */}
                      {!product.inStock && (
                        <div className='absolute inset-0 bg-black/60 flex items-center 
                          justify-center'>
                          <span className='text-white font-bold text-sm bg-red-600 
                            px-3 py-1 rounded-full'>Out of Stock</span>
                        </div>
                      )}

                      {/* Cart hover button */}
                      <div className='absolute bottom-3 right-3 opacity-0 
                        group-hover:opacity-100 transition-all duration-300 
                        translate-y-2 group-hover:translate-y-0'>
                        <button
                          onClick={(e) => e.preventDefault()}
                          className='bg-yellow-500 hover:bg-yellow-600 text-gray-900 
                            p-2.5 rounded-full shadow-lg font-bold transition-all duration-300'
                        >
                          <FaShoppingCart size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className='p-4'>
                      <p className='text-gray-400 text-xs capitalize mb-1'>
                        {product.brand} • {product.category}
                      </p>
                      <h3 className='text-white font-semibold text-sm leading-snug 
                        group-hover:text-yellow-500 transition-colors duration-300 
                        line-clamp-2 mb-2'>
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className='flex items-center gap-2 mb-3'>
                        {renderStars(product.rating)}
                        <span className='text-gray-400 text-xs'>
                          {product.rating} ({product.reviews.toLocaleString()})
                        </span>
                      </div>

                      {/* Price */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-baseline gap-2'>
                          <span className='text-yellow-500 font-bold text-lg'>
                            ${product.price.toLocaleString()}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className='text-gray-500 text-xs line-through'>
                              ${product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                          ${product.inStock
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                          }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default SearchResults