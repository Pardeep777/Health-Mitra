import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, UserCheck, Stethoscope, Users, MapPin, Globe, Sparkles } from "lucide-react";

export function DemoRoleSwitcher() {
  const { currentUser, role, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    if (newRole === "admin") navigate("/admin");
    else if (newRole === "partner") navigate("/partner");
    else if (newRole === "agent") navigate("/agent");
    else if (newRole === "cardholder") navigate("/cardholder/card");
    else if (newRole === "district") navigate("/district/dashboard");
  };

  const isPublicPage = !location.pathname.startsWith("/admin") &&
    !location.pathname.startsWith("/partner") &&
    !location.pathname.startsWith("/agent") &&
    !location.pathname.startsWith("/cardholder") &&
    !location.pathname.startsWith("/district");

  return (
    <div className="bg-navy-950 text-slate-300 text-xs border-b border-navy-800 px-4 sm:px-6 py-1.5 relative z-50 select-none w-full shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-brand-400">
            <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" /> DEMO ROLE SWITCHER:
          </span>
          <span className="hidden md:inline text-slate-400">
            Logged in as: <strong className="text-white capitalize">{currentUser?.name || "Guest"}</strong> ({role ? role.toUpperCase() : "PUBLIC"})
          </span>
        </div>

      <div className="flex items-center gap-1 overflow-x-auto py-0.5">
        <button
          onClick={() => navigate("/")}
          className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 text-[11px] ${
            isPublicPage ? "bg-white/20 text-white font-bold" : "hover:bg-white/10 text-slate-300"
          }`}
        >
          <Globe className="w-3 h-3" /> Public Web
        </button>

        <button
          onClick={() => handleRoleChange("admin")}
          className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 text-[11px] ${
            role === "admin" && !isPublicPage
              ? "bg-brand-500 text-white font-bold shadow-sm"
              : "hover:bg-white/10 text-slate-300"
          }`}
        >
          <Shield className="w-3 h-3" /> Admin
        </button>

        <button
          onClick={() => handleRoleChange("partner")}
          className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 text-[11px] ${
            role === "partner" && !isPublicPage
              ? "bg-brand-500 text-white font-bold shadow-sm"
              : "hover:bg-white/10 text-slate-300"
          }`}
        >
          <Stethoscope className="w-3 h-3" /> Partner
        </button>

        <button
          onClick={() => handleRoleChange("agent")}
          className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 text-[11px] ${
            role === "agent" && !isPublicPage
              ? "bg-brand-500 text-white font-bold shadow-sm"
              : "hover:bg-white/10 text-slate-300"
          }`}
        >
          <UserCheck className="w-3 h-3" /> Field Agent
        </button>

        <button
          onClick={() => handleRoleChange("cardholder")}
          className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 text-[11px] ${
            role === "cardholder" && !isPublicPage
              ? "bg-brand-500 text-white font-bold shadow-sm"
              : "hover:bg-white/10 text-slate-300"
          }`}
        >
          <Users className="w-3 h-3" /> Cardholder
        </button>

        <button
          onClick={() => handleRoleChange("district")}
          className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 text-[11px] ${
            role === "district" && !isPublicPage
              ? "bg-brand-500 text-white font-bold shadow-sm"
              : "hover:bg-white/10 text-slate-300"
          }`}
        >
          <MapPin className="w-3 h-3" /> District
        </button>
      </div>
    </div>
  </div>
  );
}
