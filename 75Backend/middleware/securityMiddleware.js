// 75Backend/middleware/security.js
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import cors from "cors";
import hpp from "hpp";
import securityConfig from "../config/securityConfig.js";
import { securityLog } from "./securityLogger.js";

// ═══════════════════════════════════════════════════════════
// LAYER 1: HTTP SECURITY HEADERS (Helmet)
// Blocks: XSS, Clickjacking, MIME Sniffing, DNS Prefetch leaks
// ═══════════════════════════════════════════════════════════
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://js.paystack.co",
        "https://checkout.paystack.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https://res.cloudinary.com",
        "https://images.unsplash.com",
      ],
      connectSrc: [
        "'self'",
        "https://api.paystack.co",
        "https://api.cloudinary.com",
        "https://ipapi.co",
        "https://ip-api.com",
        "https://date.nager.at",
      ],
      frameSrc: ["https://checkout.paystack.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'", "https://checkout.paystack.com"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  strictTransportSecurity: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xContentTypeOptions: true,
  xDnsPrefetchControl: { allow: false },
  xDownloadOptions: true,
  xFrameOptions: { action: "deny" },
  xPermittedCrossDomainPolicies: { permittedPolicies: "none" },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
  originAgentCluster: true,
});

// ═══════════════════════════════════════════════════════════
// LAYER 2: CORS — Only allow your frontend
// Blocks: Cross-origin attacks from malicious sites
// ═══════════════════════════════════════════════════════════
export const corsPolicy = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (securityConfig.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      securityLog.warning("CORS_BLOCKED", { origin });
      callback(new Error("Not allowed by CORS policy"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-CSRF-Token",
  ],
  exposedHeaders: ["X-Request-Id", "X-RateLimit-Remaining"],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
});

// ═══════════════════════════════════════════════════════════
// LAYER 3: RATE LIMITING — Block brute force & DDoS
// ═══════════════════════════════════════════════════════════
function createLimiter(config, name) {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: {
      success: false,
      error: `Rate limit exceeded. Too many ${name} requests.`,
      retryAfter: Math.ceil(config.windowMs / 60000) + " minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, _next, options) => {
      securityLog.warning("RATE_LIMIT_HIT", {
        ip: req.ip,
        url: req.originalUrl,
        limit: name,
      });
      res.status(429).json(options.message);
    },
  });
}

export const globalRateLimit = createLimiter(securityConfig.rateLimits.global, "general");
export const authRateLimit = createLimiter(securityConfig.rateLimits.auth, "login");
export const paymentRateLimit = createLimiter(securityConfig.rateLimits.payment, "payment");
export const chatbotRateLimit = createLimiter(securityConfig.rateLimits.chatbot, "chatbot");
export const adminRateLimit = createLimiter(securityConfig.rateLimits.admin, "admin");
export const apiRateLimit = createLimiter(securityConfig.rateLimits.api, "API");
export const uploadRateLimit = createLimiter(securityConfig.rateLimits.upload, "upload");

// ═══════════════════════════════════════════════════════════
// LAYER 4: BOT SLOWDOWN — Punish aggressive crawlers
// ═══════════════════════════════════════════════════════════
export const botSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 40,
  delayMs: (hits) => hits * 300,
  maxDelayMs: 10000, // Cap at 10 seconds
});

// ═══════════════════════════════════════════════════════════
// LAYER 5: HTTP PARAMETER POLLUTION PROTECTION
// Blocks: ?id=1&id=2 attacks
// ═══════════════════════════════════════════════════════════
export const hppProtection = hpp();

// ═══════════════════════════════════════════════════════════
// LAYER 6: INPUT SANITIZATION — Block injection attacks
// ═══════════════════════════════════════════════════════════
export function sanitizeInput(req, res, next) {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key]
          .replace(/\$/g, "")
          .replace(/\{/g, "")
          .replace(/\}/g, "")
          .trim();
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
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

// ═══════════════════════════════════════════════════════════
// LAYER 7: ATTACK PATTERN DETECTION
// Blocks: SQL injection, XSS, path traversal, command injection
// ═══════════════════════════════════════════════════════════
export function detectAttacks(req, res, next) {
  const input = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params,
    headers: { referer: req.get("Referer"), origin: req.get("Origin") },
  }).toLowerCase();

  for (const pattern of securityConfig.blockedPatterns) {
    if (pattern.test(input)) {
      securityLog.critical("ATTACK_DETECTED", {
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        pattern: pattern.toString(),
        input: input.substring(0, 200),
      });

      return res.status(403).json({
        success: false,
        error: "Forbidden: Malicious request detected.",
        code: "SECURITY_BLOCK",
      });
    }
  }

  next();
}

// ═══════════════════════════════════════════════════════════
// LAYER 8: BLOCK ATTACK PATHS (WordPress/PHP scanners)
// ═══════════════════════════════════════════════════════════
export function blockAttackPaths(req, res, next) {
  const lowerPath = req.path.toLowerCase();

  if (securityConfig.blockedPaths.some((p) => lowerPath.includes(p))) {
    securityLog.warning("ATTACK_PATH_BLOCKED", {
      ip: req.ip,
      path: req.path,
      userAgent: req.get("User-Agent")?.substring(0, 100),
    });
    return res.status(404).send("Not Found");
  }

  next();
}

// ═══════════════════════════════════════════════════════════
// LAYER 9: BLOCK MALICIOUS USER AGENTS (Hacking tools)
// ═══════════════════════════════════════════════════════════
export function blockMaliciousAgents(req, res, next) {
  const ua = req.get("User-Agent") || "";

  if (securityConfig.blockedUserAgents.some((pattern) => pattern.test(ua))) {
    securityLog.critical("HACKING_TOOL_BLOCKED", {
      ip: req.ip,
      userAgent: ua.substring(0, 200),
      url: req.originalUrl,
    });
    return res.status(403).send("Forbidden");
  }

  next();
}

// ═══════════════════════════════════════════════════════════
// LAYER 10: IP BLACKLIST — Block known bad IPs
// ═══════════════════════════════════════════════════════════
const ipBlacklist = new Set();

export function ipBlacklistMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;

  if (ipBlacklist.has(ip)) {
    securityLog.warning("BLACKLISTED_IP", { ip, url: req.originalUrl });
    return res.status(403).json({
      success: false,
      error: "Access denied.",
    });
  }

  next();
}

// Function to dynamically blacklist an IP (call from anywhere)
export function blacklistIP(ip, reason = "manual") {
  ipBlacklist.add(ip);
  securityLog.critical("IP_BLACKLISTED", { ip, reason });
}

// ═══════════════════════════════════════════════════════════
// LAYER 11: REQUEST SIZE LIMITER — Prevent memory attacks
// ═══════════════════════════════════════════════════════════
export function requestSizeLimiter(req, res, next) {
  const contentLength = parseInt(req.get("Content-Length") || "0");
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (contentLength > maxSize) {
    securityLog.warning("OVERSIZED_REQUEST", {
      ip: req.ip,
      size: contentLength,
      url: req.originalUrl,
    });
    return res.status(413).json({
      success: false,
      error: "Request too large. Maximum 5MB allowed.",
    });
  }

  next();
}