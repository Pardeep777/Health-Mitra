import { api, API_BASE_URL, getAuthToken } from "./api";

export const reportService = {
  /**
   * Get cardholders report data: GET /admin/reports/cardholders.php
   */
  async getCardholdersReport(params = {}) {
    try {
      const res = await api.get("/admin/reports/cardholders.php", params);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch cardholders report from API", e);
    }
    return [];
  },

  /**
   * Get cards report data: GET /admin/reports/cards.php
   */
  async getCardsReport(params = {}) {
    try {
      const res = await api.get("/admin/reports/cards.php", params);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch cards report from API", e);
    }
    return [];
  },

  /**
   * Get partners report data: GET /admin/reports/partners.php
   */
  async getPartnersReport(params = {}) {
    try {
      const res = await api.get("/admin/reports/partners.php", params);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch partners report from API", e);
    }
    return [];
  },

  /**
   * Build complete PDF export URL: GET /admin/reports/export.php?type=...&format=pdf
   */
  getExportUrl(type = "cardholders", format = "pdf", filters = {}) {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    queryParams.append("type", type);
    queryParams.append("format", format);
    if (token) queryParams.append("token", token);

    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && val !== "All") {
        queryParams.append(key, val);
      }
    });

    return `${API_BASE_URL}/admin/reports/export.php?${queryParams.toString()}`;
  }
};
