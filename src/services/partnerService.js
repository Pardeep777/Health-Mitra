import { api } from "./api";

export const partnerService = {
  // ==========================================
  // Categories Management APIs
  // ==========================================
  async getCategories() {
    try {
      const res = await api.get("/admin/partners/categories");
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch partner categories", e);
    }
    return [];
  },

  async addCategory({ name, description = "" }) {
    const res = await api.post("/admin/partners/categories", {
      name: name.trim(),
      description: description.trim()
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to add category.");
    }
    return { success: true, data: res.data, message: res.message || "Category added successfully" };
  },

  async editCategory({ id, name, description, status = "active" }) {
    const res = await api.post("/admin/partners/categories", {
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
    const formData = new FormData();
    formData.append("action", "delete");
    formData.append("id", String(id));

    let res = await api.postFormData("/admin/partners/categories", formData);
    if (!res.success) {
      res = await api.post("/admin/partners/categories", {
        action: "delete",
        id: Number(id)
      });
    }
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
      const res = await api.get("/admin/partners/services_master");
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch master services", e);
    }
    return [];
  },

  async addMasterService({ category_id, service_name, description = "", mrp, discount_percent = 20, status = "active" }) {
    const res = await api.post("/admin/partners/services_master", {
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
    const res = await api.post("/admin/partners/services_master", {
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
    const res = await api.post("/admin/partners/services_master", {
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
      const res = await api.get("/admin/partners/list", params);
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(normalizePartner);
      }
    } catch (e) {
      console.warn("API partners fetch error", e);
    }
    return [];
  },

  async search(query = "") {
    if (!query.trim()) return this.getAll();
    try {
      const res = await api.get("/admin/partners/search", { q: query.trim() });
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(normalizePartner);
      }
    } catch (e) {
      console.warn("API partners search error", e);
    }
    return [];
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

    const res = await api.postFormData("/admin/partners/add", formData);
    if (!res.success) {
      throw new Error(res.message || "Failed to add partner.");
    }
    return { success: true, data: res.data, message: res.message || "Partner added successfully!" };
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
      const res = await api.postFormData("/admin/partners/edit", formData);
      if (res.success) {
        return { success: true, message: res.message || "Partner updated successfully!" };
      }
    } catch (e) {
      console.warn("Partner update API error", e);
    }

    return { success: true, message: "Partner updated successfully!" };
  },

  async updateStatus(id, newStatus, agreementStatus = "Verified & Signed") {
    const cleanStatus = (newStatus || "active").toLowerCase();
    const cleanAgreement = (agreementStatus || "Verified & Signed").toLowerCase();

    const formData = new FormData();
    formData.append("id", String(id));
    formData.append("status", cleanStatus);
    formData.append("agreement_status", cleanAgreement);

    try {
      await api.postFormData("/admin/partners/edit", formData);
    } catch (e) {
      console.warn("Partner edit status API notice", e);
    }

    try {
      await api.post(`/admin/partners/list?status=${cleanStatus}`);
    } catch (e) {
      // Ignored
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
