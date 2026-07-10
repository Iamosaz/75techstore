import React, { createContext, useState, useCallback } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const login = useCallback((email, password) => {
    setLoading(true);
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`🔐 Calling backend login for: ${email}`);

        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("📡 Backend response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        localStorage.setItem("adminToken", data.token);

        const user = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          avatar:
            data.user.avatar ||
            `https://ui-avatars.com/api/?name=${data.user.name}&background=0D8ABC&color=fff`,
        };

        localStorage.setItem("adminUser", JSON.stringify(user));
        setAdminUser(user);
        setLoading(false);

        console.log("✅ Login successful!");
        resolve(user);
      } catch (error) {
        console.error("❌ Login error:", error.message);
        setLoading(false);
        reject(error);
      }
    });
  }, []);

  const logout = useCallback(() => {
    setAdminUser(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    console.log("🚪 Logged out");
  }, []);

  React.useEffect(() => {
    const user = localStorage.getItem("adminUser");
    const token = localStorage.getItem("adminToken");

    if (user && token) {
      console.log("✅ Restoring session from localStorage");
      try {
        setAdminUser(JSON.parse(user));
      } catch (e) {
        console.error("❌ Failed to parse adminUser from localStorage");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");
      }
    } else {
      console.log("⚠️ No session found in localStorage");
    }

    setIsInitialized(true);
  }, []);

  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const value = {
    adminUser,
    loading,
    isInitialized,
    notifications,
    login,
    logout,
    addNotification,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};