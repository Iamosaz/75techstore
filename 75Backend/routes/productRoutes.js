
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
import { notifyGoogleIndexing } from '../utils/googleIndexHelper.js'; // ✅ Imported Indexing Helper

const router = express.Router();

// ─── Indexing Route Wrappers ──────────────────────────────────────
// Intercepts the successful response to extract the Product ID and notify Google
const createProductWithIndexing = async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    // Looks for product._id, data._id, or direct _id from the controller's response
    const productId = data?._id || data?.product?._id || data?.data?._id;
    if (productId) {
      notifyGoogleIndexing(`/shop/${productId}`);
    }
    return originalJson(data);
  };
  return createProduct(req, res, next);
};

const updateProductWithIndexing = async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    const productId = data?._id || data?.product?._id || data?.data?._id;
    if (productId) {
      notifyGoogleIndexing(`/shop/${productId}`);
    }
    return originalJson(data);
  };
  return updateProduct(req, res, next);
};

// ─── Public Routes ────────────────────────────────────────────────
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/top-picks', getTopPicks);
router.get('/best-selling', getBestSelling);
router.get('/new-arrivals', getNewArrivals);
router.get('/deals', getDealsOfDay);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// ─── Admin Only Routes (With Auto-Indexing) ──────────────────────
router.post('/', protect, adminOnly, createProductWithIndexing);      // ✅ Auto-Indexes on Upload
router.put('/:id', protect, adminOnly, updateProductWithIndexing);   // ✅ Auto-Indexes on Update
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;