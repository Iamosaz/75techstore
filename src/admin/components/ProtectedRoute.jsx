// src/admin/components/ProtectedRoute.jsx
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAdmin } from "../hooks/useAdmin";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function ProtectedRoute() {
  const { adminUser, isInitialized } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ No user
  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ Has user but not admin role
  if (adminUser.role !== "admin") {
    console.log(`⛔ Role is "${adminUser.role}" - access denied`);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? "ml-64" : "ml-20"
      }`}>
        <Topbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}