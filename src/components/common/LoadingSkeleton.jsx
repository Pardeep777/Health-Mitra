import React from "react";

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
