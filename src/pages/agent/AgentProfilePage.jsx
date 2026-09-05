import React from "react";
import { User, Phone, Mail, MapPin, ShieldCheck, Truck, Award } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";

export function AgentProfilePage() {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Agent Profile</h2>
        <p className="text-xs text-slate-500">Official field agent identification & distributor linkage</p>
      </div>

      <Card className="space-y-6 p-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <img
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            alt="Agent"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500"
          />
          <div>
            <h3 className="text-lg font-bold text-navy-900">{currentUser?.name || "Rajesh Kumar"}</h3>
            <p className="text-xs font-mono font-bold text-brand-600">{currentUser?.agent_code || "HM-AGT-0101"}</p>
            <Badge variant="success" size="sm" className="mt-1">
              Active Field Officer
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 uppercase font-semibold">Mobile</span>
            <p className="font-bold text-slate-800">98765 43210</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-semibold">District Assigned</span>
            <p className="font-bold text-slate-800">West Tripura (Sadar)</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-semibold">Distributor Point</span>
            <p className="font-bold text-slate-800">THCD Agartala (DIST-01)</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-semibold">Daily Card Target</span>
            <p className="font-bold text-brand-600">10 Cards / Day</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-navy-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-500" /> Authorized Representative
          </p>
          <p>
            Authorized to register new members, collect ₹49 membership fees in Cash/UPI, and distribute Health Mitra cards.
          </p>
        </div>
      </Card>
    </div>
  );
}
