// 75Backend/routes/membershipRoutes.js
import express from 'express';
import {
  initializePayment,
  verifyPayment,
  getMyMembership,
} from '../controllers/membershipController.js';
import { protect } from '../middleware/authMiddleware.js'; // Your auth middleware

const router = express.Router();

router.post('/initialize', protect, initializePayment);
router.get('/my-membership', protect, getMyMembership);
router.get('/verify/:reference', verifyPayment);

export default router;