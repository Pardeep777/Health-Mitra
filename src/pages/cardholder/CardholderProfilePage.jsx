import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Calendar,
  Camera,
  Save,
  RefreshCw,
  QrCode,
  Building2,
  Lock,
  Sparkles,
  BadgeCheck,
  Clock
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Input, Select } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { cardholderService } from "../../services/cardholderService";

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

export function CardholderProfilePage() {
  const { currentUser, updateCurrentUser } = useAuth();
  const { showToast } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    cardholder_id: 1,
    unique_id: "HMC-7F38A21",
    customer_code: "HMC-7F38A21",
    card_id: "HMC-7F38A21",
    full_name: "",
    name: "",
    mobile: "",
    alternate_mobile: "",
    email: "",
    dob: "1992-04-12",
    gender: "male",
    district_id: 1,
    district: "West Tripura",
    pin_code: "799001",
    address: "",
    id_proof_type: "Aadhaar Card Reference",
    id_proof_reference: "XXXX-XXXX-8921",
    status: "Active",
    issue_date: "2026-09-02",
    expiry_date: "2027-09-02",
    public_token: "HM_PUBLIC_7F38A21_X92",
    price_paid: 499,
    dpdpa_consent: true,
    dpdpa_consent_date: "02 Sep 2026",
    photo_url: null,
    avatar: null
  });

  // Photo upload state & preview
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const photoInputRef = useRef(null);

  // Fetch Cardholder Profile from GET /cardholder/get_profile
  const fetchProfile = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await cardholderService.getProfile();
      if (res.success && res.data) {
        const d = res.data;
        const initialData = {
          id: d.id || currentUser?.id || "",
          cardholder_id: d.cardholder_id || d.id || 1,
          unique_id: d.unique_id || d.customer_code || currentUser?.card_id || "HMC-7F38A21",
          customer_code: d.customer_code || d.unique_id || currentUser?.card_id || "HMC-7F38A21",
          card_id: d.card_id || d.unique_id || currentUser?.card_id || "HMC-7F38A21",
          full_name: d.full_name || d.name || currentUser?.name || "Rahul Sharma",
          name: d.name || d.full_name || currentUser?.name || "Rahul Sharma",
          mobile: d.mobile || currentUser?.mobile || "",
          alternate_mobile: d.alternate_mobile || currentUser?.alternate_mobile || "",
          email: d.email || currentUser?.email || "",
          dob: d.dob || "1992-04-12",
          gender: d.gender || "male",
          district_id: d.district_id || currentUser?.district_id || 1,
          district: d.district || currentUser?.district || "West Tripura",
          pin_code: d.pin_code || "799001",
          address: d.address || currentUser?.address || "Banamalipur, Math Chowmuhani, Agartala",
          id_proof_type: d.id_proof_type || "Aadhaar Card Reference",
          id_proof_reference: d.id_proof_reference || "XXXX-XXXX-8921",
          status: d.status || currentUser?.status || "Active",
          issue_date: d.issue_date || "2026-09-02",
          expiry_date: d.expiry_date || "2027-09-02",
          public_token: d.public_token || currentUser?.public_token || `HM_PUBLIC_${d.unique_id || "7F38A21_X92"}`,
          price_paid: d.price_paid || 499,
          dpdpa_consent: d.dpdpa_consent !== undefined ? d.dpdpa_consent : true,
          dpdpa_consent_date: d.dpdpa_consent_date || "02 Sep 2026",
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
            card_id: initialData.unique_id,
            unique_id: initialData.unique_id,
            avatar: initialData.avatar || initialData.photo_url
          });
        }
      } else if (currentUser) {
        setFormData((prev) => ({
          ...prev,
          name: currentUser.name || "Rahul Sharma",
          full_name: currentUser.name || "Rahul Sharma",
          mobile: currentUser.mobile || "9876543210",
          email: currentUser.email || "rahul.sharma@example.com",
          district: currentUser.district || "West Tripura",
          card_id: currentUser.card_id || "HMC-7F38A21",
          unique_id: currentUser.card_id || "HMC-7F38A21",
          avatar: currentUser.avatar || null
        }));
      }
    } catch (err) {
      console.warn("Failed to fetch cardholder profile:", err);
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
    showToast("Refreshing cardholder profile from server...", "info");
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
    if (!formData.full_name.trim() && !formData.name.trim()) {
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
      payload.append("name", (formData.full_name || formData.name).trim());
      payload.append("full_name", (formData.full_name || formData.name).trim());
      payload.append("mobile", formData.mobile.trim());
      payload.append("alternate_mobile", formData.alternate_mobile.trim());
      payload.append("email", formData.email.trim());
      payload.append("dob", formData.dob);
      payload.append("gender", formData.gender);
      payload.append("district", formData.district);
      payload.append("address", formData.address.trim());
      payload.append("pin_code", formData.pin_code.trim());
      payload.append("id_proof_type", formData.id_proof_type);
      payload.append("id_proof_reference", formData.id_proof_reference.trim());

      if (photoFile) {
        payload.append("photo", photoFile);
        payload.append("avatar", photoFile);
      }

      const res = await cardholderService.updateProfile(payload);

      showToast(res.message || "Cardholder profile updated successfully!", "success");

      // Update AuthContext state immediately
      if (updateCurrentUser) {
        updateCurrentUser({
          name: formData.full_name || formData.name,
          full_name: formData.full_name || formData.name,
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
        <p className="text-sm font-semibold text-slate-600">Loading member profile & card details...</p>
      </div>
    );
  }

  const currentAvatarSrc =
    photoPreview ||
    formData.photo_url ||
    formData.avatar ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80";

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-lg">
              {formData.unique_id || "HMC-7F38A21"}
            </span>
            <Badge variant="success" size="sm" className="gap-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              {formData.status} Member
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
            Member Profile & DPDPA Consent
          </h1>
          <p className="text-xs text-slate-500">
            View and update your personal demographic details, contact information & privacy consent preferences.
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
        <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 shadow-card space-y-6">
          {/* Top Profile Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <img
                  src={currentAvatarSrc}
                  alt={formData.full_name || "Cardholder Photo"}
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
                  {formData.full_name || formData.name || "Rahul Sharma"}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    {formData.district}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Valid Thru {formData.expiry_date}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-brand-700 font-bold">
                  Card ID: {formData.unique_id}
                </p>
              </div>
            </div>

            {/* Quick Card Overview Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full sm:w-auto">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Card Status
                </span>
                <span className="text-sm font-black text-emerald-600">
                  {formData.status}
                </span>
              </div>
              <div className="p-3 bg-orange-50/60 border border-orange-200/80 rounded-2xl text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block">
                  Discount Level
                </span>
                <span className="text-sm font-black text-brand-700">
                  Up to 20%
                </span>
              </div>
              <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-2xl text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                  Validity
                </span>
                <span className="text-sm font-black text-blue-700">
                  1 Year Pass
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                1. Member Personal & Contact Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Official Name"
                placeholder="e.g. Rahul Sharma"
                value={formData.full_name || formData.name}
                onChange={(e) => {
                  handleInputChange("full_name", e.target.value);
                  handleInputChange("name", e.target.value);
                }}
                required
                icon={User}
              />

              <Input
                label="Registered Email Address"
                placeholder="user@healthmitra.demo"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                icon={Mail}
              />

              <Input
                label="Registered Mobile Number"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                required
                icon={Phone}
              />

              <Input
                label="Alternate / Emergency Mobile"
                placeholder="Emergency contact number"
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

          {/* Section 2: Residential Address & District */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                2. Residential Address in Tripura
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Tripura District"
                options={TRIPURA_DISTRICTS}
                value={formData.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
                required
              />

              <Input
                label="PIN Code"
                placeholder="e.g. 799001"
                value={formData.pin_code}
                onChange={(e) => handleInputChange("pin_code", e.target.value)}
                maxLength={6}
              />

              <div className="sm:col-span-2">
                <Input
                  label="Full Residential Address"
                  placeholder="Street / Locality / Landmark / City"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  icon={MapPin}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Membership Pass & DPDPA Consent */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                3. Membership Pass & Digital Privacy Consent
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
                label="ID Proof Reference / Masked Number"
                placeholder="XXXX-XXXX-8921"
                value={formData.id_proof_reference}
                onChange={(e) => handleInputChange("id_proof_reference", e.target.value)}
                icon={Lock}
              />
            </div>

            {/* DPDPA 2023 Consent Box */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 rounded-2xl border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  DPDPA 2023 Digital Healthcare Consent Active
                </p>
                <span className="text-[10px] font-mono font-extrabold text-emerald-700 bg-white border border-emerald-300 px-2 py-0.5 rounded">
                  RECORDED
                </span>
              </div>
              <p className="leading-relaxed text-emerald-900 text-[11px]">
                Affirmative consent recorded for the issuance, counter scanning & verification of the Health Mitra Smart Healthcare Discount Card under Policy Version 1.2 (Issued on {formData.issue_date}).
              </p>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Card valid until: {formData.expiry_date}</span>
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

