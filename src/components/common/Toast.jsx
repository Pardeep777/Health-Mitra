import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

export function Toast() {
  const { toast, hideToast } = useNotifications();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const borders = {
    success: "border-emerald-200 bg-emerald-50/90 text-emerald-900",
    error: "border-rose-200 bg-rose-50/90 text-rose-900",
    info: "border-blue-200 bg-blue-50/90 text-blue-900"
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slideUp">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md ${
          borders[toast.type] || borders.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <p className="text-sm font-semibold">{toast.message}</p>
        <button
          onClick={hideToast}
          className="ml-auto p-1 rounded-lg hover:bg-black/5 text-current opacity-70 hover:opacity-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
