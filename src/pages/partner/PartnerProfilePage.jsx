import React, { useState } from "react";
import { Store, MapPin, Phone, Mail, Clock, ShieldCheck, Download, Save, Upload } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

export function PartnerProfilePage() {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();

  const [profile, setProfile] = useState({
    businessName: currentUser?.partner_name || "Mitra Pharmacy & Healthcare",
    ownerName: "Dr. Subhash Debbarma",
    phone: "+91 94361 45001",
    email: "mitrapharmacy@healthmitra.demo",
    category: "Pharmacy",
    district: "West Tripura",
    address: "Akhaura Road, Near Old Motor Stand, Agartala",
    pincode: "799001",
    openingHours: "08:00 AM - 10:30 PM (Mon-Sun)",
    agreementStatus: "Verified & Signed",
    joiningDate: "15 Oct 2025"
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast("Profile details updated successfully!", "success");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Partner Business Profile</h2>
        <p className="text-xs text-slate-500">Manage your outlet information, store hours, and partner branding materials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business Name"
                value={profile.businessName}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                required
              />
              <Input
                label="Owner / Contact Person"
                value={profile.ownerName}
                onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Phone Number"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="District (Tripura)"
                value={profile.district}
                disabled
              />
              <Input
                label="PIN Code"
                value={profile.pincode}
                onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                required
              />
            </div>

            <Input
              label="Street Address & Landmark"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              required
            />

            <Input
              label="Store Opening Hours"
              value={profile.openingHours}
              onChange={(e) => setProfile({ ...profile, openingHours: e.target.value })}
              required
            />

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" icon={Save}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Branding & Status Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Partnership Status</h3>
              <Badge variant="success">Active Partner</Badge>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p><strong>Agreement:</strong> {profile.agreementStatus}</p>
              <p><strong>Network Member Since:</strong> {profile.joiningDate}</p>
              <p><strong>Category:</strong> {profile.category}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                icon={Download}
                onClick={() => showToast("Downloaded Health Mitra Partner Sticker & QR Board Assets!", "success")}
              >
                Download Branding Kit (PDF)
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
