// 75Backend/routes/membershipRoutes.js
import express from 'express';
import {
  initializeMembershipPayment,
  verifyMembershipPayment,
  getMyMembership
} from '../controllers/membershipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Initialize Paystack transaction (requires login)
router.post('/initialize', protect, initializeMembershipPayment);

// Verify payment by reference code (can work with or without login)
router.get('/verify/:reference', verifyMembershipPayment);

// Get current user's membership status
router.get('/my-membership', protect, getMyMembership);

export default router;