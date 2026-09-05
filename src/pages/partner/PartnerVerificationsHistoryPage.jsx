import React, { useState, useEffect } from "react";
import { initialVerifications, getStoredVerifications } from "../../data/verifications";
import { History, Search, QrCode, CreditCard, Percent, Download } from "lucide-react";
import { DataTable } from "../../components/common/DataTable";
import { StatCard } from "../../components/common/StatCard";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";

export function PartnerVerificationsHistoryPage() {
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const all = getStoredVerifications();
    // In demo, show verifications matching this partner or all
    setLogs(all);
  }, []);

  const filtered = logs.filter((l) =>
    l.cardholder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.card_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.service_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalDiscount = logs.reduce((acc, curr) => acc + (curr.discount_amount || 0), 0);

  const columns = [
    {
      header: "Timestamp & Receipt",
      key: "timestamp",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-navy-900">{new Date(row.timestamp).toLocaleString()}</p>
          <p className="font-mono text-[10px] text-slate-400">{row.receipt_no}</p>
        </div>
      )
    },
    {
      header: "Patient / Cardholder",
      key: "cardholder_name",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-slate-800 capitalize">{row.cardholder_name}</p>
          <p className="font-mono text-brand-600 font-semibold">{row.card_id}</p>
        </div>
      )
    },
    {
      header: "Service Provided",
      key: "service_name",
      render: (row) => (
        <span className="text-xs text-slate-700 font-medium">{row.service_name}</span>
      )
    },
    {
      header: "Financial Breakdown",
      key: "bill_amount",
      render: (row) => (
        <div className="text-xs">
          <p className="text-slate-500">Bill: ₹{row.bill_amount}</p>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
            -₹{row.discount_amount} ({row.discount_percent}%)
          </span>
          <p className="font-bold text-navy-900 mt-0.5">Collected: ₹{row.final_amount}</p>
        </div>
      )
    },
    {
      header: "Status",
      key: "status",
      render: (row) => <Badge variant="success">Redeemed</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Patient Redemption History</h2>
        <p className="text-xs text-slate-500">Full audit log of all discount redemptions processed at your outlet</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Redemptions" value={logs.length} subtitle="Patient visits" variant="brand" />
        <StatCard title="Total Discounts" value={`₹${totalDiscount.toLocaleString()}`} subtitle="Customer savings" variant="emerald" />
        <StatCard title="Avg Discount" value="16.5%" subtitle="Across services" variant="purple" />
        <StatCard title="Verification Success" value="100%" subtitle="0 rejected cards" variant="blue" />
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient name, card ID, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        totalItems={filtered.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
