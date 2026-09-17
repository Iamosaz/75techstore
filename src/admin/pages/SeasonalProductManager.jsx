// src/admin/pages/SeasonalProductManager.jsx
import React, { useState, useEffect } from "react";
import { FiUploadCloud, FiTrash2, FiEdit2, FiCheck, FiPlus, FiBox } from "react-icons/fi";

const CATEGORIES = [
  "Smartphones",
  "Laptops & MacBooks",
  "Audio & Headphones",
  "Smartwatches",
  "Gaming Consoles & Accessories",
  "Tablets & iPads",
  "Cameras & Drones",
  "Powerbanks & Chargers",
  "Computer Accessories",
];

const SEASONS = [
  { id: "all", label: "🌟 All Seasons / Ongoing" },
  { id: "christmas", label: "🎄 Christmas & New Year" },
  { id: "blackfriday", label: "🔥 Black Friday" },
  { id: "valentine", label: "💝 Valentine's Day" },
  { id: "eid", label: "🌙 Eid Mubarak / Ramadan" },
  { id: "nigeria", label: "🇳🇬 Naija Independence & Democracy" },
  { id: "harmattan", label: "🌬️ Harmattan Dry Season" },
  { id: "rainy", label: "☔ Rainy Season" },
  { id: "summer", label: "☀️ Summer Deals" },
  { id: "easter", label: "🐣 Easter Sale" },
];

export default function SeasonalProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [originalPrice, setOriginalPrice] = useState("");
  const [dealPrice, setDealPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [seasonTag, setSeasonTag] = useState("all");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [manualUrl, setManualUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch gadgets from MongoDB
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/seasonal-products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ☁️ Direct Cloudinary Upload
  const handleCloudinaryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset";

    setUploadingImage(true);
    const uploaded = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );
        if (res.ok) {
          const data = await res.json();
          uploaded.push(data.secure_url);
        }
      } catch (err) {
        console.error("Cloudinary upload failed", err);
      }
    }

    setImageUrls((prev) => [...prev, ...uploaded]);
    setUploadingImage(false);
  };

  const handleAddManualUrl = () => {
    if (manualUrl.trim()) {
      setImageUrls((prev) => [...prev, manualUrl.trim()]);
      setManualUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName("");
    setBrand("");
    setCategory(CATEGORIES[0]);
    setOriginalPrice("");
    setDealPrice("");
    setStock("10");
    setSeasonTag("all");
    setDescription("");
    setImageUrls([]);
    setEditingId(null);
  };

  // Submit / Edit Gadget
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageUrls.length === 0) {
      alert("Please upload or paste at least one Cloudinary image URL.");
      return;
    }

    setSubmitting(true);
    const payload = {
      name,
      brand,
      category,
      originalPrice: Number(originalPrice),
      dealPrice: Number(dealPrice),
      stock: Number(stock),
      seasonTag,
      description,
      images: imageUrls,
    };

    try {
      const url = editingId ? `/api/seasonal-products/${editingId}` : "/api/seasonal-products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatusMessage({
          type: "success",
          text: editingId ? "✅ Gadget updated successfully!" : "🚀 Seasonal gadget uploaded to live shop!",
        });
        resetForm();
        fetchProducts();
      } else {
        setStatusMessage({ type: "error", text: "❌ Failed to save gadget deal." });
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "❌ Network error." });
    } finally {
      setSubmitting(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setName(p.name);
    setBrand(p.brand || "");
    setCategory(p.category);
    setOriginalPrice(p.originalPrice);
    setDealPrice(p.dealPrice);
    setStock(p.stock);
    setSeasonTag(p.seasonTag || "all");
    setDescription(p.description || "");
    setImageUrls(p.images || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this gadget from seasonal offers?")) return;
    try {
      const res = await fetch(`/api/seasonal-products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
            📦 Seasonal Gadget Deal Inventory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload and manage devices with real-time Cloudinary imagery for the dedicated Seasonal Shop.
          </p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full self-start">
          {products.length} Deals Live in Database
        </span>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold border ${
            statusMessage.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Grid: Left = Form, Right = Product Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upload Form (5 Cols) */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-5 sticky top-6"
          >
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center justify-between">
              <span>{editingId ? "✏️ Edit Seasonal Gadget" : "⚡ Upload Seasonal Device"}</span>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-gray-400 hover:text-gray-700"
                >
                  Cancel Edit
                </button>
              )}
            </h2>

            {/* Device Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Device Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. iPhone 15 Pro Max 256GB Natural Titanium"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Brand & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Brand</label>
                <input
                  type="text"
                  placeholder="Apple, Samsung, Sony"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing: Original vs Deal */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Regular Price (₦) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="1400000"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Deal Price (₦) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="1150000"
                  value={dealPrice}
                  onChange={(e) => setDealPrice(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-green-700"
                />
              </div>
            </div>

            {/* Calculated Discount Notice */}
            {originalPrice && dealPrice && Number(originalPrice) > Number(dealPrice) && (
              <div className="text-xs text-green-700 font-bold bg-green-50 p-2.5 rounded-lg border border-green-200">
                🎉 Auto Discount: -{Math.round(((originalPrice - dealPrice) / originalPrice) * 100)}% OFF
              </div>
            )}

            {/* Season Assignment & Stock */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Campaign Season</label>
                <select
                  value={seasonTag}
                  onChange={(e) => setSeasonTag(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
                >
                  {SEASONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Available Stock</label>
                <input
                  type="number"
                  placeholder="5"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* ☁️ Cloudinary Gadget Image Section */}
            <div className="space-y-2 border-t pt-3">
              <label className="block text-xs font-bold text-gray-800 uppercase">
                📸 Cloudinary Gadget Images *
              </label>

              {/* Upload to Cloudinary */}
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-4 bg-gray-50 cursor-pointer transition">
                <FiUploadCloud size={24} className="text-gray-400 mb-1" />
                <span className="text-xs font-bold text-gray-700">
                  {uploadingImage ? "Uploading to Cloudinary..." : "Upload Device Images"}
                </span>
                <span className="text-[10px] text-gray-400">Direct upload to your Cloudinary storage</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleCloudinaryUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>

              {/* Or paste manual URL */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or paste Cloudinary URL..."
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddManualUrl}
                  className="bg-gray-800 text-white text-xs px-3 py-2 rounded-xl font-bold hover:bg-gray-700"
                >
                  Add
                </button>
              </div>

              {/* Uploaded Thumbnails Preview */}
              {imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border">
                      <img src={url} alt="gadget" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-0 right-0 bg-red-600 text-white w-4 h-4 flex items-center justify-center text-[10px]"
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
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Description / Key Specs
              </label>
              <textarea
                rows={2}
                placeholder="Battery Health 100%, 1 Year Warranty, Brand New In Box..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-3 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-sm transition shadow disabled:opacity-50"
            >
              {submitting ? "Saving to Database..." : editingId ? "Save Changes" : "🚀 Publish Device to Seasonal Shop"}
            </button>
          </form>
        </div>

        {/* Live Gadgets Table (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FiBox /> Live Database Items
              </h2>
              <button
                onClick={fetchProducts}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Refresh List
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-gray-400">Loading gadgets...</div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <p className="text-3xl">📦</p>
                <p className="font-bold text-gray-700">No seasonal gadgets uploaded yet.</p>
                <p className="text-xs text-gray-400">Use the form on the left to upload your first device.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[750px] overflow-y-auto">
                {products.map((p) => (
                  <div key={p._id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition">
                    <img
                      src={p.images?.[0] || "https://via.placeholder.com/80"}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded-xl border bg-gray-100 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {p.category}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 uppercase">
                          {p.seasonTag}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-gray-900 truncate mt-0.5">{p.name}</h3>

                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="font-black text-gray-900">
                          ₦{p.dealPrice?.toLocaleString()}
                        </span>
                        <span className="line-through text-gray-400 text-[11px]">
                          ₦{p.originalPrice?.toLocaleString()}
                        </span>
                        <span className="text-green-700 font-bold bg-green-50 px-1.5 py-0.5 rounded text-[10px]">
                          -{p.discountPercentage}%
                        </span>
                        <span className="text-gray-400 text-[11px]">Stock: {p.stock}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}