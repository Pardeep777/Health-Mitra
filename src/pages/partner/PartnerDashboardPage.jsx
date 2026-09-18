import React, { useState, useEffect } from "react";
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
  Users,
  MapPin,
  Receipt,
  QrCode
} from "lucide-react";
import { StatCard } from "../../components/common/StatCard";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { partnerService } from "../../services/partnerService";

export function PartnerDashboardPage() {
  const { currentUser, updateCurrentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [recentRedemptions, setRecentRedemptions] = useState([]);
  const [summaryTiles, setSummaryTiles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [profileRes, historyRes] = await Promise.all([
          partnerService.getProfile().catch((e) => ({ success: false })),
          partnerService.getHistory({ limit: 5 }).catch((e) => ({ success: false }))
        ]);

        if (profileRes.success && profileRes.data) {
          setProfileData(profileRes.data);
          if (updateCurrentUser) {
            updateCurrentUser({
              partner_name: profileRes.data.business_name || currentUser?.partner_name,
              business_name: profileRes.data.business_name || currentUser?.business_name,
              owner_name: profileRes.data.owner_name || currentUser?.owner_name,
              district: profileRes.data.district || currentUser?.district,
              avatar: profileRes.data.logo_url || profileRes.data.shop_image_url || currentUser?.avatar
            });
          }
        }

        if (historyRes.success) {
          if (historyRes.summary_tiles) {
            setSummaryTiles(historyRes.summary_tiles);
          }
          if (Array.isArray(historyRes.data)) {
            setRecentRedemptions(historyRes.data.slice(0, 5));
          }
        }
      } catch (err) {
        console.warn("Could not sync partner dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const businessName =
    profileData?.business_name ||
    currentUser?.business_name ||
    currentUser?.partner_name ||
    "Mitra Pharmacy & Healthcare";
  const partnerCode =
    profileData?.partner_code || currentUser?.partner_code || "HMP816884";
  const districtName =
    profileData?.district || currentUser?.district || "Tripura";
  const categoryName =
    profileData?.category_name || "Pharmacy / Healthcare";

  const totalRedemptionsVal =
    summaryTiles?.total_redemptions?.value ??
    profileData?.total_redemptions ??
    recentRedemptions.length;
  const totalDiscountsVal =
    summaryTiles?.total_discounts?.formatted ??
    `₹${recentRedemptions.reduce((acc, curr) => acc + (curr.discount_amount || 0), 0).toLocaleString()}`;
  const avgDiscountVal =
    summaryTiles?.avg_discount?.formatted ??
    `${profileData?.max_discount_percent || 15}%`;
  const verificationSuccessVal =
    summaryTiles?.verification_success?.formatted ?? "100%";

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-700 bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-200">
              {partnerCode}
            </span>
            <Badge variant="success">Verified Healthcare Partner</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            {businessName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2">
            <span>{categoryName}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {districtName}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/partner/profile">
            <Button variant="outline" size="lg" icon={Store}>
              Edit Profile
            </Button>
          </Link>
          <Link to="/partner/verify">
            <Button size="lg" className="shadow-orange-glow" icon={ShieldCheck}>
              Verify & Redeem
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Redemptions"
          value={totalRedemptionsVal}
          subtitle="Patient visits served"
          trend="+100% verified"
          icon={Receipt}
          variant="brand"
        />
        <StatCard
          title="Discounts Extended"
          value={totalDiscountsVal}
          subtitle="Customer savings enabled"
          trend="Live ledger"
          icon={Percent}
          variant="emerald"
        />
        <StatCard
          title="Avg Discount %"
          value={avgDiscountVal}
          subtitle="Across services"
          trend="Per agreement"
          icon={TrendingUp}
          variant="purple"
        />
        <StatCard
          title="Verification Rate"
          value={verificationSuccessVal}
          subtitle="Valid cardholder visits"
          trend="Real-time check"
          icon={ShieldCheck}
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
              <Button size="lg" className="w-full shadow-orange-glow" icon={QrCode}>
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

          {recentRedemptions.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No recent redemptions found. Use the counter to record your first discount.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentRedemptions.map((r) => (
                <div key={r.id || r.receipt_number} className="py-3 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-navy-900">{r.cardholder_name}</p>
                      <span className="font-mono text-[10px] font-bold text-brand-600 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">
                        {r.receipt_number || r.receipt_no}
                      </span>
                    </div>
                    <p className="text-slate-500">{r.service_provided || r.service_name}</p>
                    <span className="font-mono text-[10px] text-slate-400">{r.unique_id || r.card_id} • {r.timestamp}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      -₹{r.discount_amount} ({r.discount_percent}%)
                    </span>
                    <p className="text-slate-700 font-bold text-xs mt-1">Paid: ₹{r.final_amount || r.collected_amount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
