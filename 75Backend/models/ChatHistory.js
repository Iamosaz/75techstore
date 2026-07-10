import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true
    },
    messages: [{
      role: {
        type: String,
        enum: ['user', 'assistant']
      },
      content: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    // ✅ Security flags
    isFlagged: {
      type: Boolean,
      default: false
    },
    flagReason: {
      type: String,
      default: ''
    },
    userIP: String,
    language: {
      type: String,
      default: 'english'
    }
  },
  { timestamps: true }
);

export const ChatHistory = mongoose.model(
  'ChatHistory',
  chatHistorySchema
);