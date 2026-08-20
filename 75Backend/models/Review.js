import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // ── Who ────────────────────────────────────────────
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    // ── Rating ─────────────────────────────────────────
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // ── Review Text ────────────────────────────────────
    comment: {
      type: String,
      maxlength: 500,
      default: "",
    },

    // ── Seller Response ────────────────────────────────
    sellerReply: {
      type: String,
      default: "",
      maxlength: 300,
    },

    // ── Flags ──────────────────────────────────────────
    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ── One review per listing per buyer ──────────────────
reviewSchema.index({ reviewer: 1, listing: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);