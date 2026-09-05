import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HealthMitraCard } from "../../components/card/HealthMitraCard";
import { PrintableCard } from "../../components/card/PrintableCard";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Card } from "../../components/common/Card";
import {
  Printer,
  Download,
  Share2,
  Sparkles,
  ShieldCheck,
  Building2,
  Percent,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

export function CardholderCardPage() {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const memberName = currentUser?.name || "Rahul Sharma";
  const uniqueId = currentUser?.card_id || "HMC-7F38A21";
  const publicToken = currentUser?.public_token || "HM_PUBLIC_7F38A21_X92";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-navy-900">My Health Mitra Digital Pass</h2>
        <p className="text-xs text-slate-500">Show this QR card at any partner pharmacy or lab across Tripura</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Card Showcase */}
        <div className="lg:col-span-6 flex flex-col items-center gap-4">
          <HealthMitraCard
            cardholderName={memberName}
            uniqueId={uniqueId}
            publicToken={publicToken}
            validUntil="01 Sep 2027"
            status="Active"
            className="shadow-2xl"
          />

          <div className="grid grid-cols-2 gap-2.5 w-full">
            <Button
              variant="outline"
              size="sm"
              icon={Printer}
              onClick={() => setPrintModalOpen(true)}
            >
              Print Card Slip
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Share2}
              onClick={() => showToast("Digital pass sent to your WhatsApp!", "success")}
            >
              Share Pass
            </Button>
          </div>
        </div>

        {/* Benefits & Instructions */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="space-y-3">
            <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" /> Active Membership Privileges
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Up to 20% OFF:</strong> Blood, urine, and pathology lab diagnostics.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>10% - 15% OFF:</strong> All branded and chronic prescription medicines.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>10% - 15% OFF:</strong> In-patient bed charges and routine nursing care.</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Link to="/partners" className="text-xs text-brand-600 font-bold hover:underline">
                Find Partner Outlets Near Me →
              </Link>
            </div>
          </Card>

          <div className="p-4 bg-slate-900 text-white rounded-2xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-brand-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> Physical Card Delivery
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Your official high-durability plastic PVC smart card will be delivered to your registered Agartala address within <strong>15 days</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Print Slip Modal */}
      {printModalOpen && (
        <Modal
          isOpen={printModalOpen}
          onClose={() => setPrintModalOpen(false)}
          title={`Print Pass: ${memberName}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <PrintableCard
              cardholderName={memberName}
              uniqueId={uniqueId}
              publicToken={publicToken}
              validUntil="01 Sep 2027"
              status="Active"
              district="West Tripura"
              issueDate="02 Sep 2026"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setPrintModalOpen(false)}>
                Close
              </Button>
              <Button icon={Printer} onClick={() => window.print()}>
                Print Now
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
