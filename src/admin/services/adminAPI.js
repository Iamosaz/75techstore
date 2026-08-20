/**
 * Real API Service - Connects to Node.js/Express Backend
 * 75TechStore Admin API
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const TIMEOUT = 30000;

// ✅ Get correct token based on who is calling
const getAdminToken = () => localStorage.getItem("adminToken");
const getCustomerToken = () => localStorage.getItem("75token");

/**
 * Fetch wrapper with timeout and error handling
 */
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const token = getAdminToken();

    if (!token) {
      console.warn("⚠️ No adminToken found in localStorage for:", url);
    }

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      console.error("🔒 401 Unauthorized - Token invalid or expired");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      window.location.href = "/admin/login";
      throw new Error("Token invalid or expired");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// ✅ Customer fetch - uses customer token (75token)
const customerFetch = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const token = getCustomerToken();

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      console.error("🔒 401 Unauthorized - Customer token invalid");
      localStorage.removeItem("75token");
      localStorage.removeItem("75user");
      window.location.href = "/login";
      throw new Error("Token invalid or expired");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// ========== AUTHENTICATION API ==========
export const authAPI = {
  login: async (email, password) => {
    console.log(`🔐 Logging in: ${email}`);
    return fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    console.log("🚪 Logging out");
    return fetchWithTimeout(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
    });
  },

  getProfile: async () => {
    console.log("👤 Fetching profile");
    return fetchWithTimeout(`${API_BASE_URL}/auth/profile`, {
      method: "GET",
    });
  },

  updateProfile: async (userData) => {
    console.log("✏️ Updating profile");
    return fetchWithTimeout(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    console.log("🔑 Changing password");
    return fetchWithTimeout(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// ========== USERS API ==========
export const userAPI = {
  getAll: async (page = 1, limit = 10, search = "") => {
    console.log(`👥 Fetching users - Page: ${page}, Search: ${search}`);
    const params = new URLSearchParams({ page, limit, search });
    return fetchWithTimeout(`${API_BASE_URL}/users?${params}`, {
      method: "GET",
    });
  },

  getById: async (id) => {
    console.log(`👤 Fetching user: ${id}`);
    return fetchWithTimeout(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
    });
  },

  create: async (userData) => {
    console.log("➕ Creating user");
    return fetchWithTimeout(`${API_BASE_URL}/users`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  update: async (id, userData) => {
    console.log(`🔄 Updating user: ${id}`);
    return fetchWithTimeout(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  delete: async (id) => {
    console.log(`🗑️ Deleting user: ${id}`);
    return fetchWithTimeout(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
  },

  toggleStatus: async (id, status) => {
    console.log(`🔀 Toggling user status: ${id} -> ${status}`);
    return fetchWithTimeout(`${API_BASE_URL}/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

// ========== PRODUCTS API ==========
export const productAPI = {
  getAll: async (
    page = 1,
    limit = 10,
    search = "",
    category = "",
    status = ""
  ) => {
    console.log(`📦 Fetching products - Page: ${page}, Search: ${search}`);
    const params = new URLSearchParams({
      page, limit, search, category, status
    });
    return fetchWithTimeout(`${API_BASE_URL}/products?${params}`, {
      method: "GET",
    });
  },

  getById: async (id) => {
    console.log(`📦 Fetching product: ${id}`);
    return fetchWithTimeout(`${API_BASE_URL}/products/${id}`, {
      method: "GET",
    });
  },

  create: async (formData) => {
    console.log("➕ Creating product");
    const token = getAdminToken();
    return fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }).then((res) => {
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        window.location.href = "/admin/login";
        throw new Error("Token invalid or expired");
      }
      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    });
  },

  update: async (id, formData) => {
    console.log(`🔄 Updating product: ${id}`);
    const token = getAdminToken();
    return fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }).then((res) => {
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        window.location.href = "/admin/login";
        throw new Error("Token invalid or expired");
      }
      if (!res.ok) throw new Error("Failed to update product");
      return res.json();
    });
  },

  delete: async (id) => {
    console.log(`🗑️ Deleting product: ${id}`);
    return fetchWithTimeout(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
    });
  },

  getStats: async () => {
    console.log("📊 Fetching product stats");
    return fetchWithTimeout(`${API_BASE_URL}/products/stats`, {
      method: "GET",
    });
  },

  getCategories: async () => {
    console.log("🏷️ Fetching categories");
    return fetchWithTimeout(`${API_BASE_URL}/products/categories`, {
      method: "GET",
    });
  },
};

// ========== ORDERS API ==========
export const orderAPI = {
  // ✅ Admin - get all orders
  getAll: async (page = 1, limit = 20, status = "", search = "") => {
    console.log(`🛒 Fetching orders - Page: ${page}, Status: ${status}`);
    const params = new URLSearchParams({ page, limit });
    if (status) params.append("status", status);
    if (search) params.append("search", search);
    return fetchWithTimeout(`${API_BASE_URL}/orders?${params}`, {
      method: "GET",
    });
  },

  // ✅ Admin - get single order
  getById: async (id) => {
    console.log(`🛒 Fetching order: ${id}`);
    return fetchWithTimeout(`${API_BASE_URL}/orders/${id}`, {
      method: "GET",
    });
  },

  // ✅ Admin - update order status
  updateStatus: async (id, data) => {
    console.log(`🔄 Updating order: ${id} -> ${data.orderStatus}`);
    return fetchWithTimeout(`${API_BASE_URL}/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // ✅ Public - track order by order number (no token needed)
  trackOrder: async (orderNumber) => {
    console.log(`🔍 Tracking order: ${orderNumber}`);
    const response = await fetch(
      `${API_BASE_URL}/orders/track/${orderNumber}`,
      { method: "GET" }
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Order not found");
    }
    return response.json();
  },

  // ✅ Customer - cancel order (uses customer token)
  cancelOrder: async (id, cancelReason) => {
    console.log(`❌ Cancelling order: ${id}`);
    return customerFetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ cancelReason }),
    });
  },

  // ✅ Customer - get my orders (uses customer token)
  getMyOrders: async () => {
    console.log("📦 Fetching my orders");
    return customerFetch(`${API_BASE_URL}/orders/my-orders`, {
      method: "GET",
    });
  },

  // ✅ Customer - create order (uses customer token)
  createOrder: async (orderData) => {
    console.log("🛒 Creating order");
    return customerFetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  getStats: async () => {
    console.log("📊 Fetching order stats");
    return fetchWithTimeout(`${API_BASE_URL}/orders/stats`, {
      method: "GET",
    });
  },

  exportOrders: async (format = "csv") => {
    console.log("📥 Exporting orders");
    const token = getAdminToken();
    window.location.href =
      `${API_BASE_URL}/orders/export?format=${format}&token=${token}`;
  },
};

// ========== ANALYTICS API ==========
export const analyticsAPI = {
  getSalesData: async (days = 30) => {
    console.log(`📈 Fetching sales data - Last ${days} days`);
    return fetchWithTimeout(
      `${API_BASE_URL}/analytics/sales?days=${days}`,
      { method: "GET" }
    );
  },

  getRevenueData: async (days = 30) => {
    console.log(`💰 Fetching revenue data - Last ${days} days`);
    return fetchWithTimeout(
      `${API_BASE_URL}/analytics/revenue?days=${days}`,
      { method: "GET" }
    );
  },

  getTopProducts: async (limit = 5) => {
    console.log(`⭐ Fetching top ${limit} products`);
    return fetchWithTimeout(
      `${API_BASE_URL}/analytics/top-products?limit=${limit}`,
      { method: "GET" }
    );
  },

  getDashboardStats: async () => {
    console.log("🎯 Fetching dashboard stats");
    return fetchWithTimeout(
      `${API_BASE_URL}/analytics/dashboard-stats`,
      { method: "GET" }
    );
  },

  getCustomerStats: async (days = 30) => {
    console.log(`👥 Fetching customer stats - Last ${days} days`);
    return fetchWithTimeout(
      `${API_BASE_URL}/analytics/customer-stats?days=${days}`,
      { method: "GET" }
    );
  },

  getProductStats: async () => {
    console.log("📦 Fetching product stats");
    return fetchWithTimeout(
      `${API_BASE_URL}/analytics/product-stats`,
      { method: "GET" }
    );
  },

  getOrderStats: async () => {
    console.log("🛒 Fetching order stats");
    return fetchWithTimeout(
      `${API_BASE_URL}/analytics/order-stats`,
      { method: "GET" }
    );
  },

  getMonthlyComparison: async () => {
    console.log("📊 Fetching monthly comparison");
    return fetchWithTimeout(
      `${API_BASE_URL}/analytics/monthly-comparison`,
      { method: "GET" }
    );
  },
};

// ========== BLOG API ==========
export const blogAPI = {
  getAll: async (page = 1, limit = 6, search = "", category = "") => {
    console.log(`📝 Fetching blog posts - Page: ${page}`);
    const params = new URLSearchParams({ page, limit, search, category });
    return fetchWithTimeout(`${API_BASE_URL}/blog?${params}`, {
      method: "GET",
    });
  },

  getBySlug: async (slug) => {
    console.log(`📄 Fetching blog: ${slug}`);
    return fetchWithTimeout(`${API_BASE_URL}/blog/slug/${slug}`, {
      method: "GET",
    });
  },

  create: async (postData) => {
    console.log("📝 Creating blog post");
    return fetchWithTimeout(`${API_BASE_URL}/blog`, {
      method: "POST",
      body: JSON.stringify(postData),
    });
  },

  update: async (id, postData) => {
    console.log(`📝 Updating blog: ${id}`);
    return fetchWithTimeout(`${API_BASE_URL}/blog/${id}`, {
      method: "PUT",
      body: JSON.stringify(postData),
    });
  },

  delete: async (id) => {
    console.log(`🗑️ Deleting blog: ${id}`);
    return fetchWithTimeout(`${API_BASE_URL}/blog/${id}`, {
      method: "DELETE",
    });
  },
};

// ========== DEFAULT EXPORT ==========
export default {
  authAPI,
  userAPI,
  productAPI,
  orderAPI,
  analyticsAPI,
  blogAPI,
};