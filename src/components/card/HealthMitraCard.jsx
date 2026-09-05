import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, Sparkles, HeartPulse, CreditCard } from "lucide-react";
import logoImg from "../../assets/logo.png";

export function HealthMitraCard({
  cardholderName = "Rahul Sharma",
  uniqueId = "HMC-7F38A21",
  publicToken = "HM_PUBLIC_7F38A21_X92",
  validUntil = "01 Sep 2027",
  status = "Active",
  className = "",
  showQr = true,
  interactive = false
}) {
  const statusColors = {
    Active: "bg-emerald-500 text-white",
    "Expiring Soon": "bg-amber-500 text-white",
    Expired: "bg-rose-500 text-white",
    Renewed: "bg-purple-600 text-white",
    Pending: "bg-blue-500 text-white"
  };

  const verifyUrl = `${window.location.origin}/verify/${publicToken || uniqueId}`;

  return (
    <div
      className={`relative w-full max-w-md aspect-[1.586/1] rounded-3xl p-6 text-white shadow-2xl overflow-hidden border border-white/20 transition-all duration-300 ${
        interactive ? "hover:scale-[1.02] hover:shadow-orange-glow cursor-pointer" : ""
      } ${className}`}
      style={{
        background: "linear-gradient(135deg, #111827 0%, #0F172A 50%, #1E293B 100%)"
      }}
    >
      {/* Decorative Brand Accent Background Curves */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-500/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl pointer-events-none -ml-12 -mb-12" />
      
      {/* Geometric lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Card Header */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="Health Mitra Logo"
            className="h-10 w-auto object-contain bg-white/95 rounded-lg px-2 py-1 shadow-sm"
          />
          <div>
            <h3 className="text-sm font-extrabold tracking-wider uppercase text-white drop-shadow-sm flex items-center gap-1.5">
              Health Mitra
            </h3>
            <p className="text-[10px] text-brand-300 font-medium tracking-wide uppercase">Smart Healthcare Discount Card</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm ${
              statusColors[status] || statusColors.Active
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="relative z-10 grid grid-cols-12 gap-3 mt-4 items-center">
        {/* Left Info */}
        <div className="col-span-8 space-y-3">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Cardholder Name</span>
            <p className="text-base font-bold text-white tracking-wide truncate capitalize">{cardholderName}</p>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <span className="text-[9px] uppercase font-semibold text-slate-400 tracking-wider">Card ID</span>
              <p className="text-xs font-mono font-bold text-brand-400 tracking-wider">{uniqueId}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-semibold text-slate-400 tracking-wider">Valid Thru</span>
              <p className="text-xs font-bold text-slate-200">{validUntil}</p>
            </div>
          </div>

          {/* Pricing & Benefit Pill */}
          <div className="flex items-center gap-2 pt-1">
            <span className="bg-brand-500/20 text-brand-300 border border-brand-500/30 text-[9px] font-bold px-2 py-0.5 rounded-md">
              ₹49 / YEAR
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> UP TO 20% OFF
            </span>
          </div>
        </div>

        {/* Right QR Section */}
        {showQr && (
          <div className="col-span-4 flex flex-col items-center justify-center">
            <div className="p-1.5 bg-white rounded-xl shadow-lg border border-white/30">
              <QRCodeSVG
                value={verifyUrl}
                size={76}
                level="M"
                includeMargin={false}
              />
            </div>
            <span className="text-[8px] font-mono text-slate-400 mt-1 uppercase tracking-tighter">Scan to Verify</span>
          </div>
        )}
      </div>

      {/* Card Footer Micro-strip */}
      <div className="absolute bottom-2 left-6 right-6 flex items-center justify-between text-[9px] text-slate-400 font-medium">
        <span className="flex items-center gap-1 text-slate-300">
          <ShieldCheck className="w-3 h-3 text-brand-400" /> Community Healthcare Card
        </span>
        <span>Tripura Network (100+ Outlets)</span>
      </div>
    </div>
  );
}
