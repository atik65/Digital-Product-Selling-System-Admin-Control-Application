const endpoint = "/api/v1/admin/coupons";

const couponApi = {
  cacheKey: "adminCoupons",

  list: {
    endpoint,
    path: "",
    method: "get",
  },
  create: {
    endpoint,
    path: "",
    method: "post",
  },
  update: (id) => ({
    endpoint,
    path: `/${id}`,
    method: "put",
  }),
  delete: (id) => ({
    endpoint,
    path: `/${id}`,
    method: "delete",
  }),
};

export default couponApi;
