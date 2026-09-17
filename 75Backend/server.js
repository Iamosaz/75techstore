// 75Backend/server.js
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import path from 'path';
import cookieParser from 'cookie-parser';
import compression from 'compression'; 
import connectDB from "./config/db.js";

// ── Security Imports ─────────────────────────────────────
import {
  securityHeaders,
  corsPolicy,
  globalRateLimit,
  authRateLimit,
  paymentRateLimit,
  chatbotRateLimit,
  adminRateLimit,
  uploadRateLimit,
  botSlowDown,
  hppProtection,
  sanitizeInput,
  detectAttacks,
  blockAttackPaths,
  blockMaliciousAgents,
  ipBlacklistMiddleware,
  requestSizeLimiter,
} from "./middleware/security.js";
import { auditLogger, securityLog } from "./middleware/securityLogger.js";

// ── Routes ───────────────────────────────────────────────
import userRoutes           from "./routes/userRoutes.js";
import productRoutes        from './routes/productRoutes.js';
import orderRoutes          from './routes/orderRoutes.js';
import authRoutes           from './routes/authRoutes.js';
import analyticsRoutes      from './routes/analyticsRoutes.js';
import uploadRoutes         from './routes/uploadRoutes.js';
import blogRoutes           from './routes/blogRoutes.js';
import chatbotRoutes        from './routes/chatbotRoutes.js';
import dashboardRoutes      from './routes/dashboardRoutes.js';
import settingsRoutes       from './routes/settingsRoutes.js';
import engineerRoutes       from './routes/engineerRoutes.js';
import repairRoutes         from './routes/repairRoutes.js';
import digitalServiceRoutes from './routes/digitalServiceRoutes.js';
import swapRoutes           from './routes/swapRoutes.js';
import seasonalProductsRoutes from "./routes/seasonalProducts.js";
import indexingRoutes       from "./routes/indexing.js";
import newsletterRoutes     from './routes/newsletterRoutes.js';
import contactRoutes        from './routes/contactRoutes.js';
import membershipRoutes     from './routes/membershipRoutes.js';
import seasonal             from './routes/seasonal.js';

const app = express();
const isProduction = process.env.NODE_ENV === "production";

// ═══════════════════════════════════════════════════════════
// SECURE RATE LIMIT WRAPPERS
// ═══════════════════════════════════════════════════════════
const secureAdminRateLimit = (req, res, next) => {
  const isLocalhost = req.ip === '::1' || req.ip === '127.0.0.1' || req.ip === '::ffff:127.0.0.1';
  if (!isProduction && isLocalhost) return next();
  return adminRateLimit(req, res, next);
};

const secureGlobalRateLimit = (req, res, next) => {
  const isLocalhost = req.ip === '::1' || req.ip === '127.0.0.1' || req.ip === '::ffff:127.0.0.1';
  if (!isProduction && isLocalhost) return next();
  return globalRateLimit(req, res, next);
};

// ═══════════════════════════════════════════════════════════
// TRUST PROXY
// ═══════════════════════════════════════════════════════════
app.set("trust proxy", 1);

// ═══════════════════════════════════════════════════════════
// SECURITY STACK — 12 Layers (100% intact)
// ═══════════════════════════════════════════════════════════
app.use(blockAttackPaths);
app.use(blockMaliciousAgents);
app.use(ipBlacklistMiddleware);
app.use(securityHeaders);

app.use(cors({
  origin: [
    'https://www.75techstore.com.ng',
    'https://75techstore.com.ng',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  exposedHeaders: ['X-Request-Id', 'X-RateLimit-Remaining'],
  maxAge: 86400,
}));

app.use(auditLogger);
app.use(detectAttacks);
app.use(requestSizeLimiter);
app.use(secureGlobalRateLimit);
app.use(botSlowDown);
app.use(hppProtection);
app.use(sanitizeInput);

// ═══════════════════════════════════════════════════════════
// SPEED: GZIP/BROTLI COMPRESSION
// ═══════════════════════════════════════════════════════════
app.use(compression({
  level: 6,
  threshold: 512,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// ═══════════════════════════════════════════════════════════
// PAYSTACK WEBHOOK
// ═══════════════════════════════════════════════════════════
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json", limit: "1mb" }),
  async (req, res) => {
    try {
      const crypto = await import("crypto");
      const secret = process.env.PAYSTACK_SECRET_KEY;
      if (!secret) return res.status(500).send("Server misconfiguration");

      const signature = req.headers["x-paystack-signature"];
      if (!signature) return res.status(401).send("No signature");

      const rawBody = req.body.toString();
      const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");

      if (!crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature))) {
        return res.status(401).send("Invalid signature");
      }

      const event = JSON.parse(rawBody);
      if (event.event === "charge.success") {
        securityLog.info("PAYMENT_SUCCESS", {
          reference: event.data.reference,
          amount: `₦${event.data.amount / 100}`,
        });
      }
      res.status(200).send("OK");
    } catch (err) {
      securityLog.critical("WEBHOOK_ERROR", { error: err.message });
      res.status(200).send("OK");
    }
  }
);

// ═══════════════════════════════════════════════════════════
// STANDARD MIDDLEWARE
// ═══════════════════════════════════════════════════════════
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// ═══════════════════════════════════════════════════════════
// SPEED: STATIC FILE CACHING
// ═══════════════════════════════════════════════════════════
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads'), {
  maxAge: '30d',
  immutable: true,
  setHeaders: (res) => {
    res.set('Cache-Control', 'public, max-age=2592000, immutable');
    res.set('X-Content-Type-Options', 'nosniff');
  }
}));

// ═══════════════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════════════
app.use('/api/auth', authRateLimit, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', paymentRateLimit, orderRoutes);
app.use('/api/analytics', secureAdminRateLimit, analyticsRoutes);
app.use('/api/upload', uploadRateLimit, uploadRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/chatbot', chatbotRateLimit, chatbotRoutes);
app.use('/api/dashboard', secureAdminRateLimit, dashboardRoutes);
app.use('/api/settings', secureAdminRateLimit, settingsRoutes);
app.use('/api/engineer', engineerRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/digital', digitalServiceRoutes);
app.use('/api/swap', swapRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/seasonal', seasonal);
app.use("/api/seasonal-products", seasonalProductsRoutes);
app.use("/api/indexing", indexingRoutes);

// ═══════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════
app.get("/api/health", (req, res) => {
  res.json({
    status: "running",
    security: "12 layers active",
    compression: "gzip/brotli enabled",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("75TechStore Backend API is running... 🚀🔒");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  securityLog.critical("UNHANDLED_ERROR", {
    ip: req.ip, url: req.originalUrl, error: err.message,
  });
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: isProduction ? "Internal server error" : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

// ═══════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\n╔══════════════════════════════════════════════╗`);
      console.log(`║  🚀 75TechStore API running on port ${PORT}      ║`);
      console.log(`╠══════════════════════════════════════════════╣`);
      console.log(`║  🔒 Security     : 12 Layers ACTIVE         ║`);
      console.log(`║  ⚡ Compression  : Gzip/Brotli ENABLED      ║`);
      console.log(`║  💾 Caching      : 30-day Static Cache      ║`);
      console.log(`║  🚦 Rate Limit   : Smart (Dev Bypass)       ║`);
      console.log(`╚══════════════════════════════════════════════╝\n`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

export default app;