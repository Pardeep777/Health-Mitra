import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Search, Plus, QrCode, Phone, MapPin, Eye } from "lucide-react";
import { cardholderService } from "../../services/cardholderService";
import { DataTable } from "../../components/common/DataTable";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { HealthMitraCard } from "../../components/card/HealthMitraCard";

export function AgentCardsListPage() {
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    cardholderService.getAll().then((all) => setCards(all));
  }, []);

  const filtered = cards.filter((c) =>
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.unique_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mobile.includes(searchTerm)
  );

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    {
      header: "Cardholder & ID",
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
          <p className="font-mono text-slate-800">{row.mobile}</p>
          <p className="text-[11px] text-slate-500 truncate max-w-[150px]">{row.address}</p>
        </div>
      )
    },
    {
      header: "Expiry Date",
      key: "expiry_date",
      render: (row) => (
        <span className="text-xs text-slate-700 font-medium">{row.expiry_date}</span>
      )
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "warning"}>
          {row.status}
        </Badge>
      )
    },
    {
      header: "Action",
      key: "actions",
      align: "right",
      render: (row) => (
        <button
          onClick={() => setSelectedCard(row)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-brand-600 hover:bg-slate-50"
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
          <p className="text-xs text-slate-500">Manage and track your field registrations</p>
        </div>
        <Link to="/agent/register">
          <Button size="sm" icon={Plus}>
            + New Registration
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        totalItems={filtered.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* QR pass preview */}
      {selectedCard && (
        <Modal
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          title={`Digital Pass: ${selectedCard.full_name}`}
        >
          <div className="flex flex-col items-center space-y-4 py-2">
            <HealthMitraCard
              cardholderName={selectedCard.full_name}
              uniqueId={selectedCard.unique_id}
              publicToken={selectedCard.public_token}
              validUntil={selectedCard.expiry_date}
              status={selectedCard.status}
            />
            <Button size="sm" onClick={() => setSelectedCard(null)}>
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
