// src/admin/pages/Dashboard.jsx
import { useDashboard } from "../../hooks/useDashboard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Package,
  BookOpen,
  Eye,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Star,
  Tag,
  Layers,
  DollarSign,
} from "lucide-react";

// ─── SKELETON ─────────────────────────────────────────────────────
function Skeleton({ className }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  change,
  icon: Icon,
  prefix = "",
  suffix = "",
  color = "blue",
}) {
  const isPositive = change >= 0;
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {prefix}
        {typeof value === "number" ? value.toLocaleString() : value}
        {suffix}
      </p>
      {change !== undefined && (
        <div className="flex items-center mt-2 gap-1">
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          )}
          <span
            className={`text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {Math.abs(change)}% from last month
          </span>
        </div>
      )}
    </div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    published: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
        styles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────
export default function Dashboard() {
  const { data, loading, error, refetch } = useDashboard();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-gray-600 font-medium">Failed to load dashboard</p>
        <p className="text-sm text-red-500">{error}</p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* ─── HEADER ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time data from your 75TechStore
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-600 disabled:opacity-50 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ─── TOP STAT CARDS ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Products"
              value={data.products.total}
              change={data.products.change}
              icon={Package}
              color="blue"
            />
            <StatCard
              title="Inventory Value"
              value={Number(data.products.inventoryValue).toLocaleString()}
              icon={DollarSign}
              prefix="₦"
              color="green"
            />
            <StatCard
              title="Total Blog Posts"
              value={data.blogs.total}
              change={data.blogs.change}
              icon={BookOpen}
              color="purple"
            />
            <StatCard
              title="Total Blog Views"
              value={data.blogs.totalViews}
              icon={Eye}
              color="orange"
            />
          </>
        )}
      </div>

      {/* ─── PRODUCT METRICS ───────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Product Labels */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Product Labels
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Featured",
                  value: data.products.featured,
                  color: "bg-blue-50 text-blue-700",
                },
                {
                  label: "Top Picks",
                  value: data.products.topPicks,
                  color: "bg-purple-50 text-purple-700",
                },
                {
                  label: "Best Selling",
                  value: data.products.bestSelling,
                  color: "bg-green-50 text-green-700",
                },
                {
                  label: "New Arrivals",
                  value: data.products.newArrivals,
                  color: "bg-teal-50 text-teal-700",
                },
                {
                  label: "Deal of Day",
                  value: data.products.dealOfDay,
                  color: "bg-orange-50 text-orange-700",
                },
                {
                  label: "Discounted",
                  value: data.products.discounted,
                  color: "bg-red-50 text-red-700",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`p-3 rounded-lg ${item.color} flex items-center justify-between`}
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-lg font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Low Stock Alert
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data.products.lowStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <Package className="w-8 h-8 mb-2" />
              <p className="text-sm">All products have sufficient stock</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-500 px-1 mb-2">
                <span>Out of Stock Products</span>
                <span className="font-bold text-red-600">
                  {data.products.outOfStock} products
                </span>
              </div>
              {data.products.lowStock.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100"
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    {/* ✅ Fixed - ₦ with toLocaleString */}
                    <p className="text-xs text-gray-500">
                      {product.category} · ₦{Number(product.price).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      product.stock === 0 ? "text-red-600" : "text-orange-600"
                    }`}
                  >
                    {product.stock === 0 ? "Out" : `${product.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── CHARTS ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Products Added Per Month */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Products Added (Last 6 Months)
          </h2>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : data.products.chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.products.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar
                  dataKey="products"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Products"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Blog Views Per Month */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Blog Views (Last 6 Months)
          </h2>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : data.blogs.chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.blogs.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Views"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ─── CATEGORY BREAKDOWNS ───────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Product Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            Products by Category
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : data.products.categoryBreakdown.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              No products yet
            </p>
          ) : (
            <div className="space-y-3">
              {data.products.categoryBreakdown.map((cat) => (
                <div key={cat._id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{cat._id}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {cat.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${(cat.count / data.products.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Blog Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-purple-500" />
            Blogs by Category
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : data.blogs.categoryBreakdown.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              No blogs yet
            </p>
          ) : (
            <div className="space-y-3">
              {data.blogs.categoryBreakdown.map((cat) => (
                <div key={cat._id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{cat._id}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {cat.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${(cat.count / data.blogs.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── TOP SELLING + MOST VIEWED ─────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Top Selling Products
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data.products.topSelling.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <Package className="w-8 h-8 mb-2" />
              <p className="text-sm">No sales recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.products.topSelling.map((product, i) => (
                <div key={product._id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5">
                    {i + 1}
                  </span>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    {/* ✅ Fixed - ₦ with toLocaleString */}
                    <p className="text-xs text-gray-500">
                      {product.category} · ₦{Number(product.price).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    {product.sold} sold
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Most Viewed Blogs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-500" />
            Most Viewed Blogs
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data.blogs.mostViewed.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <BookOpen className="w-8 h-8 mb-2" />
              <p className="text-sm">No published blogs yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.blogs.mostViewed.map((blog, i) => (
                <div key={blog._id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {blog.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {blog.category} · {blog.readTime} min read
                    </p>
                  </div>
                  <span className="text-sm font-bold text-purple-600">
                    {blog.views} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── RECENT PRODUCTS TABLE ─────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Recently Added Products
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : data.products.recentProducts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No products yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Product</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Category</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Brand</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Price</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Stock</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Added</th>
                </tr>
              </thead>
              <tbody>
                {data.products.recentProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <span className="font-medium text-gray-900 truncate max-w-32">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{product.category}</td>
                    <td className="py-3 px-3 text-gray-600">{product.brand}</td>
                    {/* ✅ Fixed - ₦ with toLocaleString */}
                    <td className="py-3 px-3 font-semibold text-gray-900">
                      ₦{Number(product.price).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-semibold ${
                          product.stock === 0
                            ? "text-red-600"
                            : product.stock <= 5
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── RECENT BLOGS TABLE ────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Recent Blog Posts
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : data.blogs.recentBlogs.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No blogs yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Title</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Category</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Author</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Views</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.blogs.recentBlogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="py-3 px-3 font-medium text-gray-900 truncate max-w-48">
                      {blog.title}
                    </td>
                    <td className="py-3 px-3 text-gray-600">{blog.category}</td>
                    <td className="py-3 px-3 text-gray-600">{blog.author}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={blog.status} />
                    </td>
                    <td className="py-3 px-3 text-purple-600 font-semibold">
                      {blog.views}
                    </td>
                    <td className="py-3 px-3 text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── BOTTOM STAT CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Published Blogs"
              value={data.blogs.published}
              icon={BookOpen}
              color="green"
            />
            <StatCard
              title="Draft Blogs"
              value={data.blogs.drafts}
              icon={BookOpen}
              color="orange"
            />
            <StatCard
              title="Featured Blogs"
              value={data.blogs.featured}
              icon={Star}
              color="purple"
            />
            <StatCard
              title="Out of Stock"
              value={data.products.outOfStock}
              icon={AlertTriangle}
              color="red"
            />
          </>
        )}
      </div>
    </div>
  );
}