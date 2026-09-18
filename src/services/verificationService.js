import { initialVerifications, getStoredVerifications } from "../data/verifications";
import { cardholderService } from "./cardholderService";
import { partnerService } from "./partnerService";

export const verificationService = {
  async getAll() {
    try {
      const historyRes = await partnerService.getHistory();
      if (historyRes.success && Array.isArray(historyRes.data) && historyRes.data.length > 0) {
        return historyRes.data;
      }
    } catch (e) {
      console.warn("verificationService.getAll API fallback notice", e);
    }
    return getStoredVerifications();
  },

  async verifyCard(query) {
    try {
      const res = await partnerService.verifyCard(query);
      if (res.found) {
        return res;
      }
    } catch (e) {
      console.warn("Live verifyCard notice:", e);
    }

    // Fallback to local cardholder database if needed
    const cardholder =
      (await cardholderService.getByUniqueId(query)) ||
      (await cardholderService.getByPublicToken(query));

    if (!cardholder) {
      return {
        found: false,
        message: `Invalid Card! No active Health Mitra card found matching '${query}'.`
      };
    }

    const isExpired = new Date(cardholder.expiry_date) < new Date();
    const status = isExpired ? "Expired" : cardholder.status;

    return {
      found: true,
      cardholder: {
        unique_id: cardholder.unique_id,
        full_name: cardholder.full_name,
        cardholder_name: cardholder.full_name,
        status: status,
        card_status: status.toLowerCase(),
        issue_date: cardholder.issue_date,
        expiry_date: cardholder.expiry_date,
        public_token: cardholder.public_token,
        district: cardholder.district,
        discount_eligibility: "Up to 20% OFF",
        max_discount_percent: 20
      }
    };
  },

  async recordRedemption(redemptionData) {
    try {
      const res = await partnerService.recordDiscount(redemptionData);
      if (res && res.success) {
        return res;
      }
    } catch (e) {
      console.warn("Live recordDiscount notice:", e);
    }

    const all = getStoredVerifications();
    const newRecord = {
      id: `VRF-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      receipt_no: `RCP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
      status: "Success",
      ...redemptionData
    };
    const updated = [newRecord, ...all];
    localStorage.setItem("health_mitra_verifications", JSON.stringify(updated));
    return newRecord;
  }
};

