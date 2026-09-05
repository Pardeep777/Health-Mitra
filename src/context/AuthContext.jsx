import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, DEMO_USERS } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser() || DEMO_USERS.admin);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If no user set initially, default to admin for demonstration
    if (!authService.getCurrentUser()) {
      localStorage.setItem("health_mitra_current_user", JSON.stringify(DEMO_USERS.admin));
      setCurrentUser(DEMO_USERS.admin);
    }
  }, []);

  const login = async (role = "admin", email = "", password = "") => {
    setLoading(true);
    try {
      const user = await authService.login(role, email, password);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (role) => {
    const user = authService.switchRole(role);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        login,
        switchRole,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
