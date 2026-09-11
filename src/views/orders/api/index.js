const adminOrdersEndpoint = "/api/v1/admin/orders";
const publicOrdersEndpoint = "/api/v1/orders";

const orderApi = {
  cacheKey: "adminOrders",

  list: {
    endpoint: adminOrdersEndpoint,
    path: "",
    method: "get",
  },
  show: (orderNumber) => ({
    endpoint: publicOrdersEndpoint,
    path: `/${orderNumber}`,
    method: "get",
  }),
  updateStatus: (id) => ({
    endpoint: adminOrdersEndpoint,
    path: `/${id}/status`,
    method: "patch",
  }),
  updateNote: (id) => ({
    endpoint: adminOrdersEndpoint,
    path: `/${id}/note`,
    method: "patch",
  }),
};

export default orderApi;
