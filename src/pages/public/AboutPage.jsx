import React from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  ShieldCheck,
  Users,
  Target,
  CheckCircle2,
  Building2,
  Sparkles,
  Award
} from "lucide-react";
import { Button } from "../../components/common/Button";

export function AboutPage() {
  const pillars = [
    {
      title: "Affordable Healthcare Access",
      desc: "By capping annual card costs at just ₹49/year, we remove the financial barrier to accessing quality preventive and diagnostic healthcare.",
      icon: HeartPulse
    },
    {
      title: "Verified Healthcare Network",
      desc: "We curate and verify licensed pharmacies, accredited pathology labs, and clinical centers to provide reliable, guaranteed discounts.",
      icon: Building2
    },
    {
      title: "Digital & Paperless Verification",
      desc: "Our low-bandwidth QR verification technology enables instant counter redemptions even in areas with patchy mobile internet connectivity.",
      icon: ShieldCheck
    },
    {
      title: "Community-First Sustainable Model",
      desc: "Empowering 80+ rural field agents and 50 distributor points with dignified livelihood opportunities while serving their neighbors.",
      icon: Users
    }
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Our Story & Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-900 tracking-tight leading-tight">
          Making Healthcare Dignified & Affordable for Every Family in Tripura
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Health Mitra is a community healthcare discount card initiative created to reduce out-of-pocket medical expenditure for working families, senior citizens, and underserved communities.
        </p>
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-4 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-navy-900">Why Health Mitra was Created</h2>
          <p>
            In Tripura and throughout the North-East, out-of-pocket healthcare expenses — particularly routine chronic medicines for diabetes and hypertension, together with essential diagnostic blood tests — represent a major burden on family savings.
          </p>
          <p>
            While major insurance programs cover catastrophic hospital admissions, day-to-day outpatient expenses, pharmacy bills, and routine checkups remain almost entirely self-funded.
          </p>
          <p>
            Health Mitra solves this by partnering directly with local pharmacies and pathology labs who agree to extend transparent 10% to 20% discounts to cardholders in exchange for increased, consistent customer volume.
          </p>
        </div>

        <div className="lg:col-span-6 bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Our 3-Year Vision (Tripura)
          </span>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-extrabold">5,00,000</p>
              <p className="text-xs text-white/80">Year 1 Target Members</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-extrabold">20,00,000</p>
              <p className="text-xs text-white/80">Year 3 Reach (50% State)</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-extrabold">100+ → 800+</p>
              <p className="text-xs text-white/80">Partner Healthcare Outlets</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-extrabold">8 Districts</p>
              <p className="text-xs text-white/80">100% Tripura Coverage</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-navy-900">Our Core Principles</h3>
          <p className="text-xs text-slate-500">The four foundational pillars of Health Mitra</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-500 border border-orange-100 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-navy-900">{p.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Be a Part of Tripura's Healthcare Movement</h3>
          <p className="text-xs text-slate-300">
            Join as a cardholder, healthcare partner, or district field coordinator today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/enquiry">
            <Button size="md">Get Your Card</Button>
          </Link>
          <Link to="/become-partner">
            <Button variant="outline" size="md" className="bg-white/10 text-white border-white/20">
              Become a Partner
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
