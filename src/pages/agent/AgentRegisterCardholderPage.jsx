import React, { useState } from "react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  User,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  QrCode,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Share2,
  Download,
  Plus,
  Printer
} from "lucide-react";
import { initialDistricts } from "../../data/districts";
import { cardholderService } from "../../services/cardholderService";
import { agentService } from "../../services/agentService";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { HealthMitraCard } from "../../components/card/HealthMitraCard";
import { PrintableCard } from "../../components/card/PrintableCard";
import { Modal } from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

export function AgentRegisterCardholderPage() {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdCard, setCreatedCard] = useState(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    dob: "1992-06-15",
    gender: "Male",
    district: currentUser?.district || "West Tripura",
    address: "",
    idProofType: "Aadhaar Card Reference",
    idProofReference: "XXXX-XXXX-9842",
    consentAgreed: true,
    paymentMode: "Cash",
    amount: 49
  });

  const [errors, setErrors] = useState({});

  const districtOptions = initialDistricts.map((d) => ({
    label: d.name,
    value: d.name
  }));

  const validateStep = () => {
    const errs = {};
    if (step === 1) {
      if (!formData.fullName.trim()) errs.fullName = "Full name is required";
      if (!formData.mobile.trim() || formData.mobile.length < 10) errs.mobile = "10-digit mobile required";
      if (!formData.address.trim()) errs.address = "Address is required";
    } else if (step === 2) {
      if (!formData.idProofReference.trim()) errs.idProofReference = "ID reference is required";
    } else if (step === 3) {
      if (!formData.consentAgreed) errs.consentAgreed = "Cardholder consent is required under DPDPA 2023";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: formData.fullName,
        mobile: formData.mobile,
        dob: formData.dob,
        gender: formData.gender?.toLowerCase() || "male",
        district_id: 1,
        district: formData.district,
        address: formData.address,
        pin_code: "799001",
        id_proof_type: formData.idProofType,
        id_proof_reference: formData.idProofReference,
        payment_mode: formData.paymentMode,
        price_paid: 49,
        registered_by_agent_id: currentUser?.agent_id || "AGT-101",
        registered_by_name: currentUser?.name || "Rajesh Kumar"
      };

      const res = await cardholderService.create(payload);
      const newCard = res.record || {
        ...payload,
        full_name: payload.name,
        unique_id: `HMC-${Date.now().toString().slice(-6)}`,
        public_token: `HM_PUBLIC_${Date.now()}`,
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "Active"
      };

      if (currentUser?.agent_id) {
        await agentService.incrementRegistration(currentUser.agent_id);
      }
      setCreatedCard(newCard);
      setStep(5);
      showToast(res.message || `Cardholder ${newCard.full_name} enrolled successfully!`, "success");

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err) {
      showToast(err.message || "Failed to register cardholder. Please check details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      mobile: "",
      dob: "1992-06-15",
      gender: "Male",
      district: currentUser?.district || "West Tripura",
      address: "",
      idProofType: "Aadhaar Card Reference",
      idProofReference: "XXXX-XXXX-9842",
      consentAgreed: true,
      paymentMode: "Cash",
      amount: 49
    });
    setCreatedCard(null);
    setStep(1);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Step Indicator Header */}
      {step < 5 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>STEP {step} OF 4</span>
            <span className="text-brand-600">
              {step === 1 && "Personal Details"}
              {step === 2 && "ID Proof Reference"}
              {step === 3 && "DPDPA Consent"}
              {step === 4 && "Payment Collection"}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Multi-step Card Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Step 1: Cardholder Details</h2>
              <p className="text-xs text-slate-500">Enter demographic details for membership card generation</p>
            </div>

            <Input
              label="Full Name (as per ID)"
              placeholder="e.g. Rahul Sharma"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Mobile Number"
                placeholder="10-digit number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                error={errors.mobile}
                required
              />
              <Select
                label="District (Tripura)"
                options={districtOptions}
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                required
              />
            </div>

            <Input
              label="Complete Residential Address"
              placeholder="e.g. Math Chowmuhani, Banamalipur, Agartala"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              error={errors.address}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date of Birth"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
              <Select
                label="Gender"
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" }
                ]}
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              />
            </div>

            <div className="pt-2">
              <Button size="lg" className="w-full shadow-orange-glow" onClick={handleNext}>
                Continue to ID Reference →
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: ID Proof Reference */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Step 2: ID Proof Reference</h2>
              <p className="text-xs text-slate-500">
                To prevent fraud, record masked ID reference (No raw biometric data is saved)
              </p>
            </div>

            <Select
              label="Government ID Proof Type"
              options={[
                { label: "Aadhaar Card Reference", value: "Aadhaar Card Reference" },
                { label: "Voter ID Card", value: "Voter ID Reference" },
                { label: "Ration Card", value: "Ration Card Reference" },
                { label: "Driving License", value: "Driving License Reference" }
              ]}
              value={formData.idProofType}
              onChange={(e) => setFormData({ ...formData, idProofType: e.target.value })}
            />

            <Input
              label="Masked ID Reference Number"
              placeholder="e.g. XXXX-XXXX-8921"
              value={formData.idProofReference}
              onChange={(e) => setFormData({ ...formData, idProofReference: e.target.value })}
              error={errors.idProofReference}
              helperText="Do not store full unmasked sensitive numbers"
              required
            />

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-500 shrink-0" />
              <span>DPDPA compliant: Masked identifier for verification only.</span>
            </div>

            <div className="pt-4 flex items-center justify-between gap-3">
              <Button variant="outline" onClick={handleBack}>
                ← Back
              </Button>
              <Button size="lg" className="flex-1" onClick={handleNext}>
                Continue to Consent →
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Consent */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Step 3: Cardholder Consent</h2>
              <p className="text-xs text-slate-500">Record affirmative digital consent under DPDPA 2023</p>
            </div>

            <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-200 text-xs space-y-2">
              <p className="font-bold text-brand-900">Consent Declaration:</p>
              <p className="text-slate-700 leading-relaxed italic">
                "I hereby consent to the collection and processing of my name, contact number, and district for the issuance and counter verification of the Health Mitra Smart Healthcare Discount Card."
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consentAgreed}
                onChange={(e) => setFormData({ ...formData, consentAgreed: e.target.checked })}
                className="mt-1 w-5 h-5 rounded text-brand-500 focus:ring-brand-400"
              />
              <span className="text-xs text-slate-800 font-semibold leading-relaxed">
                Cardholder has verbally confirmed and agreed to this consent declaration.
              </span>
            </label>
            {errors.consentAgreed && <p className="text-xs text-rose-500">{errors.consentAgreed}</p>}

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] text-slate-500 space-y-0.5 font-mono">
              <p>• Policy Version: v1.2</p>
              <p>• Timestamp: {new Date().toISOString()}</p>
              <p>• Agent Tag: {currentUser?.agent_code || "HM-AGT-0101"}</p>
            </div>

            <div className="pt-4 flex items-center justify-between gap-3">
              <Button variant="outline" onClick={handleBack}>
                ← Back
              </Button>
              <Button size="lg" className="flex-1" onClick={handleNext}>
                Proceed to Payment (₹49) →
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Step 4: Payment Collection</h2>
              <p className="text-xs text-slate-500">Collect nominal ₹49 annual membership fee</p>
            </div>

            <div className="bg-gradient-to-br from-navy-950 to-slate-900 text-white rounded-2xl p-5 flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-400">Total Annual Fee</span>
                <p className="text-3xl font-extrabold">₹49.00</p>
              </div>
              <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                1 Year Validity
              </span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Select Payment Mode:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMode: "Cash" })}
                  className={`p-4 rounded-2xl border text-center transition ${
                    formData.paymentMode === "Cash"
                      ? "border-brand-500 bg-orange-50/60 font-bold text-brand-900"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-brand-500" />
                  <span className="text-xs block font-bold">Cash Collected</span>
                  <span className="text-[10px] text-slate-500">Collected ₹49 in cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMode: "Digital (UPI)" })}
                  className={`p-4 rounded-2xl border text-center transition ${
                    formData.paymentMode === "Digital (UPI)"
                      ? "border-brand-500 bg-orange-50/60 font-bold text-brand-900"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                  <span className="text-xs block font-bold">Digital / UPI</span>
                  <span className="text-[10px] text-slate-500">Paid via QR Scanner</span>
                </button>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between gap-3">
              <Button variant="outline" onClick={handleBack}>
                ← Back
              </Button>
              <Button
                size="lg"
                variant="primary"
                loading={loading}
                className="flex-1 shadow-orange-glow"
                onClick={handleSubmit}
              >
                Complete Registration (₹49)
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Success Screen */}
        {step === 5 && createdCard && (
          <div className="space-y-6 text-center py-2 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-navy-900">Registration Successful!</h2>
              <p className="text-xs text-slate-500">
                Health Mitra Unique Card ID has been issued
              </p>
            </div>

            {/* Generated Card Showcase */}
            <div className="flex justify-center">
              <HealthMitraCard
                cardholderName={createdCard.full_name}
                uniqueId={createdCard.unique_id}
                publicToken={createdCard.public_token}
                validUntil={createdCard.expiry_date}
                status="Active"
                className="scale-95 sm:scale-100"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Cardholder:</span>
                <strong className="text-navy-900">{createdCard.full_name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile SMS Pass:</span>
                <span className="text-emerald-700 font-bold">Sent to {createdCard.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Physical Card:</span>
                <span className="text-slate-700">Dispatch scheduled within 15 days</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  icon={Printer}
                  onClick={() => setPrintModalOpen(true)}
                >
                  Print Slip
                </Button>
                <Button
                  variant="outline"
                  icon={Share2}
                  onClick={() => showToast("Sent digital pass link via WhatsApp!", "success")}
                >
                  Share Pass
                </Button>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full shadow-orange-glow"
                icon={Plus}
                onClick={handleReset}
              >
                + Register Another Cardholder
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Print Slip Modal */}
      {printModalOpen && createdCard && (
        <Modal
          isOpen={printModalOpen}
          onClose={() => setPrintModalOpen(false)}
          title={`Print Pass: ${createdCard.full_name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <PrintableCard
              cardholderName={createdCard.full_name}
              uniqueId={createdCard.unique_id}
              publicToken={createdCard.public_token}
              validUntil={createdCard.expiry_date}
              status="Active"
              district={createdCard.district}
              issueDate={createdCard.issue_date}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setPrintModalOpen(false)}>
                Close
              </Button>
              <Button icon={Printer} onClick={() => window.print()}>
                Print Now
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
