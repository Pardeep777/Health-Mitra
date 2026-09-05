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
  Phone
} from "lucide-react";
import { partnerService } from "../../services/partnerService";
import { initialDistricts } from "../../data/districts";
import { DataTable } from "../../components/common/DataTable";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { StatCard } from "../../components/common/StatCard";
import { Modal } from "../../components/common/Modal";
import { useNotifications } from "../../context/NotificationContext";

export function AdminPartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [viewMode, setViewMode] = useState("list"); // list or kanban
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const { showToast } = useNotifications();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await partnerService.getAll();
      setPartners(data);
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
          <p className="text-xs text-slate-500">126 partner pharmacies, pathology labs, and clinical centers</p>
        </div>
        <div className="flex items-center gap-2">
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
        <StatCard title="Total Partners" value="126" subtitle="Across 8 districts" variant="brand" />
        <StatCard title="Pending Approvals" value="18" subtitle="Requires document review" variant="amber" />
        <StatCard title="Active Network" value="102" subtitle="Live for cardholders" variant="emerald" />
        <StatCard title="Inactive / Paused" value="6" subtitle="Suspended outlets" variant="default" />
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
            <option value="Pharmacy">Pharmacy</option>
            <option value="Pathology Lab">Pathology Lab</option>
            <option value="Nursing Home">Nursing Home</option>
            <option value="Hospital">Hospital</option>
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
            {initialDistricts.map((d) => (
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
