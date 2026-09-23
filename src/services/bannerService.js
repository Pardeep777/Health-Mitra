import { api } from "./api.js";

/**
 * Service for fetching and managing website banners
 * Public API: /content/banners
 * Admin APIs:
 *   - /admin/banners/list
 *   - /admin/banners/add
 *   - /admin/banners/edit
 *   - /admin/banners/delete
 */
export const bannerService = {
  // ==========================================
  // Public Client APIs
  // ==========================================

  /**
   * Fetch active website banners for public display
   * @param {Object} params - Query parameters, e.g. { section: 'home_hero' }
   */
  /**
   * Fetch active website banners for public display
   * @param {Object} params - Query parameters, e.g. { section: 'home_hero' }
   */
  async getAll(params = {}) {
    try {
      const res = await api.get("/content/banners", { ...params, skipAuth: true });
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (e) {
      console.warn("api.get failed for /content/banners:", e);
    }

    // Direct fallback fetch without custom headers to avoid any preflight CORS issues
    try {
      const resp = await fetch("https://cupan.getfreedeal.com/api/content/banners", {
        headers: { Accept: "application/json" }
      });
      if (resp.ok) {
        const json = await resp.json();
        if (json.status && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn("Direct fetch fallback failed for /content/banners:", err);
    }

    return [];
  },

  /**
   * Fetch home hero section banners specifically
   */
  async getHeroBanners() {
    return this.getAll({ section: "home_hero" });
  },

  // ==========================================
  // Admin Management APIs
  // ==========================================

  /**
   * Get all banners for admin panel
   * Endpoint: /admin/banners/list
   */
  async getAdminBanners(params = {}) {
    try {
      const res = await api.get("/admin/banners/list", params);
      if (res.success && res.data) {
        return Array.isArray(res.data) ? res.data : (res.data.data || []);
      }
    } catch (e) {
      console.warn("Failed to fetch admin banners list:", e);
    }
    return [];
  },

  /**
   * Add a new banner (supports uploading both banner_image and card_image via FormData)
   * Endpoint: /admin/banners/add
   */
  async addBanner(bannerData) {
    let body;
    if (bannerData instanceof FormData) {
      body = bannerData;
    } else {
      const fd = new FormData();
      fd.append("title", bannerData.title?.trim() || "");
      if (bannerData.subtitle) fd.append("subtitle", bannerData.subtitle.trim());
      if (bannerData.paragraph) fd.append("paragraph", bannerData.paragraph.trim());
      if (bannerData.badge) fd.append("badge", bannerData.badge.trim());
      fd.append("section", bannerData.section?.trim() || "home_hero");
      fd.append("sort_order", Number(bannerData.sort_order) || 0);
      if (bannerData.btn1_text) fd.append("btn1_text", bannerData.btn1_text.trim());
      if (bannerData.btn1_link) fd.append("btn1_link", bannerData.btn1_link.trim());
      if (bannerData.btn2_text) fd.append("btn2_text", bannerData.btn2_text.trim());
      if (bannerData.btn2_link) fd.append("btn2_link", bannerData.btn2_link.trim());
      if (bannerData.card_btn_text) fd.append("card_btn_text", bannerData.card_btn_text.trim());
      if (bannerData.card_btn_link) fd.append("card_btn_link", bannerData.card_btn_link.trim());
      fd.append("status", bannerData.status || "active");

      // 1. Banner Background Image (banner_image)
      const bannerImgFile =
        bannerData.banner_image_file ||
        (bannerData.banner_image instanceof File ? bannerData.banner_image : null);
      if (bannerImgFile instanceof File) {
        fd.append("banner_image", bannerImgFile);
      } else if (typeof bannerData.banner_image === "string" && bannerData.banner_image.trim()) {
        fd.append("banner_image", bannerData.banner_image.trim());
      }

      // 2. Card Visual Image (card_image)
      const cardImgFile =
        bannerData.card_image_file ||
        (bannerData.card_image instanceof File ? bannerData.card_image : null);
      if (cardImgFile instanceof File) {
        fd.append("card_image", cardImgFile);
      } else if (typeof bannerData.card_image === "string" && bannerData.card_image.trim()) {
        fd.append("card_image", bannerData.card_image.trim());
      }

      body = fd;
    }

    const res = await api.postFormData("/admin/banners/add", body);
    if (!res.success) {
      throw new Error(res.message || "Failed to create banner.");
    }
    return res;
  },

  /**
   * Edit an existing banner (supports updating banner_image and card_image via FormData)
   * Endpoint: /admin/banners/edit
   */
  async editBanner(bannerData) {
    let body;
    if (bannerData instanceof FormData) {
      body = bannerData;
    } else {
      const fd = new FormData();
      fd.append("id", Number(bannerData.id));
      if (bannerData.title !== undefined) fd.append("title", bannerData.title?.trim() || "");
      if (bannerData.subtitle !== undefined) fd.append("subtitle", bannerData.subtitle?.trim() || "");
      if (bannerData.paragraph !== undefined) fd.append("paragraph", bannerData.paragraph?.trim() || "");
      if (bannerData.badge !== undefined) fd.append("badge", bannerData.badge?.trim() || "");
      if (bannerData.section !== undefined) fd.append("section", bannerData.section?.trim() || "home_hero");
      if (bannerData.sort_order !== undefined) fd.append("sort_order", Number(bannerData.sort_order) || 0);
      if (bannerData.btn1_text !== undefined) fd.append("btn1_text", bannerData.btn1_text?.trim() || "");
      if (bannerData.btn1_link !== undefined) fd.append("btn1_link", bannerData.btn1_link?.trim() || "");
      if (bannerData.btn2_text !== undefined) fd.append("btn2_text", bannerData.btn2_text?.trim() || "");
      if (bannerData.btn2_link !== undefined) fd.append("btn2_link", bannerData.btn2_link?.trim() || "");
      if (bannerData.card_btn_text !== undefined) fd.append("card_btn_text", bannerData.card_btn_text?.trim() || "");
      if (bannerData.card_btn_link !== undefined) fd.append("card_btn_link", bannerData.card_btn_link?.trim() || "");
      if (bannerData.status !== undefined) fd.append("status", bannerData.status || "active");

      // 1. Banner Background Image (banner_image)
      const bannerImgFile =
        bannerData.banner_image_file ||
        (bannerData.banner_image instanceof File ? bannerData.banner_image : null);
      if (bannerImgFile instanceof File) {
        fd.append("banner_image", bannerImgFile);
      } else if (typeof bannerData.banner_image === "string" && bannerData.banner_image.trim()) {
        fd.append("banner_image", bannerData.banner_image.trim());
      }

      // 2. Card Visual Image (card_image)
      const cardImgFile =
        bannerData.card_image_file ||
        (bannerData.card_image instanceof File ? bannerData.card_image : null);
      if (cardImgFile instanceof File) {
        fd.append("card_image", cardImgFile);
      } else if (typeof bannerData.card_image === "string" && bannerData.card_image.trim()) {
        fd.append("card_image", bannerData.card_image.trim());
      }

      body = fd;
    }

    const res = await api.postFormData("/admin/banners/edit", body);
    if (!res.success) {
      throw new Error(res.message || "Failed to update banner.");
    }
    return res;
  },

  /**
   * Delete banner by ID
   * Endpoint: /admin/banners/delete
   */
  async deleteBanner(id) {
    const res = await api.post("/admin/banners/delete", { id: Number(id) });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete banner.");
    }
    return res;
  },

  /**
   * Toggle banner status between active and inactive
   */
  async toggleBannerStatus(id, currentStatus) {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    const res = await api.post("/admin/banners/edit", {
      id: Number(id),
      status: nextStatus
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to update banner status.");
    }
    return { success: true, message: `Banner status set to ${nextStatus}` };
  }
};
