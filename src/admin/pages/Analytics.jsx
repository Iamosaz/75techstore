// src/admin/pages/Analytics.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  FiUsers,
  FiShoppingBag,
  FiActivity,
  FiRefreshCw,
  FiTool,
  FiRepeat,
  FiSmartphone,
  FiAlertCircle,
  FiClock,
  FiWifi,
  FiWifiOff,
  FiPackage
} from "react-icons/fi";

// Live server API URL
const API_URL = "http://localhost:5000/api/analytics/dashboard";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("today");
  const [isLive, setIsLive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [data, setData] = useState({
    summary: {
      revenue: 0,
      totalOrders: 0,
      paidOrders: 0,
      pendingOrders: 0,
      avgOrderValue: 0,
      totalUsers: 0,
      newUsers: 0,
      totalProducts: 0,
      repairsCount: 0,
      swapsCount: 0,
      engineerRequestsCount: 0,
      digitalServicesCount: 0,
    },
    categories: [],
    activities: [],
  });

  const getAuthToken = () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        return parsed.token || parsed.accessToken;
      }
    } catch (e) {
      console.error(e);
    }
    return localStorage.getItem("token") || localStorage.getItem("adminToken");
  };

  const fetchAnalytics = useCallback(async () => {
    try {
      setError(null);
      const token = getAuthToken();
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}?timeRange=${timeRange}`, { headers });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(`Server connection error: status ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        setData(resData.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Analytics network error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 20000); // 20s
    return () => clearInterval(interval);
  }, [isLive, fetchAnalytics]);

  const formatNaira = (num) => `₦${Number(num || 0).toLocaleString()}`;

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return "Just now";
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "order": return <FiShoppingBag className="text-blue-600" />;
      case "repair": return <FiTool className="text-emerald-600" />;
      case "swap": return <FiRepeat className="text-purple-600" />;
      default: return <FiActivity className="text-amber-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (["paid", "completed", "delivered", "booked"].includes(s)) {
      return "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400";
    }
    if (["pending", "processing", "diagnosing", "device received"].includes(s)) {
      return "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400";
    }
    return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
  };

  const { summary, categories, activities } = data;
  const totalServices =
    summary.repairsCount +
    summary.swapsCount +
    summary.engineerRequestsCount +
    summary.digitalServicesCount;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Real-Time Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Live database sync • {lastUpdated ? `Sync: ${lastUpdated.toLocaleTimeString()}` : "Fetching..."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all flex items-center gap-2 ${
              isLive
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
            }`}
          >
            {isLive ? <FiWifi className="animate-pulse" /> : <FiWifiOff />}
            {isLive ? "Live Streaming" : "Paused"}
          </button>

          <select
            value={timeRange}
            onChange={(e) => {
              setLoading(true);
              setTimeRange(e.target.value);
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-lg px-3 py-2"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={() => {
              setLoading(true);
              fetchAnalytics();
            }}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"
          >
            <FiRefreshCw className={`text-sm ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-2 text-red-700 text-sm">
          <FiAlertCircle className="text-lg shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Today's Revenue</p>
          <h3 className="text-2xl font-bold mt-2">{formatNaira(summary.revenue)}</h3>
          <p className="text-xs text-slate-400 mt-2">{summary.paidOrders} transactions</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Accounts</p>
          <h3 className="text-2xl font-bold mt-2">{summary.totalUsers}</h3>
          <p className="text-xs text-slate-400 mt-2">+{summary.newUsers} registrants</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Active Sales Volume</p>
          <h3 className="text-2xl font-bold mt-2">{summary.totalOrders}</h3>
          <p className="text-xs text-slate-400 mt-2">Avg Order: {formatNaira(summary.avgOrderValue)}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Service Requests</p>
          <h3 className="text-2xl font-bold mt-2">{totalServices}</h3>
          <p className="text-xs text-slate-400 mt-2">Repairs: {summary.repairsCount} · Swaps: {summary.swapsCount}</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-base font-semibold mb-1">Store Segments</h2>
          <p className="text-xs text-slate-400 mb-6">Fulfillment breakdown</p>

          <div className="space-y-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>{cat.name}</span>
                  <span className="font-bold">{cat.count} requests</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full`}
                    style={{
                      width: `${
                        totalServices + summary.totalOrders > 0
                          ? Math.max(5, (cat.count / (totalServices + summary.totalOrders)) * 100)
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-base font-semibold mb-4">Live Database Events</h2>

          {activities.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FiClock className="text-3xl mx-auto mb-2 opacity-50" />
              <p className="text-sm">No transaction activity recorded yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {activities.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {getActivityIcon(item.type)}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate">{item.text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{getTimeAgo(item.createdAt)}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold">{item.amount}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase mt-1 inline-block ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}