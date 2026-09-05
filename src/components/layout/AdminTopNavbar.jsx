import React, { useState } from "react";
import { Menu, Bell, Search, Sparkles, Activity } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { NotificationDrawer } from "./NotificationDrawer";
import { UserProfileDropdown } from "./UserProfileDropdown";

export function AdminTopNavbar({ onToggleSidebar, title = "Admin Operations Center" }) {
  const { currentUser, role } = useAuth();
  const { unreadCount } = useNotifications();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between transition-all">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-100 lg:hidden transition"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-navy-900 leading-none">{title}</h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE OPS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5 font-medium">
              Tripura Healthcare Operations & Partner Network
            </p>
          </div>
        </div>

        {/* Right: Quick search, notifications, profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Bar */}
          <div className="relative hidden md:block w-56 lg:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Card / Partner / Agent..."
              className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 pl-9 pr-3 py-2 rounded-xl border border-transparent focus:border-brand-500 focus:outline-none transition shadow-2xs"
            />
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative p-2.5 rounded-xl border border-slate-200/90 bg-white text-slate-600 hover:text-navy-900 hover:bg-slate-50 transition shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-brand-500 text-white text-[10px] font-extrabold rounded-full ring-2 ring-white animate-pulse px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Right-Side User Profile Dropdown */}
          <UserProfileDropdown align="right" />
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

