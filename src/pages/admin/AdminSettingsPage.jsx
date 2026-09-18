import React, { useState, useEffect } from "react";
import {
  Settings,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Bell,
  Lock,
  Save,
  CheckCircle2,
  Users,
  Percent,
  IndianRupee,
  KeyRound,
  Plus,
  Trash2,
  Sliders
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { useNotifications } from "../../context/NotificationContext";
import { settingsService } from "../../services/settingsService";

export function AdminSettingsPage() {
  const { showToast } = useNotifications();
  const [activeGroup, setActiveGroup] = useState("general");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Grouped Settings State
  const [settings, setSettings] = useState({
    // General
    site_title: "Health Mitra — Tripura Healthcare Pass",
    support_phone: "+91 88888 88888",
    support_email: "support@healthmitra.com",
    headquarters: "Agartala, Tripura",

    // Card & Membership
    card_price: "49",
    card_validity_days: "365",
    delivery_commitment_days: "15",
    card_renewal_grace_days: "30",

    // Discount Caps
    max_discount_pharmacy: "15",
    max_discount_diagnostic: "20",
    max_discount_hospital: "20",
    max_discount_dental: "20",

    // SMS & WhatsApp
    sms_gateway_provider: "Fast2SMS (Active)",
    sms_sender_id: "HLTMTR",
    whatsapp_api_status: "Meta Cloud API (Connected)",
    whatsapp_phone_number: "+91 88888 88888",
    expiry_sms_template:
      "Dear {name}, your Health Mitra card {card_id} expires in 30 days on {expiry_date}. Renew today for ₹49 to keep saving up to 20% on medicines & tests: https://cupan.getfreedeal.com/renew/{token}",

    // Commission & Operations
    agent_daily_target: "10",
    agent_commission_per_card: "10",
    distributor_commission_per_card: "5",
    payout_schedule: "Weekly (Every Friday)",

    // Security & DPDP Policy
    dpdpa_policy_version: "v1.2 (Aug 2026)",
    data_retention_months: "24",
    public_qr_masking: "Enabled",
    admin_2fa_enforced: "Enabled"
  });

  // Custom Keys
  const [customKeys, setCustomKeys] = useState([]);
  const [customKeyModalOpen, setCustomKeyModalOpen] = useState(false);
  const [newKeyForm, setNewKeyForm] = useState({ key: "", value: "", description: "" });

  const loadSettingsData = async () => {
    setLoading(true);
    try {
      const [flatData, groupData] = await Promise.all([
        settingsService.getFlatSettings(),
        settingsService.getByGroup(activeGroup)
      ]);
      if (flatData) {
        setSettings((prev) => ({ ...prev, ...flatData }));
      }
      if (groupData && typeof groupData === "object") {
        setSettings((prev) => ({ ...prev, ...groupData }));
      }
    } catch (err) {
      console.warn("Settings fetch notice", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettingsData();
  }, [activeGroup]);

  const handleSaveGroup = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await settingsService.saveSettings(settings, activeGroup);
      showToast(res.message || `Settings for ${activeGroup} updated successfully!`, "success");
    } catch (err) {
      showToast(err.message || "Failed to update settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCustomKey = async (e) => {
    e.preventDefault();
    if (!newKeyForm.key.trim() || !newKeyForm.value.trim()) {
      showToast("Key name and value are required.", "error");
      return;
    }
    setSaving(true);
    try {
      await settingsService.addCustomKey(newKeyForm);
      showToast(`Custom key '${newKeyForm.key}' added successfully!`, "success");
      setCustomKeys((prev) => [...prev, { ...newKeyForm }]);
      setCustomKeyModalOpen(false);
      setNewKeyForm({ key: "", value: "", description: "" });
    } catch (err) {
      showToast(err.message || "Failed to add custom key.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCustomKey = async (key) => {
    try {
      await settingsService.deleteCustomKey(key);
      showToast(`Key '${key}' deleted.`, "info");
      setCustomKeys((prev) => prev.filter((k) => k.key !== key));
    } catch (err) {
      showToast(err.message || "Failed to delete key.", "error");
    }
  };

  const groups = [
    { id: "general", label: "General Settings", icon: Settings, desc: "Site metadata & contact" },
    { id: "card", label: "Card & Membership", icon: CreditCard, desc: "₹49 pricing & validity" },
    { id: "discount", label: "Discount Caps", icon: Percent, desc: "Pharmacy & test caps" },
    { id: "sms_whatsapp", label: "SMS & WhatsApp", icon: MessageSquare, desc: "Gateway templates" },
    { id: "commission", label: "Commission & Ops", icon: IndianRupee, desc: "Agent target & payouts" },
    { id: "security", label: "Security & DPDP Policy", icon: ShieldCheck, desc: "Statutory privacy rules" },
    { id: "custom", label: "Custom Key-Values", icon: Sliders, desc: "Flat parameter map" }
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Platform Settings & Configurations</h2>
        <p className="text-xs text-slate-500">
          Official API endpoints: /api/admin/settings/settings?group=general, card, discount, sms_whatsapp, commission, security
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {groups.map((g) => {
          const Icon = g.icon;
          const isSelected = activeGroup === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setActiveGroup(g.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition ${
                isSelected
                  ? "bg-brand-500 text-white font-bold shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{g.label}</span>
            </button>
          );
        })}
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        {/* 1. General Settings */}
        {activeGroup === "general" && (
          <form onSubmit={handleSaveGroup} className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-navy-900">General Platform Information</h3>
              <code className="text-[11px] font-mono text-brand-600 bg-orange-50 px-2 py-0.5 rounded">group=general</code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Platform Brand Title *"
                value={settings.site_title}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                required
              />
              <Input
                label="Headquarters Location"
                value={settings.headquarters}
                onChange={(e) => setSettings({ ...settings, headquarters: e.target.value })}
                required
              />
              <Input
                label="Toll-Free Helpline / Support Phone"
                value={settings.support_phone}
                onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                required
              />
              <Input
                label="Official Support Email Address"
                type="email"
                value={settings.support_email}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" loading={saving} icon={Save}>
                Save General Settings
              </Button>
            </div>
          </form>
        )}

        {/* 2. Card & Membership Settings */}
        {activeGroup === "card" && (
          <form onSubmit={handleSaveGroup} className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-navy-900">Card & Membership Commercials</h3>
              <code className="text-[11px] font-mono text-brand-600 bg-orange-50 px-2 py-0.5 rounded">group=card</code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Card Membership Fee (INR) *"
                value={settings.card_price || settings.cardPrice || "49"}
                onChange={(e) => setSettings({ ...settings, card_price: e.target.value, cardPrice: e.target.value })}
                helperText="Official base pricing: ₹49/year"
                required
              />
              <Input
                label="Card Validity (Days) *"
                value={settings.card_validity_days || settings.cardValidityDays || "365"}
                onChange={(e) => setSettings({ ...settings, card_validity_days: e.target.value, cardValidityDays: e.target.value })}
                helperText="365 days (1 year)"
                required
              />
              <Input
                label="Physical Card Delivery Commitment (Days)"
                value={settings.delivery_commitment_days || settings.deliveryCommitmentDays || "15"}
                onChange={(e) => setSettings({ ...settings, delivery_commitment_days: e.target.value, deliveryCommitmentDays: e.target.value })}
                helperText="Doorstep delivery within 15 days"
                required
              />
              <Input
                label="Renewal Grace Period (Days)"
                value={settings.card_renewal_grace_days || "30"}
                onChange={(e) => setSettings({ ...settings, card_renewal_grace_days: e.target.value })}
                helperText="Grace days before card lock"
                required
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" loading={saving} icon={Save}>
                Save Card Settings
              </Button>
            </div>
          </form>
        )}

        {/* 3. Discount Caps Settings */}
        {activeGroup === "discount" && (
          <form onSubmit={handleSaveGroup} className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-navy-900">Partner Category Discount Ceilings</h3>
              <code className="text-[11px] font-mono text-brand-600 bg-orange-50 px-2 py-0.5 rounded">group=discount</code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Pharmacy Medicine Max Discount (%) *"
                value={settings.max_discount_pharmacy || "15"}
                onChange={(e) => setSettings({ ...settings, max_discount_pharmacy: e.target.value })}
                helperText="Standard ceiling: 10-15%"
                required
              />
              <Input
                label="Diagnostic Pathology & Lab Tests Max Discount (%) *"
                value={settings.max_discount_diagnostic || "20"}
                onChange={(e) => setSettings({ ...settings, max_discount_diagnostic: e.target.value })}
                helperText="Standard ceiling: Up to 20%"
                required
              />
              <Input
                label="Hospital Consultation & IPD Discount (%) *"
                value={settings.max_discount_hospital || "20"}
                onChange={(e) => setSettings({ ...settings, max_discount_hospital: e.target.value })}
                helperText="Standard ceiling: Up to 20%"
                required
              />
              <Input
                label="Dental & Eye Clinic Discount (%) *"
                value={settings.max_discount_dental || "20"}
                onChange={(e) => setSettings({ ...settings, max_discount_dental: e.target.value })}
                helperText="Standard ceiling: Up to 20%"
                required
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" loading={saving} icon={Save}>
                Save Discount Caps
              </Button>
            </div>
          </form>
        )}

        {/* 4. SMS & WhatsApp Gateway */}
        {activeGroup === "sms_whatsapp" && (
          <form onSubmit={handleSaveGroup} className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-navy-900">SMS & WhatsApp Gateway Configuration</h3>
              <code className="text-[11px] font-mono text-brand-600 bg-orange-50 px-2 py-0.5 rounded">group=sms_whatsapp</code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="SMS Gateway Provider"
                value={settings.sms_gateway_provider || settings.smsGatewayProvider || "Fast2SMS (Active)"}
                onChange={(e) => setSettings({ ...settings, sms_gateway_provider: e.target.value })}
              />
              <Input
                label="WhatsApp Business API"
                value={settings.whatsapp_api_status || settings.whatsAppApiStatus || "Meta Cloud API (Connected)"}
                onChange={(e) => setSettings({ ...settings, whatsapp_api_status: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">30-Day Expiry SMS / WhatsApp Notification Template</label>
              <textarea
                rows={3}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={settings.expiry_sms_template || settings.expirySmsTemplate || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    expiry_sms_template: e.target.value,
                    expirySmsTemplate: e.target.value
                  })
                }
              />
              <p className="text-[10px] text-slate-400">Supported variables: {"{name}"}, {"{card_id}"}, {"{expiry_date}"}, {"{token}"}</p>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" loading={saving} icon={Save}>
                Save Gateway Templates
              </Button>
            </div>
          </form>
        )}

        {/* 5. Commission & Operations */}
        {activeGroup === "commission" && (
          <form onSubmit={handleSaveGroup} className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-navy-900">Agent Commission & Field Operations</h3>
              <code className="text-[11px] font-mono text-brand-600 bg-orange-50 px-2 py-0.5 rounded">group=commission</code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Field Agent Daily Target (Cards)"
                value={settings.agent_daily_target || settings.agentDailyTarget || "10"}
                onChange={(e) => setSettings({ ...settings, agent_daily_target: e.target.value, agentDailyTarget: e.target.value })}
                helperText="Daily benchmark: 10 registrations"
                required
              />
              <Input
                label="Agent Commission per Valid Card (INR)"
                value={settings.agent_commission_per_card || "10"}
                onChange={(e) => setSettings({ ...settings, agent_commission_per_card: e.target.value })}
                helperText="Direct payout: ₹10 / card"
                required
              />
              <Input
                label="Distributor Referral Commission (INR)"
                value={settings.distributor_commission_per_card || "5"}
                onChange={(e) => setSettings({ ...settings, distributor_commission_per_card: e.target.value })}
                helperText="District Distributor override: ₹5 / card"
                required
              />
              <Input
                label="Automated Payout Cycle"
                value={settings.payout_schedule || "Weekly (Every Friday)"}
                onChange={(e) => setSettings({ ...settings, payout_schedule: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" loading={saving} icon={Save}>
                Save Commission Rules
              </Button>
            </div>
          </form>
        )}

        {/* 6. Security & DPDP Policy */}
        {activeGroup === "security" && (
          <form onSubmit={handleSaveGroup} className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-navy-900">Security & DPDPA 2023 Statutory Compliance</h3>
              <code className="text-[11px] font-mono text-brand-600 bg-orange-50 px-2 py-0.5 rounded">group=security</code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Active DPDPA Policy Version"
                value={settings.dpdpa_policy_version || settings.dpdpaVersion || "v1.2 (Aug 2026)"}
                onChange={(e) => setSettings({ ...settings, dpdpa_policy_version: e.target.value, dpdpaVersion: e.target.value })}
                required
              />
              <Input
                label="Audit Log Retention Period (Months)"
                value={settings.data_retention_months || settings.auditRetentionMonths || "24"}
                onChange={(e) => setSettings({ ...settings, data_retention_months: e.target.value, auditRetentionMonths: e.target.value })}
                helperText="Statutory minimum: 24 months"
                required
              />
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Digital Personal Data Protection Act (DPDPA 2023) Compliant
              </p>
              <p className="leading-relaxed">
                Public QR lookups are strictly locked to non-sensitive demographic passes (Name, Card ID, Status, Expiry). Full Aadhaar and medical history are never exposed to public QR scanners.
              </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" loading={saving} icon={Save}>
                Save Security Settings
              </Button>
            </div>
          </form>
        )}

        {/* 7. Custom Key-Values Map */}
        {activeGroup === "custom" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-bold text-sm text-navy-900">Custom Key-Value Parameter Map</h3>
                <p className="text-xs text-slate-500">GET /settings?flat=1 • Add or override dynamic system parameters</p>
              </div>
              <Button size="sm" onClick={() => setCustomKeyModalOpen(true)} icon={Plus}>
                + Add Custom Key
              </Button>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {Object.entries(settings).map(([k, v]) => (
                <div key={k} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50/50">
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-brand-700">{k}</span>
                    <p className="text-slate-600">{typeof v === "object" ? JSON.stringify(v) : String(v)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">System Key</Badge>
                  </div>
                </div>
              ))}
              {customKeys.map((item) => (
                <div key={item.key} className="p-3.5 flex items-center justify-between text-xs bg-orange-50/30">
                  <div>
                    <span className="font-mono font-bold text-purple-700">{item.key}</span>
                    <p className="text-slate-700 font-medium">{item.value}</p>
                    {item.description && <p className="text-[10px] text-slate-400">{item.description}</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteCustomKey(item.key)}
                    className="p-1 text-rose-500 hover:text-rose-700"
                    title="Delete custom key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Add Custom Key Modal */}
      <Modal
        isOpen={customKeyModalOpen}
        onClose={() => setCustomKeyModalOpen(false)}
        title="Add Custom Settings Key"
        subtitle="POST /api/admin/settings/settings (action: 'add_custom_key')"
      >
        <form onSubmit={handleAddCustomKey} className="space-y-4 text-xs">
          <Input
            label="Key Identifier (e.g. max_referrals_per_user) *"
            value={newKeyForm.key}
            onChange={(e) => setNewKeyForm({ ...newKeyForm, key: e.target.value })}
            placeholder="custom_config_key"
            required
          />
          <Input
            label="Parameter Value *"
            value={newKeyForm.value}
            onChange={(e) => setNewKeyForm({ ...newKeyForm, value: e.target.value })}
            placeholder="Value or string"
            required
          />
          <Input
            label="Description"
            value={newKeyForm.description}
            onChange={(e) => setNewKeyForm({ ...newKeyForm, description: e.target.value })}
            placeholder="Operational notes about this key"
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setCustomKeyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save Custom Key
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
