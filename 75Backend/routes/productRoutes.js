import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
  getTopPicks,
  getBestSelling,
  getNewArrivals,
  getDealsOfDay
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Public Routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/top-picks', getTopPicks);
router.get('/best-selling', getBestSelling);
router.get('/new-arrivals', getNewArrivals);
router.get('/deals', getDealsOfDay);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// ✅ Admin Only Routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;