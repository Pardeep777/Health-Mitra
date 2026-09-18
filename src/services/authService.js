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

    // 1. Live API Authentication for Admin
    if (role === "admin" || cleanEmail.toLowerCase().includes("admin")) {
      let emailToSend = cleanEmail;
      if (emailToSend.toLowerCase() === "admin") {
        emailToSend = "admin@gmail.com";
      }

      let res = await api.post("/admin/login", {
        email: emailToSend,
        password: cleanPass
      });

      if (!res.success && !cleanEmail.includes("@")) {
        const fallbackRes = await api.post("/admin/login", {
          email: `${cleanEmail}@gmail.com`,
          password: cleanPass
        });
        if (fallbackRes.success) {
          res = fallbackRes;
          emailToSend = `${cleanEmail}@gmail.com`;
        }
      }

      if (!res.success || (!res.data && !res.token)) {
        throw new Error(res.message || "Invalid admin credentials. Please check your email and password.");
      }

      const apiData = res.data || {};
      const token =
        res.token ||
        apiData.token ||
        apiData.jwt ||
        apiData.access_token ||
        res.raw?.token ||
        res.raw?.jwt ||
        res.raw?.access_token ||
        "";

      if (token) {
        setAuthToken(token);
      }

      const userObj = {
        id: apiData.id || `USR-ADM-${Date.now()}`,
        email: apiData.email || emailToSend,
        name: apiData.name || apiData.full_name || "Super Admin",
        role: "admin",
        role_slug: apiData.role_slug || "super_admin",
        role_name: apiData.role_name || "Super Admin",
        mobile: apiData.mobile || "8888888888",
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

    // 2. Live API Authentication for Partner Portal (/partner/login)
    if (role === "partner") {
      const formData = new FormData();
      if (cleanEmail.includes("@")) {
        formData.append("email", cleanEmail);
      } else {
        formData.append("mobile", cleanEmail);
      }
      formData.append("otp", cleanPass);
      formData.append("password", cleanPass);

      const res = await api.postFormData("/partner/login", formData);

      if (!res.success || (!res.data && !res.token)) {
        throw new Error(res.message || "Invalid partner credentials. Please check your Mobile / Email and OTP.");
      }

      const partnerData = res.data?.partner || res.data || {};
      const token =
        res.token ||
        res.data?.token ||
        partnerData?.token ||
        res.raw?.token ||
        "";

      if (token) {
        setAuthToken(token);
      }

      const userObj = {
        id: partnerData.id ? `USR-PRT-${partnerData.id}` : "USR-PRT-1001",
        partner_id: partnerData.id || 3,
        partner_code: partnerData.partner_code || "HMP816884",
        business_name: partnerData.business_name || partnerData.name || "Mitra Pharmacy & Healthcare",
        partner_name: partnerData.business_name || partnerData.name || "Mitra Pharmacy & Healthcare",
        owner_name: partnerData.owner_name || "Dr. Subhash Debbarma",
        name: partnerData.owner_name || partnerData.business_name || "Healthcare Partner",
        email: partnerData.email || (cleanEmail.includes("@") ? cleanEmail : ""),
        mobile: partnerData.mobile || cleanEmail,
        alternate_mobile: partnerData.alternate_mobile || "",
        category_id: partnerData.category_id || 1,
        category_name: partnerData.category_name || "Pharmacy / Medicine Shop",
        district_id: partnerData.district_id || 2,
        district: partnerData.district || "South Tripura",
        area_id: partnerData.area_id || 7,
        area: partnerData.area || "Belonia",
        pin_code: partnerData.pin_code || "799001",
        address: partnerData.address || "",
        opening_hours: partnerData.opening_hours || "08:00 AM - 10:30 PM (Mon-Sun)",
        max_discount_percent: partnerData.max_discount_percent || 20,
        status: partnerData.status || "active",
        agreement_status: partnerData.agreement_status || "signed",
        role: "partner",
        role_name: "Healthcare Partner",
        role_slug: "partner",
        token: token,
        avatar:
          partnerData.logo_url ||
          partnerData.shop_image_url ||
          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
      };

      localStorage.setItem("health_mitra_current_user", JSON.stringify(userObj));
      return userObj;
    }

    // 3. Other portal roles (Field Agent, Cardholder, District Desk)
    await new Promise((resolve) => setTimeout(resolve, 200));
    const baseUser = DEMO_USERS[role] || DEMO_USERS.partner;
    const token = `HM_AUTH_TOKEN_${role.toUpperCase()}_${Date.now()}`;
    setAuthToken(token);

    const userObj = {
      ...baseUser,
      role: role,
      email: cleanEmail,
      name: cleanEmail.includes("@") ? cleanEmail.split("@")[0] : baseUser.name,
      token: token
    };

    localStorage.setItem("health_mitra_current_user", JSON.stringify(userObj));
    return userObj;
  },

  getCurrentUser() {
    const saved = localStorage.getItem("health_mitra_current_user");
    if (saved) {
      try {
        const user = JSON.parse(saved);
        if (user && user.role) {
          return user;
        }
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
    localStorage.removeItem("health_mitra_token");
    setAuthToken(null);
    return true;
  },

  switchRole(role) {
    const baseUser = DEMO_USERS[role] || DEMO_USERS.admin;
    const token = `HM_AUTH_TOKEN_${role.toUpperCase()}_${Date.now()}`;
    setAuthToken(token);

    const user = {
      ...baseUser,
      token: token
    };
    localStorage.setItem("health_mitra_current_user", JSON.stringify(user));
    return user;
  }
};
