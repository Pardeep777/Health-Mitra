import React, { useState, useEffect } from "react";
import { ShieldCheck, Search, QrCode, CreditCard, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { cardholderService } from "../../services/cardholderService";
import { DataTable } from "../../components/common/DataTable";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";
import { useNotifications } from "../../context/NotificationContext";

export function AdminVerificationLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const { showToast } = useNotifications();

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await cardholderService.getVerificationLogs();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast("Failed to fetch verification logs.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = logs.filter((l) => {
    const term = searchTerm.toLowerCase();
    return (
      (l.cardholder_name || "").toLowerCase().includes(term) ||
      (l.card_id || l.card_number || "").toLowerCase().includes(term) ||
      (l.partner_name || "").toLowerCase().includes(term)
    );
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalDiscountGiven = logs.reduce((acc, curr) => acc + Number(curr.discount_amount || 0), 0);

  const columns = [
    {
      header: "Timestamp & Receipt",
      key: "timestamp",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-navy-900">
            {row.timestamp || row.created_at || new Date().toLocaleString()}
          </p>
          <p className="font-mono text-[10px] text-slate-400">{row.receipt_no || `REC-${row.id || "001"}`}</p>
        </div>
      )
    },
    {
      header: "Cardholder & Card ID",
      key: "cardholder_name",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-slate-800">{row.cardholder_name || row.name || "Member"}</p>
          <p className="font-mono text-brand-600 font-bold">{row.card_id || row.card_number || "HMC-ACTIVE"}</p>
        </div>
      )
    },
    {
      header: "Partner & Healthcare Service",
      key: "partner_name",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-navy-900">{row.partner_name || "Healthcare Outlet"}</p>
          <p className="text-slate-500">{row.service_name || row.service_type || "Discount Service"}</p>
        </div>
      )
    },
    {
      header: "Financials & Savings",
      key: "bill_amount",
      render: (row) => (
        <div className="text-xs">
          <span className="text-slate-500">Bill: ₹{row.bill_amount || 0}</span>
          <p className="text-emerald-700 font-bold">
            Saved ₹{row.discount_amount || 0} ({row.discount_percent || 15}%)
          </p>
          <p className="text-[11px] text-navy-900 font-semibold">
            Paid: ₹{row.final_amount || (Number(row.bill_amount || 0) - Number(row.discount_amount || 0))}
          </p>
        </div>
      )
    },
    {
      header: "Method",
      key: "verification_method",
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
          <QrCode className="w-3 h-3 text-brand-500" />
          {row.verification_method || "QR_SCAN"}
        </span>
      )
    },
    {
      header: "Status",
      key: "status",
      render: (row) => <Badge variant="success">{row.status || "Verified"}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Card Verification & Redemption Logs</h2>
          <p className="text-xs text-slate-500">
            Real-time audit record from API: /api/admin/cards/verification_logs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Verifications" value={logs.length} subtitle="API recorded transactions" variant="brand" />
        <StatCard title="Total Savings Given" value={`₹${totalDiscountGiven.toLocaleString()}`} subtitle="Patient savings" variant="emerald" />
        <StatCard title="Status" value="Live" subtitle="API Synced" variant="purple" />
        <StatCard title="Authentication" value="Bearer JWT" subtitle="Secure API" variant="blue" />
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search cardholder, ID, or partner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        totalItems={filtered.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
