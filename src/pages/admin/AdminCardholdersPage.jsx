import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Upload,
  User,
  AlertTriangle
} from "lucide-react";
import { cardholderService } from "../../services/cardholderService";
import { districtService } from "../../services/districtService";
import { DataTable } from "../../components/common/DataTable";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { HealthMitraCard } from "../../components/card/HealthMitraCard";
import { PrintableCard } from "../../components/card/PrintableCard";
import { useNotifications } from "../../context/NotificationContext";

export function AdminCardholdersPage() {
  const [cardholders, setCardholders] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCardForQr, setSelectedCardForQr] = useState(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [cardholderToDelete, setCardholderToDelete] = useState(null);

  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  // New Card State with all API fields
  const [newCard, setNewCard] = useState({
    full_name: "",
    mobile: "",
    alternate_mobile: "",
    email: "",
    dob: "1995-05-15",
    gender: "male",
    district: "West Tripura",
    district_id: 1,
    pin_code: "799001",
    address: "",
    id_proof_type: "Aadhaar Card",
    id_proof_reference: "",
    payment_mode: "Digital (UPI)",
    registered_by_agent_id: 5,
    distributor_id: 6,
    consent_checkbox: 1,
    privacy_policy_version: "v1.0"
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Edit Card State
  const [editingCard, setEditingCard] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      let data;
      const [distList] = await Promise.all([
        districtService.getAll().catch(() => [])
      ]);
      setDistricts(distList || []);

      if (selectedStatus !== "All") {
        const statusKey = selectedStatus.toLowerCase().replace(" ", "_");
        data = await cardholderService.getByStatus(statusKey);
      } else if (searchTerm.trim()) {
        data = await cardholderService.search(searchTerm);
      } else {
        data = await cardholderService.getAll();
      }
      setCardholders(data || []);
    } catch (err) {
      showToast("Failed to fetch cardholders from server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [selectedStatus, searchTerm]);

  // Handle Photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Photo file size must be under 5MB", "error");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Validation function
  const validateCardholderForm = (data) => {
    if (!data.full_name || data.full_name.trim().length < 3) {
      showToast("Full name must be at least 3 characters long.", "error");
      return false;
    }
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test((data.mobile || "").trim())) {
      showToast("Please enter a valid 10-digit mobile number.", "error");
      return false;
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showToast("Please enter a valid email address.", "error");
      return false;
    }
    if (!data.pin_code || (data.pin_code || "").trim().length !== 6) {
      showToast("Please enter a valid 6-digit PIN code.", "error");
      return false;
    }
    if (!data.address || data.address.trim().length < 5) {
      showToast("Please provide a complete address (minimum 5 characters).", "error");
      return false;
    }
    return true;
  };

  // Add Cardholder Submit
  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!validateCardholderForm(newCard)) return;

    setAddLoading(true);
    try {
      const formData = new FormData();
      Object.entries(newCard).forEach(([key, val]) => {
        formData.append(key, val);
      });
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const res = await cardholderService.create(formData);
      showToast(`Cardholder ${newCard.full_name} enrolled successfully!`, "success");
      setAddModalOpen(false);

      // Reset form
      setNewCard({
        full_name: "",
        mobile: "",
        alternate_mobile: "",
        email: "",
        dob: "1995-05-15",
        gender: "male",
        district: "West Tripura",
        district_id: 1,
        pin_code: "799001",
        address: "",
        id_proof_type: "Aadhaar Card",
        id_proof_reference: "",
        payment_mode: "Digital (UPI)",
        registered_by_agent_id: 5,
        distributor_id: 6,
        consent_checkbox: 1,
        privacy_policy_version: "v1.0"
      });
      setPhotoFile(null);
      setPhotoPreview(null);
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to create cardholder.", "error");
    } finally {
      setAddLoading(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (card) => {
    setEditingCard({
      id: card.id,
      full_name: card.full_name || "",
      mobile: card.mobile || "",
      alternate_mobile: card.alternate_mobile || "",
      email: card.email || "",
      dob: card.dob || "1992-05-14",
      gender: card.gender || "male",
      district: card.district || "West Tripura",
      district_id: card.district_id || 1,
      pin_code: card.pin_code || "799001",
      address: card.address || "",
      id_proof_type: card.id_proof_type || "Aadhaar Card",
      id_proof_reference: card.id_proof_reference || "",
      status: (card.status || "active").toLowerCase(),
      card_status: (card.card_status || card.status || "active").toLowerCase(),
      issue_date: card.issue_date || new Date().toISOString().split("T")[0],
      expiry_date: card.expiry_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    });
    setEditModalOpen(true);
  };

  // Submit Edit
  const handleUpdateCard = async (e) => {
    e.preventDefault();
    if (!editingCard || !validateCardholderForm(editingCard)) return;

    setEditLoading(true);
    try {
      const res = await cardholderService.update(editingCard);
      showToast(`Cardholder ${editingCard.full_name} updated successfully!`, "success");
      setEditModalOpen(false);
      setEditingCard(null);
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to update cardholder.", "error");
    } finally {
      setEditLoading(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!cardholderToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await cardholderService.delete(cardholderToDelete.id || cardholderToDelete.unique_id);
      showToast(`Cardholder ${cardholderToDelete.full_name} deleted.`, "info");
      setDeleteModalOpen(false);
      setCardholderToDelete(null);
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to delete cardholder.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Quick Renew
  const handleRenew = async (uniqueId) => {
    try {
      const res = await cardholderService.renew(uniqueId);
      if (res) {
        showToast(`Card ${uniqueId} renewed for 1 additional year!`, "success");
        loadData();
      }
    } catch (err) {
      showToast("Renewal failed. Please try again.", "error");
    }
  };

  const filteredData = useMemo(() => {
    return cardholders.filter((c) => {
      const matchDistrict = selectedDistrict === "All" || c.district === selectedDistrict;
      return matchDistrict;
    });
  }, [cardholders, selectedDistrict]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const columns = [
    {
      header: "Card ID & Member",
      key: "unique_id",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-600 flex items-center justify-center font-mono font-bold text-xs border border-orange-200 overflow-hidden shrink-0 shadow-sm">
            {row.photo ? (
              <img
                src={row.photo}
                alt={row.full_name}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerText = (row.full_name || "HM").slice(0, 2).toUpperCase();
                  }
                }}
              />
            ) : (
              (row.full_name || "HM").slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <Link
              to={`/admin/cardholders/${row.unique_id}`}
              className="font-bold text-navy-900 hover:text-brand-600 transition block text-sm leading-snug"
            >
              {row.full_name}
            </Link>
            <span className="font-mono text-[11px] text-brand-600 font-semibold">{row.unique_id}</span>
          </div>
        </div>
      )
    },
    {
      header: "Contact & District",
      key: "district",
      render: (row) => (
        <div>
          <p className="text-xs font-semibold text-slate-800">{row.district}</p>
          <p className="text-[11px] text-slate-500 font-mono">{row.mobile}</p>
        </div>
      )
    },
    {
      header: "Validity Period",
      key: "expiry_date",
      render: (row) => (
        <div className="text-xs">
          <p className="text-slate-800 font-medium">Until: {row.expiry_date}</p>
          <p className="text-[10px] text-slate-400">Issued: {row.issue_date}</p>
        </div>
      )
    },
    {
      header: "Status",
      key: "status",
      render: (row) => {
        const variants = {
          Active: "success",
          "Expiring Soon": "warning",
          Expired: "danger",
          Renewed: "purple",
          Pending: "info",
          Blocked: "danger",
          Inactive: "default"
        };
        return <Badge variant={variants[row.status] || "default"}>{row.status}</Badge>;
      }
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setSelectedCardForQr(row)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition"
            title="View Digital QR Card"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleRenew(row.unique_id)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition"
            title="Renew 1 Year"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Edit Cardholder"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setCardholderToDelete(row);
              setDeleteModalOpen(true);
            }}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete Cardholder"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <Link
            to={`/admin/cardholders/${row.unique_id}`}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-navy-900 hover:bg-slate-50 transition"
            title="View Full Profile"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Cardholder Roster</h2>
          <p className="text-xs text-slate-500">
            Total {cardholders.length} registered cardholders across Tripura
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setAddModalOpen(true)} icon={Plus}>
            + Add Cardholder
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, Card ID, or mobile..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
            <option value="Renewed">Renewals</option>
            <option value="Blocked">Blocked</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          >
            <option value="All">All Districts</option>
            {initialDistricts.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginatedData}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredData.length}
        onPageChange={setCurrentPage}
      />

      {/* 1. Add Cardholder Modal (POST /admin/cardholders/add) */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register New Cardholder (Admin Enrollment)"
        subtitle="POST /api/admin/cardholders/add • Enrolls member with full KYC"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateCard} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Full Name *"
              placeholder="e.g. Rahul Sen"
              value={newCard.full_name}
              onChange={(e) => setNewCard({ ...newCard, full_name: e.target.value })}
              required
            />
            <Input
              label="Primary Mobile (10-digit) *"
              placeholder="e.g. 9876543210"
              maxLength={10}
              value={newCard.mobile}
              onChange={(e) => setNewCard({ ...newCard, mobile: e.target.value.replace(/\D/g, "") })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Input
              label="Alternate Mobile"
              placeholder="Optional secondary mobile"
              maxLength={10}
              value={newCard.alternate_mobile}
              onChange={(e) =>
                setNewCard({ ...newCard, alternate_mobile: e.target.value.replace(/\D/g, "") })
              }
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="cardholder@gmail.com"
              value={newCard.email}
              onChange={(e) => setNewCard({ ...newCard, email: e.target.value })}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={newCard.dob}
              onChange={(e) => setNewCard({ ...newCard, dob: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Select
              label="Gender"
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" }
              ]}
              value={newCard.gender}
              onChange={(e) => setNewCard({ ...newCard, gender: e.target.value })}
            />
            <Select
              label="District *"
              options={initialDistricts.map((d) => ({ label: d.name, value: d.name }))}
              value={newCard.district}
              onChange={(e) => setNewCard({ ...newCard, district: e.target.value })}
            />
            <Input
              label="PIN Code (6-digit) *"
              placeholder="e.g. 799001"
              maxLength={6}
              value={newCard.pin_code}
              onChange={(e) => setNewCard({ ...newCard, pin_code: e.target.value.replace(/\D/g, "") })}
              required
            />
          </div>

          <Input
            label="Complete Residential Address *"
            placeholder="e.g. House No 12, Hospital Road, Agartala"
            value={newCard.address}
            onChange={(e) => setNewCard({ ...newCard, address: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Select
              label="ID Proof Type"
              options={[
                { label: "Voter ID", value: "Voter ID" },
                { label: "Aadhaar Card", value: "Aadhaar Card" },
                { label: "Ration Card", value: "Ration Card" },
                { label: "Driving License", value: "Driving License" }
              ]}
              value={newCard.id_proof_type}
              onChange={(e) => setNewCard({ ...newCard, id_proof_type: e.target.value })}
            />
            <Input
              label="ID Proof Reference / Number"
              placeholder="e.g. 125412541254"
              value={newCard.id_proof_reference}
              onChange={(e) => setNewCard({ ...newCard, id_proof_reference: e.target.value })}
            />
          </div>

          {/* Photo File Upload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-navy-900">Cardholder Photo</label>
            <div className="flex items-center gap-4 p-3 border border-slate-200 rounded-2xl bg-slate-50/50">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover border" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-400 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG or WEBP up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-orange-50 rounded-xl text-xs text-brand-900 border border-orange-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span>DPDPA 2023 consent checkbox (1) is auto-recorded with security timestamp.</span>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={addLoading} className="shadow-orange-glow">
              Confirm & Generate Card (₹49)
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Edit Cardholder Modal (POST /admin/cardholders/edit) */}
      {editingCard && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit Member: ${editingCard.full_name}`}
          subtitle="POST /api/admin/cardholders/edit • Updates member details in real-time"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleUpdateCard} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Full Name *"
                value={editingCard.full_name}
                onChange={(e) => setEditingCard({ ...editingCard, full_name: e.target.value })}
                required
              />
              <Input
                label="Mobile Number *"
                maxLength={10}
                value={editingCard.mobile}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, mobile: e.target.value.replace(/\D/g, "") })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <Input
                label="Alternate Mobile"
                maxLength={10}
                value={editingCard.alternate_mobile}
                onChange={(e) =>
                  setEditingCard({
                    ...editingCard,
                    alternate_mobile: e.target.value.replace(/\D/g, "")
                  })
                }
              />
              <Input
                label="Email Address"
                type="email"
                value={editingCard.email}
                onChange={(e) => setEditingCard({ ...editingCard, email: e.target.value })}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={editingCard.dob}
                onChange={(e) => setEditingCard({ ...editingCard, dob: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <Select
                label="Gender"
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" }
                ]}
                value={editingCard.gender}
                onChange={(e) => setEditingCard({ ...editingCard, gender: e.target.value })}
              />
              <Select
                label="District"
                options={districts.map((d) => ({ label: d.name, value: d.name }))}
                value={editingCard.district}
                onChange={(e) => setEditingCard({ ...editingCard, district: e.target.value })}
              />
              <Input
                label="PIN Code"
                maxLength={6}
                value={editingCard.pin_code}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, pin_code: e.target.value.replace(/\D/g, "") })
                }
              />
            </div>

            <Input
              label="Complete Address"
              value={editingCard.address}
              onChange={(e) => setEditingCard({ ...editingCard, address: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <Select
                label="ID Proof Type"
                options={[
                  { label: "Aadhaar Card", value: "Aadhaar Card" },
                  { label: "Voter ID", value: "Voter ID" },
                  { label: "Ration Card", value: "Ration Card" }
                ]}
                value={editingCard.id_proof_type}
                onChange={(e) => setEditingCard({ ...editingCard, id_proof_type: e.target.value })}
              />
              <Input
                label="ID Proof Reference"
                value={editingCard.id_proof_reference}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, id_proof_reference: e.target.value })
                }
              />
              <Select
                label="Status"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                  { label: "Blocked", value: "blocked" },
                  { label: "Expired", value: "expired" }
                ]}
                value={editingCard.status}
                onChange={(e) => setEditingCard({ ...editingCard, status: e.target.value })}
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={editLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 3. Delete Confirmation Modal (POST /admin/cardholders/delete) */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Cardholder Record"
        subtitle="POST /api/admin/cardholders/delete"
      >
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 space-y-1">
              <p className="font-bold">Are you sure you want to permanently delete this cardholder?</p>
              <p>
                Cardholder: <strong>{cardholderToDelete?.full_name}</strong> (ID: {cardholderToDelete?.unique_id})
              </p>
              <p className="text-rose-700">This action cannot be undone.</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deleteLoading}
              onClick={handleConfirmDelete}
            >
              Delete Cardholder
            </Button>
          </div>
        </div>
      </Modal>

      {/* 4. QR Code & Printable Card Modal */}
      {selectedCardForQr && (
        <Modal
          isOpen={!!selectedCardForQr}
          onClose={() => {
            setSelectedCardForQr(null);
            setPrintModalOpen(false);
          }}
          title={`Digital Pass: ${selectedCardForQr.full_name}`}
          subtitle={`Unique ID: ${selectedCardForQr.unique_id}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {!printModalOpen ? (
              <div className="flex flex-col items-center space-y-6 py-2">
                <HealthMitraCard
                  cardholderName={selectedCardForQr.full_name}
                  uniqueId={selectedCardForQr.unique_id}
                  publicToken={selectedCardForQr.public_token}
                  validUntil={selectedCardForQr.expiry_date}
                  status={selectedCardForQr.status}
                />

                <div className="flex items-center gap-3 w-full justify-center">
                  <Button variant="outline" icon={Printer} onClick={() => setPrintModalOpen(true)}>
                    Open Printable Slip View
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      showToast("Digital pass shared to cardholder's WhatsApp!", "success");
                      setSelectedCardForQr(null);
                    }}
                  >
                    Share via WhatsApp
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <PrintableCard
                  cardholderName={selectedCardForQr.full_name}
                  uniqueId={selectedCardForQr.unique_id}
                  publicToken={selectedCardForQr.public_token}
                  validUntil={selectedCardForQr.expiry_date}
                  status={selectedCardForQr.status}
                  district={selectedCardForQr.district}
                  issueDate={selectedCardForQr.issue_date}
                />
                <div className="flex justify-between items-center pt-2">
                  <Button variant="outline" size="sm" onClick={() => setPrintModalOpen(false)}>
                    Back to Digital Card
                  </Button>
                  <Button size="sm" icon={Printer} onClick={() => window.print()}>
                    Print Document
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
