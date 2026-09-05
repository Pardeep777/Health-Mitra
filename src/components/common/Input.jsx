import React from "react";

export function Input({
  label,
  error,
  helperText,
  icon: Icon,
  className = "",
  type = "text",
  required = false,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          className={`w-full rounded-xl border ${
            error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-brand-500 focus:ring-brand-100"
          } bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition duration-200 ${
            Icon ? "pl-10" : ""
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}

export function Select({
  label,
  error,
  helperText,
  options = [],
  className = "",
  required = false,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        className={`w-full rounded-xl border ${
          error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-brand-500 focus:ring-brand-100"
        } bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-4 transition duration-200 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}
