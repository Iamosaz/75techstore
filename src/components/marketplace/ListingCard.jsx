import React from "react";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiMapPin,
  FiEye,
  FiClock,
  FiShield,
} from "react-icons/fi";

export default function ListingCard({ listing, featured = false }) {
  // ── Format price to Naira ─────────────────────────────
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // ── Time ago ──────────────────────────────────────────
  const timeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <Link
      to={`/marketplace/listing/${listing._id}`}
      className={`group bg-white rounded-2xl overflow-hidden border 
                  transition-all duration-300 hover:-translate-y-1 
                  hover:shadow-xl
                  ${
                    featured
                      ? "border-orange-200 shadow-md shadow-orange-100/50"
                      : "border-gray-100 shadow-sm"
                  }`}
    >
      {/* ── Image ──────────────────────────────────────── */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={listing.images?.[0]?.url || "https://placehold.co/400x400/eee/999?text=No+Image"}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-110 
                     transition-transform duration-500"
          loading="lazy"
        />

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white 
                          text-[10px] font-bold px-2 py-0.5 rounded-md 
                          shadow-lg uppercase tracking-wide">
            Featured
          </div>
        )}

        {/* Condition Badge */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm 
                        text-white text-[10px] font-medium px-2 py-0.5 
                        rounded-md capitalize">
          {listing.condition?.replace("-", " ")}
        </div>

        {/* Save Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Will connect to backend later
            console.log("Save listing:", listing._id);
          }}
          className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 
                     backdrop-blur-sm rounded-full flex items-center 
                     justify-center shadow-md opacity-0 
                     group-hover:opacity-100 transition-all duration-300 
                     hover:bg-red-50 hover:text-red-500"
        >
          <FiHeart size={14} />
        </button>

        {/* Image Count */}
        {listing.images?.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black/60 
                          backdrop-blur-sm text-white text-[10px] 
                          font-medium px-2 py-0.5 rounded-md">
            📷 {listing.images.length}
          </div>
        )}
      </div>

      {/* ── Details ────────────────────────────────────── */}
      <div className="p-3">
        {/* Price */}
        <p className="text-base md:text-lg font-black text-gray-900 
                      leading-tight">
          {formatPrice(listing.price)}
        </p>
        {listing.negotiable && (
          <span className="text-[10px] font-semibold text-green-600 
                           bg-green-50 px-1.5 py-0.5 rounded inline-block 
                           mt-0.5">
            Negotiable
          </span>
        )}

        {/* Title */}
        <h3 className="text-sm text-gray-700 mt-1.5 line-clamp-2 
                       leading-snug group-hover:text-orange-600 
                       transition-colors">
          {listing.title}
        </h3>

        {/* Location + Meta */}
        <div className="flex items-center justify-between mt-2.5 pt-2.5 
                        border-t border-gray-100">
          <div className="flex items-center gap-1 text-gray-400 min-w-0">
            <FiMapPin size={11} className="flex-shrink-0" />
            <span className="text-xs truncate">
              {listing.location?.city
                ? `${listing.location.city}, ${listing.location.state}`
                : listing.location?.state}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
            <FiClock size={11} />
            <span className="text-xs">{timeAgo(listing.createdAt)}</span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center 
                          justify-center text-[9px] font-bold text-gray-500">
            {listing.seller?.name?.charAt(0) || "?"}
          </div>
          <span className="text-xs text-gray-500 truncate">
            {listing.seller?.name || "Unknown Seller"}
          </span>
          {listing.seller?.isVerified && (
            <FiShield
              size={11}
              className="text-orange-500 flex-shrink-0"
              title="Verified Seller"
            />
          )}
          {/* Views */}
          <div className="flex items-center gap-0.5 text-gray-400 
                          ml-auto flex-shrink-0">
            <FiEye size={11} />
            <span className="text-[10px]">{listing.views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}