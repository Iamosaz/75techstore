import React, { useState, useEffect } from "react"
import DealDayCard from "./DealDayCard"
import TopProductCard from "./TopProductCard"
import axios from 'axios'

// ✅ FIXED: Hardcoded to guarantee it includes /api
const API_URL = 'http://localhost:5000/api';

const TopProduct = () => {
  const [activeTab, setActiveTab] = useState("top")
  const [topProducts, setTopProducts] = useState([])
  const [bestSelling, setBestSelling] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const [topRes, bestRes, newRes, dealsRes] = await Promise.all([
          axios.get(`${API_URL}/products/top-picks`),
          axios.get(`${API_URL}/products/best-selling`),
          axios.get(`${API_URL}/products/new-arrivals`),
          axios.get(`${API_URL}/products/deals`)
        ])
        setTopProducts(topRes.data || [])
        setBestSelling(bestRes.data || [])
        setNewArrivals(newRes.data || [])
        setDeals(dealsRes.data || [])
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const tabs = [
    { key: "top", label: "Top Picks" },
    { key: "best", label: "Best Selling" },
    { key: "new", label: "New Arrivals" },
  ]

  const getProducts = () => {
    if (activeTab === "top") return topProducts
    if (activeTab === "best") return bestSelling
    if (activeTab === "new") return newArrivals
    return topProducts
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between -10 gap-4">
          <div>
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-1">
              Featured
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Top Products
            </h2>
          </div>

          <div className="flex gap-2 bg-white border border-gray-200 rounded-full p-1 shadow-sm w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                // ✅ FIXED: Changed ₦{ to ${
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            <div className="lg:col-span-3">
              {getProducts().length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <p className="text-4xl mb-4">📦</p>
                  <p>No products yet. Add from admin panel!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {getProducts().map((product, index) => (
                    <TopProductCard
                      // ✅ FIXED: Changed ₦{ to ${
                      key={`${activeTab}-${index}`}
                      product={product}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <DealDayCard deals={deals} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default TopProduct