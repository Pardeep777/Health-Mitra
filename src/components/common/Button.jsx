import React from "react";
import { Loader2 } from "lucide-react";

export function Button({
  children,
  variant = "primary", // primary, secondary, outline, danger, success, ghost
  size = "md", // sm, md, lg
  className = "",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5 font-semibold"
  };

  const variantStyles = {
    primary: "bg-brand-500 hover:bg-brand-600 text-white shadow-sm hover:shadow-orange-glow focus:ring-brand-500",
    secondary: "bg-navy-900 hover:bg-navy-800 text-white focus:ring-navy-900",
    outline: "border border-slate-300 hover:border-brand-500 hover:text-brand-600 text-slate-700 bg-white focus:ring-brand-500",
    danger: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
    ghost: "text-slate-600 hover:text-navy-900 hover:bg-slate-100 focus:ring-slate-400"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {!loading && Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
    </button>
  );
}

export function Badge({
  children,
  variant = "default", // default, success, warning, danger, brand, info, purple
  size = "md", // sm, md
  className = ""
}) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold"
  };

  const variantStyles = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    brand: "bg-orange-50 text-brand-600 border border-orange-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200"
  };

  return (
    <span className={`inline-flex items-center rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
