import { clearAuthCookies } from "./cookies";
import { instanceApi } from "./axiosInstance";

export default async function logout() {
  try {
    await instanceApi.post("/api/v1/auth/logout", {});
  } catch (error) {
    console.error("Logout request error:", error);
  } finally {
    clearAuthCookies();
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
}


