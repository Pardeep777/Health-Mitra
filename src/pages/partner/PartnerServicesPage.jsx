import React, { useState } from "react";
import { Plus, Percent, Trash2, Save, Sparkles, CheckCircle2 } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { useNotifications } from "../../context/NotificationContext";

export function PartnerServicesPage() {
  const { showToast } = useNotifications();

  const [services, setServices] = useState([
    { id: 1, name: "Prescription Branded Medicines", discount: 15, basePrice: "MRP Pricing" },
    { id: 2, name: "Generic Chronic Medicines (BP / Sugar)", discount: 15, basePrice: "MRP Pricing" },
    { id: 3, name: "Surgical Supplies & Dressings", discount: 12, basePrice: "MRP Pricing" },
    { id: 4, name: "Home Delivery in Agartala City", discount: 100, basePrice: "Free over ₹500" }
  ]);

  const [addModal, setAddModal] = useState(false);
  const [newService, setNewService] = useState({ name: "", discount: "15", basePrice: "As per MRP" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newService.name) return;
    setServices([
      ...services,
      {
        id: Date.now(),
        name: newService.name,
        discount: Number(newService.discount),
        basePrice: newService.basePrice
      }
    ]);
    setAddModal(false);
    setNewService({ name: "", discount: "15", basePrice: "As per MRP" });
    showToast("Healthcare service added to partner menu!", "success");
  };

  const handleDelete = (id) => {
    setServices(services.filter((s) => s.id !== id));
    showToast("Service removed.", "info");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Manage Services & Discount Rates</h2>
          <p className="text-xs text-slate-500">Configure discount percentages extended to Health Mitra cardholders</p>
        </div>
        <Button size="sm" onClick={() => setAddModal(true)} icon={Plus}>
          Add Healthcare Service
        </Button>
      </div>

      <Card className="divide-y divide-slate-100 p-0 overflow-hidden">
        {services.map((srv) => (
          <div key={srv.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-navy-900">{srv.name}</h4>
              <p className="text-xs text-slate-500">Base Price: {srv.basePrice}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-xl">
                {srv.discount}% OFF
              </span>
              <button
                onClick={() => handleDelete(srv.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </Card>

      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        title="Add Discounted Healthcare Service"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Service / Procedure Name"
            placeholder="e.g. Complete Lipid Profile"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Discount Percentage (%)"
              type="number"
              min="5"
              max="25"
              value={newService.discount}
              onChange={(e) => setNewService({ ...newService, discount: e.target.value })}
              required
            />
            <Input
              label="Base Standard Price"
              placeholder="e.g. ₹600 or MRP"
              value={newService.basePrice}
              onChange={(e) => setNewService({ ...newService, basePrice: e.target.value })}
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
