import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, CheckCircle2, XCircle, ArrowLeft, Lock, Sparkles, Loader2 } from "lucide-react";
import logoImg from "../../assets/logo.png";
import { verificationService } from "../../services/verificationService";
import { Button } from "../../components/common/Button";

export function PublicQrVerifyPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setError("Missing QR token");
        setLoading(false);
        return;
      }
      try {
        const res = await verificationService.verifyCard(token);
        if (res.found) {
          setResult(res.cardholder);
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError("Failed to verify token.");
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3 pb-4 border-b border-slate-100">
          <img
            src={logoImg}
            alt="Health Mitra Logo"
            className="h-12 w-auto object-contain mx-auto"
          />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Official QR Verification Gateway
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Verifying secure QR cryptographic token...</p>
          </div>
        )}

        {/* Success State */}
        {!loading && result && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                ✓ VERIFIED
              </span>
              <h3 className="text-xl font-extrabold text-navy-900">Health Mitra Card</h3>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3 text-xs">
              <div className="flex justify-between items-baseline border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 uppercase font-semibold">Cardholder:</span>
                <span className="text-sm font-bold text-navy-900 capitalize">{result.full_name}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 uppercase font-semibold">Card Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    result.status === "Active"
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {result.status}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 uppercase font-semibold">Valid From:</span>
                <span className="font-semibold text-slate-800">{result.issue_date}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 uppercase font-semibold">Valid Until:</span>
                <span className="font-bold text-navy-900">{result.expiry_date}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 border border-emerald-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span className="leading-tight">
                This card is <strong>valid and eligible for Health Mitra partner benefits</strong> (up to 20% discount).
              </span>
            </div>

            {/* Privacy rule notice */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 justify-center">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>DPDPA 2023 Protected. No sensitive PII exposed.</span>
            </div>

            <div className="pt-2">
              <Link to="/verify" className="block w-full">
                <Button variant="outline" size="md" className="w-full">
                  Verify Another Card
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-rose-900">Verification Failed</h3>
            <p className="text-xs text-rose-700">{error}</p>
            <Link to="/verify" className="inline-block pt-2">
              <Button size="sm">Search by Unique Card ID</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="text-center mt-6">
        <Link to="/" className="text-xs text-slate-500 hover:text-navy-900 flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back to Health Mitra Home
        </Link>
      </div>
    </div>
  );
}
