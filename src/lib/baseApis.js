const endpoint = `/api/base`;

const baseApis = {
  document_types: {
    endpoint,
    path: "/document-types",
    cacheKey: "base_document_types",
    method: "get",
  },
  document_categories: {
    endpoint,
    path: "/document-categories",
    cacheKey: "base_document_categories",
    method: "get",
  },
};
export default baseApis;
