import React, { useState, useEffect } from "react";
import { renewalService } from "../../services/renewalService";
import { RefreshCw, Clock, MessageSquare, Phone, CheckCircle2, AlertTriangle, Send } from "lucide-react";
import { DataTable } from "../../components/common/DataTable";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { useNotifications } from "../../context/NotificationContext";

export function AdminRenewalsPage() {
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotifications();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await renewalService.getAll();
      setRenewals(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendReminder = async (id, channel) => {
    await renewalService.triggerReminder(id, channel);
    showToast(`Dispatched ${channel} renewal reminder!`, "success");
    loadData();
  };

  const handleRenew = async (card_id) => {
    await renewalService.executeRenewal(card_id, "Digital (UPI)");
    showToast(`Card ${card_id} renewed for 365 days!`, "success");
    loadData();
  };

  const expiringCount = renewals.filter(
    (r) => r.status === "Expiring Soon" || (r.days_remaining >= 0 && r.days_remaining <= 30)
  ).length;
  const expiredCount = renewals.filter(
    (r) => r.status === "Expired" || r.days_remaining < 0
  ).length;
  const renewedCount = renewals.filter((r) => r.status === "Renewed").length;
  const totalCount = renewals.length;
  const renewalRate =
    totalCount > 0 ? `${(((totalCount - expiredCount) / totalCount) * 100).toFixed(1)}%` : "100%";

  const columns = [
    {
      header: "Cardholder & Card ID",
      key: "cardholder_name",
      render: (row) => (
        <div>
          <span className="font-bold text-navy-900 text-sm block">{row.cardholder_name}</span>
          <span className="font-mono text-[11px] text-brand-600 font-bold">{row.card_id}</span>
        </div>
      )
    },
    {
      header: "Expiry Date & Countdown",
      key: "old_expiry_date",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-slate-800">{row.old_expiry_date}</p>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              row.days_remaining < 0
                ? "bg-rose-100 text-rose-700"
                : row.days_remaining <= 15
                ? "bg-amber-100 text-amber-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {row.days_remaining < 0
              ? `Expired ${Math.abs(row.days_remaining)} days ago`
              : `${row.days_remaining} days left`}
          </span>
        </div>
      )
    },
    {
      header: "Automated Reminders",
      key: "reminder_30d",
      render: (row) => (
        <div className="text-[11px] space-y-0.5 text-slate-600">
          <p>• 30d: {row.reminder_30d || "N/A"}</p>
          <p>• 15d: {row.reminder_15d || "Pending"}</p>
          <p>• 7d: {row.reminder_7d || "Pending"}</p>
        </div>
      )
    },
    {
      header: "Status & Last Action",
      key: "status",
      render: (row) => (
        <div className="space-y-1">
          <Badge
            variant={
              row.status === "Renewed"
                ? "purple"
                : row.status === "Expiring Soon"
                ? "warning"
                : "danger"
            }
          >
            {row.status}
          </Badge>
          <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{row.action_taken}</p>
        </div>
      )
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleSendReminder(row.id, "WhatsApp")}
            className="p-1.5 rounded-lg border border-slate-200 text-emerald-600 hover:bg-emerald-50 transition"
            title="Send WhatsApp Alert"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleSendReminder(row.id, "SMS")}
            className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition"
            title="Send SMS"
          >
            <Send className="w-4 h-4" />
          </button>
          {row.status !== "Renewed" && (
            <Button size="sm" variant="primary" onClick={() => handleRenew(row.card_id)}>
              Renew (₹49)
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Renewal Management System</h2>
          <p className="text-xs text-slate-500">
            Automated 30-day, 15-day, and 7-day member renewal workflows
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Expiring in 30 Days"
          value={expiringCount.toLocaleString()}
          subtitle="Under active reminder"
          variant="amber"
        />
        <StatCard
          title="Expired Cards"
          value={expiredCount.toLocaleString()}
          subtitle="Assigned to field agents"
          variant="default"
        />
        <StatCard
          title="Renewed Records"
          value={renewedCount.toLocaleString()}
          subtitle="Successful conversions"
          variant="brand"
        />
        <StatCard
          title="Retention Ratio"
          value={renewalRate}
          subtitle="Network renewals"
          variant="emerald"
        />
      </div>

      {/* Reminder Schedule Timeline Ribbon */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-brand-400 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Automated Multi-Channel Reminder Schedule
          </h4>
          <span className="text-[11px] text-slate-400">SMS Gateway & WhatsApp Cloud API Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-brand-400 font-bold block text-sm">30 Days Prior</span>
            <p className="text-slate-300 mt-1">First reminder sent with 1-click renewal payment link.</p>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-amber-400 font-bold block text-sm">15 Days Prior</span>
            <p className="text-slate-300 mt-1">Second follow-up notification via SMS & WhatsApp.</p>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-orange-400 font-bold block text-sm">7 Days Prior</span>
            <p className="text-slate-300 mt-1">Final urgency alert with assigned field agent contact.</p>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-rose-400 font-bold block text-sm">Expiry Day</span>
            <p className="text-slate-300 mt-1">Deactivation notice with 30-day grace period reactivation.</p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={renewals}
        totalItems={renewals.length}
        loading={loading}
        pageSize={10}
        currentPage={1}
      />
    </div>
  );
}
