import { api } from "./api";

let districtCache = null;
let lastDistrictFetchTime = 0;
const DISTRICT_CACHE_TTL = 60000; // 60 seconds

export const districtService = {
  /**
   * Fetch all districts from backend API: GET /admin/districts/list
   */
  async getAll(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && districtCache && now - lastDistrictFetchTime < DISTRICT_CACHE_TTL) {
      return districtCache;
    }

    const res = await api.get("/admin/districts/list");
    if (res.success && Array.isArray(res.data)) {
      districtCache = res.data;
      lastDistrictFetchTime = now;
      return res.data;
    }
    return districtCache || [];
  },

  /**
   * Add a new district: POST /admin/districts/add
   * Body: { type: "district", name: "West Tripura", state: "Tripura" }
   */
  async addDistrict({ name, state = "Tripura" }) {
    if (!name || !name.trim()) {
      throw new Error("Please enter a valid district name.");
    }

    const res = await api.post("/admin/districts/add", {
      type: "district",
      name: name.trim(),
      state: state.trim()
    });

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
   * Body: { type: "district"|"area", id, district_id, name, pin_code, status }
   */
  async edit({ type = "district", id, district_id, name, pin_code, status = "active", state = "Tripura" }) {
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
   * Query params: ?phase=phase_1 or ?id=1
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
  }
};
