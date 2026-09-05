import React from "react";
import { X, Check, Bell, Sparkles, Clock } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

export function NotificationDrawer({ isOpen, onClose }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-slideLeft">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-500" />
              <h3 className="font-bold text-sm text-navy-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-brand-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 transition"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">No notifications yet.</div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-4 cursor-pointer transition ${
                    !item.read ? "bg-orange-50/40 hover:bg-orange-50/70" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-xs ${!item.read ? "font-bold text-navy-900" : "font-semibold text-slate-700"}`}>
                      {item.title}
                    </h4>
                    {!item.read && <span className="w-2 h-2 rounded-full bg-brand-500 mt-1 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
