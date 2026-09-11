const endpoint = "/api/admin/profile";

const profileApi = {
  cacheKey: "userProfile",
  show: {
    endpoint,
    path: "/show",
    method: "get",
  },
  update: {
    endpoint,
    path: "/update",
    method: "put",
  },
  changePassword: {
    endpoint,
    path: "/change-password",
    method: "post",
  },
};

export default profileApi;
