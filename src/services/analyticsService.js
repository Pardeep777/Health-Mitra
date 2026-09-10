import { api } from "./api";
import { cardholderService } from "./cardholderService";
import { partnerService } from "./partnerService";
import { agentService } from "./agentService";
import { districtService } from "./districtService";

let cachedStats = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 20000; // 20s memory cache

export const analyticsService = {
  getAdminStats() {
    return {
      totalCardholders: 0,
      activeCards: 0,
      expiringSoon: 0,
      expiredCards: 0,
      activeRatio: "100",
      totalPartners: 0,
      activePartners: 0,
      pendingPartners: 0,
      fieldAgents: 0,
      activeAgentsToday: 0,
      totalDistributors: 0,
      totalRevenue: 0,
      monthlyEnrolments: 0,
      year1Target: 500000,
      year1TargetPercentage: 0,
      renewalRate: 100,
      dailyAverageEnrolment: 0,

      monthlyEnrollmentGrowth: [
        { month: "Mar", cards: 0, revenue: 0 },
        { month: "Apr", cards: 0, revenue: 0 },
        { month: "May", cards: 0, revenue: 0 },
        { month: "Jun", cards: 0, revenue: 0 },
        { month: "Jul", cards: 0, revenue: 0 },
        { month: "Aug", cards: 0, revenue: 0 }
      ],

      cardStatusBreakdown: [
        { name: "Active Cards", value: 0, color: "#10B981" },
        { name: "Expiring Soon (30d)", value: 0, color: "#F59E0B" },
        { name: "Expired Cards", value: 0, color: "#EF4444" }
      ],

      partnerCategoryBreakdown: [
        { name: "Pharmacies", count: 0, color: "#FF5A00" },
        { name: "Pathology Labs", count: 0, color: "#3B82F6" },
        { name: "Nursing Homes", count: 0, color: "#10B981" },
        { name: "Hospitals", count: 0, color: "#8B5CF6" }
      ],

      districtEnrollmentData: []
    };
  },

  async getLiveAdminStats(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && cachedStats && now - lastFetchTime < CACHE_TTL_MS) {
      return cachedStats;
    }

    try {
      // Fetch only the actual existing API endpoints in parallel
      const [cardholders, partners, agents, districts] = await Promise.all([
        cardholderService.getAll().catch(() => []),
        partnerService.getAll().catch(() => []),
        agentService.getAll().catch(() => []),
        districtService.getAll().catch(() => [])
      ]);

      const safeCardholders = Array.isArray(cardholders) ? cardholders : [];
      const safePartners = Array.isArray(partners) ? partners : [];
      const safeAgents = Array.isArray(agents) ? agents : [];
      const safeDistricts = Array.isArray(districts) ? districts : [];

      const totalCardholders = safeCardholders.length;
      const in30Days = now + 30 * 24 * 60 * 60 * 1000;

      const activeCards = safeCardholders.filter((c) => {
        const s = (c.status || c.card_status || "").toLowerCase();
        return s === "active" || s === "valid";
      }).length;

      const expiringSoon = safeCardholders.filter((c) => {
        if (!c.expiry_date) return false;
        const expTime = new Date(c.expiry_date).getTime();
        return expTime >= now && expTime <= in30Days;
      }).length;

      const expiredCards = safeCardholders.filter((c) => {
        const s = (c.status || "").toLowerCase();
        if (s === "expired") return true;
        if (!c.expiry_date) return false;
        return new Date(c.expiry_date).getTime() < now;
      }).length;

      const totalPartners = safePartners.length;
      const activePartners = safePartners.filter(
        (p) => (p.status || "").toLowerCase() === "active"
      ).length;
      const pendingPartners = safePartners.filter((p) => {
        const s = (p.status || "").toLowerCase();
        return s === "pending" || s === "inactive";
      }).length;

      const fieldAgents = safeAgents.length;
      const activeAgents = safeAgents.filter(
        (a) => (a.status || "").toLowerCase() === "active"
      ).length;

      const totalRevenue = totalCardholders * 49;
      const activeRatio =
        totalCardholders > 0 ? ((activeCards / totalCardholders) * 100).toFixed(1) : "100";
      const year1Target = 500000;
      const year1TargetPercentage = ((totalCardholders / year1Target) * 100).toFixed(3);

      const cardStatusBreakdown = [
        { name: "Active Cards", value: activeCards, color: "#10B981" },
        { name: "Expiring Soon (30d)", value: expiringSoon, color: "#F59E0B" },
        { name: "Expired Cards", value: expiredCards, color: "#EF4444" }
      ];

      // Build real partner category breakdown
      const catMap = {};
      safePartners.forEach((p) => {
        const cat = p.category || "Pharmacy";
        catMap[cat] = (catMap[cat] || 0) + 1;
      });
      const colors = ["#FF5A00", "#3B82F6", "#10B981", "#8B5CF6", "#EC4899"];
      const partnerCategoryBreakdown =
        Object.keys(catMap).length > 0
          ? Object.entries(catMap).map(([name, count], i) => ({
              name,
              count,
              color: colors[i % colors.length]
            }))
          : [
              { name: "Pharmacies", count: 0, color: "#FF5A00" },
              { name: "Pathology Labs", count: 0, color: "#3B82F6" },
              { name: "Nursing Homes", count: 0, color: "#10B981" },
              { name: "Hospitals", count: 0, color: "#8B5CF6" }
            ];

      // Build real district enrollment distribution
      const districtEnrollmentData = safeDistricts.map((d) => {
        const count = safeCardholders.filter(
          (c) =>
            String(c.district_id) === String(d.id) ||
            (c.district || "").toLowerCase() === (d.name || "").toLowerCase()
        ).length;
        const target = d.targetCardholders || 50000;
        return {
          district: d.name,
          cards: count,
          target,
          percentage: target > 0 ? ((count / target) * 100).toFixed(1) : 0
        };
      });

      // Compute monthly growth dynamically from cardholder issue dates
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthCounts = {};
      safeCardholders.forEach((c) => {
        if (c.issue_date) {
          const m = new Date(c.issue_date).getMonth();
          if (!isNaN(m)) {
            const mName = monthNames[m];
            monthCounts[mName] = (monthCounts[mName] || 0) + 1;
          }
        }
      });

      const currentMonthIndex = new Date().getMonth();
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const mIdx = (currentMonthIndex - i + 12) % 12;
        const mName = monthNames[mIdx];
        const cardsCount = monthCounts[mName] || 0;
        last6Months.push({
          month: mName,
          cards: cardsCount,
          revenue: cardsCount * 49
        });
      }

      // If no historical dates, set current count to current month
      if (last6Months.every((m) => m.cards === 0) && totalCardholders > 0) {
        last6Months[last6Months.length - 1].cards = totalCardholders;
        last6Months[last6Months.length - 1].revenue = totalRevenue;
      }

      const finalStats = {
        totalCardholders,
        activeCards,
        expiringSoon,
        expiredCards,
        activeRatio,
        totalPartners,
        activePartners,
        pendingPartners,
        fieldAgents,
        activeAgentsToday: activeAgents,
        totalRevenue,
        monthlyEnrolments: totalCardholders,
        year1Target,
        year1TargetPercentage: Math.max(0.01, parseFloat(year1TargetPercentage)),
        renewalRate: totalCardholders > 0 ? (((totalCardholders - expiredCards) / totalCardholders) * 100).toFixed(1) : "100",
        dailyAverageEnrolment: (totalCardholders / 30).toFixed(1),
        monthlyEnrollmentGrowth: last6Months,
        cardStatusBreakdown,
        partnerCategoryBreakdown,
        districtEnrollmentData
      };

      cachedStats = finalStats;
      lastFetchTime = now;
      return finalStats;
    } catch (e) {
      console.warn("Analytics live calculation notice", e);
      return this.getAdminStats();
    }
  }
};
