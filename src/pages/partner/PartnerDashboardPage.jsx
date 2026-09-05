import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Percent,
  History,
  Store,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Building2,
  Users
} from "lucide-react";
import { StatCard } from "../../components/common/StatCard";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { initialVerifications } from "../../data/verifications";

export function PartnerDashboardPage() {
  const { currentUser } = useAuth();
  const recentRedemptions = initialVerifications.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
            Partner Outlet Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            {currentUser?.partner_name || "Mitra Pharmacy & Healthcare"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Verified Healthcare Partner • {currentUser?.district || "West Tripura"}
          </p>
        </div>

        <Link to="/partner/verify">
          <Button size="lg" className="shadow-orange-glow" icon={ShieldCheck}>
            Verify Patient Card & Redeem
          </Button>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Today's Verifications"
          value="128"
          subtitle="Patient visits today"
          trend="+14% vs yesterday"
          icon={ShieldCheck}
          variant="brand"
        />
        <StatCard
          title="Monthly Verifications"
          value="2,841"
          subtitle="August 2026 total"
          trend="+210 vs July"
          icon={TrendingUp}
          variant="emerald"
        />
        <StatCard
          title="Total Discounts Given"
          value="₹84,250"
          subtitle="Customer savings enabled"
          trend="15% avg savings"
          icon={Percent}
          variant="purple"
        />
        <StatCard
          title="Unique Patients"
          value="1,942"
          subtitle="Active cardholders verified"
          icon={Users}
          variant="blue"
        />
      </div>

      {/* Quick Action & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Quick Verification Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-navy-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Instant Counter Verification</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When a patient presents their Health Mitra card or mobile QR, verify their validity in 2 seconds and record their discount bill.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <Link to="/partner/verify" className="block w-full">
              <Button size="lg" className="w-full shadow-orange-glow">
                Open QR Scanner & ID Lookup
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Recent Redemptions */}
        <Card className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-navy-900 flex items-center gap-2">
              <History className="w-4 h-4 text-brand-500" /> Recent Discount Redemptions
            </h3>
            <Link to="/partner/verifications" className="text-xs text-brand-600 font-bold hover:underline">
              View All History →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentRedemptions.map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-navy-900">{r.cardholder_name}</p>
                  <p className="text-slate-500">{r.service_name}</p>
                  <span className="font-mono text-[10px] text-brand-600">{r.card_id}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    -₹{r.discount_amount} ({r.discount_percent}%)
                  </span>
                  <p className="text-slate-700 font-bold text-xs mt-1">Paid: ₹{r.final_amount}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
