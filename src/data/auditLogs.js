export const initialAuditLogs = [
  {
    id: "AUD-801",
    timestamp: "2026-09-02 12:30:15",
    user: "Dr. Subhash Debbarma",
    role: "Partner",
    action: "Card Lookup & Verification",
    module: "Card Verification",
    record: "HMC-7F38A21",
    ip_address: "103.228.154.21",
    status: "Success",
    details: "Looked up Rahul Sharma's card validity via QR scanner."
  },
  {
    id: "AUD-802",
    timestamp: "2026-09-02 11:45:02",
    user: "Rajesh Kumar",
    role: "Field Agent",
    action: "New Cardholder Enrolled",
    module: "Agent Registration",
    record: "HMC-7F38A21",
    ip_address: "106.210.12.89",
    status: "Success",
    details: "Enrolled Rahul Sharma, collected ₹49 UPI payment with DPDPA consent."
  },
  {
    id: "AUD-803",
    timestamp: "2026-09-02 09:31:40",
    user: "Super Admin",
    role: "Admin",
    action: "Partner Approval",
    module: "Partner Onboarding",
    record: "PART-1005 (City Heart Hospital)",
    ip_address: "49.207.180.12",
    status: "Success",
    details: "Verified commercial license and executed digital partner agreement."
  },
  {
    id: "AUD-804",
    timestamp: "2026-09-01 16:20:10",
    user: "Dr. Anirban Roy",
    role: "Partner",
    action: "Recorded Discount Redemption",
    module: "Partner Portal",
    record: "VRF-9002 (₹200 Discount)",
    ip_address: "103.228.154.55",
    status: "Success",
    details: "Processed 20% pathology test discount on bill ₹1,000 for Priya Das."
  },
  {
    id: "AUD-805",
    timestamp: "2026-09-01 14:15:30",
    user: "System Automated Cron",
    role: "System",
    action: "Expiry Flagging Job",
    module: "Lifecycle Automation",
    record: "1,824 Cards Flagged",
    ip_address: "127.0.0.1",
    status: "Success",
    details: "Automated scan marked cards with expiry_date - current_date <= 30 as 'Expiring Soon'."
  },
  {
    id: "AUD-806",
    timestamp: "2026-09-01 10:05:12",
    user: "Sudip Chakraborty",
    role: "District Coordinator",
    action: "Agent Target Review",
    module: "District West Tripura",
    record: "DIST-01 Agent Performance",
    ip_address: "49.207.181.90",
    status: "Success",
    details: "Generated daily target compliance report for 32 active West Tripura agents."
  }
];
