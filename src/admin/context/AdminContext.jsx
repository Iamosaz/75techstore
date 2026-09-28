// src/admin/context/AdminContext.jsx
import React, { createContext, useState, useCallback, useEffect } from "react";

// ── 🛡️ PRODUCTION TRAILING SLASH & ENDPOINT SAFEGUARD ──
const getCleanApiUrl = () => {
  const rawUrl =
    import.meta.env?.VITE_API_URL ||
    (typeof process !== 'undefined' && (process.env?.REACT_APP_API_URL || process.env?.NEXT_PUBLIC_API_URL)) ||
    'http://localhost:5000/api';

  let clean = rawUrl.trim().replace(/\/+$/, '');
  if (!clean.endsWith('/api')) {
    clean = `${clean}/api`;
  }
  return clean;
};

const API_URL = getCleanApiUrl();

// 1. Create and Export Context directly here
export const AdminContext = createContext(null);

// 2. Export Provider Component
export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const login = useCallback((email, password) => {
    setLoading(true);
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`🔐 Admin login attempt: ${email}`);
        console.log(`🌐 Calling: ${API_URL}/auth/admin/login`);

        const response = await fetch(`${API_URL}/auth/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned an invalid non-JSON response.");
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        if (data.user?.role !== "admin") {
          throw new Error("⛔ Access denied. Admin accounts only.");
        }

        const user = {
          id: data.user.id || data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          avatar:
            data.user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              data.user.name || "Admin"
            )}&background=0D8ABC&color=fff`,
        };

        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(user));
        setAdminUser(user);

        resolve(user);
      } catch (error) {
        console.error("❌ Admin login failed:", error.message);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        reject(error);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const logout = useCallback(() => {
    setAdminUser(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    console.log("🚪 Admin logged out");
  }, []);

  useEffect(() => {
    const restoreSession = () => {
      try {
        const userRaw = localStorage.getItem("adminUser");
        const token = localStorage.getItem("adminToken");

        if (userRaw && token) {
          const user = JSON.parse(userRaw);
          if (user.role !== "admin") {
            localStorage.removeItem("adminUser");
            localStorage.removeItem("adminToken");
            setAdminUser(null);
          } else {
            setAdminUser(user);
          }
        } else {
          setAdminUser(null);
        }
      } catch (error) {
        console.error("❌ Session restore failed:", error);
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");
        setAdminUser(null);
      } finally {
        setIsInitialized(true);
      }
    };

    restoreSession();
  }, []);

  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        loading,
        isInitialized,
        notifications,
        login,
        logout,
        addNotification,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export default AdminProvider;