const endpoint = "/api/v1/admin/categories";

const categoryApi = {
  cacheKey: "adminCategories",
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
  reorder: (id) => ({
    endpoint,
    path: `/${id}/reorder`,
    method: "patch",
  }),
};

export default categoryApi;
