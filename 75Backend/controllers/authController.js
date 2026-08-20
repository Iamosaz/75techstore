// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ========== LOGIN ==========
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔐 Login attempt:", email);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ User found:", user.email, "| Role:", user.role);

    // ✅ RESTORED — back to passwordHash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log("❌ Password does not match");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== "admin") {
      console.log("❌ Not an admin:", user.role);
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful:", email);

    return res.status(200).json({
      token,
      user: {
        id:     user._id,
        name:   user.name,
        email:  user.email,
        role:   user.role,
        avatar: user.avatar ||
          `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ========== LOGOUT ==========
export const logout = async (req, res) => {
  try {
    console.log("🚪 Logout request");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ========== GET PROFILE ==========
export const getProfile = async (req, res) => {
  try {
    console.log("👤 Fetching profile for:", req.user?._id);

    // ✅ RESTORED — back to -passwordHash
    const user = await User.findById(req.user._id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id:        user._id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        avatar:    user.avatar ||
          `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Get profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ========== UPDATE PROFILE ==========
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log("✏️ Updating profile for:", req.user?._id);

    // ✅ RESTORED — back to -passwordHash
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id:    updatedUser._id,
        name:  updatedUser.name,
        email: updatedUser.email,
        role:  updatedUser.role,
      },
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ========== CHANGE PASSWORD ==========
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    console.log("🔑 Change password for:", req.user?._id);

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ RESTORED — back to passwordHash
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // ✅ RESTORED — hash manually and save to passwordHash
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    console.log("✅ Password changed successfully");
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("❌ Change password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};