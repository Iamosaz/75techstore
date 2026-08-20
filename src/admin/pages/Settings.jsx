// src/admin/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import {
  FiSave, FiLock, FiBell, FiUser,
  FiMail, FiPhone, FiMapPin, FiCheck,
  FiAlertCircle, FiEye, FiEyeOff, FiShield
} from "react-icons/fi";
import { useAdmin } from "../hooks/useAdmin";

// ✅ Fix - Hardcoded URL
const API_URL = "http://localhost:5000/api";

export default function Settings() {
  const { adminUser } = useAdmin();

  const [profileLoading, setProfileLoading]   = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [notifLoading, setNotifLoading]       = useState(false);
  const [fetchLoading, setFetchLoading]       = useState(true);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false, new: false, confirm: false,
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderAlerts:        true,
    weeklyReport:       false,
    productAlerts:      true,
  });

  const [alerts, setAlerts] = useState({
    profile: null, password: null, notifications: null,
  });

  // ✅ Auth header helper
  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    "Content-Type": "application/json",
  });

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetchLoading(true);
        const res = await fetch(`${API_URL}/settings/profile`, {
          headers: authHeader()
        });
        const data = await res.json();
        if (data.success) {
          setFormData({
            name:    data.data.name    || "",
            email:   data.data.email   || "",
            phone:   data.data.phone   || "",
            address: data.data.address || "",
          });
          if (data.data.notifications) {
            setNotifications(data.data.notifications);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setFormData({
          name:    adminUser?.name  || "",
          email:   adminUser?.email || "",
          phone:   "",
          address: "",
        });
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const showAlert = (section, type, message) => {
    setAlerts((prev) => ({ ...prev, [section]: { type, message } }));
    setTimeout(() => {
      setAlerts((prev) => ({ ...prev, [section]: null }));
    }, 4000);
  };

  // Save profile
  const handleSaveProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await fetch(`${API_URL}/settings/profile`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        showAlert("profile", "success", "Profile updated successfully!");
        const stored = JSON.parse(localStorage.getItem("adminUser") || "{}");
        localStorage.setItem("adminUser", JSON.stringify({
          ...stored, name: formData.name, email: formData.email
        }));
      } else {
        showAlert("profile", "error", data.message || "Failed to update profile");
      }
    } catch (err) {
      showAlert("profile", "error", "Server error. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert("password", "error", "New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showAlert("password", "error", "Password must be at least 6 characters!");
      return;
    }
    try {
      setPasswordLoading(true);
      const res = await fetch(`${API_URL}/settings/password`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(passwordData),
      });
      const data = await res.json();
      if (data.success) {
        showAlert("password", "success", "Password updated successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showAlert("password", "error", data.message || "Failed to update password");
      }
    } catch (err) {
      showAlert("password", "error", "Server error. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Save notifications
  const handleSaveNotifications = async () => {
    try {
      setNotifLoading(true);
      const res = await fetch(`${API_URL}/settings/notifications`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({ notifications }),
      });
      const data = await res.json();
      if (data.success) {
        showAlert("notifications", "success", "Notification preferences saved!");
      } else {
        showAlert("notifications", "error", data.message || "Failed to save");
      }
    } catch (err) {
      showAlert("notifications", "error", "Server error. Please try again.");
    } finally {
      setNotifLoading(false);
    }
  };

  // ✅ Fix - Added missing handleNotificationChange function
  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Alert = ({ section }) => {
    const alert = alerts[section];
    if (!alert) return null;
    return (
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-4 text-sm font-medium ${
        alert.type === "success"
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-red-50 text-red-700 border border-red-200"
      }`}>
        {alert.type === "success"
          ? <FiCheck className="w-4 h-4 flex-shrink-0" />
          : <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
        }
        {alert.message}
      </div>
    );
  };

  if (fetchLoading) {
    return (
      <div className="p-8 space-y-6 max-w-4xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-6" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-12 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Admin Info Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
            {formData.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div>
            <h2 className="text-xl font-bold">{formData.name || "Admin"}</h2>
            <p className="text-blue-200 text-sm">{formData.email}</p>
            <span className="mt-1 inline-flex items-center gap-1.5 bg-white/20 text-white text-xs px-2.5 py-1 rounded-full">
              <FiShield size={10} />
              {adminUser?.role || "Administrator"}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <FiUser className="text-blue-600" />
          Profile Information
        </h2>
        <Alert section="profile" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Your full name" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="email" value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="tel" value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="+234 000 000 0000" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" value={formData.address}
                onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Your address" />
            </div>
          </div>
        </div>
        <button onClick={handleSaveProfile} disabled={profileLoading}
          className="mt-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                     disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition">
          {profileLoading
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <FiSave size={16} />}
          {profileLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <FiLock className="text-blue-600" />
          Security Settings
        </h2>
        <Alert section="password" />
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter current password" />
              <button type="button"
                onClick={() => setShowPasswords((p) => ({ ...p, current: !p.current }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPasswords.current ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="New password" />
                <button type="button"
                  onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPasswords.new ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Confirm new password" />
                <button type="button"
                  onClick={() => setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPasswords.confirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Password Strength */}
          {passwordData.newPassword && (
            <div>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${
                    passwordData.newPassword.length >= i * 2
                      ? passwordData.newPassword.length >= 8 ? "bg-green-500" : "bg-yellow-500"
                      : "bg-gray-200"
                  }`} />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {passwordData.newPassword.length < 6 ? "Too short" :
                 passwordData.newPassword.length < 8 ? "Moderate" : "Strong password"}
              </p>
            </div>
          )}

          <button onClick={handleUpdatePassword} disabled={passwordLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                       disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition">
            {passwordLoading
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <FiLock size={16} />}
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <FiBell className="text-blue-600" />
          Notifications
        </h2>
        <Alert section="notifications" />
        <div className="space-y-3">
          {[
            { key: "emailNotifications", label: "Email Notifications", description: "Receive notifications via email",        icon: FiMail   },
            { key: "orderAlerts",        label: "Order Alerts",        description: "Get notified about new orders",           icon: FiShield },
            { key: "weeklyReport",       label: "Weekly Report",       description: "Receive a weekly summary report",         icon: FiBell   },
            { key: "productAlerts",      label: "Product Alerts",      description: "Get notified about low stock items",      icon: FiBell   },
          ].map((item) => (
            <label key={item.key}
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl
                         hover:bg-gray-50 cursor-pointer transition">
              <div className="p-2 bg-blue-50 rounded-lg">
                <item.icon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <button onClick={() => handleNotificationChange(item.key)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  notifications[item.key] ? "bg-blue-600" : "bg-gray-200"
                }`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
                                  transition-transform duration-200 ${
                  notifications[item.key] ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </label>
          ))}
        </div>
        <button onClick={handleSaveNotifications} disabled={notifLoading}
          className="mt-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                     disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition">
          {notifLoading
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <FiSave size={16} />}
          {notifLoading ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}