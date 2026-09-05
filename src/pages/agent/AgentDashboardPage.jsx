import React from "react";
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
  ArrowRight
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { StatCard } from "../../components/common/StatCard";
import { useAuth } from "../../context/AuthContext";

export function AgentDashboardPage() {
  const { currentUser } = useAuth();
  const agentName = currentUser?.name || "Rajesh";
  const todayTarget = 10;
  const todayCompleted = 7;
  const targetPercent = Math.round((todayCompleted / todayTarget) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-orange-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Field Agent Portal • Mobile First
            </span>
            <h1 className="text-2xl font-extrabold mt-1">Good morning, {agentName}!</h1>
            <p className="text-xs text-white/80">HM-AGT-0101 • West Tripura</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-extrabold text-lg">
            {todayCompleted}/{todayTarget}
          </div>
        </div>

        {/* Daily Target Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold">
            <span>Today's Target: 10 Cards</span>
            <span>{todayCompleted} / 10 Completed ({targetPercent}%)</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden p-0.5">
            <div
              className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${targetPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-white/90">
            Just <strong>3 more enrollments</strong> to achieve your daily target! 🎯
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="pt-2">
          <Link to="/agent/register" className="block">
            <Button
              size="lg"
              className="w-full bg-navy-950 hover:bg-navy-900 text-white shadow-xl py-3.5"
              icon={UserPlus}
            >
              + Register New Cardholder (₹49)
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Today</span>
          <p className="text-2xl font-extrabold text-brand-600">{todayCompleted}</p>
          <span className="text-[10px] text-slate-500">Cards issued</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">This Month</span>
          <p className="text-2xl font-extrabold text-navy-900">186</p>
          <span className="text-[10px] text-slate-500">August 2026</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Remaining</span>
          <p className="text-2xl font-extrabold text-amber-600">3</p>
          <span className="text-[10px] text-slate-500">For daily bonus</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Registered</span>
          <p className="text-2xl font-extrabold text-emerald-700">1,284</p>
          <span className="text-[10px] text-slate-500">Lifetime members</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/agent/cards">
          <Card className="hover:shadow-card-hover transition p-5 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-500 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-navy-900">My Registered Cardholders</h4>
                <p className="text-xs text-slate-500">Search and view past enrollments</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Card>
        </Link>

        <Link to="/agent/performance">
          <Card className="hover:shadow-card-hover transition p-5 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-navy-900">Daily Targets & Commission</h4>
                <p className="text-xs text-slate-500">Earnings calculation & breakdown</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
