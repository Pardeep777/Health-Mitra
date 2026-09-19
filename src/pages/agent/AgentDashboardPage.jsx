import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Users,
  Target,
  Award,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  QrCode,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { agentService } from "../../services/agentService";

export function AgentDashboardPage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState(null);
  const [cardsSummary, setCardsSummary] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const [perf, cards] = await Promise.all([
          agentService.getMyPerformance().catch(() => null),
          agentService.getMyCards().catch(() => null)
        ]);

        if (perf?.success) {
          setPerformanceData(perf);
        }
        if (cards?.success) {
          setCardsSummary(cards.summary);
        }
      } catch (err) {
        console.warn("Error loading agent dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const agentName = performanceData?.agent?.name || currentUser?.name || "Agent";
  const agentCode = performanceData?.agent?.agent_code || currentUser?.agent_code || "HM-AGT-0101";
  const district = performanceData?.agent?.district || currentUser?.district || "West Tripura";

  const todayTarget = Number(performanceData?.kpi_cards?.daily_target?.value || performanceData?.agent?.daily_target || 100);
  
  // Find today's cards issued in compliance ledger or summary
  const todayEntry = performanceData?.daily_compliance_ledger?.find((d) => d.is_today);
  const todayCompleted = Number(todayEntry?.cards_issued || currentUser?.today_cards || cardsSummary?.total_active || 0);
  const targetPercent = todayTarget > 0 ? Math.min(100, Math.round((todayCompleted / todayTarget) * 100)) : 0;
  const remainingToday = Math.max(0, todayTarget - todayCompleted);

  const monthTotal = Number(performanceData?.kpi_cards?.current_month_total?.value || cardsSummary?.total_all || todayCompleted);
  const monthEarned = performanceData?.kpi_cards?.earned_this_month?.value_formatted || `₹${Number(performanceData?.kpi_cards?.earned_this_month?.value || 0)}`;
  const lifetimeTotal = Number(performanceData?.kpi_cards?.lifetime_total?.value || cardsSummary?.total_all || monthTotal);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-orange-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Field Agent Portal • Live Authenticated
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1.5">Welcome, {agentName}!</h1>
            <p className="text-xs text-white/90 font-medium">
              <span className="font-mono font-bold bg-black/20 px-2 py-0.5 rounded mr-1.5">{agentCode}</span>
              • {district}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex flex-col items-center justify-center font-extrabold text-white shrink-0 shadow-inner">
            <span className="text-base sm:text-lg leading-none">{todayCompleted}</span>
            <span className="text-[10px] font-medium text-white/80">/ {todayTarget}</span>
          </div>
        </div>

        {/* Daily Target Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold">
            <span>Daily Target: {todayTarget} Cards</span>
            <span>
              {todayCompleted} / {todayTarget} Completed ({targetPercent}%)
            </span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-3.5 overflow-hidden p-0.5">
            <div
              className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.max(5, targetPercent)}%` }}
            />
          </div>
          <p className="text-[11px] text-white/90">
            {remainingToday > 0 ? (
              <>
                Just <strong>{remainingToday} more enrollments</strong> to achieve your daily target today! 🎯
              </>
            ) : (
              <>
                🎉 <strong>Daily Target Achieved!</strong> Great job on field enrollments today!
              </>
            )}
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="pt-2">
          <Link to="/agent/register" className="block">
            <Button
              size="lg"
              className="w-full bg-navy-950 hover:bg-navy-900 text-white shadow-xl py-3.5 font-bold cursor-pointer"
              icon={UserPlus}
            >
              + Register New Cardholder (₹499)
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Today's Issued</span>
          <p className="text-2xl font-extrabold text-brand-600">{todayCompleted}</p>
          <span className="text-[10px] text-slate-500">Cards registered</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Month Total</span>
          <p className="text-2xl font-extrabold text-navy-900">{monthTotal}</p>
          <span className="text-[10px] text-slate-500">September 2026</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Month Earnings</span>
          <p className="text-2xl font-extrabold text-emerald-600">{monthEarned}</p>
          <span className="text-[10px] text-slate-500">Commission earned</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Lifetime Total</span>
          <p className="text-2xl font-extrabold text-purple-700">{lifetimeTotal}</p>
          <span className="text-[10px] text-slate-500">Total cardholders</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/agent/cards">
          <Card className="hover:shadow-card-hover transition p-5 flex items-center justify-between group cursor-pointer h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-500 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-navy-900">My Registrations</h4>
                <p className="text-xs text-slate-500">Search & view cardholders</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
          </Card>
        </Link>

        <Link to="/agent/performance">
          <Card className="hover:shadow-card-hover transition p-5 flex items-center justify-between group cursor-pointer h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-navy-900">Targets & Earnings</h4>
                <p className="text-xs text-slate-500">Commission & payout ledger</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
          </Card>
        </Link>

        <Link to="/agent/profile">
          <Card className="hover:shadow-card-hover transition p-5 flex items-center justify-between group cursor-pointer h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-navy-900">Agent Profile & KYC</h4>
                <p className="text-xs text-slate-500">Update photo, bank & details</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
