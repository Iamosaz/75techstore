// src/components/deals/DealCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function DealCard({ deal }) {
  return (
    <div className="group bg-white border border-gray-100  shadow-sm hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 overflow-hidden">
      {/* product image */}
      <Link to={`/deals/${deal.id}`} className="block aspect-square relative">
        <img
          src={deal.image}
          alt={deal.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* text content */}
      <div className="p-4 flex flex-col justify-between h-[10rem]">
        <h3 className="text-gray-800 font-medium text-sm line-clamp-2 h-[40px]">
          {deal.title}
        </h3>

        <div>
          <p className="text-brand-red font-bold text-xl">
            ₦{deal.price.toLocaleString()}
          </p>
          {deal.discount && (
            <p className="text-xs text-gray-500 font-medium">
              Save {deal.discount}% today
            </p>
          )}
        </div>

        <Link
          to={`/deals/${deal.id}`}
          className="mt-3 inline-block bg-brand-blue text-white text-center text-sm font-semibold py-2 rounded hover:bg-brand-red transition-colors duration-300"
        >
          View deal
        </Link>
      </div>
    </div>
  );
}