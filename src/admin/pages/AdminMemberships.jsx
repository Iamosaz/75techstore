// src/admin/pages/AdminMemberships.jsx
import React, { useState, useEffect } from 'react'
import {
  FiAward, FiSearch, FiRefreshCw, FiEdit2, FiSave,
  FiX, FiLoader, FiCheck, FiAlertCircle, FiPhone,
  FiCalendar, FiPlus, FiUserPlus, FiTrash2, FiArrowUp,
  FiClock, FiUsers
} from 'react-icons/fi'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const tierConfig = {
  'silver':   { bg: 'bg-slate-100',   text: 'text-slate-700',   border: 'border-slate-300', gradient: 'from-slate-400 to-slate-500' },
  'gold':     { bg: 'bg-amber-100',   text: 'text-amber-700',   border: 'border-amber-400', gradient: 'from-amber-400 to-yellow-500' },
  'platinum': { bg: 'bg-purple-100',  text: 'text-purple-700',  border: 'border-purple-300', gradient: 'from-purple-500 to-indigo-600' },
}

const AdminMemberships = () => {
  const [members, setMembers]           = useState([])
  const [allUsers, setAllUsers]         = useState([]) // For granting new memberships
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [searchTerm, setSearchTerm]     = useState('')
  const [filterTier, setFilterTier]     = useState('All')
  const [editingId, setEditingId]       = useState(null)
  const [editData, setEditData]         = useState({})
  const [saving, setSaving]             = useState(false)
  const [successMsg, setSuccessMsg]     = useState('')
  
  // Grant Membership Modal
  const [showGrantModal, setShowGrantModal] = useState(false)
  const [grantData, setGrantData] = useState({
    userId: '',
    membershipTier: 'silver',
    duration: '1' // Months
  })
  const [userSearch, setUserSearch] = useState('')

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
  })

  const fetchVIPs = async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await axios.get(`${API_URL}/analytics/vip-members`, authHeader())
      if (data.success) {
        setMembers(data.data || [])
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load VIP memberships')
    } finally {
      setLoading(false)
    }
  }

  const fetchAllUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/users`, authHeader())
      if (data.success) {
        setAllUsers(data.data || data.users || [])
      } else if (Array.isArray(data)) {
        setAllUsers(data)
      }
    } catch (err) {
      console.log("Could not load users list", err.message)
    }
  }

  useEffect(() => {
    fetchVIPs()
    fetchAllUsers()
  }, [])

  // ────────────────────────
  // ✏️ Manage/Update Existing
  // ────────────────────────
  const startEdit = (member) => {
    setEditingId(member._id)
    setEditData({
      membershipTier: member.membershipTier || 'silver',
      membershipExpiry: member.membershipExpiry ? String(member.membershipExpiry).split('T')[0] : '',
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
        `${API_URL}/analytics/vip-members/${id}`,
        editData,
        authHeader()
      )
      if (data.success) {
        setEditingId(null)
        setSuccessMsg('✅ Membership updated successfully!')
        setTimeout(() => setSuccessMsg(''), 3000)
        fetchVIPs()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  // ────────────────────────
  // ❌ Cancel Membership
  // ────────────────────────
  const handleCancel = async (member) => {
    if (!window.confirm(`Cancel VIP membership for ${member.name}? This will revoke all their benefits.`)) return
    
    try {
      const { data } = await axios.put(
        `${API_URL}/analytics/vip-members/${member._id}`,
        { membershipTier: null, membershipExpiry: null },
        authHeader()
      )
      if (data.success) {
        setSuccessMsg(`❌ Membership canceled for ${member.name}`)
        setTimeout(() => setSuccessMsg(''), 3000)
        fetchVIPs()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Cancellation failed')
    }
  }

  // ────────────────────────
  // ⬆️ Quick Upgrade Tier
  // ────────────────────────
  const handleQuickUpgrade = async (member) => {
    const tierOrder = ['silver', 'gold', 'platinum']
    const current = tierOrder.indexOf(member.membershipTier?.toLowerCase())
    if (current >= tierOrder.length - 1) {
      alert('Already on the highest tier (Platinum)')
      return
    }
    const newTier = tierOrder[current + 1]
    
    if (!window.confirm(`Upgrade ${member.name} from ${member.membershipTier} to ${newTier.toUpperCase()}?`)) return

    try {
      const { data } = await axios.put(
        `${API_URL}/analytics/vip-members/${member._id}`,
        { membershipTier: newTier, membershipExpiry: member.membershipExpiry },
        authHeader()
      )
      if (data.success) {
        setSuccessMsg(`🚀 ${member.name} upgraded to ${newTier.toUpperCase()}!`)
        setTimeout(() => setSuccessMsg(''), 3000)
        fetchVIPs()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upgrade failed')
    }
  }

  // ────────────────────────
  // ➕ Grant New Membership
  // ────────────────────────
  const handleGrantMembership = async (e) => {
    e.preventDefault()
    if (!grantData.userId) {
      alert('Please select a user first')
      return
    }

    try {
      setSaving(true)
      const expiryDate = new Date()
      expiryDate.setMonth(expiryDate.getMonth() + parseInt(grantData.duration))

      const { data } = await axios.put(
        `${API_URL}/analytics/vip-members/${grantData.userId}`,
        {
          membershipTier: grantData.membershipTier,
          membershipExpiry: expiryDate.toISOString()
        },
        authHeader()
      )
      if (data.success) {
        setSuccessMsg(`🎉 VIP ${grantData.membershipTier.toUpperCase()} granted successfully!`)
        setTimeout(() => setSuccessMsg(''), 3000)
        setShowGrantModal(false)
        setGrantData({ userId: '', membershipTier: 'silver', duration: '1' })
        setUserSearch('')
        fetchVIPs()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to grant membership')
    } finally {
      setSaving(false)
    }
  }

  // ────────────────────────
  // Filter Helpers
  // ────────────────────────
  const isExpired = (expiryDate) => {
    if (!expiryDate) return true
    return new Date(expiryDate) < new Date()
  }

  const filtered = members.filter((m) => {
    const s = searchTerm.toLowerCase()
    const matchSearch =
      m.name?.toLowerCase().includes(s) ||
      m.email?.toLowerCase().includes(s) ||
      m.phone?.includes(s)
    const matchTier = filterTier === 'All' || m.membershipTier?.toLowerCase() === filterTier.toLowerCase()
    return matchSearch && matchTier
  })

  const filteredUsers = allUsers.filter(u => {
    const s = userSearch.toLowerCase()
    return u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s)
  }).slice(0, 8) // Only show first 8 results

  const stats = {
    total: members.length,
    active: members.filter(m => !isExpired(m.membershipExpiry)).length,
    platinum: members.filter(m => m.membershipTier?.toLowerCase() === 'platinum').length,
    gold: members.filter(m => m.membershipTier?.toLowerCase() === 'gold').length,
    silver: members.filter(m => m.membershipTier?.toLowerCase() === 'silver').length,
    expired: members.filter(m => isExpired(m.membershipExpiry)).length,
  }

  const formatDate = (d) => {
    if (!d) return 'Never'
    return new Date(d).toLocaleDateString('en-NG', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <FiAward size={20} />
            </div>
            VIP Memberships
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Grant, upgrade, or terminate VIP subscriptions for any user
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowGrantModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-amber-500/20"
          >
            <FiUserPlus size={16} />
            Grant VIP Membership
          </button>
          <button
            onClick={fetchVIPs}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition shadow-sm"
          >
            <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
          <FiCheck size={16} /> {successMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
          <FiAlertCircle size={16} /> {error}
          <button onClick={() => setError('')} className="ml-auto"><FiX size={16} /></button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Total VIPs', value: stats.total },
          { label: 'Active', value: stats.active },
          { label: 'Platinum', value: stats.platinum },
          { label: 'Gold', value: stats.gold },
          { label: 'Silver', value: stats.silver },
          { label: 'Expired', value: stats.expired },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm text-center">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className="text-xl font-bold mt-0.5 text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search subscriptions by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
          className="pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[180px]"
        >
          <option value="All">All Tiers</option>
          <option value="Platinum">Platinum VIP</option>
          <option value="Gold">Gold VIP</option>
          <option value="Silver">Silver VIP</option>
        </select>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <FiLoader size={32} className="animate-spin text-blue-600" />
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <FiAward size={40} className="text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-700 font-bold text-lg">No VIP members yet</h3>
          <p className="text-gray-500 text-sm mt-2 mb-4">
            When users subscribe through Paystack, they will appear here.<br />
            Or you can grant a VIP membership manually below.
          </p>
          <button
            onClick={() => setShowGrantModal(true)}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            <FiUserPlus size={16} /> Grant First VIP Membership
          </button>
        </div>
      )}

      {/* Member Cards */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((member) => {
            const isEditing = editingId === member._id
            const activeStatus = !isExpired(member.membershipExpiry)
            const tc = tierConfig[member.membershipTier?.toLowerCase()] || tierConfig.silver

            return (
              <div
                key={member._id}
                className={`bg-white rounded-xl border shadow-sm p-5 flex flex-col justify-between transition-all ${
                  isEditing ? 'border-blue-300 shadow-blue-50' : 'border-gray-100'
                }`}
              >
                {/* Top */}
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="truncate flex-1">
                      <h3 className="font-bold text-gray-900 truncate">{member.name || 'Unnamed User'}</h3>
                      <p className="text-xs text-gray-400 truncate">{member.email}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0 ${tc.bg} ${tc.text}`}>
                      {member.membershipTier}
                    </span>
                  </div>

                  <hr className="border-gray-50 my-3" />

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FiPhone className="shrink-0" size={12} />
                      <span>{member.phone || 'No phone number'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FiCalendar className="shrink-0" size={12} />
                      <span>Expiry: <strong>{formatDate(member.membershipExpiry)}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold uppercase ${
                      activeStatus ? 'text-green-600' : 'text-red-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${activeStatus ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                      {activeStatus ? 'Active' : 'Expired'}
                    </span>
                  </div>
                </div>

                {/* Editing Panel */}
                {isEditing && (
                  <div className="pt-4 border-t border-blue-100 bg-blue-50/40 -mx-5 -mb-5 px-5 pb-5 rounded-b-xl space-y-3 mt-2">
                    <p className="text-xs text-blue-700 font-bold uppercase">Edit Subscription</p>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tier Level</label>
                      <select
                        value={editData.membershipTier}
                        onChange={(e) => setEditData({ ...editData, membershipTier: e.target.value })}
                        className="w-full p-2 rounded border bg-white text-xs outline-none"
                      >
                        <option value="silver">Silver VIP</option>
                        <option value="gold">Gold VIP</option>
                        <option value="platinum">Platinum VIP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Expiry Date</label>
                      <input
                        type="date"
                        value={editData.membershipExpiry}
                        onChange={(e) => setEditData({ ...editData, membershipExpiry: e.target.value })}
                        className="w-full p-2 rounded border bg-white text-xs outline-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleSave(member._id)}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving ? <FiLoader className="animate-spin" size={12} /> : <FiSave size={12} />}
                        Save Changes
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-gray-300"
                      >
                        <FiX size={12} /> Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {!isEditing && (
                  <div className="grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => startEdit(member)}
                      className="flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-2 rounded-lg text-[11px] font-bold transition"
                    >
                      <FiEdit2 size={11} /> Manage
                    </button>
                    <button
                      onClick={() => handleQuickUpgrade(member)}
                      disabled={member.membershipTier?.toLowerCase() === 'platinum'}
                      className="flex items-center justify-center gap-1 bg-purple-50 text-purple-600 hover:bg-purple-100 px-2 py-2 rounded-lg text-[11px] font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FiArrowUp size={11} /> Upgrade
                    </button>
                    <button
                      onClick={() => handleCancel(member)}
                      className="flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-2 py-2 rounded-lg text-[11px] font-bold transition"
                    >
                      <FiTrash2 size={11} /> Cancel
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ─────────────────────────── */}
      {/* Grant VIP Membership Modal  */}
      {/* ─────────────────────────── */}
      {showGrantModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FiUserPlus className="text-amber-500" /> Grant VIP Membership
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Manually assign a VIP tier to any user account</p>
                </div>
                <button 
                  onClick={() => { setShowGrantModal(false); setUserSearch(''); }}
                  className="p-1.5 hover:bg-gray-100 rounded-lg"
                >
                  <FiX size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            <form onSubmit={handleGrantMembership} className="p-6 space-y-4">
              {/* User Search */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select User Account</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value)
                      setGrantData({ ...grantData, userId: '' })
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* User List Dropdown */}
                {userSearch && !grantData.userId && (
                  <div className="mt-2 max-h-52 overflow-y-auto border border-gray-100 rounded-lg divide-y bg-white shadow-inner">
                    {filteredUsers.length === 0 ? (
                      <p className="p-3 text-xs text-gray-400 text-center">No users found</p>
                    ) : (
                      filteredUsers.map(u => (
                        <button
                          type="button"
                          key={u._id}
                          onClick={() => {
                            setGrantData({ ...grantData, userId: u._id })
                            setUserSearch(u.name + ' (' + u.email + ')')
                          }}
                          className="w-full text-left p-3 hover:bg-blue-50 transition"
                        >
                          <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Tier Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Membership Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {['silver', 'gold', 'platinum'].map(tier => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setGrantData({ ...grantData, membershipTier: tier })}
                      className={`p-3 rounded-lg text-xs font-bold uppercase border-2 transition ${
                        grantData.membershipTier === tier
                          ? `bg-gradient-to-br ${tierConfig[tier].gradient} text-white border-transparent shadow-md`
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subscription Duration</label>
                <select
                  value={grantData.duration}
                  onChange={(e) => setGrantData({ ...grantData, duration: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">1 Year</option>
                  <option value="24">2 Years</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowGrantModal(false); setUserSearch(''); }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !grantData.userId}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-sm font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? <FiLoader className="animate-spin" /> : <FiUserPlus />}
                  {saving ? 'Granting...' : 'Grant VIP Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMemberships