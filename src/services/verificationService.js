import { initialVerifications, getStoredVerifications } from "../data/verifications";
import { cardholderService } from "./cardholderService";

export const verificationService = {
  async getAll() {
    await new Promise((r) => setTimeout(r, 150));
    return getStoredVerifications();
  },

  async verifyCard(query) {
    await new Promise((r) => setTimeout(r, 200));
    const cardholder = await cardholderService.getByUniqueId(query) || await cardholderService.getByPublicToken(query);
    if (!cardholder) {
      return { found: false, message: "No active Health Mitra card found matching this ID or QR code." };
    }

    const isExpired = new Date(cardholder.expiry_date) < new Date();
    const status = isExpired ? "Expired" : cardholder.status;

    return {
      found: true,
      cardholder: {
        unique_id: cardholder.unique_id,
        full_name: cardholder.full_name,
        status: status,
        issue_date: cardholder.issue_date,
        expiry_date: cardholder.expiry_date,
        public_token: cardholder.public_token,
        district: cardholder.district,
        // Privacy rule: Do NOT expose private contact details in public verification
      }
    };
  },

  async recordRedemption(redemptionData) {
    await new Promise((r) => setTimeout(r, 300));
    const all = getStoredVerifications();
    const newRecord = {
      id: `VRF-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      receipt_no: `RCP-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${Math.floor(100+Math.random()*900)}`,
      status: "Success",
      ...redemptionData
    };
    const updated = [newRecord, ...all];
    localStorage.setItem("health_mitra_verifications", JSON.stringify(updated));
    return newRecord;
  }
};
