import React, { useState } from "react";
import {
  Briefcase,
  UserCheck,
  Truck,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Send,
  Sparkles
} from "lucide-react";
import { initialDistricts } from "../../data/districts";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";

export function JoinUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    district: "West Tripura",
    roleApplied: "Field Agent",
    experience: "1-2 years field experience",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const roleOptions = [
    { label: "Field Enrollment Agent (Full-time / Part-time)", value: "Field Agent" },
    { label: "District Distributor Point (Wholesale / Logistics)", value: "Distributor" },
    { label: "Partner Relations Executive", value: "Partner Relations" }
  ];

  const districtOptions = initialDistricts.map((d) => ({
    label: d.name,
    value: d.name
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    setSuccessModal(true);
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Careers & Opportunities
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-900 tracking-tight">
          Join Health Mitra as a Field Partner
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Earn competitive daily commissions and build sustainable livelihoods while delivering essential healthcare savings to your local community in Tripura.
        </p>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Field Agent Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-500 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Active Recruitment</span>
              <h3 className="text-xl font-bold text-navy-900 mt-1">Field Enrollment Agent</h3>
              <p className="text-xs text-slate-500 mt-0.5">Target: 10 card enrollments / day</p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Instant commission on every ₹49 card registration.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Mobile-first field portal with digital QR issuance.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Flexible timings in your home block / sub-division.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Annual renewal commission bonuses (70% renewal rate).</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-navy-900">Earning Potential: ₹15,000 – ₹30,000 / month</span>
          </div>
        </div>

        {/* Distributor Point Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">50 Points Network</span>
              <h3 className="text-xl font-bold text-navy-900 mt-1">District Distributor Partner</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage 10–25 local agents & card delivery</p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Exclusive block territory rights in Tripura.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Stock and supply physical PVC smart cards to agents.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Override commissions on all network card volumes.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Dedicated district coordinator support & reporting.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-navy-900">Volume Model: ₹40,000+ / month</span>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-navy-900">Field Partner Application Form</h2>
          <p className="text-xs text-slate-500">Apply to join our field operations team in Tripura.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Mobile Number"
              placeholder="10-digit mobile"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Role You Are Applying For"
              options={roleOptions}
              value={formData.roleApplied}
              onChange={(e) => setFormData({ ...formData, roleApplied: e.target.value })}
              required
            />
            <Select
              label="Preferred District (Tripura)"
              options={districtOptions}
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              required
            />
          </div>

          <Input
            label="Prior Experience / Current Occupation"
            placeholder="e.g. 2 years insurance / retail sales / community outreach"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          />

          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="w-full shadow-orange-glow"
            icon={Send}
          >
            Submit Field Application
          </Button>
        </form>
      </div>

      <Modal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        title="Application Received!"
        maxWidth="max-w-md"
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-navy-900">Welcome to Health Mitra!</h3>
          <p className="text-xs text-slate-600">
            Thank you, {formData.name}. Our District Manager for {formData.district} will review your application and schedule a phone orientation within 24 hours.
          </p>
          <Button size="md" className="w-full" onClick={() => setSuccessModal(false)}>
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
}
