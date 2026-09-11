const topupsEndpoint = "/api/v1/admin/topups";
const walletsEndpoint = "/api/v1/admin/wallets";

const walletApi = {
  cacheKey: "adminTopups",

  listTopups: {
    endpoint: topupsEndpoint,
    path: "",
    method: "get",
  },
  approveTopup: (id) => ({
    endpoint: topupsEndpoint,
    path: `/${id}/approve`,
    method: "post",
  }),
  rejectTopup: (id) => ({
    endpoint: topupsEndpoint,
    path: `/${id}/reject`,
    method: "post",
  }),
  adjustBalance: (userId) => ({
    endpoint: walletsEndpoint,
    path: `/${userId}/adjust`,
    method: "post",
  }),
};

export default walletApi;
