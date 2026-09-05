import React from "react";
import { teamMembers } from "../../data/team";
import { Mail, Linkedin, HeartPulse, Award, ShieldCheck } from "lucide-react";

export function TeamPage() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Leadership & Governance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          The Team Behind Health Mitra
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          A dedicated team of doctors, operations veterans, and technology architects committed to making healthcare universally affordable across Tripura.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="h-60 overflow-hidden bg-slate-100 relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-bold text-base text-navy-900">{member.name}</h3>
                <p className="text-xs font-semibold text-brand-600">{member.role}</p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">{member.bio}</p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-slate-400">
              <a
                href={`mailto:${member.email}`}
                className="hover:text-brand-600 transition text-xs flex items-center gap-1 font-semibold"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-600 transition text-xs flex items-center gap-1 font-semibold"
              >
                <Linkedin className="w-4 h-4" /> Profile
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Advisory & Mission Strip */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-2xl">
          <span className="text-brand-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Ethical Medical Advisory
          </span>
          <h3 className="text-xl font-bold">Guided by Clinical Integrity and Public Trust</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Our medical review council ensures that every partner outlet meets required state pharmaceutical and diagnostic compliance standards before being onboarded into the Health Mitra network.
          </p>
        </div>
      </div>
    </div>
  );
}
