// src/admin/components/Topbar.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  FiBell,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiUser,
  FiChevronDown,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../hooks/useAdmin";

export default function Topbar({ toggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();
  const { adminUser, logout, notifications } = useAdmin();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3 flex justify-between items-center sticky top-0 z-40">

      {/* Left Side */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <FiMenu size={22} className="text-gray-600" />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <FiBell size={20} className="text-gray-600" />
            {notifications && notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Notifications
                </h3>
                {notifications && notifications.length > 0 && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {notifications.length} new
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications && notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${
                        notif.type === "error"
                          ? "border-l-4 border-l-red-500"
                          : notif.type === "success"
                          ? "border-l-4 border-l-green-500"
                          : "border-l-4 border-l-blue-500"
                      }`}
                    >
                      <p className="text-sm text-gray-800">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">Just now</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <FiBell size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No notifications yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200" />

        {/* User Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pr-3 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {adminUser?.avatar ? (
              <img
                src={adminUser.avatar}
                alt={adminUser?.name}
                className="w-9 h-9 rounded-xl object-cover"
              />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-xs font-bold">
                {getInitials(adminUser?.name)}
              </div>
            )}

            {/* ✅ Only show name - removed role */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {adminUser?.name || "Admin"}
              </p>
            </div>

            <FiChevronDown
              size={14}
              className={`text-gray-400 hidden md:block transition-transform duration-200 ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              {/* ✅ User Info - removed role, just name and email */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <p className="text-sm font-semibold text-gray-900">
                  {adminUser?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {adminUser?.email}
                </p>
              </div>

              {/* Menu Items */}
              <div className="p-1.5">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate("/admin/settings");
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-gray-700 rounded-xl transition text-sm"
                >
                  <FiUser size={16} className="text-gray-400" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate("/admin/settings");
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-gray-700 rounded-xl transition text-sm"
                >
                  <FiSettings size={16} className="text-gray-400" />
                  Settings
                </button>
              </div>

              {/* Logout */}
              <div className="p-1.5 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 hover:bg-red-50 flex items-center gap-3 text-red-600 rounded-xl transition text-sm"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}