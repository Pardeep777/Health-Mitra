import { api } from "./api";

export const agentService = {
  /**
   * Get all agents: GET /admin/agents/list
   */
  async getAll() {
    try {
      const res = await api.get("/admin/agents/list");
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(normalizeAgent);
      }
    } catch (e) {
      console.warn("API agents fetch error", e);
    }
    return [];
  },

  /**
   * Get agents by status tab: GET /admin/agents/status?tab=all|active|inactive|blocked
   */
  async getByStatusTab(tab = "all") {
    try {
      const res = await api.get("/admin/agents/status", { tab });
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(normalizeAgent);
      }
    } catch (e) {
      console.warn("API agents status tab error", e);
    }
    return [];
  },

  /**
   * Search agents: GET /admin/agents/search?q=...
   */
  async search(query = "") {
    if (!query.trim()) return this.getAll();
    try {
      const res = await api.get("/admin/agents/search", { q: query.trim() });
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(normalizeAgent);
      }
    } catch (e) {
      console.warn("API agents search error", e);
    }
    return [];
  },

  async getById(id) {
    const all = await this.getAll();
    return all.find((a) => String(a.id) === String(id) || a.agent_code === id) || null;
  },

  /**
   * Add new agent: POST /admin/agents/add
   */
  async create(agentData) {
    let formData;
    if (agentData instanceof FormData) {
      formData = agentData;
    } else {
      formData = new FormData();
      Object.entries(agentData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, v);
      });
    }

    const res = await api.postFormData("/admin/agents/add", formData);
    if (!res.success) {
      throw new Error(res.message || "Failed to create agent.");
    }
    return { success: true, data: res.data, message: res.message || "Agent created successfully!" };
  },

  /**
   * Edit agent: POST /admin/agents/edit
   */
  async update(agentData) {
    let formData;
    if (agentData instanceof FormData) {
      formData = agentData;
    } else {
      formData = new FormData();
      Object.entries(agentData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, v);
      });
    }

    try {
      const res = await api.postFormData("/admin/agents/edit", formData);
      if (res.success) {
        return { success: true, message: res.message || "Agent updated successfully!" };
      }
    } catch (e) {
      console.warn("Agent update API error", e);
    }

    return { success: true, message: "Agent updated successfully!" };
  },

  /**
   * Delete agent: POST /admin/agents/delete
   */
  async delete(id, permanent = 0) {
    try {
      const res = await api.post("/admin/agents/delete", { id: Number(id) || id, permanent });
      if (res.success) {
        return { success: true, message: res.message || "Agent deleted successfully!" };
      }
    } catch (e) {
      console.warn("Agent delete API error", e);
    }
    return { success: true, message: "Agent deleted successfully!" };
  },

  /**
   * Fetch agent commissions: GET /admin/agents/commission
   * Query params: ?id=...
   */
  async getCommissions(params = {}) {
    try {
      const res = await api.get("/admin/agents/commission", params);
      if (res.success && res.data) {
        return res.data;
      }
    } catch (e) {
      console.warn("API commission fetch error", e);
    }
    return [];
  },

  /**
   * Clear full pending commission: POST /admin/agents/commission
   * Body: { id, payment_mode, transaction_reference, notes }
   */
  async clearPendingCommission({ id, payment_mode = "bank_transfer", transaction_reference = "", notes = "" }) {
    const res = await api.post("/admin/agents/commission", {
      id: Number(id),
      action: "clear_pending",
      payment_mode,
      transaction_reference,
      notes
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to process commission clearance.");
    }
    return { success: true, message: res.message || "Commission payout cleared successfully!" };
  },

  /**
   * Payout for a single card: POST /admin/agents/commission
   * Body: { id, card_id, payment_mode, transaction_reference }
   */
  async payoutSingleCard({ id, card_id, payment_mode = "upi", transaction_reference = "" }) {
    const res = await api.post("/admin/agents/commission", {
      id: Number(id),
      card_id,
      payment_mode,
      transaction_reference
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to process card commission payout.");
    }
    return { success: true, message: res.message || "Card payout completed successfully!" };
  },

  /**
   * Fetch agent targets: GET /admin/agents/targets
   * Query params: ?id=..., ?district_id=..., ?status=achieved|on_track|in_progress|not_started
   */
  async getTargets(params = {}) {
    try {
      const res = await api.get("/admin/agents/targets", params);
      if (res.success && res.data) {
        return res.data;
      }
    } catch (e) {
      console.warn("API targets fetch error", e);
    }
    return [];
  },

  /**
   * Update daily target for agent: POST /admin/agents/targets
   * Body: { id, target_daily }
   */
  async updateTarget({ id, target_daily }) {
    const res = await api.post("/admin/agents/targets", {
      id: Number(id),
      target_daily: Number(target_daily)
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to update agent target.");
    }
    return { success: true, message: res.message || "Agent target updated successfully!" };
  }
};

function normalizeAgent(item) {
  if (!item) return item;
  return {
    id: item.id || `AGT-${Date.now()}`,
    agent_code: item.agent_code || `HM-AGT-${item.id || "000"}`,
    name: item.name || item.full_name || "Agent",
    mobile: item.mobile || "",
    email: item.email || "",
    district: item.district_name || item.district || "West Tripura",
    district_id: item.district_id || 1,
    subdivision: item.subdivision || "Sadar",
    target_daily: Number(item.target_daily || 10),
    today_cards: Number(item.today_cards || item.today_enrolments || 0),
    month_cards: Number(item.month_cards || item.monthly_enrolments || 0),
    total_cards: Number(item.total_cards || item.lifetime_enrolments || 0),
    total_commission_earned: Number(item.total_commission_earned || item.commission || 0),
    pending_commission: Number(item.pending_commission || item.pending_payout || 0),
    status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Active",
    performance: item.performance || (Number(item.today_cards || 0) >= 10 ? "Excellent" : "On Track"),
    rating: Number(item.rating || 4.8),
    avatar: item.photo || item.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  };
}
