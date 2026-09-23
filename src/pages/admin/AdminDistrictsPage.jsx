import React, { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  Building2,
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Flag,
  Sparkles,
  Phone,
  Layers,
  Search,
  Calendar,
  X,
  Target
} from "lucide-react";
import { districtService } from "../../services/districtService";
import { DataTable } from "../../components/common/DataTable";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { useNotifications } from "../../context/NotificationContext";

export function AdminDistrictsPage() {
  const [activeTab, setActiveTab] = useState("districts"); // districts, rollout
  const [selectedPhase, setSelectedPhase] = useState("all"); // all, phase_1, phase_2, phase_3
  const [searchTerm, setSearchTerm] = useState("");
  const [districts, setDistricts] = useState([]);
  const [rolloutData, setRolloutData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [addDistrictOpen, setAddDistrictOpen] = useState(false);
  const [addAreaOpen, setAddAreaOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rolloutModalOpen, setRolloutModalOpen] = useState(false);

  const [itemToDelete, setItemToDelete] = useState(null);
  const [districtForRollout, setDistrictForRollout] = useState(null);

  // Form States (includes mobile as added in new API)
  const [newDistrict, setNewDistrict] = useState({ name: "", mobile: "", state: "Tripura" });
  const [newArea, setNewArea] = useState({ district_id: "", name: "", pin_code: "" });
  const [editItem, setEditItem] = useState({
    type: "district",
    id: "",
    district_id: "",
    name: "",
    mobile: "",
    pin_code: "",
    status: "active",
    state: "Tripura"
  });

  const [rolloutForm, setRolloutForm] = useState({
    rollout_phase: "phase_1",
    coordinator_name: "",
    coordinator_phone: "",
    target_cardholders: "50000",
    headquarters: "Agartala"
  });

  const [btnLoading, setBtnLoading] = useState(false);
  const { showToast } = useNotifications();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await districtService.getAll(true);
      setDistricts(Array.isArray(data) ? data : []);

      const rData = await districtService.getRollout(selectedPhase !== "all" ? { phase: selectedPhase } : {});
      setRolloutData(Array.isArray(rData) ? rData : Array.isArray(data) ? data : []);
    } catch (err) {
      showToast("Could not load districts from server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedPhase]);

  // 1. Add District with Mobile (POST /api/admin/districts/add)
  const handleAddDistrict = async (e) => {
    e.preventDefault();
    if (!newDistrict.name.trim()) {
      showToast("Please enter a district name.", "error");
      return;
    }
    if (!newDistrict.mobile.trim()) {
      showToast("Please enter the Coordinator mobile number.", "error");
      return;
    }
    setBtnLoading(true);
    try {
      await districtService.addDistrict({
        name: newDistrict.name,
        mobile: newDistrict.mobile,
        state: newDistrict.state || "Tripura"
      });
      showToast(`District '${newDistrict.name}' added successfully!`, "success");
      setAddDistrictOpen(false);
      setNewDistrict({ name: "", mobile: "", state: "Tripura" });
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to add district.", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  // 2. Add Area (POST /api/admin/districts/add)
  const handleAddArea = async (e) => {
    e.preventDefault();
    if (!newArea.district_id) {
      showToast("Please select a target district.", "error");
      return;
    }
    if (!newArea.name.trim()) {
      showToast("Please enter area / block name.", "error");
      return;
    }
    if (!newArea.pin_code || newArea.pin_code.trim().length !== 6) {
      showToast("Please enter a valid 6-digit PIN code.", "error");
      return;
    }
    setBtnLoading(true);
    try {
      await districtService.addArea(newArea);
      showToast(`Area '${newArea.name}' added successfully!`, "success");
      setAddAreaOpen(false);
      setNewArea({ district_id: "", name: "", pin_code: "" });
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to add area.", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  // 3. Edit District / Area (POST /api/admin/districts/edit)
  const handleOpenEdit = (item, type = "district") => {
    setEditItem({
      type,
      id: item.id,
      district_id: item.district_id || item.id,
      name: item.name || "",
      mobile: item.mobile || item.coordinator_phone?.replace(/^\+91\s*/, "") || "",
      pin_code: item.pin_code || "799001",
      status: item.status || "active",
      state: item.state || "Tripura"
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editItem.name.trim()) {
      showToast("Please enter a valid name.", "error");
      return;
    }
    setBtnLoading(true);
    try {
      await districtService.edit(editItem);
      showToast(`Updated '${editItem.name}' successfully!`, "success");
      setEditModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || "Update failed.", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  // 4. Delete District / Area (POST /api/admin/districts/delete)
  const handleDeleteSubmit = async () => {
    if (!itemToDelete) return;
    setBtnLoading(true);
    try {
      await districtService.delete({ type: itemToDelete.type || "district", id: itemToDelete.id });
      showToast(`Deleted ${itemToDelete.name || "item"} successfully.`, "info");
      setDeleteModalOpen(false);
      setItemToDelete(null);
      loadData();
    } catch (err) {
      showToast(err.message || "Delete failed.", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  // 5. Update Rollout Phase (POST /api/admin/districts/rollout)
  const handleRolloutSubmit = async (e) => {
    e.preventDefault();
    if (!districtForRollout) return;
    setBtnLoading(true);
    try {
      await districtService.updateRollout({
        id: districtForRollout.id,
        ...rolloutForm
      });
      showToast(`Rollout strategy for ${districtForRollout.name} updated!`, "success");
      setRolloutModalOpen(false);
      setDistrictForRollout(null);
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to update rollout.", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  // Filtered districts list
  const filteredDistricts = districts.filter((d) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = d.name?.toLowerCase().includes(term);
    const phoneMatch = (d.coordinator_phone || d.mobile || "")?.toLowerCase().includes(term);
    const coordMatch = (d.coordinator_name || d.coordinator || "")?.toLowerCase().includes(term);
    const stateMatch = d.state?.toLowerCase().includes(term);
    return nameMatch || phoneMatch || coordMatch || stateMatch;
  });

  // Desktop Table Columns (EXACT same as current web layout)
  const columns = [
    {
      header: "District & Headquarters",
      key: "name",
      render: (row) => (
        <div>
          <span className="font-bold text-navy-900 text-sm block">{row.name}</span>
          <span className="text-[11px] text-slate-500 font-medium">
            State: {row.state || "Tripura"} • HQ: {row.headquarters || row.name}
          </span>
        </div>
      )
    },
    {
      header: "Coordinator Desk & Mobile",
      key: "coordinator",
      render: (row) => {
        const phone = row.coordinator_phone || row.mobile || row.phone || "";
        const name = row.coordinator_name || row.coordinator || "District Coordinator";
        return (
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-slate-800">{name}</p>
            {phone ? (
              <a
                href={`tel:${phone}`}
                className="text-brand-600 font-mono font-semibold flex items-center gap-1 hover:underline"
              >
                <Phone className="w-3 h-3 text-slate-400" />
                {phone}
              </a>
            ) : (
              <span className="text-slate-400 font-mono text-[11px]">No mobile assigned</span>
            )}
          </div>
        );
      }
    },
    {
      header: "Rollout Phase",
      key: "rollout_phase",
      render: (row) => {
        const phase = row.rollout_phase || "phase_1";
        return (
          <Badge
            variant={phase === "phase_1" ? "success" : phase === "phase_2" ? "purple" : "brand"}
            size="sm"
          >
            {phase.toUpperCase().replace("_", " ")}
          </Badge>
        );
      }
    },
    {
      header: "Areas / Blocks",
      key: "total_areas",
      render: (row) => {
        const areaCount = Number(row.total_areas ?? (row.areas ? row.areas.length : 0));
        return (
          <div className="text-xs">
            <span className="font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded-md inline-block">
              {areaCount} {areaCount === 1 ? "Area" : "Areas"}
            </span>
            {Array.isArray(row.areas) && row.areas.length > 0 && (
              <div
                className="text-[10px] text-slate-500 mt-1 truncate max-w-[140px]"
                title={row.areas.map((a) => a.name).join(", ")}
              >
                {row.areas.map((a) => a.name).slice(0, 2).join(", ")}
                {row.areas.length > 2 ? ` +${row.areas.length - 2} more` : ""}
              </div>
            )}
          </div>
        );
      }
    },
    {
      header: "Target Cardholders",
      key: "target_cardholders",
      render: (row) => {
        const target = Number(row.target_cardholders || row.targetCardholders || 50000);
        return (
          <div className="text-xs">
            <span className="font-extrabold text-navy-900">{target.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block">cardholders</span>
          </div>
        );
      }
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "default"} size="sm">
          {row.status === "active" ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      header: "Created Date",
      key: "created_at",
      render: (row) => (
        <span className="text-slate-500 font-medium text-[11px]">
          {row.created_at ? row.created_at.split(" ")[0] : "N/A"}
        </span>
      )
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => {
              setNewArea({ district_id: row.id, name: "", pin_code: "" });
              setAddAreaOpen(true);
            }}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition"
            title="Add Area to District"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setDistrictForRollout(row);
              setRolloutForm({
                rollout_phase: row.rollout_phase || "phase_1",
                coordinator_name: row.coordinator || row.coordinator_name || "",
                coordinator_phone: row.coordinator_phone || row.mobile || row.contact || "",
                target_cardholders: String(row.targetCardholders || row.target_cardholders || 50000),
                headquarters: row.headquarters || row.name
              });
              setRolloutModalOpen(true);
            }}
            className="p-1.5 rounded-lg border border-slate-200 text-purple-600 hover:bg-purple-50 transition"
            title="Configure Rollout Phase"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenEdit(row, "district")}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Edit District"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setItemToDelete({ type: "district", id: row.id, name: row.name });
              setDeleteModalOpen(true);
            }}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete District"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-16 sm:pb-0">
      {/* Top Header & Actions (Responsive: Grid on phone, Flex on desktop) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">District & Rollout Management</h2>
          <p className="text-xs text-slate-500">
            Real-time API endpoints: /api/admin/districts/list, add, edit, delete, rollout
          </p>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAddAreaOpen(true)}
            icon={Plus}
            className="justify-center text-xs"
          >
            + Add Area
          </Button>
          <Button
            size="sm"
            onClick={() => setAddDistrictOpen(true)}
            icon={Plus}
            className="justify-center text-xs shadow-xs"
          >
            + Add District
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Districts" value={districts.length} subtitle="Tripura State" variant="brand" />
        <StatCard
          title="Phase 1 Priority"
          value={districts.filter((d) => d.rollout_phase === "phase_1" || !d.rollout_phase).length}
          subtitle="Priority operations"
          variant="emerald"
        />
        <StatCard
          title="Phase 2 Expanding"
          value={districts.filter((d) => d.rollout_phase === "phase_2").length}
          subtitle="Expanding operations"
          variant="purple"
        />
        <StatCard
          title="Phase 3 Rollout"
          value={districts.filter((d) => d.rollout_phase === "phase_3").length}
          subtitle="Upcoming coverage"
          variant="blue"
        />
      </div>

      {/* Tabs & Search Bar (Mobile scrollable tabs, desktop flex) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setActiveTab("districts")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition ${
              activeTab === "districts"
                ? "bg-brand-500 text-white font-bold shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> Districts Register ({districts.length})
          </button>
          <button
            onClick={() => setActiveTab("rollout")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition ${
              activeTab === "rollout"
                ? "bg-brand-500 text-white font-bold shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Flag className="w-3.5 h-3.5" /> Rollout Strategy
          </button>
        </div>

        {/* Live search input */}
        {activeTab === "districts" && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search district, phone, coordinator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 pl-8 pr-7 py-2 sm:py-1.5 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 1. Districts Tab */}
      {activeTab === "districts" && (
        <>
          {/* DESKTOP VIEW (Screens >= 768px): EXACT CURRENT TABLE */}
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={filteredDistricts}
              loading={loading}
              totalItems={filteredDistricts.length}
              pageSize={10}
              currentPage={1}
            />
          </div>

          {/* MOBILE PHONE VIEW (Screens < 768px): STUNNING TOUCH-FRIENDLY CARDS */}
          <div className="block md:hidden space-y-3">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
                Loading districts data...
              </div>
            ) : filteredDistricts.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-navy-900">No Districts Found</h4>
                <p className="text-xs text-slate-500">Try changing your search term.</p>
              </div>
            ) : (
              filteredDistricts.map((d) => {
                const phone = d.coordinator_phone || d.mobile || d.phone || "";
                const name = d.coordinator_name || d.coordinator || "District Coordinator";
                const areaCount = Number(d.total_areas ?? (d.areas ? d.areas.length : 0));
                const phase = d.rollout_phase || "phase_1";
                const target = Number(d.target_cardholders || d.targetCardholders || 50000);

                return (
                  <div
                    key={d.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3"
                  >
                    {/* Top Row: Name, State, Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-navy-900 text-base flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                          {d.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          State: <strong className="text-slate-700">{d.state || "Tripura"}</strong> • HQ:{" "}
                          {d.headquarters || d.name}
                        </p>
                      </div>
                      <Badge variant={d.status === "active" ? "success" : "default"} size="sm">
                        {d.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {/* Coordinator Desk with Direct Phone Dial Button */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                          Coordinator Desk
                        </span>
                        <span className="text-xs font-bold text-navy-900 block truncate">{name}</span>
                        {phone && (
                          <span className="text-[11px] text-slate-500 font-mono block mt-0.5">{phone}</span>
                        )}
                      </div>
                      {phone ? (
                        <a
                          href={`tel:${phone}`}
                          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition"
                          title="Call Coordinator"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Call
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400">No mobile</span>
                      )}
                    </div>

                    {/* Quick Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-100/80">
                        <span className="text-[10px] text-slate-400 block font-semibold">Phase</span>
                        <Badge
                          variant={
                            phase === "phase_1" ? "success" : phase === "phase_2" ? "purple" : "brand"
                          }
                          size="sm"
                          className="mt-1"
                        >
                          {phase.toUpperCase().replace("PHASE_", "P")}
                        </Badge>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-100/80">
                        <span className="text-[10px] text-slate-400 block font-semibold">Areas</span>
                        <span className="font-extrabold text-navy-900 block mt-1 text-xs">
                          {areaCount} {areaCount === 1 ? "Block" : "Blocks"}
                        </span>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-100/80">
                        <span className="text-[10px] text-slate-400 block font-semibold">Target</span>
                        <span className="font-extrabold text-brand-600 block mt-1 text-xs truncate">
                          {target >= 1000 ? `${(target / 1000).toFixed(0)}k` : target}
                        </span>
                      </div>
                    </div>

                    {/* Areas tags list on phone */}
                    {Array.isArray(d.areas) && d.areas.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Areas:</span>
                        {d.areas.slice(0, 3).map((a) => (
                          <span
                            key={a.id}
                            className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md"
                          >
                            {a.name}
                          </span>
                        ))}
                        {d.areas.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            +{d.areas.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Touch-Friendly Action Buttons on Phone */}
                    <div className="grid grid-cols-4 gap-1.5 pt-2.5 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setNewArea({ district_id: d.id, name: "", pin_code: "" });
                          setAddAreaOpen(true);
                        }}
                        className="py-1.5 px-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-600 text-[11px] font-bold flex items-center justify-center gap-1 transition shadow-2xs"
                        title="Add Area"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Area
                      </button>

                      <button
                        onClick={() => {
                          setDistrictForRollout(d);
                          setRolloutForm({
                            rollout_phase: d.rollout_phase || "phase_1",
                            coordinator_name: d.coordinator || d.coordinator_name || "",
                            coordinator_phone: d.coordinator_phone || d.mobile || d.contact || "",
                            target_cardholders: String(d.targetCardholders || d.target_cardholders || 50000),
                            headquarters: d.headquarters || d.name
                          });
                          setRolloutModalOpen(true);
                        }}
                        className="py-1.5 px-2 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 text-[11px] font-bold flex items-center justify-center gap-1 transition shadow-2xs"
                        title="Rollout Phase"
                      >
                        <Flag className="w-3.5 h-3.5" />
                        Phase
                      </button>

                      <button
                        onClick={() => handleOpenEdit(d, "district")}
                        className="py-1.5 px-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-[11px] font-bold flex items-center justify-center gap-1 transition shadow-2xs"
                        title="Edit District"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setItemToDelete({ type: "district", id: d.id, name: d.name });
                          setDeleteModalOpen(true);
                        }}
                        className="py-1.5 px-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-[11px] font-bold flex items-center justify-center gap-1 transition shadow-2xs"
                        title="Delete District"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Del
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* 2. Rollout Tab */}
      {activeTab === "rollout" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-xs text-slate-500 font-bold shrink-0">Filter Phase:</span>
              <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                {[
                  { id: "all", label: "All Phases" },
                  { id: "phase_1", label: "Phase 1" },
                  { id: "phase_2", label: "Phase 2" },
                  { id: "phase_3", label: "Phase 3" }
                ].map((ph) => (
                  <button
                    key={ph.id}
                    onClick={() => setSelectedPhase(ph.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      selectedPhase === ph.id ? "bg-white text-brand-600 shadow-sm font-bold" : "text-slate-600"
                    }`}
                  >
                    {ph.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-400 font-mono">Endpoint: /api/admin/districts/rollout</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {rolloutData.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-base text-navy-900">{d.name}</h4>
                    <p className="text-xs text-slate-500">HQ: {d.headquarters || d.name}</p>
                  </div>
                  <Badge
                    variant={
                      d.rollout_phase === "phase_1" ? "success" : d.rollout_phase === "phase_2" ? "purple" : "brand"
                    }
                  >
                    {(d.rollout_phase || "phase_1").toUpperCase().replace("_", " ")}
                  </Badge>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Cardholders:</span>
                    <span className="font-extrabold text-navy-900">
                      {Number(d.target_cardholders || 50000).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">District Coordinator:</span>
                    <span className="font-bold text-slate-800">
                      {d.coordinator_name || d.coordinator || "Coordinator Desk"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Coordinator Mobile:</span>
                    {d.coordinator_phone || d.mobile ? (
                      <a
                        href={`tel:${d.coordinator_phone || d.mobile}`}
                        className="font-mono text-brand-600 font-bold hover:underline"
                      >
                        {d.coordinator_phone || d.mobile}
                      </a>
                    ) : (
                      <span className="font-mono text-slate-400">N/A</span>
                    )}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setDistrictForRollout(d);
                    setRolloutForm({
                      rollout_phase: d.rollout_phase || "phase_1",
                      coordinator_name: d.coordinator || d.coordinator_name || "",
                      coordinator_phone: d.coordinator_phone || d.mobile || d.contact || "",
                      target_cardholders: String(d.targetCardholders || d.target_cardholders || 50000),
                      headquarters: d.headquarters || d.name
                    });
                    setRolloutModalOpen(true);
                  }}
                >
                  Configure Rollout Strategy
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button (ONLY ON PHONE: block sm:hidden) */}
      <button
        onClick={() => setAddDistrictOpen(true)}
        className="sm:hidden fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-brand-500 text-white shadow-xl flex items-center justify-center hover:bg-brand-600 active:scale-95 transition"
        title="Add District"
        aria-label="Add District"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* 1. Add District Modal */}
      <Modal
        isOpen={addDistrictOpen}
        onClose={() => setAddDistrictOpen(false)}
        title="Add New District"
        subtitle="POST /api/admin/districts/add (type: 'district', name, mobile, state)"
      >
        <form onSubmit={handleAddDistrict} className="space-y-4">
          <Input
            label="District Name *"
            placeholder="e.g. West Tripura"
            value={newDistrict.name}
            onChange={(e) => setNewDistrict({ ...newDistrict, name: e.target.value })}
            required
          />

          <Input
            label="Coordinator Mobile Number *"
            type="tel"
            placeholder="e.g. 9436128136"
            value={newDistrict.mobile}
            onChange={(e) => setNewDistrict({ ...newDistrict, mobile: e.target.value.replace(/\D/g, "") })}
            required
            helperText="The District Coordinator will use this mobile number to log in to the District Portal."
          />

          <Input
            label="State Name"
            placeholder="e.g. Tripura"
            value={newDistrict.state}
            onChange={(e) => setNewDistrict({ ...newDistrict, state: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setAddDistrictOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={btnLoading}>
              Save District
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Add Area Modal */}
      <Modal
        isOpen={addAreaOpen}
        onClose={() => setAddAreaOpen(false)}
        title="Add Area / Block to District"
        subtitle="POST /api/admin/districts/add (type: 'area')"
      >
        <form onSubmit={handleAddArea} className="space-y-4">
          <Select
            label="Select Parent District *"
            options={districts.map((d) => ({ label: d.name, value: d.id }))}
            value={newArea.district_id}
            onChange={(e) => setNewArea({ ...newArea, district_id: e.target.value })}
            required
          />
          <Input
            label="Area / Municipal Block Name *"
            placeholder="e.g. Agartala Municipal Corporation / Banamalipur"
            value={newArea.name}
            onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
            required
          />
          <Input
            label="PIN Code (6-digit) *"
            placeholder="e.g. 799001"
            maxLength={6}
            value={newArea.pin_code}
            onChange={(e) => setNewArea({ ...newArea, pin_code: e.target.value.replace(/\D/g, "") })}
            required
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setAddAreaOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={btnLoading}>
              Save Area
            </Button>
          </div>
        </form>
      </Modal>

      {/* 3. Configure Rollout Modal */}
      {districtForRollout && (
        <Modal
          isOpen={rolloutModalOpen}
          onClose={() => setRolloutModalOpen(false)}
          title={`Rollout Configuration: ${districtForRollout.name}`}
          subtitle="POST /api/admin/districts/rollout"
        >
          <form onSubmit={handleRolloutSubmit} className="space-y-4 text-xs">
            <Select
              label="Rollout Phase *"
              options={[
                { label: "Phase 1 — Priority Launch", value: "phase_1" },
                { label: "Phase 2 — Secondary Expansion", value: "phase_2" },
                { label: "Phase 3 — Remote / Hill Coverage", value: "phase_3" }
              ]}
              value={rolloutForm.rollout_phase}
              onChange={(e) => setRolloutForm({ ...rolloutForm, rollout_phase: e.target.value })}
            />
            <Input
              label="District Headquarters"
              value={rolloutForm.headquarters}
              onChange={(e) => setRolloutForm({ ...rolloutForm, headquarters: e.target.value })}
            />
            <Input
              label="Target Cardholders (Annual Objective)"
              type="number"
              value={rolloutForm.target_cardholders}
              onChange={(e) => setRolloutForm({ ...rolloutForm, target_cardholders: e.target.value })}
            />
            <Input
              label="Assigned District Coordinator Name"
              placeholder="e.g. Sudip Chakraborty"
              value={rolloutForm.coordinator_name}
              onChange={(e) => setRolloutForm({ ...rolloutForm, coordinator_name: e.target.value })}
            />
            <Input
              label="Coordinator Phone Number"
              placeholder="e.g. +91 9436128136"
              value={rolloutForm.coordinator_phone}
              onChange={(e) => setRolloutForm({ ...rolloutForm, coordinator_phone: e.target.value })}
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setRolloutModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={btnLoading}>
                Update Rollout Strategy
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 4. Edit District / Area Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit ${editItem.type === "district" ? "District" : "Area"}: ${editItem.name}`}
        subtitle="POST /api/admin/districts/edit"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Name *"
            value={editItem.name}
            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
            required
          />

          {editItem.type === "district" && (
            <Input
              label="Coordinator Mobile Number"
              type="tel"
              placeholder="e.g. 9436128136"
              value={editItem.mobile}
              onChange={(e) => setEditItem({ ...editItem, mobile: e.target.value.replace(/\D/g, "") })}
            />
          )}

          {editItem.type === "area" && (
            <Input
              label="PIN Code (6-digit) *"
              maxLength={6}
              value={editItem.pin_code}
              onChange={(e) => setEditItem({ ...editItem, pin_code: e.target.value.replace(/\D/g, "") })}
              required
            />
          )}

          <Select
            label="Status"
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" }
            ]}
            value={editItem.status}
            onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={btnLoading}>
              Update
            </Button>
          </div>
        </form>
      </Modal>

      {/* 5. Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        subtitle="POST /api/admin/districts/delete"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-700">
            Are you sure you want to delete <strong>{itemToDelete?.name}</strong>?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={btnLoading} onClick={handleDeleteSubmit}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
