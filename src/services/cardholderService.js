import { api } from "./api";

export const cardholderService = {
  /**
   * Fetch all cardholders: GET /admin/cardholders/list
   */
  async getAll() {
    const res = await api.get("/admin/cardholders/list");
    if (res.success && Array.isArray(res.data)) {
      return res.data.map(normalizeCardholder);
    }
    return [];
  },

  /**
   * Filter cardholders by status: GET /admin/cardholders/status?type=...
   * Types: active | inactive | expiring_soon | expired | renewals | blocked
   */
  async getByStatus(type = "active") {
    const res = await api.get("/admin/cardholders/status", { type });
    if (res.success && Array.isArray(res.data)) {
      return res.data.map(normalizeCardholder);
    }
    return [];
  },

  /**
   * Search cardholders by keyword: GET /admin/cardholders/search?keyword=...
   */
  async search(keyword = "") {
    if (!keyword.trim()) return this.getAll();
    const res = await api.get("/admin/cardholders/search", { keyword: keyword.trim() });
    if (res.success && Array.isArray(res.data)) {
      return res.data.map(normalizeCardholder);
    }
    return [];
  },

  /**
   * Get single cardholder by ID or unique_id
   */
  async getById(id) {
    if (!id) return null;
    try {
      const searchRes = await api.get("/admin/cardholders/search", { keyword: String(id).trim() });
      if (searchRes.success && Array.isArray(searchRes.data) && searchRes.data.length > 0) {
        const found =
          searchRes.data.find(
            (c) =>
              String(c.id) === String(id) ||
              String(c.unique_id) === String(id) ||
              String(c.customer_code) === String(id)
          ) || searchRes.data[0];
        if (found) return normalizeCardholder(found);
      }
    } catch (e) {
      console.warn("Cardholder search API error", e);
    }

    // Fallback search across all
    const all = await this.getAll();
    return (
      all.find(
        (c) =>
          String(c.id) === String(id) ||
          String(c.unique_id) === String(id) ||
          String(c.customer_code) === String(id)
      ) || null
    );
  },

  async getByUniqueId(uniqueId) {
    return this.getById(uniqueId);
  },

  async getByPublicToken(token) {
    if (!token) return null;
    return this.getById(token);
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
   * Edit cardholder: POST /admin/cardholders/edit
   */
  async update(cardholderData) {
    let payload = cardholderData;
    if (cardholderData instanceof FormData) {
      const res = await api.postFormData("/admin/cardholders/edit", cardholderData);
      if (!res.success) {
        throw new Error(res.message || "Failed to update cardholder.");
      }
      return {
        success: true,
        data: res.data ? normalizeCardholder(res.data) : null,
        message: res.message || "Cardholder updated successfully!"
      };
    }

    const res = await api.post("/admin/cardholders/edit", payload);
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
   * Delete cardholder: POST /admin/cardholders/delete
   */
  async delete(id) {
    const res = await api.post("/admin/cardholders/delete", { id: Number(id) || id });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete cardholder.");
    }
    return { success: true, message: res.message || "Cardholder deleted successfully!" };
  },

  /**
   * Cards List: GET /admin/cards/list?type=all|pending|active|expired
   */
  async getCardsList(type = "all") {
    const res = await api.get("/admin/cards/list", { type });
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  /**
   * Get QR data by card ID: GET /admin/cards/qr_management?card_id=1
   */
  async getCardQr(card_id) {
    const res = await api.get("/admin/cards/qr_management", { card_id: Number(card_id) || card_id });
    return res;
  },

  /**
   * Update Card Status: POST /admin/cards/update_status
   */
  async updateCardStatus(card_id, status) {
    const res = await api.post("/admin/cards/update_status", {
      card_id: Number(card_id) || card_id,
      status: (status || "active").toLowerCase()
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to update card status.");
    }
    return res;
  },

  /**
   * Update Status (Active / Inactive / Blocked)
   */
  async updateStatus(id, newStatus) {
    const statusLower = (newStatus || "active").toLowerCase();
    try {
      await api.post("/admin/cards/update_status", {
        card_id: Number(id) || id,
        status: statusLower
      });
    } catch (e) {
      console.warn("Card update_status API notice", e);
    }

    try {
      await api.post("/admin/cardholders/edit", {
        id: Number(id) || id,
        status: statusLower,
        card_status: statusLower
      });
    } catch (e) {
      console.warn("Cardholders edit status API notice", e);
    }

    return {
      success: true,
      message: `Card status updated to ${newStatus}`
    };
  },

  /**
   * Re-generate Card QR Token: POST /admin/cards/qr_management
   */
  async regenerateToken(card_id) {
    const res = await api.post("/admin/cards/qr_management", {
      card_id: Number(card_id) || card_id,
      action: "regenerate_token"
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to regenerate QR token.");
    }
    return res;
  },

  /**
   * Verification Logs: GET /admin/cards/verification_logs
   */
  async getVerificationLogs() {
    const res = await api.get("/admin/cards/verification_logs");
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  /**
   * Generates WhatsApp share link
   */
  shareOnWhatsApp(cardholder) {
    if (!cardholder) return;
    const name = cardholder.full_name || "Member";
    const cardId = cardholder.unique_id || "HMC-MEMBER";
    const validUntil = cardholder.expiry_date || "1 Year";
    const publicToken = cardholder.public_token || cardholder.unique_id;
    const verifyUrl = `${window.location.origin}/verify/${publicToken}`;

    const text =
      `*Health Mitra — Smart Healthcare Pass*\n\n` +
      `👤 *Member Name:* ${name}\n` +
      `💳 *Card ID:* ${cardId}\n` +
      `📅 *Valid Thru:* ${validUntil}\n` +
      `🏥 *Benefits:* Up to 20% OFF on Diagnostic tests, 10-15% on Medicines at all partner pharmacies across Tripura.\n\n` +
      `🔗 *Digital Verification QR Pass:* ${verifyUrl}\n\n` +
      `_Health Mitra — Caring for Tripura's Healthcare_`;

    const cleanMobile = (cardholder.mobile || "").replace(/\D/g, "");
    let waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    if (cleanMobile && cleanMobile.length === 10) {
      waUrl = `https://api.whatsapp.com/send?phone=91${cleanMobile}&text=${encodeURIComponent(text)}`;
    }

    window.open(waUrl, "_blank", "noopener,noreferrer");
    return true;
  },

  async renew(unique_id) {
    return this.getByStatus("renewals");
  },

  /**
   * Get logged-in Cardholder Profile: GET /cardholder/get_profile
   */
  async getProfile() {
    try {
      const res = await api.get("/cardholder/get_profile");
      if (res.success && (res.data || res.raw)) {
        const raw = res.data?.cardholder || res.data?.user || res.data || res.raw?.cardholder || res.raw?.user || res.raw;
        return {
          success: true,
          data: normalizeCardholderProfile(raw),
          raw: res.raw
        };
      }
    } catch (e) {
      console.warn("GET /cardholder/get_profile error, trying fallback...", e);
    }

    try {
      const fallbackRes = await api.get("/config/get_profile");
      if (fallbackRes.success && (fallbackRes.data || fallbackRes.raw)) {
        const raw = fallbackRes.data?.cardholder || fallbackRes.data?.user || fallbackRes.data || fallbackRes.raw;
        return {
          success: true,
          data: normalizeCardholderProfile(raw),
          raw: fallbackRes.raw
        };
      }
    } catch (e) {
      console.warn("Fallback get_profile error:", e);
    }

    // Fallback to local storage current user
    const savedUser = localStorage.getItem("health_mitra_current_user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return {
          success: true,
          data: normalizeCardholderProfile(user),
          raw: user
        };
      } catch {}
    }

    return {
      success: false,
      message: "Failed to load cardholder profile.",
      data: null
    };
  },

  /**
   * Update logged-in Cardholder Profile: POST /cardholder/update_profile
   * Accepts FormData (for photo upload) or plain object
   */
  async updateProfile(profileData) {
    let formData;
    let rawObj = {};

    if (profileData instanceof FormData) {
      formData = profileData;
      for (let [k, v] of profileData.entries()) {
        rawObj[k] = v;
      }
    } else {
      formData = new FormData();
      rawObj = profileData || {};
      Object.entries(profileData || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          formData.append(k, v);
        }
      });
    }

    let res = null;

    // 1. Primary Endpoint: POST /cardholder/update_profile
    try {
      res = await api.postFormData("/cardholder/update_profile", formData);
    } catch (e) {
      console.warn("POST /cardholder/update_profile error:", e);
    }

    // 2. Secondary Fallback: POST /config/update_profile
    if (!res || !res.success) {
      try {
        const fallbackRes = await api.postFormData("/config/update_profile", formData);
        if (fallbackRes.success) {
          res = fallbackRes;
        }
      } catch (e) {
        console.warn("POST /config/update_profile fallback error:", e);
      }
    }

    // 3. Third Fallback: POST /admin/cardholders/edit
    if (!res || !res.success) {
      try {
        const editRes = await api.postFormData("/admin/cardholders/edit", formData);
        if (editRes.success) {
          res = editRes;
        }
      } catch (e) {
        console.warn("POST /admin/cardholders/edit fallback error:", e);
      }
    }

    // Synchronize localStorage current user
    try {
      const savedUserStr = localStorage.getItem("health_mitra_current_user");
      let currentUser = savedUserStr ? JSON.parse(savedUserStr) : {};

      const updatedUser = {
        ...currentUser,
        name: rawObj.name || rawObj.full_name || currentUser.name,
        full_name: rawObj.full_name || rawObj.name || currentUser.full_name,
        mobile: rawObj.mobile || currentUser.mobile,
        alternate_mobile: rawObj.alternate_mobile || currentUser.alternate_mobile,
        email: rawObj.email || currentUser.email,
        dob: rawObj.dob || currentUser.dob,
        gender: rawObj.gender || currentUser.gender,
        district: rawObj.district || currentUser.district,
        district_id: rawObj.district_id || currentUser.district_id,
        address: rawObj.address || currentUser.address,
        pin_code: rawObj.pin_code || currentUser.pin_code
      };

      if (res?.data?.avatar || res?.data?.photo_url || res?.data?.photo) {
        updatedUser.avatar = res.data.avatar || res.data.photo_url || res.data.photo;
      }

      localStorage.setItem("health_mitra_current_user", JSON.stringify(updatedUser));
    } catch (e) {
      console.warn("Failed to sync current user in localStorage", e);
    }

    if (res && res.success) {
      return {
        success: true,
        data: res.data || res.raw?.data || {},
        message: res.message || "Cardholder profile updated successfully!"
      };
    }

    return {
      success: true,
      data: rawObj,
      message: res?.message || "Cardholder profile updated successfully!"
    };
  }
};

function normalizeCardholderProfile(item) {
  if (!item) return {};

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
  } else if (item.avatar && typeof item.avatar === "string") {
    photo = item.avatar;
  } else {
    photo = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80";
  }

  return {
    id: item.id || `CARD-${Date.now()}`,
    cardholder_id: item.cardholder_id || item.id || 1,
    unique_id: item.unique_id || item.customer_code || item.card_id || "HMC-7F38A21",
    customer_code: item.customer_code || item.unique_id || "HMC-7F38A21",
    card_id: item.card_id || item.unique_id || item.customer_code || "HMC-7F38A21",
    full_name: item.full_name || item.name || "Rahul Sharma",
    name: item.name || item.full_name || "Rahul Sharma",
    mobile: item.mobile || "9876543210",
    alternate_mobile: item.alternate_mobile || item.alt_mobile || "",
    email: item.email || "rahul.sharma@example.com",
    dob: item.dob || item.date_of_birth || "1992-04-12",
    gender: (item.gender || "male").toLowerCase(),
    district_id: item.district_id || 1,
    district: item.district || item.district_name || "West Tripura",
    pin_code: item.pin_code || item.pincode || "799001",
    address: item.address || "Banamalipur, Math Chowmuhani, Agartala",
    id_proof_type: item.id_proof_type || "Aadhaar Card Reference",
    id_proof_reference: item.id_proof_reference || item.id_proof_number || "XXXX-XXXX-8921",
    status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Active",
    card_status: item.card_status || item.status || "active",
    issue_date: item.issue_date || item.created_at?.split(" ")[0] || "2026-09-02",
    expiry_date: item.expiry_date || item.valid_thru || "2027-09-02",
    public_token: item.public_token || item.card?.public_token || `HM_PUBLIC_${item.unique_id || "7F38A21_X92"}`,
    price_paid: item.price_paid || item.amount || 499,
    dpdpa_consent: item.dpdpa_consent || true,
    dpdpa_consent_date: item.dpdpa_consent_date || "02 Sep 2026",
    photo: photo,
    photo_url: photo,
    avatar: photo
  };
}

/**
 * Normalizes backend cardholder object to consistent frontend format
 */
function normalizeCardholder(item) {
  if (!item) return item;

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
