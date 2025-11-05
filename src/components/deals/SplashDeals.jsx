// src/components/deals/SplashDeals.jsx
import React from "react";
import DealCard from "./DealCard";
import iphone from "../../assets/17promax.png";
import laptop from "../../assets/macbook-pro.png";
// import watch from "../../assets/smartwatch.png";


const mockDeals = [
  { id: "1", title: "iPhone 17 ProMax", price: "2,800,000", discount: 15, image: iphone },
  { id: "2", title: "MacBook Pro 2024", price: "2,900,000", discount: 10, image: laptop },
  { id: "3", title: "MacBook Pro 2024", price: "2,900,000", discount: 10, image: laptop },
  { id: "4", title: "MacBook Pro 2024", price: "2,900,000", discount: 10, image: laptop },
  { id: "5", title: "Ipad 9th Generation", price: "2,900,000", discount: 10, image: laptop },
  { id: "6", title: "Smart Watch Ultra", price: "2,900,000", discount: 10, image: laptop },
  // …more future products to be added
];
const SplashDeals = () => {
  return (
   <section className="max-w-7xl mx-auto py-16 px-2">
      <h2 className="text-3xl font-bold text-center text-brand-blue mb-10">
        Splash Deals
      </h2>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {mockDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  )
}

export default SplashDeals
