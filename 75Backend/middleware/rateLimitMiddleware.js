import rateLimit from 'express-rate-limit';

// ========== GENERAL RATE LIMITER ==========
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// ========== LOGIN RATE LIMITER (stricter) ==========
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again after 15 minutes',
  skipSuccessfulRequests: true // Don't count successful requests
});

// ========== API RATE LIMITER (for public endpoints) ==========
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Too many API requests, please try again later'
});

// ========== CREATE RATE LIMITER (for POST requests) ==========
export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 create requests per minute
  message: 'Too many create requests, please try again later'
});

// ========== UPLOAD RATE LIMITER ==========
export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 uploads per minute
  message: 'Too many upload requests, please try again later'
});