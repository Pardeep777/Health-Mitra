import { api } from "./api";

export const contentService = {
  // ==========================================
  // Pages Management APIs: /admin/content/pages
  // ==========================================
  async getPages(params = {}) {
    try {
      const res = await api.get("/admin/content/pages", params);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch pages from API", e);
    }
    return [];
  },

  async getPageById(id) {
    try {
      const res = await api.get("/admin/content/pages", { id });
      if (res.success && res.data) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch page by id", e);
    }
    const all = await this.getPages();
    return all.find((p) => String(p.id) === String(id)) || null;
  },

  async getPageBySlug(slug) {
    try {
      const res = await api.get("/admin/content/pages", { slug });
      if (res.success && res.data) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch page by slug", e);
    }
    const all = await this.getPages();
    return all.find((p) => p.slug === slug) || null;
  },

  async addPage({ title, slug, content, meta_title = "", meta_description = "", status = "active" }) {
    const payload = {
      action: "add",
      title: title.trim(),
      slug: slug.trim(),
      content,
      meta_title,
      meta_description,
      status
    };
    const res = await api.post("/admin/content/pages", payload);
    if (!res.success) {
      throw new Error(res.message || "Failed to add page.");
    }
    return { success: true, message: res.message || "Page created successfully!" };
  },

  async editPage({ id, title, slug, content, meta_title = "", meta_description = "", status = "active" }) {
    const payload = {
      action: "edit",
      id: Number(id),
      title: title.trim(),
      slug: slug.trim(),
      content,
      meta_title,
      meta_description,
      status
    };
    const res = await api.post("/admin/content/pages", payload);
    if (!res.success) {
      throw new Error(res.message || "Failed to update page.");
    }
    return { success: true, message: res.message || "Page updated successfully!" };
  },

  async togglePageStatus(id, currentStatus) {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    const res = await api.post("/admin/content/pages", {
      action: "toggle_status",
      id: Number(id),
      status: nextStatus
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to toggle page status.");
    }
    return { success: true, message: `Page status updated to ${nextStatus}` };
  },

  async deletePage(id) {
    const res = await api.post("/admin/content/pages", { action: "delete", id: Number(id) });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete page.");
    }
    return { success: true, message: res.message || "Page deleted successfully!" };
  },

  // ==========================================
  // FAQ Management APIs: /admin/content/faq
  // ==========================================
  async getFaqs(params = {}) {
    try {
      const res = await api.get("/admin/content/faq", params);
      if (res.success && res.data) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch FAQs from API", e);
    }
    return [];
  },

  async getFaqById(id) {
    try {
      const res = await api.get("/admin/content/faq", { id });
      if (res.success && res.data) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch FAQ by id", e);
    }
    const all = await this.getFaqs();
    return (Array.isArray(all) ? all : []).find((f) => String(f.id) === String(id)) || null;
  },

  async addFaq({ question, answer, category = "General", sort_order = 1, status = "active" }) {
    const payload = {
      action: "add",
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim(),
      sort_order: Number(sort_order),
      status
    };
    const res = await api.post("/admin/content/faq", payload);
    if (!res.success) {
      throw new Error(res.message || "Failed to add FAQ.");
    }
    return { success: true, message: res.message || "FAQ added successfully!" };
  },

  async editFaq({ id, question, answer, category = "General", sort_order = 1, status = "active" }) {
    const payload = {
      action: "edit",
      id: Number(id),
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim(),
      sort_order: Number(sort_order),
      status
    };
    const res = await api.post("/admin/content/faq", payload);
    if (!res.success) {
      throw new Error(res.message || "Failed to update FAQ.");
    }
    return { success: true, message: res.message || "FAQ updated successfully!" };
  },

  async toggleFaqStatus(id, currentStatus) {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    const res = await api.post("/admin/content/faq", {
      action: "toggle_status",
      id: Number(id),
      status: nextStatus
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to toggle FAQ status.");
    }
    return { success: true, message: `FAQ status updated to ${nextStatus}` };
  },

  async reorderFaqs(faqOrders) {
    const res = await api.post("/admin/content/faq", {
      action: "reorder",
      orders: faqOrders
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to reorder FAQs.");
    }
    return { success: true, message: "FAQs reordered successfully!" };
  },

  async deleteFaq(id) {
    const res = await api.post("/admin/content/faq", { action: "delete", id: Number(id) });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete FAQ.");
    }
    return { success: true, message: res.message || "FAQ deleted successfully!" };
  },

  // ==========================================
  // Gallery Management APIs: /admin/content/gallery
  // ==========================================
  async getGallery(params = {}) {
    try {
      const res = await api.get("/admin/content/gallery", params);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch gallery items", e);
    }
    return [];
  },

  async addGalleryItem(data) {
    let res;
    if (data instanceof FormData) {
      if (!data.has("action")) data.append("action", "add");
      res = await api.postFormData("/admin/content/gallery", data);
    } else {
      res = await api.post("/admin/content/gallery", { action: "add", ...data });
    }
    if (!res.success) {
      throw new Error(res.message || "Failed to add gallery item.");
    }
    return { success: true, message: res.message || "Gallery image uploaded successfully!" };
  },

  async editGalleryItem(data) {
    let res;
    if (data instanceof FormData) {
      if (!data.has("action")) data.append("action", "edit");
      res = await api.postFormData("/admin/content/gallery", data);
    } else {
      res = await api.post("/admin/content/gallery", { action: "edit", ...data });
    }
    if (!res.success) {
      throw new Error(res.message || "Failed to update gallery item.");
    }
    return { success: true, message: res.message || "Gallery image updated successfully!" };
  },

  async toggleGalleryStatus(id, currentStatus) {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    const res = await api.post("/admin/content/gallery", {
      action: "toggle_status",
      id: Number(id),
      status: nextStatus
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to toggle gallery status.");
    }
    return { success: true, message: `Gallery item updated to ${nextStatus}` };
  },

  async deleteGalleryItem(id) {
    const res = await api.post("/admin/content/gallery", { action: "delete", id: Number(id) });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete gallery item.");
    }
    return { success: true, message: res.message || "Gallery item deleted successfully!" };
  },

  // ==========================================
  // Testimonials Management APIs: /admin/content/testimonials
  // ==========================================
  async getTestimonials(params = {}) {
    try {
      const res = await api.get("/admin/content/testimonials", params);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch testimonials", e);
    }
    return [];
  },

  async addTestimonial(data) {
    let res;
    if (data instanceof FormData) {
      if (!data.has("action")) data.append("action", "add");
      res = await api.postFormData("/admin/content/testimonials", data);
    } else {
      res = await api.post("/admin/content/testimonials", { action: "add", ...data });
    }
    if (!res.success) {
      throw new Error(res.message || "Failed to add testimonial.");
    }
    return { success: true, message: res.message || "Testimonial added successfully!" };
  },

  async editTestimonial(data) {
    let res;
    if (data instanceof FormData) {
      if (!data.has("action")) data.append("action", "edit");
      res = await api.postFormData("/admin/content/testimonials", data);
    } else {
      res = await api.post("/admin/content/testimonials", { action: "edit", ...data });
    }
    if (!res.success) {
      throw new Error(res.message || "Failed to update testimonial.");
    }
    return { success: true, message: res.message || "Testimonial updated successfully!" };
  },

  async toggleTestimonialStatus(id, currentStatus) {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    const res = await api.post("/admin/content/testimonials", {
      action: "toggle_status",
      id: Number(id),
      status: nextStatus
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to toggle testimonial status.");
    }
    return { success: true, message: `Testimonial updated to ${nextStatus}` };
  },

  async deleteTestimonial(id) {
    const res = await api.post("/admin/content/testimonials", { action: "delete", id: Number(id) });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete testimonial.");
    }
    return { success: true, message: res.message || "Testimonial deleted successfully!" };
  },

  // ==========================================
  // Management Team Management APIs: /admin/content/management_team
  // ==========================================
  async getManagementTeam(params = {}) {
    try {
      const res = await api.get("/admin/content/management_team", params);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch management team", e);
    }
    return [];
  },

  async addTeamMember(data) {
    let res;
    if (data instanceof FormData) {
      if (!data.has("action")) data.append("action", "add");
      res = await api.postFormData("/admin/content/management_team", data);
    } else {
      res = await api.post("/admin/content/management_team", { action: "add", ...data });
    }
    if (!res.success) {
      throw new Error(res.message || "Failed to add team member.");
    }
    return { success: true, message: res.message || "Team member added successfully!" };
  },

  async editTeamMember(data) {
    let res;
    if (data instanceof FormData) {
      if (!data.has("action")) data.append("action", "edit");
      res = await api.postFormData("/admin/content/management_team", data);
    } else {
      res = await api.post("/admin/content/management_team", { action: "edit", ...data });
    }
    if (!res.success) {
      throw new Error(res.message || "Failed to update team member.");
    }
    return { success: true, message: res.message || "Team member updated successfully!" };
  },

  async toggleTeamMemberStatus(id, currentStatus) {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    const res = await api.post("/admin/content/management_team", {
      action: "toggle_status",
      id: Number(id),
      status: nextStatus
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to toggle team member status.");
    }
    return { success: true, message: `Team member updated to ${nextStatus}` };
  },

  async deleteTeamMember(id) {
    const res = await api.post("/admin/content/management_team", { action: "delete", id: Number(id) });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete team member.");
    }
    return { success: true, message: res.message || "Team member deleted successfully!" };
  }
};
