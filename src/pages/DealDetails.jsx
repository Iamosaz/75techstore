// src/pages/DealDetails.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import iphone from "../assets/iphone 17Promax.png"; // fallback image

export default function DealDetails() {
  const { id } = useParams();

  // In a real app fetch deal info: const deal = fetchDeal(id)
  const deal = {
    id,
    title: "iPhone 17 ProMax",
    price: "2,800,000",
    description:
      "The all new iPhone 17 ProMax comes with A18 chip, improve camera, and Titanium build.",
    image: iphone,
  };

  return (
    <section className="max-w-5xl mx-auto py-16 px-6 flex flex-col md:flex-row gap-10 items-center">
      {/* Image */}
      <img
        src={deal.image}
        alt={deal.title}
        className="w-full md:w-1/2 rounded-lg shadow-lg object-cover"
      />

      {/* Details */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-brand-blue mb-4">
          {deal.title}
        </h1>
        <p className="text-xl font-semibold mb-2">₦{deal.price}</p>
        <p className="text-gray-700 mb-6">{deal.description}</p>

        <div className="flex flex-wrap gap-4">
          <button className="btn-primary">Add to Cart</button>
          <button className="btn-accent">Pick Up in Store</button>
          <button className="btn-outline">Delivery Options</button>
        </div>

        <Link to="/" className="inline-block mt-8 text-brand-blue underline">
          ← Back to Deals
        </Link>
      </div>
    </section>
  );
}