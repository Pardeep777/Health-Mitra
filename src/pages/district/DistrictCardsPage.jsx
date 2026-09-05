import React, { useState, useEffect } from "react";
import { cardholderService } from "../../services/cardholderService";
import { DataTable } from "../../components/common/DataTable";
import { Badge } from "../../components/common/Badge";
import { Search, CreditCard } from "lucide-react";

export function DistrictCardsPage() {
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cardholderService.getAll().then((all) => {
      setCards(all.filter((c) => c.district === "West Tripura"));
    });
  }, []);

  const filtered = cards.filter((c) =>
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.unique_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: "Member & Unique ID",
      key: "full_name",
      render: (row) => (
        <div>
          <span className="font-bold text-navy-900 text-xs block capitalize">{row.full_name}</span>
          <span className="font-mono text-[10px] text-brand-600 font-bold">{row.unique_id}</span>
        </div>
      )
    },
    {
      header: "Address",
      key: "address",
      render: (row) => <span className="text-xs text-slate-700">{row.address}</span>
    },
    {
      header: "Expiry Date",
      key: "expiry_date",
      render: (row) => <span className="text-xs font-semibold text-slate-800">{row.expiry_date}</span>
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "warning"}>{row.status}</Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900">West Tripura Enrolled Cards ({cards.length})</h2>
        <p className="text-xs text-slate-500">Locally active cardholder accounts</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search member name or card ID..."
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
        pageSize={10}
        currentPage={1}
      />
    </div>
  );
}
