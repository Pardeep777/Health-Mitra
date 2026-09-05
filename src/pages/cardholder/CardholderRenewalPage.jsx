import React, { useState } from "react";
import { RefreshCw, CheckCircle2, Clock, IndianRupee, ShieldCheck, Sparkles } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

export function CardholderRenewalPage() {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [renewed, setRenewed] = useState(false);

  const handleRenew = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    setRenewed(true);
    showToast("Card renewed successfully for 1 additional year!", "success");
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Card Renewal & Validity</h2>
        <p className="text-xs text-slate-500">Keep your healthcare discount active for another year</p>
      </div>

      <Card className="space-y-6 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Current Card Status</span>
            <h3 className="text-lg font-bold text-navy-900">
              {renewed ? "Renewed & Active" : "Active (Valid Until 01 Sep 2027)"}
            </h3>
          </div>
          <Badge variant={renewed ? "purple" : "success"}>
            {renewed ? "Renewed" : "Active"}
          </Badge>
        </div>

        <div className="bg-gradient-to-br from-navy-950 to-slate-900 text-white rounded-2xl p-5 space-y-2">
          <span className="text-xs font-bold text-brand-400 uppercase">Annual Renewal Fee</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold">₹49.00</span>
            <span className="text-xs text-slate-400">/ 365 Days Extension</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Uninterrupted access to 100+ pharmacies & pathology labs in Tripura.
          </p>
        </div>

        {!renewed ? (
          <div className="space-y-3">
            <Button
              size="lg"
              loading={loading}
              className="w-full shadow-orange-glow"
              icon={RefreshCw}
              onClick={handleRenew}
            >
              Renew Card Online for ₹49
            </Button>
            <p className="text-center text-[10px] text-slate-400">
              Secure UPI & QR payment simulation • Instant digital extension
            </p>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-900 text-sm">Membership Successfully Extended!</h4>
            <p className="text-xs text-emerald-700">New Expiry: <strong>01 Sep 2028</strong></p>
          </div>
        )}
      </Card>
    </div>
  );
}
