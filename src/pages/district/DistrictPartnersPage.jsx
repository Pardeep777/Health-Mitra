import React, { useState, useEffect } from "react";
import { partnerService } from "../../services/partnerService";
import { DataTable } from "../../components/common/DataTable";
import { Badge } from "../../components/common/Badge";
import { Search, Building2 } from "lucide-react";

export function DistrictPartnersPage() {
  const [partners, setPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    partnerService.getAll().then((all) => {
      setPartners(all.filter((p) => p.district === "West Tripura"));
    });
  }, []);

  const filtered = partners.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: "Partner Name & Category",
      key: "name",
      render: (row) => (
        <div>
          <span className="font-bold text-navy-900 text-xs block">{row.name}</span>
          <span className="text-[11px] text-slate-500 font-medium">{row.category}</span>
        </div>
      )
    },
    {
      header: "Address",
      key: "address",
      render: (row) => <span className="text-xs text-slate-700">{row.address}</span>
    },
    {
      header: "Discount Offered",
      key: "discountPercent",
      render: (row) => (
        <span className="text-xs font-bold text-brand-600 bg-orange-50 px-2 py-0.5 rounded">
          Up to {row.discountPercent}%
        </span>
      )
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
        <h2 className="text-xl font-bold text-navy-900">West Tripura Partner Outlets ({partners.length})</h2>
        <p className="text-xs text-slate-500">Verified network in Agartala & West Tripura</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search partner or category..."
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
