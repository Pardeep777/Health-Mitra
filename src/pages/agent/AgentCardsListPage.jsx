import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Search, Plus, QrCode, Phone, MapPin, Eye, RefreshCw, Sparkles } from "lucide-react";
import { agentService } from "../../services/agentService";
import { DataTable } from "../../components/common/DataTable";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { HealthMitraCard } from "../../components/card/HealthMitraCard";

export function AgentCardsListPage() {
  const [cards, setCards] = useState([]);
  const [summary, setSummary] = useState({ total_all: 0, total_active: 0, total_expiring_soon: 0, total_expired: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const loadCards = async () => {
    setLoading(true);
    try {
      const res = await agentService.getMyCards({
        search: searchTerm.trim(),
        status: statusFilter !== "all" ? statusFilter : undefined
      });
      if (res?.data) {
        setCards(res.data);
        if (res.summary) setSummary(res.summary);
      }
    } catch (e) {
      console.warn("Failed to load agent cards", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCards();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const filtered = cards.filter((c) => {
    const matchSearch =
      !searchTerm.trim() ||
      c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.unique_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile?.includes(searchTerm);
    const matchStatus = statusFilter === "all" || c.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    {
      header: "Cardholder & Unique ID",
      key: "full_name",
      render: (row) => (
        <div>
          <span className="font-bold text-navy-900 text-sm block capitalize">{row.full_name}</span>
          <span className="font-mono text-[11px] text-brand-600 font-bold">{row.unique_id}</span>
        </div>
      )
    },
    {
      header: "Mobile & Address",
      key: "mobile",
      render: (row) => (
        <div className="text-xs">
          <p className="font-mono text-slate-800 font-semibold">{row.mobile}</p>
          <p className="text-[11px] text-slate-500 truncate max-w-[170px]">{row.address || row.district}</p>
        </div>
      )
    },
    {
      header: "Issued / Expiry Date",
      key: "expiry_date",
      render: (row) => (
        <div className="text-xs">
          <span className="text-slate-700 font-medium block">Exp: {row.expiry_date}</span>
          <span className="text-[10px] text-slate-400">Reg: {row.issue_date || row.created_at?.split(" ")[0]}</span>
        </div>
      )
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <Badge variant={row.status === "Active" || row.status === "active" ? "success" : "warning"}>
          {row.status}
        </Badge>
      )
    },
    {
      header: "Digital Pass",
      key: "actions",
      align: "right",
      render: (row) => (
        <button
          onClick={() => setSelectedCard(row)}
          className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-brand-600 hover:bg-orange-50/60 transition cursor-pointer"
          title="View Digital QR Pass"
        >
          <QrCode className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">My Registered Cardholders</h2>
          <p className="text-xs text-slate-500">Live directory of patients registered through your agent code</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" icon={RefreshCw} onClick={loadCards} loading={loading}>
            Refresh
          </Button>
          <Link to="/agent/register">
            <Button size="sm" icon={Plus} className="shadow-orange-glow font-bold">
              + New Registration
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, Unique Card ID, or mobile..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
          />
        </div>

        {/* Status filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: `All (${summary.total_all || cards.length})` },
            { id: "active", label: `Active (${summary.total_active || cards.filter((c) => c.status?.toLowerCase() === "active").length})` },
            { id: "inactive", label: `Inactive (${summary.total_inactive || cards.filter((c) => c.status?.toLowerCase() === "inactive").length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-brand-500 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        totalItems={filtered.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isLoading={loading}
      />

      {/* QR pass preview Modal */}
      {selectedCard && (
        <Modal
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          title={`Digital Pass: ${selectedCard.full_name}`}
          subtitle={`Unique ID: ${selectedCard.unique_id}`}
        >
          <div className="flex flex-col items-center space-y-4 py-2">
            <HealthMitraCard
              cardholderName={selectedCard.full_name}
              uniqueId={selectedCard.unique_id}
              publicToken={selectedCard.public_token}
              validUntil={selectedCard.expiry_date}
              status={selectedCard.status}
            />
            <Button size="sm" variant="outline" onClick={() => setSelectedCard(null)}>
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
