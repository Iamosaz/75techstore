import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    // ── Core Info ──────────────────────────────────────
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
    condition: {
      type: String,
      enum: ["new", "fairly-used", "used", "refurbished"],
      default: "used",
    },

    // ── Category ───────────────────────────────────────
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "electronics-gadgets",
        "vehicles",
        "property-housing",
        "fashion-clothing",
        "furniture-home",
        "jobs-services",
        "education-tutoring",
        "food-catering",
        "sports-fitness",
        "gaming",
        "beauty-health",
        "pets",
        "other",
      ],
    },
    subcategory: {
      type: String,
      default: "",
    },

    // ── Images (Cloudinary) ────────────────────────────
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],

    // ── Location ───────────────────────────────────────
    location: {
      state: { type: String, required: true },
      city: { type: String, default: "" },
      area: { type: String, default: "" },
    },

    // ── Seller Reference ───────────────────────────────
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Status ─────────────────────────────────────────
    status: {
      type: String,
      enum: ["active", "sold", "pending", "rejected", "expired"],
      default: "active",
    },

    // ── Boost / Promotion ──────────────────────────────
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredUntil: {
      type: Date,
      default: null,
    },
    isBoosted: {
      type: Boolean,
      default: false,
    },
    boostedUntil: {
      type: Date,
      default: null,
    },

    // ── Engagement ─────────────────────────────────────
    views: {
      type: Number,
      default: 0,
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ── Safety ─────────────────────────────────────────
    isFlagged: {
      type: Boolean,
      default: false,
    },
    flagReason: {
      type: String,
      default: "",
    },
    flaggedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ── Phone Reveal (Monetization) ────────────────────
    phoneRevealed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ── SEO ────────────────────────────────────────────
    slug: {
      type: String,
      unique: true,
    },
    tags: [{ type: String }],

    // ── Expiry ─────────────────────────────────────────
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    },
  },
  { timestamps: true }
);

// ── Auto generate slug ─────────────────────────────────
listingSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-") +
      "-" +
      Date.now();
  }
  next();
});

// ── Indexes for SEO + Search ───────────────────────────
listingSchema.index({ title: "text", description: "text", tags: "text" });
listingSchema.index({ category: 1, status: 1 });
listingSchema.index({ seller: 1 });
listingSchema.index({ isFeatured: 1, status: 1 });
listingSchema.index({ "location.state": 1 });
listingSchema.index({ slug: 1 });

export const Listing = mongoose.model("Listing", listingSchema);