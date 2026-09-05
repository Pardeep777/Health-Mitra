import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Sparkles,
  Calculator,
  ShieldCheck,
  CreditCard,
  Percent,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { faqsData } from "../../data/faqs";

export function PricingPage() {
  const [monthlyMedicineSpend, setMonthlyMedicineSpend] = useState(2500);
  const [annualTestSpend, setAnnualTestSpend] = useState(3000);

  // Approximate calculations: 15% on medicine, 20% on tests
  const medicineSavings = Math.round(monthlyMedicineSpend * 12 * 0.15);
  const testSavings = Math.round(annualTestSpend * 0.20);
  const totalAnnualSavings = medicineSavings + testSavings;
  const netBenefit = totalAnnualSavings - 49;

  const planFeatures = [
    "Up to 20% direct discount on pathology & diagnostic blood tests",
    "10% - 15% discount on branded & generic prescription medicines",
    "Up to 15% discount on nursing home bed charges & clinical procedures",
    "Instant cryptographic QR verification on physical PVC & mobile phone",
    "1-Year validity (365 days) from registration date",
    "Free doorstep delivery of physical smart card within 15 days",
    "Covers all family members presenting the card at partner desks",
    "DPDPA 2023 compliant — 100% confidential personal data"
  ];

  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Transparent Membership
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-900 tracking-tight">
          Simple, Affordable Healthcare Pricing
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          No hidden fees. No complicated tiers. Just one honest card designed to save Tripura families thousands of rupees on essential medical expenses.
        </p>
      </div>

      {/* Main Pricing Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Main Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border-2 border-brand-500 shadow-2xl relative flex flex-col justify-between">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-500 text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider">
            Most Popular & Community Friendly
          </div>

          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Official Annual Membership</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">Health Mitra Smart Card</h3>
              <p className="text-xs text-slate-500 mt-1">Valid across 100+ partner outlets in Tripura</p>

              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-5xl font-extrabold text-brand-500">₹49</span>
                <span className="text-sm font-semibold text-slate-500">/ year (all inclusive)</span>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Everything Included:</h4>
              <ul className="space-y-3">
                {planFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 mt-6 space-y-3">
            <Link to="/enquiry" className="block w-full">
              <Button size="lg" className="w-full shadow-orange-glow">
                Get Health Mitra Card Now (₹49)
              </Button>
            </Link>
            <p className="text-center text-[11px] text-slate-500 font-medium">
              ⚡ Instant digital pass generated + PVC card delivered in 15 days
            </p>
          </div>
        </div>

        {/* Savings Calculator Widget */}
        <div className="lg:col-span-5 bg-gradient-to-br from-navy-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 text-brand-400">
              <Calculator className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">Family ROI Calculator</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Estimate your family's annual savings using Health Mitra partner discounts.
            </p>

            {/* Slider 1: Monthly Medicine */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Monthly Medicine Expense</span>
                <span className="font-bold text-brand-400">₹{monthlyMedicineSpend} / mo</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={monthlyMedicineSpend}
                onChange={(e) => setMonthlyMedicineSpend(Number(e.target.value))}
                className="w-full accent-brand-500 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Avg 15% discount = ₹{medicineSavings}/yr saved</span>
            </div>

            {/* Slider 2: Annual Diagnostic Tests */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Annual Lab Tests & Diagnostics</span>
                <span className="font-bold text-brand-400">₹{annualTestSpend} / yr</span>
              </div>
              <input
                type="range"
                min="1000"
                max="20000"
                step="500"
                value={annualTestSpend}
                onChange={(e) => setAnnualTestSpend(Number(e.target.value))}
                className="w-full accent-brand-500 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Avg 20% discount = ₹{testSavings}/yr saved</span>
            </div>

            {/* Total Results Box */}
            <div className="bg-white/10 rounded-2xl p-5 border border-white/15 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Estimated Net Savings</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
                  ₹{totalAnnualSavings.toLocaleString()}
                </span>
                <span className="text-xs text-slate-300">/ year</span>
              </div>
              <p className="text-[11px] text-brand-300 font-medium">
                That's a {Math.round((totalAnnualSavings / 49) * 100)}% return on your ₹49 annual investment!
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Link to="/enquiry">
              <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                Start Saving Today →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-4xl mx-auto space-y-6 pt-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-navy-900">Pricing FAQs</h3>
          <p className="text-xs text-slate-500">Common questions about the ₹49 Health Mitra membership.</p>
        </div>

        <div className="divide-y divide-slate-200 border border-slate-200 bg-white rounded-2xl shadow-card overflow-hidden">
          {faqsData.slice(0, 4).map((faq) => (
            <div key={faq.id} className="p-5 space-y-1.5">
              <h4 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-500 shrink-0" />
                {faq.question}
              </h4>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
