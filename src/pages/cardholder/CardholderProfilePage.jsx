import React from "react";
import { User, Phone, MapPin, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";

export function CardholderProfilePage() {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Member Profile & DPDPA Consent</h2>
        <p className="text-xs text-slate-500">Your personal details and recorded privacy consent</p>
      </div>

      <Card className="space-y-6 p-6 sm:p-8">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <img
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"}
            alt="Profile"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500"
          />
          <div>
            <h3 className="text-lg font-bold text-navy-900">{currentUser?.name || "Rahul Sharma"}</h3>
            <p className="font-mono text-xs font-bold text-brand-600">ID: {currentUser?.card_id || "HMC-7F38A21"}</p>
            <Badge variant="success" size="sm" className="mt-1">
              Active Member
            </Badge>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400 uppercase font-semibold">Registered Mobile</span>
              <p className="font-bold text-slate-800">9876543210</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold">District</span>
              <p className="font-bold text-slate-800">West Tripura</p>
            </div>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-semibold">Address</span>
            <p className="text-slate-700 font-medium">Banamalipur, Math Chowmuhani, Agartala - 799001</p>
          </div>
        </div>

        {/* DPDPA Consent Status */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>DPDPA 2023 Consent Active</span>
          </div>
          <p className="text-emerald-800 leading-relaxed text-[11px]">
            Consent given for healthcare discount verification under Policy Version 1.2 on 02 Sep 2026.
          </p>
        </div>
      </Card>
    </div>
  );
}
