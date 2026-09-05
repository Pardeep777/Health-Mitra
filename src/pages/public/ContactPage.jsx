import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  Sparkles
} from "lucide-react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    subject: "Card Inquiry",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    setSuccessModal(true);
    setFormData({ name: "", mobile: "", email: "", subject: "Card Inquiry", message: "" });
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Reach Out to Us
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Contact Health Mitra
        </h1>
        <p className="text-slate-600 text-sm">
          We are here to assist cardholders, healthcare partners, and field representatives across all 8 districts of Tripura.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <h3 className="font-bold text-lg text-navy-900 border-b border-slate-100 pb-3">
              Headquarters (Agartala)
            </h3>

            <ul className="space-y-4 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-navy-900 block font-bold">Office Address:</strong>
                  <span>Akhaura Road, Near Old Motor Stand, Banamalipur, Agartala, West Tripura - 799001</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-navy-900 block font-bold">Toll-Free Helpline:</strong>
                  <span>+91 94361 20111 / 1800-MITRA-CARE</span>
                  <p className="text-[11px] text-slate-400">Available Mon-Sat: 8:00 AM - 8:00 PM</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-navy-900 block font-bold">Email Support:</strong>
                  <span>support@healthmitra.demo</span>
                  <p className="text-[11px] text-slate-400">Response within 2 hours</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-navy-900 block font-bold">Support Hours:</strong>
                  <span>Monday – Saturday: 8:00 AM – 8:00 PM</span>
                  <p className="text-[11px] text-slate-400">Sunday Emergency WhatsApp Active</p>
                </div>
              </li>
            </ul>
          </div>

          {/* District Coordination Centres Box */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-3 shadow-card">
            <h4 className="font-bold text-sm text-brand-400 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> 8 District Coordination Points
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              District coordination offices active in West Tripura, Gomati (Udaipur), Sepahijala (Bishalgarh), South Tripura (Belonia), Khowai, Dhalai (Ambassa), North Tripura (Dharmanagar), and Unakoti (Kailashahar).
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-lg text-navy-900">Send Us a Message</h3>
            <p className="text-xs text-slate-500">We'll get back to you right away.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Mobile Number"
                placeholder="10-digit mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address (Optional)"
                type="email"
                placeholder="email@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Subject"
                placeholder="e.g. Card Inquiry / Partnership"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="w-full">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Message / Question
              </label>
              <textarea
                rows={4}
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full shadow-orange-glow"
              icon={Send}
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>

      <Modal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        title="Message Dispatched"
        maxWidth="max-w-md"
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-navy-900">Message Received!</h3>
          <p className="text-xs text-slate-600">
            Thank you for contacting Health Mitra. Our Tripura support desk will respond shortly.
          </p>
          <Button size="md" className="w-full" onClick={() => setSuccessModal(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
