// models/analytics.js  (BACKEND — Node + Mongoose)
//
// Stores the events sent by src/SEOTracker.jsx.
// BACK UP your current model file before replacing it, and keep its original
// model name / export style if they differ from this one.

const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    // pageview | whatsapp_click | call_click | email_click | lead
    eventType: {
      type: String,
      required: true,
      enum: ['pageview', 'whatsapp_click', 'call_click', 'email_click', 'lead'],
      index: true,
    },

    page: { type: String, default: '/' },
    landingPage: { type: String },

    // Same labels as before, e.g. "🔍 Google Search", "💬 WhatsApp"
    // For click/lead events this holds the click label, e.g. "💬 WhatsApp Chat Click"
    source: { type: String },
    // The visitor's real traffic source, so leads can be attributed to a channel
    trafficSource: { type: String },

    device: { type: String, default: 'Desktop' },
    referrer: { type: String },

    // Only used when eventType === 'lead' (repair_request, contact_form, ...)
    leadType: { type: String },

    // Anonymous random IDs from the browser
    visitorId: { type: String, index: true },
    sessionId: { type: String, index: true },

    // true for everything sent by the new tracker (older records won't have it)
    human: { type: Boolean, default: false, index: true },
  },
  { timestamps: true } // adds createdAt / updatedAt
);

analyticsSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);