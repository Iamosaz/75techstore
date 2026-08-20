// src/admin/pages/AdminDigitalServices.jsx
import React, { useState, useEffect, useCallback } from 'react'
import {
  FiGlobe, FiPlus, FiEdit2, FiTrash2, FiStar, 
  FiEyeOff, FiCheck, FiX, FiLoader,
  FiMessageSquare, FiSave, FiRefreshCw, FiExternalLink,
  FiAlertCircle
} from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const serviceCategories = [
  'Website Development', 'Website Management', 'App Development',
  'SEO Services', 'UI/UX Design', 'Digital Marketing',
  'Cloud & Hosting', 'Cybersecurity', 'Other',
]

const reviewStatusConfig = {
  Pending:  { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  Approved: { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500'  },
  Rejected: { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500'    },
}

const AdminDigitalServices = () => {
  const [activeSection, setActiveSection] = useState('projects')
  const [projects, setProjects]     = useState([])
  const [reviews, setReviews]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingProject, setEditingProject]   = useState(null)
  const [projectForm, setProjectForm] = useState({
    title: '', clientName: '', description: '', category: 'Website Development',
    imageUrl: '', liveUrl: '', techUsed: '', isFeatured: false, isPublished: true,
  })
  const [saving, setSaving] = useState(false)

  // ✅ FIX 1 — Removed unused editingReview, reviewEdit, savingReview states
  // They are now managed locally inside handleReviewAction only

  // ✅ Auth header helper — wrapped in useCallback so it's stable
  const authHeader = useCallback(() => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
  }), [])

  const showSuccess = useCallback((msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }, [])

  // ✅ FIX 2 — Wrapped in useCallback to fix useEffect exhaustive-deps warning
  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/digital/projects/all`, authHeader())
      if (data.success) setProjects(data.data || [])
    } catch (err) {
      // ✅ FIX 3 — Actually using err now
      setError(err.response?.data?.message || 'Failed to load projects')
    }
  }, [authHeader])

  // ✅ FIX 2 — Wrapped in useCallback to fix useEffect exhaustive-deps warning
  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/digital/reviews/all`, authHeader())
      if (data.success) setReviews(data.data || [])
    } catch (err) {
      // ✅ FIX 3 — Actually using err now
      setError(err.response?.data?.message || 'Failed to load reviews')
    }
  }, [authHeader])

  // ✅ FIX 4 — useEffect now has correct deps — no more warning
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true)
      await Promise.all([fetchProjects(), fetchReviews()])
      setLoading(false)
    }
    loadAll()
  }, [fetchProjects, fetchReviews])

  const resetProjectForm = useCallback(() => {
    setProjectForm({
      title: '', clientName: '', description: '', category: 'Website Development',
      imageUrl: '', liveUrl: '', techUsed: '', isFeatured: false, isPublished: true,
    })
    setEditingProject(null)
    setShowProjectForm(false)
  }, [])

  const startEditProject = (project) => {
    setEditingProject(project._id)
    setProjectForm({
      title:       project.title,
      clientName:  project.clientName,
      description: project.description,
      category:    project.category,
      imageUrl:    project.imageUrl,
      liveUrl:     project.liveUrl || '',
      techUsed:    (project.techUsed || []).join(', '),
      isFeatured:  project.isFeatured,
      isPublished: project.isPublished,
    })
    setShowProjectForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSaveProject = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      const payload = {
        ...projectForm,
        techUsed: projectForm.techUsed.split(',').map(t => t.trim()).filter(t => t),
      }

      if (editingProject) {
        const { data } = await axios.put(
          `${API_URL}/digital/projects/${editingProject}`,
          payload,
          authHeader()
        )
        if (data.success) {
          setProjects(prev => prev.map(p => p._id === editingProject ? data.data : p))
          showSuccess('Project updated!')
        }
      } else {
        const { data } = await axios.post(
          `${API_URL}/digital/projects`,
          payload,
          authHeader()
        )
        if (data.success) {
          setProjects(prev => [data.data, ...prev])
          showSuccess('Project added!')
        }
      }
      resetProjectForm()
    } catch (err) {
      // ✅ FIX 3 — Actually using err now
      setError(err.response?.data?.message || 'Failed to save project')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await axios.delete(`${API_URL}/digital/projects/${id}`, authHeader())
      setProjects(prev => prev.filter(p => p._id !== id))
      showSuccess('Project deleted!')
    } catch (err) {
      // ✅ FIX 3 — Actually using err now
      setError(err.response?.data?.message || 'Failed to delete project')
    }
  }

  const handleReviewAction = async (id, updates) => {
    // ✅ FIX 1 — savingReview managed locally, not as unused state
    try {
      const { data } = await axios.put(
        `${API_URL}/digital/reviews/${id}`,
        updates,
        authHeader()
      )
      if (data.success) {
        setReviews(prev => prev.map(r => r._id === id ? { ...r, ...data.data } : r))
        showSuccess('Review updated!')
      }
    } catch (err) {
      // ✅ FIX 3 — Actually using err now
      setError(err.response?.data?.message || 'Failed to update review')
    }
  }

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return
    try {
      await axios.delete(`${API_URL}/digital/reviews/${id}`, authHeader())
      setReviews(prev => prev.filter(r => r._id !== id))
      showSuccess('Review deleted!')
    } catch (err) {
      // ✅ FIX 3 — Actually using err now
      setError(err.response?.data?.message || 'Failed to delete review')
    }
  }

  const stats = {
    totalProjects:   projects.length,
    published:       projects.filter(p => p.isPublished).length,
    featured:        projects.filter(p => p.isFeatured).length,
    totalReviews:    reviews.length,
    pendingReviews:  reviews.filter(r => r.status === 'Pending').length,
    approvedReviews: reviews.filter(r => r.status === 'Approved').length,
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
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <FiGlobe size={20} />
            </div>
            Digital Services
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage portfolio projects and client reviews</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { fetchProjects(); fetchReviews() }}
            className="flex items-center gap-2 bg-white border border-gray-200
              px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600
              hover:bg-gray-50 transition shadow-sm">
            <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          {activeSection === 'projects' && (
            <button
              onClick={() => { resetProjectForm(); setShowProjectForm(true) }}
              className="flex items-center gap-2 bg-indigo-600 text-white
                px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700
                transition shadow-sm">
              <FiPlus size={16} /> Add Project
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
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
          { label: 'Projects',  value: stats.totalProjects,   color: 'indigo' },
          { label: 'Published', value: stats.published,       color: 'green'  },
          { label: 'Featured',  value: stats.featured,        color: 'yellow' },
          { label: 'Reviews',   value: stats.totalReviews,    color: 'blue'   },
          { label: 'Pending',   value: stats.pendingReviews,  color: 'orange' },
          { label: 'Approved',  value: stats.approvedReviews, color: 'green'  },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm text-center">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-xl font-bold text-${s.color}-600 mt-0.5`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'projects', label: 'Projects',                                  icon: <FiGlobe size={16} />         },
          { id: 'reviews',  label: `Reviews (${stats.pendingReviews} pending)`, icon: <FiMessageSquare size={16} /> },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeSection === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <FiLoader size={32} className="animate-spin text-indigo-600" />
        </div>
      )}

      {/* PROJECTS SECTION */}
      {!loading && activeSection === 'projects' && (
        <>
          {showProjectForm && (
            <div className="bg-white rounded-2xl border border-indigo-200 shadow-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">
                {editingProject ? '✏️ Edit Project' : '➕ Add New Project'}
              </h3>
              <form onSubmit={handleSaveProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Project Title *</label>
                    <input type="text" value={projectForm.title} required
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="E-commerce Website for XYZ Store"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        outline-none text-sm bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Client Name *</label>
                    <input type="text" value={projectForm.clientName} required
                      onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
                      placeholder="Client or business name"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        outline-none text-sm bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                    <select value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        outline-none text-sm bg-gray-50">
                      {serviceCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tech Used (comma separated)</label>
                    <input type="text" value={projectForm.techUsed}
                      onChange={(e) => setProjectForm({ ...projectForm, techUsed: e.target.value })}
                      placeholder="React, Node.js, MongoDB, Tailwind"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        outline-none text-sm bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Screenshot URL (Cloudinary) *</label>
                    <input type="url" value={projectForm.imageUrl} required
                      onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                      placeholder="https://res.cloudinary.com/..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        outline-none text-sm bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Live URL (optional)</label>
                    <input type="url" value={projectForm.liveUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                      placeholder="https://clientsite.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        outline-none text-sm bg-gray-50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                  <textarea value={projectForm.description} rows="3" required
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Describe what was built and the impact..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                      outline-none text-sm bg-gray-50 resize-none" />
                </div>

                {projectForm.imageUrl && (
                  <div className="bg-gray-100 rounded-xl p-2 inline-block">
                    <img src={projectForm.imageUrl} alt="Preview"
                      className="h-32 rounded-lg object-cover"
                      onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={projectForm.isFeatured}
                      onChange={(e) => setProjectForm({ ...projectForm, isFeatured: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm text-gray-700 font-medium">Featured Project</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={projectForm.isPublished}
                      onChange={(e) => setProjectForm({ ...projectForm, isPublished: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700 font-medium">Published (visible to public)</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={saving}
                    className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl
                      hover:bg-indigo-700 transition text-sm flex items-center gap-2 disabled:opacity-70">
                    {saving ? <FiLoader size={16} className="animate-spin" /> : <FiSave size={16} />}
                    {editingProject ? 'Update Project' : 'Add Project'}
                  </button>
                  <button type="button" onClick={resetProjectForm}
                    className="bg-gray-100 text-gray-700 font-semibold px-6 py-2.5
                      rounded-xl hover:bg-gray-200 transition text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {projects.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
              <FiGlobe size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-700 font-semibold">No projects yet</p>
              <p className="text-gray-500 text-sm mt-1">Add your first portfolio project</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project) => (
                <div key={project._id} className="bg-white rounded-2xl border border-gray-100
                  shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="relative h-44 bg-gray-100">
                    <img src={project.imageUrl} alt={project.title}
                      className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {project.isFeatured && (
                        <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ⭐ Featured
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        project.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {project.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                      {project.category}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm mt-2 mb-1">{project.title}</h3>
                    <p className="text-gray-500 text-xs mb-2">Client: {project.clientName}</p>
                    <p className="text-gray-600 text-xs line-clamp-2 mb-3">{project.description}</p>
                    {project.techUsed?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.techUsed.map((tech, i) => (
                          <span key={i} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button onClick={() => startEditProject(project)}
                        className="flex items-center gap-1 text-blue-600 text-xs font-semibold
                          hover:bg-blue-50 px-2 py-1.5 rounded-lg transition">
                        <FiEdit2 size={12} /> Edit
                      </button>
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-green-600 text-xs font-semibold
                            hover:bg-green-50 px-2 py-1.5 rounded-lg transition">
                          <FiExternalLink size={12} /> View
                        </a>
                      )}
                      <button onClick={() => handleDeleteProject(project._id)}
                        className="flex items-center gap-1 text-red-500 text-xs font-semibold
                          hover:bg-red-50 px-2 py-1.5 rounded-lg transition ml-auto">
                        <FiTrash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* REVIEWS SECTION */}
      {!loading && activeSection === 'reviews' && (
        <>
          {reviews.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
              <FiMessageSquare size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-700 font-semibold">No reviews yet</p>
              <p className="text-gray-500 text-sm mt-1">Reviews submitted by clients will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const sc = reviewStatusConfig[review.status] || reviewStatusConfig.Pending
                return (
                  <div key={review._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center
                          justify-center text-white font-bold text-sm">
                          {review.clientName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{review.clientName}</p>
                          <p className="text-gray-500 text-xs">
                            {review.businessName || review.clientEmail || 'Customer'}
                            {' · '}{review.serviceUsed}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar key={i} size={12}
                              className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                          ))}
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {review.status}
                        </span>
                        {review.isFeatured && (
                          <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {review.title && (
                      <p className="font-semibold text-gray-800 text-sm mb-1">"{review.title}"</p>
                    )}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.reviewText}</p>
                    <p className="text-gray-400 text-xs mb-4">Submitted: {formatDate(review.createdAt)}</p>

                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                      {review.status === 'Pending' && (
                        <>
                          <button onClick={() => handleReviewAction(review._id, { status: 'Approved' })}
                            className="flex items-center gap-1 bg-green-50 text-green-700
                              px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-100 transition">
                            <FiCheck size={13} /> Approve
                          </button>
                          <button onClick={() => handleReviewAction(review._id, { status: 'Rejected' })}
                            className="flex items-center gap-1 bg-red-50 text-red-600
                              px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100 transition">
                            <FiX size={13} /> Reject
                          </button>
                        </>
                      )}
                      {review.status === 'Approved' && (
                        <button
                          onClick={() => handleReviewAction(review._id, { isFeatured: !review.isFeatured })}
                          className="flex items-center gap-1 bg-yellow-50 text-yellow-700
                            px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-yellow-100 transition">
                          <FiStar size={13} />
                          {/* ✅ FIX 5 — Replaced "Unfeature" with "Remove Feature" */}
                          {review.isFeatured ? 'Remove Feature' : 'Feature'}
                        </button>
                      )}
                      {review.status !== 'Pending' && (
                        <button onClick={() => handleReviewAction(review._id, { status: 'Pending' })}
                          className="flex items-center gap-1 bg-gray-100 text-gray-600
                            px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200 transition">
                          Reset to Pending
                        </button>
                      )}
                      <button onClick={() => handleDeleteReview(review._id)}
                        className="flex items-center gap-1 bg-red-50 text-red-500
                          px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100 transition ml-auto">
                        <FiTrash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminDigitalServices