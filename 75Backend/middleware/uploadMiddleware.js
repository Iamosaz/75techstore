import multer from 'multer';
import path from 'path';

// ========== CONFIGURE STORAGE ==========
const storage = multer.memoryStorage(); // Store in memory for cloud upload

// ========== FILE FILTER ==========
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }

  if (file.size > maxSize) {
    return cb(new Error('File size must be less than 5MB'), false);
  }

  cb(null, true);
};

// ========== MULTER CONFIGURATION ==========
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// ========== SINGLE FILE UPLOAD ==========
export const uploadSingle = upload.single('image');

// ========== MULTIPLE FILES UPLOAD ==========
export const uploadMultiple = upload.array('images', 10); // Max 10 files

// ========== CUSTOM ERROR HANDLER FOR MULTER ==========
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File size exceeds 5MB limit' 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        message: 'Too many files. Maximum 10 files allowed' 
      });
    }
  }

  if (err) {
    return res.status(400).json({ 
      message: err.message || 'File upload failed' 
    });
  }

  next();
};

// ========== VALIDATE IMAGE UPLOAD ==========
export const validateImageUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ 
      message: 'No image file provided' 
    });
  }

  next();
};

// ========== VALIDATE MULTIPLE IMAGE UPLOADS ==========
export const validateMultipleImageUploads = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ 
      message: 'No image files provided' 
    });
  }

  next();
};