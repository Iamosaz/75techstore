import express from 'express';
import { upload } from '../config/cloudinary.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Upload single image
router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          message: 'No image file provided' 
        });
      }

      console.log('✅ Image uploaded to Cloudinary:', req.file.path);

      res.json({
        message: 'Image uploaded successfully',
        imageUrl: req.file.path  // ✅ Cloudinary URL
      });

    } catch (error) {
      console.error('❌ Upload error:', error);
      res.status(500).json({ message: 'Image upload failed' });
    }
  }
);

export default router;