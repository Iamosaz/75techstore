// src/admin/pages/Users.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2,
  FiUser, FiMail, FiPhone, FiMapPin,
  FiShield, FiCheck, FiX, FiAlertCircle,
  FiEye, FiEyeOff, FiRefreshCw, FiLock,
} from "react-icons/fi";

const API_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("adminToken");
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function RoleBadge({ role }) {
  const styles = {
    admin:    "bg-purple-100 text-purple-800",
    vendor:   "bg-blue-100 text-blue-800",
    customer: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
      ${styles[role] || styles.customer}`}>
      {role}
    </span>
  );
}

function StatusBadge({ isActive }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
      isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}>
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function Alert({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-4
      text-sm font-medium ${
      type === "success"
        ? "bg-green-50 text-green-700 border border-green-200"
        : "bg-red-50 text-red-700 border border-red-200"
    }`}>
      {type === "success"
        ? <FiCheck className="w-4 h-4 flex-shrink-0" />
        : <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
      }
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="ml-auto">
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Users() {
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState("");
  const [roleFilter, setRoleFilter]   = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalUsers, setTotalUsers]   = useState(0);
  const [alert, setAlert]             = useState({ message: "", type: "" });

  const [showModal, setShowModal]                   = useState(false);
  const [showDeleteModal, setShowDeleteModal]       = useState(false);
  const [showPasswordModal, setShowPasswordModal]   = useState(false);
  const [selectedUser, setSelectedUser]             = useState(null);
  const [submitting, setSubmitting]                 = useState(false);

  const [formData, setFormData] = useState({
    name: "", email: "", password: "",
    role: "customer", phone: "", address: "",
  });

  const [newPassword, setNewPassword]         = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page:   currentPage,
        limit:  10,
        search: searchTerm,
        role:   roleFilter,
      });
      const res  = await fetch(`${API_URL}/users?${params}`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
        setTotalPages(data.totalPages || 1);
        setTotalUsers(data.total || 0);
      } else {
        showAlert(data.message || "Failed to fetch users", "error");
      }
    } catch (_err) {
      showAlert("Failed to connect to server", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, roleFilter]);

  const handleAddNew = () => {
    setSelectedUser(null);
    setFormData({
      name: "", email: "", password: "",
      role: "customer", phone: "", address: "",
    });
    setShowPassword(false);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name:     user.name    || "",
      email:    user.email   || "",
      password: "",
      role:     user.role    || "customer",
      phone:    user.phone   || "",
      address:  user.address || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url    = selectedUser
        ? `${API_URL}/users/${selectedUser._id}`
        : `${API_URL}/users`;
      const method = selectedUser ? "PUT" : "POST";
      const body   = { ...formData };
      if (selectedUser && !body.password) delete body.password;

      const res  = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        showAlert(selectedUser
          ? "User updated successfully!"
          : "User created successfully!"
        );
        setShowModal(false);
        fetchUsers();
      } else {
        showAlert(data.message || "Something went wrong", "error");
      }
    } catch (_err) {
      showAlert("Server error. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      const res  = await fetch(`${API_URL}/users/${selectedUser._id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        showAlert("User deleted successfully!");
        setShowDeleteModal(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        showAlert(data.message || "Failed to delete user", "error");
      }
    } catch (_err) {
      showAlert("Server error. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const res  = await fetch(`${API_URL}/users/${user._id}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        showAlert(
          `User ${!user.isActive ? "activated" : "deactivated"} successfully!`
        );
        fetchUsers();
      } else {
        showAlert(data.message || "Failed to update status", "error");
      }
    } catch (_err) {
      showAlert("Server error. Please try again.", "error");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      showAlert("Password must be at least 6 characters", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res  = await fetch(
        `${API_URL}/users/${selectedUser._id}/reset-password`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({ newPassword }),
        }
      );
      const data = await res.json();
      if (data.success) {
        showAlert("Password reset successfully!");
        setShowPasswordModal(false);
        setNewPassword("");
      } else {
        showAlert(data.message || "Failed to reset password", "error");
      }
    } catch (_err) {
      showAlert("Server error. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalUsers} total users in your store
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchUsers}
            className="p-2.5 bg-white border border-gray-200 rounded-xl
              hover:bg-gray-50 transition" title="Refresh">
            <FiRefreshCw className={`w-4 h-4 text-gray-600
              ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={handleAddNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
              text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition">
            <FiPlus size={18} /> Add User
          </button>
        </div>
      </div>

      <Alert message={alert.message} type={alert.type}
        onClose={() => setAlert({ message: "", type: "" })} />

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Users",  value: totalUsers,                                      color: "text-blue-700"   },
            { label: "Admins",       value: users.filter((u) => u.role === "admin").length,   color: "text-purple-700" },
            { label: "Customers",    value: users.filter((u) => u.role === "customer").length, color: "text-green-700"  },
            { label: "Active",       value: users.filter((u) => u.isActive !== false).length, color: "text-teal-700"   },
          ].map((stat) => (
            <div key={stat.label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2
            text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200
              rounded-xl text-sm focus:outline-none focus:ring-2
              focus:ring-blue-500 bg-white" />
        </div>
        <select value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="vendor">Vendor</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["User", "Email", "Phone", "Role", "Status", "Joined", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs
                      font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <FiUser size={32} className="text-gray-300" />
                        <p className="font-medium">No users found</p>
                        <p className="text-sm">
                          {searchTerm ? "Try a different search" : "Add your first user"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name}
                            className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-400
                            to-purple-500 rounded-full flex items-center justify-center
                            text-white text-xs font-bold flex-shrink-0">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{user.email}</td>
                    <td className="px-5 py-4 text-gray-600">{user.phone || "—"}</td>
                    <td className="px-5 py-4"><RoleBadge role={user.role} /></td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleToggleStatus(user)}
                        title="Click to toggle status">
                        <StatusBadge isActive={user.isActive !== false} />
                      </button>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(user)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-600
                            text-xs font-medium px-3 py-1.5 rounded-lg transition
                            flex items-center gap-1">
                          <FiEdit2 size={12} /> Edit
                        </button>
                        <button onClick={() => {
                          setSelectedUser(user);
                          setShowPasswordModal(true);
                        }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600
                            text-xs font-medium px-3 py-1.5 rounded-lg transition
                            flex items-center gap-1">
                          <FiLock size={12} /> Reset
                        </button>
                        <button onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                          className="bg-red-50 hover:bg-red-100 text-red-600
                            text-xs font-medium px-3 py-1.5 rounded-lg transition
                            flex items-center gap-1">
                          <FiTrash2 size={12} /> Delete
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
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm
              disabled:opacity-40 hover:bg-gray-50 transition">
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm
              disabled:opacity-40 hover:bg-gray-50 transition">
            Next →
          </button>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center
          justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6
              border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {selectedUser ? "✏️ Edit User" : "➕ Add New User"}
              </h2>
              <button onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2
                      text-gray-400 w-4 h-4" />
                    <input type="text" value={formData.name} required
                      placeholder="John Doe"
                      onChange={(e) => setFormData((p) => ({
                        ...p, name: e.target.value
                      }))}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200
                        rounded-xl text-sm focus:outline-none focus:ring-2
                        focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Role
                  </label>
                  <div className="relative">
                    <FiShield className="absolute left-3 top-1/2 -translate-y-1/2
                      text-gray-400 w-4 h-4" />
                    <select value={formData.role}
                      onChange={(e) => setFormData((p) => ({
                        ...p, role: e.target.value
                      }))}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200
                        rounded-xl text-sm focus:outline-none focus:ring-2
                        focus:ring-blue-500">
                      <option value="customer">Customer</option>
                      <option value="vendor">Vendor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2
                    text-gray-400 w-4 h-4" />
                  <input type="email" value={formData.email} required
                    placeholder="john@example.com"
                    onChange={(e) => setFormData((p) => ({
                      ...p, email: e.target.value
                    }))}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200
                      rounded-xl text-sm focus:outline-none focus:ring-2
                      focus:ring-blue-500" />
                </div>
              </div>

              {!selectedUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2
                      text-gray-400 w-4 h-4" />
                    <input type={showPassword ? "text" : "password"}
                      value={formData.password}
                      required={!selectedUser}
                      placeholder="Min 6 characters"
                      onChange={(e) => setFormData((p) => ({
                        ...p, password: e.target.value
                      }))}
                      className="w-full pl-9 pr-10 py-2.5 border border-gray-200
                        rounded-xl text-sm focus:outline-none focus:ring-2
                        focus:ring-blue-500" />
                    <button type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2
                        text-gray-400 hover:text-gray-600">
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2
                      text-gray-400 w-4 h-4" />
                    <input type="tel" value={formData.phone}
                      placeholder="+234 000 000 0000"
                      onChange={(e) => setFormData((p) => ({
                        ...p, phone: e.target.value
                      }))}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200
                        rounded-xl text-sm focus:outline-none focus:ring-2
                        focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Address
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2
                      text-gray-400 w-4 h-4" />
                    <input type="text" value={formData.address}
                      placeholder="City, State"
                      onChange={(e) => setFormData((p) => ({
                        ...p, address: e.target.value
                      }))}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200
                        rounded-xl text-sm focus:outline-none focus:ring-2
                        focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200
                    text-gray-700 rounded-xl text-sm font-medium transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700
                    text-white rounded-xl text-sm font-semibold transition
                    disabled:opacity-60 flex items-center gap-2">
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white
                        border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : selectedUser ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center
          justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6
            shadow-2xl text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete User?</h3>
            <p className="text-gray-500 text-sm mb-1">You are about to delete:</p>
            <p className="font-semibold text-gray-900 mb-1">{selectedUser.name}</p>
            <p className="text-sm text-gray-500 mb-6">{selectedUser.email}</p>
            <p className="text-xs text-red-500 mb-6">This action cannot be undone!</p>
            <div className="flex gap-3">
              <button onClick={() => {
                setShowDeleteModal(false);
                setSelectedUser(null);
              }}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200
                  text-gray-700 rounded-xl text-sm font-medium transition">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={submitting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700
                  text-white rounded-xl text-sm font-semibold transition
                  disabled:opacity-60">
                {submitting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center
          justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">🔑 Reset Password</h3>
              <button onClick={() => {
                setShowPasswordModal(false);
                setNewPassword("");
              }} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Reset password for <strong>{selectedUser.name}</strong>
            </p>
            <div className="relative mb-4">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2
                text-gray-400 w-4 h-4" />
              <input type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 6 chars)"
                className="w-full pl-9 pr-10 py-2.5 border border-gray-200
                  rounded-xl text-sm focus:outline-none focus:ring-2
                  focus:ring-blue-500" />
              <button type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                  text-gray-400 hover:text-gray-600">
                {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => {
                setShowPasswordModal(false);
                setNewPassword("");
              }}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200
                  text-gray-700 rounded-xl text-sm font-medium transition">
                Cancel
              </button>
              <button onClick={handleResetPassword} disabled={submitting}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700
                  text-white rounded-xl text-sm font-semibold transition
                  disabled:opacity-60">
                {submitting ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}