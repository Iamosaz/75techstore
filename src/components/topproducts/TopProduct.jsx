import React, { useState, useEffect } from "react"
import DealDayCard from "./DealDayCard"
import TopProductCard from "./TopProductCard"
import axios from 'axios'

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
    <section className="py-6 sm:py-8 bg-gray-100">
      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200">
          <div>
            <p className="text-orange-500 text-xs font-bold uppercase tracking-wider">
              Featured
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Top Products
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 bg-gray-100 border border-gray-200 rounded-lg p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          /* ✅ FIXED: Added 'items-start' to prevent sidebar from stretching */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">

            {/* Products Column */}
            <div className="lg:col-span-3">
              {getProducts().length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 text-gray-400">
                  <p className="text-4xl mb-2">📦</p>
                  <p className="text-sm font-medium">No products found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {getProducts().map((product, index) => (
                    <TopProductCard
                      key={product._id || `${activeTab}-${index}`}
                      product={product}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ✅ FIXED: Added 'self-start' and 'sticky top-4' */}
            <div className="lg:col-span-1 self-start lg:sticky lg:top-4">
              <DealDayCard deals={deals} />
            </div>

          </div>
        )}
      </div>
    </section>
  )
}

export default TopProduct