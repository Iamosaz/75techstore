// 75Backend/routes/chatbotRoutes.js
import express from 'express';
import {
  getConfig,
  updateConfig,
  sendMessage,
  getAnalytics,
  getLogs,
  deleteLog,
  resolveLog,
  generateBlog
} from '../controllers/chatbotController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ═══════════════════════════════════════════════════
// 🌍 PUBLIC ROUTES (Customer Chat Widget)
// ═══════════════════════════════════════════════════
router.post('/message', sendMessage);
router.get('/config', getConfig); // ✅ MUST BE PUBLIC so customer widget loads greeting & bot name

// ═══════════════════════════════════════════════════
// 🔒 ADMIN PROTECTED ROUTES
// ═══════════════════════════════════════════════════
router.put('/config', protect, admin, updateConfig); // 🔒 Only admin can update settings
router.get('/analytics', protect, admin, getAnalytics);
router.get('/logs', protect, admin, getLogs);
router.delete('/logs/:id', protect, admin, deleteLog);
router.patch('/logs/:id/resolve', protect, admin, resolveLog);
router.post('/generate-blog', protect, admin, generateBlog);

export default router;