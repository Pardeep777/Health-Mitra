export const analyticsService = {
  getAdminStats() {
    return {
      totalCardholders: 48526,
      activeCards: 44821,
      expiringSoon: 1824,
      expiredCards: 1881,
      totalPartners: 126,
      activePartners: 102,
      pendingPartners: 18,
      fieldAgents: 87,
      activeAgentsToday: 74,
      totalDistributors: 50,
      totalRevenue: 2377774,
      monthlyEnrolments: 4286,
      year1Target: 500000,
      year1TargetPercentage: 9.7, // 48,526 / 5,00,000
      renewalRate: 70.4,
      dailyAverageEnrolment: 9.8,

      monthlyEnrollmentGrowth: [
        { month: "Mar", cards: 2100, revenue: 102900 },
        { month: "Apr", cards: 2850, revenue: 139650 },
        { month: "May", cards: 3400, revenue: 166600 },
        { month: "Jun", cards: 3950, revenue: 193550 },
        { month: "Jul", cards: 4120, revenue: 201880 },
        { month: "Aug", cards: 4286, revenue: 210014 }
      ],

      cardStatusBreakdown: [
        { name: "Active Cards", value: 44821, color: "#10B981" },
        { name: "Expiring Soon (30d)", value: 1824, color: "#F59E0B" },
        { name: "Expired Cards", value: 1881, color: "#EF4444" }
      ],

      partnerCategoryBreakdown: [
        { name: "Pharmacies", count: 68, color: "#FF5A00" },
        { name: "Pathology Labs", count: 34, color: "#3B82F6" },
        { name: "Nursing Homes", count: 18, color: "#10B981" },
        { name: "Hospitals", count: 6, color: "#8B5CF6" }
      ],

      districtEnrollmentData: [
        { district: "West Tripura", cards: 22450, target: 180000, percentage: 12.5 },
        { district: "Sepahijala", cards: 6840, target: 65000, percentage: 10.5 },
        { district: "Gomati", cards: 5920, target: 55000, percentage: 10.8 },
        { district: "South Tripura", cards: 4780, target: 50000, percentage: 9.6 },
        { district: "Khowai", cards: 3120, target: 45000, percentage: 6.9 },
        { district: "Dhalai", cards: 2410, target: 40000, percentage: 6.0 },
        { district: "North Tripura", cards: 2150, target: 40000, percentage: 5.4 },
        { district: "Unakoti", cards: 856, target: 25000, percentage: 3.4 }
      ]
    };
  }
};
