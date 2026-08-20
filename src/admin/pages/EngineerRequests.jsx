// src/admin/pages/EngineerRequests.jsx
import React, { useState, useEffect } from 'react'
import {
  FiTool, FiUser, FiPhone, FiMapPin,
  FiClock, FiCheck, FiX, FiLoader,
  FiChevronDown, FiSearch, FiRefreshCw,
  FiEdit2, FiSave, FiAlertCircle
} from 'react-icons/fi'
import axios from 'axios'

// ✅ Fix - Hardcoded URL
const API_URL = 'http://localhost:5000/api'

const statusConfig = {
  Pending:       { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  Assigned:      { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
  'In Progress': { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  Completed:     { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500'  },
  Cancelled:     { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500'    },
}

const EngineerRequests = () => {
  const [requests, setRequests]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [searchTerm, setSearchTerm]     = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [editingId, setEditingId]       = useState(null)
  const [editData, setEditData]         = useState({})
  const [saving, setSaving]             = useState(false)
  const [successMsg, setSuccessMsg]     = useState('')

  // ✅ Auth header helper
  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
  })

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await axios.get(`${API_URL}/engineer`, authHeader())
      if (data.success) setRequests(data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRequests() }, [])

  const startEdit = (request) => {
    setEditingId(request._id)
    setEditData({
      status:               request.status,
      assignedEngineerName: request.assignedEngineerName || '',
      adminNotes:           request.adminNotes           || '',
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
        `${API_URL}/engineer/${id}`,
        editData,
        authHeader()
      )
      if (data.success) {
        setRequests(prev => prev.map(r => r._id === id ? { ...r, ...data.data } : r))
        setEditingId(null)
        setEditData({})
        setSuccessMsg('Request updated successfully!')
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const filtered = requests.filter(r => {
    const matchesSearch =
      (r.user?.name?.toLowerCase()  || '').includes(searchTerm.toLowerCase()) ||
      (r.user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (r.brand?.toLowerCase()       || '').includes(searchTerm.toLowerCase()) ||
      (r.gadgetType?.toLowerCase()  || '').includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total:      requests.length,
    pending:    requests.filter(r => r.status === 'Pending').length,
    assigned:   requests.filter(r => r.status === 'Assigned').length,
    inProgress: requests.filter(r => r.status === 'In Progress').length,
    completed:  requests.filter(r => r.status === 'Completed').length,
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-NG', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <FiTool size={20} />
            </div>
            Engineer Requests
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and assign engineers to customer requests
          </p>
        </div>
        <button onClick={fetchRequests}
          className="flex items-center gap-2 bg-white border border-gray-200
            px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600
            hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
          <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700
          px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
          <FiCheck size={16} /> {successMsg}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600
          px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
          <FiAlertCircle size={16} /> {error}
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total',       value: stats.total,      color: 'blue'   },
          { label: 'Pending',     value: stats.pending,    color: 'yellow' },
          { label: 'Assigned',    value: stats.assigned,   color: 'indigo' },
          { label: 'In Progress', value: stats.inProgress, color: 'purple' },
          { label: 'Completed',   value: stats.completed,  color: 'green'  },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
            <p className={`text-2xl font-bold text-${stat.color}-600 mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search by customer name, email, brand..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200
              text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div className="relative">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-gray-200
              text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white
              cursor-pointer min-w-[160px]">
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <FiLoader size={32} className="animate-spin text-blue-600" />
            <p className="text-gray-500 text-sm">Loading requests...</p>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTool size={28} className="text-gray-400" />
          </div>
          <h3 className="text-gray-800 font-semibold text-lg mb-1">No engineer requests found</h3>
          <p className="text-gray-500 text-sm">
            {searchTerm || filterStatus !== 'All'
              ? 'Try adjusting your search or filter'
              : 'Requests will appear here when customers submit them'
            }
          </p>
        </div>
      )}

      {/* Requests List */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((request) => {
            const isEditing = editingId === request._id
            const sc = statusConfig[request.status] || statusConfig.Pending

            return (
              <div key={request._id}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden
                  transition-all duration-300 ${
                  isEditing
                    ? 'border-blue-300 shadow-md shadow-blue-100'
                    : 'border-gray-100 hover:border-gray-200'
                }`}>

                {/* Top Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-gray-50 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center
                      justify-center text-white font-bold text-sm shrink-0">
                      {(request.user?.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {request.user?.name || 'Unknown User'}
                      </p>
                      <p className="text-gray-500 text-xs">{request.user?.email || 'No email'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {request.status}
                    </span>

                    {!isEditing ? (
                      <button onClick={() => startEdit(request)}
                        className="flex items-center gap-1.5 bg-blue-50 text-blue-600
                          px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-100 transition">
                        <FiEdit2 size={13} /> Manage
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => handleSave(request._id)} disabled={saving}
                          className="flex items-center gap-1.5 bg-green-50 text-green-600
                            px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-100
                            transition disabled:opacity-50">
                          {saving ? <FiLoader size={13} className="animate-spin" /> : <FiSave size={13} />}
                          Save
                        </button>
                        <button onClick={cancelEdit}
                          className="flex items-center gap-1.5 bg-gray-100 text-gray-600
                            px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200 transition">
                          <FiX size={13} /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Gadget Type</p>
                    <p className="text-gray-900 font-medium text-sm">{request.gadgetType}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Brand / Model</p>
                    <p className="text-gray-900 font-medium text-sm">{request.brand}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <FiPhone size={10} className="text-gray-500" />
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Contact</p>
                    </div>
                    <a href={`https://wa.me/${request.contactNumber?.replace(/^0/, '234')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-blue-600 font-medium text-sm hover:underline">
                      {request.contactNumber}
                    </a>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <FiClock size={10} className="text-gray-500" />
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Submitted</p>
                    </div>
                    <p className="text-gray-900 font-medium text-sm">{formatDate(request.createdAt)}</p>
                  </div>
                </div>

                {/* Issue Description */}
                <div className="px-5 pb-4">
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                    <p className="text-[10px] text-yellow-700 uppercase tracking-wider font-semibold mb-1.5">
                      Issue Description
                    </p>
                    <p className="text-gray-800 text-sm leading-relaxed">{request.issueDescription}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="px-5 pb-4">
                  <div className="flex items-start gap-2">
                    <FiMapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <p className="text-gray-600 text-sm">{request.address}</p>
                  </div>
                </div>

                {/* Edit Panel */}
                {isEditing && (
                  <div className="bg-blue-50/50 border-t border-blue-100 p-5">
                    <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider mb-4">
                      ✏️ Manage This Request
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Status</label>
                        <select value={editData.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                          <option value="Pending">Pending</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Assigned Engineer
                        </label>
                        <input type="text" value={editData.assignedEngineerName}
                          onChange={(e) => setEditData({ ...editData, assignedEngineerName: e.target.value })}
                          placeholder="Enter engineer name..."
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Admin Notes</label>
                        <input type="text" value={editData.adminNotes}
                          onChange={(e) => setEditData({ ...editData, adminNotes: e.target.value })}
                          placeholder="Internal notes..."
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a href={`https://wa.me/${request.contactNumber?.replace(/^0/, '234')}?text=${encodeURIComponent(
                        `Hello ${request.user?.name || 'Customer'}, this is from 75TechStore. Your engineer request for "${request.brand}" has been received. An engineer${editData.assignedEngineerName ? ` (${editData.assignedEngineerName})` : ''} will contact you shortly.`
                      )}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white
                          px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition shadow-sm">
                        📱 Message Customer on WhatsApp
                      </a>
                      <a href={`tel:${request.contactNumber}`}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white
                          px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition shadow-sm">
                        📞 Call Customer
                      </a>
                    </div>

                    {/* Currently assigned */}
                    {request.assignedEngineerName && (
                      <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-500">
                          Currently assigned to:{' '}
                          <span className="text-blue-700 font-bold">{request.assignedEngineerName}</span>
                        </p>
                        {request.adminNotes && (
                          <p className="text-xs text-gray-500 mt-1">
                            Notes: <span className="text-gray-700">{request.adminNotes}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default EngineerRequests