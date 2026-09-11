const endpoint = "/api/admin/application";

const appointmentApi = {
  cacheKey: "appointments",
  list: {
    endpoint,
    path: "/list",
    method: "get",
  },
  create: {
    endpoint,
    path: "/create",
    method: "post",
  },
  update: (id) => ({
    endpoint,
    path: `/update/${id}`,
    method: "put",
  }),
  delete: (id) => ({
    endpoint,
    path: `/delete/${id}`,
    method: "delete",
  }),
  show: (id) => ({
    endpoint,
    path: `/show/${id}`,
    method: "get",
  }),
  reviewDocument: (document_id) => ({
    endpoint,
    path: `/review/${document_id}`,
    method: "post",
  }),
  documentStatusChange: (document_id) => ({
    endpoint,
    path: `/document-status-change/${document_id}`,
    method: "post",
  }),

  applicationStatusChange: (application_id) => ({
    endpoint,
    path: `/application-status-change/${application_id}`,
    method: "post",
  }),

  sendMail: (application_id) => ({
    endpoint,
    path: `/send-mail/${application_id}`,
    method: "post",
  }),
};

export default appointmentApi;
