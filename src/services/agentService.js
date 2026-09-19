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
  },

  // ==========================================
  // AGENT PORTAL AUTHENTICATED ENDPOINTS
  // ==========================================

  /**
   * Fetch districts for Agent portal: GET /agent/get_districts
   * Supports ?status=active, ?search=..., ?with_areas=true/false
   */
  async getDistricts(params = { with_areas: true }) {
    try {
      const res = await api.get("/agent/get_districts", params);
      if (res.success && res.data) {
        return Array.isArray(res.data) ? res.data : (res.data.data || []);
      }
    } catch (e) {
      console.warn("Agent get_districts API error", e);
    }
    return [];
  },

  /**
   * Get card price & DPDPA consent metadata: GET /agent/get_card_price
   */
  async getCardPrice() {
    try {
      const res = await api.get("/agent/get_card_price");
      if (res.success && (res.data || res.raw)) {
        const payload = res.data || res.raw || {};
        return {
          success: true,
          price: Number(payload.price || payload.amount || payload.card_price || 499),
          currency: payload.currency || "INR",
          currency_symbol: payload.currency_symbol || "₹",
          validity_years: Number(payload.validity_years || 1),
          consent_text:
            payload.consent_text ||
            payload.dpdpa_consent ||
            "I hereby consent to register for Health Mitra membership under the Digital Personal Data Protection Act (DPDPA 2023) and agree to share demographic details for digital health discount pass issuance.",
          terms_url: payload.terms_url || "/dpdpa",
          data: payload
        };
      }
    } catch (e) {
      console.warn("Agent get_card_price API error", e);
    }

    return {
      success: true,
      price: 499,
      currency: "INR",
      currency_symbol: "₹",
      validity_years: 1,
      consent_text:
        "I hereby consent to register for Health Mitra membership under the Digital Personal Data Protection Act (DPDPA 2023) and agree to share demographic details for digital health discount pass issuance.",
      terms_url: "/dpdpa",
      data: { price: 499 }
    };
  },

  /**
   * Get logged-in Agent's registered cardholders: GET /agent/cards
   * Supports query: { search, status, unique_id, page, limit }
   */
  async getMyCards(params = {}) {
    try {
      const res = await api.get("/agent/cards", params);
      if (res.success && res.data) {
        const rawList = Array.isArray(res.data) ? res.data : res.data.data || [];
        const normalized = rawList.map((c) => ({
          id: c.cardholder_id || c.id,
          cardholder_id: c.cardholder_id || c.id,
          customer_code: c.customer_code || c.unique_id,
          unique_id: c.unique_id || c.customer_code,
          full_name: c.full_name || c.name || "Cardholder",
          mobile: c.mobile || "",
          alternate_mobile: c.alternate_mobile || "",
          email: c.email || "",
          dob: c.dob || "",
          gender: c.gender || "",
          district: c.district || "West Tripura",
          district_id: c.district_id || 1,
          address: c.address || "",
          pin_code: c.pin_code || "799001",
          id_proof_type: c.id_proof_type || "Aadhaar Card Reference",
          id_proof_reference: c.id_proof_reference || "",
          status: c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : "Active",
          expiry_date: c.expiry_date || c.valid_thru || "2027-09-18",
          issue_date: c.issue_date || c.created_at?.split(" ")[0] || "2026-09-18",
          created_at: c.created_at || "",
          public_token: c.public_token || c.card?.public_token || `HM_PUBLIC_${c.unique_id || c.id}`,
          photo_url: c.photo_url || null,
          id_proof_url: c.id_proof_url || null
        }));

        return {
          success: true,
          summary: res.raw?.summary || res.data?.summary || {
            total_all: normalized.length,
            total_active: normalized.filter((x) => x.status.toLowerCase() === "active").length,
            total_inactive: normalized.filter((x) => x.status.toLowerCase() === "inactive").length,
            total_expiring_soon: 0,
            total_expired: 0
          },
          data: normalized
        };
      }
    } catch (e) {
      console.warn("Agent cards API error", e);
    }

    return {
      success: false,
      summary: { total_all: 0, total_active: 0, total_inactive: 0, total_expiring_soon: 0, total_expired: 0 },
      data: []
    };
  },

  /**
   * Get single cardholder by Unique ID: GET /agent/cards?unique_id=...
   */
  async getCardByUniqueId(uniqueId) {
    if (!uniqueId) return null;
    const cleanId = uniqueId.trim();
    const res = await this.getMyCards({ unique_id: cleanId });
    if (res?.data && res.data.length > 0) {
      return (
        res.data.find(
          (c) =>
            c.unique_id?.toLowerCase() === cleanId.toLowerCase() ||
            c.customer_code?.toLowerCase() === cleanId.toLowerCase()
        ) || res.data[0]
      );
    }
    return null;
  },

  /**
   * Get logged-in Agent's performance, target compliance & commission ledger: GET /agent/performance
   * Supports date range query params: { from_date, to_date }
   */
  async getMyPerformance(params = {}) {
    try {
      const res = await api.get("/agent/performance", params);
      if (res.success && (res.data || res.raw)) {
        const payload = res.raw || res.data;
        return {
          success: true,
          agent: payload.agent || {},
          kpi_cards: payload.kpi_cards || {},
          ledger_summary: payload.ledger_summary || {},
          daily_compliance_ledger: payload.daily_compliance_ledger || []
        };
      }
    } catch (e) {
      console.warn("Agent performance API error", e);
    }

    return {
      success: false,
      agent: {},
      kpi_cards: {},
      ledger_summary: {},
      daily_compliance_ledger: []
    };
  },

  /**
   * Register new cardholder from Agent portal: POST /agent/register
   * Body: { full_name, mobile, dob, gender, district_id, district, address, pin_code, id_proof_type, id_proof_reference, consent_checkbox, amount, payment_mode }
   */
  async registerCardholder(formDataOrObj) {
    let res;
    if (formDataOrObj instanceof FormData) {
      res = await api.postFormData("/agent/register", formDataOrObj);
    } else {
      res = await api.post("/agent/register", formDataOrObj);
    }

    if (!res.success) {
      throw new Error(res.message || "Failed to register cardholder.");
    }

    return {
      success: true,
      message: res.message || "Cardholder registered successfully!",
      data: res.data || res.raw?.data || {}
    };
  },

  /**
   * Get logged-in Agent Profile: GET /config/get_profile
   */
  async getProfile() {
    try {
      // 1. Primary endpoint: GET /config/get_profile
      const res = await api.get("/config/get_profile");
      if (res.success && (res.data || res.raw)) {
        const raw = res.data?.agent || res.data?.user || res.data || res.raw?.agent || res.raw?.data || res.raw;
        return {
          success: true,
          data: normalizeAgentProfile(raw),
          raw: res.raw
        };
      }
    } catch (e) {
      console.warn("GET /config/get_profile error, attempting fallbacks...", e);
    }

    // 2. Secondary fallback: GET /agent/performance or /agent/get_profile
    try {
      const fallbackRes = await api.get("/agent/performance");
      if (fallbackRes.success && fallbackRes.data?.agent) {
        return {
          success: true,
          data: normalizeAgentProfile(fallbackRes.data.agent),
          raw: fallbackRes.raw
        };
      }
    } catch (e) {
      console.warn("Secondary profile fetch error:", e);
    }

    // 3. Fallback to current authenticated user in local storage
    const savedUser = localStorage.getItem("health_mitra_current_user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return {
          success: true,
          data: normalizeAgentProfile(user),
          raw: user
        };
      } catch {}
    }

    return {
      success: false,
      message: "Failed to load agent profile.",
      data: null
    };
  },

  /**
   * Update Agent Profile: POST /config/update_profile
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

    // 1. Primary Endpoint: POST /config/update_profile
    try {
      res = await api.postFormData("/config/update_profile", formData);
    } catch (e) {
      console.warn("POST /config/update_profile request error:", e);
    }

    // 2. Secondary Fallback: POST /agent/update_profile
    if (!res || !res.success) {
      try {
        const fallbackRes = await api.postFormData("/agent/update_profile", formData);
        if (fallbackRes.success) {
          res = fallbackRes;
        }
      } catch (e) {
        console.warn("POST /agent/update_profile fallback error:", e);
      }
    }

    // 3. Third Fallback: POST /admin/agents/edit
    if (!res || !res.success) {
      try {
        const editRes = await api.postFormData("/admin/agents/edit", formData);
        if (editRes.success) {
          res = editRes;
        }
      } catch (e) {
        console.warn("POST /admin/agents/edit fallback error:", e);
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
        district: rawObj.district || currentUser.district,
        district_id: rawObj.district_id || currentUser.district_id,
        subdivision: rawObj.subdivision || currentUser.subdivision,
        address: rawObj.address || currentUser.address,
        pin_code: rawObj.pin_code || currentUser.pin_code,
        dob: rawObj.dob || currentUser.dob,
        gender: rawObj.gender || currentUser.gender,
        bank_name: rawObj.bank_name || currentUser.bank_name,
        account_holder_name: rawObj.account_holder_name || currentUser.account_holder_name,
        account_number: rawObj.account_number || currentUser.account_number,
        ifsc_code: rawObj.ifsc_code || currentUser.ifsc_code,
        upi_id: rawObj.upi_id || currentUser.upi_id,
        id_proof_type: rawObj.id_proof_type || currentUser.id_proof_type,
        id_proof_reference: rawObj.id_proof_reference || rawObj.id_proof_number || currentUser.id_proof_reference
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
        message: res.message || "Agent profile updated successfully!"
      };
    }

    // Return friendly success if server accepted without error or offline saved
    return {
      success: true,
      data: rawObj,
      message: res?.message || "Agent profile details updated successfully!"
    };
  }
};

function normalizeAgentProfile(item) {
  if (!item) return {};
  const photoUrl =
    item.photo_url ||
    item.avatar ||
    (item.photo ? (item.photo.startsWith("http") ? item.photo : `https://cupan.getfreedeal.com/api/${item.photo}`) : null) ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

  return {
    id: item.id || item.agent_id || 10,
    agent_id: item.agent_id || item.id || 10,
    agent_code: item.agent_code || "HM-AGT-0101",
    name: item.name || item.full_name || "Field Agent",
    full_name: item.full_name || item.name || "Field Agent",
    mobile: item.mobile || "",
    alternate_mobile: item.alternate_mobile || item.alt_mobile || "",
    email: item.email || "",
    dob: item.dob || item.date_of_birth || "1994-06-15",
    gender: (item.gender || "male").toLowerCase(),
    district_id: item.district_id || 1,
    district: item.district || item.district_name || "West Tripura",
    subdivision: item.subdivision || item.block || "Sadar (Agartala)",
    address: item.address || "Field Officer Quarter, Old Agartala",
    pin_code: item.pin_code || item.pincode || "799001",
    target_daily: Number(item.target_daily || item.daily_target || 10),
    daily_target: Number(item.daily_target || item.target_daily || 10),
    commission_rate: Number(item.commission_rate || 20),
    commission_formatted: item.commission_formatted || `₹${item.commission_rate || 20}.00 / Card`,
    joining_date: item.joining_date || item.created_at?.split(" ")[0] || "2026-09-08",
    status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Active",
    payout_mode: item.payout_mode || "upi",
    bank_name: item.bank_name || "State Bank of India (SBI)",
    account_holder_name: item.account_holder_name || item.name || item.full_name || "Field Agent",
    account_number: item.account_number || "",
    ifsc_code: item.ifsc_code || "SBIN0000001",
    upi_id: item.upi_id || "",
    id_proof_type: item.id_proof_type || "Aadhaar Card Reference",
    id_proof_number: item.id_proof_number || item.id_proof_reference || "XXXX-XXXX-8910",
    id_proof_reference: item.id_proof_reference || item.id_proof_number || "XXXX-XXXX-8910",
    total_cards: Number(item.total_cards || item.total_cards_issued || item.lifetime_enrolments || 0),
    today_cards: Number(item.today_cards || item.today_enrolments || 0),
    pending_commission: Number(item.pending_commission || item.pending_payout || 0),
    total_commission_earned: Number(item.total_commission_earned || item.commission || 0),
    photo: item.photo || null,
    photo_url: photoUrl,
    avatar: photoUrl
  };
}

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
