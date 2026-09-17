// src/admin/pages/Products.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  Package, Star, Tag, Layers, DollarSign, Edit, Trash2, AlertTriangle,
  RefreshCw, Upload, Download, FileText, Check, X, Search, ChevronRight, HelpCircle,
  Image as ImageIcon, Plus
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const categories = [
  'Laptops', 'Phones', 'Tablets', 'Accessories', 'Monitors', 'Storage',
  'Networking', 'Gaming', 'Audio', 'Cameras', 'Printers', 'Software',
  'Wearables', 'Smart Home', 'Components', 'Consoles', 'Other'
];

const conditions = ['Brand New', 'UK Used', 'GoodDeals'];
const grades     = ['N/A', 'Grade A', 'Grade B', 'Grade C'];

const defaultForm = {
  name:          '',
  description:   '',
  price:         '',
  stock:         '',
  category:      '',
  brand:         '',
  imageUrl:      '',
  images:        [],
  condition:     'Brand New',
  grade:         'N/A',
  isFeatured:    false,
  isTopPick:     false,
  isBestSelling: false,
  isNewArrival:  false,
  isDealOfDay:   false,
  discount:      '',
  offerEnds:     '',
  imageSize:     'medium'
};

const AdminProducts = () => {
  const [products, setProducts]                 = useState([]);
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState('');
  const [success, setSuccess]                   = useState('');
  const [showModal, setShowModal]               = useState(false);
  const [editProduct, setEditProduct]           = useState(null);

  const [searchQuery, setSearchQuery]           = useState('');
  const [searchTerm, setSearchTerm]             = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage]           = useState(1);
  const [totalPages, setTotalPages]             = useState(1);
  const [totalCount, setTotalCount]             = useState(0);
  const [formData, setFormData]                 = useState(defaultForm);
  const [submitting, setSubmitting]             = useState(false);
  const [deleteId, setDeleteId]                 = useState(null);

  const [uploading, setUploading]               = useState(false);
  const [uploadingAngles, setUploadingAngles]   = useState(false);
  const [manualAngleUrl, setManualAngleUrl]     = useState('');

  const [selectedIds, setSelectedIds]           = useState([]);
  const [isBulkDeleting, setIsBulkDeleting]     = useState(false);
  const [csvUploadProgress, setCsvUploadProgress] = useState(null);
  const fileInputRef = useRef(null);

  const [editingCell, setEditingCell]           = useState(null);
  const [tempCellValue, setTempCellValue]       = useState('');
  const [inlineSavingId, setInlineSavingId]     = useState(null);

  const getToken  = () => localStorage.getItem('adminToken');
  const getConfig = useCallback(() => {
    const token = getToken();
    if (!token) { window.location.href = '/admin/login'; return null; }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchTerm(searchQuery);
      setCurrentPage(1);
    }, 450);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (searchTerm)       params.append('keyword',  searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('page',  currentPage);
      params.append('limit', 12);

      const { data } = await axios.get(`${API_URL}/products?${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError('Failed to fetch store inventory. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, currentPage]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'condition' && value !== 'UK Used' ? { grade: 'N/A' } : {})
    }));
  };

  const handleAddNew = () => {
    setEditProduct(null);
    setFormData(defaultForm);
    setManualAngleUrl('');
    setError('');
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name:          product.name,
      description:   product.description,
      price:         product.price,
      stock:         product.stock,
      category:      product.category,
      brand:         product.brand         || '',
      imageUrl:      product.imageUrl      || '',
      images:        product.images        || [],
      condition:     product.condition     || 'Brand New',
      grade:         product.grade         || 'N/A',
      isFeatured:    product.isFeatured    || false,
      isTopPick:     product.isTopPick     || false,
      isBestSelling: product.isBestSelling || false,
      isNewArrival:  product.isNewArrival  || false,
      isDealOfDay:   product.isDealOfDay   || false,
      discount:      product.discount      || '',
      offerEnds:     product.offerEnds
        ? new Date(product.offerEnds).toISOString().slice(0, 16)
        : '',
      imageSize:     product.imageSize     || 'medium'
    });
    setManualAngleUrl('');
    setError('');
    setShowModal(true);
  };

  // ── ⚡ INLINE PRICE & STOCK EDITING ──
  const startInlineEdit = (id, field, initialValue) => {
    setEditingCell({ id, field });
    setTempCellValue(initialValue);
  };

  const cancelInlineEdit = () => {
    setEditingCell(null);
    setTempCellValue('');
  };

  const saveInlineEdit = async (id, field) => {
    const targetValue = Number(tempCellValue);
    if (isNaN(targetValue) || targetValue < 0) {
      setError('Invalid numeric input');
      cancelInlineEdit();
      return;
    }

    setInlineSavingId(id);
    try {
      const config = getConfig();
      if (!config) return;

      const originalProduct = products.find(p => p._id === id);
      const submitData = { ...originalProduct, [field]: targetValue };

      await axios.put(`${API_URL}/products/${id}`, submitData, config);
      setProducts(prev => prev.map(p => p._id === id ? { ...p, [field]: targetValue } : p));
      showSuccessMsg(`Successfully updated ${field}!`);
    } catch (err) {
      setError('Failed to apply inline edit.');
    } finally {
      setInlineSavingId(null);
      cancelInlineEdit();
    }
  };

  // 📸 1. SINGLE COVER IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const token = getToken();
      if (!token) {
        setError('Admin token missing. Please re-login.');
        return;
      }

      const fd = new FormData();
      fd.append('image', file);

      const { data } = await axios.post(`${API_URL}/upload`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
      showSuccessMsg('Cover image uploaded to Cloudinary!');
    } catch (err) {
      console.error('Cover Upload Error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`Cover Upload Failed: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  // 📸 2. MULTIPLE ANGLE IMAGES UPLOAD
  const handleAnglesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (formData.images.length + files.length > 6) {
      setError('Maximum 6 additional images allowed per product.');
      return;
    }

    setUploadingAngles(true);
    setError('');
    const token = getToken();

    if (!token) {
      setError('Admin token missing.');
      setUploadingAngles(false);
      return;
    }

    const uploadedUrls = [];
    try {
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          setError('One or more images exceeded 10MB and were skipped.');
          continue;
        }
        const fd = new FormData();
        fd.append('image', file);

        const { data } = await axios.post(`${API_URL}/upload`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (data.imageUrl) uploadedUrls.push(data.imageUrl);
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      showSuccessMsg(`${uploadedUrls.length} angle image(s) uploaded successfully!`);
    } catch (err) {
      console.error('Angles Upload Error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`Angle Upload Failed: ${msg}`);
    } finally {
      setUploadingAngles(false);
      e.target.value = '';
    }
  };

  const handleRemoveAngle = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleAddManualAngle = () => {
    if (!manualAngleUrl.trim()) return;
    if (formData.images.length >= 6) {
      setError('Maximum 6 additional images allowed.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, manualAngleUrl.trim()]
    }));
    setManualAngleUrl('');
  };

  // SUBMIT PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const config = getConfig();
      if (!config) return;

      const submitData = {
        ...formData,
        price:    Number(formData.price),
        stock:    Number(formData.stock),
        discount: Number(formData.discount) || 0,
        offerEnds: formData.offerEnds || null,
        images:   formData.images || []
      };

      if (editProduct) {
        await axios.put(`${API_URL}/products/${editProduct._id}`, submitData, config);
        showSuccessMsg('Product updated successfully!');
      } else {
        await axios.post(`${API_URL}/products`, submitData, config);
        showSuccessMsg('Product added successfully!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Submit Product Error:', err.response?.data || err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => { window.location.href = '/admin/login'; }, 2000);
      } else {
        const serverError =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Failed to save product';
        setError(serverError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const config = getConfig();
      if (!config) return;
      await axios.delete(`${API_URL}/products/${deleteId}`, config);
      showSuccessMsg('Product deleted!');
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
      setDeleteId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;

    setIsBulkDeleting(true);
    setError('');
    try {
      const config = getConfig();
      if (!config) return;

      for (const id of selectedIds) {
        await axios.delete(`${API_URL}/products/${id}`, config);
      }

      showSuccessMsg(`Successfully deleted ${selectedIds.length} products!`);
      setSelectedIds([]);
      fetchProducts();
    } catch (err) {
      setError('Some products failed to delete. Check server logs.');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p._id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  // CSV EXPORT
  const handleExportCsv = () => {
    if (products.length === 0) return;

    const headers = 'name,brand,price,stock,category,condition,grade,description,imageUrl,isFeatured,isTopPick,isBestSelling,isNewArrival,isDealOfDay\n';
    const rows = products.map(p => {
      return `"${p.name.replace(/"/g, '""')}",` +
             `"${(p.brand || '').replace(/"/g, '""')}",` +
             `${p.price},` +
             `${p.stock},` +
             `"${p.category}",` +
             `"${p.condition}",` +
             `"${p.grade}",` +
             `"${(p.description || '').replace(/"/g, '""')}",` +
             `"${p.imageUrl || ''}",` +
             `${p.isFeatured},` +
             `${p.isTopPick},` +
             `${p.isBestSelling},` +
             `${p.isNewArrival},` +
             `${p.isDealOfDay}`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `75Tech_Inventory_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV TEMPLATE
  const downloadCsvTemplate = () => {
    const headers = 'name,brand,price,stock,category,condition,grade,description,imageUrl,isFeatured,isTopPick,isBestSelling,isNewArrival,isDealOfDay\n';
    const example = '"Playstation 5 Console","Sony",720000,15,"Consoles","Brand New","N/A","1TB Slim edition details...","https://res.cloudinary.com/example/img.jpg",true,true,false,false,false\n';
    const blob = new Blob([headers + example], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "75tech_bulk_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV IMPORT
  const handleCsvImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length <= 1) {
        setError('CSV file is empty or missing data rows.');
        return;
      }

      const headers = lines[0].split(',').map(h => h.replace(/['"]+/g, '').trim());
      const rawRows = lines.slice(1);

      setCsvUploadProgress({ current: 0, total: rawRows.length, logs: ['Processing CSV upload...'] });
      const config = getConfig();
      if (!config) return;

      let successCount = 0, failCount = 0;

      for (let i = 0; i < rawRows.length; i++) {
        const match = rawRows[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!match) continue;

        const cells = match.map(c => c.replace(/^["']|["']$/g, '').trim());
        const pObj = {};
        headers.forEach((header, idx) => {
          let val = cells[idx] || '';
          if (val.toLowerCase() === 'true') val = true;
          if (val.toLowerCase() === 'false') val = false;
          pObj[header] = val;
        });

        const formattedPayload = {
          name: pObj.name || 'Unnamed Item',
          brand: pObj.brand || 'Generic',
          price: Number(pObj.price) || 0,
          stock: Number(pObj.stock) || 0,
          category: pObj.category || 'Other',
          condition: pObj.condition || 'Brand New',
          grade: pObj.grade || 'N/A',
          description: pObj.description || 'No description.',
          imageUrl: pObj.imageUrl || '',
          isFeatured: !!pObj.isFeatured,
          isTopPick: !!pObj.isTopPick,
          isBestSelling: !!pObj.isBestSelling,
          isNewArrival: !!pObj.isNewArrival,
          isDealOfDay: !!pObj.isDealOfDay,
        };

        try {
          await axios.post(`${API_URL}/products`, formattedPayload, config);
          successCount++;
          setCsvUploadProgress(prev => ({
            ...prev,
            current: i + 1,
            logs: [...prev.logs, `✅ Success: "${formattedPayload.name}" added.`]
          }));
        } catch (err) {
          failCount++;
          setCsvUploadProgress(prev => ({
            ...prev,
            current: i + 1,
            logs: [...prev.logs, `❌ Failed: "${formattedPayload.name}"`]
          }));
        }
      }

      showSuccessMsg(`Import completed: ${successCount} added, ${failCount} failed.`);
      fetchProducts();
      setTimeout(() => setCsvUploadProgress(null), 5000);
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  const showSuccessMsg = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 4000);
  };

  const conditionColor = {
    'Brand New':   'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
    'UK Used':     'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
    'GoodDeals':   'bg-purple-50 text-purple-700 ring-1 ring-purple-100',
  };

  const gradeColor = {
    'Grade A': 'bg-emerald-500 text-white',
    'Grade B': 'bg-amber-500 text-white',
    'Grade C': 'bg-orange-500 text-white',
  };

  const getProductTags = (product) => {
    const tags = [];
    if (product.isTopPick)     tags.push({ label: 'Top Pick',     color: 'bg-purple-50 text-purple-600 border border-purple-100' });
    if (product.isBestSelling) tags.push({ label: 'Best Selling', color: 'bg-orange-50 text-orange-600 border border-orange-100' });
    if (product.isNewArrival)  tags.push({ label: 'New',          color: 'bg-green-50 text-green-600 border border-green-100'   });
    if (product.isDealOfDay)   tags.push({ label: 'Deal',         color: 'bg-red-50 text-red-600 border border-red-100'       });
    if (product.isFeatured)    tags.push({ label: 'Featured',     color: 'bg-yellow-50 text-yellow-600 border border-yellow-100' });
    return tags;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Package className="text-blue-600" />
            Product Catalog
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your catalog, upload multi-angle photos, run promotions, and control pricing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={products.length === 0}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            <Download size={14} />
            Export CSV
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 rounded-xl shadow-sm transition cursor-pointer"
          >
            <Upload size={14} />
            Bulk Import CSV
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCsvImport}
            accept=".csv"
            className="hidden"
          />

          <button onClick={handleAddNew}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5
              rounded-xl font-bold text-xs shadow-md shadow-blue-500/10 transition flex items-center gap-2 cursor-pointer">
            <Plus size={14} /> Add Single Product
          </button>
        </div>
      </div>

      {/* CSV Progress */}
      {csvUploadProgress && (
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-blue-700 flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin" />
              Batch Import ({csvUploadProgress.current} / {csvUploadProgress.total})
            </span>
            <span className="text-gray-400">
              {Math.round((csvUploadProgress.current / csvUploadProgress.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(csvUploadProgress.current / csvUploadProgress.total) * 100}%` }} />
          </div>
          <div className="h-20 overflow-y-auto bg-gray-50 rounded-xl p-3 font-mono text-[10px] text-gray-500 space-y-1">
            {csvUploadProgress.logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm">
          <Check size={14} /> {success}
        </div>
      )}
      {error && !showModal && (
        <div className="bg-red-50 border border-red-100 text-red-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm">
          <X size={14} /> {error}
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={15} /></span>
          <input
            type="text"
            placeholder="Search catalog products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-100 bg-gray-50/50 rounded-xl text-xs outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 transition">
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={downloadCsvTemplate}
            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer"
          >
            <HelpCircle size={13} />
            Download CSV Template
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-pulse">
          <span className="text-xs font-bold text-red-800">
            🚨 Selected {selectedIds.length} Product(s)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 bg-white border border-red-200 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-500/10 transition disabled:opacity-50 cursor-pointer"
            >
              {isBulkDeleting ? 'Deleting...' : 'Delete Selected'}
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && products.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] tracking-wider uppercase font-bold text-gray-400">
                  <th className="px-5 py-3.5 text-left w-12">
                    <input
                      type="checkbox"
                      checked={products.length > 0 && selectedIds.length === products.length}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer w-4 h-4"
                    />
                  </th>
                  <th className="px-5 py-3.5 text-left">Image</th>
                  <th className="px-5 py-3.5 text-left">Details</th>
                  <th className="px-5 py-3.5 text-left">Category</th>
                  <th className="px-5 py-3.5 text-left">Condition</th>
                  <th className="px-5 py-3.5 text-left">Brand</th>
                  <th className="px-5 py-3.5 text-left">Price (₦)</th>
                  <th className="px-5 py-3.5 text-left">Stock</th>
                  <th className="px-5 py-3.5 text-left">Views</th>
                  <th className="px-5 py-3.5 text-left">Badges</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center py-20 text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl">📦</span>
                        <p className="font-extrabold text-gray-900 text-sm">No products found</p>
                      </div>
                    </td>
                  </tr>
                ) : products.map(product => {
                  const isInlineEditingPrice = editingCell?.id === product._id && editingCell?.field === 'price';
                  const isInlineEditingStock = editingCell?.id === product._id && editingCell?.field === 'stock';

                  return (
                    <tr key={product._id} className={`hover:bg-gray-50/50 transition ${
                      selectedIds.includes(product._id) ? 'bg-blue-50/20' : ''
                    }`}>
                      <td className="px-5 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(product._id)}
                          onChange={() => toggleSelectRow(product._id)}
                          className="rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer w-4 h-4"
                        />
                      </td>

                      <td className="px-5 py-4">
                        <img
                          src={product.imageUrl || 'https://via.placeholder.com/48'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-xl border border-gray-100 bg-gray-50"
                        />
                      </td>

                      <td className="px-5 py-4 max-w-xs sm:max-w-sm">
                        <p className="font-extrabold text-gray-900 text-xs sm:text-sm">{product.name}</p>
                        <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5 line-clamp-1">{product.description}</p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md w-fit uppercase tracking-wide ${
                            conditionColor[product.condition] || 'bg-gray-100 text-gray-600'
                          }`}>
                            {product.condition || 'Brand New'}
                          </span>
                          {product.condition === 'UK Used' && product.grade && product.grade !== 'N/A' && (
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md w-fit uppercase ${
                              gradeColor[product.grade] || 'bg-gray-400 text-white'
                            }`}>
                              {product.grade}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs font-semibold text-gray-500">{product.brand || '—'}</td>

                      <td className="px-5 py-4" onDoubleClick={() => startInlineEdit(product._id, 'price', product.price)}>
                        {inlineSavingId === product._id ? (
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : isInlineEditingPrice ? (
                          <div className="flex items-center gap-1.5 bg-white border border-blue-400 p-1.5 rounded-lg w-28">
                            <span className="text-xs text-gray-400">₦</span>
                            <input type="number" value={tempCellValue}
                              onChange={(e) => setTempCellValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveInlineEdit(product._id, 'price');
                                if (e.key === 'Escape') cancelInlineEdit();
                              }}
                              className="w-full text-xs outline-none bg-transparent font-bold text-gray-900" autoFocus />
                            <button onClick={() => saveInlineEdit(product._id, 'price')} className="text-green-600"><Check size={12} /></button>
                            <button onClick={cancelInlineEdit} className="text-red-500"><X size={12} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 group cursor-pointer hover:bg-gray-100/50 p-1 rounded-md w-fit">
                            <span className="font-extrabold text-gray-900 text-xs sm:text-sm">
                              ₦{Number(product.price).toLocaleString()}
                            </span>
                            {product.discount > 0 && (
                              <span className="text-rose-600 text-[10px] font-bold bg-rose-50 px-1 rounded">
                                -₦{Number(product.discount).toLocaleString()}
                              </span>
                            )}
                            <Edit size={10} className="text-blue-500 opacity-0 group-hover:opacity-100 transition" />
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4" onDoubleClick={() => startInlineEdit(product._id, 'stock', product.stock)}>
                        {inlineSavingId === product._id ? (
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : isInlineEditingStock ? (
                          <div className="flex items-center gap-1 bg-white border border-blue-400 p-1 rounded-lg w-20">
                            <input type="number" value={tempCellValue}
                              onChange={(e) => setTempCellValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveInlineEdit(product._id, 'stock');
                                if (e.key === 'Escape') cancelInlineEdit();
                              }}
                              className="w-full text-xs outline-none bg-transparent text-center font-bold text-gray-900" autoFocus />
                            <button onClick={() => saveInlineEdit(product._id, 'stock')} className="text-green-600"><Check size={12} /></button>
                            <button onClick={cancelInlineEdit} className="text-red-500"><X size={12} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 group cursor-pointer hover:bg-gray-100/50 p-1 rounded-md w-fit">
                            {product.stock > 0 ? (
                              <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                                {product.stock} items
                              </span>
                            ) : (
                              <span className="bg-rose-50 text-rose-700 text-[11px] font-bold px-2 py-0.5 rounded-md animate-pulse">
                                Out of Stock
                              </span>
                            )}
                            <Edit size={10} className="text-blue-500 opacity-0 group-hover:opacity-100 transition" />
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-extrabold text-xs px-2.5 py-1 rounded-md">
                          <ImageIcon size={12} />
                          {1 + (product.images?.length || 0)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {getProductTags(product).map((tag, i) => (
                            <span key={i} className={`${tag.color} text-[10px] font-extrabold px-2 py-0.5 rounded-full`}>
                              {tag.label}
                            </span>
                          ))}
                          {getProductTags(product).length === 0 && (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => setDeleteId(product._id)}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3.5 py-1.5 bg-white rounded-xl border border-gray-200 text-xs font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition cursor-pointer"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                currentPage === page
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10 scale-105'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white'
              }`}>
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3.5 py-1.5 bg-white rounded-xl border border-gray-200 text-xs font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                {editProduct ? <Edit className="text-amber-500" /> : <Package className="text-blue-500" />}
                {editProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-650 text-xl font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Name + Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="name" value={formData.name}
                    onChange={handleChange} required placeholder="e.g. iPhone 13 Pro"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="brand" value={formData.brand}
                    onChange={handleChange} required placeholder="e.g. Apple"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-all" />
                </div>
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Price (₦) <span className="text-red-500">*</span>
                  </label>
                  <input type="number" name="price" value={formData.price}
                    onChange={handleChange} required min="0" placeholder="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input type="number" name="stock" value={formData.stock}
                    onChange={handleChange} required min="0" placeholder="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-all" />
                </div>
              </div>

              {/* Category + Image Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select name="category" value={formData.category}
                    onChange={handleChange} required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-all bg-white font-semibold">
                    <option value="">Select</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Image Display Size
                  </label>
                  <select name="imageSize" value={formData.imageSize}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-all bg-white font-semibold">
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>

              {/* Condition + Grade */}
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3">
                  🏷️ Product Condition
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                      Condition <span className="text-red-500">*</span>
                    </label>
                    <select name="condition" value={formData.condition}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-amber-500 bg-white font-semibold">
                      {conditions.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className={formData.condition === 'UK Used' ? 'opacity-100' : 'opacity-40 pointer-events-none'}>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                      Grade {formData.condition === 'UK Used' && <span className="text-red-500">*</span>}
                    </label>
                    <select name="grade" value={formData.grade}
                      onChange={handleChange}
                      disabled={formData.condition !== 'UK Used'}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-amber-500 bg-white disabled:bg-gray-100 font-semibold">
                      {grades.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Discount + Offer Ends */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Discount (₦)</label>
                  <input type="number" name="discount" value={formData.discount}
                    onChange={handleChange} min="0" placeholder="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Offer Ends</label>
                  <input type="datetime-local" name="offerEnds"
                    value={formData.offerEnds} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-all font-semibold" />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase">Main Cover Image</label>
                <div className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl p-5 text-center cursor-pointer transition">
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <span className="text-2xl">📸</span>
                    <span className="text-xs font-bold text-gray-700">Click to upload cover to Cloudinary</span>
                    <span className="text-[10px] text-gray-400">JPG, PNG, WEBP (Max 10MB)</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                  {uploading && (
                    <div className="flex items-center justify-center gap-2 mt-3 text-xs text-blue-600 font-bold">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </div>
                  )}
                </div>

                <input type="text" name="imageUrl" value={formData.imageUrl}
                  onChange={handleChange} placeholder="Or paste Cloudinary URL..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-all" />

                {formData.imageUrl && (
                  <div className="mt-3 flex items-center gap-3 bg-gray-50 border border-gray-100 p-3 rounded-2xl">
                    <img src={formData.imageUrl} alt="Preview"
                      className="w-16 h-16 object-cover rounded-xl border border-gray-200 bg-white"
                      onError={(e) => e.target.style.display = 'none'} />
                    <div>
                      <p className="text-xs font-extrabold text-gray-800">Cover Image Set</p>
                      <button type="button"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="text-xs font-bold text-red-500 hover:text-red-700 mt-1 cursor-pointer">
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Multiple Angle Images Upload */}
              <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-blue-900 uppercase">
                    Additional Angles (eBay-Style Gallery)
                  </label>
                  <span className="text-[10px] font-bold text-blue-600">
                    {formData.images?.length || 0} of 6
                  </span>
                </div>

                <div className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-white rounded-xl p-4 text-center cursor-pointer transition">
                  <label className="cursor-pointer flex flex-col items-center gap-1.5">
                    <span className="text-2xl">🖼️</span>
                    <span className="text-xs font-bold text-gray-700">Upload multiple side/angle photos</span>
                    <span className="text-[10px] text-gray-400">Select multiple files (Front, Back, Ports)</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleAnglesUpload}
                      className="hidden"
                      disabled={uploadingAngles || (formData.images?.length || 0) >= 6}
                    />
                  </label>
                  {uploadingAngles && (
                    <div className="flex items-center justify-center gap-2 mt-2 text-xs text-blue-600 font-bold">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Uploading angles...
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Or paste angle image URL..."
                    value={manualAngleUrl}
                    onChange={(e) => setManualAngleUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualAngle}
                    disabled={!manualAngleUrl.trim() || (formData.images?.length || 0) >= 6}
                    className="bg-blue-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition disabled:opacity-40 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {formData.images?.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                    {formData.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white">
                        <img
                          src={imgUrl}
                          alt={`Angle ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1 rounded">
                          #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAngle(idx)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition shadow-sm cursor-pointer"
                          title="Delete Angle"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea name="description" value={formData.description}
                  onChange={handleChange} required rows={3}
                  placeholder="Product specifications, box items, etc..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-all resize-none" />
              </div>

              {/* Display Tags */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                  📌 Storefront Placements
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: 'isFeatured',    label: '⭐ Featured',     accent: 'accent-yellow-500' },
                    { name: 'isTopPick',     label: '🏆 Top Pick',     accent: 'accent-purple-500' },
                    { name: 'isBestSelling', label: '🔥 Best Selling', accent: 'accent-orange-500' },
                    { name: 'isNewArrival',  label: '🆕 New Arrival',  accent: 'accent-green-500'  },
                    { name: 'isDealOfDay',   label: '💰 Deal of Day',  accent: 'accent-red-500'    },
                  ].map(tag => (
                    <label key={tag.name}
                      className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-xl border border-gray-100 hover:border-blue-100 transition shadow-sm">
                      <input type="checkbox" name={tag.name}
                        checked={formData[tag.name]} onChange={handleChange}
                        className={`w-4 h-4 rounded-md cursor-pointer ${tag.accent}`} />
                      <span className="text-xs font-bold text-gray-700">{tag.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                  <X size={14} /> {error}
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={submitting || uploading || uploadingAngles}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/10">
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : editProduct ? 'Update Product' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl mx-auto">🗑️</div>
              <h3 className="text-base font-extrabold text-gray-900">Confirm Deletion</h3>
              <p className="text-xs text-gray-400">This action is permanent.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-500/10 transition cursor-pointer">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;