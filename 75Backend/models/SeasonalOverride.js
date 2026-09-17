// backend/models/SeasonalOverride.js
import mongoose from "mongoose";

const SeasonalOverrideSchema = new mongoose.Schema(
  {
    key: { type: String, default: "active_override" },
    themeId: { type: String, required: true },
    name: { type: String, required: true },
    customTitle: { type: String, default: "" },
    customSubtitle: { type: String, default: "" },
    customDiscount: { type: String, default: "" },
    customImage: { type: String, default: "" }, 
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SeasonalOverride =
  mongoose.models.SeasonalOverride ||
  mongoose.model("SeasonalOverride", SeasonalOverrideSchema);

export default SeasonalOverride;