const adminPaymentsEndpoint = "/api/v1/admin/payments";
const paymentMethodsEndpoint = "/api/v1/admin/payment-methods";

const paymentApi = {
  // Verification Queue
  cacheKey: "adminPayments",
  list: {
    endpoint: adminPaymentsEndpoint,
    path: "",
    method: "get",
  },
  verify: (paymentId) => ({
    endpoint: adminPaymentsEndpoint,
    path: `/${paymentId}/verify`,
    method: "post",
  }),
  reject: (paymentId) => ({
    endpoint: adminPaymentsEndpoint,
    path: `/${paymentId}/reject`,
    method: "post",
  }),

  // SMS Logs
  smsLogsCacheKey: "adminSmsLogs",
  listSmsLogs: {
    endpoint: adminPaymentsEndpoint,
    path: "/sms-logs",
    method: "get",
  },

  // Payment Methods
  methodsCacheKey: "adminPaymentMethods",
  listMethods: {
    endpoint: paymentMethodsEndpoint,
    path: "",
    method: "get",
  },
  createMethod: {
    endpoint: paymentMethodsEndpoint,
    path: "",
    method: "post",
  },
  updateMethod: (id) => ({
    endpoint: paymentMethodsEndpoint,
    path: `/${id}`,
    method: "put",
  }),
  deleteMethod: (id) => ({
    endpoint: paymentMethodsEndpoint,
    path: `/${id}`,
    method: "delete",
  }),
};

export default paymentApi;
