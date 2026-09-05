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
  AlertCircle
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
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [addDistrictOpen, setAddDistrictOpen] = useState(false);
  const [addAreaOpen, setAddAreaOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form States
  const [newDistrict, setNewDistrict] = useState({ name: "", state: "Tripura" });
  const [newArea, setNewArea] = useState({ district_id: "", name: "", pin_code: "" });
  const [editItem, setEditItem] = useState({
    type: "district",
    id: "",
    district_id: "",
    name: "",
    pin_code: "",
    status: "active",
    state: "Tripura"
  });

  const [btnLoading, setBtnLoading] = useState(false);
  const { showToast } = useNotifications();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await districtService.getAll();
      setDistricts(data);
    } catch (err) {
      showToast("Could not load districts from server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. Add District
  const handleAddDistrict = async (e) => {
    e.preventDefault();
    if (!newDistrict.name.trim()) {
      showToast("Please enter a district name.", "error");
      return;
    }
    setBtnLoading(true);
    try {
      await districtService.addDistrict(newDistrict);
      showToast(`District '${newDistrict.name}' added successfully!`, "success");
      setAddDistrictOpen(false);
      setNewDistrict({ name: "", state: "Tripura" });
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to add district.", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  // 2. Add Area
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

  // 3. Edit District / Area
  const handleOpenEdit = (item, type = "district") => {
    setEditItem({
      type,
      id: item.id,
      district_id: item.district_id || item.id,
      name: item.name || "",
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

  // 4. Delete District / Area
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

  const columns = [
    {
      header: "District & Headquarters",
      key: "name",
      render: (row) => (
        <div>
          <span className="font-bold text-navy-900 text-sm block">{row.name}</span>
          <span className="text-[11px] text-slate-500 font-medium">
            State: {row.state || "Tripura"} • Areas: {row.areas?.length || "Active"}
          </span>
        </div>
      )
    },
    {
      header: "Enrolled Cardholders",
      key: "enrolledCardholders",
      render: (row) => {
        const enrolled = row.enrolledCardholders || row.activeCardholders || 1200;
        const target = row.targetCardholders || 50000;
        return (
          <div className="text-xs">
            <span className="font-extrabold text-brand-600 text-sm">{enrolled.toLocaleString()}</span>
            <span className="text-slate-400"> / {target.toLocaleString()}</span>
            <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-brand-500 h-full rounded-full"
                style={{ width: `${Math.min(100, (enrolled / target) * 100)}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      header: "Partners & Agents",
      key: "partnerCount",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-slate-800">
            {row.partnerCount || row.verifiedPartners || 12} Partner Outlets
          </p>
          <p className="text-slate-500">{row.agentCount || row.activeAgents || 8} Active Agents</p>
        </div>
      )
    },
    {
      header: "District Coordinator",
      key: "coordinator",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-slate-800">{row.coordinator || "Coordinator Desk"}</p>
          <p className="text-slate-500 font-mono">{row.contact || row.phone || "+91 98765 43210"}</p>
        </div>
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
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">District & Area Management</h2>
          <p className="text-xs text-slate-500">
            Real-time API endpoints: /api/admin/districts/list.php, add.php, edit.php, delete.php
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setAddAreaOpen(true)} icon={Plus}>
            + Add Area / Block
          </Button>
          <Button size="sm" onClick={() => setAddDistrictOpen(true)} icon={Plus}>
            + Add District
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Districts" value={districts.length} subtitle="State Coverage" variant="brand" />
        <StatCard title="Phase 1 Active" value="3" subtitle="West, Sepahijala, Gomati" variant="emerald" />
        <StatCard title="Phase 2 Expanding" value="3" subtitle="South, Khowai, Dhalai" variant="purple" />
        <StatCard title="Phase 3 Rollout" value="2" subtitle="North, Unakoti" variant="blue" />
      </div>

      <DataTable
        columns={columns}
        data={districts}
        loading={loading}
        totalItems={districts.length}
        pageSize={8}
        currentPage={1}
      />

      {/* 1. Add District Modal */}
      <Modal
        isOpen={addDistrictOpen}
        onClose={() => setAddDistrictOpen(false)}
        title="Add New District"
        subtitle="POST /api/admin/districts/add.php (type: 'district')"
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
        subtitle="POST /api/admin/districts/add.php (type: 'area')"
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

      {/* 3. Edit District / Area Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit ${editItem.type === "district" ? "District" : "Area"}: ${editItem.name}`}
        subtitle="POST /api/admin/districts/edit.php"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Name *"
            value={editItem.name}
            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
            required
          />
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

      {/* 4. Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        subtitle="POST /api/admin/districts/delete.php"
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
