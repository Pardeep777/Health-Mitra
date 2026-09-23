import { api } from "./api";

let districtCache = null;
let lastDistrictFetchTime = 0;
const DISTRICT_CACHE_TTL = 30000; // 30 seconds

export const districtService = {
  /**
   * Fetch all districts: GET /agent/get_districts (or fallback to /admin/districts/list)
   */
  async getAll(forceRefresh = false, params = {}) {
    const now = Date.now();
    if (!forceRefresh && districtCache && now - lastDistrictFetchTime < DISTRICT_CACHE_TTL) {
      return districtCache;
    }

    // Prioritize admin list endpoint as it returns all rich columns (mobile, coordinator, created_at, areas, etc.)
    try {
      const resAdmin = await api.get("/admin/districts/list", params);
      if (resAdmin.success && Array.isArray(resAdmin.data) && resAdmin.data.length > 0) {
        districtCache = resAdmin.data;
        lastDistrictFetchTime = now;
        return resAdmin.data;
      }
    } catch (e) {
      console.warn("API /admin/districts/list fetch error, trying fallback...", e);
    }

    try {
      const res = await api.get("/agent/get_districts", params);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        districtCache = res.data;
        lastDistrictFetchTime = now;
        return res.data;
      }
    } catch (e) {
      console.warn("API /agent/get_districts fetch error", e);
    }

    return districtCache || [];
  },

  /**
   * Add a new district: POST /admin/districts/add
   * Body: { type: "district", name: "West Tripura", mobile: "9436128136", state: "Tripura" }
   */
  async addDistrict({ name, mobile, state = "Tripura" }) {
    if (!name || !name.trim()) {
      throw new Error("Please enter a valid district name.");
    }

    const payload = {
      type: "district",
      name: name.trim(),
      state: state.trim()
    };

    if (mobile && mobile.trim()) {
      payload.mobile = mobile.trim();
    }

    const res = await api.post("/admin/districts/add", payload);

    if (!res.success) {
      throw new Error(res.message || "Failed to add district.");
    }

    districtCache = null; // Invalidate cache
    return { success: true, data: res.data, message: res.message || "District added successfully" };
  },

  /**
   * Add an area to a district: POST /admin/districts/add
   * Body: { type: "area", district_id: 1, name: "Banamalipur", pin_code: "799001" }
   */
  async addArea({ district_id, name, pin_code }) {
    if (!name || !name.trim()) {
      throw new Error("Please enter an area name.");
    }
    if (!pin_code || pin_code.trim().length !== 6) {
      throw new Error("Please enter a valid 6-digit PIN code.");
    }

    const res = await api.post("/admin/districts/add", {
      type: "area",
      district_id: Number(district_id),
      name: name.trim(),
      pin_code: pin_code.trim()
    });

    if (!res.success) {
      throw new Error(res.message || "Failed to add area.");
    }

    districtCache = null; // Invalidate cache
    return { success: true, data: res.data, message: res.message || "Area added successfully" };
  },

  /**
   * Edit district or area: POST /admin/districts/edit
   * Body: { type: "district"|"area", id, district_id, name, pin_code, status, mobile }
   */
  async edit({ type = "district", id, district_id, name, pin_code, status = "active", state = "Tripura", mobile }) {
    const payload = {
      type,
      id: Number(id),
      name: (name || "").trim(),
      status
    };

    if (type === "area") {
      payload.district_id = Number(district_id);
      payload.pin_code = (pin_code || "").trim();
    } else {
      payload.state = state;
      if (mobile && mobile.trim()) {
        payload.mobile = mobile.trim();
      }
    }

    const res = await api.post("/admin/districts/edit", payload);
    if (!res.success) {
      throw new Error(res.message || "Failed to update district/area.");
    }

    districtCache = null;
    return { success: true, message: res.message || "Updated successfully" };
  },

  /**
   * Delete district or area: POST /admin/districts/delete
   * Body: { type: "district"|"area", id }
   */
  async delete({ type = "district", id }) {
    const res = await api.post("/admin/districts/delete", {
      type,
      id: Number(id)
    });

    if (!res.success) {
      throw new Error(res.message || "Failed to delete district/area.");
    }

    districtCache = null;
    return { success: true, message: res.message || "Deleted successfully" };
  },

  /**
   * Get district rollout status: GET /admin/districts/rollout
   * Query params: ?phase=phase_1 | phase_2 | phase_3 or ?id=1
   */
  async getRollout(params = {}) {
    try {
      const res = await api.get("/admin/districts/rollout", params);
      if (res.success && res.data) {
        return res.data;
      }
    } catch (e) {
      console.warn("API district rollout fetch error", e);
    }
    return null;
  },

  /**
   * Update district rollout phase and coordinator info: POST /admin/districts/rollout
   * Body: { id, rollout_phase, coordinator_name, coordinator_phone, target_cardholders, headquarters }
   */
  async updateRollout({ id, rollout_phase, coordinator_name, coordinator_phone, target_cardholders, headquarters }) {
    const payload = {
      id: Number(id),
      rollout_phase,
      coordinator_name,
      coordinator_phone,
      target_cardholders: target_cardholders ? Number(target_cardholders) : undefined,
      headquarters
    };

    const res = await api.post("/admin/districts/rollout", payload);
    if (!res.success) {
      throw new Error(res.message || "Failed to update district rollout details.");
    }

    districtCache = null;
    return { success: true, message: res.message || "District rollout updated successfully!" };
  },

  // ==========================================
  // DISTRICT COORDINATOR PORTAL LIVE APIS
  // ==========================================

  /**
   * District Coordinator Login: POST /district/login
   * Body: { mobile: "9436128111" }
   */
  async login({ mobile }) {
    if (!mobile || !mobile.trim()) {
      throw new Error("Mobile number is required to login.");
    }

    const cleanMobile = mobile.trim();
    const res = await api.post("/district/login", { mobile: cleanMobile });

    if (!res.success || !res.token) {
      throw new Error(res.message || "Failed to login as District Coordinator.");
    }

    return {
      success: true,
      token: res.token,
      data: res.data || {},
      message: res.message || "Login successful!"
    };
  },

  /**
   * Get Coordinator Profile: GET /district/get_profile
   */
  async getProfile() {
    const res = await api.get("/district/get_profile");
    if (!res.success || !res.data) {
      throw new Error(res.message || "Failed to retrieve coordinator profile.");
    }
    return res.data;
  },

  /**
   * Update Coordinator Profile: POST /district/update_profile
   * Body: { name, mobile }
   */
  async updateProfile({ name, mobile }) {
    const payload = {};
    if (name && name.trim()) payload.name = name.trim();
    if (mobile && mobile.trim()) payload.mobile = mobile.trim();

    if (Object.keys(payload).length === 0) {
      throw new Error("Please provide at least one field to update (name or mobile).");
    }

    const res = await api.post("/district/update_profile", payload);
    if (!res.success) {
      throw new Error(res.message || "Failed to update profile.");
    }
    return {
      success: true,
      data: res.data,
      message: res.message || "Profile updated successfully."
    };
  },

  /**
   * District Dashboard Metrics: POST /district/dashboard
   */
  async getDashboard() {
    const res = await api.post("/district/dashboard", {});
    if (!res.success || !res.data) {
      throw new Error(res.message || "Failed to retrieve district dashboard data.");
    }
    return res.data;
  },

  /**
   * District Field Agents: POST /district/agents
   * Supports: ?search=...&from_date=...&to_date=...&status=...
   */
  async getAgents(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.search && params.search.trim()) {
      queryParams.set("search", params.search.trim());
    }
    if (params.from_date && params.from_date.trim()) {
      queryParams.set("from_date", params.from_date.trim());
    }
    if (params.to_date && params.to_date.trim()) {
      queryParams.set("to_date", params.to_date.trim());
    }
    if (params.status && params.status !== "all") {
      queryParams.set("status", params.status.trim());
    }
    if (params.page) {
      queryParams.set("page", params.page);
    }
    if (params.limit) {
      queryParams.set("limit", params.limit);
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/district/agents?${queryString}` : "/district/agents";

    const res = await api.post(endpoint, {});
    if (!res.success) {
      throw new Error(res.message || "Failed to retrieve district agents.");
    }
    return {
      data: Array.isArray(res.data) ? res.data : [],
      district_info: res.raw?.district_info || res.district_info || null,
      summary: res.raw?.summary || res.summary || { total_agents: 0, active_agents: 0, today_total_cards: 0 },
      total: res.raw?.total ?? res.total ?? (Array.isArray(res.data) ? res.data.length : 0),
      count: res.raw?.count ?? res.count ?? (Array.isArray(res.data) ? res.data.length : 0),
      page: res.raw?.page ?? res.page ?? 1,
      total_pages: res.raw?.total_pages ?? res.total_pages ?? 1
    };
  },

  /**
   * District Partner Outlets: POST /district/partners
   * Supports: ?search=...&from_date=...&to_date=...&status=...
   */
  async getPartners(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.search && params.search.trim()) {
      queryParams.set("search", params.search.trim());
    }
    if (params.from_date && params.from_date.trim()) {
      queryParams.set("from_date", params.from_date.trim());
    }
    if (params.to_date && params.to_date.trim()) {
      queryParams.set("to_date", params.to_date.trim());
    }
    if (params.status && params.status !== "all") {
      queryParams.set("status", params.status.trim());
    }
    if (params.page) {
      queryParams.set("page", params.page);
    }
    if (params.limit) {
      queryParams.set("limit", params.limit);
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/district/partners?${queryString}` : "/district/partners";

    const res = await api.post(endpoint, {});
    if (!res.success) {
      throw new Error(res.message || "Failed to retrieve district partners.");
    }
    return {
      data: Array.isArray(res.data) ? res.data : [],
      district_info: res.district_info || null,
      total: res.total || 0,
      count: res.count || 0,
      page: res.page || 1,
      total_pages: res.total_pages || 1
    };
  },

  /**
   * District Enrolled Cards: POST /district/cards
   * Supports: ?search=...&from_date=...&to_date=...&status=...
   */
  async getCards(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.search && params.search.trim()) {
      queryParams.set("search", params.search.trim());
    }
    if (params.from_date && params.from_date.trim()) {
      queryParams.set("from_date", params.from_date.trim());
    }
    if (params.to_date && params.to_date.trim()) {
      queryParams.set("to_date", params.to_date.trim());
    }
    if (params.status && params.status !== "all") {
      queryParams.set("status", params.status.trim());
    }
    if (params.page) {
      queryParams.set("page", params.page);
    }
    if (params.limit) {
      queryParams.set("limit", params.limit);
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/district/cards?${queryString}` : "/district/cards";

    const res = await api.post(endpoint, {});
    if (!res.success) {
      throw new Error(res.message || "Failed to retrieve district cards.");
    }
    return {
      data: Array.isArray(res.data) ? res.data : [],
      district_info: res.district_info || null,
      total: res.total || 0,
      count: res.count || 0,
      page: res.page || 1,
      total_pages: res.total_pages || 1
    };
  }
};
