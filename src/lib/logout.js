import axiosInstance from "./axiosInstance";
import { removeCookie } from "./cookies";
import { removeStoredValue } from "./storage";

export default async function logout() {
  try {
    await axiosInstance({
      api: {
        method: "get",
        endpoint: "/api/user/auth",
        path: "/logout",
      },
    });
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    removeCookie("signedIn");
    removeStoredValue("deskSession");
    window.location.href = "/login";
  }
}
