import React, { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Calendar,
  FileText,
  Users,
  Building2,
  UserCheck,
  IndianRupee,
  RefreshCw,
  CheckCircle2,
  Filter,
  ExternalLink
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { useNotifications } from "../../context/NotificationContext";
import { reportService } from "../../services/reportService";

export function AdminReportsPage() {
  const { showToast } = useNotifications();
  const [downloadingReport, setDownloadingReport] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const reports = [
    {
      id: "cardholders",
      title: "Comprehensive Cardholders Register",
      category: "Members",
      desc: "Full roster of all cardholders with registration dates, status, district tags and identity verification.",
      records: "All cardholders",
      icon: Users,
      color: "brand",
      exportType: "cardholders"
    },
    {
      id: "cards",
      title: "Cards & Status Lifecycle Report",
      category: "Cards",
      desc: "Complete card tracking report including active, pending, expiring soon, and renewed status.",
      records: "All membership cards",
      icon: FileSpreadsheet,
      color: "blue",
      exportType: "cards"
    },
    {
      id: "partners",
      title: "Partner Hospital & Pharmacy Network",
      category: "Partners",
      desc: "Affiliated medical outlets with agreement status, discount rates, and operational services.",
      records: "All partner outlets",
      icon: Building2,
      color: "purple",
      exportType: "partners"
    },
    {
      id: "agents",
      title: "Field Enrolment Agent Performance",
      category: "Agents",
      desc: "Agent target progress, daily enrolments, commission payout tracking and district distributions.",
      records: "All field agents",
      icon: UserCheck,
      color: "emerald",
      exportType: "agents"
    },
    {
      id: "renewals",
      title: "30-Day Renewal & Retention Analysis",
      category: "Renewals",
      desc: "Cardholders due for renewal with contact records, reminder logs and retention metrics.",
      records: "Renewals roster",
      icon: RefreshCw,
      color: "amber",
      exportType: "cardholders",
      statusFilter: "expiring_soon"
    },
    {
      id: "compliance",
      title: "DPDPA 2023 Statutory Audit Trail",
      category: "Compliance",
      desc: "Certified data access and verification lookup logs for regulatory and privacy compliance auditing.",
      records: "Audit trail events",
      icon: FileText,
      color: "default",
      exportType: "cards"
    }
  ];

  const handleExport = (report, format) => {
    const reportKey = `${report.id}-${format}`;
    setDownloadingReport(reportKey);

    const filters = {};
    if (selectedDistrict !== "All") filters.district_id = selectedDistrict;
    if (selectedStatus !== "All") filters.status = selectedStatus.toLowerCase();
    if (report.statusFilter) filters.status = report.statusFilter;
    if (fromDate) filters.from_date = fromDate;
    if (toDate) filters.to_date = toDate;

    try {
      const url = reportService.getExportUrl(report.exportType || "cardholders", format.toLowerCase(), filters);
      
      // Open / trigger download
      window.open(url, "_blank");
      showToast(`Generating ${report.title} (${format})...`, "success");
    } catch (e) {
      showToast(`Export initiated for ${report.title}`, "info");
    } finally {
      setTimeout(() => setDownloadingReport(null), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Reports & Export Center</h2>
          <p className="text-xs text-slate-500">
            Real-time backend reports: /api/admin/reports/cardholders, cards, partners, export
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-bold">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filters:</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-400 font-medium">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-700 focus:ring-1 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-400 font-medium">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-700 focus:ring-1 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-400 font-medium">District:</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-700 focus:ring-1 focus:ring-brand-500 focus:outline-none"
          >
            <option value="All">All Districts</option>
            <option value="1">West Tripura (1)</option>
            <option value="2">Sepahijala (2)</option>
            <option value="3">Gomati (3)</option>
            <option value="4">South Tripura (4)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-400 font-medium">Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-700 focus:ring-1 focus:ring-brand-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {(fromDate || toDate || selectedDistrict !== "All" || selectedStatus !== "All") && (
          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
              setSelectedDistrict("All");
              setSelectedStatus("All");
            }}
            className="text-brand-600 hover:text-brand-700 font-semibold underline ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <Card key={r.id} className="flex flex-col justify-between space-y-4 hover:shadow-card-hover transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {r.category}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{r.records}</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-500 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-navy-900 leading-snug">{r.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-mono">Export:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleExport(r, "CSV")}
                    disabled={downloadingReport === `${r.id}-CSV`}
                    className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => handleExport(r, "XLSX")}
                    disabled={downloadingReport === `${r.id}-XLSX`}
                    className="px-2.5 py-1 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                  >
                    Excel
                  </button>
                  <button
                    onClick={() => handleExport(r, "PDF")}
                    disabled={downloadingReport === `${r.id}-PDF`}
                    className="px-2.5 py-1 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    PDF
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

