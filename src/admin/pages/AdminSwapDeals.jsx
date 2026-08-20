// src/admin/pages/AdminSwapDeals.jsx
import React, { useState, useEffect } from 'react'
import {
  FiRefreshCw, FiSearch, FiChevronDown, FiCheck,
  FiX, FiLoader, FiSave, FiEdit2, FiTrash2,
  FiAlertCircle, FiExternalLink,
} from 'react-icons/fi'
import { FaExchangeAlt } from 'react-icons/fa'
import axios from 'axios' // ✅ back to axios

// ✅ Hardcoded - no .env confusion
const API_URL = 'http://localhost:5000/api'

const statusConfig = {
  'Pending Review':   { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  'Under Assessment': { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
  'Offer Made':       { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  'Offer Accepted':   { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500'  },
  'Offer Declined':   { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500'    },
  'Swap Completed':   { bg: 'bg-teal-100',   text: 'text-teal-700',   dot: 'bg-teal-500'   },
  'Cancelled':        { bg: 'bg-gray-100',   text: 'text-gray-700',   dot: 'bg-gray-500'   },
}

const conditionColor = {
  Excellent: 'bg-green-100 text-green-700',
  Good:      'bg-blue-100 text-blue-700',
  Fair:      'bg-yellow-100 text-yellow-700',
  Poor:      'bg-red-100 text-red-700',
}

const AdminSwapDeals = () => {
  const [swaps, setSwaps]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [successMsg, setSuccessMsg]     = useState('')
  const [searchTerm, setSearchTerm]     = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [editingId, setEditingId]       = useState(null)
  const [editData, setEditData]         = useState({})
  const [saving, setSaving]             = useState(false)
  const [deleteId, setDeleteId]         = useState(null)
  const [viewMedia, setViewMedia]       = useState(null)

  // ✅ Auth header helper
  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
  })

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const fetchSwaps = async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await axios.get(`${API_URL}/swap`, authHeader()) // ✅ fixed
      if (data.success) setSwaps(data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load swap deals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSwaps() }, [])

  const startEdit = (swap) => {
    setEditingId(swap._id)
    setEditData({
      status:       swap.status,
      offeredValue: swap.offeredValue || '',
      adminNotes:   swap.adminNotes   || '',
      assessedBy:   swap.assessedBy   || '',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleSave = async (id) => {
    try {
      setSaving(true)
      const { data } = await axios.put(
        `${API_URL}/swap/${id}`,
        editData,
        authHeader() // ✅ fixed
      )
      if (data.success) {
        setSwaps(prev => prev.map(s => s._id === id ? { ...s, ...data.data } : s))
        setEditingId(null)
        showSuccess('Swap deal updated!')
      }
    } catch (err) {
      setError('Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await axios.delete(`${API_URL}/swap/${deleteId}`, authHeader()) // ✅ fixed
      setSwaps(prev => prev.filter(s => s._id !== deleteId))
      setDeleteId(null)
      showSuccess('Swap deal deleted!')
    } catch (err) {
      setError('Failed to delete')
    }
  }

  const filtered = swaps.filter(s => {
    const q = searchTerm.toLowerCase()
    const matchSearch =
      s.swapId?.toLowerCase().includes(q) ||
      s.customerName?.toLowerCase().includes(q) ||
      s.customerPhone?.includes(q) ||
      s.deviceBrand?.toLowerCase().includes(q) ||
      s.deviceModel?.toLowerCase().includes(q)
    const matchStatus = filterStatus === 'All' || s.status === filterStatus
    return matchSearch && matchStatus
  })

  const stats = {
    total:     swaps.length,
    pending:   swaps.filter(s => s.status === 'Pending Review').length,
    offerMade: swaps.filter(s => s.status === 'Offer Made').length,
    completed: swaps.filter(s => s.status === 'Swap Completed').length,
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-NG', {
      day: 'numeric', month: 'short', year: 'numeric',
    })

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
              <FaExchangeAlt size={20} />
            </div>
            Swap Deals
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage device swap deal requests</p>
        </div>
        <button onClick={fetchSwaps}
          className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition shadow-sm">
          <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
          <FiCheck size={16} /> {successMsg}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
          <FiAlertCircle size={16} /> {error}
          <button onClick={() => setError('')} className="ml-auto">
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',      value: stats.total,     color: 'orange' },
          { label: 'Pending',    value: stats.pending,   color: 'yellow' },
          { label: 'Offer Made', value: stats.offerMade, color: 'purple' },
          { label: 'Completed',  value: stats.completed, color: 'green'  },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold text-${s.color}-600 mt-0.5`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search by ID, name, phone, device..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div className="relative">
          <select value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white min-w-[180px]">
            <option value="All">All Status</option>
            {Object.keys(statusConfig).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <FiLoader size={32} className="animate-spin text-orange-500" />
        </div>
      )}

      {/* No results */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <FaExchangeAlt size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold">No swap deals found</p>
          <p className="text-gray-500 text-sm mt-1">Swap deal requests will appear here</p>
        </div>
      )}

      {/* Swap Cards */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((swap) => {
            const isEditing = editingId === swap._id
            const sc = statusConfig[swap.status] || statusConfig['Pending Review']

            return (
              <div key={swap._id} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                isEditing ? 'border-orange-300 shadow-orange-100' : 'border-gray-100'
              }`}>

                {/* Top bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-gray-50 gap-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg font-mono font-bold text-sm">
                      {swap.swapId}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{swap.customerName}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <a href={`https://wa.me/${swap.customerPhone?.replace(/^0/, '234')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="hover:text-green-600 transition">
                          📱 {swap.customerPhone}
                        </a>
                        {swap.customerEmail && <span>✉️ {swap.customerEmail}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {swap.status}
                    </span>

                    {!isEditing ? (
                      <button onClick={() => startEdit(swap)}
                        className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-orange-100 transition">
                        <FiEdit2 size={13} /> Manage
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => handleSave(swap._id)} disabled={saving}
                          className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-100 transition disabled:opacity-50">
                          {saving ? <FiLoader size={13} className="animate-spin" /> : <FiSave size={13} />}
                          Save
                        </button>
                        <button onClick={cancelEdit}
                          className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200 transition">
                          <FiX size={13} /> Cancel
                        </button>
                      </div>
                    )}

                    <button onClick={() => setDeleteId(swap._id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Device Details */}
                <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Their Device', value: `${swap.deviceBrand} ${swap.deviceModel}` },
                    { label: 'Storage',      value: swap.deviceStorage },
                    { label: 'Wants',        value: `${swap.wantedBrand}${swap.wantedModel ? ` ${swap.wantedModel}` : ''}` },
                    { label: 'Submitted',    value: formatDate(swap.createdAt) },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-0.5">{item.label}</p>
                      <p className="text-gray-900 font-medium text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Condition + Battery + Repairs */}
                <div className="px-5 pb-4 flex flex-wrap gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${conditionColor[swap.deviceCondition] || 'bg-gray-100 text-gray-600'}`}>
                    {swap.deviceCondition}
                  </span>
                  {swap.deviceBrand === 'iPhone' && swap.batteryHealth && (
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      🔋 Battery: {swap.batteryHealth}
                    </span>
                  )}
                  {swap.hasRepairs && (
                    <span className="bg-orange-50 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      🔧 Has Repairs
                    </span>
                  )}
                  {swap.hasChangedParts && (
                    <span className="bg-yellow-50 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      ⚙️ Changed Parts
                    </span>
                  )}
                  {swap.wantedStorage && (
                    <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      Wants: {swap.wantedStorage}
                    </span>
                  )}
                </div>

                {/* Repair/Parts details */}
                {(swap.repairDetails || swap.changedPartsDetails) && (
                  <div className="px-5 pb-4">
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                      {swap.repairDetails && (
                        <p className="text-xs text-yellow-800 mb-1">
                          <strong>Repairs:</strong> {swap.repairDetails}
                        </p>
                      )}
                      {swap.changedPartsDetails && (
                        <p className="text-xs text-yellow-800">
                          <strong>Changed Parts:</strong> {swap.changedPartsDetails}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Media */}
                {swap.mediaUrls?.length > 0 && (
                  <div className="px-5 pb-4">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                      Photos ({swap.mediaUrls.length})
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {swap.mediaUrls.map((url, i) => (
                        <button key={i} onClick={() => setViewMedia(url)} className="relative group">
                          <img src={url} alt={`Media ${i + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <FiExternalLink size={14} className="text-white drop-shadow" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Existing offer/notes */}
                {(swap.offeredValue || swap.adminNotes) && !isEditing && (
                  <div className="px-5 pb-4">
                    <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                      {swap.offeredValue && (
                        <p className="text-sm font-bold text-green-800 mb-1">
                          💰 Offered Value: {swap.offeredValue}
                        </p>
                      )}
                      {swap.assessedBy && (
                        <p className="text-xs text-green-700 mb-1">Assessed by: {swap.assessedBy}</p>
                      )}
                      {swap.adminNotes && (
                        <p className="text-xs text-green-700">Notes: {swap.adminNotes}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Edit Panel */}
                {isEditing && (
                  <div className="bg-orange-50/50 border-t border-orange-100 p-5">
                    <p className="text-xs text-orange-700 font-semibold uppercase tracking-wider mb-4">
                      ✏️ Manage Swap Deal
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Status</label>
                        <select value={editData.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-orange-500 bg-white">
                          {Object.keys(statusConfig).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Offered Value</label>
                        <input type="text" value={editData.offeredValue}
                          onChange={(e) => setEditData({ ...editData, offeredValue: e.target.value })}
                          placeholder="e.g. ₦150,000"
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-orange-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Assessed By</label>
                        <input type="text" value={editData.assessedBy}
                          onChange={(e) => setEditData({ ...editData, assessedBy: e.target.value })}
                          placeholder="Staff name..."
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-orange-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Admin Notes</label>
                        <input type="text" value={editData.adminNotes}
                          onChange={(e) => setEditData({ ...editData, adminNotes: e.target.value })}
                          placeholder="Internal notes..."
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-orange-500" />
                      </div>
                    </div>

                    {/* Quick contact */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a href={`https://wa.me/${swap.customerPhone?.replace(/^0/, '234')}?text=${encodeURIComponent(
                        `Hello ${swap.customerName}, this is 75TechStore. Regarding your swap request (${swap.swapId}) for your ${swap.deviceBrand} ${swap.deviceModel}.${editData.offeredValue ? ` We'd like to offer you ${editData.offeredValue} for your device.` : ' We have reviewed your swap request and would like to discuss further.'}`
                      )}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition">
                        📱 WhatsApp Customer
                      </a>
                      <a href={`tel:${swap.customerPhone}`}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition">
                        📞 Call Customer
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Media Viewer Modal */}
      {viewMedia && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setViewMedia(null)}>
          <div className="relative max-w-2xl w-full">
            <img src={viewMedia} alt="Device photo"
              className="w-full rounded-2xl object-contain max-h-[80vh]" />
            <button onClick={() => setViewMedia(null)}
              className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition">
              <FiX size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Swap Deal?</h3>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                Cancel
              </button>
              <button onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSwapDeals