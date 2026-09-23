import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Building,
  Target,
  Users,
  Layers,
  Save,
  RefreshCw,
  Sparkles,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { districtService } from "../../services/districtService";

export function DistrictProfilePage() {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await districtService.getProfile();
      setProfile(data);
      setName(data.coordinator_name || "");
      setMobile(data.coordinator_phone?.replace(/^\+91\s*/, "") || "");
    } catch (err) {
      console.error("Error loading district profile:", err);
      showToast(err.message || "Failed to load coordinator profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !name.trim()) {
      showToast("Coordinator name is required.", "error");
      return;
    }
    if (!mobile || !mobile.trim()) {
      showToast("Mobile number is required.", "error");
      return;
    }

    try {
      setSaving(true);
      setSavedSuccess(false);

      const res = await districtService.updateProfile({
        name: name.trim(),
        mobile: mobile.trim()
      });

      showToast(res.message || "Profile updated successfully!", "success");
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);

      // Update current user in localStorage if matching
      try {
        const stored = localStorage.getItem("health_mitra_current_user");
        if (stored) {
          const userObj = JSON.parse(stored);
          userObj.name = name.trim();
          userObj.coordinator_name = name.trim();
          userObj.mobile = mobile.trim();
          userObj.coordinator_phone = mobile.trim();
          localStorage.setItem("health_mitra_current_user", JSON.stringify(userObj));
        }
      } catch (err) {
        console.warn("Storage sync note:", err);
      }

      await loadProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast(err.message || "Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const quickStats = profile?.quick_stats || {};

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                currentUser?.avatar ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              }
              alt="Coordinator"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200 ring-4 ring-indigo-50"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                District Coordinator
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
              {profile?.coordinator_name || currentUser?.name || "Sudip Chakraborty"}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              <span>
                {profile?.district_name || currentUser?.district || "West Tripura"} District • Headquarters:{" "}
                <b>{profile?.headquarters || "Agartala"}</b>
              </span>
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadProfile}
          loading={loading}
          className="flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Reload</span>
        </Button>
      </div>

      {/* 2. Quick Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border border-slate-200">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Enrolled Cards</p>
          <p className="text-2xl font-extrabold text-brand-600 mt-0.5">
            {loading ? "..." : quickStats.total_enrolled_cards !== undefined ? quickStats.total_enrolled_cards : 23}
          </p>
          <p className="text-[11px] text-slate-400">Total active members in district</p>
        </Card>

        <Card className="p-4 border border-slate-200">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Field Agents</p>
          <p className="text-2xl font-extrabold text-purple-600 mt-0.5">
            {loading ? "..." : quickStats.active_field_agents !== undefined ? quickStats.active_field_agents : 1}
          </p>
          <p className="text-[11px] text-slate-400">Assigned enrollment officers</p>
        </Card>

        <Card className="p-4 border border-slate-200">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Partner Outlets</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-0.5">
            {loading ? "..." : quickStats.partner_outlets !== undefined ? quickStats.partner_outlets : 1}
          </p>
          <p className="text-[11px] text-slate-400">Pharmacies, clinics & diagnostic labs</p>
        </Card>
      </div>

      {/* 3. Profile Information & Edit Form */}
      <Card className="p-6 sm:p-8 border border-slate-200">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Coordinator Profile Details</h2>
              <p className="text-xs text-slate-500">
                Update your official contact information (persisted via <code>/district/update_profile</code>).
              </p>
            </div>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                Coordinator Full Name *
              </label>
              <Input
                type="text"
                icon={User}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Coordinator Name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                Coordinator Mobile Number *
              </label>
              <Input
                type="text"
                icon={Phone}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 9436128111"
                required
              />
            </div>
          </div>

          {/* District Operational Info (Read-only System Configuration) */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              District Operational Parameters
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">District Name</span>
                <span className="text-xs font-bold text-navy-900 mt-0.5 block">
                  {profile?.district_name || "West Tripura"}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Headquarters</span>
                <span className="text-xs font-bold text-navy-900 mt-0.5 block">
                  {profile?.headquarters || "Agartala"}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Rollout Phase</span>
                <span className="text-xs font-bold text-brand-600 mt-0.5 block uppercase">
                  {profile?.rollout_phase ? profile.rollout_phase.replace("_", " ") : "Phase 1"}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Cardholder Target</span>
                <span className="text-xs font-bold text-navy-900 mt-0.5 block">
                  {profile?.target_cardholders ? Number(profile.target_cardholders).toLocaleString() : "1,85,000"}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              type="submit"
              size="md"
              loading={saving}
              className="shadow-orange-glow flex items-center gap-1.5 font-bold text-xs px-6 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Update Profile</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
