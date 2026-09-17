// 75Backend/middleware/security.js
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import cors from "cors";
import hpp from "hpp";
import securityConfig from "../config/securityConfig.js";
import { securityLog } from "./securityLogger.js";

// ─── 1. Security Headers (Helmet) ───
export const securityHeaders = helmet({
  contentSecurityPolicy: false, // Let React handle SPA resources
  crossOriginEmbedderPolicy: false,
});

// ─── 2. CORS Policy ───
export const corsPolicy = cors({
  origin: securityConfig.allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-CSRF-Token"],
  exposedHeaders: ["X-Request-Id", "X-RateLimit-Remaining"],
  maxAge: 86400,
});

// ─── 3. Rate Limiters ───
function createLimiter(config, name) {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: {
      success: false,
      message: `Too many ${name} requests. Please slow down.`,
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, _next, options) => {
      securityLog.warning("RATE_LIMIT_HIT", { ip: req.ip, url: req.originalUrl, limit: name });
      res.status(429).json(options.message);
    },
  });
}

export const globalRateLimit = createLimiter(securityConfig.rateLimits.global, "general");
export const authRateLimit = createLimiter(securityConfig.rateLimits.auth, "login");
export const paymentRateLimit = createLimiter(securityConfig.rateLimits.payment, "payment");
export const chatbotRateLimit = createLimiter(securityConfig.rateLimits.chatbot, "chatbot");
export const adminRateLimit = createLimiter(securityConfig.rateLimits.admin, "admin");
export const uploadRateLimit = createLimiter(securityConfig.rateLimits.upload, "upload");

// ─── 4. Bot Slow Down ───
export const botSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: (hits) => hits * 200,
  maxDelayMs: 5000,
});

// ─── 5. Parameter Pollution Protection ───
export const hppProtection = hpp();

// ─── 6. Input Sanitization (Clean NoSQL queries) ───
export function sanitizeInput(req, res, next) {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key].replace(/\$/g, "").replace(/\{/g, "").replace(/\}/g, "").trim();
      } else if (typeof obj[key] === "object") {
        sanitize(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
}

// ─── 7. Attack Pattern Detection ───
export function detectAttacks(req, res, next) {
  const input = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params,
  }).toLowerCase();

  for (const pattern of securityConfig.blockedPatterns) {
    if (pattern.test(input)) {
      securityLog.critical("ATTACK_BLOCKED", {
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        pattern: pattern.toString(),
      });

      return res.status(403).json({
        success: false,
        message: "Forbidden: Malicious input detected.",
      });
    }
  }

  next();
}

// ─── 8. Block Attack Paths ───
export function blockAttackPaths(req, res, next) {
  const lowerPath = req.path.toLowerCase();
  if (securityConfig.blockedPaths.some((p) => lowerPath.includes(p))) {
    securityLog.warning("ATTACK_PATH_BLOCKED", { ip: req.ip, path: req.path });
    return res.status(404).send("Not Found");
  }
  next();
}

// ─── 9. Block Malicious User Agents ───
export function blockMaliciousAgents(req, res, next) {
  const ua = req.get("User-Agent") || "";
  if (securityConfig.blockedUserAgents.some((p) => p.test(ua))) {
    securityLog.critical("HACKING_TOOL_BLOCKED", { ip: req.ip, userAgent: ua });
    return res.status(403).send("Forbidden");
  }
  next();
}

// ─── 10. IP Blacklist ───
const ipBlacklist = new Set();

export function ipBlacklistMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  if (ipBlacklist.has(ip)) {
    return res.status(403).json({ success: false, message: "Access denied." });
  }
  next();
}

// ─── 11. Request Size Limiter ───
export function requestSizeLimiter(req, res, next) {
  const contentLength = parseInt(req.get("Content-Length") || "0");
  if (contentLength > 10 * 1024 * 1024) { // 10MB
    return res.status(413).json({ success: false, message: "Request payload too large." });
  }
  next();
}