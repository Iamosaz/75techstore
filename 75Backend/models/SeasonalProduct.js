// backend/models/SeasonalProduct.js
import mongoose from "mongoose";

const SeasonalProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide gadget name"],
      trim: true,
    },
    brand: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
    },
    originalPrice: {
      type: Number,
      required: [true, "Please enter the regular price"],
    },
    dealPrice: {
      type: Number,
      required: [true, "Please enter the seasonal deal price"],
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      required: [true, "Please provide at least one Cloudinary image URL"],
    },
    stock: {
      type: Number,
      default: 10,
    },
    seasonTag: {
      type: String,
      default: "all",
    },
    description: {
      type: String,
      default: "",
    },
    features: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-calculate discount percentage before save
SeasonalProductSchema.pre("save", function (next) {
  if (this.originalPrice && this.dealPrice && this.originalPrice > this.dealPrice) {
    this.discountPercentage = Math.round(
      ((this.originalPrice - this.dealPrice) / this.originalPrice) * 100
    );
  }
  next();
});

const SeasonalProduct =
  mongoose.models.SeasonalProduct ||
  mongoose.model("SeasonalProduct", SeasonalProductSchema);

// ✅ Essential for ES Modules:
export default SeasonalProduct;