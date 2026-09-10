import { api } from "./api";
import { initialDistributors } from "../data/distributors";

export const distributorService = {
  /**
   * Fetch all distributors from backend API: GET /admin/distributors/list or /admin/distributors
   */
  async getAll() {
    try {
      const res = await api.get("/admin/distributors/list");
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeDistributor);
      }
    } catch (e) {
      console.warn("Distributors API fetch error, checking alternative endpoint", e);
    }

    try {
      const res2 = await api.get("/admin/distributors");
      if (res2.success && Array.isArray(res2.data) && res2.data.length > 0) {
        return res2.data.map(normalizeDistributor);
      }
    } catch (e) {
      // Fallback to local default data
    }

    const local = localStorage.getItem("health_mitra_distributors");
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }

    return initialDistributors;
  },

  /**
   * Search distributors by name, district, or owner: GET /admin/distributors/search?q=...
   */
  async search(query = "") {
    if (!query.trim()) return this.getAll();
    try {
      const res = await api.get("/admin/distributors/search", { q: query.trim() });
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeDistributor);
      }
    } catch (e) {
      console.warn("Distributor search API notice", e);
    }

    const all = await this.getAll();
    const q = query.toLowerCase();
    return all.filter(
      (d) =>
        (d.name || "").toLowerCase().includes(q) ||
        (d.district || "").toLowerCase().includes(q) ||
        (d.owner_name || "").toLowerCase().includes(q) ||
        (d.distributor_code || "").toLowerCase().includes(q)
    );
  },

  /**
   * Add new distributor: POST /admin/distributors/add
   */
  async create(data) {
    try {
      const res = await api.post("/admin/distributors/add", data);
      if (res.success) {
        return { success: true, message: res.message || "Distributor added successfully!", data: res.data };
      }
    } catch (e) {
      console.warn("Distributor add API fallback", e);
    }

    const all = await this.getAll();
    const newDist = {
      id: Date.now(),
      distributor_code: `HMD-${String(all.length + 1).padStart(3, "0")}`,
      name: data.name,
      district: data.district || "West Tripura",
      address: data.address || "",
      owner_name: data.owner_name || "",
      phone: data.phone || "",
      email: data.email || "",
      points_managed: Number(data.points_managed || 5),
      assigned_agents_count: Number(data.assigned_agents_count || 2),
      target_monthly: Number(data.target_monthly || 500),
      achieved_monthly: 0,
      status: "Active"
    };
    all.unshift(newDist);
    localStorage.setItem("health_mitra_distributors", JSON.stringify(all));

    return { success: true, message: "Distributor created successfully!", data: newDist };
  },

  /**
   * Edit distributor: POST /admin/distributors/edit
   */
  async update(data) {
    try {
      const res = await api.post("/admin/distributors/edit", data);
      if (res.success) {
        return { success: true, message: res.message || "Distributor updated successfully!" };
      }
    } catch (e) {
      console.warn("Distributor edit API fallback", e);
    }

    const all = await this.getAll();
    const idx = all.findIndex((d) => String(d.id) === String(data.id));
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...data };
      localStorage.setItem("health_mitra_distributors", JSON.stringify(all));
    }

    return { success: true, message: "Distributor updated successfully!" };
  },

  /**
   * Delete distributor: POST /admin/distributors/delete
   */
  async delete(id) {
    try {
      const res = await api.post("/admin/distributors/delete", { id: Number(id) });
      if (res.success) {
        return { success: true, message: res.message || "Distributor deleted successfully!" };
      }
    } catch (e) {
      console.warn("Distributor delete API fallback", e);
    }

    const all = await this.getAll();
    const filtered = all.filter((d) => String(d.id) !== String(id));
    localStorage.setItem("health_mitra_distributors", JSON.stringify(filtered));

    return { success: true, message: "Distributor deleted successfully!" };
  }
};

function normalizeDistributor(item) {
  if (!item) return item;
  return {
    id: item.id || `DIST-${Date.now()}`,
    distributor_code: item.distributor_code || `HMD-${String(item.id || "001").padStart(3, "0")}`,
    name: item.name || item.business_name || "Regional Distributor",
    district: item.district || item.district_name || "West Tripura",
    district_id: item.district_id || 1,
    address: item.address || "",
    owner_name: item.owner_name || item.owner || "Partner",
    phone: item.phone || item.mobile || "",
    email: item.email || "",
    points_managed: Number(item.points_managed || item.retail_points || 5),
    assigned_agents_count: Number(item.assigned_agents_count || item.agents_count || 3),
    target_monthly: Number(item.target_monthly || 500),
    achieved_monthly: Number(item.achieved_monthly || item.current_sales || 0),
    status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Active"
  };
}
