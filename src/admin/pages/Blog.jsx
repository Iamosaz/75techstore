// src/admin/pages/BlogManager.jsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiEdit, FiTrash2, FiPlus, FiEye, FiSearch,
  FiCalendar, FiFileText, FiX, FiCheck,
  FiCheckCircle, FiClock, FiZap
} from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAdminHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const initialFormState = {
  title: '',
  category: 'Tech News',
  excerpt: '',
  content: '',
  coverImage: '',
  tags: '',
  readTime: 4,
  status: 'published'
};

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [saving, setSaving] = useState(false);

  const categories = [
    'All', 'Tech News', 'Product Reviews', 'How To',
    'Deals & Offers', 'Gaming', 'Phones', 'Laptops',
    'Accessories', 'Other'
  ];

  const showNotification = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3500);
  };

  const fetchAdminBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_URL}/blogs/admin/all?limit=500`, getAdminHeaders());
      const resData = res.data;
      const list = resData.blogs || resData.data || (Array.isArray(resData) ? resData : []);
      setBlogs(list);
    } catch (err) {
      console.error(err);
      setError('Could not load blog posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminBlogs();
  }, [fetchAdminBlogs]);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (blog) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title || '',
      category: blog.category || 'Tech News',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      coverImage: blog.coverImage || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
      readTime: blog.readTime || 4,
      status: blog.status || 'published'
    });
    setIsModalOpen(true);
  };

  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and Content are required!');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      ...formData,
      tags: typeof formData.tags === 'string'
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : formData.tags
    };

    try {
      if (editingId) {
        const { data } = await axios.put(`${API_URL}/blogs/${editingId}`, payload, getAdminHeaders());
        setBlogs(prev => prev.map(b => (b._id === editingId ? (data.blog || data) : b)));
        showNotification('✅ Article updated successfully!');
      } else {
        const { data } = await axios.post(`${API_URL}/blogs`, payload, getAdminHeaders());
        setBlogs(prev => [data.blog || data, ...prev]);
        showNotification('🎉 Article created successfully!');
      }
      setIsModalOpen(false);
      setFormData(initialFormState);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (blog) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    try {
      await axios.put(`${API_URL}/blogs/${blog._id}`, { status: newStatus }, getAdminHeaders());
      setBlogs(prev => prev.map(b => (b._id === blog._id ? { ...b, status: newStatus } : b)));
      showNotification(`Article marked as ${newStatus}!`);
    } catch {
      setError('Failed to update status.');
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Delete this article permanently?')) return;
    try {
      await axios.delete(`${API_URL}/blogs/${blogId}`, getAdminHeaders());
      setBlogs(prev => prev.filter(b => b._id !== blogId));
      showNotification('🗑️ Article deleted.');
    } catch {
      setError('Failed to delete article.');
    }
  };

  const filteredBlogs = (blogs || []).filter(b => {
    const matchesSearch = (b.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 bg-gray-50/50 min-h-screen space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <FiFileText className="text-blue-600" />
            Manage Blog Posts
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create, edit, and manage articles for 75TechStore.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
        >
          <FiPlus size={18} /> Write New Post
        </button>
      </div>

      {/* ALERTS */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-bold">
          <FiCheckCircle size={16} /> {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-medium">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className="ml-auto"><FiX /></button>
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm outline-none transition"
            />
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
            {['All', 'published', 'draft'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition capitalize cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {status === 'draft' ? 'Drafts / AI' : status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full pt-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border cursor-pointer transition ${
                cat === selectedCategory
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading articles...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md mx-auto space-y-3">
          <h3 className="font-bold text-gray-900 text-base">No Articles Found</h3>
          <p className="text-gray-400 text-xs">Write a post or generate one in Chatbot Manager.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] tracking-wider uppercase font-bold text-gray-400">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredBlogs.map(blog => (
                  <tr key={blog._id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3 px-4 max-w-xs sm:max-w-md">
                      <div className="flex items-center gap-3">
                        {blog.coverImage ? (
                          <img src={blog.coverImage} className="w-12 h-12 object-cover rounded-lg border border-gray-100" alt="" />
                        ) : (
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm border border-blue-100">
                            75
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 line-clamp-1">{blog.title}</p>
                            {blog.isAIGenerated && (
                              <span className="bg-purple-100 text-purple-700 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <FiZap size={9} /> AI
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <FiClock size={11} /> {blog.readTime || 4} min read
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-semibold">
                        {blog.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(blog)}
                        className={`text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider transition cursor-pointer ${
                          blog.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                      >
                        {blog.status === 'published' ? '● Live' : '○ Draft'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-xs text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setPreviewBlog(blog); setIsPreviewOpen(true); }}
                          className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition"
                          title="Preview"
                        >
                          <FiEye size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(blog)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                          title="Edit"
                        >
                          <FiEdit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"
                          title="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 sm:p-5 flex items-center justify-between z-10">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                {editingId ? 'Edit Article' : 'Create Article'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitBlog} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Article title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Excerpt</label>
                <input
                  type="text"
                  placeholder="Short summary..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Content *</label>
                <textarea
                  required
                  rows={8}
                  placeholder="Write article content here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-600">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold">
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {isPreviewOpen && previewBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-md">{previewBlog.category}</span>
              <button onClick={() => setIsPreviewOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700"><FiX size={18} /></button>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">{previewBlog.title}</h1>
            
            {previewBlog.coverImage && (
              <img src={previewBlog.coverImage} alt="" className="w-full h-56 object-cover rounded-xl" />
            )}

            {/* Clean HTML / Text Rendering */}
            <div 
              className="text-gray-700 leading-relaxed text-sm sm:text-base space-y-3"
              dangerouslySetInnerHTML={{ __html: previewBlog.content }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default BlogManager;