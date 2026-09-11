import { clearAuthCookies } from "./cookies";

export default async function logout() {
  try {
    await fetch("/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout request error:", error);
  } finally {
    clearAuthCookies();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}


