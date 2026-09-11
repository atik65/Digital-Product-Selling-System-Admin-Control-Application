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

// NOTE: access_token and refresh_token are stored as HttpOnly cookies by the HTTP server
// response header (Set-Cookie). Client-side JavaScript cannot read or write them directly,
// which prevents XSS token theft. The browser automatically attaches them to API requests
// because withCredentials: true is configured.

export const getAccessToken = () => getCookie(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => getCookie(REFRESH_TOKEN_KEY);

export const setAuthCookies = ({ user } = {}) => {
  // Client only sets the non-HttpOnly session flag so the router knows the user is logged in
  setCookie(SIGNED_IN_KEY, "true", { expires: 7 });

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
  removeCookie(ACCESS_TOKEN_KEY);
  removeCookie(REFRESH_TOKEN_KEY);
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("deskSession");
  }
};

export const isAuthenticated = () => {
  return getCookie(SIGNED_IN_KEY) === "true";
};
