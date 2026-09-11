const productsEndpoint = "/api/v1/admin/products";
const fieldsEndpoint = "/api/v1/admin/fields";
const packagesEndpoint = "/api/v1/admin/packages";

const productApi = {
  cacheKey: "adminProducts",

  // Products
  list: {
    endpoint: productsEndpoint,
    path: "",
    method: "get",
  },
  create: {
    endpoint: productsEndpoint,
    path: "",
    method: "post",
  },
  update: (id) => ({
    endpoint: productsEndpoint,
    path: `/${id}`,
    method: "put",
  }),
  delete: (id) => ({
    endpoint: productsEndpoint,
    path: `/${id}`,
    method: "delete",
  }),
  toggleStatus: (id) => ({
    endpoint: productsEndpoint,
    path: `/${id}/status`,
    method: "patch",
  }),

  // Dynamic Fields
  listFields: (productId) => ({
    endpoint: productsEndpoint,
    path: `/${productId}/fields`,
    method: "get",
  }),
  createField: (productId) => ({
    endpoint: productsEndpoint,
    path: `/${productId}/fields`,
    method: "post",
  }),
  updateField: (fieldId) => ({
    endpoint: fieldsEndpoint,
    path: `/${fieldId}`,
    method: "put",
  }),
  deleteField: (fieldId) => ({
    endpoint: fieldsEndpoint,
    path: `/${fieldId}`,
    method: "delete",
  }),

  // Packages
  listPackages: (productId) => ({
    endpoint: "/api/v1/products",
    path: `/${productId}/packages`,
    method: "get",
  }),
  createPackage: (productId) => ({
    endpoint: productsEndpoint,
    path: `/${productId}/packages`,
    method: "post",
  }),
  updatePackage: (packageId) => ({
    endpoint: packagesEndpoint,
    path: `/${packageId}`,
    method: "put",
  }),
  togglePackageStatus: (packageId) => ({
    endpoint: packagesEndpoint,
    path: `/${packageId}/status`,
    method: "patch",
  }),
  deletePackage: (packageId) => ({
    endpoint: packagesEndpoint,
    path: `/${packageId}`,
    method: "delete",
  }),
};

export default productApi;
