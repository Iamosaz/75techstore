// src/pages/BlogPage.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import SEO from '../components/SEO'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const BlogPage = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const categories = [
    'All', 'Tech News', 'Product Reviews', 'How To',
    'Deals & Offers', 'Gaming', 'Phones', 'Laptops',
    'Accessories', 'Other'
  ]

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        setError('')
        const params = new URLSearchParams()
        if (searchTerm) params.append('keyword', searchTerm)
        if (selectedCategory && selectedCategory !== 'All') {
          params.append('category', selectedCategory)
        }
        params.append('page', currentPage)
        params.append('limit', 9)

        const { data } = await axios.get(`${API_URL}/blogs?${params}`)
        setBlogs(data.blogs || [])
        setTotalPages(data.totalPages || 1)
        setTotalCount(data.totalCount || 0)
      } catch (err) {
        console.error('Failed to fetch blogs:', err)
        setError('Failed to load blogs. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [searchTerm, selectedCategory, currentPage])

  // ✅ Navigate using slug if available, fallback to _id
  const handleBlogClick = (blog) => {
    const path = blog.slug ? `/blog/${blog.slug}` : `/blog/${blog._id}`
    navigate(path)
  }

  return (
    <>
      <SEO
        title="Tech Blog - Latest News & Reviews"
        description="Read the latest tech news, product reviews, how-to guides and deals from 75TechStore Nigeria."
        keywords="tech blog nigeria, phone reviews, laptop reviews, tech news africa"
        url="/blog"
      />

      <div className="min-h-screen bg-gray-50">

        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-3">75TechStore Blog</h1>
          <p className="text-blue-200 max-w-xl mx-auto">
            Latest tech news, product reviews, how-to guides and exclusive deals
          </p>
          {totalCount > 0 && (
            <p className="text-blue-300 text-sm mt-2">{totalCount} articles published</p>
          )}

          {/* Search */}
          <div className="mt-6 max-w-md mx-auto flex gap-2">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-bold transition">
              Search
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat === 'All' ? '' : cat)
                  setCurrentPage(1)
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  (cat === 'All' && !selectedCategory) || cat === selectedCategory
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700
                            px-6 py-4 rounded-xl mb-6 text-center text-sm">
              ❌ {error}
              <button onClick={() => window.location.reload()} className="ml-2 underline">
                Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden
                                        shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-full" />
                    <div className="h-5 bg-gray-200 rounded w-4/5" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>

          ) : blogs.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">📝</p>
              <p className="font-medium text-lg">No blog posts found</p>
              <p className="text-sm mt-1">
                {searchTerm || selectedCategory
                  ? 'Try a different search or category'
                  : 'Check back soon!'
                }
              </p>
            </div>

          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map(blog => (
                  <div
                    key={blog._id}
                    onClick={() => handleBlogClick(blog)} // ✅ Fixed navigation
                    className="bg-white rounded-2xl overflow-hidden shadow-sm
                               border border-gray-100 hover:-translate-y-1
                               hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    {/* Cover Image */}
                    <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 relative">
                      {blog.coverImage ? (
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover hover:scale-105
                                     transition-transform duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl">📱</span>
                        </div>
                      )}
                      {/* Featured Badge */}
                      {blog.isFeatured && (
                        <div className="absolute top-3 left-3 bg-yellow-400
                                        text-yellow-900 text-xs font-bold
                                        px-2 py-1 rounded-full">
                          ⭐ Featured
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-blue-50 text-blue-600 text-xs
                                         font-medium px-2.5 py-1 rounded-full">
                          {blog.category}
                        </span>
                        <span className="text-gray-400 text-xs">
                          ⏱ {blog.readTime || 5} min read
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 text-lg
                                     line-clamp-2 mb-2 hover:text-blue-600 transition">
                        {blog.title}
                      </h3>

                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                        {blog.excerpt ||
                          blog.content?.replace(/<[^>]*>/g, '').substring(0, 120) + '...'
                        }
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>✍️ {blog.author}</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString('en-NG', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}</span>
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
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${
                        currentPage === page
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
    </>
  )
}

export default BlogPage