import React, { useState, useEffect } from "react";
import { distributorService } from "../../services/distributorService";
import { districtService } from "../../services/districtService";
import { Truck, Search, MapPin, Users, Target, Phone, Mail, Plus, Edit2, Trash2 } from "lucide-react";
import { DataTable } from "../../components/common/DataTable";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { useNotifications } from "../../context/NotificationContext";

export function AdminDistributorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [distributors, setDistributors] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  // Form State
  const [newDistributor, setNewDistributor] = useState({
    name: "",
    district: "West Tripura",
    district_id: "1",
    address: "",
    owner_name: "",
    phone: "",
    email: "",
    points_managed: "5",
    assigned_agents_count: "3",
    target_monthly: "500",
    status: "Active"
  });

  const { showToast } = useNotifications();

  const loadData = async () => {
    setLoading(true);
    try {
      const [distList, districtList] = await Promise.all([
        searchTerm.trim() ? distributorService.search(searchTerm) : distributorService.getAll(),
        districtService.getAll().catch(() => [])
      ]);
      setDistributors(distList || []);
      setDistricts(districtList || []);
    } catch (err) {
      showToast("Error loading distributors data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newDistributor.name.trim() || !newDistributor.owner_name.trim()) {
      showToast("Distributor name and owner name are required.", "error");
      return;
    }
    setBtnLoading(true);
    try {
      await distributorService.create(newDistributor);
      showToast("Distributor added successfully!", "success");
      setAddModalOpen(false);
      setNewDistributor({
        name: "",
        district: "West Tripura",
        district_id: "1",
        address: "",
        owner_name: "",
        phone: "",
        email: "",
        points_managed: "5",
        assigned_agents_count: "3",
        target_monthly: "500",
        status: "Active"
      });
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to create distributor.", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!itemToEdit?.name?.trim()) {
      showToast("Name is required.", "error");
      return;
    }
    setBtnLoading(true);
    try {
      await distributorService.update(itemToEdit);
      showToast("Distributor updated successfully!", "success");
      setEditModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to update distributor.", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setBtnLoading(true);
    try {
      await distributorService.delete(itemToDelete.id);
      showToast("Distributor removed successfully.", "info");
      setDeleteModalOpen(false);
      setItemToDelete(null);
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to delete distributor.", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  const totalPoints = distributors.reduce((acc, d) => acc + Number(d.points_managed || 0), 0);
  const totalAgents = distributors.reduce((acc, d) => acc + Number(d.assigned_agents_count || 0), 0);

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
      header: "District & Contact",
      key: "district",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-slate-800">{row.district}</p>
          <p className="text-slate-500">{row.owner_name} • {row.phone || row.email || "No contact"}</p>
        </div>
      )
    },
    {
      header: "Managed Points & Agents",
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
      render: (row) => {
        const achieved = Number(row.achieved_monthly || 0);
        const target = Number(row.target_monthly || 500);
        return (
          <div className="text-xs">
            <span className="font-extrabold text-navy-900">{achieved}</span>
            <span className="text-slate-400"> / {target} target</span>
            <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-brand-500 h-full rounded-full"
                style={{ width: `${Math.min(100, (achieved / target) * 100)}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      header: "Status",
      key: "status",
      render: (row) => <Badge variant={row.status === "Active" ? "success" : "default"}>{row.status}</Badge>
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => {
              setItemToEdit(row);
              setEditModalOpen(true);
            }}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Edit Distributor"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setItemToDelete(row);
              setDeleteModalOpen(true);
            }}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete Distributor"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Distributor Logistics Network</h2>
          <p className="text-xs text-slate-500">
            Real-time API endpoints: /api/admin/distributors/list, add, edit, delete
          </p>
        </div>
        <Button size="sm" onClick={() => setAddModalOpen(true)} icon={Plus}>
          + Add Distributor
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Distributors" value={distributors.length} subtitle="Authorized statewide" variant="brand" />
        <StatCard title="Retail Points" value={totalPoints || 50} subtitle="Across 8 districts" variant="blue" />
        <StatCard title="Field Agents Linked" value={totalAgents || 87} subtitle="Supplied with PVC cards" variant="purple" />
        <StatCard title="Monthly Quota" value="7,050" subtitle="Target capacity" variant="emerald" />
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search distributor, owner, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={distributors}
        loading={loading}
        totalItems={distributors.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Add Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Regional Distributor"
        subtitle="POST /api/admin/distributors/add"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Distributor Hub Name *"
            placeholder="e.g. Agartala Central Distribution Hub"
            value={newDistributor.name}
            onChange={(e) => setNewDistributor({ ...newDistributor, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="District *"
              options={districts.length > 0 ? districts.map((d) => ({ label: d.name, value: d.name })) : [
                { label: "West Tripura", value: "West Tripura" },
                { label: "Sepahijala", value: "Sepahijala" },
                { label: "Gomati", value: "Gomati" },
                { label: "South Tripura", value: "South Tripura" },
                { label: "Khowai", value: "Khowai" },
                { label: "Dhalai", value: "Dhalai" },
                { label: "North Tripura", value: "North Tripura" },
                { label: "Unakoti", value: "Unakoti" }
              ]}
              value={newDistributor.district}
              onChange={(e) => setNewDistributor({ ...newDistributor, district: e.target.value })}
              required
            />
            <Input
              label="Owner / Manager Name *"
              placeholder="e.g. Ramesh Debbarma"
              value={newDistributor.owner_name}
              onChange={(e) => setNewDistributor({ ...newDistributor, owner_name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Mobile"
              placeholder="e.g. 9876543210"
              value={newDistributor.phone}
              onChange={(e) => setNewDistributor({ ...newDistributor, phone: e.target.value })}
            />
            <Input
              label="Email Address"
              placeholder="distributor@healthmitra.in"
              type="email"
              value={newDistributor.email}
              onChange={(e) => setNewDistributor({ ...newDistributor, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Managed Retail Points"
              type="number"
              value={newDistributor.points_managed}
              onChange={(e) => setNewDistributor({ ...newDistributor, points_managed: e.target.value })}
            />
            <Input
              label="Assigned Agents"
              type="number"
              value={newDistributor.assigned_agents_count}
              onChange={(e) => setNewDistributor({ ...newDistributor, assigned_agents_count: e.target.value })}
            />
            <Input
              label="Monthly Target"
              type="number"
              value={newDistributor.target_monthly}
              onChange={(e) => setNewDistributor({ ...newDistributor, target_monthly: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={btnLoading}>
              Save Distributor
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Distributor: ${itemToEdit?.name || ""}`}
        subtitle="POST /api/admin/distributors/edit"
      >
        {itemToEdit && (
          <form onSubmit={handleEdit} className="space-y-4">
            <Input
              label="Distributor Name *"
              value={itemToEdit.name}
              onChange={(e) => setItemToEdit({ ...itemToEdit, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Owner Name"
                value={itemToEdit.owner_name}
                onChange={(e) => setItemToEdit({ ...itemToEdit, owner_name: e.target.value })}
              />
              <Input
                label="Phone"
                value={itemToEdit.phone}
                onChange={(e) => setItemToEdit({ ...itemToEdit, phone: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Managed Points"
                type="number"
                value={itemToEdit.points_managed}
                onChange={(e) => setItemToEdit({ ...itemToEdit, points_managed: e.target.value })}
              />
              <Input
                label="Monthly Target"
                type="number"
                value={itemToEdit.target_monthly}
                onChange={(e) => setItemToEdit({ ...itemToEdit, target_monthly: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={btnLoading}>
                Update
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        subtitle="POST /api/admin/distributors/delete"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-700">
            Are you sure you want to delete distributor <strong>{itemToDelete?.name}</strong>?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={btnLoading} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
