import React, { useState, useEffect } from "react";
import { Target, Award, IndianRupee, TrendingUp, Calendar, CheckCircle2, RefreshCw } from "lucide-react";
import { Card } from "../../components/common/Card";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Link } from "react-router-dom";
import { agentService } from "../../services/agentService";
import { useAuth } from "../../context/AuthContext";

export function AgentPerformancePage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [datePreset, setDatePreset] = useState("this_month");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchPerformance = async (overrideParams = null) => {
    setLoading(true);
    try {
      let params = {};
      if (overrideParams) {
        params = overrideParams;
      } else if (datePreset === "custom" && fromDate && toDate) {
        params = { from_date: fromDate, to_date: toDate };
      } else if (datePreset === "7_days") {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        params = { from_date: d.toISOString().split("T")[0], to_date: new Date().toISOString().split("T")[0] };
      } else if (datePreset === "30_days") {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        params = { from_date: d.toISOString().split("T")[0], to_date: new Date().toISOString().split("T")[0] };
      }

      const res = await agentService.getMyPerformance(params);
      if (res?.success) {
        setData(res);
      }
    } catch (e) {
      console.warn("Failed to load agent performance", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, [datePreset]);

  const handlePresetChange = (preset) => {
    setDatePreset(preset);
    if (preset === "this_month") {
      setFromDate("");
      setToDate("");
    } else if (preset === "7_days") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      setFromDate(d.toISOString().split("T")[0]);
      setToDate(new Date().toISOString().split("T")[0]);
    } else if (preset === "30_days") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      setFromDate(d.toISOString().split("T")[0]);
      setToDate(new Date().toISOString().split("T")[0]);
    }
  };

  const handleApplyCustomDates = (e) => {
    e.preventDefault();
    if (fromDate && toDate) {
      fetchPerformance({ from_date: fromDate, to_date: toDate });
    }
  };

  const kpis = data?.kpi_cards || {};
  const ledger = data?.daily_compliance_ledger || [];
  const summary = data?.ledger_summary || {};
  const agent = data?.agent || currentUser || {};

  const dailyTargetVal = kpis.daily_target?.value_formatted || `${agent.daily_target || 100} Cards`;
  const monthTotalVal = kpis.current_month_total?.value_formatted || `${summary.total_cards_in_period || 0} Cards`;
  const earnedMonthVal = kpis.earned_this_month?.value_formatted || summary.total_earnings_formatted || "₹0";
  const lifetimeVal = kpis.lifetime_total?.value_formatted || `${summary.total_cards_in_period || 0}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Performance & Commissions</h2>
          <p className="text-xs text-slate-500">
            Live compliance ledger, target achievements and earnings for {agent.name || "Agent"} ({agent.agent_code || "HMA839210"})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" icon={RefreshCw} onClick={() => fetchPerformance()} loading={loading}>
            Refresh
          </Button>
          <Link to="/agent/register">
            <Button size="sm" className="shadow-orange-glow font-bold">
              + Register Cardholder (₹499)
            </Button>
          </Link>
        </div>
      </div>

      {/* Date Range Selector Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "this_month", label: "This Month (Default)" },
            { id: "7_days", label: "Last 7 Days" },
            { id: "30_days", label: "Last 30 Days" },
            { id: "custom", label: "Custom Range" }
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetChange(preset.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                datePreset === preset.id
                  ? "bg-brand-500 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {datePreset === "custom" && (
          <form onSubmit={handleApplyCustomDates} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
            <Button size="sm" type="submit" loading={loading}>
              Apply
            </Button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title={kpis.daily_target?.title || "Daily Target"}
          value={dailyTargetVal}
          subtitle={kpis.daily_target?.subtitle || "Required baseline"}
          variant="brand"
        />
        <StatCard
          title={kpis.current_month_total?.title || "Month Total"}
          value={monthTotalVal}
          subtitle={kpis.current_month_total?.subtitle || `Rank #1 in ${agent.district || "West Tripura"}`}
          variant="emerald"
        />
        <StatCard
          title={kpis.earned_this_month?.title || "Earned This Month"}
          value={earnedMonthVal}
          subtitle={kpis.earned_this_month?.subtitle || "Paid via direct transfer"}
          variant="purple"
        />
        <StatCard
          title={kpis.lifetime_total?.title || "Lifetime Total"}
          value={lifetimeVal}
          subtitle={kpis.lifetime_total?.subtitle || "Total cardholders issued"}
          variant="blue"
        />
      </div>

      {/* Target Tracker Card */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-500" /> Daily Compliance & Earnings Ledger
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Commission Rate: <strong>₹{agent.commission_rate || 20} / Card</strong>
          </span>
        </div>

        {ledger.length === 0 && !loading ? (
          <p className="text-xs text-slate-400 py-4 text-center">No compliance ledger records found.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {ledger.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50/70 px-2 rounded-xl transition">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-navy-900">{item.date_formatted || item.date}</p>
                    {item.is_today && (
                      <span className="text-[10px] font-extrabold bg-brand-50 text-brand-600 border border-brand-200 px-1.5 py-0.2 rounded">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.status_badge_color || "#f59e0b" }}
                    />
                    <span className="text-slate-500 font-medium">{item.status_tag || item.status}</span>
                  </div>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="font-extrabold text-navy-900 block">{item.target_ratio || `${item.cards_issued || 0} cards`}</span>
                  <p className="text-emerald-700 font-bold text-[11px]">{item.earned_formatted || `₹${item.earned_amount || 0} earned`}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-xs text-brand-950 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="font-bold text-brand-900 block">Ready to issue your next card?</span>
          <span className="text-slate-600 text-[11px]">Each cardholder registration earns ₹{agent.commission_rate || 20} commission</span>
        </div>
        <Link to="/agent/register">
          <Button size="sm" className="shadow-orange-glow font-bold">
            Register Cardholder (₹499) →
          </Button>
        </Link>
      </div>
    </div>
  );
}
