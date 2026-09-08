import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Toast } from "../components/common/Toast";
import { MobileBottomNav } from "../components/layout/MobileBottomNav";
import { UserProfileDropdown } from "../components/layout/UserProfileDropdown";
import { NotificationDrawer } from "../components/layout/NotificationDrawer";
import { useNotifications } from "../context/NotificationContext";
import logoImg from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Target,
  User,
  Bell,
  Sparkles
} from "lucide-react";

export function AgentLayout() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const { unreadCount } = useNotifications();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const links = [
    { label: "Dashboard", path: "/agent", icon: LayoutDashboard, exact: true },
    { label: "Enrolment Form", path: "/agent/register", icon: UserPlus },
    { label: "My Registrations", path: "/agent/cards", icon: Users },
    { label: "Targets & Earnings", path: "/agent/performance", icon: Target },
    { label: "Agent Profile", path: "/agent/profile", icon: User }
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      {/* Field Agent Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-xs transition-all">
        {/* Left: Brand Logo & Agent Portal Badge */}
        <div className="flex items-center gap-3">
          <Link to="/agent" className="flex items-center gap-2.5">
            <img src={logoImg} alt="Health Mitra" className="h-9 w-auto" />
            <div className="hidden sm:flex flex-col">
              <span className="font-extrabold text-xs text-navy-900 tracking-tight leading-tight">
                FIELD AGENT PORTAL
              </span>
              <span className="text-[10px] text-amber-600 font-bold font-mono">
                {currentUser?.agent_code || "HM-AGT-0101"}
              </span>
            </div>
          </Link>
          <span className="inline-flex sm:hidden font-bold text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-mono">
            {currentUser?.agent_code || "AGENT"}
          </span>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  active
                    ? "bg-brand-500 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-navy-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Quick Action + Notifications + User Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Enrolment CTA */}
          <Link to="/agent/register" className="hidden sm:inline-flex">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ New Card (₹49)</span>
            </button>
          </Link>

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

      {/* Main Content Area */}
      <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <MobileBottomNav />
      <Toast />
    </div>
  );
}
