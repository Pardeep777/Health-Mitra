import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  LogOut,
  ChevronDown,
  Shield,
  Stethoscope,
  UserCheck,
  CreditCard,
  MapPin,
  Settings,
  FileText,
  Sparkles,
  ExternalLink,
  Store,
  RefreshCw,
  QrCode
} from "lucide-react";

export function UserProfileDropdown({ align = "right", compact = false }) {
  const { currentUser, role, logout, switchRole } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  const handleRoleSwitch = (newRole, path) => {
    switchRole(newRole);
    setOpen(false);
    navigate(path);
  };

  // Role details config
  const roleBadges = {
    admin: { label: "Super Admin", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Shield },
    partner: { label: "Healthcare Partner", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: Stethoscope },
    agent: { label: "Field Agent", color: "bg-amber-100 text-amber-700 border-amber-200", icon: UserCheck },
    cardholder: { label: "Member", color: "bg-blue-100 text-blue-700 border-blue-200", icon: CreditCard },
    district: { label: "District Coordinator", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: MapPin }
  };

  const currentBadge = roleBadges[role] || {
    label: role ? role.toUpperCase() : "User",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: User
  };
  const BadgeIcon = currentBadge.icon;

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 shadow-2xs hover:shadow-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        aria-expanded={open}
        aria-label="User profile menu"
      >
        <div className="relative shrink-0">
          <img
            src={
              currentUser?.avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            }
            alt={currentUser?.name || "Profile"}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200 ring-2 ring-brand-500/20"
          />
          <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>

        {!compact && (
          <div className="hidden md:block text-left max-w-[100px] lg:max-w-[130px] truncate">
            <p className="text-xs font-bold text-navy-900 leading-tight truncate">
              {currentUser?.name || "User Account"}
            </p>
            <p className="text-[10px] text-slate-500 capitalize font-medium flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
              {currentBadge.label}
            </p>
          </div>
        )}

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform duration-200 ${
            open ? "rotate-180 text-brand-500" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 animate-fadeIn divide-y divide-slate-100 overflow-hidden`}
        >
          {/* Header Info */}
          <div className="p-4 bg-gradient-to-br from-slate-50 to-orange-50/30">
            <div className="flex items-center gap-3">
              <img
                src={
                  currentUser?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                }
                alt={currentUser?.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-sm font-bold text-navy-900 truncate">
                    {currentUser?.name || "Guest User"}
                  </h4>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${currentBadge.color}`}
                  >
                    {role || "Active"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {currentUser?.email || "user@healthmitra.demo"}
                </p>
                {currentUser?.partner_name && (
                  <p className="text-[11px] font-semibold text-brand-700 truncate mt-0.5">
                    {currentUser.partner_name}
                  </p>
                )}
                {currentUser?.card_id && (
                  <p className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
                    Card ID: {currentUser.card_id}
                  </p>
                )}
                {currentUser?.agent_code && (
                  <p className="text-[10px] font-mono text-amber-700 font-bold mt-0.5">
                    Code: {currentUser.agent_code}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Role Specific Actions */}
          <div className="p-2 space-y-0.5 text-xs font-medium text-slate-700">
            {role === "admin" && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-navy-900 transition"
                >
                  <Shield className="w-4 h-4 text-brand-500" />
                  <span>Admin Dashboard</span>
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-navy-900 transition"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>System Settings & Config</span>
                </Link>
                <Link
                  to="/admin/audit-logs"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-navy-900 transition"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Audit Logs & Security</span>
                </Link>
              </>
            )}

            {role === "partner" && (
              <>
                <Link
                  to="/partner"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-navy-900 transition"
                >
                  <Stethoscope className="w-4 h-4 text-emerald-500" />
                  <span>Partner Dashboard</span>
                </Link>
                <Link
                  to="/partner/verify"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-navy-900 transition"
                >
                  <QrCode className="w-4 h-4 text-brand-500" />
                  <span>Scan & Redeem Card</span>
                </Link>
                <Link
                  to="/partner/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-navy-900 transition"
                >
                  <Store className="w-4 h-4 text-slate-500" />
                  <span>Outlet Profile & Details</span>
                </Link>
              </>
            )}

            {role === "agent" && (
              <>
                <Link
                  to="/agent"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-navy-900 transition"
                >
                  <UserCheck className="w-4 h-4 text-amber-500" />
                  <span>Agent Dashboard</span>
                </Link>
                <Link
                  to="/agent/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-navy-900 transition font-bold text-brand-600"
                >
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <span>+ New Card Enrolment</span>
                </Link>
                <Link
                  to="/agent/performance"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-navy-900 transition"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Earnings & Performance</span>
                </Link>
              </>
            )}

            {role === "cardholder" && (
              <>
                <Link
                  to="/cardholder/card"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-navy-900 transition"
                >
                  <CreditCard className="w-4 h-4 text-blue-500" />
                  <span>View Digital Card</span>
                </Link>
                <Link
                  to="/cardholder/renewal"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-navy-900 transition"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-500" />
                  <span>Renew Membership (₹49)</span>
                </Link>
                <Link
                  to="/cardholder/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-navy-900 transition"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>My Profile & Consent</span>
                </Link>
              </>
            )}

            {role === "district" && (
              <>
                <Link
                  to="/district/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-navy-900 transition"
                >
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span>District Dashboard</span>
                </Link>
                <Link
                  to="/district/agents"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-navy-900 transition"
                >
                  <UserCheck className="w-4 h-4 text-slate-500" />
                  <span>District Field Agents</span>
                </Link>
              </>
            )}

            {/* Public website quick link */}
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-navy-900 transition"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>Visit Public Website</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Home</span>
            </Link>
          </div>

          {/* Quick Demo Portal Switcher inside Menu */}
          <div className="p-3 bg-slate-50/70">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Quick Switch Portal
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                onClick={() => handleRoleSwitch("admin", "/admin")}
                className={`px-2 py-1.5 rounded-lg text-left font-medium transition flex items-center gap-1.5 ${
                  role === "admin" ? "bg-brand-500 text-white font-bold" : "bg-white hover:bg-slate-200/80 text-slate-700"
                }`}
              >
                <Shield className="w-3 h-3" /> Admin
              </button>
              <button
                onClick={() => handleRoleSwitch("partner", "/partner")}
                className={`px-2 py-1.5 rounded-lg text-left font-medium transition flex items-center gap-1.5 ${
                  role === "partner" ? "bg-brand-500 text-white font-bold" : "bg-white hover:bg-slate-200/80 text-slate-700"
                }`}
              >
                <Stethoscope className="w-3 h-3" /> Partner
              </button>
              <button
                onClick={() => handleRoleSwitch("agent", "/agent")}
                className={`px-2 py-1.5 rounded-lg text-left font-medium transition flex items-center gap-1.5 ${
                  role === "agent" ? "bg-brand-500 text-white font-bold" : "bg-white hover:bg-slate-200/80 text-slate-700"
                }`}
              >
                <UserCheck className="w-3 h-3" /> Agent
              </button>
              <button
                onClick={() => handleRoleSwitch("cardholder", "/cardholder/card")}
                className={`px-2 py-1.5 rounded-lg text-left font-medium transition flex items-center gap-1.5 ${
                  role === "cardholder" ? "bg-brand-500 text-white font-bold" : "bg-white hover:bg-slate-200/80 text-slate-700"
                }`}
              >
                <CreditCard className="w-3 h-3" /> Member
              </button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Portal</span>
              </div>
              <span className="text-[10px] text-rose-400">Exit</span>
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
}
