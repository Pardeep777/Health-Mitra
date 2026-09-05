import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShieldCheck, ChevronRight, Sparkles, HeartPulse, User } from "lucide-react";
import logoImg from "../../assets/logo.png";
import { Button } from "../common/Button";
import { UserProfileDropdown } from "./UserProfileDropdown";

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const primaryNavLinks = [
    { label: "Home", path: "/" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Find a Partner", path: "/partners" },
    { label: "Pricing", path: "/pricing" },
    { label: "Become a Partner", path: "/become-partner" }
  ];

  const secondaryNavLinks = [
    { label: "About", path: "/about" },
    { label: "FAQ", path: "/faq" },
    { label: "Contact", path: "/contact" }
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <img
              src={logoImg}
              alt="Health Mitra Logo"
              className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 shrink-0">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-150 ${
                  isActive(link.path)
                    ? "text-brand-600 bg-orange-50 font-bold"
                    : "text-slate-600 hover:text-navy-900 hover:bg-slate-100/70"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Extra links on XL screens */}
            {secondaryNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`hidden xl:inline-block px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-150 ${
                  isActive(link.path)
                    ? "text-brand-600 bg-orange-50 font-bold"
                    : "text-slate-600 hover:text-navy-900 hover:bg-slate-100/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <Link to="/verify" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" icon={ShieldCheck} className="text-xs px-2.5 py-1.5">
                Verify Card
              </Button>
            </Link>

            <Link to="/enquiry" className="hidden sm:inline-flex">
              <Button variant="primary" size="sm" className="text-xs px-3 py-1.5 shadow-xs">
                Get Card (₹49)
              </Button>
            </Link>

            {/* User Profile Dropdown */}
            <UserProfileDropdown align="right" compact={false} />

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center ml-1">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 animate-fadeIn shadow-xl">
          <div className="space-y-1">
            {allNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive(link.path)
                    ? "text-brand-600 bg-orange-50 font-bold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Photo Gallery
            </Link>
            <Link
              to="/team"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Management Team
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link to="/enquiry" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                Get Health Mitra Card — ₹49/Yr
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/verify" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full" icon={ShieldCheck}>
                  Verify Card
                </Button>
              </Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full" icon={User}>
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
