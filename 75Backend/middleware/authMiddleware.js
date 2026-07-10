import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ✅ Add detailed logging
    console.log('🔍 Full Auth Header:', req.headers.authorization);
    console.log('🔍 Extracted Token:', token ? token.substring(0, 30) + '...' : 'MISSING');
    console.log('🔍 Request URL:', req.method, req.url);

    if (!token) {
      return res.status(401).json({ 
        message: "No token, authorization denied" 
      });
    }

    if (token === 'null' || token === 'undefined' || token === '') {
      return res.status(401).json({ 
        message: "Invalid token format" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔓 Token verified for:", decoded.email);

    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ 
        message: "Token invalid - user not found" 
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);
    console.error("❌ Token that failed:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token invalid, please login again" });
    }

    return res.status(401).json({ message: "Authorization failed" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ 
      message: "Access denied. Admins only." 
    });
  }
};