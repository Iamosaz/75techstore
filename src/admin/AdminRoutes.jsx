// src/admin/AdminRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Blog from "./pages/Blog";
import ChatbotManager from "./pages/ChatbotManager";
import Analytics from "./pages/Analytics"; 
import EngineerRequests from './pages/EngineerRequests'
import AdminRepairs from './pages/AdminRepairs'
import AdminDigitalServices from "./pages/AdminDigitalServices";
import AdminSwapDeals from './pages/AdminSwapDeals'
import AdminMemberships from "./pages/AdminMemberships";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />

      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="blog" element={<Blog />} />
        <Route path="chatbot" element={<ChatbotManager />} />
        <Route path="engineer-requests" element={<EngineerRequests />} />
        <Route path="repairs" element={<AdminRepairs />} />
        <Route path="digital-services" element={<AdminDigitalServices />} />
        <Route path="swap-deals" element={<AdminSwapDeals />} />
        <Route path="memberships" element={<AdminMemberships />} />
      </Route>

      <Route path="/" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}