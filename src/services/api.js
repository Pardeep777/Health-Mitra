/**
 * Centralized API client for Health Mitra backend
 * Base URL: https://cupan.getfreedeal.com/api
 * All endpoints support clean URLs (without .php)
 */

export const API_BASE_URL = "https://cupan.getfreedeal.com/api";

export const DEFAULT_ADMIN_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MywibmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJtb2JpbGUiOiI4ODg4ODg4ODg4Iiwicm9sZV9pZCI6MSwicm9sZV9uYW1lIjoiU3VwZXIgQWRtaW4iLCJyb2xlX3NsdWciOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc4OTU1ODYzMCwiZXhwIjoxNzkwMTYzNDMwfQ.eInXvct0bsnaDlBsiHi6MC4r-1RihYy22OKrd_dygSE";

export function getAuthToken() {
  const token = localStorage.getItem("health_mitra_token");
  if (token && token.trim()) return token.trim();

  const user = localStorage.getItem("health_mitra_current_user");
  if (user) {
    try {
      const parsed = JSON.parse(user);
      if (parsed?.token && parsed.token.trim()) {
        localStorage.setItem("health_mitra_token", parsed.token.trim());
        return parsed.token.trim();
      }
    } catch {}
  }

  return "";
}

export function setAuthToken(token) {
  if (token && typeof token === "string" && token.trim()) {
    localStorage.setItem("health_mitra_token", token.trim());
  } else {
    localStorage.removeItem("health_mitra_token");
  }
}

/**
 * Normalizes endpoint URL ensuring proper slash prefix and no .php suffix
 */
export function normalizeEndpoint(endpoint) {
  if (!endpoint) return "";
  let clean = endpoint.startsWith("http")
    ? endpoint
    : endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  // Automatically remove .php or .php? from any endpoint
  clean = clean.replace(/\.php(\?|$)/, "$1");
  return clean;
}

async function request(endpoint, options = {}) {
  const cleanEndpoint = normalizeEndpoint(endpoint);
  const url = cleanEndpoint.startsWith("http") ? cleanEndpoint : `${API_BASE_URL}${cleanEndpoint}`;
  const token = getAuthToken();

  const headers = {
    Accept: "application/json",
    ...(options.headers || {})
  };

  // Attach token in standard Authorization header
  if (token && !headers.Authorization && !headers.authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  // If body is not FormData and not already Content-Type set, set JSON
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Parse response
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    // Check HTTP status code
    if (!response.ok) {
      const errorMessage =
        data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
      return {
        success: false,
        status: response.status,
        message: errorMessage,
        data: null
      };
    }

    // Check PHP API payload status: { status: false, message: "Mobile number is already registered!" }
    if (data && (data.status === false || data.status === 0 || data.status === "error" || data.success === false)) {
      return {
        success: false,
        status: 400,
        message: data.message || "Operation failed on server.",
        data: null,
        error: data
      };
    }

    return {
      success: true,
      status: response.status,
      message: data?.message || "Operation successful",
      token: data?.token || null,
      token_type: data?.token_type || "Bearer",
      data: data?.data !== undefined ? data.data : data,
      raw: data
    };
  } catch (error) {
    console.warn(`[API Network Error] ${url}:`, error.message);
    return {
      success: false,
      status: 0,
      message: error.message || "Network connection error. Please try again.",
      data: null,
      isNetworkError: true
    };
  }
}

export const api = {
  get(endpoint, queryParams = {}) {
    let url = normalizeEndpoint(endpoint);
    const params = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }

    return request(url, { method: "GET" });
  },

  post(endpoint, data = {}) {
    return request(endpoint, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  put(endpoint, data = {}) {
    return request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  delete(endpoint, data = null) {
    return request(endpoint, {
      method: "DELETE",
      ...(data ? { body: JSON.stringify(data) } : {})
    });
  },

  patch(endpoint, data = {}) {
    return request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data)
    });
  },

  postFormData(endpoint, formData) {
    return request(endpoint, {
      method: "POST",
      body: formData
    });
  }
};
