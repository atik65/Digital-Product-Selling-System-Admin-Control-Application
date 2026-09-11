const endpoint = "/api/v1/auth";

export const authApi = {
  // Admin Login: POST /api/v1/auth/admin/login
  adminLogin: {
    endpoint,
    path: "/admin/login",
    method: "post",
  },
  // Alias for convenience
  login: {
    endpoint,
    path: "/admin/login",
    method: "post",
  },
  // Token Refresh: POST /api/v1/auth/refresh
  refresh: {
    endpoint,
    path: "/refresh",
    method: "post",
  },
  // Current Profile: GET /api/v1/auth/me
  me: {
    endpoint,
    path: "/me",
    method: "get",
  },
  // Update Profile: PATCH /api/v1/auth/me
  updateProfile: {
    endpoint,
    path: "/me",
    method: "patch",
  },
  // Google OAuth (Customer / Reference): POST /api/v1/auth/google
  google: {
    endpoint,
    path: "/google",
    method: "post",
  },
};

export default authApi;

