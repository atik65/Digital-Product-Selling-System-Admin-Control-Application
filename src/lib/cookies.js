import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const SIGNED_IN_KEY = "signedIn";
const USER_KEY = "admin_user";

const isSecureEnv = () => {
  if (typeof window === "undefined") return false;
  return window.location.protocol === "https:";
};

export function getCookie(name, defaultValue = null) {
  const val = Cookies.get(name);
  return val !== undefined ? val : defaultValue;
}

export function setCookie(name, value, options = {}) {
  const defaultOptions = {
    sameSite: "lax",
    secure: isSecureEnv(),
    path: "/",
    ...options,
  };
  Cookies.set(name, value, defaultOptions);
}

export function removeCookie(name, options = {}) {
  Cookies.remove(name, { path: "/", ...options });
}

// ==================== AUTH TOKEN HELPERS ====================

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return (
    getCookie(ACCESS_TOKEN_KEY) ||
    getCookie("auth_token") ||
    localStorage.getItem("admin_access_token") ||
    localStorage.getItem("access_token") ||
    null
  );
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return (
    getCookie(REFRESH_TOKEN_KEY) ||
    localStorage.getItem("admin_refresh_token") ||
    localStorage.getItem("refresh_token") ||
    null
  );
};

export const setAuthCookies = ({ accessToken, refreshToken, user } = {}) => {
  // Session indicators
  setCookie(SIGNED_IN_KEY, "true", { expires: 7 });
  setCookie("isSignedIn", "true", { expires: 7 });

  if (accessToken) {
    setCookie(ACCESS_TOKEN_KEY, accessToken, { expires: 1 / 24 });
    setCookie("auth_token", accessToken, { expires: 1 / 24 });
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("admin_access_token", accessToken);
    }
  }

  if (refreshToken) {
    setCookie(REFRESH_TOKEN_KEY, refreshToken, { expires: 7 });
    if (typeof window !== "undefined") {
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("admin_refresh_token", refreshToken);
    }
  }

  if (user) {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Failed to store user in localStorage", e);
    }
  }
};

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const clearAuthCookies = () => {
  removeCookie(SIGNED_IN_KEY);
  removeCookie("isSignedIn");
  removeCookie(ACCESS_TOKEN_KEY);
  removeCookie(REFRESH_TOKEN_KEY);
  removeCookie("auth_token");
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("admin_user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("admin_refresh_token");
    localStorage.removeItem("deskSession");
  }
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return (
    getCookie(SIGNED_IN_KEY) === "true" ||
    getCookie("isSignedIn") === "true" ||
    !!getAccessToken() ||
    !!getStoredUser()
  );
};
