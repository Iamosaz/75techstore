// src/admin/context/AdminContext.jsx
import React, { createContext, useState, useCallback } from "react";

// ✅ Export context separately
export const AdminContext = createContext();

// ✅ Fixed URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ✅ Export provider as default
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

        const data = await response.json();
        console.log("📡 Backend response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        if (data.user.role !== "admin") {
          throw new Error("⛔ Access denied. Admin accounts only.");
        }

        const user = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          avatar:
            data.user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              data.user.name
            )}&background=0D8ABC&color=fff`,
        };

        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(user));
        setAdminUser(user);

        console.log("✅ Admin login successful:", user.email);
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

  React.useEffect(() => {
    const restoreSession = () => {
      try {
        const userRaw = localStorage.getItem("adminUser");
        const token = localStorage.getItem("adminToken");

        if (userRaw && token) {
          const user = JSON.parse(userRaw);
          if (user.role !== "admin") {
            console.log(`⛔ Stored user is "${user.role}" - clearing`);
            localStorage.removeItem("adminUser");
            localStorage.removeItem("adminToken");
            setAdminUser(null);
          } else {
            console.log("✅ Admin session restored:", user.email);
            setAdminUser(user);
          }
        } else {
          console.log("⚠️ No session found");
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