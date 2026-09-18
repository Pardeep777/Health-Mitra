import React, { useState, useEffect, useRef } from "react";
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Download,
  Save,
  Upload,
  RefreshCw,
  FileText,
  Percent,
  CheckCircle2,
  AlertCircle,
  Building2,
  ExternalLink,
  Sparkles,
  Camera
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { partnerService } from "../../services/partnerService";

export function PartnerProfilePage() {
  const { currentUser, updateCurrentUser } = useAuth();
  const { showToast } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Profile Form State
  const [formData, setFormData] = useState({
    id: "",
    partner_code: "",
    business_name: "",
    owner_name: "",
    mobile: "",
    alternate_mobile: "",
    email: "",
    registration_number: "",
    gst_number: "",
    category_id: "",
    category_name: "",
    district_id: "",
    district: "",
    area_id: "",
    area: "",
    pin_code: "",
    address: "",
    opening_hours: "",
    description: "",
    max_discount_percent: 20,
    partnership_status: "",
    status: "active",
    agreement_status: "signed",
    agreement_status_label: "Verified & Signed",
    agreement_valid_from: "",
    agreement_valid_until: "",
    network_member_since: "",
    total_redemptions: 0,
    logo_url: null,
    shop_image_url: null,
    id_proof_doc_url: null,
    license_doc_url: null,
    gst_doc_url: null,
    agreement_doc_url: null,
    branding_kit_url: null
  });

  // Selected files for upload
  const [logoFile, setLogoFile] = useState(null);
  const [shopImageFile, setShopImageFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [shopImagePreview, setShopImagePreview] = useState(null);

  const logoInputRef = useRef(null);
  const shopImageInputRef = useRef(null);

  // Fetch profile on component mount
  const fetchProfile = async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setLoading(true);
    try {
      const res = await partnerService.getProfile();
      if (res.success && res.data) {
        const d = res.data;
        setFormData({
          id: d.id || "",
          partner_code: d.partner_code || "HMP816884",
          business_name: d.business_name || currentUser?.partner_name || "",
          owner_name: d.owner_name || currentUser?.owner_name || "",
          mobile: d.mobile || currentUser?.mobile || "",
          alternate_mobile: d.alternate_mobile || "",
          email: d.email || currentUser?.email || "",
          registration_number: d.registration_number || "",
          gst_number: d.gst_number || "",
          category_id: d.category_id || 1,
          category_name: d.category_name || "Pharmacy / Medicine Shop",
          district_id: d.district_id || 2,
          district: d.district || "South Tripura",
          area_id: d.area_id || 7,
          area: d.area || "Belonia",
          pin_code: d.pin_code || "799001",
          address: d.address || "",
          opening_hours: d.opening_hours || "08:00 AM - 10:30 PM (Mon-Sun)",
          description: d.description || "",
          max_discount_percent: d.max_discount_percent || 20,
          partnership_status: d.partnership_status || "Active Partner",
          status: d.status || "active",
          agreement_status: d.agreement_status || "signed",
          agreement_status_label: d.agreement_status_label || "Verified & Signed",
          agreement_valid_from: d.agreement_valid_from || "2026-09-05",
          agreement_valid_until: d.agreement_valid_until || "2027-09-05",
          network_member_since: d.network_member_since || "05 Sep 2026",
          total_redemptions: d.total_redemptions ?? 5,
          logo_url: d.logo_url || null,
          shop_image_url: d.shop_image_url || null,
          id_proof_doc_url: d.id_proof_doc_url || null,
          license_doc_url: d.license_doc_url || null,
          gst_doc_url: d.gst_doc_url || null,
          agreement_doc_url: d.agreement_doc_url || null,
          branding_kit_url: d.branding_kit_url || null
        });

        // Sync auth state if needed
        if (updateCurrentUser) {
          updateCurrentUser({
            partner_name: d.business_name || currentUser?.partner_name,
            business_name: d.business_name || currentUser?.business_name,
            owner_name: d.owner_name || currentUser?.owner_name,
            name: d.owner_name || d.business_name || currentUser?.name,
            mobile: d.mobile || currentUser?.mobile,
            district: d.district || currentUser?.district,
            avatar: d.logo_url || d.shop_image_url || currentUser?.avatar
          });
        }
      } else {
        // Fallback to current user data
        if (currentUser) {
          setFormData((prev) => ({
            ...prev,
            business_name: currentUser.partner_name || currentUser.business_name || "Mitra Pharmacy & Healthcare",
            owner_name: currentUser.owner_name || currentUser.name || "Dr. Subhash Debbarma",
            email: currentUser.email || "",
            mobile: currentUser.mobile || "",
            district: currentUser.district || "South Tripura",
            partner_code: currentUser.partner_code || "HMP816884"
          }));
        }
      }
    } catch (err) {
      console.warn("Failed to fetch partner profile:", err);
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
    showToast("Refreshing profile data...", "info");
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleShopImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setShopImageFile(file);
      setShopImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = new FormData();
      payload.append("business_name", formData.business_name || "");
      payload.append("owner_name", formData.owner_name || "");
      payload.append("mobile", formData.mobile || "");
      payload.append("alternate_mobile", formData.alternate_mobile || "");
      payload.append("email", formData.email || "");
      payload.append("registration_number", formData.registration_number || "");
      payload.append("gst_number", formData.gst_number || "");
      payload.append("pin_code", formData.pin_code || "");
      payload.append("address", formData.address || "");
      payload.append("opening_hours", formData.opening_hours || "");
      payload.append("description", formData.description || "");
      payload.append("max_discount_percent", String(formData.max_discount_percent || 20));

      if (logoFile) {
        payload.append("logo", logoFile);
      }
      if (shopImageFile) {
        payload.append("shop_image", shopImageFile);
      }

      const res = await partnerService.updateProfile(payload);

      showToast(res.message || "Partner profile updated successfully!", "success");

      // Reload fresh profile data
      await fetchProfile(false);

      // Reset pending files
      setLogoFile(null);
      setShopImageFile(null);
    } catch (err) {
      showToast(err.message || "Failed to update profile. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Loading partner outlet profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-lg">
              {formData.partner_code || "HMP816884"}
            </span>
            <Badge variant={formData.status === "active" ? "success" : "brand"}>
              {formData.partnership_status || "Active Healthcare Partner"}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            {formData.business_name || "Healthcare Outlet Profile"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {formData.address || `${formData.district || "West Tripura"}, Tripura`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            loading={refreshing}
            icon={RefreshCw}
          >
            Sync Data
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            loading={saving}
            icon={Save}
            className="shadow-orange-glow"
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editable Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-navy-900">Edit Outlet Information</h2>
              <p className="text-xs text-slate-500">Update your store details visible to cardholders and verification agents</p>
            </div>
            <span className="text-[11px] font-bold text-brand-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
              Live API Sync
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Visual Branding / Photos Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70">
              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-navy-900">
                  Outlet Logo / Brand Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                    {logoPreview || formData.logo_url ? (
                      <img
                        src={logoPreview || formData.logo_url}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Store className="w-7 h-7 text-slate-300" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={handleLogoChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => logoInputRef.current?.click()}
                      icon={Camera}
                    >
                      {formData.logo_url || logoPreview ? "Change Logo" : "Upload Logo"}
                    </Button>
                    <p className="text-[10px] text-slate-400">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>

              {/* Shop Front Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-navy-900">
                  Shop Front / Clinic Photo
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                    {shopImagePreview || formData.shop_image_url ? (
                      <img
                        src={shopImagePreview || formData.shop_image_url}
                        alt="Shop Front"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-7 h-7 text-slate-300" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <input
                      type="file"
                      ref={shopImageInputRef}
                      onChange={handleShopImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => shopImageInputRef.current?.click()}
                      icon={Camera}
                    >
                      {formData.shop_image_url || shopImagePreview ? "Change Photo" : "Upload Photo"}
                    </Button>
                    <p className="text-[10px] text-slate-400">Exterior or reception photo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Identification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business / Outlet Name *"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                required
              />
              <Input
                label="Owner / Contact Person *"
                value={formData.owner_name}
                onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                required
              />
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Mobile Number *"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                required
              />
              <Input
                label="Alternate Mobile / Landline"
                value={formData.alternate_mobile}
                onChange={(e) => setFormData({ ...formData, alternate_mobile: e.target.value })}
                placeholder="Optional"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Registered Email Address *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Category / Specialty"
                value={formData.category_name}
                disabled
              />
            </div>

            {/* Registration & GST Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Trade License / Reg Number"
                value={formData.registration_number}
                onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                placeholder="e.g. TR-PHARM-2026-98"
              />
              <Input
                label="GSTIN (Optional)"
                value={formData.gst_number}
                onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                placeholder="e.g. 16AABCM1234F1Z5"
              />
            </div>

            {/* Location & Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="District (Tripura)"
                value={formData.district}
                disabled
              />
              <Input
                label="Area / Municipal Block"
                value={formData.area}
                disabled
              />
              <Input
                label="Postal PIN Code *"
                value={formData.pin_code}
                onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
                required
              />
            </div>

            <Input
              label="Street Address & Landmark *"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Operating Hours *"
                value={formData.opening_hours}
                onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                placeholder="e.g. 08:00 AM - 10:30 PM (Mon-Sun)"
                required
              />
              <Input
                label="Max Discount Extended (%) *"
                type="number"
                min="5"
                max="50"
                value={formData.max_discount_percent}
                onChange={(e) => setFormData({ ...formData, max_discount_percent: Number(e.target.value) })}
                required
              />
            </div>

            {/* Description / Special services */}
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                About Your Outlet & Offerings
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition outline-none resize-none"
                placeholder="Describe your facilities, specialized medical services, diagnostic equipment, or prescription stock..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                type="submit"
                loading={saving}
                size="lg"
                icon={Save}
                className="shadow-orange-glow px-6"
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Status & Document Assets */}
        <div className="lg:col-span-4 space-y-6">
          {/* Partnership Status Card */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Network Status
              </h3>
              <Badge variant="success">
                {formData.partnership_status || "Active Partner"}
              </Badge>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Partner Code:</span>
                <span className="font-mono font-bold text-navy-900">{formData.partner_code}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Agreement:</span>
                <span className="font-bold text-emerald-700">{formData.agreement_status_label}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Agreement Period:</span>
                <span className="font-semibold text-navy-900">
                  {formData.agreement_valid_from} to {formData.agreement_valid_until}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Network Member Since:</span>
                <span className="font-semibold text-navy-900">{formData.network_member_since}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Total Redemptions:</span>
                <span className="font-extrabold text-brand-600 bg-orange-50 px-2 py-0.5 rounded-md">
                  {formData.total_redemptions} Visits
                </span>
              </div>
            </div>

            {/* Official Branding & Agreement Download */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              {formData.branding_kit_url || formData.agreement_doc_url ? (
                <a
                  href={formData.branding_kit_url || formData.agreement_doc_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    icon={Download}
                  >
                    Download Signed Agreement & Assets
                  </Button>
                </a>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  icon={Download}
                  onClick={() => showToast("Branding Kit downloaded successfully!", "success")}
                >
                  Download Partner Kit & QR Board
                </Button>
              )}
            </div>
          </Card>

          {/* Verification Documents Summary */}
          <Card className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Verified Documents</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-slate-700">License / Registration</span>
                </div>
                {formData.license_doc_url ? (
                  <a
                    href={formData.license_doc_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-brand-600 font-bold hover:underline flex items-center gap-1"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Verified
                  </span>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-slate-700">GST Registration</span>
                </div>
                {formData.gst_doc_url ? (
                  <a
                    href={formData.gst_doc_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-brand-600 font-bold hover:underline flex items-center gap-1"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium">On File</span>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-700">Owner ID Proof</span>
                </div>
                {formData.id_proof_doc_url ? (
                  <a
                    href={formData.id_proof_doc_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-brand-600 font-bold hover:underline flex items-center gap-1"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

