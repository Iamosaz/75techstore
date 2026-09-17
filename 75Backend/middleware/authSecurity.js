// 75Backend/middleware/authSecurity.js
import jwt from "jsonwebtoken";
import { securityLog } from "./securityLogger.js";

// ═══════════════════════════════════════════════════════════
// 1. BRUTE-FORCE LOGIN PROTECTION (IP + Email Throttling)
// ═══════════════════════════════════════════════════════════
const loginAttempts = new Map();

/**
 * Checks and records failed login attempts.
 * Locks the IP/Email after 5 failed attempts for 15 minutes.
 * @param {string} identifier - Client IP or Email
 */
export function trackLoginAttempt(identifier) {
  const now = Date.now();
  const lockDuration = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  const record = loginAttempts.get(identifier) || { count: 0, lockedUntil: null };

  // Check if currently locked
  if (record.lockedUntil && now < record.lockedUntil) {
    const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
    securityLog?.warning("LOCKED_LOGIN_ATTEMPT", {
      identifier,
      remainingMinutes,
    });
    return {
      allowed: false,
      reason: `Account temporarily locked due to too many failed attempts. Try again in ${remainingMinutes} minute(s).`,
    };
  }

  // If lock expired, reset counter
  if (record.lockedUntil && now >= record.lockedUntil) {
    record.count = 0;
    record.lockedUntil = null;
  }

  // Increment failed attempts
  record.count += 1;

  if (record.count >= maxAttempts) {
    record.lockedUntil = now + lockDuration;
    loginAttempts.set(identifier, record);

    securityLog?.critical("BRUTE_FORCE_LOCKOUT", {
      identifier,
      attempts: record.count,
      lockDurationMinutes: 15,
    });

    return {
      allowed: false,
      reason: "Too many failed login attempts. Your access is locked for 15 minutes.",
    };
  }

  loginAttempts.set(identifier, record);
  return { allowed: true, attemptsLeft: maxAttempts - record.count };
}

/**
 * Clears failed attempts upon successful login.
 * @param {string} identifier - Client IP or Email
 */
export function clearLoginAttempts(identifier) {
  loginAttempts.delete(identifier);
}

// ═══════════════════════════════════════════════════════════
// 2. JWT AUTHENTICATION MIDDLEWARE (verifyToken / protect)
// ═══════════════════════════════════════════════════════════
/**
 * Verifies JWT token from Authorization header or HTTP-only cookies.
 */
export function verifyToken(req, res, next) {
  let token = null;

  // Extract from Authorization Bearer Header
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  // Fallback: Extract from Cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // No token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Please login to continue.",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    securityLog?.critical("MISSING_JWT_SECRET", { ip: req.ip, url: req.originalUrl });
    return res.status(500).json({
      success: false,
      message: "Server security configuration error.",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    // Attach decoded user payload to request
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please login again.",
        code: "TOKEN_EXPIRED",
      });
    }

    if (err.name === "JsonWebTokenError") {
      securityLog?.warning("INVALID_JWT_ATTEMPT", {
        ip: req.ip,
        url: req.originalUrl,
        error: err.message,
      });

      return res.status(403).json({
        success: false,
        message: "Invalid authentication token. Access denied.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication verification failed.",
    });
  }
}

// ═══════════════════════════════════════════════════════════
// 3. ADMIN ROLE AUTHORIZATION (requireAdmin / adminOnly)
// ═══════════════════════════════════════════════════════════
/**
 * Ensures authenticated user has 'admin' role.
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "admin") {
    securityLog?.critical("UNAUTHORIZED_ADMIN_ATTEMPT", {
      ip: req.ip,
      userId: req.user.id || req.user._id,
      email: req.user.email,
      role: req.user.role,
      url: req.originalUrl,
    });

    return res.status(403).json({
      success: false,
      message: "Forbidden: Admin privileges required.",
    });
  }

  next();
}

// ═══════════════════════════════════════════════════════════
// 4. BACKWARD COMPATIBILITY ALIASES
// ═══════════════════════════════════════════════════════════
// These aliases ensure that routes importing { protect, adminOnly } continue working seamlessly!
export const protect = verifyToken;
export const adminOnly = requireAdmin;

export default {
  verifyToken,
  requireAdmin,
  protect,
  adminOnly,
  trackLoginAttempt,
  clearLoginAttempts,
};