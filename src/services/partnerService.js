import { initialPartners } from "../data/partners";

export const partnerService = {
  async getAll() {
    await new Promise((r) => setTimeout(r, 150));
    const saved = localStorage.getItem("health_mitra_partners");
    return saved ? JSON.parse(saved) : initialPartners;
  },

  async getById(id) {
    await new Promise((r) => setTimeout(r, 100));
    const all = await this.getAll();
    return all.find((p) => p.id === id) || null;
  },

  async createApplication(applicationData) {
    await new Promise((r) => setTimeout(r, 300));
    const all = await this.getAll();
    const newPartner = {
      id: `PART-${1000 + all.length + 1}`,
      status: "Pending",
      agreementStatus: "Under Review",
      joinedDate: new Date().toISOString().split("T")[0],
      totalVerifications: 0,
      totalDiscountGiven: 0,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1586015554063-8a35d9472e39?w=600&auto=format&fit=crop&q=80",
      ...applicationData
    };
    const updated = [newPartner, ...all];
    localStorage.setItem("health_mitra_partners", JSON.stringify(updated));
    return newPartner;
  },

  async updateStatus(id, newStatus, agreementStatus = "Verified & Signed") {
    await new Promise((r) => setTimeout(r, 200));
    const all = await this.getAll();
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) return null;
    all[index] = {
      ...all[index],
      status: newStatus,
      agreementStatus: agreementStatus
    };
    localStorage.setItem("health_mitra_partners", JSON.stringify(all));
    return all[index];
  },

  async updateServices(id, services) {
    await new Promise((r) => setTimeout(r, 200));
    const all = await this.getAll();
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) return null;
    all[index].services = services;
    localStorage.setItem("health_mitra_partners", JSON.stringify(all));
    return all[index];
  }
};
