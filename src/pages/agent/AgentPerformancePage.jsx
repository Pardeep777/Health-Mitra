import React from "react";
import { Target, Award, IndianRupee, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";
import { Card } from "../../components/common/Card";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Link } from "react-router-dom";

export function AgentPerformancePage() {
  const dailyHistory = [
    { date: "02 Sep 2026 (Today)", cards: 7, target: 10, status: "In Progress", commission: "₹70" },
    { date: "01 Sep 2026", cards: 11, target: 10, status: "Target Exceeded (+1)", commission: "₹110" },
    { date: "31 Aug 2026", cards: 10, target: 10, status: "Target Met", commission: "₹100" },
    { date: "30 Aug 2026", cards: 9, target: 10, status: "Almost Met", commission: "₹90" },
    { date: "29 Aug 2026", cards: 12, target: 10, status: "Target Exceeded (+2)", commission: "₹120" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Performance & Commissions</h2>
        <p className="text-xs text-slate-500">Track daily target achievements and commission earnings</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Daily Target" value="10 Cards" subtitle="Required baseline" variant="brand" />
        <StatCard title="August Total" value="186 Cards" subtitle="Rank #2 in Sadar" variant="emerald" />
        <StatCard title="Earned This Month" value="₹1,860" subtitle="Paid via direct transfer" variant="purple" />
        <StatCard title="Lifetime Total" value="1,284" subtitle="Total cardholders" variant="blue" />
      </div>

      {/* Target Tracker Card */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-500" /> Recent Daily Compliance Ledger
          </h3>
          <span className="text-xs text-slate-500">Fixed target: 10 cards/day</span>
        </div>

        <div className="divide-y divide-slate-100">
          {dailyHistory.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-navy-900">{item.date}</p>
                <p className="text-slate-500">{item.status}</p>
              </div>
              <div className="text-right space-y-0.5">
                <span className="font-extrabold text-navy-900">{item.cards} / {item.target} cards</span>
                <p className="text-emerald-700 font-bold text-[11px]">{item.commission} earned</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-xs text-brand-950 flex items-center justify-between">
        <span>Ready to issue your next card?</span>
        <Link to="/agent/register">
          <Button size="sm">Register Cardholder →</Button>
        </Link>
      </div>
    </div>
  );
}
