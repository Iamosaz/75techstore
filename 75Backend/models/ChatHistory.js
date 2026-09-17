// 75Backend/models/ChatbotLog.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const chatbotLogSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userIP: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  messages: {
    type: [messageSchema],
    default: []
  },
  language: {
    type: String,
    enum: ['english', 'pidgin', 'mixed', 'unknown'],
    default: 'unknown'
  },
  isFlagged: {
    type: Boolean,
    default: false,
    index: true
  },
  flagReason: {
    type: String,
    default: ''
  },
  flagSeverity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  aiUsed: {
    type: Boolean,
    default: false
  },
  responseTime: {
    type: Number, // milliseconds
    default: 0
  },
  satisfactionRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  }
}, {
  timestamps: truea
});

// Indexes for faster analytics
chatbotLogSchema.index({ createdAt: -1 });
chatbotLogSchema.index({ isFlagged: 1, createdAt: -1 });
chatbotLogSchema.index({ language: 1 });

module.exports = mongoose.model('ChatbotLog', chatbotLogSchema);