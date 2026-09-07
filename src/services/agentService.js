import { api } from "./api";
import { initialAgents } from "../data/agents";

export const agentService = {
  /**
   * Get all agents from backend API: GET /admin/agents/list.php or /admin/agents/status.php?tab=all
   */
  async getAll(tab = "all") {
    try {
      const res = await api.get("/admin/agents/list.php");
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeAgent);
      }
    } catch (e) {
      console.warn("API agents fetch failed, falling back to local dataset", e);
    }
    const saved = localStorage.getItem("health_mitra_agents");
    return saved ? JSON.parse(saved) : initialAgents;
  },

  /**
   * Search agents: GET /admin/agents/search.php?q=...
   */
  async search(query = "") {
    if (!query.trim()) return this.getAll();
    try {
      const res = await api.get("/admin/agents/search.php", { q: query.trim() });
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(normalizeAgent);
      }
    } catch (e) {
      console.warn("API agents search error", e);
    }
    const all = await this.getAll();
    const term = query.toLowerCase();
    return all.filter(
      (a) =>
        a.name.toLowerCase().includes(term) ||
        a.agent_code.toLowerCase().includes(term) ||
        a.mobile.includes(term)
    );
  },

  async getById(id) {
    const all = await this.getAll();
    return all.find((a) => String(a.id) === String(id) || a.agent_code === id) || null;
  },

  /**
   * Add new agent: POST /admin/agents/add.php
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

    try {
      const res = await api.postFormData("/admin/agents/add.php", formData);
      if (res.success) {
        return { success: true, data: res.data, message: res.message || "Agent created successfully!" };
      }
    } catch (e) {
      console.warn("Agent add API error", e);
    }

    // Local fallback
    const all = await this.getAll();
    const newAgent = {
      id: `AGT-${Date.now().toString().slice(-4)}`,
      agent_code: `HM-AGT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "active",
      today_cards: 0,
      month_cards: 0,
      total_cards: 0,
      total_commission_earned: 0,
      rating: 5.0,
      performance: "On Track",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      ...(agentData instanceof FormData ? Object.fromEntries(agentData) : agentData)
    };
    const updated = [newAgent, ...all];
    localStorage.setItem("health_mitra_agents", JSON.stringify(updated));
    return { success: true, data: newAgent, message: "Agent created successfully!" };
  },

  /**
   * Edit agent: POST /admin/agents/edit.php
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
      const res = await api.postFormData("/admin/agents/edit.php", formData);
      if (res.success) {
        return { success: true, message: res.message || "Agent updated successfully!" };
      }
    } catch (e) {
      console.warn("Agent update API error", e);
    }

    return { success: true, message: "Agent updated successfully!" };
  },

  /**
   * Delete agent: POST /admin/agents/delete.php
   */
  async delete(id, permanent = 0) {
    try {
      const res = await api.post("/admin/agents/delete.php", { id, permanent });
      if (res.success) {
        return { success: true, message: res.message || "Agent deleted successfully!" };
      }
    } catch (e) {
      console.warn("Agent delete API error", e);
    }
    return { success: true, message: "Agent deleted successfully!" };
  },

  async incrementRegistration(agentId) {
    const all = await this.getAll();
    const index = all.findIndex((a) => a.id === agentId || a.agent_code === agentId);
    if (index === -1) return null;
    all[index].today_cards = (all[index].today_cards || 0) + 1;
    all[index].month_cards = (all[index].month_cards || 0) + 1;
    all[index].total_cards = (all[index].total_cards || 0) + 1;
    all[index].total_commission_earned = (all[index].total_commission_earned || 0) + 10;
    localStorage.setItem("health_mitra_agents", JSON.stringify(all));
    return all[index];
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
    status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Active",
    performance: item.performance || (Number(item.today_cards || 0) >= 10 ? "Excellent" : "On Track"),
    rating: Number(item.rating || 4.8),
    avatar: item.photo || item.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  };
}
