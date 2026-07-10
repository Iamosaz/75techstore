// src/admin/pages/Analytics.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const formatNaira = (amount) => `₦${Number(amount || 0).toLocaleString()}`;
const formatShortNaira = (amount) => {
  const num = Number(amount || 0);
  if (num >= 1000000) return `₦${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `₦${(num / 1000).toFixed(0)}K`;
  return `₦${num}`;
};

// ─── Stat Card Component ──────────────────────────────────────────
const StatCard = ({ icon, label, value, trend, trendLabel, color, pulse }) => (
  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100
                  shadow-sm hover:shadow-md transition-all duration-300
                  hover:border-blue-200 group">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center
                       justify-center text-xl sm:text-2xl ${color || 'bg-blue-50'}`}>
        {icon}
      </div>
      {trend !== undefined && trend !== '0' && trend !== 0 && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          Number(trend) >= 0
            ? 'bg-green-50 text-green-600'
            : 'bg-red-50 text-red-600'
        }`}>
          {Number(trend) >= 0 ? '↑' : '↓'} {Math.abs(Number(trend))}%
        </span>
      )}
      {pulse && (
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full
                           rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </span>
      )}
    </div>
    <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1">{label}</p>
    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900
                  group-hover:text-blue-600 transition-colors">
      {value}
    </p>
    {trendLabel && (
      <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{trendLabel}</p>
    )}
  </div>
);

// ─── Chart Card Wrapper ───────────────────────────────────────────
const ChartCard = ({ title, icon, children, action }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm
                  hover:shadow-md transition-all duration-300 overflow-hidden">
    <div className="flex items-center justify-between px-4 sm:px-6 py-4
                    border-b border-gray-50">
      <h3 className="text-sm sm:text-base font-bold text-gray-900
                     flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        {title}
      </h3>
      {action}
    </div>
    <div className="p-4 sm:p-6">
      {children}
    </div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────
const EmptyChart = ({ icon, message }) => (
  <div className="flex flex-col items-center justify-center h-48 text-gray-300">
    <span className="text-4xl mb-2">{icon}</span>
    <p className="text-sm">{message}</p>
  </div>
);

// ─── Custom Tooltip ───────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((item, i) => (
        <p key={i} className="font-semibold">
          {prefix}{typeof item.value === 'number' && item.value > 100
            ? Number(item.value).toLocaleString()
            : item.value
          }
        </p>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN ANALYTICS COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getToken = () => localStorage.getItem('adminToken');

  const fetchAnalytics = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      else setLoading(true);
      setError('');

      const { data: res } = await axios.get(
        `${API_URL}/analytics?days=${days}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setData(res);
      setLastUpdated(new Date());

    } catch (err) {
      console.error('❌ Analytics error:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [days]);

  // ✅ Fetch on mount and when days change
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // ✅ Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAnalytics(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  // ─── Loading State ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full" />
            <div className="absolute top-0 w-16 h-16 border-4 border-blue-600
                            border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-500 mt-6 text-sm font-medium">
            Loading real-time analytics...
          </p>
          <p className="text-gray-400 mt-1 text-xs">
            Fetching data from MongoDB
          </p>
        </div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────────────
  if (error && !data) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center py-32">
          <span className="text-5xl mb-4">⚠️</span>
          <p className="text-red-600 font-semibold text-lg">{error}</p>
          <button
            onClick={() => fetchAnalytics()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white
                       px-6 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  const { overview, charts, topProducts, topCategories,
    ordersByStatus, recentOrders, lowStockItems } = data || {};

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-5">

      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center
                      justify-between gap-4 mb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900
                         flex items-center gap-2">
            📊 Analytics Dashboard
            {isRefreshing && (
              <span className="inline-block w-4 h-4 border-2 border-blue-600
                               border-t-transparent rounded-full animate-spin" />
            )}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-gray-400 text-xs sm:text-sm">
              Real-time data from MongoDB
            </p>
            {lastUpdated && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full
                                   rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white
                       font-medium cursor-pointer"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last 12 months</option>
          </select>
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={isRefreshing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2
                       rounded-xl text-xs sm:text-sm font-semibold transition
                       disabled:opacity-60 flex items-center gap-1.5"
          >
            {isRefreshing ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent
                                rounded-full animate-spin" />
                <span className="hidden sm:inline">Refreshing...</span>
              </>
            ) : (
              <>
                🔄 <span className="hidden sm:inline">Refresh</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ═══ TODAY'S HIGHLIGHT ═══ */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700
                      rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center
                        justify-between gap-4">
          <div>
            <p className="text-blue-200 text-xs sm:text-sm font-medium">
              Today's Performance
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-1">
              {formatNaira(overview?.todayRevenue)}
            </h2>
            <p className="text-blue-200 text-xs mt-1">
              {overview?.todayOrders || 0} orders · {overview?.todayUsers || 0} new users
            </p>
          </div>
          <div className="flex gap-4 sm:gap-6">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold">
                {overview?.todayOrders || 0}
              </p>
              <p className="text-blue-200 text-xs">Orders</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold">
                {overview?.todayUsers || 0}
              </p>
              <p className="text-blue-200 text-xs">New Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ OVERVIEW STATS ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon="💰"
          label="Total Revenue"
          value={formatNaira(overview?.totalRevenue)}
          trend={overview?.revenueGrowth}
          trendLabel={`${formatShortNaira(overview?.monthRevenue)} this month`}
          color="bg-green-50"
        />
        <StatCard
          icon="📦"
          label="Total Orders"
          value={overview?.totalOrders || 0}
          trend={overview?.orderGrowth}
          trendLabel={`${overview?.pendingOrders || 0} pending`}
          color="bg-blue-50"
        />
        <StatCard
          icon="👥"
          label="Total Users"
          value={overview?.totalUsers || 0}
          trendLabel={`${overview?.newUsersThisMonth || 0} new this month`}
          color="bg-purple-50"
        />
        <StatCard
          icon="🛍️"
          label="Products"
          value={overview?.totalProducts || 0}
          trendLabel={`${overview?.lowStockProducts || 0} low stock`}
          color="bg-orange-50"
        />
        <StatCard
          icon="💳"
          label="Avg Order Value"
          value={formatNaira(overview?.avgOrderValue)}
          color="bg-indigo-50"
        />
        <StatCard
          icon="✅"
          label="Delivered"
          value={overview?.deliveredOrders || 0}
          color="bg-green-50"
        />
        <StatCard
          icon="⏳"
          label="Pending"
          value={overview?.pendingOrders || 0}
          color="bg-yellow-50"
          pulse={overview?.pendingOrders > 0}
        />
        <StatCard
          icon="📝"
          label="Blogs Published"
          value={overview?.totalBlogs || 0}
          color="bg-sky-50"
        />
      </div>

      {/* ═══ REVENUE CHART ═══ */}
      <ChartCard title="Revenue Over Time" icon="💰">
        {charts?.revenuePerDay?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={charts.revenuePerDay}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="_id"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickFormatter={(val) => val?.slice(5)}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickFormatter={(val) => formatShortNaira(val)}
              />
              <Tooltip content={
                <CustomTooltip prefix="₦" />
              } />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={{ fill: '#3b82f6', r: 3 }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart icon="📈" message="No revenue data for this period" />
        )}
      </ChartCard>

      {/* ═══ ORDERS CHART ═══ */}
      <ChartCard title="Orders Over Time" icon="📦">
        {charts?.ordersPerDay?.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={charts.ordersPerDay}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#93c5fd" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="_id"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickFormatter={(val) => val?.slice(5)}
              />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="orders"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart icon="📦" message="No order data for this period" />
        )}
      </ChartCard>

      {/* ═══ MONTHLY REVENUE + ORDER STATUS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Monthly Revenue */}
        <ChartCard title="Monthly Revenue" icon="📅">
          {charts?.revenuePerMonth?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={charts.revenuePerMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="_id"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickFormatter={(val) => formatShortNaira(val)}
                />
                <Tooltip content={<CustomTooltip prefix="₦" />} />
                <Bar
                  dataKey="revenue"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart icon="📅" message="No monthly data" />
          )}
        </ChartCard>

        {/* Order Status Pie */}
        <ChartCard title="Order Status" icon="🥧">
          {ordersByStatus?.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {ordersByStatus.map((_, index) => (
                      <Cell
                        key={index}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2 min-w-[130px]">
                {ordersByStatus.map((entry, i) => (
                  <div key={entry._id} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <span className="text-xs text-gray-600 capitalize flex-1">
                      {entry._id}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {entry.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyChart icon="🥧" message="No order data" />
          )}
        </ChartCard>
      </div>

      {/* ═══ TOP PRODUCTS + CATEGORIES ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Top Products */}
        <ChartCard title="Top Selling Products" icon="🏆">
          {topProducts?.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, i) => (
                <div key={i}
                  className="flex items-center gap-3 p-3 rounded-xl
                             bg-gray-50 hover:bg-blue-50 transition-colors
                             border border-gray-100">
                  <div className={`w-8 h-8 rounded-lg flex items-center
                                  justify-center text-white text-xs font-bold
                                  flex-shrink-0 ${
                    i === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    i === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-500' :
                    'bg-gradient-to-br from-blue-300 to-blue-500'
                  }`}>
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {product.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.totalSold} sold
                    </p>
                  </div>
                  <p className="text-sm font-bold text-green-600 flex-shrink-0">
                    {formatShortNaira(product.totalRevenue)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyChart icon="🏆" message="No sales data yet" />
          )}
        </ChartCard>

        {/* Categories */}
        <ChartCard title="Products by Category" icon="📂">
          {topCategories?.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((cat, i) => {
                const maxCount = topCategories[0]?.count || 1;
                const percent = Math.round((cat.count / maxCount) * 100);
                return (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700">
                        {cat._id || 'Other'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {cat.count} products · {cat.totalStock} in stock
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-2.5 rounded-full transition-all duration-700"
                        style={{
                          width: `${percent}%`,
                          background: `linear-gradient(90deg, ${
                            CHART_COLORS[i % CHART_COLORS.length]
                          }, ${CHART_COLORS[(i + 1) % CHART_COLORS.length]})`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyChart icon="📂" message="No category data" />
          )}
        </ChartCard>
      </div>

      {/* ═══ RECENT ORDERS + LOW STOCK ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Orders */}
        <ChartCard title="Recent Orders" icon="🕐">
          {recentOrders?.length > 0 ? (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div key={order._id}
                  className="flex items-center justify-between p-3
                             bg-gray-50 rounded-xl border border-gray-100
                             hover:bg-blue-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {order.user?.name || order.user?.email || 'Guest'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className={`text-[10px] sm:text-xs font-bold px-2 py-1
                                     rounded-full capitalize ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      {formatShortNaira(order.totalPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyChart icon="📦" message="No recent orders" />
          )}
        </ChartCard>

        {/* Low Stock */}
        <ChartCard
          title="Low Stock Alert"
          icon="⚠️"
          action={
            lowStockItems?.length > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-bold
                               px-2.5 py-1 rounded-full animate-pulse">
                {lowStockItems.length} items
              </span>
            )
          }
        >
          {lowStockItems?.length > 0 ? (
            <div className="space-y-2">
              {lowStockItems.map((product) => (
                <div key={product._id}
                  className={`flex items-center justify-between p-3
                             rounded-xl border transition-colors ${
                    product.stock === 0
                      ? 'bg-red-50 border-red-200 hover:bg-red-100'
                      : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                  }`}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.category} · {formatNaira(product.price)}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                                    flex-shrink-0 ml-2 ${
                    product.stock === 0
                      ? 'bg-red-200 text-red-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {product.stock === 0 ? 'OUT' : `${product.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-green-400">
              <span className="text-4xl mb-2">✅</span>
              <p className="text-sm font-medium">All products well stocked!</p>
            </div>
          )}
        </ChartCard>
      </div>

      {/* ═══ USERS CHART ═══ */}
      <ChartCard title="New User Signups" icon="👥">
        {charts?.usersPerDay?.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={charts.usersPerDay}>
              <defs>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="_id"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickFormatter={(val) => val?.slice(5)}
              />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#userGradient)"
                dot={{ fill: '#8b5cf6', r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart icon="👥" message="No user signup data for this period" />
        )}
      </ChartCard>

      {/* ═══ FOOTER ═══ */}
      <div className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
        <p>
          📊 Auto-refreshes every 30 seconds ·
          Last updated: {lastUpdated?.toLocaleTimeString() || 'Loading...'}
        </p>
        <p className="mt-1">
          Powered by MongoDB · 75TechStore Admin
        </p>
      </div>

    </div>
  );
}