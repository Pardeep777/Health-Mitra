import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { analyticsService } from "../../services/analyticsService";
import { cardholderService } from "../../services/cardholderService";
import { Card } from "../../components/common/Card";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";
import { TrendingUp, Users, Building2, IndianRupee, RefreshCw } from "lucide-react";

export function AdminAnalyticsPage() {
  const [stats, setStats] = useState(() => analyticsService.getAdminStats());
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const [live, logs] = await Promise.all([
          analyticsService.getLiveAdminStats(),
          cardholderService.getVerificationLogs().catch(() => [])
        ]);
        setStats(live);
        setVerifications(Array.isArray(logs) ? logs : []);
      } catch (e) {
        console.warn("Live analytics fetch notice", e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalDiscountGiven = verifications.reduce(
    (acc, curr) => acc + Number(curr.discount_amount || 0),
    0
  );

  const avgDiscountPercent =
    verifications.length > 0
      ? (
          verifications.reduce((acc, curr) => acc + Number(curr.discount_percent || 15), 0) /
          verifications.length
        ).toFixed(1) + "%"
      : "15%";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Analytics & Intelligence Hub</h2>
        <p className="text-xs text-slate-500">
          Live data analytics for healthcare operations and growth in Tripura
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Cardholders"
          value={stats.totalCardholders.toLocaleString()}
          subtitle="Enrolled statewide"
          variant="brand"
        />
        <StatCard
          title="Avg Discount Given"
          value={avgDiscountPercent}
          subtitle="Across partner outlets"
          variant="emerald"
        />
        <StatCard
          title="Active Cards Ratio"
          value={`${stats.activeRatio}%`}
          subtitle="Verified members"
          variant="purple"
        />
        <StatCard
          title="Total Patient Savings"
          value={`₹${totalDiscountGiven.toLocaleString()}`}
          subtitle="Direct patient relief"
          variant="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Enrollment Growth Line/Area Chart */}
        <Card className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-navy-900">Card Enrollment & Revenue Pace</h3>
              <p className="text-xs text-slate-500">Monthly new card registrations (Live)</p>
            </div>
            <Badge variant="brand">Real-Time Data</Badge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.monthlyEnrollmentGrowth}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5A00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF5A00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    color: "#fff",
                    borderRadius: "12px",
                    fontSize: "12px"
                  }}
                  formatter={(value) => [value.toLocaleString(), "Cards"]}
                />
                <Area
                  type="monotone"
                  dataKey="cards"
                  stroke="#FF5A00"
                  fillOpacity={1}
                  fill="url(#colorReg)"
                  name="New Cards"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Partner Categories Pie */}
        <Card className="lg:col-span-4 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-navy-900">Partner Categories</h3>
            <p className="text-xs text-slate-500">Distribution across {stats.totalPartners} outlets</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.partnerCategoryBreakdown}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {stats.partnerCategoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    color: "#fff",
                    borderRadius: "12px",
                    fontSize: "12px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {stats.partnerCategoryBreakdown.map((item) => (
              <div key={item.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <strong className="text-navy-900">{item.count} Outlets</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* District Progress Breakdown */}
      <Card className="space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-navy-900">District Enrollment Distribution</h3>
          <p className="text-xs text-slate-500">Active cardholder distribution across districts</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.districtEnrollmentData.map((d) => (
            <div
              key={d.district}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-navy-900">{d.district}</h4>
                <span className="text-[11px] font-bold text-brand-600">{d.cards} cards</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.max(2, d.percentage))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>{d.cards.toLocaleString()} enrolled</span>
                <span>Target: {d.target.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
