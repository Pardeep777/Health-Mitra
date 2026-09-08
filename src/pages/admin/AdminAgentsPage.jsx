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
  ShieldCheck
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
  const [agents, setAgents] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [agentToEdit, setAgentToEdit] = useState(null);
  const [agentToDelete, setAgentToDelete] = useState(null);
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

  const { showToast } = useNotifications();

  const loadData = async () => {
    setLoading(true);
    try {
      const [agentData, districtData] = await Promise.all([
        agentService.getAll(),
        districtService.getAll()
      ]);
      setAgents(agentData);
      setDistricts(districtData);
    } catch (err) {
      showToast("Error loading agents data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Field Enrolment Agents</h2>
          <p className="text-xs text-slate-500">
            Real-time API endpoints: /api/admin/agents/list, add, edit, delete, commission, targets
          </p>
        </div>
        <Button size="sm" onClick={() => setAddModalOpen(true)} icon={Plus}>
          + Add New Agent
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Agents" value={agents.length || "87"} subtitle="Registered force" variant="purple" />
        <StatCard title="Active Enrollers" value={agents.filter((a) => a.today_cards > 0).length || "74"} subtitle="Active today" variant="emerald" />
        <StatCard title="Daily Target" value="10 Cards" subtitle="Per agent per day" variant="brand" />
        <StatCard title="Commission Rate" value="₹10 / Card" subtitle="Automated payout" variant="blue" />
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
          {districts.map((d) => (
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

      {/* Add Agent Modal */}
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
              label="Mobile Number (10-digit) *"
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
              type="email"
              placeholder="e.g. agent@example.com"
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
              label="Daily Target (Cards)"
              type="number"
              value={newAgent.target_daily}
              onChange={(e) => setNewAgent({ ...newAgent, target_daily: e.target.value })}
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

      {/* Edit Agent Modal */}
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
                  { label: "Inactive", value: "inactive" }
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

      {/* Delete Agent Modal */}
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

