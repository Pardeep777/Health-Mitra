import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Calendar,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Target,
  CreditCard,
  TrendingUp,
  X,
  ExternalLink,
  UserCheck,
  AlertCircle,
  Eye,
  CheckCircle2,
  Clock
} from "lucide-react";
import { districtService } from "../../services/districtService";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";

export function DistrictAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [districtInfo, setDistrictInfo] = useState(null);
  const [summary, setSummary] = useState({ total_agents: 0, active_agents: 0, today_total_cards: 0 });
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters matching backend endpoints
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("all");

  // Selected agent for modal inspection
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Fetch agents with API query parameters
  const loadAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await districtService.getAgents({
        search,
        from_date: fromDate,
        to_date: toDate,
        status: status !== "all" ? status : undefined
      });

      setAgents(res.data || []);
      setTotalCount(res.total ?? (res.data ? res.data.length : 0));
      if (res.summary) setSummary(res.summary);
      if (res.district_info) setDistrictInfo(res.district_info);
    } catch (err) {
      console.error("Error loading district agents:", err);
      setError(err.message || "Failed to load field agents roster.");
    } finally {
      setLoading(false);
    }
  }, [search, fromDate, toDate, status]);

  // Debounced auto-fetch on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadAgents();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadAgents]);

  const handleResetFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setStatus("all");
  };

  const hasActiveFilters = Boolean(search || fromDate || toDate || status !== "all");

  const getPerformanceBadgeVariant = (perf, statusType) => {
    if (statusType === "success" || perf === "Excellent" || perf === "Good") return "success";
    if (statusType === "warning" || perf === "Needs Attention") return "warning";
    if (statusType === "danger") return "danger";
    return "brand";
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> Field Agent Force
            </span>
            {districtInfo?.name && (
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {districtInfo.name} District
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            District Field Agents ({totalCount})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor daily enrollment activity, card targets, and performance across Sadar and sub-divisions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAgents}
            loading={loading}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3 border-l-4 border-l-brand-500">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-navy-900">
              {summary.total_agents || agents.length}
            </div>
            <div className="text-[11px] font-semibold text-slate-500">Total Registered Agents</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3 border-l-4 border-l-emerald-500">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-700">
              {summary.active_agents || agents.filter((a) => a.status === "active").length}
            </div>
            <div className="text-[11px] font-semibold text-slate-500">Active Field Force</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3 border-l-4 border-l-blue-500">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-blue-700">
              {summary.today_total_cards || 0}
            </div>
            <div className="text-[11px] font-semibold text-slate-500">Today's Cards Issued</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3 border-l-4 border-l-purple-500">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-navy-900 truncate">
              {districtInfo?.headquarters || "Agartala HQ"}
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              Lead: {districtInfo?.coordinator_name || "Sudip Chakraborty"}
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Filter Bar (Search, Date Range, Status) */}
      <Card className="p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search input (maps to ?search=Agent Shyam) */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search agent name or code (e.g. Agent Shyam)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white border border-slate-200 pl-9 pr-8 py-2 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Date range pickers (maps to ?from_date=...&to_date=...) */}
          <div className="sm:col-span-4 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                title="From Date"
                className="w-full bg-slate-50 hover:bg-white border border-slate-200 px-2.5 py-2 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>
            <span className="text-slate-400 text-xs font-medium">to</span>
            <div className="relative flex-1">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                title="To Date"
                className="w-full bg-slate-50 hover:bg-white border border-slate-200 px-2.5 py-2 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>
          </div>

          {/* Status filter (maps to ?status=active) */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="shrink-0 text-slate-500 hover:text-rose-600 text-xs px-2 py-2"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Quick Date Shortcuts */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-400">Quick Filters:</span>
            <button
              onClick={() => {
                setFromDate("2026-09-01");
                setToDate("2026-09-23");
              }}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-brand-50 hover:text-brand-600 transition font-medium"
            >
              Sep 2026
            </button>
            <button
              onClick={() => {
                const today = new Date().toISOString().split("T")[0];
                setFromDate(today);
                setToDate(today);
              }}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-brand-50 hover:text-brand-600 transition font-medium"
            >
              Today
            </button>
            <button
              onClick={() => setStatus("active")}
              className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition font-medium"
            >
              Active Agents
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition font-medium ml-1"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Showing <strong className="text-slate-700">{agents.length}</strong> of {totalCount} agents
          </div>
        </div>
      </Card>

      {/* 4. Error Message Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={loadAgents}>
            Retry
          </Button>
        </div>
      )}

      {/* 5. Main Agents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-7 h-7 text-brand-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading district field agents...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-navy-900">No Field Agents Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No field agents match your current search and filter criteria. Try resetting the filters.
            </p>
            {hasActiveFilters && (
              <Button size="sm" variant="outline" onClick={handleResetFilters} className="mt-2">
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Agent Name & Code</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Sub-Division</th>
                  <th className="py-3.5 px-4">Today's Cards</th>
                  <th className="py-3.5 px-4">Total Cards</th>
                  <th className="py-3.5 px-4">Performance</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joining Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {agents.map((agent) => {
                  const targetDaily = agent.target_daily || 100;
                  const todayCards = agent.today_cards || 0;
                  const progressPct = Math.min(Math.round((todayCards / targetDaily) * 100), 100);

                  return (
                    <tr
                      key={agent.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => setSelectedAgent(agent)}
                    >
                      {/* 1. Agent Name & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {agent.photo_url ? (
                            <img
                              src={agent.photo_url}
                              alt={agent.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  agent.name
                                )}&background=0D8ABC&color=fff`;
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center border border-brand-200 shrink-0">
                              {agent.name ? agent.name.charAt(0) : "A"}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-navy-900 group-hover:text-brand-600 transition flex items-center gap-1.5">
                              {agent.name}
                            </div>
                            <span className="font-mono text-[10px] text-brand-600 font-semibold bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200/60 inline-block mt-0.5">
                              {agent.agent_code}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Contact details */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {agent.mobile && (
                            <a
                              href={`tel:${agent.mobile}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-700 font-medium hover:text-brand-600 flex items-center gap-1.5"
                            >
                              <Phone className="w-3 h-3 text-slate-400" />
                              {agent.mobile}
                            </a>
                          )}
                          {agent.email && (
                            <a
                              href={`mailto:${agent.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-400 hover:text-slate-600 flex items-center gap-1.5 text-[11px] truncate max-w-[150px]"
                            >
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{agent.email}</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* 3. Sub-Division */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{agent.sub_division || "West Tripura"}</span>
                        </div>
                      </td>

                      {/* 4. Today's cards & target */}
                      <td className="py-3 px-4">
                        <div className="space-y-1 max-w-[120px]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-navy-900">
                              {agent.today_cards_display || `${todayCards} / ${targetDaily}`}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">{progressPct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                progressPct >= 80
                                  ? "bg-emerald-500"
                                  : progressPct >= 40
                                  ? "bg-brand-500"
                                  : "bg-amber-400"
                              }`}
                              style={{ width: `${Math.max(progressPct, 4)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 5. Total Cards */}
                      <td className="py-3 px-4">
                        <div className="font-black text-navy-900 text-sm">
                          {agent.total_cards || 0}
                          <span className="text-[10px] font-normal text-slate-400 ml-1">cards</span>
                        </div>
                      </td>

                      {/* 6. Performance */}
                      <td className="py-3 px-4">
                        <Badge
                          variant={getPerformanceBadgeVariant(agent.performance, agent.performance_status)}
                          size="sm"
                        >
                          {agent.performance || "Active"}
                        </Badge>
                      </td>

                      {/* 7. Status */}
                      <td className="py-3 px-4">
                        {agent.status === "active" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* 8. Joining date */}
                      <td className="py-3 px-4 text-slate-500 font-medium text-[11px]">
                        {agent.joining_date || agent.created_at?.split(" ")[0] || "N/A"}
                      </td>

                      {/* 9. Action Button */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAgent(agent);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition"
                          title="View agent details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. Agent Detail Modal */}
      {selectedAgent && (
        <Modal
          isOpen={Boolean(selectedAgent)}
          onClose={() => setSelectedAgent(null)}
          title="Field Agent Profile"
          size="md"
        >
          <div className="space-y-5">
            {/* Header info */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/40 border border-slate-200/80">
              {selectedAgent.photo_url ? (
                <img
                  src={selectedAgent.photo_url}
                  alt={selectedAgent.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      selectedAgent.name
                    )}&background=0D8ABC&color=fff`;
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-brand-500 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
                  {selectedAgent.name ? selectedAgent.name.charAt(0) : "A"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-navy-900 text-base">{selectedAgent.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs font-bold text-brand-600 bg-white px-2 py-0.5 rounded-md border border-brand-200">
                    {selectedAgent.agent_code}
                  </span>
                  <Badge
                    variant={getPerformanceBadgeVariant(selectedAgent.performance, selectedAgent.performance_status)}
                    size="sm"
                  >
                    {selectedAgent.performance || "Standard"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-semibold">Today's Target</div>
                <div className="text-base font-black text-navy-900 mt-0.5">
                  {selectedAgent.today_cards_display || `${selectedAgent.today_cards || 0} / ${selectedAgent.target_daily || 100}`}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-brand-50 border border-brand-200">
                <div className="text-xs text-brand-700 font-semibold">Total Issued</div>
                <div className="text-base font-black text-brand-700 mt-0.5">
                  {selectedAgent.total_cards || 0} cards
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-xs text-emerald-700 font-semibold">Agent Status</div>
                <div className="text-base font-black text-emerald-700 mt-0.5 capitalize">
                  {selectedAgent.status || "Active"}
                </div>
              </div>
            </div>

            {/* Contact Details List */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contact & Assignment
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">Phone Number</div>
                    <a
                      href={`tel:${selectedAgent.mobile}`}
                      className="font-bold text-navy-900 hover:text-brand-600"
                    >
                      {selectedAgent.mobile || "N/A"}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400">Email Address</div>
                    <div className="font-bold text-navy-900 truncate">
                      {selectedAgent.email || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <MapPin className="w-4 h-4 text-purple-500 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">Sub-Division / Area</div>
                    <div className="font-bold text-navy-900">
                      {selectedAgent.sub_division || "West Tripura"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">Joining Date</div>
                    <div className="font-bold text-navy-900">
                      {selectedAgent.joining_date || selectedAgent.created_at || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedAgent(null)}>
                Close
              </Button>
              {selectedAgent.cards_url && (
                <a
                  href={selectedAgent.cards_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-sm transition"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  View Agent's Cards
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
