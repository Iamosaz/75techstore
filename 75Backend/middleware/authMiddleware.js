// 75Backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verifies Bearer token
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      req.user = await User.findById(decoded.id || decoded._id || decoded.userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      return next();
    } catch (error) {
      console.error('Auth protect error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Admin middleware - checks for admin privilege levels
export const admin = (req, res, next) => {
  if (
    req.user &&
    (req.user.isAdmin === true ||
      req.user.role === 'admin' ||
      req.user.role === 'superadmin')
  ) {
    return next();
  }
  return res.status(403).json({ message: 'Not authorized as an admin' });
};

// Compatibility Exports/Aliases
export const adminOnly = admin;
export const isAdmin = admin;
export const verifyToken = protect;

export default {
  protect,
  admin,
  adminOnly,
  isAdmin,
  verifyToken
};