import React, { useState } from "react";
import {
  Settings,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Bell,
  Lock,
  Save,
  CheckCircle2,
  Users
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useNotifications } from "../../context/NotificationContext";

export function AdminSettingsPage() {
  const { showToast } = useNotifications();
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState({
    cardPrice: "49",
    maxDiscountPercent: "20",
    cardValidityDays: "365",
    deliveryCommitmentDays: "15",
    agentDailyTarget: "10",
    smsGatewayProvider: "Fast2SMS (Active)",
    whatsAppApiStatus: "Meta Cloud API Connected",
    dpdpaVersion: "v1.2",
    auditRetentionMonths: "24"
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast("Settings updated successfully!", "success");
  };

  const tabs = [
    { id: "general", label: "Card & Commercials", icon: CreditCard },
    { id: "messaging", label: "SMS & WhatsApp", icon: MessageSquare },
    { id: "privacy", label: "DPDPA & Privacy", icon: ShieldCheck },
    { id: "security", label: "Roles & Security", icon: Lock }
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Platform Settings</h2>
        <p className="text-xs text-slate-500">Configure global card prices, communication templates, and security controls</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                isSelected
                  ? "bg-brand-500 text-white font-bold shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        {activeTab === "general" && (
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-2">
              Official Commercial Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Card Membership Fee (INR)"
                value={settings.cardPrice}
                onChange={(e) => setSettings({ ...settings, cardPrice: e.target.value })}
                helperText="Official base price: ₹49/year"
                required
              />
              <Input
                label="Maximum Partner Discount (%)"
                value={settings.maxDiscountPercent}
                onChange={(e) => setSettings({ ...settings, maxDiscountPercent: e.target.value })}
                helperText="Official ceiling: 20%"
                required
              />
              <Input
                label="Card Validity (Days)"
                value={settings.cardValidityDays}
                onChange={(e) => setSettings({ ...settings, cardValidityDays: e.target.value })}
                helperText="365 days (1 year)"
                required
              />
              <Input
                label="Physical Card Delivery Commitment (Days)"
                value={settings.deliveryCommitmentDays}
                onChange={(e) => setSettings({ ...settings, deliveryCommitmentDays: e.target.value })}
                helperText="Doorstep delivery within 15 days"
                required
              />
              <Input
                label="Field Agent Daily Target (Cards)"
                value={settings.agentDailyTarget}
                onChange={(e) => setSettings({ ...settings, agentDailyTarget: e.target.value })}
                helperText="10 cards/day per field agent"
                required
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" icon={Save}>
                Save Commercial Settings
              </Button>
            </div>
          </form>
        )}

        {activeTab === "messaging" && (
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-2">
              SMS & WhatsApp Gateway Integration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="SMS Gateway Status"
                value={settings.smsGatewayProvider}
                disabled
              />
              <Input
                label="WhatsApp Business API"
                value={settings.whatsAppApiStatus}
                disabled
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">30-Day Expiry SMS Template</label>
              <textarea
                rows={2}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-3"
                defaultValue="Dear {name}, your Health Mitra card {card_id} expires in 30 days on {expiry_date}. Renew today for ₹49 to keep saving up to 20% on medicines & tests: https://healthmitra.demo/renew/{token}"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" icon={Save}>
                Save Messaging Templates
              </Button>
            </div>
          </form>
        )}

        {activeTab === "privacy" && (
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-2">
              DPDPA 2023 & Compliance Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Active DPDPA Policy Version"
                value={settings.dpdpaVersion}
                disabled
              />
              <Input
                label="Audit Log Retention (Months)"
                value={settings.auditRetentionMonths}
                onChange={(e) => setSettings({ ...settings, auditRetentionMonths: e.target.value })}
              />
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Statutory Privacy Guard Active
              </p>
              <p>
                Public QR lookups are locked to minimal verification fields (Name, Status, Validity).
              </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" icon={Save}>
                Update Compliance Settings
              </Button>
            </div>
          </form>
        )}

        {activeTab === "security" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-2">
              Role-Based Access Control (RBAC)
            </h3>
            <p className="text-xs text-slate-600">
              5 security roles configured: <strong>Super Admin</strong>, <strong>Partner</strong>, <strong>Field Agent</strong>, <strong>Cardholder</strong>, and <strong>District Coordinator</strong>.
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between">
                <span>Two-Factor Authentication:</span>
                <span className="font-bold text-emerald-600">Enforced for Admin Roles</span>
              </div>
              <div className="flex justify-between">
                <span>Session Timeout:</span>
                <span className="font-bold text-slate-700">60 Minutes</span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
