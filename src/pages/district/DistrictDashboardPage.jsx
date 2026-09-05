import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, Building2, UserCheck, TrendingUp, IndianRupee, Target, ArrowRight } from "lucide-react";
import { StatCard } from "../../components/common/StatCard";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

export function DistrictDashboardPage() {
  const { currentUser } = useAuth();
  const districtName = currentUser?.district || "West Tripura";

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 flex items-center gap-1 w-fit mb-1">
            <MapPin className="w-3 h-3" /> District Coordination Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            {districtName} District
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Phase 1 Operations • Headquarters: Agartala • Coordinator: Sudip Chakraborty
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Enrolled Cards" value="22,450" subtitle="West Tripura region" variant="brand" />
        <StatCard title="Partner Outlets" value="48" subtitle="Pharmacies & Labs" variant="blue" />
        <StatCard title="Active Field Agents" value="32" subtitle="Sadar & Bishalgarh" variant="purple" />
        <StatCard title="Target Progress" value="12.5%" subtitle="Goal: 1,80,000" variant="emerald" />
      </div>

      {/* Target Progress Box */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center text-xs font-bold">
          <span>District Rollout Goal: 1,80,000 Cardholders</span>
          <span className="text-brand-600">22,450 / 1,80,000 (12.5%)</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div className="bg-brand-500 h-full rounded-full" style={{ width: "12.5%" }} />
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/district/agents">
          <Card className="hover:shadow-card-hover transition p-5 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-navy-900">32 District Agents</h4>
                <p className="text-xs text-slate-500">Daily performance</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
          </Card>
        </Link>

        <Link to="/district/partners">
          <Card className="hover:shadow-card-hover transition p-5 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-navy-900">48 Partner Outlets</h4>
                <p className="text-xs text-slate-500">Local pharmacies & labs</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
          </Card>
        </Link>

        <Link to="/district/cards">
          <Card className="hover:shadow-card-hover transition p-5 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-500 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-navy-900">Enrolled Cards</h4>
                <p className="text-xs text-slate-500">Search district roster</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
