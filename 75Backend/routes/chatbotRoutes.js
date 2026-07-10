import express from 'express';
import {
  chat,
  getChatbotConfig,
  updateChatbotConfig,
  generateBlogPost,
  getChatAnalytics
} from '../controllers/chatbotController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Public - chat endpoint
router.post('/chat', chat);

// ✅ Public - get config (for frontend)
router.get('/config', getChatbotConfig);

// ✅ Admin only
router.put('/config', protect, adminOnly, updateChatbotConfig);
router.post('/generate-blog', protect, adminOnly, generateBlogPost);
router.get('/analytics', protect, adminOnly, getChatAnalytics);

export default router;