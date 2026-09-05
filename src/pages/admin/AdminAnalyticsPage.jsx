import React from "react";
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
import { Card } from "../../components/common/Card";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";
import { TrendingUp, Users, Building2, IndianRupee, RefreshCw } from "lucide-react";

export function AdminAnalyticsPage() {
  const stats = analyticsService.getAdminStats();

  const weeklyTrendData = [
    { day: "Mon", verifications: 145, newRegistrations: 120 },
    { day: "Tue", verifications: 180, newRegistrations: 135 },
    { day: "Wed", verifications: 210, newRegistrations: 142 },
    { day: "Thu", verifications: 195, newRegistrations: 150 },
    { day: "Fri", verifications: 240, newRegistrations: 165 },
    { day: "Sat", verifications: 290, newRegistrations: 190 },
    { day: "Sun", verifications: 170, newRegistrations: 95 }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Analytics & Intelligence Hub</h2>
        <p className="text-xs text-slate-500">Comprehensive data visualizations for healthcare operations and growth in Tripura</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Card Growth" value="+104%" subtitle="6-month acceleration" variant="brand" />
        <StatCard title="Avg Discount Given" value="16.4%" subtitle="Across partner outlets" variant="emerald" />
        <StatCard title="Renewal Velocity" value="70.4%" subtitle="Target achieved" variant="purple" />
        <StatCard title="Total Savings Given" value="₹8.4L+" subtitle="Direct patient relief" variant="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Activity Area Chart */}
        <Card className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-navy-900">Weekly Verification & Registration Volume</h3>
              <p className="text-xs text-slate-500">Daily interaction count over the past 7 days</p>
            </div>
            <Badge variant="brand">Peak on Saturdays</Badge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVerif" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5A00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF5A00" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", color: "#fff", borderRadius: "12px", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="verifications" stroke="#FF5A00" fillOpacity={1} fill="url(#colorVerif)" name="Partner Verifications" />
                <Area type="monotone" dataKey="newRegistrations" stroke="#10B981" fillOpacity={1} fill="url(#colorReg)" name="New Card Registrations" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Partner Categories Pie */}
        <Card className="lg:col-span-4 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-navy-900">Partner Categories</h3>
            <p className="text-xs text-slate-500">Distribution across 126 outlets</p>
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
                  contentStyle={{ backgroundColor: "#0F172A", color: "#fff", borderRadius: "12px", fontSize: "12px" }}
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
          <h3 className="font-bold text-base text-navy-900">District Enrollment Target Breakdown</h3>
          <p className="text-xs text-slate-500">Year 1 progress by region</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.districtEnrollmentData.map((d) => (
            <div key={d.district} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-navy-900">{d.district}</h4>
                <span className="text-[11px] font-bold text-brand-600">{d.percentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-brand-500 h-full rounded-full" style={{ width: `${d.percentage}%` }} />
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
