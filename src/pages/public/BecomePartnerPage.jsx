import React, { useState, useEffect } from "react";
import {
  Building2,
  CheckCircle2,
  Upload,
  FileText,
  ShieldCheck,
  Percent,
  Sparkles,
  Store,
  Users,
  Clock,
  ArrowRight
} from "lucide-react";
import { districtService } from "../../services/districtService";
import { partnerService } from "../../services/partnerService";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";

export function BecomePartnerPage() {
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    mobile: "",
    email: "",
    category: "Pharmacy",
    district: "West Tripura",
    address: "",
    pincode: "799001",
    services: "Prescription medicines, surgical supplies, chronic wellness care",
    discountOffered: "15",
    regNumber: "",
    agreementAccepted: false
  });

  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdPartner, setCreatedPartner] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadDistricts() {
      try {
        const data = await districtService.getAll();
        setDistricts(Array.isArray(data) ? data : []);
      } catch (e) {
        setDistricts([]);
      }
    }
    loadDistricts();
  }, []);

  const categories = [
    { label: "Pharmacy / Chemist Outlet", value: "Pharmacy" },
    { label: "Pathology Diagnostic Lab", value: "Pathology Lab" },
    { label: "Nursing Home / Day Care Clinic", value: "Nursing Home" },
    { label: "Dental Clinic", value: "Dental Clinic" },
    { label: "Eye Care / Opticals", value: "Opticals" }
  ];

  const districtOptions = districts.map((d) => ({
    label: d.name,
    value: d.name
  }));

  const validate = () => {
    const errs = {};
    if (!formData.businessName.trim()) errs.businessName = "Business name is required";
    if (!formData.ownerName.trim()) errs.ownerName = "Owner name is required";
    if (!formData.mobile.trim() || formData.mobile.length < 10) errs.mobile = "Valid 10-digit mobile number required";
    if (!formData.address.trim()) errs.address = "Complete address is required";
    if (!formData.regNumber.trim()) errs.regNumber = "Trade / Clinical license number is required";
    if (!formData.agreementAccepted) errs.agreementAccepted = "You must agree to partner terms";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.businessName,
        owner: formData.ownerName,
        phone: formData.mobile,
        email: formData.email || `${formData.businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}@healthmitra.demo`,
        category: formData.category,
        district: formData.district,
        address: formData.address,
        pincode: formData.pincode,
        discountPercent: Number(formData.discountOffered),
        maxDiscountText: `Up to ${formData.discountOffered}% Partner Discount`,
        services: [
          { name: "Primary Healthcare Services", discount: Number(formData.discountOffered), basePriceRange: "Standard" }
        ],
        regNumber: formData.regNumber
      };

      const result = await partnerService.createApplication(payload);
      setCreatedPartner(result);
      setSuccessModalOpen(true);
      // Reset
      setFormData({
        businessName: "",
        ownerName: "",
        mobile: "",
        email: "",
        category: "Pharmacy",
        district: "West Tripura",
        address: "",
        pincode: "799001",
        services: "Prescription medicines, surgical supplies, chronic wellness care",
        discountOffered: "15",
        regNumber: "",
        agreementAccepted: false
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Partner Network Onboarding
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-900 tracking-tight">
          Join the Health Mitra Healthcare Network
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Expand your patient footfall and grow your pharmacy, lab, or clinic with direct access to over 48,000+ enrolled cardholders in Tripura.
        </p>
      </div>

      {/* Partner Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-500 flex items-center justify-center mb-2">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-navy-900">Guaranteed Patient Volume</h3>
          <p className="text-xs text-slate-500">
            Cardholders actively seek listed partner outlets in their neighborhood for routine medicine and diagnostics.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-navy-900">Zero Onboarding Cost</h3>
          <p className="text-xs text-slate-500">
            No listing fee, no monthly software charges, and free Health Mitra partner branding board provided.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-navy-900">Fast 2-Second QR Billing</h3>
          <p className="text-xs text-slate-500">
            Use any standard mobile phone browser to verify patient cards with no dedicated hardware needed.
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-navy-900">Partner Application Form</h2>
          <p className="text-xs text-slate-500">Please provide accurate business and statutory licensing details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Business Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Business Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Business / Clinic Name"
                placeholder="e.g. Mitra Medical Hall"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                error={errors.businessName}
                required
              />
              <Input
                label="Owner / Doctor Name"
                placeholder="e.g. Dr. Subhash Debbarma"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                error={errors.ownerName}
                required
              />
              <Input
                label="Mobile Phone Number"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                error={errors.mobile}
                required
              />
              <Input
                label="Email Address (Optional)"
                type="email"
                placeholder="partner@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Section 2: Category & Location */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">2. Category & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Healthcare Category"
                options={categories}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
              <Select
                label="District (Tripura)"
                options={districtOptions}
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                required
              />
              <Input
                label="PIN Code"
                placeholder="799001"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                required
              />
            </div>

            <Input
              label="Complete Street Address & Landmark"
              placeholder="e.g. Akhaura Road, Near Old Motor Stand, Agartala"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              error={errors.address}
              required
            />
          </div>

          {/* Section 3: Commercials & Licensing */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Services & Discount Offering</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Discount Offered to Health Mitra Cardholders (%)"
                placeholder="e.g. 15 (Up to 20%)"
                type="number"
                min="5"
                max="25"
                value={formData.discountOffered}
                onChange={(e) => setFormData({ ...formData, discountOffered: e.target.value })}
                helperText="Standard range: 10% to 20% discount"
                required
              />
              <Input
                label="Drug License / Clinical Reg. Number"
                placeholder="e.g. DL-TRP-2024-8910"
                value={formData.regNumber}
                onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                error={errors.regNumber}
                required
              />
            </div>

            <Input
              label="Key Healthcare Services Provided"
              placeholder="e.g. Prescription Medicines, Blood Tests, Routine Consultation"
              value={formData.services}
              onChange={(e) => setFormData({ ...formData, services: e.target.value })}
            />
          </div>

          {/* Section 4: Document Upload Simulation */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">4. Business Photos & Documents (Optional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-brand-500 transition cursor-pointer bg-slate-50/50">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Upload Shop / Outlet Photo</p>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-brand-500 transition cursor-pointer bg-slate-50/50">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Upload License / Certificate Copy</p>
                <p className="text-[10px] text-slate-400 mt-1">PDF or image</p>
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreementAccepted}
                onChange={(e) => setFormData({ ...formData, agreementAccepted: e.target.checked })}
                className="mt-1 w-4 h-4 rounded text-brand-500 focus:ring-brand-400 border-slate-300"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                I hereby apply to become an authorized Health Mitra Healthcare Partner. I agree to honor the stated discount for verified cardholders and accept the Health Mitra Partner Agreement & Privacy Policy.
              </span>
            </label>
            {errors.agreementAccepted && (
              <p className="text-xs text-rose-500 mt-1">{errors.agreementAccepted}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full shadow-orange-glow"
            >
              Submit Partner Application
            </Button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Partner Application Submitted!"
        maxWidth="max-w-lg"
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-navy-900">Application Received</h3>
            <p className="text-xs text-slate-500">
              Reference ID: <strong className="font-mono text-brand-600">{createdPartner?.id || "PART-1016"}</strong>
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs space-y-2 border border-slate-200">
            <p className="text-slate-700">
              Thank you for registering <strong>{createdPartner?.name}</strong>.
            </p>
            <p className="text-slate-600">
              Our District Operations Team will verify your trade registration details within <strong>24 to 48 hours</strong> and dispatch your official partner welcome kit and QR branding scanner.
            </p>
          </div>

          <Button size="md" className="w-full" onClick={() => setSuccessModalOpen(false)}>
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
}
