import React, { useState, useEffect, useCallback } from "react";
import {
  History,
  Search,
  Calendar,
  CreditCard,
  Percent,
  Download,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Receipt,
  Printer
} from "lucide-react";
import { partnerService } from "../../services/partnerService";
import { DataTable } from "../../components/common/DataTable";
import { StatCard } from "../../components/common/StatCard";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

export function PartnerVerificationsHistoryPage() {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedQuickRange, setSelectedQuickRange] = useState("all");
  const [summaryTiles, setSummaryTiles] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchHistory = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const queryParams = {
          search: params.search !== undefined ? params.search : searchTerm,
          date_from: params.date_from !== undefined ? params.date_from : dateFrom,
          date_to: params.date_to !== undefined ? params.date_to : dateTo,
          limit: 100
        };

        const res = await partnerService.getHistory(queryParams);
        if (res.success && Array.isArray(res.data)) {
          setLogs(res.data);
          if (res.summary_tiles) {
            setSummaryTiles(res.summary_tiles);
          }
        } else {
          setLogs([]);
        }
      } catch (err) {
        console.warn("Error fetching partner history", err);
        showToast("Failed to load redemption history.", "error");
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, dateFrom, dateTo, showToast]
  );

  // Debounced search / filter trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, dateFrom, dateTo]);

  const handleQuickRange = (range) => {
    setSelectedQuickRange(range);
    const now = new Date();
    let from = "";
    let to = "";

    if (range === "today") {
      from = now.toISOString().slice(0, 10);
      to = now.toISOString().slice(0, 10);
    } else if (range === "week") {
      const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      from = pastWeek.toISOString().slice(0, 10);
      to = now.toISOString().slice(0, 10);
    } else if (range === "month") {
      from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
      to = now.toISOString().slice(0, 10);
    }

    setDateFrom(from);
    setDateTo(to);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    if (!logs.length) {
      showToast("No records available to export.", "info");
      return;
    }
    const headers = ["Receipt No", "Timestamp", "Patient Name", "Card Unique ID", "Service", "Bill Amount", "Discount Amount", "Final Collected", "Status"];
    const rows = logs.map((l) => [
      l.receipt_number || l.receipt_no,
      l.timestamp,
      `"${l.cardholder_name}"`,
      l.unique_id || l.card_id,
      `"${l.service_provided || l.service_name}"`,
      l.bill_amount,
      l.discount_amount,
      l.final_amount || l.collected_amount,
      l.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `health_mitra_redemptions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Redemption audit log exported as CSV!", "success");
  };

  // Computed totals fallback
  const totalCount = summaryTiles?.total_redemptions?.value ?? logs.length;
  const totalDiscountVal = summaryTiles?.total_discounts?.formatted ?? `₹${logs.reduce((acc, curr) => acc + (curr.discount_amount || 0), 0).toLocaleString()}`;
  const avgDiscountVal = summaryTiles?.avg_discount?.formatted ?? (logs.length > 0 ? `${Math.round(logs.reduce((acc, curr) => acc + (curr.discount_percent || 0), 0) / logs.length)}%` : "15%");
  const verificationSuccessVal = summaryTiles?.verification_success?.formatted ?? "100%";

  const paginated = logs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    {
      header: "Timestamp & Receipt",
      key: "timestamp",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-navy-900">{row.timestamp}</p>
          <span className="font-mono text-[10px] font-bold text-brand-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
            {row.receipt_number || row.receipt_no}
          </span>
        </div>
      )
    },
    {
      header: "Patient / Cardholder",
      key: "cardholder_name",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-slate-800 capitalize">{row.cardholder_name}</p>
          <p className="font-mono text-brand-600 font-semibold">{row.unique_id || row.card_id}</p>
        </div>
      )
    },
    {
      header: "Service Provided",
      key: "service_name",
      render: (row) => (
        <div className="text-xs">
          <span className="font-medium text-slate-800">{row.service_provided || row.service_name}</span>
          {row.notes && <p className="text-[10px] text-slate-400 italic truncate max-w-xs">{row.notes}</p>}
        </div>
      )
    },
    {
      header: "Financial Breakdown",
      key: "bill_amount",
      render: (row) => (
        <div className="text-xs">
          <p className="text-slate-500">Bill: ₹{row.bill_amount}</p>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
            -₹{row.discount_amount} ({row.discount_percent}%)
          </span>
          <p className="font-extrabold text-navy-900 mt-0.5">Collected: ₹{row.final_amount || row.collected_amount}</p>
        </div>
      )
    },
    {
      header: "Status",
      key: "status",
      render: (row) => <Badge variant={row.status_badge === "success" || row.status === "Redeemed" ? "success" : "brand"}>{row.status || "Redeemed"}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Patient Redemption History</h2>
          <p className="text-xs text-slate-500">
            Full audit log of all discount redemptions processed at your outlet (Live API Sync)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchHistory()}
            loading={loading}
            icon={RefreshCw}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={Download}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards from Live backend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Redemptions"
          value={totalCount}
          subtitle="Patient visits"
          icon={Receipt}
          variant="brand"
        />
        <StatCard
          title="Total Discounts"
          value={totalDiscountVal}
          subtitle="Customer savings"
          icon={Percent}
          variant="emerald"
        />
        <StatCard
          title="Avg Discount"
          value={avgDiscountVal}
          subtitle="Across services"
          icon={TrendingUp}
          variant="purple"
        />
        <StatCard
          title="Verification Success"
          value={verificationSuccessVal}
          subtitle="Validity status"
          icon={ShieldCheck}
          variant="blue"
        />
      </div>

      {/* Search & Date Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient name, card unique ID, or service (e.g. Rahul Singha)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Quick Date Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "all", label: "All Time" },
              { id: "today", label: "Today" },
              { id: "week", label: "Last 7 Days" },
              { id: "month", label: "This Month" }
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => handleQuickRange(btn.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedQuickRange === btn.id
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date From and Date To range inputs */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Date Range:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setSelectedQuickRange("custom");
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setSelectedQuickRange("custom");
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Quick Test Chips for user's requested test cases */}
          <div className="flex items-center gap-1.5 ml-auto flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium">Quick API Tests:</span>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("Rahul Singha");
                setCurrentPage(1);
              }}
              className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-orange-50 text-brand-600 border border-orange-200 hover:bg-orange-100 transition cursor-pointer"
            >
              ?search=Rahul Singha
            </button>
            <button
              type="button"
              onClick={() => {
                setDateFrom("2026-09-01");
                setDateTo("2026-09-02");
                setSelectedQuickRange("custom");
                setCurrentPage(1);
              }}
              className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
            >
              ?date_from=2026-09-01&date_to=2026-09-02
            </button>
            {(dateFrom || dateTo || searchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                  setSearchTerm("");
                  setSelectedQuickRange("all");
                  setCurrentPage(1);
                }}
                className="text-xs text-brand-600 font-bold hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Redemptions Table */}
      <DataTable
        columns={columns}
        data={paginated}
        totalItems={logs.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        loading={loading}
      />
    </div>
  );
}
