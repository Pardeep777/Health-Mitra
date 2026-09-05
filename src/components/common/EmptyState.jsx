import React from "react";
import { FolderSearch } from "lucide-react";
import { Button } from "./Button";

export function EmptyState({
  title = "No data available",
  subtitle = "There are no records matching your current filter.",
  actionText,
  onAction,
  icon: Icon = FolderSearch,
  className = ""
}) {
  return (
    <div className={`p-10 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-slate-200 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-brand-500 mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-bold text-navy-900">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">{subtitle}</p>
      {actionText && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

export function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse">
      <div className="h-6 bg-slate-200 rounded-lg w-1/4"></div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 bg-slate-100 rounded w-1/5"></div>
            <div className="h-4 bg-slate-100 rounded w-2/5"></div>
            <div className="h-4 bg-slate-100 rounded w-1/5"></div>
            <div className="h-4 bg-slate-100 rounded w-1/5"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
