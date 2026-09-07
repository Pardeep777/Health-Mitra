import { api } from "./api";
import { initialPartners } from "../data/partners";

export const partnerService = {
  // ==========================================
  // Categories Management APIs
  // ==========================================
  async getCategories() {
    try {
      const res = await api.get("/admin/partners/categories.php");
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch partner categories", e);
    }
    return [];
  },

  async addCategory({ name, description = "" }) {
    const res = await api.post("/admin/partners/categories.php", {
      name: name.trim(),
      description: description.trim()
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to add category.");
    }
    return { success: true, data: res.data, message: res.message || "Category added successfully" };
  },

  async editCategory({ id, name, description, status = "active" }) {
    const res = await api.post("/admin/partners/categories.php", {
      id: Number(id),
      name: name.trim(),
      description: description?.trim() || "",
      status
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to update category.");
    }
    return { success: true, message: res.message || "Category updated successfully" };
  },

  async deleteCategory(id) {
    const res = await api.post("/admin/partners/categories.php", {
      action: "delete",
      id: Number(id)
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete category.");
    }
    return { success: true, message: res.message || "Category deleted successfully" };
  },

  // ==========================================
  // Master Services Management APIs
  // ==========================================
  async getMasterServices() {
    try {
      const res = await api.get("/admin/partners/services_master.php");
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch master services", e);
    }
    return [];
  },

  async addMasterService({ category_id, service_name, description = "", mrp, discount_percent = 20, status = "active" }) {
    const res = await api.post("/admin/partners/services_master.php", {
      action: "add",
      category_id: Number(category_id),
      service_name: service_name.trim(),
      description: description.trim(),
      mrp: Number(mrp),
      discount_percent: Number(discount_percent),
      status
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to add master service.");
    }
    return { success: true, data: res.data, message: res.message || "Master service added successfully" };
  },

  async editMasterService({ id, category_id, service_name, description = "", mrp, discount_percent = 20, status = "active" }) {
    const res = await api.post("/admin/partners/services_master.php", {
      action: "edit",
      id: Number(id),
      category_id: Number(category_id),
      service_name: service_name.trim(),
      description: description.trim(),
      mrp: Number(mrp),
      discount_percent: Number(discount_percent),
      status
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to update master service.");
    }
    return { success: true, message: res.message || "Master service updated successfully" };
  },

  async deleteMasterService(id) {
    const res = await api.post("/admin/partners/services_master.php", {
      action: "delete",
      id: Number(id)
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete master service.");
    }
    return { success: true, message: res.message || "Master service deleted successfully" };
  },

  // ==========================================
  // Partner Outlets Management APIs
  // ==========================================
  async getAll(params = {}) {
    try {
      const res = await api.get("/admin/partners/list.php", params);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizePartner);
      }
    } catch (e) {
      console.warn("API partners fetch failed, using stored/fallback partners", e);
    }
    const saved = localStorage.getItem("health_mitra_partners");
    return saved ? JSON.parse(saved) : initialPartners;
  },

  async search(query = "") {
    if (!query.trim()) return this.getAll();
    try {
      const res = await api.get("/admin/partners/search.php", { q: query.trim() });
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(normalizePartner);
      }
    } catch (e) {
      console.warn("API partners search error", e);
    }
    const all = await this.getAll();
    const term = query.toLowerCase();
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.owner.toLowerCase().includes(term) ||
        p.address.toLowerCase().includes(term)
    );
  },

  async getById(id) {
    const all = await this.getAll();
    return all.find((p) => String(p.id) === String(id)) || null;
  },

  async create(partnerData) {
    let formData;
    if (partnerData instanceof FormData) {
      formData = partnerData;
    } else {
      formData = new FormData();
      Object.entries(partnerData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, v);
      });
    }

    try {
      const res = await api.postFormData("/admin/partners/add.php", formData);
      if (res.success) {
        return { success: true, data: res.data, message: res.message || "Partner added successfully!" };
      }
    } catch (e) {
      console.warn("Partner add API error", e);
    }

    // Local state fallback
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
      ...(partnerData instanceof FormData ? Object.fromEntries(partnerData) : partnerData)
    };
    const updated = [newPartner, ...all];
    localStorage.setItem("health_mitra_partners", JSON.stringify(updated));
    return { success: true, data: newPartner, message: "Partner added successfully!" };
  },

  async update(partnerData) {
    let formData;
    if (partnerData instanceof FormData) {
      formData = partnerData;
    } else {
      formData = new FormData();
      Object.entries(partnerData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, v);
      });
    }

    try {
      const res = await api.postFormData("/admin/partners/edit.php", formData);
      if (res.success) {
        return { success: true, message: res.message || "Partner updated successfully!" };
      }
    } catch (e) {
      console.warn("Partner update API error", e);
    }

    return { success: true, message: "Partner updated successfully!" };
  },

  async updateStatus(id, newStatus, agreementStatus = "Verified & Signed") {
    const all = await this.getAll();
    const index = all.findIndex((p) => String(p.id) === String(id));
    if (index !== -1) {
      all[index] = {
        ...all[index],
        status: newStatus,
        agreementStatus: agreementStatus
      };
      localStorage.setItem("health_mitra_partners", JSON.stringify(all));
    }
    return { success: true, message: `Partner status updated to ${newStatus}` };
  },

  async updateServices(id, services) {
    const all = await this.getAll();
    const index = all.findIndex((p) => String(p.id) === String(id));
    if (index !== -1) {
      all[index].services = services;
      localStorage.setItem("health_mitra_partners", JSON.stringify(all));
    }
    return { success: true, message: "Partner services updated" };
  }
};

function normalizePartner(item) {
  if (!item) return item;
  return {
    id: item.id || `PART-${Date.now()}`,
    name: item.business_name || item.name || "Healthcare Partner",
    category: item.category_name || item.category || "Pharmacy",
    category_id: item.category_id || 1,
    owner: item.owner_name || item.owner || "Owner",
    phone: item.mobile || item.phone || "",
    alternate_mobile: item.alternate_mobile || "",
    email: item.email || "",
    district: item.district_name || item.district || "West Tripura",
    district_id: item.district_id || 1,
    area_id: item.area_id || 1,
    pincode: item.pin_code || item.pincode || "799001",
    address: item.address || "",
    discountPercent: Number(item.max_discount_percent || item.discountPercent || 20),
    status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Active",
    agreementStatus: item.agreement_status || "Verified & Signed",
    image: item.logo || item.shop_image || item.image || "https://images.unsplash.com/photo-1586015554063-8a35d9472e39?w=600&auto=format&fit=crop&q=80",
    services: item.services || []
  };
}
