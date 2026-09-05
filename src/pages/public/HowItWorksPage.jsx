import React from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Search,
  QrCode,
  Percent,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { HealthMitraCard } from "../../components/card/HealthMitraCard";

export function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Register & Get Your Unique Card",
      summary: "Quick 2-minute enrollment at just ₹49/year with full DPDPA consent.",
      details: [
        "Meet any authorized Health Mitra Field Agent in your locality or submit an online request.",
        "Provide basic details: Name, Mobile number, and District.",
        "Receive your dynamic Unique ID (e.g. HMC-7F38A21) and cryptographic digital QR card instantly on WhatsApp/SMS.",
        "Physical PVC card is delivered directly within 15 days of onboarding."
      ],
      icon: CreditCard,
      badge: "Step 1 • Enrollment"
    },
    {
      step: "02",
      title: "Find a Verified Healthcare Partner",
      summary: "Access 100+ partner pharmacies, pathology labs, and nursing homes across Tripura.",
      details: [
        "Open the Health Mitra online directory to locate partner outlets near your town or village.",
        "Filter by category: Pharmacy, Pathology Lab, Nursing Home, or Hospital.",
        "View participating services, opening hours, and maximum discount rates (up to 20%)."
      ],
      icon: Search,
      badge: "Step 2 • Discovery"
    },
    {
      step: "03",
      title: "Present Your Card at the Billing Counter",
      summary: "Show either your physical PVC card or digital QR code on your mobile phone.",
      details: [
        "Hand over your card or show your digital pass before payment.",
        "The partner scans your QR code or enters your Unique Card ID into their secure portal.",
        "Instant validation confirms your active membership without exposing your private phone or medical records."
      ],
      icon: QrCode,
      badge: "Step 3 • Verification"
    },
    {
      step: "04",
      title: "Enjoy Direct Bill Discounts & Savings",
      summary: "Immediate reduction applied on your total bill amount at checkout.",
      details: [
        "Partner applies 10% to 20% discount on tests, medicines, or procedures.",
        "Pay only the reduced net amount via Cash or UPI.",
        "Receive an SMS confirmation acknowledging your savings."
      ],
      icon: Percent,
      badge: "Step 4 • Savings"
    }
  ];

  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Operational Lifecycle
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-900 tracking-tight">
          How Health Mitra Works
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          From fast registration to seamless counter discounts, our 4-step system is built for speed, transparency, and data privacy.
        </p>
      </div>

      {/* Interactive 4-step detailed cards */}
      <div className="space-y-12">
        {steps.map((s, index) => {
          const Icon = s.icon;
          const isEven = index % 2 === 1;

          return (
            <div
              key={s.step}
              className={`flex flex-col ${
                isEven ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card`}
            >
              {/* Left Content */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-extrabold text-brand-500 font-mono">{s.step}</span>
                  <span className="text-xs font-bold text-brand-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                    {s.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-navy-900">{s.title}</h3>
                <p className="text-sm font-semibold text-slate-700">{s.summary}</p>

                <ul className="space-y-2.5 pt-2">
                  {s.details.map((d, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Visual Graphic */}
              <div className="w-full lg:w-5/12 flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                {index === 0 ? (
                  <HealthMitraCard
                    cardholderName="Rahul Sharma"
                    uniqueId="HMC-7F38A21"
                    validUntil="01 Sep 2027"
                    status="Active"
                    className="max-w-xs scale-90 sm:scale-100"
                  />
                ) : (
                  <div className="text-center space-y-3 py-6">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white flex items-center justify-center mx-auto shadow-orange-glow">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-navy-900 text-sm">{s.title}</h4>
                    <p className="text-xs text-slate-500 max-w-xs">{s.summary}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Privacy Guarantee Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-brand-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" /> PRIVACY GUARANTEE (DPDPA 2023)
          </div>
          <h3 className="text-xl font-bold text-white">Your Medical Data Remains 100% Confidential</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Health Mitra QR verification code only verifies that your card is Active and Valid. It never exposes your phone number, Aadhaar number, or medical records to anyone.
          </p>
        </div>
        <Link to="/dpdpa">
          <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
            Read Data Policy
          </Button>
        </Link>
      </div>

      {/* CTA Box */}
      <div className="text-center space-y-4 pt-4">
        <h2 className="text-2xl font-bold text-navy-900">Ready to Start Saving on Healthcare?</h2>
        <div className="flex justify-center gap-3">
          <Link to="/enquiry">
            <Button size="lg">Get Your Card (₹49/Yr)</Button>
          </Link>
          <Link to="/partners">
            <Button variant="outline" size="lg">Explore Partners</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
