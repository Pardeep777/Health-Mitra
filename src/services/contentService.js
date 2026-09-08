import { api } from "./api";

export const contentService = {
  // ==========================================
  // Pages Management APIs
  // ==========================================
  async getPages() {
    try {
      const res = await api.get("/admin/content/pages.php");
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch pages from API", e);
    }
    const saved = localStorage.getItem("health_mitra_content_pages");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: "About Health Mitra Tripura",
        slug: "about-us",
        content: "Official health benefit network offering verified discounts across Tripura.",
        meta_title: "About Us - Health Mitra",
        meta_description: "Learn about our healthcare network in Tripura.",
        status: "active"
      },
      {
        id: 2,
        title: "Refund & Cancellation Policy",
        slug: "refund-policy",
        content: "Health Mitra membership refund terms and policies.",
        meta_title: "Refund Policy - Health Mitra Healthcare",
        meta_description: "Official Health Mitra refund guidelines.",
        status: "active"
      }
    ];
  },

  async getPageById(id) {
    try {
      const res = await api.get("/admin/content/pages.php", { id });
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
    try {
      const res = await api.post("/admin/content/pages.php", payload);
      if (res.success) {
        return { success: true, message: res.message || "Page created successfully!" };
      }
    } catch (e) {
      console.warn("Add page API error", e);
    }
    const all = await this.getPages();
    const newPage = { id: Date.now(), ...payload };
    localStorage.setItem("health_mitra_content_pages", JSON.stringify([...all, newPage]));
    return { success: true, message: "Page created successfully!" };
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
    try {
      const res = await api.post("/admin/content/pages.php", payload);
      if (res.success) {
        return { success: true, message: res.message || "Page updated successfully!" };
      }
    } catch (e) {
      console.warn("Edit page API error", e);
    }
    const all = await this.getPages();
    const idx = all.findIndex((p) => Number(p.id) === Number(id));
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...payload };
      localStorage.setItem("health_mitra_content_pages", JSON.stringify(all));
    }
    return { success: true, message: "Page updated successfully!" };
  },

  async deletePage(id) {
    try {
      const res = await api.post("/admin/content/pages.php", { action: "delete", id: Number(id) });
      if (res.success) {
        return { success: true, message: res.message || "Page deleted successfully!" };
      }
    } catch (e) {
      console.warn("Delete page API error", e);
    }
    const all = await this.getPages();
    const filtered = all.filter((p) => Number(p.id) !== Number(id));
    localStorage.setItem("health_mitra_content_pages", JSON.stringify(filtered));
    return { success: true, message: "Page deleted successfully!" };
  },

  // ==========================================
  // FAQ Management APIs
  // ==========================================
  async getFaqs() {
    try {
      const res = await api.get("/admin/content/faq.php");
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch FAQs from API", e);
    }
    const saved = localStorage.getItem("health_mitra_content_faqs");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        question: "Can I use the card at any medical shop in Agartala?",
        answer: "Yes, you can use it at any affiliated Health Mitra partner counter across Tripura.",
        category: "Partners & Discounts",
        sort_order: 1,
        status: "active"
      },
      {
        id: 2,
        question: "How do I renew my membership card?",
        answer: "Renewals can be done online or through your local field agent at ₹49 per year.",
        category: "Card & Membership",
        sort_order: 2,
        status: "active"
      }
    ];
  },

  async getFaqById(id) {
    try {
      const res = await api.get("/admin/content/faq.php", { id });
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
    try {
      const res = await api.post("/admin/content/faq.php", payload);
      if (res.success) {
        return { success: true, message: res.message || "FAQ added successfully!" };
      }
    } catch (e) {
      console.warn("Add FAQ API error", e);
    }
    const all = await this.getFaqs();
    const newFaq = { id: Date.now(), ...payload };
    localStorage.setItem("health_mitra_content_faqs", JSON.stringify([...all, newFaq]));
    return { success: true, message: "FAQ added successfully!" };
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
    try {
      const res = await api.post("/admin/content/faq.php", payload);
      if (res.success) {
        return { success: true, message: res.message || "FAQ updated successfully!" };
      }
    } catch (e) {
      console.warn("Edit FAQ API error", e);
    }
    const all = await this.getFaqs();
    const idx = all.findIndex((f) => Number(f.id) === Number(id));
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...payload };
      localStorage.setItem("health_mitra_content_faqs", JSON.stringify(all));
    }
    return { success: true, message: "FAQ updated successfully!" };
  },

  async deleteFaq(id) {
    try {
      const res = await api.post("/admin/content/faq.php", { action: "delete", id: Number(id) });
      if (res.success) {
        return { success: true, message: res.message || "FAQ deleted successfully!" };
      }
    } catch (e) {
      console.warn("Delete FAQ API error", e);
    }
    const all = await this.getFaqs();
    const filtered = all.filter((f) => Number(f.id) !== Number(id));
    localStorage.setItem("health_mitra_content_faqs", JSON.stringify(filtered));
    return { success: true, message: "FAQ deleted successfully!" };
  }
};
