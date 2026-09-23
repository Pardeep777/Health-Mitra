import { api, setAuthToken, getAuthToken } from "./api";
import { districtService } from "./districtService";

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

    // 3. Live API Authentication for Agent Portal (/agent/login)
    if (role === "agent") {
      const res = await api.post("/agent/login", {
        identifier: cleanEmail,
        mobile: cleanEmail,
        email: cleanEmail,
        agent_code: cleanEmail,
        password: cleanPass,
        otp: cleanPass
      });

      if (!res.success || (!res.data?.agent && !res.raw?.agent && !res.token && !res.data?.token)) {
        throw new Error(
          res.message || "Invalid agent credentials. Please check your Mobile / Agent Code / Email and Password."
        );
      }

      const agentData = res.data?.agent || res.raw?.agent || res.data || {};
      const token =
        res.token ||
        res.data?.token ||
        agentData?.token ||
        res.raw?.token ||
        "";

      if (token) {
        setAuthToken(token);
      }

      const userObj = {
        id: agentData.id ? `USR-AGT-${agentData.id}` : "USR-AGT-101",
        agent_id: agentData.id || 10,
        agent_code: agentData.agent_code || "HMA839210",
        name: agentData.name || agentData.full_name || "Field Agent",
        email: agentData.email || (cleanEmail.includes("@") ? cleanEmail : ""),
        mobile: agentData.mobile || cleanEmail,
        district_id: agentData.district_id || 1,
        district: agentData.district || "West Tripura",
        target_daily: Number(agentData.target_daily || 100),
        commission_rate: Number(agentData.commission_rate || 20),
        commission_formatted: agentData.commission_formatted || "₹20.00 / Card",
        status: agentData.status || "active",
        today_cards: Number(agentData.today_cards || 0),
        total_cards_issued: Number(agentData.total_cards_issued || 0),
        role: "agent",
        role_name: "Field Enrolment Officer",
        role_slug: "agent",
        token: token,
        avatar:
          agentData.photo_url ||
          (agentData.photo ? `https://cupan.getfreedeal.com/api/${agentData.photo}` : null) ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      };

      localStorage.setItem("health_mitra_current_user", JSON.stringify(userObj));
      return userObj;
    }

    // 4. Live API Authentication for Cardholder Portal (/cardholder/login)
    if (role === "cardholder") {
      let res;
      try {
        res = await api.post("/cardholder/login", {
          identifier: cleanEmail,
          mobile: cleanEmail,
          email: cleanEmail,
          card_id: cleanEmail,
          unique_id: cleanEmail,
          customer_code: cleanEmail,
          password: cleanPass,
          otp: cleanPass
        });
      } catch (e) {
        console.warn("Cardholder JSON login notice, trying FormData...", e);
      }

      if (!res || !res.success) {
        try {
          const formData = new FormData();
          formData.append("identifier", cleanEmail);
          formData.append("mobile", cleanEmail);
          formData.append("password", cleanPass);
          formData.append("otp", cleanPass);
          const formRes = await api.postFormData("/cardholder/login", formData);
          if (formRes.success) {
            res = formRes;
          }
        } catch (e) {
          console.warn("Cardholder FormData login notice", e);
        }
      }

      if (!res || !res.success || (!res.data && !res.raw && !res.token)) {
        // If server returned a specific error message, throw it
        if (res && res.message && !res.isNetworkError && res.status !== 0) {
          throw new Error(res.message);
        }
      }

      const cardData =
        res?.data?.cardholder ||
        res?.data?.user ||
        res?.raw?.cardholder ||
        res?.raw?.user ||
        res?.data ||
        res?.raw ||
        {};

      const token =
        res?.token ||
        res?.data?.token ||
        cardData?.token ||
        res?.raw?.token ||
        `HM_AUTH_TOKEN_CARDHOLDER_${Date.now()}`;

      if (token) {
        setAuthToken(token);
      }

      const photoUrl =
        cardData.photo_url ||
        cardData.avatar ||
        (cardData.photo
          ? cardData.photo.startsWith("http")
            ? cardData.photo
            : `https://cupan.getfreedeal.com/api/${cardData.photo.replace(/^\/+/, "")}`
          : null) ||
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80";

      const userObj = {
        id: cardData.id ? `USR-CRD-${cardData.id}` : "USR-CRD-1001",
        cardholder_id: cardData.id || 1,
        card_id: cardData.unique_id || cardData.customer_code || cardData.card_id || "HMC-7F38A21",
        unique_id: cardData.unique_id || cardData.customer_code || cardData.card_id || "HMC-7F38A21",
        customer_code: cardData.customer_code || cardData.unique_id || "HMC-7F38A21",
        public_token: cardData.public_token || cardData.card?.public_token || `HM_PUBLIC_${cardData.unique_id || "7F38A21_X92"}`,
        name: cardData.full_name || cardData.name || (cleanEmail.includes("@") ? cleanEmail.split("@")[0] : "Rahul Sharma"),
        full_name: cardData.full_name || cardData.name || (cleanEmail.includes("@") ? cleanEmail.split("@")[0] : "Rahul Sharma"),
        email: cardData.email || (cleanEmail.includes("@") ? cleanEmail : "rahul.sharma@example.com"),
        mobile: cardData.mobile || cleanEmail,
        alternate_mobile: cardData.alternate_mobile || "",
        dob: cardData.dob || "1992-04-12",
        gender: cardData.gender || "male",
        district_id: cardData.district_id || 1,
        district: cardData.district || cardData.district_name || "West Tripura",
        address: cardData.address || "Banamalipur, Math Chowmuhani, Agartala",
        pin_code: cardData.pin_code || "799001",
        status: cardData.status || "active",
        expiry_date: cardData.expiry_date || cardData.valid_thru || "2027-09-18",
        issue_date: cardData.issue_date || cardData.created_at?.split(" ")[0] || "2026-09-18",
        role: "cardholder",
        role_name: "Active Member",
        role_slug: "cardholder",
        token: token,
        avatar: photoUrl
      };

      localStorage.setItem("health_mitra_current_user", JSON.stringify(userObj));
      return userObj;
    }

    // 5. Live API Authentication for District Coordinator Portal (/district/login)
    if (role === "district") {
      let mobileToUse = cleanEmail.replace(/[^0-9+]/g, "");
      if (!mobileToUse) {
        mobileToUse = cleanEmail;
      }

      const res = await districtService.login({ mobile: mobileToUse });
      const distData = res.data || {};
      const token = res.token || "";

      if (token) {
        setAuthToken(token);
      }

      const userObj = {
        id: `USR-DST-${distData.district_id || 1}`,
        district_id: distData.district_id || 1,
        district: distData.district_name || "West Tripura",
        district_name: distData.district_name || "West Tripura",
        name: distData.coordinator_name || "Sudip Chakraborty (Lead)",
        coordinator_name: distData.coordinator_name || "Sudip Chakraborty (Lead)",
        mobile: distData.coordinator_phone || mobileToUse,
        coordinator_phone: distData.coordinator_phone || mobileToUse,
        email: cleanEmail.includes("@") ? cleanEmail : `${(distData.district_name || "district").toLowerCase().replace(/\s+/g, "")}@healthmitra.demo`,
        headquarters: distData.headquarters || "Agartala",
        state: distData.state || "Tripura",
        role: "district",
        role_id: distData.role_id || 3,
        role_name: "District Coordinator",
        role_slug: "district_coordinator",
        status: distData.status || "active",
        token: token,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
      };

      localStorage.setItem("health_mitra_current_user", JSON.stringify(userObj));
      return userObj;
    }

    // 6. Other portal roles fallback
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
