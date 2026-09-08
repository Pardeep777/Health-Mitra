import { api, setAuthToken, getAuthToken } from "./api";

export const DEMO_USERS = {
  admin: {
    id: "USR-ADM-01",
    email: "admin@gmail.com",
    role: "admin",
    name: "Super Admin",
    title: "Platform Administrator",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    district: "State HQ (Agartala)"
  },
  partner: {
    id: "USR-PRT-1001",
    email: "partner@healthmitra.demo",
    role: "partner",
    name: "Dr. Subhash Debbarma",
    title: "Owner, Mitra Pharmacy & Healthcare",
    partner_id: "PART-1001",
    partner_name: "Mitra Pharmacy & Healthcare",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    district: "West Tripura"
  },
  agent: {
    id: "USR-AGT-101",
    email: "agent@healthmitra.demo",
    role: "agent",
    name: "Rajesh Kumar",
    title: "Senior Field Enrolment Officer",
    agent_id: "AGT-101",
    agent_code: "HM-AGT-0101",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    district: "West Tripura"
  },
  cardholder: {
    id: "USR-CRD-1001",
    email: "rahul.sharma@example.com",
    role: "cardholder",
    name: "Rahul Sharma",
    title: "Active Member",
    card_id: "HMC-7F38A21",
    public_token: "HM_PUBLIC_7F38A21_X92",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    district: "West Tripura"
  },
  district: {
    id: "USR-DST-01",
    email: "coordinator.west@healthmitra.demo",
    role: "district",
    name: "Sudip Chakraborty",
    title: "District Coordinator - West Tripura",
    district: "West Tripura",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  }
};

export const authService = {
  async login(role = "admin", email = "", password = "") {
    const cleanEmail = (email || "").trim();
    const cleanPass = (password || "").trim();

    if (!cleanEmail) {
      throw new Error("Please enter your email or user ID.");
    }
    if (!cleanPass) {
      throw new Error("Please enter your password.");
    }

    // 1. Strict Live API Authentication for Admin
    if (role === "admin" || cleanEmail === "admin@gmail.com") {
      const res = await api.post("/admin/login", {
        email: cleanEmail,
        password: cleanPass
      });

      if (!res.success || !res.data) {
        throw new Error(res.message || "Invalid admin credentials. Please check your email and password.");
      }

      const apiData = res.data;
      const token = apiData.token || apiData.jwt || apiData.access_token || "";
      if (token) {
        setAuthToken(token);
      }

      const userObj = {
        id: apiData.id || `USR-ADM-${Date.now()}`,
        email: apiData.email || cleanEmail,
        name: apiData.name || apiData.full_name || "Super Admin",
        role: "admin",
        mobile: apiData.mobile || "",
        token: token,
        avatar:
          apiData.avatar ||
          apiData.photo ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        district: apiData.district || "State HQ (Agartala)"
      };

      localStorage.setItem("health_mitra_current_user", JSON.stringify(userObj));
      return userObj;
    }

    // 2. Other portal roles (Partner, Field Agent, Cardholder, District Desk)
    await new Promise((resolve) => setTimeout(resolve, 200));
    const user = { ...(DEMO_USERS[role] || DEMO_USERS.partner) };
    if (cleanEmail) user.email = cleanEmail;

    localStorage.setItem("health_mitra_current_user", JSON.stringify(user));
    return user;
  },

  getCurrentUser() {
    const saved = localStorage.getItem("health_mitra_current_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  },

  getToken() {
    return getAuthToken();
  },

  logout() {
    localStorage.removeItem("health_mitra_current_user");
    setAuthToken(null);
    return true;
  },

  switchRole(role) {
    const user = { ...(DEMO_USERS[role] || DEMO_USERS.admin) };
    localStorage.setItem("health_mitra_current_user", JSON.stringify(user));
    return user;
  }
};
