import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  Truck,
  MapPin,
  ShieldCheck,
  RefreshCw,
  BarChart3,
  FileSpreadsheet,
  FileText,
  Settings,
  X,
  Sparkles,
  LogOut,
  ChevronRight
} from "lucide-react";
import logoImg from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";

export function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { logout, currentUser } = useAuth();

  const navigationGroups = [
    {
      title: "Core Operations",
      items: [
        { label: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
        { label: "Cardholders", path: "/admin/cardholders", icon: Users },
        { label: "Partners", path: "/admin/partners", icon: Building2 },
        { label: "Field Agents", path: "/admin/agents", icon: UserCheck },
        { label: "Distributors", path: "/admin/distributors", icon: Truck },
        { label: "Districts", path: "/admin/districts", icon: MapPin }
      ]
    },
    {
      title: "Monitoring & Retention",
      items: [
        { label: "Verification Logs", path: "/admin/verification", icon: ShieldCheck },
        { label: "Renewals (30d)", path: "/admin/renewals", icon: RefreshCw },
        { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
        { label: "Reports Center", path: "/admin/reports", icon: FileSpreadsheet }
      ]
    },
    {
      title: "Compliance & System",
      items: [
        { label: "Audit Logs", path: "/admin/audit-logs", icon: FileText },
        { label: "Settings", path: "/admin/settings", icon: Settings }
      ]
    }
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 lg:top-[33px] bottom-0 left-0 z-40 w-64 bg-navy-950 text-slate-300 border-r border-navy-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-navy-800">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Health Mitra Logo"
              className="h-9 w-auto object-contain bg-white rounded-xl p-1 shadow-sm"
            />
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Mini Card */}
        <div className="px-4 py-3.5 mx-3 my-3 rounded-xl bg-navy-900 border border-navy-800 flex items-center gap-3">
          <img
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500/50"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{currentUser?.name || "Admin"}</p>
            <p className="text-[10px] text-brand-400 font-semibold uppercase tracking-wider">Super Administrator</p>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 px-3 py-2 space-y-6 overflow-y-auto">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {group.title}
              </p>
              {group.items.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      active
                        ? "bg-brand-500 text-white font-bold shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-navy-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {active && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-navy-800 flex items-center justify-between">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-navy-800 transition"
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back to Website
          </Link>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
