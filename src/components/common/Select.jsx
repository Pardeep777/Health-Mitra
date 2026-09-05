import React from "react";

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
