import express from 'express';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const upload = multer({ storage });
const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  // graceful check: no file = friendly 400
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded — check the field name is "image".' });
  }

  // normalize slashes for Windows paths
  const normalized = req.file.path.replace(/\\/g, '/');
  res.json({
    message: 'File uploaded successfully',
    imageUrl: `/${normalized}`
  });
});

export default router;