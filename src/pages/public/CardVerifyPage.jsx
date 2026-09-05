import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  QrCode,
  Lock,
  Sparkles,
  Calendar,
  User,
  AlertCircle
} from "lucide-react";
import { verificationService } from "../../services/verificationService";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import logoImg from "../../assets/logo.png";

export function CardVerifyPage() {
  const [cardInput, setCardInput] = useState("HMC-7F38A21");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [simulatedCameraOpen, setSimulatedCameraOpen] = useState(false);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!cardInput.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await verificationService.verifyCard(cardInput);
      if (res.found) {
        setResult(res.cardholder);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("An error occurred while verifying the card. Please check the ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateQrScan = (token = "HM_PUBLIC_7F38A21_X92") => {
    setCardInput(token);
    setSimulatedCameraOpen(false);
    // Trigger verification directly
    setTimeout(() => {
      verificationService.verifyCard(token).then((res) => {
        if (res.found) setResult(res.cardholder);
      });
    }, 100);
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-brand-500 border border-orange-100 flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Verify Health Mitra Card
        </h1>
        <p className="text-slate-600 text-sm">
          Instant public verification for healthcare partners and cardholders. Confirm card validity and active status in real-time.
        </p>
      </div>

      {/* Verification Input Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Enter Unique Card ID or Public Token:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. HMC-7F38A21 or HM_PUBLIC_..."
                value={cardInput}
                onChange={(e) => setCardInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-sm font-mono font-bold text-navy-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>
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
              onClick={() => setSimulatedCameraOpen(true)}
              icon={QrCode}
              className="whitespace-nowrap"
            >
              Scan QR
            </Button>
          </div>
        </form>

        {/* Quick Demo ID suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">Sample Demo IDs:</span>
          <button
            type="button"
            onClick={() => {
              setCardInput("HMC-7F38A21");
            }}
            className="font-mono bg-slate-100 hover:bg-orange-50 hover:text-brand-600 px-2.5 py-1 rounded-lg border border-slate-200 font-bold transition"
          >
            HMC-7F38A21 (Active)
          </button>
          <button
            type="button"
            onClick={() => {
              setCardInput("HMC-2M44T89");
            }}
            className="font-mono bg-slate-100 hover:bg-amber-50 hover:text-amber-700 px-2.5 py-1 rounded-lg border border-slate-200 font-bold transition"
          >
            HMC-2M44T89 (Expiring Soon)
          </button>
          <button
            type="button"
            onClick={() => {
              setCardInput("HMC-9P28X44");
            }}
            className="font-mono bg-slate-100 hover:bg-rose-50 hover:text-rose-700 px-2.5 py-1 rounded-lg border border-slate-200 font-bold transition"
          >
            HMC-9P28X44 (Expired)
          </button>
        </div>
      </div>

      {/* Simulated QR Camera Modal */}
      {simulatedCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-brand-500" /> QR Code Scanner Simulator
              </h3>
              <button
                onClick={() => setSimulatedCameraOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="relative w-64 h-64 mx-auto bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-brand-500 text-white">
              <div className="absolute inset-4 border border-dashed border-brand-400/60 rounded-xl pointer-events-none" />
              <div className="w-full h-0.5 bg-brand-500 shadow-orange-glow animate-bounce" />
              <p className="text-[11px] text-slate-300 mt-4">Simulating camera optical feed...</p>
            </div>

            <p className="text-xs text-slate-500">Select a QR pass to scan immediately:</p>

            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSimulateQrScan("HM_PUBLIC_7F38A21_X92")}
              >
                Scan Rahul Sharma's QR
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSimulateQrScan("HM_PUBLIC_4K91B72_A18")}
              >
                Scan Priya Das's QR
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Result Display */}
      {result && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp">
          {/* Header Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Verification Successful</span>
                <h3 className="text-xl font-extrabold text-navy-900 flex items-center gap-2">
                  ✓ Card Verified
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                  result.status === "Active"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : result.status === "Expiring Soon"
                    ? "bg-amber-500 text-white"
                    : "bg-rose-500 text-white"
                }`}
              >
                {result.status}
              </span>
            </div>
          </div>

          {/* Minimal Privacy Safe Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Cardholder Name</span>
              <p className="text-lg font-bold text-navy-900 capitalize">{result.full_name}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Unique Card ID</span>
              <p className="text-lg font-mono font-bold text-brand-600">{result.unique_id}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Valid From</span>
              <p className="text-sm font-semibold text-slate-700">{result.issue_date}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Valid Until</span>
              <p className="text-sm font-bold text-navy-900">{result.expiry_date}</p>
            </div>
          </div>

          {/* Partner benefit confirmation banner */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <span className="leading-relaxed font-medium">
              This card is <strong>valid and eligible for Health Mitra partner discounts</strong> (Up to 20% on diagnostic tests & medicines) across all network outlets in Tripura.
            </span>
          </div>

          {/* Privacy Disclaimer Notice */}
          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-center gap-2 border border-slate-100">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              <strong>Privacy Protection:</strong> In compliance with DPDPA 2023, personal phone numbers, home addresses, and private medical histories are never displayed on public verification.
            </span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 rounded-3xl border border-rose-200 p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <XCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-rose-900">Card Not Found or Invalid</h3>
          <p className="text-xs text-rose-700 max-w-md mx-auto">{error}</p>
        </div>
      )}
    </div>
  );
}
