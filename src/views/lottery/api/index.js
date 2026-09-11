const adminLotteryEndpoint = "/api/v1/admin/lotteries";

const lotteryApi = {
  cacheKey: "adminLotteries",

  list: {
    endpoint: adminLotteryEndpoint,
    path: "",
    method: "get",
  },
  create: {
    endpoint: adminLotteryEndpoint,
    path: "",
    method: "post",
  },
  addPrize: (lotteryId) => ({
    endpoint: adminLotteryEndpoint,
    path: `/${lotteryId}/prizes`,
    method: "post",
  }),
  listEntries: (lotteryId) => ({
    endpoint: adminLotteryEndpoint,
    path: `/${lotteryId}/entries`,
    method: "get",
  }),
};

export default lotteryApi;
