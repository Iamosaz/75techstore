// 75Backend/server.js
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import path from 'path';
import connectDB from "./config/db.js";

// ── Existing routes ──────────────────────────────────────
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


// ── New routes ───────────────────────────────────────────
import newsletterRoutes     from './routes/newsletterRoutes.js';
import contactRoutes        from './routes/contactRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js'

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ Fixed CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Existing API routes ───────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/products',    productRoutes);
app.use('/api/orders',      orderRoutes);
app.use('/api/analytics',   analyticsRoutes);
app.use('/api/upload',      uploadRoutes);
app.use('/api/blogs',       blogRoutes);
app.use('/api/chatbot',     chatbotRoutes);
app.use('/api/dashboard',   dashboardRoutes);
app.use('/api/settings',    settingsRoutes);
app.use('/api/engineer',    engineerRoutes);
app.use('/api/repairs',     repairRoutes);
app.use('/api/digital',     digitalServiceRoutes);
app.use('/api/swap',        swapRoutes);
app.use('/api/membership', membershipRoutes)
// ── New routes ────────────────────────────────────────────
app.use('/api/newsletter',  newsletterRoutes);
app.use('/api/contact',     contactRoutes);

// ── Static uploads ────────────────────────────────────────
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// ── Connect DB ────────────────────────────────────────────
connectDB();

// ── Health check ──────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status:     "running",
    groq:       !!process.env.GROQ_API_KEY,
    brevo:      !!process.env.BREVO_API_KEY,
    storeEmail: !!process.env.STORE_EMAIL,
  });
});

app.get("/", (req, res) => {
  res.send("75TechStore Backend API is running...");
});

// ── 404 handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ── Global error handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ── Start server ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔑 Groq Key  : ${process.env.GROQ_API_KEY  ? 'LOADED ✅' : 'MISSING ❌'}`);
  console.log(`📧 Brevo API : ${process.env.BREVO_API_KEY  ? 'LOADED ✅' : 'MISSING ❌'}`);
  console.log(`📬 Store Email: ${process.env.STORE_EMAIL   ? 'LOADED ✅' : 'MISSING ❌'}`);
});