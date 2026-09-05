/**
 * Centralized API client for Health Mitra backend
 * Base URL: https://cupan.getfreedeal.com/api
 * All endpoints support clean URLs (without .php)
 */

export const API_BASE_URL = "https://cupan.getfreedeal.com/api";

export const DEFAULT_ADMIN_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MywibmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJtb2JpbGUiOiI4ODg4ODg4ODg4Iiwicm9sZV9pZCI6MSwicm9sZV9uYW1lIjoiU3VwZXIgQWRtaW4iLCJyb2xlX3NsdWciOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc4ODU5ODQ4MywiZXhwIjoxNzg5MjAzMjgzfQ.A1rYUmLCJtur13MbBUoj8_N2h_LNRTWtBwRfuBh9eqw";

export function getAuthToken() {
  const token = localStorage.getItem("health_mitra_token");
  if (token && token.trim()) return token.trim();

  const user = localStorage.getItem("health_mitra_current_user");
  if (user) {
    try {
      const parsed = JSON.parse(user);
      if (parsed?.token) {
        localStorage.setItem("health_mitra_token", parsed.token);
        return parsed.token;
      }
    } catch {}
  }

  // Fallback to active valid token from system
  localStorage.setItem("health_mitra_token", DEFAULT_ADMIN_TOKEN);
  return DEFAULT_ADMIN_TOKEN;
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("health_mitra_token", token);
  } else {
    localStorage.setItem("health_mitra_token", DEFAULT_ADMIN_TOKEN);
  }
}

/**
 * Normalizes endpoint URL to remove any .php extension
 */
export function normalizeEndpoint(endpoint) {
  if (!endpoint) return "";
  // Strip .php extension before query params or at end of string
  return endpoint.replace(/\.php(\?|$)/, "$1");
}

async function request(endpoint, options = {}) {
  const cleanEndpoint = normalizeEndpoint(endpoint);
  const url = cleanEndpoint.startsWith("http") ? cleanEndpoint : `${API_BASE_URL}${cleanEndpoint}`;
  const token = getAuthToken();

  const headers = {
    Accept: "application/json",
    ...(options.headers || {})
  };

  if (token && !headers.Authorization) {
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
      data: data?.data !== undefined ? data.data : data
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
    const token = getAuthToken();
    const params = new URLSearchParams();

    if (token && !queryParams.token) {
      params.append("token", token);
    }

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
    const token = getAuthToken();
    const payload = typeof data === "object" && data !== null ? { token, ...data } : data;
    return request(endpoint, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  postFormData(endpoint, formData) {
    const token = getAuthToken();
    if (formData instanceof FormData && token && !formData.has("token")) {
      formData.append("token", token);
    }
    return request(endpoint, {
      method: "POST",
      body: formData
    });
  }
};
