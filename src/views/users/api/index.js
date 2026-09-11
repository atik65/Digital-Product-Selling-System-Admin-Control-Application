const adminUsersEndpoint = "/api/v1/admin/users";

const userApi = {
  cacheKey: "adminUsers",

  list: {
    endpoint: adminUsersEndpoint,
    path: "",
    method: "get",
  },
  show: (id) => ({
    endpoint: adminUsersEndpoint,
    path: `/${id}`,
    method: "get",
  }),
  toggleStatus: (id) => ({
    endpoint: adminUsersEndpoint,
    path: `/${id}/status`,
    method: "patch",
  }),
};

export default userApi;
