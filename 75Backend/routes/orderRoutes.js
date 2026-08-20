// 75Backend/routes/orderRoutes.js
import express from 'express'
import {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

// Customer routes
router.post('/', protect, createOrder)
router.get('/my-orders', protect, getMyOrders)
router.get('/track/:orderNumber', trackOrder)
router.get('/:id', protect, getOrderById)
router.put('/:id/cancel', protect, cancelOrder)

// Admin routes
router.get('/', protect, adminOnly, getAllOrders)
router.put('/:id/status', protect, adminOnly, updateOrderStatus)

export default router