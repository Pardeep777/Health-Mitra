import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AdminSidebar } from "../components/layout/AdminSidebar";
import { AdminTopNavbar } from "../components/layout/AdminTopNavbar";
import { Toast } from "../components/common/Toast";
import { useAuth } from "../context/AuthContext";

export function AdminLayout() {
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not authenticated or not admin, redirect to login page
  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
          <AdminTopNavbar onToggleSidebar={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <Toast />
    </div>
  );
}

