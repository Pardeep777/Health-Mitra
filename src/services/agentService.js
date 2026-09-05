import { initialAgents } from "../data/agents";

export const agentService = {
  async getAll() {
    await new Promise((r) => setTimeout(r, 150));
    const saved = localStorage.getItem("health_mitra_agents");
    return saved ? JSON.parse(saved) : initialAgents;
  },

  async getById(id) {
    await new Promise((r) => setTimeout(r, 100));
    const all = await this.getAll();
    return all.find((a) => a.id === id || a.agent_code === id) || null;
  },

  async incrementRegistration(agentId) {
    const all = await this.getAll();
    const index = all.findIndex((a) => a.id === agentId || a.agent_code === agentId);
    if (index === -1) return null;
    all[index].today_cards += 1;
    all[index].month_cards += 1;
    all[index].total_cards += 1;
    all[index].total_commission_earned += 10;
    localStorage.setItem("health_mitra_agents", JSON.stringify(all));
    return all[index];
  }
};
