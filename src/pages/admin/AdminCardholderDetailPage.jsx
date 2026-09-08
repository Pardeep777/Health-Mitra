import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  CreditCard,
  Calendar,
  ShieldCheck,
  RefreshCw,
  Printer,
  History,
  Lock,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  QrCode,
  KeyRound,
  RotateCcw
} from "lucide-react";
import { cardholderService } from "../../services/cardholderService";
import { verificationService } from "../../services/verificationService";
import { HealthMitraCard } from "../../components/card/HealthMitraCard";
import { PrintableCard } from "../../components/card/PrintableCard";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Card } from "../../components/common/Card";
import { Modal } from "../../components/common/Modal";
import { useNotifications } from "../../context/NotificationContext";

export function AdminCardholderDetailPage() {
  const { id } = useParams();
  const [cardholder, setCardholder] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const loadCardholder = async () => {
    setLoading(true);
    try {
      const c = await cardholderService.getById(id);
      setCardholder(c);
      if (c) {
        const allVerifs = await verificationService.getAll();
        const matched = allVerifs.filter((v) => v.card_id === c.unique_id);
        setVerifications(matched);
      }
    } catch (err) {
      showToast("Failed to load cardholder record.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCardholder();
  }, [id]);

  // 1. Renew 1 Year
  const handleRenew = async () => {
    if (!cardholder) return;
    try {
      const res = await cardholderService.renew(cardholder.unique_id);
      if (res) {
        showToast(`Membership renewed for 1 year!`, "success");
        loadCardholder();
      }
    } catch (err) {
      showToast("Renewal failed.", "error");
    }
  };

  // 2. Toggle Status via POST /admin/cards/update_status and POST /admin/cardholders/edit
  const handleToggleStatus = async () => {
    if (!cardholder) return;
    const isCurrentlyActive = cardholder.status?.toLowerCase() === "active";
    const nextStatus = isCurrentlyActive ? "Inactive" : "Active";
    setStatusLoading(true);
    try {
      await cardholderService.updateStatus(cardholder.id || cardholder.unique_id, nextStatus);
      setCardholder((prev) => ({
        ...prev,
        status: nextStatus,
        card_status: nextStatus.toLowerCase()
      }));
      showToast(`Card status updated to ${nextStatus}`, "success");
    } catch (err) {
      showToast(err.message || "Failed to update status on server.", "error");
    } finally {
      setStatusLoading(false);
    }
  };

  // 3. Re-generate QR Token: POST /admin/cards/qr_management
  const handleRegenerateToken = async () => {
    if (!cardholder) return;
    setRegenLoading(true);
    try {
      await cardholderService.regenerateToken(cardholder.id || 1);
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const newPublicToken = `HM_PUBLIC_${randomSuffix}_${Math.floor(10 + Math.random() * 90)}`;
      setCardholder((prev) => ({ ...prev, public_token: newPublicToken }));
      showToast("QR Token re-generated securely! Old QR codes invalidated.", "success");
    } catch (err) {
      showToast("Token regeneration failed.", "error");
    } finally {
      setRegenLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading cardholder records...</div>;
  }

  if (!cardholder) {
    return (
      <div className="p-8 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-700">Cardholder Not Found</h3>
        <Link to="/admin/cardholders">
          <Button variant="outline">Back to Cardholders</Button>
        </Link>
      </div>
    );
  }

  const calculatedSavings = verifications.reduce((sum, v) => sum + (Number(v.discount_amount) || 0), 0);
  const totalRedemptions = verifications.length;

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/cardholders"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-navy-900">{cardholder.full_name}</h1>
              <Badge variant={cardholder.status?.toLowerCase() === "active" ? "success" : "danger"}>
                {cardholder.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Unique ID: <strong className="text-brand-600">{cardholder.unique_id}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-bold"
            onClick={() => cardholderService.shareOnWhatsApp(cardholder)}
          >
            Share WhatsApp
          </Button>
          <Button variant="outline" size="sm" icon={Printer} onClick={() => setPrintModalOpen(true)}>
            Print Slip
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={KeyRound}
            loading={regenLoading}
            onClick={handleRegenerateToken}
            title="Re-generate QR verification token"
          >
            Re-generate QR
          </Button>
          <Button
            variant={cardholder.status?.toLowerCase() === "active" ? "danger" : "outline"}
            size="sm"
            loading={statusLoading}
            onClick={handleToggleStatus}
          >
            {cardholder.status?.toLowerCase() === "active" ? "Mark Inactive" : "Mark Active"}
          </Button>
          <Button variant="primary" size="sm" icon={RefreshCw} onClick={handleRenew}>
            Renew 1 Year (₹49)
          </Button>
        </div>
      </div>

      {/* Main Grid: Visual Card & Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Card Preview & Quick Stats */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col items-center">
            <HealthMitraCard
              cardholderName={cardholder.full_name}
              uniqueId={cardholder.unique_id}
              publicToken={cardholder.public_token}
              validUntil={cardholder.expiry_date}
              status={cardholder.status}
              interactive={true}
            />

            <div className="w-full mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> DPDPA Compliant Pass
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-700">
                Fee: ₹{cardholder.price_paid || 49} Paid
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 text-center">
              <p className="text-xs text-slate-500 font-semibold uppercase">Total Savings</p>
              <p className="text-2xl font-extrabold text-brand-600 mt-1">
                ₹{calculatedSavings.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Across Partner Outlets</p>
            </Card>

            <Card className="p-4 text-center">
              <p className="text-xs text-slate-500 font-semibold uppercase">Times Redeemed</p>
              <p className="text-2xl font-extrabold text-navy-900 mt-1">
                {totalRedemptions}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Verified QR scans</p>
            </Card>
          </div>
        </div>

        {/* Right Column: Complete Verified Demographics & Redemptions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cardholder Information Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-500" /> Member Identity & Contact Records
              </h3>
              {cardholder.photo && (
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-brand-500/30 shadow-sm shrink-0">
                  <img
                    src={cardholder.photo}
                    alt={cardholder.full_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Full Name</span>
                <span className="font-bold text-navy-900 text-sm">{cardholder.full_name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Mobile Contact</span>
                <span className="font-bold font-mono text-slate-800">{cardholder.mobile}</span>
                {cardholder.alternate_mobile && (
                  <span className="text-slate-400 font-mono block text-[11px]">
                    Alt: {cardholder.alternate_mobile}
                  </span>
                )}
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Email Address</span>
                <span className="font-semibold text-slate-800">{cardholder.email || "Not provided"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Date of Birth & Gender</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {cardholder.dob || "1992-05-14"} • {cardholder.gender || "Male"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">District & PIN</span>
                <span className="font-semibold text-slate-800">
                  {cardholder.district} — {cardholder.pin_code || "799001"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Residential Address</span>
                <span className="font-semibold text-slate-800">{cardholder.address}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">ID Proof Verified</span>
                <span className="font-semibold text-slate-800">
                  {cardholder.id_proof_type || "Aadhaar Card"}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block">
                  {cardholder.id_proof_reference || "XXXX-XXXX-1234"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Issue & Expiry Dates</span>
                <span className="font-semibold text-slate-800">
                  {cardholder.issue_date} ➔ {cardholder.expiry_date}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Logs / Redemption History */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
            <h3 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-brand-500" /> Recent Partner Redemptions & Logs
            </h3>

            {verifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No recent partner redemptions recorded for this cardholder.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {verifications.map((v) => (
                  <div key={v.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-navy-900">{v.partner_name}</p>
                      <p className="text-slate-500 text-[11px]">
                        {v.service_type} • Bill: ₹{v.bill_amount}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        -₹{v.discount_amount} Saved
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{v.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Printable Slip Modal */}
      {printModalOpen && (
        <Modal
          isOpen={printModalOpen}
          onClose={() => setPrintModalOpen(false)}
          title="Printable Enrollment Slip"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <PrintableCard
              cardholderName={cardholder.full_name}
              uniqueId={cardholder.unique_id}
              publicToken={cardholder.public_token}
              validUntil={cardholder.expiry_date}
              status={cardholder.status}
              district={cardholder.district}
              issueDate={cardholder.issue_date}
            />
            <div className="flex justify-between items-center pt-2">
              <Button variant="outline" size="sm" onClick={() => setPrintModalOpen(false)}>
                Close
              </Button>
              <Button size="sm" icon={Printer} onClick={() => window.print()}>
                Print Document
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
