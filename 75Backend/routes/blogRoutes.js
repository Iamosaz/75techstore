// 75Backend/routes/blogRoutes.js
import express from 'express';
import {
  createBlog,
  getAllBlogsAdmin,
  getPublishedBlogs,
  getBlogById,
  getBlogBySlug,
  getFeaturedBlogs,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ CRITICAL: /admin/all MUST be BEFORE /:id
// If /:id comes first, Express will think "admin" is an ID!

// ─── Admin Routes ─────────────────────────────────────────────────
router.get('/admin/all', protect, adminOnly, getAllBlogsAdmin);
router.post('/', protect, adminOnly, createBlog);
router.put('/:id', protect, adminOnly, updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

// ─── Public Routes ────────────────────────────────────────────────
router.get('/', getPublishedBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/slug/:slug', getBlogBySlug);

// ─── /:id MUST BE LAST ────────────────────────────────────────────
router.get('/:id', getBlogById);

export default router;