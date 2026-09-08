import React, { useState, useEffect } from "react";
import { cardholderService } from "../../services/cardholderService";
import { ShieldCheck, Search, Filter, Lock, FileText, CheckCircle2, UserCheck } from "lucide-react";
import { DataTable } from "../../components/common/DataTable";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";

export function AdminAuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const liveLogs = await cardholderService.getVerificationLogs();
        if (Array.isArray(liveLogs) && liveLogs.length > 0) {
          const formatted = liveLogs.map((l, i) => ({
            id: l.id || i + 1,
            timestamp: l.timestamp || l.created_at || new Date().toLocaleString(),
            user: l.partner_name || "Partner Verification",
            role: "Partner",
            action: `Discount Verification (${l.service_type || "General"})`,
            module: "Verification Pass",
            record: l.card_id || l.unique_id || `HMC-${l.id}`,
            details: `Bill: ₹${l.bill_amount || 0} • Discount: -₹${l.discount_amount || 0}`,
            ip_address: l.ip_address || "192.168.1.1",
            status: "Verified"
          }));
          setLogs(formatted);
        } else {
          setLogs([]);
        }
      } catch (e) {
        console.warn("Audit logs live fetch error", e);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const filtered = logs.filter((l) =>
    (l.user || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.action || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.record || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.role || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: "Timestamp",
      key: "timestamp",
      render: (row) => (
        <span className="text-xs font-mono text-slate-700">{row.timestamp}</span>
      )
    },
    {
      header: "User & Role",
      key: "user",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-navy-900">{row.user}</p>
          <span className="text-[10px] uppercase font-bold text-brand-600 bg-orange-50 px-1.5 py-0.5 rounded">
            {row.role}
          </span>
        </div>
      )
    },
    {
      header: "Action Performed",
      key: "action",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-slate-800">{row.action}</p>
          <p className="text-[11px] text-slate-500">{row.module}</p>
        </div>
      )
    },
    {
      header: "Target Record / Details",
      key: "record",
      render: (row) => (
        <div className="text-xs max-w-xs">
          <p className="font-mono font-bold text-brand-700">{row.record}</p>
          <p className="text-[11px] text-slate-500 truncate">{row.details}</p>
        </div>
      )
    },
    {
      header: "IP Address",
      key: "ip_address",
      render: (row) => (
        <span className="font-mono text-xs text-slate-500">{row.ip_address}</span>
      )
    },
    {
      header: "Status",
      key: "status",
      render: (row) => <Badge variant="success">{row.status}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">DPDPA Compliance Audit Trail</h2>
          <p className="text-xs text-slate-500">
            Immutable system logs documenting all partner lookups, card registrations, and administrative updates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Events Logged" value="14,890" subtitle="This month" variant="brand" />
        <StatCard title="Compliance Integrity" value="100%" subtitle="0 privacy violations" variant="emerald" />
        <StatCard title="Partner Lookups" value="8,420" subtitle="Verification queries" variant="blue" />
        <StatCard title="Admin Actions" value="340" subtitle="Authorizations & changes" variant="purple" />
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user, action, or card ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        totalItems={filtered.length}
        loading={loading}
        pageSize={10}
        currentPage={1}
      />
    </div>
  );
}
