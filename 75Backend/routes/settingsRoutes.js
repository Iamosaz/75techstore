// backend/routes/settingsRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ─── GET Admin Profile ────────────────────────────────────────────
router.get("/profile", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── UPDATE Admin Profile ─────────────────────────────────────────
router.put("/profile", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // Check if email taken by another user
    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.user.id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use by another account",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
        phone: phone || "",
        address: address || "",
      },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── UPDATE Password ──────────────────────────────────────────────
router.put("/password", protect, adminOnly, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Get user WITH passwordHash
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // ✅ Hash new password manually
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // ✅ Use findByIdAndUpdate - bypasses pre-save hook
    await User.findByIdAndUpdate(
      req.user.id,
      { passwordHash: newHashedPassword },
      { new: true }
    );

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── UPDATE Notifications ─────────────────────────────────────────
router.put("/notifications", protect, adminOnly, async (req, res) => {
  try {
    const { notifications } = req.body;

    if (!notifications) {
      return res.status(400).json({
        success: false,
        message: "Notifications data is required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { notifications },
      { new: true }
    ).select("-passwordHash");

    res.json({
      success: true,
      message: "Notification preferences saved",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ THIS IS WHAT WAS MISSING!
export default router;