import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Users,
  Building2,
  UserCheck,
  TrendingUp,
  Target,
  ArrowRight,
  RefreshCw,
  CreditCard,
  Phone,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  BarChart3,
  Network
} from "lucide-react";
import { districtService } from "../../services/districtService";
import { StatCard } from "../../components/common/StatCard";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";

export function DistrictDashboardPage() {
  const { currentUser } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // POST https://cupan.getfreedeal.com/api/district/dashboard
      const data = await districtService.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error("Error loading district dashboard:", err);
      setError(err.message || "Failed to load district dashboard metrics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const districtInfo = dashboard?.district_info || {
    name: currentUser?.district || "West Tripura",
    state: "Tripura",
    headquarters: "Agartala",
    coordinator_name: "Sudip Chakraborty (Lead)",
    coordinator_phone: "+91 9436128111",
    rollout_phase: "phase_1",
    population: 918200,
    target_cardholders: 185000,
    launch_date: "2026-01-01",
    status: "active"
  };

  const kpis = dashboard?.kpis || {
    enrolled_cards: 0,
    partner_outlets: 0,
    active_field_agents: 0,
    target_progress: {
      percentage: 0,
      percentage_formatted: "0%",
      achieved: 0,
      goal: 185000,
      label: "0 / 185,000 (0%)"
    },
    cards_today: 0,
    cards_this_month: 0,
    active_cards: 0,
    expiring_soon_cards: 0,
    expired_cards: 0,
    total_agents: 0,
    total_partners: 0,
    total_distributors: 0
  };

  const monthlyRegistrations = dashboard?.monthly_registrations || [];
  const quickLinks = dashboard?.quick_links || [];

  // Icon mapping helper for quick links
  const getQuickLinkIcon = (title) => {
    const t = (title || "").toLowerCase();
    if (t.includes("agent")) return <UserCheck className="w-5 h-5 text-purple-600" />;
    if (t.includes("partner") || t.includes("outlet")) return <Building2 className="w-5 h-5 text-blue-600" />;
    if (t.includes("card")) return <CreditCard className="w-5 h-5 text-brand-500" />;
    if (t.includes("distributor")) return <Network className="w-5 h-5 text-emerald-600" />;
    return <Users className="w-5 h-5 text-slate-600" />;
  };

  const getQuickLinkBg = (title) => {
    const t = (title || "").toLowerCase();
    if (t.includes("agent")) return "bg-purple-50";
    if (t.includes("partner") || t.includes("outlet")) return "bg-blue-50";
    if (t.includes("card")) return "bg-orange-50";
    if (t.includes("distributor")) return "bg-emerald-50";
    return "bg-slate-50";
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> District Coordination Console
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {districtInfo.rollout_phase?.replace("_", " ")?.toUpperCase() || "PHASE 1"}
            </span>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              Status: <span className="text-emerald-600 font-extrabold capitalize">{districtInfo.status || "Active"}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            {districtInfo.name} District
          </h1>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              HQ: <strong className="text-slate-700">{districtInfo.headquarters || "Agartala"}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              Coordinator: <strong className="text-slate-700">{districtInfo.coordinator_name}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <a
              href={`tel:${districtInfo.coordinator_phone}`}
              className="flex items-center gap-1 text-brand-600 font-semibold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              {districtInfo.coordinator_phone}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboard}
            loading={loading}
            className="flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Metrics
          </Button>
        </div>
      </div>

      {/* Error alert if failed */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={fetchDashboard}>
            Retry
          </Button>
        </div>
      )}

      {/* 2. Top Primary 4 KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Cards"
          value={loading ? "..." : (kpis.enrolled_cards ?? 0).toLocaleString()}
          subtitle={`${kpis.active_cards ?? 0} Active • ${kpis.cards_this_month ?? 0} this month`}
          variant="brand"
        />
        <StatCard
          title="Partner Outlets"
          value={loading ? "..." : (kpis.partner_outlets ?? 0).toLocaleString()}
          subtitle={`Total: ${kpis.total_partners ?? 0} Pharmacies & Labs`}
          variant="blue"
        />
        <StatCard
          title="Active Field Agents"
          value={loading ? "..." : (kpis.active_field_agents ?? 0).toLocaleString()}
          subtitle={`Total: ${kpis.total_agents ?? 0} Field Agents`}
          variant="purple"
        />
        <StatCard
          title="Target Progress"
          value={loading ? "..." : (kpis.target_progress?.percentage_formatted || "0%")}
          subtitle={`Goal: ${(kpis.target_progress?.goal || 185000).toLocaleString()}`}
          variant="emerald"
        />
      </div>

      {/* 3. Secondary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Cards</span>
            <Clock className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-black text-navy-900 mt-1">
            {loading ? "..." : kpis.cards_today}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Enrolled today</div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">This Month</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-700 mt-1">
            {loading ? "..." : kpis.cards_this_month}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Month to date</div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Distributor Points</span>
            <Network className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {loading ? "..." : kpis.total_distributors}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active stockists</div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Rate</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-700 mt-1">
            {kpis.enrolled_cards > 0
              ? `${Math.round(((kpis.active_cards || 0) / kpis.enrolled_cards) * 100)}%`
              : "100%"}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Coverage health</div>
        </Card>
      </div>

      {/* 4. Target Progress Box & Monthly Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Target Progress Box (2 cols) */}
        <Card className="p-6 space-y-4 lg:col-span-2 border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-brand-600 mb-1">
                <Target className="w-4 h-4" /> District Target & Coverage
              </div>
              <h3 className="font-extrabold text-navy-900 text-lg">
                District Rollout Goal: {(kpis.target_progress?.goal || 185000).toLocaleString()} Cardholders
              </h3>
            </div>
            <span className="text-xs font-black text-brand-600 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200 self-start sm:self-auto">
              {kpis.target_progress?.label || "0 / 185,000 (0%)"}
            </span>
          </div>

          {/* Dynamic Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-brand-500 to-amber-500 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{
                  width: `${Math.max(kpis.target_progress?.percentage || 0, 1)}%`
                }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold px-0.5">
              <span>Achieved: <strong>{kpis.target_progress?.achieved || kpis.enrolled_cards || 0}</strong> cards</span>
              <span>Remaining: <strong>{((kpis.target_progress?.goal || 185000) - (kpis.target_progress?.achieved || kpis.enrolled_cards || 0)).toLocaleString()}</strong> cards</span>
            </div>
          </div>

          {/* Demographic Context */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Total Population</span>
              <span className="font-extrabold text-navy-900">
                {(districtInfo.population || 918200).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Target Goal</span>
              <span className="font-extrabold text-brand-600">
                {(districtInfo.target_cardholders || 185000).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Launch Date</span>
              <span className="font-extrabold text-slate-700">
                {districtInfo.launch_date || "2026-01-01"}
              </span>
            </div>
          </div>
        </Card>

        {/* Monthly Trend Card (1 col) */}
        <Card className="p-6 space-y-4 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-blue-600 mb-1">
              <BarChart3 className="w-4 h-4" /> Monthly Registration
            </div>
            <h4 className="font-extrabold text-navy-900 text-base">Registration Trend</h4>
            <p className="text-xs text-slate-400 mt-0.5">Growth over recent months</p>
          </div>

          <div className="space-y-3 py-2">
            {monthlyRegistrations.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-6">No historical data recorded yet</div>
            ) : (
              monthlyRegistrations.map((item, idx) => {
                const maxCount = Math.max(...monthlyRegistrations.map((m) => m.count || 1), 1);
                const barWidth = Math.max(Math.round(((item.count || 0) / maxCount) * 100), 8);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">{item.month}</span>
                      <span className="text-navy-900 font-extrabold">{item.count} cards</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-500 h-full rounded-full transition-all"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Recent Month Total</span>
            <strong className="text-slate-700">
              {monthlyRegistrations.reduce((acc, curr) => acc + (curr.count || 0), 0)} Cards
            </strong>
          </div>
        </Card>
      </div>

      {/* 5. Dynamic Quick Action Links from API */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-navy-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-500" />
          District Operations Portals
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((item, idx) => {
            const isInternal = item.link && item.link.startsWith("/");
            const icon = getQuickLinkIcon(item.title);
            const bgClass = getQuickLinkBg(item.title);

            // If distributors link or custom link
            const targetLink = item.link === "/district/distributors" ? "/district/dashboard" : item.link;

            const cardContent = (
              <Card className="hover:shadow-card-hover transition p-5 flex items-center justify-between group h-full border border-slate-200/80 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl ${bgClass} flex items-center justify-center shrink-0`}>
                    {icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-navy-900 group-hover:text-brand-600 transition">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500">{item.subtitle}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-brand-600 transition" />
              </Card>
            );

            return isInternal ? (
              <Link key={idx} to={targetLink}>
                {cardContent}
              </Link>
            ) : (
              <a key={idx} href={item.url || item.link} target="_blank" rel="noopener noreferrer">
                {cardContent}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
