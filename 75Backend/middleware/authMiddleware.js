import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔓 Token verified for:", decoded.email);

    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ message: "Token invalid - user not found" });
    }

    // ✅ Fixed - use actual user from DB not decoded token
    req.user = user;
    next();

  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token invalid or expired" });
    }

    return res.status(401).json({ message: "Authorization failed" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};
