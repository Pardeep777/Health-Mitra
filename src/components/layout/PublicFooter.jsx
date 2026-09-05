import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Phone, Mail, MapPin, Heart, ArrowRight } from "lucide-react";
import logoImg from "../../assets/logo.png";

export function PublicFooter() {
  return (
    <footer className="bg-white text-slate-600 pt-16 pb-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="Health Mitra Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Health Mitra is a community healthcare discount initiative dedicated to making healthcare accessible and affordable for every family in Tripura.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 bg-orange-50 text-brand-700 border border-orange-200 text-xs font-semibold px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-500" /> DPDPA 2023 Compliant
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full">
                ₹49 Annual Card
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-navy-900 font-bold text-sm tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/how-it-works" className="text-slate-600 hover:text-brand-600 transition">How It Works</Link>
              </li>
              <li>
                <Link to="/partners" className="text-slate-600 hover:text-brand-600 transition">Find a Partner</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-600 hover:text-brand-600 transition">Pricing & Plans</Link>
              </li>
              <li>
                <Link to="/become-partner" className="text-slate-600 hover:text-brand-600 transition">Become a Partner</Link>
              </li>
              <li>
                <Link to="/verify" className="text-slate-600 hover:text-brand-600 transition">Verify Card</Link>
              </li>
              <li>
                <Link to="/enquiry" className="text-slate-600 hover:text-brand-600 transition">Buy a Card / Enquiry</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Team */}
          <div>
            <h4 className="text-navy-900 font-bold text-sm tracking-wider uppercase mb-4">Organization</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-slate-600 hover:text-brand-600 transition">About Health Mitra</Link>
              </li>
              <li>
                <Link to="/team" className="text-slate-600 hover:text-brand-600 transition">Management Team</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-600 hover:text-brand-600 transition">Photo Gallery</Link>
              </li>
              <li>
                <Link to="/join-us" className="text-slate-600 hover:text-brand-600 transition">Join Us / Careers</Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-600 hover:text-brand-600 transition">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold transition flex items-center gap-1">
                  Partner / Agent Portal <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Legal */}
          <div>
            <h4 className="text-navy-900 font-bold text-sm tracking-wider uppercase mb-4">Contact & Support</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                <span>Akhaura Road, Banamalipur, Agartala, West Tripura, 799001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                <span>+91 94361 20111 / 1800-MITRA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <span>support@healthmitra.demo</span>
              </li>
            </ul>
            <div className="pt-4 flex flex-wrap gap-2 text-xs">
              <Link to="/privacy" className="text-slate-500 hover:text-brand-600 underline">Privacy Policy</Link>
              <span>•</span>
              <Link to="/dpdpa" className="text-slate-500 hover:text-brand-600 underline">DPDPA Policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Health Mitra. All Rights Reserved. Smart Healthcare Discount Card.</p>
          <p className="flex items-center gap-1">
            Empowering affordable healthcare across Tripura <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
