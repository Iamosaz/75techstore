import React, { useState, useEffect } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";
import Table from "../components/Table";
import { orderAPI } from "../services/adminAPI";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderAPI.getAll();
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const columns = [
    { key: "id", label: "Order ID" },
    { key: "customer", label: "Customer" },
    {
      key: "amount",
      label: "Amount",
      render: (value) => `$${value.toFixed(2)}`,
    },
    { key: "items", label: "Items" },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const colors = {
          Delivered: "bg-green-100 text-green-800",
          Processing: "bg-blue-100 text-blue-800",
          Shipped: "bg-yellow-100 text-yellow-800",
          Cancelled: "bg-red-100 text-red-800",
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[value]}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: "payment",
      label: "Payment",
      render: (value) => (
        <span className={value === "Completed" ? "text-green-600 font-semibold" : "text-yellow-600"}>
          {value}
        </span>
      ),
    },
    { key: "date", label: "Date" },
  ];

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-2">
              Track and manage all customer orders
            </p>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <FiDownload size={20} />
            <span>Export</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={filteredOrders}
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
}