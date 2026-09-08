import { api } from "./api";

export const contentService = {
  // ==========================================
  // Pages Management APIs
  // ==========================================
  async getPages() {
    try {
      const res = await api.get("/admin/content/pages");
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

  async deletePage(id) {
    const res = await api.post("/admin/content/pages", { action: "delete", id: Number(id) });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete page.");
    }
    return { success: true, message: res.message || "Page deleted successfully!" };
  },

  // ==========================================
  // FAQ Management APIs
  // ==========================================
  async getFaqs() {
    try {
      const res = await api.get("/admin/content/faq");
      if (res.success && Array.isArray(res.data)) {
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
    return all.find((f) => String(f.id) === String(id)) || null;
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

  async deleteFaq(id) {
    const res = await api.post("/admin/content/faq", { action: "delete", id: Number(id) });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete FAQ.");
    }
    return { success: true, message: res.message || "FAQ deleted successfully!" };
  }
};
