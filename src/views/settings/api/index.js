const settingsApi = {
  cacheKey: "siteSettings",

  get: {
    endpoint: "/api/v1/settings",
    path: "",
    method: "get",
  },
  update: {
    endpoint: "/api/v1/admin/settings",
    path: "",
    method: "put",
  },
};

export default settingsApi;
