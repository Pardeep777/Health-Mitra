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
  CheckCircle2
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { useNotifications } from "../../context/NotificationContext";

export function AdminReportsPage() {
  const { showToast } = useNotifications();
  const [downloadingReport, setDownloadingReport] = useState(null);

  const reports = [
    {
      id: "REP-01",
      title: "Comprehensive Cardholder Register",
      category: "Members",
      desc: "Full roster of all 48,526 active, expiring, and expired cardholders with registration dates and district tags.",
      records: "48,526 records",
      icon: Users,
      color: "brand"
    },
    {
      id: "REP-02",
      title: "Partner Network & Verification Report",
      category: "Partners",
      desc: "126 partner outlets with total verification counts, discount given breakdown, and compliance status.",
      records: "126 outlets",
      icon: Building2,
      color: "blue"
    },
    {
      id: "REP-03",
      title: "Field Agent Performance & Daily Targets",
      category: "Agents",
      desc: "87 agents daily enrollment rates, 10-cards target compliance, and commission accrual summaries.",
      records: "87 agents",
      icon: UserCheck,
      color: "purple"
    },
    {
      id: "REP-04",
      title: "Revenue & Membership Collection Report",
      category: "Financials",
      desc: "Detailed financial ledger of all ₹49 membership transactions collected via Cash and UPI gateways.",
      records: "₹23,77,774 total",
      icon: IndianRupee,
      color: "emerald"
    },
    {
      id: "REP-05",
      title: "30-Day Renewal & Retention Report",
      category: "Renewals",
      desc: "Expiring cards, reminder dispatch logs, and 70% renewal conversion rates across all 8 districts.",
      records: "1,824 pending",
      icon: RefreshCw,
      color: "amber"
    },
    {
      id: "REP-06",
      title: "DPDPA 2023 Statutory Audit Trail Report",
      category: "Compliance",
      desc: "Certified data access and verification lookup logs for regulatory and privacy compliance auditing.",
      records: "14,890 events",
      icon: FileText,
      color: "default"
    }
  ];

  const handleExport = (reportId, format) => {
    setDownloadingReport(`${reportId}-${format}`);
    setTimeout(() => {
      setDownloadingReport(null);
      showToast(`Exported ${reportId} successfully as .${format.toLowerCase()}!`, "success");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Reports & Export Center</h2>
          <p className="text-xs text-slate-500">
            Generate and export operational, financial, and compliance reports in CSV, Excel, and PDF formats
          </p>
        </div>
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
                <span className="text-[10px] text-slate-400 font-mono">Format:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleExport(r.id, "CSV")}
                    disabled={downloadingReport === `${r.id}-CSV`}
                    className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => handleExport(r.id, "XLSX")}
                    disabled={downloadingReport === `${r.id}-XLSX`}
                    className="px-2.5 py-1 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                  >
                    Excel
                  </button>
                  <button
                    onClick={() => handleExport(r.id, "PDF")}
                    disabled={downloadingReport === `${r.id}-PDF`}
                    className="px-2.5 py-1 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition"
                  >
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
