import cors from 'cors';
import helmet from 'helmet';

// ========== CORS CONFIGURATION ==========
export const corsConfig = cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// ========== HELMET SECURITY ==========
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  }
});

// ========== PREVENT PARAMETER POLLUTION ==========
export const preventPollution = (req, res, next) => {
  // Limit query parameters
  const maxParams = 10;
  if (Object.keys(req.query).length > maxParams) {
    return res.status(400).json({
      message: 'Too many query parameters'
    });
  }

  next();
};

// ========== SANITIZE REQUEST ==========
export const sanitizeRequest = (req, res, next) => {
  // Remove script tags from inputs
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/<script[^>]*>.*?<\/script>/gi, '');
      }
    });
  }

  next();
};