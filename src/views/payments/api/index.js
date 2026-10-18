const adminPaymentsEndpoint = "/api/v1/admin/payments";
const paymentMethodsEndpoint = "/api/v1/admin/payment-methods";
const paymentTransactionsEndpoint = "/api/v1/admin/payment-transactions";

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

  // Successful Transaction History
  transactionsCacheKey: "adminPaymentTransactions",
  listTransactions: {
    endpoint: paymentTransactionsEndpoint,
    path: "",
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
