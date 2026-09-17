// 75Backend/models/TrafficLog.js
import mongoose from "mongoose";

const TrafficLogSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    ip: String,
    path: {
      type: String,
      required: true,
    },
    referrer: {
      type: String,
      default: "Direct",
    },
    // Source Category: "Google Search", "AI Search (ChatGPT/Perplexity)", "WhatsApp", "Instagram", "Direct", "Other"
    sourceType: {
      type: String,
      default: "Direct",
      index: true,
    },
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    country: {
      type: String,
      default: "NG",
    },
    userAgent: String,
    device: {
      type: String,
      default: "Desktop",
    },
    // E-Commerce Event tracking
    events: [
      {
        name: String, // "page_view", "whatsapp_click", "add_to_cart", "checkout_start", "purchase_completed"
        productId: String,
        productName: String,
        amount: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    // Has this session resulted in a sale?
    converted: {
      type: Boolean,
      default: false,
    },
    revenueGenerated: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-delete logs older than 90 days to keep DB fast
TrafficLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const TrafficLog =
  mongoose.models.TrafficLog || mongoose.model("TrafficLog", TrafficLogSchema);

export default TrafficLog;