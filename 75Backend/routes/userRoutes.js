// routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route test
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'Token valid - user authenticated',
    user: req.user
  });
});

// Admin only test route 
router.get('/admin-secret', protect, adminOnly,(req, res) => {
  res.json({ secret: 'Admin area. Welcome, 75TECHSTORE Creator!'})
});

export default router;