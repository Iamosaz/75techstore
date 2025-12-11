import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import iphone from "../assets/iphone 17Promax.png";

const DealDetails = () => {
  const { id } = useParams();

  // Mock deal (in real app, fetch by id)
  const deal = {
    id,
    title: "iPhone 17 ProMax",
    price: "2,800,000",
    oldPrice: "3,200,000",
    discount: 15,
    description:
      "The all-new iPhone 17 ProMax features an A18 chip, advanced triple camera system, and a titanium build for extra durability. Experience faster performance, longer battery life, and an immersive display.",
    image: iphone,
  };

  return (
    <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10 items-start bg-transparent">
      {/* Product Image Section */}
      <div className="relative">
        <img
          src={deal.image}
          alt={deal.title}
          className="w-full rounded-xl shadow-lg object-contain  p-6"
        />

        {/* Like Button */}
        <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:text-red-500 transition">
          <FaHeart />
        </button>
      </div>

      {/* Product Details Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{deal.title}</h1>

        {/* Price and Discount */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold text-gray-900">
            ₦{deal.price}
          </span>
          {deal.oldPrice && (
            <span className="text-gray-400 line-through text-lg">
              ₦{deal.oldPrice}
            </span>
          )}
          {deal.discount && (
            <span className="text-red-600 font-semibold text-sm bg-red-100 px-2 py-1 rounded">
              -{deal.discount}%
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed mb-6">{deal.description}</p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
            Add to Cart
          </button>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold transition">
            Pick Up in Store
          </button>
          <button className="border border-gray-400 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition">
            Delivery Options
          </button>
        </div>

        {/* Back Link */}
        <Link
          to="/"
          className="inline-block mt-8 text-blue-600 hover:underline font-medium"
        >
          ← Back to Deals
        </Link>
      </div>
    </section>
  );
};

export default DealDetails;
