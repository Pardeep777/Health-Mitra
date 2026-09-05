import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  QrCode,
  Percent,
  Sparkles,
  Receipt,
  Printer,
  Check,
  Calendar,
  IndianRupee,
  Clock
} from "lucide-react";
import { verificationService } from "../../services/verificationService";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

export function PartnerVerifyPage() {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();

  const [query, setQuery] = useState("HMC-7F38A21");
  const [loading, setLoading] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState(null);
  const [error, setError] = useState(null);

  // Discount modal state
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [serviceName, setServiceName] = useState("Prescription Medicines (Antibiotics/Chronic)");
  const [originalAmount, setOriginalAmount] = useState(1000);
  const [discountPercent, setDiscountPercent] = useState(15);
  const [redemptionSuccess, setRedemptionSuccess] = useState(null);
  const [recordingLoading, setRecordingLoading] = useState(false);

  const discountAmount = Math.round((originalAmount * discountPercent) / 100);
  const finalPayable = originalAmount - discountAmount;

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setVerifiedResult(null);

    try {
      const res = await verificationService.verifyCard(query);
      if (res.found) {
        setVerifiedResult({
          ...res.cardholder,
          verificationTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        });
      } else {
        setError(res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDiscount = async () => {
    if (!verifiedResult) return;
    setRecordingLoading(true);
    try {
      const payload = {
        card_id: verifiedResult.unique_id,
        cardholder_name: verifiedResult.full_name,
        partner_id: currentUser?.partner_id || "PART-1001",
        partner_name: currentUser?.partner_name || "Mitra Pharmacy & Healthcare",
        service_name: serviceName,
        bill_amount: Number(originalAmount),
        discount_percent: Number(discountPercent),
        discount_amount: discountAmount,
        final_amount: finalPayable,
        verified_by: currentUser?.name || "Pharmacist on Duty",
        verification_method: query.startsWith("HM_PUBLIC") ? "QR_SCAN" : "UNIQUE_ID"
      };

      const res = await verificationService.recordRedemption(payload);
      setRedemptionSuccess(res);
      showToast(`Recorded ₹${discountAmount} discount for ${verifiedResult.full_name}!`, "success");
    } finally {
      setRecordingLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-navy-900">Verify Patient Card & Apply Discount</h2>
        <p className="text-xs text-slate-500">
          Enter cardholder's Unique ID or scan their QR pass to validate active membership and record bill savings.
        </p>
      </div>

      {/* Input Search Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
        <form onSubmit={handleVerify} className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Cardholder Unique ID or QR Code:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. HMC-7F38A21"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm font-mono font-bold text-navy-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="shadow-orange-glow whitespace-nowrap"
            >
              Verify Card
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setQuery("HM_PUBLIC_7F38A21_X92");
                verificationService.verifyCard("HM_PUBLIC_7F38A21_X92").then((r) => {
                  if (r.found) {
                    setVerifiedResult({
                      ...r.cardholder,
                      verificationTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    });
                  }
                });
              }}
              icon={QrCode}
              className="whitespace-nowrap"
            >
              Scan QR Code
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
          <span>Quick Demo:</span>
          <button
            onClick={() => setQuery("HMC-7F38A21")}
            className="font-mono bg-slate-100 px-2 py-0.5 rounded text-brand-600 font-bold hover:bg-slate-200"
          >
            HMC-7F38A21 (Rahul Sharma)
          </button>
          <button
            onClick={() => setQuery("HMC-4K91B72")}
            className="font-mono bg-slate-100 px-2 py-0.5 rounded text-brand-600 font-bold hover:bg-slate-200"
          >
            HMC-4K91B72 (Priya Das)
          </button>
        </div>
      </div>

      {/* Verification Result Card */}
      {verifiedResult && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 sm:p-8 shadow-xl space-y-6 animate-scaleUp">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  ✓ Valid Health Mitra Card
                </span>
                <h3 className="text-xl font-extrabold text-navy-900 mt-1 capitalize">
                  {verifiedResult.full_name}
                </h3>
              </div>
            </div>

            <Badge variant="success" size="md">
              {verifiedResult.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 uppercase font-semibold">Card ID</span>
              <p className="font-mono font-bold text-brand-600 text-sm">{verifiedResult.unique_id}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 uppercase font-semibold">Valid Until</span>
              <p className="font-bold text-navy-900 text-sm">{verifiedResult.expiry_date}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 uppercase font-semibold">Discount Eligibility</span>
              <p className="font-bold text-emerald-700 text-sm">Up to 20% OFF</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 uppercase font-semibold">Verification Time</span>
              <p className="font-semibold text-slate-700 text-sm">{verifiedResult.verificationTime}</p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-emerald-900">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Cardholder is actively eligible for partner discounts on pharmacy & lab tests.</span>
            </div>
            <Button
              size="md"
              variant="primary"
              className="shadow-orange-glow whitespace-nowrap w-full sm:w-auto"
              onClick={() => {
                setRedemptionSuccess(null);
                setDiscountModalOpen(true);
              }}
              icon={Percent}
            >
              Record Bill Discount
            </Button>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 rounded-3xl border border-rose-200 p-6 text-center space-y-2">
          <XCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="font-bold text-rose-900">Card Verification Unsuccessful</h3>
          <p className="text-xs text-rose-700">{error}</p>
        </div>
      )}

      {/* Discount Redemption Modal */}
      <Modal
        isOpen={discountModalOpen}
        onClose={() => setDiscountModalOpen(false)}
        title="Record Healthcare Discount Bill"
        subtitle={`Patient: ${verifiedResult?.full_name} (${verifiedResult?.unique_id})`}
        maxWidth="max-w-lg"
      >
        {!redemptionSuccess ? (
          <div className="space-y-4">
            <Select
              label="Healthcare Service Category"
              options={[
                { label: "Prescription Medicines & Surgical", value: "Prescription Medicines (Antibiotics/Chronic)" },
                { label: "Pathology Blood & Urine Diagnostics", value: "Pathology & Blood Diagnostics" },
                { label: "Specialist Consultation / OPD", value: "Specialist Doctor Consultation" },
                { label: "Daycare Nursing / Minor OT", value: "Daycare Nursing / Minor OT" }
              ]}
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Original Bill Amount (₹)"
                type="number"
                value={originalAmount}
                onChange={(e) => setOriginalAmount(Number(e.target.value))}
                required
              />
              <Input
                label="Partner Discount (%)"
                type="number"
                min="5"
                max="25"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                required
              />
            </div>

            {/* Calculations Breakdown Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Original Bill Total:</span>
                <span className="font-semibold text-slate-800">₹{originalAmount}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Health Mitra Discount ({discountPercent}%):</span>
                <span>- ₹{discountAmount}</span>
              </div>
              <div className="flex justify-between text-navy-900 text-sm font-extrabold border-t border-slate-200 pt-2">
                <span>Customer Pays:</span>
                <span className="text-brand-600">₹{finalPayable}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDiscountModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                loading={recordingLoading}
                onClick={handleConfirmDiscount}
              >
                Confirm Discount & Issue Receipt
              </Button>
            </div>
          </div>
        ) : (
          /* Receipt Success State */
          <div className="space-y-5 text-center py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-navy-900">Discount Recorded Successfully!</h3>
              <p className="text-xs font-mono text-slate-500">Receipt No: {redemptionSuccess.receipt_no}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <strong className="text-navy-900">{redemptionSuccess.cardholder_name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="text-slate-800 font-medium">{redemptionSuccess.service_name}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Savings Applied:</span>
                <span>₹{redemptionSuccess.discount_amount} ({redemptionSuccess.discount_percent}%)</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1 text-navy-900 font-bold">
                <span>Net Collected:</span>
                <span>₹{redemptionSuccess.final_amount}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setDiscountModalOpen(false)}>
                Close
              </Button>
              <Button
                size="sm"
                icon={Printer}
                onClick={() => {
                  showToast("Discount receipt printed!", "info");
                  setDiscountModalOpen(false);
                }}
              >
                Print Receipt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
