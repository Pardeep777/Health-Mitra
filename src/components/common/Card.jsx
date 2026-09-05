import React from "react";

export function Card({
  children,
  className = "",
  hover = false,
  padding = "p-6",
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-card ${
        hover ? "hover:shadow-card-hover hover:border-slate-300 transition-all duration-300" : ""
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  variant = "default", // default, brand, emerald, blue, purple, amber
  className = ""
}) {
  const iconColors = {
    default: "bg-slate-100 text-slate-700",
    brand: "bg-orange-50 text-brand-600 border border-orange-100",
    emerald: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    blue: "bg-blue-50 text-blue-600 border border-blue-100",
    purple: "bg-purple-50 text-purple-600 border border-purple-100",
    amber: "bg-amber-50 text-amber-600 border border-amber-100"
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-extrabold text-navy-900 tracking-tight">{value}</h4>
            {trend && (
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                  trendPositive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                }`}
              >
                {trendPositive ? "+" : ""}{trend}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconColors[variant] || iconColors.default}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
}
