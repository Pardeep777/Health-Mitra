import React, { useState } from "react";
import { initialDistributors } from "../../data/distributors";
import { Truck, Search, MapPin, Users, Target, Phone, Mail } from "lucide-react";
import { DataTable } from "../../components/common/DataTable";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export function AdminDistributorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [distributors, setDistributors] = useState(initialDistributors);

  const filtered = distributors.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: "Distributor & Code",
      key: "name",
      render: (row) => (
        <div>
          <span className="font-bold text-navy-900 text-sm block">{row.name}</span>
          <span className="font-mono text-[11px] text-brand-600 font-semibold">{row.distributor_code}</span>
        </div>
      )
    },
    {
      header: "District & Location",
      key: "district",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-slate-800">{row.district}</p>
          <p className="text-slate-500">{row.address}</p>
        </div>
      )
    },
    {
      header: "Managed Points",
      key: "points_managed",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-slate-800">{row.points_managed} Retail Points</p>
          <p className="text-slate-500">{row.assigned_agents_count} Agents Assigned</p>
        </div>
      )
    },
    {
      header: "Monthly Sales Progress",
      key: "achieved_monthly",
      render: (row) => (
        <div className="text-xs">
          <span className="font-extrabold text-navy-900">{row.achieved_monthly}</span>
          <span className="text-slate-400"> / {row.target_monthly} target</span>
          <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-brand-500 h-full rounded-full"
              style={{ width: `${Math.min(100, (row.achieved_monthly / row.target_monthly) * 100)}%` }}
            />
          </div>
        </div>
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
          <h2 className="text-xl font-bold text-navy-900">Distributor Logistics Network</h2>
          <p className="text-xs text-slate-500">50 distributor points across 8 districts in the field-sales model</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Distributor Points" value="50" subtitle="Authorized statewide" variant="brand" />
        <StatCard title="Key Regional Hubs" value="8" subtitle="One per district HQ" variant="blue" />
        <StatCard title="Active Field Agents" value="87" subtitle="Supplied with PVC cards" variant="purple" />
        <StatCard title="Monthly Card Target" value="7,050" subtitle="Field quota" variant="emerald" />
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search distributor or district..."
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
