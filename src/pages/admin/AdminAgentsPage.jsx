import React, { useState, useEffect, useMemo } from "react";
import {
  UserCheck,
  Search,
  Plus,
  Award,
  TrendingUp,
  Target,
  Eye,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  IndianRupee
} from "lucide-react";
import { agentService } from "../../services/agentService";
import { initialDistricts } from "../../data/districts";
import { DataTable } from "../../components/common/DataTable";
import { StatCard } from "../../components/common/StatCard";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";

export function AdminAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await agentService.getAll();
        setAgents(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredAgents = useMemo(() => {
    return agents.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.agent_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.mobile.includes(searchTerm);
      const matchDist = selectedDistrict === "All" || a.district === selectedDistrict;
      return matchSearch && matchDist;
    });
  }, [agents, searchTerm, selectedDistrict]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAgents.slice(start, start + pageSize);
  }, [filteredAgents, currentPage]);

  const columns = [
    {
      header: "Agent Name & Code",
      key: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt={row.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200" />
          <div>
            <span className="font-bold text-navy-900 text-sm block">{row.name}</span>
            <span className="font-mono text-[11px] text-brand-600 font-semibold">{row.agent_code}</span>
          </div>
        </div>
      )
    },
    {
      header: "District & Contact",
      key: "district",
      render: (row) => (
        <div className="text-xs">
          <p className="font-semibold text-slate-800">{row.district} ({row.subdivision})</p>
          <p className="text-slate-500 font-mono">{row.mobile}</p>
        </div>
      )
    },
    {
      header: "Today's Enrolments",
      key: "today_cards",
      render: (row) => (
        <div className="text-xs">
          <span className="font-extrabold text-navy-900 text-sm">{row.today_cards}</span>
          <span className="text-slate-400"> / {row.target_daily} target</span>
        </div>
      )
    },
    {
      header: "Monthly / Total",
      key: "month_cards",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-slate-800">{row.month_cards} this mo</p>
          <p className="text-[11px] text-slate-400">{row.total_cards} lifetime</p>
        </div>
      )
    },
    {
      header: "Performance",
      key: "performance",
      render: (row) => {
        const variants = {
          Excellent: "success",
          "On Track": "brand",
          "Needs Attention": "warning"
        };
        return <Badge variant={variants[row.performance] || "default"}>{row.performance}</Badge>;
      }
    },
    {
      header: "Action",
      key: "actions",
      align: "right",
      render: (row) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedAgent(row)}>
          View Metrics
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Field Enrolment Agents</h2>
          <p className="text-xs text-slate-500">87 field agents working across 8 Tripura districts (Daily Target: 10 cards)</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Agents" value="87" subtitle="Active field force" variant="purple" />
        <StatCard title="Active Today" value="74" subtitle="Submitting enrollments" variant="emerald" />
        <StatCard title="Monthly Cards" value="4,286" subtitle="August 2026 total" variant="brand" />
        <StatCard title="Avg Daily Enrolment" value="9.8" subtitle="Target: 10.0 / day" variant="blue" />
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search agent name, code, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
        >
          <option value="All">All Districts</option>
          {initialDistricts.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Agents Table */}
      <DataTable
        columns={columns}
        data={paginatedData}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredAgents.length}
        onPageChange={setCurrentPage}
      />

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <Modal
          isOpen={!!selectedAgent}
          onClose={() => setSelectedAgent(null)}
          title={`Agent: ${selectedAgent.name}`}
          subtitle={`Agent ID: ${selectedAgent.agent_code} • ${selectedAgent.district}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-6 text-xs">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <img src={selectedAgent.avatar} alt="Agent" className="w-14 h-14 rounded-full object-cover ring-2 ring-brand-500" />
              <div className="space-y-1">
                <h4 className="font-bold text-base text-navy-900">{selectedAgent.name}</h4>
                <p className="text-slate-600">{selectedAgent.email} • {selectedAgent.mobile}</p>
                <Badge variant={selectedAgent.performance === "Excellent" ? "success" : "brand"}>
                  {selectedAgent.performance} Performance ({selectedAgent.rating} ★)
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-orange-50 p-3.5 rounded-xl border border-orange-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Today</span>
                <p className="text-xl font-extrabold text-brand-600">{selectedAgent.today_cards} / {selectedAgent.target_daily}</p>
              </div>
              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">This Month</span>
                <p className="text-xl font-extrabold text-emerald-700">{selectedAgent.month_cards}</p>
              </div>
              <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Commissions</span>
                <p className="text-xl font-extrabold text-blue-700">₹{selectedAgent.total_commission_earned}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h5 className="font-bold text-navy-900">Operational Target Tracking</h5>
              <p className="text-slate-600 leading-relaxed">
                Field agents receive a daily objective of <strong>10 new card registrations</strong>. Rajesh Kumar and Sunita Debnath currently lead daily conversion rates in West Tripura.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedAgent(null)}>
                Close
              </Button>
              <a href={`tel:${selectedAgent.mobile}`}>
                <Button size="sm" icon={Phone}>
                  Call Agent
                </Button>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
