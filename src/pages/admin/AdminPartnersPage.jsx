import React, { useState, useEffect, useMemo } from "react";
import {
  Building2,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Kanban,
  List,
  Eye,
  Percent,
  MapPin,
  Phone,
  Layers,
  Settings2,
  Trash2
} from "lucide-react";
import { partnerService } from "../../services/partnerService";
import { districtService } from "../../services/districtService";
import { DataTable } from "../../components/common/DataTable";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { StatCard } from "../../components/common/StatCard";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { useNotifications } from "../../context/NotificationContext";

export function AdminPartnersPage() {
  const [partners, setPartners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [masterServices, setMasterServices] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [viewMode, setViewMode] = useState("list"); // list or kanban
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const { showToast } = useNotifications();

  // Modals
  const [addPartnerOpen, setAddPartnerOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Form states
  const [newPartner, setNewPartner] = useState({
    category_id: "1",
    business_name: "",
    owner_name: "",
    mobile: "",
    alternate_mobile: "",
    email: "",
    district_id: "1",
    area_id: "1",
    pin_code: "799001",
    address: "",
    max_discount_percent: "20",
    opening_hours: "09:00 AM - 09:00 PM",
    status: "active",
    agreement_status: "Verified & Signed",
    description: ""
  });

  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  const [newService, setNewService] = useState({
    category_id: "1",
    service_name: "",
    description: "",
    mrp: "",
    discount_percent: "20"
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [partnerData, catData, servicesData, districtData] = await Promise.all([
        partnerService.getAll(),
        partnerService.getCategories(),
        partnerService.getMasterServices(),
        districtService.getAll()
      ]);
      setPartners(partnerData);
      setCategories(catData);
      setMasterServices(servicesData);
      setDistricts(districtData);
    } catch (err) {
      showToast("Could not load partners data from server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, status, agreementStatus) => {
    await partnerService.updateStatus(id, status, agreementStatus);
    showToast(`Partner status updated to ${status}`, "success");
    loadData();
    if (selectedPartner) {
      setSelectedPartner((prev) => ({ ...prev, status, agreementStatus }));
    }
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    if (!newPartner.business_name.trim() || !newPartner.mobile.trim()) {
      showToast("Business name and Mobile number are required.", "error");
      return;
    }
    setModalLoading(true);
    try {
      const formData = new FormData();
      Object.entries(newPartner).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, v);
      });
      const res = await partnerService.create(formData);
      showToast(res.message || "Healthcare partner added successfully!", "success");
      setAddPartnerOpen(false);
      setNewPartner({
        category_id: "1",
        business_name: "",
        owner_name: "",
        mobile: "",
        alternate_mobile: "",
        email: "",
        district_id: "1",
        area_id: "1",
        pin_code: "799001",
        address: "",
        max_discount_percent: "20",
        opening_hours: "09:00 AM - 09:00 PM",
        status: "active",
        agreement_status: "Verified & Signed",
        description: ""
      });
      loadData();
    } catch (err) {
      showToast(err.message || "Failed to add partner.", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      showToast("Please enter a category name.", "error");
      return;
    }
    setModalLoading(true);
    try {
      const res = await partnerService.addCategory({ name: newCatName, description: newCatDesc });
      showToast(res.message || "Category created successfully!", "success");
      setNewCatName("");
      setNewCatDesc("");
      const updatedCats = await partnerService.getCategories();
      setCategories(updatedCats);
    } catch (err) {
      showToast(err.message || "Failed to add category.", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await partnerService.deleteCategory(id);
      showToast(res.message || "Category deleted.", "info");
      const updatedCats = await partnerService.getCategories();
      setCategories(updatedCats);
    } catch (err) {
      showToast(err.message || "Failed to delete category.", "error");
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.service_name.trim() || !newService.mrp) {
      showToast("Service name and MRP are required.", "error");
      return;
    }
    setModalLoading(true);
    try {
      const res = await partnerService.addMasterService(newService);
      showToast(res.message || "Master service created successfully!", "success");
      setNewService({
        category_id: "1",
        service_name: "",
        description: "",
        mrp: "",
        discount_percent: "20"
      });
      const updated = await partnerService.getMasterServices();
      setMasterServices(updated);
    } catch (err) {
      showToast(err.message || "Failed to create service.", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const res = await partnerService.deleteMasterService(id);
      showToast(res.message || "Service deleted.", "info");
      const updated = await partnerService.getMasterServices();
      setMasterServices(updated);
    } catch (err) {
      showToast(err.message || "Failed to delete service.", "error");
    }
  };

  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchDist = selectedDistrict === "All" || p.district === selectedDistrict;
      return matchSearch && matchCat && matchDist;
    });
  }, [partners, searchTerm, selectedCategory, selectedDistrict]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPartners.slice(start, start + pageSize);
  }, [filteredPartners, currentPage]);

  const columns = [
    {
      header: "Partner Name & Category",
      key: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} alt={row.name} className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <span className="font-bold text-navy-900 text-sm block">{row.name}</span>
            <span className="text-[11px] text-slate-500 font-semibold">{row.category} • {row.district}</span>
          </div>
        </div>
      )
    },
    {
      header: "Owner & Contact",
      key: "owner",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-slate-800">{row.owner}</p>
          <p className="text-slate-500">{row.phone}</p>
        </div>
      )
    },
    {
      header: "Discount Cap",
      key: "discountPercent",
      render: (row) => (
        <span className="text-xs font-bold text-brand-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
          Up to {row.discountPercent}%
        </span>
      )
    },
    {
      header: "Agreement",
      key: "agreementStatus",
      render: (row) => (
        <span className="text-xs text-slate-700 font-medium">{row.agreementStatus}</span>
      )
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <Badge variant={row.status === "Active" ? "success" : row.status === "Pending" ? "warning" : "default"}>
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
            onClick={() => setSelectedPartner(row)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition"
            title="Review Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === "Pending" ? (
            <button
              onClick={() => handleStatusChange(row.id, "Active", "Verified & Signed")}
              className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
            >
              Approve
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange(row.id, row.status === "Active" ? "Inactive" : "Active", row.agreementStatus)}
              className="p-1.5 text-xs text-slate-500 hover:text-slate-800"
            >
              {row.status === "Active" ? "Deactivate" : "Activate"}
            </button>
          )}
        </div>
      )
    }
  ];

  const kanbanColumns = [
    { title: "1. New Application", statusKey: "Pending", agreementKey: "Under Review", bg: "bg-blue-50 border-blue-200" },
    { title: "2. Document Verification", statusKey: "Pending", agreementKey: "Document Verification", bg: "bg-amber-50 border-amber-200" },
    { title: "3. Agreement Signing", statusKey: "Pending", agreementKey: "Agreement Pending", bg: "bg-purple-50 border-purple-200" },
    { title: "4. Active & Verified", statusKey: "Active", agreementKey: "Verified & Signed", bg: "bg-emerald-50 border-emerald-200" }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Healthcare Partner Outlets</h2>
          <p className="text-xs text-slate-500">
            Real-time API endpoints: /api/admin/partners/list.php, categories.php, services_master.php, add.php, edit.php
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setCategoryModalOpen(true)} icon={Layers}>
            Categories ({categories.length})
          </Button>
          <Button size="sm" variant="outline" onClick={() => setServicesModalOpen(true)} icon={Settings2}>
            Master Services ({masterServices.length})
          </Button>
          <Button size="sm" onClick={() => setAddPartnerOpen(true)} icon={Plus}>
            + Add Outlet
          </Button>
          <div className="bg-slate-200 p-1 rounded-xl flex items-center">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === "list" ? "bg-white text-navy-900 shadow-sm" : "text-slate-600"
              }`}
            >
              <List className="w-3.5 h-3.5" /> Table List
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === "kanban" ? "bg-white text-navy-900 shadow-sm" : "text-slate-600"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Onboarding Kanban
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Partners" value={partners.length || "126"} subtitle="Across 8 districts" variant="brand" />
        <StatCard title="Categories" value={categories.length || "6"} subtitle="Active Healthcare Types" variant="amber" />
        <StatCard title="Active Network" value={partners.filter((p) => p.status === "Active").length || "102"} subtitle="Live for cardholders" variant="emerald" />
        <StatCard title="Master Services" value={masterServices.length || "14"} subtitle="Standardized services" variant="default" />
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search partner, owner, or address..."
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
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
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

      {/* List View Table */}
      {viewMode === "list" && (
        <DataTable
          columns={columns}
          data={paginatedData}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredPartners.length}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Kanban Onboarding Pipeline View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {kanbanColumns.map((col, idx) => {
            const colPartners = partners.filter((p) => {
              if (idx === 3) return p.status === "Active";
              if (idx === 0) return p.status === "Pending" && (p.agreementStatus === "Under Review" || !p.agreementStatus);
              if (idx === 1) return p.status === "Pending" && p.agreementStatus === "Document Verification";
              if (idx === 2) return p.status === "Pending" && p.agreementStatus === "Agreement Pending";
              return false;
            });

            return (
              <div key={col.title} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="font-bold text-xs text-navy-900">{col.title}</h4>
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {colPartners.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colPartners.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPartner(p)}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold uppercase text-brand-600 bg-orange-50 px-2 py-0.5 rounded">
                          {p.category}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700">Up to {p.discountPercent}%</span>
                      </div>
                      <h5 className="font-bold text-xs text-navy-900 leading-snug">{p.name}</h5>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {p.district}
                      </p>
                    </div>
                  ))}

                  {colPartners.length === 0 && (
                    <div className="p-6 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      No partners in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 1. Add Partner Modal */}
      <Modal
        isOpen={addPartnerOpen}
        onClose={() => setAddPartnerOpen(false)}
        title="Add Healthcare Partner Outlet"
        subtitle="POST /api/admin/partners/add.php"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleAddPartner} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Business / Clinic Name *"
              placeholder="e.g. Apollo Pharmacy Agartala"
              value={newPartner.business_name}
              onChange={(e) => setNewPartner({ ...newPartner, business_name: e.target.value })}
              required
            />
            <Select
              label="Partner Category *"
              options={categories.map((c) => ({ label: c.name, value: c.id }))}
              value={newPartner.category_id}
              onChange={(e) => setNewPartner({ ...newPartner, category_id: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Owner / Contact Person Name *"
              placeholder="e.g. Dr. Subhash Debbarma"
              value={newPartner.owner_name}
              onChange={(e) => setNewPartner({ ...newPartner, owner_name: e.target.value })}
              required
            />
            <Input
              label="Primary Mobile Number *"
              placeholder="e.g. 9876543210"
              maxLength={10}
              value={newPartner.mobile}
              onChange={(e) => setNewPartner({ ...newPartner, mobile: e.target.value.replace(/\D/g, "") })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="District *"
              options={districts.map((d) => ({ label: d.name, value: d.id }))}
              value={newPartner.district_id}
              onChange={(e) => setNewPartner({ ...newPartner, district_id: e.target.value })}
            />
            <Input
              label="PIN Code *"
              maxLength={6}
              value={newPartner.pin_code}
              onChange={(e) => setNewPartner({ ...newPartner, pin_code: e.target.value.replace(/\D/g, "") })}
            />
            <Input
              label="Max Discount (%)"
              type="number"
              value={newPartner.max_discount_percent}
              onChange={(e) => setNewPartner({ ...newPartner, max_discount_percent: e.target.value })}
            />
          </div>

          <Input
            label="Complete Address *"
            placeholder="e.g. Shop No. 12, Akhaura Road, Agartala"
            value={newPartner.address}
            onChange={(e) => setNewPartner({ ...newPartner, address: e.target.value })}
            required
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setAddPartnerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={modalLoading}>
              Save & Register Outlet
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Manage Categories Modal */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Healthcare Partner Categories"
        subtitle="GET & POST /api/admin/partners/categories.php"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 text-xs">
          <form onSubmit={handleAddCategory} className="flex gap-2 items-end bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex-1 space-y-1">
              <label className="font-semibold text-slate-700">New Category Name *</label>
              <input
                type="text"
                placeholder="e.g. Dental Clinic"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs"
                required
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="font-semibold text-slate-700">Description</label>
              <input
                type="text"
                placeholder="e.g. Dental care clinics"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs"
              />
            </div>
            <Button size="sm" type="submit" loading={modalLoading}>
              Add
            </Button>
          </form>

          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto border border-slate-200 rounded-xl">
            {categories.map((c) => (
              <div key={c.id} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-navy-900">{c.name}</p>
                  <p className="text-[11px] text-slate-500">{c.description || "Active category"}</p>
                </div>
                <button
                  onClick={() => handleDeleteCategory(c.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setCategoryModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* 3. Manage Master Services Modal */}
      <Modal
        isOpen={servicesModalOpen}
        onClose={() => setServicesModalOpen(false)}
        title="Master Services & Standard Discounts"
        subtitle="GET & POST /api/admin/partners/services_master.php"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 text-xs">
          <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 items-end">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Category *</label>
              <select
                value={newService.category_id}
                onChange={(e) => setNewService({ ...newService, category_id: e.target.value })}
                className="w-full bg-white border border-slate-200 px-2 py-1.5 rounded-lg text-xs"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Service Name *</label>
              <input
                type="text"
                placeholder="e.g. HbA1c Blood Test"
                value={newService.service_name}
                onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
                className="w-full bg-white border border-slate-200 px-2 py-1.5 rounded-lg text-xs"
                required
              />
            </div>
            <div className="flex gap-2 items-end">
              <div className="space-y-1 w-16">
                <label className="font-semibold text-slate-700">MRP ₹</label>
                <input
                  type="number"
                  placeholder="500"
                  value={newService.mrp}
                  onChange={(e) => setNewService({ ...newService, mrp: e.target.value })}
                  className="w-full bg-white border border-slate-200 px-2 py-1.5 rounded-lg text-xs"
                  required
                />
              </div>
              <Button size="sm" type="submit" loading={modalLoading}>
                Add
              </Button>
            </div>
          </form>

          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto border border-slate-200 rounded-xl">
            {masterServices.map((s) => (
              <div key={s.id} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-navy-900">{s.service_name}</p>
                  <p className="text-[11px] text-slate-500">
                    Category ID: {s.category_id} • MRP: ₹{s.mrp} • Standard Discount: {s.discount_percent}%
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteService(s.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setServicesModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Partner Detail & Approval Modal */}
      {selectedPartner && (
        <Modal
          isOpen={!!selectedPartner}
          onClose={() => setSelectedPartner(null)}
          title={selectedPartner.name}
          subtitle={`${selectedPartner.category} • ${selectedPartner.district}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 uppercase font-bold">Owner / Contact</span>
                <p className="font-bold text-navy-900">{selectedPartner.owner}</p>
                <p className="text-slate-600">{selectedPartner.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold">Current Agreement</span>
                <p className="font-semibold text-slate-800">{selectedPartner.agreementStatus}</p>
                <Badge variant={selectedPartner.status === "Active" ? "success" : "warning"}>
                  {selectedPartner.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 uppercase font-bold">Address</span>
              <p className="text-slate-700 font-medium">{selectedPartner.address}, {selectedPartner.district} - {selectedPartner.pincode}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 uppercase font-bold">Services & Discounts Offered</span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl">
                {selectedPartner.services?.map((s, idx) => (
                  <div key={idx} className="p-2.5 flex justify-between">
                    <span>{s.name}</span>
                    <strong className="text-brand-600">{s.discount}% OFF</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedPartner(null)}>
                Close
              </Button>
              {selectedPartner.status === "Pending" ? (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleStatusChange(selectedPartner.id, "Active", "Verified & Signed")}
                >
                  Approve & Activate Outlet
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant={selectedPartner.status === "Active" ? "danger" : "primary"}
                  onClick={() =>
                    handleStatusChange(
                      selectedPartner.id,
                      selectedPartner.status === "Active" ? "Inactive" : "Active",
                      selectedPartner.agreementStatus
                    )
                  }
                >
                  {selectedPartner.status === "Active" ? "Suspend Outlet" : "Re-activate Outlet"}
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
