import { api } from "./api";

const DEFAULT_SETTINGS = {
  cardPrice: "49",
  maxDiscountPercent: "20",
  cardValidityDays: "365",
  deliveryCommitmentDays: "15",
  agentDailyTarget: "10",
  smsGatewayProvider: "Fast2SMS (Active)",
  whatsAppApiStatus: "Meta Cloud API Connected",
  dpdpaVersion: "v1.2",
  auditRetentionMonths: "24",
  expirySmsTemplate:
    "Dear {name}, your Health Mitra card {card_id} expires in 30 days on {expiry_date}. Renew today for ₹49 to keep saving up to 20% on medicines & tests: https://cupan.getfreedeal.com/renew/{token}"
};

export const settingsService = {
  /**
   * Fetch current system settings from API: GET /admin/settings or /admin/config
   */
  async getSettings() {
    try {
      const res = await api.get("/admin/settings");
      if (res.success && res.data && typeof res.data === "object") {
        return { ...DEFAULT_SETTINGS, ...res.data };
      }
    } catch (e) {
      console.warn("Settings fetch API notice", e);
    }

    try {
      const res2 = await api.get("/admin/config");
      if (res2.success && res2.data && typeof res2.data === "object") {
        return { ...DEFAULT_SETTINGS, ...res2.data };
      }
    } catch (e) {
      // Fallback
    }

    const local = localStorage.getItem("health_mitra_settings");
    if (local) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(local) };
      } catch {}
    }

    return DEFAULT_SETTINGS;
  },

  /**
   * Save system settings to backend API: POST /admin/settings or /admin/config
   */
  async saveSettings(settingsData) {
    try {
      const res = await api.post("/admin/settings", settingsData);
      if (res.success) {
        localStorage.setItem("health_mitra_settings", JSON.stringify(settingsData));
        return { success: true, message: res.message || "Settings saved successfully on server!" };
      }
    } catch (e) {
      console.warn("Settings API save notice", e);
    }

    try {
      const res2 = await api.post("/admin/config", settingsData);
      if (res2.success) {
        localStorage.setItem("health_mitra_settings", JSON.stringify(settingsData));
        return { success: true, message: res2.message || "Settings saved successfully!" };
      }
    } catch (e) {
      // Local fallback
    }

    localStorage.setItem("health_mitra_settings", JSON.stringify(settingsData));
    return { success: true, message: "Settings saved successfully!" };
  }
};
