// src/admin/pages/AdminRepairs.jsx
import React, { useState, useEffect } from 'react'
import {
  FiTool, FiSearch, FiRefreshCw, FiEdit2, FiSave,
  FiX, FiLoader, FiChevronDown, FiCheck, FiAlertCircle,
  FiPhone, FiMail, FiCalendar, FiClock, FiMapPin, FiTruck
} from 'react-icons/fi'
import axios from 'axios'

// ✅ Fix - Hardcoded URL
const API_URL = 'http://localhost:5000/api'

const statusConfig = {
  'Booked':            { bg: 'bg-gray-100',   text: 'text-gray-700',   dot: 'bg-gray-500'   },
  'Device Received':   { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
  'Diagnosing':        { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  'Awaiting Parts':    { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  'Repairing':         { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  'Testing':           { bg: 'bg-cyan-100',   text: 'text-cyan-700',   dot: 'bg-cyan-500'   },
  'Ready for Pickup':  { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  'Completed':         { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500'  },
  'Cancelled':         { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500'    },
}

const AdminRepairs = () => {
  const [repairs, setRepairs]           = useState([])
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

  const fetchRepairs = async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await axios.get(`${API_URL}/repairs`, authHeader())
      if (data.success) setRepairs(data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load repairs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRepairs() }, [])

  const startEdit = (repair) => {
    setEditingId(repair._id)
    setEditData({
      status:             repair.status,
      assignedTechnician: repair.assignedTechnician || '',
      diagnosisNotes:     repair.diagnosisNotes     || '',
      estimatedCost:      repair.estimatedCost      || '',
      adminNotes:         repair.adminNotes         || '',
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
        `${API_URL}/repairs/${id}`,
        editData,
        authHeader()
      )
      if (data.success) {
        setRepairs(prev => prev.map(r => r._id === id ? { ...r, ...data.data } : r))
        setEditingId(null)
        setSuccessMsg('Repair updated!')
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const filtered = repairs.filter((r) => {
    const s = searchTerm.toLowerCase()
    const matchSearch =
      r.repairId?.toLowerCase().includes(s)      ||
      r.customerName?.toLowerCase().includes(s)  ||
      r.customerPhone?.includes(s)               ||
      r.deviceBrand?.toLowerCase().includes(s)
    const matchStatus = filterStatus === 'All' || r.status === filterStatus
    return matchSearch && matchStatus
  })

  const stats = {
    total:   repairs.length,
    booked:  repairs.filter(r => r.status === 'Booked').length,
    active:  repairs.filter(r =>
      ['Device Received', 'Diagnosing', 'Repairing', 'Testing'].includes(r.status)
    ).length,
    waiting: repairs.filter(r => r.status === 'Awaiting Parts').length,
    ready:   repairs.filter(r => r.status === 'Ready for Pickup').length,
    done:    repairs.filter(r => r.status === 'Completed').length,
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
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <FiTool size={20} />
            </div>
            Repair Bookings
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage device repair appointments and track progress
          </p>
        </div>
        <button onClick={fetchRepairs}
          className="flex items-center gap-2 bg-white border border-gray-200
            px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600
            hover:bg-gray-50 transition shadow-sm">
          <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700
          px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
          <FiCheck size={16} /> {successMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600
          px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
          <FiAlertCircle size={16} /> {error}
          <button onClick={() => setError('')} className="ml-auto"><FiX size={16} /></button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Total',   value: stats.total,   color: 'blue'   },
          { label: 'New',     value: stats.booked,  color: 'gray'   },
          { label: 'Active',  value: stats.active,  color: 'purple' },
          { label: 'Waiting', value: stats.waiting, color: 'yellow' },
          { label: 'Ready',   value: stats.ready,   color: 'orange' },
          { label: 'Done',    value: stats.done,    color: 'green'  },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm text-center">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-xl font-bold text-${s.color}-600 mt-0.5`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search by ID, name, phone, brand..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200
              text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="relative">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-gray-200
              text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[180px]">
            <option value="All">All Status</option>
            {Object.keys(statusConfig).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <FiLoader size={32} className="animate-spin text-blue-600" />
        </div>
      )}

      {/* No results */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <FiTool size={32} className="text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-700 font-semibold">No repairs found</h3>
          <p className="text-gray-500 text-sm mt-1">Repair bookings will appear here</p>
        </div>
      )}

      {/* Repair Cards */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((repair) => {
            const isEditing = editingId === repair._id
            const sc = statusConfig[repair.status] || statusConfig.Booked

            return (
              <div key={repair._id} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                isEditing ? 'border-blue-300 shadow-blue-100' : 'border-gray-100'
              }`}>

                {/* Top bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-gray-50 gap-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-mono font-bold text-sm">
                      {repair.repairId}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{repair.customerName}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiPhone size={10} /> {repair.customerPhone}
                        </span>
                        {repair.customerEmail && (
                          <span className="flex items-center gap-1">
                            <FiMail size={10} /> {repair.customerEmail}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {repair.status}
                    </span>

                    {!isEditing ? (
                      <button onClick={() => startEdit(repair)}
                        className="flex items-center gap-1.5 bg-blue-50 text-blue-600
                          px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-100 transition">
                        <FiEdit2 size={13} /> Manage
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => handleSave(repair._id)} disabled={saving}
                          className="flex items-center gap-1.5 bg-green-50 text-green-600
                            px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-100 disabled:opacity-50">
                          {saving ? <FiLoader size={13} className="animate-spin" /> : <FiSave size={13} />}
                          Save
                        </button>
                        <button onClick={cancelEdit}
                          className="flex items-center gap-1 bg-gray-100 text-gray-600
                            px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200">
                          <FiX size={13} /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Device',   value: `${repair.deviceBrand} ${repair.deviceModel || ''}` },
                    { label: 'Type',     value: repair.deviceType     },
                    { label: 'Issue',    value: repair.issueCategory  },
                    { label: 'Drop-off', value: `${repair.dropOffMethod} • ${formatDate(repair.preferredDate)}` },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-gray-900 font-medium text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Issue description */}
                <div className="px-5 pb-4">
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                    <p className="text-[10px] text-yellow-700 uppercase tracking-wider font-semibold mb-1">Issue</p>
                    <p className="text-gray-800 text-sm">{repair.issueDescription}</p>
                  </div>
                </div>

                {/* Dispatch address */}
                {repair.dropOffMethod === 'Dispatch' && repair.dispatchAddress && (
                  <div className="px-5 pb-4 flex items-start gap-2">
                    <FiMapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <p className="text-gray-600 text-sm">{repair.dispatchAddress}</p>
                  </div>
                )}

                {/* Edit panel */}
                {isEditing && (
                  <div className="bg-blue-50/50 border-t border-blue-100 p-5">
                    <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider mb-4">
                      ✏️ Update Repair
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Status</label>
                        <select value={editData.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200
                            text-sm focus:ring-2 focus:ring-blue-500 bg-white">
                          {Object.keys(statusConfig).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Assigned Technician</label>
                        <input type="text" value={editData.assignedTechnician}
                          onChange={(e) => setEditData({ ...editData, assignedTechnician: e.target.value })}
                          placeholder="Technician name..."
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200
                            text-sm focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Estimated Cost</label>
                        <input type="text" value={editData.estimatedCost}
                          onChange={(e) => setEditData({ ...editData, estimatedCost: e.target.value })}
                          placeholder="e.g. ₦15,000 - ₦20,000"
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200
                            text-sm focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Diagnosis Notes (visible to customer)
                        </label>
                        <textarea value={editData.diagnosisNotes}
                          onChange={(e) => setEditData({ ...editData, diagnosisNotes: e.target.value })}
                          rows="2" placeholder="What did you find wrong..."
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200
                            text-sm focus:ring-2 focus:ring-blue-500 resize-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Internal Notes (admin only)
                        </label>
                        <input type="text" value={editData.adminNotes}
                          onChange={(e) => setEditData({ ...editData, adminNotes: e.target.value })}
                          placeholder="Internal notes..."
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200
                            text-sm focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a href={`https://wa.me/${repair.customerPhone?.replace(/^0/, '234')}?text=${encodeURIComponent(
                        `Hello ${repair.customerName}, this is 75TechStore. Your repair (${repair.repairId}) for your ${repair.deviceBrand} is now "${editData.status}".${editData.diagnosisNotes ? ` Diagnosis: ${editData.diagnosisNotes}` : ''}${editData.estimatedCost ? ` Estimated cost: ${editData.estimatedCost}` : ''}`
                      )}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white
                          px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition shadow-sm">
                        📱 WhatsApp Customer
                      </a>
                      <a href={`tel:${repair.customerPhone}`}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white
                          px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition shadow-sm">
                        📞 Call
                      </a>
                    </div>
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

export default AdminRepairs