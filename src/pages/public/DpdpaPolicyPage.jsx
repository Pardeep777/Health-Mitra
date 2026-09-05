import React from "react";
import { ShieldCheck, Lock, Database, UserCheck, Key, FileCheck2 } from "lucide-react";

export function DpdpaPolicyPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Statutory Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
          DPDPA 2023 Data Architecture & Consent Policy
        </h1>
        <p className="text-xs text-slate-500">
          Technical Architecture & Compliance Framework under the Digital Personal Data Protection Act, 2023 (India)
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-500 flex items-center justify-center mb-2">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-navy-900">Explicit Consent</h3>
          <p className="text-xs text-slate-600">
            Every card enrollment requires unambiguous, affirmative user consent recorded with timestamp and version number.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <Key className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-navy-900">Non-Reversible Tokens</h3>
          <p className="text-xs text-slate-600">
            QRs encode synthetic public tokens (e.g., HM_PUBLIC_XXXX), shielding the internal database card ID from exposure.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-navy-900">Immutable Audit Trail</h3>
          <p className="text-xs text-slate-600">
            Every partner lookup, redemption event, and administrative access is logged with timestamp, user ID, and IP address.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">1. Data Principal Rights</h2>
          <p>
            Under DPDPA 2023, every Health Mitra cardholder (Data Principal) has the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Right to Information:</strong> Access a summary of their registration details and partner redemption history.</li>
            <li><strong>Right to Correction & Updating:</strong> Request correction of misspelled names, updated contact numbers, or changed addresses.</li>
            <li><strong>Right to Grievance Redressal:</strong> Dedicated response within 72 business hours from our Data Protection Officer.</li>
            <li><strong>Right to Nominate:</strong> Nominate family members to utilize healthcare discounts on their behalf.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">2. Role-Based Access Control (RBAC)</h2>
          <p>
            To prevent unauthorized data sharing across the healthcare network:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Field Agents:</strong> Can only view cardholders personally enrolled by their agent ID.</li>
            <li><strong>Healthcare Partners:</strong> Can only verify card validity and view their own store's redemption history. They cannot view patient transactions at other pharmacies.</li>
            <li><strong>District Coordinators:</strong> Access is geographically bounded to their assigned Tripura district.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">3. Breach Prevention & Incident Response</h2>
          <p>
            Health Mitra employs end-to-end HTTPS/TLS encryption, least-privilege administrative access, and real-time automated anomaly alerts to safeguard member records against unauthorized access.
          </p>
        </section>
      </div>
    </div>
  );
}
