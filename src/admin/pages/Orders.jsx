// 75Frontend/src/pages/admin/Orders.jsx
import React, { useState, useEffect } from "react";
import { FiSearch, FiDownload, FiEye, FiRefreshCw } from "react-icons/fi";
import Table from "../components/Table";
import { orderAPI } from "../services/adminAPI";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await orderAPI.getAll();
      // ✅ matches backend { success, orders, total }
      const data = response.orders || [];
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (order) => order.orderStatus === statusFilter
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      // ✅ matches backend - sends orderStatus
      await orderAPI.updateStatus(orderId, {
        orderStatus: newStatus,
        message: `Order ${newStatus} by admin`
      });
      await fetchOrders();
      // Update selected order status locally
      setSelectedOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const statusColors = {
    delivered: "bg-green-100 text-green-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    pending: "bg-gray-100 text-gray-800",
    confirmed: "bg-purple-100 text-purple-800",
  };

  const columns = [
    {
      key: "orderNumber",
      label: "Order ID",
      render: (value) => (
        <span className="font-mono text-sm font-semibold text-blue-600">
          {value}
        </span>
      )
    },
    {
      key: "customer",
      label: "Customer",
      render: (value) => (
        <div>
          <p className="font-medium text-sm">{value?.name || "N/A"}</p>
          <p className="text-xs text-gray-500">{value?.email || ""}</p>
        </div>
      )
    },
    {
      key: "totalAmount",
      label: "Amount",
      render: (value) => (
        <span className="font-bold text-gray-800">
          ₦{value?.toLocaleString() || "0"}
        </span>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (value) => (
        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
          {value?.length || 0} item(s)
        </span>
      )
    },
    {
      key: "orderStatus",
      label: "Status",
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[value] || "bg-gray-100 text-gray-800"}`}>
          {value}
        </span>
      ),
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (value) => (
        <span className={`text-xs font-semibold capitalize
          ${value === "paid" ? "text-green-600" :
            value === "failed" ? "text-red-600" :
            "text-yellow-600"}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value) => (
        <span className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric"
          })}
        </span>
      )
    },
    {
      key: "_id",
      label: "Action",
      render: (value, row) => (
        <button
          onClick={() => setSelectedOrder(row)}
          className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition text-xs font-medium"
        >
          <FiEye size={13} />
          <span>View</span>
        </button>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">
            Track and manage all customer orders
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchOrders}
            className="flex items-center space-x-2 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <FiRefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => orderAPI.exportOrders("csv")}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiDownload size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total", value: orders.length, color: "bg-blue-50 text-blue-700 border-blue-200" },
          { label: "Pending", value: orders.filter(o => o.orderStatus === "pending").length, color: "bg-gray-50 text-gray-700 border-gray-200" },
          { label: "Confirmed", value: orders.filter(o => o.orderStatus === "confirmed").length, color: "bg-purple-50 text-purple-700 border-purple-200" },
          { label: "Processing", value: orders.filter(o => o.orderStatus === "processing").length, color: "bg-blue-50 text-blue-700 border-blue-200" },
          { label: "Delivered", value: orders.filter(o => o.orderStatus === "delivered").length, color: "bg-green-50 text-green-700 border-green-200" },
          { label: "Cancelled", value: orders.filter(o => o.orderStatus === "cancelled").length, color: "bg-red-50 text-red-700 border-red-200" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} border p-4 rounded-xl`}>
            <p className="text-xs font-medium">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by order number, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          data={filteredOrders}
          loading={loading}
        />
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      )}

      {/* ===== ORDER DETAIL MODAL ===== */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 space-y-5">

              {/* Modal Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-mono">
                    {selectedOrder.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[selectedOrder.orderStatus]}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                <h3 className="font-semibold text-gray-700 mb-2">👤 Customer Details</h3>
                <p className="text-sm"><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedOrder.customer?.name}</span></p>
                <p className="text-sm"><span className="text-gray-500">Email:</span> {selectedOrder.customer?.email}</p>
                <p className="text-sm"><span className="text-gray-500">Phone:</span> {selectedOrder.shippingAddress?.phone}</p>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                <h3 className="font-semibold text-gray-700 mb-2">📍 Shipping Address</h3>
                <p className="text-sm">{selectedOrder.shippingAddress?.address}</p>
                <p className="text-sm">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                {selectedOrder.shippingAddress?.landmark && (
                  <p className="text-sm text-gray-500">
                    Landmark: {selectedOrder.shippingAddress.landmark}
                  </p>
                )}
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                <h3 className="font-semibold text-gray-700 mb-2">💳 Payment</h3>
                <p className="text-sm"><span className="text-gray-500">Method:</span> {selectedOrder.paymentMethod}</p>
                <p className="text-sm">
                  <span className="text-gray-500">Status:</span>{" "}
                  <span className={`font-semibold capitalize
                    ${selectedOrder.paymentStatus === "paid" ? "text-green-600" :
                      selectedOrder.paymentStatus === "failed" ? "text-red-600" :
                      "text-yellow-600"}`}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                </p>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">🛍️ Items Ordered</h3>
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 border rounded-xl p-3">
                    <img
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg bg-gray-100"
                      onError={(e) => e.target.src = "/placeholder.png"}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.condition} {item.grade !== "N/A" ? `• ${item.grade}` : ""}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        ₦{item.price?.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₦{selectedOrder.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping Fee</span>
                  <span>₦{selectedOrder.shippingFee?.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₦{selectedOrder.discount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t pt-2 mt-1">
                  <span>Total</span>
                  <span className="text-blue-700">₦{selectedOrder.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Customer Note */}
              {selectedOrder.customerNote && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-700 mb-1">📝 Customer Note</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.customerNote}</p>
                </div>
              )}

              {/* Status History */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">📋 Status History</h3>
                <div className="space-y-3 border-l-2 border-blue-200 pl-4">
                  {selectedOrder.statusHistory?.map((history, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-5 w-2.5 h-2.5 bg-blue-600 rounded-full top-1"></div>
                      <p className="text-sm font-semibold capitalize text-gray-800">{history.status}</p>
                      {history.message && (
                        <p className="text-xs text-gray-500">{history.message}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(history.updatedAt).toLocaleString("en-NG")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Update Status - only show if not cancelled or delivered */}
              {!["cancelled", "delivered"].includes(selectedOrder.orderStatus) && (
                <div className="space-y-3 border-t pt-4">
                  <h3 className="font-semibold text-gray-700">
                    🔄 Update Order Status
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {["confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                        disabled={selectedOrder.orderStatus === status || updating}
                        className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition
                          ${selectedOrder.orderStatus === status || updating
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : status === "cancelled"
                            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                            : status === "delivered"
                            ? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                          }`}
                      >
                        {updating ? "..." : status}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}