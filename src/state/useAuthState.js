import { create } from "zustand";
import {
  clearAuthCookies,
  getAccessToken,
  getStoredUser,
  isAuthenticated as checkIsAuth,
  setAuthCookies,
} from "@/lib/cookies";

export const useAuthState = create((set) => ({
  user: getStoredUser(),
  token: getAccessToken(),
  isAuthenticated: checkIsAuth(),
  isLoading: false,

  setAuth: ({ user, accessToken, refreshToken }) => {
    setAuthCookies({ accessToken, refreshToken, user });
    set({
      user,
      token: accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  setUser: (user) => {
    if (typeof window !== "undefined" && user) {
      localStorage.setItem("admin_user", JSON.stringify(user));
    }
    set({ user });
  },

  logout: () => {
    clearAuthCookies();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
}));

export default useAuthState;
