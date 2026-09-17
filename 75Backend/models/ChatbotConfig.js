// 75Backend/models/ChatbotConfig.js
import mongoose from 'mongoose';

const knowledgeSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const chatbotConfigSchema = new mongoose.Schema({
  botName: {
    type: String,
    default: '75Tech Assistant',
    trim: true
  },
  welcomeMessage: {
    type: String,
    default: 'Hello! Welcome to 75Tech Store. How can I help you today? 😊'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAIEnabled: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    enum: ['english', 'pidgin', 'both'],
    default: 'both'
  },
  aiModel: {
    type: String,
    default: 'llama-3.3-70b-versatile'
  },
  aiTemperature: {
    type: Number,
    default: 0.7,
    min: 0,
    max: 2
  },
  aiMaxTokens: {
    type: Number,
    default: 1024
  },
  systemPrompt: {
    type: String,
    default: `You are a friendly and helpful customer service assistant for 75Tech Store, a Nigerian tech retailer. 
Provide accurate information about products, prices, delivery, and warranty. 
Be polite, concise, and use a mix of English and Nigerian Pidgin when appropriate. 
Never share sensitive information or process payments through chat.`
  },
  customKnowledge: {
    type: [knowledgeSchema],
    default: []
  },
  securityEnabled: {
    type: Boolean,
    default: true
  },
  scamKeywords: {
    type: [String],
    default: [
      'send money',
      'wire transfer',
      'bitcoin',
      'gift card',
      'western union',
      'moneygram',
      'bank details',
      'password',
      'otp',
      'pin code',
      'credit card number',
      'cvv'
    ]
  },
  securityAlertEmail: {
    type: String,
    default: ''
  },
  maxMessagesPerSession: {
    type: Number,
    default: 50
  },
  sessionTimeoutMinutes: {
    type: Number,
    default: 30
  },
  totalConversations: {
    type: Number,
    default: 0
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

chatbotConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

const ChatbotConfig = mongoose.model('ChatbotConfig', chatbotConfigSchema);

export { ChatbotConfig };
export default ChatbotConfig;