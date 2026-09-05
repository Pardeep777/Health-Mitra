import React from "react";
import { Pagination } from "./Pagination";
import { EmptyState } from "./EmptyState";
import { LoadingSkeleton } from "./LoadingSkeleton";

export function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = "No records found",
  emptySubtitle = "There are currently no items matching your criteria.",
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  className = ""
}) {
  if (loading) {
    return <LoadingSkeleton rows={pageSize} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} subtitle={emptySubtitle} />;
  }

  return (
    <div className={`overflow-hidden border border-slate-200/80 rounded-2xl bg-white shadow-card ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {columns.map((col, index) => (
                <th
                  key={col.key || index}
                  className={`px-5 py-3.5 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"} ${col.headerClassName || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="hover:bg-slate-50/80 transition-colors duration-150">
                {columns.map((col, colIndex) => (
                  <td
                    key={col.key || colIndex}
                    className={`px-5 py-4 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"} ${col.cellClassName || ""}`}
                  >
                    {col.render ? col.render(row, rowIndex) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalItems > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
