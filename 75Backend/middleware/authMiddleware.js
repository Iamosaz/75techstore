// 75Backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verifies Bearer token
export const protect = async (req, res, next) => {
  // Checked at request time (not import time) so dotenv load order can't break it
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('Auth protect error: JWT_SECRET is not set on this server');
    return res
      .status(500)
      .json({ message: 'Server configuration error' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Not authorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!token || token === 'null' || token === 'undefined') {
    return res
      .status(401)
      .json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, secret);

    req.user = await User.findById(
      decoded.id || decoded._id || decoded.userId
    ).select('-password');

    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'Not authorized, user not found' });
    }

    return next();
  } catch (error) {
    // The server log shows the real reason: TokenExpiredError,
    // JsonWebTokenError (invalid signature / jwt malformed), etc.
    console.error(`Auth protect error [${error.name}]:`, error.message);

    const message =
      error.name === 'TokenExpiredError'
        ? 'Not authorized, session expired'
        : 'Not authorized, token failed';

    return res.status(401).json({ message });
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
  verifyToken,
};