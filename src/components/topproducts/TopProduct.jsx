import React, { useState } from "react"
import DealDayCard from "./DealDayCard"
import TopProductCard from "./TopProductCard"

// images
import phone from "../../assets/17promax.png"
import laptop from "../../assets/Macb1.png"
import mac from "../../assets/macbook-pro.png"
import monitor from "../../assets/17promax.png"

const TopProduct = () => {
  const [activeTab, setActiveTab] = useState("top")

  const topProducts = [
    { id: 1, name: "Brand New Macbook Pro M3", price: 1100000, image: laptop, category: "Laptop" },
    { id: 2, name: "Brand New iPhone 17 Promax", price: 1700000, image: phone, category: "Phone" },
    { id: 3, name: "Brand New iPhone 17 Promax", price: 1700000, image: 
      phone, category: "Phone" },
    { id: 4, name: "Macbook Pro M1", price: 1000000, image: mac, category: "Laptop" },
    { id: 5, name: "Macbook Pro M1", price: 1000000, image: mac, category: "Laptop" },
    { id: 6, name: "Macbook Pro M1", price: 1000000, image: mac, category: "Laptop" },
    { id: 7, name: "Macbook Pro M1", price: 1000000, image: mac, category: "Laptop" },
    { id: 8, name: "Macbook Pro M1", price: 1000000, image: mac, category: "Laptop" },
    
    
    
    
    
  ]

  const bestSelling = [
    { id: 5, name: "Macbook Pro M1", price: 1000000, image: mac, category: "Laptop" },
    { id: 6, name: "Monitor Pro", price: 300000, image: monitor, category: "Monitor" },
    { id: 7, name: "iPhone 17 Promax", price: 1700000, image: phone, category: "Phone" },
    { id: 8, name: "Macbook Pro M3", price: 1100000, image: laptop, category: "Laptop" },
  ]

  const newArrivals = [
    { id: 9, name: "New Macbook Pro M3", price: 1400000, image: laptop, category: "Laptop" },
    { id: 10, name: "New iPhone 17", price: 900000, image: phone, category: "Phone" },
    { id: 11, name: "Macbook Pro M1", price: 1000000, image: mac, category: "Laptop" },
    { id: 12, name: "Monitor Pro", price: 300000, image: monitor, category: "Monitor" },
  ]

  const deals = [
    { id: 1, name: "Flash Macbook Deal", price: 999000, image: laptop, category: "Laptop" },
    { id: 2, name: "Discount iPhone 17", price: 699000, image: phone, category: "Phone" },
    { id: 3, name: "Macbook Pro M1", price: 999000, image: mac, category: "Laptop" },
  ]

  const tabs = [
    { key: "top", label: "Top Picks" },
    { key: "best", label: "Best Selling" },
    { key: "new", label: "New Arrivals" },
  ]

  const getProducts = () => {
    if (activeTab === "top") return topProducts
    if (activeTab === "best") return bestSelling
    if (activeTab === "new") return newArrivals
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          
          {/* Title */}
          <div>
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-1">
              Featured
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Top Products
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-white border border-gray-200 rounded-full p-1 shadow-sm w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
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

        {/* ── CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT: Product Grid (3/4 width) */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {getProducts().map((product, index) => (
                <TopProductCard key={`${activeTab}-${index}`} product={product} />
              ))}
            </div>
          </div>

          {/* RIGHT: Deal of the Day (1/4 width) */}
          <div className="lg:col-span-1">
            <DealDayCard deals={deals} />
          </div>

        </div>
      </div>
    </section>
  )
}

export default TopProduct