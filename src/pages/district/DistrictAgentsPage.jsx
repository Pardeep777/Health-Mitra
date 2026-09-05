import React, { useState, useEffect } from "react";
import { agentService } from "../../services/agentService";
import { DataTable } from "../../components/common/DataTable";
import { Badge } from "../../components/common/Badge";
import { UserCheck, Search } from "lucide-react";

export function DistrictAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    agentService.getAll().then((all) => {
      // Scoped to West Tripura
      setAgents(all.filter((a) => a.district === "West Tripura"));
    });
  }, []);

  const filtered = agents.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.agent_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: "Agent Name & Code",
      key: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
          <div>
            <span className="font-bold text-navy-900 text-xs block">{row.name}</span>
            <span className="font-mono text-[10px] text-brand-600 font-semibold">{row.agent_code}</span>
          </div>
        </div>
      )
    },
    {
      header: "Sub-division",
      key: "subdivision",
      render: (row) => <span className="text-xs text-slate-700 font-medium">{row.subdivision}</span>
    },
    {
      header: "Today's Cards",
      key: "today_cards",
      render: (row) => (
        <span className="text-xs font-bold text-navy-900">{row.today_cards} / {row.target_daily}</span>
      )
    },
    {
      header: "Performance",
      key: "performance",
      render: (row) => (
        <Badge variant={row.performance === "Excellent" ? "success" : "brand"}>{row.performance}</Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900">West Tripura Field Agents ({agents.length})</h2>
        <p className="text-xs text-slate-500">Monitoring daily enrollment activity in Sadar and Mohanpur blocks</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search agent name or code..."
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
