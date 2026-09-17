// src/admin/pages/Analytics.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  FiTrendingUp, FiSearch, FiShoppingBag, FiMessageCircle,
  FiGlobe, FiDollarSign, FiActivity, FiRefreshCw
} from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const formatNaira = (val) => `₦${Number(val || 0).toLocaleString()}`;
const formatShortNaira = (val) => {
  const num = Number(val || 0);
  if (num >= 1000000) return `₦${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `₦${(num / 1000).toFixed(0)}K`;
  return `₦${num}`;
};

const StatCard = ({ icon, label, value, subText, color }) => (
  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{label}</span>
      <span className={`w-9 h-9 flex items-center justify-center rounded-xl text-lg ${color || 'bg-blue-50 text-blue-600'}`}>
        {icon}
      </span>
    </div>
    <h3 className="text-xl sm:text-2xl font-black text-gray-900">{value}</h3>
    {subText && <p className="text-[10px] text-gray-400 mt-1 font-medium">{subText}</p>}
  </div>
);

const MetricCard = ({ icon, label, value, badge, bg }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex flex-col justify-between space-y-3">
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center text-lg`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{badge}</span>
    </div>
    <div>
      <p className="text-xs text-gray-500 font-semibold">{label}</p>
      <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('operations');
  const [operationsData, setOperationsData] = useState(null);
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30days');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const abortControllerRef = useRef(null);

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
  });

  const getSEODays = () => {
    switch (timeRange) {
      case 'today': return '1';
      case '7days': return '7';
      case '30days': return '30';
      case '90days': return '90';
      case 'all': return '365';
      default: return '30';
    }
  };

  const fetchAll = useCallback(async (silent = false) => {
    // Abort previous request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError('');

      const config = {
        ...getAuthConfig(),
        signal: abortControllerRef.current.signal,
      };

      const [dashRes, seoRes] = await Promise.all([
        axios.get(`${API_URL}/analytics/dashboard?timeRange=${timeRange}`, config),
        axios.get(`${API_URL}/analytics/seo-report?days=${getSEODays()}`, config)
      ]);

      if (dashRes.data?.success) setOperationsData(dashRes.data.data);
      if (seoRes.data) setSeoData(seoRes.data);

      setLastUpdated(new Date());
    } catch (err) {
      if (axios.isCancel(err)) return;
      if (err.response?.status === 429) {
        setError('Rate limit reached. Please wait a moment before refreshing.');
      } else {
        setError(err.response?.data?.message || 'Failed to load analytics');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAll();
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchAll]);

  // ✅ Auto-refresh every 60 seconds only when tab is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchAll(true);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchAll]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-gray-500 font-semibold mt-4">Connecting to Live Analytics...</span>
      </div>
    );
  }

  if (error && !operationsData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <span className="text-5xl mb-3">⚠️</span>
        <h3 className="text-lg font-black text-gray-900">Analytics Connection Paused</h3>
        <p className="text-sm text-gray-500 text-center max-w-xs mt-1 mb-4">{error}</p>
        <button onClick={() => fetchAll()} className="bg-blue-600 text-white font-bold px-6 py-2 rounded-xl text-sm shadow hover:bg-blue-700 transition">
          Retry
        </button>
      </div>
    );
  }

  const { summary = {}, activities = [], lowStockItems = [], ordersByStatus = [], charts = {} } = operationsData || {};
  const seo = seoData || {};

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-6">

      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            📊 Analytics & Intelligence
            {refreshing && (
              <FiRefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            )}
          </h1>
          <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative rounded-full h-2 w-2 bg-green-500" />
            </span>
            Live tracking active · {lastUpdated?.toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm bg-white font-semibold outline-none cursor-pointer hover:border-gray-300"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="all">All-Time</option>
          </select>
          <button
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            className="bg-blue-600 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow hover:bg-blue-700 transition disabled:opacity-60"
          >
            <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ═══ TAB SWITCHER ═══ */}
      <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-200 inline-flex gap-1">
        <button
          onClick={() => setActiveTab('operations')}
          className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'operations' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          ⚙️ Operations & Revenue
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'seo' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🔍 SEO & Traffic Channels
        </button>
      </div>

      {/* ═══ TAB 1: OPERATIONS & REVENUE ═══ */}
      {activeTab === 'operations' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard icon="₦" label="Total Revenue" value={formatNaira(summary.revenue)} subText="Paid & completed sales" color="bg-emerald-50 text-emerald-600" />
            <StatCard icon="📦" label="Total Orders" value={summary.totalOrders || 0} subText={`${summary.pendingOrders || 0} pending`} color="bg-blue-50 text-blue-600" />
            <StatCard icon="🔧" label="Device Repairs" value={summary.repairsCount || 0} subText="Service requests" color="bg-amber-50 text-amber-600" />
            <StatCard icon="🔄" label="Swap Deals" value={summary.swapsCount || 0} subText="Trade-in upgrades" color="bg-purple-50 text-purple-600" />
            <StatCard icon="👥" label="New Customers" value={summary.newUsers || 0} subText={`${summary.totalUsers || 0} registered total`} color="bg-sky-50 text-sky-600" />
            <StatCard icon="💰" label="Avg Order Value" value={formatNaira(summary.avgOrderValue)} subText="Average per cart" color="bg-indigo-50 text-indigo-600" />
            <StatCard icon="⚡" label="Digital Projects" value={summary.digitalServicesCount || 0} subText="Consulting requests" color="bg-violet-50 text-violet-600" />
            <StatCard
              icon="🛠️"
              label="Low Stock Alerts"
              value={summary.lowStockProducts || 0}
              subText="Items with ≤ 5 units"
              color={summary.lowStockProducts > 0 ? "bg-red-50 text-red-600 font-bold" : "bg-green-50 text-green-600"}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm lg:col-span-2">
              <h3 className="font-bold text-gray-900 text-sm mb-4">📈 Revenue Stream Timeline</h3>
              {charts?.ordersPerDay?.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={charts.ordersPerDay}>
                    <defs>
                      <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="_id" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={formatShortNaira} />
                    <Tooltip formatter={(value, name) => [name === 'revenue' ? formatNaira(value) : value, name]} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#areaColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-300">
                  <span className="text-3xl">🗓️</span>
                  <span className="text-xs mt-2">No transaction data available for this range</span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-4">🥧 Order Statuses</h3>
              {ordersByStatus?.length > 0 ? (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={ordersByStatus} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={40} outerRadius={65}>
                        {ordersByStatus.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 w-full mt-3 overflow-y-auto max-h-[80px]">
                    {ordersByStatus.map((item, i) => (
                      <div key={item._id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="text-gray-500 capitalize">{item._id}</span>
                        </div>
                        <span className="font-bold text-gray-800">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-300">
                  <span className="text-3xl">🥧</span>
                  <span className="text-xs mt-2">No order data</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm lg:col-span-2">
              <h3 className="font-bold text-gray-900 text-sm mb-3">🕒 Operations Activity Feed</h3>
              <div className="space-y-3 overflow-y-auto max-h-[380px]">
                {activities.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">No recent activities.</p>
                ) : (
                  activities.map((act) => (
                    <div key={act.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{act.text}</p>
                        <p className="text-[10px] text-gray-400">{new Date(act.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          act.type === 'order' ? 'bg-blue-100 text-blue-700' :
                          act.type === 'repair' ? 'bg-amber-100 text-amber-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>{act.type}</span>
                        <span className="text-xs font-black text-gray-900">{act.amount}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-3">⚠️ Warehouse Low Stock</h3>
              <div className="space-y-3 overflow-y-auto max-h-[380px]">
                {lowStockItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-emerald-500">
                    <span className="text-4xl mb-2">✅</span>
                    <span className="text-xs font-semibold">Inventory well stocked</span>
                  </div>
                ) : (
                  lowStockItems.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-400 capitalize">{item.category} · {formatNaira(item.price)}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.stock === 0 ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'
                      }`}>{item.stock === 0 ? 'OUT' : `${item.stock} left`}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══ TAB 2: SEO & TRAFFIC CHANNELS ═══ */}
      {activeTab === 'seo' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard
              icon={<FiGlobe className="text-blue-600" />}
              label="Tracked Pageviews"
              value={seo.summary?.totalSessions?.toLocaleString() || 0}
              badge="Live Traffic"
              bg="bg-blue-50"
            />
            <MetricCard
              icon={<FiDollarSign className="text-green-600" />}
              label="Attributed Revenue"
              value={formatNaira(seo.summary?.totalRevenue)}
              badge="Total Sales"
              bg="bg-green-50"
            />
            <MetricCard
              icon={<FiShoppingBag className="text-purple-600" />}
              label="Orders Converted"
              value={seo.summary?.totalConversions?.toLocaleString() || 0}
              badge="Purchases"
              bg="bg-purple-50"
            />
            <MetricCard
              icon={<FiActivity className="text-amber-600" />}
              label="Conversion Rate"
              value={seo.summary?.conversionRate || "0.00%"}
              badge="Visit-to-Order"
              bg="bg-amber-50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm border border-gray-200 space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <FiSearch className="text-blue-600" /> Traffic Channel & Lead Attribution
                </h2>
                <span className="text-xs font-semibold text-gray-400">Visitor Origins</span>
              </div>

              <div className="divide-y divide-gray-100">
                {seo.trafficSources?.map((source) => (
                  <div key={source._id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold">
                        {source._id.includes("Google") ? "🔍" :
                         source._id.includes("AI") ? "🤖" :
                         source._id.includes("WhatsApp") ? "💬" : "🌐"}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{source._id}</p>
                        <p className="text-xs text-gray-400">
                          {source.visits} visits · {source.conversions} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-green-700">
                        {formatNaira(source.revenue)}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
                  <FiTrendingUp className="text-green-600" /> Top Content That Sells
                </h2>
                <div className="space-y-3">
                  {seo.topPages?.length === 0 ? (
                    <p className="text-center text-gray-400 py-4 text-xs">Visits will automatically rank here.</p>
                  ) : (
                    seo.topPages?.map((page, i) => (
                      <div key={page._id} className="flex items-center justify-between text-xs p-2.5 bg-gray-50 rounded-xl">
                        <div className="truncate max-w-[200px]">
                          <span className="font-bold text-gray-800">{i + 1}. {page._id}</span>
                          <p className="text-[10px] text-gray-400">{page.views} views</p>
                        </div>
                        <span className="font-extrabold text-green-700">
                          {formatNaira(page.revenue)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 space-y-4">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
                  <FiMessageCircle className="text-green-500" /> WhatsApp Lead Generation
                </h2>
                <div className="space-y-2">
                  {seo.whatsappLeads?.length === 0 ? (
                    <p className="text-center text-gray-400 py-4 text-xs">WhatsApp clicks will be recorded here.</p>
                  ) : (
                    seo.whatsappLeads?.map((item) => (
                      <div key={item._id} className="flex items-center justify-between text-xs py-1.5">
                        <span className="text-gray-700 font-medium truncate max-w-[220px]">{item._id}</span>
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">
                          {item.leadsCount} chats
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}