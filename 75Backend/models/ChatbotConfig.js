import mongoose from 'mongoose';

const chatbotConfigSchema = new mongoose.Schema(
  {
    // ✅ Bot Identity
    botName: {
      type: String,
      default: '75TechStore AI'
    },
    welcomeMessage: {
      type: String,
      default: "Hi! 👋 I'm the 75TechStore AI Assistant. How can I help you today?"
    },
    language: {
      type: String,
      enum: ['english', 'pidgin', 'both'],
      default: 'both'
    },

    // ✅ Custom Knowledge Base
    customKnowledge: [{
      topic: String,
      content: String,
      isActive: {
        type: Boolean,
        default: true
      }
    }],

    // ✅ Quick Replies
    quickReplies: [{
      icon: String,
      text: String,
      query: String,
      isActive: {
        type: Boolean,
        default: true
      }
    }],

    // ✅ Security Settings
    securityEnabled: {
      type: Boolean,
      default: true
    },
    scamKeywords: [{
      type: String
    }],
    securityAlertEmail: {
      type: String,
      default: ''
    },

    // ✅ Blog Generation
    blogGenerationEnabled: {
      type: Boolean,
      default: true
    },

    // ✅ Bot Status
    isActive: {
      type: Boolean,
      default: true
    },
    isAIEnabled: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const ChatbotConfig = mongoose.model(
  'ChatbotConfig',
  chatbotConfigSchema
);