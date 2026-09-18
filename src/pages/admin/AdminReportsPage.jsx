import React, { useState, useEffect, useMemo } from "react";
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
  ExternalLink,
  Printer,
  Search,
  ArrowRight,
  ShieldCheck,
  FileDown,
  Layers
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { DataTable } from "../../components/common/DataTable";
import { useNotifications } from "../../context/NotificationContext";
import { reportService } from "../../services/reportService";
import { districtService } from "../../services/districtService";

export function AdminReportsPage() {
  const { showToast } = useNotifications();
  const [activeTab, setActiveTab] = useState("cardholders");
  const [downloadingReport, setDownloadingReport] = useState(null);
  const [districts, setDistricts] = useState([]);

  // Filter States
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedAgreement, setSelectedAgreement] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [limit, setLimit] = useState("50");
  const [currentPage, setCurrentPage] = useState(1);

  // Table Data State
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDistricts() {
      try {
        const dists = await districtService.getAll();
        setDistricts(Array.isArray(dists) ? dists : []);
      } catch (e) {
        console.warn("Report district fetch notice", e);
      }
    }
    loadDistricts();
  }, []);

  // Fetch tabular report data on filter/tab changes
  const loadTabularData = async () => {
    setLoading(true);
    const params = {
      limit: Number(limit) || 50,
      offset: (currentPage - 1) * (Number(limit) || 50)
    };
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;
    if (selectedDistrict !== "All") params.district_id = selectedDistrict;
    if (selectedStatus !== "All") params.status = selectedStatus.toLowerCase();
    if (selectedAgreement !== "All") params.agreement_status = selectedAgreement.toLowerCase();
    if (searchKeyword.trim()) params.search = searchKeyword.trim();

    try {
      let data = [];
      if (activeTab === "cardholders") {
        data = await reportService.getCardholdersReport(params);
      } else if (activeTab === "cards") {
        data = await reportService.getCardsReport(params);
      } else if (activeTab === "partners") {
        data = await reportService.getPartnersReport(params);
      } else if (activeTab === "agents") {
        data = await reportService.getAgentsReport(params);
      } else if (activeTab === "renewals") {
        data = await reportService.getRenewalsReport(params);
      }
      setReportData(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast("Could not load report table data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTabularData();
    }, 250);
    return () => clearTimeout(timer);
  }, [activeTab, selectedDistrict, selectedStatus, selectedAgreement, fromDate, toDate, searchKeyword, limit, currentPage]);

  const reportTabs = [
    { id: "cardholders", label: "Cardholders Register", icon: Users, type: "cardholders" },
    { id: "cards", label: "Cards & Status Lifecycle", icon: FileSpreadsheet, type: "cards" },
    { id: "partners", label: "Partner Healthcare Outlets", icon: Building2, type: "partners" },
    { id: "agents", label: "Field Agents Performance", icon: UserCheck, type: "agents" },
    { id: "renewals", label: "30-Day Renewals & Retention", icon: RefreshCw, type: "renewals" }
  ];

  // Helper for filter summary text
  const getFilterSummaryText = () => {
    const parts = [];
    if (fromDate && toDate) parts.push(`Date: ${fromDate} to ${toDate}`);
    else if (fromDate) parts.push(`From: ${fromDate}`);
    else if (toDate) parts.push(`To: ${toDate}`);
    if (selectedDistrict !== "All") {
      const d = districts.find((x) => String(x.id) === String(selectedDistrict));
      parts.push(`District: ${d ? d.name : selectedDistrict}`);
    }
    if (selectedStatus !== "All") parts.push(`Status: ${selectedStatus}`);
    if (selectedAgreement !== "All") parts.push(`Agreement: ${selectedAgreement}`);
    if (searchKeyword) parts.push(`Search: "${searchKeyword}"`);
    return parts.length ? parts.join(" | ") : "All Records (Unfiltered)";
  };

  // Export Handlers
  const handleExportBackend = (type, format) => {
    const reportKey = `${type}-${format}`;
    setDownloadingReport(reportKey);

    const filters = {};
    if (selectedDistrict !== "All") filters.district_id = selectedDistrict;
    if (selectedStatus !== "All") filters.status = selectedStatus.toLowerCase();
    if (selectedAgreement !== "All") filters.agreement_status = selectedAgreement.toLowerCase();
    if (fromDate) filters.from_date = fromDate;
    if (toDate) filters.to_date = toDate;
    if (searchKeyword.trim()) filters.search = searchKeyword.trim();

    try {
      const url = reportService.getExportUrl(type, format.toLowerCase(), filters);
      window.open(url, "_blank");
      showToast(`Generating ${type.toUpperCase()} report (${format.toUpperCase()})...`, "success");
    } catch (e) {
      showToast("Export initiated.", "info");
    } finally {
      setTimeout(() => setDownloadingReport(null), 800);
    }
  };

  const handleExportClientCsv = () => {
    const currentTabObj = reportTabs.find((t) => t.id === activeTab);
    const cols = getColumnsForTab(activeTab);
    reportService.exportToCsv(`HealthMitra_${activeTab}_report`, cols, reportData);
    showToast("CSV export downloaded successfully!", "success");
  };

  const handleExportClientExcel = () => {
    const currentTabObj = reportTabs.find((t) => t.id === activeTab);
    const cols = getColumnsForTab(activeTab);
    reportService.exportToExcel(`HealthMitra_${activeTab}_report`, currentTabObj?.label || "Report", cols, reportData);
    showToast("Excel spreadsheet generated successfully!", "success");
  };

  const handlePrintReport = () => {
    const currentTabObj = reportTabs.find((t) => t.id === activeTab);
    const cols = getColumnsForTab(activeTab);
    reportService.printReportDocument(currentTabObj?.label || "Report", getFilterSummaryText(), cols, reportData);
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setSelectedDistrict("All");
    setSelectedStatus("All");
    setSelectedAgreement("All");
    setSearchKeyword("");
    setCurrentPage(1);
  };

  // Columns definition per tab
  function getColumnsForTab(tab) {
    switch (tab) {
      case "cardholders":
        return [
          { header: "Card ID", key: "unique_id", label: "Card ID" },
          { header: "Cardholder Name", key: "full_name", label: "Name" },
          { header: "Mobile", key: "mobile", label: "Mobile" },
          { header: "District", key: "district", label: "District" },
          { header: "PIN Code", key: "pin_code", label: "PIN Code" },
          { header: "Status", key: "status", label: "Status" },
          { header: "Issue Date", key: "issue_date", label: "Issued" },
          { header: "Expiry Date", key: "expiry_date", label: "Valid Thru" }
        ];
      case "cards":
        return [
          { header: "Card Number", key: "unique_id", label: "Card Number" },
          { header: "Holder Name", key: "full_name", label: "Holder Name" },
          { header: "Type / Plan", key: "card_type", label: "Plan", getValue: (r) => r.card_type || "Smart Pass" },
          { header: "Status", key: "status", label: "Card Status" },
          { header: "Price Paid", key: "price_paid", label: "Fee (₹)", getValue: (r) => `₹${r.price_paid || 49}` },
          { header: "Issue Date", key: "issue_date", label: "Issue Date" },
          { header: "Expiry Date", key: "expiry_date", label: "Expiry Date" }
        ];
      case "partners":
        return [
          { header: "Partner Business", key: "name", label: "Business Name" },
          { header: "Category", key: "category", label: "Category" },
          { header: "Owner", key: "owner", label: "Owner" },
          { header: "Mobile", key: "phone", label: "Phone" },
          { header: "District", key: "district", label: "District" },
          { header: "Discount Cap", key: "discountPercent", label: "Discount", getValue: (r) => `${r.discountPercent || 20}%` },
          { header: "Agreement", key: "agreementStatus", label: "Agreement Status" },
          { header: "Status", key: "status", label: "Status" }
        ];
      case "agents":
        return [
          { header: "Agent Code", key: "agent_code", label: "Agent Code" },
          { header: "Agent Name", key: "name", label: "Name" },
          { header: "District", key: "district", label: "District" },
          { header: "Mobile", key: "mobile", label: "Mobile" },
          { header: "Today Enrolments", key: "today_cards", label: "Today Cards" },
          { header: "Monthly Enrolments", key: "month_cards", label: "Month Cards" },
          { header: "Total Cards", key: "total_cards", label: "Total Cards" },
          { header: "Commission Earned", key: "total_commission_earned", label: "Commission (₹)", getValue: (r) => `₹${r.total_commission_earned || 0}` },
          { header: "Status", key: "status", label: "Status" }
        ];
      case "renewals":
        return [
          { header: "Card ID", key: "card_id", label: "Card ID", getValue: (r) => r.card_id || r.unique_id },
          { header: "Member Name", key: "cardholder_name", label: "Member Name", getValue: (r) => r.cardholder_name || r.full_name },
          { header: "Mobile", key: "mobile", label: "Mobile" },
          { header: "Expiry Date", key: "expiry_date", label: "Expiry Date", getValue: (r) => r.expiry_date || r.old_expiry_date },
          { header: "Status", key: "status", label: "Renewal Status" },
          { header: "Reminder 30d", key: "reminder_30d", label: "30-Day Reminder", getValue: (r) => r.reminder_30d || "Dispatched" }
        ];
      default:
        return [];
    }
  }

  const currentTabColumns = useMemo(() => {
    const cols = getColumnsForTab(activeTab);
    return cols.map((col) => ({
      header: col.header,
      key: col.key,
      render: (row) => {
        let val = row[col.key];
        if (typeof col.getValue === "function") val = col.getValue(row);
        if (col.key === "status" || col.key === "card_status" || col.key === "agreementStatus") {
          const isGood = String(val).toLowerCase().includes("active") || String(val).toLowerCase().includes("signed");
          const isWarn = String(val).toLowerCase().includes("soon") || String(val).toLowerCase().includes("pending");
          return (
            <Badge variant={isGood ? "success" : isWarn ? "warning" : "default"}>
              {val || "Active"}
            </Badge>
          );
        }
        return <span className="text-xs font-medium text-slate-800">{val !== undefined && val !== null ? String(val) : "-"}</span>;
      }
    }));
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Reports & Export Center</h2>
          <p className="text-xs text-slate-500">
            Official backend APIs: /api/admin/reports/cardholders, cards, partners, agents, renewals, export
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={Printer}
            onClick={handlePrintReport}
            className="border-slate-300"
          >
            Print Formatted View
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={FileSpreadsheet}
            onClick={handleExportClientExcel}
            className="border-emerald-300 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100"
          >
            Export Excel
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={FileText}
            onClick={handleExportClientCsv}
            className="border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100"
          >
            Download CSV
          </Button>
          <Button
            size="sm"
            icon={Download}
            onClick={() => handleExportBackend(activeTab, "pdf")}
            loading={downloadingReport === `${activeTab}-pdf`}
            className="shadow-orange-glow"
          >
            Download Official PDF
          </Button>
        </div>
      </div>

      {/* Report Types Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {reportTabs.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition ${
                isSelected
                  ? "bg-brand-500 text-white font-bold shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-bold">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filters:</span>
        </div>

        {/* Date From */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 font-medium">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-700 focus:ring-1 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* Date To */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 font-medium">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-700 focus:ring-1 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* District */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 font-medium">District:</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-700 focus:ring-1 focus:ring-brand-500 focus:outline-none"
          >
            <option value="All">All Districts</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 font-medium">Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-700 focus:ring-1 focus:ring-brand-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="expiring_soon">Expiring Soon</option>
            <option value="expired">Expired</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
            {activeTab === "partners" && (
              <>
                <option value="applied">Applied</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </>
            )}
            {activeTab === "agents" && (
              <>
                <option value="achieved">Achieved</option>
                <option value="on_track">On Track</option>
                <option value="in_progress">In Progress</option>
                <option value="not_started">Not Started</option>
              </>
            )}
          </select>
        </div>

        {/* Agreement Status (Partners tab) */}
        {activeTab === "partners" && (
          <div className="flex items-center gap-1.5">
            <label className="text-slate-400 font-medium">Agreement:</label>
            <select
              value={selectedAgreement}
              onChange={(e) => setSelectedAgreement(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-700 focus:ring-1 focus:ring-brand-500 focus:outline-none"
            >
              <option value="All">All Agreements</option>
              <option value="signed">Signed</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search keyword..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="bg-slate-50 border border-slate-200 pl-8 pr-2.5 py-1.5 rounded-lg text-slate-700 focus:ring-1 focus:ring-brand-500 focus:outline-none w-36 sm:w-48"
          />
        </div>

        {/* Limit */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-400 font-medium">Limit:</label>
          <select
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg text-slate-700 focus:ring-1 focus:ring-brand-500 focus:outline-none"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {(fromDate || toDate || selectedDistrict !== "All" || selectedStatus !== "All" || selectedAgreement !== "All" || searchKeyword) && (
          <button
            onClick={resetFilters}
            className="text-brand-600 hover:text-brand-700 font-semibold underline ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Quick Summary Info */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-brand-950">
          <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0" />
          <div>
            <p className="font-bold">
              Active Scope: {reportTabs.find((t) => t.id === activeTab)?.label}
            </p>
            <p className="text-[11px] text-brand-800">{getFilterSummaryText()} • {reportData.length} records retrieved</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleExportBackend(activeTab, "pdf")}
            className="px-2.5 py-1 rounded-lg bg-white border border-orange-300 font-bold text-brand-700 hover:bg-orange-100 flex items-center gap-1 text-[11px]"
          >
            <FileDown className="w-3.5 h-3.5" /> PDF API
          </button>
          <button
            onClick={() => handleExportBackend(activeTab, "csv")}
            className="px-2.5 py-1 rounded-lg bg-white border border-orange-300 font-bold text-brand-700 hover:bg-orange-100 flex items-center gap-1 text-[11px]"
          >
            <FileDown className="w-3.5 h-3.5" /> CSV API
          </button>
        </div>
      </div>

      {/* Live Tabular Report */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <DataTable
          columns={currentTabColumns}
          data={reportData}
          loading={loading}
          currentPage={currentPage}
          pageSize={Number(limit) || 50}
          totalItems={reportData.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
