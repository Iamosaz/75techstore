// src/admin/pages/Blog.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

// ✅ Fix - Hardcoded URL
const API_URL = 'http://localhost:5000/api';

const blogCategories = [
  'Tech News', 'Product Reviews', 'How To',
  'Deals & Offers', 'Gaming', 'Phones',
  'Laptops', 'Accessories', 'Other'
];

const defaultForm = {
  title: '',
  content: '',
  excerpt: '',
  coverImage: '',
  category: 'Tech News',
  tags: '',
  author: '75TechStore Team',
  status: 'draft',
  isFeatured: false,
  metaTitle: '',
  metaDescription: ''
};

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [formData, setFormData] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [togglingId, setTogglingId] = useState(null);

  const getToken = () => localStorage.getItem('adminToken');

  const getConfig = () => {
    const token = getToken();
    if (!token) {
      window.location.href = '/admin/login';
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('keyword', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', currentPage);
      params.append('limit', 10);

      const config = getConfig();
      const { data } = await axios.get(
        `${API_URL}/blogs/admin/all?${params}`,
        config
      );
      setBlogs(data.blogs || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [searchTerm, statusFilter, currentPage]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddNew = () => {
    setEditBlog(null);
    setFormData(defaultForm);
    setError('');
    setActiveTab('basic');
    setShowModal(true);
  };

  const handleEdit = (blog) => {
    setEditBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      coverImage: blog.coverImage || '',
      category: blog.category,
      tags: blog.tags?.join(', ') || '',
      author: blog.author,
      status: blog.status,
      isFeatured: blog.isFeatured || false,
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || ''
    });
    setError('');
    setActiveTab('basic');
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }
    setUploading(true);
    try {
      const token = getToken();
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      const { data } = await axios.post(
        `${API_URL}/upload`,
        formDataUpload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData(prev => ({ ...prev, coverImage: data.imageUrl }));
      showSuccessMsg('Image uploaded!');
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const config = getConfig();
      if (!config) return;
      const submitData = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
          : []
      };
      if (editBlog) {
        await axios.put(`${API_URL}/blogs/${editBlog._id}`, submitData, config);
        showSuccessMsg('Blog post updated successfully!');
      } else {
        await axios.post(`${API_URL}/blogs`, submitData, config);
        showSuccessMsg('Blog post created successfully!');
      }
      setShowModal(false);
      fetchBlogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const config = getConfig();
      if (!config) return;
      await axios.delete(`${API_URL}/blogs/${deleteId}`, config);
      showSuccessMsg('Blog post deleted!');
      setDeleteId(null);
      fetchBlogs();
    } catch (err) {
      setError('Failed to delete blog post');
      setDeleteId(null);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setTogglingId(id);
      const config = getConfig();
      if (!config) return;
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      await axios.put(`${API_URL}/blogs/${id}`, { status: newStatus }, config);
      showSuccessMsg(
        newStatus === 'published'
          ? '🚀 Blog is now LIVE on your website!'
          : '📝 Blog moved back to draft'
      );
      fetchBlogs();
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setTogglingId(null);
    }
  };

  const showSuccessMsg = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-1">{totalCount} total posts</p>
        </div>
        <button onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5
                     rounded-lg font-semibold text-sm transition flex items-center gap-2">
          <span className="text-lg">+</span> New Post
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700
                        px-4 py-3 rounded-lg mb-4 text-sm font-medium">
          {success}
        </div>
      )}
      {error && !showModal && (
        <div className="bg-red-50 border border-red-200 text-red-700
                        px-4 py-3 rounded-lg mb-4 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input type="text" placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200
                       rounded-lg text-sm focus:outline-none focus:ring-2
                       focus:ring-blue-500 bg-white" />
        </div>
        <select value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Posts', value: totalCount, color: 'text-blue-600' },
          { label: 'Published', value: blogs.filter(b => b.status === 'published').length, color: 'text-green-600' },
          { label: 'Drafts', value: blogs.filter(b => b.status === 'draft').length, color: 'text-yellow-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Cover', 'Title', 'Category', 'Status', 'Views', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold
                                           text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">📝</span>
                        <p className="font-medium">No blog posts yet</p>
                        <p className="text-sm">Create your first blog post</p>
                      </div>
                    </td>
                  </tr>
                ) : blogs.map(blog => (
                  <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <img src={blog.coverImage || 'https://via.placeholder.com/48'}
                        alt={blog.title}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-100" />
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-medium text-gray-900 text-sm line-clamp-1">{blog.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {blog.readTime} min read
                        {blog.isFeatured && <span className="ml-2 text-yellow-500">⭐ Featured</span>}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        blog.status === 'published'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {blog.status === 'published' ? '✅ Published' : '📝 Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">👁 {blog.views || 0}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleToggleStatus(blog._id, blog.status)}
                          disabled={togglingId === blog._id}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg
                            transition disabled:opacity-60 flex items-center gap-1 ${
                            blog.status === 'published'
                              ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200'
                              : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                          }`}>
                          {togglingId === blog._id ? (
                            <>
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              <span>...</span>
                            </>
                          ) : blog.status === 'published' ? <>📝 Unpublish</> : <>🚀 Publish</>}
                        </button>
                        <button onClick={() => handleEdit(blog)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-600
                                     text-xs font-medium px-3 py-1.5 rounded-lg transition border border-amber-200">
                          ✏️ Edit
                        </button>
                        <button onClick={() => setDeleteId(blog._id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600
                                     text-xs font-medium px-3 py-1.5 rounded-lg transition border border-red-200">
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50">
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-lg text-sm font-medium ${
                currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50'
              }`}>
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50">
            Next →
          </button>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editBlog ? '✏️ Edit Post' : '➕ New Blog Post'}
              </h2>
              <button onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none">✕</button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-6">
              {[
                { key: 'basic', label: '📝 Basic Info' },
                { key: 'content', label: '📄 Content' },
                { key: 'seo', label: '🔍 SEO' }
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                    activeTab === tab.key
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* BASIC TAB */}
              {activeTab === 'basic' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="title" value={formData.title}
                      onChange={handleChange} required
                      placeholder="e.g. Top 5 Laptops for Students in Nigeria 2025"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                      <select name="category" value={formData.category} onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                                   text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {blogCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Author</label>
                      <input type="text" name="author" value={formData.author} onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                                   text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-blue-400 transition mb-3">
                      <label className="cursor-pointer flex flex-col items-center gap-2">
                        <span className="text-3xl">📁</span>
                        <span className="text-sm font-medium text-gray-700">Upload cover image</span>
                        <span className="text-xs text-gray-400">JPG, PNG, WEBP up to 5MB</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload}
                          className="hidden" disabled={uploading} />
                      </label>
                      {uploading && (
                        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-blue-600">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          Uploading...
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400">OR paste URL</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <input type="text" name="coverImage" value={formData.coverImage}
                      onChange={handleChange} placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {formData.coverImage && (
                      <div className="mt-3">
                        <img src={formData.coverImage} alt="Cover preview"
                          className="w-full h-40 object-cover rounded-lg border border-gray-200"
                          onError={(e) => e.target.style.display = 'none'} />
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Tags <span className="text-gray-400 font-normal ml-1">(comma separated)</span>
                    </label>
                    <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                      placeholder="e.g. laptops, nigeria, tech, review"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  {/* Status + Featured */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                      <select name="status" value={formData.status} onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                                   text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="draft">📝 Draft</option>
                        <option value="published">✅ Published</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-3 mt-6">
                      <input type="checkbox" name="isFeatured" id="blogFeatured"
                        checked={formData.isFeatured} onChange={handleChange}
                        className="w-4 h-4 accent-yellow-500" />
                      <label htmlFor="blogFeatured"
                        className="text-sm font-medium text-gray-700 cursor-pointer">
                        ⭐ Featured Post
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* CONTENT TAB */}
              {activeTab === 'content' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Excerpt
                      <span className="text-gray-400 font-normal ml-1">(short summary - max 160 chars)</span>
                    </label>
                    <textarea name="excerpt" value={formData.excerpt} onChange={handleChange}
                      rows={2} maxLength={160} placeholder="Brief description of this post..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    <p className="text-xs text-gray-400 mt-1 text-right">{formData.excerpt.length}/160</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <textarea name="content" value={formData.content} onChange={handleChange}
                      required rows={15}
                      placeholder="Write your blog post content here..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                 resize-y font-mono" />
                    <p className="text-xs text-gray-400 mt-1">💡 You can use HTML tags for formatting</p>
                  </div>
                </>
              )}

              {/* SEO TAB */}
              {activeTab === 'seo' && (
                <>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-700 font-medium">🔍 SEO Settings</p>
                    <p className="text-xs text-blue-600 mt-1">These help your blog post rank on Google worldwide</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Meta Title <span className="text-gray-400 font-normal">(max 60 chars)</span>
                    </label>
                    <input type="text" name="metaTitle" value={formData.metaTitle}
                      onChange={handleChange} maxLength={60}
                      placeholder="SEO title for search engines"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <p className="text-xs text-gray-400 mt-1 text-right">{formData.metaTitle.length}/60</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Meta Description <span className="text-gray-400 font-normal">(max 160 chars)</span>
                    </label>
                    <textarea name="metaDescription" value={formData.metaDescription}
                      onChange={handleChange} rows={3} maxLength={160}
                      placeholder="Description that shows in Google search results"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    <p className="text-xs text-gray-400 mt-1 text-right">{formData.metaDescription.length}/160</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Google Preview</p>
                    <div className="space-y-1">
                      <p className="text-blue-600 text-sm font-medium line-clamp-1">
                        {formData.metaTitle || formData.title || 'Your Blog Title Here'}
                      </p>
                      <p className="text-green-700 text-xs">
                        75techstore.com/blog/{formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30) || 'blog-post-slug'}
                      </p>
                      <p className="text-gray-600 text-xs line-clamp-2">
                        {formData.metaDescription || formData.excerpt || 'Your description here...'}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  ❌ {error}
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  {activeTab !== 'basic' && (
                    <button type="button"
                      onClick={() => setActiveTab(activeTab === 'seo' ? 'content' : 'basic')}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition">
                      ← Back
                    </button>
                  )}
                  {activeTab !== 'seo' && (
                    <button type="button"
                      onClick={() => setActiveTab(activeTab === 'basic' ? 'content' : 'seo')}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition">
                      Next →
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting || uploading}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                               text-sm font-semibold transition disabled:opacity-60 flex items-center gap-2">
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : editBlog ? 'Update Post' : 'Create Post'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="text-center">
              <div className="text-5xl mb-4">🗑️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Blog Post?</h3>
              <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                  Cancel
                </button>
                <button onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold">
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;