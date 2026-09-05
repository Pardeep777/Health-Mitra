import React from "react";
import { ShieldCheck, Lock, CheckCircle2, EyeOff, FileText } from "lucide-react";

export function PrivacyPolicyPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          DPDPA 2023 Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
          Health Mitra Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: September 2026 • Policy Version 1.2 • Tripura, India
        </p>
      </div>

      {/* Summary Highlights */}
      <div className="bg-orange-50/60 border border-orange-200 rounded-3xl p-6 space-y-3">
        <h3 className="font-bold text-sm text-brand-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-600" /> Privacy & Confidentiality Commitments
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-950">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>We never sell or commercialize your personal data.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Public QR scans never show phone or address.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Only verified partners can process bill discounts.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Full compliance with India's DPDPA 2023 Act.</span>
          </li>
        </ul>
      </div>

      {/* Policy Clauses */}
      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">1. Information We Collect</h2>
          <p>
            When registering for a Health Mitra Smart Discount Card, we collect minimal necessary demographic information:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Full Name:</strong> To print on your physical membership card and display upon partner validation.</li>
            <li><strong>Mobile Number:</strong> To deliver your digital QR pass, receipt confirmations, and 30-day renewal reminders.</li>
            <li><strong>District & Locality:</strong> To connect you with nearby partner healthcare outlets in your region.</li>
            <li><strong>ID Proof Reference:</strong> Masked reference (e.g. last 4 digits) for fraud prevention. We do not store raw biometric or Aadhaar details.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">2. Purpose of Data Processing</h2>
          <p>
            Your information is processed strictly for:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Generating your unique Health Mitra membership identity and secure QR verification token.</li>
            <li>Facilitating counter discounts at authorized pharmacies, pathology labs, and clinics.</li>
            <li>Issuing physical smart card delivery through local distributor points within 15 days.</li>
            <li>Sending critical membership expiry and renewal notifications.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">3. Strict Public Verification Privacy Rule</h2>
          <p>
            Our QR verification architecture follows <em>privacy by design</em>. When a partner or third party scans your card QR code:
          </p>
          <div className="bg-slate-100 p-4 rounded-xl font-medium text-slate-800 space-y-1">
            <p className="text-emerald-700 font-bold">✓ Only Displayed: Cardholder Full Name, Card Status (Active/Expired), and Validity Dates.</p>
            <p className="text-rose-700 font-bold">✗ Strictly Hidden: Mobile Phone Number, Full Home Address, Identity Proofs, and Clinical Test Records.</p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">4. Data Security & Retention</h2>
          <p>
            All member records are encrypted at rest and in transit. Cardholder registration data is retained for the active lifecycle of the membership plus statutory accounting records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">5. Grievance Redressal & Data Protection Officer</h2>
          <p>
            For any queries regarding your data, consent withdrawal, or corrections, contact our Grievance Officer:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <p className="font-bold text-navy-900">Grievance Officer (DPDPA)</p>
            <p className="text-slate-600">Health Mitra Operations Centre, Akhaura Road, Agartala, West Tripura - 799001</p>
            <p className="text-slate-600">Email: <a href="mailto:privacy@healthmitra.demo" className="text-brand-600 font-semibold">privacy@healthmitra.demo</a></p>
          </div>
        </section>
      </div>
    </div>
  );
}
