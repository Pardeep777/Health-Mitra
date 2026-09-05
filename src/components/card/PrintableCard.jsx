import React from "react";
import { QRCodeSVG } from "qrcode.react";
import logoImg from "../../assets/logo.png";
import { ShieldCheck, Phone, CheckCircle2 } from "lucide-react";

export function PrintableCard({
  cardholderName = "Rahul Sharma",
  uniqueId = "HMC-7F38A21",
  publicToken = "HM_PUBLIC_7F38A21_X92",
  validUntil = "01 Sep 2027",
  status = "Active",
  district = "West Tripura",
  issueDate = "02 Sep 2026"
}) {
  const verifyUrl = `${window.location.origin}/verify/${publicToken || uniqueId}`;

  return (
    <div id="printable-card-area" className="p-4 bg-white max-w-2xl mx-auto space-y-6">
      <div className="text-center pb-2 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">Health Mitra Smart Healthcare Card (Print Slip)</h2>
        <p className="text-xs text-slate-500">Official Membership Document — Cut along the dashed line</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Front Side */}
        <div className="border-2 border-dashed border-brand-500 rounded-2xl p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-navy-900 text-white relative shadow-sm aspect-[1.586/1] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/15 pb-2">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="Health Mitra" className="h-8 w-auto bg-white rounded p-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block">Health Mitra</span>
                <span className="text-[8px] text-brand-300 uppercase block">Discount Card</span>
              </div>
            </div>
            <span className="text-[9px] bg-brand-500 text-white font-bold px-2 py-0.5 rounded-full uppercase">
              ₹49/Yr
            </span>
          </div>

          <div className="grid grid-cols-12 gap-2 my-auto items-center">
            <div className="col-span-8 space-y-1.5">
              <div>
                <span className="text-[8px] text-slate-400 uppercase">Cardholder</span>
                <p className="text-sm font-bold text-white capitalize">{cardholderName}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-[8px] text-slate-400 uppercase">Card ID</span>
                  <p className="text-xs font-mono font-bold text-brand-400">{uniqueId}</p>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 uppercase">Valid Until</span>
                  <p className="text-xs font-bold text-slate-200">{validUntil}</p>
                </div>
              </div>
            </div>
            <div className="col-span-4 flex justify-end">
              <div className="p-1 bg-white rounded-lg">
                <QRCodeSVG value={verifyUrl} size={60} level="M" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] text-slate-400 border-t border-white/10 pt-1.5">
            <span>District: {district}</span>
            <span>Up to 20% Partner Discount</span>
          </div>
        </div>

        {/* Back Side */}
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 bg-slate-50 text-slate-800 aspect-[1.586/1] flex flex-col justify-between shadow-sm">
          <div>
            <h4 className="text-xs font-bold text-navy-900 mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-500" /> Terms of Benefits
            </h4>
            <ul className="text-[9px] text-slate-600 space-y-1 list-disc pl-3">
              <li>Presents card or QR code at partner pharmacies & labs across Tripura.</li>
              <li>Avail up to 20% discount on tests & 10-15% on medicines.</li>
              <li>Non-transferable. Valid for 1 year from issue date.</li>
              <li>Verification available at healthmitra.demo/verify</li>
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[8px] text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Phone className="w-2.5 h-2.5 text-brand-500" /> Helpline: 1800-MITRA-CARE
            </span>
            <span>Issue Date: {issueDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
