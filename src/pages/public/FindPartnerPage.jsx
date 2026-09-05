import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Building2,
  Percent,
  Filter,
  CheckCircle2,
  Map as MapIcon,
  List,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  X
} from "lucide-react";
import { initialPartners } from "../../data/partners";
import { initialDistricts } from "../../data/districts";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";

export function FindPartnerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [viewMode, setViewMode] = useState("list"); // list or map
  const [selectedPartner, setSelectedPartner] = useState(null);

  const categories = ["All", "Pharmacy", "Pathology Lab", "Nursing Home", "Hospital"];

  const filteredPartners = useMemo(() => {
    return initialPartners.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.services.some((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchDistrict = selectedDistrict === "All" || p.district === selectedDistrict;

      return matchSearch && matchCategory && matchDistrict;
    });
  }, [searchTerm, selectedCategory, selectedDistrict]);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Partner Healthcare Outlets
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
          Find a Partner Healthcare Outlet Near You
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Present your Health Mitra card at any of our {initialPartners.length}+ partner pharmacies, pathology labs, and nursing homes across Tripura to receive up to 20% discount.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by pharmacy name, clinic, test, or area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* District Select */}
          <div className="md:col-span-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
            >
              <option value="All">All Districts (Tripura)</option>
              {initialDistricts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="md:col-span-3 flex items-center justify-end gap-2">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center w-full sm:w-auto">
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  viewMode === "list" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <List className="w-3.5 h-3.5" /> List View
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  viewMode === "map" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" /> Map View
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-brand-500 text-white shadow-sm font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-navy-900">{filteredPartners.length}</strong> partner outlets in Tripura
        </span>
        <span>All outlets pre-verified under Health Mitra Agreement</span>
      </div>

      {/* Map Placeholder View */}
      {viewMode === "map" && (
        <div className="bg-slate-900 text-white rounded-3xl p-8 text-center space-y-4 border border-slate-800 relative overflow-hidden shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
            <MapIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold">Interactive Tripura Partner Map</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Viewing {filteredPartners.length} verified healthcare outlets across Agartala, Udaipur, Bishalgarh, Belonia, and surrounding blocks.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4 text-left">
            {filteredPartners.slice(0, 4).map((p) => (
              <div key={p.id} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <p className="text-xs font-bold text-white truncate">{p.name}</p>
                <p className="text-[10px] text-brand-400">{p.category}</p>
                <p className="text-[10px] text-slate-400">{p.district}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partner Cards Grid (List View) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-card hover:shadow-card-hover transition duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Partner Image & Badge */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-brand-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                  <Percent className="w-3 h-3" /> Up to {partner.discountPercent}% OFF
                </div>
                <div className="absolute bottom-3 left-3 bg-navy-900/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                  {partner.category}
                </div>
              </div>

              {/* Partner Info */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-navy-900">{partner.name}</h3>
                  <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-500 mt-0.5 shrink-0" />
                    <span>{partner.address}, {partner.district} - {partner.pincode}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {partner.openingHours}
                  </span>
                </div>

                {/* Offer Highlight */}
                <div className="bg-orange-50/70 border border-orange-100 p-2.5 rounded-xl text-xs">
                  <p className="font-bold text-brand-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-500" /> {partner.maxDiscountText}
                  </p>
                </div>

                {/* Services preview */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sample Services:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.services.slice(0, 3).map((srv, sIdx) => (
                      <span key={sIdx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {srv.name} ({srv.discount}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {partner.agreementStatus}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPartner(partner)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Partner Detail Modal */}
      {selectedPartner && (
        <Modal
          isOpen={!!selectedPartner}
          onClose={() => setSelectedPartner(null)}
          title={selectedPartner.name}
          subtitle={`${selectedPartner.category} • ${selectedPartner.district}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <img
                src={selectedPartner.image}
                alt={selectedPartner.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-brand-500 text-white font-bold text-xs px-3 py-1 rounded-lg">
                Up to {selectedPartner.discountPercent}% Discount
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase">Address & Location</span>
                <p className="text-slate-800 font-medium">{selectedPartner.address}, {selectedPartner.district} - {selectedPartner.pincode}</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase">Contact & Timings</span>
                <p className="text-slate-800 font-medium">{selectedPartner.phone}</p>
                <p className="text-slate-500">{selectedPartner.openingHours}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-sm text-navy-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-500" /> Discounted Services Menu
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {selectedPartner.services.map((srv, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white hover:bg-slate-50">
                    <div>
                      <p className="font-bold text-slate-800">{srv.name}</p>
                      <p className="text-slate-500 text-[11px]">Regular Price: {srv.basePriceRange}</p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                      {srv.discount}% OFF
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-xl text-xs text-brand-900 flex items-start gap-2 border border-orange-200">
              <ShieldCheck className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
              <span>
                To avail these discounts, simply show your active <strong>Health Mitra Card</strong> or QR code during billing.
              </span>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedPartner(null)}>
                Close
              </Button>
              <a href={`tel:${selectedPartner.phone}`}>
                <Button variant="primary" icon={Phone}>
                  Call Partner
                </Button>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
