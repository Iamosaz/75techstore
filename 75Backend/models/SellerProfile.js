import mongoose from "mongoose";

const sellerProfileSchema = new mongoose.Schema(
  {
    // ── Link to User ───────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ── Shop Info ──────────────────────────────────────
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    shopDescription: {
      type: String,
      default: "",
      maxlength: 500,
    },
    shopLogo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    shopBanner: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    // ── Verification ───────────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "unverified",
    },
    verificationMethod: {
      type: String,
      enum: ["nin", "bvn", "both", "none"],
      default: "none",
    },
    verifiedAt: {
      type: Date,
      default: null,
    },

    // ── Subscription / Badge ───────────────────────────
    plan: {
      type: String,
      enum: ["free", "basic", "pro", "premium"],
      default: "free",
    },
    planExpiresAt: {
      type: Date,
      default: null,
    },

    // ── Stats ──────────────────────────────────────────
    totalListings: {
      type: Number,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // ── Social / Contact ───────────────────────────────
    whatsapp: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },

    // ── Location ───────────────────────────────────────
    location: {
      state: { type: String, default: "" },
      city: { type: String, default: "" },
    },

    // ── Flags ──────────────────────────────────────────
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspendReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const SellerProfile = mongoose.model(
  "SellerProfile",
  sellerProfileSchema
);