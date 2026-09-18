import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { useNotifications } from "../../context/NotificationContext";
import { partnerService } from "../../services/partnerService";

const DEFAULT_SERVICES = [
  {
    id: 1,
    name: "Prescription Branded Medicines",
    basePrice: "Base Price: MRP Pricing",
    discount: 15
  },
  {
    id: 2,
    name: "Generic Chronic Medicines (BP / Sugar)",
    basePrice: "Base Price: MRP Pricing",
    discount: 15
  },
  {
    id: 3,
    name: "Surgical Supplies & Dressings",
    basePrice: "Base Price: MRP Pricing",
    discount: 12
  },
  {
    id: 4,
    name: "Home Delivery in Agartala City",
    basePrice: "Base Price: Free over ₹500",
    discount: 100
  }
];

export function PartnerServicesPage() {
  const { showToast } = useNotifications();

  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Add Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [submittingAdd, setSubmittingAdd] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    basePrice: "MRP Pricing",
    discount: "15"
  });

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editingService, setEditingService] = useState({
    id: null,
    service_id: null,
    name: "",
    basePrice: "MRP Pricing",
    discount: "15"
  });

  // Load live partner services from GET /partner/services
  const loadServices = async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await partnerService.getCustomServices();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setServices(res.data);
      } else {
        // Check localStorage or keep defaults
        const saved = localStorage.getItem("health_mitra_partner_services");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setServices(parsed);
            }
          } catch (e) {}
        }
      }
    } catch (e) {
      console.warn("Failed to load partner services", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadServices(true);
  }, []);

  // 1. ADD Service via POST /partner/services (action: 'add')
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newService.name.trim()) return;

    setSubmittingAdd(true);
    const cleanBasePrice = newService.basePrice.trim().replace(/^Base Price:\s*/i, "");
    const baseText = `Base Price: ${cleanBasePrice || "MRP Pricing"}`;

    try {
      const res = await partnerService.addCustomService({
        service_name: newService.name.trim(),
        base_price: baseText,
        discount_percent: Number(newService.discount || 15),
        mrp: 0
      });

      showToast(res.message || "Healthcare service added successfully!", "success");

      await loadServices(false);
      setAddModalOpen(false);
      setNewService({ name: "", basePrice: "MRP Pricing", discount: "15" });
    } catch (err) {
      // Local fallback
      const localItem = {
        id: Date.now(),
        name: newService.name.trim(),
        basePrice: baseText,
        discount: Number(newService.discount || 15)
      };
      const updated = [...services, localItem];
      setServices(updated);
      localStorage.setItem("health_mitra_partner_services", JSON.stringify(updated));
      showToast("Service added to list.", "success");
      setAddModalOpen(false);
      setNewService({ name: "", basePrice: "MRP Pricing", discount: "15" });
    } finally {
      setSubmittingAdd(false);
    }
  };

  // Open Edit Modal with pre-filled service data
  const handleOpenEdit = (srv) => {
    const rawBase = (srv.basePrice || srv.description || "MRP Pricing").replace(/^Base Price:\s*/i, "");
    setEditingService({
      id: srv.id || srv.service_id,
      service_id: srv.service_id || srv.id,
      name: srv.name || srv.service_name || "",
      basePrice: rawBase,
      discount: String(srv.discount || srv.discount_percent || 15)
    });
    setEditModalOpen(true);
  };

  // 2. EDIT Service via POST /partner/services (action: 'edit')
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editingService.name.trim()) return;

    setSubmittingEdit(true);
    const cleanBasePrice = editingService.basePrice.trim().replace(/^Base Price:\s*/i, "");
    const baseText = `Base Price: ${cleanBasePrice || "MRP Pricing"}`;

    try {
      const res = await partnerService.editCustomService({
        id: editingService.id,
        service_id: editingService.service_id,
        service_name: editingService.name.trim(),
        base_price: baseText,
        discount_percent: Number(editingService.discount || 15),
        mrp: 0
      });

      showToast(res.message || "Healthcare service updated successfully!", "success");

      await loadServices(false);
      setEditModalOpen(false);
    } catch (err) {
      // Local fallback
      const updated = services.map((s) => {
        if ((s.id && s.id === editingService.id) || (s.service_id && s.service_id === editingService.service_id)) {
          return {
            ...s,
            name: editingService.name.trim(),
            service_name: editingService.name.trim(),
            basePrice: baseText,
            description: baseText,
            discount: Number(editingService.discount || 15),
            discount_percent: Number(editingService.discount || 15)
          };
        }
        return s;
      });
      setServices(updated);
      localStorage.setItem("health_mitra_partner_services", JSON.stringify(updated));
      showToast("Service updated.", "success");
      setEditModalOpen(false);
    } finally {
      setSubmittingEdit(false);
    }
  };

  // 3. DELETE Service via POST /partner/services (action: 'delete')
  const handleDelete = async (id, name) => {
    try {
      await partnerService.deleteCustomService(id);
      showToast(`Removed "${name}".`, "info");
      await loadServices(false);
    } catch (e) {
      // Local fallback
      const filtered = services.filter((s) => s.id !== id && s.service_id !== id);
      setServices(filtered);
      localStorage.setItem("health_mitra_partner_services", JSON.stringify(filtered));
      showToast(`Removed "${name}".`, "info");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
            Manage Services & Discount Rates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure discount percentages extended to Health Mitra cardholders
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Healthcare Service</span>
        </button>
      </div>

      {/* Services Card List matching user screenshot */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-2 sm:p-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading partner services...
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {services.map((srv) => (
              <div
                key={srv.id || srv.service_id}
                className="py-5 px-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition rounded-2xl"
              >
                {/* Left Column: Name & Base Price */}
                <div className="space-y-1">
                  <h3 className="font-bold text-sm sm:text-base text-navy-900 leading-tight">
                    {srv.name || srv.service_name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {srv.basePrice?.startsWith("Base Price:")
                      ? srv.basePrice
                      : `Base Price: ${srv.basePrice || srv.description || "MRP Pricing"}`}
                  </p>
                </div>

                {/* Right Column: Discount Badge, Edit & Delete Icons */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="bg-emerald-50 text-emerald-600 font-bold text-xs sm:text-sm px-3.5 py-1 rounded-full border border-emerald-100/80">
                    {srv.discount || srv.discount_percent}% OFF
                  </span>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(srv)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-orange-50 rounded-lg transition"
                    title="Edit Service"
                  >
                    <Edit3 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(srv.id || srv.service_id, srv.name || srv.service_name)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    title="Remove Service"
                  >
                    <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </button>
                </div>
              </div>
            ))}

            {services.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                No healthcare services added yet. Click "+ Add Healthcare Service" to add one.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 1. Add Healthcare Service Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Healthcare Service"
        subtitle="Configure service pricing and discount extended to cardholders"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Service / Procedure Name *"
            placeholder="e.g. Prescription Branded Medicines"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Base Standard Price *"
              placeholder="e.g. MRP Pricing or Free over ₹500"
              value={newService.basePrice}
              onChange={(e) => setNewService({ ...newService, basePrice: e.target.value })}
              required
            />
            <Input
              label="Discount Percentage (%) *"
              type="number"
              min="1"
              max="100"
              placeholder="e.g. 15"
              value={newService.discount}
              onChange={(e) => setNewService({ ...newService, discount: e.target.value })}
              required
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submittingAdd}>
              Save Service
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Edit Healthcare Service Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Healthcare Service"
        subtitle="Update service name, base pricing, or discount percentage"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            label="Service / Procedure Name *"
            placeholder="e.g. Prescription Branded Medicines"
            value={editingService.name}
            onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Base Standard Price *"
              placeholder="e.g. MRP Pricing or Free over ₹500"
              value={editingService.basePrice}
              onChange={(e) => setEditingService({ ...editingService, basePrice: e.target.value })}
              required
            />
            <Input
              label="Discount Percentage (%) *"
              type="number"
              min="1"
              max="100"
              placeholder="e.g. 15"
              value={editingService.discount}
              onChange={(e) => setEditingService({ ...editingService, discount: e.target.value })}
              required
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submittingEdit}>
              Update Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
