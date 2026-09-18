import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, DEMO_USERS } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

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

  const updateCurrentUser = (partialUser) => {
    setCurrentUser((prev) => {
      const updated = { ...(prev || {}), ...partialUser };
      localStorage.setItem("health_mitra_current_user", JSON.stringify(updated));
      return updated;
    });
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
        updateCurrentUser,
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
