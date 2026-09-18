import React, { useState, useEffect, useMemo } from "react";
import {
  UserCheck,
  Search,
  Plus,
  Award,
  TrendingUp,
  Target,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  IndianRupee,
  ShieldCheck,
  CreditCard,
  Layers,
  ArrowUpRight,
  Filter
} from "lucide-react";
import { agentService } from "../../services/agentService";
import { districtService } from "../../services/districtService";
import { DataTable } from "../../components/common/DataTable";
import { StatCard } from "../../components/common/StatCard";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { useNotifications } from "../../context/NotificationContext";

export function AdminAgentsPage() {
  const [activeTab, setActiveTab] = useState("directory"); // directory, commissions, targets
  const [statusTab, setStatusTab] = useState("all"); // all, active, inactive, blocked
  const [agents, setAgents] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedTargetStatus, setSelectedTargetStatus] = useState("All");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [targetModalOpen, setTargetModalOpen] = useState(false);

  const [agentToEdit, setAgentToEdit] = useState(null);
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [agentForPayout, setAgentForPayout] = useState(null);
  const [agentForTarget, setAgentForTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Add Form
  const [newAgent, setNewAgent] = useState({
    name: "",
    mobile: "",
    email: "",
    district_id: "1",
    target_daily: "10",
    joining_date: new Date().toISOString().split("T")[0],
    status: "active",
    password: "agentpassword123"
  });

  // Payout Form
  const [payoutForm, setPayoutForm] = useState({
    payment_mode: "bank_transfer",
    transaction_reference: "",
    notes: "Commission clearance",
    card_id: ""
  });

  // Target Form
  const [targetForm, setTargetForm] = useState({
    target_daily: "10"
  });

  const { showToast } = useNotifications();

  const loadData = async () => {
    setLoading(true);
    try {
      const [agentData, districtData, commData, targetData] = await Promise.all([
        statusTab === "all" ? agentService.getAll() : agentService.getByStatusTab(statusTab),
        districtService.getAll().catch(() => []),
        agentService.getCommissions().catch(() => []),
        agentService.getTargets().catch(() => [])
      ]);
      setAgents(agentData || []);
      setDistricts(districtData || []);
      setCommissions(Array.isArray(commData) ? commData : []);
      setTargets(Array.isArray(targetData) ? targetData : []);
    } catch (err) {
      showToast("Error loading agents data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusTab]);

  const handleAddAgent = async (e) => {
    e.preventDefault();
    if (!newAgent.name.trim() || !newAgent.mobile.trim()) {
      showToast("Agent Name and Mobile number are required.", "error");
      return;
    }
    setFormLoading(true);
    try {
      const formData = new FormData();
      Object.entries(newAgent).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, v);
      });
      const res = await agentService.create(formData);
      showToast(res.message || "Agent created successfully!", "success");
      setAddModalOpen(false);
      setNewAgent({
        name: "",
        mobile: "",
        email: "",
        district_id: "1",
        target_daily: "10",
        joining_date: new Date().toISOString().split("T")[0],
        status: "active",
        password: "agentpassword123"
      });
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to create agent.", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditAgent = async (e) => {
    e.preventDefault();
    if (!agentToEdit) return;
    setFormLoading(true);
    try {
      const formData = new FormData();
      Object.entries(agentToEdit).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, v);
      });
      const res = await agentService.update(formData);
      showToast(res.message || "Agent updated successfully!", "success");
      setEditModalOpen(false);
      setAgentToEdit(null);
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to update agent.", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAgent = async () => {
    if (!agentToDelete) return;
    setFormLoading(true);
    try {
      const res = await agentService.delete(agentToDelete.id);
      showToast(res.message || `Deleted agent ${agentToDelete.name}.`, "info");
      setDeleteModalOpen(false);
      setAgentToDelete(null);
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to delete agent.", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleClearCommission = async (e) => {
    e.preventDefault();
    if (!agentForPayout) return;
    setFormLoading(true);
    try {
      if (payoutForm.card_id) {
        await agentService.payoutSingleCard({
          id: agentForPayout.id,
          card_id: payoutForm.card_id,
          payment_mode: payoutForm.payment_mode,
          transaction_reference: payoutForm.transaction_reference
        });
        showToast("Single card commission cleared!", "success");
      } else {
        await agentService.clearPendingCommission({
          id: agentForPayout.id,
          payment_mode: payoutForm.payment_mode,
          transaction_reference: payoutForm.transaction_reference,
          notes: payoutForm.notes
        });
        showToast(`Full pending commission cleared for ${agentForPayout.name}!`, "success");
      }
      setPayoutModalOpen(false);
      setAgentForPayout(null);
      setPayoutForm({ payment_mode: "bank_transfer", transaction_reference: "", notes: "", card_id: "" });
      loadData();
    } catch (err) {
      showToast(err.message || "Payout clearance failed.", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTarget = async (e) => {
    e.preventDefault();
    if (!agentForTarget) return;
    setFormLoading(true);
    try {
      await agentService.updateTarget({
        id: agentForTarget.id,
        target_daily: targetForm.target_daily
      });
      showToast(`Daily target for ${agentForTarget.name} updated to ${targetForm.target_daily}!`, "success");
      setTargetModalOpen(false);
      setAgentForTarget(null);
      loadData();
    } catch (err) {
      showToast(err.message || "Target update failed.", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const filteredAgents = useMemo(() => {
    return agents.filter((a) => {
      const matchSearch =
        (a.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.agent_code || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.mobile || "").includes(searchTerm);
      const matchDist = selectedDistrict === "All" || a.district === selectedDistrict;
      return matchSearch && matchDist;
    });
  }, [agents, searchTerm, selectedDistrict]);

  const paginatedAgents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAgents.slice(start, start + pageSize);
  }, [filteredAgents, currentPage]);

  const directoryColumns = [
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
          <p className="font-semibold text-slate-800">{row.district} ({row.subdivision || "HQ"})</p>
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
      header: "Commission",
      key: "total_commission_earned",
      render: (row) => (
        <div className="text-xs">
          <p className="font-extrabold text-brand-600">₹{row.total_commission_earned || row.today_cards * 10}</p>
          <button
            onClick={() => {
              setAgentForPayout(row);
              setPayoutModalOpen(true);
            }}
            className="text-[10px] text-emerald-600 hover:text-emerald-800 font-bold underline"
          >
            Clear Payout
          </button>
        </div>
      )
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <Badge variant={row.status?.toLowerCase() === "active" ? "success" : row.status?.toLowerCase() === "blocked" ? "danger" : "default"}>
          {row.status}
        </Badge>
      )
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setSelectedAgent(row)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setAgentForTarget(row);
              setTargetForm({ target_daily: String(row.target_daily || 10) });
              setTargetModalOpen(true);
            }}
            className="p-1.5 rounded-lg border border-slate-200 text-purple-600 hover:bg-purple-50 transition"
            title="Update Target"
          >
            <Target className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setAgentToEdit({ ...row });
              setEditModalOpen(true);
            }}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Edit Agent"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setAgentToDelete(row);
              setDeleteModalOpen(true);
            }}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete Agent"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Field Enrolment Agents Management</h2>
          <p className="text-xs text-slate-500">
            Real-time API endpoints: /api/admin/agents/list, add, edit, delete, status, commission, targets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setAddModalOpen(true)} icon={Plus}>
            + Add New Agent
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Agents" value={agents.length || "87"} subtitle="Registered force" variant="purple" />
        <StatCard title="Active Enrollers" value={agents.filter((a) => a.today_cards > 0).length || "74"} subtitle="Active today" variant="emerald" />
        <StatCard title="Daily Target" value="10 Cards" subtitle="Per agent per day" variant="brand" />
        <StatCard title="Commission Rate" value="₹10 / Card" subtitle="Automated payout" variant="blue" />
      </div>

      {/* Main Feature Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("directory")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === "directory" ? "bg-brand-500 text-white font-bold shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <UserCheck className="w-4 h-4" /> Agent Directory & KYC
        </button>
        <button
          onClick={() => setActiveTab("commissions")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === "commissions" ? "bg-brand-500 text-white font-bold shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <IndianRupee className="w-4 h-4" /> Commission & Payouts (/commission)
        </button>
        <button
          onClick={() => setActiveTab("targets")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === "targets" ? "bg-brand-500 text-white font-bold shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Target className="w-4 h-4" /> Targets & Performance (/targets)
        </button>
      </div>

      {/* Directory Tab View */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          {/* Status Tab Pills & Search */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search agent name, code, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {["all", "active", "inactive", "blocked"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                      statusTab === tab ? "bg-white text-brand-600 shadow-sm font-bold" : "text-slate-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              >
                <option value="All">All Districts</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={directoryColumns}
            data={paginatedAgents}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredAgents.length}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Commissions Tab View */}
      {activeTab === "commissions" && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IndianRupee className="w-5 h-5 text-emerald-700" />
              <div>
                <h4 className="font-bold text-xs text-emerald-950">Automated Agent Commission Ledger (₹10 / Valid Enrolment)</h4>
                <p className="text-[11px] text-emerald-800">Clear full pending payouts or individual card payouts via UPI / Bank Transfer.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((a) => {
              const pending = a.pending_commission || (a.today_cards * 10);
              return (
                <div key={a.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img src={a.avatar} alt={a.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200" />
                      <div>
                        <h5 className="font-bold text-sm text-navy-900 leading-snug">{a.name}</h5>
                        <p className="text-[11px] text-brand-600 font-mono">{a.agent_code} • {a.district}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Pending Payout</span>
                      <p className="text-lg font-extrabold text-emerald-700">₹{pending}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Total Lifetime</span>
                      <p className="text-lg font-extrabold text-navy-900">₹{a.total_commission_earned || a.total_cards * 10}</p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    onClick={() => {
                      setAgentForPayout(a);
                      setPayoutModalOpen(true);
                    }}
                  >
                    Clear Payout (₹{pending})
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Targets Tab View */}
      {activeTab === "targets" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Target Achieved" value={agents.filter((a) => a.today_cards >= a.target_daily).length} subtitle="≥ 10 cards today" variant="emerald" />
            <StatCard title="On Track" value={agents.filter((a) => a.today_cards >= 5 && a.today_cards < a.target_daily).length} subtitle="5-9 cards today" variant="brand" />
            <StatCard title="In Progress" value={agents.filter((a) => a.today_cards > 0 && a.today_cards < 5).length} subtitle="1-4 cards today" variant="purple" />
            <StatCard title="Not Started" value={agents.filter((a) => a.today_cards === 0).length} subtitle="0 cards logged" variant="default" />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-sm text-navy-900">Agent Performance & Daily Targets Tracker</h4>
              <p className="text-xs text-slate-400">Endpoint: /api/admin/agents/targets</p>
            </div>
            <div className="divide-y divide-slate-100">
              {agents.map((a) => {
                const progress = Math.min(100, Math.round((a.today_cards / (a.target_daily || 10)) * 100));
                const statusLabel = a.today_cards >= a.target_daily ? "Achieved" : a.today_cards >= 5 ? "On Track" : a.today_cards > 0 ? "In Progress" : "Not Started";
                return (
                  <div key={a.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={a.avatar} alt={a.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-navy-900 text-sm">{a.name} ({a.agent_code})</p>
                        <p className="text-slate-500">{a.district} • Daily Target: <strong>{a.target_daily} Cards</strong></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span>{a.today_cards} / {a.target_daily}</span>
                          <span className="text-brand-600">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${progress >= 100 ? "bg-emerald-500" : progress >= 50 ? "bg-brand-500" : "bg-amber-500"}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <Badge variant={statusLabel === "Achieved" ? "success" : statusLabel === "On Track" ? "brand" : "warning"}>
                        {statusLabel}
                      </Badge>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setAgentForTarget(a);
                          setTargetForm({ target_daily: String(a.target_daily || 10) });
                          setTargetModalOpen(true);
                        }}
                      >
                        Adjust Target
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {/* 1. Add Agent Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Field Enrolment Agent"
        subtitle="POST /api/admin/agents/add"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleAddAgent} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Full Name *"
              placeholder="e.g. Rajesh Kumar"
              value={newAgent.name}
              onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              required
            />
            <Input
              label="Mobile Number (10 digits) *"
              placeholder="e.g. 9876543210"
              maxLength={10}
              value={newAgent.mobile}
              onChange={(e) => setNewAgent({ ...newAgent, mobile: e.target.value.replace(/\D/g, "") })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address"
              placeholder="e.g. rajesh@example.com"
              type="email"
              value={newAgent.email}
              onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
            />
            <Select
              label="Assigned District *"
              options={districts.map((d) => ({ label: d.name, value: d.id }))}
              value={newAgent.district_id}
              onChange={(e) => setNewAgent({ ...newAgent, district_id: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Daily Target (Cards / Day) *"
              type="number"
              min="1"
              value={newAgent.target_daily}
              onChange={(e) => setNewAgent({ ...newAgent, target_daily: e.target.value })}
              required
            />
            <Input
              label="Joining Date"
              type="date"
              value={newAgent.joining_date}
              onChange={(e) => setNewAgent({ ...newAgent, joining_date: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={formLoading}>
              Save & Register Agent
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Clear Commission Payout Modal */}
      {agentForPayout && (
        <Modal
          isOpen={payoutModalOpen}
          onClose={() => setPayoutModalOpen(false)}
          title={`Process Payout: ${agentForPayout.name}`}
          subtitle="POST /api/admin/agents/commission"
        >
          <form onSubmit={handleClearCommission} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <p className="font-bold text-navy-900">{agentForPayout.name} ({agentForPayout.agent_code})</p>
              <p className="text-slate-500">Contact: {agentForPayout.mobile} • District: {agentForPayout.district}</p>
            </div>

            <Select
              label="Payment Mode *"
              options={[
                { label: "Bank NEFT / IMPS Transfer", value: "bank_transfer" },
                { label: "UPI Direct Payout (GPay/PhonePe)", value: "upi" },
                { label: "Cash Handover Desk", value: "cash" }
              ]}
              value={payoutForm.payment_mode}
              onChange={(e) => setPayoutForm({ ...payoutForm, payment_mode: e.target.value })}
            />

            <Input
              label="Transaction UTR / Reference ID"
              placeholder="e.g. UTR1234567890"
              value={payoutForm.transaction_reference}
              onChange={(e) => setPayoutForm({ ...payoutForm, transaction_reference: e.target.value })}
            />

            <Input
              label="Specific Card ID (Optional - Leave blank for full pending balance)"
              placeholder="e.g. HMC-12345"
              value={payoutForm.card_id}
              onChange={(e) => setPayoutForm({ ...payoutForm, card_id: e.target.value })}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setPayoutModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={formLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                Confirm Payout Clearance
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 3. Update Target Modal */}
      {agentForTarget && (
        <Modal
          isOpen={targetModalOpen}
          onClose={() => setTargetModalOpen(false)}
          title={`Update Daily Target: ${agentForTarget.name}`}
          subtitle="POST /api/admin/agents/targets"
        >
          <form onSubmit={handleUpdateTarget} className="space-y-4 text-xs">
            <Input
              label="New Daily Target (Cards / Day) *"
              type="number"
              min="1"
              value={targetForm.target_daily}
              onChange={(e) => setTargetForm({ target_daily: e.target.value })}
              required
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setTargetModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={formLoading}>
                Save Target
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 4. Edit Modal */}
      {agentToEdit && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit Agent: ${agentToEdit.name}`}
          subtitle="POST /api/admin/agents/edit"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleEditAgent} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name *"
                value={agentToEdit.name || ""}
                onChange={(e) => setAgentToEdit({ ...agentToEdit, name: e.target.value })}
                required
              />
              <Input
                label="Mobile Number *"
                maxLength={10}
                value={agentToEdit.mobile || ""}
                onChange={(e) => setAgentToEdit({ ...agentToEdit, mobile: e.target.value.replace(/\D/g, "") })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Email Address"
                type="email"
                value={agentToEdit.email || ""}
                onChange={(e) => setAgentToEdit({ ...agentToEdit, email: e.target.value })}
              />
              <Select
                label="Assigned District"
                options={districts.map((d) => ({ label: d.name, value: d.id }))}
                value={agentToEdit.district_id || "1"}
                onChange={(e) => setAgentToEdit({ ...agentToEdit, district_id: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Daily Target"
                type="number"
                value={agentToEdit.target_daily || 10}
                onChange={(e) => setAgentToEdit({ ...agentToEdit, target_daily: e.target.value })}
              />
              <Select
                label="Status"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                  { label: "Blocked", value: "blocked" }
                ]}
                value={agentToEdit.status?.toLowerCase() || "active"}
                onChange={(e) => setAgentToEdit({ ...agentToEdit, status: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={formLoading}>
                Update Agent
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 5. Delete Modal */}
      {agentToDelete && (
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Delete Agent"
          subtitle="POST /api/admin/agents/delete"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-700">
              Are you sure you want to delete agent <strong>{agentToDelete.name}</strong> ({agentToDelete.agent_code})?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" loading={formLoading} onClick={handleDeleteAgent}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 6. View Profile Modal */}
      {selectedAgent && (
        <Modal
          isOpen={!!selectedAgent}
          onClose={() => setSelectedAgent(null)}
          title={`Agent Profile: ${selectedAgent.name}`}
          subtitle={`ID: ${selectedAgent.agent_code} • ${selectedAgent.district}`}
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
