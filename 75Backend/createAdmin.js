// backend/scripts/createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin exists
    const existing = await User.findOne({ email: "admin@75techstore.com" });
    if (existing) {
      console.log("⚠️ Admin already exists!");
      process.exit(0);
    }

    // Create admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("admin123", salt);

    const admin = await User.create({
      name: "75TechStore Admin",
      email: "admin@75techstore.com",
      passwordHash,
      role: "admin",
      phone: "",
      address: "",
    });

    console.log("✅ Admin created successfully!");
    console.log("📧 Email: admin@75techstore.com");
    console.log("🔑 Password: admin123");
    console.log("⚠️ CHANGE PASSWORD AFTER FIRST LOGIN!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdmin();