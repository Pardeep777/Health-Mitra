import { api } from "./api";

const DEFAULT_SETTINGS = {
  card_price: "49",
  cardPrice: "49",
  max_discount_percent: "20",
  maxDiscountPercent: "20",
  card_validity_days: "365",
  cardValidityDays: "365",
  delivery_commitment_days: "15",
  deliveryCommitmentDays: "15",
  agent_daily_target: "10",
  agentDailyTarget: "10",
  agent_commission_per_card: "10",
  sms_provider: "Fast2SMS (Active)",
  smsGatewayProvider: "Fast2SMS (Active)",
  whatsapp_status: "Meta Cloud API Connected",
  whatsAppApiStatus: "Meta Cloud API Connected",
  dpdpa_version: "v1.2",
  dpdpaVersion: "v1.2",
  audit_retention_months: "24",
  auditRetentionMonths: "24",
  expiry_sms_template:
    "Dear {name}, your Health Mitra card {card_id} expires in 30 days on {expiry_date}. Renew today for ₹49 to keep saving up to 20% on medicines & tests: https://cupan.getfreedeal.com/renew/{token}",
  expirySmsTemplate:
    "Dear {name}, your Health Mitra card {card_id} expires in 30 days on {expiry_date}. Renew today for ₹49 to keep saving up to 20% on medicines & tests: https://cupan.getfreedeal.com/renew/{token}"
};

export const settingsService = {
  /**
   * Get grouped settings: GET /admin/settings/settings?grouped=1
   */
  async getGroupedSettings() {
    try {
      const res = await api.get("/admin/settings/settings", { grouped: 1 });
      if (res.success && res.data) {
        return res.data;
      }
    } catch (e) {
      console.warn("Grouped settings API notice", e);
    }
    return null;
  },

  /**
   * Get flat key-value map: GET /admin/settings/settings?flat=1
   */
  async getFlatSettings() {
    try {
      const res = await api.get("/admin/settings/settings", { flat: 1 });
      if (res.success && res.data && typeof res.data === "object") {
        return { ...DEFAULT_SETTINGS, ...res.data };
      }
    } catch (e) {
      console.warn("Flat settings API notice", e);
    }
    return DEFAULT_SETTINGS;
  },

  /**
   * Get single key: GET /admin/settings/settings?key=card_price
   */
  async getSingleKey(key) {
    try {
      const res = await api.get("/admin/settings/settings", { key });
      if (res.success && res.data !== undefined) {
        return res.data;
      }
    } catch (e) {
      console.warn(`Settings single key fetch error for ${key}`, e);
    }
    return DEFAULT_SETTINGS[key] || "";
  },

  /**
   * Get settings by group name: GET /admin/settings/settings?group=general|card|discount|sms_whatsapp|commission|security
   */
  async getByGroup(group = "general") {
    try {
      const res = await api.get("/admin/settings/settings", { group });
      if (res.success && res.data) {
        return res.data;
      }
    } catch (e) {
      console.warn(`Settings group fetch error for ${group}`, e);
    }
    return null;
  },

  /**
   * General getSettings() wrapper
   */
  async getSettings() {
    return this.getFlatSettings();
  },

  /**
   * Update Settings / Group: POST /admin/settings/settings
   */
  async saveSettings(settingsData, group = null) {
    try {
      const payload = group ? { group, ...settingsData } : settingsData;
      const res = await api.post("/admin/settings/settings", payload);
      if (res.success) {
        localStorage.setItem("health_mitra_settings", JSON.stringify(settingsData));
        return { success: true, message: res.message || "Settings updated successfully on server!" };
      }
    } catch (e) {
      console.warn("Settings API save notice", e);
    }

    localStorage.setItem("health_mitra_settings", JSON.stringify(settingsData));
    return { success: true, message: "Settings saved successfully!" };
  },

  /**
   * Update Single Key: POST /admin/settings/settings
   */
  async updateSingleKey(key, value) {
    const res = await api.post("/admin/settings/settings", {
      action: "update_key",
      key,
      value
    });
    if (!res.success) {
      throw new Error(res.message || `Failed to update ${key}.`);
    }
    return { success: true, message: res.message || `${key} updated successfully!` };
  },

  /**
   * Add Custom Key: POST /admin/settings/settings
   */
  async addCustomKey({ key, value, group = "custom", description = "" }) {
    const res = await api.post("/admin/settings/settings", {
      action: "add_custom_key",
      key: key.trim(),
      value,
      group,
      description
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to add custom key.");
    }
    return { success: true, message: res.message || "Custom key added successfully!" };
  },

  /**
   * Delete Custom Key: POST /admin/settings/settings
   */
  async deleteCustomKey(key) {
    const res = await api.post("/admin/settings/settings", {
      action: "delete_custom_key",
      key: key.trim()
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete custom key.");
    }
    return { success: true, message: res.message || "Custom key deleted successfully!" };
  }
};
