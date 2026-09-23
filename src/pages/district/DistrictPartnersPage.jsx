import React, { useState, useEffect, useCallback } from "react";
import {
  Building2,
  Search,
  Calendar,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Tag,
  ShieldCheck,
  X,
  FileCheck
} from "lucide-react";
import { districtService } from "../../services/districtService";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export function DistrictPartnersPage() {
  const [partners, setPartners] = useState([]);
  const [districtInfo, setDistrictInfo] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("all");

  const loadPartners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await districtService.getPartners({
        search,
        from_date: fromDate,
        to_date: toDate,
        status: status !== "all" ? status : undefined
      });
      setPartners(res.data || []);
      setTotalCount(res.total || res.count || (res.data ? res.data.length : 0));
      if (res.district_info) setDistrictInfo(res.district_info);
    } catch (err) {
      console.error("Error loading district partners:", err);
      setError(err.message || "Failed to load partners roster.");
    } finally {
      setLoading(false);
    }
  }, [search, fromDate, toDate, status]);

  // Debounced auto-fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPartners();
    }, 350);
    return () => clearTimeout(timer);
  }, [loadPartners]);

  const handleResetFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setStatus("all");
  };

  const hasActiveFilters = Boolean(search || fromDate || toDate || status !== "all");

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Building2 className="w-3 h-3" /> Healthcare Outlets
            </span>
            {districtInfo?.name && (
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {districtInfo.name}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Partner Healthcare Outlets ({totalCount})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified network of pharmacies, diagnostic labs, and clinics providing instant counter discounts.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadPartners}
          loading={loading}
          className="flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Partners</span>
        </Button>
      </div>

      {/* 2. Search & Filter Controls */}
      <Card className="p-4 sm:p-5 border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search partner name, pharmacy, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* From Date */}
          <div className="lg:col-span-3 flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[10px] text-slate-400 uppercase font-bold shrink-0">From</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
            />
          </div>

          {/* To Date */}
          <div className="lg:col-span-3 flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[10px] text-slate-400 uppercase font-bold shrink-0">To</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
            />
          </div>

          {/* Status Dropdown */}
          <div className="lg:col-span-2 flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="Applied">Applied</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                title="Reset Filters"
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-red-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
            <span className="font-semibold text-brand-600">Active Filters:</span>
            {search && <span className="bg-slate-100 px-2 py-0.5 rounded-md font-mono">search: "{search}"</span>}
            {fromDate && <span className="bg-slate-100 px-2 py-0.5 rounded-md font-mono">from: {fromDate}</span>}
            {toDate && <span className="bg-slate-100 px-2 py-0.5 rounded-md font-mono">to: {toDate}</span>}
            {status !== "all" && <span className="bg-slate-100 px-2 py-0.5 rounded-md font-mono">status: {status}</span>}
            <button
              onClick={handleResetFilters}
              className="ml-auto text-brand-600 hover:underline font-bold cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </Card>

      {/* 3. Partners Table */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        {error ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <Button size="sm" onClick={loadPartners} className="shadow-orange-glow">
              Try Again
            </Button>
          </div>
        ) : loading && partners.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading district partners...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-navy-900">No partner outlets found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No healthcare outlets matched your current filter criteria.
            </p>
            {hasActiveFilters && (
              <Button size="sm" variant="outline" onClick={handleResetFilters} className="mt-2">
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Outlet & Code</th>
                  <th className="py-3.5 px-4">Owner & Contact</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Agreement</th>
                  <th className="py-3.5 px-4">Redemptions</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partners.map((partner) => {
                  const partnerTitle = partner.business_name || partner.partner_name || partner.name || "Healthcare Outlet";
                  const ownerName = partner.owner_name || "-";
                  const categoryName = partner.category_name || partner.category || "Healthcare Partner";
                  const discountDisplay = partner.discount_offered || (partner.discount_percent ? `Up to ${partner.discount_percent}%` : "Up to 20%");
                  const isAgreementSigned = partner.agreement_status?.toLowerCase() === "signed";

                  return (
                    <tr key={partner.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Outlet & Code */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-navy-900 block leading-tight">
                            {partnerTitle}
                          </span>
                          <span className="font-mono text-[10px] text-brand-600 font-bold">
                            {partner.partner_code || `HMP-${partner.id}`}
                          </span>
                        </div>
                      </td>

                      {/* Owner & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-medium text-slate-800 block text-[11px]">
                            {ownerName}
                          </span>
                          {partner.mobile && (
                            <span className="flex items-center gap-1 font-mono text-slate-600 text-[10px]">
                              <Phone className="w-3 h-3 text-slate-400" /> {partner.mobile}
                            </span>
                          )}
                          {partner.email && (
                            <span className="flex items-center gap-1 text-slate-500 text-[10px] truncate max-w-[150px]">
                              <Mail className="w-3 h-3 text-slate-400" /> {partner.email}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                          <Tag className="w-3 h-3 text-slate-400" />
                          <span>{categoryName}</span>
                        </span>
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-600 line-clamp-2 max-w-[180px]">
                          {partner.address || "Agartala, West Tripura"}
                          {partner.pin_code && ` • PIN ${partner.pin_code}`}
                        </span>
                      </td>

                      {/* Discount Offered */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold text-brand-700 bg-brand-50 border border-brand-200">
                          {discountDisplay}
                        </span>
                      </td>

                      {/* Agreement */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold capitalize ${
                            isAgreementSigned ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{partner.agreement_status || "Pending"}</span>
                        </span>
                      </td>

                      {/* Redemptions */}
                      <td className="py-3.5 px-4 font-extrabold text-navy-900">
                        {partner.total_redemptions !== undefined ? partner.total_redemptions : 0}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            partner.status?.toLowerCase() === "active" || partner.raw_status === "active"
                              ? "success"
                              : "warning"
                          }
                        >
                          {partner.status || "Active"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
