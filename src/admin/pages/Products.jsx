// src/admin/pages/Products.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const categories = [
  'Laptops', 'Phones', 'Tablets',
  'Accessories', 'Monitors', 'Storage',
  'Networking', 'Gaming', 'Audio',
  'Cameras', 'Printers', 'Software',
  'Wearables', 'Smart Home', 'Components',
  'Consoles', 'Other'
];

const defaultForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  brand: '',
  imageUrl: '',
  isFeatured: false,
  isTopPick: false,
  isBestSelling: false,
  isNewArrival: false,
  isDealOfDay: false,
  discount: '',
  offerEnds: '',
  imageSize: 'medium'
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [formData, setFormData] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ✅ Fixed - correct token key
  const getToken = () => localStorage.getItem('adminToken');

  // ✅ Fixed - correct template literal
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

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (searchTerm) params.append('keyword', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('page', currentPage);
      params.append('limit', 10);

      const { data } = await axios.get(`${API_URL}/products?${params}`);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, currentPage]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddNew = () => {
    setEditProduct(null);
    setFormData(defaultForm);
    setError('');
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      brand: product.brand || '',
      imageUrl: product.imageUrl || '',
      isFeatured: product.isFeatured || false,
      isTopPick: product.isTopPick || false,
      isBestSelling: product.isBestSelling || false,
      isNewArrival: product.isNewArrival || false,
      isDealOfDay: product.isDealOfDay || false,
      discount: product.discount || '',
      offerEnds: product.offerEnds
        ? new Date(product.offerEnds).toISOString().slice(0, 16)
        : '',
      imageSize: product.imageSize || 'medium'
    });
    setError('');
    setShowModal(true);
  };

  // ✅ Fixed - correct template literal in Authorization
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const token = getToken();
      if (!token) return;

      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const { data } = await axios.post(
        `${API_URL}/upload`,
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
      showSuccessMsg('Image uploaded successfully!');

    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // ✅ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const config = getConfig();
      if (!config) return;

      const submitData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        discount: Number(formData.discount) || 0,
        offerEnds: formData.offerEnds || null
      };

      if (editProduct) {
        await axios.put(
          `${API_URL}/products/${editProduct._id}`,
          submitData,
          config
        );
        showSuccessMsg('Product updated successfully!');
      } else {
        await axios.post(`${API_URL}/products`, submitData, config);
        showSuccessMsg('Product added successfully!');
      }

      setShowModal(false);
      fetchProducts();

    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => { window.location.href = '/admin/login'; }, 2000);
      } else {
        setError(err.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Fixed - correct template literal in delete URL
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const config = getConfig();
      if (!config) return;

      await axios.delete(`${API_URL}/products/${deleteId}`, config);
      showSuccessMsg('Product deleted successfully!');
      setDeleteId(null);
      fetchProducts();

    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => { window.location.href = '/admin/login'; }, 2000);
      } else {
        setError(err.response?.data?.message || 'Failed to delete product');
      }
      setDeleteId(null);
    }
  };

  const showSuccessMsg = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const getProductTags = (product) => {
    const tags = [];
    if (product.isTopPick) tags.push({ label: 'Top Pick', color: 'bg-purple-50 text-purple-600' });
    if (product.isBestSelling) tags.push({ label: 'Best Selling', color: 'bg-orange-50 text-orange-600' });
    if (product.isNewArrival) tags.push({ label: 'New', color: 'bg-green-50 text-green-600' });
    if (product.isDealOfDay) tags.push({ label: 'Deal', color: 'bg-red-50 text-red-600' });
    if (product.isFeatured) tags.push({ label: 'Featured', color: 'bg-yellow-50 text-yellow-600' });
    return tags;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalCount} total products in your store
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5
                     rounded-lg font-semibold text-sm transition flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add Product
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700
                        px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
          ✅ {success}
        </div>
      )}
      {error && !showModal && (
        <div className="bg-red-50 border border-red-200 text-red-700
                        px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
          ❌ {error}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg
                       text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent
                            rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Image', 'Product', 'Category', 'Brand',
                    'Price', 'Stock', 'Tags', 'Actions'].map(h => (
                    <th key={h}
                      className="text-left px-5 py-3.5 text-xs font-semibold
                                 text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">📦</span>
                        <p className="font-medium">No products found</p>
                        <p className="text-sm">Add your first product to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product._id}
                      className="hover:bg-gray-50 transition-colors">

                      {/* Image */}
                      <td className="px-5 py-4">
                        <img
                          src={product.imageUrl || 'https://via.placeholder.com/48'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                        />
                      </td>

                      {/* Name */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900 text-sm">
                          {product.name}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">
                          {product.description}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="bg-blue-50 text-blue-600 text-xs
                                         font-medium px-2.5 py-1 rounded-full">
                          {product.category}
                        </span>
                      </td>

                      {/* Brand */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {product.brand || '—'}
                      </td>

                      {/* ✅ Fixed Price - ₦ with toLocaleString */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-gray-900 text-sm">
                          ₦{Number(product.price).toLocaleString()}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-red-500 text-xs ml-1">
                            (-₦{Number(product.discount).toLocaleString()})
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">
                        {product.stock > 0 ? (
                          <span className="bg-green-50 text-green-700 text-xs
                                           font-medium px-2.5 py-1 rounded-full">
                            {product.stock} in stock
                          </span>
                        ) : (
                          <span className="bg-red-50 text-red-600 text-xs
                                           font-medium px-2.5 py-1 rounded-full">
                            Out of stock
                          </span>
                        )}
                      </td>

                      {/* Tags */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {getProductTags(product).map((tag, i) => (
                            <span key={i}
                              className={`${tag.color} text-xs font-medium
                                          px-2 py-0.5 rounded-full`}>
                              {tag.label}
                            </span>
                          ))}
                          {getProductTags(product).length === 0 && (
                            <span className="text-gray-400 text-xs">None</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-600
                                       text-xs font-medium px-3 py-1.5 rounded-lg transition"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(product._id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600
                                       text-xs font-medium px-3 py-1.5 rounded-lg transition"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm
                       disabled:opacity-40 hover:bg-gray-50 transition"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition
                ${currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm
                       disabled:opacity-40 hover:bg-gray-50 transition"
          >
            Next →
          </button>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center
                        justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh]
                          overflow-y-auto shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6
                            border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editProduct ? '✏️ Edit Product' : '➕ Add New Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Name + Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. iPhone 15 Pro"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Apple"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Price (₦) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Discount + Offer Ends */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Discount (₦)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Offer Ends
                  </label>
                  <input
                    type="datetime-local"
                    name="offerEnds"
                    value={formData.offerEnds}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Category + Image Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Image Display Size
                  </label>
                  <select
                    name="imageSize"
                    value={formData.imageSize}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium (Default)</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product Image
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg
                                p-4 text-center hover:border-blue-400 transition mb-3">
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <span className="text-3xl">📁</span>
                    <span className="text-sm font-medium text-gray-700">
                      Click to upload image
                    </span>
                    <span className="text-xs text-gray-400">
                      JPG, PNG, WEBP up to 5MB
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {uploading && (
                    <div className="flex items-center justify-center gap-2
                                    mt-3 text-sm text-blue-600">
                      <div className="w-4 h-4 border-2 border-blue-600
                                      border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">OR paste URL</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                             text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {formData.imageUrl && (
                  <div className="mt-3 flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <div>
                      <p className="text-xs font-medium text-gray-700">Image Preview</p>
                      <p className="text-xs text-green-600 mt-1">✅ Ready to save</p>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Describe the product..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg
                             text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                             resize-none"
                />
              </div>

              {/* Display Tags */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  📌 Display Tags
                  <span className="text-gray-400 font-normal ml-1">
                    (where to show this product)
                  </span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'isFeatured', label: '⭐ Featured', accent: 'accent-yellow-500', hover: 'hover:border-yellow-300' },
                    { name: 'isTopPick', label: '🏆 Top Pick', accent: 'accent-purple-500', hover: 'hover:border-purple-300' },
                    { name: 'isBestSelling', label: '🔥 Best Selling', accent: 'accent-orange-500', hover: 'hover:border-orange-300' },
                    { name: 'isNewArrival', label: '🆕 New Arrival', accent: 'accent-green-500', hover: 'hover:border-green-300' },
                    { name: 'isDealOfDay', label: '💰 Deal of Day', accent: 'accent-red-500', hover: 'hover:border-red-300' },
                  ].map(tag => (
                    <label
                      key={tag.name}
                      className={`flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border border-gray-100 ${tag.hover} transition`}
                    >
                      <input
                        type="checkbox"
                        name={tag.name}
                        checked={formData[tag.name]}
                        onChange={handleChange}
                        className={`w-4 h-4 ${tag.accent}`}
                      />
                      <span className="text-xs font-medium text-gray-700">
                        {tag.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700
                                px-4 py-3 rounded-lg text-sm">
                  ❌ {error}
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700
                             rounded-lg text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white
                             rounded-lg text-sm font-semibold transition
                             disabled:opacity-60 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white
                                      border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editProduct ? 'Update Product' : 'Add Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center
                        justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="text-center">
              <div className="text-5xl mb-4">🗑️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Product?
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200
                             text-gray-700 rounded-lg text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700
                             text-white rounded-lg text-sm font-semibold transition"
                >
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

export default AdminProducts;