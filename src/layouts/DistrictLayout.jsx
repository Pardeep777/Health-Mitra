import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Toast } from "../components/common/Toast";
import { UserProfileDropdown } from "../components/layout/UserProfileDropdown";
import { MobileBottomNav } from "../components/layout/MobileBottomNav";
import logoImg from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { MapPin, LayoutDashboard, UserCheck, Building2, CreditCard } from "lucide-react";

export function DistrictLayout() {
  const { currentUser } = useAuth();
  const location = useLocation();

  const links = [
    { label: "Dashboard", path: "/district/dashboard", icon: LayoutDashboard, exact: true },
    { label: "District Agents", path: "/district/agents", icon: UserCheck },
    { label: "District Partners", path: "/district/partners", icon: Building2 },
    { label: "District Cards", path: "/district/cards", icon: CreditCard }
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      {/* District Coordinator Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-xs transition-all">
        {/* Left: Logo & District Badge */}
        <div className="flex items-center gap-3">
          <Link to="/district/dashboard" className="flex items-center gap-2.5 group">
            <div className="bg-white rounded-xl p-1 shadow-2xs border border-slate-200/80 flex items-center justify-center">
              <img src={logoImg} alt="Health Mitra" className="h-8 sm:h-9 w-auto object-contain" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-extrabold text-xs text-navy-900 tracking-tight leading-tight">
                DISTRICT COORDINATOR
              </span>
              <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-1 uppercase">
                <MapPin className="w-2.5 h-2.5" /> {currentUser?.district || "WEST TRIPURA"}
              </span>
            </div>
          </Link>
          <span className="inline-flex sm:hidden font-bold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md">
            {currentUser?.district?.slice(0, 4) || "DIST"}
          </span>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path, link.exact);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  active
                    ? "bg-brand-500 text-white font-bold shadow-xs"
                    : "text-slate-600 hover:text-navy-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: User Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          <UserProfileDropdown align="right" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto pb-24 sm:pb-16">
        <Outlet />
      </main>

      <MobileBottomNav />
      <Toast />
    </div>
  );
}
