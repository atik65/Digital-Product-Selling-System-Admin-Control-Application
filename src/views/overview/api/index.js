const endpoint = "/api/v1/admin/dashboard";

const overviewApi = {
  cacheKey: "adminDashboardSummary",
  activityCacheKey: "adminDashboardRecentActivity",

  summary: {
    endpoint,
    path: "/summary",
    method: "get",
  },
  recentActivity: {
    endpoint,
    path: "/recent-activity",
    method: "get",
  },
};

export default overviewApi;
