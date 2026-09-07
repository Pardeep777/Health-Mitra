import { api } from "./api";

export const districtService = {
  /**
   * Fetch all districts from backend API: GET /admin/districts/list.php
   */
  async getAll() {
    const res = await api.get("/admin/districts/list.php");
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  /**
   * Add a new district: POST /admin/districts/add.php
   * Body: { type: "district", name: "West Tripura", state: "Tripura" }
   */
  async addDistrict({ name, state = "Tripura" }) {
    if (!name || !name.trim()) {
      throw new Error("Please enter a valid district name.");
    }

    const res = await api.post("/admin/districts/add.php", {
      type: "district",
      name: name.trim(),
      state: state.trim()
    });

    if (!res.success) {
      throw new Error(res.message || "Failed to add district.");
    }

    return { success: true, data: res.data, message: res.message || "District added successfully" };
  },

  /**
   * Add an area to a district: POST /admin/districts/add.php
   * Body: { type: "area", district_id: 1, name: "Banamalipur", pin_code: "799001" }
   */
  async addArea({ district_id, name, pin_code }) {
    if (!name || !name.trim()) {
      throw new Error("Please enter an area name.");
    }
    if (!pin_code || pin_code.trim().length !== 6) {
      throw new Error("Please enter a valid 6-digit PIN code.");
    }

    const res = await api.post("/admin/districts/add.php", {
      type: "area",
      district_id: Number(district_id),
      name: name.trim(),
      pin_code: pin_code.trim()
    });

    if (!res.success) {
      throw new Error(res.message || "Failed to add area.");
    }

    return { success: true, data: res.data, message: res.message || "Area added successfully" };
  },

  /**
   * Edit district or area: POST /admin/districts/edit.php
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

    const res = await api.post("/admin/districts/edit.php", payload);
    if (!res.success) {
      throw new Error(res.message || "Failed to update district/area.");
    }

    return { success: true, message: res.message || "Updated successfully" };
  },

  /**
   * Delete district or area: POST /admin/districts/delete.php
   * Body: { type: "district"|"area", id }
   */
  async delete({ type = "district", id }) {
    const res = await api.post("/admin/districts/delete.php", {
      type,
      id: Number(id)
    });

    if (!res.success) {
      throw new Error(res.message || "Failed to delete district/area.");
    }

    return { success: true, message: res.message || "Deleted successfully" };
  }
};
