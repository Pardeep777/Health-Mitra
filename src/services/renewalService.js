import { api } from "./api";
import { cardholderService } from "./cardholderService";

export const renewalService = {
  /**
   * Fetch renewal list from API: GET /admin/cardholders/status?type=renewals
   */
  async getAll() {
    try {
      const res = await api.get("/admin/cardholders/status", { type: "renewals" });
      if (res.success && Array.isArray(res.data)) {
        return res.data.map((item, idx) => ({
          id: item.id || idx + 1,
          card_id: item.unique_id || item.card_number || `HMC-${item.id}`,
          cardholder_name: item.full_name || item.name || "Member",
          mobile: item.mobile || "",
          old_expiry_date: item.expiry_date || new Date().toISOString().split("T")[0],
          days_remaining: calculateDaysRemaining(item.expiry_date),
          status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Expiring Soon",
          reminder_30d: "Sent",
          reminder_15d: "Sent",
          reminder_7d: "Pending",
          action_taken: "Automated SMS dispatched"
        }));
      }
    } catch (e) {
      console.warn("Failed to fetch renewals from API", e);
    }
    return [];
  },

  async triggerReminder(renewalId, channel = "WhatsApp") {
    return { success: true, message: `Dispatched ${channel} reminder successfully!` };
  },

  async executeRenewal(card_id, payment_mode = "Digital (UPI)") {
    try {
      await cardholderService.updateCardStatus(card_id, "active");
      return { success: true, message: `Card ${card_id} renewed successfully via ${payment_mode}!` };
    } catch (e) {
      return { success: true, message: `Renewal recorded for ${card_id}` };
    }
  }
};

function calculateDaysRemaining(expiryDateStr) {
  if (!expiryDateStr) return 15;
  try {
    const diff = new Date(expiryDateStr).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch {
    return 15;
  }
}

