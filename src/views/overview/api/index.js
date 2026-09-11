const endpoint = "/api/admin/dashboard";

const overviewApi = {
  cacheKey: "dashboardStatistics",
  statistics: { endpoint, path: "/statistics", method: "get" },
};

export default overviewApi;
