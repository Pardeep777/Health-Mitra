import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  Send
} from "lucide-react";
import { districtService } from "../../services/districtService";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";

export function BuyCardEnquiryPage() {
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    district: "West Tripura",
    address: "",
    preferredContact: "WhatsApp",
    message: "",
    consentGiven: true
  });

  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
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

  const districtOptions = districts.map((d) => ({
    label: d.name,
    value: d.name
  }));

  const contactOptions = [
    { label: "WhatsApp Message", value: "WhatsApp" },
    { label: "Phone Call", value: "Phone Call" },
    { label: "SMS", value: "SMS" },
    { label: "Doorstep Agent Visit", value: "Agent Visit" }
  ];

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.mobile.trim() || formData.mobile.length < 10) errs.mobile = "10-digit mobile number required";
    if (!formData.address.trim()) errs.address = "Address is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    setSuccessModal(true);
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Card Purchase & Enquiries
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Get Your Health Mitra Card (₹49/Yr)
        </h1>
        <p className="text-slate-600 text-sm">
          Fill in your details below. Our local field representative in your district will contact you to complete your instant registration.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name of Cardholder"
              placeholder="e.g. Rahul Sharma"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mobile Phone Number"
                placeholder="10-digit mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                error={errors.mobile}
                required
              />
              <Input
                label="Email Address (Optional)"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="District in Tripura"
                options={districtOptions}
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                required
              />
              <Select
                label="Preferred Contact Mode"
                options={contactOptions}
                value={formData.preferredContact}
                onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
              />
            </div>

            <Input
              label="Street Address / Locality / Landmark"
              placeholder="e.g. Banamalipur, Math Chowmuhani, Agartala"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              error={errors.address}
              required
            />

            <div className="w-full">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Special Request / Note (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Need card for elderly parents, prefer weekend visit..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={formData.consentGiven}
                onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                className="mt-1 w-4 h-4 rounded text-brand-500 focus:ring-brand-400"
                required
              />
              <span className="text-[11px] text-slate-600 leading-tight">
                I agree to the Health Mitra Privacy Policy and consent to be contacted by an authorized district agent for card issuance.
              </span>
            </label>

            <div className="pt-3">
              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="w-full shadow-orange-glow"
                icon={Send}
              >
                Submit Card Enquiry
              </Button>
            </div>
          </form>
        </div>

        {/* Right Summary Card */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-navy-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-400">Membership Fee</span>
                <h3 className="text-2xl font-extrabold text-white">₹49 / Year</h3>
              </div>
              <span className="bg-brand-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                Up to 20% OFF
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Digital QR card on WhatsApp</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Physical PVC card delivered within 15 days</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Valid across 100+ partner outlets</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pay ₹49 directly to agent upon delivery or UPI</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-slate-300">
              <Phone className="w-4 h-4 text-brand-400" />
              <span>Helpline: <strong>+91 94361 20111</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        title="Enquiry Submitted Successfully!"
        maxWidth="max-w-md"
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-navy-900">Thank You, {formData.fullName}!</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your card enquiry has been assigned to our <strong>{formData.district}</strong> District Field Coordinator. You will receive a {formData.preferredContact} within 2 business hours.
          </p>
          <Button size="md" className="w-full" onClick={() => setSuccessModal(false)}>
            Back to Home
          </Button>
        </div>
      </Modal>
    </div>
  );
}
