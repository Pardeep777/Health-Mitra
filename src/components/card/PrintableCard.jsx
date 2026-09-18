import React from "react";
import { QRCodeSVG } from "qrcode.react";
import logoImg from "../../assets/logo.png";
import { ShieldCheck, Phone, CheckCircle2, Scissors, Sparkles, HeartPulse, Building2 } from "lucide-react";

/**
 * Opens a dedicated high-fidelity Printable Card Document in a new print window
 */
export function printCardDocument({
  cardholderName = "Member",
  uniqueId = "HMC-000000",
  publicToken = "",
  validUntil = "1 Year",
  status = "Active",
  district = "West Tripura",
  issueDate = new Date().toISOString().split("T")[0]
}) {
  const printWin = window.open("", "_blank", "width=900,height=800");
  if (!printWin) {
    window.print();
    return;
  }

  const token = publicToken || uniqueId;
  const verifyUrl = `${window.location.origin}/verify/${token}`;
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(verifyUrl)}`;

  const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Health Mitra Card — ${uniqueId} — ${cardholderName}</title>
    <meta charset="utf-8" />
    <style>
      @page {
        size: A4 portrait;
        margin: 15mm;
      }
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        color: #0f172a;
        margin: 0;
        padding: 20px;
        background: #ffffff;
      }
      .no-print {
        margin-bottom: 24px;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      .btn {
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
        border: none;
      }
      .btn-primary {
        background: #f97316;
        color: #ffffff;
      }
      .btn-secondary {
        background: #e2e8f0;
        color: #334155;
      }
      .doc-header {
        text-align: center;
        border-bottom: 2px solid #f97316;
        padding-bottom: 14px;
        margin-bottom: 24px;
      }
      .doc-title {
        font-size: 22px;
        font-weight: 900;
        color: #0f172a;
        letter-spacing: 0.5px;
      }
      .doc-sub {
        font-size: 12px;
        color: #f97316;
        font-weight: 700;
        margin-top: 4px;
      }
      .doc-note {
        font-size: 11px;
        color: #64748b;
        margin-top: 6px;
      }
      .cards-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: stretch;
        gap: 20px;
        margin: 24px auto;
        max-width: 720px;
      }
      .card-box {
        width: 340px;
        height: 215px;
        border-radius: 14px;
        padding: 16px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }
      .card-front {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #ffffff;
        border: 2px solid #ea580c;
      }
      .card-back {
        background: #f8fafc;
        color: #0f172a;
        border: 2px dashed #94a3b8;
      }
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.15);
        padding-bottom: 8px;
      }
      .brand-badge {
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.5px;
        color: #ffffff;
      }
      .brand-sub {
        font-size: 8px;
        color: #fdba74;
        text-transform: uppercase;
        font-weight: 700;
      }
      .price-pill {
        background: #f97316;
        color: #ffffff;
        font-size: 10px;
        font-weight: 800;
        padding: 2px 8px;
        border-radius: 9999px;
      }
      .card-body {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: auto 0;
      }
      .card-details {
        flex: 1;
      }
      .label-sm {
        font-size: 8px;
        color: #94a3b8;
        text-transform: uppercase;
        font-weight: 600;
        margin-bottom: 2px;
      }
      .val-name {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
        text-transform: capitalize;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 190px;
      }
      .val-id {
        font-family: monospace;
        font-size: 12px;
        font-weight: 800;
        color: #fb923c;
      }
      .val-expiry {
        font-size: 11px;
        font-weight: 700;
        color: #e2e8f0;
      }
      .qr-wrapper {
        background: #ffffff;
        padding: 4px;
        border-radius: 8px;
        display: inline-flex;
      }
      .card-footer {
        display: flex;
        justify-content: space-between;
        font-size: 8px;
        color: #94a3b8;
        border-top: 1px solid rgba(255,255,255,0.1);
        padding-top: 6px;
      }
      .back-title {
        font-size: 11px;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .back-list {
        font-size: 9px;
        color: #334155;
        margin: 0;
        padding-left: 14px;
        line-height: 1.5;
      }
      .back-footer {
        border-top: 1px solid #e2e8f0;
        padding-top: 6px;
        display: flex;
        justify-content: space-between;
        font-size: 8px;
        color: #64748b;
      }
      .cut-guide {
        text-align: center;
        font-size: 10px;
        color: #94a3b8;
        margin: 16px 0;
        font-style: italic;
      }
      .info-section {
        max-width: 720px;
        margin: 30px auto 0;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px 20px;
        font-size: 11px;
        color: #475569;
        line-height: 1.6;
      }
      .info-title {
        font-weight: 800;
        color: #0f172a;
        font-size: 12px;
        margin-bottom: 6px;
      }
      @media print {
        .no-print { display: none !important; }
        body { padding: 0 !important; }
      }
    </style>
  </head>
  <body>
    <div class="no-print">
      <button class="btn btn-primary" onclick="window.print()">🖨️ Print / Save as PDF</button>
      <button class="btn btn-secondary" onclick="window.close()">Close</button>
    </div>

    <div class="doc-header">
      <div class="doc-title">HEALTH MITRA (TRIPURA)</div>
      <div class="doc-sub">OFFICIAL SMART HEALTHCARE PASS — ANNUAL MEMBERSHIP SLIP</div>
      <div class="doc-note">Fold in center or cut along the borders to fit standard wallet / ID pass holder.</div>
    </div>

    <div class="cut-guide">✂ - - - - - - - - - - - - - - - - - - CUT OR FOLD ALONG THIS LINE - - - - - - - - - - - - - - - - - - ✂</div>

    <div class="cards-container">
      <!-- FRONT SIDE -->
      <div class="card-box card-front">
        <div class="card-header">
          <div>
            <div class="brand-badge">HEALTH MITRA</div>
            <div class="brand-sub">Smart Healthcare Discount Card</div>
          </div>
          <div class="price-pill">₹49 / YEAR</div>
        </div>

        <div class="card-body">
          <div class="card-details">
            <div style="margin-bottom: 6px;">
              <div class="label-sm">Cardholder Name</div>
              <div class="val-name">${cardholderName}</div>
            </div>
            <div style="display: flex; gap: 14px;">
              <div>
                <div class="label-sm">Card ID</div>
                <div class="val-id">${uniqueId}</div>
              </div>
              <div>
                <div class="label-sm">Valid Until</div>
                <div class="val-expiry">${validUntil}</div>
              </div>
            </div>
          </div>
          <div class="qr-wrapper">
            <img src="${qrSvgUrl}" width="68" height="68" alt="QR" />
          </div>
        </div>

        <div class="card-footer">
          <span>District: ${district}</span>
          <span>Up to 20% Partner Discount</span>
        </div>
      </div>

      <!-- BACK SIDE -->
      <div class="card-box card-back">
        <div>
          <div class="back-title">🛡️ Terms & Membership Privileges</div>
          <ul class="back-list">
            <li>Present card or QR at any registered hospital, lab & pharmacy.</li>
            <li>Get up to 20% discount on diagnostic tests and 10-15% on medicines.</li>
            <li>Valid for 365 days across all 8 districts of Tripura.</li>
            <li>Instant scan verification active at all partner counters.</li>
          </ul>
        </div>

        <div class="back-footer">
          <span>📞 Helpline: 1800-MITRA-CARE</span>
          <span>Issue: ${issueDate}</span>
        </div>
      </div>
    </div>

    <div class="cut-guide">✂ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ✂</div>

    <div class="info-section">
      <div class="info-title">How to use your Health Mitra Smart Card:</div>
      <div>1. <strong>At Pharmacy Counters:</strong> Show this physical card or QR code before billing to receive instant discounted medicine rates.</div>
      <div>2. <strong>At Diagnostic Clinics / Hospitals:</strong> Present this pass at the reception for OPD consultation and pathological tests discounts.</div>
      <div>3. <strong>Instant Digital Verification:</strong> Anyone can scan the QR code using their smartphone camera to verify active validity in real-time.</div>
      <div style="margin-top: 8px; font-weight: 700; color: #f97316;">Emergency Support Desk: 1800-MITRA-CARE (Toll Free) • www.healthmitra.demo</div>
    </div>
  </body>
</html>`;

  printWin.document.open();
  printWin.document.write(html);
  printWin.document.close();
}

/**
 * In-Modal Live Printable Card Component
 */
export function PrintableCard({
  cardholderName = "Rahul Sharma",
  uniqueId = "HMC-7F38A21",
  publicToken = "HM_PUBLIC_7F38A21_X92",
  validUntil = "01 Sep 2027",
  status = "Active",
  district = "West Tripura",
  issueDate = "02 Sep 2026"
}) {
  const token = publicToken || uniqueId;
  const verifyUrl = `${window.location.origin}/verify/${token}`;

  return (
    <div id="printable-card-area" className="p-2 sm:p-4 bg-white max-w-4xl mx-auto space-y-4">
      {/* Top Banner */}
      <div className="text-center pb-3 border-b border-slate-200">
        <h2 className="text-base sm:text-lg font-extrabold text-navy-900">
          Health Mitra Smart Healthcare Card (Print Slip)
        </h2>
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-0.5">
          <Scissors className="w-3.5 h-3.5 text-brand-500" />
          Official Membership Document — Cut or fold along the dashed lines
        </p>
      </div>

      {/* Side-by-side card preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* Front Side */}
        <div className="border-2 border-dashed border-brand-500/80 rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-navy-900 text-white relative shadow-md flex flex-col justify-between aspect-[1.586/1] min-h-[220px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="Health Mitra" className="h-7 w-auto bg-white rounded p-0.5 shadow-sm" />
              <div>
                <span className="text-xs font-black uppercase tracking-wider block text-white">Health Mitra</span>
                <span className="text-[8px] text-brand-300 uppercase font-bold block">Smart Discount Card</span>
              </div>
            </div>
            <span className="text-[10px] bg-brand-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase shadow-sm">
              ₹49/Yr
            </span>
          </div>

          {/* Body */}
          <div className="grid grid-cols-12 gap-2 my-auto items-center py-2">
            <div className="col-span-8 space-y-2">
              <div>
                <span className="text-[8px] text-slate-400 uppercase font-semibold block">Cardholder</span>
                <p className="text-sm sm:text-base font-extrabold text-white capitalize truncate">{cardholderName}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-[8px] text-slate-400 uppercase font-semibold block">Card ID</span>
                  <p className="text-xs font-mono font-bold text-brand-400">{uniqueId}</p>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 uppercase font-semibold block">Valid Thru</span>
                  <p className="text-xs font-bold text-slate-200">{validUntil}</p>
                </div>
              </div>
            </div>
            <div className="col-span-4 flex justify-end">
              <div className="p-1.5 bg-white rounded-xl shadow-md border border-white/40">
                <QRCodeSVG value={verifyUrl} size={68} level="M" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-white/10 pt-2 font-medium">
            <span>District: {district}</span>
            <span className="text-brand-300 font-bold">Up to 20% Partner Discount</span>
          </div>
        </div>

        {/* Back Side */}
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 sm:p-5 bg-slate-50 text-slate-800 flex flex-col justify-between aspect-[1.586/1] min-h-[220px] shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
              <h4 className="text-xs font-extrabold text-navy-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-500" /> Terms & Benefits
              </h4>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Verified Pass
              </span>
            </div>
            <ul className="text-[10px] text-slate-600 space-y-1.5 list-disc pl-3.5 leading-relaxed">
              <li>Present card or QR code at partner clinics & pharmacies across Tripura.</li>
              <li>Avail up to 20% discount on diagnostic tests and 10-15% on medicines.</li>
              <li>Non-transferable. Valid for 365 days from issue date.</li>
              <li>Instant verification available at <strong>healthmitra.demo/verify</strong></li>
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[9px] text-slate-500">
            <span className="flex items-center gap-1 font-bold text-slate-700">
              <Phone className="w-3 h-3 text-brand-500" /> Helpline: 1800-MITRA-CARE
            </span>
            <span>Issue Date: {issueDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
