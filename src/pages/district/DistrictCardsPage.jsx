import React, { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  Search,
  Calendar,
  RefreshCw,
  Phone,
  MapPin,
  ShieldCheck,
  ExternalLink,
  User,
  X,
  Sparkles
} from "lucide-react";
import { districtService } from "../../services/districtService";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export function DistrictCardsPage() {
  const [cards, setCards] = useState([]);
  const [districtInfo, setDistrictInfo] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("all");

  const loadCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await districtService.getCards({
        search,
        from_date: fromDate,
        to_date: toDate,
        status: status !== "all" ? status : undefined
      });
      setCards(res.data || []);
      setTotalCount(res.total || res.count || (res.data ? res.data.length : 0));
      if (res.district_info) setDistrictInfo(res.district_info);
    } catch (err) {
      console.error("Error loading district cards:", err);
      setError(err.message || "Failed to load cards roster.");
    } finally {
      setLoading(false);
    }
  }, [search, fromDate, toDate, status]);

  // Debounced auto-fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      loadCards();
    }, 350);
    return () => clearTimeout(timer);
  }, [loadCards]);

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
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CreditCard className="w-3 h-3" /> Enrolled Cardholders
            </span>
            {districtInfo?.name && (
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {districtInfo.name}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Enrolled Health Mitra Cards ({totalCount})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            District roster of registered members with active healthcare cards and discount coverage.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadCards}
          loading={loading}
          className="flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Cards</span>
        </Button>
      </div>

      {/* 2. Search & Filter Bar */}
      <Card className="p-4 sm:p-5 border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search member, Card ID (e.g. HMC...), phone..."
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
              <option value="expiring_soon">Expiring Soon</option>
              <option value="expired">Expired</option>
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

      {/* 3. Cards Data Table */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        {error ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <Button size="sm" onClick={loadCards} className="shadow-orange-glow">
              Try Again
            </Button>
          </div>
        ) : loading && cards.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading district cards...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-navy-900">No cards found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No registered cards matched your current filter criteria.
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
                  <th className="py-3.5 px-4">Cardholder & Unique ID</th>
                  <th className="py-3.5 px-4">Mobile & Address</th>
                  <th className="py-3.5 px-4">Enrolled By</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Valid Thru</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Verification Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cards.map((card) => {
                  const memberName = card.full_name || card.member_name || "Member";
                  const cardId = card.unique_id || card.customer_code || `HMC-${card.id}`;
                  const agentInfo = card.registered_by_agent_name
                    ? `${card.registered_by_agent_name} (${card.registered_by_agent_code || ""})`
                    : "Direct Enrolment";

                  return (
                    <tr key={card.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Member & Card ID */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-navy-900 block leading-tight capitalize">
                            {memberName}
                          </span>
                          <span className="font-mono text-[10px] text-brand-600 font-bold">
                            {cardId}
                          </span>
                        </div>
                      </td>

                      {/* Mobile & Address */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          {card.mobile && (
                            <span className="flex items-center gap-1 font-mono text-slate-700 text-[11px]">
                              <Phone className="w-3 h-3 text-slate-400" /> {card.mobile}
                            </span>
                          )}
                          <span className="text-slate-500 text-[10px] block truncate max-w-[170px]">
                            {card.address || "West Tripura"}
                          </span>
                        </div>
                      </td>

                      {/* Enrolled By */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{agentInfo}</span>
                        </span>
                      </td>

                      {/* Issue Date */}
                      <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                        {card.issue_date || card.created_at?.split(" ")[0] || "-"}
                      </td>

                      {/* Expiry Date */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-[11px]">
                        {card.expiry_date || "-"}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            card.status?.toLowerCase() === "active" || card.raw_status === "active"
                              ? "success"
                              : "warning"
                          }
                        >
                          {card.status || "Active"}
                        </Badge>
                      </td>

                      {/* Verification Link */}
                      <td className="py-3.5 px-4 text-right">
                        {card.verification_url ? (
                          <a
                            href={card.verification_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-bold text-[11px] hover:underline"
                          >
                            <span>Verify Card</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[10px]">-</span>
                        )}
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
