import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Toast } from "../components/common/Toast";
import { UserProfileDropdown } from "../components/layout/UserProfileDropdown";
import { MobileBottomNav } from "../components/layout/MobileBottomNav";
import logoImg from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { CreditCard, RefreshCw, User, Sparkles } from "lucide-react";

export function CardholderLayout() {
  const { currentUser } = useAuth();
  const location = useLocation();

  const links = [
    { label: "My Digital Card", path: "/cardholder/card", icon: CreditCard },
    { label: "Renew Membership", path: "/cardholder/renewal", icon: RefreshCw },
    { label: "My Profile & Consent", path: "/cardholder/profile", icon: User }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      {/* Member Portal Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-xs transition-all">
        {/* Left: Logo & Member Portal Badge */}
        <div className="flex items-center gap-3">
          <Link to="/cardholder/card" className="flex items-center gap-2.5">
            <img src={logoImg} alt="Health Mitra" className="h-9 w-auto" />
            <div className="hidden sm:flex flex-col">
              <span className="font-extrabold text-xs text-navy-900 tracking-tight leading-tight">
                MEMBER PORTAL
              </span>
              <span className="text-[10px] text-emerald-600 font-bold font-mono">
                {currentUser?.card_id || "HMC-ACTIVE"}
              </span>
            </div>
          </Link>
          <span className="inline-flex sm:hidden font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
            MEMBER
          </span>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden sm:flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
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

        {/* Right: Quick Action + Right-Side User Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/cardholder/renewal" className="hidden sm:inline-flex">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Renew (₹49)</span>
            </button>
          </Link>

          {/* User Profile Dropdown */}
          <UserProfileDropdown align="right" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto pb-24 sm:pb-16">
        <Outlet />
      </main>

      <MobileBottomNav />
      <Toast />
    </div>
  );
}

