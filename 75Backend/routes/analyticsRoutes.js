// 75Backend/routes/analyticsRoutes.js
import express from 'express';
import { 
  getDashboardStats, 
  getVIPMembers, 
  updateVIPMember 
} from '../controllers/analyticsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected admin analytics routes
router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/vip-members', protect, adminOnly, getVIPMembers);
router.put('/vip-members/:userId', protect, adminOnly, updateVIPMember);

export default router;