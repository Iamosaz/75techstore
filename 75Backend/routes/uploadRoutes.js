// 75Backend/routes/uploadroutes.js
import express from 'express';
import { upload, cloudinary } from '../config/cloudinary.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to stream upload buffer directly to Cloudinary
const streamUpload = (buffer, folder = '75techstore/products') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    stream.end(buffer);
  });
};

// ── 1. Upload Single Image (Main Cover Photo) ──
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided in request' });
    }

    console.log(`📤 Uploading cover image "${req.file.originalname}" to Cloudinary...`);
    const result = await streamUpload(req.file.buffer);
    console.log(`✅ Upload successful: ${result.secure_url}`);

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error('❌ Cloudinary Upload Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image',
    });
  }
});

// ── 2. Health Test Route ──
router.get('/test', async (req, res) => {
  try {
    const ping = await cloudinary.api.ping();
    res.json({ success: true, message: 'Cloudinary connection is working!', ping });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Cloudinary config error', error: error.message });
  }
});

export default router;