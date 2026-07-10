// backend/scripts/resetPassword.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // ✅ Find your admin account
    const user = await User.findOne({ role: "admin" });

    if (!user) {
      console.log("❌ No admin found!");
      process.exit(1);
    }

    console.log("👤 Found admin:", user.email);

    // ✅ Hash password manually
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash("admin123", salt);

    // ✅ Update directly - bypass pre-save hook
    await User.findByIdAndUpdate(user._id, {
      passwordHash: newHash,
    });

    console.log("✅ Password reset successfully!");
    console.log("📧 Email:", user.email);
    console.log("🔑 Password: admin123");
    console.log("⚠️ Login and change password immediately!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

resetPassword();