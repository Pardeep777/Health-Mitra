import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Target,
  Calendar,
  Camera,
  Save,
  RefreshCw,
  CreditCard,
  Building2,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Clock,
  FileText,
  BadgeCheck,
  Lock,
  UploadCloud,
  Check
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Input, Select } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { agentService } from "../../services/agentService";

const TRIPURA_DISTRICTS = [
  { value: "West Tripura", label: "West Tripura (Agartala)" },
  { value: "South Tripura", label: "South Tripura (Belonia)" },
  { value: "Gomati", label: "Gomati (Udaipur)" },
  { value: "Dhalai", label: "Dhalai (Ambassa)" },
  { value: "Khowai", label: "Khowai (Khowai)" },
  { value: "North Tripura", label: "North Tripura (Dharmanagar)" },
  { value: "Unakoti", label: "Unakoti (Kailashahar)" },
  { value: "Sepahijala", label: "Sepahijala (Bishalgarh)" }
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" }
];

const ID_PROOF_TYPES = [
  { value: "Aadhaar Card Reference", label: "Aadhaar Card Reference (DPDPA Compliant)" },
  { value: "Voter ID Card", label: "Voter ID Card" },
  { value: "PAN Card", label: "PAN Card" },
  { value: "Driving License", label: "Driving License" }
];

const PAYOUT_MODES = [
  { value: "upi", label: "Instant UPI Transfer (Recommended)" },
  { value: "bank", label: "Direct Bank Account NEFT/IMPS" }
];

export function AgentProfilePage() {
  const { currentUser, updateCurrentUser } = useAuth();
  const { showToast } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Profile Form State
  const [formData, setFormData] = useState({
    id: "",
    agent_code: "",
    name: "",
    full_name: "",
    mobile: "",
    alternate_mobile: "",
    email: "",
    dob: "",
    gender: "male",
    district_id: 1,
    district: "West Tripura",
    subdivision: "Sadar (Agartala)",
    address: "",
    pin_code: "799001",
    target_daily: 10,
    daily_target: 10,
    commission_rate: 20,
    commission_formatted: "₹20.00 / Card",
    joining_date: "",
    status: "Active",
    payout_mode: "upi",
    bank_name: "State Bank of India (SBI)",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "SBIN0000001",
    upi_id: "",
    id_proof_type: "Aadhaar Card Reference",
    id_proof_number: "",
    id_proof_reference: "",
    total_cards: 0,
    today_cards: 0,
    pending_commission: 0,
    total_commission_earned: 0,
    photo_url: null,
    avatar: null
  });

  // Photo upload state & preview
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const photoInputRef = useRef(null);

  // Fetch Agent Profile from GET /config/get_profile
  const fetchProfile = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await agentService.getProfile();
      if (res.success && res.data) {
        const d = res.data;
        const initialData = {
          id: d.id || currentUser?.id || "",
          agent_code: d.agent_code || currentUser?.agent_code || "HM-AGT-0101",
          name: d.name || d.full_name || currentUser?.name || "Field Agent",
          full_name: d.full_name || d.name || currentUser?.name || "Field Agent",
          mobile: d.mobile || currentUser?.mobile || "",
          alternate_mobile: d.alternate_mobile || currentUser?.alternate_mobile || "",
          email: d.email || currentUser?.email || "",
          dob: d.dob || "1994-06-15",
          gender: d.gender || "male",
          district_id: d.district_id || currentUser?.district_id || 1,
          district: d.district || currentUser?.district || "West Tripura",
          subdivision: d.subdivision || "Sadar (Agartala)",
          address: d.address || "Field Officer Quarter, Agartala",
          pin_code: d.pin_code || "799001",
          target_daily: d.target_daily || d.daily_target || currentUser?.target_daily || 10,
          daily_target: d.daily_target || d.target_daily || currentUser?.target_daily || 10,
          commission_rate: d.commission_rate || currentUser?.commission_rate || 20,
          commission_formatted: d.commission_formatted || `₹${d.commission_rate || 20}.00 / Card`,
          joining_date: d.joining_date || d.created_at?.split(" ")[0] || "2026-09-08",
          status: d.status || currentUser?.status || "Active",
          payout_mode: d.payout_mode || "upi",
          bank_name: d.bank_name || "State Bank of India (SBI)",
          account_holder_name: d.account_holder_name || d.name || currentUser?.name || "Field Agent",
          account_number: d.account_number || "",
          ifsc_code: d.ifsc_code || "SBIN0000001",
          upi_id: d.upi_id || `${d.mobile || "agent"}@okhdfcbank`,
          id_proof_type: d.id_proof_type || "Aadhaar Card Reference",
          id_proof_number: d.id_proof_number || d.id_proof_reference || "XXXX-XXXX-8910",
          id_proof_reference: d.id_proof_reference || d.id_proof_number || "XXXX-XXXX-8910",
          total_cards: d.total_cards || currentUser?.total_cards_issued || 0,
          today_cards: d.today_cards || currentUser?.today_cards || 0,
          pending_commission: d.pending_commission || 0,
          total_commission_earned: d.total_commission_earned || 0,
          photo_url: d.photo_url || d.avatar || currentUser?.avatar || null,
          avatar: d.avatar || d.photo_url || currentUser?.avatar || null
        };

        setFormData(initialData);

        // Keep AuthContext in sync
        if (updateCurrentUser) {
          updateCurrentUser({
            name: initialData.name,
            full_name: initialData.full_name,
            mobile: initialData.mobile,
            email: initialData.email,
            district: initialData.district,
            agent_code: initialData.agent_code,
            avatar: initialData.avatar || initialData.photo_url
          });
        }
      } else if (currentUser) {
        // Fallback to current authenticated user
        setFormData((prev) => ({
          ...prev,
          name: currentUser.name || "Field Agent",
          full_name: currentUser.name || "Field Agent",
          mobile: currentUser.mobile || "",
          email: currentUser.email || "",
          district: currentUser.district || "West Tripura",
          agent_code: currentUser.agent_code || "HM-AGT-0101",
          avatar: currentUser.avatar || null
        }));
      }
    } catch (err) {
      console.warn("Failed to fetch agent profile:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile(true);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfile(false);
    showToast("Refreshing agent profile from server...", "info");
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Image file size must be under 5MB", "error");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      showToast("Photo selected! Click 'Save Changes' to update.", "info");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Please enter your full name.", "error");
      return;
    }
    if (!formData.mobile.trim()) {
      showToast("Please enter your primary mobile number.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("full_name", formData.name.trim());
      payload.append("mobile", formData.mobile.trim());
      payload.append("alternate_mobile", formData.alternate_mobile.trim());
      payload.append("email", formData.email.trim());
      payload.append("dob", formData.dob);
      payload.append("gender", formData.gender);
      payload.append("district", formData.district);
      payload.append("subdivision", formData.subdivision.trim());
      payload.append("address", formData.address.trim());
      payload.append("pin_code", formData.pin_code.trim());
      payload.append("payout_mode", formData.payout_mode);
      payload.append("upi_id", formData.upi_id.trim());
      payload.append("bank_name", formData.bank_name.trim());
      payload.append("account_holder_name", formData.account_holder_name.trim());
      payload.append("account_number", formData.account_number.trim());
      payload.append("ifsc_code", formData.ifsc_code.trim());
      payload.append("id_proof_type", formData.id_proof_type);
      payload.append("id_proof_number", formData.id_proof_number.trim());
      payload.append("id_proof_reference", formData.id_proof_number.trim());

      if (photoFile) {
        payload.append("photo", photoFile);
        payload.append("avatar", photoFile);
      }

      const res = await agentService.updateProfile(payload);

      showToast(res.message || "Agent profile updated successfully!", "success");

      // Update AuthContext state immediately
      if (updateCurrentUser) {
        updateCurrentUser({
          name: formData.name,
          full_name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          district: formData.district,
          avatar: photoPreview || formData.avatar
        });
      }

      // Re-fetch clean data in background
      await fetchProfile(false);
      setPhotoFile(null);
    } catch (err) {
      showToast(err.message || "Failed to update profile. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Loading agent profile & credentials...</p>
      </div>
    );
  }

  const currentAvatarSrc =
    photoPreview ||
    formData.photo_url ||
    formData.avatar ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg">
              {formData.agent_code || "HM-AGT-0101"}
            </span>
            <Badge variant="success" size="sm" className="gap-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              {formData.status} Field Officer
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
            Agent Profile & Settings
          </h1>
          <p className="text-xs text-slate-500">
            Manage your field credentials, contact information, Tripura district assignment & commission payout accounts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing || saving}
            icon={RefreshCw}
            className={refreshing ? "animate-spin text-brand-500" : ""}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            loading={saving}
            icon={Save}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card & Photo Uploader */}
        <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <img
                  src={currentAvatarSrc}
                  alt={formData.name || "Agent Photo"}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-orange-100 border-2 border-brand-500 shadow-md transition group-hover:opacity-90"
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="absolute -bottom-1.5 -right-1.5 p-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md border-2 border-white transition transform active:scale-95 cursor-pointer"
                  title="Upload profile photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-extrabold text-navy-900 capitalize">
                  {formData.name || "Field Agent"}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    {formData.district}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Joined {formData.joining_date || "Sep 2026"}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-amber-600 font-bold">
                  Official ID: {formData.agent_code}
                </p>
              </div>
            </div>

            {/* Quick KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full sm:w-auto">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Daily Target
                </span>
                <span className="text-sm font-black text-navy-900">
                  {formData.target_daily || 10} Cards
                </span>
              </div>
              <div className="p-3 bg-orange-50/60 border border-orange-200/80 rounded-2xl text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block">
                  Commission
                </span>
                <span className="text-sm font-black text-brand-700">
                  ₹{formData.commission_rate}.00
                </span>
              </div>
              <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Total Issued
                </span>
                <span className="text-sm font-black text-emerald-700">
                  {formData.total_cards || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Personal & Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                1. Personal & Contact Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Official Name"
                placeholder="e.g. Rajesh Kumar"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                icon={User}
              />

              <Input
                label="Official Email Address"
                placeholder="agent@healthmitra.demo"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                icon={Mail}
              />

              <Input
                label="Primary Mobile Number"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                required
                icon={Phone}
              />

              <Input
                label="Alternate / Emergency Mobile"
                placeholder="Alternate phone number"
                value={formData.alternate_mobile}
                onChange={(e) => handleInputChange("alternate_mobile", e.target.value)}
                icon={Phone}
              />

              <Input
                label="Date of Birth"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange("dob", e.target.value)}
                icon={Calendar}
              />

              <Select
                label="Gender"
                options={GENDER_OPTIONS}
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Field Assignment & Residential Address */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                2. Field Assignment & Residential Address
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Assigned Tripura District"
                options={TRIPURA_DISTRICTS}
                value={formData.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
                required
              />

              <Input
                label="Subdivision / Block / Area"
                placeholder="e.g. Sadar (Agartala) / Belonia"
                value={formData.subdivision}
                onChange={(e) => handleInputChange("subdivision", e.target.value)}
                icon={Building2}
              />

              <div className="sm:col-span-2">
                <Input
                  label="Residential / Field Address"
                  placeholder="Complete residential address in Tripura"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  icon={MapPin}
                />
              </div>

              <Input
                label="PIN Code"
                placeholder="e.g. 799001"
                value={formData.pin_code}
                onChange={(e) => handleInputChange("pin_code", e.target.value)}
                maxLength={6}
              />

              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-brand-500 shrink-0" />
                <div className="text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800 block">District Jurisdiction</span>
                  Authorised for patient onboarding across all municipal wards & panchayats in {formData.district}.
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Commission Payout & Banking Details */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                  3. Commission Payout & Banking Details
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                Direct Daily Settlement
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Preferred Payout Method"
                options={PAYOUT_MODES}
                value={formData.payout_mode}
                onChange={(e) => handleInputChange("payout_mode", e.target.value)}
              />

              <Input
                label="Primary UPI ID (for instant card payouts)"
                placeholder="e.g. 9879879787@okhdfcbank or agent@upi"
                value={formData.upi_id}
                onChange={(e) => handleInputChange("upi_id", e.target.value)}
                icon={QrCode}
                helperText="₹20 commission per issued card will be transferred directly to this UPI address."
              />

              <Input
                label="Bank Name"
                placeholder="e.g. State Bank of India / Tripura Gramin Bank"
                value={formData.bank_name}
                onChange={(e) => handleInputChange("bank_name", e.target.value)}
                icon={Building2}
              />

              <Input
                label="Bank Account Holder Name"
                placeholder="As per bank passbook"
                value={formData.account_holder_name}
                onChange={(e) => handleInputChange("account_holder_name", e.target.value)}
                icon={User}
              />

              <Input
                label="Bank Account Number"
                placeholder="Enter bank account number"
                value={formData.account_number}
                onChange={(e) => handleInputChange("account_number", e.target.value)}
                icon={CreditCard}
              />

              <Input
                label="Bank IFSC Code"
                placeholder="e.g. SBIN0000001"
                value={formData.ifsc_code}
                onChange={(e) => handleInputChange("ifsc_code", e.target.value.toUpperCase())}
                maxLength={11}
              />
            </div>
          </div>

          {/* Section 4: Official Identity & Field Representative Authorization */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                4. Identity Verification & Official Declaration
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Identity Proof Type"
                options={ID_PROOF_TYPES}
                value={formData.id_proof_type}
                onChange={(e) => handleInputChange("id_proof_type", e.target.value)}
              />

              <Input
                label="ID Proof Number / Masked Reference"
                placeholder="e.g. XXXX-XXXX-8910"
                value={formData.id_proof_number}
                onChange={(e) => handleInputChange("id_proof_number", e.target.value)}
                icon={ShieldCheck}
              />
            </div>

            {/* Official Field Representative Notice */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-orange-50/40 rounded-2xl border border-orange-200/80 text-xs text-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-navy-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-500" />
                  Government & DPDPA Authorized Field Representative
                </p>
                <span className="text-[10px] font-mono font-extrabold text-brand-700 bg-white border border-brand-200 px-2 py-0.5 rounded">
                  AUTHENTICATED
                </span>
              </div>
              <p className="leading-relaxed text-slate-600">
                You are officially authorized by Health Mitra (Tripura Healthcare Welfare Mission) to conduct on-ground door-to-door card registrations, collect the ₹499 annual cardholder fee via Cash/UPI, verify digital KYC, and issue instantaneous QR-verified membership cards.
              </p>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Last synchronized with server: Today</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => fetchProfile(false)}
                disabled={saving}
                className="flex-1 sm:flex-none"
              >
                Reset Changes
              </Button>

              <Button
                type="submit"
                variant="primary"
                loading={saving}
                icon={Save}
                className="flex-1 sm:flex-none"
              >
                Save Profile Changes
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}

