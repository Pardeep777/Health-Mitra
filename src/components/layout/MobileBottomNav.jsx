import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, ShieldCheck, User, PlusCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function MobileBottomNav() {
  const location = useLocation();
  const { role } = useAuth();

  // Role-specific bottom bars
  let navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Partners", path: "/partners", icon: Search },
    { label: "Verify", path: "/verify", icon: ShieldCheck, highlight: true },
    { label: "Pricing", path: "/pricing", icon: PlusCircle },
    { label: "Login", path: "/login", icon: User }
  ];

  if (role === "agent") {
    navItems = [
      { label: "Dashboard", path: "/agent", icon: Home },
      { label: "My Cards", path: "/agent/cards", icon: Search },
      { label: "+ Register", path: "/agent/register", icon: PlusCircle, highlight: true },
      { label: "Targets", path: "/agent/performance", icon: ShieldCheck },
      { label: "Profile", path: "/agent/profile", icon: User }
    ];
  } else if (role === "partner") {
    navItems = [
      { label: "Overview", path: "/partner", icon: Home },
      { label: "Verify QR", path: "/partner/verify", icon: ShieldCheck, highlight: true },
      { label: "History", path: "/partner/verifications", icon: Search },
      { label: "Services", path: "/partner/services", icon: PlusCircle },
      { label: "Profile", path: "/partner/profile", icon: User }
    ];
  } else if (role === "cardholder") {
    navItems = [
      { label: "My Card", path: "/cardholder/card", icon: Home },
      { label: "Partners", path: "/partners", icon: Search },
      { label: "Renew", path: "/cardholder/renewal", icon: PlusCircle, highlight: true },
      { label: "Verify", path: "/verify", icon: ShieldCheck },
      { label: "Profile", path: "/cardholder/profile", icon: User }
    ];
  } else if (role === "district") {
    navItems = [
      { label: "Dashboard", path: "/district/dashboard", icon: Home },
      { label: "Agents", path: "/district/agents", icon: Search },
      { label: "Cards", path: "/district/cards", icon: PlusCircle, highlight: true },
      { label: "Partners", path: "/district/partners", icon: ShieldCheck },
      { label: "Public Web", path: "/", icon: User }
    ];
  }

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden px-2 py-1 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);

        if (item.highlight) {
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center -mt-4 group"
            >
              <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg group-active:scale-95 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-brand-600 mt-1">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
              active ? "text-brand-600 font-bold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
