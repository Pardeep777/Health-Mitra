import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CreditCard,
  Building2,
  UserCheck,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { analyticsService } from "../../services/analyticsService";
import { StatCard } from "../../components/common/StatCard";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";

export function AdminDashboardPage() {
  const stats = analyticsService.getAdminStats();

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
              Operations Control
            </span>
            <span className="text-xs text-slate-400">State HQ • Agartala</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            Good morning, Admin 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Here's what's happening with Health Mitra healthcare network across Tripura today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/admin/cardholders">
            <Button size="sm" variant="outline" icon={Users}>
              Manage Cards
            </Button>
          </Link>
          <Link to="/admin/renewals">
            <Button size="sm" variant="primary" icon={RefreshCw}>
              Renewals (1,824 Due)
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Cardholders"
          value={stats.totalCardholders.toLocaleString()}
          subtitle="Enrolled statewide"
          trend="8.4% this month"
          icon={Users}
          variant="brand"
        />

        <StatCard
          title="Active Cards"
          value={stats.activeCards.toLocaleString()}
          subtitle="92.3% active ratio"
          trend="44,821 valid"
          icon={CreditCard}
          variant="emerald"
        />

        <StatCard
          title="Expiring Soon (30d)"
          value={stats.expiringSoon.toLocaleString()}
          subtitle="Reminders dispatched"
          trend="Needs action"
          trendPositive={false}
          icon={Clock}
          variant="amber"
        />

        <StatCard
          title="Expired Cards"
          value={stats.expiredCards.toLocaleString()}
          subtitle="3.8% non-renewal"
          trend="1,881 total"
          trendPositive={false}
          icon={AlertTriangle}
          variant="default"
        />

        <StatCard
          title="Healthcare Partners"
          value={stats.totalPartners}
          subtitle="102 active, 18 pending"
          trend="18 in pipeline"
          icon={Building2}
          variant="blue"
        />

        <StatCard
          title="Field Agents"
          value={stats.fieldAgents}
          subtitle="74 active today"
          trend="10 cards/day avg"
          icon={UserCheck}
          variant="purple"
        />

        <StatCard
          title="Total Revenue (₹49)"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          subtitle="Annual card membership"
          trend="₹2.1L this month"
          icon={IndianRupee}
          variant="brand"
        />

        <StatCard
          title="Monthly Enrolments"
          value={stats.monthlyEnrolments.toLocaleString()}
          subtitle="August 2026 record"
          trend="+166 vs July"
          icon={TrendingUp}
          variant="emerald"
        />
      </div>

      {/* Target Progress Bar */}
      <Card className="bg-gradient-to-br from-navy-950 to-slate-900 text-white p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Official Milestone</span>
            <h3 className="text-lg sm:text-xl font-bold text-white">Year 1 Target Progress: 5,00,000 Cardholders</h3>
          </div>
          <div className="text-right sm:text-right">
            <span className="text-2xl font-extrabold text-brand-400">{stats.totalCardholders.toLocaleString()}</span>
            <span className="text-xs text-slate-400"> / 5,00,000 Cards ({stats.year1TargetPercentage}%)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5 border border-white/10">
          <div
            className="bg-gradient-to-r from-brand-500 to-amber-400 h-full rounded-full transition-all duration-1000 shadow-orange-glow"
            style={{ width: `${stats.year1TargetPercentage}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
          <span>Active Phase 1 Rollout: West Tripura, Sepahijala, Gomati</span>
          <span>Target Velocity: 14,000 cards / month planned</span>
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Enrollment Growth Chart */}
        <Card className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-navy-900">Card Enrollment & Revenue Trajectory</h3>
              <p className="text-xs text-slate-500">Monthly new card registrations (March - August 2026)</p>
            </div>
            <Badge variant="brand">Growth +104%</Badge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyEnrollmentGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", color: "#fff", borderRadius: "12px", fontSize: "12px" }}
                  formatter={(value) => [value.toLocaleString(), "Cards Enrolled"]}
                />
                <Line
                  type="monotone"
                  dataKey="cards"
                  stroke="#FF5A00"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#FF5A00" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Card Status Donut Chart */}
        <Card className="lg:col-span-4 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-base text-navy-900">Card Status Ratio</h3>
            <p className="text-xs text-slate-500">Active vs Expiring vs Expired</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.cardStatusBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {stats.cardStatusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", color: "#fff", borderRadius: "12px", fontSize: "12px" }}
                  formatter={(value) => [value.toLocaleString(), "Cards"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {stats.cardStatusBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <strong className="text-navy-900">{item.value.toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* District Wise Enrollment Table / Bar */}
      <Card className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-navy-900">District-Wise Adoption & Targets</h3>
            <p className="text-xs text-slate-500">Rollout progress across 8 districts of Tripura</p>
          </div>
          <Link to="/admin/districts">
            <Button variant="outline" size="sm">
              View All 8 Districts →
            </Button>
          </Link>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.districtEnrollmentData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="district" stroke="#94a3b8" fontSize={11} angle={-15} textAnchor="end" />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0F172A", color: "#fff", borderRadius: "12px", fontSize: "12px" }}
                formatter={(value) => [value.toLocaleString(), "Cards Enrolled"]}
              />
              <Bar dataKey="cards" fill="#FF5A00" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
