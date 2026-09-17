// src/pages/BlogPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiSearch, FiClock, FiUser, FiCalendar, 
  FiArrowRight, FiInbox, FiRotateCw, FiAward 
} from 'react-icons/fi';
import SEO from '../SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const BlogPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // 🔍 Separate search inputs to prevent flooding your backend on every keystroke!
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'All', 'Tech News', 'Product Reviews', 'How To',
    'Deals & Offers', 'Gaming', 'Phones', 'Laptops',
    'Accessories', 'Other'
  ];

  // ⏱️ Debounce Search Input: Waits 500ms after user stops typing before calling backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError('');
        const params = new URLSearchParams();
        if (searchTerm) params.append('keyword', searchTerm);
        if (selectedCategory && selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }
        params.append('page', currentPage);
        params.append('limit', 9);

        const { data } = await axios.get(`${API_URL}/blogs?${params}`);
        setBlogs(data.blogs || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
        setError('Failed to load articles. Check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [searchTerm, selectedCategory, currentPage]);

  const handleBlogClick = (blog) => {
    const path = blog.slug ? `/blog/${blog.slug}` : `/blog/${blog._id}`;
    navigate(path);
  };

  return (
    <>
      <SEO
        title="Tech Blog - Latest News & Reviews | 75TechStore"
        description="Read the latest tech news, product reviews, how-to guides and deals from 75TechStore Nigeria."
        keywords="tech blog nigeria, phone reviews, laptop reviews, tech news africa"
        url="/blog"
      />

      <div className="min-h-screen bg-gray-50/50">
        
        {/* ═══ MODERN HERO BANNER ═══ */}
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden py-20 px-4">
          {/* Decorative Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-25" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full blur-[128px] opacity-20" />

          <div className="relative max-w-4xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
              75Tech News
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-300">
              Discover the Future of Tech
            </h1>
            <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Stay ahead with curated insights, accurate product reviews, tech updates, and exclusive deals from Nigeria's top tech store.
            </p>

            {totalCount > 0 && (
              <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase">
                {totalCount} Articles Published & Counting
              </p>
            )}

            {/* Premium Search Input */}
            <div className="mt-8 max-w-lg mx-auto relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-400 transition-colors">
                <FiSearch size={18} />
              </div>
              <input
                type="text"
                placeholder="Search topics, phones, tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 hover:bg-white/[0.12] focus:bg-white text-white focus:text-gray-900 rounded-2xl border border-white/10 focus:border-white outline-none transition-all duration-300 shadow-xl placeholder-gray-400 focus:placeholder-gray-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* ═══ MAIN LAYOUT ═══ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          
          {/* Category Quick Filter */}
          <div className="flex flex-col gap-2.5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filter by Category</h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat === 'All' ? '' : cat);
                    setCurrentPage(1);
                  }}
                  className={`px-4.5 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                    (cat === 'All' && !selectedCategory) || cat === selectedCategory
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10 hover:bg-blue-700'
                      : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-200/80 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm max-w-xl mx-auto">
              <span className="text-red-700 text-sm font-medium">⚠️ {error}</span>
              <button 
                onClick={() => window.location.reload()} 
                className="flex items-center gap-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              >
                <FiRotateCw size={12} /> Retry
              </button>
            </div>
          )}

          {/* ═══ BLOGS RENDERING STATES ═══ */}
          {loading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100/80 animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-5 space-y-4">
                    <div className="h-4.5 bg-gray-200 rounded w-1/4" />
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-full" />
                      <div className="h-5 bg-gray-200 rounded w-5/6" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>

          ) : blogs.length === 0 ? (
            /* Elegant Empty State */
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto">
                <FiInbox />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">No Articles Found</h3>
                <p className="text-gray-400 text-sm mt-1 px-4">
                  {searchTerm || selectedCategory
                    ? "We couldn't find matches for your search. Try other keywords."
                    : 'We are currently writing fresh tech insights. Check back soon!'}
                </p>
              </div>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
                >
                  Clear All Filters
                </button>
              )}
            </div>

          ) : (
            /* Fully Loaded Premium Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogs.map(blog => (
                <article
                  key={blog._id}
                  onClick={() => handleBlogClick(blog)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-blue-100 transition-all duration-300 flex flex-col h-full cursor-pointer"
                >
                  {/* Aspect-ratio fixed Image container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-4">
                        <span className="text-3xl">🔌</span>
                        <span className="text-[10px] font-bold tracking-widest uppercase mt-2 opacity-60">75TechStore</span>
                      </div>
                    )}

                    {/* Featured Sticker */}
                    {blog.isFeatured && (
                      <span className="absolute top-3 left-3 bg-amber-400 text-amber-950 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <FiAward size={10} /> Featured
                      </span>
                    )}
                  </div>

                  {/* Card Content Area */}
                  <div className="p-5 flex flex-col flex-1 space-y-4">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg">
                        {blog.category}
                      </span>
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <FiClock /> {blog.readTime || 4} min read
                      </span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <h3 className="font-extrabold text-gray-900 text-base sm:text-lg line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors duration-200">
                        {blog.title}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {blog.excerpt ||
                          blog.content?.replace(/<[^>]*>/g, '').substring(0, 120) + '...'
                        }
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <FiUser className="text-gray-300" /> {blog.author || '75Tech Team'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FiCalendar className="text-gray-300" />
                        {new Date(blog.createdAt).toLocaleDateString('en-NG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ═══ MODERN PAGINATION ═══ */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-8 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-white transition flex items-center gap-1 cursor-pointer"
              >
                ← Prev
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10 scale-105'
                      : 'border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-white transition flex items-center gap-1 cursor-pointer"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;