import { api } from "./api";

export const cardholderService = {
  /**
   * Fetch all cardholders from backend API: GET /admin/cardholders/list.php
   */
  async getAll() {
    const res = await api.get("/admin/cardholders/list.php");
    if (res.success && Array.isArray(res.data)) {
      return res.data.map(normalizeCardholder);
    }
    return [];
  },

  /**
   * Filter cardholders by status: GET /admin/cardholders/status.php?type=...
   * Types: active | inactive | expiring_soon | expired | renewals | blocked
   */
  async getByStatus(type = "active") {
    const res = await api.get("/admin/cardholders/status.php", { type });
    if (res.success && Array.isArray(res.data)) {
      return res.data.map(normalizeCardholder);
    }
    return [];
  },

  /**
   * Search cardholders by keyword: GET /admin/cardholders/search.php?keyword=...
   */
  async search(keyword = "") {
    if (!keyword.trim()) return this.getAll();
    const res = await api.get("/admin/cardholders/search.php", { keyword: keyword.trim() });
    if (res.success && Array.isArray(res.data)) {
      return res.data.map(normalizeCardholder);
    }
    return [];
  },

  /**
   * Get single cardholder by ID
   */
  async getById(id) {
    const all = await this.getAll();
    return all.find((c) => String(c.id) === String(id) || String(c.unique_id) === String(id)) || null;
  },

  async getByUniqueId(uniqueId) {
    const all = await this.getAll();
    const cleanId = (uniqueId || "").trim().toUpperCase();
    return all.find((c) => (c.unique_id || "").toUpperCase() === cleanId) || null;
  },

  async getByPublicToken(token) {
    const all = await this.getAll();
    return all.find((c) => c.public_token === token || c.unique_id === token) || null;
  },

  /**
   * Add new cardholder: POST /admin/cardholders/add
   */
  async create(newCardholderData) {
    let formData;
    if (newCardholderData instanceof FormData) {
      formData = newCardholderData;
      if (formData.has("full_name") && !formData.has("name")) {
        formData.append("name", formData.get("full_name"));
      } else if (formData.has("name") && !formData.has("full_name")) {
        formData.append("full_name", formData.get("name"));
      }
    } else {
      formData = new FormData();
      const name = newCardholderData.name || newCardholderData.full_name || "";
      formData.append("name", name);
      formData.append("full_name", name);

      Object.entries(newCardholderData).forEach(([key, val]) => {
        if (val !== undefined && val !== null && key !== "name" && key !== "full_name") {
          formData.append(key, val);
        }
      });
    }

    const res = await api.postFormData("/admin/cardholders/add", formData);

    if (!res.success) {
      throw new Error(res.message || "Failed to add cardholder.");
    }

    return {
      record: res.data ? normalizeCardholder(res.data) : null,
      message: res.message || "Cardholder enrolled successfully!"
    };
  },

  /**
   * Edit cardholder: POST /admin/cardholders/edit.php
   */
  async update(cardholderData) {
    const res = await api.post("/admin/cardholders/edit.php", cardholderData);
    if (!res.success) {
      throw new Error(res.message || "Failed to update cardholder.");
    }
    return {
      success: true,
      data: res.data ? normalizeCardholder(res.data) : cardholderData,
      message: res.message || "Cardholder updated successfully!"
    };
  },

  /**
   * Delete cardholder: POST /admin/cardholders/delete.php
   */
  async delete(id) {
    const res = await api.post("/admin/cardholders/delete.php", { id: Number(id) || id });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete cardholder.");
    }
    return { success: true, message: res.message || "Cardholder deleted successfully!" };
  },

  /**
   * Cards List: GET /admin/cards/list.php?type=all|pending|active|expired
   */
  async getCardsList(type = "all") {
    const res = await api.get("/admin/cards/list.php", { type });
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  /**
   * Get QR data: GET /admin/cards/qr_management.php?card_id=...
   */
  async getCardQr(card_id) {
    const res = await api.get("/admin/cards/qr_management.php", { card_id });
    return res;
  },

  /**
   * Update Card Status: POST /admin/cards/update_status.php
   */
  async updateCardStatus(card_id, status) {
    const res = await api.post("/admin/cards/update_status.php", {
      card_id: Number(card_id) || card_id,
      status
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to update card status.");
    }
    return res;
  },

  /**
   * Re-generate Token: POST /admin/cards/qr_management.php
   */
  async regenerateToken(card_id) {
    const res = await api.post("/admin/cards/qr_management.php", {
      card_id: Number(card_id) || card_id,
      action: "regenerate_token"
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to regenerate QR token.");
    }
    return res;
  },

  /**
   * Verification Logs: GET /admin/cards/verification_logs.php
   */
  async getVerificationLogs() {
    const res = await api.get("/admin/cards/verification_logs.php");
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  async renew(unique_id) {
    return this.getByStatus("renewals");
  }
};

/**
 * Normalizes backend cardholder object to consistent frontend format
 */
function normalizeCardholder(item) {
  if (!item) return item;

  // Resolve full valid photo URL from photo or photo_url
  let photo = "";
  if (item.photo_url && typeof item.photo_url === "string" && item.photo_url.trim()) {
    photo = item.photo_url.replace(/\\/g, "").trim();
    if (!photo.startsWith("http") && !photo.startsWith("data:") && !photo.startsWith("blob:")) {
      photo = `https://cupan.getfreedeal.com/api/${photo.replace(/^\/+/, "")}`;
    }
  } else if (item.photo && typeof item.photo === "string" && item.photo.trim()) {
    const rawPhoto = item.photo.replace(/\\/g, "").trim();
    if (rawPhoto.startsWith("http") || rawPhoto.startsWith("data:") || rawPhoto.startsWith("blob:")) {
      photo = rawPhoto;
    } else {
      photo = `https://cupan.getfreedeal.com/api/${rawPhoto.replace(/^\/+/, "")}`;
    }
  }

  return {
    id: item.id || `CARD-${Date.now()}`,
    unique_id: item.unique_id || item.customer_code || item.card_number || `HMC-${item.id || "000"}`,
    full_name: item.full_name || item.name || "Member",
    mobile: item.mobile || "",
    alternate_mobile: item.alternate_mobile || "",
    email: item.email || "",
    dob: item.dob || "",
    gender: item.gender || "male",
    photo: photo,
    photo_url: photo,
    district: item.district || item.district_name || "West Tripura",
    district_id: item.district_id || 1,
    pin_code: item.pin_code || "799001",
    address: item.address || "",
    id_proof_type: item.id_proof_type || "Aadhaar Card",
    id_proof_reference: item.id_proof_reference || "",
    status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Active",
    card_status: item.card_status || item.status || "active",
    issue_date: item.issue_date || new Date().toISOString().split("T")[0],
    expiry_date: item.expiry_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    public_token: item.public_token || `HM_PUBLIC_${item.id || "TOKEN"}`,
    price_paid: item.price_paid || 49,
    registered_by_name: item.registered_by_name || item.agent_name || "Direct Agent"
  };
}
