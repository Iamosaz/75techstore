// 75Backend/routes/analyticsRoutes.js
import express from 'express';
import {
  getDashboardStats,
  getSEOReport,
  trackEvent,
  getVIPMembers,
  updateVIPMember
} from '../controllers/analyticsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public tracking route (no auth needed - customers use this)
router.post('/track', trackEvent);

// Admin only
router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/seo-report', protect, adminOnly, getSEOReport);
router.get('/vip-members', protect, adminOnly, getVIPMembers);
router.put('/vip-members/:userId', protect, adminOnly, updateVIPMember);

export default router;