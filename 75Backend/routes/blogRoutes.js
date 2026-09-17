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

// Optional helper for Google indexing (with fallback safety)
let notifyGoogleIndexing = null;
try {
  const indexHelper = await import('../utils/googleIndexHelper.js');
  notifyGoogleIndexing = indexHelper.notifyGoogleIndexing;
} catch (e) {
  // If helper is missing or not configured, continue without breaking
  notifyGoogleIndexing = () => {};
}

const router = express.Router();

// Helper wrapper to notify Google after creating or updating
const createBlogWithIndexing = async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    try {
      if (notifyGoogleIndexing) {
        if (data && (data.slug || data._id)) {
          notifyGoogleIndexing(`/blog/${data.slug || data._id}`);
        } else if (data && data.blog) {
          notifyGoogleIndexing(`/blog/${data.blog.slug || data.blog._id}`);
        }
      }
    } catch (err) {
      console.warn('Google index notification skipped:', err.message);
    }
    return originalJson(data);
  };
  return createBlog(req, res, next);
};

const updateBlogWithIndexing = async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    try {
      if (notifyGoogleIndexing) {
        if (data && (data.slug || data._id)) {
          notifyGoogleIndexing(`/blog/${data.slug || data._id}`);
        } else if (data && data.blog) {
          notifyGoogleIndexing(`/blog/${data.blog.slug || data.blog._id}`);
        }
      }
    } catch (err) {
      console.warn('Google index notification skipped:', err.message);
    }
    return originalJson(data);
  };
  return updateBlog(req, res, next);
};

// ─── ADMIN ROUTES (Protected) ─────────────────────────────────────
router.get('/admin/all', protect, adminOnly, getAllBlogsAdmin);
router.post('/', protect, adminOnly, createBlogWithIndexing);
router.put('/:id', protect, adminOnly, updateBlogWithIndexing);
router.delete('/:id', protect, adminOnly, deleteBlog);

// ─── PUBLIC ROUTES ────────────────────────────────────────────────
router.get('/', getPublishedBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/slug/:slug', getBlogBySlug);

// ─── /:id MUST BE AT THE VERY BOTTOM ──────────────────────────────
router.get('/:id', getBlogById);

// ✅ ESSENTIAL: Default export for server.js
export default router;