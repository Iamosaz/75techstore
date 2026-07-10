// src/pages/BlogDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import SEO from '../components/SEO'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const BlogDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        setError('')

        console.log('🔍 Fetching blog with id/slug:', id)

        // ✅ Try slug endpoint first, then fallback to id
        let blogData = null

        try {
          // Try slug first
          const slugRes = await axios.get(`${API_URL}/blogs/slug/${id}`)
          blogData = slugRes.data
          console.log('✅ Found by slug:', blogData.title)
        } catch {
          // Fallback to _id
          console.log('⚠️ Slug not found, trying _id...')
          try {
            const idRes = await axios.get(`${API_URL}/blogs/${id}`)
            blogData = idRes.data
            console.log('✅ Found by ID:', blogData.title)
          } catch (err2) {
            console.error('❌ Not found by ID either:', err2.message)
            setError('Blog post not found')
            return
          }
        }

        setBlog(blogData)

        // ✅ Fetch related blogs
        try {
          const related = await axios.get(`${API_URL}/blogs`, {
            params: { category: blogData.category, limit: 4 }
          })
          setRelatedBlogs(
            related.data.blogs?.filter(b => b._id !== blogData._id).slice(0, 3) || []
          )
        } catch {
          // Related blogs failing is not critical
          console.log('⚠️ Could not load related blogs')
        }

      } catch (err) {
        console.error('❌ Failed to fetch blog:', err)
        setError('Failed to load blog post')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchBlog()
  }, [id])

  const handleWhatsAppShare = () => {
    const message = `Check out this article from 75TechStore!\n\n*${blog.title}*\n\n${window.location.href}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ✅ Navigate related blog correctly
  const handleRelatedClick = (relatedBlog) => {
    const path = relatedBlog.slug
      ? `/blog/${relatedBlog.slug}`
      : `/blog/${relatedBlog._id}`
    navigate(path)
    window.scrollTo(0, 0)
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-64 sm:h-80 bg-gray-200" />
            <div className="p-8 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="space-y-2 mt-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error / Not Found
  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <p className="text-6xl mb-4">😕</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Blog Post Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            This article may have been removed or the link is incorrect.
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="bg-blue-600 hover:bg-blue-700 text-white
                       px-8 py-3 rounded-xl font-semibold transition"
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* SEO */}
      <SEO
        title={blog.metaTitle || blog.title}
        description={blog.metaDescription || blog.excerpt}
        image={blog.coverImage}
        url={`/blog/${blog.slug || blog._id}`}
        type="article"
        keywords={blog.tags?.join(', ')}
      />

      <div className="min-h-screen bg-gray-50">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
              <span onClick={() => navigate('/')}
                className="cursor-pointer hover:text-blue-600 transition">
                Home
              </span>
              <span>›</span>
              <span onClick={() => navigate('/blog')}
                className="cursor-pointer hover:text-blue-600 transition">
                Blog
              </span>
              <span>›</span>
              <span className="text-gray-900 font-medium line-clamp-1">
                {blog.title}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">

          {/* Article */}
          <article className="bg-white rounded-2xl overflow-hidden
                              shadow-sm border border-gray-100 mb-8">

            {/* Cover Image */}
            {blog.coverImage && (
              <div className="h-64 sm:h-96 overflow-hidden">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.parentElement.style.display = 'none'}
                />
              </div>
            )}

            <div className="p-6 sm:p-10">

              {/* Category + Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="bg-blue-600 text-white text-xs
                                 font-semibold px-3 py-1.5 rounded-full">
                  {blog.category}
                </span>
                <span className="text-gray-400 text-sm">
                  ⏱ {blog.readTime || 5} min read
                </span>
                <span className="text-gray-400 text-sm">
                  👁 {blog.views || 0} views
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-extrabold
                             text-gray-900 mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Author + Date + Share */}
              <div className="flex flex-wrap items-center justify-between
                              gap-4 pb-6 mb-6 border-b border-gray-100">

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500
                                  to-blue-700 rounded-full flex items-center
                                  justify-center text-white font-bold text-lg">
                    {blog.author?.charAt(0)?.toUpperCase() || '7'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {blog.author}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(blog.createdAt).toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleWhatsAppShare}
                    className="bg-green-500 hover:bg-green-600 text-white
                               px-4 py-2 rounded-lg text-xs font-semibold
                               transition flex items-center gap-1.5"
                  >
                    📱 Share
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold
                               transition ${copied
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {copied ? '✅ Copied!' : '🔗 Copy Link'}
                  </button>
                </div>
              </div>

              {/* ✅ Blog Content - with proper HTML rendering and styling */}
              <div
                className="
                  blog-content
                  text-gray-700
                  leading-relaxed
                  text-base
                  [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mt-8 [&>h1]:mb-4
                  [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-4
                  [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-3
                  [&>p]:mb-4 [&>p]:text-gray-700 [&>p]:leading-relaxed
                  [&>ul]:mb-4 [&>ul]:pl-6 [&>ul]:list-disc [&>ul]:space-y-2
                  [&>ol]:mb-4 [&>ol]:pl-6 [&>ol]:list-decimal [&>ol]:space-y-2
                  [&>li]:text-gray-700
                  [&>strong]:font-bold [&>strong]:text-gray-900
                  [&>a]:text-blue-600 [&>a]:underline [&>a]:hover:text-blue-800
                  [&>blockquote]:border-l-4 [&>blockquote]:border-blue-400
                  [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600
                  [&>blockquote]:my-6
                  [&>img]:rounded-xl [&>img]:my-6 [&>img]:w-full
                  [&>code]:bg-gray-100 [&>code]:px-1.5 [&>code]:py-0.5
                  [&>code]:rounded [&>code]:text-sm [&>code]:font-mono
                "
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <p className="text-sm font-bold text-gray-700 mb-3">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, i) => (
                      <span key={i}
                        className="bg-blue-50 text-blue-600 text-xs
                                   px-3 py-1.5 rounded-full font-medium
                                   hover:bg-blue-100 cursor-pointer transition">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Banner */}
              <div className="mt-10 bg-gradient-to-r from-blue-600 to-blue-800
                              rounded-2xl p-6 text-white text-center">
                <p className="text-lg font-bold mb-2">
                  🛍️ Shop at 75TechStore
                </p>
                <p className="text-blue-200 text-sm mb-4">
                  Visit us at Computer Village, Ikeja Lagos or shop online
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => navigate('/shop')}
                    className="bg-white text-blue-700 px-6 py-2 rounded-lg
                               font-semibold text-sm hover:bg-blue-50 transition"
                  >
                    🛒 Shop Now
                  </button>
                  <a
                    href="https://wa.me/2347035620709"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white
                               px-6 py-2 rounded-lg font-semibold text-sm transition"
                  >
                    📱 WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedBlogs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📚 Related Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedBlogs.map(related => (
                  <div
                    key={related._id}
                    onClick={() => handleRelatedClick(related)}
                    className="bg-white rounded-xl overflow-hidden shadow-sm
                               border border-gray-100 hover:-translate-y-1
                               hover:shadow-md transition cursor-pointer"
                  >
                    <div className="h-32 overflow-hidden bg-gradient-to-br
                                    from-blue-400 to-purple-500">
                      {related.coverImage ? (
                        <img
                          src={related.coverImage}
                          alt={related.title}
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-3xl">📱</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-blue-600 font-medium">
                        {related.category}
                      </span>
                      <p className="text-sm font-semibold text-gray-900
                                   line-clamp-2 mt-1 hover:text-blue-600 transition">
                        {related.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        ⏱ {related.readTime || 5} min read
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={() => navigate('/blog')}
              className="bg-blue-600 hover:bg-blue-700 text-white
                         px-8 py-3 rounded-xl font-semibold transition"
            >
              ← Back to Blog
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogDetail